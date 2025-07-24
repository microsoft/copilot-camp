---
search:
  exclude: true
---
# Lab E1 - Microsoft 365 Agents Toolkit を使用した TypeSpec 定義による最初の宣言型エージェント構築

このラボでは、Microsoft 365 Agents Toolkit を使用して、TypeSpec 定義による宣言型エージェントを構築します。既存の API サービスを介して修理データと連携し、ユーザーが車両修理記録を管理するのを支援するために、`RepairServiceAgent` というエージェントを作成します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RNsa0kLsXgY" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を確認してください。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## 宣言型エージェント

**宣言型エージェント** は、 Microsoft 365 Copilot のスケーラブルなインフラストラクチャとプラットフォームを活用し、特定の分野に特化したユーザーのニーズに応じたカスタマイズを行います。標準の Microsoft 365 Copilot チャットと同じインターフェイスを使用しながら、専ら特定のタスクに集中するため、分野の専門家として機能します。

### 宣言型エージェントの構成要素

Copilot 向けにエージェントを構築するにつれて、最終的な成果物がいくつかのファイルがひとまとめにされた zip ファイル（アプリパッケージ）になることに気づくでしょう。アプリパッケージがどのような構成要素でできているかを基本的に理解しておくことが重要です。宣言型エージェントのアプリパッケージは、以前に Teams アプリを構築したことがある場合と同様ですが、追加の要素が含まれています。以下の表で主要な構成要素を確認してください。また、アプリのデプロイメントプロセスは Teams アプリのデプロイと非常に似ています。

| ファイル種別                           | 説明                                                                                                                                                               | 必須    |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| Microsoft 365 App Manifest        | 標準 Teams アプリ マニフェストを定義する JSON ファイル（`manifest.json`）。                                                                                        | Yes      |
| Declarative Agent Manifest        | エージェントの名前、指示、機能、会話開始文、（該当する場合は）アクションを含む JSON ファイル。                                                                         | Yes      |
| Plugin Manifest       | API プラグインとしてアクションを構成するために使用する JSON ファイル。認証、必須フィールド、 Adaptive Card レスポンスなどを含む。アクションが存在する場合のみ必要です。 | No       |
| OpenAPI Spec            | エージェントにアクションが含まれている場合にのみ必要な、 API を定義する JSON または YAML ファイル。                                                                  | No       |

### 宣言型エージェントの機能

エージェントがアクセスすべき知識ベースを明示することで、文脈やデータに対するエージェントの注力を高めることができます。これらは機能（capabilities）と呼ばれます。以下は、本書作成時点で宣言型エージェントがサポートする機能です。

- **Copilot Connectors**  – Microsoft 365 上のコンテンツを一元管理します。外部のコンテンツを Microsoft 365 に取り込むことで、関連情報を見つけやすくなり、組織内の他のユーザーも新しいコンテンツを発見できるようになります。
- **OneDrive および SharePoint**  – OneDrive と SharePoint 内のファイル／サイトの URL を提供でき、これらがエージェントの知識ベースの一部となります。
- **Web 検索**  – エージェントの知識ベースとしてウェブコンテンツを有効または無効にできます。また、情報源として最大 4 つのウェブサイトの URL を渡すことも可能です。
- **Code interpreter**  – 数学の問題をより適切に解決し、必要に応じて Python コードを利用し、高度なデータ分析やチャート生成を行うエージェントの構築を可能にします。
- **GraphicArt**  – DALL·E を使用した画像や動画生成のためのエージェント構築をサポートします。
- **Email knowledge**  – 個人のまたは共有のメールボックス、またはオプションで特定のメールボックスフォルダーにアクセスするエージェントを構築できます。
- **People knowledge**  – 組織内の個人に関する質問に回答するエージェントを構築できます。
- **Teams メッセージ**  – Teams チャネル、チーム、会議、 1:1 チャット、グループチャット内を検索するエージェントの装備が可能です。
- **Dataverse knowledge**  – Dataverse インスタンスを知識源として追加できます。

