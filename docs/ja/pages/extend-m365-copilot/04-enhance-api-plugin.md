---
search:
  exclude: true
---
# ラボ E4 - API とプラグインの拡張

このラボでは、API に追加の REST 呼び出しを実装し、それらを API プラグイン パッケージに追加して Copilot から呼び出せるようにします。この過程で、Copilot が API を認識するために必要な定義箇所をすべて学習します。


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/9kb9whCKey4" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を短時間で確認できます。</div>
            <div class="note-box">
            📘 <strong>注:</strong>    このラボは前回のラボ E3 を基にしています。ラボ E2〜E6 は同じフォルダーで作業を続行できますが、参照用としてソリューション フォルダーも用意されています。<br/>
    このラボの完成版ソリューションは <a  src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END" target="_blank">/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END</a> にあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## 演習 1: /projects リソースの追加

この演習では Trey Research API に /projects リソースを追加します。これにより GET でプロジェクト情報を取得し、POST でコンサルタントをプロジェクトに割り当てられるようになります。その際、**appPackage/trey-Plugin.json** と **trey-definition.json** を編集して新しい projects API 呼び出しを追加しながら、Copilot 用に API を定義する箇所を学びます。

### 手順 1: Azure 関数コードの追加

まず **/src/functions** フォルダーに **projects.ts** ファイルを作成し、[こちらのコードをコピー](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/src/functions/projects.ts){target=_blank} してください。

これにより Trey Research のプロジェクトへアクセスする新しい Azure 関数が実装されます。

<cc-end-step lab="e4" exercise="1" step="1" />

### 手順 2: Azure 関数コードを確認 (任意)

コードを簡単に確認しましょう。

これはバージョン 4 の Azure 関数で、NodeJS の Express コードに近い構造になっています。`projects` クラスは "/projects" パスへの HTTP リクエスト トリガーを実装しています。続くインライン コードでメソッドとルートを定義します。現時点ではアクセス レベルは anonymous ですが、[ラボ E6](./06-add-authentication.md) で認証を追加します。

~~~typescript
export async function projects(
    req: HttpRequest,
    context: InvocationContext
): Promise<Response> {
    // ...
}
app.http("projects", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    route: "projects/{*id}",
    handler: projects,
});
~~~

クラスには GET と POST を処理する switch 文があり、URL パス (プロジェクト ID)、クエリ文字列 (?projectName=foo など)、リクエスト ボディ (POST 時) からパラメーターを取得します。その後、開始ソリューションに含まれている [ProjectApiService](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/src/services/ProjectApiService.ts){target=_blank} を介してプロジェクト データにアクセスします。また、各リクエストのレスポンスを返し、デバッグ コンソールにログを出力します。

<cc-end-step lab="e4" exercise="1" step="2" />

### 手順 3: HTTP テスト リクエストの追加

**http/treyResearchAPI.http** ファイルに新しいリクエストを追加して試してみましょう。ファイルを開いて末尾に次のテキストを追加し、保存します。もしくは [更新済みファイルをコピー](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/http/treyResearchAPI.http){target="_blank"} してください。	

~~~text
########## /api/projects - working with projects ##########

### Get all projects
{{base_url}}/projects

### Get project by id
{{base_url}}/projects/1

### Get project by project or client name
{{base_url}}/projects/?projectName=supply

### Get project by consultant name
{{base_url}}/projects/?consultantName=dominique

### Add consultant to project
POST {{base_url}}/projects/assignConsultant
Content-Type: application/json

{
    "projectName": "contoso",
    "consultantName": "sanjay",
    "role": "architect",
    "forecast": 30
}
~~~

<cc-end-step lab="e4" exercise="1" step="3" />

### 手順 4: 新しいリソースのテスト

アプリがラボ 2 からまだ動作中の場合はデバッガーを停止して再起動します。またはデバッガーを通常どおり開始し、アプリの起動を待ちます。起動が完了すると Agents Toolkit がブラウザーを開き、Microsoft 365 へのサインインを求めます。まだ使用しないので最小化しておきます (閉じるとデバッガーが停止します)。

新しいリクエストを送信すると、Trey Research のプロジェクト詳細を取得したり、POST リクエストでコンサルタントをプロジェクトに割り当てたりできます。

![Visual Studio Code showing the treyResearchAPI.http file with the POST request for projects highligthed on the left and the response on the right side.](../../assets/images/extend-m365-copilot-03/test-projects-2.png)

<cc-end-step lab="e4" exercise="1" step="4" />

## 演習 2: アプリケーション パッケージに projects を追加

API プラグインのアプリケーション パッケージは、Copilot が API を使用するために必要なすべての情報を含む zip ファイルです。
この演習では、新しい /projects リソースに関する情報をアプリ パッケージに追加します。

### 手順 1: Open API Specification ファイルの更新

