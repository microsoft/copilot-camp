using Microsoft.Agents.Builder;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using System.Text.Json;
using InsuranceAgent;
using Microsoft.Agents.Builder.State;
using InsuranceAgent.Services;
using Azure.Search.Documents.Models;
using OpenAI.Chat;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Claims Policies Plugin for Zava Insurance
    /// Provides tools for analyzing claim compliance using Copilot Retrieval API
    /// Retrieves policy documents from SharePoint and uses AI for compliance analysis
    /// </summary>
    public class ClaimsPoliciesPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly ITurnState _turnState;
        private readonly HttpClient _httpClient;
        private readonly KnowledgeBaseService _knowledgeBaseService;
        private readonly LanguageModelService _languageModelService;
        private readonly IConfiguration _configuration;

        public ClaimsPoliciesPlugin(ITurnContext turnContext, 
            ITurnState turnState,
            KnowledgeBaseService knowledgeBaseService,
            LanguageModelService languageModelService,
            IConfiguration configuration, 
            HttpClient httpClient)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _turnState = turnState ?? throw new ArgumentNullException(nameof(turnState));
            _knowledgeBaseService = knowledgeBaseService ?? throw new ArgumentNullException(nameof(knowledgeBaseService));
            _languageModelService = languageModelService ?? throw new ArgumentNullException(nameof(languageModelService));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        }

        /// <summary>
        /// Retrieves claims policies from SharePoint Online using Copilot Retrieval APIs and analyzes claim compliance
        /// </summary>
        /// <param name="claimId">The unique claim identifier</param>
        /// <returns>The claim compliance with policies</returns>
        [Description("Retrieves claims policies from SharePoint Online using Copilot Retrieval APIs and analyzes claim compliance")]
        public async Task<string> AnalyzeClaimCompliance(string claimId)
        {
            await NotifyUserAsync($"Retrieving policies for claim {claimId}...");

            // Read the user profile and OBO token from conversation state
            var userProfile = _turnState.Conversation.GetCachedUserProfile();
            var accessToken = _turnState.Conversation.GetCachedOBOAccessToken();

            // Use direct search to get structured data (more reliable than Knowledge Base answer synthesis)
            var claimDoc = await _knowledgeBaseService.GetClaimByNumberAsync(claimId);

            if (claimDoc == null)
            {
                return $"❌ Claim {claimId} not found in the system.";
            }

            try
            {
                // Build the Copilot Retrieval API request payload
                var retrievalPayload = new
                {
                    queryString = $"Retrieve the claims policies for claims of type '{GetFieldValue(claimDoc, "claimType")}' in region '{GetFieldValue(claimDoc, "region")}'",
                    dataSource = "SharePoint",
                    resourceMetadata = new[] { "title", "author" }
                };

                var jsonContent = JsonSerializer.Serialize(retrievalPayload);
                var httpContent = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");

                // Configure HTTP client with OBO token
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
                _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

                await NotifyUserAsync($"Using Copilot Retrieval APIs to fetch policies from SharePoint...");

                // Call the Microsoft 365 Copilot Retrieval API
                var response = await _httpClient.PostAsync("https://graph.microsoft.com/v1.0/copilot/retrieval", httpContent);

                if (response.IsSuccessStatusCode)
                {
                    await NotifyUserAsync($"✅ Policies successfully retrieved from SharePoint!");
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    await NotifyUserAsync($"❌ Failed to retrieve policies: {response.StatusCode}");
                    return $"❌ Error retrieving policies from SharePoint: {response.StatusCode} - {errorContent}";
                }

                var policiesContent = await response.Content.ReadAsStringAsync();
                var estimatedCost = GetFieldValue(claimDoc, "estimatedCost");
                var isComplete = GetFieldValue(claimDoc, "isDocumentationComplete");
                var missingDocs = GetFieldValue(claimDoc, "missingDocumentation");

                // Build AI prompt for compliance analysis
                var prompt = $@"You are an insurance claims expert and you need to analyze the claim policies for a specific claim.

                    **CLAIM DETAILS:**
                    - Claim Number: {GetFieldValue(claimDoc, "claimNumber")}
                    - Claim Type: {GetFieldValue(claimDoc, "claimType")}
                    - Region: {GetFieldValue(claimDoc, "region")}
                    - Amount: ${estimatedCost:N2}
                    - Status: {GetFieldValue(claimDoc, "status")}
                    - Severity: {GetFieldValue(claimDoc, "severity")}
                    - Description: {GetFieldValue(claimDoc, "description")}
                    - Policy Number: {GetFieldValue(claimDoc, "policyNumber")}
                    - Policyholder: {GetFieldValue(claimDoc, "policyholderName")}
                    - Assigned Adjuster: {GetFieldValue(claimDoc, "assignedAdjuster")}
                    - Documentation Complete: {(isComplete == "True" || isComplete == "true" ? "Yes" : "No")}
                    - Missing Documentation: {(string.IsNullOrWhiteSpace(missingDocs) ? "None" : missingDocs)}

                    Here are the claim policies retrieved from SharePoint in JSON format:
                    {policiesContent}

                    Provide analysis in this JSON format:
                    {{
                    ""complianceScore"": <0-100>,
                    ""complianceLevel"": ""<Low/Medium/High/Critical>"",
                    ""analysis"": ""<detailed explanation of claim compliance with policies>"",
                    ""keyIndicators"": [""<list of specific compliance indicators with references citations to policies using the [1], [2], ... [n] format>""],
                    ""recommendations"": [""<recommended actions>""],
                    ""citationsTitles"": [""<list of titles corresponding to the citations>""],
                    ""citationsLinks"": [""<list of URLs corresponding to the citations>""]
                    }}

                    ";

                await NotifyUserAsync($"🤖 Running AI compliance analysis...");

                Console.WriteLine($"🔍 ClaimsPoliciesPlugin.AnalyzeClaimCompliance calling LanguageModelService with Temperature=0.2");

                // Use AI to analyze compliance
                var messages = new List<ChatMessage>
                {
                    new UserChatMessage(prompt)
                };

                var chatOptions = new ChatCompletionOptions
                {
                    Temperature = 0.2f,
                    ResponseFormat = ChatResponseFormat.CreateJsonObjectFormat()
                };

                var chatResponse = await _languageModelService.CompleteChatAsync(messages, chatOptions);
                var analysisJson = chatResponse.Content[0].Text ?? "{}";

                var complianceResult = JsonSerializer.Deserialize<ComplianceAnalysisResult>(analysisJson, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (complianceResult == null)
                {
                    return $"❌ Error: Unable to parse compliance analysis for claim {claimId}.";
                }

                await NotifyUserAsync($"✅ Compliance analysis complete. Compliance Score: {complianceResult.ComplianceScore}/100");

                // Add citations to streaming response
                for (int i = 0; i < complianceResult.CitationsTitles.Count; i++)
                {
                    var citationTitle = complianceResult.CitationsTitles.Count > i ? complianceResult.CitationsTitles[i] : $"Policy Document {i + 1}";
                    var citationLink = complianceResult.CitationsLinks.Count > i ? complianceResult.CitationsLinks[i] : null;
                    citationLink = citationLink != null ? GetCitationUrl(citationLink) : citationLink;

                    _turnContext.StreamingResponse.AddCitation(
                        new ClientCitation(
                            position: i + 1,
                            title: citationTitle,
                            abstractText: "Claims Policy",
                            text: "Claims Policy",
                            keywords: null,
                            citationLink: citationLink,
                            imageName: ClientCitationsIconNameEnum.MicrosoftWord,
                            useDefaultAdaptiveCard: true));

                    Console.WriteLine($"🔗 Added citation for \"{citationTitle}\" with link {citationLink ?? "[no link]"}");
                }

                // Format the response
                return $"🚨 **Compliance Analysis for {claimId}**\n\n" +
                       $"**Compliance Score:** {complianceResult.ComplianceScore}/100\n" +
                       $"**Compliance Level:** {complianceResult.ComplianceLevel}\n\n" +
                       $"**Analysis:**\n{complianceResult.Analysis}\n\n" +
                       (complianceResult.KeyIndicators != null && complianceResult.KeyIndicators.Count > 0
                           ? $"**Key Compliance Indicators:**\n{string.Join("\n", complianceResult.KeyIndicators.Select(i => $"• {i}"))}\n\n"
                           : "") +
                       (complianceResult.Recommendations != null && complianceResult.Recommendations.Count > 0
                           ? $"**Recommendations:**\n{string.Join("\n", complianceResult.Recommendations.Select(r => $"• {r}"))}\n\n"
                           : "");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error analyzing claim compliance: {ex.Message}");
                return $"❌ Error analyzing claim compliance: {ex.Message}";
            }
        }

        /// <summary>
        /// Helper method to safely extract field values from SearchDocument
        /// </summary>
        private string GetFieldValue(SearchDocument doc, string fieldName)
        {
            if (doc.ContainsKey(fieldName) && doc[fieldName] != null)
            {
                return doc[fieldName].ToString() ?? "Not available";
            }
            return "Not available";
        }

        // Helper method to construct citation URL through the bot's proxy endpoint
        private string GetCitationUrl(string targetUrl)
        {
            var botEndpoint = _configuration["BOT_ENDPOINT"];

            Console.WriteLine($"🔍 BOT_ENDPOINT from config: {botEndpoint ?? "NULL"}");

            if (string.IsNullOrEmpty(botEndpoint))
            {
                var botDomain = _configuration["BOT_DOMAIN"];
                if (!string.IsNullOrEmpty(botDomain))
                {
                    botEndpoint = $"https://{botDomain}";
                    Console.WriteLine($"🔍 Using BOT_DOMAIN: {botEndpoint}");
                }
                else
                {
                    botEndpoint = "http://localhost:3978";
                    Console.WriteLine($"⚠️ Falling back to localhost");
                }
            }

            botEndpoint = botEndpoint.TrimEnd('/');
            var citationUrl = $"{botEndpoint}/api/citation?targetUrl={Uri.EscapeDataString(targetUrl)}";
            Console.WriteLine($"⚙️ Generated citation URL: {citationUrl}");

            return citationUrl;
        }

        // Helper method to notify user via streaming
        private async Task NotifyUserAsync(string message)
        {
            if (!_turnContext.Activity.ChannelId.Channel!.Contains(Channels.Webchat))
            {
                await _turnContext.StreamingResponse.QueueInformativeUpdateAsync(message);
            }
            else
            {
                await _turnContext.StreamingResponse.QueueInformativeUpdateAsync(message).ConfigureAwait(false);
            }
        }
    }

    /// <summary>
    /// Result of AI-powered compliance analysis
    /// </summary>
    public class ComplianceAnalysisResult
    {
        public int ComplianceScore { get; set; }
        public string ComplianceLevel { get; set; } = "";
        public string Analysis { get; set; } = "";
        public List<string> KeyIndicators { get; set; } = new();
        public List<string> Recommendations { get; set; } = new();
        public List<string> CitationsTitles { get; set; } = new();
        public List<string> CitationsLinks { get; set; } = new();
    }
}