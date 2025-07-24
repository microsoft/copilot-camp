---
search:
  exclude: true
---
# ラボ E3 - 宣言型エージェントと API プラグインの追加

このラボでは、前回のラボで作成した API プラグインおよび特定の SharePoint ファイルに基づいた宣言型エージェントを追加します

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/XO2aG3YPbPc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
              <div class="note-box">
            📘 <strong>Note:</strong> このラボは前回のラボ E2 に基づいて構築されています。ラボ E2～E6 に同じフォルダーで作業を続けることができますが、参照用にソリューションフォルダーが提供されています。
    このラボの完成済みソリューションは、<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END" target="_blank">/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END</a> フォルダーにあります。
        </div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## 演習 1：サンプル文書のアップロード

この手順では、宣言型エージェントが ユーザー のプロンプトに応答するために使用するサンプル文書をアップロードします。これには、ステートメント・オブ・ワークなどのコンサルティング文書や、コンサルタントとしての稼働時間が記載されたシンプルなスプレッドシートが含まれます。

### ステップ 1：SharePoint サイトの作成

Microsoft 365 アプリ内、または Microsoft 365 内の他の場所から、"waffle" メニュー 1️⃣ をクリックし、"SharePoint" 2️⃣ を選択します。

![The UI of Microsoft 365 with the waffle menu expanded and the SharePoint workload highlighted.](../../assets/images/extend-m365-copilot-05/upload-docs-01.png)

その後、"Create Site" 1️⃣ をクリックし、"Team site" 2️⃣ を選択します。

![The UI to create a new SharePoint Online site, with 'Team Site' template suggested.](../../assets/images/extend-m365-copilot-05/upload-docs-02.png)

Standard チームサイトのテンプレートを選択します。サイトのプレビューが表示されるので、"Use Template" をクリックして続行します。

![The UI to select the 'Standard' site template for the target site.](../../assets/images/extend-m365-copilot-05/upload-docs-03.png)

サイトに "Trey Research legal documents" などの名前を付け 1️⃣、"Next" 2️⃣ をクリックします。

![The UI to provide name, description, and other details for the target site to create.](../../assets/images/extend-m365-copilot-05/upload-docs-05.png)

次に、プライバシー設定と言語を選択し、"Create Site" をクリックします。

![The UI to select the privacy settings and the language for the target site.](../../assets/images/extend-m365-copilot-05/upload-docs-06.png)

数秒後、新しい SharePoint サイトが表示されます。 

<cc-end-step lab="e3" exercise="1" step="1" />

### ステップ 2：サンプル文書のアップロード

Documents ウェブパート内で、"See all" を選択してドキュメントライブラリページを表示します。

![The home page of the site with the Documents web part and the 'See all' link highlighted.](../../assets/images/extend-m365-copilot-05/upload-docs-07.png)

次に、ツールバーの "Upload" 1️⃣ ボタンをクリックし、"Files" 2️⃣ を選択します。

![The command bar of the document library with the 'Upload' menu expanded and the 'Files' option selected.](../../assets/images/extend-m365-copilot-05/upload-docs-08.png)

作業フォルダーに移動すると、**sampleDocs** というディレクトリが存在します。すべてのサンプル文書をハイライト 1️⃣ し、"Open" 2️⃣ をクリックします。

次の演習で必要になるため、"https://<your-tenant>.sharepoint.com/sites/TreyResearchlegaldocuments" のようなサイト URL を控えておいてください。

![The file system browsing dialog to select the files to upload.](../../assets/images/extend-m365-copilot-05/upload-docs-09.png)

<cc-end-step lab="e3" exercise="1" step="2" />

## 演習 2：宣言型エージェントの作成

### ステップ 1：プロジェクトへの宣言型エージェント JSON の追加

**appPackage** フォルダー内に **trey-declarative-agent.json** という新しいファイルを作成し、以下の JSON をコピーして保存します。

~~~json
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
~~~

このファイルには、宣言型エージェントの名前、説明、及び instructions が含まれていることに注目してください。instructions の一部として、 Copilot に「常に Trey のモットー 'Always be Billing!' をユーザーにリマインドする」よう指示している点にも注目してください。次の演習で Copilot にプロンプトを送信すると、この点を確認できるはずです。

<cc-end-step lab="e3" exercise="2" step="1" />

### ステップ 2：宣言型エージェントに SharePoint サイトの URL を追加

"Capabilities" の下に SharePoint ファイルコンテナがあることに気付きます。Microsoft 365 Copilot は SharePoint や OneDrive の任意の文書を参照する可能性がありますが、この宣言型エージェントは演習 1 で作成した Trey Research Legal Documents サイト内のファイルのみにアクセスします。

~~~json
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
~~~

なお、SharePoint URL は実際には環境変数  SHERAPOINT_DOCS_URL であるため、**env** フォルダー内の **.env.local** ファイルに追加する必要があります。自分の SharePoint URL を使用して、ファイルの末尾に以下を追加してください:

~~~text
SHAREPOINT_DOCS_URL=https://mytenant.sharepoint.com/sites/TreyResearchLegaldocuments
~~~

<cc-end-step lab="e3" exercise="2" step="2" />

### ステップ 3：API プラグインファイルの確認

**trey-declarative-agent.json** ファイル内には、宣言型エージェントが Trey Research API にアクセスするよう指示する "actions" セクションが含まれています。

~~~json
"actions": [
    {
        "id": "treyresearch",
        "file": "trey-plugin.json"
    }
]
~~~

このステップでは、**trey-plugin.json** とそれに続く別のファイルが、Copilot が REST コールを実行できるように API をどのように説明しているかを確認します。

