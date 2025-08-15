---
search:
  exclude: true
---
# ラボ E1 - Microsoft 365 Agents Toolkit で TypeSpec 定義を使用して初めての Declarative エージェントを構築する

このラボでは Microsoft 365 Agents Toolkit を使用し、TypeSpec 定義を用いた Declarative エージェントを作成します。`RepairServiceAgent` というエージェントを作成し、既存の API サービスを介して修理データと対話し、ユーザーが車両修理レコードを管理できるようにします。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RNsa0kLsXgY" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご覧ください。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## Declarative エージェントとは 

**Declarative エージェント** は Microsoft 365 Copilot と同じスケーラブルなインフラとプラットフォームを活用し、特定領域に特化したニーズを満たすよう調整されています。標準の Microsoft 365 Copilot チャットと同じインターフェイスを利用しつつ、特定タスクのみに集中する専門家の役割を果たします。

### Declarative エージェントの構成要素

Copilot 向けに複数のエージェントを作成すると、最終成果物は数個のファイルを ZIP にまとめたアプリ パッケージになります。これは Teams アプリを構築した経験があれば馴染みやすい構造で、追加要素が含まれます。以下の表で主な要素を確認してください。デプロイ手順も Teams アプリと非常によく似ています。

| ファイル種別                         | 説明                                                                                                                                                     | 必須 |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|------|
| Microsoft 365 アプリ マニフェスト  | Teams アプリ マニフェストを定義する JSON ファイル (`manifest.json`)                                                                                         | Yes  |
| Declarative エージェント マニフェスト | エージェントの名前、指示、機能、会話スターター、アクション（該当する場合）を含む JSON ファイル                                                               | Yes  |
| プラグイン マニフェスト              | アクションを API プラグインとして構成するための JSON ファイル。認証、必須フィールド、Adaptive Card 応答などを含む。アクションがある場合のみ必要 | No   |
| OpenAPI 仕様                       | API を定義する JSON または YAML ファイル。エージェントにアクションが含まれる場合のみ必要                                                                | No   |

### Declarative エージェントの機能

指示を追加するだけでなく、アクセスすべきナレッジベースを指定することで、エージェントのコンテキストとデータに対する集中度を高められます。これらは「機能」と呼ばれます。執筆時点で Declarative エージェントがサポートする主な機能は以下のとおりです。

- **Copilot Connectors** – 外部コンテンツを Microsoft 365 に取り込み、検索性と共有を向上させます。
- **OneDrive and SharePoint** – OneDrive や SharePoint のファイル/サイトの URL を指定し、エージェントのナレッジベースに含められます。
- **Web search** – Web コンテンツをナレッジベースに含めるかどうかを設定できます。最大 4 件までの Web サイト URL をソースとして渡せます。
- **Code interpreter** – 数学問題の解決や Python コードを用いた高度なデータ分析・チャート生成を行える機能を追加します。
- **GraphicArt** – DALL·E を用いた画像や動画生成が可能なエージェントを構築できます。
- **Email knowledge** – 個人または共有メールボックス、任意のフォルダーをナレッジとして利用するエージェントを構築できます。
- **People knowledge** – 組織内の人物に関する質問に回答できるエージェントを構築します。
- **Teams messages** – Teams のチャネル、チーム、会議、1:1 チャット、グループチャットを検索できるようにします。
- **Dataverse knowledge** – Dataverse インスタンスをナレッジ ソースとして追加できます。


!!! tip "OnDrive and SharePoint"
    URL は SharePoint アイテム（サイト、ドキュメント ライブラリ、フォルダー、ファイル）へのフル パスを指定してください。SharePoint でファイルやフォルダーを右クリックし [詳細] → [パス] → コピー アイコンを選択すると取得できます。<mark>URL を指定しない場合、ログイン ユーザーがアクセス可能な OneDrive と SharePoint の全コンテンツがエージェントのナレッジベースとして使用されます。</mark>

!!! tip "Microsoft Copilot Connector"
    接続を指定しない場合、ログイン ユーザーがアクセスできる Copilot Connectors の全コンテンツがナレッジベースとして使用されます。

!!! tip "Web search"
    サイトを指定しない場合、エージェントはすべてのサイトを検索できます。サイトは最大 4 件まで、パス セグメントは 2 階層以内、クエリ文字列は含められません。 


