---
search:
  exclude: true
---
# ラボ E1 - Microsoft 365 Agents Toolkit と TypeSpec を使った Declarative エージェントの初回構築

このラボでは Microsoft 365 Agents Toolkit を使用し、TypeSpec 定義を用いた Declarative エージェントを作成します。車の修理記録を管理するために `RepairServiceAgent` というエージェントを作成し、既存の API サービス経由で修理データと対話できるようにします。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RNsa0kLsXgY" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を確認してください。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## Declarative エージェントとは 

**Declarative エージェント** は、Microsoft 365 Copilot と同じスケーラブルなインフラストラクチャとプラットフォームを活用しつつ、特定領域に特化したニーズを満たすよう設計されています。標準の Microsoft 365 Copilot チャットと同じインターフェイスを使用しながら、対象タスクのみに集中する専門家として機能します。

### Declarative エージェントの構成

Copilot 用にエージェントを複数作成していくと、最終的な成果物が数個のファイルを zip にまとめた「アプリ パッケージ」になることがわかります。これは Teams アプリを作ったことがある方にはおなじみの構成ですが、追加要素があります。以下の表でコア要素を確認してください。デプロイ手順も Teams アプリとほぼ同じです。

| ファイル種別                          | 説明                                                                                                                                                     | 必須 |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| Microsoft 365 App Manifest        | 標準の Teams アプリ マニフェストを定義する JSON ファイル (`manifest.json`)。                                                                                     | Yes      |
| Declarative Agent Manifest        | エージェント名、指示、機能、会話スターター、アクション (該当する場合) を含む JSON ファイル。                                        | Yes      |
| Plugin Manifest       | アクションを API プラグインとして構成するための JSON ファイル。認証、必須フィールド、Adaptive Card 応答などを含みます。アクションがある場合のみ必要。 | No       |
| OpenAPI Spec            | API を定義する JSON または YAML ファイル。エージェントがアクションを含む場合のみ必要。                                                                            | No       |

### Declarative エージェントの機能

エージェントのフォーカスとデータ コンテキストを強化するために、指示だけでなく参照すべきナレッジ ベース (機能) も指定できます。執筆時点で Declarative エージェントがサポートする機能は次のとおりです。

- **Copilot Connectors**: 外部コンテンツを Microsoft 365 に取り込み、検索性と発見性を向上。
- **OneDrive and SharePoint**: OneDrive や SharePoint のファイル／サイト URL を指定し、ナレッジ ベースに追加。
- **Web search**: Web コンテンツをナレッジ ベースに含めるかどうかを制御。最大 4 つまでのサイト URL をソースとして渡せます。
- **Code interpreter**: 数学問題の解決や Python による高度なデータ分析、チャート生成をサポート。
- **GraphicArt**: DALL·E を利用した画像・動画生成。
- **Email knowledge**: 個人または共有メールボックス (およびフォルダー) をナレッジとして利用。
- **People knowledge**: 組織内の人物に関する質問に回答。
- **Teams messages**: Teams のチャネル、チーム、会議、1:1 チャット、グループ チャットを検索。
- **Dataverse knowledge**: Dataverse インスタンスをナレッジ ソースとして追加。

!!! tip "OneDrive と SharePoint"
    URL には SharePoint アイテム (サイト、ドキュメント ライブラリ、フォルダー、ファイル) の完全パスを指定してください。ファイルやフォルダーを右クリックし **[詳細]** → **[パス]** のコピー アイコンで取得できます。  
    <mark>URL を指定しない場合、ログインしたユーザーがアクセス可能な OneDrive と SharePoint の全コンテンツがエージェントで使用されます。</mark>

!!! tip "Microsoft Copilot Connector"
    コネクションを指定しない場合、ログイン ユーザーがアクセスできる Copilot Connectors の全コンテンツが使用されます。

!!! tip "Web search"
    サイトを指定しない場合、エージェントはすべてのサイトを検索できます。指定できるサイトは 4 件までで、パス セグメントは 2 つ以下、クエリ ストリングは不可です。


## Declarative エージェントにおける TypeSpec の重要性

### TypeSpec とは

