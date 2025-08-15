---
search:
  exclude: true
---
# ラボ E3 - 宣言型エージェントと API プラグインの追加

このラボでは、前のラボで作成した API プラグインと、特定の SharePoint ファイルに基づいて応答する宣言型エージェントを追加します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/XO2aG3YPbPc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご覧ください。</div>
              <div class="note-box">
            📘 <strong>注:</strong> このラボは前のラボ E2 を基にしています。ラボ E2～E6 は同じフォルダーで作業を続けられますが、参照用のソリューション フォルダーも用意されています。  
    このラボの完成版ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END" target="_blank">/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END</a> フォルダーにあります。
        </div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## 演習 1: サンプル ドキュメントのアップロード

この手順では、宣言型エージェントがユーザー プロンプトに応答するために使用するサンプル ドキュメントをアップロードします。これには、Statement of Work などのコンサルティング文書と、コンサルタントの稼働時間を記録した簡単なスプレッドシートが含まれます。

### 手順 1: SharePoint サイトの作成
[https://m365.cloud.microsoft/apps/](https://m365.cloud.microsoft/apps/) にアクセスし、「アプリ」内の「SharePoint」を探します。

![Microsoft 365 の UI。ワッフル メニューが展開され、SharePoint ワークロードが強調表示されている。](../../assets/images/extend-m365-copilot-05/upload-docs-01.png)

次に「サイトの作成」1️⃣ をクリックし、「チーム サイト」2️⃣ を選択します。

![新しい SharePoint Online サイトを作成する UI。'Team Site' テンプレートが示されている。](../../assets/images/extend-m365-copilot-05/upload-docs-02.png)

Standard team site テンプレートを選択すると、サイトのプレビューが表示されます。「テンプレートの使用」をクリックして続行します。

![ターゲット サイト用の 'Standard' サイト テンプレートを選択する UI。](../../assets/images/extend-m365-copilot-05/upload-docs-03.png)

サイト名に「Trey Research legal documents」などを入力 1️⃣ し、「次へ」2️⃣ をクリックします。

![ターゲット サイトの名前、説明などを入力する UI。](../../assets/images/extend-m365-copilot-05/upload-docs-05.png)

プライバシー設定と言語を選択し、「サイトの作成」をクリックします。

![ターゲット サイトのプライバシー設定と言語を選択する UI。](../../assets/images/extend-m365-copilot-05/upload-docs-06.png)

数秒後、新しい SharePoint サイトが表示されます。

<cc-end-step lab="e3" exercise="1" step="1" />

### 手順 2: サンプル ドキュメントのアップロード

Documents Web パーツで「すべて表示」を選択し、ドキュメント ライブラリ ページを開きます。

![サイトのホーム ページ。Documents Web パーツと 'See all' リンクが強調表示されている。](../../assets/images/extend-m365-copilot-05/upload-docs-07.png)

次にツールバーの「アップロード」1️⃣ をクリックし、「ファイル」2️⃣ を選択します。

![ドキュメント ライブラリのコマンド バー。'Upload' メニューが展開され 'Files' オプションが選択されている。](../../assets/images/extend-m365-copilot-05/upload-docs-08.png)

作業フォルダー内の **sampleDocs** ディレクトリに移動します。すべてのサンプル ドキュメントを選択 1️⃣ し、「開く」2️⃣ をクリックします。

サイト URL は「https://&lt;your-tenant&gt;.sharepoint.com/sites/TreyResearchlegaldocuments」のようになります。次の演習で必要になるのでメモしておいてください。

![アップロードするファイルを選択するファイル システム ダイアログ。](../../assets/images/extend-m365-copilot-05/upload-docs-09.png)

<cc-end-step lab="e3" exercise="1" step="2" />

## 演習 2: 宣言型エージェントの作成

### 手順 1: 宣言型エージェント JSON をプロジェクトに追加

**appPackage** フォルダー内に **trey-declarative-agent.json** という新しいファイルを作成します。次の JSON をコピーして保存します。

~~~json
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
~~~

ファイルには宣言型エージェントの name、description、instructions が含まれています。instructions の中で、Copilot に「Trey のモットー『Always be Billing!』を常にユーザーに思い出させる」よう指示している点に注目してください。次の演習で Copilot にプロンプトを送信した際に確認できます。

<cc-end-step lab="e3" exercise="2" step="1" />

### 手順 2: SharePoint サイトの URL を宣言型エージェントに追加

Capabilities セクションには SharePoint ファイル コンテナーがあります。Microsoft 365 Copilot は SharePoint や OneDrive 上のすべてのドキュメントを参照できますが、この宣言型エージェントは演習 1 で作成した Trey Research Legal Documents サイト内のファイルのみを参照します。

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

SharePoint URL は環境変数 `SHAREPOINT_DOCS_URL` になっているため、**env** フォルダーの **.env.local** ファイルに追加する必要があります。ファイルの末尾に次のように 1 行追加し、SharePoint URL を指定してください。

~~~text
SHAREPOINT_DOCS_URL=https://mytenant.sharepoint.com/sites/TreyResearchLegaldocuments
~~~

<cc-end-step lab="e3" exercise="2" step="2" />

### 手順 3: API プラグイン ファイルを確認する

**trey-declarative-agent.json** 内の "actions" セクションでは、宣言型エージェントが Trey Research API にアクセスするよう指定されています。

~~~json
"actions": [
    {
        "id": "treyresearch",
        "file": "trey-plugin.json"
    }
]
~~~

ここでは **trey-plugin.json** と、もう 1 つのファイルが Copilot に API を説明し、REST 呼び出しを行えるようにする方法を確認します。

これら 2 つのファイルは API を Copilot に説明するために使用されます。ラボ 2 でダウンロードしたプロジェクトに既に含まれているので、ここで確認してみましょう。

 * [**appPackage/trey-definition.json**](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END/appPackage/trey-definition.json){target=_blank} - これは業界標準の REST API 仕様である [OpenAPI Specification (OAS)](https://swagger.io/specification/){target=_blank}（いわゆる Swagger）ファイルです  
 * [**appPackage/trey-plugin.json**](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab03-build-declarative-agent/trey-research-lab03-END/appPackage/trey-plugin.json){target=_blank} - OAS ファイルでは説明されない Copilot 固有の詳細が含まれています

この手順ではこれらのファイルをざっと確認します。次のラボでさらに機能を追加しながら、より深く理解していきます。

**appPackage/trey-definition.json** ではアプリ全体の説明があります。サーバー URL を含み、Agents Toolkit が [developer tunnel](https://learn.microsoft.com/azure/developer/dev-tunnels/){target=_blank} を作成してローカル API をインターネットに公開し、`"${{OPENAPI_SERVER_URL}}"` トークンを公開 URL に置き換えます。その後、API の各リソース パス、verb、parameter を詳細に説明しています。詳細な説明は Copilot が API を理解するうえで重要です。

~~~json
{
  "openapi": "3.0.1",
  "info": {
      "version": "1.0.0",
      "title": "Trey Research API",
      "description": "API to streamline consultant assignment and project management."
  },
  ...
~~~

**appPackage/trey-plugin.json** には Copilot 固有の詳細があります。たとえば、`/consultants` へのすべての GET リクエストはさまざまなパラメーター オプションでコンサルタントを検索し、`getConsultants` 関数としてまとめられています。

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

さらに下にはランタイム設定があります。

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

ここで **trey-definition.json** へのパスと、利用可能な関数の列挙を行っています。

<cc-end-step lab="e3" exercise="2" step="3" />

### 手順 4: アプリ マニフェストに宣言型エージェントを追加

**appPackage** ディレクトリ内の **manifest.json** を開き、`staticTabs` オブジェクトの直前に次の `copilotAgents` オブジェクトを追加して、先ほど作成した宣言型エージェント JSON ファイルを参照させます。

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

保存を忘れないでください。

<cc-end-step lab="e3" exercise="2" step="4" />

### 手順 5: アプリ マニフェストからダミー機能を削除

ラボ E2 の初期ソリューションには宣言型エージェントがまだなかったため、マニフェストに機能がないとインストールできませんでした。そのため、Teams、Outlook、Microsoft 365 アプリ（[https://office.com](https://office.com){target=_blank}）で Copilot Developer Camp のホーム ページを表示できる静的タブを「ダミー」機能として追加していました。

[Teams App Camp](https://aka.ms/app-camp){target=_blank} を試したことがある方ならおなじみですが、ここでは不要なので **manifest.json** から以下の行を削除してください。

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

## 演習 3: 宣言型エージェントの実行とテスト

### 手順 1: 新しいプロジェクトの実行

デバッガーが起動中の場合はいったん停止し、完全に再デプロイします。

その後、F5 キーを押すか矢印をクリックしてデバッガーを再起動し、Copilot のユーザー インターフェースに戻ります。現在ブラウザー版 Teams でテストしているかもしれませんが、office.com/chat でもエージェントをテストできます。

???+ info "エージェントが見つからない"
    ブラウザーを更新し、下図のようにナビゲーションを折りたたんでから再度展開してください。F5 後にエージェントがすぐに表示されない場合があります。  
    ![Expand and collapse navigation](../../assets/images/extend-m365-copilot-05/expand-nav.png)

<cc-end-step lab="e3" exercise="3" step="1" />

### 手順 2: 宣言型エージェントのテスト

Copilot チャットを開き、右側のフライアウト 1️⃣ で過去のチャットと宣言型エージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot に Trey Genie エージェントが表示されている様子。右側にカスタム宣言型エージェントが並び、中央に会話スターターとプロンプト入力欄がある。](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

「Please list my projects along with details from the Statement of Work doc」のようなプロンプトを入力します。  
API プラグインから取得したプロジェクトの一覧に、各プロジェクトの Statement of Work の詳細 1️⃣ が付加されて表示されるはずです。Copilot が Trey Research のモットー 2️⃣ とドキュメントへの参照 3️⃣ を含めている点に注目してください。参照をクリックするとドキュメントを確認できます。

![エージェントの出力。ユーザーが取り組んでいるプロジェクト情報、SharePoint ドキュメントの参照、モットー 'Always be Billing!' が含まれている。](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-02.png)

!!! note
    SharePoint ドキュメントが参照されない場合、ファイルへのアクセスに問題がある可能性があります。検索によるサイトのインデックス作成が完了しているか、ユーザーにサイトへのアクセス許可があるか、管理者が検索対象からサイトを除外していないかを確認してください。  
    Copilot 外で次のような検索を試してください。  
    
    `woodgrove path:"https://<tenant>.sharepoint.com/sites/<sitename>"`  
    
    tenant とサイト名を capability に設定したものに置き換えて検索し、Woodgrove のドキュメント 3 件が表示されるか確認します。表示されなければ検索をトラブルシュートしてください。Copilot でも見つけられません。

API がどのように呼び出されているかも確認しましょう。再度「List my information」1️⃣ と入力し、エージェントに Trey Research API の api/me エンドポイントから情報を取得させます 2️⃣。

下図のように、ログイン ユーザー（認証はまだ実装していないため Avery Howard として表示）と担当プロジェクトが返されました。  
![List my information のプロンプトとその応答](../../assets/images/extend-m365-copilot-05/my-info.png)

VS Code のプロジェクトで「Terminal」を開くと、エージェントが API を呼び出したログも確認できます。

![api/me への API 呼び出しを示すターミナル](../../assets/images/extend-m365-copilot-05/api-called.png)

<cc-end-step lab="e3" exercise="3" step="2" />

---8<--- "ja/e-congratulations.md"

宣言型エージェントを API プラグインに追加できました。次は API とプラグインを強化していきましょう。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/03-add-declarative-copilot--ja" />