!!! tip "OnDrive and SharePoint"
    SharePoint アイテム（サイト、ドキュメントライブラリ、フォルダー、またはファイル）への URL はフルパスにする必要があります。SharePoint では「コピー直リンク」オプションを使用して、ファイルやフォルダーのフルパスを取得できます。これを行うには、対象のファイルまたはフォルダーを右クリックして[詳細]を選択し、パスに移動してコピーアイコンをクリックしてください。<mark>URL を指定しない場合、ログイン中のユーザーがアクセスできる OneDrive および SharePoint 内の全コンテンツがエージェントによって利用されます。</mark>

!!! tip "Microsoft Copilot Connector"
    接続先を指定しない場合、ログイン中のユーザーが利用可能な全 Copilot Connectors のコンテンツがエージェントによって利用されます。

!!! tip "Web 検索"
    サイトを指定しない場合、エージェントはすべてのサイトを検索することが許可されます。最大 4 つのサイトを、パスセグメント 2 つ以下かつクエリ文字列パラメーターなしで指定できます。


## 宣言型エージェントにおける TypeSpec の重要性

### TypeSpec とは

TypeSpec は、 API 契約を構造化された型安全な方法で設計・記述するために、 Microsoft によって開発された言語です。これは、 API がどのようなデータを受け取り、返し、 API の各部分やそのアクションがどのように連携するかという、 API の青写真のようなものです。

### エージェントに TypeSpec を利用する理由

TypeScript がフロントエンド／バックエンド コードの構造を強制するのと同様に、 TypeSpec はエージェントおよびその API サービス（例：アクション）の構造を強制します。Visual Studio Code などのツールと連携する、デザインファーストの開発ワークフローに最適です。

・明確なコミュニケーション – エージェントの動作を定義する単一の真実の情報源を提供し、複数のマニフェストファイルを扱う際の混乱を回避します。

・一貫性 – エージェントのすべての部分（アクション、機能など）が同じパターンに従って設計されていることを保証します。

・自動化対応 – OpenAPI 仕様やその他のマニフェストを自動生成し、作業時間の短縮と人的エラーの低減に貢献します。

・早期検証 – 実際のコードを書く前に、型の不一致や不明瞭な定義などの設計上の問題を早期に検出します。

・デザインファーストアプローチ – 実装に飛び込む前にエージェントおよび API の構造や契約について検討することを促し、長期的な保守性の向上につながります。

## 演習 1: Microsoft 365 Agents Toolkit を使用した TypeSpec による基本エージェントの構築

### ステップ 1: Microsoft 365 Agents Toolkit を使用して基本エージェントプロジェクトのスキャフォールディング

- VS Code の左側メニューから Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を探して選択します。アクティビティバーが開かれます。 
- アクティビティバー内の「Create a New Agent/App」ボタンを選択すると、Microsoft 365 Agents Toolkit で利用可能なアプリテンプレートの一覧が表示されるパレットが開きます。
- 一覧から「Declarative Agent」を選択します。
- 次に、「Start with TypeSpec for Microsoft 365 Copilot」を選択して、 TypeSpec を用いてエージェントを定義します。
- 次に、エージェントプロジェクトをスキャフォールディングするフォルダーを選択します。
- 次に、アプリケーション名として「RepairServiceAgent」などを入力し、 Enter キーを押してプロセスを完了します。新しい VS Code ウィンドウに、事前に読み込まれたエージェントプロジェクトが表示されます。

<cc-end-step lab="e01" exercise="1" step="1" />

### ステップ 2: Microsoft 365 Agents Toolkit へのサインイン

エージェントのアップロードとテストを行うために、 Microsoft 365 Agents Toolkit にサインインする必要があります。

- プロジェクトウィンドウ内で、左側メニューから再度 Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択します。これにより、 Accounts、Environment、Development などのセクションがある Agents Toolkit のアクティビティバーが開きます。
- 「Accounts」 セクションで「Sign in to Microsoft 365」を選択します。これにより、サインインまたは Microsoft 365 デベロッパー サンドボックスの作成、あるいはキャンセルを促すエディターのダイアログが表示されます。 「Sign in」を選択してください。
- サインインが完了したら、ブラウザーを閉じ、プロジェクトウィンドウに戻ります。

