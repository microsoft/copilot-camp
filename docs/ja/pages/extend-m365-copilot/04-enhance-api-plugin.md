---
search:
  exclude: true
---
# Lab E4 - API とプラグインの拡張

このラボでは API に追加の REST 呼び出しを追加し、それらを API プラグイン パッケージに組み込んで Copilot から呼び出せるようにします。この過程で、Copilot で API を定義する必要があるすべての場所を学びます。


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/9kb9whCKey4" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要をご覧ください。</div>
            <div class="note-box">
            📘 <strong>注:</strong>    このラボは前回の Lab E3 を基に進めます。E2～E6 のラボは同じフォルダーで作業を続けられますが、参照用にソリューション フォルダーも用意されています。  
    このラボの完成版ソリューションは <a  src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END" target="_blank">/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END</a> にあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## Exercise 1: /projects リソースの追加

この演習では、Trey Research API に /projects リソースを追加します。これにより GET 要求でプロジェクト情報を取得し、POST 要求でプロジェクトにコンサルタントを割り当てられるようになります。この作業を通じて、新しい projects API 呼び出しを追加するために **appPackage/trey-Plugin.json** と **trey-definition.json** をどのように変更するかを学びます。

### Step 1: Azure Function コードの追加

まず、ソリューションの **/src/functions** フォルダーに **projects.ts** という新しいファイルを作成します。そして [こちらのコードをコピー](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/src/functions/projects.ts){target=_blank} してください。

これにより、Trey Research のプロジェクトへアクセスする新しい Azure Function が実装されます。

<cc-end-step lab="e4" exercise="1" step="1" />

### Step 2: Azure Function コードの確認 (任意)

コードを簡単に確認しましょう。

これはバージョン 4 の Azure Function であり、NodeJS の従来の Express コードに近い構成です。`projects` クラスは HTTP 要求トリガーを実装しており、"/projects" パスにアクセスすると呼び出されます。この後にメソッドとルートを定義するインライン コードが続きます。現時点ではアクセスは匿名で、認証は後で追加します。[認証パスウェイの詳細はこちら](./auth.md)。

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

クラスには GET と POST 要求を処理する switch 文が含まれ、URL パス (プロジェクト ID)、クエリ文字列 (?projectName=foo など)、および要求ボディ (POST の場合) からパラメーターを取得します。次に、開始ソリューションに含まれていた [ProjectApiService](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/src/services/ProjectApiService.ts){target=_blank} を使用してプロジェクト データにアクセスします。また、各要求に対するレスポンス送信やデバッグ コンソールへのログ出力も行います。

<cc-end-step lab="e4" exercise="1" step="2" />

### Step 3: HTTP テスト要求の追加

次に、新しい要求を **http/treyResearchAPI.http** ファイルに追加して試せるようにします。ファイルを開き、次のテキストを末尾に追加して保存するか、[更新済みファイルはこちら](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/http/treyResearchAPI.http){target="_blank"} をコピーしてください。　

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

### Step 4: 新しいリソースのテスト

前のラボからアプリが実行中の場合は、デバッガーを停止して再起動します。そうでなければ、普通にデバッガーを開始し、アプリの起動を待ちます。準備が整うと、Agents Toolkit が Microsoft 365 へのログインを求める Web ブラウザーを表示します。最小化して構いませんが、閉じるとデバッガーが停止します。

新しい要求を送信すると、Trey Research のプロジェクト詳細を確認したり、POST 要求でプロジェクトにコンサルタントを割り当てたりできるはずです。

![Visual Studio Code showing the treyResearchAPI.http file with the POST request for projects highligthed on the left and the response on the right side.](../../assets/images/extend-m365-copilot-03/test-projects-2.png)

<cc-end-step lab="e4" exercise="1" step="4" />

## Exercise 2: アプリケーション パッケージへの projects 追加

API プラグインのアプリケーション パッケージは zip ファイルで、Copilot が API を利用するのに必要な情報がすべて含まれています。  
この演習では、新しい /projects リソースに関する情報をアプリ パッケージに追加します。

### Step 1: OpenAPI Specification ファイルの更新

