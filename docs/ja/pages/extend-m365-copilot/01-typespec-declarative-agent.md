---
search:
  exclude: true
---
# Lab E1 - Microsoft 365 Agents Toolkit で TypeSpec 定義を使用して最初の Declarative エージェントを構築する

このラボでは、Microsoft 365 Agents Toolkit を使用して TypeSpec 定義による Declarative エージェントを構築します。`RepairServiceAgent` というエージェントを作成し、既存の API サービスを介して修理データと対話し、ユーザーが車の修理記録を管理できるようにします。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RNsa0kLsXgY" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## Declarative エージェントとは 

**Declarative エージェント** は Microsoft 365 Copilot と同じスケーラブルなインフラストラクチャとプラットフォームを活用し、特定分野に特化したニーズにフォーカスするよう最適化されています。標準の Microsoft 365 Copilot チャットと同じインターフェースを使用しつつ、対象タスクのみに集中する専門家として機能します。

### Declarative エージェントの構成

Copilot 向けに複数のエージェントを構築すると、最終成果物が zip ファイルにまとめられた数個のファイルセット (アプリ パッケージ) であることに気付きます。したがって、アプリ パッケージの構成を把握しておくことが重要です。Declarative エージェントのアプリ パッケージは、Teams アプリを構築した経験があれば似た構造ですが、追加要素が含まれています。以下の表に主要要素を示します。アプリの展開プロセスも Teams アプリの展開に非常に似ています。

| ファイル種別                        | 説明                                                                                                                                                         | 必須 |
|-----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|------|
| Microsoft 365 App Manifest        | 標準 Teams アプリ マニフェストを定義する JSON ファイル (`manifest.json`)                                                                                     | はい |
| Declarative Agent Manifest        | エージェントの名前、instructions、capabilities、会話スターター、actions (該当する場合) を含む JSON ファイル                                                   | はい |
| Plugin Manifest                   | アクションを API プラグインとして構成するための JSON ファイル。認証、必須フィールド、Adaptive Card 応答などを含む。actions が存在する場合のみ必要         | いいえ |
| OpenAPI Spec                      | API を定義する JSON または YAML ファイル。エージェントに actions が含まれる場合のみ必須                                                                      | いいえ |

### Declarative エージェントの Capabilities

instructions を追加するだけでなく、アクセスするナレッジ ベースを指定してエージェントのコンテキストとデータへの集中度を高めることができます。これらを capabilities と呼びます。執筆時点で Declarative エージェントがサポートする capabilities は次のとおりです。 

- **Copilot Connectors** - Microsoft 365 にコンテンツを集約します。外部コンテンツを Microsoft 365 に取り込むことで、関連情報が見つけやすくなり、組織内の他者も新しいコンテンツを発見できるようになります。
- **OneDrive and SharePoint** - OneDrive と SharePoint 内のファイル/サイトの URL を指定でき、それらがエージェントのナレッジ ベースに含まれます。
- **Web search** - Web コンテンツをナレッジ ベースとして有効化/無効化できます。また、ソースとして最大 4 つまでの Web サイト URL を渡すことができます。
- **Code interpreter** - 数学問題をより適切に解決し、必要に応じて Python コードを活用した複雑なデータ分析やチャート生成を行うエージェントを構築できます。
- **GraphicArt** - DALL·E を使用した画像やビデオ生成エージェントを構築できます。
- **Email knowledge** - 個人または共有メールボックス、オプションで特定フォルダーをナレッジとして使用するエージェントを構築できます。
- **People knowledge** - 組織内の人物に関する質問に回答するエージェントを構築できます。
- **Teams messages** - Teams のチャネル、チーム、会議、1:1 チャット、グループ チャットを検索できるエージェントを構築できます。
- **Dataverse knowledge** - Dataverse インスタンスをナレッジ ソースとして追加できます。


!!! tip "OnDrive and SharePoint"
    URL は SharePoint アイテム (サイト、ドキュメント ライブラリ、フォルダー、ファイル) へのフル パスである必要があります。SharePoint の **[Copy direct link]** オプションを使用してパスを取得できます。ファイルまたはフォルダーを右クリックして **[Details]** を選択し、**[Path]** でコピー アイコンをクリックしてください。<mark>URL を指定しない場合、ログイン ユーザーがアクセスできる OneDrive と SharePoint のすべてのコンテンツがエージェントによって使用されます。</mark>