## Declarative エージェントにおける TypeSpec の重要性

### TypeSpec とは

TypeSpec は、API 契約を構造化された型安全な方法で設計・記述するために Microsoft が開発した言語です。API が受け取るデータ、返すデータ、各アクションのつながりなど、API の「設計図」を定義するイメージです。

### エージェントに TypeSpec を使う理由

TypeScript がフロントエンド/バックエンド コードの構造を強制するのと同じように、TypeSpec はエージェントとその API サービス（アクションなど）の構造を強制します。Visual Studio Code などのツールと相性が良いデザイン ファーストの開発ワークフローに最適です。

- 明確なコミュニケーション – 複数のマニフェスト ファイルを扱う場合でも、エージェントの挙動を 1 つのソース オブ トゥルースで定義できます。
- 一貫性 – エージェントやアクション、機能など、すべての構成要素を統一パターンで設計できます。
- 自動化しやすい – OpenAPI 仕様や各種マニフェストを自動生成し、時間短縮とヒューマン エラー削減を実現します。
- 早期バリデーション – データ型の不一致や定義の不明確さなどの設計問題を実装前に検出できます。
- デザイン ファースト アプローチ – 実装に入る前にエージェントと API の構造・契約を考えることで、長期的な保守性を高めます。

## 演習 1: Microsoft 365 Agents Toolkit を使ってベース エージェントを TypeSpec で構築する


### 手順 1: Microsoft 365 Agents Toolkit でベース エージェント プロジェクトをスキャフォールディングする
- VS Code 左側メニューから Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択します。アクティビティ バーが開きます。  
- アクティビティ バーで「Create a New Agent/App」ボタンを選択すると、利用可能なテンプレート一覧が表示されます。  
- テンプレート一覧から「Declarative Agent」を選択します。  
- 続いて「Start with TypeSpec for Microsoft 365 Copilot」を選択し、TypeSpec でエージェントを定義します。  
- 次に、ツールキットがプロジェクトを生成するフォルダーを選択します。  
- アプリケーション名として "RepairServiceAgent" などを入力し、Enter キーを押して完了します。新しい VS Code ウィンドウが開き、エージェント プロジェクトが読み込まれます。

<cc-end-step lab="e01" exercise="1" step="1" />

### 手順 2: Microsoft 365 Agents Toolkit にサインインする 

エージェントをアップロードしてテストするには、Microsoft 365 Agents Toolkit にサインインする必要があります。

- プロジェクト ウィンドウで、再度 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択します。アクティビティ バーに Accounts、Environment、Development などのセクションが表示されます。  
- 「Accounts」セクションで「Sign in to Microsoft 365」を選択します。サインイン ダイアログが表示されるので「Sign in」を選択します。  
- サインインが完了したらブラウザーを閉じ、プロジェクト ウィンドウに戻ります。

<cc-end-step lab="e01" exercise="1" step="2" />

### 手順 3: エージェントを定義する

Agents Toolkit によって生成された Declarative エージェント プロジェクトには、GitHub API に接続してリポジトリの Issue を表示するテンプレートが含まれています。本ラボでは、車両修理サービスと統合し、修理データを管理する複数の操作をサポートする独自エージェントを構築します。

プロジェクト フォルダーには `main.tsp` と `actions.tsp` の 2 つの TypeSpec ファイルがあります。  
`main.tsp` にはエージェントのメタデータ、指示、機能が定義されています。  
`actions.tsp` はエージェントのアクションを定義するファイルです。API サービスへの接続などアクションを含める場合はこのファイルに記述します。

`main.tsp` を開き、デフォルト テンプレートの内容を確認しましょう。これを修理サービスのシナリオ用に修正します。 

#### エージェントのメタデータと指示を更新する

`main.tsp` にはエージェントの基本構造が含まれています。テンプレートには以下が含まれています。
- エージェント名と説明 1️⃣  
- 基本的な指示 2️⃣  
- アクションと機能のプレースホルダー コード（コメントアウト済み）3️⃣  

