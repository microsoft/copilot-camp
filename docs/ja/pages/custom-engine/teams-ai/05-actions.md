---
search:
  exclude: true
---
# ラボ BTA5 - 複雑なタスクを処理するアクションの追加

このラボでは次のことを行います。

- アクションとは何か、そしてそれを使って複雑なタスクを処理する方法を学習する  
- カスタムエンジン エージェントにマルチプロンプトを統合し、アクションを処理できるようにする  
- カスタムエンジン エージェントにアクションを実装する  
- Microsoft Graph とアクションを組み合わせてワークフローを自動化する  


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/bfULaDnpAXY" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## はじめに

いよいよ Career Genie にアクションを追加し、複雑なタスクやワークフローを処理できるようにします。このラボでは、候補者のリストを扱う新しいプロンプトを Career Genie のロジックに統合します。これにより、Career Genie で候補者を検索するときにリストを作成して名前を追加できるようになります。作成が終わったら、そのリストを HR に送信して面接日程を調整することも可能です。これらはすべて、Career Genie に実装するアクションで処理されます。それでは始めましょう。

???+ info "カスタムエンジン エージェントにおけるアクションとは？"
    AI システムにおけるアクションは、コードでいうところの基本的な関数やメソッドに相当します。ユーザーの入力に基づき、システムが実行できる特定のタスクです。アクションは AI がさまざまなタスクを達成するための構成要素であり、AI システムはユーザーの要求に応じてどのアクションを実行するかを判断します。

    例として、アクションには次のようなものがあります。

    * 新しいリストを作成する  
    * リストを削除する  
    * 既存のリストに項目を追加する  
    * 既存のリストから項目を削除する  

    ユーザーが AI システムと対話すると、システムはプロンプトを解釈し、適切なアクションを選択して実行します。ユーザーのニーズに基づいて、AI が作業に最適なツールを選ぶ便利なツールボックスのようなものです。

## 演習 1: アクション対応の新規プロンプト

この演習では、アクションを処理するための新しいプロンプトを「prompts」フォルダーに作成します。

### 手順 1: 「monologue」プロンプトの作成

プロジェクトで `src/prompts/` に移動し、 **monologue** という名前の新しいフォルダーを追加します。`src/prompts/monologue/` フォルダーに **config.json** という名前の新規ファイルを作成し、次のコード スニペットを貼り付けてください。

```json
{
  "schema": 1.1,
  "description": "A bot that can chat with users",
  "type": "completion",
  "completion": {
    "completion_type": "chat",
    "include_history": true,
    "include_input": true,
    "max_input_tokens": 2800,
    "max_tokens": 1000,
    "temperature": 0.9,
    "top_p": 0.0,
    "presence_penalty": 0.6,
    "frequency_penalty": 0.0
  },
  "augmentation": {
      "augmentation_type": "monologue"
  }
}
```

!!! tip "`config.json` の `augmentation` について"
    Augmentation はプロンプトに特定の指示を自動で追加し、プロンプトエンジニアリングを簡素化します。augmentation を使用すると、AI にマルチステップ タスク（sequence）を処理させるか、一歩ずつ考えさせる（monologue）かを設定できます。

`src/prompts/monologue/` フォルダーに **skprompt.txt** というファイルを作成し、次のテキストを貼り付けてください。

```
You are a career specialist named "Career Genie" that helps Human Resources team who can manage lists of Candidates. 
You are friendly and professional. You like using emojis where appropriate.
Always share the lists in bullet points.

rules:
- only create lists the user has explicitly asked to create.
- only add Candidates to a list that the user has asked to have added.
- if multiple lists are being manipulated, call a separate action for each list.
- if Candidates are being added and removed from a list, call a separate action for each operation.
- if user asks for a summary, share all the lists and candidates. 
- only send an email to HR if user has explicitly asked to send.

Current lists:
{{$conversation.lists}}
```

同じフォルダーに **actions.json** というファイルを作成し、次のコード スニペットを貼り付けます。

