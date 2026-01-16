# Lab MCS9 - Connected Agents (Preview)

In this lab, you are going to understand how to create agents in Microsoft Copilot Studio that can communicate with other agents. You'll build a specialized Interview Scheduler agent that consumes data from the HR Candidate Management agent created in previous labs. The Interview Scheduler agent will automatically process candidate data and send interview meeting requests based on selected candidates, demonstrating how modular agents can work together to create comprehensive business solutions.

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/JFzxTCIoihY" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>Get a quick overview of the lab in this video.</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "mcs-labs-prelude.md"
    </div>
</div>

!!! note
    This lab builds on the previous labs, specifically [Lab MCS6 - Consuming an MCP server](../06-mcp){target=_blank}. You should have a working HR MCP server and the "HR Agent with MCP" agent configured from previous labs.

In this lab you will learn:

- How to create child agents in Microsoft Copilot Studio
- How to configure agent-to-agent communication
- How to design modular agent architectures for complex workflows
- How to implement handoff mechanisms between specialized agents
- How to coordinate multiple agents for end-to-end business processes

## Exercise 1: Understanding Agent-to-Agent Architecture

In this exercise you will understand the concepts behind agent-to-agent communication and design the architecture for your interview scheduling solution.

### Step 1: Reviewing Agent Communication Patterns

Microsoft Copilot Studio supports two primary patterns for agent collaboration:

1. **Child Agents**: Lightweight agents that live within a main agent, managed as part of the parent solution
2. **Connected Agents**: Independent, full-fledged agents that can be published and maintained separately

!!! info
    You can find additional information about connected agents in Microsoft Copilot Studio reading the article [Add other agents overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents){target=_blank}.


For this lab, you'll create a child agent architecture where:

- **Main Agent**: Interview Coordinator (orchestrates the overall process)
- **Child Agent**: Interview Scheduler (handles meeting creation and calendar management)
- **Connected Agent**: HR Candidate Management (the existing agent from previous labs)

This design allows for:

- Clear separation of concerns
- Reusability of the HR Candidate Management functionality
- Coordinated workflow execution
- Maintainable and scalable solution architecture

<cc-end-step lab="mcs9" exercise="1" step="1" />

### Step 2: Designing the Interview Process Workflow

The connected agents workflow you'll implement follows this sequence:

1. **User Request**: User asks to schedule an interview for a specific candidate
2. **Main Agent Processing**: Interview Coordinator validates the request and identifies the candidate
3. **Agent Handoff**: Main agent delegates to HR Candidate Management to retrieve candidate details
4. **Data Processing**: Candidate information is extracted and validated
5. **Child Agent Invocation**: Interview Scheduler child agent is triggered with candidate data
6. **Meeting Creation**: Child agent creates calendar meeting and sends invitation
7. **Confirmation**: User receives confirmation of scheduled interview

This workflow demonstrates key connected agents patterns:

- **Orchestration**: Main agent coordinates multiple sub-processes
- **Delegation**: Specific tasks are handed off to specialized agents
- **Data Flow**: Information flows seamlessly between agents
- **Event-Driven Processing**: Agents respond to specific triggers and conditions

<cc-end-step lab="mcs9" exercise="1" step="2" />

### Step 3: Ensuring Prerequisites

Before proceeding, ensure you have completed the following prerequisites:

- **Lab MCS6**: HR MCP server running and accessible via dev tunnel
- **Microsoft Graph Access**: Permissions to create calendar events and send emails
- **Sample Candidate Data**: At least 2-3 candidates in your HR system from previous labs

Verify that your HR MCP server is still running, and if not run the following command from the root folder of the MCP server project:

```console
dotnet run
```

And ensure your dev tunnel is active:

!!! important
    Replace the `hr-mcp` name suggested below with the unique name you used when working on lab [Lab MCS6 - Consuming an MCP server](../06-mcp){target=_blank}.

```console
devtunnel host hr-mcp
```

Also verify that you have some candidate data by testing the HR MCP server directly. The Interview Scheduler will need existing candidates to work with.

<cc-end-step lab="mcs9" exercise="1" step="3" />

## Exercise 2: Creating the Main Interview Coordinator Agent

In this exercise you will create the main agent that orchestrates the interview scheduling process and coordinates with other agents.

### Step 1: Creating the Interview Coordinator Agent

Open a browser and navigate to [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} using your work account.

Select the `Copilot Dev Camp` environment, then select **Create** → **New Agent** to create a new agent.

Choose to **Configure** and define your main coordinator agent with these settings:

- **Name**: 

```text
Interview Coordinator
```

- **Description**: 