!!! tip "Microsoft Copilot Connector"
    接続を指定しない場合、ログイン ユーザーがアクセスできる Copilot Connectors のすべてのコンテンツがエージェントによって使用されます。

!!! tip "Web search"
    サイトを指定しない場合、エージェントはすべてのサイトを検索できます。最大 4 つまでのサイトを指定でき、パス セグメントは 2 つまで、クエリ文字列パラメーターは使用できません。


## Declarative エージェントにおける TypeSpec の重要性

### TypeSpec とは

TypeSpec は、API 契約を構造化された型安全な方法で設計・記述するために Microsoft が開発した言語です。API が受け取るデータ、返すデータ、API とその actions の接続方法など、API の設計図と考えると分かりやすいでしょう。

### Agents に TypeSpec を使う理由

TypeScript がフロントエンド/バックエンド コードの構造を強制する点が好きな人は、TypeSpec がエージェントとその API サービス (actions など) の構造を強制する点を気に入るはずです。Visual Studio Code などのツールと連携する design-first 開発ワークフローに最適です。

- 明確なコミュニケーション – 複数の manifest ファイルを扱う場合の混乱を避け、エージェントの動作を定義する単一のソース オブ トゥルースを提供します。
- 一貫性 – エージェントとその actions、capabilities などのすべての部分を同じパターンで設計できます。
- 自動化フレンドリー – OpenAPI スペックや他の manifest を自動生成し、時間を節約しヒューマン エラーを削減します。
- 早期バリデーション – 実装前に設計上の問題 (型不一致や定義の不明確さなど) を検出できます。
- Design-First アプローチ – 実装に着手する前にエージェントと API の構造・契約を考えることを促し、長期的な保守性を向上させます。

## 演習 1: Microsoft 365 Agents Toolkit と TypeSpec でベース エージェントを構築する


### 手順 1: Microsoft 365 Agents Toolkit でベース エージェント プロジェクトをスキャフォールディングする
- VS Code の左側メニューから Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択します。アクティビティ バーが開きます。 
- アクティビティ バーで **Create a New Agent/App** ボタンを選択すると、Microsoft 365 Agents Toolkit で利用可能なテンプレートの一覧が表示されます。
- 一覧から **Declarative Agent** を選択します。
- 次に **Start with TypeSpec for Microsoft 365 Copilot** を選択し、TypeSpec でエージェントを定義します。
- プロジェクトを生成するフォルダーを選択します。
- アプリケーション名に **RepairServiceAgent** などを入力し、Enter を押して完了します。新しい VS Code ウィンドウにエージェント プロジェクトが読み込まれます。

<cc-end-step lab="e01" exercise="1" step="1" />

### 手順 2: Microsoft 365 Agents Toolkit にサインインする 

エージェントをアップロードしテストするには、Microsoft 365 Agents Toolkit にサインインする必要があります。

- プロジェクト ウィンドウで再度 Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択します。Accounts、Environment、Development などのセクションがあるアクティビティ バーが開きます。 
- **Accounts** セクション下の **Sign in to Microsoft 365** を選択します。サインインや Microsoft 365 developer サンドボックスの作成、またはキャンセルを行うダイアログが表示されます。**Sign in** を選択します。 
- サインインが完了したらブラウザーを閉じ、プロジェクト ウィンドウに戻ります。

<cc-end-step lab="e01" exercise="1" step="2" />

### 手順 3: エージェントを定義する 

Agents Toolkit がスキャフォールディングした Declarative エージェント プロジェクトには、リポジトリの issues を表示するために GitHub API に接続するテンプレート コードが含まれています。このラボでは、修理サービスと統合し、修理データを管理する複数の操作をサポートする独自のエージェントを構築します。

プロジェクト フォルダーには `main.tsp` と `actions.tsp` の 2 つの TypeSpec ファイルがあります。
`main.tsp` にエージェントのメタデータ、instructions、capabilities が定義されています。
`actions.tsp` ではエージェントの actions を定義します。API サービスへの接続など actions を含む場合、このファイルで定義します。

`main.tsp` を開き、デフォルト テンプレートに含まれる内容を確認します。後で修理サービス シナリオに合わせて変更します。 

#### エージェントのメタデータと instructions を更新する

`main.tsp` では以下の基本構造が確認できます:
- エージェント名と説明 1️⃣
- 基本 instructions 2️⃣
- actions と capabilities のプレースホルダー コード (コメントアウト) 3️⃣

