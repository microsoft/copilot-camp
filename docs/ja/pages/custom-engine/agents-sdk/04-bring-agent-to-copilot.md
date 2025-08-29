---
search:
  exclude: true
---
# Lab MBA4 - エージェントを Copilot Chat に導入

この最後のラボでは、カスタム エンジン エージェントを Copilot Chat に導入するために、エージェントのマニフェストを更新します。`copilotAgents` をアプリ マニフェストで有効にすると、AI 搭載アシスタントを Copilot 体験内で直接利用できるようになります。

## Exercise 1: エージェントを Copilot Chat に導入

### Step 1: マニフェストの更新

!!!tip "デバッグを停止"
    この演習を始める前に、前回のデバッグ セッションを終了してください。

**M365Agent/AppPackage/manifest.json** に移動し、マニフェストのスキーマとバージョンを次のように更新します。

``` 
"$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.22/MicrosoftTeams.schema.json",
"manifestVersion": "1.22",
```

`bots` セクションを以下の内容に置き換え、`copilotAgents` もマニフェストに追加します。

> このブロックでは、エージェントを M365 Copilot 向けのカスタム エンジン エージェントとして宣言しています。Microsoft 365 はこのエージェントを Copilot Chat に公開し、会話 UI にコマンド リストと会話スターターを表示して、ユーザーがすぐに開始できるようにします。

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

**Start** または **F5** を押してデバッグを開始します。Microsoft Teams が自動的に起動します。ブラウザーで Microsoft Teams が開いたら、アプリのポップアップを無視し、**Apps > Manage your apps > Upload an app** を選択して **Upload a custom app** をクリックします。ファイル エクスプローラーでプロジェクト フォルダー `...\ContosoHRAgent\M365Agent\appPackage\build` に移動し、**appPackage.local.zip** を選択します。

![The UI of Microsoft Teams when uploading an app, with the "Upload an app" command highlighted.](https://github.com/user-attachments/assets/5fad723f-b087-4481-8c8c-d5ad87c1bead)

アプリが Teams に表示されたら **Add** を選択します。今回は **Open with Copilot** のオプションが表示されるので、**Open with Copilot** を選択して Copilot 上でエージェントをテストします。

![The UI of Microsoft Teams when the agents gets added, with the "Open with Copilot" command highlighted.](https://github.com/user-attachments/assets/97f9d9fd-bd90-48b5-983b-b1fea3f85721)

Copilot Chat のエージェント一覧から **ContosoHRAgentlocal** を選択します。会話スターターのいずれかをクリックしてエージェントとチャットを始められます。

![The agent hosted inside Microsoft 365 Copilot, showing the conversation starters configured in the application manifest.](https://github.com/user-attachments/assets/a1d061c7-c58f-4a1e-9481-4d6a60d85e3b)

Copilot Chat 上でも、エージェントが同様の動作で応答することを確認してください。

![The agent hosted in Microsoft 365 Copilot providing the same feedback as the one provided in Microsoft Teams, including evidence of the counter to count the number of interactions with the user.](https://github.com/user-attachments/assets/caedced5-1247-44ed-b12f-78827f4e4784)

---8<--- "ja/b-congratulations.md"

🎉 おめでとうございます! Microsoft 365 Agents SDK と Azure AI Foundry を使用して、初めてのカスタム エンジン エージェントを構築しました。

このラボで学んだこと:

* Agent Playground を使用して Azure AI Foundry に AI エージェントを構成する方法
* 企業ドキュメントをアップロードしてエージェントの応答を根拠付ける方法
* Visual Studio で M365 Agents SDK を使用してボットをスキャフォールディングする方法
* Semantic Kernel を追加し、Azure AI Agent Service に接続する方法
* ボットを Azure AI Foundry のエージェントと統合してリアルタイムで根拠のある推論を行う方法
* **Microsoft Teams** と **Copilot Chat** にエージェントをデプロイしてテストする方法

## リソース

- [Copilot Developer Camp](https://aka.ms/copilotdevcamp)
- [M365 Agents SDK docs](https://aka.ms/open-hack/m365agentssdk)
- [Azure AI Foundry](https://ai.azure.com)
- [Copilot 拡張性の詳細](https://aka.ms/extensibility-docs)

<cc-next label="Home" url="/" />

<cc-award path="Build" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/04-bring-agent-to-copilot--ja" />