アプリケーション パッケージの重要な一部に [OpenAPI Specification (OAS)](https://swagger.io/specification/){target=_blank} 定義ファイルがあります。OAS は REST API を記述する標準フォーマットを定義し、人気の「Swagger」定義を基にしています。

まず **/appPackage** フォルダーの **trey-definition.json** を開きます。  
大きな JSON ファイルの編集は煩雑なので、[こちらの更新済みファイル](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/appPackage/trey-definition.json){target=_blank} をコピーし、trey-definition.json を置き換えて保存してください。以降のステップで変更内容を確認できます。

<cc-end-step lab="e4" exercise="2" step="1" />

### Step 2: 変更点の確認 (任意)

最初の更新は `paths` コレクションに `/projects/` パスを追加したことです。  
ご覧のとおり、`/projects/` リソース取得時に使用できるクエリ文字列、そのデータ型や必須フィールドが含まれています。また、ステータス 200 (成功) と 400 (失敗) の異なるペイロードを含む API 応答データも定義しています。

~~~json
"/projects/": {
    "get": {
        "operationId": "getProjects",
        "summary": "Get projects matching a specified project name and/or consultant name",
        "description": "Returns detailed information about projects matching the specified project name and/or consultant name",
        ...
    }
},
~~~

さらに、POST 要求を処理する `/projects/assignConsultant` パスも追加されています。

!!! tip "説明はとても重要です"
    このファイルを含むアプリ パッケージ内のすべてのファイルはインテリジェンス (人工知能) により読み取られます。  
    Copilot が API を正しく利用できるよう、わかりやすい名前と説明を付けましょう！

<cc-end-step lab="e4" exercise="2" step="2" />

### Step 3: プラグイン定義ファイルへの projects 追加

次に **/appPackage** フォルダーの **trey-plugin.json** を開きます。このファイルには OAS 定義ファイルには含まれない追加情報が記載されています。**trey-plugin.json** の内容を [こちらの更新済み JSON](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/appPackage/trey-plugin.json){target=_blank} で置き換えてください。

<cc-end-step lab="e4" exercise="2" step="3" />

### Step 4: プラグイン定義ファイルの変更点確認 (任意)

プラグイン JSON ファイルには _functions_ のコレクションがあり、それぞれが API 呼び出しの種類に対応します。Copilot は実行時にこれらの関数から適切なものを選択します。

新しい **trey-plugin.json** には `getProjects` と `postAssignConsultant` という関数が追加されています。例えば `getProjects` は次のとおりです。

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

ここでは `response_semantics` が含まれており、Copilot のオーケストレーターに応答ペイロードの解釈方法を指示します。構造化データをどのプロパティにマッピングするかを定義し、レンダリングや処理で利用しやすくします。

POST 要求用の関数も同様です。

~~~json
{
    "name": "postAssignConsultant",
    "description": "Assign (add) consultant to a project when name, role and project name is specified.",
    ...
}
~~~

ここには確認カードとして使用される [Adaptive Card](https://adaptivecards.io){target=_blank} も含まれています。

後半には `runtimes` オブジェクトがあり、プラグインの種類、OAS 定義ファイルの場所、関数一覧が定義されています。新しい関数がリストに追加されています。

~~~json
"runtimes": [
{
    "type": "OpenApi",
    ...
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

最後に、会話スターター (ユーザーに表示されるプロンプト候補) があり、新しいファイルには projects に関連するスターターが追加されています。

~~~json
"conversation_starters": [
    {
    "text": "What Trey projects am i assigned to?"
    },
    ...
]
~~~

<cc-end-step lab="e4" exercise="2" step="4" />

## Exercise 3: Copilot でプラグインをテスト

アプリケーションをテストする前に、`appPackage\manifest.json` のマニフェスト バージョンを更新します。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` を開きます。

2. JSON 内の `version` フィールドを探します。次のようになっています。  
   ```json
   "version": "1.0.0"
   ```

3. バージョン番号を小さくインクリメントします。例:  
   ```json
   "version": "1.0.1"
   ```

4. ファイルを保存します。

### Step 1: アプリケーションの再起動

プロジェクトを停止して再起動し、アプリケーション パッケージを再デプロイします。  
Microsoft Teams が起動し、Copilot に戻ったら、右側のフライアウト 1️⃣ を開いて以前のチャットとエージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot showing the Trey Genie agent in action. On the right side there is the custom declarative agent, together with other agents. In the main body of the page there are the conversation starters and the textbox to provide a prompt for the agent.](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e4" exercise="3" step="1" />

### Step 2: Trey Genie へのプロンプト

例えば「adatum ではどんなプロジェクトを進めていますか？」と入力してみましょう。

![Microsoft 365 Copilot prompting the user with a confirmation card to allow invoking the API plugin. There are three buttons to 'Always allow', 'Allow once', or 'Cancel' the request.](../../assets/images/extend-m365-copilot-03/test-projects-copilot-1.png)

GET 要求でも確認カードが表示される場合があります。表示されたら許可を選択してプロジェクト詳細を確認してください。

![Microsoft 365 Copilot showing the output of Trey Genie agent when invoking the API plugin](../../assets/images/extend-m365-copilot-04/test-projects-copilot-2.png)

<cc-end-step lab="e4" exercise="3" step="2" />

---8<--- "ja/e-congratulations.md"

これで API プラグインの拡張が完了しました。ただし、引用カードはまだ非常に基本的なものです。次のラボでは、Adaptive Card を使用してリッチなカード引用とレスポンスを追加します。 

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/04-enhance-api-plugin--ja" />