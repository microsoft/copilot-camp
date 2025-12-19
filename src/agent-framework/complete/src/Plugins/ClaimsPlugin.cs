using Microsoft.Agents.Builder;
using Microsoft.Agents.Core;
using Microsoft.Agents.Core.Models;
using Microsoft.Extensions.Configuration;
using System.ComponentModel;
using System.Text;
using System.Text.Json;
using Azure.Search.Documents.Models;
using InsuranceAgent.Services.Models;
using InsuranceAgent.Services;
using InsuranceAgent;
using AdaptiveCards;
using System.Text.RegularExpressions;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Claims Plugin for Zava Insurance
    /// Provides tools for searching, analyzing, and managing insurance claims
    /// Uses Azure AI Search Knowledge Base for agentic retrieval
    /// </summary>
    public class ClaimsPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly KnowledgeBaseService _knowledgeBaseService;
        private readonly IConfiguration _configuration;

        public ClaimsPlugin(ITurnContext turnContext, KnowledgeBaseService knowledgeBaseService, IConfiguration configuration)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _knowledgeBaseService = knowledgeBaseService ?? throw new ArgumentNullException(nameof(knowledgeBaseService));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Searches for insurance claims based on criteria
        /// </summary>
        /// <param name="region">Geographic region (e.g., Northeast, Southeast, Midwest, West)</param>
        /// <param name="claimType">Type of claim (e.g., Homeowners, Auto, Commercial)</param>
        /// <param name="severity">Severity level (Low, Medium, High, Critical)</param>
        /// <param name="status">Claim status (Open, In Review, Pending Documents, Closed)</param>
        /// <returns>List of claims matching the criteria</returns>
        [Description("Searches for insurance claims based on region, type, severity, and status. Returns a summary of matching claims.")]
        public async Task<string> SearchClaims(
            string region = null,
            string claimType = null,
            string severity = null,
            string status = null)
        {
            await NotifyUserAsync($"Searching claims database using AI Search...");

            // Build natural language query for agentic retrieval
            var queryParts = new List<string> { "insurance claims" };

            if (!string.IsNullOrEmpty(region))
                queryParts.Add($"in {region} region");
            if (!string.IsNullOrEmpty(claimType))
                queryParts.Add($"of type {claimType}");
            if (!string.IsNullOrEmpty(severity))
                queryParts.Add($"with {severity} severity");
            if (!string.IsNullOrEmpty(status))
                queryParts.Add($"with status {status}");

            var query = string.Join(" ", queryParts);

            // Use agentic retrieval with instructions for structured output
            var instructions = @"You are an insurance claims specialist. Provide a clear, structured summary of matching claims.
                Format your response as follows:
                - Total number of claims found
                - For each claim, include: Claim Number, Policyholder, Claim Type, Amount, Status, Date Filed, Severity
                - Use bullet points for readability
                - Include relevant details like adjuster notes or special circumstances
                - Cite sources using [ref_id:X] format";

            var response = await _knowledgeBaseService.RetrieveAsync(query, instructions, topResults: 10);

            await NotifyUserAsync($"Retrieved {queryParts.Count} matching claims");

            return response;
        }

        /// <summary>
        /// Retrieves detailed information for a specific claim
        /// </summary>
        /// <param name="claimId">The unique claim identifier</param>
        /// <returns>Detailed claim information</returns>
        [Description("Retrieves detailed information for a specific claim by claim ID, including policyholder info, documentation, and history.")]
        public async Task<string> GetClaimDetails(string claimId)
        {
            await NotifyUserAsync($"Retrieving details for claim {claimId}...");

            // Use direct search to get structured data (more reliable than Knowledge Base answer synthesis)
            var claimDoc = await _knowledgeBaseService.GetClaimByNumberAsync(claimId);

            if (claimDoc == null)
            {
                return $"❌ Claim {claimId} not found in the system.";
            }

            // Extract fields from the search document
            var result = new StringBuilder();
            result.AppendLine("**Claim Information:**");
            result.AppendLine($"- Claim Number: {GetFieldValue(claimDoc, "claimNumber")}");
            result.AppendLine($"- Status: {GetFieldValue(claimDoc, "status")}");
            result.AppendLine($"- Claim Type: {GetFieldValue(claimDoc, "claimType")}");
            result.AppendLine();

            result.AppendLine("**Policyholder & Policy:**");
            result.AppendLine($"- Policyholder Name: {GetFieldValue(claimDoc, "policyholderName")}");
            result.AppendLine($"- Policy Number: {GetFieldValue(claimDoc, "policyNumber")}");
            result.AppendLine();

            result.AppendLine("**Financial Details:**");
            var estimatedCost = GetFieldValue(claimDoc, "estimatedCost");
            result.AppendLine($"- Estimated Cost: ${estimatedCost}");
            result.AppendLine($"- Severity: {GetFieldValue(claimDoc, "severity")}");
            result.AppendLine();

            result.AppendLine("**Assignment & Location:**");
            result.AppendLine($"- Assigned Adjuster: {GetFieldValue(claimDoc, "assignedAdjuster")}");
            result.AppendLine($"- Region: {GetFieldValue(claimDoc, "region")}");
            result.AppendLine($"- Location: {GetFieldValue(claimDoc, "location")}");
            result.AppendLine();

            result.AppendLine("**Incident Details:**");
            result.AppendLine($"- Description: {GetFieldValue(claimDoc, "description")}");
            result.AppendLine();

            result.AppendLine("**Fraud Assessment:**");
            var fraudScore = GetFieldValue(claimDoc, "fraudRiskScore");
            result.AppendLine($"- Fraud Risk Score: {fraudScore}/100");
            var fraudIndicators = GetFieldValue(claimDoc, "fraudIndicators");
            result.AppendLine($"- Fraud Indicators: {(string.IsNullOrWhiteSpace(fraudIndicators) ? "None identified" : fraudIndicators)}");
            result.AppendLine();

            result.AppendLine("**Documentation Status:**");
            var isComplete = GetFieldValue(claimDoc, "isDocumentationComplete");
            result.AppendLine($"- Documentation Complete: {(isComplete == "True" || isComplete == "true" ? "Yes" : "No")}");
            var missingDocs = GetFieldValue(claimDoc, "missingDocumentation");
            result.AppendLine($"- Missing Documentation: {(string.IsNullOrWhiteSpace(missingDocs) ? "None" : missingDocs)}");

            // Get damage photo URL if available
            var imageUrl = await _knowledgeBaseService.GetClaimImageUrlAsync(claimId);

            if (!string.IsNullOrEmpty(imageUrl))
            {
                // Get bot endpoint for devtunnel proxy
                var botEndpoint = _configuration["BOT_ENDPOINT"];
                if (string.IsNullOrEmpty(botEndpoint))
                {
                    var botDomain = _configuration["BOT_DOMAIN"];
                    botEndpoint = !string.IsNullOrEmpty(botDomain) ? $"https://{botDomain}" : "http://localhost:3978";
                }
                botEndpoint = botEndpoint.TrimEnd('/');

                // Proxy the blob storage URL through devtunnel
                var proxyUrl = $"{botEndpoint}/api/image?url={Uri.EscapeDataString(imageUrl)}";

                result.AppendLine();
                result.AppendLine("**Damage Photo:**");
                result.AppendLine($"![Damage Photo]({proxyUrl})");
            }

            await NotifyUserAsync($"Retrieved details for claim {claimId}");

            return result.ToString();
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



        /// <summary>
        /// Identifies claims with missing or incomplete documentation
        /// </summary>
        /// <param name="region">Optional: Filter by region</param>
        /// <returns>List of claims with missing documentation</returns>
        [Description("Identifies claims that are missing required documentation such as inspection notes, photos, or invoices.")]
        public async Task<string> IdentifyMissingDocumentation(string region = null)
        {
            await NotifyUserAsync("Analyzing claims for missing documentation...");

            // Build query for claims with missing documentation
            var query = "claims with incomplete or missing documentation";
            if (!string.IsNullOrEmpty(region))
                query += $" in {region} region";

            var instructions = @"You are an insurance operations specialist. Identify claims with missing or incomplete documentation.
                For each claim, specify:
                - Claim Number and Policyholder
                - What documentation is missing (inspection notes, photos, invoices, etc.)
                - Impact on claim processing
                - Priority level for follow-up
                Present in a clear, actionable format with bullet points. Cite sources with [ref_id:X].";

            var response = await _knowledgeBaseService.RetrieveAsync(query, instructions, topResults: 10);

            await NotifyUserAsync($"Claims with missing documentation identified");

            return response;
        }



        /// <summary>
        /// Analyzes a specific claim for fraud risk using AI
        /// </summary>
        /// <param name="claimNumber">The claim number to analyze</param>
        /// <returns>AI-powered fraud risk assessment</returns>
        [Description("Analyzes a specific claim for fraud risk using AI. Examines claim details, patterns, amounts, timing, and provides a comprehensive fraud risk assessment.")]
        public async Task<string> AnalyzeClaimFraudRisk(string claimNumber)
        {
            await NotifyUserAsync($"🔍 Analyzing fraud risk for claim {claimNumber} using AI...");

            try
            {
                // Use Knowledge Base with assistant instructions for fraud analysis
                var instructions = @"You are a fraud detection expert for insurance claims. 

CRITICAL: Respond ONLY with valid JSON matching this EXACT structure (no markdown, no code blocks, no explanations):

{
  ""fraudRiskScore"": <number between 0-100>,
  ""riskLevel"": ""<Low or Medium or High or Critical>"",
  ""analysis"": ""<single string with detailed explanation of fraud indicators found>"",
  ""keyIndicators"": [""<indicator1>"", ""<indicator2>"", ""<indicator3>""],
  ""recommendations"": [""<action1>"", ""<action2>""],
  ""comparisonToNormal"": ""<single string describing how this claim compares to typical claims>""
}

IMPORTANT: 
- fraudRiskScore must be a number (not string)
- analysis must be a STRING (not an object)
- keyIndicators and recommendations must be arrays of strings
- comparisonToNormal must be a STRING (not an object)
- Do NOT nest data under an 'analysis' object

Consider:
1. Claim amount vs typical for this type/region
2. Timing patterns
3. Completeness and quality of documentation
4. Any unusual patterns or red flags

Return ONLY the JSON object, nothing else.";

                await NotifyUserAsync($"🤖 Running AI fraud analysis...");

                // Get claim data directly from the index
                var claimDoc = await _knowledgeBaseService.GetClaimByNumberAsync(claimNumber);
                if (claimDoc == null)
                {
                    return $"❌ Claim {claimNumber} not found.";
                }

                // Build structured claim data for analysis
                var claimData = $@"
Claim Number: {GetFieldValue(claimDoc, "claimNumber")}
Claim Type: {GetFieldValue(claimDoc, "claimType")}
Status: {GetFieldValue(claimDoc, "status")}
Estimated Cost: ${GetFieldValue(claimDoc, "estimatedCost")}
Severity: {GetFieldValue(claimDoc, "severity")}
Description: {GetFieldValue(claimDoc, "description")}
Location: {GetFieldValue(claimDoc, "location")}
Region: {GetFieldValue(claimDoc, "region")}
Policyholder: {GetFieldValue(claimDoc, "policyholderName")}
Existing Fraud Score: {GetFieldValue(claimDoc, "fraudRiskScore")}
Existing Fraud Indicators: {GetFieldValue(claimDoc, "fraudIndicators")}
";

                // Use Azure OpenAI directly (bypassing Knowledge Base answer synthesis) for reliable JSON
                var userPrompt = $"Analyze this insurance claim for fraud risk:\n{claimData}\n\nProvide ONLY a JSON response using the exact structure specified.";
                var aiResponse = await _knowledgeBaseService.GetDirectChatCompletionAsync(instructions, userPrompt);

                Console.WriteLine($"Fraud Analysis Direct AI Response: {aiResponse}");

                // Extract JSON from response (clean up any markdown or extra text)
                var analysisJson = ExtractJsonFromResponse(aiResponse);
                Console.WriteLine($"Extracted JSON: {analysisJson}");

                FraudRiskAnalysisResult fraudResult;
                try
                {
                    fraudResult = JsonSerializer.Deserialize<FraudRiskAnalysisResult>(analysisJson, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (fraudResult == null)
                    {
                        throw new JsonException("Deserialization returned null");
                    }
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"JSON parsing error: {ex.Message}");
                    Console.WriteLine($"Failed JSON: {analysisJson}");

                    // Fallback: Create basic analysis from existing fraud score
                    var existingScore = GetFieldValue(claimDoc, "fraudRiskScore");
                    var existingIndicators = GetFieldValue(claimDoc, "fraudIndicators");
                    var estimatedCost = GetFieldValue(claimDoc, "estimatedCost");
                    var severity = GetFieldValue(claimDoc, "severity");

                    fraudResult = new FraudRiskAnalysisResult
                    {
                        FraudRiskScore = int.TryParse(existingScore, out var score) ? score : 0,
                        RiskLevel = score > 70 ? "High" : score > 40 ? "Medium" : "Low",
                        Analysis = $"Analysis based on claim data: Estimated cost ${estimatedCost}, Severity: {severity}",
                        KeyIndicators = string.IsNullOrEmpty(existingIndicators) ? new List<string>() : new List<string> { existingIndicators },
                        Recommendations = new List<string> { "Review claim documentation", "Verify policyholder information" },
                        ComparisonToNormal = "Claim parameters within normal range for this claim type and region."
                    };
                }

                // TODO: Update claim with new fraud score (requires write operation - not supported by Knowledge Base)
                // For now, return analysis without persisting the fraud score

                await NotifyUserAsync($"✅ Fraud analysis complete. Risk Score: {fraudResult.FraudRiskScore}/100");

                // Format response with proper markdown list formatting
                var response = new System.Text.StringBuilder();
                response.AppendLine($"🚨 **Fraud Risk Analysis for {claimNumber}**");
                response.AppendLine();
                response.AppendLine($"**Risk Score:** {fraudResult.FraudRiskScore}/100");
                response.AppendLine($"**Risk Level:** {fraudResult.RiskLevel}");
                response.AppendLine();
                response.AppendLine($"**Analysis:**");
                response.AppendLine(fraudResult.Analysis);
                response.AppendLine();
                
                if (fraudResult.KeyIndicators != null && fraudResult.KeyIndicators.Count > 0)
                {
                    response.AppendLine("**Key Fraud Indicators:**");
                    foreach (var indicator in fraudResult.KeyIndicators)
                    {
                        response.AppendLine($"- {indicator}");
                    }
                    response.AppendLine();
                }
                
                if (fraudResult.Recommendations != null && fraudResult.Recommendations.Count > 0)
                {
                    response.AppendLine("**Recommendations:**");
                    foreach (var recommendation in fraudResult.Recommendations)
                    {
                        response.AppendLine($"- {recommendation}");
                    }
                    response.AppendLine();
                }
                
                response.AppendLine("**Comparison to Normal Claims:**");
                response.AppendLine(fraudResult.ComparisonToNormal);
                
                return response.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AnalyzeClaimFraudRisk: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return $"❌ Error analyzing fraud risk: {ex.Message}\n\nDetails: {ex.GetType().Name}";
            }
        }



        /// <summary>
        /// Lists all documents associated with a specific claim
        /// Simulates document retrieval from SharePoint/document management system
        /// </summary>
        /// <param name="claimId">The unique claim identifier</param>
        /// <returns>List of documents with metadata</returns>
        [Description("Lists all documents associated with a claim, including photos, invoices, inspection notes, and reports from SharePoint and other document repositories.")]
        public async Task<string> ListClaimDocuments(string claimId)
        {
            await NotifyUserAsync($"Retrieving documents for claim {claimId}...");

            // Use Knowledge Base with instructions for organized document listing
            var instructions = @"You are a document management specialist. List all documents associated with this claim in an organized format.
                For each document, include:
                - Document Type (photo, invoice, inspection note, report, etc.)
                - File Name
                - Upload Date
                - Document Status (if available)
                Group by document type. Use bullet points. Cite sources with [ref_id:X].";

            var query = $"all documents associated with claim {claimId}";
            var response = await _knowledgeBaseService.RetrieveAsync(query, instructions, topResults: 10);

            await NotifyUserAsync($"Documents retrieved for claim {claimId}");

            return response;
        }

        /// <summary>
        /// Retrieves the complete timeline and audit trail for a claim
        /// Shows all status changes, actions, and events for compliance and visibility
        /// </summary>
        /// <param name="claimId">The unique claim identifier</param>
        /// <returns>Complete audit trail and timeline</returns>
        [Description("Retrieves the complete timeline and audit trail for a claim, showing all status changes, actions taken, documents submitted, and communications for regulatory compliance and visibility.")]
        public async Task<string> GetClaimTimeline(string claimId)
        {
            await NotifyUserAsync($"Retrieving timeline for claim {claimId}...");

            // Use Knowledge Base with instructions for chronological timeline
            var instructions = @"You are an insurance auditor. Provide a complete chronological timeline of claim events.
                Include:
                - Date and Time of each event
                - Event Type (filed, document submitted, status change, communication, etc.)
                - Action taken and by whom
                - Status transitions
                - Key milestones
                Format in reverse chronological order (newest first). Use clear timestamps. Cite sources with [ref_id:X].";

            var query = $"complete timeline and audit trail for claim {claimId}";
            var response = await _knowledgeBaseService.RetrieveAsync(query, instructions, topResults: 10);

            await NotifyUserAsync($"Timeline retrieved for claim {claimId}");

            return response;
        }

        // Helper methods
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

        /// <summary>
        /// Extracts JSON object from KB response text (removes citations and markdown)
        /// </summary>
        private string ExtractJsonFromResponse(string response)
        {
            if (string.IsNullOrEmpty(response))
                return "{}";

            // Remove citations like [ref_id:0]
            response = Regex.Replace(response, @"\[ref_id:\d+\]", "");

            // Try to find JSON object in response
            var jsonMatch = Regex.Match(response, @"\{[\s\S]*\}");
            if (jsonMatch.Success)
            {
                return jsonMatch.Value.Trim();
            }

            return response.Trim();
        }

        private AdaptiveCard BuildClaimDetailsAdaptiveCard(ClaimEntity claim, int documentCount, int eventCount, int workOrderCount)
        {
            var daysOpen = (int)(DateTime.UtcNow - claim.DateFiled).TotalDays;

            // Determine status color
            var statusColor = claim.Status switch
            {
                "Closed" => AdaptiveTextColor.Good,
                "Open" => AdaptiveTextColor.Warning,
                "In Review" => AdaptiveTextColor.Accent,
                "Pending Documents" => AdaptiveTextColor.Attention,
                _ => AdaptiveTextColor.Default
            };

            // Determine severity color
            var severityColor = claim.Severity switch
            {
                "Critical" => AdaptiveTextColor.Attention,
                "High" => AdaptiveTextColor.Warning,
                "Medium" => AdaptiveTextColor.Accent,
                "Low" => AdaptiveTextColor.Good,
                _ => AdaptiveTextColor.Default
            };

            // Determine fraud risk color
            var fraudColor = claim.FraudRiskScore switch
            {
                >= 60 => AdaptiveTextColor.Attention,
                >= 40 => AdaptiveTextColor.Warning,
                _ => AdaptiveTextColor.Good
            };

            var card = new AdaptiveCard("1.5")
            {
                Body = new List<AdaptiveElement>
                {
                    // Header with claim number
                    new AdaptiveTextBlock
                    {
                        Text = $"📋 Claim: {claim.ClaimNumber}",
                        Size = AdaptiveTextSize.Large,
                        Weight = AdaptiveTextWeight.Bolder,
                        Color = AdaptiveTextColor.Accent
                    },

                    // Status and Severity badges in a row
                    new AdaptiveColumnSet
                    {
                        Columns = new List<AdaptiveColumn>
                        {
                            new AdaptiveColumn
                            {
                                Width = "auto",
                                Items = new List<AdaptiveElement>
                                {
                                    new AdaptiveTextBlock
                                    {
                                        Text = $"Status: **{claim.Status}**",
                                        Color = statusColor,
                                        Weight = AdaptiveTextWeight.Bolder
                                    }
                                }
                            },
                            new AdaptiveColumn
                            {
                                Width = "auto",
                                Items = new List<AdaptiveElement>
                                {
                                    new AdaptiveTextBlock
                                    {
                                        Text = $"Severity: **{claim.Severity}**",
                                        Color = severityColor,
                                        Weight = AdaptiveTextWeight.Bolder
                                    }
                                }
                            }
                        },
                        Spacing = AdaptiveSpacing.Small
                    },

                    // Two-column layout for main information
                    new AdaptiveColumnSet
                    {
                        Columns = new List<AdaptiveColumn>
                        {
                            // Left column
                            new AdaptiveColumn
                            {
                                Width = "50%",
                                Items = new List<AdaptiveElement>
                                {
                                    new AdaptiveTextBlock
                                    {
                                        Text = "**Policyholder**",
                                        Size = AdaptiveTextSize.Medium,
                                        Weight = AdaptiveTextWeight.Bolder,
                                        Spacing = AdaptiveSpacing.Medium
                                    },
                                    new AdaptiveFactSet
                                    {
                                        Facts = new List<AdaptiveFact>
                                        {
                                            new AdaptiveFact("Name", claim.PolicyholderName),
                                            new AdaptiveFact("Policy #", claim.PolicyNumber),
                                            new AdaptiveFact("Adjuster", claim.AssignedAdjuster ?? "Unassigned")
                                        }
                                    },
                                    new AdaptiveTextBlock
                                    {
                                        Text = "**Claim Details**",
                                        Size = AdaptiveTextSize.Medium,
                                        Weight = AdaptiveTextWeight.Bolder,
                                        Spacing = AdaptiveSpacing.Medium
                                    },
                                    new AdaptiveFactSet
                                    {
                                        Facts = new List<AdaptiveFact>
                                        {
                                            new AdaptiveFact("Type", claim.ClaimType),
                                            new AdaptiveFact("Region", claim.Region),
                                            new AdaptiveFact("Amount", $"${claim.EstimatedCost:N2}")
                                        }
                                    }
                                }
                            },
                            // Right column
                            new AdaptiveColumn
                            {
                                Width = "50%",
                                Items = new List<AdaptiveElement>
                                {
                                    new AdaptiveTextBlock
                                    {
                                        Text = "**Timeline**",
                                        Size = AdaptiveTextSize.Medium,
                                        Weight = AdaptiveTextWeight.Bolder,
                                        Spacing = AdaptiveSpacing.Medium
                                    },
                                    new AdaptiveFactSet
                                    {
                                        Facts = new List<AdaptiveFact>
                                        {
                                            new AdaptiveFact("Filed", claim.DateFiled.ToString("MMM dd, yyyy")),
                                            new AdaptiveFact("Days Open", daysOpen.ToString()),
                                            new AdaptiveFact("Resolved", claim.DateResolved?.ToString("MMM dd, yyyy") ?? "Pending")
                                        }
                                    },
                                    new AdaptiveTextBlock
                                    {
                                        Text = "**Risk & Docs**",
                                        Size = AdaptiveTextSize.Medium,
                                        Weight = AdaptiveTextWeight.Bolder,
                                        Spacing = AdaptiveSpacing.Medium
                                    },
                                    new AdaptiveFactSet
                                    {
                                        Facts = new List<AdaptiveFact>
                                        {
                                            new AdaptiveFact("Fraud Risk", $"{claim.FraudRiskScore}/100"),
                                            new AdaptiveFact("Documents", claim.IsDocumentationComplete ? $"✓ Complete ({documentCount})" : $"⚠ Incomplete ({documentCount})"),
                                            new AdaptiveFact("Events", eventCount.ToString())
                                        }
                                    }
                                }
                            }
                        },
                        Spacing = AdaptiveSpacing.Medium
                    },

                    // Description section (compact)
                    new AdaptiveTextBlock
                    {
                        Text = claim.Description,
                        Wrap = true,
                        MaxLines = 2,
                        Size = AdaptiveTextSize.Small,
                        Spacing = AdaptiveSpacing.Medium,
                        IsSubtle = true
                    }
                }
            };

            // Add fraud indicators if present
            if (!string.IsNullOrEmpty(claim.FraudIndicators) && claim.FraudRiskScore >= 40)
            {
                card.Body.Add(new AdaptiveTextBlock
                {
                    Text = $"⚠ **Fraud Indicators:** {claim.FraudIndicators}",
                    Wrap = true,
                    Color = fraudColor,
                    Spacing = AdaptiveSpacing.Small,
                    Size = AdaptiveTextSize.Small
                });
            }

            // Add missing documentation warning if incomplete
            if (!claim.IsDocumentationComplete && !string.IsNullOrEmpty(claim.MissingDocumentation))
            {
                card.Body.Add(new AdaptiveTextBlock
                {
                    Text = $"📎 **Missing:** {claim.MissingDocumentation}",
                    Wrap = true,
                    Color = AdaptiveTextColor.Attention,
                    Spacing = AdaptiveSpacing.Small,
                    Size = AdaptiveTextSize.Small
                });
            }

            return card;
        }

        private List<string> GenerateBottleneckRecommendations(List<ClaimEntity> agingClaims, int minDaysOpen)
        {
            var recommendations = new List<string>();
            var now = DateTime.UtcNow;

            if (agingClaims.Any(c => (now - c.DateFiled).TotalDays > 45))
            {
                recommendations.Add("URGENT: Multiple claims over 45 days old require immediate attention");
            }

            if (agingClaims.Any(c => c.Severity == "Critical" && (now - c.DateFiled).TotalDays > 30))
            {
                recommendations.Add("HIGH PRIORITY: Critical severity claims aging beyond acceptable timeframe");
            }

            var pendingDocsCount = agingClaims.Count(c => c.Status == "Pending Documents" || !c.IsDocumentationComplete);
            if (pendingDocsCount > 2)
            {
                recommendations.Add($"PROCESS IMPROVEMENT: {pendingDocsCount} claims stuck waiting for documents - consider automated follow-up emails");
            }

            if (agingClaims.Any(c => !c.IsDocumentationComplete && !string.IsNullOrEmpty(c.MissingDocumentation)))
            {
                recommendations.Add("DOCUMENTATION ISSUE: Some claims missing multiple required documents - review documentation requirements with policyholders");
            }

            if (!recommendations.Any())
            {
                recommendations.Add("All claims within acceptable processing timeframes");
            }

            return recommendations;
        }
    }

    /// <summary>
    /// Result of AI-powered fraud risk analysis
    /// </summary>
    public class FraudRiskAnalysisResult
    {
        public int FraudRiskScore { get; set; }
        public string RiskLevel { get; set; } = "";
        public string Analysis { get; set; } = "";
        public List<string> KeyIndicators { get; set; }
        public List<string> Recommendations { get; set; }
        public string ComparisonToNormal { get; set; } = "";
    }
}