![Visual Studio Code showing the initially scaffolded template for a Declarative Agent defined in TypeSpec. There TypeSpec syntax elements to define the agent, its instructions, and some commented out commands to define starter prompts and actions.](https://github.com/user-attachments/assets/42da513c-d814-456f-b60f-a4d9201d1620)


最初に修理シナリオ用のエージェントを定義します。`@agent` と `@instructions` の定義を次のコード スニペットに置き換えます。

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

次に会話スターターを追加します。指示のすぐ下にコメントアウトされた会話スターターのコードがあるので、コメントを外し、タイトルとテキストを以下に置き換えます。

```typespec
// Uncomment this part to add a conversation starter to the agent.
// This will be shown to the user when the agent is first created.
@conversationStarter(#{
  title: "List repairs",
  text: "List all repairs"
})

```

#### エージェントのアクションを更新する

次に `actions.tsp` ファイルを開き、エージェントのアクションを定義します。後で `main.tsp` に戻り、アクション参照を含むエージェントのメタデータを完成させますが、まずはアクション自体を定義します。

`actions.tsp` のプレースホルダー コードは、GitHub リポジトリのオープン Issue を検索するものです。アクションのメタデータ、API ホスト URL、操作や関数の定義方法を理解するための出発点です。これを修理サービス用にすべて置き換えます。

インポートや using 文などのモジュール レベルのディレクティブの後から "SERVER_URL" が定義される箇所までの既存コードを、以下のスニペットに置き換えます。この更新によりアクション メタデータが追加され、サーバー URL が設定されます。また、名前空間が GitHubAPI から RepairsAPI に変更されています。

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

次にテンプレート コードの `searchIssues` を `listRepairs` に置き換えます。これは修理一覧を取得する操作です。SERVER_URL 定義の直後から最終の閉じ括弧の *前* までのコード ブロック全体を以下のスニペットに置き換えてください。閉じ括弧自体は残します。

```typespec
  /**
   * List repairs from the API 
   * @param assignedTo The user assigned to a repair item.
   */

  @route("/repairs")
  @get  op listRepairs(@query assignedTo?: string): string;

````

続いて `main.tsp` に戻り、定義済みアクションをエージェントに追加します。会話スターターの後にあるコード ブロック全体を次のスニペットに差し替えます。

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

この手順は任意です。TypeSpec ファイルで何を定義したか確認したい場合に読んでください。すぐにエージェントをテストしたい場合は手順 5 に進んで構いません。  
`main.tsp` と `actions.tsp` には、デコレーター（@ で始まる）、名前空間、モデルなど、エージェントの定義が含まれています。

以下の表はこれらのファイルで使われている主なデコレーターの説明です。


| アノテーション               | 説明                                                                                                                                                   |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| @agent                      | エージェントの名前空間（名前）と説明を定義します                                                                                                         |
| @instructions               | エージェントの挙動を規定する指示を定義します。8,000 文字以内                                                                                                |
| @conversationStarter        | エージェントの会話スターターを定義します                                                                                                                  |
| op                          | あらゆる操作を定義します。*op GraphicArt* や *op CodeInterpreter* など機能を定義する場合、または **op listRepairs** のように API 操作を定義する場合があります |
| @server                     | API のサーバー エンドポイントとその名前を定義します                                                                                                       |
| @capabilities               | 関数内で使用すると、操作の確認カードなど簡単な Adaptive Card を定義します                                                                                    |


<cc-end-step lab="e01" exercise="1" step="4" />

### 手順 5: エージェントをテストする

次は Repair Service Agent をテストします。 

- Agents Toolkit 拡張機能のアイコンを選択し、プロジェクト内からアクティビティ バーを開きます。  
- アクティビティ バーの "LifeCycle" セクションで "Provision" を選択します。これにより、生成されたマニフェスト ファイルやアイコンを含むアプリ パッケージがビルドされ、カタログにサイドロード（自分だけがテスト可能な状態）されます。  

!!! tip "Knowledge"
    Agents Toolkit は TypeSpec ファイルの定義を検証し、正確性を確保します。エラーも特定して開発体験を向上させます。

- 次にブラウザーを開き、[https://m365.cloud.microsoft/chat](https://m365.cloud.microsoft/chat){target=_blank} にアクセスして Copilot アプリを開きます。

!!! note "Help"
    Copilot アプリで「Something went wrong」の画面が表示された場合は、ブラウザーを更新してください。  

- Microsoft 365 Copilot インターフェイスの **Agents** 一覧から **RepairServiceAgent** を選択します。  
プロビジョニングの進行状況を示すトースター メッセージが表示されるまで少し時間がかかります。

- 会話スターター `List repairs` を選択し、チャットに送信してエージェントとの対話を開始し、応答を確認します。

!!! tip "Help"
    クエリを処理するためにエージェントへの接続を求められたら、通常は最初の 1 回だけ表示されます。ラボをスムーズに進めるため **"Always allow"** を選択してください。  
    ![Screenshot of the agent in action with the response for the prompt 'List all repairs' showing repairs with pictures.](https://github.com/user-attachments/assets/02400c13-0766-4440-999b-93c88ca45dc7)

- 今後の演習に備えてブラウザー セッションは開いたままにしておきます。 

<cc-end-step lab="e01" exercise="1" step="5" />

## 演習 2: エージェント機能の拡張
次に、さらに多くの操作を追加し、Adaptive Card での応答を有効にし、Code Interpreter 機能を組み込んでエージェントを強化します。VS Code のプロジェクトに戻り、各ステップを試してみましょう。

### 手順 1: 追加の操作をエージェントに組み込む

- `actions.tsp` ファイルに移動し、`listRepairs` 操作の直後に以下のスニペットを貼り付けて `createRepair`、`updateRepair`、`deleteRepair` の新しい操作を追加します。ここでは `Repair` アイテムのデータ モデルも定義しています。

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

- 次に `main.tsp` ファイルに戻り、これらの新しい操作がエージェントのアクションにも追加されていることを確認します。`RepairServiceActions` 名前空間内の `op listRepairs is global.RepairsAPI.listRepairs;` の後に以下のスニペットを貼り付けます。

```typespec
op createRepair is global.RepairsAPI.createRepair;
op updateRepair is global.RepairsAPI.updateRepair;
op deleteRepair is global.RepairsAPI.deleteRepair;   

```
- さらに、最初の会話スターターの直後に新しい修理アイテム作成用の会話スターターを追加します。

```typespec
@conversationStarter(#{
  title: "Create repair",
  text: "Create a new repair titled \"[TO_REPLACE]\" and assign it to me"
})

