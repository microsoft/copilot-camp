---
code: WIQ04
title: Work IQ REST Protocol
description: Learn how to consume Work IQ through the REST API using OAuth 2.0 authentication and multi-turn conversations with enterprise search grounding and optional web grounding.
tags: [work-iq, rest-api, oauth, powershell, bash, curl, api, multi-turn]
level: 300
time: 60
badge: WorkIQ-Expert
products: [Work IQ, Microsoft 365 Copilot, Entra ID]
created-date: 2026-07-28
last-edited-date: 2026-07-28
---

# Lab WIQ04 - Work IQ REST Protocol

<!--
<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe src="//www.youtube.com/embed/<VIDEO_ID>" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">
        </iframe>
        <div>Get a quick overview of the lab in this video.</div>
    </div>
</div>
-->

## Scenario

You're building a custom application that needs to integrate Microsoft 365 Copilot capabilities programmatically. Instead of relying on A2A protocols or MCP, you need direct REST API access to handle multi-turn conversations while respecting enterprise search and web search grounding. You'll set up OAuth 2.0 authentication using the Entra ID application from **Lab WIQ01**, then craft requests using both PowerShell (for Windows) and Bash with curl (for macOS/Linux), just for the sake of simulating the REST requests at low level and learning how Work IQ works over HTTP.

## Lab objectives

After completing this lab, you'll be able to:

- Understand Work IQ REST API capabilities and limitations
- Configure OAuth 2.0 token acquisition from Entra ID
- Create multi-turn conversations programmatically
- Send chat messages with different grounding strategies (enterprise-only, web-enabled, custom context)
- Use both PowerShell and Bash/curl to interact with Work IQ
- Toggle web search grounding per message for fine-grained control

## Exercise 1: Understanding Work IQ REST API

### Step 1: Learn REST API fundamentals

The **Work IQ REST API** enables your custom applications to have multi-turn conversations with Microsoft 365 Copilot while maintaining security and compliance boundaries. Unlike A2A (which is agent-to-agent), the REST API is designed for human/device-to-agent integration.

**Key capabilities:**

- **Enterprise search grounding:** Answers are grounded in Microsoft 365 data (emails, files, meetings, Teams)
- **Web search grounding:** Optional integration of public web search results
- **Multi-turn conversations:** Maintain context across multiple messages
- **Permission trimming:** Automatic respect for user permissions in Microsoft 365
- **Compliance-aware:** Ensures data classification and compliance settings are preserved

**REST API endpoints:**

- **Production:** `https://workiq.svc.cloud.microsoft/rest/conversations`
- **Beta:** `https://workiq.svc.cloud.microsoft/rest/beta/conversations` (not recommended for production)

**Key operations:**

1. **Create conversation:** `POST /conversations` — Initialize a new conversation session
2. **Chat (sync):** `POST /conversations/{id}/chat` — Send a message and receive a synchronous response
3. **Chat (stream):** `POST /conversations/{id}/chatoverstream` — Send a message and receive streaming updates

<cc-end-step lab="WIQ04" exercise="1" step="1" />

### Step 2: Understand authentication via OAuth 2.0

Work IQ REST API uses **OAuth 2.0 with delegated authentication**. This means:

- Your app acquires an **access token** on behalf of the signed-in user
- Requests run in the **user's security context**, not the app's
- The token must include the scope `api://workiq.svc.cloud.microsoft/WorkIQAgent.Ask`
- Tokens expire (typically 1 hour) and must be refreshed

**Token acquisition flow:**

1. Register an application in Entra ID (completed in **Lab WIQ01**, Exercise 4)
2. Obtain a refresh token via device code, authorization code, or client credentials flow
3. Exchange the refresh token for an access token
4. Include the access token in the `Authorization: Bearer {token}` header

**Prerequisites from Lab WIQ01:**

You should have:

- **Tenant ID:** Your Microsoft Entra tenant ID (GUID)
- **Client ID:** The application ID from the Entra ID app registration
- **Client Secret** (or certificate): The secret used for app authentication
- **Scope:** `api://workiq.svc.cloud.microsoft/WorkIQAgent.Ask`

If you don't have these values, return to **Lab WIQ01**, Exercise 4, to register your Entra ID application.

<cc-end-step lab="WIQ04" exercise="1" step="2" />

### Step 3: Understand grounding strategies

The REST API supports two grounding modes that you can control per message:

**Enterprise search grounding (enabled by default):**

- Searches Microsoft 365 data accessible to the user
- Respects security trimming and permissions
- Provides freshest results from organizational data
- Activated automatically for all messages

**Web search grounding (enabled by default, can be toggled):**

- Supplements enterprise data with public web search results
- Can be toggled off on a per-message basis
- Note: Toggling off web search is a single-turn action; you must respecify for each message

