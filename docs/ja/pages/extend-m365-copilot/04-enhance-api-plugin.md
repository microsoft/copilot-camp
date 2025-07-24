---
search:
  exclude: true
---
# ラボ E4 - API とプラグインの強化

このラボでは、API に追加の REST 呼び出しを追加し、それらを API プラグイン パッケージに含めることで Copilot が呼び出せるようにします。作業を通して、Copilot 用の API を定義するすべての場所を学んでいただきます。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/9kb9whCKey4" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早くご覧いただけます。</div>
            <div class="note-box">
            📘 <strong>注意事項:</strong>    このラボは前のラボ、ラボ E3 を基にしています。ラボ E2 ～ E6 用の同じフォルダーで作業を続けることができますが、参照用にソリューション フォルダーが提供されています。
    このラボの完成したソリューションは <a  src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END" target="_blank">/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END</a> にあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## エクササイズ 1: /projects リソースの追加

本エクササイズでは、Trey Research API に /projects リソースを追加します。これにより、GET リクエストを使用してプロジェクト情報を取得したり、POST リクエストを使用してプロジェクトにコンサルタントを割り当てたりすることができます。作業を通して、**appPackage/trey-Plugin.json** および **trey-definition.json** ファイルについて、新しい projects API 呼び出しを追加するためにどのような変更を行うかを学びます。

### ステップ 1: Azure function コードの追加

まず、ラボ 2 のソリューションの **/src/functions** フォルダー内に新しいファイル **projects.ts** を作成してください。[こちらのコード](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/src/functions/projects.ts){target=_blank} をコピーしてください。

これにより、Trey Research のプロジェクトにアクセスするための新しい Azure function が実装されます。

<cc-end-step lab="e4" exercise="1" step="1" />

### ステップ 2: Azure function コードの確認（オプショナル）

少し時間を取ってコードを確認しましょう。

これはバージョン 4 の Azure function であるため、コードは NodeJS 用の従来の Express コードに非常に似ています。`projects` クラスは HTTP リクエスト トリガーを実装しており、"/projects" パスにアクセスされたときに呼び出されます。その後、いくつかのインライン コードでメソッドとルートが定義されています。現状、アクセスは匿名であり、後に [ラボ E6](./06-add-authentication.md) で認証を追加します。

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

このクラスには GET と POST リクエストを処理するための switch 文が含まれており、URL パス（プロジェクト ID の場合）、クエリ文字列（GET の場合 ?projectName=foo など）、およびリクエスト ボディ（POST の場合）からパラメーターを取得します。その後、開始時のソリューションの一部であった [ProjectApiService](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/src/services/ProjectApiService.ts){target=_blank} を使用してプロジェクト データにアクセスし、各リクエストのレスポンス送信およびデバッグ コンソールへのリクエスト ログを行います。

<cc-end-step lab="e4" exercise="1" step="2" />

### ステップ 3: HTTP テスト リクエストの追加

次に、新しいリクエストを **http/treyResearchAPI.http** ファイルに追加してテストを行います。ファイルを開いて下部に以下のテキストを追加し、保存してください。または、[こちらの更新済みファイル](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/http/treyResearchAPI.http){target="_blank"} をコピーしてください。

~~~text
########## /api/projects - projects の操作 ##########

### すべてのプロジェクトを取得
{{base_url}}/projects

### プロジェクトを id で取得
{{base_url}}/projects/1

### プロジェクト名またはクライアント名でプロジェクトを取得
{{base_url}}/projects/?projectName=supply

### コンサルタント名でプロジェクトを取得
{{base_url}}/projects/?consultantName=dominique

### プロジェクトにコンサルタントを追加
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

### ステップ 4: 新しいリソースのテスト

もしラボ 2 からアプリが実行中の場合は、デバッガーを停止して再起動してください。もしくは、通常通りデバッガーを起動し、アプリの起動を待ちます。すべての準備が完了すると、Agents Toolkit は Microsoft 365 へのログインを要求する Web ブラウザーを表示します。このブラウザーは最小化してください（閉じるとデバッガーが停止します）。

新しいリクエストを送信して、Trey Research のプロジェクト詳細が表示されたり、POST リクエストを使用してプロジェクトに新しいコンサルタントを割り当てたりできるか確認してください。

![Visual Studio Code で projects の POST リクエストが左側に強調表示され、右側にレスポンスが表示されている treyResearchAPI.http ファイル](../assets/images/extend-m365-copilot-03/test-projects-2.png)

<cc-end-step lab="e4" exercise="1" step="4" />

## エクササイズ 2: アプリケーション パッケージへの projects の追加