<cc-end-step lab="e01" exercise="1" step="2" />

### ステップ 3: エージェントの定義

Agents Toolkit によってスキャフォールディングされた宣言型エージェントプロジェクトは、 GitHub API に接続してリポジトリの issue を表示するコードが含まれたテンプレートを提供します。このラボでは、車両修理サービスと連携し、修理データの管理をサポートする、独自のエージェントを構築します。

プロジェクトフォルダー内には、`main.tsp` と `actions.tsp` の 2 つの TypeSpec ファイルが存在します。  
エージェントは `main.tsp` ファイル内で、メタデータ、指示、および機能として定義されています。  
エージェントのアクションを定義するには、`actions.tsp` ファイルを使用してください。もしエージェントに API サービスへの接続などのアクションが含まれている場合は、このファイルに定義してください。

`main.tsp` を開いて、デフォルトのテンプレートにある内容を確認してください。これは、本ラボの修理サービスシナリオ用に変更していきます。 

#### エージェントメタデータおよび指示の更新

`main.tsp` ファイル内には、エージェントの基本構造が記述されています。Agents Toolkit テンプレートによって提供される内容（以下を含む）を確認してください：
- エージェント名と説明 1️⃣
- 基本的な指示 2️⃣
- アクションおよび機能のプレースホルダーコード（コメントアウト済み） 3️⃣

