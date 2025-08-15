---
search:
  exclude: true
---
# ラボ E4 - API とプラグインの拡張

このラボでは、追加の REST 呼び出しを API に追加し、それらを API プラグインのパッケージに組み込み、Copilot から呼び出せるようにします。その過程で、Copilot 用に API を定義する必要があるすべての場所について学びます。


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/9kb9whCKey4" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早く確認できます。</div>
            <div class="note-box">
            📘 <strong>注:</strong>    このラボは前の Lab E3 を基にしています。ラボ E2〜E6 では同じフォルダーで作業を続けられますが、参照用としてソリューション フォルダーも用意されています。  
    このラボの完成版ソリューションは <a  src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END" target="_blank">/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END</a> にあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## 演習 1: /projects リソースの追加

この演習では、Trey Research API に /projects リソースを追加します。これにより、GET 要求を使用してプロジェクト情報を取得し、POST 要求を使用してコンサルタントをプロジェクトに割り当てられるようになります。その過程で、新しい projects API 呼び出しを追加するために **appPackage/trey-Plugin.json** と **trey-definition.json** ファイルをどのように変更するかを学びます。

### 手順 1: Azure Function コードを追加する

まず、ソリューションの **/src/functions** フォルダーに **projects.ts** という新しいファイルを作成します。次に、[こちらのコードをコピー](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/src/functions/projects.ts){target=_blank}してください。

これにより、Trey Research のプロジェクトにアクセスするための新しい Azure Function が実装されます。

<cc-end-step lab="e4" exercise="1" step="1" />

### 手順 2: Azure Function コードを確認する（任意）

ここでコードを確認してみましょう。

これはバージョン 4 の Azure Function で、コードは NodeJS の従来の Express コードに非常によく似ています。`projects` クラスは HTTP 要求トリガーを実装しており、"/projects" パスにアクセスされたときに呼び出されます。その後に、メソッドとルートを定義するインライン コードが続きます。現時点ではアクセスは匿名です。認証を追加するには [認証に関するパスウェイ](./auth.md) を参照してください。

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

クラスには GET と POST の要求を処理する switch 文が含まれており、URL パス（プロジェクト ID がある場合）、クエリ文字列（GET の場合 ?projectName=foo など）、リクエスト ボディ（POST の場合）からパラメーターを取得します。そして、開始ソリューションに含まれている [ProjectApiService](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/src/services/ProjectApiService.ts){target=_blank} を使用してプロジェクト データにアクセスします。また、各要求に対するレスポンスの送信とデバッグ コンソールへのログ出力も行います。

<cc-end-step lab="e4" exercise="1" step="2" />

### 手順 3: HTTP テスト要求を追加する

次に、新しい要求を **http/treyResearchAPI.http** ファイルに追加し、実行してみましょう。ファイルを開いて、以下のテキストを末尾に追加してから保存します。あるいは、[更新済みファイルをこちらからコピー](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/http/treyResearchAPI.http){target="_blank"} してもかまいません。	

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

### 手順 4: 新しいリソースをテストする

アプリが前のラボからまだ実行中の場合はデバッガーを停止して再起動します。実行していない場合はデバッガーを通常どおり開始し、アプリの起動を待ちます。準備が整うと、Agents Toolkit が Microsoft 365 へのサインインを求めるブラウザーを表示します。ブラウザーは最小化してかまいませんが、閉じるとデバッガーが停止してしまいます。

新しい要求を送信してみましょう。Trey Research のプロジェクトの詳細が取得できるか、POST 要求でプロジェクトに新しいコンサルタントを割り当てられるはずです。

![Visual Studio Code showing the treyResearchAPI.http file with the POST request for projects highligthed on the left and the response on the right side.](../../assets/images/extend-m365-copilot-03/test-projects-2.png)

<cc-end-step lab="e4" exercise="1" step="4" />

## 演習 2: アプリケーション パッケージに projects を追加する

API プラグインのアプリケーション パッケージは zip ファイルで、Copilot が API を利用するために必要なすべての情報を含んでいます。  
この演習では、新しい /projects リソースに関する情報をアプリ パッケージに追加します。

### 手順 1: Open API Specification ファイルを更新する

