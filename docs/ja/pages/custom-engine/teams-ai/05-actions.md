---
search:
  exclude: true
---
# ラボ BTA5 - 複雑なタスク処理のためのアクション追加

このラボでは、次のことを行います:

- アクションが何か、またそれらを用いて複雑なタスクを処理する方法を学びます
- カスタム エンジン エージェントにマルチ プロンプトを統合してアクションを処理します
- カスタム エンジン エージェントにてアクションを実装します
- Microsoft Graph とアクションを組み合わせてワークフローを自動化します

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

Career Genie が複雑なタスクとワークフローを処理するために、アクションを追加する時が来ました！ このラボでは、候補者リストを処理できる新たなプロンプトを Career Genie のロジックに統合します。つまり、Career Genie で候補者を検索する際に、候補者リストを作成し、名前を追加することができ、作業完了後はこれらのリストを HR に送信して面接のスケジュールを組むことも可能です。これらはすべて、Career Genie に実装するアクションによって処理されます。では、始めましょう。

???+ info "カスタム エンジン エージェントにおけるアクションとは"
    AI システムにおけるアクションは、コード内の基本的な関数やメソッドのようなもので、システムが実行可能な特定のタスクを意味します。アクションは、ユーザーの入力に基づいて AI が様々なタスクを遂行するための基本部品となります。ユーザーが AI システムとやり取りする際、システムはプロンプトを解釈し、実行すべき適切なアクションを選択します。まるでツールボックスを持っており、ユーザーのニーズに合わせて最適なツールを選び出すようなものです。

    たとえば、アクションには以下のものが含まれます:

    * 新しいリストの作成

    * リストの削除
    
    * 既存のリストへの項目の追加
    
    * 既存のリストからの項目の削除

## 演習 1：アクションを伴う新規プロンプト作成

この演習では、アクションを処理するための新しいプロンプトを "prompts" フォルダー内に作成します。

### ステップ 1： 「monologue」 プロンプトの作成

プロジェクト内の `src/prompts/` に移動し、名前が **monologue** の新しいフォルダーを追加します。`src/prompts/monologue/` フォルダー内に、名前が **config.json** の新しいファイルを作成し、以下のコードスニペットをコピーしてください:

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

!!! tip "config.json 内の `augmentation` についての簡単な紹介"
    Augmentations により、プロンプト エンジニアリングが簡略化され、プロンプトに特定の指示を自動的に追加することができます。Augmentations を使用すれば、AI に multi-step tasks (sequence) を処理させるのか、段階的にアクションを考えさせる (monologue) のかを設定できます。

`src/prompts/monologue/` フォルダー内に、名前が **skprompt.txt** の新しいファイルを作成し、以下のテキストをコピーしてください:

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

`src/prompts/monologue/` フォルダー内に、名前が **actions.json** の新しいファイルを作成し、以下のコードスニペットをコピーしてください:

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

## 演習 2：プランナーにおけるプロンプト選択ロジックの実装

この演習では、ユーザーのプロンプトを確認し、"chat" または "monologue" プロンプトを選択する関数を作成します。

### ステップ 1：プランナーにおける `defaultPrompt` 関数の作成

プロジェクト内の `src/app/app.ts` ファイルに移動し、次の関数を追加してください:

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

!!! tip " `choosePrompt` 関数の確認"
    choosePrompt 関数は、ユーザーのプロンプトに "list" が含まれているかを確認します。含まれていれば **monologue** プロンプトを返し、含まれていなければ現在のデフォルトである **chat** プロンプトを返します。

`src/app/app.ts` ファイル内で `planner` を探し、**defaultPrompt** に割り当てられているコードを削除してください。その後、 `choosePrompt` 関数を **defaultPrompt** として定義します。プランナーの最終バージョンは以下のようになります:

```javascript
const planner = new ActionPlanner({
  model,
  prompts,
  defaultPrompt: choosePrompt,
});
```

<cc-end-step lab="bta5" exercise="2" step="1" />

## 演習 3：アプリへのアクションの実装

この演習では、アクション用の関数を作成し、アプリにアクション ハンドラーを登録します。

### ステップ 1： `ConversationState` の更新および各アクションの関数定義

`src/app/app.ts` 内で、`@microsoft/teams-ai` のインポートを **DefaultConversationState** を用いて更新します。インポートの最終バージョンは以下のようになります:

```javascript
import { AuthError, ActionPlanner, OpenAIModel, PromptManager, AI, PredictedSayCommand, Application, TurnState, DefaultConversationState } from "@microsoft/teams-ai";
```

`src/app/app.ts` 内で、**ConversationState** と **ApplicationTurnState** を探し、次のコードに置き換えてください:

```javascript
// Strongly type the applications turn state
interface ConversationState extends DefaultConversationState {
  lists: Record<string, string[]>;
}
export type ApplicationTurnState = TurnState<ConversationState>;
```