TypeSpec は Microsoft が開発した、API 契約を構造化かつ型安全に設計・記述するための言語です。API が受け取る／返すデータやアクションの接続方法などを設計図として示します。

### エージェントに TypeSpec を使用する理由

TypeScript がコードに構造を強制するように、TypeSpec はエージェントとその API サービス (アクションなど) に構造を強制します。Visual Studio Code などのツールと親和性が高いデザイン ファーストの開発フローに最適です。

- 明確なコミュニケーション: 複数のマニフェスト ファイルを扱う際の混乱を避け、単一のソース オブ トゥルースを提供。
- 一貫性: エージェントのアクションや機能を同じパターンで設計可能。
- 自動化: OpenAPI 仕様やその他のマニフェストを自動生成し、人為的ミスを削減。
- 早期検証: 不一致なデータ型や不明瞭な定義など設計段階で問題を検出。
- デザイン ファースト: 実装に入る前に構造や契約を考えることで保守性を向上。

## 演習 1: Microsoft 365 Agents Toolkit と TypeSpec でベース エージェントを構築する


### 手順 1: Microsoft 365 Agents Toolkit でベース エージェント プロジェクトをスキャフォールディングする
- VS Code の左メニューから Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択します。アクティビティ バーが開きます。  
- アクティビティ バーで **Create a New Agent/App** ボタンを選択し、利用可能なテンプレートのパレットを開きます。  
- リストから **Declarative Agent** を選択します。  
- 続いて **Start with TypeSpec for Microsoft 365 Copilot** を選択して、TypeSpec でエージェントを定義します。  
- エージェント プロジェクトを生成するフォルダーを選択します。  
- アプリケーション名を「RepairServiceAgent」のように入力し、Enter キーを押して完了します。新しい VS Code ウィンドウにエージェント プロジェクトが読み込まれます。  

<cc-end-step lab="e01" exercise="1" step="1" />

### 手順 2: Microsoft 365 Agents Toolkit にサインインする 

エージェントをアップロードしてテストするには、Microsoft 365 Agents Toolkit へのサインインが必要です。

- プロジェクト ウィンドウで再度 Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択し、アクティビティ バーを開きます。  
- **Accounts** セクションの **Sign in to Microsoft 365** を選択します。サインインまたは Microsoft 365 開発者サンドボックスを作成するダイアログが表示されるので **Sign in** を選択します。  
- サインイン完了後、ブラウザーを閉じてプロジェクト ウィンドウに戻ります。

<cc-end-step lab="e01" exercise="1" step="2" />

### 手順 3: エージェントを定義する 

Agents Toolkit がスキャフォールディングした Declarative エージェント プロジェクト テンプレートには、GitHub API に接続してリポジトリの issue を表示するコードが含まれています。このラボでは自動車修理サービスと統合し、修理データを管理する複数の操作をサポートする独自エージェントを構築します。

プロジェクト フォルダーには `main.tsp` と `actions.tsp` の 2 つの TypeSpec ファイルがあります。  
エージェントのメタデータ、指示、機能は `main.tsp` で定義します。  
`actions.tsp` ではエージェントのアクションを定義します。API サービスへの接続などアクションがある場合はここで定義します。

`main.tsp` を開き、修理サービス シナリオに合わせてテンプレートの内容を確認・変更します。 

#### エージェントのメタデータと指示を更新する

`main.tsp` にはエージェントの基本構造が記載されています。テンプレートで提供されている内容を確認します。
- エージェント名と説明 1️⃣
- 基本指示 2️⃣
- アクションと機能のプレースホルダー コード (コメントアウト) 3️⃣