```

<cc-end-step lab="e01" exercise="2" step="1" />

### 手順 2: 関数参照に Adaptive Card を追加する

次に、参照カードや応答カードを Adaptive Card で強化します。`listRepairs` 操作に対して修理アイテム用の Adaptive Card を追加しましょう。 

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

- `actions.tsp` に戻り、`listRepairs` 操作を探します。操作定義 `@get op listRepairs(@query assignedTo?: string): string;` の直上に、以下のスニペットでカード定義を貼り付けます。

```typespec

  @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "cards/repair.json"}) 
  
```

上記のカード応答は、修理アイテムを問い合わせた際やエージェントがアイテムの一覧を返す際に使用されます。  
続いて `createRepair` 操作に対しても、POST 操作後にエージェントが作成結果を表示するカード応答を追加します。

- `@post op createRepair(@body repair: Repair): Repair;` の直上に以下のスニペットを貼り付けます。

```typespec

   @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "cards/repair.json"}) 

```

<cc-end-step lab="e01" exercise="2" step="2" />

## 手順 3: Code Interpreter 機能を追加する

Declarative エージェントは *OneDriveAndSharePoint*、*WebSearch*、*CodeInterpreter* など多くの機能を拡張できます。  
次は Code Interpreter 機能を追加して、エージェントをさらに強化します。

- `main.tsp` ファイルを開き、`RepairServiceAgent` 名前空間を探します。

- この名前空間内に、コードを解釈・実行できるようにする新しい操作を定義する以下のスニペットを追加します。

```typespec
  op codeInterpreter is AgentCapabilities.CodeInterpreter;