```text
Main agent that coordinates interview scheduling by working with HR candidate 
management and interview scheduling child agents to create comprehensive interview workflows
```
- **Select your agent's model**: GPT-5 Chat

- **Instructions**: 

```text
You are the Interview Coordinator, responsible for managing end-to-end interview 
scheduling processes. Your role includes:

1. Understanding user requests for interview scheduling
2. Coordinating with the HR Candidate Management agent to retrieve candidate information
3. Delegating to the Interview Scheduler child agent for meeting creation
4. Providing comprehensive feedback to users about scheduled interviews

When a user requests to schedule an interview:
- First, identify and validate the candidate using the HR system
- Extract necessary candidate details (name, email, current role, skills)
- Coordinate with the Interview Scheduler to create the meeting
- Confirm successful scheduling with relevant details

Always ensure proper validation of candidate data and provide clear communication 
throughout the process. Handle errors gracefully and provide informative feedback 
when coordination between agents fails.
```

In the **Knowledge** section, you can optionally add documents with interview scheduling guidelines or company-specific HR policies. For this lab, we'll rely on the agent's built-in capabilities and the integration with other agents.

![The Interview Coordinator agent configuration showing the "GPT-5 Chat" model.](../../../assets/images/make/copilot-studio-09/coordinator-agent-01.png)

Select **Save** in the sections you edited to upate your coordinator agent configuration.

<cc-end-step lab="mcs9" exercise="2" step="1" />

### Step 2: Configure agent settings

After creating the agent, configure its orchestration capabilities and knowledge settings. Select the **Settings** command in the upper right corner and configure the agent.

In the **Orchestration** section, ensure that **Use generative AI orchestration for your agent's responses?** is configured with value `Yes - Responses will be dynamic, using available tools and knowledge as appropriate`. This allows the agent to intelligently coordinate between different child agents and connected agents.

In the **Knowledge** section accordingly to the following settings:

- **Use general knowledge**: off
- **Use information from the web**: off

![The "Generative AI" settings for the agent, with general knowledge and information from the web turned off.](../../../assets/images/make/copilot-studio-09/coordinator-agent-02.png)

Select **Save** to confirm the configuration.

<cc-end-step lab="mcs9" exercise="2" step="2" />

### Step 3: Connecting to the HR Candidate Management Agent

Your Interview Coordinator needs to communicate with the existing HR agent to retrieve candidate information. Navigate to the 1️⃣ **Agents** section and select 2️⃣ **Add**.

![The tab to connect an agent to other agents. There is an "Add" command to add an agent to the current one.](../../../assets/images/make/copilot-studio-09/connect-agent-01.png)

A new dialog appears, allowing you to choose between any of the following options:

- **New child agent**: to create a new child agent
- **Select an agent in your environment**: to select an already existing agent defined with Copilot Studio
- **Connect to an external agent**: to connect to any of the following external agents (preview)
    - **Microsoft Fabric**: connect to a Fabric Data Agent
    - **Microsoft Foundry**: connect to an agent in Microsoft Foundry
    - **Microsoft 365 Agents SDK**: connect to an agent built with Microsoft 365 Agents SDK
    - **Agent2Agent**: connect to an agent using A2A protocol

![The dialog to select the kind of agent to connect. The available options are "New child agent", already existing Copilot Studio agents, and "Connect to an external agent".](../../../assets/images/make/copilot-studio-09/connect-agent-02.png)

From the list of available Copilot Studio agents, select the **HR Candidate Management** agent (or similar name) that you created in previous labs. If you don't see it, ensure it's published and configured to allow connections from other agents. To check if the **HR Candidate Management** agent is configured to allow connections from other agents, edit the agent, go to **Settings**, and check that the option **Let other agents connect to and use this one** is enabled in the **Connected agents** section, like illustrated in the following screenshot.