```json
[
    {
        "name": "createList",
        "description": "Creates a new list with an optional set of initial Candidates",
        "parameters": {
            "type": "object",
            "properties": {
                "list": {
                    "type": "string",
                    "description": "The name of the list to create"
                },
                "Candidates": {
                    "type": "array",
                    "description": "The Candidates to add to the list",
                    "Candidates": {
                        "type": "string"
                    }
                }
            },
            "required": [
                "list"
            ]
        }
    },
    {
        "name": "deleteList",
        "description": "Deletes a list",
        "parameters": {
            "type": "object",
            "properties": {
                "list": {
                    "type": "string",
                    "description": "The name of the list to delete"
                }
            },
            "required": [
                "list"
            ]
        }
    },
    {
        "name": "addCandidates",
        "description": "Adds one or more Candidates to a list",
        "parameters": {
            "type": "object",
            "properties": {
                "list": {
                    "type": "string",
                    "description": "The name of the list to add the item to"
                },
                "Candidates": {
                    "type": "array",
                    "description": "The Candidates to add to the list",
                    "Candidates": {
                        "type": "string"
                    }
                }
            },
            "required": [
                "list",
                "Candidates"
            ]
        }
    },
    {
        "name": "removeCandidates",
        "description": "Removes one or more Candidates from a list",
        "parameters": {
            "type": "object",
            "properties": {
                "list": {
                    "type": "string",
                    "description": "The name of the list to remove the item from"
                },
                "Candidates": {
                    "type": "array",
                    "description": "The Candidates to remove from the list",
                    "Candidates": {
                        "type": "string"
                    }
                }
            },
            "required": [
                "list",
                "Candidates"
            ]
        }
    }
]
```

<cc-end-step lab="bta5" exercise="1" step="1" />

## 演習 2: プランナーでプロンプトを選択するロジックの実装

この演習では、ユーザープロンプトを確認し、「chat」 と 「monologue」 のいずれを使用するかを決定する関数を作成します。

### 手順 1: プランナーに `defaultPrompt` 関数を作成

プロジェクトの `src/app/app.ts` ファイルを開き、次の関数を追加します。

```javascript
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
```

!!! tip "`choosePrompt` 関数を確認"
    `choosePrompt` 関数は、ユーザープロンプトに "list" が含まれているかどうかをチェックします。含まれていれば **monologue** プロンプトを返し、含まれていなければ現在のデフォルト プロンプト **chat** を返します。

`src/app/app.ts` ファイルで `planner` を見つけ、 **defaultPrompt** に割り当てられているコードを削除します。その後、`choosePrompt` 関数を **defaultPrompt** として定義します。最終的なプランナーは次のようになります。

```javascript
const planner = new ActionPlanner({
  model,
  prompts,
  defaultPrompt: choosePrompt,
});
```

<cc-end-step lab="bta5" exercise="2" step="1" />

## 演習 3: アプリにアクションを実装

この演習では、アクション用の関数を作成し、アクション ハンドラーをアプリに登録します。

### 手順 1: `ConversationState` を更新し、各アクションの関数を定義

`src/app/app.ts` で `@microsoft/teams-ai` のインポートを **DefaultConversationState** に更新します。インポートの最終形は次のとおりです。

```javascript
import { AuthError, ActionPlanner, OpenAIModel, PromptManager, AI, PredictedSayCommand, Application, TurnState, DefaultConversationState } from "@microsoft/teams-ai";
```

`src/app/app.ts` で **ConversationState** と **ApplicationTurnState** を探し、次のコードに置き換えます。

```javascript
// Strongly type the applications turn state
interface ConversationState extends DefaultConversationState {
  lists: Record<string, string[]>;
}
export type ApplicationTurnState = TurnState<ConversationState>;
```

`src/app/` フォルダーに **actions.ts** というファイルを作成し、アクション用の関数を定義する次のソースコードを追加します。

