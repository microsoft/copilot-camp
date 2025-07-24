---
search:
  exclude: true
---
# ラボ E5 – アダプティブカードの追加

本ラボでは、Microsoft 365 Copilot からの応答をテキストからリッチカードを用いた Adaptive Cards によりさらに強化します。

本ラボで学べること:

- Adaptive Cards とは
- Adaptive Card の作成とテスト方法
- Microsoft 365 Copilot の応答を、Adaptive Cards を用いたリッチコンテンツに更新する方法

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/9kb9whCKey4" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をすばやく把握できます。</div>
            <div class="note-box">
            📘 <strong>注意事項:</strong> このラボは前回のラボ E4 をベースにしています。同じフォルダー内でラボ E2～E6 の作業を継続できるはずですが、参考のためにソリューションフォルダーが提供されています。
    完成した本ラボのソリューションは、<a  src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> にあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## 概要
<details>
<summary>Adaptive Cards とは</summary>

Adaptive Cards は、プラットフォームに依存しない UI スニペットで、JSON 形式で記述され、アプリケーションやサービス間でやり取りできます。アプリに配信されると、JSON はネイティブ UI に変換され、環境に自動的に適応します。これにより、主要なプラットフォームやフレームワーク間で軽量な UI の設計および統合が可能となります。
    <div class="video">
      <iframe src="//www.youtube.com/embed/pYe2NqKhJoM" frameborder="0" allowfullscreen></iframe>
      <div>Adaptive Cards はあらゆる場所にあります</div>
    </div>
</details>

## 演習 1: シンプルな Adaptive Card 作成とテスト

Adaptive Cards の作成がどれほど楽しいかを体験してみましょう。

### 手順 1: JSON でアダプティブカードを定義

以下は JSON 形式のアダプティブカードです。まずはこれをクリップボードにコピーしてください。

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

この JSON は、テキストブロックとボタンを備えたシンプルなアダプティブカードを定義しています。

<cc-end-step lab="e5" exercise="1" step="1" />

### 手順 2: アダプティブカードのテスト

