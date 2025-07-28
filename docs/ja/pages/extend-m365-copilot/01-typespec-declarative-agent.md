---
search:
  exclude: true
---
# ラボ E1 - Microsoft 365 Agents Toolkit を使用して TypeSpec 定義で Declarative エージェントを構築する

このラボでは、Microsoft 365 Agents Toolkit を使用して TypeSpec 定義による Declarative エージェントを構築します。`RepairServiceAgent` というエージェントを作成し、既存の API サービスを介して修理データと対話し、車両の修理記録を管理できるようにします。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RNsa0kLsXgY" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要をすばやく確認できます。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## Declarative エージェントとは 

**Declarative エージェント** は、Microsoft 365 Copilot と同じスケーラブルなインフラとプラットフォームを活用し、特定の領域にフォーカスしたニーズを満たすように最適化されています。特定分野の専門家として機能し、通常の Microsoft 365 Copilot チャットと同じインターフェイスを使いながら、指定されたタスクのみに集中させることができます。

### Declarative エージェントの構成

Copilot 向けに複数のエージェントを構築していくと、最終的な成果物は数個のファイルをまとめた zip ファイル、つまりアプリ パッケージになることがわかります。したがって、アプリ パッケージの構成を基本的に理解しておくことが重要です。Declarative エージェントのアプリ パッケージは、Teams アプリを作ったことがある場合はそれと似ていますが、追加要素があります。以下の表でコア要素を確認してください。また、デプロイ プロセスも Teams アプリのデプロイに非常に似ています。

| ファイル種別                          | 説明                                                                                                                                                     | 必須 |
|-----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|------|
| Microsoft 365 App Manifest        | 標準の Teams アプリ マニフェストを定義する JSON ファイル (`manifest.json`)。                                                                                     | Yes  |
| Declarative Agent Manifest        | エージェントの名前、instructions、capabilities、conversation starters、および actions（該当する場合）を含む JSON ファイル。                                        | Yes  |
| Plugin Manifest       | アクションを API プラグインとして構成するための JSON ファイル。認証、必須フィールド、Adaptive Card 応答などを含む。アクションが存在する場合のみ必要。 | No   |
| OpenAPI Spec            | API を定義する JSON または YAML ファイル。エージェントがアクションを含む場合のみ必須。                                                                            | No   |

### Declarative エージェントの Capabilities

instructions を追加するだけでなく、エージェントがアクセスすべきナレッジ ベースを指定することで、コンテキストとデータへの集中度を高めることができます。これらは capabilities と呼ばれます。執筆時点で Declarative エージェントがサポートする capabilities は次のとおりです。 

- **Copilot Connectors** - コンテンツを Microsoft 365 に集中させます。外部コンテンツを Microsoft 365 に取り込むことで、関連情報を見つけやすくするだけでなく、組織内の他者が新しいコンテンツを発見できるようにします。
- **OneDrive and SharePoint** - OneDrive と SharePoint のファイル/サイトの URL を指定し、エージェントのナレッジ ベースとします。
- **Web search** - Web コンテンツをナレッジ ベースとして有効/無効化できます。また、情報源として最大 4 つのサイト URL を渡せます。 
- **Code interpreter** - 数学問題をより適切に解き、必要に応じて複雑なデータ分析やチャート生成のために Python コードを活用できるエージェントを構築できます。
- **GraphicArt** - DALL·E を使用して画像や動画を生成するエージェントを構築できます。
- **Email knowledge** - 個人または共有メールボックス、オプションで特定フォルダーをナレッジとして利用するエージェントを構築できます。
- **People knowledge** - 組織内の人物について回答できるエージェントを構築できます。
- **Teams messages** - Teams のチャネル、チーム、会議、1:1 チャット、グループ チャットを検索できるエージェントを装備できます。
- **Dataverse knowledge** - Dataverse インスタンスをナレッジ ソースとして追加できます。


!!! tip "OneDrive and SharePoint"
    URL は SharePoint アイテム（サイト、ドキュメント ライブラリ、フォルダー、ファイル）へのフル パスである必要があります。SharePoint で「リンクをコピー」オプションを使うとファイルやフォルダーのフル パスを取得できます。これを実行するには、対象のファイルまたはフォルダーを右クリックし、[詳細] を選択します。[パス] に移動しコピー アイコンをクリックしてください。<mark>URL を指定しない場合、サインインしているユーザーがアクセスできる OneDrive と SharePoint の全コンテンツがエージェントに使用されます。</mark>

