---
search:
  exclude: true
---
# ラボ E5 - Adaptive Card の追加

このラボでは、Microsoft 365 Copilot のテキスト応答をリッチ カードへと強化するために Adaptive Card を使用します。 

このラボで学習する内容:

- Adaptive Card とは
- Adaptive Card を作成してテストする方法
- Microsoft 365 Copilot の応答を Adaptive Card でリッチ コンテンツ化する方法

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/9kb9whCKey4" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を確認できます。</div>
            <div class="note-box">
            📘 <strong>注:</strong> このラボは前回のラボ E4 を基に進めます。ラボ E2～E6 は同じフォルダーで作業を継続できますが、参照用にソリューション フォルダーも提供されています。
    このラボの完成版ソリューションは <a  src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> にあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## はじめに
<details>
<summary>Adaptive Card とは?</summary>

Adaptive Card は、JSON で記述されたプラットフォーム非依存の UI スニペットで、アプリやサービス間でやり取りできます。アプリに配信されると、JSON はネイティブ UI に変換され、環境に自動的に適応します。これにより、主要なプラットフォームやフレームワーク間で軽量な UI を設計・統合できます。
    <div class="video">
      <iframe src="//www.youtube.com/embed/pYe2NqKhJoM" frameborder="0" allowfullscreen></iframe>
      <div>Adaptive Card はあらゆる場所で利用されています</div>
    </div>
</details>

## 演習 1: シンプルな Adaptive Card の作成とテスト

さっそく Adaptive Card を作成する楽しさを体験しましょう。

### 手順 1: JSON で Adaptive Card を定義する

以下は Adaptive Card を定義した JSON です。まずはこれをクリップボードにコピーしてください。

```json
{
  "type": "AdaptiveCard",
  "body": [
    {
      "type": "TextBlock",
      "text": "Hello, Adaptive Cards!",
      "size": "large",
      "weight": "bolder"
    }
  ],
  "actions": [
    {
      "type": "Action.OpenUrl",
      "title": "Click me",
      "url":"https://www.contoso.com"
    }
  ],
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "version": "1.3"
}
```

この JSON は、テキスト ブロックとボタンを含むシンプルな Adaptive Card を定義しています。

<cc-end-step lab="e5" exercise="1" step="1" />

### 手順 2: Adaptive Card をテストする

