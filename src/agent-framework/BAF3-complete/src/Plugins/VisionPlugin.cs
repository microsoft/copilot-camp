using Microsoft.Agents.Builder;
using Microsoft.Agents.Core;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using InsuranceAgent.Services;
using Microsoft.Extensions.Configuration;

namespace ZavaInsurance.Plugins
{
    /// <summary>
    /// Vision Plugin for Zava Insurance
    /// Uses AI vision models to analyze damage photos from insurance claims
    /// Provides damage assessment, severity analysis, and repair cost estimates
    /// </summary>
    public class VisionPlugin
    {
        private readonly ITurnContext _turnContext;
        private readonly KnowledgeBaseService _knowledgeBaseService;
        private readonly VisionService _visionService;
        private readonly BlobStorageService _blobStorageService;
        private readonly IConfiguration _configuration;

        public VisionPlugin(
            ITurnContext turnContext, 
            KnowledgeBaseService knowledgeBaseService, 
            VisionService visionService, 
            BlobStorageService blobStorageService, 
            IConfiguration configuration)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _knowledgeBaseService = knowledgeBaseService ?? throw new ArgumentNullException(nameof(knowledgeBaseService));
            _visionService = visionService ?? throw new ArgumentNullException(nameof(visionService));
            _blobStorageService = blobStorageService ?? throw new ArgumentNullException(nameof(blobStorageService));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        /// <summary>
        /// Finds and shows the first damage photo for a claim (without analyzing)
        /// Proxies image through devtunnel for inline display in chat
        /// </summary>
        [Description("Finds and shows the first damage photo for a claim. Use this when user wants to see/view the damage photo. Does not perform AI analysis.")]
        public async Task<string> ShowDamagePhoto(string claimNumber)
        {
            await NotifyUserAsync($"🔍 Searching for damage photos in claim {claimNumber}...");

            try
            {
                // Search for the claim with image URL
                var imageUrl = await _knowledgeBaseService.GetClaimImageUrlAsync(claimNumber);

                if (string.IsNullOrEmpty(imageUrl))
                {
                    return $"❌ No damage photo found for claim {claimNumber}.\n\n" +
                           $"_The claim may not have an uploaded damage photo yet._";
                }

                // Get bot endpoint for devtunnel proxy (required for image display in M365 Copilot)
                var botEndpoint = _configuration["BOT_ENDPOINT"];
                if (string.IsNullOrEmpty(botEndpoint))
                {
                    var botDomain = _configuration["BOT_DOMAIN"];
                    botEndpoint = !string.IsNullOrEmpty(botDomain) ? $"https://{botDomain}" : "http://localhost:3978";
                }
                botEndpoint = botEndpoint.TrimEnd('/');

                // Proxy the blob storage URL through devtunnel for inline display
                var proxyUrl = $"{botEndpoint}/api/image?url={Uri.EscapeDataString(imageUrl)}";

                // Return the image with Markdown syntax for inline display
                return $"📸 **Damage Photo for Claim {claimNumber}**\n\n" +
                       $"![Damage Photo]({proxyUrl})\n\n" +
                       $"_Image stored in Azure Blob Storage_";
            }
            catch (Exception ex)
            {
                return $"❌ Error retrieving damage photo: {ex.Message}";
            }
        }