アプリケーション パッケージの重要な構成要素の一つに [Open API Specification (OAS)](https://swagger.io/specification/){target=_blank} 定義ファイルがあります。OAS は REST API を記述するための標準形式で、広く使われている "Swagger" 定義を基にしています。

まず **/appPackage** フォルダーで **trey-definition.json** を開きます。
大きな JSON ファイルの編集は難しいので、[こちらの更新済みファイル](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/appPackage/trey-definition.json){target=_blank} をコピーして trey-definition.json を置き換え、保存してください。以降の手順で変更点を確認できます。

<cc-end-step lab="e4" exercise="2" step="1" />

### 手順 2: 更新内容を確認 (任意)

最初の更新点は `paths` コレクションに `/projects/` パスを追加したことです。
ここでは `/projects/` リソース取得時のすべてのクエリ文字列、データ型、必須フィールドなどが定義されています。また、ステータス 200 と 400 それぞれのレスポンス ペイロードも記述されています。

~~~json
"/projects/": {
    "get": {
        "operationId": "getProjects",
        "summary": "Get projects matching a specified project name and/or consultant name",
        "description": "Returns detailed information about projects matching the specified project name and/or consultant name",
        ...
}
~~~

さらに `/projects/assignConsultant` パスを追加し、POST リクエストを処理できるようにしています。

!!! tip "Descriptions are important!"
    このファイルを含むアプリ パッケージのすべてのファイルは、インテリジェンス (Copilot) に読み込まれます。AI とはいえ内容を読んで理解します。API を正しく使ってもらうため、ここや他のパッケージ ファイルでは分かりやすい名前と説明を付けましょう。

<cc-end-step lab="e4" exercise="2" step="2" />

### 手順 3: プラグイン定義ファイルに projects を追加

次に **/appPackage** フォルダーの **trey-plugin.json** を開きます。このファイルには OAS 定義ファイルに含まれない追加情報が入っています。**trey-plugin.json** の内容を [こちらの更新済み JSON](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/appPackage/trey-plugin.json){target=_blank} で置き換えてください。

<cc-end-step lab="e4" exercise="2" step="3" />

### 手順 4: プラグイン定義ファイルの変更点を確認 (任意)

プラグイン JSON には _functions_ コレクションがあり、各要素が API 呼び出しの種類に対応します。Copilot は実行時にこれらの関数を選択してプラグインを利用します。

新しい **trey-plugin.json** には `getProjects` と `postAssignConsultant` が追加されています。例として `getProjects` を見てみましょう。

~~~json
{
    "name": "getProjects",
    "description": "Returns detailed information about projects matching the specified project name and/or consultant name",
    "capabilities": {
        "response_semantics": {
            "data_path": "$.results",
            "properties": {
            "title": "$.name",
            "subtitle": "$.description"
            }
        }
    }
},
~~~

ここでは `response_semantics` が含まれており、Copilot のオーケストレーターへレスポンス ペイロードの解釈方法を示しています。構造化データのどのフィールドをどのプロパティにマッピングするかを定義し、レンダリングや後処理に利用できるようにします。

`postAssignConsultant` 関数も同様で、さらに [Adaptive Card](https://adaptivecards.io){target=_blank} を使った確認カードが定義されています。

~~~json
{
    "name": "postAssignConsultant",
    "description": "Assign (add) consultant to a project when name, role and project name is specified.",
    "capabilities": {
    "response_semantics": {
        "data_path": "$",
        "properties": {
        "title": "$.results.clientName",
        "subtitle": "$.results.status"
        }
    },
    "confirmation": {
        "type": "AdaptiveCard",
        "title": "Assign consultant to a project when name, role and project name is specified.",
        "body": "* **ProjectName**: {{function.parameters.projectName}}\n* **ConsultantName**: {{function.parameters.consultantName}}\n* **Role**: {{function.parameters.role}}\n* **Forecast**: {{function.parameters.forecast}}"
    }
    }
}
~~~

さらに下部では `runtimes` オブジェクトに新しい関数が追加されています。

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
    "getProjects",
    "postBillhours",
    "postAssignConsultant"
    ]
}
],
~~~

最後に、ユーザーへ表示されるプロンプト候補 (conversation starters) に projects 関連のものが追加されています。

~~~json
"capabilities": {
"localization": {},
"conversation_starters": [
    {
    "text": "What Trey projects am i assigned to?"
    },
    ...
]
}
~~~

<cc-end-step lab="e4" exercise="2" step="4" />

## 演習 3: Copilot でプラグインをテスト

テストの前に、`appPackage\manifest.json` の manifest バージョンを更新します。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` を開きます。  
2. JSON 内の `version` フィールドを探します。例:  
   ```json
   "version": "1.0.0"
   ```  
3. バージョン番号を小さくインクリメントします。例:  
   ```json
   "version": "1.0.1"
   ```  
4. 保存します。

### 手順 1: アプリケーションを再起動

アプリを停止して再起動し、アプリ パッケージを再デプロイさせます。
Microsoft Teams が開いた後、Copilot に戻り、右側のフライアウト 1️⃣ で過去のチャットとエージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot showing the Trey Genie agent in action. On the right side there is the custom declarative agent, together with other agents. In the main body of the page there are the conversation starters and the textbox to provide a prompt for the agent.](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e4" exercise="3" step="1" />

### 手順 2: Trey Genie にプロンプトを送る

たとえば「adatum で進行中のプロジェクトは？」と入力してみてください。

![Microsoft 365 Copilot prompting the user with a confirmation card to allow invoking the API plugin. There are three buttons to 'Always allow', 'Allow once', or 'Cancel' the request.](../../assets/images/extend-m365-copilot-03/test-projects-copilot-1.png)

GET リクエストでも確認カードが表示される場合があります。その場合は許可してプロジェクト詳細を表示してください。

![Microsoft 365 Copilot showing the output of Trey Genie agent when invoking the API plugin](../../assets/images/extend-m365-copilot-04/test-projects-copilot-2.png)

<cc-end-step lab="e4" exercise="3" step="2" />

---8<--- "ja/e-congratulations.md"

API プラグインの拡張が完了しました。ただしご覧のとおり、引用カードはまだシンプルです。次のラボでは、Adaptive Card を使ってリッチな引用カードとレスポンスを追加します。 

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/04-enhance-api-plugin" />