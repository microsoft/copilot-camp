---
search:
  exclude: true
---
# ラボ BMA2 - M365 Agents SDK を使用して最初のエージェントを構築

このラボでは、エンタープライズ グレードでスケーラブルかつマルチチャネルに対応したエージェントを構築するための Microsoft 365 Agents SDK と Microsoft 365 Agents Toolkit を紹介します。Visual Studio で新しいエージェント プロジェクトを作成し、Test Tool 内でテストする方法を学びます。この演習を通して、Microsoft 365 アプリおよび Copilot Chat にエージェント機能を効果的に統合する方法を体験します。

## Exercise 1: M365 Agents SDK を使用して最初のエージェントを構築

### 手順 1: Visual Studio を使用した Echo Bot の作成

Microsoft Foundry を使ってエージェントを構築する方法を確認したので、今度は Microsoft 365 Agents SDK を使用してローカルで独自のエージェントを構築してみましょう。この SDK を利用すると、Microsoft Teams、Microsoft 365 Copilot などのチャネルで動作するマルチチャネルかつ本番対応のエージェントを構築できます。

1. Visual Studio 2022 を開き、 **Create a new project** を選択します。  
1. **Microsoft 365 Agents** テンプレートを検索して選択します。  
1. エージェント名を `ContosoHRAgent` と入力し、 **Create** を選択します。  
1. テンプレート一覧から **Echo Bot** を選択し、 **Create** をクリックします。  
1. プロジェクト テンプレートがスキャフォールディングされたら、右側パネルの Solution Explorer でエージェント テンプレートを確認します。 **ContosoHRAgent** プロジェクトを展開してください。  
    - **Program.cs** を開くと、このコードがエージェントをホストする Web サーバーを構成して実行していることがわかります。認証、ルーティング、ストレージなどの必要なサービスを設定し、 **EchoBot** を登録してメモリ ベースの状態管理を注入しています。  
    - **Bot > EchoBot.cs** を開くと、このサンプルが **Microsoft.Agents.Builder** を使用して基本的な AI エージェントをセットアップしていることが確認できます。ユーザーがチャットに参加するとウェルカム メッセージを送り、メッセージを受信するとメッセージ数をカウントしながら同じ内容を返します。  

これで **Echo Bot** が作成されました。ユーザーが送信したメッセージをそのまま返すシンプルなボットで、環境設定が正しく行われているか、会話がどのように処理されるかを確認するのに便利です。

<cc-end-step lab="bma2" exercise="1" step="1" />

### 手順 2: Test Tool でエージェントをテスト

Echo エージェントをテストするには、 **Start** または **F5** を押します。これにより localhost で Test Tool が自動的に起動し、エージェントと対話できます。Visual Studio から自己署名 SSL 証明書の作成確認が表示された場合は、承認して続行してください。

エージェントから "Hello and Welcome!" とメッセージが表示されたら、「Hi」や「Hello」などを入力してみましょう。エージェントが入力した内容をそのままエコーすることを確認できます。

![The local Microsoft 365 Agents Playground when testing locally the Echo Bot. On the left side of the screen there is an emulated chat, while on the right side of the screen there is a panel with the history of the interaction between the user and the agent.](https://github.com/user-attachments/assets/4562052d-856b-44d5-b2dd-27623d9bed11)

次の演習に進む前に、Visual Studio のデバッグ セッションを停止してください。

<cc-end-step lab="bma2" exercise="1" step="2" />

---8<--- "ja/b-congratulations.md"

M365 Agents SDK を使用して最初のエージェントを構築するラボ BMA2 を完了しました！このシンプルなエージェントは、さらに強力な体験を実現するための基盤となります。次のステップでは、これを Microsoft Foundry エージェントと組み合わせ、よりリッチでコンテキストを考慮した回答を可能にします。

次のラボ BMA3 - Microsoft Foundry Agent を M365 Agents SDK と統合 に進む準備が整いました。Next を選択してください。

<cc-next url="../03-agent-configuration" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/02-agent-with-agents-sdk--ja" />