アダプティブカードをテストするには、[Adaptive Cards Designer](https://adaptivecards.io/designer/){target="_blank"} を使用できます。

1. [Adaptive Cards Designer](https://adaptivecards.io/designer/){target="_blank"} を開きます。
2. `adaptiveCard.json` ファイルから JSON コンテンツをコピーします。
3. コピーした JSON コンテンツを、デザイナー下部の「Card Payload Editor」セクションに貼り付けます。
4. デザイナー上部にアダプティブカードのライブプレビューが表示されます。

おめでとうございます。これでプラグイン用のアダプティブカードを自在に開発できるようになりました！

<cc-end-step lab="e5" exercise="1" step="2" />

## 演習 2: プラグインマニフェストの更新

プラグインマニフェストファイル **trey-plugin.json** （**appPackage** フォルダー内）を、アダプティブカードを使用した応答テンプレートで更新します。
各関数または API 呼び出しを見つけ、テンプレートを更新します。

### 手順 1: GET /api/consultants リクエスト用アダプティブカードの追加

- 関数 **getConsultants** を見つけ、`properties` ノードの後に `static_template` ノードを追加します。

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

### 手順 2: GET /api/me リクエスト用アダプティブカードの追加

- 関数 **getUserInformation** を見つけ、`properties` ノードの後に `static_template` ノードを追加します。

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

### 手順 3: GET /api/projects リクエスト用アダプティブカードの追加

- 関数 **getProjects** を見つけ、`properties` ノードの後に `static_template` ノードを追加します。

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

### 手順 4: POST /api/billHours リクエスト用アダプティブカードの追加

- 関数 **postBillhours** を見つけ、`properties` ノードの後に `static_template` ノードを追加します。

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

### 手順 5: POST /api/assignConsultant リクエスト用アダプティブカードの追加

- 関数 **postAssignConsultant** を見つけ、`properties` ノードの後に `static_template` ノードを追加します。

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

## 演習 3: Copilot でのプラグインのテスト

アプリケーションをテストする前に、`appPackage\manifest.json` ファイル内のアプリパッケージのマニフェストバージョンを更新します。以下の手順に従ってください：

1. プロジェクトの `appPackage` フォルダー内にある `manifest.json` ファイルを開きます。

2. JSON ファイル内の `version` フィールドを見つけます。以下のようになっているはずです：  
   ```json
   "version": "1.0.1"
   ```

3. バージョン番号を少し増やします。たとえば、以下のように変更します：  
   ```json
   "version": "1.0.2"
   ```

4. 変更後、ファイルを保存します。

### 手順 1: プラグインのインストール

プロジェクトを停止し再起動して、アプリケーションパッケージの再デプロイを強制します。
Microsoft Teams に移動します。Copilot に戻ったら、右側のフライアウト 1️⃣ を開いて以前のチャットと宣言型エージェントを表示し、 Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot showing the Trey Genie agent in action. On the right side there is the custom declarative agent, together with other agents. In the main body of the page there are the conversation starters and the textbox to provide a prompt to the agent.](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e5" exercise="3" step="1" />

### 手順 2: アダプティブカードの表示

次に、以下のようなプロンプトを試してください

*what projects are we doing for adatum?*

テキスト応答だけでなく、プロジェクトの情報を含むリッチカードも受け取ることができます。

![リッチなコンテンツを表示するアダプティブカードに基づいたエージェントの応答です。テーブル（メトリクス）や画像が含まれています。](../../assets/images/extend-m365-copilot-04/project-adaptive.png)

次に、以下のような POST 操作のプロンプトを試してください

*trey research 内の woodgrove bank に 1 時間分の請求をしてください*

このリクエストは Copilot が POST を介して API プラグインへいくつかのデータを送信する必要があるため、*Confirm* ボタンを選択して Copilot に送信を許可するか確認する必要があります。

![API プラグインへのデータ送信を確認するために Copilot が生成したカードです。](../../assets/images/extend-m365-copilot-04/bill-hours-confirm.png)

一旦確認すると、テキスト応答だけでなく、プロジェクトの情報を含むリッチカードも受け取ることができます。

![プロジェクトの状況に関するリッチなコンテンツを表示するアダプティブカードに基づいたエージェントの応答です。](../../assets/images/extend-m365-copilot-04/bill-hours.png)

他のプロンプトも試して、Microsoft 365 Copilot の改善された応答をご確認ください。

<cc-end-step lab="e5" exercise="3" step="2" />

---8<--- "ja/e-congratulations.md"

初回の API プラグインにアダプティブカード応答を追加する作業が完了しました。これで、次のラボへ進んで API に認証を追加する準備が整いました。

ここで 3 つの選択肢があり、いずれもアプリパッケージファイルへ認証を追加し、Web サービスで受信するアクセス トークンを検証する方法を示しています。違いは Entra ID と Microsoft 365 におけるアプリの登録方法にあります。

  1. **Agents Toolkit を使用した OAuth 2.0** - これは最も簡単なアプローチです。F5 プロジェクト開始時の体験のために、Agents Toolkit の自動 Entra ID 登録の設定方法を学びます
  <cc-next url="../06a-add-authentication-ttk" label="OAuth with Agents Toolkit" />

  2. **手動セットアップによる OAuth 2.0 の利用** - Entra ID 登録の詳細すべてを案内するため、実際に何が起こっているのかを理解し、別のアイデンティティ プロバイダーに対応するソリューションへの適用に役立てることができます
  <cc-next url="../06b-add-authentication" label="OAuth with Manual Setup" />

  3. **シングルサインオンの利用** - シームレスな Entra ID 認証のための新しい機能、手動セットアップ
  <cc-next url="../06c-add-sso" label="Single Sign-on with Manual Setup" />
  
<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/04-add-adaptive-card" />