# Lab BAF5 - Add Communication Capabilities

In this lab, you'll enhance the Zava Insurance Agent with professional communication capabilities. You'll add the ability to send detailed claim reports via email using Microsoft Graph and generate comprehensive investigation reports that include vision analysis findings and fraud assessment data.

???+ info "Understanding Communication Plugin"
    The **CommunicationPlugin** enables your agent to:
    
    - **Send Professional Emails**: Use Microsoft Graph Mail API to send HTML-formatted claim details  
    - **Generate Investigation Reports**: Create comprehensive reports combining data from ClaimsPlugin, VisionPlugin, and PolicyPlugin  
    - **Knowledge Base Aggregation**: Pull all available claim data including vision analysis, fraud assessment, and policy details  
    - **OAuth Token Management**: Use cached On-Behalf-Of (OBO) tokens for secure Graph API calls
    
    This completes the claim processing workflow by adding communication and reporting capabilities.

## Exercise 1: Create the CommunicationPlugin

Now that you have claims search, vision analysis, and policy search capabilities, let's add communication features to send reports and emails.

### Step 1: Create Complete CommunicationPlugin

??? note "What this plugin does"
    The `CommunicationPlugin` provides two main capabilities:
    
    **SendClaimDetailsByEmail**:

    - Retrieves comprehensive claim data from Knowledge Base Service
    - Creates professional HTML-formatted email
    - Sends via Microsoft Graph API
    - Uses cached OAuth token for authentication
    - Defaults to current user's email if no recipient specified
    
    **GenerateInvestigationReport**:

    - Gathers all claim data including vision analysis and fraud assessment
    - Formats a comprehensive investigation report with recommendations
    - Returns formatted markdown report with professional structure
    
    Both methods use the **KnowledgeBaseService** with custom instructions to retrieve and synthesize claim data.

1️⃣ Create a new file `src/Plugins/CommunicationPlugin.cs` with the complete implementation:

```csharp
using Microsoft.Agents.Builder;
using Microsoft.Agents.Core.Models;
using System.ComponentModel;
using System.Text.Json;
using InsuranceAgent.Services;
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
```

<cc-end-step lab="baf5" exercise="1" step="1" />

## Exercise 2: Register CommunicationPlugin in Agent

Now let's wire up the CommunicationPlugin in your ZavaInsuranceAgent.

### Step 1: Instantiate CommunicationPlugin

1️⃣ Open `src/Agent/ZavaInsuranceAgent.cs`.

2️⃣ Find the `GetClientAgent` method (around line 159).

3️⃣ Locate where plugins are instantiated (after `PolicyPlugin policyPlugin = ...`).

4️⃣ Add the CommunicationPlugin instantiation:

```csharp

// Get HttpClient for API calls
var httpClientFactory = scope.ServiceProvider.GetRequiredService<IHttpClientFactory>();
var httpClient = httpClientFactory.CreateClient();
// Create CommunicationPlugin with required dependencies
CommunicationPlugin communicationPlugin = new(context, turnState, knowledgeBaseService, httpClient);
```

<cc-end-step lab="baf5" exercise="2" step="1" />

### Step 2: Register Communication Tools

In the same `GetClientAgent` method, scroll down to where tools are added to `toolOptions.Tools` (around line 180).

Find the Policy tools section and add Communication tools right after:

```csharp
// Register Communication tools
toolOptions.Tools.Add(AIFunctionFactory.Create(communicationPlugin.SendClaimDetailsByEmail));
toolOptions.Tools.Add(AIFunctionFactory.Create(communicationPlugin.GenerateInvestigationReport));
```

??? note "Tool Registration Pattern"
    The agent uses **AIFunctionFactory** to register plugin methods as AI tools. Each `[Description]` attribute on plugin methods becomes the tool description that helps the LLM decide when to call them.

<cc-end-step lab="baf5" exercise="2" step="2" />

## Exercise 3: Update Agent Instructions and security

Update your agent's instructions to include communication capabilities and the agent security to support user's authentication and On-Behalf-Of (OBO) token support.

### Step 1: Add Communication Tools to Instructions

1️⃣ In `src/Agent/ZavaInsuranceAgent.cs`, find the `AgentInstructions` field (around line 32).