![Visual Studio Code showing the initially scaffolded template for a Declarative Agent defined in TypeSpec. There TypeSpec syntax elements to define the agent, its instructions, and some commented out commands to define starter prompts and actions.](https://github.com/user-attachments/assets/42da513c-d814-456f-b60f-a4d9201d1620)


まず修理シナリオ用にエージェントを定義します。`@agent` と `@instructions` の定義を下記コード スニペットに置き換えてください。

```typespec
@agent(
  "RepairServiceAgent",
   "An agent for managing repair information"
)

@instructions("""
  ## Purpose
You will assist the user in finding car repair records based on the information provided by the user. 
""")

```

次にエージェントの会話スターターを追加します。instructions のすぐ下にコメントアウトされた会話スターターのコードがあるのでアンコメントし、
タイトルとテキストを下記に置き換えます。

```typespec
// Uncomment this part to add a conversation starter to the agent.
// This will be shown to the user when the agent is first created.
@conversationStarter(#{
  title: "List repairs",
  text: "List all repairs"
})

```

#### エージェントの action を更新する

次に、`actions.tsp` ファイルを開いてエージェントの action を定義します。後ほど `main.tsp` に戻り、アクション参照を含むエージェント メタデータを完成させますが、まず action 自体を定義します。

`actions.tsp` のプレースホルダー コードは GitHub リポジトリの未解決 issue を検索する設計になっています。ここには action のメタデータ、API ホスト URL、操作 (functions) とその定義を理解する入門例が含まれています。これを修理サービス用にすべて置き換えます。 

モジュール レベルの import や using 文の後、`SERVER_URL` が定義される行までの既存コードを下記スニペットで置き換えます。この更新では action メタデータの導入と server URL の設定を行います。また、namespace を **RepairsAPI** に変更しています。

```typespec
@service
@server(RepairsAPI.SERVER_URL)
@actions(RepairsAPI.ACTIONS_METADATA)
namespace RepairsAPI{
  /**
   * Metadata for the API actions.
   */
  const ACTIONS_METADATA = #{
    nameForHuman: "Repair Service Agent",
    descriptionForHuman: "Manage your repairs and maintenance tasks.",
    descriptionForModel: "Plugin to add, update, remove, and view repair objects.",
    legalInfoUrl: "https://docs.github.com/en/site-policy/github-terms/github-terms-of-service",
    privacyPolicyUrl: "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
  };
  
  /**
   * The base URL for the  API.
   */
  const SERVER_URL = "https://repairshub.azurewebsites.net";

```

次にテンプレートの operation "searchIssues" を修理データを取得する `listRepairs` に変更します。
`SERVER_URL` 定義直後からファイル末尾の閉じ括弧 *手前* までのブロックを下記スニペットで置き換えます。閉じ括弧は残してください。

```typespec
  /**
   * List repairs from the API 
   * @param assignedTo The user assigned to a repair item.
   */

  @route("/repairs")
  @get  op listRepairs(@query assignedTo?: string): string;

````

次に `main.tsp` に戻り、先ほど定義した action をエージェントに追加します。会話スターターの後にある既存ブロックを以下スニペットに置き換えます。

```typespec
namespace RepairServiceAgent{  
  // Uncomment this part to add actions to the agent.
  @service
  @server(global.RepairsAPI.SERVER_URL)
  @actions(global.RepairsAPI.ACTIONS_METADATA)
  namespace RepairServiceActions {
    op listRepairs is global.RepairsAPI.listRepairs;   
  }
}
```
<cc-end-step lab="e01" exercise="1" step="3" />

### 手順 4: デコレーターを理解する (オプション)

これはオプションです。TypeSpec ファイルで何を定義したか気になる場合は読み進めてください。すぐにエージェントをテストしたい場合は手順 5 に進んでください。
`main.tsp` と `actions.tsp` にはデコレーター ( @ で始まる )、namespace、model などが登場します。

以下の表でこれらデコレーターの意味を確認できます。 


| アノテーション           | 説明                                                                                                                                                               |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| @agent                | エージェントの namespace (名前) と説明を定義します                                                                                                                   |
| @instructions         | エージェントの動作を規定する instructions を定義します。8000 文字以内                                                                                                |
| @conversationStarter  | エージェントの会話スターターを定義します                                                                                                                               |
| op                    | 任意の operation を定義します。capabilities を定義する *op GraphicArt* や *op CodeInterpreter* など、または API operation である **op listRepairs** などがあります。 |
| @server               | API のサーバー エンドポイントとその名前を定義します                                                                                                                   |
| @capabilities         | 関数内で使用すると、確認カードなど簡易的な Adaptive Card を定義します                                                                                                  |


<cc-end-step lab="e01" exercise="1" step="4" />

### 手順 5: エージェントをテストする

次に Repair Service Agent をテストします。 

- Agents Toolkit 拡張のアイコンを選択し、アクティビティ バーを開きます。
- Agents Toolkit のアクティビティ バーで **LifeCycle** セクション下の **Provision** を選択します。これにより manifest ファイルやアイコンを含むアプリ パッケージがビルドされ、あなただけがテストできるようカタログにサイドロードされます。 

!!! tip "Knowledge"
    Agents Toolkit はここで TypeSpec ファイルに定義された内容を検証し、精度を確保します。エラーも特定して開発体験を向上させます。

- 次に Web ブラウザーで [https://m365.cloud.microsoft/chat](https://m365.cloud.microsoft/chat){target=_blank} を開き、Copilot アプリを起動します。

!!! note "Help"
    Copilot アプリで **Something went wrong** の画面が表示された場合は、ブラウザーを更新してください。  

- **Agents** の一覧から **RepairServiceAgent** を選択します。
プロビジョニング中はトースト メッセージに進捗が表示されるので少し待ちます。

- 会話スターター **List repairs** を選択し、チャットに送信してエージェントとの会話を開始し、応答を確認します。

!!! tip "Help"
    問い合わせを処理するためにエージェントへ接続するよう求められたら、通常は一度だけ表示されます。ラボを円滑に進めるため **"Always allow"** を選択してください。
    ![Screenshot of the agent in action with the response for the prompt 'List all repairs' showing repairs with pictures.](https://github.com/user-attachments/assets/02400c13-0766-4440-999b-93c88ca45dc7)

- ブラウザー セッションは開いたままにしておき、次の演習に備えます。 

<cc-end-step lab="e01" exercise="1" step="5" />

## 演習 2: エージェントの機能を強化する
次に、エージェントにさらに operations を追加し、Adaptive Cards による応答を有効化し、code interpreter capability を組み込んで強化します。VS Code のプロジェクトに戻り、段階的に進めましょう。

### 手順 1: operations を追加してエージェントを修正する

- `actions.tsp` ファイルに移動し、`listRepairs` operation の直後に下記スニペットを貼り付け、`createRepair`、`updateRepair`、`deleteRepair` の新しい operations を追加します。ここでは `Repair` アイテムのデータ モデルも定義しています。

```typespec
  /**
   * Create a new repair. 
   * When creating a repair, the `id` field is optional and will be generated by the server.
   * The `date` field should be in ISO 8601 format (e.g., "2023-10-01T12:00:00Z").
   * The `image` field should be a valid URL pointing to the image associated with the repair.
   * @param repair The repair to create.
   */
  @route("/repairs")  
  @post  op createRepair(@body repair: Repair): Repair;

  /**
   * Update an existing repair.
   * The `id` field is required to identify the repair to update.
   * The `date` field should be in ISO 8601 format (e.g., "2023-10-01T12:00:00Z").
   * The `image` field should be a valid URL pointing to the image associated with the repair.
   * @param repair The repair to update.
   */
  @route("/repairs")  
  @patch  op updateRepair(@body repair: Repair): Repair;

  /**
   * Delete a repair.
   * The `id` field is required to identify the repair to delete.
   * @param repair The repair to delete.
   */
  @route("/repairs") 
  @delete  op deleteRepair(@body repair: Repair): Repair;
  
  /**
   * A model representing a repair.
   */
  model Repair {
    /**
     * The unique identifier for the repair.
     */
    id?: string;

    /**
     * The short summary or title of the repair.
     */
    title: string;

    /**
     * The detailed description of the repair.
     */
    description?: string;

    /**
     * The user who is assigned to the repair.
     */
    assignedTo?: string;

    /**
     * The optional date and time when the repair is scheduled or completed.
     */
    @format("date-time")
    date?: string;

    /**
     * The URL of the image associated with the repair.
     */
    @format("uri")
    image?: string;
  }

```

- 次に `main.tsp` に戻り、これら新しい operations がエージェントの action に追加されていることを確認します。`RepairServiceActions` namespace 内の `op listRepairs is global.RepairsAPI.listRepairs;` の行の後に以下スニペットを貼り付けます。

```typespec
op createRepair is global.RepairsAPI.createRepair;
op updateRepair is global.RepairsAPI.updateRepair;
op deleteRepair is global.RepairsAPI.deleteRepair;   

```
- さらに、新しい修理アイテムを作成する会話スターターを、最初の会話スターター定義の直後に追加します。

```typespec
@conversationStarter(#{
  title: "Create repair",
  text: "Create a new repair titled \"[TO_REPLACE]\" and assign it to me"
})