```

!!! tip
    上記の *CodeInterpreter* 操作は、エージェントのアクションを定義する `RepairServiceActions` 名前空間ではなく、外側の `RepairServiceAgent` 名前空間内に貼り付けてください。  

追加機能をサポートするようになったため、指示も更新して反映します。

- 同じ `main.tsp` ファイルで `@instructions` 定義を更新し、エージェントへの追加指示を含めます。

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

更新されたエージェント（修理アナリスト機能付き）をテストしてみましょう。 

- Agents Toolkit の拡張機能アイコンを選択し、アクティビティ バーを開きます。  
- アクティビティ バーの "LifeCycle" セクションで "Provision" を選択して、新しいエージェントをパッケージ化してアップロードします。  
- その後、開いているブラウザー セッションに戻り、ページを更新します。  
- **Agents** 一覧から **RepairServiceAgent** を選択します。  
- 会話スターター "Create repair" を選択し、タイトルなどを置き換えてチャットに送信し対話を開始します。例:  

    `Create a new repair titled "rear camera issue" and assign it to me.`

- 確認ダイアログでは、送信内容より多くのメタデータが含まれていることに注目してください。これは新しい指示のおかげです。 

![The confirmation message provided by Microsoft 365 Copilot when sending a POST request to the target API. There are buttons to 'Confirm' or to 'Cancel' sending the request to the API.](https://github.com/user-attachments/assets/56629979-b1e5-4a03-a413-0bb8bb438f00)
 
 - ダイアログを確認してアイテムを追加します。

 エージェントは作成されたアイテムをリッチな Adaptive Card で返します。

 ![The response after creating a new item, with the information about the item to repair rendered through an adaptive card with a button to show the associated image.](https://github.com/user-attachments/assets/6da0a38f-5de3-485a-999e-c695389853f8)

 - 次に参照カードが機能するか再確認します。以下のプロンプトを送信します。

     `List all my repairs.`

エージェントは修理一覧を返し、各アイテムに Adaptive Card の参照ボタンが付いています。

![The response for the list of repairs with a reference button for each item, showing an adaptive card when hoovering on it.](https://github.com/user-attachments/assets/880ad3aa-2ed3-4051-a68b-d988527d9d53)

- 続いてエージェントの新しい分析機能をテストします。エージェント画面右上の **New chat** ボタンで新しいチャットを開きます。  
- 以下のプロンプトをコピーしてメッセージ ボックスに貼り付け、Enter を押します。

    `Classify repair items based on title into three distinct categories: Routine Maintenance, Critical, and Low Priority. Then, generate a pie chart displaying the percentage representation of each category. Use unique colours for each group and incorporate tooltips to show the precise values for each segment.`

以下のようなレスポンスが得られるはずです（内容は変動する場合があります）。 

![The response when using the Code Interpreter capability. There are a detailed text and a chart showing the percentage representation of each category of repair.](https://github.com/user-attachments/assets/ea1a5b21-bc57-4ed8-a8a4-c187caff2c64)

<cc-end-step lab="e01" exercise="2" step="3" />

## 演習 3: エージェントの診断とデバッグ

チャットで開発者モードを有効にすると、エージェントがタスクをどの程度理解しているか、サービスを適切に呼び出しているか、チューニングが必要な箇所、パフォーマンスの問題などを確認できます。

### 手順 1: チャットでのエージェント デバッグ

- 以下の行をエージェントとのチャットに貼り付けてデバッグ モードを有効にします。

    ```
    -developer on
    ```

- 正常に有効化されると、`Successfully enabled developer mode.` と表示されます。

- テストとして、次のようなプロンプトを送信します。

   `Find out what Karin is working on.`

- 修理サービスからの情報とともに **Agent debug info** カードが表示されます。
- **Agent debug info** カードを展開すると、以下が確認できます。 
    - エージェント情報 1️⃣  
    - エージェントの機能 2️⃣  
    - アクションと選択された関数 3️⃣  
    - 実行されたアクションの詳細（リクエスト、レイテンシ、レスポンス データなど）4️⃣  

![The developer debug information card in Microsoft 365 Copilot when analysing the request for an action. There are sections about agent info, capabilities, actions, connected agents, execution, etc.](https://github.com/user-attachments/assets/b135f3b0-50f1-47a1-b608-a5a1b27b806e)

- **Executed Actions** を展開すると、リクエスト URL、渡されたパラメーター、リクエスト ヘッダー、レスポンス、レイテンシなどが確認できます。 

<cc-end-step lab="e01" exercise="3" step="1" />

---8<--- "ja/e-congratulations.md"

素晴らしい！初めてのエージェント作成お疲れさまでした 🎉 

次に進み、API を作成して統合するには **Next** を選択してください。
<cc-next url="../02-build-the-api" label="Next" />

基礎をさらに探求したい場合は、Geolocator ゲームを作成する **Create a game** を選択してください。
<cc-next url="../01a-geolocator" label="Create a game" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/01-typespec-declarative-agent--ja" />