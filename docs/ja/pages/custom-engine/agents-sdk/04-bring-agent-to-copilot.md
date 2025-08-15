---
search:
  exclude: true
---
# ラボ MBA4 - エージェントを Copilot Chat に追加

この最終ラボでは、カスタム エンジン エージェントを Copilot Chat に組み込むために、エージェントのマニフェストを更新します。app manifest で `copilotAgents` を有効にすると、AI 搭載アシスタントが Copilot 体験内で直接利用できるようになります。

## 演習 1: エージェントを Copilot Chat に追加

### 手順 1: マニフェストの更新

!!!tip "デバッグの停止"
    この演習を始める前に、前のデバッグ セッションを終了してください。

**M365Agent/AppPackage/manifest.json** を開き、マニフェストのスキーマとバージョンを次のように更新します。

``` 
"$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.22/MicrosoftTeams.schema.json",
"manifestVersion": "1.22",
```

次に、`bots` セクションを以下の内容に置き換えて `copilotAgents` をマニフェストに追加します。

> このブロックは、エージェントを M365 Copilot 用のカスタム エンジン エージェントとして宣言します。 これにより、Microsoft 365 は Copilot Chat 内でこのエージェントを公開し、コマンド リストと会話の開始例を UI に表示して、ユーザーがすばやく使い始められるようにします。

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

**Start** または **F5** を押してデバッグを開始します。 すると、ブラウザーで  Microsoft Teams が自動的に起動します。  Microsoft Teams が開いたら、アプリのポップアップは無視して **Apps > Manage your apps > Upload an app** を選択し、**Upload a custom app** をクリックします。 ファイル エクスプローラーでプロジェクト フォルダー `...\ContosoHRAgent\M365Agent\appPackage\build` に移動し、**appPackage.local.zip** を選択します。

![アプリをアップロードする際の Microsoft Teams の UI。「Upload an app」コマンドがハイライトされている。](https://github.com/user-attachments/assets/5fad723f-b087-4481-8c8c-d5ad87c1bead)

アプリが Teams 上にポップアップ表示されたら **Add** をクリックします。 今回は **Open with Copilot** オプションが表示されるので、それを選択して Copilot 上でエージェントをテストします。

![エージェントが追加されたときの Microsoft Teams の UI。「Open with Copilot」コマンドがハイライトされている。](https://github.com/user-attachments/assets/97f9d9fd-bd90-48b5-983b-b1fea3f85721)

Copilot Chat のエージェント一覧から **ContosoHRAgentlocal** を選択します。 会話の開始例をクリックすると、エージェントと対話できます。

![Microsoft 365 Copilot 内にホストされたエージェント。アプリケーション マニフェストで構成された会話の開始例が表示されている。](https://github.com/user-attachments/assets/a1d061c7-c58f-4a1e-9481-4d6a60d85e3b)

エージェントが Copilot Chat でも同様の動作で応答することを確認してください。

![Microsoft 365 Copilot にホストされたエージェントが、Microsoft Teams と同じフィードバックを提供している。ユーザーとの対話回数をカウントするカウンターの証拠も含む。](https://github.com/user-attachments/assets/caedced5-1247-44ed-b12f-78827f4e4784)


---8<--- "ja/b-congratulations.md"

🎉 おめでとうございます!  Microsoft 365 Agents SDK と  Azure AI Foundry を使用して、初めてのカスタム エンジン エージェントを構築しました。

このラボでは、次のことを学びました。

* Agent Playground を使用して  Azure AI Foundry に AI エージェントを構成する方法
* エージェントの応答を裏付けるためにエンタープライズ ドキュメントをアップロードする方法
* Visual Studio で M365 Agents SDK を使用してボットをスキャフォールディングする方法
* Semantic Kernel を追加し、Azure AI Agent Service に接続する方法
* ボットを  Azure AI Foundry エージェントと統合してリアルタイムかつ根拠ある推論を行う方法
* **Microsoft Teams** と **Copilot Chat** にエージェントをデプロイしてテストする方法

## リソース

- [Copilot Developer Camp](https://aka.ms/copilotdevcamp)
- [M365 Agents SDK docs](https://aka.ms/open-hack/m365agentssdk)
- [Azure AI Foundry](https://ai.azure.com)
- [Copilot の拡張性について詳しく学ぶ](https://aka.ms/extensibility-docs)

<cc-next label="Home" url="/" />

<cc-award path="Build" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/04-bring-agent-to-copilot--ja" />