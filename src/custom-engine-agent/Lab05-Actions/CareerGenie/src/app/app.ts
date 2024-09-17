import { CardFactory, MemoryStorage, MessageFactory,TurnContext } from "botbuilder";
import * as path from "path";
import config from "../config";
// See https://aka.ms/teams-ai-library to learn more about the Teams AI library.
import { AuthError, ActionPlanner, OpenAIModel, PromptManager, AI, PredictedSayCommand, Application, TurnState, DefaultConversationState } from "@microsoft/teams-ai";
import fs from 'fs';
import { createResponseCard } from './card';
import { ensureListExists, getCandidates, setCandidates, deleteList, sendLists } from "./actions";
import { Client } from "@microsoft/microsoft-graph-client";
// Create AI components
const model = new OpenAIModel({
  azureApiKey: config.azureOpenAIKey,
  azureDefaultDeployment: config.azureOpenAIDeploymentName,
  azureEndpoint: config.azureOpenAIEndpoint,

  useSystemMessages: true,
  logRequests: true,
  azureApiVersion: '2024-02-15-preview'
});

const prompts = new PromptManager({
  promptsFolder: path.join(__dirname, "../prompts"),
});

const planner = new ActionPlanner({
  model,
  prompts,
  defaultPrompt: choosePrompt,
});

async function choosePrompt(context){
  if (context.activity.text.includes('list')){
    const template = await prompts.getPrompt('monologue');
    return template;
  }
  else {
    const template = await prompts.getPrompt('chat');
    const skprompt = fs.readFileSync(path.join(__dirname, '..', 'prompts', 'chat', 'skprompt.txt'));

    const dataSources = (template.config.completion as any)['data_sources'];

    dataSources.forEach((dataSource: any) => {
      if (dataSource.type === 'azure_search') {
        dataSource.parameters.authentication.key = config.azureSearchKey;
        dataSource.parameters.endpoint = config.azureSearchEndpoint;
        dataSource.parameters.indexName = config.indexName;
        dataSource.parameters.embedding_dependency.deployment_name =
          config.azureOpenAIEmbeddingDeploymentName;
        dataSource.parameters.role_information = `${skprompt.toString('utf-8')}`;
      }
    });

    return template;
  }
}

// Define storage and application
const storage = new MemoryStorage();
const app = new Application({
  storage,
  authentication: {settings: {
    graph: {
      scopes: ['User.Read', 'Mail.Send'],
      msalConfig: {
        auth: {
          clientId: config.aadAppClientId!,
          clientSecret: config.aadAppClientSecret!,
          authority: `${config.aadAppOauthAuthorityHost}/common`
        }
      },
      signInLink: `https://${config.botDomain}/auth-start.html`,
      endOnInvalidMessage: true
    }
  }},
  ai: {
    planner,
    //feedback loop is enabled
    enable_feedback_loop: true
  },
});
// Strongly type the applications turn state
interface ConversationState extends DefaultConversationState {
  lists: Record<string, string[]>;
}
export type ApplicationTurnState = TurnState<ConversationState>;

app.authentication.get('graph').onUserSignInSuccess(async (context: TurnContext, state: ApplicationTurnState) => {
  // Successfully logged in
  await context.sendActivity('Successfully logged in');
  const token = state.temp.authTokens['graph'];
  await context.sendActivity(`Hello ${await getUserDisplayName(token)}`);  
  await context.sendActivity(`You said before the AuthFlow started: ${context.activity.text}`);  
});

app.authentication
.get('graph')
.onUserSignInFailure(async (context: TurnContext, _state: ApplicationTurnState, error: AuthError) => {
        // Failed to login
        await context.sendActivity('Failed to login');
        await context.sendActivity(`Error message: ${error.message}`);
    });

    // Listen for user to say '/reset' and then delete conversation state
app.message('/reset', async (context: TurnContext, state: ApplicationTurnState) => {
  state.deleteConversationState();
  await context.sendActivity(`Ok I've deleted the current conversation state.`);
});

