---
search:
  exclude: true
---
# ラボ MBA4 - エージェントを Copilot Chat に追加

In this final lab, you’ll bring your custom engine agent into Copilot Chat by updating the agent's manifest. By enabling copilotAgents in the app manifest, you’ll make your AI-powered assistant available directly inside the Copilot experience.

## 演習 1: エージェントを Copilot Chat に追加

### Step 1: マニフェストを更新する

!!!tip "デバッグを停止"
    この演習を始める前に、前回のデバッグ セッションを終了してください。

**M365Agent/AppPackage/manifest.json** に移動し、次のようにマニフェストの schema と version を更新します。 

``` 
"$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.22/MicrosoftTeams.schema.json",
"manifestVersion": "1.22",
```

bots セクションを次の内容に置き換え、`copilotAgents` をマニフェストに追加します:

> このブロックは、エージェントを Microsoft 365 Copilot 用の Custom Engine エージェントとして宣言します。Microsoft 365 に対し、Copilot Chat にこのエージェントを表示し、会話 UI にコマンド リストと会話スターターを表示して ユーザー がすばやく開始できるように指示します。

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

**Start** または **F5** を押してデバッグを開始します。Microsoft Teams が自動的に起動します。ブラウザーで Microsoft Teams が開いたら、アプリのポップアップは無視し、**Apps > Manage your apps > Upload an app** を選択してから **Upload a custom app** を選択します。エクスプローラーでプロジェクト フォルダー `...\ContosoHRAgent\M365Agent\appPackage\build` に移動し、**appPackage.local.zip** を選択します。

![アプリをアップロードする際の Microsoft Teams の UI。「Upload an app」コマンドが強調表示されています。](https://github.com/user-attachments/assets/5fad723f-b087-4481-8c8c-d5ad87c1bead)

アプリが Teams に再度表示されたら **Add** を選択します。今回は **Open with Copilot** のオプションが表示されるので、**Open with Copilot** を選択して Copilot 上でエージェントをテストします。

![エージェントが追加された際の Microsoft Teams の UI。「Open with Copilot」コマンドが強調表示されています。](https://github.com/user-attachments/assets/97f9d9fd-bd90-48b5-983b-b1fea3f85721)

Copilot Chat のエージェント一覧から **ContosoHRAgentlocal** を選択します。会話スターターのいずれかを選択して、エージェントと対話できます。

![Microsoft 365 Copilot 内にホストされたエージェント。アプリケーション マニフェストで設定した会話スターターが表示されています。](https://github.com/user-attachments/assets/a1d061c7-c58f-4a1e-9481-4d6a60d85e3b)

エージェントが Copilot Chat 上でも同様の動作で応答することを確認してください。

![ユーザー との対話回数をカウントするカウンターを含め、Microsoft Teams と同じ応答を返す Microsoft 365 Copilot 内のエージェント。](https://github.com/user-attachments/assets/caedced5-1247-44ed-b12f-78827f4e4784)


---8<--- "ja/b-congratulations.md"

🎉 おめでとうございます! Microsoft 365 Agents SDK と Microsoft Foundry を使用して、初めての Custom Engine エージェントを構築しました。

このラボでは、次の内容を学習しました:

* Agent Playground を使用して Microsoft Foundry で AI エージェントを構成する
* 企業ドキュメントをアップロードしてエージェントの回答を根拠付ける
* Visual Studio で M365 Agents SDK を使用してボットをスキャフォールディングする
* Semantic Kernel を追加し、Azure AI Agent Service に接続する
* 実時間で根拠に基づいた推論を行うため Microsoft Foundry エージェントとボットを統合する
* **Microsoft Teams** と **Copilot Chat** でエージェントをデプロイしてテストする

## リソース

- [Copilot Developer Camp](https://aka.ms/copilotdevcamp)
- [M365 Agents SDK docs](https://aka.ms/open-hack/m365agentssdk)
- [Microsoft Foundry](https://ai.azure.com)
- [Copilot 拡張性の詳細](https://aka.ms/extensibility-docs)

<cc-next label="Home" url="/" />

<cc-award path="Build" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/04-bring-agent-to-copilot--ja" />