**Extra context support:**

- You can provide OneDrive or SharePoint files as additional context
- Files are passed as absolute URLs or SharePoint item IDs
- Copilot will include file content when processing your message

<cc-end-step lab="WIQ04" exercise="1" step="3" />

### Step 4: Understand limitations

Be aware of these REST API constraints:

- **No action generation:** Cannot create files, send emails, or schedule meetings
- **Text-only responses:** No graphics, charts, or code artifacts
- **No long-running tasks:** Requests prone to timeout if tasks exceed gateway limits
- **No tools:** Code interpreter and graphic art tools are unavailable
- **Semantic index limits:** Subject to Microsoft 365 Copilot semantic index constraints
- **AI-generated content:** Responses are AI-generated; verify accuracy before use

<cc-end-step lab="WIQ04" exercise="1" step="4" />

## Exercise 2: Set up OAuth 2.0 and create and manage conversations

### Step 1: Acquire access token

Use the OAuth 2.0 **authorization code flow** to obtain a delegated access token on behalf of the signed-in user.

First, open the following URL in a browser (replace placeholders), sign in, and copy the `code` value from the querystring of the redirect URL:

```text
https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/authorize?
  client_id={CLIENT_ID}
  &response_type=code
  &redirect_uri=https%3A%2F%2Fmicrosoft.github.io%2Fcopilot-camp%2F
  &scope=api%3A%2F%2Fworkiq.svc.cloud.microsoft%2FWorkIQAgent.Ask+offline_access
  &response_mode=query
```

Then exchange the authorization code for an access token.

**PowerShell (Windows):**

```powershell
# Replace the placeholders before running
$TENANT_ID = "{your-tenant-id}"
$CLIENT_ID = "{your-client-id}"
$CLIENT_SECRET = "{your-client-secret}"
$AUTH_CODE = "{code-from-redirect-url}"

$body = @{
    grant_type    = "authorization_code"
    client_id     = $CLIENT_ID
    client_secret = $CLIENT_SECRET
    code          = $AUTH_CODE
    redirect_uri  = "https://microsoft.github.io/copilot-camp/"
    scope         = "api://workiq.svc.cloud.microsoft/WorkIQAgent.Ask offline_access"
}

$response = Invoke-RestMethod `
    -Method Post `
    -Uri "https://login.microsoftonline.com/$TENANT_ID/oauth2/v2.0/token" `
    -ContentType "application/x-www-form-urlencoded" `
    -Body $body

$ACCESS_TOKEN = $response.access_token

Write-Host "Access token stored in `$ACCESS_TOKEN"
```

**Bash (macOS/Linux):**

```bash
# Replace the placeholders before running
TENANT_ID="{your-tenant-id}"
CLIENT_ID="{your-client-id}"
CLIENT_SECRET="{your-client-secret}"
AUTH_CODE="{code-from-redirect-url}"

RESPONSE=$(curl -s -X POST \
  "https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "client_id=${CLIENT_ID}" \
  -d "client_secret=${CLIENT_SECRET}" \
  -d "code=${AUTH_CODE}" \
  -d "redirect_uri=https://microsoft.github.io/copilot-camp/" \
  -d "scope=api://workiq.svc.cloud.microsoft/WorkIQAgent.Ask+offline_access")

ACCESS_TOKEN=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

echo "Access token stored in \$ACCESS_TOKEN"
```

The `ACCESS_TOKEN` variable is now available in your shell session and will be reused in the REST calls that follow.

<cc-end-step lab="WIQ04" exercise="2" step="1" />

### Step 2: Create a new conversation

Once you have a valid access token, you can start a multi-turn conversation with Work IQ.
First of all, create a conversation session:

**PowerShell (Windows):**

```powershell
# Create conversation
$conversationUrl = "https://workiq.svc.cloud.microsoft/rest/conversations"
$headers = @{
    "Authorization" = "Bearer $ACCESS_TOKEN"
    "Content-Type"  = "application/json"
}

$response = Invoke-RestMethod -Uri $conversationUrl -Method Post -Headers $headers -Body "{}"

# Display conversation details
$conversationId = $response.id
Write-Host "Conversation created successfully!"
Write-Host "Conversation ID: $conversationId"
Write-Host "Created: $($response.createdDateTime)"
Write-Host "Status: $($response.status)"
Write-Host "Turn Count: $($response.turnCount)"
```

**Bash (MasOS / Linux):**

```bash
# Create conversation
CONVERSATION_URL="https://workiq.svc.cloud.microsoft/rest/conversations"