2️⃣ Find the tool list section and update it with the list of all tools including communication:

```csharp
private readonly string AgentInstructions = """
You are a professional insurance claims assistant for Zava Insurance.

Whenever the user starts a new conversation or provides a prompt to start a new conversation like "start over", "restart", 
"new conversation", "what can you do?", "how can you help me?", etc. use {{StartConversationPlugin.StartConversation}} and 
provide to the user exactly the message you get back from the plugin.

**Available Tools:**
Use {{DateTimeFunctionTool.getDate}} to get the current date and time.
For claims search, use {{ClaimsPlugin.SearchClaims}} and {{ClaimsPlugin.GetClaimDetails}}.
For damage photo viewing, use {{VisionPlugin.ShowDamagePhoto}}.
For AI vision damage analysis, use {{VisionPlugin.AnalyzeAndShowDamagePhoto}} and require approval via {{VisionPlugin.ApproveAnalysis}}.
For policy search, use {{PolicyPlugin.SearchPolicies}} and {{PolicyPlugin.GetPolicyDetails}}.
For policy coverage questions and terms, use {{PolicyPlugin.SearchPolicyDocuments}}.
For sending investigation reports and claim details via email, use {{CommunicationPlugin.GenerateInvestigationReport}} and {{CommunicationPlugin.SendClaimDetailsByEmail}}.

**IMPORTANT**: When user asks to "check policy for this claim", first use GetClaimDetails to get the claim's policy number, then use GetPolicyDetails with that policy number.

Stick to the scenario above and use only the information from the tools when answering questions.
Be concise and professional in your responses.
""";
```

??? note "Why Update Instructions"
    The agent instructions guide the LLM on when to use each tool. Adding communication tools ensures the agent knows it can send emails and generate reports when requested.

<cc-end-step lab="baf5" exercise="3" step="1" />

### Step 2: Configure OBO settings

1️⃣ In `m365agents.local.yml`, find the `file/createOrUpdateJsonFile` action (around line 47).

2️⃣ Uncomment the `me` settings in the `UserAuthorization` group of settings in order to enable the settings with name `OBOConnectionName`, `OBOScopes`, `Title`, and `Text`. The code should look like the following:

```yaml
          UserAuthorization:
            DefaultHandlerName: me
            AutoSignin: true
            Handlers:
              me:
                Settings:
                  AzureBotOAuthConnectionName: "Microsoft Graph"
                  OBOConnectionName: "BotServiceConnection"
                  OBOScopes:
                    - "https://graph.microsoft.com/.default"
                  Title: "Sign in"
                  Text: "Sign in to Microsoft Graph"
```

??? note "What this code does"
    The new code enables settings to support On-Behalf-Of (OBO) flow for the Azure Bot backing the agent.
 
<cc-end-step lab="baf5" exercise="3" step="2" />

### Step 3: Implement user's authentication and OBO

1️⃣ In `src/Agent/ZavaInsuranceAgent.cs`, find the `OnMessageAsync` method (around line 87).

2️⃣ Right after the first line of the method `await turnContext.StreamingResponse.QueueInformativeUpdateAsync( ...` add the following code excerpt:

```csharp
            // Check if user profile is already cached, if not fetch and cache it
            var userProfile = turnState.Conversation.GetCachedUserProfile();
            if (userProfile == null)
            {
                try
                {
                    // Get the access token and store it in the conversation state
                    var accessToken = await UserAuthorization.ExchangeTurnTokenAsync(turnContext, UserAuthorization.DefaultHandlerName, exchangeScopes: new[] { "https://graph.microsoft.com/.default" }, cancellationToken: cancellationToken);
                    turnState.Conversation.SetCachedOBOAccessToken(accessToken);

                    // Get the user profile and store it in the conversation state
                    userProfile = await GetUserProfile(accessToken, cancellationToken);
                    turnState.Conversation.SetCachedUserProfile(userProfile);

                    // Show current user profile information to let clients that support streaming know that we are processing the request for the current user.
                    await turnContext.StreamingResponse.QueueInformativeUpdateAsync($"⚒️ Working on your request {userProfile.DisplayName} ...", cancellationToken).ConfigureAwait(false);
                }
                catch (InvalidOperationException ex)
                {
                    System.Diagnostics.Trace.WriteLine($"Exception occurred: {ex.Message}");
                    // User is not signed in, proceed as anonymous and inform the user
                    await turnContext.StreamingResponse.QueueInformativeUpdateAsync("⚠️ Please sign in if you want to use authenticated features.", cancellationToken).ConfigureAwait(false);
                }
            }
```