```

<cc-end-step lab="e01" exercise="2" step="1" />

### 手順 2: function 参照に Adaptive Card を追加する

次に、参照カードまたは応答カードを Adaptive Cards で強化します。`listRepairs` operation に対し、修理アイテム用の adaptive card を追加します。 

- プロジェクト フォルダーで **appPackage** フォルダーの下に **cards** という新しいフォルダーを作成します。**cards** フォルダーに `repair.json` ファイルを作成し、下記コード スニペットをそのまま貼り付けます。 

```json
{
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.5",
    "body": [
  {
    "type": "Container",
    "$data": "${$root}",
    "items": [
      {
        "type": "TextBlock",
        "text": "Title: ${if(title, title, 'N/A')}",
        "weight": "Bolder",
        "wrap": true
      },
      {
        "type": "TextBlock",
        "text": "Description: ${if(description, description, 'N/A')}",
        "wrap": true
      },
      {
        "type": "TextBlock",
        "text": "Assigned To: ${if(assignedTo, assignedTo, 'N/A')}",
        "wrap": true
      },
      {
        "type": "TextBlock",
        "text": "Date: ${if(date, date, 'N/A')}",
        "wrap": true
      },
      {
        "type": "Image",
        "url": "${image}",
        "$when": "${image != null}"
      }
    ]
  }
],  
    "actions": [
      {
        "type": "Action.OpenUrl",
        "title": "View Image",
        "url": "https://www.howmuchisit.org/wp-content/uploads/2011/01/oil-change.jpg"
      }
    ]
  }
  