CONVERSATION_RESPONSE=$(curl -s -X POST "$CONVERSATION_URL" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{}")

# Extract conversation ID
CONVERSATION_ID=$(echo "$CONVERSATION_RESPONSE" | jq -r '.id')
CREATED_TIME=$(echo "$CONVERSATION_RESPONSE" | jq -r '.createdDateTime')
STATUS=$(echo "$CONVERSATION_RESPONSE" | jq -r '.status')
TURN_COUNT=$(echo "$CONVERSATION_RESPONSE" | jq -r '.turnCount')

echo "Conversation created successfully!"
echo "Conversation ID: $CONVERSATION_ID"
echo "Created: $CREATED_TIME"
echo "Status: $STATUS"
echo "Turn Count: $TURN_COUNT"
```

**Expected response:**

Here you can see how the expected response should look like:

```json
{
  "id": "0d110e7e-2b7e-4270-a899-fd2af6fde333",
  "createdDateTime": "2025-09-30T15:28:46.1560062Z",
  "displayName": "",
  "status": "active",
  "turnCount": 0
}
```

<cc-end-step lab="WIQ04" exercise="2" step="2" />

### Step 3: Send a simple chat message

Now send your first message to the conversation. This message will be grounded in both enterprise search and web search (default behavior).

**PowerShell (Windows):**

```powershell
# Chat message
$chatUrl = "https://workiq.svc.cloud.microsoft/rest/conversations/$conversationId/chat"
$headers = @{
    "Authorization" = "Bearer $ACCESS_TOKEN"
    "Content-Type"  = "application/json"
}

# Define the message
$chatBody = @{
    message      = @{ text = "Who am I? What is my role in the company?" }
    locationHint = @{ timeZone = "America/New_York" }
} | ConvertTo-Json -Depth 3

# Send message
$chatResponse = Invoke-RestMethod -Uri $chatUrl -Method Post -Headers $headers -Body $chatBody

# Display response
Write-Host "Message sent successfully!"
Write-Host "Response: $($chatResponse.messages[-1].text)"
Write-Host "Turn Count: $($chatResponse.turnCount)"
```

**Bash (MacOS / Linux):**

```bash
# Chat endpoint
CHAT_URL="https://workiq.svc.cloud.microsoft/rest/conversations/${CONVERSATION_ID}/chat"

# Define the message
CHAT_BODY='{
    "message": {
      "text": "Who am I? What is my role in the company?"
    },
    "locationHint": {
      "timeZone": "America/New_York"
    }
  }'

# Send message
CHAT_RESPONSE=$(curl -s -X POST "$CHAT_URL" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$CHAT_BODY")

# Display response
LAST_MESSAGE=$(echo "$CHAT_RESPONSE" | jq -r '.messages[-1].text')
TURN_COUNT=$(echo "$CHAT_RESPONSE" | jq -r '.turnCount')

echo "Message sent successfully!"
echo "Response: $LAST_MESSAGE"
echo "Turn Count: $TURN_COUNT"
```

<cc-end-step lab="WIQ04" exercise="2" step="3" />

## Exercise 3: Chat with different grounding strategies

### Step 1: Chat with enterprise search only (web grounding disabled)

By default, Work IQ uses both enterprise and web search grounding. To focus on your organization's data only, disable web grounding:

**PowerShell (Windows):**

```powershell
$chatUrl = "https://workiq.svc.cloud.microsoft/rest/conversations/$conversationId/chat"
$headers = @{
    "Authorization" = "Bearer $ACCESS_TOKEN"
    "Content-Type"  = "application/json"
}

# Message with web grounding disabled
$chatBody = @{
    message      = @{ text = "What are our company policies on remote work?" }
    locationHint = @{ timeZone = "America/New_York" }
    contextualResources = @{
        webContext = @{
            isWebEnabled = $false
        }        
    }
} | ConvertTo-Json -Depth 3

$chatResponse = Invoke-RestMethod -Uri $chatUrl -Method Post -Headers $headers -Body $chatBody

Write-Host "Enterprise-only message sent!"
Write-Host "Response: $($chatResponse.messages[-1].text)"
```

**Bash (MacOS / Linux):**

```bash
ACCESS_TOKEN=$(get_access_token)
CHAT_URL="https://workiq.svc.cloud.microsoft/rest/conversations/${CONVERSATION_ID}/chat"

# Message with web grounding disabled
CHAT_BODY='{
  "message": "What are our company policies on remote work?",
  "locationHint": "America/New_York",
  "contextualResources": {
    "webContext": {
        "isWebEnabled": false
    }
  }
}'

