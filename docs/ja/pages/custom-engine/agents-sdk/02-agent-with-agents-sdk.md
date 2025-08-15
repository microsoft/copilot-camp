---
search:
  exclude: true
---
# ラボ BMA2 - M365 Agents SDK を使用した初めてのエージェント構築

このラボでは、エンタープライズ グレードでスケーラブルかつマルチチャネルなエージェントを構築するための **Microsoft 365 Agents SDK** と **Microsoft 365 Agents Toolkit** を紹介します。Visual Studio で新しいエージェント プロジェクトを作成し、Test Tool 内でテストする方法を学びます。この体験を通じて、Microsoft 365 アプリおよび Copilot Chat にエージェント機能を効果的に統合する手順を理解できます。

## 演習 1: M365 Agents SDK で初めてのエージェント構築

### 手順 1: Visual Studio で Echo Bot を作成する

Azure AI Foundry を使用してエージェントを構築する方法を確認したので、ここからは **Microsoft 365 Agents SDK** を使用してローカルで独自のエージェントを構築する方法を見ていきましょう。この SDK を利用すると、Microsoft Teams、Microsoft 365 Copilot などの複数チャネルで動作する本番運用可能なエージェントを構築できます。

1. Visual Studio 2022 を開き、 **Create a new project** を選択します。  
1. **Microsoft 365 Agents** テンプレートを検索して選択します。  
1. エージェント名に `ContosoHRAgent` を入力し、 **Create** を選択します。  
1. テンプレートの一覧から **Echo Bot** を選択し、 **Create** を選択します。  
1. プロジェクト テンプレートのスキャフォールディングが完了したら、右側の Solution Explorer でテンプレートを確認します。 **ContosoHRAgent** プロジェクトを展開します。  
   - **Program.cs** を開くと、エージェントをホストする Web サーバーの構成と実行を行っているコードを確認できます。認証、ルーティング、ストレージなどの必要なサービスを設定し、 **EchoBot** を登録してメモリ ベースの状態管理を挿入しています。  
   - **Bot > EchoBot.cs** を開くと、このサンプルが **Microsoft.Agents.Builder** を使用して基本的な AI エージェントを設定していることがわかります。ユーザーがチャットに参加したときにウェルカム メッセージを送信し、メッセージを受信するとカウント番号付きでそのメッセージをエコー返信します。  

**Echo Bot** はユーザーが送信したメッセージをそのまま返すシンプルな bot です。セットアップが正しく行われたかを確認し、会話がどのように処理されるかを理解するのに役立ちます。

<cc-end-step lab="bma2" exercise="1" step="1" />

### 手順 2: Test Tool でエージェントをテストする

Echo エージェントをテストするには、 **Start** を選択するか **F5** を押します。これにより Test Tool がローカルホストで自動的に起動し、エージェントと対話できます。ローカルでのテスト用に自己署名 SSL 証明書の作成を Visual Studio から確認するよう求められた場合は、承認して続行してください。

エージェントのメッセージ "Hello and Welcome!" が表示されるまで待ち、その後 “Hi” や “Hello” などを入力します。エージェントが入力内容をそのままエコー返信することを確認してください。

![ローカルで Echo Bot をテストしている Microsoft 365 Agents Playground。画面左側にエミュレートされたチャット、画面右側にユーザーとエージェントのやり取り履歴パネルが表示されています。](https://github.com/user-attachments/assets/4562052d-856b-44d5-b2dd-27623d9bed11)

次の演習に進む前に、Visual Studio でデバッグ セッションを停止します。

<cc-end-step lab="bma2" exercise="1" step="2" />

---8<--- "ja/b-congratulations.md"

あなたは Lab BMA2 - Build your first agent using M365 Agents SDK を完了しました! このシンプルなエージェントは、より高度な体験を構築するための土台となります。次のステップでは、これを Azure AI Foundry エージェントと組み合わせ、より豊富でコンテキストを考慮した回答を実現します。

次に進む準備ができました。Lab BMA3 - Integrate Azure AI Foundry Agent with M365 Agents SDK に進むには **Next** を選択してください。

<cc-next url="../03-agent-configuration" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/02-agent-with-agents-sdk--ja" />