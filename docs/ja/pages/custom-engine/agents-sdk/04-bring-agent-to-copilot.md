---
search:
  exclude: true
---
# ラボ MBA4 - Copilot Chat へのエージェント導入

この最終ラボでは、カスタムエンジン エージェントを Copilot Chat に組み込むために、エージェントのマニフェストを更新します。app マニフェストで `copilotAgents` を有効にすることで、AI 搭載アシスタントを Copilot エクスペリエンス内で直接利用できるようになります。

## 演習 1: Copilot Chat へのエージェント導入

### Step 1: マニフェストの更新

!!!tip "デバッグの停止"
    この演習を進める前に、前のデバッグ セッションを閉じてください。

**M365Agent/AppPackage/manifest.json** に移動し、以下のようにマニフェストのスキーマとバージョンを更新します。 

``` 
"$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.20/MicrosoftTeams.schema.json", 
"manifestVersion": "1.20", 
```

`bots` セクションを次の内容に置き換え、さらに `copilotAgents` をマニフェストに追加します。

> このブロックは、エージェントを M365 Copilot 用のカスタムエンジン エージェントとして宣言します。Microsoft 365 に対して、このエージェントを Copilot Chat に公開し、コマンド リストを会話 UI に表示して、ユーザーがすぐに始められるように会話スターターを提示するよう指示します。

```   
  "bots": [ 
    { 
      "botId": "${{BOT_ID}}", 
      "scopes": [ 
        "personal", 
        "team", 
        "groupChat" 
      ], 
      "supportsFiles": false, 
      "isNotificationOnly": false, 
      "commandLists": [ 
        { 
          "scopes": [ "personal", "team", "groupChat" ], 
          "commands": [ 
            { 
              "title": "Emergency and Mental Health",
              "description": "What’s the difference between Northwind Standard and Health Plus when it comes to emergency and mental health coverage?" 
            }, 
            { 
              "title": "PerksPlus Details", 
              "description": "Can I use PerksPlus to pay for both a rock climbing class and a virtual fitness program?" 
            }, 
            { 
              "title": "Contoso Electronics Values", 
              "description": "What values guide behavior and decision making at Contoso Electronics?" 
            } 
          ] 
        } 
      ] 
    } 
  ], 
  "copilotAgents": { 
    "customEngineAgents": [ 
      { 
        "id": "${{BOT_ID}}", 
        "type": "bot" 
      } 
    ] 
  }, 
```

**Start** または **F5** を押してデバッグを開始します。Microsoft Teams が自動的に起動します。ブラウザーで Microsoft Teams が開いたら、アプリのポップアップは無視して **Apps > Manage your apps > Upload an app** を選択し、**Upload a custom app** を選択します。ファイル エクスプローラーでプロジェクト フォルダー `...\ContosoHRAgent\M365Agent\appPackage\build` に移動し、**appPackage.local.zip** を選択します。

![The UI of Microsoft Teams when uploading an app, with the "Upload an app" command highlighted.](https://github.com/user-attachments/assets/5fad723f-b087-4481-8c8c-d5ad87c1bead)

アプリが Teams 上に再度表示されたら **Add** を選択します。今回は **Open with Copilot** オプションが表示されますので、**Open with Copilot** を選択して Copilot 上でエージェントをテストします。

![The UI of Microsoft Teams when the agents gets added, with the "Open with Copilot" command highlighted.](https://github.com/user-attachments/assets/97f9d9fd-bd90-48b5-983b-b1fea3f85721)

Copilot Chat のエージェント一覧から **ContosoHRAgentlocal** を選択します。会話スターターのいずれかを選択して、エージェントとチャットを開始できます。

![The agent hosted inside Microsoft 365 Copilot, showing the conversation starters configured in the application manifest.](https://github.com/user-attachments/assets/2aab299c-23ff-4369-a42c-bd74c66f854d)

エージェントが Copilot Chat 上でも同様の動作で応答することを確認してください。

![The agent hosted in Microsoft 365 Copilot providing the same feedback as the one provided in Microsoft Teams, including evidence of the counter to count the number of interactions with the user.](https://github.com/user-attachments/assets/4211f43d-8aef-4262-95e3-1efac7dba495)

---8<--- "ja/b-congratulations.md"

🎉 おめでとうございます！Microsoft 365 Agents SDK と Azure AI Foundry を使って、初めてのカスタム エンジン エージェントを構築しました。

このラボで学習した内容:

* Agent Playground を使用して Azure AI Foundry で AI エージェントを構成
* エンタープライズ ドキュメントをアップロードしてエージェントの応答をグラウンディング
* Visual Studio で M365 Agents SDK を使ってボットをスキャフォールディング
* Semantic Kernel を追加し、Azure AI Agent Service に接続
* Azure AI Foundry のエージェントと統合し、リアルタイムでグラウンディングされた推論を実現
* **Microsoft Teams** と **Copilot Chat** でエージェントをデプロイしてテスト

## リソース

- [Copilot Developer Camp](https://aka.ms/copilotdevcamp)
- [M365 Agents SDK docs](https://aka.ms/open-hack/m365agentssdk)
- [Azure AI Foundry](https://ai.azure.com)
- [Copilot 拡張性の詳細](https://aka.ms/extensibility-docs)

<cc-next label="Home" url="/" />

<cc-award path="Build" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/04-bring-agent-to-copilot--ja" />