        /// <summary>
        /// Analyzes a damage photo using Mistral AI vision model and presents results
        /// Downloads image, calls VisionService, formats structured analysis
        /// </summary>
        [Description("Analyzes a damage photo using Mistral AI model and requests user approval before updating the system.")]
        public async Task<string> AnalyzeAndShowDamagePhoto(string claimNumber, string documentId)
        {
            await NotifyUserAsync($"🤖 Starting AI Vision Analysis for claim {claimNumber}...");

            try
            {
                // Get the image URL for this claim from knowledge base
                var imageUrl = await _knowledgeBaseService.GetClaimImageUrlAsync(claimNumber);

                if (string.IsNullOrEmpty(imageUrl))
                {
                    return $"❌ No damage photo found for claim {claimNumber}.\n\n" +
                           $"Please ensure a damage photo has been uploaded first.";
                }

                await NotifyUserAsync($"📸 Downloading image from blob storage...");

                // Download the image bytes from blob storage
                using var httpClient = new HttpClient();
                var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
                var fileName = Path.GetFileName(new Uri(imageUrl).LocalPath);

                await NotifyUserAsync($"🤖 Analyzing damage with Mistral AI Vision...");

                // Analyze the image using Vision AI (Mistral model)
                var analysisResult = await _visionService.AnalyzeDamagePhotoAsync(imageBytes, fileName);

                await NotifyUserAsync($"✅ Analysis complete!");

                // Format the structured analysis results for user
                var response = $"🔍 **AI Vision Analysis Results**\n\n";
                response += $"**Claim:** {claimNumber}\n";
                response += $"**Image:** {imageUrl}\n\n";
                response += $"**Analysis:**\n";
                response += $"- **Damage Type:** {analysisResult.DamageType}\n";
                response += $"- **Severity:** {analysisResult.Severity}\n";
                response += $"- **Estimated Cost:** ${analysisResult.EstimatedRepairCost:N2}\n";
                response += $"- **Urgency:** {analysisResult.Urgency}\n";
                response += $"- **Description:** {analysisResult.DetailedDescription}\n";
                if (analysisResult.AffectedAreas.Length > 0)
                    response += $"- **Affected Areas:** {string.Join(", ", analysisResult.AffectedAreas)}\n";
                if (!string.IsNullOrEmpty(analysisResult.SafetyConcerns))
                    response += $"- **Safety Concerns:** {analysisResult.SafetyConcerns}\n";
                if (!string.IsNullOrEmpty(analysisResult.RepairRecommendations))
                    response += $"- **Recommendations:** {analysisResult.RepairRecommendations}\n";
                if (analysisResult.RequiresSpecialist)
                    response += $"- **Specialist Required:** {analysisResult.SpecialistType}\n";
                response += $"\n---\n\n";
                response += $"Would you like to:\n";
                response += $"- Approve this analysis and update the claim\n";
                response += $"- Reject the analysis\n";
                response += $"- Check for fraud indicators\n";

                return response;
            }
            catch (Exception ex)
            {
                return $"❌ Error analyzing damage photo: {ex.Message}\n\n" +
                       $"Please try again or contact support if the issue persists.";
            }
        }

        /// <summary>
        /// Approves a damage photo analysis via text command
        /// In production: would update database, trigger workflows, assign adjusters
        /// </summary>
        [Description("Approves a damage photo analysis by claim number and document ID. Use this when user says 'approve' or 'approve analysis'.")]
        public async Task<string> ApproveAnalysis(string claimNumber, string documentId, string userFeedback = "")
        {
            return await HandleAnalysisApproval(claimNumber, documentId, true, userFeedback);
        }

        /// <summary>
        /// Rejects a damage photo analysis via text command
        /// In production: would flag for manual review, assign human adjuster
        /// </summary>
        [Description("Rejects a damage photo analysis by claim number and document ID. Use this when user says 'reject' or 'reject analysis'.")]
        public async Task<string> RejectAnalysis(string claimNumber, string documentId, string userFeedback = "")
        {
            return await HandleAnalysisApproval(claimNumber, documentId, false, userFeedback);
        }

        /// <summary>
        /// Common logic for handling analysis approval or rejection
        /// Provides structured feedback and next steps
        /// </summary>
        private async Task<string> HandleAnalysisApproval(string claimNumber, string documentId, bool approved, string userFeedback = "")
        {
            await NotifyUserAsync($"Processing {(approved ? "approval" : "rejection")}...");

            try
            {
                var action = approved ? "approved" : "rejected";
                var emoji = approved ? "✅" : "❌";

                // In a real system, you would:
                // 1. Update the claim status in the database
                // 2. Store the analysis results
                // 3. Update estimated costs
                // 4. Trigger workflow actions (assign adjuster, schedule inspection, etc.)

                var response = $"{emoji} **Analysis {action.ToUpper()}**\n\n";
                response += $"**Claim:** {claimNumber}\n";

                if (approved)
                {
                    response += $"**Status:** The AI analysis has been accepted and the claim has been updated.\n\n";
                    response += $"**Next Steps:**\n";
                    response += $"- The estimated repair costs have been added to the claim\n";
                    response += $"- An adjuster will be notified for final review\n";
                    response += $"- The claim is ready for processing\n";
                }
                else
                {
                    response += $"**Status:** The AI analysis has been rejected.\n\n";
                    response += $"**Next Steps:**\n";
                    response += $"- The claim will be flagged for manual review\n";
                    response += $"- An adjuster will be assigned to inspect the damage\n";
                    response += $"- Additional documentation may be requested\n";
                }

                if (!string.IsNullOrEmpty(userFeedback))
                {
                    response += $"\n**Your Feedback:** {userFeedback}\n";
                }

                response += $"\n_Note: In a production system, this would update the claim database and trigger automated workflows._";

                return response;
            }
            catch (Exception ex)
            {
                return $"❌ Error processing {(approved ? "approval" : "rejection")}: {ex.Message}";
            }
        }

        /// <summary>
        /// Helper to send real-time streaming updates during long operations
        /// Shows as typing indicators with messages in chat
        /// </summary>
        private async Task NotifyUserAsync(string message)
        {
            // Use StreamingResponse for real-time feedback
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