Adaptive Card をテストするには、[Adaptive Cards Designer](https://adaptivecards.io/designer/){target="_blank"} を使用できます。

1. [Adaptive Cards Designer](https://adaptivecards.io/designer/){target="_blank"} を開きます。  
2. `adaptiveCard.json` ファイルの JSON コンテンツをコピーします。  
3. デザイナー下部の「Card Payload Editor」セクションに JSON を貼り付けます。  
4. デザイナー上部で Adaptive Card のライブ プレビューが表示されます。  

おめでとうございます! これでプラグイン用の Adaptive Card を開発するスキルを身に付けました。

<cc-end-step lab="e5" exercise="1" step="2" />

## 演習 2: プラグイン マニフェストを更新する 

Adaptive Card を使用した応答テンプレートを追加するため、**appPackage** フォルダー内の **trey-plugin.json** プラグイン マニフェスト ファイルを更新します。各関数/ API 呼び出しを見つけてテンプレートを追加していきます。

### 手順 1: GET /api/consultants 要求用の Adaptive Card を追加する

- **getConsultants** 関数を見つけ、`properties` ノードの後に以下の `static_template` ノードを追加します。

```JSON
 "static_template": {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
              {
                "type": "Container",
                "$data": "${$root}",
                "items": [
                  {
                    "speak": "${name}",
                    "type": "ColumnSet",
                    "columns": [
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "TextBlock",
                            "text": "${name}",
                            "weight": "bolder",
                            "size": "extraLarge",
                            "spacing": "none",
                            "wrap": true,
                            "style": "heading"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${email}",
                            "wrap": true,
                            "spacing": "none"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${phone}",
                            "wrap": true,
                            "spacing": "none"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${location.city}, ${location.country}",
                            "wrap": true
                          }
                        ]
                      },
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "Image",
                            "url": "${consultantPhotoUrl}",
                            "altText": "${name}"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }   
             
            ]
 }
```

<cc-end-step lab="e5" exercise="2" step="1" />

### 手順 2: GET /api/me 要求用の Adaptive Card を追加する

- **getUserInformation** 関数を見つけ、`properties` ノードの後に以下の `static_template` ノードを追加します。

```json

  "static_template":{
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
              {
                "type": "Container",
                "$data": "${$root}",
                "items": [
                  {
                    "speak": "${name}",
                    "type": "ColumnSet",
                    "columns": [
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "TextBlock",
                            "text": "${name}",
                            "weight": "bolder",
                            "size": "extraLarge",
                            "spacing": "none",
                            "wrap": true,
                            "style": "heading"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${email}",
                            "wrap": true,
                            "spacing": "none"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${phone}",
                            "wrap": true,
                            "spacing": "none"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${location.city}, ${location.country}",
                            "wrap": true
                          }
                        ]
                      },
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "Image",
                            "url": "${consultantPhotoUrl}",
                            "altText": "${name}"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }   
             
            ]
  }
```

<cc-end-step lab="e5" exercise="2" step="2" />

### 手順 3: GET /api/projects 要求用の Adaptive Card を追加する

- **getProjects** 関数を見つけ、`properties` ノードの後に以下の `static_template` ノードを追加します。

```JSON
  "static_template": {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
              {
                "type": "Container",
                "$data": "${$root}",
                "items": [
                  {
                    "speak": "${description}",
                    "type": "ColumnSet",
                    "columns": [
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "TextBlock",
                            "text": "${name}",
                            "weight": "bolder",
                            "size": "extraLarge",
                            "spacing": "none",
                            "wrap": true,
                            "style": "heading"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${description}",
                            "wrap": true,
                            "spacing": "none"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${location.city}, ${location.country}",
                            "wrap": true
                          },
                          {
                            "type": "TextBlock",
                            "text": "${clientName}",
                            "weight": "Bolder",
                            "size": "Large",
                            "spacing": "Medium",
                            "wrap": true,
                            "maxLines": 3
                          },
                          {
                            "type": "TextBlock",
                            "text": "${clientContact}",
                            "size": "small",
                            "wrap": true
                          },
                          {
                            "type": "TextBlock",
                            "text": "${clientEmail}",
                            "size": "small",
                            "wrap": true
                          }
                        ]
                      },
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "Image",
                            "url": "${location.mapUrl}",
                            "altText": "${location.street}"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "TextBlock",
                "text": "Project Metrics",
                "weight": "Bolder",
                "size": "Large",
                "spacing": "Medium",
                "horizontalAlignment": "Center",
                "separator": true
              },
              {
                "type": "ColumnSet",
                "columns": [
                  {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "Forecast This Month",
                        "weight": "Bolder",
                        "spacing": "Small",
                        "horizontalAlignment": "Center"
                      },
                      {
                        "type": "TextBlock",
                        "text": "${forecastThisMonth} ",
                        "size": "ExtraLarge",
                        "weight": "Bolder",
                        "horizontalAlignment": "Center"
                      }
                    ]
                  },
                  {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "Forecast Next Month",
                        "weight": "Bolder",
                        "spacing": "Small",
                        "horizontalAlignment": "Center"
                      },
                      {
                        "type": "TextBlock",
                        "text": "${forecastNextMonth} ",
                        "size": "ExtraLarge",
                        "weight": "Bolder",
                        "horizontalAlignment": "Center"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "ColumnSet",
                "columns": [
                  {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "Delivered Last Month",
                        "weight": "Bolder",
                        "spacing": "Small",
                        "horizontalAlignment": "Center"
                      },
                      {
                        "type": "TextBlock",
                        "text": "${deliveredLastMonth} ",
                        "size": "ExtraLarge",
                        "weight": "Bolder",
                        "horizontalAlignment": "Center"
                      }
                    ]
                  },
                  {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "Delivered This Month",
                        "weight": "Bolder",
                        "spacing": "Small",
                        "horizontalAlignment": "Center"
                      },
                      {
                        "type": "TextBlock",
                        "text": "${deliveredThisMonth} ",
                        "size": "ExtraLarge",
                        "weight": "Bolder",
                        "horizontalAlignment": "Center"
                      }
                    ]
                  }
                ]
              }
            ],
            "actions": [
              {
                "type": "Action.OpenUrl",
                "title": "View map",
                "url": "${location.mapUrl}"
              }
            ]
  }
```

<cc-end-step lab="e5" exercise="2" step="3" />

### 手順 4: POST /api/billHours 要求用の Adaptive Card を追加する

- **postBillhours** 関数を見つけ、`properties` ノードの後に以下の `static_template` ノードを追加します。

```JSON
"static_template": {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.5",
            "body": [
              {
                "type": "TextBlock",
                "text": "Project Status Summary",
                "weight": "Bolder",
                "size": "Large",
                "separator": true
              },              
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Client Name",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.clientName, results.clientName, 'N/A')}",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Project Name",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.projectName, results.projectName, 'N/A')}",
                    "wrap": true
                  }
                ]
              },  
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Remaining Forecast",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.remainingForecast, results.remainingForecast, 'N/A')}",
                    "wrap": true
                  }
                ]
              },           
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Message",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.message, results.message, 'N/A')}",
                    "wrap": true
                  }
                ]
              }
            ]
          }
```

<cc-end-step lab="e5" exercise="2" step="4" />

### 手順 5: POST /api/assignConsultant 要求用の Adaptive Card を追加する

- **postAssignConsultant** 関数を見つけ、`properties` ノードの後に以下の `static_template` ノードを追加します。

```JSON
 "static_template": {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.5",
            "body": [
              {
                "type": "TextBlock",
                "text": "Project Overview",
                "weight": "Bolder",
                "size": "Large",
                "separator": true,
                "spacing": "Medium"
              },              
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Client Name",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.clientName, results.clientName, 'N/A')}",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Project Name",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.projectName, results.projectName, 'N/A')}",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Consultant Name",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.consultantName, results.consultantName, 'N/A')}",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Remaining Forecast",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.remainingForecast, results.remainingForecast, 'N/A')}",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Message",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.message, results.message, 'N/A')}",
                    "wrap": true
                  }
                ]
              }            
            ]          
          }

```

<cc-end-step lab="e5" exercise="2" step="5" />

## 演習 3: Copilot でプラグインをテストする

アプリケーションをテストする前に、`appPackage\manifest.json` ファイルでアプリ パッケージのマニフェスト バージョンを更新します。次の手順に従ってください。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` ファイルを開きます。  

2. JSON ファイル内の `version` フィールドを探します。次のようになっています:  
   ```json
   "version": "1.0.1"
   ```

3. バージョン番号を小数点レベルでインクリメントします。例:  
   ```json
   "version": "1.0.2"
   ```

4. 変更後、ファイルを保存します。

### 手順 1: プラグインをインストールする

プロジェクトを停止して再起動し、アプリケーション パッケージを再デプロイします。  
Microsoft Teams に自動的に遷移します。その後 Copilot に戻り、右側のフライアウト 1️⃣ を開いて以前のチャットと宣言型エージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot showing the Trey Genie agent in action. On the right side there is the custom declarative agent, together with other agents. In the main body of the page there are the conversation starters and the textbox to provide a prompt to the agent.](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e5" exercise="3" step="1" />

### 手順 2: Adaptive Card を表示する

次のようなプロンプトを試してみましょう。

 *adatum ではどのプロジェクトを実施していますか?*

テキスト応答だけでなく、プロジェクト情報を含むリッチ カードも表示されるはずです。

![The response of the agent based on an Adaptive Card showing rich content, including a table with metrics and an image.](../../assets/images/extend-m365-copilot-04/project-adaptive.png)

次に、POST 操作のプロンプトを試してみます。

 *trey research で woodgrove bank に 1 時間を請求してください*

この要求は Copilot が API プラグインへ POST でデータを送信するため、*Confirm* ボタンを選択して許可する必要があります。

![A card generated by Copilot to confirm sending data to the API plugin.](../../assets/images/extend-m365-copilot-04/bill-hours-confirm.png)

確認すると、テキスト応答だけでなく、プロジェクトの情報を含むリッチ カードも表示されます。

![The response of the agent based on an Adaptive Card showing rich content about the project status.](../../assets/images/extend-m365-copilot-04/bill-hours.png)

他のプロンプトも試して、Microsoft 365 Copilot からの応答が改善されたことを確認してください。

<cc-end-step lab="e5" exercise="3" step="2" />

---8<--- "ja/e-congratulations.md"

Adaptive Card 応答を使用する最初の API プラグインの追加が完了しました。次のラボでは API に認証を追加します。

「Use OAuth 2.0 with Agents Toolkit」のラボへ進み、認証を追加しましょう。これは最も簡単な方法で、Agents Toolkit の自動 Entra ID 登録による F5 プロジェクト開始を体験できます。

  <cc-next url="../06a-add-authentication-ttk" label="Next" />


<details>
<summary>手動手順での認証に関するその他のラボ</summary>
OAuth 2.0 が Agents Toolkit でサポートされる前に作成された古いラボがあります。これらは、アプリ パッケージに認証を追加し、Web サービスでアクセストークンを検証する方法を示します。主な違いは、Entra ID と Microsoft 365 でアプリを登録する方法にあります。

本ラボのプロジェクトを基に進められるので、ぜひご覧ください。

  1. **Use OAuth 2.0 with Manual Setup** - Entra ID 登録の詳細をすべてガイドし、仕組みを深く理解できます。他の ID プロバイダーに適用する際にも役立ちます。  
  <cc-next url="../06b-add-authentication" label="OAuth with Manual Setup" />

  2. **Use Single Sign-on** - 新しい機能であるシームレスな Entra ID 認証を手動で設定します。  
  <cc-next url="../06c-add-sso" label="Single Sign-on with Manual Setup" />
</details>

  
<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/04-add-adaptive-card--ja" />