![Visual Studio Code showing the initially scaffolded template for a Declarative Agent defined in TypeSpec. There TypeSpec syntax elements to define the agent, its instructions, and some commented out commands to define starter prompts and actions.](https://github.com/user-attachments/assets/42da513c-d814-456f-b60f-a4d9201d1620)


修理シナリオ用にエージェントを定義します。`@agent` と `@instructions` の定義を以下のコード スニペットに置き換えてください。

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

次に会話スターターを追加します。指示のすぐ下にコメントアウトされたコードがありますのでアンコメントし、タイトルとテキストを以下のように変更します。

```typespec
// Uncomment this part to add a conversation starter to the agent.
// This will be shown to the user when the agent is first created.
@conversationStarter(#{
  title: "List repairs",
  text: "List all repairs"
})

```

#### エージェントのアクションを更新する

次に `actions.tsp` を開き、エージェントのアクションを定義します。後で `main.tsp` に戻り、アクション参照を含めたメタデータを完成させますが、まずアクション自体を定義します。

プレースホルダー コードは GitHub リポジトリのオープン issue を検索するためのものです。これは新規ユーザー向けの例として、アクション メタデータ、API ホスト URL、操作や関数の定義が示されています。これを修理サービス用に置き換えます。

インポートや using ステートメントなどのモジュール レベルのディレクティブに続く部分を、"SERVER_URL" が定義される箇所まで以下のスニペットで置き換えてください。この更新でアクション メタデータとサーバー URL を設定します。名前空間は GitHubAPI から RepairsAPI に変更されています。

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

次にテンプレート内の `searchIssues` 操作を `listRepairs` に置き換えます。これは修理一覧取得操作です。`SERVER_URL` 定義直後から最後の閉じ括弧の *手前* までのコード ブロックを以下のスニペットで置き換えてください。閉じ括弧自体は残します。

```typespec
  /**
   * List repairs from the API 
   * @param assignedTo The user assigned to a repair item.
   */

  @route("/repairs")
  @get  op listRepairs(@query assignedTo?: string): string;

````

`main.tsp` に戻り、先ほど定義したアクションをエージェントに追加します。会話スターターの後にあるコード ブロック全体を以下のスニペットに置き換えてください。

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

### 手順 4: (任意) デコレーターを理解する

TypeSpec ファイル `main.tsp` と `actions.tsp` には、デコレーター (@ で始まる)、名前空間、モデルなどが含まれています。興味があればこの手順で内容を確認してください。すぐにテストしたい場合は手順 5 に進んでかまいません。

以下の表で使用されている主なデコレーターを確認してください。 

| アノテーション             | 説明                                                                                                                                                     |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| @agent             | エージェントの名前空間 (名前) と説明を定義                                                                                                       |
| @instructions       | エージェントの動作を規定する指示を定義 (8,000 文字以内)                                                                     |
| @conversationStarter | エージェントの会話スターターを定義                                                                                                                     |
| op            | あらゆる操作を定義。*op GraphicArt*、*op CodeInterpreter* などの機能操作、または **op listRepairs** などの API 操作を定義 |
| @server           | API のサーバー エンドポイントとその名前を定義                                                                                                              |
| @capabilities      | 関数内で使用すると、確認カードなど簡単な Adaptive Card を定義                                                                                                  |


<cc-end-step lab="e01" exercise="1" step="4" />

### 手順 5: エージェントをテストする

次は Repair Service Agent をテストします。 

- Agents Toolkit のアイコンを選択し、プロジェクト内からアクティビティ バーを開きます。  
- アクティビティ バーの **LifeCycle** セクションで **Provision** を選択します。これによりマニフェスト ファイルとアイコンを含むアプリ パッケージが生成され、自分専用にカタログへサイドロードされます。 

!!! tip "Knowledge"
    Agents Toolkit は TypeSpec ファイルで提供されたすべての定義を検証し、正確性を確保します。エラーも特定して開発体験を向上させます。

- Web ブラウザーで [https://m365.cloud.microsoft/chat](https://m365.cloud.microsoft/chat){target=_blank} にアクセスし、Copilot アプリを開きます。

!!! note "Help"
    Copilot アプリで "Something went wrong" と表示された場合は、ブラウザーをリフレッシュしてください。  

- Microsoft 365 Copilot の **Agents** 一覧から **RepairServiceAgent** を選択します。  
  プロビジョニングの進捗を示すトースト通知が表示されるまで少し時間がかかります。

- 会話スターター **List repairs** を選択し、プロンプトを送信してエージェントと対話し、応答を確認します。

!!! tip "Help"
    クエリを処理するためにエージェントへの接続を求められたら、通常は 1 度だけ表示されます。このラボをスムーズに進めるには **Always allow** を選択してください。  
    ![Screenshot of the agent in action with the response for the prompt 'List all repairs' showing repairs with pictures.](https://github.com/user-attachments/assets/02400c13-0766-4440-999b-93c88ca45dc7)

- 次の演習で使用するため、ブラウザー セッションは開いたままにしておきます。 

<cc-end-step lab="e01" exercise="1" step="5" />

## 演習 2:  エージェントの機能を拡張する
次に、エージェントにさらなる操作を追加し、Adaptive Card を使用した応答を有効にし、Code Interpreter 機能を取り入れます。VS Code のプロジェクトに戻って、それぞれの拡張を段階的に行いましょう。

### 手順 1: 操作を追加してエージェントを変更する

- `actions.tsp` を開き、`listRepairs` 操作の直後に以下のスニペットをコピー & ペーストして `createRepair`、`updateRepair`、`deleteRepair` の新しい操作を追加します。ここでは `Repair` アイテムのデータ モデルも定義しています。

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

- `main.tsp` に戻り、これら新規操作がエージェントのアクションにも追加されていることを確認します。`op listRepairs is global.RepairsAPI.listRepairs;` の行の後に以下のスニペットを貼り付けます。

```typespec
op createRepair is global.RepairsAPI.createRepair;
op updateRepair is global.RepairsAPI.updateRepair;
op deleteRepair is global.RepairsAPI.deleteRepair;   

```
- また、新しい修理アイテムを作成する会話スターターを、最初の会話スターター定義の直後に追加します。

```typespec
@conversationStarter(#{
  title: "Create repair",
  text: "Create a new repair titled \"[TO_REPLACE]\" and assign it to me"
})

