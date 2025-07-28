---
search:
  exclude: true
---
# ラボ E4 - API とプラグインの強化

このラボでは、API に追加の REST 呼び出しを追加し、それらを API プラグイン パッケージに組み込んで Copilot から呼び出せるようにします。この過程で、Copilot 用の API を定義する必要がある箇所をすべて学習します。


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/9kb9whCKey4" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早く確認できます。</div>
            <div class="note-box">
            📘 <strong>Note:</strong>    このラボは前の Lab E3 を基にしています。Labs E2〜E6 は同じフォルダーで作業を続行できますが、参照用にソリューション フォルダーも用意されています。  
    このラボの完成版ソリューションは <a  src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END" target="_blank">/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END</a> にあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## Exercise 1: /projects リソースの追加

この演習では Trey Research API に /projects リソースを追加します。これにより、GET リクエストでプロジェクト情報を取得し、POST リクエストでコンサルタントをプロジェクトに割り当てられるようになります。その際に **appPackage/trey-Plugin.json** と **trey-definition.json** ファイルを修正し、新しい projects API 呼び出しを追加していく過程で理解を深めます。

### Step 1: Azure Function コードの追加

まず、Lab 2 のソリューションの **/src/functions** フォルダーに **projects.ts** という新しいファイルを作成します。そして [こちらのコードをコピー](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/src/functions/projects.ts){target=_blank} してください。

これにより Trey Research のプロジェクトにアクセスする新しい Azure Function が実装されます。

<cc-end-step lab="e4" exercise="1" step="1" />

### Step 2: Azure Function コードの確認 (任意)

ここでコードを簡単に確認しましょう。

これはバージョン 4 の Azure Function で、NodeJS の従来の Express コードに非常に似ています。`projects` クラスは HTTP リクエスト トリガーを実装しており、`/projects` パスにアクセスされたときに呼び出されます。その後にメソッドとルートを定義するインライン コードが続きます。現時点ではアクセスは anonymous です。[Lab E6](./06-add-authentication.md) で認証を追加します。

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

クラス内では GET と POST を処理する switch 文が含まれ、URL パス (プロジェクト ID)、クエリ文字列 (?projectName=foo など、GET の場合)、およびリクエスト ボディ (POST の場合) からパラメーターを取得します。その後、開始時点のソリューションに含まれている [ProjectApiService](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/src/services/ProjectApiService.ts){target=_blank} を使用してプロジェクト データにアクセスします。また、各リクエストに対するレスポンスの送信とデバッグ コンソールへのロギングも行います。

<cc-end-step lab="e4" exercise="1" step="2" />

### Step 3: HTTP テスト リクエストの追加

次に、**http/treyResearchAPI.http** ファイルに新しいリクエストを追加して試してみましょう。ファイルを開き、一番下に次のテキストを追加して保存します。あるいは [更新済みファイルをコピー](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/http/treyResearchAPI.http){target="_blank"} しても構いません。	

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

アプリがまだ Lab 2 から実行中の場合はデバッガーを停止して再起動してください。そうでなければ、通常どおりデバッガーを開始し、アプリの起動を待ちます。準備が整うと、Agents Toolkit が Microsoft 365 へのサインインを求めるブラウザーを表示します。最小化して構いませんが、閉じるとデバッガーが停止します。

新しいリクエストを送信すると、Trey Research のプロジェクト詳細を確認したり、POST リクエストでプロジェクトに新しいコンサルタントを割り当てたりできるはずです。

![Visual Studio Code showing the treyResearchAPI.http file with the POST request for projects highligthed on the left and the response on the right side.](../../assets/images/extend-m365-copilot-03/test-projects-2.png)

<cc-end-step lab="e4" exercise="1" step="4" />

## Exercise 2: アプリケーション パッケージに projects を追加

API プラグインのアプリケーション パッケージは zip ファイルで、Copilot が API を使用するために必要な情報がすべて含まれています。  
この演習では、新しい /projects リソースに関する情報をアプリ パッケージに追加します。

### Step 1: Open API Specification ファイルの更新

アプリケーション パッケージの重要な部分に [Open API Specification (OAS)](https://swagger.io/specification/){target=_blank} 定義ファイルがあります。OAS は REST API を記述する標準フォーマットで、広く使われている “Swagger” 定義に基づいています。

まず **/appPackage** フォルダーの **trey-definition.json** を開きます。  
大きな JSON ファイルの編集は難しいため、[こちらの更新済みファイル](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/appPackage/trey-definition.json){target=_blank} をコピーして上書き保存してください。以降の手順で変更点を確認します。

<cc-end-step lab="e4" exercise="2" step="1" />

### Step 2: 変更点の確認 (任意)

最初の変更は `paths` コレクションに `/projects/` パスを追加したことです。  
ご覧のとおり、`/projects/` リソース取得時に使用できるクエリ文字列と、そのデータ型・必須項目がすべて含まれています。また、API レスポンスで返されるデータも定義しており、ステータス 200 (成功) と 400 (失敗) で異なるペイロードを持たせています。

~~~json
"/projects/": {
    "get": {
        "operationId": "getProjects",
        "summary": "Get projects matching a specified project name and/or consultant name",
        "description": "Returns detailed information about projects matching the specified project name and/or consultant name",
        "parameters": [
            {
                "name": "consultantName",
                "in": "query",
                "description": "The name of the consultant assigned to the project",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },
            {
                "name": "projectName",
                "in": "query",
                "description": "The name of the project or name of the client",
                "required": false,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "responses": {
            "200": {
                "description": "Successful response",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "results": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "name": {
                                                "type": "string"
                                            },
                                            "description": {
                                                "type": "string"
                                            },
                                            "location": {
                                                "type": "object",
                                                "properties": {
                                                    "street": {
                                                        "type": "string"
                                                    },
                                                    "city": {
                                                        "type": "string"
                                                    },
                                                    "state": {
                                                        "type": "string"
                                                    },
                                                    "country": {
                                                        "type": "string"
                                                    },
                                                    "postalCode": {
                                                        "type": "string"
                                                    },
                                                    "latitude": {
                                                        "type": "number"
                                                    },
                                                    "longitude": {
                                                        "type": "number"
                                                    },
                                                    "mapUrl": {
                                                        "type": "string",
                                                        "format": "uri"
                                                    }
                                                }
                                            },
                                            "role": {
                                                "type": "string"
                                            },
                                            "forecastThisMonth": {
                                                "type": "integer"
                                            },
                                            "forecastNextMonth": {
                                                "type": "integer"
                                            },
                                            "deliveredLastMonth": {
                                                "type": "integer"
                                            },
                                            "deliveredThisMonth": {
                                                "type": "integer"
                                            }
                                        }
                                    }
                                },
                                "status": {
                                    "type": "integer"
                                }
                            }
                        }
                    }
                }
            },
            "404": {
                "description": "Project not found"
            }
        }
    }
},
~~~