![Visual Studio Code showing the initially scaffolded template for a Declarative Agent defined in TypeSpec. There TypeSpec syntax elements to define the agent, its instructions, and some commented out commands to define starter prompts and actions.](https://github.com/user-attachments/assets/42da513c-d814-456f-b60f-a4d9201d1620)


まず、修理シナリオ用のエージェントを定義します。`@agent` および `@instructions` の定義を、以下のコードスニペットに置き換えてください。

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

次に、エージェント用の会話開始文を追加します。指示のすぐ下に、会話開始文のためのコメントアウトされたコードがあるので、それをコメント解除し、タイトルとテキストを以下の通りに置き換えてください。

```typespec
// Uncomment this part to add a conversation starter to the agent.
// This will be shown to the user when the agent is first created.
@conversationStarter(#{
  title: "List repairs",
  text: "List all repairs"
})

```

#### エージェントのアクションの更新

次に、`actions.tsp` ファイルを開くことで、エージェントのアクションを定義します。後で `main.tsp` ファイルに戻り、アクション参照を含むエージェントメタデータを完成させますが、まずはアクション自体を定義してください。そのために、`actions.tsp` ファイルを開いてください。

`actions.tsp` のプレースホルダーコードは、 GitHub リポジトリ内のオープンな issue を検索するための例として設計されています。これは、エージェントのアクション、例えばアクションのメタデータ、API ホスト URL、および操作または関数とその定義をどのように定義するかを初心者に理解させる出発点として機能します。これらをすべて修理サービス用に置き換えてください。 

モジュールレベルのディレクティブ（import や using 文など）の後、"SERVER_URL" が定義されている場所までの既存のコードを以下のスニペットに置き換えてください。この更新は、アクションメタデータを導入し、サーバー URL を設定します。また、名前空間が GitHubAPI から RepairsAPI に変更されている点にご注意ください。

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

次に、テンプレートコード内の操作を "searchIssues" から、修理一覧を取得する修理操作である "listRepairs" に置き換えてください。SERVER_URL の定義直後から最終の閉じ中括弧の直前までのコードブロック全体を、以下のスニペットに置き換えてください。閉じ中括弧は変更せずに残してください。

```typespec
  /**
   * List repairs from the API 
   * @param assignedTo The user assigned to a repair item.
   */

  @route("/repairs")
  @get  op listRepairs(@query assignedTo?: string): string;

````

次に、`main.tsp` ファイルに戻り、先ほど定義したアクションをエージェントに追加します。会話開始文の後のコードブロック全体を、以下のスニペットに置き換えてください。

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

### ステップ 4: （オプション）デコレーターの理解

これはオプションのステップです。TypeSpec ファイルで定義している内容に興味がある場合は、このステップをお読みいただくか、すぐにエージェントのテストに進んでください。  
`main.tsp` と `actions.tsp` には、デコレーター（@ で始まる）、名前空間、モデル、およびその他のエージェント定義が記述されています。

以下の表で、これらのファイルで使用されているいくつかのデコレーターを理解してください。

| Annotation             | 説明                                                                                                                                                               |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| @agent                 | エージェントの名前空間（名称）と説明を定義します。                                                                                                                   |
| @instructions          | エージェントの動作を指示するインストラクションを定義します（８０００文字以下）。                                                                                    |
| @conversationStarter   | エージェントの会話開始文を定義します。                                                                                                                             |
| op                     | 操作を定義します。エージェントの機能を定義する操作（例：*op GraphicArt*、*op CodeInterpreter* など）や、 **op listRepairs** などの API 操作を定義します。     |
| @server                | API のサーバーエンドポイントとその名称を定義します。                                                                                                               |
| @capabilities          | 関数内で使用される場合、確認カードなどの簡単な Adaptive Card を小さな定義で設定します。                                                                           |


<cc-end-step lab="e01" exercise="1" step="4" />

### ステップ 5: エージェントのテスト

次のステップでは、 RepairServiceAgent のテストを行います。

- プロジェクト内で Agents Toolkit 拡張機能のアイコンを選択し、アクティビティバーを開きます。
- Agents Toolkit のアクティビティバー内の「LifeCycle」セクションで「Provision」を選択します。これにより、生成されたマニフェストファイルやアイコンからなるアプリパッケージがビルドされ、テスト用に自分専用のカタログにサイドロードされます。

!!! tip "Knowledge"
    Agents Toolkit は、 TypeSpec ファイルで提供された定義の検証も行い、正確性を保証します。また、エラーを特定して開発者体験を向上させます。

- 次に、ウェブブラウザーを開き、[https://m365.cloud.microsoft/chat](https://m365.cloud.microsoft/chat){target=_blank} にアクセスして Copilot アプリを起動します。

!!! note "ヘルプ"
    何らかの理由で Copilot アプリに「Something went wrong」画面が表示された場合は、ブラウザーを更新してください。  

- Microsoft 365 Copilot インターフェイスで、**RepairServiceAgent** を **Agents** 一覧から選択します。  
　プロビジョニングの進捗状況がトースターメッセージで表示されるまで、しばらくお待ちください。

- 会話開始文の `List repairs` を選択し、チャットにプロンプトを送信してエージェントとの会話を開始し、レスポンスを確認してください。

!!! tip "ヘルプ"
    クエリ処理のためにエージェントを接続するよう促されたときは、この画面が通常一度だけ表示されます。このラボでの体験を円滑にするために、表示された際は **"Always allow"** を選択してください。
    ![Screenshot of the agent in action with the response for the prompt 'List all repairs' showing repairs with pictures.](https://github.com/user-attachments/assets/02400c13-0766-4440-999b-93c88ca45dc7)

- 今後の演習のために、ブラウザーセッションは開いたままにしてください。

<cc-end-step lab="e01" exercise="1" step="5" />

## 演習 2: エージェント機能の拡張

次に、複数の操作の追加、 Adaptive Card を用いたレスポンス、及び Code interpreter 機能の導入によりエージェントを拡張していきます。それぞれの拡張を順を追って確認してください。VS Code のプロジェクトに戻りましょう。

### ステップ 1: エージェントに複数の操作の追加

- `actions.tsp` ファイルを開き、`listRepairs` 操作の直後に以下のスニペットをコピー＆ペーストして、新たに `createRepair`、`updateRepair`、および `deleteRepair` の操作を追加します。この際、 `Repair` アイテムのデータモデルも定義しています。

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

- 次に、`main.tsp` ファイルに戻り、これら新たな操作がエージェントのアクションに追加されていることを確認します。`RepairServiceActions` 名前空間内の `op listRepairs is global.RepairsAPI.listRepairs;` の行の後に、以下のスニペットを貼り付けてください。
  
```typespec
op createRepair is global.RepairsAPI.createRepair;
op updateRepair is global.RepairsAPI.updateRepair;
op deleteRepair is global.RepairsAPI.deleteRepair;   

```
- また、最初の会話開始文定義の直後に、新たな修理アイテム作成用の会話開始文を追加してください。

```typespec
@conversationStarter(#{
  title: "Create repair",
  text: "Create a new repair titled \"[TO_REPLACE]\" and assign it to me"
})

