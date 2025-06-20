---
search:
  exclude: true
---
# ラボ MBA4 - エージェントを Copilot Chat へ接続

この最終ラボでは、カスタムエンジン エージェントを Copilot Chat に組み込むために、エージェントのマニフェストを更新します。`copilotAgents` をアプリ マニフェストで有効にすることで、AI 搭載アシスタントを Copilot のエクスペリエンス内で直接利用できるようになります。

## 演習 1: エージェントを Copilot Chat に追加

### 手順 1: マニフェストを更新

!!!tip "デバッグの停止"
    この演習に進む前に、前回のデバッグ セッションを終了してください。

**M365Agent/AppPackage/manifest.json** を開き、次のようにマニフェストのスキーマとバージョンを更新します。 

``` 
"$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.20/MicrosoftTeams.schema.json", 
"manifestVersion": "1.20", 
```

`bots` セクションを以下の内容に置き換えて、マニフェストに `copilotAgents` を追加します。

> このブロックは、エージェントを M365 Copilot 用のカスタムエンジン エージェントとして宣言します。Microsoft 365 に対して、このエージェントを Copilot Chat に表示し、コマンド リストと会話スターターを UI に表示して、ユーザーがすぐに始められるようにします。

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

**Start** または **F5** を選択してデバッグを開始します。Microsoft Teams が自動的に起動します。ブラウザーで Microsoft Teams が開いたら、アプリのポップアップは無視して **Apps > Manage your apps > Upload an app** を選択し、**Upload a custom app** を選択します。エクスプローラーでプロジェクト フォルダー `...\ContosoHRAgent\M365Agent\appPackage\build` に移動し、**appPackage.local.zip** を選択します。

![アプリのアップロード時の Microsoft Teams の UI で、"Upload an app" コマンドが強調表示されている。](https://github.com/user-attachments/assets/5fad723f-b087-4481-8c8c-d5ad87c1bead)

Teams にアプリが再びポップアップ表示されたら **Add** を選択します。今回は **Open with Copilot** のオプションが表示されるので、**Open with Copilot** を選択して Copilot 上でエージェントをテストします。

![Microsoft Teams でエージェントが追加された際の UI で、"Open with Copilot" コマンドが強調表示されている。](https://github.com/user-attachments/assets/97f9d9fd-bd90-48b5-983b-b1fea3f85721)

Copilot Chat のエージェント一覧から **ContosoHRAgentlocal** を選択します。会話スターターのいずれかを選択して、エージェントとチャットを開始できます。

![Microsoft 365 Copilot 内でホストされるエージェントが、アプリケーション マニフェストで設定された会話スターターを表示している。](https://github.com/user-attachments/assets/2aab299c-23ff-4369-a42c-bd74c66f854d)

エージェントが Copilot Chat 上でも同様の応答を返すことを確認してください。

![Microsoft 365 Copilot にホストされたエージェントが、Microsoft Teams と同じフィードバックを提供し、ユーザーとの対話回数をカウントするカウンターの証跡を含んでいる。](https://github.com/user-attachments/assets/4211f43d-8aef-4262-95e3-1efac7dba495)

---8<--- "ja/b-congratulations.md"

🎉 おめでとうございます！Microsoft 365 Agents SDK と Azure AI Foundry を使用して、初めてのカスタムエンジン エージェントを構築しました。

このラボで学んだこと:

* Agent Playground を使用して Azure AI Foundry に AI エージェントを構成する方法
* エージェントの応答を補強するためにエンタープライズ ドキュメントをアップロードする方法
* Visual Studio で M365 Agents SDK を使用してボットをスキャフォールディングする方法
* Semantic Kernel を追加し、Azure AI Agent Service に接続する方法
* Azure AI Foundry エージェントとボットを統合してリアルタイムで根拠のある推論を行う方法
* **Microsoft Teams** と **Copilot Chat** にエージェントをデプロイしてテストする方法

## リソース

- [Copilot Developer Camp](https://aka.ms/copilotdevcamp)
- [M365 Agents SDK ドキュメント](https://aka.ms/open-hack/m365agentssdk)
- [Azure AI Foundry](https://ai.azure.com)
- [Copilot 拡張性の詳細](https://aka.ms/extensibility-docs)

<cc-next label="Home" url="/" />

<cc-award path="Build" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/04-bring-agent-to-copilot" />