---
search:
  exclude: true
---
# ラボ BMA2 - M365 Agents SDK を使用した最初のエージェント構築

このラボでは、エンタープライズ グレードでスケーラブル、かつマルチチャネル対応のエージェントを構築するための Microsoft 365 Agents SDK と Microsoft 365 Agents Toolkit を紹介します。Visual Studio で新しいエージェント プロジェクトを作成し、Test Tool 内でテストする方法を学びます。これにより、Microsoft 365 アプリや Copilot Chat にエージェント機能を効果的に統合する方法を体験できます。

## エクササイズ 1: M365 Agents SDK を使用して最初のエージェントを構築する

### 手順 1: Visual Studio で Echo Bot を作成する

Azure AI Foundry を使用してエージェントを構築する方法を確認したところで、今度は Microsoft 365 Agents SDK を用いてローカルで独自のエージェントを構築する方法を見ていきましょう。この SDK を使用すると、Microsoft Teams、Microsoft 365 Copilot、その他の好みのチャネルで動作するマルチチャネルかつ本番環境対応のエージェントを作成できます。

1. Visual Studio 2022 を開き、 **Create a new project** を選択します。  
1. 検索ボックスで **Microsoft 365 Agents** テンプレートを検索し、選択します。  
1. エージェント名を `ContosoHRAgent` と入力し、 **Create** を選択します。  
1. テンプレート一覧から **Echo Bot** を選択し、 **Create** をクリックします。  
1. プロジェクト テンプレートがスキャフォールディングされたら、右側の Solution Explorer でエージェント テンプレートを確認します。 **ContosoHRAgent** プロジェクトを展開します。  
    - **Program.cs** を開きます。このコードはエージェントをホストする Web サーバーを構成・実行します。認証、ルーティング、ストレージなどの必須サービスを設定し、 **EchoBot** を登録してメモリ ベースの状態管理をインジェクションします。  
    - **Bot > EchoBot.cs** を開き、このサンプルが **Microsoft.Agents.Builder** を使用して基本的な AI エージェントをセットアップしていることを確認します。ユーザーがチャットに参加するとウェルカム メッセージを送信し、メッセージを受信するとカウントを付けてそのまま返します。  

最初に作成した **Echo Bot** は、ユーザーが送信したメッセージをそのまま返すシンプルなボットです。セットアップを確認し、会話がどのように処理されるかを理解するのに役立ちます。

<cc-end-step lab="bma2" exercise="1" step="1" />

### 手順 2: Test Tool でエージェントをテストする

Echo エージェントをテストするには、 **Start** または **F5** を押します。これにより localhost 上で Test Tool が自動的に起動し、エージェントと対話できます。ローカルでアプリケーションをテストするために自己署名 SSL 証明書の作成を確認するダイアログが Visual Studio に表示された場合は、承認して続行してください。

エージェントのメッセージ「Hello and Welcome!」が表示されるまで待ち、その後 “Hi” や “Hello” などを入力します。エージェントがすべての入力をそのままエコーすることを確認しましょう。

![The local Microsoft 365 Agents Playground when testing locally the Echo Bot. On the left side of the screen there is an emulated chat, while on the right side of the screen there is a panel with the history of the interaction between the user and the agent.](https://github.com/user-attachments/assets/4562052d-856b-44d5-b2dd-27623d9bed11)

<cc-end-step lab="bma2" exercise="1" step="2" />

---8<--- "ja/b-congratulations.md"

M365 Agents SDK を使用したラボ BMA2 - 最初のエージェント構築 を完了しました！このシンプルなエージェントは、より強力な体験を実現するための基盤となります。次のステップでは、これを Azure AI Foundry エージェントと組み合わせて、よりリッチでコンテキストを理解した回答を可能にします。

次のラボ BMA3 - Azure AI Foundry Agent を M365 Agents SDK と統合する に進む準備ができました。Next を選択してください。

<cc-next url="../03-agent-configuration" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/02-agent-with-agents-sdk--ja" />