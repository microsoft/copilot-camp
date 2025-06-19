---
search:
  exclude: true
---
# ラボ BTA5 - 複雑なタスクを処理するアクションの追加

このラボでは、次のことを行います。

- アクションとは何か、そしてそれで複雑なタスクを処理する方法を学習する  
- カスタム エンジン エージェントにマルチプロンプトを統合し、アクションを処理する  
- カスタム エンジン エージェントにアクションを実装する  
- Microsoft Graph とアクションを組み合わせてワークフローを自動化する  


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/bfULaDnpAXY" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早く把握しましょう。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## はじめに

いよいよ Career Genie に複雑なタスクとワークフローを処理するためのアクションを追加します。  
このラボでは、候補者のリストを扱える新しいプロンプトを Career Genie のロジックに統合します。つまり Career Genie で候補者検索を行う際、候補者用のリストを作成して名前を追加できるようになります。作成が終わったら、そのリストを HR に送信して面接日程を調整することも可能です。  
これらはすべて、今回 Career Genie に実装するアクションで処理されます。さっそく始めましょう。

???+ info "カスタム エンジン エージェントにおけるアクションとは？"
    AI システムにおけるアクションは、コードでいうところの基本的な関数やメソッドのようなものです。ユーザーの入力に基づき、AI が実行できる具体的なタスクを表します。AI システムはユーザーの要求に応じて、どのアクションを実行するかを判断します。

    例として、アクションには次のようなものがあります。

    * 新しいリストを作成する  
    * リストを削除する  
    * 既存のリストに項目を追加する  
    * 既存のリストから項目を削除する  

    ユーザーが AI システムとやり取りすると、システムはプロンプトを解釈して適切なアクションを選択し実行します。工具箱にあるツールを、ユーザーのニーズに合わせて AI が使い分けるイメージです。

## 演習 1: アクション用の新しいプロンプトを作成する

この演習では、アクションを処理するための新しいプロンプトを "prompts" フォルダーに作成します。

### ステップ 1: "monologue" プロンプトを作成する

プロジェクトで `src/prompts/` に移動し、**monologue** という名前のフォルダーを追加します。  
`src/prompts/monologue/` フォルダーに **config.json** というファイルを作成し、次のコード スニペットを貼り付けます。

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
    Augmentation は、特定の指示をプロンプトに自動で追加し、プロンプト エンジニアリングを簡素化します。augmentation により、AI にマルチステップ タスク（sequence）を扱わせるか、各ステップを順に考えさせる（monologue）かを設定できます。

`src/prompts/monologue/` フォルダーに **skprompt.txt** というファイルを作成し、次のテキストを貼り付けます。

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

## 演習 2: プロンプトを選択するロジックをプランナーに実装する

この演習では、ユーザー プロンプトを確認し、"chat" と "monologue" のどちらのプロンプトを使うかを判断する関数を作成します。

### ステップ 1: プランナーに `defaultPrompt` 用関数を作成する

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
    `choosePrompt` 関数はユーザー プロンプトに "list" が含まれているかを確認します。含まれていれば **monologue** プロンプトを返し、含まれていなければ既定の **chat** プロンプトを返します。

`src/app/app.ts` ファイルで `planner` を探し、**defaultPrompt** に割り当てられているコードを削除します。その後、`choosePrompt` 関数を **defaultPrompt** として設定します。最終的なプランナーは次のようになります。

```javascript
const planner = new ActionPlanner({
  model,
  prompts,
  defaultPrompt: choosePrompt,
});
```

<cc-end-step lab="bta5" exercise="2" step="1" />

## 演習 3: アプリにアクションを実装する

この演習では、アクション用の関数を作成し、アクション ハンドラーをアプリに登録します。

### ステップ 1: `ConversationState` を更新し、各アクションの関数を定義する

`src/app/app.ts` で `@microsoft/teams-ai` のインポートを **DefaultConversationState** に更新します。最終的なインポートは次のようになります。

```javascript
import { AuthError, ActionPlanner, OpenAIModel, PromptManager, AI, PredictedSayCommand, Application, TurnState, DefaultConversationState } from "@microsoft/teams-ai";
```

`src/app/app.ts` で **ConversationState** と **ApplicationTurnState** を見つけ、次のコードに置き換えます。

```javascript
// Strongly type the applications turn state
interface ConversationState extends DefaultConversationState {
  lists: Record<string, string[]>;
}
export type ApplicationTurnState = TurnState<ConversationState>;
```

`src/app/` フォルダーに **actions.ts** ファイルを作成し、アクション用関数を定義する以下のソース コードを追加します。

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

### ステップ 2: アクション ハンドラーを登録する

`src/app/app.ts` で次のアクション インポートをファイル冒頭に追加します。

```javascript
import { ensureListExists, getCandidates, setCandidates, deleteList } from "./actions";
```

続いて、AI システムにアクション ハンドラーを登録するため、次のコード スニペットを `src/app/app.ts` に追加します。

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

### ステップ 3: 新しいアクションでアプリをテストする

Visual Studio Code の **Run and Debug** タブから **Debug in Teams (Edge)** もしくは **Debug in Teams (Chrome)** を選択し、アプリのデバッグを開始します。ブラウザーで Microsoft Teams が起動します。アプリの詳細が表示されたら **Add** を選択し、チャットを開始します。

!!! tip "ローカルでのテスト"
    Teams AI ライブラリの一部機能は Teams App Test Tool では正しく動作しない場合があります。この演習は必ず Teams 上でローカル実行・デバッグしてください。

フローを理解するため、次のように順番に質問してみてください。

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

## 演習 4: Microsoft Graph とアクションを組み合わせてワークフローを自動化する

この演習では、Microsoft Graph を利用し、候補者リストを HR に送信して面接のスケジュールを依頼する新しいアクションを実装します。

