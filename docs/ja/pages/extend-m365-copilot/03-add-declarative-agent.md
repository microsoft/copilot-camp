---
search:
  exclude: true
---
# ラボ E3 - 宣言型エージェントと API プラグインの追加

このラボでは、前のラボで作成した API プラグインと特定の SharePoint ファイルを基盤とする宣言型エージェントを追加します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/XO2aG3YPbPc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
              <div class="note-box">
            📘 <strong>注:</strong> このラボは前回のラボ E2 を基盤にしています。ラボ E2〜E6 では同じフォルダーで作業を続行できますが、参照用に完成版のフォルダーも用意されています。  
    このラボの完成版は <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END" target="_blank">/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END</a> フォルダーにあります。
        </div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## 演習 1: サンプル ドキュメントのアップロード

このステップでは、宣言型エージェントがユーザー プロンプトに応答するために使用するサンプル ドキュメントをアップロードします。これらには、Statement of Work などのコンサルティング ドキュメントと、コンサルタントの稼働時間を示す簡単なスプレッドシートが含まれます。

### 手順 1: SharePoint サイトを作成する

[Microsoft 365 app](https://www.office.com/){target=_blank} などでワッフル メニュー 1️⃣ をクリックし、[SharePoint] 2️⃣ を選択します。

![ワッフル メニューを展開し、SharePoint ワークロードを選択した Microsoft 365 の UI。](../../assets/images/extend-m365-copilot-05/upload-docs-01.png)

続いて [Create Site] 1️⃣ をクリックし、[Team site] 2️⃣ を選択します。

![新しい SharePoint Online サイトを作成する UI。'Team Site' テンプレートが提案されている。](../../assets/images/extend-m365-copilot-05/upload-docs-02.png)

Standard チーム サイト テンプレートを選択するとプレビューが表示されます。[Use Template] をクリックして続行します。

![対象サイトに 'Standard' サイト テンプレートを選択する UI。](../../assets/images/extend-m365-copilot-05/upload-docs-03.png)

サイト名に「Trey Research legal documents」などを入力 1️⃣ し、[Next] 2️⃣ をクリックします。

![対象サイトに名前、説明などの詳細を入力する UI。](../../assets/images/extend-m365-copilot-05/upload-docs-05.png)

プライバシー設定と言語を選択し、[Create Site] をクリックします。

![対象サイトのプライバシー設定と言語を選択する UI。](../../assets/images/extend-m365-copilot-05/upload-docs-06.png)

数秒後、新しい SharePoint サイトが表示されます。

<cc-end-step lab="e3" exercise="1" step="1" />

### 手順 2: サンプル ドキュメントをアップロードする

Documents Web パーツで [See all] を選択してドキュメント ライブラリー ページを表示します。

![サイトのホーム ページにある Documents Web パーツと 'See all' リンク。](../../assets/images/extend-m365-copilot-05/upload-docs-07.png)

次に、ツールバーの [Upload] 1️⃣ をクリックし、[Files] 2️⃣ を選択します。

![ドキュメント ライブラリーのコマンド バーで 'Upload' メニューを展開し 'Files' オプションを選択している。](../../assets/images/extend-m365-copilot-05/upload-docs-08.png)

作業フォルダーに移動すると **sampleDocs** ディレクトリがあります。すべてのサンプル ドキュメントを選択 1️⃣ して [Open] 2️⃣ をクリックします。

サイト URL (例: `https://<your-tenant>.sharepoint.com/sites/TreyResearchlegaldocuments`) をメモしておいてください。次の演習で使用します。

![アップロードするファイルを選択するファイル システム ダイアログ。](../../assets/images/extend-m365-copilot-05/upload-docs-09.png)

<cc-end-step lab="e3" exercise="1" step="2" />

## 演習 2: 宣言型エージェントの作成

### 手順 1: 宣言型エージェント JSON をプロジェクトに追加する

**appPackage** フォルダー内に **trey-declarative-agent.json** という新しいファイルを作成します。次の JSON をコピーして保存してください。

```json
{
    "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.3/schema.json",
    "version": "v1.3",
    "name": "Trey Genie Local",
    "description": "You are a handy assistant for consultants at Trey Research, a boutique consultancy specializing in software development and clinical trials. ",
    "instructions": "You are consulting agent. Greet users professionally and introduce yourself as the Trey Genie. Offer assistance with their consulting projects and hours. Remind users of the Trey motto, 'Always be Billing!'. Your primary role is to support consultants by helping them manage their projects and hours. Using the TreyResearch action, you can: You can assist users in retrieving consultant profiles or project details for administrative purposes but do not participate in decisions related to hiring, performance evaluation, or assignments. You can assist users to find consultants data based on their names, project assignments, skills, roles, and certifications. You can assist users to retrieve project details based on the project or client name. You can assist users to charge hours to a project. You can assist users to add a consultant to a project. If a user inquires about the hours they have billed, charged, or worked on a project, rephrase the request to ask about the hours they have delivered. Additionally, you may provide general consulting advice. If there is any confusion, encourage users to consult their Managing Consultant. Avoid providing legal advice.",
    "conversation_starters": [
        {
            "title": "Find consultants",
            "text": "Find consultants with TypeScript skills"
        },
        {
            "title": "My Projects",
            "text": "What projects am I assigned to?"
        },
        {
            "title": "My Hours",
            "text": "How many hours have I delivered on projects this month?"
        }
    ],
    "capabilities": [
        {
            "name": "OneDriveAndSharePoint",
            "items_by_url": [
                {
                    "url": "${{SHAREPOINT_DOCS_URL}}"
                }
            ]
        }
    ],
    "actions": [
        {
            "id": "treyresearch",
            "file": "trey-plugin.json"
        }
    ]
}
```

このファイルには宣言型エージェントの名前、説明、instructions が含まれています。instructions では「Trey のモットー『Always be Billing!』を常にユーザーに思い出させる」と指示しているため、次の演習で Copilot にプロンプトを送るとこれが表示されるはずです。

<cc-end-step lab="e3" exercise="2" step="1" />

### 手順 2: SharePoint サイトの URL を宣言型エージェントに追加する

Capabilities セクションには SharePoint のファイル コンテナーがあります。Microsoft 365 Copilot は SharePoint や OneDrive のすべてのドキュメントを参照できますが、この宣言型エージェントは演習 1 で作成した Trey Research Legal Documents サイト内のファイルのみを参照します。

```json
"capabilities": [
    {
        "name": "OneDriveAndSharePoint",
        "items_by_url": [
            {
                    "url": "${{SHAREPOINT_DOCS_URL}}"
            }
        ]
    }
],
```

SharePoint URL は環境変数 `SHAREPOINT_DOCS_URL` なので **env** フォルダーの **.env.local** ファイルに追加します。ファイルの末尾に次の行を追加し、ご自分の SharePoint URL に置き換えてください。

```text
SHAREPOINT_DOCS_URL=https://mytenant.sharepoint.com/sites/TreyResearchLegaldocuments
```

<cc-end-step lab="e3" exercise="2" step="2" />

### 手順 3: API プラグイン ファイルを確認する

**trey-declarative-agent.json** には `actions` セクションがあり、宣言型エージェントが Trey Research API にアクセスすることを示しています。

```json
"actions": [
    {
        "id": "treyresearch",
        "file": "trey-plugin.json"
    }
]
```

ここでは **trey-plugin.json** と、もう 1 つのファイルが Copilot に API をどのように説明しているかを見ていきます。

これら 2 つのファイルは Copilot に API を説明するために使用します。ラボ 2 でダウンロードしたプロジェクトにすでに含まれているので、今確認しましょう。

 * [**appPackage/trey-definition.json**](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END/appPackage/trey-definition.json){target=_blank} - 業界標準の REST API 仕様である [OpenAPI Specification (OAS)](https://swagger.io/specification/){target=_blank}（Swagger）ファイル
 * [**appPackage/trey-plugin.json**](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END/appPackage/trey-plugin.json){target=_blank} - OAS ファイルでは説明できない Copilot 固有の詳細を含むファイル

次のラボでさらに機能を追加する際、これらのファイルについて詳しく学びます。

**appPackage/trey-definition.json** にはアプリケーションの全体的な記述があります。ここにはサーバー URL が含まれています。Agents Toolkit は [developer tunnel](https://learn.microsoft.com/azure/developer/dev-tunnels/){target=_blank} を作成し、ローカル API をインターネットに公開してトークン `"${{OPENAPI_SERVER_URL}}` を公開 URL に置き換えます。その後、API のリソース パス、HTTP メソッド、パラメーターを詳しく記述します。Copilot が API を理解できるよう、詳細な説明が重要です。

```json
{
  "openapi": "3.0.1",
  "info": {
      "version": "1.0.0",
      "title": "Trey Research API",
      "description": "API to streamline consultant assignment and project management."
  },
  "servers": [
      {
          "url": "${{OPENAPI_SERVER_URL}}/api/",
          "description": "Production server"
      }
  ],
  "paths": {
      "/consultants/": {
          "get": {
              "operationId": "getConsultants",
              "summary": "Get consultants working at Trey Research based on consultant name, project name, certifications, skills, roles and hours available",
              "description": "Returns detailed information about consultants identified from filters like name of the consultant, name of project, certifications, skills, roles and hours available. Multiple filters can be used in combination to refine the list of consultants returned",
              "parameters": [
                  {
                      "name": "consultantName",
                      "in": "query",
                      "description": "Name of the consultant to retrieve",
                      "required": false,
                      "schema": {
                          "type": "string"
                      }
                  },
      ...
```

**appPackage/trey-plugin.json** には Copilot 固有の詳細が含まれています。API コールを Copilot が利用できる _functions_ に分割しています。たとえば、`/consultants` のすべての GET 要求はさまざまなパラメーターでコンサルタントを検索し、`getConsultants` という function にまとめられています。

```json
  "functions": [
    {
      "name": "getConsultants",
      "description": "Returns detailed information about consultants identified from filters like name of the consultant, name of project, certifications, skills, roles and hours available. Multiple filters can be used in combination to refine the list of consultants returned",
      "capabilities": {
        "response_semantics": {
          "data_path": "$.results",
          "properties": {
            "title": "$.name",
            "subtitle": "$.id",
            "url": "$.consultantPhotoUrl"
          }
        }
      }
    },
```

下にスクロールするとランタイム設定があります。

```json
"runtimes": [
  {
    "type": "OpenApi",
    "auth": {
      "type": "None"
    },
    "spec": {
      "url": "trey-definition.json"
    },
    "run_for_functions": [
      "getConsultants",
      "getUserInformation",
      "postBillhours"
    ]
  }
],
```

ここでは **trey-definition.json** への参照と、利用可能な function の一覧が含まれています。

<cc-end-step lab="e3" exercise="2" step="3" />

### 手順 4: 宣言型エージェントをアプリ マニフェストに追加する

**appPackage** ディレクトリ内の **manifest.json** を開き、`staticTabs` オブジェクトの直前に次の `copilotAgents` オブジェクトを追加し、先ほど作成した宣言型エージェント JSON ファイルを参照させます。

```json
  "copilotAgents": {
    "declarativeAgents": [
      {
        "id": "treygenie",
        "file": "trey-declarative-agent.json"
      }
    ]
  }, 
```

必ず保存してください。

<cc-end-step lab="e3" exercise="2" step="4" />

### 手順 5: ダミー機能をアプリ マニフェストから削除する

ラボ E2 で実行した初期ソリューションには宣言型エージェントがまだなかったため、機能がないとマニフェストをインストールできませんでした。そのため、Copilot Developer Camp のホーム ページを表示する静的タブという「ダミー」機能を追加していました。Teams、Outlook、Microsoft 365 app ( [https://office.com](https://office.com){target=_blank} ) 内のタブでサイトを閲覧できるようにするためです。

以前 [Teams App Camp](https://aka.ms/app-camp){target=_blank} を体験された方はご存じかもしれません。そうでない場合も気にせず、もう不要なので **manifest.json** から次の行を削除してください。

```json
"staticTabs": [
  {
    "entityId": "index",
    "name": "Copilot Camp",
    "contentUrl": "https://microsoft.github.io/copilot-camp/",
    "websiteUrl": "https://microsoft.github.io/copilot-camp/",
    "scopes": [
      "personal"
    ]
  }
],
"validDomains": [
  "microsoft.github.io"
],
```

<cc-end-step lab="e3" exercise="2" step="5" />

## 演習 3: 宣言型エージェントの実行とテスト

### 手順 1: 新しいプロジェクトを実行する

まだデバッガーが起動している場合は停止し、完全な再デプロイを行います。

その後、▶ ボタンをクリックするか F5 キーを押してデバッガーを起動し、Copilot のユーザー インターフェイスに戻ります。

<cc-end-step lab="e3" exercise="3" step="1" />

### 手順 2: 宣言型エージェントをテストする

Copilot チャットを開き、右側のフライアウト 1️⃣ で過去のチャットと宣言型エージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot で Trey Genie エージェントを利用している画面。右側にカスタム宣言型エージェントが表示され、中央に会話スターターとプロンプト入力欄がある。](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

「Please list my projects along with details from the Statement of Work doc」などのプロンプトを試してください。  
API プラグインから取得したプロジェクト一覧が Statement of Work の詳細とともに表示されるはずです 1️⃣。Copilot が Trey Research のモットー 2️⃣ とドキュメントへの参照 3️⃣ を含めていることに注目してください。参照をクリックするとドキュメントを確認できます。

![ユーザーが取り組んでいるプロジェクト情報、SharePoint サイトの参照ドキュメント、モットー 'Always be Billing!' を含む宣言型エージェントの出力。](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-02.png)

!!! note
    SharePoint ドキュメントが参照されない場合、ファイルへのアクセスに問題がある可能性があります。検索インデックスがサイトを処理する時間があったか、ユーザーにサイトの権限があるか、管理者がサイトを検索対象から除外していないかを確認してください。Copilot の外で次のような検索を試してみてください。  
    `woodgrove path:"https://<tenant>.sharepoint.com/sites/<sitename>"`  
    <tenant> と <sitename> を capability で指定したものに置き換えてください。Woodgrove ドキュメントが 3 件表示されるはずです。表示されない場合は検索をトラブルシュートする必要があります。Copilot も同様にドキュメントを見つけられません。

<cc-end-step lab="e3" exercise="3" step="2" />

---8<--- "ja/e-congratulations.md"

宣言型エージェントを API プラグインに追加しました。次は、API とエージェント用プラグインをさらに拡張しましょう。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/03-add-declarative-copilot" />