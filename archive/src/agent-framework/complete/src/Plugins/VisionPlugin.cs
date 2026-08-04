using Microsoft.Agents.Builder;
using Microsoft.Agents.Core;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using InsuranceAgent.Services.Models;
using AdaptiveCards;
using Newtonsoft.Json;
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

        public VisionPlugin(ITurnContext turnContext, KnowledgeBaseService knowledgeBaseService, VisionService visionService, BlobStorageService blobStorageService, IConfiguration configuration)
        {
            _turnContext = turnContext ?? throw new ArgumentNullException(nameof(turnContext));
            _knowledgeBaseService = knowledgeBaseService ?? throw new ArgumentNullException(nameof(knowledgeBaseService));
            _visionService = visionService ?? throw new ArgumentNullException(nameof(visionService));
            _blobStorageService = blobStorageService ?? throw new ArgumentNullException(nameof(blobStorageService));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
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

        private string GetPublicImageUrl(string claimNumber, string documentId)
        {
            // Get the bot endpoint (dev tunnel URL or production URL)
            var botEndpoint = _configuration["BOT_ENDPOINT"];
            
            // Log for debugging
            Console.WriteLine($"🔍 BOT_ENDPOINT from config: {botEndpoint ?? "NULL"}");
            
            // If BOT_ENDPOINT is not set, fall back to dev tunnel from domain
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
            
            // Remove trailing slash if present
            botEndpoint = botEndpoint.TrimEnd('/');
            
            // Construct the public image URL through the bot's image proxy endpoint
            var imageUrl = $"{botEndpoint}/api/images/{claimNumber}/{documentId}";
            Console.WriteLine($"📸 Generated image URL: {imageUrl}");
            return imageUrl;
        }

        private string GetContentType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            return extension switch
            {
                ".pdf" => "application/pdf",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xls" => "application/vnd.ms-excel",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ".txt" => "text/plain",
                _ => "application/octet-stream"
            };
        }

        /// <summary>
        /// Analyzes a damage photo using AI vision and presents it for user approval
        /// </summary>
        [Description("Analyzes a damage photo using AI vision (Mistral AI) to assess damage type, severity, estimated cost, and repair recommendations. Use this when user asks to 'analyze damage photo' or 'assess damage'. Returns detailed AI analysis.")]
        public async Task<string> AnalyzeAndShowDamagePhoto(string claimNumber, string documentId)
        {
            await NotifyUserAsync($"🤖 Starting AI Vision Analysis for claim {claimNumber}...");
            
            try
            {
                // Get the image URL for this claim
                var imageUrl = await _knowledgeBaseService.GetClaimImageUrlAsync(claimNumber);
                
                if (string.IsNullOrEmpty(imageUrl))
                {
                    return $"❌ No damage photo found for claim {claimNumber}.\n\n" +
                           $"Please ensure a damage photo has been uploaded first.";
                }
                
                await NotifyUserAsync($"📸 Downloading image from {imageUrl}...");
                
                // Download the image from the URL
                using var httpClient = new HttpClient();
                var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
                var fileName = Path.GetFileName(new Uri(imageUrl).LocalPath);
                
                await NotifyUserAsync($"🤖 Analyzing damage with AI Vision...");
                
                // Analyze the image using Vision AI
                var analysisResult = await _visionService.AnalyzeDamagePhotoAsync(imageBytes, fileName);
                
                await NotifyUserAsync($"✅ Analysis complete!");
                
                // Format the analysis results
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
        /// Finds and shows the first damage photo for a claim (without analyzing)
        /// </summary>
        [Description("Only displays the damage photo image for viewing. Does NOT perform any AI analysis. Use ONLY when user explicitly wants to just 'see' or 'view' or 'show' the photo without analysis. For damage assessment, use AnalyzeAndShowDamagePhoto instead.")]
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
        /// Approves a damage photo analysis via text command
        /// </summary>
        [Description("Approves a damage photo analysis by claim number and document ID. Use this when user says 'approve' or 'approve analysis'.")]
        public async Task<string> ApproveAnalysis(string claimNumber, string documentId, string userFeedback = "")
        {
            return await HandleAnalysisApproval(claimNumber, documentId, true, userFeedback);
        }

        /// <summary>
        /// Rejects a damage photo analysis via text command
        /// </summary>
        [Description("Rejects a damage photo analysis by claim number and document ID. Use this when user says 'reject' or 'reject analysis'.")]
        public async Task<string> RejectAnalysis(string claimNumber, string documentId, string userFeedback = "")
        {
            return await HandleAnalysisApproval(claimNumber, documentId, false, userFeedback);
        }

        /// <summary>
        /// Handles the approval or rejection of a vision analysis
        /// </summary>
        [Description("Approves or rejects a damage photo analysis and updates the system accordingly.")]
        public async Task<string> HandleAnalysisApproval(string claimNumber, string documentId, bool approved, string userFeedback = "")
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

        private string GetAnalysisSummary(ClaimDocumentEntity document)
        {
            return $"**Damage Type:** {document.DamageType}\n" +
                   $"**Severity:** {document.Severity}\n" +
                   $"**Affected Areas:** {document.AffectedAreas}\n" +
                   $"**Estimated Repair Cost:** ${document.EstimatedRepairCost:N2}\n" +
                   $"**Urgency:** {document.Urgency}";
        }

        private bool IsHighSeverity(string? severity)
        {
            return severity?.ToLower() switch
            {
                "critical" or "severe" or "high" or "major" => true,
                _ => false
            };
        }

        private async Task UpdateClaimBasedOnAnalysis(string claimNumber, ClaimDocumentEntity document)
        {
            // TODO: KB integration - Write operations not supported
            await Task.CompletedTask;
        }

        private string CreateApprovalCard(ClaimDocumentEntity document, DamageAnalysisResult analysis)
        {
            var card = new AdaptiveCard(new AdaptiveSchemaVersion(1, 5))
            {
                Body = new List<AdaptiveElement>
                {
                    new AdaptiveTextBlock("🔍 AI Damage Analysis - Approval Required") 
                    { 
                        Size = AdaptiveTextSize.Large, 
                        Weight = AdaptiveTextWeight.Bolder,
                        Color = AdaptiveTextColor.Accent
                    },
                    new AdaptiveTextBlock($"📷 **{document.FileName}** | [View Image]({document.BlobUrl})") 
                    { 
                        Size = AdaptiveTextSize.Small,
                        Color = AdaptiveTextColor.Dark,
                        IsSubtle = true,
                        Wrap = true,
                        Spacing = AdaptiveSpacing.Small
                    }
                }
            };

            // Add comprehensive analysis details
            card.Body.AddRange(new List<AdaptiveElement>
            {
                new AdaptiveColumnSet
                {
                    Columns = new List<AdaptiveColumn>
                    {
                        new AdaptiveColumn { Width = "auto", Items = new List<AdaptiveElement> { new AdaptiveTextBlock("**Damage Type:**") { Wrap = true } } },
                        new AdaptiveColumn { Width = "stretch", Items = new List<AdaptiveElement> { new AdaptiveTextBlock(analysis.DamageType ?? "Unknown") { Wrap = true, Color = AdaptiveTextColor.Accent } } }
                    }
                },
                new AdaptiveColumnSet
                {
                    Columns = new List<AdaptiveColumn>
                    {
                        new AdaptiveColumn { Width = "auto", Items = new List<AdaptiveElement> { new AdaptiveTextBlock("**Severity:**") { Wrap = true } } },
                        new AdaptiveColumn { Width = "stretch", Items = new List<AdaptiveElement> { new AdaptiveTextBlock(analysis.Severity ?? "Unknown") { Wrap = true, Color = GetSeverityColor(analysis.Severity) } } }
                    }
                },
                new AdaptiveColumnSet
                {
                    Columns = new List<AdaptiveColumn>
                    {
                        new AdaptiveColumn { Width = "auto", Items = new List<AdaptiveElement> { new AdaptiveTextBlock("**Affected Areas:**") { Wrap = true } } },
                        new AdaptiveColumn { Width = "stretch", Items = new List<AdaptiveElement> { new AdaptiveTextBlock(analysis.AffectedAreas != null && analysis.AffectedAreas.Length > 0 ? string.Join(", ", analysis.AffectedAreas) : "Not specified") { Wrap = true } } }
                    }
                },
                new AdaptiveColumnSet
                {
                    Columns = new List<AdaptiveColumn>
                    {
                        new AdaptiveColumn { Width = "auto", Items = new List<AdaptiveElement> { new AdaptiveTextBlock("**Cost Estimate:**") { Wrap = true } } },
                        new AdaptiveColumn { Width = "stretch", Items = new List<AdaptiveElement> { new AdaptiveTextBlock($"${analysis.EstimatedRepairCost:N2}") { Wrap = true, Weight = AdaptiveTextWeight.Bolder } } }
                    }
                },
                new AdaptiveColumnSet
                {
                    Columns = new List<AdaptiveColumn>
                    {
                        new AdaptiveColumn { Width = "auto", Items = new List<AdaptiveElement> { new AdaptiveTextBlock("**Urgency:**") { Wrap = true } } },
                        new AdaptiveColumn { Width = "stretch", Items = new List<AdaptiveElement> { new AdaptiveTextBlock(analysis.Urgency ?? "Unknown") { Wrap = true } } }
                    }
                },
                new AdaptiveTextBlock("**Assessment:**") { Weight = AdaptiveTextWeight.Bolder, Spacing = AdaptiveSpacing.Medium },
                new AdaptiveTextBlock(analysis.DetailedDescription ?? "No description available") { Wrap = true, IsSubtle = true }
            });

            // Add safety concerns if present
            if (!string.IsNullOrEmpty(analysis.SafetyConcerns))
            {
                card.Body.AddRange(new List<AdaptiveElement>
                {
                    new AdaptiveTextBlock("⚠️ **Safety Concerns:**") { Weight = AdaptiveTextWeight.Bolder, Color = AdaptiveTextColor.Warning, Spacing = AdaptiveSpacing.Medium },
                    new AdaptiveTextBlock(analysis.SafetyConcerns) { Wrap = true, Color = AdaptiveTextColor.Warning }
                });
            }

            // Add repair recommendations
            if (!string.IsNullOrEmpty(analysis.RepairRecommendations))
            {
                card.Body.AddRange(new List<AdaptiveElement>
                {
                    new AdaptiveTextBlock("🔧 **Recommendations:**") { Weight = AdaptiveTextWeight.Bolder, Spacing = AdaptiveSpacing.Medium },
                    new AdaptiveTextBlock(analysis.RepairRecommendations) { Wrap = true }
                });
            }

            // Add specialist info if required
            if (analysis.RequiresSpecialist)
            {
                card.Body.Add(new AdaptiveTextBlock($"👷 **Specialist Required:** {analysis.SpecialistType}") 
                { 
                    Weight = AdaptiveTextWeight.Bolder, 
                    Color = AdaptiveTextColor.Attention, 
                    Spacing = AdaptiveSpacing.Medium, 
                    Wrap = true 
                });
            }

            // Add approval question and buttons
            card.Body.AddRange(new List<AdaptiveElement>
            {
                new AdaptiveTextBlock("📋 **Do you approve this analysis?**") 
                { 
                    Weight = AdaptiveTextWeight.Bolder, 
                    Color = AdaptiveTextColor.Accent,
                    Spacing = AdaptiveSpacing.Large 
                },
                new AdaptiveTextBlock("Approving will save this analysis to the system and may update the claim status based on severity.") 
                { 
                    IsSubtle = true, 
                    Wrap = true,
                    Size = AdaptiveTextSize.Small 
                }
            });

            // Add action buttons
            card.Actions = new List<AdaptiveAction>
            {
                new AdaptiveSubmitAction
                {
                    Title = "✅ Approve Analysis",
                    Data = new { 
                        action = "approveAnalysis", 
                        claimNumber = document.ClaimNumber, 
                        documentId = document.DocumentId, 
                        approved = true 
                    }
                },
                new AdaptiveSubmitAction
                {
                    Title = "❌ Reject Analysis", 
                    Data = new { 
                        action = "approveAnalysis", 
                        claimNumber = document.ClaimNumber, 
                        documentId = document.DocumentId, 
                        approved = false 
                    }
                }
            };

            return card.ToJson();
        }

        private string CreateDamageAnalysisCard(dynamic document, DamageAnalysisResult analysis)
        {
            var card = new AdaptiveCard(new AdaptiveSchemaVersion(1, 5))
            {
                Body = new List<AdaptiveElement>
                {
                    new AdaptiveTextBlock("🔍 AI Damage Analysis") 
                    { 
                        Size = AdaptiveTextSize.Large, 
                        Weight = AdaptiveTextWeight.Bolder,
                        Color = AdaptiveTextColor.Accent
                    },
                    new AdaptiveTextBlock($"📷 **{document.FileName}** | [Open Image]({document.BlobUrl})") 
                    { 
                        Size = AdaptiveTextSize.Small,
                        Color = AdaptiveTextColor.Dark,
                        IsSubtle = true,
                        Wrap = true,
                        Spacing = AdaptiveSpacing.Small
                    }
                }
            };



            // Add comprehensive analysis details
            card.Body.AddRange(new List<AdaptiveElement>
            {
                new AdaptiveColumnSet
                {
                    Columns = new List<AdaptiveColumn>
                    {
                        new AdaptiveColumn { Width = "auto", Items = new List<AdaptiveElement> { new AdaptiveTextBlock("**Damage Type:**") { Wrap = true } } },
                        new AdaptiveColumn { Width = "stretch", Items = new List<AdaptiveElement> { new AdaptiveTextBlock(analysis.DamageType ?? "Unknown") { Wrap = true, Color = AdaptiveTextColor.Accent } } }
                    }
                },
                new AdaptiveColumnSet
                {
                    Columns = new List<AdaptiveColumn>
                    {
                        new AdaptiveColumn { Width = "auto", Items = new List<AdaptiveElement> { new AdaptiveTextBlock("**Severity:**") { Wrap = true } } },
                        new AdaptiveColumn { Width = "stretch", Items = new List<AdaptiveElement> { new AdaptiveTextBlock(analysis.Severity ?? "Unknown") { Wrap = true, Color = GetSeverityColor(analysis.Severity) } } }
                    }
                },
                new AdaptiveColumnSet
                {
                    Columns = new List<AdaptiveColumn>
                    {
                        new AdaptiveColumn { Width = "auto", Items = new List<AdaptiveElement> { new AdaptiveTextBlock("**Affected Areas:**") { Wrap = true } } },
                        new AdaptiveColumn { Width = "stretch", Items = new List<AdaptiveElement> { new AdaptiveTextBlock(analysis.AffectedAreas != null && analysis.AffectedAreas.Length > 0 ? string.Join(", ", analysis.AffectedAreas) : "Not specified") { Wrap = true } } }
                    }
                },
                new AdaptiveColumnSet
                {
                    Columns = new List<AdaptiveColumn>
                    {
                        new AdaptiveColumn { Width = "auto", Items = new List<AdaptiveElement> { new AdaptiveTextBlock("**Cost Estimate:**") { Wrap = true } } },
                        new AdaptiveColumn { Width = "stretch", Items = new List<AdaptiveElement> { new AdaptiveTextBlock($"${analysis.EstimatedRepairCost:N2}") { Wrap = true, Weight = AdaptiveTextWeight.Bolder } } }
                    }
                },
                new AdaptiveColumnSet
                {
                    Columns = new List<AdaptiveColumn>
                    {
                        new AdaptiveColumn { Width = "auto", Items = new List<AdaptiveElement> { new AdaptiveTextBlock("**Urgency:**") { Wrap = true } } },
                        new AdaptiveColumn { Width = "stretch", Items = new List<AdaptiveElement> { new AdaptiveTextBlock(analysis.Urgency ?? "Unknown") { Wrap = true } } }
                    }
                },
                new AdaptiveTextBlock("**Assessment:**") { Weight = AdaptiveTextWeight.Bolder, Spacing = AdaptiveSpacing.Medium },
                new AdaptiveTextBlock(analysis.DetailedDescription ?? "No description available") { Wrap = true, IsSubtle = true }
            });

            // Add safety concerns if present
            if (!string.IsNullOrEmpty(analysis.SafetyConcerns))
            {
                card.Body.AddRange(new List<AdaptiveElement>
                {
                    new AdaptiveTextBlock("⚠️ **Safety Concerns:**") { Weight = AdaptiveTextWeight.Bolder, Color = AdaptiveTextColor.Warning, Spacing = AdaptiveSpacing.Medium },
                    new AdaptiveTextBlock(analysis.SafetyConcerns) { Wrap = true, Color = AdaptiveTextColor.Warning }
                });
            }

            // Add repair recommendations
            if (!string.IsNullOrEmpty(analysis.RepairRecommendations))
            {
                card.Body.AddRange(new List<AdaptiveElement>
                {
                    new AdaptiveTextBlock("🔧 **Recommendations:**") { Weight = AdaptiveTextWeight.Bolder, Spacing = AdaptiveSpacing.Medium },
                    new AdaptiveTextBlock(analysis.RepairRecommendations) { Wrap = true }
                });
            }

            // Add specialist info if required
            if (analysis.RequiresSpecialist)
            {
                card.Body.Add(new AdaptiveTextBlock($"👷 **Specialist Required:** {analysis.SpecialistType}") 
                { 
                    Weight = AdaptiveTextWeight.Bolder, 
                    Color = AdaptiveTextColor.Attention, 
                    Spacing = AdaptiveSpacing.Medium, 
                    Wrap = true 
                });
            }

            return card.ToJson();
        }

        private AdaptiveTextColor GetSeverityColor(string? severity)
        {
            return severity?.ToLower() switch
            {
                "critical" or "severe" => AdaptiveTextColor.Attention,
                "high" or "major" => AdaptiveTextColor.Warning,
                "moderate" or "medium" => AdaptiveTextColor.Accent,
                "low" or "minor" => AdaptiveTextColor.Good,
                _ => AdaptiveTextColor.Default
            };
        }
    }
}