??? note "What this code does"
    The code excerpt you just added takes care of the following activities:
    
    - Tries to retrieve the current user profile from the conversation
    - If the user profile does not exist in the cache
        - Retrieves an OBO token for the current user
        - Caches the OBO token in the current conversation
        - Retrieves the user profile via Microsoft Graph
        - Caches the user profile in the current conversation
        - Informs the user that the agent is working for her/him
    
    In case of failure while retrieving the user profile, the agent informs via streaming the user to sign in 
    
<cc-end-step lab="baf5" exercise="3" step="3" />

## Exercise 4: Update StartConversationPlugin

Update the welcome message to inform users about all capabilities including communication features.

### Step 1: Update Welcome Message

1️⃣ Open `src/Plugins/StartConversationPlugin.cs`.

2️⃣ Find the `StartConversation` method.

3️⃣ Replace the `welcomeMessage` with the complete workflow:

```csharp
var welcomeMessage = "👋 Welcome to Zava Insurance Claims Assistant!\n\n" +
                    "I'm your AI-powered insurance claims specialist. I help adjusters and investigators streamline the entire claims process - from initial assessment to final approval.\n\n" +
                    "**What I can do:**\n\n" +
                    "- Analyze claims for fraud indicators and risk patterns\n" +
                    "- Validate policy coverage and check expiration dates\n" +
                    "- Search policy documentation and claims procedures\n" +
                    "- Use Mistral AI to analyze damage photos instantly\n" +
                    "- Generate investigation reports\n" +
                    "- Send detailed claim information via email\n" +
                    "- Track claim timelines and identify processing bottlenecks\n\n" +
                    "🎯 Try this complete investigation workflow:\n" +
                    "1. \"Get details for claim CLM-2025-001007\"\n" +
                    "2. \"Check policy for this claim\"\n" +
                    "3. \"What coverage does auto insurance include?\"\n" +
                    "4. \"Analyze fraud risk for this claim\"\n" +
                    "5. \"Show damage photo for this claim\"\n" +
                    "6. \"Analyze this damage photo\"\n" +
                    "7. \"What's the claims filing procedure?\"\n" +
                    "8. \"Check compliance for this claim\"\n" +
                    "9. \"Generate investigation report for claim CLM-2025-001007\"\n" +
                    "10. \"Send the report by email\"\n\n" +
                    "Ready to complete a full claims investigation? What would you like to start with?";
```

??? note "Complete Workflow"
    Steps 1-10 demonstrate the complete claims investigation workflow from initial lookup through final report distribution. This mirrors the real-world process adjusters follow.

<cc-end-step lab="baf5" exercise="4" step="1" />

## Exercise 5: Test Communication Features

Now let's test the complete communication capabilities!

### Step 1: Run and Verify

1️⃣ Press **F5** in VS Code to start debugging.

2️⃣ Select **(Preview) Debug in Copilot (Edge)** if prompted.

3️⃣ The terminal should show normal initialization (no new indexes to create).

4️⃣ A browser window will open with Microsoft 365 Copilot.

<cc-end-step lab="baf5" exercise="5" step="1" />

### Step 2: Test Investigation Report Generation

1️⃣ In Microsoft 365 Copilot, say: 

```text
Generate investigation report for CLM-2025-001007
```

The agent should:

- Use `CommunicationPlugin.GenerateInvestigationReport`
- Gather comprehensive claim data from Knowledge Base
- Include vision analysis findings (if photo was analyzed)
- Include fraud risk assessment
- Format professional markdown report
- Return structured report with recommendations

**Expected Response:**