API プラグインのアプリケーション パッケージは、Copilot が API を使用するために必要なすべての情報を含む zip ファイルです。
本エクササイズでは、新しい /projects リソースに関する情報をアプリ パッケージに追加します。

### ステップ 1: Open API Specification ファイルの更新

アプリケーション パッケージの重要な部分は、[Open API Specification ( OAS )](https://swagger.io/specification/){target=_blank} 定義ファイルです。OAS は REST API を記述するための標準フォーマットを定義しており、人気のある "Swagger" 定義に基づいています。

まず、**/appPackage** フォルダー内の **trey-definition.json** ファイルを開いてください。
大きな JSON ファイルの編集は難しいため、[こちらの更新済みファイル](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/appPackage/trey-definition.json){target=_blank} をコピーして、新しい trey-definition.json として保存してください。以下のステップで、変更内容を確認し理解することができます。

<cc-end-step lab="e4" exercise="2" step="1" />

### ステップ 2: 更新内容の確認（オプショナル）

最初の更新は、JSON の `paths` コレクションに `/projects/` パスを追加することでした。
ご覧のとおり、これは `/projects/` リソースを取得する際に使用可能なすべてのクエリ文字列に加え、データ型や必須フィールドを含んでいます。また、200（成功）と 400（失敗）のレスポンス用の異なるペイロードを含む、API レスポンスで返されるデータも含まれています。

~~~json
"/projects/": {
    "get": {
        "operationId": "getProjects",
        "summary": "指定されたプロジェクト名および/またはコンサルタント名に一致する projects を取得",
        "description": "指定されたプロジェクト名および/またはコンサルタント名に一致するプロジェクトの詳細情報を返します",
        "parameters": [
            {
                "name": "consultantName",
                "in": "query",
                "description": "プロジェクトに割り当てられたコンサルタントの名前",
                "required": false,
                "schema": {
                    "type": "string"
                }
            },
            {
                "name": "projectName",
                "in": "query",
                "description": "プロジェクト名またはクライアント名",
                "required": false,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "responses": {
            "200": {
                "description": "成功したレスポンス",
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
                "description": "プロジェクトが見つかりません"
            }
        }
    }
},
~~~

また、POST リクエストを処理するために `/projects/assignConsultant` パスも追加されていることが確認できます。

!!! tip "記述は重要です！"
    このファイルは、アプリケーション パッケージ内のすべてのファイルとともに、 intelligence によって読み込まれます。人工かもしれませんが、記述を読むほどの知性が備わっています。記述にわかりやすい名前と説明を使用することで、Copilot が API を適切に使用するのを支援できます。

<cc-end-step lab="e4" exercise="2" step="2" />

### ステップ 3: プラグイン定義ファイルへの projects の追加

次に、**/appPackage** フォルダー内の **trey-plugin.json** ファイルを開いてください。このファイルには OAS 定義ファイルに含まれていない追加情報が含まれています。**trey-plugin.json** の内容を [この更新済みの JSON](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END/appPackage/trey-plugin.json){target=_blank} に置き換えてください。

<cc-end-step lab="e4" exercise="2" step="3" />

### ステップ 4: プラグイン定義ファイルの変更内容の確認（オプショナル）

プラグイン JSON ファイルには、各 API 呼び出しの種類に対応する _functions_ のコレクションが含まれています。Copilot は実行時にプラグインを利用する際、これらの関数の中から選択します。

新しい **trey-plugin.json** ファイルには、新しい関数 `getProjects` と `postAssignConsultant` が含まれています。例えば、`getProjects` は以下のようになっています:

~~~json
{
    "name": "getProjects",
    "description": "指定されたプロジェクト名および/またはコンサルタント名に一致するプロジェクトの詳細情報を返します",
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

ご覧のとおり、`response_semantics` が含まれており、Copilot のオーケストレーターにレスポンス ペイロードの解釈方法を指示しています。これは、レスポンス ペイロード内の構造化されたデータを、関数が必要とする特定のプロパティにマッピングする方法を定義しており、オーケストレーターが raw レスポンス データを意味のある内容に変換し、レンダリングまたはさらなる処理に使用できるようにします。
例として、以下のレスポンス セマンティクスをご覧ください:

~~~json

"functions": [
    {
      "name": "getConsultants",
      "description": "名前、プロジェクト名、認定資格、スキル、役割、利用可能時間などのフィルターから識別されたコンサルタントの詳細情報を返します。複数のフィルターを組み合わせて、返されるコンサルタントのリストを絞り込むことができます",
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

ここで、function `getConsultants` の `response_semantics` にある `data_path` は `$.results` です。これは、主要なデータが JSON 内の `results` キーの下に存在することを意味し、システムがそのパスからデータを抽出することを保証します。また、raw データの特定のフィールドを、`properties` フィールド内の対応する意味的プロパティにマッピングする定義も含まれています。

例:

~~~json
     "title": "$.name",
      "subtitle": "$.id",
      "url": "$.consultantPhotoUrl"
~~~

POST リクエストには、類似の関数が存在します:

~~~json
{
    "name": "postAssignConsultant",
    "description": "プロジェクト名、役割、コンサルタント名が指定されたときに、プロジェクトにコンサルタントを割り当て（追加）します。",
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
        "title": "プロジェクト名、役割、コンサルタント名が指定されたときに、プロジェクトにコンサルタントを割り当てます。",
        "body": "* **ProjectName**: {{function.parameters.projectName}}\n* **ConsultantName**: {{function.parameters.consultantName}}\n* **Role**: {{function.parameters.role}}\n* **Forecast**: {{function.parameters.forecast}}"
    }
    }
}
~~~

ここには、アクション実行前にユーザーに確認させるための確認カードとして使用される [AdaptiveCard](https://adaptivecards.io){target=_blank} が含まれています。

下にスクロールすると、プラグインの種類、OAS 定義ファイルの場所、および関数のリストを定義する `runtimes` オブジェクトが表示されます。新しい関数がこのリストに追加されています。

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

最後に、ユーザーに表示されるプロンプトが含まれる会話スターターの情報も含まれており、新しいファイルには projects に関連する会話スターターが追加されています。

~~~json
"capabilities": {
"localization": {},
"conversation_starters": [
    {
    "text": "Trey で担当している project は何ですか？"
    },
    {
    "text": "Trey Research のために Contoso project に 5 時間を請求してください"
    },
    {
    "text": "Azure 認定を受けている Trey の consultants はどれですか？"
    },
    {
    "text": "今利用可能で Python スキルを持つ Trey の consultant を探してください"
    },
    {
    "text": "Contoso project に Avery を Trey の developer として追加してください"
    }
]
}
~~~

<cc-end-step lab="e4" exercise="2" step="4" />

## エクササイズ 3: Copilot でのプラグインテスト

アプリケーションのテストに入る前に、`appPackage\manifest.json` ファイル内のアプリ パッケージの manifest バージョンを更新してください。以下の手順に従ってください:

1. プロジェクトの `appPackage` フォルダー内にある `manifest.json` ファイルを開いてください。

2. JSON ファイル内の `version` フィールドを探してください。以下のようになっているはずです:  
   ```json
   "version": "1.0.0"
   ```

3. バージョン番号を小さな増分に変更してください。例として、以下のように変更します:  
   ```json
   "version": "1.0.1"
   ```

4. 変更後、ファイルを保存してください。

### ステップ 1: アプリケーションの再起動

プロジェクトを停止し、再起動してアプリケーション パッケージを再デプロイすることを強制します。
Microsoft Teams に移動します。Copilot に戻ったら、右側のフライアウト 1️⃣ を開いて以前のチャットやエージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択してください。

![Microsoft 365 Copilot が Trey Genie エージェントの動作を表示しています。右側にはカスタム宣言型エージェントとその他のエージェントが表示され、ページの中央には会話スターターとエージェントへのプロンプト入力欄が表示されています。](../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e4" exercise="3" step="1" />

### ステップ 2: Trey Genie へのプロンプト

次に、"what projects are we doing for adatum?" のようなプロンプトを試してください。

![Microsoft 365 Copilot が API プラグインの呼び出し許可を求める確認カードとともにユーザーにプロンプトしています。'Always allow'、'Allow once'、または 'Cancel' の 3 つのボタンがあります。](../assets/images/extend-m365-copilot-03/test-projects-copilot-1.png)

GET リクエストの場合でも確認カードが表示されることがあります。表示された場合は、プロジェクトの詳細を確認するためにリクエストを許可してください。

![Microsoft 365 Copilot が API プラグインを呼び出した際の Trey Genie エージェントの出力を表示しています](../assets/images/extend-m365-copilot-04/test-projects-copilot-2.png)

<cc-end-step lab="e4" exercise="3" step="2" />

---8<--- "ja/e-congratulations.md"

これで API プラグインの強化が完了しました。ご覧のとおり、引用カードは非常に基本的なものですが、次のラボでは AdaptiveCard を使用して、リッチなカード引用やレスポンスを追加していきます。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/04-enhance-api-plugin" />