```javascript
import { ApplicationTurnState } from './app';

function getCandidates(state: ApplicationTurnState, list: string): string[] {
    ensureListExists(state, list);
    return state.conversation.lists[list];
}
  
function setCandidates(state: ApplicationTurnState, list: string, Candidates: string[]): void {
    ensureListExists(state, list);
    state.conversation.lists[list] = Candidates ?? [];
}

function ensureListExists(state: ApplicationTurnState, listName: string): void {
    if (typeof state.conversation.lists != 'object') {
        state.conversation.lists = {};
    }

    if (!Object.prototype.hasOwnProperty.call(state.conversation.lists, listName)) {
        state.conversation.lists[listName] = [];
    }
}
  
function deleteList(state: ApplicationTurnState, listName: string): void {
    if (
        typeof state.conversation.lists == 'object' &&
        Object.prototype.hasOwnProperty.call(state.conversation.lists, listName)
    ) {
        delete state.conversation.lists[listName];
    }
}

export { getCandidates, setCandidates, ensureListExists, deleteList };
```

<cc-end-step lab="bta5" exercise="3" step="1" />

### 手順 2: アクション ハンドラーをアプリに登録

`src/app/app.ts` に移動し、ファイルの先頭に次のアクションのインポートを追加します。

```javascript
import { ensureListExists, getCandidates, setCandidates, deleteList } from "./actions";
```

その後、AI システムでアクション ハンドラーを登録するため、次のコード スニペットを `src/app/app.ts` に追加します。

```javascript
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

```

<cc-end-step lab="bta5" exercise="3" step="2" />

### 手順 3: 新しいアクションでアプリをテスト

Visual Studio Code の **Run and Debug** タブから **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択し、アプリのデバッグを開始します。Microsoft Teams がブラウザーで開きます。アプリの詳細が表示されたら **Add** を選択し、チャットを開始してください。

!!! tip "ローカルでのテストのヒント"
    これまでアプリに実装した Teams AI ライブラリ機能は Teams App Test Tool では完全に動作しない場合があります。必ず Teams 上でローカルテストとデバッグを行ってください。

フローを理解するために、次の順で質問してみましょう。

- Hello  
- Can you suggest candidates who have experience in .NET?  
- Great, add Isaac Talbot in the .NET Developer Candidates list  
- Add Anthony Ivanov in the same list with Isaac  
- Can you summarize my lists  
- Suggest candidates who have experience in Python and are able to speak Spanish  
- Nice! Add Sara Folgueroles in the Python Developer Candidates (Spanish speaking) list  
- Can you suggest candidates who have 10+ years of experience  
- Ok, remove Anthony from the .NET Developer Candidates list  
- Add Anthony Ivanov in the Talent list  
- Summarize my lists  

![Animation showing Career Genie in action accordingly to the dialog flow illustrated above, to search for candidates and add them to lists.](../../../assets/images/custom-engine-05/actions.gif)

<cc-end-step lab="bta5" exercise="3" step="3" />

## 演習 4: Microsoft Graph とアクションを組み合わせたワークフロー自動化

この演習では、Microsoft Graph を利用して候補者リストを HR に送信する新しいアクションを実装します。

### 手順 1: メール送信用の新しいアクションをプロンプトに定義

`src/prompts/monologue/actions.json` に移動し、次のアクションを追加します。

```json
,
{
    "name": "sendLists",
    "description": "Send list of Candidates to Human Resources, aka HR for scheduling interviews",
    "parameters": {
        "type": "object",
        "properties": {
            "list": {
                "type": "string",
                "description": "The name of the list to send Human Resources, aka HR for scheduling interviews"
            },
            "Candidates": {
                "type": "array",
                "description": "The Candidates in the list to send Human Resources, aka HR for scheduling interviews",
                "Candidates": {
                    "type": "string"
                }
            }
        },
        "required": [
            "list",
            "Candidates"
        ]
    }
}
```

<cc-end-step lab="bta5" exercise="4" step="1" />

### 手順 2: 新しい `sendLists` アクション用の関数を作成

`src/app/app.ts` に移動し、`getUserDisplayName` を見つけて関数の前に **export** を追加します。関数の最終形は次のとおりです。

```javascript
export async function getUserDisplayName {
...
...
...
}

```

`src/app/app.ts` で `app` を見つけ、スコープに **'Mail.Send'** を追加します。アプリの最終形は次のとおりです。

