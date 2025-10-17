---
search:
  exclude: true
---
# ラボ E1 - Microsoft 365 Agents Toolkit と TypeSpec 定義による Declarative エージェントの初構築

このラボでは、Microsoft 365 Agents Toolkit を使用して TypeSpec 定義付き Declarative エージェントを構築します。`RepairServiceAgent` というエージェントを作成し、既存の API サービスを介して修理データと対話し、ユーザーが自動車の修理記録を管理できるようにします。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RNsa0kLsXgY" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を短時間で確認できます。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## Declarative エージェントとは

**Declarative エージェント** は、Microsoft 365 Copilot と同じスケーラブルなインフラストラクチャとプラットフォームを活用しつつ、特定分野にフォーカスしてニーズを満たすように最適化されたものです。標準の Microsoft 365 Copilot チャットと同じインターフェイスを使用しながら、専用タスクに専念する専門家として機能します。

### Declarative エージェントの構成要素

Copilot 用に複数のエージェントを構築すると、最終的な成果物が数個のファイルをまとめた zip ファイル（アプリ パッケージ）であることに気付くでしょう。これはインストールして利用します。そのため、アプリ パッケージが何で構成されているかを理解することが重要です。Declarative エージェントのアプリ パッケージは、Teams アプリを構築したことがある場合はそれに似ていますが、追加要素があります。以下の表で主な要素を確認できます。アプリの展開プロセスも Teams アプリと非常によく似ています。

| ファイル種別                        | 説明                                                                                                                                                               | 必須 |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|------|
| Microsoft 365 App Manifest        | 標準の Teams アプリ マニフェストを定義する JSON ファイル (`manifest.json`)。                                                                                     | Yes  |
| Declarative Agent Manifest        | エージェント名、指示、機能、会話スターター、アクション（該当する場合）を含む JSON ファイル。                                                                      | Yes  |
| Plugin Manifest                   | アクションを API プラグインとして構成するための JSON ファイル。認証、必須フィールド、Adaptive Card 応答などを含む。アクションが存在する場合のみ必要。                        | No   |
| OpenAPI Spec                      | API を定義する JSON または YAML ファイル。エージェントにアクションが含まれる場合のみ必要。                                                                     | No   |

### Declarative エージェントの機能

エージェントの焦点を文脈とデータに拡張するには、指示を追加するだけでなく、アクセスすべきナレッジ ベースを指定できます。これらを **capabilities**（機能）と呼びます。執筆時点で Declarative エージェントがサポートする機能は以下の通りです。

- **Copilot Connectors** - 外部コンテンツを Microsoft 365 に取り込み、情報の検索性を向上させ、組織内の他者が新しいコンテンツを発見できるようにします。
- **OneDrive and SharePoint** - OneDrive と SharePoint のファイル／サイトの URL を指定し、エージェントのナレッジ ベースに含めることができます。
- **Web search** - Web コンテンツをナレッジ ベースとして有効／無効にできます。ソースとして最大 4 件のウェブサイト URL を渡せます。
- **Code interpreter** - 数学問題の解決や複雑なデータ分析、チャート生成のために Python コードを活用できるエージェントを構築できます。
- **GraphicArt** - DALL·E を使用した画像や動画の生成が可能なエージェントを構築できます。
- **Email knowledge** - 個人または共有メールボックス、オプションで特定フォルダーをナレッジとして利用するエージェントを構築できます。
- **People knowledge** - 組織内の個人に関する質問に回答できるエージェントを構築できます。
- **Teams messages** - Teams のチャネル、チーム、会議、1:1 チャット、グループ チャットを検索できるようにします。
- **Dataverse knowledge** - Dataverse インスタンスをナレッジ ソースとして追加できます。

!!! tip "OnDrive and SharePoint"
    URL は SharePoint アイテム（サイト、ドキュメント ライブラリ、フォルダー、ファイル）のフル パスである必要があります。SharePoint の「リンクをコピー」オプションを使用して取得できます。ファイルまたはフォルダーを右クリックし、[詳細] を選択後、[パス] に移動してコピー アイコンをクリックしてください。<mark>URL を指定しない場合、サインインしているユーザーがアクセスできる OneDrive と SharePoint の全コンテンツがエージェントで使用されます。</mark>

!!! tip "Microsoft Copilot Connector"
    接続を指定しない場合、サインイン ユーザーがアクセスできる Copilot Connectors の全コンテンツがエージェントで使用されます。