!!! tip "Microsoft Copilot Connector"
    接続を指定しない場合、サインインしているユーザーがアクセスできる Copilot Connectors の全コンテンツがエージェントに使用されます。

!!! tip "Web search"
    サイトを指定しない場合、エージェントはすべてのサイトを検索できます。最大 4 つのサイトを指定でき、パス セグメントは 2 つ以下、クエリ ストリングは含められません。 


## Declarative エージェントにおける TypeSpec の重要性

### TypeSpec とは

TypeSpec は、API 契約を構造化かつ型安全に設計・記述するために Microsoft が開発した言語です。API が受け取るデータ、返すデータ、および API とそのアクション間の関連を含め、API がどのように見え、どのように動作するかを設計する青写真のようなものです。

### エージェントに TypeSpec を使う理由

TypeScript がフロントエンド/バックエンド コードに構造を強制するのを気に入っているなら、TypeSpec がエージェントやその API サービス（アクションなど）に構造を強制する方法も気にいるでしょう。TypeSpec は Visual Studio Code などのツールと連携する design-first 開発フローに最適です。

- 明確なコミュニケーション: 複数のマニフェスト ファイルを扱う際の混乱を避け、エージェントの動作を定義する単一のソース オブ トゥルースを提供します。
- 一貫性: エージェント、アクション、capabilities などのすべての部分を同じパターンで設計することを保証します。
- 自動化に適した設計: OpenAPI スキーマや他のマニフェストを自動生成し、時間を節約し人的ミスを削減します。
- 早期バリデーション: 実装コードを書く前にデザイン上の問題（データ型の不一致や不明確な定義など）を検出できます。
- デザイン ファースト: 実装に入る前にエージェントや API の構造・契約について考えることを促進し、長期的な保守性を向上させます。

## 演習 1: Microsoft 365 Agents Toolkit を使用して TypeSpec でベース エージェントを構築する


### 手順 1: Microsoft 365 Agents Toolkit でベース エージェント プロジェクトをスキャフォールドする
- VS Code の左側メニューから Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を見つけて選択します。アクティビティ バーが開きます。 
- アクティビティ バーで **Create a New Agent/App** ボタンを選択すると、利用可能なアプリ テンプレートのリストがパレットに表示されます。
- リストから **Declarative Agent** を選択します。
- 次に **Start with TypeSpec for Microsoft 365 Copilot** を選択し、TypeSpec でエージェントを定義します。
- スキャフォールドするフォルダーを選択します。
- アプリケーション名に「RepairServiceAgent」などを入力し、Enter を押して完了します。エージェント プロジェクトが読み込まれた新しい VS Code ウィンドウが開きます。

<cc-end-step lab="e01" exercise="1" step="1" />

### 手順 2: Microsoft 365 Agents Toolkit にサインインする 

エージェントをアップロードしてテストするには、Microsoft 365 Agents Toolkit へのサインインが必要です。

- プロジェクト ウィンドウで再度 Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択します。これにより Accounts、Environment、Development などのセクションを含むアクティビティ バーが開きます。 
- 「Accounts」セクションで **Sign in to Microsoft 365** を選択します。エディターからダイアログが開き、Microsoft 365 開発者サンドボックスにサインインまたは作成、あるいはキャンセルするよう求められます。**Sign in** を選択します。 
- サインインが完了したらブラウザーを閉じ、プロジェクト ウィンドウに戻ります。

<cc-end-step lab="e01" exercise="1" step="2" />

### 手順 3: エージェントを定義する 

Agents Toolkit によりスキャフォールドされた Declarative エージェント プロジェクトには、GitHub API に接続してリポジトリの issues を表示するテンプレート コードが含まれています。このラボでは、車両修理サービスと統合し、修理データを管理する複数の操作をサポートするエージェントを独自に構築します。

プロジェクト フォルダーには `main.tsp` と `actions.tsp` という 2 つの TypeSpec ファイルがあります。
エージェントは `main.tsp` でメタデータ、instructions、capabilities と共に定義されます。
`actions.tsp` ではエージェントのアクションを定義します。API サービスに接続するなどアクションがある場合、このファイルで定義します。

`main.tsp` を開き、デフォルト テンプレートに含まれる内容を修理サービス シナリオ用に変更する前に確認します。 

#### エージェントのメタデータと instructions を更新する