```

- 次に `actions.tsp` に戻り、`listRepairs` operation を見つけます。operation 定義 `@get op listRepairs(@query assignedTo?: string): string;` の直前に、以下スニペットを貼り付けカード定義を追加します。

```typespec

  @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "cards/repair.json"}) 
  
```

上記カード応答は、修理アイテムを問い合わせたときやエージェントがアイテム一覧を参照として返す際に送信されます。
続いて `createRepair` operation にも card response を追加し、POST 操作後にエージェントが作成した内容を表示できるようにします。 

- `@post op createRepair(@body repair: Repair): Repair;` の直前に下記スニペットを貼り付けます。

```typespec

   @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "cards/repair.json"}) 

```

<cc-end-step lab="e01" exercise="2" step="2" />

## 手順 3: code interpreter capabilities を追加する

Declarative エージェントは *OneDriveAndSharePoint*、*WebSearch*、*CodeInterpreter* など多くの capabilities を拡張できます。
ここではエージェントに code interpreter capability を追加します。

- `main.tsp` ファイルを開き、`RepairServiceAgent` namespace を探します。

- この namespace 内に、エージェントがコードを解釈し実行できるようにする新しい operation を定義する下記スニペットを挿入します。

```typespec
  op codeInterpreter is AgentCapabilities.CodeInterpreter;
```

!!! tip
    上記 *CodeInterpreter* operation は外側の `RepairServiceAgent` namespace 内に配置し、エージェントの action を定義する `RepairServiceActions` namespace には入れないでください。  

エージェントが追加機能をサポートするようになったため、instructions も更新してこの拡張を反映させます。

- 同じ `main.tsp` ファイルで instructions 定義を更新し、エージェントへの追加指示を含めます。

```typespec
@instructions("""
  ## Purpose
You will assist the user in finding car repair records based on the information provided by the user. When asked to display a report, you will use the code interpreter to generate a report based on the data you have.

  ## Guidelines
- You are a repair service agent.
- You can use the code interpreter to generate reports based on the data you have.
- You can use the actions to create, update, and delete repairs.
- When creating a repair item, if the user did not provide a description or date , use title as description and put todays date in format YYYY-MM-DD
- Do not show any code or technical details to the user. 
- Do not use any technical jargon or complex terms.

""")

