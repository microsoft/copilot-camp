---
search:
  exclude: true
---
# Lab E1 - Microsoft 365 Agents Toolkit で TypeSpec 定義を用いて初めての宣言型エージェントを構築する

このラボでは、Microsoft 365 Agents Toolkit を使用して TypeSpec 定義による **宣言型エージェント** を作成します。`RepairServiceAgent` というエージェントを作成し、既存の API サービスを介して修理データと対話し、ユーザーが自動車の修理履歴を管理できるようにします。

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


## 宣言型エージェントとは 

**宣言型エージェント** は、Microsoft 365 Copilot と同じスケーラブルなインフラストラクチャとプラットフォームを活用し、特定領域に特化したニーズに合わせて調整されたエージェントです。特定分野や業務ニーズにおける専門家として機能し、標準の Microsoft 365 Copilot チャットと同じインターフェイスを使いながら、該当タスクのみに集中させることができます。

### 宣言型エージェントの構成要素

Copilot 用に複数のエージェントを構築していくと、最終的な成果物は数個のファイルをまとめた zip 形式の **アプリ パッケージ** であることに気づきます。これはインストールして利用するものなので、パッケージの中身を理解しておくことが重要です。宣言型エージェントのアプリ パッケージは、これまで Teams アプリを作成した経験がある場合、非常によく似ていますが、追加要素があります。以下の表で主要要素を確認してください。アプリのデプロイ プロセスも Teams アプリのデプロイとほぼ同様です。

| File Type                          | Description                                                                                                                                                     | Required |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| Microsoft 365 App Manifest        | Teams アプリ マニフェストを定義する JSON ファイル (`manifest.json`)                                                                                     | Yes      |
| Declarative Agent Manifest        | エージェント名、指示、機能、会話スターター、および (該当する場合) アクションを含む JSON ファイル                                        | Yes      |
| Plugin Manifest       | アクションを API プラグインとして構成する JSON ファイル。認証、必須フィールド、Adaptive Card 応答などを含む。アクションが存在する場合のみ必要 | No       |
| OpenAPI Spec            | API を定義する JSON または YAML ファイル。エージェントにアクションが含まれる場合のみ必須                                                                            | No       |

### 宣言型エージェントの機能

指示文だけでなく、参照すべきナレッジ ベースを指定することで、エージェントのコンテキストとデータへのフォーカスを強化できます。これらは **capabilities**（機能）と呼ばれます。執筆時点で宣言型エージェントがサポートする機能は以下のとおりです。 

- **Copilot Connectors** - Microsoft 365 上にコンテンツを集約。外部コンテンツを取り込むことで検索と発見性を向上。
- **OneDrive and SharePoint** - OneDrive と SharePoint のファイル／サイトの URL を指定し、ナレッジ ベースに含める。
- **Web search** - Web コンテンツをナレッジ ベースに含めるかどうかを設定し、最大 4 件までのサイト URL をソースとして指定可能。
- **Code interpreter** - 数学問題の解決や Python コードを用いた高度なデータ分析・チャート生成を行う機能を付与。
- **GraphicArt** - DALL·E を使用した画像・動画生成用エージェントを構築。
- **Email knowledge** - 個人または共有メールボックス、オプションで特定フォルダーをナレッジとして利用。
- **People knowledge** - 組織内の人物に関する質問に回答できるエージェントを構築。
- **Teams messages** - Teams のチャネル、チーム、会議、1:1 チャット、グループ チャットを検索できるエージェントを構築。
- **Dataverse knowledge** - Dataverse インスタンスをナレッジ ソースとして追加。

!!! tip "OnDrive and SharePoint"
    URL には SharePoint アイテム (サイト、ドキュメント ライブラリ、フォルダー、ファイル) への完全パスを指定します。SharePoint の **[リンクをコピー]** から取得可能です。ファイルやフォルダーを右クリックし **[詳細]** → **[パス]** のコピー アイコンを選択してください。URL を指定しない場合、ログイン ユーザーがアクセスできる OneDrive と SharePoint のすべてのコンテンツがエージェントに使用されます。

!!! tip "Microsoft Copilot Connector"
    接続を指定しない場合、ログイン ユーザーがアクセスできる Copilot Connectors のすべてのコンテンツが使用されます。

