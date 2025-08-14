---
search:
  exclude: true
---
# Lab BMA2 - M365 Agents SDK を使用した最初の エージェント 構築

このラボでは、エンタープライズ グレードでスケーラブルかつマルチチャネル対応の エージェント を構築するための Microsoft 365 Agents SDK と Microsoft 365 Agents Toolkit を紹介します。Visual Studio で新しい エージェント プロジェクトを作成し、Test Tool 内でテストする方法を学びます。この演習では、エージェント機能を Microsoft 365 アプリや Copilot Chat に効果的に統合する方法を体験できます。

## Exercise 1: M365 Agents SDK を使用した最初の エージェント 構築

### Step 1: Visual Studio で Echo Bot を作成する

Azure AI Foundry を使った エージェント の構築方法を確認したところで、今度は Microsoft 365 Agents SDK を使用してローカルで独自の エージェント を構築する方法を学びましょう。この SDK を利用すると、Microsoft Teams、Microsoft 365 Copilot、その他の任意のチャネルで実行できるマルチチャネルかつ本番運用向けの エージェント を構築できます。

1. Visual Studio 2022 を開き、**Create a new project** を選択します。  
1. **Microsoft 365 Agents** テンプレートを検索して選択します。  
1. エージェント の名前を `ContosoHRAgent` と入力し、**Create** を選択します。  
1. テンプレート一覧から **Echo Bot** を選択して **Create** をクリックします。  
1. プロジェクト テンプレートがスキャフォールディングされたら、右側の Solution Explorer でテンプレートを確認します。**ContosoHRAgent** プロジェクトを展開します。  
   - **Program.cs** を開きます。このコードでは、エージェント をホストする Web サーバーを構成および実行します。認証、ルーティング、ストレージなどの必要なサービスを設定し、**EchoBot** を登録してメモリ ベースの状態管理を注入します。  
   - **Bot > EchoBot.cs** を開きます。このサンプルは **Microsoft.Agents.Builder** を使用して基本的な AI エージェント をセットアップしています。ユーザー がチャットに参加するとウェルカム メッセージを送信し、ユーザー からのメッセージをリッスンして、メッセージのカウントを付けてそのまま返します。  

最初に **Echo Bot** を作成しました。これは ユーザー が送信したメッセージをそのまま繰り返すシンプルなボットで、セットアップを確認し、会話がどのように処理されているかを理解するのに役立ちます。

<cc-end-step lab="bma2" exercise="1" step="1" />

### Step 2: Test Tool で エージェント をテストする

Echo エージェント をテストするには、**Start** または **F5** を押します。これにより Test Tool がローカルホストで自動的に起動し、エージェント と対話できます。Visual Studio からローカルでアプリケーションをテストするために自己署名 SSL 証明書の作成を確認するダイアログが表示された場合は、承認して続行してください。

エージェント から "Hello and Welcome!" のメッセージが表示されるまで待ち、その後 “Hi” や “Hello” など任意のテキストを入力します。エージェント が入力内容をそのままエコーすることを確認してください。

![The local Microsoft 365 Agents Playground when testing locally the Echo Bot. On the left side of the screen there is an emulated chat, while on the right side of the screen there is a panel with the history of the interaction between the user and the agent.](https://github.com/user-attachments/assets/4562052d-856b-44d5-b2dd-27623d9bed11)

次のエクササイズに進む前に Visual Studio でデバッグ セッションを停止します。

<cc-end-step lab="bma2" exercise="1" step="2" />

---8<--- "ja/b-congratulations.md"

Lab BMA2 - M365 Agents SDK を使用した最初の エージェント 構築 を完了しました。このシンプルな エージェント が、よりパワフルな体験の基盤となります。次のステップでは、これを Azure AI Foundry エージェント と組み合わせて、よりリッチでコンテキストを考慮した回答を実現します。

次は Lab BMA3 - Azure AI Foundry エージェント と M365 Agents SDK の統合 に進んでください。Next を選択します。

<cc-next url="../03-agent-configuration" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/02-agent-with-agents-sdk--ja" />