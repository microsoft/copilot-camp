---
search:
  exclude: true
---
# ラボ E1 - Microsoft 365 Agents Toolkit で TypeSpec 定義を使って Declarative エージェントを初めて作成する

このラボでは、Microsoft 365 Agents Toolkit を使用して TypeSpec 定義を持つ Declarative エージェントを構築します。修理データと対話して自動車修理レコードを管理するための `RepairServiceAgent` というエージェントを作成します。  
完成版エージェントのソースコードは [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab01-declarative-copilot/RepairServiceAgent) で確認できます。

このラボは Ignite 2025 の発表内容を反映して更新されています。TypeSpec は GA となり、Toolkit バージョン 6.4.1 がリリースされました。このラボは 2025 年 11 月の Ignite で提供された Lab 560 をベースにしています。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RNsa0kLsXgY" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>ビデオでラボの概要を短く確認しましょう。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## Declarative エージェントとは何か

**Declarative エージェント** は、Microsoft 365 Copilot のスケーラブルなインフラストラクチャとプラットフォームを活用し、特定のニーズにフォーカスした形で提供されるものです。Microsoft 365 Copilot の標準チャット インターフェイスと同じ UI を使いながら、対象タスクに専念できる専門家として機能します。

### Declarative エージェントの構成要素

Copilot 用に複数のエージェントを作成すると、最終的な成果物が zip ファイルにまとめられた数個のファイルのセット (アプリ パッケージ) であることに気付くでしょう。これは Teams アプリをデプロイした経験がある方には馴染みのある構成で、追加要素が含まれています。以下の表で主な要素を確認してください。また、アプリの展開プロセスは Teams アプリの展開と非常によく似ています。

| ファイル種別 | 説明 | 必須 |
|--------------|------|------|
| アプリ マニフェスト | 標準の Teams アプリ マニフェストを定義する JSON ファイル (**manifest.json**) | Yes |
| Declarative エージェント マニフェスト | エージェントの名前、指示、機能、会話スターター、アクション (該当する場合) を含む JSON ファイル | Yes |
| プラグイン マニフェスト | アクションを API プラグインとして構成するための JSON ファイル。認証、必須フィールド、Adaptive Card 応答などを含む。アクションが存在する場合のみ必要 | No |
| アプリ アイコン | Declarative エージェント用のカラー アイコンおよびアウトライン アイコン | Yes |

### Declarative エージェントの機能

指示を追加するだけでなく、エージェントがアクセスすべきナレッジ ベースを指定することで、対象データに対する集中度を高められます。これらを「機能 (capabilities)」と呼びます。現在 Declarative エージェントでサポートされている機能は次のとおりです。

- **Copilot Connectors** – Microsoft 365 上にコンテンツを一元化します。外部コンテンツを Microsoft 365 に取り込むことで、関連情報の検索を容易にし、組織内の他者が新しいコンテンツを発見しやすくなります。
- **OneDrive and SharePoint** – OneDrive や SharePoint のファイル/サイトの URL を指定して、エージェントのナレッジ ベースに含められます。
- **Web 検索** – Web コンテンツをナレッジ ベースに含めるかどうかを設定できます。最大 4 件の Web サイト URL をソースとして渡すことも可能です。
- **Code Interpreter** – 数学的問題をより良く解決し、必要に応じて Python コードで高度なデータ分析やチャート作成を行う能力をエージェントに付与します。
- **GraphicArt** – DALL·E を利用した画像または動画生成機能をエージェントに追加します。
- **Email Knowledge** – 個人または共有メールボックス (オプションで特定フォルダー) をナレッジとして使用できます。
- **People Knowledge** – 組織内の人物に関する質問に回答するエージェントを構築できます。
- **Teams Messages** – Teams のチャネル、チーム、会議、1:1 チャット、グループ チャットを検索できるようにします。
- **Dataverse Knowledge** – Dataverse インスタンスをナレッジ ソースとして追加できます。
- **Scenario Models** – タスク固有のモデルを追加できます。
- **Teams Meetings** – 組織内の会議情報を検索できるエージェントを構築できます。