POST リクエストを処理するために `/projects/assignConsultant` パスも追加されています。

!!! tip "説明文は非常に重要です！"
    このファイルをはじめ、アプリ パッケージ内のすべてのファイルは “インテリジェンス” によって読み取られます。人工であっても知能は説明文を読めます。  
    API を正しく利用してもらうために、このファイルだけでなくアプリ パッケージ全体でわかりやすい名前と説明を使用しましょう。

<cc-end-step lab="e4" exercise="2" step="2" />

### Step 3: プラグイン定義ファイルに projects を追加

次に **/appPackage** フォルダー内の **trey-plugin.json** を開きます。このファイルには OAS 定義ファイルに含まれない追加情報が記述されています。**trey-plugin.json** の内容を [こちらの更新 JSON](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/appPackage/trey-plugin.json){target=_blank} で置き換えてください。

<cc-end-step lab="e4" exercise="2" step="3" />

### Step 4: プラグイン定義ファイルの変更点 (任意)

プラグイン JSON ファイルには _functions_ のコレクションがあり、それぞれが API 呼び出しの種類に対応します。Copilot は実行時にプラグインを利用する際、これらの関数を選択します。

新しい **trey-plugin.json** には `getProjects` と `postAssignConsultant` という新しい関数が含まれています。例として `getProjects` を示します。

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

ここには `response_semantics` が含まれており、Copilot のオーケストレーターにレスポンス ペイロードの解釈方法を指示します。構造化データを意味のある形にマッピングし、表示や後処理に利用できるようにします。  
たとえば次の `getConsultants` の `response_semantics` をご覧ください。

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

ここでは `data_path` が `$.results` となっており、JSON データのメインの開始位置を表します。その下の `properties` で生データの特定フィールドを意味のあるプロパティにマッピングしています。

~~~json
     "title": "$.name",
      "subtitle": "$.id",
      "url": "$.consultantPhotoUrl"
~~~

POST リクエストにも同様の関数があります。

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

これは [Adaptive Card](https://adaptivecards.io){target=_blank} を確認カードとして使用しており、POST 実行前にユーザーへ確認を促します。

さらに下を見ると、`runtimes` オブジェクトがあります。ここではプラグインの種類、OAS 定義ファイルの場所、および関数のリストが定義されています。新しい関数がリストに追加されています。

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

最後に、プロンプト提案として表示される conversation starters が含まれています。新しいファイルには projects に関連するものが追加されています。

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

## Exercise 3: Copilot でプラグインをテスト

アプリケーションをテストする前に、`appPackage\manifest.json` 内の manifest バージョンを更新します。以下の手順に従ってください。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` ファイルを開きます。

2. JSON 内の `version` フィールドを探します。次のようになっています。  
   ```json
   "version": "1.0.0"
   ```

3. バージョン番号を小さくインクリメントします。たとえば次のように変更します。  
   ```json
   "version": "1.0.1"
   ```

4. 変更後、ファイルを保存します。

### Step 1: アプリケーションの再起動

アプリを停止して再起動し、アプリケーション パッケージを再デプロイします。  
Microsoft Teams が起動します。Copilot に戻ったら、右側のフライアウト 1️⃣ を開き、以前のチャットとエージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot showing the Trey Genie agent in action. On the right side there is the custom declarative agent, together with other agents. In the main body of the page there are the conversation starters and the textbox to provide a prompt for the agent.](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e4" exercise="3" step="1" />

### Step 2: Trey Genie へのプロンプト

例として「adatum ではどんなプロジェクトを進めていますか?」と入力してみましょう。

![Microsoft 365 Copilot prompting the user with a confirmation card to allow invoking the API plugin. There are three buttons to 'Always allow', 'Allow once', or 'Cancel' the request.](../../assets/images/extend-m365-copilot-03/test-projects-copilot-1.png)

GET リクエストでも確認カードが表示される場合があります。その場合は許可してプロジェクト詳細を表示してください。

![Microsoft 365 Copilot showing the output of Trey Genie agent when invoking the API plugin](../../assets/images/extend-m365-copilot-04/test-projects-copilot-2.png)

<cc-end-step lab="e4" exercise="3" step="2" />

---8<--- "ja/e-congratulations.md"

これで API プラグインの強化が完了しました。ただし、引用カードはまだ非常に基本的です。次のラボでは、Adaptive Card を使用してリッチな引用カードとレスポンスを追加しましょう。 

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/04-enhance-api-plugin" />