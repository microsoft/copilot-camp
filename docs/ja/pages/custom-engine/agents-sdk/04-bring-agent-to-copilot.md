---
search:
  exclude: true
---
# ラボ MBA4 - Copilot Chat へのエージェントの導入

この最終ラボでは、エージェントのマニフェストを更新することで、カスタムエンジン エージェントを Copilot Chat に導入します。アプリのマニフェストで copilotAgents を有効にすることで、AI 搭載アシスタントを Copilot のエクスペリエンス内で直接ご利用いただけます。

## 演習 1: Copilot Chat へのエージェントの導入

### ステップ 1: マニフェストの更新

!!!tip "Stop debugging"
    この演習を進める前に、以前のデバッグ セッションを終了してください。

**M365Agent/AppPackage/manifest.json** に移動し、以下のようにマニフェストのスキーマとバージョンを更新してください: 

``` 
"$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.20/MicrosoftTeams.schema.json", 
"manifestVersion": "1.20", 
```

以下のように bots セクションを置き換えて、マニフェストに copilotAgents も追加します:

> このブロックは、あなたのエージェントを M365 Copilot 用のカスタムエンジン エージェントとして宣言します。Microsoft 365 に対して、このエージェントを Copilot Chat で公開し、ユーザーがすぐに始められるよう会話 UI 内にコマンド リストおよび会話スターターを表示するよう指示します。

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

**Start** または **F5** を押してデバッグを開始してください。Microsoft Teams が自動的に起動します。ブラウザで Microsoft Teams が開いたら、アプリのポップアップを無視し、**Apps > Manage your apps > Upload an app** を選択した後、**Upload a custom app** を選択してください。ファイルエクスプローラーでプロジェクトフォルダー `...\ContosoHRAgent\M365Agent\appPackage\build` に移動し、**appPackage.local.zip** を選択してください。

![Microsoft Teams にアプリをアップロードする際の UI。 "Upload an app" コマンドが強調表示されています。](https://github.com/user-attachments/assets/5fad723f-b087-4481-8c8c-d5ad87c1bead)

Teams 上でアプリが再びポップアップ表示されるので、**Add** を選択してください。今回は、**Open with Copilot** のオプションが表示されるため、それを選択してエージェントを Copilot 上でテストします。

![エージェントが追加されたときの Microsoft Teams の UI。 "Open with Copilot" コマンドが強調表示されています。](https://github.com/user-attachments/assets/97f9d9fd-bd90-48b5-983b-b1fea3f85721)

Copilot Chat のエージェント一覧から **ContosoHRAgentlocal** を選択してください。会話スターターのいずれかを選んでエージェントとチャットすることができます。

![Microsoft 365 Copilot 内にホストされたエージェント。アプリケーションマニフェストで設定された会話スターターが表示されています。](https://github.com/user-attachments/assets/2aab299c-23ff-4369-a42c-bd74c66f854d)

Copilot Chat 上で、エージェントが同様の挙動で応答する様子をご確認ください。

![Microsoft 365 Copilot にホストされたエージェントが、Microsoft Teams と同様のフィードバックを提供している様子。ユーザーとのやり取り回数をカウントするカウンターの証拠が含まれています。](https://github.com/user-attachments/assets/4211f43d-8aef-4262-95e3-1efac7dba495)

---8<--- "ja/b-congratulations.md"

🎉 おめでとうございます！Microsoft 365 Agents SDK および Azure AI Foundry を使用して、初のカスタムエンジン エージェントを構築しました！

このラボでは、以下のことを学びました:

* Agent Playground を使用して Azure AI Foundry で AI エージェントを構成する
* エンタープライズ ドキュメントをアップロードしてエージェントの応答に根拠を持たせる
* Visual Studio を使用して M365 Agents SDK でボットの雛形を作成する
* Semantic Kernel を追加し、Azure AI Agent Service に接続する
* リアルタイムで根拠付き推論を行うためにボットを Azure AI Foundry エージェントと統合する
* **Microsoft Teams** および **Copilot Chat** でエージェントを展開してテストする

## リソース

- [Copilot Developer Camp](https://aka.ms/copilotdevcamp)
- [M365 Agents SDK docs](https://aka.ms/open-hack/m365agentssdk)
- [Azure AI Foundry](https://ai.azure.com)
- [Copilot の拡張性の詳細を学ぶ](https://aka.ms/extensibility-docs)

<cc-next label="ホーム" url="/" />

<cc-award path="Build" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/04-bring-agent-to-copilot" />