`main.tsp` ファイルにはエージェントの基本構造があります。テンプレートには以下が含まれています。
- エージェント名と説明 1️⃣
- 基本 instructions 2️⃣
- actions と capabilities のプレースホルダー コード（コメントアウト済み）3️⃣

![Visual Studio Code showing the initially scaffolded template for a Declarative Agent defined in TypeSpec. There TypeSpec syntax elements to define the agent, its instructions, and some commented out commands to define starter prompts and actions.](https://github.com/user-attachments/assets/42da513c-d814-456f-b60f-a4d9201d1620)


まず修理シナリオ向けにエージェントを定義します。`@agent` と `@instructions` の定義を以下のコード スニペットに置き換えます。

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

次にエージェントの会話スターターを追加します。instructions のすぐ下にコメントアウトされた会話スターターのコードが見えるので、コメントを外します。
タイトルとテキストを以下のように置き換えます。

```typespec
// Uncomment this part to add a conversation starter to the agent.
// This will be shown to the user when the agent is first created.
@conversationStarter(#{
  title: "List repairs",
  text: "List all repairs"
})

```

#### エージェントのアクションを更新する

続いて `actions.tsp` ファイルを開き、エージェントのアクションを定義します。後で `main.tsp` に戻ってアクション参照でメタデータを完成させますが、まずアクション自体を定義します。`actions.tsp` を開きましょう。

`actions.tsp` のプレースホルダー コードは、GitHub リポジトリのオープン issue を検索する設計になっています。アクションのメタデータ、API ホスト URL、操作や関数の定義方法を学ぶための出発点です。これを修理サービス用に置き換えます。 

import や using などモジュール レベルのディレクティブの後、`SERVER_URL` が定義される箇所までの既存コードを、以下のスニペットに置き換えます。この更新でアクション メタデータを導入し、サーバー URL を設定します。また、名前空間を GitHubAPI から RepairsAPI に変更している点に注意してください。

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

次にテンプレートの `searchIssues` 操作を、修理一覧を取得する `listRepairs` 操作に置き換えます。
`SERVER_URL` 定義直後から最終の閉じ括弧手前までのコード ブロック全体を、以下のスニペットに置き換えます。閉じ括弧は必ず残してください。

```typespec
  /**
   * List repairs from the API 
   * @param assignedTo The user assigned to a repair item.
   */

  @route("/repairs")
  @get  op listRepairs(@query assignedTo?: string): string;

````

`main.tsp` に戻り、定義したアクションをエージェントに追加します。会話スターターの後にあるコード ブロック全体を以下のスニペットで置き換えます。

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

### 手順 4: デコレーターを理解する（オプション）

これは任意のステップですが、TypeSpec ファイルで何を定義したかを詳しく知りたい場合は読み進めてください。すぐにエージェントをテストしたい場合は手順 5 へ進みます。
`main.tsp` と `actions.tsp` には、デコレーター（@ で始まる）、名前空間、モデルなどが含まれています。

以下の表で使用されているデコレーターの一部を確認してください。 


| アノテーション             | 説明                                                                                                                                                     |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| @agent             | エージェントの名前空間（名前）と説明を定義します                                                                                                   |
| @instructions       | エージェントの動作を規定する instructions を定義します。8,000 文字以内                                                                     |
| @conversationStarter | エージェントの会話スターターを定義します                                                                                                         |
| op            | 任意の操作を定義します。*op GraphicArt*、*op CodeInterpreter* などの capabilities 操作や **op listRepairs** のような API 操作を定義できます。 |
| @server           | API のサーバー エンドポイントとその名前を定義します                                                                                              |
| @capabilities      | 関数内で使用すると、操作に対する確認カードなどの簡単な Adaptive Card を定義します                                                               |


<cc-end-step lab="e01" exercise="1" step="4" />

### 手順 5: エージェントをテストする

次は Repair Service Agent をテストします。 

- プロジェクト内で Agents Toolkit 拡張機能のアイコンを選択してアクティビティ バーを開きます。
- アクティビティ バーの「LifeCycle」で **Provision** を選択します。これによりマニフェスト ファイルやアイコンを含むアプリ パッケージがビルドされ、自分専用でカタログにサイドロードされます。 

!!! tip "Knowledge"
    Agents Toolkit はここで TypeSpec ファイルに記述されたすべての定義を検証し、正確性を確保します。エラーを特定して開発体験を効率化します。

- 次にブラウザーを開き、[https://m365.cloud.microsoft/chat](https://m365.cloud.microsoft/chat){target=_blank} にアクセスして Copilot アプリを開きます。

!!! note "Help"
    Copilot アプリで「Something went wrong」画面が表示された場合は、ブラウザーをリフレッシュしてください。  

- Microsoft 365 Copilot インターフェイスの **Agents** 一覧から **RepairServiceAgent** を選択します。
処理には少し時間がかかり、プロビジョンの進行状況を示すトースター メッセージが表示されます。

- 会話スターター `List repairs` を選択し、チャットに送信してエージェントとの会話を開始し、応答を確認します。

!!! tip "Help"
    クエリを処理するためにエージェントを接続するよう求められた場合、この画面は通常 1 回のみ表示されます。ラボ体験を円滑にするため、表示されたら **"Always allow"** を選択してください。
    ![Screenshot of the agent in action with the response for the prompt 'List all repairs' showing repairs with pictures.](https://github.com/user-attachments/assets/02400c13-0766-4440-999b-93c88ca45dc7)

- 次の演習に備えてブラウザー セッションは開いたままにしておきます。 

<cc-end-step lab="e01" exercise="1" step="5" />

## 演習 2: エージェントの capabilities を拡張する
次に、操作を追加し、Adaptive Card での応答を有効にし、code interpreter capabilities を組み込んでエージェントを強化します。それぞれの拡張をステップごとに見ていきましょう。VS Code のプロジェクトに戻ります。

### 手順 1: 追加操作をエージェントに組み込む

- `actions.tsp` ファイルを開き、`listRepairs` 操作の直後に以下のスニペットをコピー＆ペーストして `createRepair`、`updateRepair`、`deleteRepair` の新しい操作を追加します。ここでは `Repair` アイテムのデータ モデルも定義しています。

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

- 次に `main.tsp` に戻り、これら新しい操作がエージェントのアクションにも追加されていることを確認します。`RepairServiceActions` 名前空間内の `op listRepairs is global.RepairsAPI.listRepairs;` の行の後に、以下のスニペットを貼り付けます。

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

### 手順 2: 関数参照に Adaptive Card を追加する

次に Adaptive Card を使用して参照カードや応答カードを強化します。`listRepairs` 操作を例に取り、修理アイテム用の Adaptive Card を追加します。 

- プロジェクト フォルダーで **appPackage** 内に **cards** フォルダーを作成します。**cards** フォルダーに `repair.json` というファイルを作成し、以下のコード スニペットをそのまま貼り付けます。 

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

- 続いて `actions.tsp` に戻り、`listRepairs` 操作を探します。`@get op listRepairs(@query assignedTo?: string): string;` の定義直前に、以下のスニペットを貼り付けてカードを定義します。

```typespec

  @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "cards/repair.json"}) 
  