![The setting to allow connections from other agents highlighted in the agent's settings.](../../../assets/images/make/copilot-studio-09/connect-agent-settings-01.png)

Once you selected the **HR Canidated Management** agent, configure the connection:

- **Description**: Update the description to be more specific for this context:

```text
HR system integration for retrieving and managing candidate information during 
interview scheduling processes. Provides candidate lookup, data validation, and 
comprehensive candidate details.
```

The description is used by the main agent to understand when the connected agent should be invoked. Try to be specific and clear in the description.

- **Pass conversation history**: Keep this enabled to maintain context during agent handoffs

![The agent connection configuration showing the HR Candidate Management agent being connected to the Interview Coordinator. There is a textbox to specificy a "Description" for the connected agent to provide a more specific context.](../../../assets/images/make/copilot-studio-09/connect-agent-04.png)

Select **Add and configure** to establish the connection between agents. Once the connected agent is defined and configured, you can see it in the list of **Agents** for the current agent and you are presented with a page to manage the configuration of the connected agent.

![The agent connection configuration showing the HR Candidate Management agent being connected to the Interview Coordinator. There are fields to configure "Name", "Description", whether to pass the conversation history to the connected agent or not, input fields, and completion settings.](../../../assets/images/make/copilot-studio-09/connect-agent-result-01.png)

<cc-end-step lab="mcs9" exercise="2" step="3" />

## Exercise 3: Creating the Interview Scheduler Child Agent

In this exercise you will create a specialized child agent that handles the meeting creation and calendar management aspects of interview scheduling.

### Step 1: Creating the Interview Scheduler Child Agent

In your Interview Coordinator agent, navigate to the 1️⃣ **Agents** section and select 2️⃣ **Add an agent**.

![The list of agents connected to the main agent. There is the "HR Candidate Management" one enabled, with relationship status of "Connected", and with trigger value "By agent". There is also the "Add an agent" command highlighted to add a new agent.](../../../assets/images/make/copilot-studio-09/connect-agent-05.png)

Select **New child agent** to create a new child agent.

![The dialog to select the kind of agent to connect. The available options are "New child agent", already existing Copilot Studio agents, and "Connect to an external agent".](../../../assets/images/make/copilot-studio-09/child-agent-01.png)

Configure the child agent with these settings:

- **Name**: 

```text
Interview Scheduler
```

- **When will this be used?**: Select **The agent chooses** to allow the agent to respond to coordination requests from the main agent

- **Description**:

```text
Helps scheduling an interview with a candidate. Requires information like the email
of the candidate and the date and time of the meeting.
```

- **Instructions**: 

```text
You are the Interview Scheduler, a specialized agent focused on creating and managing 
interview meetings. When invoked by the Interview Coordinator, you:

1. Process candidate information received from the main agent
2. Create appropriate calendar meeting invitations
3. Include relevant candidate details in meeting descriptions
4. Send meeting invitations to appropriate stakeholders
5. Provide confirmation details back to the coordinator

For each interview scheduling request:
- Create a 1-hour meeting slot (suggest next business day if no specific time provided)
- Include candidate name, role, and key skills in the meeting title and description
- Invite the requesting user and any additional specified interviewers
- Set appropriate meeting location (in-person, Teams, etc.)
- Include candidate resume/profile information in meeting notes

Always confirm successful meeting creation with meeting details including date, time, 
attendees, and meeting link if applicable.
```

![The child agent creation page showing the Interview Scheduler configuration with message-based triggering.](../../../assets/images/make/copilot-studio-09/child-agent-02.png)

Select the **Save** command in the upper right corner of the screen to save the new child agent. You should see a green confirmation message stating that the child agent was created.

<cc-end-step lab="mcs9" exercise="3" step="1" />

### Step 2: Configuring Meetings Management Integration

To enable the Interview Scheduler to create calendar meetings, you need to add a specific MCP server integration for meetings management.

![The dialog to search for the "Meeting Management MCP Server" in the list of available MCP servers. There is a search filter for "Calendar" applied in the dialog.](../../../assets/images/make/copilot-studio-09/child-agent-03.png)

In the **Tools** section of the **Interview Scheduler** child agent, select **Add**.

1. Choose 1️⃣ **Model Context Protocol** to filter the available MCP servers
1. Search for 2️⃣ **Calendar** in the search box and hit the 3️⃣ search command
1. Select the 4️⃣ **Meeting Management MCP Server**
1. Connect to the Meeting Management MCP Server
1. Once the connection is configured, select **Add and configure** to finalize the configuration of the tool

![The dialog to connect to the Meeting Management MCP Server. There is a command "Add and configure" to add the MCP server to the child agent and a command to "Cancel" the current operation.](../../../assets/images/make/copilot-studio-09/child-agent-04.png)

Once the connection is established and the MCP server is added to the child agent, you will see the panel with the configuration of the new tool. Update the **Name** accordingly to the following value:

```text
Manage meetings
```

This integration allows the child agent to:

- Create calendar events
- Send meeting invitations
- Manage meeting details and attendees

<cc-end-step lab="mcs9" exercise="3" step="2" />

### Step 3: Finalizing Child Agent Configuration

Go back to the **Overview** tab of the child **Interview Scheduler** agent, selecting the left arrow beside the name of the tool, and complete the configuration of your **Interview Scheduler** child agent:

![The child agent additional configuration showing priority settings and activation conditions.](../../../assets/images/make/copilot-studio-09/child-agent-06.png)

1. Open the **Details** section, expand the **Advanced** panel and set the **Priority** to **1** to ensure this agent has high priority for interview scheduling tasks

1. **Condition**: Optionally, add conditions to limit when this agent activates. For example, you might want it to only activate for messages containing interview-related keywords

1. Ensure the **Enabled** toggle is turned on

1. Select **Save** to create the child agent

Your Interview Scheduler child agent is now configured and ready to handle meeting creation tasks when invoked by the main Interview Coordinator agent.

<cc-end-step lab="mcs9" exercise="3" step="3" />

## Exercise 4: Implementing Connected Agents Workflows

In this exercise you will implement and test the complete connected agents workflow for interview scheduling.

### Step 1: Configuring Agent References in Instructions

To enable proper agent coordination, you need to reference the child agent and connected agent in your main agent's instructions.

Navigate to the **Overview** section of your Interview Coordinator agent and update the **Instructions** field selecting the **Edit** command:

1. Place your cursor in the instructions text where you want to reference agents
1. Type `/` to open the reference menu
1. Select the **Interview Scheduler** child agent from the list
1. Also reference the **HR Candidate Management** connected agent

![The Instructions field browsing for both connected and child agents when pressing "/" in the text of the instructions.](../../../assets/images/make/copilot-studio-09/coordinator-agent-03.png)

Your updated instructions should look like this:

```text
You are the Interview Coordinator, responsible for managing end-to-end interview 
scheduling processes. Your role includes:

1. Understanding user requests for interview scheduling
2. Coordinating with /HR Candidate Management agent to retrieve candidate information
3. Delegating to /Interview Scheduler child agent for meeting creation
4. Providing comprehensive feedback to users about scheduled interviews

When a user requests to schedule an interview:
- First, use /HR Candidate Management to identify and validate the candidate
- Extract necessary candidate details (name, email, current role, skills)
- Coordinate with /Interview Scheduler to create the meeting with candidate details using the ID of the calendar with name "main" of the current user
- Confirm successful scheduling with relevant details

Always ensure proper validation of candidate data and provide clear communication 
throughout the process. Handle errors gracefully and provide informative feedback 
when coordination between agents fails.
```

![The Instructions field showing agent references using the slash notation for both connected and child agents.](../../../assets/images/make/copilot-studio-09/coordinator-agent-04.png)

Select **Save** to update the instructions with agent references.

<cc-end-step lab="mcs9" exercise="4" step="1" />

## Exercise 5: Testing the agent

In this exercise you will test the agent scheduling a real interview in your agenda.

### Step 1: Testing Agent-to-Agent Communication

Now test the complete agent-to-agent workflow to ensure proper coordination between all components.

#### Test the Interview Coordinator

In the test panel, try a request like:

```text
Retrieve information about candidate alice.johnson@example.com and schedule an interview with her for next Monday 10am.
```

#### Observe Agent Coordination

Watch in the test panel as the agent:

- Processes your request
- Calls the HR Candidate Management agent to find Alice Johnson
- Retrieves candidate details
- Invokes the Interview Scheduler child agent
- Creates the calendar meeting, requesting you to connect to the Meeting Management MCP server if it is the first time you use it
- Provides confirmation

![The test panel showing the agent coordination workflow with multiple agents working together to schedule an interview.](../../../assets/images/make/copilot-studio-09/coordinator-agent-05.png)

And in the following screenshot you can see a sample of the interview meeting scheduled by the agent relying on both the child and the connected agent.

![The interview meeting scheduled in the calendar of the current user. There are information about the interview in the body of the meeting. The meeting itselft has been sent to the current user and to the candidate's e-mail address.](../../../assets/images/make/copilot-studio-09/coordinator-agent-06.png)

<cc-end-step lab="mcs9" exercise="5" step="1" />

---8<--- "mcs-congratulations.md"

You have completed Lab MCS9 - Agent to Agent Communication!

In this lab, you learned how to:

- Design and implement connected agents architectures
- Create child agents for specialized tasks within a main agent solution
- Connect existing agents to enable cross-agent data sharing and coordination
- Implement complex workflows that span multiple specialized agents

Your Interview Coordinator agent now demonstrates advanced agent orchestration patterns, coordinating between the HR Candidate Management system and specialized Interview Scheduler functionality to deliver comprehensive interview scheduling automation.

The connected agents patterns you've learned can be applied to many other business scenarios where complex workflows benefit from modular, specialized agents working together to deliver end-to-end solutions.

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/09-connected-agents" />