```javascript
const app = new Application({
  storage,
  authentication: {settings: {
    graph: {
      scopes: ['User.Read', 'Mail.Send'],
        ...
        ...
    }
  }}});
```

`env/.env.local.user` に移動し、次の HR のメールを環境変数として追加します。

```
HR_EMAIL=<YOUR-EMAIL-ADDRESS>
```

!!! pied-piper "`HR_EMAIL` の詳細"
    このラボをテストするために、ご自身のアカウントのメールアドレスを `HR_EMAIL` に入力してください。実際のシナリオでは、面接日程調整メールを送信する HR チームのメールアドレスを使用します。このラボはプロトタイピング目的のため、本番環境では使用しないでください。

`teamsapp.local.yml` に移動し、`file/createOrUpdateEnvironmentFile` の **envs** リストの下に次の行を追加します。

```
HR_EMAIL: ${{HR_EMAIL}}
```

`src/config.ts` に移動し、次の行を config に追加します。

```javascript
HR_EMAIL: process.env.HR_EMAIL
```

`src/app/actions.ts` を開き、コードの先頭で次のインポートを追加します。

```javascript
import { getUserDisplayName, ApplicationTurnState } from './app';
import { Client } from "@microsoft/microsoft-graph-client";
import config from '../config';
```

続いて、`actions.ts` に次の関数を追加します。

```javascript
async function sendLists(state: ApplicationTurnState, token): Promise<string> {
    const email = await createEmailContent(state.conversation.lists, token);
    try {
        const client = Client.init({
            authProvider: (done) => {
                done(null, token);
            }
        });
        const sendEmail = await client.api('/me/sendMail').post(JSON.stringify(email));
        if (sendEmail.ok) {
            return email.message.body.content;
        }
        else {
            console.log(`Error ${sendEmail.status} calling Graph in sendToHR: ${sendEmail.statusText}`);
            return 'Error sending email';
        }
    } catch (error) {
        console.error('Error in sendLists:', error);
        throw error;
    }
}
   
async function createEmailContent(lists, token) {
    let emailContent = '';
    for (const listName in lists) {
        if (lists.hasOwnProperty(listName)) {
        emailContent += `${listName}:\n`;
        lists[listName].forEach(candidate => {
            emailContent += `  • ${candidate}\n`;
        });
        emailContent += '\n'; // Add an extra line between different lists
        }
    }

    const profileName = await getUserDisplayName(token);

    const email ={
        "message": {
        "subject": "Request to Schedule Interviews with Shortlisted Candidates",
        "body": {
            "contentType": "Text",
            "content": `Hello HR Team, \nI hope this email finds you well. \n\nCould you please assist in scheduling 1:1 interviews with the following shortlisted candidates? \n\n${emailContent} Please arrange suitable times and send out the calendar invites accordingly. \n\n Best Regards, \n ${profileName}`
        },
        "toRecipients": [
            {
            "emailAddress": {
                "address": `${config.HR_EMAIL}`
            }
            }
        ]
        },
        "saveToSentCandidates": "true"
    };
    return await email;
}
```

最後に `src/app/actions.ts` で、エクスポートに **sendLists** を追加します。エクスポートの最終形は下記のとおりです。

```javascript
export { getCandidates, setCandidates, ensureListExists, deleteList, sendLists };
```

<cc-end-step lab="bta5" exercise="4" step="2" />

### 手順 3: `sendLists` アクション ハンドラーを登録

`src/app/app.ts` に移動し、`./actions` のインポートを **sendLists** を含むように更新します。インポートの最終形は次のようになります。

```javascript
import { ensureListExists, getCandidates, setCandidates, deleteList, sendLists } from "./actions";
```

その後、AI システムに `sendLists` アクションを登録するため、次のコード スニペットを追加します。

```javascript
app.ai.action('sendLists', async (context: TurnContext, state: ApplicationTurnState, parameters: ListAndCandidates) => {
  await sendLists(state, state.temp.authTokens['graph']);
  return `Email sent to HR. Summarize your action.`;
});
```

<cc-end-step lab="bta5" exercise="4" step="3" />