```

上記のカード応答は、修理アイテムを問い合わせたときやエージェントがアイテム一覧を参照として返すときに送信されます。
続けて、POST 操作でエージェントが作成した内容を示すため、`createRepair` 操作にもカード応答を追加します。 

- `@post op createRepair(@body repair: Repair): Repair;` の直前に以下のスニペットをコピー＆ペーストします。

```typespec

   @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "cards/repair.json"}) 

```

<cc-end-step lab="e01" exercise="2" step="2" />

## 手順 3: code interpreter capabilities を追加する

Declarative エージェントは *OneDriveAndSharePoint*、*WebSearch*、*CodeInterpreter* など多くの capabilities を拡張できます。
ここでは code interpreter capability を追加してエージェントを強化します。

- `main.tsp` ファイルを開き、`RepairServiceAgent` 名前空間を探します。

- この名前空間内に、エージェントがコードを解釈・実行できるようにする新しい操作を定義する以下のスニペットを挿入します。

```typespec
  op codeInterpreter is AgentCapabilities.CodeInterpreter;
```

!!! tip
    上記の *CodeInterpreter* 操作は、エージェントのアクションを定義する `RepairServiceActions` 名前空間ではなく、外側の `RepairServiceAgent` 名前空間に貼り付けてください。  

エージェントが追加機能をサポートするようになったため、instructions も更新してこの変更を反映します。

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

更新されたエージェント（修理アナリストとしても機能）をテストしましょう。 

- Agents Toolkit の拡張アイコンを選択してアクティビティ バーを開きます。
- アクティビティ バーの「LifeCycle」で **Provision** を選択し、更新されたエージェントをパッケージ化してアップロードします。 
- 開いているブラウザー セッションに戻り、リフレッシュします。 
- **Agents** リストから **RepairServiceAgent** を選択します。
- 会話スターター 'Create repair' を使用して開始します。タイトルを追加するようにプロンプトを編集し、送信してやり取りを開始します。例:

    `Create a new repair titled "rear camera issue" and assign it to me.`

- 確認ダイアログには、送信した内容より多くのメタデータが表示されていることに注目してください。これは新しい instructions のおかげです。 

![The confirmation message provided by Microsoft 365 Copilot when sending a POST request to the target API. There are buttons to 'Confirm' or to 'Cancel' sending the request to the API.](https://github.com/user-attachments/assets/56629979-b1e5-4a03-a413-0bb8bb438f00)
 
 - ダイアログで確認し、アイテムを追加します。

 エージェントは作成されたアイテムをリッチな Adaptive Card で応答します。

 ![The response after creating a new item, with the information about the item to repair rendered through an adaptive card with a button to show the associated image.](https://github.com/user-attachments/assets/6da0a38f-5de3-485a-999e-c695389853f8)

 - 次に、参照カードが機能するか再確認します。以下のプロンプトを送信します。

     `List all my repairs.`

エージェントは修理一覧を応答し、各アイテムを Adaptive Card で参照します。

![The response for the list of repairs with a reference button for each item, showing an adaptive card when hoovering on it.](https://github.com/user-attachments/assets/880ad3aa-2ed3-4051-a68b-d988527d9d53)

- 次に、エージェントの新しい分析機能をテストします。右上の **New chat** ボタンを選択して新しいチャットを開きます。
- 以下のプロンプトをコピーしてメッセージ ボックスに貼り付け、Enter を押します。

    `Classify repair items based on title into three distinct categories: Routine Maintenance, Critical, and Low Priority. Then, generate a pie chart displaying the percentage representation of each category. Use unique colours for each group and incorporate tooltips to show the precise values for each segment.`

類似した応答が得られるはずです（内容は変わる場合があります）。 

![The response when using the Code Interpreter capability. There are a detailed text and a chart showing the percentage representation of each category of repair.](https://github.com/user-attachments/assets/ea1a5b21-bc57-4ed8-a8a4-c187caff2c64)

<cc-end-step lab="e01" exercise="2" step="3" />

## 演習 3: エージェントの診断およびデバッグ

チャットでデベロッパー モードを有効にすると、開発者としてタスク理解度の確認、サービス呼び出しの適切性、チューニングが必要な箇所の特定、パフォーマンス問題の検出など、エージェントのやり取りを追跡・分析できます。

### 手順 1: チャットでのエージェント デバッグ

- デバッグ モードを有効にするため、以下の行をエージェントとのチャットにコピー＆ペーストします。

    ```
    -developer on
    ```

- 正常に有効化されると、エージェントは `Successfully enabled developer mode.` と応答します。

- 次にテストのため、以下のようなプロンプトを送信します。

   `Find out what Karin is working on.`

- 修理サービスからの情報とともに **Agent debug info** カードが応答として表示されます。
- **Agent debug info** カードを展開して詳細を確認します。
- 以下を確認できます: 
    - エージェント情報 1️⃣
    - エージェントの capabilities 2️⃣
    - アクションと選択された関数 3️⃣
    - 実行されたアクション情報（リクエスト、レイテンシ、レスポンス データなど詳細）4️⃣

![The developer debug information card in Microsoft 365 Copilot when analysing the request for an action. There are sections about agent info, capabilities, actions, connected agents, execution, etc.](https://github.com/user-attachments/assets/b135f3b0-50f1-47a1-b608-a5a1b27b806e)

- **Executed Actions** を展開すると、リクエスト URL、渡されたパラメーター、リクエスト ヘッダー、レスポンス、レイテンシなどを確認できます。 

<cc-end-step lab="e01" exercise="3" step="1" />

---8<--- "ja/e-congratulations.md"

素晴らしい！ 初めてのエージェントを構築できました 🎉 

 **Next** を選択して API の作成・ビルド・統合へ進みましょう。
 <cc-next url="../02-build-the-api" label="Next" />

基礎をさらに学び、Geolocator ゲームを作成したい場合は **Create a game** を選択してください。
 <cc-next url="../01a-geolocator" label="Create a game" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/01-typespec-declarative-agent" />