!!! tip "OneDrive and SharePoint"
    URL は SharePoint アイテム (サイト、ドキュメント ライブラリ、フォルダー、ファイル) の完全パスである必要があります。SharePoint の「リンクをコピー」オプションを使用してフル パスを取得できます。ファイルまたはフォルダーを右クリックして [詳細] を選択し、[パス] 項目のコピー アイコンをクリックしてください。  
    <mark>URL を指定しない場合、ログイン ユーザーがアクセス可能な OneDrive と SharePoint の全コンテンツがエージェントのナレッジとして使用されます。</mark>

!!! tip "Microsoft Copilot Connector"
    接続を指定しない場合、ログイン ユーザーがアクセス可能な Copilot Connectors の全コンテンツがナレッジとして使用されます。

!!! tip "Web 検索"
    サイトを指定しない場合、エージェントはすべてのサイトを検索できます。指定できるサイトはパス セグメントが 2 つ以内で、クエリ ストリングのない URL を最大 4 件までです。


## Declarative エージェントにおける TypeSpec の重要性

### TypeSpec とは

**TypeSpec** は、API 契約を構造化され型安全な方法で設計・記述するために Microsoft が開発した言語です。API がどのようなデータを受け取り、返し、各部分やアクションがどのように接続されるかを示す設計図のようなものと考えてください。

### エージェントになぜ TypeSpec か

TypeScript がフロントエンド/バックエンド コードに構造を提供するのと同様に、TypeSpec はエージェントとその API サービス (アクションなど) に構造を提供します。Visual Studio Code などのツールと整合するデザイン ファースト開発ワークフローに最適です。

- **明確なコミュニケーション** – 複数のマニフェスト ファイルを扱う混乱を避ける単一のソース オブ トゥルースを提供します。
- **一貫性** – エージェント、アクション、機能などの全要素が同じパターンに従って設計されることを保証します。
- **自動化に適合** – OpenAPI スペックやその他マニフェストを自動生成し、時間を節約し人的ミスを削減します。
- **早期検証** – 実装前に設計上の問題 (データ型の不一致や定義の不明確さなど) を早期に検出します。
- **デザイン ファースト アプローチ** – 実装に入る前にエージェントと API の構造・契約を考えることを促し、長期的な保守性を向上させます。


☑️ Declarative エージェントと TypeSpec に関する基本概念を理解できました！最初の演習に進みましょう。

## 演習 1: 単一操作を実行するアクションを持つ Declarative エージェントを構築する

Microsoft 365 Agents Toolkit を使用して、最初の Declarative エージェントを作りましょう。  
修理データと対話して自動車修理レコードを管理する **RepairServiceAgent** を作成します。  
追加の前提条件をインストールしてください。