!!! tip "Web search"
    サイトを指定しない場合、エージェントはすべてのサイトを検索できます。最大 4 つのサイトを指定でき、パス セグメントは 2 つ以内、クエリ文字列は含められません。


## Declarative エージェントにおける TypeSpec の重要性

### TypeSpec とは

TypeSpec は、API 契約を構造化かつ型安全な方法で設計・記述するために Microsoft が開発した言語です。API が受け入れるデータや返すデータ、API とそのアクションの接続方法など、API の設計図のようなものと考えてください。

### エージェントに TypeSpec を使用する理由

TypeScript がフロントエンド／バックエンド コードに構造を強制するのと同様に、TypeSpec はエージェントとその API サービス（アクションなど）に構造を強制します。Visual Studio Code などのツールに適合したデザインファースト開発ワークフローに最適です。

- 明確なコミュニケーション: 複数のマニフェスト ファイルを扱う際の混乱を避け、エージェントの動作を定義する単一のソース オブ トゥルースを提供します。
- 一貫性: エージェントのすべての部分やアクション、機能などが同じパターンに従って設計されることを保証します。
- 自動化対応: OpenAPI スペックやその他のマニフェストを自動生成し、時間を節約しヒューマン エラーを削減します。
- 早期バリデーション: 実装コードを書く前に設計の問題（型不一致や定義の不明確さなど）を検出します。
- デザインファースト アプローチ: 実装に入る前にエージェントと API の構造・契約を考えるよう促し、長期的な保守性を向上させます。

## エクササイズ 1: Microsoft 365 Agents Toolkit と TypeSpec でベース エージェントを構築する


### 手順 1: Microsoft 365 Agents Toolkit でベース エージェント プロジェクトをスキャフォールディングする
- VS Code 左メニューから Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択します。アクティビティ バーが開きます。  
- アクティビティ バーで 「Create a New Agent/App」 ボタンを選択すると、利用可能なアプリ テンプレートの一覧がパレットに表示されます。  
- 一覧から 「Declarative Agent」 を選択します。  
- 次に 「Start with TypeSpec for Microsoft 365 Copilot」 を選択し、TypeSpec でエージェントを定義します。  
- スキャフォールディング先のフォルダーを選択します。  
- アプリケーション名を「RepairServiceAgent」などと入力し、Enter を押して完了します。新しい VS Code ウィンドウにエージェント プロジェクトが読み込まれます。

<cc-end-step lab="e01" exercise="1" step="1" />

### 手順 2: Microsoft 365 Agents Toolkit にサインインする

エージェントをアップロードしてテストするために Microsoft 365 Agents Toolkit へサインインする必要があります。

- プロジェクト ウィンドウ内で再度 Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択し、アクティビティ バーを開きます。  
- 「Accounts」 セクションで 「Sign in to Microsoft 365」 を選択します。エディターからダイアログが開き、Microsoft 365 開発者サンドボックスを作成またはサインイン、もしくはキャンセルを選択できます。「Sign in」を選択してください。  
- サインイン後、ブラウザーを閉じてプロジェクト ウィンドウに戻ります。

<cc-end-step lab="e01" exercise="1" step="2" />

### 手順 3: エージェントを定義する

Agents Toolkit によってスキャフォールディングされた Declarative エージェント プロジェクト テンプレートには、GitHub API に接続してリポジトリの issue を表示するサンプル コードが含まれています。本ラボでは、自動車修理サービスと統合し、複数の操作で修理データを管理する独自エージェントを構築します。

プロジェクト フォルダーには `main.tsp` と `actions.tsp` の 2 つの TypeSpec ファイルがあります。  
`main.tsp` にはエージェントのメタデータ、指示、機能が定義されます。  
`actions.tsp` ではエージェントのアクションを定義します。API サービスへの接続などアクションがある場合は、このファイルで定義します。

`main.tsp` を開き、デフォルト テンプレートの内容を確認します。修理サービス シナリオに合わせて変更します。 

#### エージェントのメタデータと指示を更新する

`main.tsp` にはエージェントの基本構造が記載されています。Agents Toolkit テンプレートに含まれる内容を確認してください。
- エージェント名と説明 1️⃣  
- 基本指示 2️⃣  
- アクションと機能のプレースホルダー コード（コメントアウト）3️⃣  