!!! tip "Web search"
    サイトを指定しない場合、エージェントはすべてのサイトを検索できます。指定できるサイトは最大 4 件で、パス セグメントは 2 つまで、クエリ文字列は含めないでください。


## 宣言型エージェントにおける TypeSpec の重要性

### TypeSpec とは

TypeSpec は、API の契約を構造化かつ型安全に設計・記述するために Microsoft が開発した言語です。API が受け取るデータや返すデータ、API とそのアクション同士のつながりを設計図のように表現します。

### なぜエージェントに TypeSpec?

TypeScript がフロントエンド／バックエンド コードに構造を強制するのと同様に、TypeSpec はエージェントとその API サービス（アクションなど）に構造を強制します。Visual Studio Code などのツールと親和性が高い **デザイン ファースト** の開発フローに最適です。

- 明確なコミュニケーション: 複数のマニフェスト ファイルを扱う際の混乱を避け、エージェントの動作を定義する単一のソース オブ トゥルースを提供。
- 一貫性: アクションや機能など、エージェントのすべての要素を同じパターンで設計。
- 自動化に適合: OpenAPI スペックやその他のマニフェストを自動生成し、時間短縮とヒューマン エラー削減。
- 早期バリデーション: 実装前に設計の問題（データ型の不一致やあいまいな定義など）を検出。
- デザイン ファースト: 実装に入る前に構造と契約を考慮することで、長期的な保守性を向上。

## Exercise 1: Microsoft 365 Agents Toolkit で TypeSpec を使ってベース エージェントを構築する


### Step 1: Microsoft 365 Agents Toolkit でベース エージェント プロジェクトをスキャフォールディングする
- VS Code の左メニューから Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択します。アクティビティ バーが開きます。  
- アクティビティ バーで **Create a New Agent/App** を選択すると、利用可能なテンプレートの一覧が表示されます。  
- テンプレート一覧から **Declarative Agent** を選択します。  
- 次に **Start with TypeSpec for Microsoft 365 Copilot** を選択し、TypeSpec でエージェントを定義します。  
- エージェント プロジェクトのスキャフォールディング先フォルダーを選択します。  
- アプリケーション名に "RepairServiceAgent" などを入力し、Enter キーで確定します。新しい VS Code ウィンドウにエージェント プロジェクトがロードされます。

<cc-end-step lab="e01" exercise="1" step="1" />

### Step 2: Microsoft 365 Agents Toolkit にサインインする 

エージェントをアップロードしてテストするには、Microsoft 365 Agents Toolkit にサインインする必要があります。

- プロジェクト ウィンドウで再度 Microsoft 365 Agents Toolkit アイコン <img width="24" alt="m365atk-icon" src="https://github.com/user-attachments/assets/b5a5a093-2344-4276-b7e7-82553ee73199" /> を選択します。アクティビティ バーには Accounts、Environment、Development などのセクションが表示されます。  
- **Accounts** セクションの **Sign in to Microsoft 365** を選択します。ダイアログが開き、Microsoft 365 Developer サンドボックスにサインインまたは作成、あるいは Cancel が選択できます。**Sign in** を選択してください。  
- サインインが完了したらブラウザーを閉じ、プロジェクト ウィンドウに戻ります。

<cc-end-step lab="e01" exercise="1" step="2" />

### Step 3: エージェントを定義する 

Agents Toolkit がスキャフォールディングした宣言型エージェント プロジェクトには、テンプレートとして GitHub API と接続しリポジトリの issues を表示するコードが含まれます。本ラボでは自動車修理サービスと統合し、複数の操作をサポートする独自エージェントを作成します。

プロジェクト フォルダーには `main.tsp` と `actions.tsp` の 2 つの TypeSpec ファイルがあります。  
エージェントのメタデータ、指示、機能は `main.tsp` で定義します。  
`actions.tsp` ではエージェントのアクションを定義します。API サービスへの接続などアクションが必要な場合は、このファイルに定義します。

`main.tsp` を開き、修理サービス用にどこを変更すべきかテンプレートを確認します。 

#### エージェント メタデータと指示を更新する

`main.tsp` にはエージェントの基本構造が含まれます。テンプレートによって提供される内容は以下のとおりです。
- エージェント名と説明 1️⃣
- 基本的な指示 2️⃣
- アクションと機能のプレースホルダー コード (コメントアウト) 3️⃣