```

<cc-end-step lab="e01" exercise="2" step="1" />

### ステップ 2: 関数リファレンスへの Adaptive Card の追加

次に、 Adaptive Card を使用してリファレンスカード（またはレスポンスカード）を強化します。まずは、`listRepairs` 操作に対して修理アイテム用の Adaptive Card を追加します。

- プロジェクトフォルダー内に、**appPackage** フォルダーの下に **cards** という新しいフォルダーを作成します。**cards** フォルダー内に `repair.json` ファイルを作成し、以下のコードスニペットをそのまま貼り付けてください。

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

- 次に、`actions.tsp` ファイルに戻り、`listRepairs` 操作を探します。操作定義行 `@get op listRepairs(@query assignedTo?: string): string;` の直上に、以下のスニペットを貼り付けてカード定義を追加してください。

```typespec

  @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "cards/repair.json"}) 
  
```

上記のカードレスポンスは、エージェントが修理アイテムについて問い合わせがあった際、またはエージェントがアイテム一覧を参照情報として提示する際に送信されます。  
引き続き、POST 操作後にエージェントが作成した内容を表示するため、`createRepair` 操作のレスポンスとしてのカードレスポンスを追加してください。 

- `@post op createRepair(@body repair: Repair): Repair;` の直上に、以下のスニペットをコピー＆ペーストしてください。

```typespec

   @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "cards/repair.json"}) 

```

<cc-end-step lab="e01" exercise="2" step="2" />

## ステップ 3: Code interpreter 機能の追加

宣言型エージェントは、*OneDriveAndSharePoint*、*WebSearch*、*CodeInterpreter* など、多くの機能を拡張することが可能です。  
次に、エージェントに Code interpreter 機能を追加していきます。

- そのために、`main.tsp` ファイルを開き、`RepairServiceAgent` 名前空間を探してください。

- この名前空間内に、エージェントがコードを解釈・実行できるようにする新たな操作を定義するため、以下のスニペットを挿入してください。

```typespec
  op codeInterpreter is AgentCapabilities.CodeInterpreter;