アプリケーション パッケージの重要な要素の 1 つに [Open API Specification (OAS)](https://swagger.io/specification/){target=_blank} 定義ファイルがあります。OAS は REST API を記述する標準フォーマットであり、一般的な “Swagger” 定義に基づいています。

まず、**/appPackage** フォルダーの **trey-definition.json** ファイルを開きます。  
大きな JSON ファイルの編集は難しいことがあるため、[こちらの更新済みファイルをコピー](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/appPackage/trey-definition.json){target=_blank} して、新しい trey-definition.json として保存してください。以降の手順で変更内容を確認し、理解できます。

<cc-end-step lab="e4" exercise="2" step="1" />

### 手順 2: 更新内容を確認する（任意）

最初の更新は、`paths` コレクションに `/projects/` パスを追加したことです。  
ご覧のとおり、これは `/projects/` リソースを取得するときに使用できるすべてのクエリ文字列と、そのデータ型および必須フィールドを含みます。また、ステータス 200（成功）と 400（失敗）のレスポンスで返されるデータも含みます。

~~~json
"/projects/": {
    "get": {
        "operationId": "getProjects",
        "summary": "Get projects matching a specified project name and/or consultant name",
        "description": "Returns detailed information about projects matching the specified project name and/or consultant name",
...
~~~

さらに、POST 要求を処理する `/projects/assignConsultant` パスも追加されています。

!!! tip "説明は重要です！"
    このファイルを含むアプリケーション パッケージのすべてのファイルはインテリジェンスによって読み取られます。人工的とはいえ知能があるので、説明を読めるのです！  
    このファイルやその他すべてのアプリケーション パッケージ ファイルで、わかりやすい名前と説明を使用することで、Copilot が API を適切に使用できるように支援できます。

<cc-end-step lab="e4" exercise="2" step="2" />

### 手順 3: プラグイン定義ファイルに projects を追加する

次に **/appPackage** フォルダー内の **trey-plugin.json** ファイルを開きます。このファイルには OAS 定義ファイルに含まれていない追加情報が含まれています。**trey-plugin.json** の内容を [こちらの更新済み JSON](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/appPackage/trey-plugin.json){target=_blank} で置き換えてください。

<cc-end-step lab="e4" exercise="2" step="3" />

### 手順 4: プラグイン定義ファイルの変更を確認する（任意）

プラグインの JSON ファイルには _functions_ のコレクションがあり、それぞれが API 呼び出しの種類に対応しています。Copilot は実行時にプラグインを利用する際、これらの関数の中から選択します。

新しい **trey-plugin.json** には `getProjects` と `postAssignConsultant` の新しい関数が含まれています。たとえば `getProjects` は次のとおりです。

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

ここには Copilot のオーケストレーターにレスポンス ペイロードの解釈方法を指示する `response_semantics` が含まれています。これは、レスポンス ペイロードの構造化データを関数で必要とされる特定のプロパティにマッピングするものです。  

例として、以下の `getConsultants` 関数の `response_semantics` を見てみましょう。

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
    },..]
~~~

ここで `data_path` は `$.results` です。つまりメインのデータは JSON の `results` キーの下にあり、システムはそのパスからデータを抽出します。さらに `properties` フィールドで生データの特定フィールドをセマンティック プロパティへマッピングしています。

~~~json
     "title": "$.name",
      "subtitle": "$.id",
      "url": "$.consultantPhotoUrl"
~~~

POST 要求にも同様の関数があります。

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

ここでは [Adaptive Card](https://adaptivecards.io){target=_blank} が確認カードに使用されています。これは POST 要求を発行する前にユーザーに確認を求めるカードです。

さらに下へスクロールすると、プラグインの種類、OAS 定義ファイルの場所、および関数のリストを定義する `runtimes` オブジェクトがあります。新しい関数がリストに追加されています。

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

最後に、ユーザーに表示されるプロンプト候補である conversation starters が含まれています。新しいファイルには projects に関連する conversation starter が追加されています。

~~~json
"capabilities": {
"localization": {},
"conversation_starters": [
    {
    "text": "What Trey projects am i assigned to?"
    },
    {
    "text": "Charge 5 hours to the Contoso project for Trey Research"
    },
    {
    "text": "Which Trey consultants are Azure certified?"
    },
    {
    "text": "Find a Trey consultant who is available now and has Python skills"
    },
    {
    "text": "Add Avery as a developer on the Contoso project for Trey"
    }
]
}
~~~

<cc-end-step lab="e4" exercise="2" step="4" />

## 演習 3: Copilot でプラグインをテストする

アプリケーションをテストする前に、`appPackage\manifest.json` ファイルでアプリ パッケージの manifest version を更新します。以下の手順に従ってください。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` ファイルを開きます。

2. JSON ファイル内の `version` フィールドを見つけます。次のようになっています。  
   ```json
   "version": "1.0.0"
   ```

3. バージョン番号を小さい値でインクリメントします。例:  
   ```json
   "version": "1.0.1"
   ```

4. 変更後、ファイルを保存します。

### 手順 1: アプリケーションを再起動する

プロジェクトを停止して再起動し、アプリケーション パッケージを再デプロイさせます。  
Microsoft Teams が表示されます。Copilot に戻ったら、右側のフライアウト 1️⃣ を開いて過去のチャットとエージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot showing the Trey Genie agent in action. On the right side there is the custom declarative agent, together with other agents. In the main body of the page there are the conversation starters and the textbox to provide a prompt for the agent.](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e4" exercise="3" step="1" />

### 手順 2: Trey Genie にプロンプトを送る

たとえば「adatum 向けに進行中のプロジェクトは何？」といったプロンプトを試してみてください。

![Microsoft 365 Copilot prompting the user with a confirmation card to allow invoking the API plugin. There are three buttons to 'Always allow', 'Allow once', or 'Cancel' the request.](../../assets/images/extend-m365-copilot-03/test-projects-copilot-1.png)

GET 要求であっても確認カードが表示される場合があります。その場合は要求を許可してプロジェクトの詳細を確認します。

![Microsoft 365 Copilot showing the output of Trey Genie agent when invoking the API plugin](../../assets/images/extend-m365-copilot-04/test-projects-copilot-2.png)

<cc-end-step lab="e4" exercise="3" step="2" />

---8<--- "ja/e-congratulations.md"

API プラグインの拡張が完了しました。ただし、引用カードはまだ非常に基本的なものです。次のラボでは、Adaptive Card を使用してリッチなカード引用とレスポンスを追加しましょう。 

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/04-enhance-api-plugin--ja" />