```

<cc-end-step lab="e01" exercise="2" step="1" />

### 手順 2: 関数参照に Adaptive Card を追加する

次に、参照カードや応答カードを Adaptive Card で強化します。`listRepairs` 操作に対して修理アイテム用のカードを追加してみましょう。 

- プロジェクト フォルダーで **appPackage** フォルダー配下に **cards** フォルダーを作成します。**cards** フォルダー内に `repair.json` ファイルを作成し、以下のコード スニペットをそのまま貼り付けます。 

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

- `actions.tsp` に戻り、`listRepairs` 操作を見つけます。操作定義 `@get op listRepairs(@query assignedTo?: string): string;` の直上に以下のスニペットを貼り付け、カード定義を追加します。

```typespec

  @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "cards/repair.json"}) 
  
```

上記のカード応答は、修理アイテムについて尋ねた際やエージェントがアイテム一覧を参照として返す際に送られます。  
続いて `createRepair` 操作にも Adaptive Card 応答を追加し、POST 後にエージェントが作成した内容を表示します。

- `@post op createRepair(@body repair: Repair): Repair;` の直上に以下のスニペットをコピー & ペーストしてください。

```typespec

   @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "cards/repair.json"}) 

```

<cc-end-step lab="e01" exercise="2" step="2" />

## 手順 3:  Code Interpreter 機能を追加する

Declarative エージェントは *OneDriveAndSharePoint*、*WebSearch*、*CodeInterpreter* など多くの機能を拡張できます。  
ここでは Code Interpreter 機能を追加します。

- `main.tsp` を開き、`RepairServiceAgent` 名前空間を探します。

- この名前空間内に次のスニペットを挿入し、エージェントがコードを解釈して実行できるようにします。

```typespec
  op codeInterpreter is AgentCapabilities.CodeInterpreter;