`src/app/` フォルダー内に、名前が **actions.ts** の別のファイルを作成し、アクションの関数を定義するために以下のソースコードを追加してください:

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

### ステップ 2：アプリへのアクション ハンドラーの登録

`src/app/app.ts` ファイルの先頭に、以下のアクションインポートを追加してください:

```javascript
import { ensureListExists, getCandidates, setCandidates, deleteList } from "./actions";
```

次に、`src/app/app.ts` に以下のコードスニペットを追加し、AI システムにアクション ハンドラーを登録してください:

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

### ステップ 3：新しいアクションを用いたアプリのテスト

新しいアクションを搭載した Career Genie をテストしましょう。Visual Studio Code の **Run and Debug** タブから **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択して、アプリのデバッグを開始してください。すると、Microsoft Teams がブラウザにポップアップ表示されます。Teams 上にアプリの詳細が表示されたら、**Add** を選択し、アプリとのチャットを開始してください。

!!! tip "ヒント：この演習をローカルでテストする場合"
    これまでにアプリに実装した Teams AI ライブラリの機能の一部は Teams App Test Tool では正常に動作しない可能性があるため、Teams 上でローカルにテストおよびデバッグを行ってください。

以下のような順番で会話を進めると、動作確認に役立ちます:

- こんにちは
- .NET の経験がある候補者を提案してもらえますか？
- 素晴らしいです。 .NET Developer Candidates リストに Isaac Talbot を追加してください
- 同じリストに Anthony Ivanov を Isaac と一緒に追加してください
- 私のリストを要約してもらえますか？
- Python の経験があり、スペイン語を話せる候補者を提案してもらえますか？
- いいですね！ Python Developer Candidates (Spanish speaking) リストに Sara Folgueroles を追加してください
- 10年以上の経験がある候補者を提案してもらえますか？
- 了解です。 .NET Developer Candidates リストから Anthony を削除してください
- Talent リストに Anthony Ivanov を追加してください
- 私のリストを要約してください

![上記のダイアログ フローに従って候補者を検索し、リストに追加する Career Genie の動作を示すアニメーション](../../../assets/images/custom-engine-05/actions.gif)

<cc-end-step lab="bta5" exercise="3" step="3" />

## 演習 4：Microsoft Graph とアクションを連携してワークフローの自動化を実現

この演習では、Microsoft Graph を利用して候補者リストを HR に送信し、面接のスケジュールを調整する新しいアクションを実装します。

### ステップ 1：メール送信用プロンプトに新しいアクションを定義

プロジェクト内の `src/prompts/monologue/actions.json` に移動し、以下のアクションを追加してください:

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

### ステップ 2：新しい `sendLists` アクション用の関数の作成

プロジェクト内の `src/app/app.ts` に移動し、`getUserDisplayName` を探して、関数の前に **export** を追加してください。関数の最終バージョンは以下のようになります:

```javascript
export async function getUserDisplayName {
...
...
...
}

```

`src/app/app.ts` 内の `app` を見つけ、スコープを **'Mail.Send'** に更新してください。アプリの最終バージョンは以下のようになります:

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

`env/.env.local.user` に移動し、以下の HR メールアドレスを環境変数として追加してください:

```
HR_EMAIL=<YOUR-EMAIL-ADDRESS>
```

!!! pied-piper "`HR_EMAIL` の詳細（このラボをテストするため）"
    このラボをテストするには、`HR_EMAIL` にご自身のアカウントのメールアドレスを入力してください。理想的には、面接スケジュールのメールを送信するために、Human Resources Team のメールアドレスを使用します。このラボはプロトタイピング目的のみであり、本番環境での使用は推奨されません。

`teamsapp.local.yml` に移動し、`file/createOrUpdateEnvironmentFile` の **envs** リストの下に以下の行を追加してください:

```
HR_EMAIL: ${{HR_EMAIL}}
```

`src/config.ts` に移動し、設定に以下の行を追加してください:

```javascript
HR_EMAIL: process.env.HR_EMAIL
```

`src/app/actions.ts` に移動し、コード上部のインポートを以下のように更新してください:

```javascript
import { getUserDisplayName, ApplicationTurnState } from './app';
import { Client } from "@microsoft/microsoft-graph-client";
import config from '../config';
```

次に、`actions.ts` に以下の関数を追加してください:

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

最後に `src/app/actions.ts` にて、エクスポートに **sendLists** を追加してください。エクスポートの最終バージョンは以下のようになります:

```javascript
export { getCandidates, setCandidates, ensureListExists, deleteList, sendLists };
```

<cc-end-step lab="bta5" exercise="4" step="2" />

### ステップ 3：`sendLists` アクション ハンドラーの登録

`src/app/app.ts` に移動し、`./actions` のインポートを **sendLists** 関数付きに更新してください。インポートの最終バージョンは以下のようになります:

```javascript
import { ensureListExists, getCandidates, setCandidates, deleteList, sendLists } from "./actions";
```

次に、AI システムに `sendLists` アクションを登録するために、以下のコードスニペットを追加してください:

```javascript
app.ai.action('sendLists', async (context: TurnContext, state: ApplicationTurnState, parameters: ListAndCandidates) => {
  await sendLists(state, state.temp.authTokens['graph']);
  return `Email sent to HR. Summarize your action.`;
});
```

<cc-end-step lab="bta5" exercise="4" step="3" />

### ステップ 4：Entra ID アプリ登録の更新

新しいスコープ `Mail.Send` を対象とする Entra ID アプリのスクリプトを更新してください。**aad.manifest.json** ファイルに移動し、ノード `requiredResourceAccess` 内で `  "resourceAppId": "Microsoft Graph",` を探します。`resourceAccess` 配列内に、カンマの後に以下のスコープを追加してください。

```JSON
 {
    "id": "Mail.Send",
    "type": "Scope"
}
```

<cc-end-step lab="bta5" exercise="4" step="4" />

### ステップ 5：アプリおよび新しい `sendLists` アクションのテスト

新しい **sendLists** アクションを搭載した Career Genie をテストしましょう。Visual Studio Code の **Run and Debug** タブから **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択して、アプリのデバッグを開始してください。すると、Microsoft Teams がブラウザにポップアップ表示されます。Teams 上にアプリの詳細が表示されたら、**Add** を選択して、アプリとのチャットを開始してください。

!!! tip "ヒント：この演習をローカルでテストする場合"
    これまでにアプリに実装した Teams AI ライブラリの機能の一部は Teams App Test Tool では正常に動作しない可能性があるため、Teams 上でローカルにテストおよびデバッグを行ってください。

Career Genie との会話を開始するには、単にメッセージを入力してください。例えば、'Hi' から始めることができます。

!!! tip "ヒント：ブラウザのポップアップ設定を確認する"
    下記の指示が円滑に進むよう、ブラウザで `Pop up` がブロックされていないことを確認してください。

追加の権限に関する小さなダイアログボックスが表示され、‘Cancel’ と ‘Continue’ のボタンが現れます。このダイアログは、ログインして必要な権限への同意を取得するためのものです。**Continue** を選択してください。

![Microsoft Teams のチャットにおいて、カスタム エンジン エージェントに関連付けられたアプリへの権限の同意を求めるメッセージが表示され、'Continue' ボタンと 'Cancel' ボタンが存在する様子。](../../../assets/images/custom-engine-04/consent-teams.png)

Developer Tunnels を使用してローカルで実行しているため、警告画面が表示されますが、**Continue** を選択してください。アプリがデプロイされると、この警告はユーザーに表示されません。ログインページにリダイレクトされ、アプリの権限に同意することになります。

!!! tip "ヒント：組織全体を代表して同意する"
    Microsoft 365 の管理者の場合、テナント内の全ユーザーに代わって同意する "Consent on behalf of your organization" のオプションも表示されます。

権限に同意するには **Accept** を選択してください。

ログインした名前が表示された Career Genie から成功した認証のメッセージが届きます。これで、Career Genie の新しいアクションのテストを開始できます！

以下のような順番で会話を進めると、動作確認に役立ちます:

- こんにちは
- .NET の経験がある候補者を提案してもらえますか？
- 素晴らしいです。 .NET Developer Candidates リストに Isaac Talbot を追加してください
- 同じリストに Anthony Ivanov を Isaac と一緒に追加してください
- 私のリストを要約してもらえますか？
- Python の経験があり、スペイン語を話せる候補者を提案してもらえますか？
- いいですね！ Python Developer Candidates (Spanish speaking) リストに Sara Folgueroles を追加してください
- 10年以上の経験がある候補者を提案してもらえますか？
- 了解です。 .NET Developer Candidates リストから Anthony を削除してください
- Talent リストに Anthony Ivanov を追加してください
- 私のリストを要約してください
- 同じリストに Sara と一緒に Pedro Armijo を追加してください
- 私のリストを要約してください
- 私のリストを HR に送信してください

!!! tip "メールボックスを確認する"
    最後のステップが完了した後、候補者リストのメールが届いているか、メールボックスを確認してください。

![上記のダイアログ フローに従って候補者を検索、リストへの追加、リストからの削除、候補者リストを HR にメール送信する Career Genie の全体的な動作体験を示すアニメーション](../../../assets/images/custom-engine-05/career-genie-full.gif)

<cc-end-step lab="bta5" exercise="4" step="5" />

---8<--- "ja/b-congratulations.md"

BTA5 - 複雑なタスク処理のためのアクション追加が完了しました！ さらに探索したい場合は、このラボのソースコードが [Copilot Developer Camp repo](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab05-Actions/CareerGenie){target=_blank} にてご利用いただけます。

これで **Build your own agent** パスは終了です！ Career Genie の構築を楽しんでいただけましたか？ ご意見やフィードバックをお聞かせください。 💜

<cc-next label="Home" url="/" />

<!-- <cc-award path="Build" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/05-actions" />