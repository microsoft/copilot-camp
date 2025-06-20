---
search:
  exclude: true
---
# ラボ E5 - Adaptive Card の追加

このラボでは、Microsoft 365 Copilot の応答をテキストからリッチ カードへと強化するために Adaptive Cards を使用します。 

このラボで学習する内容:

- Adaptive Card とは
- Adaptive Card を作成してテストする方法
- Microsoft 365 Copilot の応答を Adaptive Card でリッチ コンテンツ化する方法

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/9kb9whCKey4" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を短時間で確認できます。</div>
            <div class="note-box">
            📘 <strong>注意:</strong> このラボは前回のラボ E4 を基にしています。同じフォルダーでラボ E2～E6 を継続して作業できますが、参考用にソリューション フォルダーも用意しています。  
    このラボの完成版ソリューションは <a  src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> にあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## はじめに
<details>
<summary>Adaptive Card とは？</summary>

Adaptive Card は、JSON で記述されたプラットフォームに依存しない UI スニペットです。アプリやサービス間でやり取りされた後、アプリに配信されるとネイティブ UI へ変換され、環境に自動的に適応します。これにより、主要なプラットフォームとフレームワークで軽量 UI の設計と統合が可能になります。
    <div class="video">
      <iframe src="//www.youtube.com/embed/pYe2NqKhJoM" frameborder="0" allowfullscreen></iframe>
      <div>Adaptive Card はあらゆる場所で使われています</div>
    </div>
</details>

## 演習 1: シンプルな Adaptive Card を作成してテストする

さっそく Adaptive Card を作成する楽しさを体験しましょう。

### 手順 1: JSON で Adaptive Card を定義する

以下は Adaptive Card の JSON 定義です。まずはクリップボードへコピーしてください。

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

Adaptive Card をテストするには、[Adaptive Cards Designer](https://adaptivecards.io/designer/){target="_blank"} を使用します。

1. [Adaptive Cards Designer](https://adaptivecards.io/designer/){target="_blank"} を開きます。  
2. `adaptiveCard.json` ファイルから JSON コンテンツをコピーします。  
3. Designer 画面下部の「Card Payload Editor」領域へ JSON を貼り付けます。  
4. 画面上部に Adaptive Card のライブ プレビューが表示されます。  

おめでとうございます！ これでプラグイン向けの Adaptive Card を開発するスキルを習得しました。

<cc-end-step lab="e5" exercise="1" step="2" />

## 演習 2: プラグイン マニフェストを更新する 

**appPackage** フォルダー内の **trey-plugin.json** というプラグイン マニフェスト ファイルに、Adaptive Card を使用した応答テンプレートを追加します。各関数または API 呼び出しを見つけてテンプレートを更新していきます。

### 手順 1: GET /api/consultants リクエスト用の Adaptive Card を追加する

- **getConsultants** 関数を探し、`properties` ノードの後に次の `static_template` ノードを追加します。

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

### 手順 2: GET /api/me リクエスト用の Adaptive Card を追加する

- **getUserInformation** 関数を探し、`properties` ノードの後に次の `static_template` ノードを追加します。

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

### 手順 3: GET /api/projects リクエスト用の Adaptive Card を追加する

- **getProjects** 関数を探し、`properties` ノードの後に次の `static_template` ノードを追加します。

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

### 手順 4: POST /api/billHours リクエスト用の Adaptive Card を追加する

- **postBillhours** 関数を探し、`properties` ノードの後に次の `static_template` ノードを追加します。

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

### 手順 5: POST /api/assignConsultant リクエスト用の Adaptive Card を追加する

- **postAssignConsultant** 関数を探し、`properties` ノードの後に次の `static_template` ノードを追加します。

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

アプリケーションをテストする前に `appPackage\manifest.json` にあるマニフェスト バージョンを更新します。以下の手順に従ってください。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` ファイルを開きます。  

2. JSON ファイル内の `version` フィールドを探します。例:  
   ```json
   "version": "1.0.1"
   ```

3. バージョン番号をわずかにインクリメントします。例:  
   ```json
   "version": "1.0.2"
   ```

4. 変更後、ファイルを保存します。

### 手順 1: プラグインをインストールする

プロジェクトを停止して再起動し、アプリケーション パッケージを再デプロイします。  
Microsoft Teams が開いたら、Copilot に戻り、右側のフライアウト 1️⃣ を開いて以前のチャットと宣言型エージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot が Trey Genie エージェントを実行している様子。右側にカスタム宣言型エージェントと他のエージェントが表示されている。メイン ボディには会話スターターとプロンプト入力欄がある。](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e5" exercise="3" step="1" />

### 手順 2: Adaptive Card を表示する

次のようなプロンプトを試してください。

 *adatum 向けに進行中のプロジェクトは何ですか？*

テキスト応答だけでなく、プロジェクト情報を含むリッチ カードが表示されます。

![エージェントの応答として表示された Adaptive Card。メトリクスを含むテーブルや画像などのリッチ コンテンツが含まれている。](../../assets/images/extend-m365-copilot-04/project-adaptive.png)

次に、POST 操作のプロンプトを試します。

 *trey research で woodgrove bank に 1 時間を課金してください*

このリクエストでは Copilot が API プラグインへ POST でデータを送信する必要があるため、*Confirm* ボタンを選択して許可を与えます。

![API プラグインへデータ送信を確認するため Copilot が生成したカード。](../../assets/images/extend-m365-copilot-04/bill-hours-confirm.png)

確認後、テキスト応答だけでなくプロジェクト状況のリッチ カードが表示されます。

![Adaptive Card に基づいたエージェントの応答。プロジェクトのステータスに関するリッチ コンテンツが含まれている。](../../assets/images/extend-m365-copilot-04/bill-hours.png)

他のプロンプトもテストして、Microsoft 365 Copilot の改善された応答を確認してみてください。

<cc-end-step lab="e5" exercise="3" step="2" />

---8<--- "ja/e-congratulations.md"

Adaptive Card 応答を最初の API プラグインへ追加する作業が完了しました。次のラボでは API に認証を追加していきます。

ここでは 3 つの選択肢があります。いずれもアプリ パッケージ ファイルへ認証を追加し、Web サービスで受信したアクセス トークンを検証する方法を紹介します。違いは Entra ID と Microsoft 365 へのアプリ登録方法です。

  1. **OAuth 2.0 と Agents Toolkit を使用** - 最も簡単な方法です。F5 でプロジェクトを開始する体験のために、Agents Toolkit の自動 Entra ID 登録を設定する方法を学びます  
  <cc-next url="../06a-add-authentication-ttk" label="OAuth with Agents Toolkit" />

  2. **OAuth 2.0 を手動で設定** - Entra ID 登録の詳細をすべて手動で行い、内部で何が起こっているかを理解します。他の ID プロバイダーでの動作に合わせる際にも役立ちます  
  <cc-next url="../06b-add-authentication" label="OAuth with Manual Setup" />

  3. **Single Sign-on を使用** - Entra ID でシームレスに認証できる新機能。手動設定  
  <cc-next url="../06c-add-sso" label="Single Sign-on with Manual Setup" />
  
<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/04-add-adaptive-card" />