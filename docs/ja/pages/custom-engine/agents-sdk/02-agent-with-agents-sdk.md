---
search:
  exclude: true
---
# ラボ BMA2 - M365 Agents SDK を使用した初めてのエージェント構築

このラボでは、エンタープライズ グレードでスケーラブルかつマルチチャネル対応のエージェントを構築するための Microsoft 365 Agents SDK と Microsoft 365 Agents Toolkit を紹介します。Visual Studio を使用して新しいエージェント プロジェクトを作成し、Test Tool 内でテストする方法を学習します。この演習を通じて、Microsoft 365 アプリや Copilot Chat にエージェント機能を効果的に統合する方法を体験できます。

## エクササイズ 1: M365 Agents SDK で最初のエージェントを構築

### ステップ 1: Visual Studio で Echo Bot を作成

Azure AI Foundry を使用してエージェントを構築する方法を確認したところで、今度は Microsoft 365 Agents SDK を使用してローカルで独自のエージェントを構築する方法を見ていきましょう。この SDK を使用すると、Microsoft Teams、Microsoft 365 Copilot などのチャネルで稼働するマルチチャネル対応の本番環境向けエージェントを構築できます。

1. Visual Studio 2022 を開き、 **Create a new project** を選択します。  
1. **Microsoft 365 Agents** テンプレートを検索して選択します。  
1. エージェント名として `ContosoHRAgent` を入力し、 **Create** を選択します。  
1. テンプレート一覧から **Echo Bot** を選択し、 **Create** を選択します。  
1. プロジェクト テンプレートのスキャフォールディングが完了したら、右側の Solution Explorer でエージェント テンプレートを確認します。 **ContosoHRAgent** プロジェクトを展開してください。  
    - **Program.cs** を開くと、エージェントをホストする Web サーバーを構成および実行するコードが確認できます。認証、ルーティング、ストレージなどの必要なサービスを設定し、 **EchoBot** を登録してメモリ ベースの状態管理を注入しています。  
    - **Bot > EchoBot.cs** を開き、このサンプルが **Microsoft.Agents.Builder** を使用して基本的な AI エージェントを設定していることを確認します。ユーザーがチャットに参加した際にウェルカム メッセージを送信し、受信したメッセージをカウント付きでそのまま返します。  

最初に **Echo Bot** を作成しました。これはユーザーが送信したメッセージをそのまま繰り返すシンプルなボットで、環境設定を確認し、会話がどのように処理されるかを理解するのに役立ちます。

<cc-end-step lab="bma2" exercise="1" step="1" />

### ステップ 2: Test Tool でエージェントをテスト

Echo エージェントをテストするには、 **Start** または **F5** を押します。これにより Test Tool がローカルホストで自動的に起動し、エージェントと対話できます。Visual Studio から自己署名 SSL 証明書の作成確認が表示された場合は、承認して続行してください。

エージェントのメッセージ「Hello and Welcome!」が表示されるまで待ち、 “Hi” や “Hello” などを入力します。エージェントが入力内容をそのままエコーバックすることを確認してください。

![The local Microsoft 365 Agents Playground when testing locally the Echo Bot. On the left side of the screen there is an emulated chat, while on the right side of the screen there is a panel with the history of the interaction between the user and the agent.](https://github.com/user-attachments/assets/4562052d-856b-44d5-b2dd-27623d9bed11)

<cc-end-step lab="bma2" exercise="1" step="2" />

---8<--- "ja/b-congratulations.md"

M365 Agents SDK を使用したラボ BMA2 - 最初のエージェント構築を完了しました! このシンプルなエージェントは、より強力なエクスペリエンスを実現するためのベースとなります。次のステップでは、これを Azure AI Foundry エージェントと組み合わせて、よりリッチでコンテキスト認識の回答を提供できるようにします。

次のラボ BMA3 - Integrate Azure AI Foundry Agent with M365 Agents SDK に進む準備ができました。 **Next** を選択してください。

<cc-next url="../03-agent-configuration" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/02-agent-with-agents-sdk" />