![Visual Studio Code showing the initially scaffolded template for a Declarative Agent defined in TypeSpec. There TypeSpec syntax elements to define the agent, its instructions, and some commented out commands to define starter prompts and actions.](https://github.com/user-attachments/assets/42da513c-d814-456f-b60f-a4d9201d1620)

修理シナリオ用にエージェントを定義するため、`@agent` と `@instructions` の定義を以下のコード スニペットに置き換えます。

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

次に会話スターターを追加します。指示のすぐ下にコメントアウトされた会話スターターのコードがありますので、コメントを解除し、タイトルとテキストを以下のように置き換えます。

```typespec
// Uncomment this part to add a conversation starter to the agent.
// This will be shown to the user when the agent is first created.
@conversationStarter(#{
  title: "List repairs",
  text: "List all repairs"
})

```

#### エージェントのアクションを更新する

続いて、`actions.tsp` を開いてエージェントのアクションを定義します。後で `main.tsp` に戻り、アクション参照を含むメタデータを完成させますが、まずアクション自体を定義します。

`actions.tsp` のプレースホルダー コードは GitHub リポジトリの open issues を検索する設計になっています。アクションのメタデータ、API ホスト URL、操作や関数の定義方法を理解するためのサンプルです。これを修理サービス用に置き換えます。 

インポートや using などのモジュール レベルのディレクティブの後、"SERVER_URL" が定義されている箇所までの既存コードを以下のスニペットに置き換えます。この更新でアクション メタデータが導入され、サーバー URL が設定されます。また、名前空間が GitHubAPI から RepairsAPI に変更されている点にも注意してください。

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

次に、テンプレートの `searchIssues` 操作を `listRepairs` に置き換えます。これは修理一覧を取得する操作です。`SERVER_URL` 定義直後から最終閉じ括弧 **手前** までのコード ブロック全体を以下のスニペットに置き換えます。閉じ括弧自体は残してください。

```typespec
  /**
   * List repairs from the API 
   * @param assignedTo The user assigned to a repair item.
   */

  @route("/repairs")
  @get  op listRepairs(@query assignedTo?: string): string;

````

最後に `main.tsp` に戻り、先ほど定義したアクションをエージェントに追加します。会話スターターの後にあるコード ブロック全体を以下のスニペットに差し替えます。

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

### Step 4: デコレーターを理解する (オプション)

このステップはオプションです。TypeSpec ファイルで何を定義しているか気になる場合のみ読み進めてください。すぐにテストしたい場合は Step 5 に進んで構いません。  
`main.tsp` と `actions.tsp` の TypeSpec ファイルには、デコレーター ( @ で始まる)、名前空間、モデルなどが定義されています。

以下の表でファイル内で使用されているデコレーターの一部を説明します。 

| Annotation             | Description                                                                                                                                                     |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| @agent             | エージェントの名前空間 (名前) と説明を定義                                                                                                       |
| @instructions       | エージェントの動作を規定する指示を定義 (8,000 文字以内)                                                                     |
| @conversationStarter | エージェントの会話スターターを定義                                                                                                                     |
| op            | いずれかの操作を定義。*op GraphicArt* や *op CodeInterpreter* のような機能操作、または **op listRepairs** のような API 操作を定義 |
| @server           | API のサーバー エンドポイントと名前を定義                                                                                                              |
| @capabilities      | 関数内で使用すると、確認カードなどの簡易 Adaptive Card を定義                                                                                                  |


<cc-end-step lab="e01" exercise="1" step="4" />

### Step 5: エージェントをテストする

次に Repair Service Agent をテストします。 

- エージェント プロジェクト内で Agents Toolkit のアイコンを選択し、アクティビティ バーを開きます。  
- アクティビティ バーの **LifeCycle** セクションから **Provision** を選択します。これにより、生成されたマニフェスト ファイルとアイコンを含むアプリ パッケージがビルドされ、テナント カタログにサイドロード (自分のみ) されます。 

!!! tip "Knowledge"
    Agents Toolkit は TypeSpec ファイルの定義を検証し、エラーを特定して開発体験を向上させます。

- ブラウザーを開き [https://m365.cloud.microsoft/chat](https://m365.cloud.microsoft/chat){target=_blank} にアクセスして Copilot アプリを開きます。

!!! note "Help"
    Copilot アプリで "Something went wrong" 画面が出た場合はブラウザーを更新してください。 

- Microsoft 365 Copilot インターフェイスの **Agents** リストから **RepairServiceAgent** を選択します。  
- プロビジョニングの進捗を示すトースト メッセージが表示された後、会話スターター **List repairs** を選択し、チャットに送信してエージェントの応答を確認します。

!!! tip "Help"
    クエリを処理するためにエージェント接続を求められた際、この画面は通常一度しか表示されません。ラボをスムーズに進めるため、表示されたら **"Always allow"** を選択してください。  
    ![Screenshot of the agent in action with the response for the prompt 'List all repairs' showing repairs with pictures.](https://github.com/user-attachments/assets/02400c13-0766-4440-999b-93c88ca45dc7)

- 今後の演習で使用するため、ブラウザー セッションは開いたままにしておいてください。 

<cc-end-step lab="e01" exercise="1" step="5" />

## Exercise 2: エージェント機能を拡張する
次は、操作の追加、Adaptive Card を用いた応答、Code Interpreter の組み込みによりエージェントを拡張します。VS Code に戻ってステップごとに進めましょう。

### Step 1: 操作を追加してエージェントを修正する

- `actions.tsp` を開き、`listRepairs` 操作の直後に以下のスニペットを貼り付けて `createRepair`、`updateRepair`、`deleteRepair` の新しい操作を追加します。ここでは `Repair` アイテムのデータ モデルも定義しています。

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

- 次に `main.tsp` に戻り、これら新しい操作をエージェントのアクションに追加します。`op listRepairs is global.RepairsAPI.listRepairs;` の行の後に以下のスニペットを貼り付けます。

```typespec
op createRepair is global.RepairsAPI.createRepair;
op updateRepair is global.RepairsAPI.updateRepair;
op deleteRepair is global.RepairsAPI.deleteRepair;   

```
- さらに、新しい会話スターターを最初の会話スターターの直後に追加します。

```typespec
@conversationStarter(#{
  title: "Create repair",
  text: "Create a new repair titled \"[TO_REPLACE]\" and assign it to me"
})