- [Visual Studio Code 用 REST Client アドイン](https://marketplace.visualstudio.com/items?itemName=humao.rest-client): API をローカルでテストするために使用します。
- [Microsoft 365 Agents Toolkit バージョン 6.4.0 以上](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension)。古いバージョンをお使いの場合は更新してください。

### 手順 1: Microsoft 365 Agents Toolkit でエージェント プロジェクトをスキャフォールディングする

- VS Code を開き、左メニューの Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択します。アクティビティ バーが開きます。  
- アクティビティ バーで "Create a New Agent/App" ボタンを選択すると、利用可能なアプリ テンプレートのリストが表示されます。  
- テンプレートの一覧から "Declarative Agent" を選択します。  
- 次に "Start with TypeSpec for Microsoft 365 Copilot" を選択して、TypeSpec でエージェントを定義します。  
- エージェント プロジェクトを作成する **デフォルト フォルダー** を選択します。  
- アプリケーション名として `RepairServiceAgent` などを入力し Enter を押すと完了です。新しい VS Code ウィンドウにプロジェクトが読み込まれます。


!!! note
    フォルダー内のファイルの作成者を信頼するかどうかを尋ねるプロンプトが表示される場合があります。これは想定されたもので、**Yes, I trust the authors** を選択して問題ありません。このダイアログはセキュリティ保護の一環で、コード作成者の信頼性に応じて機能の実行を制限するかどうかを判断するためのものです。自分のコード、または信頼できるソースからのコードであれば安心して信頼してください。


<cc-end-step lab="e01" exercise="1" step="1" />

### 手順 2: Microsoft 365 Agents Toolkit にサインインする

エージェントをアップロードしてテストするには、Microsoft 365 Agents Toolkit にサインインする必要があります。

- プロジェクト ウィンドウで再度 Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択します。Accounts、Environment、Development などのセクションが表示されます。  
- "Accounts" セクションの "Sign in to Microsoft 365" を選択します。サインイン ダイアログが表示されるので **Sign in** を選択します。  
- サインインが完了したらブラウザーを閉じ、プロジェクト ウィンドウに戻ります。

<cc-end-step lab="e01" exercise="1" step="2" />

### 手順 3: エージェントを定義する

Agents Toolkit によってスキャフォールディングされた Declarative エージェント プロジェクトには、GitHub API と接続してリポジトリの issue を表示するためのテンプレート コードが含まれています。本ラボでは、修理 API サービスと統合し、複数の操作をサポートする独自のエージェントを構築します。

エージェント定義に進む前に、修理 API サービスの機能を把握しましょう。

#### 修理 API サービスを理解する

API サービスのエンドポイントとペイロードを対話的に調べる必要があります。REST Client 拡張機能を使用すると、VS Code 内で **.http** ファイルを使って HTTP リクエストを定義し送信できます。外部ツールを開く必要がなく、テストやレスポンスの確認、反復が素早く行えます。

プロジェクトのルート フォルダーで **http** フォルダーを作成します。  
その中に `repairs-api.http` というファイルを作成します。

!!! note
    **VS Code でフォルダーとファイルを作成する方法:**

      - フォルダーを作成する場合: Explorer パネルで右クリックし、"New Folder" を選択してフォルダー名を入力します。
      - ファイルを作成する場合: 目的のフォルダーを右クリックし、"New File" を選択してファイル名と拡張子を入力します。
      - Explorer パネルのアイコン (📁 フォルダー、📄 ファイル) を使うこともできます。

ファイルに以下の内容を貼り付けます。

```
@base_url = https://repairshub.azurewebsites.net

### Get all repair requests
{{base_url}}/repairs

### Get a specific repair request by ID
{{base_url}}/repairs/1

### Create a new repair request
POST {{base_url}}/repairs
Content-Type: application/json

{
  "description": "Repair broken screen",
  "date": "2023-10-01T12:00:00Z",
  "image": "https://example.com/image.png"
}

### Update an existing repair request
PATCH {{base_url}}/repairs/1
Content-Type: application/json  

{
  "id": 1,
  "description": "Repair broken screen - updated",
  "date": "2023-10-01T12:00:00Z",
  "image": "https://example.com/image-updated.png"
}


### Delete a repair request by ID
DELETE {{base_url}}/repairs/10
Content-Type: application/json

{
  "id": 10
}
```

> エディターからリクエストを送信すると若干の遅延がありますが、数秒でレスポンスが返るはずです。

各リクエスト行 (例: GET {{base_url}}/repairs) にカーソルを合わせ、**Send Request** をクリックしてレスポンスを確認してください。リクエストとレスポンスの構造を観察し、エージェントが API とどのようにやり取りするかを理解します。

![http request](https://github.com/user-attachments/assets/050ca976-4523-463d-920f-4f0f2da46249)




#### Repairs API の概要

**ベース URL**: *https://repairshub.azurewebsites.net*

| 操作 | メソッド | エンドポイント | ペイロード | 目的 |
|------|----------|----------------|------------|------|
| すべての修理リクエスト取得 | GET | /repairs | なし | すべての修理ジョブを取得 |
| ID で修理取得 | GET | /repairs/{id} | なし | 特定の修理ジョブを取得 |
| 修理リクエスト作成 | POST | /repairs | 必須 | 新しい修理ジョブを登録 |
| 修理リクエスト更新 | PATCH | /repairs/{id} | 必須 | 既存の修理ジョブを更新 |
| 修理リクエスト削除 | DELETE | /repairs/{id} | なし | 修理ジョブを ID 指定で削除 |

API サービスを理解できたら、次にエージェントへの統合に進みます。

#### プロジェクト構成

エージェント プロジェクトの **src** フォルダーには、主要な TypeSpec 構成ファイル **main.tsp** と **env.tsp** があります。

- **main.tsp**: エージェントのメタデータ、挙動を定義する指示、機能など、主要な定義を含みます。  
- **env.tsp**: 環境変数をコンパイル時に処理するために Toolkit が使用します。**env/.env.\*** から生成されるため手動更新は不要です。

さらに **actions** フォルダーにテンプレート ファイル (初期状態では **github.tsp**) があり、GitHub API 統合の例が示されています。このラボでは、これを置き換えて Repairs API サービスとの接続を定義します。

**prompts** フォルダーには **instructions.tsp** があり、エージェントの詳細な挙動やガイダンスを定義できます。


#### エージェントのメタデータと指示を更新する

**main.tsp** を開き、デフォルト テンプレートの内容を修理サービス シナリオ向けにどのように変更するか確認します。

**main.tsp** の基本構造には以下が含まれます。
- エージェント名と説明 1️⃣  
- 基本的な指示 2️⃣  
- アクションと機能のプレースホルダー コード (コメントアウト) 3️⃣

![image of main.tsp file](https://github.com/user-attachments/assets/9924db6f-930b-453c-92ec-72ac7534c1cb)



まず修理シナリオ用にエージェントを定義します。**@agent** メタデータを以下のコード スニペットに置き換えてください。

```typespec
@agent(
  "RepairServiceAgent",
  "An agent for managing repair information"
)

```

次に会話スターターを設定します。これはユーザーとエージェントの対話を開始する初期プロンプトです。テンプレートの該当セクションをコメント解除し、title と text をシナリオに合わせて更新します。

```typespec
// Uncomment this part to add a conversation starter to the agent.
// This will be shown to the user when the agent is first created.
@conversationStarter(#{
  title: "List repairs",
  text: "List all repairs"
})

```
このスタータープロンプトでは GET 操作を呼び出してサービスからすべての修理を取得する必要があります。その動作を可能にするため、対応するアクションを定義します。次の手順に進んでください。

続いて **prompts/instructions.tsp** を開き、指示を更新します。  
ファイル全体を以下のコードに置き換えます。

```typespec
namespace Prompts {
  const INSTRUCTIONS = """
    ## Purpose
    You will assist the user in finding car repair records based on the information provided by the user.
  """;
}

```

#### エージェントのアクションを定義する

次に **actions/github.tsp** を **actions.tsp** にリネームします。VS Code でファイルを右クリックし "Rename" を選択してください。

**main.tsp** でアクション参照を完了させる前に、アクション自体を定義する必要があります。**actions.tsp** を開き、サービス URL が定義される行までのコードを以下に置き換えます。

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

次にテンプレートの `searchIssues` 操作を `listRepairs` に置換して修理一覧を取得します。SERVER_URL 定義の直後から最終の閉じ括弧直前までを以下のスニペットに置き換えてください。閉じ括弧は残します。  

**コメント部分もドキュメントとして必要なので必ずコピーしてください**。

```typespec
  /**
   * List repairs from the API 
   * @param assignedTo The user assigned to a repair item.
   */

  @route("/repairs")
  @get  op listRepairs(@query assignedTo?: string): string;

```

**main.tsp** に戻り、インポート文を確認します。まだ *./actions/github.tsp* を参照している場合は、以下の文に置換します。

```typespec
import "./actions/actions.tsp";
```

同じファイルで、会話スターターの後にエージェントにアクションを追加します。**RepairServiceAgent** 名前空間全体を以下のスニペットに置換してください。

```typespec
namespace RepairServiceAgent{  

  op listRepairs is global.RepairsAPI.listRepairs;   

}

```


<cc-end-step lab="e01" exercise="1" step="3" />

### 手順 4: デコレーターを理解する (任意)

任意のステップですが、TypeSpec ファイルで何を定義したか気になる場合はお読みください。  
**main.tsp** と **actions.tsp** には、デコレーター (@ で始まる), namespace, model などが記述されています。

以下の表で主要なデコレーターを確認できます。

| アノテーション | 説明 |
|----------------|------|
| @agent | エージェントの namespace (名前) と説明を定義 |
| @instructions | エージェントの挙動を規定する指示 (最大 8000 文字) |
| @conversationStarter | エージェントの会話スターターを定義 |
| @op | 任意の操作を定義。エージェントの機能 (例: *op GraphicArt*, *op CodeInterpreter*) や API 操作 (**op listRepairs** など) を定義する。POST 操作は `op createRepair(@body repair: Repair): Repair;` のように記述 |
| @server | API のサーバー エンドポイントと名前を定義 |
| @capabilities | 関数内で使用すると、操作用の小規模な Adaptive Card (確認カードなど) を定義 |

☑️ 第一演習を完了しました！GET 操作で修理一覧を取得するアクションを追加する方法を学びました。次の演習では、修理管理用のさらなる操作を追加し、テストとデバッグを行います。

次の演習へ進みましょう。

<cc-end-step lab="e01" exercise="1" step="4" />

## 演習 2: 追加操作を実装し、エージェントをテストしてデバッグ手法を学ぶ

ここでは Repairs API サービスのさらなる操作と Adaptive Card 応答を追加してエージェントを拡張します。手順を追って進めましょう。ブラウザーをご利用の場合は VS Code のプロジェクトに戻ってください。

### 手順 1: エージェントを修正して追加操作を実装する

- **actions/actions.tsp** を開き、**listRepairs** 操作の直後に以下のスニペットを貼り付けて **createRepair**, **updateRepair**, **deleteRepair** の各操作を追加します。また **Repair** データモデルも定義します。

```typespec
/**
   * Create a new repair using the API. 
   * When creating a repair, the `id` field is optional and will be generated by the server.
   * The `date` field should be in ISO 8601 format (e.g., "2023-10-01T12:00:00Z").
   * The `title` field based on what repair user wants to create
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
  @patch(#{implicitOptionality: true})
  op updateRepair(@body repair: Repair): Repair;


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

- **main.tsp** に戻り、エージェントのアクションとして新しい操作が追加されているか確認します。**RepairServiceActions** 名前空間内の `op listRepairs is global.RepairsAPI.listRepairs;` の次に以下のスニペットを貼り付けます。

```typespec
op createRepair is global.RepairsAPI.createRepair;
op updateRepair is global.RepairsAPI.updateRepair;
op deleteRepair is global.RepairsAPI.deleteRepair;   

```
- さらに、新しい修理アイテムを作成する会話スターターを最初のスターター定義の直後に追加します。

```typespec
@conversationStarter(#{
  title: "Create repair",
  text: "Create a new repair titled \"[TO_REPLACE]\" and assign it to me"
})

```

<cc-end-step lab="e01" exercise="2" step="1" />

### 手順 2: 関数参照に Adaptive Card を追加する

次に応答カードを Adaptive Card で強化します。修理アイテム用のカードを作成しましょう。

- **appPackage** フォルダー内の **adaptiveCards** フォルダーに `repair.json` を作成し、提供されたコード スニペットを貼り付けます。既存のテンプレート カードは無視してください。

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

- **actions.tsp** に戻り、`@get op listRepairs(@query assignedTo?: string): string;` の直前に以下のスニペットを貼り付けてカード定義を追加します。

```typespec

@card(#{  dataPath: "$", file: "adaptiveCards/repair.json",    properties: #{ title: "$.title", url: "$.image" } })
  
```
このカード応答は、修理アイテムを問い合わせた場合やエージェントがアイテム一覧を返す際に使用されます。

> このラボでは簡略化のため同じカードを再利用します。実際には操作ごとに異なるカードを作成しても構いません。

**createRepair** 操作に対してもカード応答を追加し、POST の結果を表示します。

- `@post  op createRepair(@body repair: Repair): Repair;` の直前に以下のスニペットを貼り付けます。

```typespec

@card(#{  dataPath: "$", file: "adaptiveCards/repair.json",    properties: #{ title: "$.title", url: "$.image" } })

```

<cc-end-step lab="e01" exercise="2" step="2" />

### 手順 3: 新しい操作に合わせてエージェントの指示を更新する

**prompts/instructions.tsp** の INSTRUCTIONS 定義を追加機能に対応させます。以下のコードで置き換えてください。

```typespec
const INSTRUCTIONS ="""  
    ## Purpose
    You will assist the user in finding car repair records based on the information provided by the user.
   
    ## Guidelines
    - You are a repair service agent.
    - You can use the actions to create, update, and delete repairs.
    - When creating a repair item, if the user did not provide a description or date, use the title as the description and put today's date in the format YYYY-MM-DD.
    - Do not use any technical jargon or complex terms.
  """;
```

<cc-end-step lab="e01" exercise="2" step="3" />

### 手順 4: エージェントをプロビジョニングしてテストする

#### プロビジョニング

まずエージェントをテナントにプロビジョニングしてテストします。以下の手順に従ってください。

- プロジェクト ルートの **env** フォルダー内にある **.env.dev** を開き、**AGENT_SCOPE** 変数があれば値を `shared` から `personal` に変更します。
- Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択し、アクティビティ バーを開きます。
- アクティビティ バーの "LifeCycle" セクションで "Provision" を選択します。これにより TypeSpec から生成されたマニフェストとアイコンを含むアプリ パッケージがビルドされ、テスト用にカタログへサイドロードされます。
  
>!!! note
     Agents Toolkit は TypeSpec ファイルに記述された定義を検証し、エラーを特定して開発者体験を向上させます。

処理には時間がかかりますが、VS Code のトースト メッセージで進捗が確認できます。

!!! warning
    **Provision** が失敗し、次のようなエラーが表示される既知の問題があります。発生した場合は成功するまで再試行してください。  
    ![provision 429 issue](https://github.com/user-attachments/assets/bf849c94-6f5a-406a-9902-ae5a07d47840)  
    ![provision timeout issue](https://github.com/user-attachments/assets/fd13651e-d469-4ecb-91b2-c24045fb4264)


- ラボ マシンのタスクバーから Microsoft Edge を開き、`https://m365.cloud.microsoft/chat` にアクセスして Copilot アプリを開き、サインインします。
- 左側の **Agents** から **RepairServiceAgent** を選択します。  

> ナビゲーションが見当たらない場合は、以下のアイコンを選択して表示してください。  
> ![find agents nav](https://github.com/user-attachments/assets/0d603d1b-6458-4766-9063-4f87597f10dc)

#### list 操作をテストする

- 会話スターター **List repairs** を選択し、チャットに送信してエージェントとの対話を開始します。サービスへのアクセス許可を求めるメッセージが表示された場合は **"Always allow"** を選択してください。

  許可すると、以下のようなレスポンスが返ります。  

![ex1-dem0-01](https://github.com/user-attachments/assets/02400c13-0766-4440-999b-93c88ca45dc7)

#### エージェントの診断とデバッグ

チャットで開発者モードを有効にすると、エージェントがタスクをどの程度理解しているか、サービス呼び出しが正しいか、チューニングが必要な箇所、パフォーマンス問題などを確認できます。

- チャットに `-developer on` と送信してデバッグ モードを有効にします。

成功すると **Successfully enabled developer mode** と返ります。

!!! note
    F5 キーでブラウザーを更新するとデバッグ情報が表示されます。

- 例として以下のプロンプトを送信し、エージェントの応答を確認します。

`Find out what Karin is working on`

- 修理サービスからの情報に加え **Agent debug info** カードが表示されます。
- カードを展開すると以下が確認できます。  
  1️⃣ エージェント情報  
  2️⃣ エージェントの機能  
  3️⃣ 選択されたアクションと関数  
  4️⃣ 実行されたアクションの詳細 (リクエスト、レイテンシ、レスポンス データなど)

  ![image of agent debug info](https://github.com/user-attachments/assets/cb8623c7-27e1-4ece-9ec6-4c43b76917fb)


- Executed Actions を展開するとリクエスト URL、パラメーター、ヘッダー、レスポンス、レイテンシなどが確認できます。

#### create 操作をテストする

POST 呼び出しで修理アイテムを作成してみましょう。

- 会話スターター **Create repair** を選択し、プロンプト内容を置換して送信します。例:

    `Create a new repair titled "360 camera issue" and assign it to me.`

- 送信すると、拡張した指示のおかげで入力した内容より詳細なメタデータが含まれる確認ダイアログが表示されます。

![response from Create a new repair titled "360 camera issue" and assign it to me](https://github.com/user-attachments/assets/f570f9fd-fa85-4ab1-9c3d-f9baf993dc95)

 
 - ダイアログを承認してアイテムを追加します。

 エージェントはリッチな Adaptive Card で作成されたアイテムを返します。

![adaptive card response](https://github.com/user-attachments/assets/d4d5906d-e5fb-4728-bb0c-b7a9f54215c5)


- 参照カードが機能するか再確認します。新しいチャットを開き、次のプロンプトを送信します。

     `List all my repairs.`

エージェントはアイテムごとに Adaptive Card を添えて一覧を返します。

![list all repairs with new repair added](https://github.com/user-attachments/assets/8240525d-c683-40f9-aa68-d6ba9a19d0f2)



☑️ 第二演習を完了しました！修理操作を追加し、テストとデバッグ方法を学習しました。ボーナス演習に進みましょう。

<cc-end-step lab="e01" exercise="2" step="4" />

## ボーナス演習: エージェントに Code Interpreter 機能を追加する

### 手順 1: エージェントに Code Interpreter 機能を追加する

Declarative エージェントは OneDriveAndSharePoint、WebSearch、CodeInterpreter など多くの機能を拡張できます。ここでは Code Interpreter 機能を追加します。

- **main.tsp** を開き、エージェント挙動を定義する **RepairServiceAgent** 名前空間を探します。
- 名前空間 **RepairServiceAgent** 内で **op listRepairs** の上に以下のスニペットを挿入して、コード実行を可能にする新しい機能を定義します。

```typespec
op codeInterpreter is AgentCapabilities.CodeInterpreter;
```

!!! note
    この codeinterpreter 操作は、エージェントの機能を定義する外側の **RepairServiceAgent** 名前空間に追加してください。アクションを定義する **RepairServiceActions** 名前空間ではありません。

追加機能に対応するよう指示も更新します。

- **prompts/instructions.tsp** を開き、INSTRUCTIONS 定数を以下のスニペットに置き換えます。

```typespec

  const INSTRUCTIONS ="""
   ## Purpose
    You will assist the user in finding car repair records based on the information provided by the user. You can generate charts based on data. Use python execution for charting/visualization.
   
    ## Guidelines
    - You are a repair service agent.
    - You can use the actions to create, update, and delete repairs.
    - When creating a repair item, if the user did not provide a description or date, use the title as the description and put today's date in the format YYYY-MM-DD.
    - when asked to generate report, generate charts using existing data.
    - Do not use any technical jargon or complex terms.
""";

```

<cc-end-step lab="e01" exercise="3" step="1" />

### 手順 2: 追加機能をテストする

新しい分析機能をテストします。再度エージェントをプロビジョニングする必要があります。以下の手順を実行してください。

- **appPackage/manifest.json** を開き、バージョンを **"version": "1.0.0"** から **"version": "1.0.1"** に更新します。
- 変更を保存し、Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択し、アクティビティ バーで "Provision" を選択して再プロビジョニングします。
- 既にエージェントとのチャットを開いている場合は **New chat** ボタンで新しいチャットを作成します。
- または Microsoft Edge で `https://m365.cloud.microsoft/chat` を開き、Copilot アプリでサインインします。
- 左側の **Agents** から **RepairServiceAgent** を選択します。  

> ナビゲーションが見当たらない場合は、以下のアイコンを選択して表示してください。  
> ![find agents nav](https://github.com/user-attachments/assets/0d603d1b-6458-4766-9063-4f87597f10dc)

- 次のプロンプトをコピーしてメッセージ ボックスに貼り付け、送信します。

`Classify repair items based on title into three distinct categories: Routine Maintenance, Critical, and Low Priority. Then, generate a pie chart displaying the percentage representation of each category. Use unique colours for each group and incorporate tooltips to show the precise values for each segment.`

以下のようなレスポンスが返ります (結果は異なる場合があります)。  
![response with chart using code interpreter](https://github.com/user-attachments/assets/8ccc7758-28ec-42ff-96fd-2341cad6c9ed)

!!! warning
    Code Interpreter の既知の問題: 応答に次のようなエラーメッセージが表示されても、チャートは正しく生成されますので無視して構いません。  
    ![error with CI](https://github.com/user-attachments/assets/d9d04b7f-5696-42ca-8767-178dbc51f342)

<cc-end-step lab="e01" exercise="3" step="2" />

☑️ すべての演習を完了しました。お疲れさまでした！

---8<--- "ja/e-congratulations.md"
Great job on building your first agent using TypeSpec 🎉 

 Proceed to create, build, and integrate an API selecting **Next**.
 <cc-next url="../02-build-the-api" label="Next" />

Continue practicing by building a Geolocator game agent—select **Create a game** below.
 <cc-next url="../01a-geolocator" label="Create a game" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/01-typespec-declarative-agent--ja" />