### 手順 4: Entra ID アプリ登録の更新

新しいスコープ `Mail.Send` 用に Entra ID アプリのスクリプトを更新します。**aad.manifest.json** ファイルを開き、`requiredResourceAccess` ノード内の `  "resourceAppId": "Microsoft Graph",` を見つけます。`resourceAccess` 配列にカンマの後で次のスコープを追加します。

```JSON
 {
    "id": "Mail.Send",
    "type": "Scope"
}
```

<cc-end-step lab="bta5" exercise="4" step="4" />

### 手順 5: アプリと新しい `sendLists` アクションをテスト

Visual Studio Code の **Run and Debug** タブから **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択し、アプリのデバッグを開始します。Microsoft Teams がブラウザーで開きます。アプリの詳細が表示されたら **Add** を選択してチャットを始めましょう。

!!! tip "ローカルでのテストのヒント"
    これまでアプリに実装した Teams AI ライブラリ機能は Teams App Test Tool では完全に動作しない場合があります。必ず Teams 上でローカルテストとデバッグを行ってください。

Career Genie との会話を始めるには、メッセージを入力するだけです。たとえば「Hi」と入力してみましょう。

!!! tip "ブラウザーのポップアップ設定を確認"
    以下の手順をスムーズに行うため、ブラウザーで `Pop up` がブロックされていないことを確認してください。

追加の権限を求める小さなダイアログが表示され、「Cancel」と「Continue」ボタンが並びます。このダイアログはログインと必要な権限への同意を求めるものです。 **Continue** を選択してください。

![The chat in Microsoft Teams shows a message asking the user to consent permissions to the app associated with the custom engine agent. There are a message, a 'Continue' button, and a 'Cancel' button.](../../../assets/images/custom-engine-04/consent-teams.png)

Developer Tunnels を使用してローカルで実行している場合、警告画面が表示されますので **Continue** を選択します。アプリをデプロイするとユーザーには表示されません。ログインおよびアプリの権限に同意するページにリダイレクトされます。

!!! tip "組織全体への同意"
    Microsoft 365 管理者の場合、「Consent on behalf of your organization」（組織を代表して同意）を選択することで、テナント内のすべてのユーザーに対して同意を付与できます。

**Accept** を選択して権限に同意します。

Career Genie から、ログインした名前を含むメッセージが届き、認証が成功したことが示されます。これで Career Genie で新しいアクションをテストできます。

フローを理解するために、次の順で質問してみましょう。

- Hello  
- Can you suggest candidates who have experience in .NET?  
- Great, add Isaac Talbot in the .NET Developer Candidates list  
- Add Anthony Ivanov in the same list with Isaac  
- Can you summarize my lists  
- Suggest candidates who have experience in Python and are able to speak Spanish  
- Nice! Add Sara Folgueroles in the Python Developer Candidates (Spanish speaking) list  
- Can you suggest candidates who have 10+ years of experience  
- Ok, remove Anthony from the .NET Developer Candidates list  
- Add Anthony Ivanov in the Talent list  
- Summarize my lists  
- Add Pedro Armijo in the same list with Sara  
- Summarize my lists  
- Send my lists to HR  

!!! tip "メールボックスを確認"
    最後のステップが完了したら、候補者リストのメールが届いているかメールボックスを確認してください。

![Animation showing the full experience of using Career Genie accordingly to the dialog flow illustrated above searching for candidates, adding them to lists, removing them from lists, and sending the lists of candidates by email to HR.](../../../assets/images/custom-engine-05/career-genie-full.gif)

<cc-end-step lab="bta5" exercise="4" step="5" />

---8<--- "ja/b-congratulations.md"

BTA5 - 複雑なタスクを処理するアクションの追加 を完了しました！さらに深掘りしたい場合は、このラボのソースコードを [Copilot Developer Camp リポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab05-Actions/CareerGenie){target=_blank} で確認できます。

これで **Build your own agent** コースは終了です。Career Genie の構築は楽しめましたか？ぜひご感想をお聞かせください。💜

<cc-next label="Home" url="/" />

<!-- <cc-award path="Build" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/05-actions--ja" />