```

<cc-end-step lab="e01" exercise="2" step="1" />

### Step 2: 関数参照に Adaptive Card を追加する

次に、Adaptive Card を使用して参照カードや応答カードを強化します。`listRepairs` 操作で修理アイテム用のカードを追加します。 

- プロジェクト フォルダー内の **appPackage** フォルダーの下に **cards** フォルダーを作成し、`repair.json` を作成して、以下のコード スニペットをそのまま貼り付けます。 

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

- 続いて `actions.tsp` に戻り、`listRepairs` 操作を探します。操作定義 `@get op listRepairs(@query assignedTo?: string): string;` の **直前** に以下のスニペットを貼り付けてカード定義を追加します。

```typespec

  @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "cards/repair.json"}) 
  
```

このカード応答は、修理アイテムを問い合わせたときやエージェントがアイテムの一覧を参照として返すときに送信されます。  
さらに `createRepair` 操作にも POST 後の作成結果を表示するカード応答を追加します。 

- 以下のスニペットを `@post op createRepair(@body repair: Repair): Repair;` の **直前** に貼り付けます。

```typespec

   @card( #{ dataPath: "$",  title: "$.title",   url: "$.image", file: "cards/repair.json"}) 

```

<cc-end-step lab="e01" exercise="2" step="2" />

## Step 3: Code Interpreter 機能を追加する

宣言型エージェントは *OneDriveAndSharePoint*、*WebSearch*、*CodeInterpreter* など多くの capabilities を追加できます。ここでは Code Interpreter 機能を追加します。

- `main.tsp` を開き、`RepairServiceAgent` 名前空間を探します。

- この名前空間内に以下のスニペットを挿入し、コードを解釈・実行できる新しい操作を定義します。

```typespec
  op codeInterpreter is AgentCapabilities.CodeInterpreter;
```

!!! tip
    上記 *CodeInterpreter* 操作は、エージェントのアクションを定義する `RepairServiceActions` 名前空間ではなく、外側の `RepairServiceAgent` 名前空間内に追加してください。  

機能が追加されたため、指示文も更新して反映させます。

- 同じ `main.tsp` ファイルで instructions 定義を以下のように更新します。

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

### Step 4: エージェントを再プロビジョニングしてテストする

修理アナリスト機能も備えた最新のエージェントをテストします。 

- Agents Toolkit アイコンを選択してアクティビティ バーを開きます。  
- アクティビティ バーの **LifeCycle** で **Provision** を選択し、最新のエージェントをパッケージ化・アップロードします。  
- 先ほどのブラウザー セッションに戻り、ページを更新します。  
- **Agents** リストから **RepairServiceAgent** を選択します。  
- 会話スターター **Create repair** から始め、タイトルを変更して送信します。例:

    `Create a new repair titled "rear camera issue" and assign it to me.`

- 表示される確認ダイアログには、追加した指示により送信内容以上のメタデータが含まれています。 

![The confirmation message provided by Microsoft 365 Copilot when sending a POST request to the target API. There are buttons to 'Confirm' or to 'Cancel' sending the request to the API.](https://github.com/user-attachments/assets/56629979-b1e5-4a03-a413-0bb8bb438f00)
 
 - **Confirm** してアイテムを追加します。

 エージェントは作成したアイテムをリッチな Adaptive Card で応答します。

 ![The response after creating a new item, with the information about the item to repair rendered through an adaptive card with a button to show the associated image.](https://github.com/user-attachments/assets/6da0a38f-5de3-485a-999e-c695389853f8)

 - 参照カードの動作を再確認します。以下のプロンプトを送信します。

     `List all my repairs.`

エージェントは修理一覧を返し、各アイテムを Adaptive Card で表示します。

![The response for the list of repairs with a reference button for each item, showing an adaptive card when hoovering on it.](https://github.com/user-attachments/assets/880ad3aa-2ed3-4051-a68b-d988527d9d53)

- 次に、追加された分析機能をテストします。右上の **New chat** ボタンで新しいチャットを開きます。  
- 下記プロンプトをコピーしてメッセージ ボックスに貼り付け、Enter キーで送信します。

    `Classify repair items based on title into three distinct categories: Routine Maintenance, Critical, and Low Priority. Then, generate a pie chart displaying the percentage representation of each category. Use unique colours for each group and incorporate tooltips to show the precise values for each segment.`

以下のような応答が得られるはずです (内容は変動する場合があります)。 

![The response when using the Code Interpreter capability. There are a detailed text and a chart showing the percentage representation of each category of repair.](https://github.com/user-attachments/assets/ea1a5b21-bc57-4ed8-a8a4-c187caff2c64)

<cc-end-step lab="e01" exercise="2" step="3" />

## Exercise 3: エージェントの診断とデバッグ

チャットでデベロッパー モードを有効にすると、エージェントがタスクをどの程度理解しているか、サービス呼び出しが正しく行われているか、調整が必要な箇所やパフォーマンスの問題を特定し、対話を追跡・分析できます。

### Step 1: チャットでのエージェント デバッグ

- 以下の行をエージェントとのチャットにコピー＆ペーストし、デバッグ モードを有効にします。

    ```
    -developer on
    ```

- 成功すると `Successfully enabled developer mode.` と応答が返ります。

- テストのため、以下のようなプロンプトを送信します。

   `Find out what Karin is working on.`

- 修理サービスの情報が返るとともに、**Agent debug info** カードが表示されます。  
- **Agent debug info** カードを展開すると以下が確認できます。  
    - エージェント情報 1️⃣  
    - エージェントの capabilities 2️⃣  
    - 選択されたアクションと関数 3️⃣  
    - 実行されたアクションのリクエスト、レイテンシ、レスポンス データなどの詳細 4️⃣

![The developer debug information card in Microsoft 365 Copilot when analysing the request for an action. There are sections about agent info, capabilities, actions, connected agents, execution, etc.](https://github.com/user-attachments/assets/b135f3b0-50f1-47a1-b608-a5a1b27b806e)

- **Executed Actions** を展開すると、リクエスト URL、渡されたパラメーター、リクエスト ヘッダー、レスポンス、レイテンシなどが確認できます。 

<cc-end-step lab="e01" exercise="3" step="1" />

---8<--- "ja/e-congratulations.md"

素晴らしい！初めてのエージェント構築が完了しました 🎉 

 続いて **Next** を選択し、API の作成・構築・統合に進みましょう。
 <cc-next url="../02-build-the-api" label="Next" />

 基本をさらに学びたい場合は、Geolocator ゲームを構築する **Create a game** を選択してください。
 <cc-next url="../01a-geolocator" label="Create a game" />

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/01-typespec-declarative-agent--ja" />