app.message('/signout', async (context: TurnContext, state: ApplicationTurnState) => {
  await app.authentication.signOutUser(context, state);

  // Echo back users request
  await context.sendActivity(`You have signed out`);
});

// feedback loop handler
app.feedbackLoop(async (_context, _state, feedbackLoopData) => {
  if (feedbackLoopData.actionValue.reaction === 'like') {
      console.log('👍' + ' ' + feedbackLoopData.actionValue.feedback!);
  } else {
      console.log('👎' + ' ' + feedbackLoopData.actionValue.feedback!);
  }
});

// customize citation with PredictedSayCommand and AdaptiveCard
app.ai.action<PredictedSayCommand>(AI.SayCommandActionName, async (context, state, data, action) => {
  let activity;
  if (data.response.context && data.response.context.citations.length > 0 ) {
      const attachment = CardFactory.adaptiveCard(createResponseCard(data.response));
      activity = MessageFactory.attachment(attachment);
  }
  else {
      activity = MessageFactory.text(data.response.content);
  }

  activity.entities = [
    {
        type: "https://schema.org/Message",
        "@type": "Message",
        "@context": "https://schema.org",
        "@id": "",
        // Generated by AI label
        additionalType: ["AIGeneratedContent"],
        // Sensitivity label
        usageInfo: {
          "@type": "CreativeWork",
          name: "Confidential",
          description: "Sensitive information, do not share outside of your organization.",
        }
    },
    
  ];
  activity.channelData = {
    feedbackLoopEnabled: true
  };

  await context.sendActivity(activity);

  return "success";
 
});

export async function getUserDisplayName(token: string): Promise<string | undefined> {
  let displayName: string | undefined;

  const client = Client.init({
    authProvider: (done) => {
      done(null, token);
    }
  });

  try {
    const user = await client.api('/me').get();
    displayName = user.displayName;
  } catch (error) {
    console.log(`Error calling Graph SDK in getUserDisplayName: ${error}`);
  }

  return displayName;
}


// Register action handlers
interface ListOnly {
  list: string;
}

interface ListAndCandidates extends ListOnly {
  Candidates?: string[];
}

app.ai.action('createList', async (context: TurnContext, state: ApplicationTurnState, parameters: ListAndCandidates) => {
  ensureListExists(state, parameters.list);
  if (Array.isArray(parameters.Candidates) && parameters.Candidates.length > 0) {
      await app.ai.doAction(context, state, 'addCandidates', parameters);
      return `List created and Candidates added. Summarize your action.`;
  } else {
      return `List created. Summarize your action.`;
  }
});

app.ai.action('deleteList', async (context: TurnContext, state: ApplicationTurnState, parameters: ListOnly) => {
  deleteList(state, parameters.list);
  return `list deleted. Summarize your action.`;
});

app.ai.action('addCandidates', async (context: TurnContext, state: ApplicationTurnState, parameters: ListAndCandidates) => {
  const Candidates = getCandidates(state, parameters.list);
  Candidates.push(...(parameters.Candidates ?? []));
  setCandidates(state, parameters.list, Candidates);
  return `Candidates added. Summarize your action.`;
});

app.ai.action('removeCandidates', async (context: TurnContext, state: ApplicationTurnState, parameters: ListAndCandidates) => {
  const Candidates = getCandidates(state, parameters.list);
  (parameters.Candidates ?? []).forEach((candidate: string) => {
      const index = Candidates.indexOf(candidate);
      if (index >= 0) {
          Candidates.splice(index, 1);
      }
  });
  setCandidates(state, parameters.list, Candidates);
  return `Candidates removed. Summarize your action.`;
});

app.ai.action('sendLists', async (context: TurnContext, state: ApplicationTurnState, parameters: ListAndCandidates) => {
  await sendLists(state, state.temp.authTokens['graph']);
  return `Email sent to HR. Summarize your action.`;
});

export default app;
