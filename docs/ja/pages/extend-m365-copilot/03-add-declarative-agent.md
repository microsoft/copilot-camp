---
search:
  exclude: true
---
# ラボ E3 - 宣言型エージェントと API プラグインの追加

このラボでは、前のラボで作成した API プラグインと、特定の SharePoint ファイルに基づいて動作する宣言型エージェントを追加します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/XO2aG3YPbPc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
              <div class="note-box">
            📘 <strong>Note:</strong> このラボは前のラボ、Lab E2 を基盤としています。ラボ E2〜E6 までは同じフォルダーで作業を続けられますが、参照用にソリューション フォルダーも用意されています。  
    このラボの完成版ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END" target="_blank">/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END</a> フォルダーにあります。
        </div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## 演習 1: サンプル ドキュメントのアップロード

このステップでは、宣言型エージェントがユーザー プロンプトに応答するために使用するサンプル ドキュメントをアップロードします。これには、Statement of Work などのコンサルティング ドキュメントや、コンサルタントとしての勤務時間を記載した簡単なスプレッドシートが含まれます。

### 手順 1: SharePoint サイトを作成する
[https://m365.cloud.microsoft/apps/](https://m365.cloud.microsoft/apps/) にアクセスし、「Apps」内から「SharePoint」アプリを探します。

![Waffle メニューが展開され、SharePoint ワークロードが強調表示された Microsoft 365 の UI](../assets/images/extend-m365-copilot-05/upload-docs-01.png)

続いて「Create Site」1️⃣ をクリックし、「Team site」2️⃣ を選択します。

![新しい SharePoint Online サイトを作成する UI。'Team Site' テンプレートが提案されている](../assets/images/extend-m365-copilot-05/upload-docs-02.png)

Standard team site テンプレートを選択すると、サイトのプレビューが表示されます。「Use Template」をクリックして続行します。

![ターゲット サイト用に 'Standard' サイト テンプレートを選択する UI](../assets/images/extend-m365-copilot-05/upload-docs-03.png)

サイト名に「Trey Research legal documents」などを入力 1️⃣ し、「Next」をクリック 2️⃣ します。

![ターゲット サイトの名前、説明などを入力する UI](../assets/images/extend-m365-copilot-05/upload-docs-05.png)

プライバシー設定と言語を選択し、「Create Site」をクリックします。

![プライバシー設定と言語を選択する UI](../assets/images/extend-m365-copilot-05/upload-docs-06.png)

数瞬後、新しい SharePoint サイトが表示されます。 

<cc-end-step lab="e3" exercise="1" step="1" />

### 手順 2: サンプル ドキュメントをアップロードする

Documents Web パーツで「See all」を選択し、ドキュメント ライブラリ ページを表示します。

![サイトのホーム ページ。Documents Web パーツと 'See all' リンクが強調表示されている](../assets/images/extend-m365-copilot-05/upload-docs-07.png)

次に「Upload」1️⃣ をクリックし、「Files」2️⃣ を選択します。

![ドキュメント ライブラリのコマンド バー。'Upload' メニューが展開され、'Files' オプションが選択されている](../assets/images/extend-m365-copilot-05/upload-docs-08.png)

作業フォルダーに移動すると、**sampleDocs** ディレクトリがあります。すべてのサンプル ドキュメントを選択 1️⃣ し、「Open」をクリック 2️⃣ します。

サイト URL（例: `https://<your-tenant>.sharepoint.com/sites/TreyResearchlegaldocuments`）をメモしておいてください。次の演習で必要になります。

![アップロードするファイルを選択するファイル システム ダイアログ](../assets/images/extend-m365-copilot-05/upload-docs-09.png)

<cc-end-step lab="e3" exercise="1" step="2" />

## 演習 2: 宣言型エージェントを作成する

### 手順 1: 宣言型エージェント JSON をプロジェクトに追加する

**appPackage** フォルダーに **trey-declarative-agent.json** という新しいファイルを作成します。以下の JSON をコピーして保存してください。

```json
{
    "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.4/schema.json",
    "version": "v1.4",
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

このファイルにはエージェントの name、description、instructions が含まれています。instructions の中で Copilot に「Trey のモットー 'Always be Billing!' を常にユーザーに思い出させる」よう指示していることに注目してください。次の演習で Copilot にプロンプトを送った際に確認できます。

<cc-end-step lab="e3" exercise="2" step="1" />

### 手順 2: SharePoint サイトの URL を宣言型エージェントに追加する

"Capabilities" セクションには SharePoint ファイル コンテナーが定義されています。Microsoft 365 Copilot は SharePoint や OneDrive 内のドキュメントを参照できますが、この宣言型エージェントは Exercise 1 で作成した Trey Research Legal Documents サイトのファイルのみをアクセスします。 

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

SharePoint URL は環境変数 `SHAREPOINT_DOCS_URL` なので、**env** フォルダーの **.env.local** ファイルに追加します。ファイルの末尾に以下のように 1 行追加し、SharePoint URL を設定してください。

```text
SHAREPOINT_DOCS_URL=https://mytenant.sharepoint.com/sites/TreyResearchLegaldocuments
```

<cc-end-step lab="e3" exercise="2" step="2" />

### 手順 3: API プラグイン ファイルを確認する

**trey-declarative-agent.json** 内の "actions" セクションには、宣言型エージェントが Trey Research API にアクセスするよう指定されています。

```json
"actions": [
    {
        "id": "treyresearch",
        "file": "trey-plugin.json"
    }
]
```

ここでは **trey-plugin.json** と、もう 1 つのファイルがどのように Copilot へ API を説明しているかを確認します。

これら 2 つのファイルは API を Copilot に説明するために使用されます。Lab 2 でダウンロードしたプロジェクトに既に含まれているので、今確認してみましょう。

 * [**appPackage/trey-definition.json**](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END/appPackage/trey-definition.json){target=_blank} - 業界標準の REST API 仕様である [OpenAPI Specification (OAS)](https://swagger.io/specification/){target=_blank} (Swagger) ファイル
 * [**appPackage/trey-plugin.json**](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END/appPackage/trey-plugin.json){target=_blank} - OAS ファイルで記述されない Copilot 固有の詳細を含むファイル

このステップではこれらのファイルを眺めてみてください。今後のラボでさらに機能を追加しながら詳しく学びます。

**appPackage/trey-definition.json** にはアプリケーションの一般的な説明があります。ここにはサーバー URL が含まれます。Agents Toolkit は [developer tunnel](https://learn.microsoft.com/azure/developer/dev-tunnels/){target=_blank} を作成し、ローカル API をインターネットに公開します。その際に `"${{OPENAPI_SERVER_URL}}` トークンを公開 URL に置き換えます。その後、API の各リソース パス、HTTP 動詞、パラメーターが詳細に説明されています。詳細な description は Copilot が API の使い方を理解するために重要です。

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

**appPackage/trey-plugin.json** には Copilot 固有の詳細があります。ここでは、Copilot が特定のユース ケースで呼び出せるように API 呼び出しを _functions_ に分割しています。たとえば `/consultants` へのすべての GET 要求は、さまざまなパラメーター オプションでコンサルタントを検索し、`getConsultants` という function にまとめられています。

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

下の方に runtime 設定があります。 

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

ここでは **trey-definition.json** への参照と、利用可能な function の列挙が記載されています。

<cc-end-step lab="e3" exercise="2" step="3" />

### 手順 4: 宣言型エージェントをアプリ マニフェストに追加する

**appPackage** ディレクトリの **manifest.json** を開きます。`staticTabs` オブジェクトの直前に、以下のように `copilotAgents` オブジェクトとその中の `declarativeAgents` オブジェクトを追加し、前のステップで作成した宣言型エージェント JSON ファイルを参照させます。

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

保存を忘れないでください。 

<cc-end-step lab="e3" exercise="2" step="4" />

### 手順 5: ダミー機能をアプリ マニフェストから削除する

Lab E2 の時点では宣言型エージェントがまだなかったため、マニフェストに機能がないとインストールできませんでした。そのため「dummy」機能として、Copilot Developer Camp のホーム ページを表示する static tab を追加していました。これは Teams、Outlook、Microsoft 365 app ([https://office.com](https://office.com){target=_blank}) のタブとしてサイトを閲覧できるようにするためでした。

もし [Teams App Camp](https://aka.ms/app-camp){target=_blank} を体験済みならご存じかもしれませんが、今回は不要になったので **manifest.json** から以下の行を削除してください。

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

## 演習 3: 宣言型エージェントを実行してテストする

### 手順 1: 新しいプロジェクトを実行する

まだデバッガーが動いている場合は停止し、完全に再デプロイします。

その後、デバッガーを矢印クリックまたは F5 で起動し、Copilot UI に戻ります。現在ブラウザーで Teams を使用してテストしているかもしれませんが、office.com/chat でもエージェントをテストできます。

???+ info "エージェントが見つからない"
    ブラウザーを更新し、下図のようにナビゲーションを展開・折りたたみしてください。F5 の直後にエージェントが表示されない場合があります。  
    ![ナビゲーションの展開と折りたたみ](../assets/images/extend-m365-copilot-05/expand-nav.png)

<cc-end-step lab="e3" exercise="3" step="1" />

### 手順 2: 宣言型エージェントをテストする

Copilot チャットを開き、右側のフライアウト 1️⃣ を開いて以前のチャットと宣言型エージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot で Trey Genie エージェントが動作している様子。右側にはカスタム宣言型エージェントが表示され、メインには会話スターターとプロンプト入力欄がある](../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

「Please list my projects along with details from the Statement of Work doc」のようなプロンプトを試してください。  
API プラグインから取得したプロジェクト一覧が、各プロジェクトの Statement of Work の詳細で強化されて表示されるはずです 1️⃣。Copilot が Trey Research のモットーを含み 2️⃣、ドキュメントへの参照を示す 3️⃣ に注目してください。参照をクリックするとドキュメントを確認できます。

![エージェントの出力。ユーザーが関わるプロジェクト情報、SharePoint 参照ドキュメント、モットー 'Always be Billing!' を含む](../assets/images/extend-m365-copilot-05/run-declarative-copilot-02.png)

!!! note
    SharePoint ドキュメントが参照されない場合、ファイルへのアクセスに問題がある可能性があります。検索がサイトをインデックスする時間が必要ではないか、エンド ユーザーにサイトの権限があるか、管理者がサイトを検索対象外にしていないかなどを確認してください。Copilot 以外の検索で次のように試してみてください。  
    `woodgrove path:"https://<tenant>.sharepoint.com/sites/<sitename>"`  
    tenant とサイト名を capabilities に設定したものに置き換えてください。Woodgrove のドキュメントが 3 つ見つかるはずです。見つからない場合は検索をトラブルシュートしてください。Copilot も検索できません。

API がどのように呼び出されているかも確認してみましょう。「List my information」1️⃣ と送信し、エージェントに Trey Research API の api/me エンドポイントから詳細を取得させます 2️⃣。

下図のように、ログイン ユーザー（Avery Howard。認証はまだ実装しておらず、後のラボで扱います）の情報とプロジェクトが返されます。  
![List my information プロンプトとレスポンス](../assets/images/extend-m365-copilot-05/my-info.png)

VS Code プロジェクトの「Terminal」を見ると、エージェントが API を呼び出したログも確認できます。

![api/me が呼び出された Terminal](../assets/images/extend-m365-copilot-05/api-called.png)

<cc-end-step lab="e3" exercise="3" step="2" />


---8<--- "ja/e-congratulations.md"

宣言型エージェントを API プラグインに追加できました。次は API とプラグインを強化していきましょう。 

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/03-add-declarative-copilot--ja" />