![Visual Studio Code showing the initially scaffolded template for a Declarative Agent defined in TypeSpec. There TypeSpec syntax elements to define the agent, its instructions, and some commented out commands to define starter prompts and actions.](https://github.com/user-attachments/assets/42da513c-d814-456f-b60f-a4d9201d1620)


まず、修理シナリオ用のエージェントを定義します。`@agent` と `@instructions` の定義を以下のコード スニペットに置き換えてください。

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

次に、エージェントの会話スターターを追加します。指示のすぐ下にコメントアウトされたコードがあるのでアンコメントし、タイトルとテキストを以下のように置き換えます。

```typespec
// Uncomment this part to add a conversation starter to the agent.
// This will be shown to the user when the agent is first created.
@conversationStarter(#{
  title: "List repairs",
  text: "List all repairs"
})

```

#### エージェントのアクションを更新する

次に `actions.tsp` を開き、エージェントのアクションを定義します。後で `main.tsp` に戻り、エージェント メタデータにアクション参照を追加しますが、まずアクション自体を定義する必要があります。

`actions.tsp` のプレースホルダー コードは GitHub リポジトリのオープン issue を検索するように設計されています。アクションのメタデータ、API ホスト URL、操作や関数の定義方法を理解するための出発点です。これを修理サービス用に置き換えます。

インポートや using ステートメントなどモジュール レベルのディレクティブの後、`SERVER_URL` が定義される箇所までの既存コードを以下のスニペットで置き換えます。この更新ではアクションのメタデータを導入し、サーバー URL を設定します。また、名前空間を GitHubAPI から RepairsAPI に変更します。

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

次にテンプレート コードの `searchIssues` 操作を `listRepairs` に置き換えます。これは修理の一覧を取得する操作です。`SERVER_URL` 定義直後から最後の閉じ括弧の *前* までのコード ブロック全体を以下のスニペットで置き換えてください。閉じ括弧は残してください。

```typespec
  /**
   * List repairs from the API 
   * @param assignedTo The user assigned to a repair item.
   */

  @route("/repairs")
  @get  op listRepairs(@query assignedTo?: string): string;

```

`main.tsp` に戻り、先ほど定義したアクションをエージェントに追加します。会話スターターの後に、以下のスニペットでコード ブロック全体を置き換えてください。

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

### 手順 4: デコレーターの理解（オプション）

オプション手順です。TypeSpec ファイルで何を定義したかを理解したい場合に読み進めてください。すぐにエージェントをテストしたい場合は手順 5 へ進んでください。  
`main.tsp` と `actions.tsp` には、デコレーター（@ で始まる）、名前空間、モデル、その他の定義が含まれています。

これらのファイルで使用される主なデコレーターの意味は次の通りです。

| アノテーション              | 説明                                                                                                                                                       |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| @agent                 | エージェントの名前空間（名前）と説明を定義します                                                                                                               |
| @instructions          | エージェントの行動を規定する指示を定義します。8,000 文字以内                                                                                                   |
| @conversationStarter   | エージェントの会話スターターを定義します                                                                                                                       |
| op                     | 任意の操作を定義します。*op GraphicArt* や *op CodeInterpreter* など機能定義、または **op listRepairs** など API 操作を定義する場合があります |
| @server                | API のサーバー エンドポイントとその名前を定義します                                                                                                             |
| @capabilities          | 関数内で使用すると、操作確認カードなどのシンプルな Adaptive Card を定義します                                                                                    |


<cc-end-step lab="e01" exercise="1" step="4" />

### 手順 5: エージェントをテストする

次に Repair Service Agent をテストします。 

- エージェント Toolkit の拡張機能アイコンを選択し、アクティビティ バーを開きます。  
- アクティビティ バーの "LifeCycle" セクションで "Provision" を選択します。これにより、生成されたマニフェスト ファイルとアイコンを含むアプリ パッケージがビルドされ、カタログにサイドロードされます（自分専用でテスト用）。  

!!! tip "Knowledge"
    Agents Toolkit はここで TypeSpec ファイルの定義を検証し、正確性を確保します。エラーも識別して開発者体験を向上させます。

- ブラウザーで [https://m365.cloud.microsoft/chat](https://m365.cloud.microsoft/chat){target=_blank} を開き、Copilot アプリへ移動します。

!!! note "Help"
    Copilot アプリで "Something went wrong" が表示された場合は、ブラウザーをリフレッシュしてください。  

- Microsoft 365 Copilot インターフェイスの **Agents** 一覧から **RepairServiceAgent** を選択します。  
- 会話スターター `List repairs` を選択し、チャットに送信してエージェントとの対話を開始し、応答を確認します。

!!! tip "Help"
    クエリ処理のためエージェント接続を求められた場合、この画面は通常 1 回だけ表示されます。ラボを円滑に進めるため **"Always allow"** を選択してください。  
    ![Screenshot of the agent in action with the response for the prompt 'List all repairs' showing repairs with pictures.](https://github.com/user-attachments/assets/02400c13-0766-4440-999b-93c88ca45dc7)

- 今後のエクササイズに備え、ブラウザー セッションは開いたままにしてください。 

<cc-end-step lab="e01" exercise="1" step="5" />

## エクササイズ 2: エージェント機能の強化
次に、操作を追加し、Adaptive Card で応答を強化し、code interpreter 機能を組み込みます。VS Code のプロジェクトに戻りましょう。

### 手順 1: 追加操作の実装

- `actions.tsp` を開き、`listRepairs` 操作の直後に以下のスニペットを貼り付けて `createRepair`、`updateRepair`、`deleteRepair` の新しい操作を追加します。また、`Repair` アイテムのデータ モデルも定義します。

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

- `main.tsp` に戻り、これらの新しい操作がエージェントのアクションにも追加されていることを確認します。`RepairServiceActions` 名前空間内の `op listRepairs is global.RepairsAPI.listRepairs;` の後に以下のスニペットを貼り付けます。

```typespec
op createRepair is global.RepairsAPI.createRepair;
op updateRepair is global.RepairsAPI.updateRepair;
op deleteRepair is global.RepairsAPI.deleteRepair;   

```
- さらに、最初の会話スターターのすぐ後に新しい会話スターターを追加して、修理アイテムを作成できるようにします。

```typespec
@conversationStarter(#{
  title: "Create repair",
  text: "Create a new repair titled \"[TO_REPLACE]\" and assign it to me"
})

```

<cc-end-step lab="e01" exercise="2" step="1" />

### 手順 2: 関数参照に Adaptive Card を追加

次に、参照カードや応答カードを Adaptive Card で強化します。`listRepairs` 操作に修理アイテム用の Adaptive Card を追加します。 

- プロジェクト フォルダーで **appPackage** フォルダーの下に **cards** フォルダーを新規作成します。**cards** フォルダー内に `repair.json` ファイルを作成し、以下のコード スニペットをそのまま貼り付けます。

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

- `actions.tsp` に戻り、`listRepairs` 操作を探します。操作定義 `@get op listRepairs(@query assignedTo?: string): string;` の直前に、以下のスニペットを貼り付けてカード定義を追加します。

```typespec

  @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "cards/repair.json"}) 
  
```

上記のカード応答は、修理アイテムを尋ねたときやエージェントが一覧を参照として返すときに送信されます。  
続いて `createRepair` 操作にも Adaptive Card を追加し、POST 操作後にエージェントが作成した内容を表示できるようにします。

- `@post op createRepair(@body repair: Repair): Repair;` の直前に以下のスニペットを貼り付けます。

```typespec

   @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "cards/repair.json"}) 

```

<cc-end-step lab="e01" exercise="2" step="2" />

## 手順 3: code interpreter 機能の追加

Declarative エージェントは *OneDriveAndSharePoint*、*WebSearch*、*CodeInterpreter* など多数の機能で拡張できます。  
ここでは code interpreter 機能を追加します。

- `main.tsp` を開き、`RepairServiceAgent` 名前空間を探します。

- この名前空間内に、エージェントがコードを解釈・実行できるようにする新しい操作を以下のスニペットで定義します。

```typespec
  op codeInterpreter is AgentCapabilities.CodeInterpreter;
```

!!! tip
    上記 *CodeInterpreter* 操作は、外側の `RepairServiceAgent` 名前空間内に貼り付けてください。アクションを定義する `RepairServiceActions` 名前空間ではありません。  

追加機能をサポートするようになったため、指示も更新して反映します。

- 同じ `main.tsp` ファイルで、指示定義を以下のように更新します。

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

### 手順 4: エージェントのプロビジョニングとテスト

修理アナリストにもなった更新済みエージェントをテストしましょう。 

- Agents Toolkit の拡張機能アイコンを選択してアクティビティ バーを開きます。  
- ツールキットの "LifeCycle" セクションで "Provision" を選択し、更新されたエージェントをパッケージ化してアップロードします。  
- ブラウザー セッションに戻り、リフレッシュします。  
- **Agents** 一覧から **RepairServiceAgent** を選択します。  
- 会話スターター 'Create repair' を使い、タイトルを含めて下記例のようにプロンプトを送信してください。

    `Create a new repair titled "rear camera issue" and assign it to me.`

- 確認ダイアログには、送信した内容より多くのメタデータが表示されます。これは新しい指示のおかげです。  

![The confirmation message provided by Microsoft 365 Copilot when sending a POST request to the target API. There are buttons to 'Confirm' or to 'Cancel' sending the request to the API.](https://github.com/user-attachments/assets/56629979-b1e5-4a03-a413-0bb8bb438f00)
 
 - 確認してアイテムを追加します。

 エージェントは作成したアイテムをリッチな Adaptive Card で応答します。

 ![The response after creating a new item, with the information about the item to repair rendered through an adaptive card with a button to show the associated image.](https://github.com/user-attachments/assets/6da0a38f-5de3-485a-999e-c695389853f8)

 - 次に参照カードが機能するか再確認します。以下のプロンプトを送信してください。

     `List all my repairs.`

エージェントは修理の一覧を返し、各アイテムに対して Adaptive Card が参照として表示されます。

![The response for the list of repairs with a reference button for each item, showing an adaptive card when hoovering on it.](https://github.com/user-attachments/assets/880ad3aa-2ed3-4051-a68b-d988527d9d53)

- 次にエージェントの新しい分析機能をテストします。エージェントの右上の **New chat** ボタンを選択して新しいチャットを開きます。  
- 以下のプロンプトをコピーしてメッセージ ボックスに貼り付け、Enter キーを押します。

    `Classify repair items based on title into three distinct categories: Routine Maintenance, Critical, and Low Priority. Then, generate a pie chart displaying the percentage representation of each category. Use unique colours for each group and incorporate tooltips to show the precise values for each segment.`

下図のような応答が得られます（内容は変わる場合があります）。 

![The response when using the Code Interpreter capability. There are a detailed text and a chart showing the percentage representation of each category of repair.](https://github.com/user-attachments/assets/ea1a5b21-bc57-4ed8-a8a4-c187caff2c64)

<cc-end-step lab="e01" exercise="2" step="3" />

## エクササイズ 3: エージェントの診断とデバッグ

チャットで開発者モードを有効にすると、エージェントがタスクをどれだけ正確に理解しているか、サービス呼び出しが適切か、チューニングの必要な箇所やパフォーマンス問題を特定し、やり取りを分析できます。

### 手順 1: チャットでのエージェント デバッグ

- エージェントとのチャットに次の行をコピーして貼り付け、デバッグ モードを有効にします。

    ```
    -developer on
    ```

- 問題なく有効化されると、エージェントから `Successfully enabled developer mode.` と応答があります。

- 次にテスト用に以下のプロンプトを送信します。

   `Find out what Karin is working on.`

- 修理サービスからの情報が返るとともに **Agent debug info** カードも表示されます。  
- **Agent debug info** カードを展開すると、以下の情報が確認できます。  
    - エージェント情報 1️⃣  
    - エージェントの機能 2️⃣  
    - アクションと選択された関数 3️⃣  
    - 実行されたアクションの詳細（リクエスト、レイテンシ、レスポンス データなど）4️⃣  

![The developer debug information card in Microsoft 365 Copilot when analysing the request for an action. There are sections about agent info, capabilities, actions, connected agents, execution, etc.](https://github.com/user-attachments/assets/b135f3b0-50f1-47a1-b608-a5a1b27b806e)

- **Executed Actions** を展開すると、リクエスト URL、渡されたパラメーター、リクエスト ヘッダー、レスポンス、レイテンシなどが確認できます。 

<cc-end-step lab="e01" exercise="3" step="1" />

---8<--- "ja/e-congratulations.md"

素晴らしいですね、初めてのエージェントを構築できました 🎉 

API を作成・ビルドして統合するには **Next** を選択してください。
<cc-next url="../02-build-the-api" label="Next" />

ゲーム「Geolocator」を作りながら基礎を引き続き学びたい場合は、**Create a game** を選択してください。
<cc-next url="../01a-geolocator" label="Create a game" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/01-typespec-declarative-agent--ja" />