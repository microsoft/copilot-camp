---
search:
  exclude: true
---
# ラボ MBA4 - エージェントを Copilot Chat に追加

この最終ラボでは、カスタム エンジン エージェントを Copilot Chat に組み込むために、エージェントのマニフェストを更新します。マニフェストで `copilotAgents` を有効にすると、AI 搭載アシスタントを Copilot のエクスペリエンス内で直接利用できるようになります。

## 演習 1: エージェントを Copilot Chat に追加

### ステップ 1: マニフェストの更新

!!!tip "デバッグを停止"
    この演習を始める前に、前のデバッグ セッションを終了してください。

**M365Agent/AppPackage/manifest.json** に移動し、次のとおりマニフェストのスキーマとバージョンを更新します。 

``` 
"$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.20/MicrosoftTeams.schema.json", 
"manifestVersion": "1.20", 
```

`bots` セクションを次の内容に置き換え、マニフェストに `copilotAgents` を追加します。

> このブロックは、エージェントを M365 Copilot 用のカスタム エンジン エージェントとして宣言します。Microsoft 365 に対し、このエージェントを Copilot Chat に表示し、会話 UI にコマンド リストと会話スターターを表示してユーザーがすばやく始められるように指示します。

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

**Start** または **F5** を押してデバッグを開始します。Microsoft Teams が自動的に起動します。ブラウザーで Microsoft Teams が開いたら、アプリのポップアップを無視し、**Apps > Manage your apps > Upload an app** を選択して **Upload a custom app** を選択します。エクスプローラーでプロジェクト フォルダー `...\ContosoHRAgent\M365Agent\appPackage\build` に移動し、**appPackage.local.zip** を選択します。

![アプリをアップロードする際の Microsoft Teams の UI。「Upload an app」のコマンドが強調表示されている。](https://github.com/user-attachments/assets/5fad723f-b087-4481-8c8c-d5ad87c1bead)

アプリが Teams に再度ポップアップ表示されたら **Add** を選択します。今回は **Open with Copilot** のオプションが表示されるので、**Open with Copilot** を選択して Copilot でエージェントをテストします。

![エージェントが追加された際の Microsoft Teams の UI。「Open with Copilot」のコマンドが強調表示されている。](https://github.com/user-attachments/assets/97f9d9fd-bd90-48b5-983b-b1fea3f85721)

Copilot Chat のエージェント一覧から **ContosoHRAgentlocal** を選択します。会話スターターのいずれかを選択してエージェントとチャットできます。

![Microsoft 365 Copilot 内にホストされたエージェント。アプリケーション マニフェストで構成された会話スターターが表示されている。](https://github.com/user-attachments/assets/2aab299c-23ff-4369-a42c-bd74c66f854d)

エージェントが Copilot Chat でも同様の動作で応答することを確認します。

![Microsoft 365 Copilot にホストされたエージェントが、Microsoft Teams と同じフィードバックを提供している。ユーザーとのインタラクション数をカウントするカウンターも表示されている。](https://github.com/user-attachments/assets/4211f43d-8aef-4262-95e3-1efac7dba495)

---8<--- "ja/b-congratulations.md"

🎉 おめでとうございます！Microsoft 365 Agents SDK と Azure AI Foundry を使用して、最初のカスタム エンジン エージェントを構築しました。

このラボでは、次の内容を学習しました。

* Agent Playground を使用して Azure AI Foundry で AI エージェントを構成
* エンタープライズ ドキュメントをアップロードしてエージェントの回答をグラウンディング
* Visual Studio で M365 Agents SDK を使用してボットをスキャフォールディング
* Semantic Kernel を追加し、Azure AI Agent Service に接続
* Azure AI Foundry エージェントと統合し、リアルタイムでグラウンディングされた推論を実現
* **Microsoft Teams** と **Copilot Chat** でエージェントをデプロイしてテスト

## リソース

- [Copilot Developer Camp](https://aka.ms/copilotdevcamp)
- [M365 Agents SDK docs](https://aka.ms/open-hack/m365agentssdk)
- [Azure AI Foundry](https://ai.azure.com)
- [Copilot 拡張性の詳細](https://aka.ms/extensibility-docs)

<cc-next label="Home" url="/" />

<cc-award path="Build" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/04-bring-agent-to-copilot" />