```
📊 Generating investigation report for CLM-2025-001007...

# 📋 Investigation Report: CLM-2025-001007
**Generated:** 2025-01-15 10:30:00 UTC
**Status:** Investigation Complete

[Comprehensive claim details including:]
- Claim overview
- Vision analysis findings
- Fraud risk assessment
- Documentation review
- Recommendations

**Report Prepared By:** Zava Insurance Claims Investigation System
**Next Steps:** Review findings and proceed with recommended claim resolution action.
```

!!! warning "OBO Token Configuration Error"
    If you receive the following error message after sending a message to the agent:
    
    ```
    Sign in for 'me' completed without a token. Status=Exception/OBO for 'BotServiceConnection' is not setup for exchangeable tokens. For Token Service handlers, the 'Scopes' field on the Azure Bot OAuth Connection should be in the format of 'api://{appid_uri}/{scopeName}'.
    ```
    
    Follow these steps to fix it:
    
    1. Go to **Azure Portal** and find your **Resource Group** containing your **Azure Bot**
    2. Open the Azure Bot resource and go to the **Configuration** tab
    3. Click on the **Microsoft Graph** Azure Active Directory v2 service provider
    4. **Take note** of the existing **Token Exchange URL** and **Scopes** values (you'll need them later)
    5. Replace the **Token Exchange URL** with: `https://graph.microsoft.com`
    6. Replace the **Scopes** with: `email openid profile User.Read Mail.Send`
    7. **Save** the changes
    8. Select the **Microsoft Graph** service provider again and click **Test Connection**
    9. **Grant all consent** when prompted
    10. Go back to the configuration and **restore** the original **Token Exchange URL** and **Scopes** values
    11. **Save** the changes again
    12. Return to your agent, **refresh the page**, and test again

<cc-end-step lab="baf5" exercise="5" step="2" />

### Step 3: Test Email Functionality

1️⃣ Try: 

```text
Send claim details for CLM-2025-001007 by email
```

The agent should:

- Retrieve claim details from Knowledge Base
- Create HTML-formatted email
- Send via Microsoft Graph API
- Use your email as recipient (default)

**Expected Response:**

```
Retrieving details for claim CLM-2025-001007...
Preparing email for [your-email]@[domain].com...
Sending email via Microsoft Graph...
✅ Email sent successfully!

✅ Success: Claim details for CLM-2025-001007 have been successfully sent to [your-email]@[domain].com. 
The email includes comprehensive claim information, documentation status, timeline, and recommendations.
```

2️⃣ Check your email inbox - you should receive a professional HTML-formatted claim details email.

3️⃣ Try sending to a specific recipient: 

```text
Send claim details for CLM-2025-001001 to john.doe@contoso.com
```

<cc-end-step lab="baf5" exercise="5" step="3" />

### Step 4: Test Complete End-to-End Workflow

Test the complete 10-step workflow from the welcome message:

```
1. Get details for claim CLM-2025-001007
2. Check policy for this claim
3. What coverage does auto insurance include?
4. Analyze fraud risk for this claim
5. Show damage photo for this claim
6. Analyze this damage photo
7. What's the claims filing procedure?
8. Check compliance for this claim
9. Generate investigation report for claim CLM-2025-001007
10. Send the report by email
```

The agent should seamlessly use all plugins (ClaimsPlugin → PolicyPlugin → VisionPlugin → CommunicationPlugin) to complete the full investigation workflow!

<cc-end-step lab="baf5" exercise="5" step="4" />

---8<--- "b-congratulations.md"

You have completed Lab BAF5 - Add Communication Capabilities!

You've learned how to:

- ✅ Create a CommunicationPlugin with email and report generation
- ✅ Integrate Microsoft Graph Mail API for sending professional emails
- ✅ Generate comprehensive investigation reports with aggregated data
- ✅ Update agent instructions to include communication workflows
- ✅ Test complete end-to-end claims investigation workflow

Your Zava Insurance Agent is now a complete claims processing solution with:

- **Search**: Claims and policies via Azure AI Search
- **Analysis**: AI vision with Mistral for damage assessment
- **Validation**: SharePoint policy document search
- **Communication**: Email reports and investigation summaries

🎉 **Congratulations!** You've built a production-ready AI agent! 🎊

<cc-next url="../06-add-copilot-api" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/05-add-communication" />
