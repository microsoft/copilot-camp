---
search:
  exclude: true
---
# ラボ E4 - API とプラグインの拡張

このラボでは、API に追加の REST 呼び出しを実装し、それらを API プラグインのパッケージに追加して Copilot から呼び出せるようにします。その過程で、API を Copilot 向けに定義する必要があるすべての場所を学習します。


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/9kb9whCKey4" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を短時間で確認できます。</div>
            <div class="note-box">
            📘 <strong>Note:</strong> このラボは前回のラボ E3 を基にしています。ラボ E2〜E6 は同じフォルダーで作業を継続できますが、参照用にソリューション フォルダーも提供されています。  
            このラボの完成版ソリューションは <a  src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END" target="_blank">/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END</a> にあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## Exercise 1: /projects リソースを追加する

このエクササイズでは、Trey Research API に /projects リソースを追加します。これにより、GET 要求でプロジェクト情報を取得し、POST 要求でコンサルタントをプロジェクトに割り当てられるようになります。作業を通じて **appPackage/trey-Plugin.json** と **trey-definition.json** ファイルを変更し、新しい projects API 呼び出しを追加する方法を学びます。

### Step 1: Azure Function コードを追加する

まず、Lab 2 のソリューションの **/src/functions** フォルダーに **projects.ts** という新しいファイルを作成します。そして [こちらのコードをコピー](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/src/functions/projects.ts){target=_blank} してください。

これにより、Trey Research のプロジェクトにアクセスするための新しい Azure Function が実装されます。

<cc-end-step lab="e4" exercise="1" step="1" />

### Step 2: Azure Function コードを確認する (任意)

コードを少し確認してみましょう。

これはバージョン 4 の Azure Function で、NodeJS の従来の Express コードに非常によく似ています。`projects` クラスは HTTP リクエスト トリガーを実装し、「/projects」パスにアクセスされたときに呼び出されます。その後にメソッドとルートを定義するインライン コードが続きます。現在は匿名アクセスになっていますが、認証は [ラボ E6](./06-add-authentication.md) で追加します。

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

クラスには GET と POST を処理する switch 文が含まれ、URL パス（プロジェクト ID）、クエリ文字列（GET で ?projectName=foo など）、リクエスト ボディ（POST の場合）からパラメーターを取得します。その後、開始ソリューションに含まれている [ProjectApiService](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/src/services/ProjectApiService.ts){target=_blank} を使ってプロジェクト データへアクセスします。また、各リクエストの応答送信とデバッグ コンソールへのログ出力も行います。

<cc-end-step lab="e4" exercise="1" step="2" />

### Step 3: HTTP テスト リクエストを追加する

次に **http/treyResearchAPI.http** ファイルに新しいリクエストを追加し、動作を確認しましょう。ファイルを開いて以下のテキストを末尾に追加し、保存します。あるいは [更新済みファイルをコピー](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/http/treyResearchAPI.http){target="_blank"} しても構いません。	

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

### Step 4: 新しいリソースをテストする

アプリがまだ Lab 2 から実行中の場合はデバッガーを停止して再起動します。通常どおりデバッガーを開始してアプリの起動を待ってもかまいません。準備が整うと、Agents Toolkit が Microsoft 365 へのログインを求めるブラウザーを表示します。今は最小化しておきましょう。閉じるとデバッガーが停止してしまいます。

新しいリクエストを送信すると Trey Research のプロジェクト詳細を参照したり、POST リクエストで新しいコンサルタントをプロジェクトに割り当てたりできるはずです。

![Visual Studio Code showing the treyResearchAPI.http file with the POST request for projects highligthed on the left and the response on the right side.](../../assets/images/extend-m365-copilot-03/test-projects-2.png)

<cc-end-step lab="e4" exercise="1" step="4" />

## Exercise 2: アプリケーション パッケージに projects を追加する

API プラグインのアプリケーション パッケージは ZIP ファイルで、Copilot が API を利用するために必要なすべての情報を含みます。  
このエクササイズでは、新しい /projects リソースの情報をアプリ パッケージに追加します。

### Step 1: Open API Specification ファイルを更新する

