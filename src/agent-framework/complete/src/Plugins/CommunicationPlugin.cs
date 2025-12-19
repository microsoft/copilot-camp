using Microsoft.Agents.Builder;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using System.Text.Json;
using InsuranceAgent.Services;
using InsuranceAgent.Services.Models;
using InsuranceAgent;
using Microsoft.Agents.Builder.State;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Communication Plugin for Zava Insurance
    /// Provides tools for generating professional policyholder communications
    /// Ensures consistent, compliant messaging across all customer touchpoints
    /// </summary>
    public class CommunicationPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly ITurnState _turnState;
        private readonly KnowledgeBaseService _knowledgeBaseService;
        private readonly HttpClient _httpClient;

        public CommunicationPlugin(ITurnContext turnContext, ITurnState turnState, KnowledgeBaseService knowledgeBaseService, HttpClient httpClient)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _turnState = turnState ?? throw new ArgumentNullException(nameof(turnState));
            _knowledgeBaseService = knowledgeBaseService ?? throw new ArgumentNullException(nameof(knowledgeBaseService));
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        }

        /// <summary>
        /// Sends detailed claim information via email using Microsoft Graph
        /// </summary>
        /// <param name="claimId">The unique claim identifier</param>
        /// <param name="recipientEmail">Email address to send the claim details to (optional, uses policyholder email if not provided)</param>
        /// <returns>Success or failure message indicating email delivery status</returns>
        [Description("Sends a well-formatted email with comprehensive claim details including policyholder info, documentation status, timeline, and recommendations via Microsoft Graph.")]
        public async Task<string> SendClaimDetailsByEmail(string claimId, string recipientEmail = null)
        {
            await NotifyUserAsync($"Retrieving details for claim {claimId}...");

            // Read the user profile
            var userProfile = _turnState.Conversation.GetCachedUserProfile();
            var accessToken = _turnState.Conversation.GetCachedOBOAccessToken();

            // Use Knowledge Base with instructions for email-ready claim summary
            var instructions = @"You are preparing a professional claim summary for email. Include:
                - Claim Number, Status, and Date Filed
                - Policyholder Information
                - Claim Details (type, amount, location, description)
                - Current Status and Next Steps
                - Document Status and Requirements
                - Key Timeline Events
                Format clearly for email readability. Cite sources with [ref_id:X].";
            
            var query = $"complete details for claim {claimId}";
            var claimData = await _knowledgeBaseService.RetrieveAsync(query, instructions, topResults: 5);

            // Use provided email or default to the current user's email
            var toEmail = string.IsNullOrEmpty(recipientEmail) ? userProfile.Mail : recipientEmail;
            
            await NotifyUserAsync($"Preparing email for {toEmail}...");

            // Create well-formatted HTML email content using KB data
            var emailContent = CreateClaimDetailsEmailContentFromKB(claimId, claimData.ToString() ?? "");
            
            try
            {
                // Send email via Microsoft Graph
                var emailPayload = new
                {
                    message = new
                    {
                        subject = $"Zava Insurance - Claim Details Report ({claimId})",
                        body = new
                        {
                            contentType = "HTML",
                            content = emailContent
                        },
                        toRecipients = new[]
                        {
                            new
                            {
                                emailAddress = new
                                {
                                    address = toEmail
                                }
                            }
                        },
                        from = new
                        {
                            emailAddress = new
                            {
                                address = userProfile.Mail
                            }
                        }
                    },
                    saveToSentItems = true
                };

                var jsonContent = JsonSerializer.Serialize(emailPayload);
                var httpContent = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");
                
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
                _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

                await NotifyUserAsync($"Sending email via Microsoft Graph...");

                var response = await _httpClient.PostAsync("https://graph.microsoft.com/v1.0/me/sendMail", httpContent);

                if (response.IsSuccessStatusCode)
                {
                    await NotifyUserAsync($"✅ Email sent successfully!");
                    return $"✅ Success: Claim details for {claimId} have been successfully sent to {toEmail}. " +
                           $"The email includes comprehensive claim information, documentation status, timeline, and recommendations.";
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    await NotifyUserAsync($"❌ Failed to send email: {response.StatusCode}");
                    return $"❌ Error: Failed to send email for claim {claimId}. " +
                           $"Status: {response.StatusCode}, Details: {errorContent}";
                }
            }
            catch (Exception ex)
            {
                await NotifyUserAsync($"❌ Exception occurred while sending email");
                return $"❌ Error: Exception occurred while sending claim details email: {ex.Message}";
            }
        }

        /// <summary>
        /// Creates well-formatted HTML email content with claim details
        /// </summary>
        private string CreateClaimDetailsEmailContentFromKB(string claimId, string knowledgeBaseData)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }}
        .container {{ max-width: 800px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        .header {{ background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px; border-radius: 8px 8px 0 0; }}
        .content {{ padding: 30px; }}
        .section {{ margin-bottom: 25px; }}
        .footer {{ background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; border-radius: 0 0 8px 8px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🏢 Zava Insurance - Claim Details Report</h1>
            <h2>Claim #{claimId}</h2>
        </div>
        
        <div class='content'>
            <div class='section'>
                <h3>📋 Claim Information</h3>
                <pre style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; white-space: pre-wrap;'>{knowledgeBaseData}</pre>
            </div>
        </div>
        
        <div class='footer'>
            <p><strong>Zava Insurance</strong> | Professional Claims Management</p>
            <p>This is an automated report generated from our AI-powered system.</p>
        </div>
    </div>
</body>
</html>";
        }

        /// <summary>
        /// Generates a comprehensive investigation report for a claim including vision analysis and fraud assessment
        /// </summary>
        /// <param name="claimNumber">The claim number to generate report for</param>
        /// <returns>A formatted investigation report with findings and recommendations</returns>
        [Description("Generates a comprehensive investigation report for a claim that includes damage assessment from vision analysis, fraud risk evaluation, and actionable recommendations for claim resolution.")]
        public async Task<string> GenerateInvestigationReport(string claimNumber)
        {
            if (string.IsNullOrWhiteSpace(claimNumber))
                return "❌ Error: Claim number cannot be empty.";

            await NotifyUserAsync($"📊 Generating investigation report for {claimNumber}...");

            try
            {
                // Use Knowledge Base to gather comprehensive claim data including vision and fraud analysis
                var instructions = @"You are an insurance claims investigator preparing a comprehensive investigation report. 
                    Include ALL available information:
                    
                    **Claim Overview:**
                    - Claim Number, Type, Status
                    - Policyholder Name and Policy Number
                    - Date Filed, Estimated Cost
                    - Location and Description of Incident
                    
                    **Vision Analysis Findings:**
                    - Damage assessment results from AI vision analysis
                    - Estimated repair costs from damage photos
                    - Approval status of vision analysis
                    - Key damage observations
                    
                    **Fraud Risk Assessment:**
                    - Fraud risk score and level
                    - Key fraud indicators identified
                    - Comparison to normal claim patterns
                    - Risk assessment explanation
                    
                    **Documentation Review:**
                    - Completeness of documentation
                    - Missing items (if any)
                    - Quality of submitted evidence
                    
                    **Recommendations:**
                    - Approval/denial recommendation with justification
                    - Required next steps
                    - Any additional investigation needed
                    - Suggested claim resolution path
                    
                    Format professionally with clear sections, bullet points, and evidence-based conclusions.
                    Cite all sources with [ref_id:X].";
                
                var query = $"Complete investigation details for claim {claimNumber} including vision analysis, fraud assessment, and all supporting evidence";
                var reportData = await _knowledgeBaseService.RetrieveAsync(query, instructions, topResults: 10);

                // Format the final report
                var report = new System.Text.StringBuilder();
                report.AppendLine($"# 📋 Investigation Report: {claimNumber}");
                report.AppendLine($"**Generated:** {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
                report.AppendLine($"**Status:** Investigation Complete");
                report.AppendLine();
                report.AppendLine("---");
                report.AppendLine();
                report.AppendLine(reportData);
                report.AppendLine();
                report.AppendLine("---");
                report.AppendLine();
                report.AppendLine("**Report Prepared By:** Zava Insurance Claims Investigation System");
                report.AppendLine("**Next Steps:** Review findings and proceed with recommended claim resolution action.");

                await NotifyUserAsync("✅ Investigation report generated successfully!");
                
                return report.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error generating investigation report: {ex.Message}");
                return $"❌ Error generating investigation report: {ex.Message}";
            }
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
    }
}
