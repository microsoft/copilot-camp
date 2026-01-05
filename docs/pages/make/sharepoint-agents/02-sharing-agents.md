# Lab MSA2 - Sharing SharePoint agents

---8<--- "msa-labs-prelude.md"

In this lab, you'll see how to share your SharePoint agents with others either using a direct link or within Microsoft Teams chats.

## Exercise 1: Sharing a SharePoint agent

Since every SharePoint agent is a file, you can easily share it with other people.

### Step 1: Sharing a SharePoint agent with people

When you have a SharePoint agent, whether it is local to a document library or approved and promoted at site level, you can select the **...** 1️⃣ beside the agent name and then select the option to **Share** 2️⃣ the agent.

![The context menu of a SharePoint agent with the option to "Share" the agent highlighted.](../../../assets/images/make/sharepoint-agents-02/share-spagent-01.png)

The modern file sharing User Experience of SharePoint Online will show up and you will be able to share the .agent file with others in your organization. As like as it happens with any other SharePoint Online file, you can choose the target people (user, groups, or emails) to share the agent with and you can either get a link to the file or send a sharing notification email. If you choose to copy a link, you can then paste it wherever you like.

![The sharing UX of SharePoint Online when sharing an agent with others. There are the field to search for targets of sharing. There is a field to write a text message to use in the body of the sharing notification email. And there are couple of buttons to "Copy link" or "Send" the shared resource.](../../../assets/images/make/sharepoint-agents-02/share-spagent-02.png)

The sharing link will bring target users straight to the agent dialog, so that they will able to interact with the agent directly within the immersive and full scren SharePoint agent experience.

<cc-end-step lab="msa2" exercise="1" step="1" />

### Step 2: Sharing a SharePoint agent via Microsoft Teams

An interesting option that you have is to share the agent via Microsoft Teams. In order to do that, you simply need to select the **...** 1️⃣ beside the agent name and then select the option to **Copy link for Teams** 2️⃣.

![The context menu of a SharePoint agent with the option to "Copy link for Teams" for the agent highlighted.](../../../assets/images/make/sharepoint-agents-02/share-spagent-03.png)

This will generate a sharing link for the agent file and copy it into the clipboard, as you can see from the confirmation message that you get back. In the confirmation message, you can also notice that the generated link is ready to be pasted in any group chat in Microsoft Teams.

![The confirmation dialog for the request to get a link for Teams for the agent. There is a clear text stating that you need to "Paste this link in a Teams group chat to add this agent" in Microsoft Teams.](../../../assets/images/make/sharepoint-agents-02/share-spagent-04.png)

In the dialog you can also select the **Settings** link to configure who can access the sharing link and to setup an optional expiration date for the link. Under the cover, a regular sharing link of SharePoint Online will be created.
Let's paste the link into a group chat in order to see what happens.

![The Microsoft Teams chat when pasting the link to the SharePoint agent. There is a link unfurling extension that renders the link with a nice looking card, providing information about the agent.](../../../assets/images/make/sharepoint-agents-02/share-spagent-05.png)

When you paste the link into a group chat, you will see a nice looking adaptive card providing information about the agent. This happens due to a custom link unfurling extension for Teams that handles the .agent files. Send the chat message with the link. The adaptive card will slightly change its rendering and will provide you a command to **Add to this chat** the agent and another command to **View details** about the agent.

![The Microsoft Teams chat rendering the adaptive card for the link to the agent. There is a command button to "Add to this chat" the agent and another command to "View details" about the agent.](../../../assets/images/make/sharepoint-agents-02/share-spagent-06.png)

Select the command **Add to this chat**, and wait few seconds. In case of successful result you will see a message confirming that the agent was added to the chat and you will also promptly see a welcome message from the agent itself. In case of any issue, the command button to **Add to this chat** will become disabled and the text will change to **Error adding to chat**. You can always try to refresh the chat and try again adding the agent.

![The Microsoft Teams chat informing that the agent was added and with the welcome message from the agent itself.](../../../assets/images/make/sharepoint-agents-02/share-spagent-07.png)

<cc-end-step lab="msa2" exercise="1" step="2" />

### Step 3: Interacting with the shared agent in Microsoft Teams

You can now interact with the agent within the group chat experience in Microsoft Teams. Whenever you want to trigger the agent, you simply need to at mention by name (@HR Agent) the agent and send it a prompt to process. For example, you can use a prompt like the following one:

```text
How can I improve my career?
```

![The Microsoft Teams chat when at mentioning @HR Agent in a new chat message.](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-01.png)

The SharePoint agent will process the prompt and provide an answer. However, for security reasons the answer will not go straight to the chat. You will need to evaluate its content and the documents referenced by the agent to produce the response. Select the **View response** command to evaluate the answer. 

![The Microsoft Teams chat when the agent replies back to a prompt. There is a command to "View response", which allows you to evaluate the AI-generated response before sending it to others.](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-02.png)

When you select **View response** a popup dialog shows up, allowing you to evaluate the whole response text and the referenced attachments, if any, prior to share the result with others. If you are ok with the answer, you can confirm and send the actual response message to the chat.

![A dialog providing a preview of the response from the agent. At the bottom of the dialog there are two commands: "Send" and "Don't send" to choose what to do with the current answers. There is also a checkbox that you can select to trust and send answer from the agent for the next 24 hours.](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-03.png)

Select the **Send** command to confirm that the response and its attachments are ok for you. You can also instruct Microsoft Teams to trust any further responses from the agent for the next 24 hours, to avoid too many confirmation requests. Select the **Don't send** command if you are not happy with the response or if you don't want to disclose one or more of the documents referenced by the agent in the response. Users in the group chat will see a message from the agent stating that "[YOUR USER DISPLAY NAME] reviewed my response to the request made and suggested that I don't share it at this time.".

![The message sent by the agent when the content provided is not approved.](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-04.png)

You can now enjoy the integration between Microsoft Teams and the SharePoint agent.

<cc-end-step lab="msa2" exercise="1" step="3" />

---8<--- "msa-congratulations.md"

You have completed Lab MSA2 - Sharing SharePoint agents!

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agents/02-sharing-agents" />