```

!!! tip
    上記 *CodeInterpreter* 操作は外側の `RepairServiceAgent` 名前空間内に貼り付け、アクションを定義する `RepairServiceActions` 名前空間には入れないでください。  

エージェントが追加機能をサポートするようになったので、指示も更新して反映させましょう。

- 同じ `main.tsp` ファイルで `instructions` 定義を更新し、エージェントへの追加指示を加えます。

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

### 手順 4:  エージェントをプロビジョニングしてテストする

更新された修理分析エージェントをテストしましょう。 

- Agents Toolkit のアイコンを選択してアクティビティ バーを開きます。  
- アクティビティ バーの **LifeCycle** で **Provision** を選択し、更新済みエージェントをパッケージ化してアップロードします。  
- ブラウザー セッションに戻り、ページをリフレッシュします。  
- **Agents** から **RepairServiceAgent** を選択します。  
- 会話スターター **Create repair** を使ってやり取りを開始します。プロンプトの一部を置き換えてタイトルを追加し、送信して対話を開始します。例:

    `Create a new repair titled "rear camera issue" and assign it to me.`

- 確認ダイアログには、追加した指示のおかげで送信内容以上のメタデータが表示されているはずです。 

![The confirmation message provided by Microsoft 365 Copilot when sending a POST request to the target API. There are buttons to 'Confirm' or to 'Cancel' sending the request to the API.](https://github.com/user-attachments/assets/56629979-b1e5-4a03-a413-0bb8bb438f00)
 
 - ダイアログを **Confirm** してアイテムを追加します。

 エージェントが生成したリッチな Adaptive Card で作成済みアイテムが返されます。

 ![The response after creating a new item, with the information about the item to repair rendered through an adaptive card with a button to show the associated image.](https://github.com/user-attachments/assets/6da0a38f-5de3-485a-999e-c695389853f8)

 - 参照カードが機能するか再確認します。以下のプロンプトを送信してください。

     `List all my repairs.`

エージェントは修理一覧を返し、各アイテムが Adaptive Card で参照されます。

![The response for the list of repairs with a reference button for each item, showing an adaptive card when hoovering on it.](https://github.com/user-attachments/assets/880ad3aa-2ed3-4051-a68b-d988527d9d53)

- 次にエージェントの新しい分析機能をテストします。右上の **New chat** ボタンで新しいチャットを開きます。  
- 以下のプロンプトをコピーして送信してください。

    `Classify repair items based on title into three distinct categories: Routine Maintenance, Critical, and Low Priority. Then, generate a pie chart displaying the percentage representation of each category. Use unique colours for each group and incorporate tooltips to show the precise values for each segment.`

次のような応答が得られます (内容は状況により異なります)。 

![The response when using the Code Interpreter capability. There are a detailed text and a chart showing the percentage representation of each category of repair.](https://github.com/user-attachments/assets/ea1a5b21-bc57-4ed8-a8a4-c187caff2c64)

<cc-end-step lab="e01" exercise="2" step="3" />

## 演習 3: エージェントの診断とデバッグ

チャットでデベロッパー モードを有効にすると、エージェントがタスクをどの程度理解しているか、サービスを適切に呼び出しているか、チューニングが必要な部分、パフォーマンスの問題などを把握できます。

### 手順 1:   チャットでのエージェント デバッグ

- 以下の行をエージェントとのチャットにコピー & ペーストし、デベロッパー モードを有効にします。

    ```
    -developer on
    ```

- 正常に有効化されると `Successfully enabled developer mode.` と応答が返ります。

- 次に、エージェントと対話するプロンプトを送信してテストします。例:

   `Find out what Karin is working on.`

- 修理サービスからの情報とともに **Agent debug info** カードが表示されます。  
- **Agent debug info** カードを展開して詳細を確認します。  
  - エージェント情報 1️⃣  
  - エージェントの機能 2️⃣  
  - アクションと選択された関数 3️⃣  
  - 実行されたアクションの詳細 (リクエスト、レイテンシ、レスポンス データなど) 4️⃣

![The developer debug information card in Microsoft 365 Copilot when analysing the request for an action. There are sections about agent info, capabilities, actions, connected agents, execution, etc.](https://github.com/user-attachments/assets/b135f3b0-50f1-47a1-b608-a5a1b27b806e)

- **Executed Actions** を展開すると、リクエスト URL、送信されたパラメーター、リクエスト ヘッダー、レスポンス、レイテンシなどを確認できます。 

<cc-end-step lab="e01" exercise="3" step="1" />

---8<--- "ja/e-congratulations.md"

Great job on building your first agent 🎉 

 Proceed to create, build, and integrate an API selecting **Next**.
 <cc-next url="../02-build-the-api" label="Next" />

If you still want to keep exploring the fundamentals by building a game called Geolocator game, select below **Create a game**
 <cc-next url="../01a-geolocator" label="Create a game" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/01-typespec-declarative-agent" />