### ステップ 1: メール送信用の新しいアクションをプロンプトに定義する

`src/prompts/monologue/actions.json` を開き、次のアクションを追加します。

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

### ステップ 2: 新しい `sendLists` アクションの関数を作成する

`src/app/app.ts` を開き、`getUserDisplayName` を見つけて **export** を追加します。最終形は次のとおりです。

```javascript
export async function getUserDisplayName {
...
...
...
}

```

`src/app/app.ts` の `app` を見つけ、スコープに **'Mail.Send'** を追加します。最終形は次のとおりです。

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

`env/.env.local.user` を開き、以下の HR メールを環境変数として追加します。

```
HR_EMAIL=<YOUR-EMAIL-ADDRESS>
```

!!! pied-piper "`HR_EMAIL` について"
    このラボをテストするため、ご自身のアカウントのメール アドレスを `HR_EMAIL` に入力してください。本来は HR チームのメール アドレスを使用して面接スケジュールのメールを送信します。このラボはプロトタイプ用途のみで、本番環境での使用を想定していません。

`teamsapp.local.yml` を開き、`file/createOrUpdateEnvironmentFile` の **envs** リストに次の行を追加します。

```
HR_EMAIL: ${{HR_EMAIL}}
```

`src/config.ts` を開き、次の行を config に追加します。

```javascript
HR_EMAIL: process.env.HR_EMAIL
```

`src/app/actions.ts` を開き、インポートを以下のように更新します。

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

最後に `src/app/actions.ts` で、エクスポートに **sendLists** を追加します。最終的なエクスポートは次のとおりです。

```javascript
export { getCandidates, setCandidates, ensureListExists, deleteList, sendLists };
```

<cc-end-step lab="bta5" exercise="4" step="2" />

### ステップ 3: `sendLists` アクション ハンドラーを登録する

`src/app/app.ts` を開き、`./actions` のインポートを **sendLists** を含むように更新します。最終形は次のとおりです。

```javascript
import { ensureListExists, getCandidates, setCandidates, deleteList, sendLists } from "./actions";
```

続いて、AI システムに `sendLists` アクションを登録するため、次のコード スニペットを追加します。

```javascript
app.ai.action('sendLists', async (context: TurnContext, state: ApplicationTurnState, parameters: ListAndCandidates) => {
  await sendLists(state, state.temp.authTokens['graph']);
  return `Email sent to HR. Summarize your action.`;
});
```

<cc-end-step lab="bta5" exercise="4" step="3" />

### ステップ 4: Entra ID アプリ登録を更新する

新しいスコープ `Mail.Send` 用に Entra ID アプリのスクリプトを更新します。  
**aad.manifest.json** を開き、`requiredResourceAccess` ノード内の  
`  "resourceAppId": "Microsoft Graph",` を探します。  
`resourceAccess` 配列に、カンマの後で次のスコープを追加します。

```JSON
 {
    "id": "Mail.Send",
    "type": "Scope"
}
```

<cc-end-step lab="bta5" exercise="4" step="4" />

### ステップ 5: アプリと新しい `sendLists` アクションをテストする

Visual Studio Code の **Run and Debug** タブから **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択し、アプリのデバッグを開始します。ブラウザーで Microsoft Teams が起動します。アプリの詳細が表示されたら **Add** を選択し、チャットを開始します。

!!! tip "ローカルでのテスト"
    Teams AI ライブラリの一部機能は Teams App Test Tool では正しく動作しない場合があります。この演習は必ず Teams 上でローカル実行・デバッグしてください。

Career Genie と会話を始めるには、単にメッセージを入力します。たとえば「Hi」と送信してみてください。

!!! tip "ブラウザーのポップアップ設定を確認"
    以降の手順を円滑に行うため、ブラウザーでポップアップがブロックされていないか確認してください。

追加のアクセス許可を求めるダイアログ ボックスが表示されます。**Continue** を選択してください。

![The chat in Microsoft Teams shows a message asking the user to consent permissions to the app associated with the custom engine agent. There are a message, a 'Continue' button, and a 'Cancel' button.](../../../assets/images/custom-engine-04/consent-teams.png)

Developer Tunnels でローカル実行しているため警告画面が表示されますが、**Continue** を選択します。アプリが展開されるとき、ユーザーには表示されません。その後、ログインとアクセス許可の同意を行います。

!!! tip "組織全体で同意する"
    Microsoft 365 管理者の場合、「Consent on behalf of your organization」を選択してテナント内のすべてのユーザーに対して同意することもできます。

**Accept** を選択してアクセス許可に同意します。

Career Genie から、ログインしたユーザー名とともに認証成功のメッセージが届きます。ここから新しいアクションをテストしてみましょう！

フローを理解するため、次のように順番に質問してみてください。

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
    最後のステップが終わったら、候補者リストのメールが届いているか受信トレイを確認してください。

![Animation showing the full experience of using Career Genie accordingly to the dialog flow illustrated above searching for candidates, adding them to lists, removing them from lists, and sending the lists of candidates by email to HR.](../../../assets/images/custom-engine-05/career-genie-full.gif)

<cc-end-step lab="bta5" exercise="4" step="5" />

---8<--- "ja/b-congratulations.md"

BTA5 - 複雑なタスクを処理するアクションの追加 を完了しました！  
さらに学習したい場合は、このラボのソース コードが [Copilot Developer Camp リポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab05-Actions/CareerGenie){target=_blank} にありますのでご覧ください。

これで **Build your own agent** コースは終了です。Career Genie の構築をお楽しみいただけましたか？ ぜひ体験談やフィードバックをお聞かせください 💜

<cc-next label="Home" url="/" />

<!-- <cc-award path="Build" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/05-actions" />