```

<cc-end-step lab="e01" exercise="2" step="3" />

### 手順 4: エージェントをプロビジョニングしてテストする

修理アナリストとしても機能するようになった更新済みエージェントをテストしましょう。 

- Agents Toolkit 拡張アイコンを選択してアクティビティ バーを開きます。
- ツールキットのアクティビティ バーで **LifeCycle** セクション下の **Provision** を選択し、更新済みエージェントをパッケージ化してアップロードします。 
- その後、開いているブラウザー セッションを更新します。 
- **Agents** の一覧から **RepairServiceAgent** を選択します。
- 会話スターター **Create repair** を使い、タイトルを変更して送信し会話を開始します。例:

    `Create a new repair titled "rear camera issue" and assign it to me.`

- 確認ダイアログには送信した内容以上のメタデータが表示されます。これは新しい instructions の効果です。 

![The confirmation message provided by Microsoft 365 Copilot when sending a POST request to the target API. There are buttons to 'Confirm' or to 'Cancel' sending the request to the API.](https://github.com/user-attachments/assets/56629979-b1e5-4a03-a413-0bb8bb438f00)
 
 - **Confirm** を選択してアイテムを追加します。

 エージェントは作成したアイテムをリッチな adaptive card で返します。

 ![The response after creating a new item, with the information about the item to repair rendered through an adaptive card with a button to show the associated image.](https://github.com/user-attachments/assets/6da0a38f-5de3-485a-999e-c695389853f8)

 - 参照カードが機能するか再確認します。以下のプロンプトを送信してください。

     `List all my repairs.`

エージェントは修理一覧を返し、各アイテムを adaptive card で参照できます。

![The response for the list of repairs with a reference button for each item, showing an adaptive card when hoovering on it.](https://github.com/user-attachments/assets/880ad3aa-2ed3-4051-a68b-d988527d9d53)

- 次に、エージェントの新しい分析機能をテストします。右上の **New chat** ボタンを選択して新しいチャットを開きます。
- 次のプロンプトをコピーしメッセージ ボックスに貼り付け、Enter キーで送信します。

    `Classify repair items based on title into three distinct categories: Routine Maintenance, Critical, and Low Priority. Then, generate a pie chart displaying the percentage representation of each category. Use unique colours for each group and incorporate tooltips to show the precise values for each segment.`

下図のような応答が得られるはずです (内容は変わる場合があります)。 

![The response when using the Code Interpreter capability. There are a detailed text and a chart showing the percentage representation of each category of repair.](https://github.com/user-attachments/assets/ea1a5b21-bc57-4ed8-a8a4-c187caff2c64)

<cc-end-step lab="e01" exercise="2" step="3" />

## 演習 3: エージェントの診断とデバッグ

チャットで開発者モードを有効にすると、エージェントがタスクをどの程度理解しているか、サービスを適切に呼び出しているか、微調整が必要な箇所、パフォーマンス問題などを把握し、インタラクションを追跡・分析できます。

### 手順 1: チャットでのエージェント デバッグ

- 次の行をエージェントとのチャットにコピー & ペーストし、デバッグ モードを有効にします。

    ```
    -developer on
    ```

- 問題がなければエージェントから `Successfully enabled developer mode.` と返されます。

- 次にテストとして、以下のようなプロンプトを送信してみます。

   `Find out what Karin is working on.`

- 修理サービスからの情報と共に **Agent debug info** カードが表示されます。
- **Agent debug info** カードを展開すると以下の情報が確認できます:
    - エージェント情報 1️⃣
    - エージェントの capabilities 2️⃣
    - actions と選択された function 3️⃣
    - 実行された action の詳細 (リクエスト、レイテンシ、レスポンス データなど) 4️⃣

![The developer debug information card in Microsoft 365 Copilot when analysing the request for an action. There are sections about agent info, capabilities, actions, connected agents, execution, etc.](https://github.com/user-attachments/assets/b135f3b0-50f1-47a1-b608-a5a1b27b806e)

- **Executed Actions** を展開すると、リクエスト URL、渡されたパラメーター、リクエスト ヘッダー、レスポンス、レイテンシなどが確認できます。 

<cc-end-step lab="e01" exercise="3" step="1" />

---8<--- "ja/e-congratulations.md"

素晴らしい！最初のエージェントを構築しました 🎉 

 **Next** を選択して API を作成・構築・統合へ進みましょう。
 <cc-next url="../02-build-the-api" label="Next" />

引き続き基礎を探求し、Geolocator ゲームを構築したい場合は **Create a game** を選択してください。  
 <cc-next url="../01a-geolocator" label="Create a game" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/01-typespec-declarative-agent" />