これらの 2 つのファイルは、Copilot に API を説明するために使用されます。ラボ 2 でダウンロードしたプロジェクトには既に含まれているため、今すぐ確認することができます:

 * [**appPackage/trey-definition.json**](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END/appPackage/trey-definition.json){target=_blank} - これは [OpenAPI Specification (OAS)](https://swagger.io/specification/){target=_blank} または "Swagger" ファイルで、REST API を説明するための業界標準のフォーマットです。
 * [**appPackage/trey-plugin.json**](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END/appPackage/trey-plugin.json){target=_blank} - このファイルには、OAS ファイルで記述されていない、Copilot 固有の詳細情報が含まれています。

このステップでは、これらのファイルをしばらく確認してください。これ以降のラボで、ソリューションにさらに機能を追加するにつれて、より詳しく知ることになるでしょう。

**appPackage/trey-definition.json** では、アプリケーションの一般的な説明が見つかります。これにはサーバー URL が含まれており、Agents Toolkit はインターネット上にローカル API を公開するために [developer tunnel](https://learn.microsoft.com/azure/developer/dev-tunnels/){target=_blank} を作成し、トークン `"${{OPENAPI_SERVER_URL}}"` を公開 URL に置き換えます。その後、API 内のすべてのリソースパス、動詞、パラメーターを説明します。詳細な説明に注目してください。これは、Copilot が API の使用方法を理解するために重要です.

~~~json
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
~~~

**appPackage/trey-plugin.json** ファイルには、Copilot 固有の詳細情報が含まれています。これには、Copilot が特定の利用ケースで呼び出すために API コールを関数に分解することが含まれます。例えば、`/consultants` へのすべての GET リクエストは、様々なパラメーターオプションを使用して 1 人または複数のコンサルタントを照会し、これらは `getConsultants` 関数にグループ化されています:

~~~json
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
~~~

スクロールすると、ランタイム設定が見つかります:

~~~json
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
~~~

これらには trey-definition.json ファイルへのポインターと、利用可能な関数の列挙が含まれています.

<cc-end-step lab="e3" exercise="2" step="3" />

### ステップ 4：宣言型エージェントをアプリマニフェストに追加

次に、**appPackage** ディレクトリ内の **manifest.json** ファイルを開きます。staticTabs オブジェクトの直前に、以下のような copilotAgents オブジェクト（その内部に declarativeAgents オブジェクトを含む）を追加し、前のステップで作成した宣言型エージェント JSON ファイルを参照するようにします.

~~~json
  "copilotAgents": {
    "declarativeAgents": [
      {
        "id": "treygenie",
        "file": "trey-declarative-agent.json"
      }
    ]
  }, 
~~~

必ず作業内容を保存してください.

<cc-end-step lab="e3" exercise="2" step="4" />

### ステップ 5：アプリマニフェストからダミー機能の削除

ラボ E2 で実行した初期のソリューションには宣言型エージェントが存在しなかったため、機能がなかったことでマニフェストがインストールされませんでした。そこで、Copilot Developer Camp のホームページを指す静的タブである "dummy" 機能を追加しました。これにより、ユーザーは Teams、Outlook、および Microsoft 365 アプリ内のタブで Copilot Developer Camp ウェブサイトを閲覧できます.

Teams App Camp を試したことがあるならご存知かもしれません。そうでなければ、心配する必要はありません。これらの行は不要なので、**manifest.json** から削除してください.

~~~json
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
~~~

<cc-end-step lab="e3" exercise="2" step="5" />

## 演習 3：宣言型エージェントの実行とテスト

### ステップ 1：新プロジェクトの実行

まだデバッガー内にいる場合は、完全な再展開を強制するために停止してください.

その後、矢印をクリックするか F5 を押してデバッガーを開始し、Copilot ユーザーインターフェイスに戻ります.

<cc-end-step lab="e3" exercise="3" step="1" />

### ステップ 2：宣言型エージェントのテスト

Copilot チャットと右側のフライアウト 1️⃣ を開き、以前のチャットおよび宣言型エージェントを表示し、 Trey Genie Local エージェント 2️⃣ を選択します.

![Microsoft 365 Copilot showing the Trey Genie agent in action. On the right side there is the custom declarative agent, together with other agents. In the main body of the page there are the conversation starters and the textbox to provide a prompt to the agent.](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

例えば、「私のプロジェクトを、 Statement of Work doc の詳細情報と一緒に一覧表示してください」といったプロンプトを試してみてください.  
API プラグインからのプロジェクト一覧が表示され、それぞれのプロジェクトの Statement of Work の詳細が強化されています 1️⃣。Copilot が Trey Research のモットー 2️⃣ と文書への参照 3️⃣ を含んでいることに注目してください。文書を確認するには、参照のいずれかをクリックします.

![The output of the declarative agent with information about projects the user is working on, reference documents from the SharePoint site, and the motto 'Always be Billing!'](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-02.png)

!!! note
    SharePoint 文書が参照されない場合、ファイルへのアクセスに問題がある可能性があります。Search にサイトがインデックスされるまで時間がかかっているでしょうか？エンド ユーザーにサイトへのアクセス許可はありますか？管理者がサイトを Search から除外していませんか？Copilot 以外で Search を試すには、例えば
    
    `woodgrove path:"https://<tenant>.sharepoint.com/sites/<sitename>"`
    
    と入力して、テナントとサイト名を capability と一致するようにしてください。3 つの Woodgrove 文書が表示されるはずです。もし表示されない場合は、Search のトラブルシューティングが必要です。なぜなら、Copilot もそれらを見つけられなくなるためです。

<cc-end-step lab="e3" exercise="3" step="2" />


---8<--- "ja/e-congratulations.md"

API プラグインに宣言型エージェントの追加が完了しました。これで、エージェント用の API とプラグインをさらに強化する準備が整いました。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/03-add-declarative-copilot" />