アプリケーション パッケージの重要な構成要素の一つが [Open API Specification (OAS)](https://swagger.io/specification/){target=_blank} 定義ファイルです。OAS は REST API を記述する標準フォーマットで、人気の「Swagger」定義をベースにしています。

まず **/appPackage** フォルダーの **trey-definition.json** を開きます。  
大きな JSON ファイルの編集は煩雑になりがちなので、[更新済みファイルをこちらからコピー](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/appPackage/trey-definition.json){target=_blank} して保存してください。以降の手順で変更点を確認できます。

<cc-end-step lab="e4" exercise="2" step="1" />

### Step 2: 更新内容を確認する (任意)

最初の変更点は `paths` コレクションに `/projects/` パスを追加したことです。  
ここには `/projects/` リソース取得時に利用可能なクエリ文字列と、そのデータ型や必須フィールドが含まれています。また、ステータス 200（成功）や 400（失敗）時に返されるレスポンス データも定義されています。

~~~json
"/projects/": {
    "get": {
        "operationId": "getProjects",
        "summary": "Get projects matching a specified project name and/or consultant name",
        ...
    }
},
~~~

さらに、POST リクエストを処理する `/projects/assignConsultant` パスも追加されています。

!!! tip "説明文が重要です！"
    このファイルを含むアプリケーション パッケージ内のすべてのファイルは、インテリジェンスによって読み取られます。人工的ではありますが、説明文を理解できるだけの知性は備えています。わかりやすい名前と説明を付けることで、Copilot が API を正しく利用できるようになります！

<cc-end-step lab="e4" exercise="2" step="2" />

### Step 3: プラグイン定義ファイルに projects を追加する

次に **/appPackage** フォルダー内の **trey-plugin.json** を開きます。このファイルには OAS 定義ファイルに含まれない追加情報が格納されています。**trey-plugin.json** の内容を [こちらの更新済み JSON](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/appPackage/trey-plugin.json){target=_blank} に置き換えてください。

<cc-end-step lab="e4" exercise="2" step="3" />

### Step 4: プラグイン定義ファイルの変更点を確認する (任意)

プラグインの JSON ファイルには _functions_ のコレクションがあり、各 function が API 呼び出しの種類に対応します。Copilot は実行時にこれらの function の中から適切なものを選択します。

新しい **trey-plugin.json** には `getProjects` と `postAssignConsultant` の function が追加されています。`getProjects` を例に見てみましょう。

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

ここでは `response_semantics` が含まれており、Copilot のオーケストレーターにレスポンス ペイロードの解釈方法を指示しています。  
`data_path` により JSON のどこからデータを抽出するかを示し、`properties` で抽出したデータをレンダリングや追加処理に使えるようマッピングしています。

POST リクエストの function も同様です。

~~~json
{
    "name": "postAssignConsultant",
    "description": "Assign (add) consultant to a project when name, role and project name is specified.",
    ...
}
~~~

ここでは確認用に [Adaptive Card](https://adaptivecards.io){target=_blank} が定義されており、POST 前に ユーザー に表示されます。

さらに下へスクロールすると `runtimes` オブジェクトがあります。ここではプラグインの種類、OAS 定義ファイルの場所、function の一覧を定義しています。新しい function もリストに追加されています。

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

最後に、会話スターターとしてユーザー に表示されるプロンプト候補も追加されています。

~~~json
"conversation_starters": [
    {
    "text": "What Trey projects am i assigned to?"
    },
    ...
]
~~~

<cc-end-step lab="e4" exercise="2" step="4" />

## Exercise 3: Copilot でプラグインをテストする

アプリケーションをテストする前に、アプリ パッケージの `appPackage\manifest.json` ファイルで manifest バージョンを更新します。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` を開きます。

2. JSON 内の `version` フィールドを探します。次のようになっているはずです:  
   ```json
   "version": "1.0.0"
   ```

3. バージョン番号をわずかに上げます。例:  
   ```json
   "version": "1.0.1"
   ```

4. 変更後にファイルを保存します。

### Step 1: アプリケーションを再起動する

アプリを停止して再起動し、アプリケーション パッケージを再デプロイさせます。  
Microsoft Teams が起動したら、Copilot 内で右側のフライアウト 1️⃣ を開き、以前のチャットとエージェントを表示して Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot showing the Trey Genie agent in action. On the right side there is the custom declarative agent, together with other agents. In the main body of the page there are the conversation starters and the textbox to provide a prompt for the agent.](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e4" exercise="3" step="1" />

### Step 2: Trey Genie にプロンプトを送る

次のようなプロンプトを試してみましょう: 「what projects are we doing for adatum?」

![Microsoft 365 Copilot prompting the user with a confirmation card to allow invoking the API plugin. There are three buttons to 'Always allow', 'Allow once', or 'Cancel' the request.](../../assets/images/extend-m365-copilot-03/test-projects-copilot-1.png)

GET 要求でも確認カードが表示される場合があります。その場合は許可してプロジェクト詳細を表示してください。

![Microsoft 365 Copilot showing the output of Trey Genie agent when invoking the API plugin](../../assets/images/extend-m365-copilot-04/test-projects-copilot-2.png)

<cc-end-step lab="e4" exercise="3" step="2" />

---8<--- "ja/e-congratulations.md"

これで API プラグインの拡張が完了しました。ただし、現在の引用カードは非常にシンプルです。次のラボでは、Adaptive Card を使用して引用カードや応答をリッチにする方法を学びましょう。 

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/04-enhance-api-plugin--ja" />