CHAT_RESPONSE=$(curl -s -X POST "$CHAT_URL" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$CHAT_BODY")

LAST_MESSAGE=$(echo "$CHAT_RESPONSE" | jq -r '.messages[-1].text')

echo "Enterprise-only message sent!"
echo "Response: $LAST_MESSAGE"
```

**Note:** Web grounding is toggled per message. If you want it enabled again on the next message, you must omit the `contextualResources.webContext.isWebEnabled` parameter (default is `true`).

<cc-end-step lab="WIQ04" exercise="3" step="1" />

### Step 2: Chat with SharePoint library grounding (optional)

To provide additional context from a SharePoint Online document library, first create a SharePoint site and upload sample documents.

**Prerequisite: Create a SharePoint Online site**

1. Navigate to the [Microsoft 365 Portal](https://m365.cloud.microsoft/){target=_blank}
2. Click **Apps** and select **SharePoint**
3. Select **Create Site** > **Team site** > **Standard team** template > **Use Template**
4. Name your site (e.g., "Copilot Dev Camp - Knowledge Base") and select **Next**
5. Choose privacy and language settings, then **Create Site**
6. Select **Finish** when provisioning completes

**Prerequisite: Upload sample documents**

1. Download the sample documents [HR-documents.zip](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/HR-documents&filename=hr-documents){target=_blank}
2. Extract the zip file locally
3. On your SharePoint site, open the **Documents** library (select "See all")
4. Select **Upload** > **Files**
5. Select all documents from the extracted folder and click **Open**

!!! warning "Important: Wait for Semantic Indexing"
    After uploading documents, **wait 4-12 hours** before referencing them in Work IQ REST calls. The Microsoft 365 Semantic Index must process and index the documents before they become available for Copilot grounding.

<cc-end-step lab="WIQ04" exercise="3" step="2" />

### Step 3: Chat with SharePoint context (after Semantic Index is ready)

Once documents are indexed, provide SharePoint file URLs as context:

**PowerShell (Windows):**

```powershell
$chatUrl = "https://workiq.svc.cloud.microsoft/rest/conversations/$conversationId/chat"
$headers = @{
    "Authorization" = "Bearer $ACCESS_TOKEN"
    "Content-Type"  = "application/json"
}

# Message with SharePoint file context
# Note: Replace with your actual SharePoint site and document URLs
$chatBody = @{
    message      = @{ text = "Based on the HR documents, how can I improve my career?" }
    locationHint = @{ timeZone = "America/New_York" }
    contextualResources = @{
        files = @(
            @{
                uri = "https://tenant.sharepoint.com/sites/knowledge-base/Documents/Career Path Options.docx"
            },
            @{
                uri = "https://tenant.sharepoint.com/sites/knowledge-base/Documents/Career Path Options in the USA.pptx"
            }
        )
    }
} | ConvertTo-Json -Depth 10

$chatResponse = Invoke-RestMethod -Uri $chatUrl -Method Post -Headers $headers -Body $chatBody

Write-Host "SharePoint-grounded message sent!"
Write-Host "Response: $($chatResponse.messages[-1].text)"
```

**Bash (MacOS / Linux):**

```bash
ACCESS_TOKEN=$(get_access_token)
CHAT_URL="https://workiq.svc.cloud.microsoft/rest/conversations/${CONVERSATION_ID}/chat"

# Message with SharePoint file context
CHAT_BODY='{
  "message": "Based on the HR documents, what are the steps to request paid time off?",
  "contextualResources": {
    "files": [
        {
            "uri": "https://tenant.sharepoint.com/sites/knowledge-base/Documents/Career Path Options.docx"
        },
        {
            "uri": "https://tenant.sharepoint.com/sites/knowledge-base/Documents/Career Path Options in the USA.pptx"
        }
    ]
  }
}'

CHAT_RESPONSE=$(curl -s -X POST "$CHAT_URL" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$CHAT_BODY")

LAST_MESSAGE=$(echo "$CHAT_RESPONSE" | jq -r '.messages[-1].content')

echo "SharePoint-grounded message sent!"
echo "Response: $LAST_MESSAGE"
```

<cc-end-step lab="WIQ04" exercise="3" step="3" />

## Lab completion

Congratulations! You have successfully completed all four Work IQ labs and mastered multiple consumption patterns:

- **Lab WIQ01:** Set up Work IQ in your tenant and learned CLI consumption
- **Lab WIQ02:** Explored the Agent-to-Agent (A2A) protocol for agent-to-agent collaboration
- **Lab WIQ03:** Integrated Work IQ with MCP (Model Context Protocol) for LLM tooling
- **Lab WIQ04:** Consumed Work IQ via REST API for custom application integration

You now have a complete understanding of how to integrate Microsoft 365 Copilot and Work IQ into diverse scenarios—from command-line tooling to multi-agent systems to REST-based applications. You can confidently choose the right consumption pattern for your use case and implement secure, compliant integrations with your organization's data.

<cc-next />

<cc-award badgeId="WorkIQ-Expert" badgeName="Work IQ Expert" />
<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/work-iq/WIQ04" />