```

!!! tip
    上記の *Codeinterpreter* 操作を追加する際は、外側の `RepairServiceAgent` 名前空間内（エージェントのアクションを定義する `RepairServiceActions` 名前空間の外側）に貼り付けるようにしてください。  

機能拡張によりエージェントが新たな機能をサポートするようになったため、それに伴い指示も更新し、この拡張を反映させてください。

- 同じ `main.tsp` ファイル内で、エージェントの指示定義を更新し、追加の指示を加えてください。

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

### ステップ 4: エージェントのプロビジョニングとテスト

次に、修理アナリストとして更新されたエージェントの動作確認を行います。 

- プロジェクト内で Agents Toolkit 拡張機能のアイコンを選択し、アクティビティバーを開きます。
- アクティビティバーの「LifeCycle」セクションで「Provision」を選択し、更新されたエージェントをパッケージ化してアップロードします。 
- 次に、開いているブラウザーのセッションに戻り、ページを更新してください。 
- **Agents** 一覧から **RepairServiceAgent** を選択します。
- まず、会話開始文「Create repair」を使用して、タイトル等を指定したプロンプトを送信し、対話を開始してください。例：

    `Create a new repair titled "rear camera issue" and assign it to me.`

- 確認ダイアログには、新しい指示のおかげで送信した内容以上のメタデータが表示される場合があります。 

![The confirmation message provided by Microsoft 365 Copilot when sending a POST request to the target API. There are buttons to 'Confirm' or to 'Cancel' sending the request to the API.](https://github.com/user-attachments/assets/56629979-b1e5-4a03-a413-0bb8bb438f00)
 
 - ダイアログを確認してアイテムの追加を実行してください。

 エージェントは、 Adaptive Card で表示された作成済みのアイテムで応答します。

 ![The response after creating a new item, with the information about the item to repair rendered through an adaptive card with a button to show the associated image.](https://github.com/user-attachments/assets/6da0a38f-5de3-485a-999e-c695389853f8)

 - 次に、参照カードが正しく動作するかを再確認するため、以下のプロンプトをチャットに送信してください。

     `List all my repairs.`

エージェントは、各アイテムが Adaptive Card で参照される修理一覧で応答します。

![The response for the list of repairs with a reference button for each item, showing an adaptive card when hoovering on it.](https://github.com/user-attachments/assets/880ad3aa-2ed3-4051-a68b-d988527d9d53)

- 次に、エージェントの新たな解析機能をテストします。エージェント上部右側の **New chat** ボタンを選択して新しいチャットを開始してください。
- 次に、以下のプロンプトをコピーしてメッセージボックスに貼り付け、送信してください。

    `Classify repair items based on title into three distinct categories: Routine Maintenance, Critical, and Low Priority. Then, generate a pie chart displaying the percentage representation of each category. Use unique colours for each group and incorporate tooltips to show the precise values for each segment.`

画面は下記のような応答が得られるはずです（場合により多少異なることがあります）。

![The response when using the Code Interpreter capability. There are a detailed text and a chart showing the percentage representation of each category of repair.](https://github.com/user-attachments/assets/ea1a5b21-bc57-4ed8-a8a4-c187caff2c64)

<cc-end-step lab="e01" exercise="2" step="3" />

## 演習 3: エージェントの診断とデバッグ

開発者として、エージェントがタスクをどの程度理解しているか、サービスを適切に呼び出しているか、調整が必要な箇所やパフォーマンスの問題の検出などを把握するため、チャット内でデベロッパーモードを有効化することができます。

### ステップ 1: チャットにおけるエージェントデバッグ

- 以下の行をエージェントとのチャットにコピー＆ペーストし、デバッグモードを有効にしてください。

    ```
    -developer on
    ```

- すべてが正常に動作した場合、エージェントは `Successfully enabled developer mode.` という成功メッセージで応答します。

- 次に、以下のようなプロンプトを送信してエージェントと対話してください。

   `Find out what Karin is working on.`

- 修理サービスからの情報とともに、**Agent debug info** カードがレスポンスとして表示されます。
- **Agent debug info** カードを展開して、すべての詳細情報を確認してください。
- 以下の情報が表示されます： 
    - エージェント情報 1️⃣
    - エージェントの機能 2️⃣
    - 選択されたアクションおよび関数 3️⃣
    - リクエスト、待機時間、レスポンスデータなど、実行されたアクションの詳細情報 4️⃣

![The developer debug information card in Microsoft 365 Copilot when analysing the request for an action. There are sections about agent info, capabilities, actions, connected agents, execution, etc.](https://github.com/user-attachments/assets/b135f3b0-50f1-47a1-b608-a5a1b27b806e)

- **Executed Actions** を展開すると、リクエスト URL、渡されたパラメーター、リクエストヘッダー、レスポンス、待機時間などが確認できます。

<cc-end-step lab="e01" exercise="3" step="1" />

---8<--- "ja/e-congratulations.md"

最初のエージェント構築、お疲れさまでした 🎉 

【Next】 を選択して API の作成、構築、統合を進めてください。
<cc-next url="../02-build-the-api" label="Next" />

引き続き、 Geolocator game というゲームを構築して基本を探究したい場合は、以下の **Create a game** を選択してください。
<cc-next url="../01a-geolocator" label="Create a game" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/01-typespec-declarative-agent" />