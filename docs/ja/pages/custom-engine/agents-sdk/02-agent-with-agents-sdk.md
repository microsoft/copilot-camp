---
search:
  exclude: true
---
# ラボ BMA2 - M365 Agents SDK を使用して最初のエージェントを構築する

このラボでは、エンタープライズ グレードでスケーラブルかつマルチ チャネルなエージェントを構築するための Microsoft 365 Agents SDK と Microsoft 365 Agents Toolkit を紹介します。Visual Studio で新しいエージェント プロジェクトを作成し、Test Tool 内でテストする方法を学びます。この体験を通じて、Microsoft 365 アプリや Copilot Chat にエージェント機能を効果的に統合する方法を理解できます。

## 演習 1 - M365 Agents SDK を使用したエージェントの構築

### 手順 1 - Visual Studio を使用した Echo Bot の作成

Azure AI Foundry を使用してエージェントを構築する方法を確認したところで、ここからは Microsoft 365 Agents SDK を使い、ローカルで独自のエージェントを構築する方法を見ていきましょう。この SDK を使用すると、Microsoft Teams、Microsoft 365 Copilot、その他のチャネルで動作するマルチ チャネルかつ本番環境対応のエージェントを構築できます。

1.  Visual Studio 2022 を開き、 **Create a new project** を選択します。  
1.  **Microsoft 365 Agents** テンプレートを検索して選択します。  
1.  エージェント名として `ContosoHRAgent` を入力し、 **Create** を選択します。  
1.  テンプレートの一覧から **Echo Bot** を選択し、 **Create** を選択します。  
1.  プロジェクト テンプレートがスキャフォールディングされたら、右側の Solution Explorer に移動し、エージェント テンプレートを確認します。 **ContosoHRAgent** プロジェクトを展開します。  
    - **Program.cs** を開くと、このコードがエージェントをホストする Web サーバーを構成・実行していることが分かります。認証、ルーティング、ストレージなどの必要なサービスを設定し、 **EchoBot** を登録してメモリ ベースの状態管理を注入しています。  
    - **Bot > EchoBot.cs** を開き、このサンプルが **Microsoft.Agents.Builder** を使用して基本的な AI エージェントを設定していることを確認します。ユーザーがチャットに参加した際にウェルカム メッセージを送信し、メッセージを受信すると、メッセージのカウントを付けてそのままエコーします。  

あなたは **Echo Bot** からスタートしました。これはユーザーが送信したメッセージをそのまま返すシンプルなボットです。セットアップを確認し、会話がどのように処理されるかを理解するのに役立ちます。

<cc-end-step lab="bma2" exercise="1" step="1" />

### 手順 2 - Test Tool でエージェントをテストする

Echo エージェントをテストするために **Start** または **F5** を押します。これにより Test Tool がローカルホストで自動的に起動し、エージェントと対話できます。Visual Studio からローカルでアプリをテストするための自己署名 SSL 証明書の作成確認が表示された場合は、承認して進めてください。

エージェントから "Hello and Welcome!" メッセージが表示されるまで待ち、続いて “Hi” や “Hello” などを入力します。エージェントが入力内容をそのままエコーすることを確認してください。

![ローカルで Echo Bot をテストしている Microsoft 365 Agents Playground。画面左側にエミュレートされたチャット、右側にユーザーとエージェント間のやり取りの履歴パネルが表示されています。](https://github.com/user-attachments/assets/4562052d-856b-44d5-b2dd-27623d9bed11)

<cc-end-step lab="bma2" exercise="1" step="2" />

---8<--- "ja/b-congratulations.md"

M365 Agents SDK を使用して最初のエージェントを構築するラボ BMA2 を完了しました。このシンプルなエージェントは、より強力な体験を作るための基盤となります。次のステップでは、これを Azure AI Foundry エージェントと組み合わせ、よりリッチでコンテキストを理解した回答を実現します。

次のラボ BMA3 - Azure AI Foundry Agent を M365 Agents SDK と統合する に進む準備ができました。 **Next** を選択してください。

<cc-next url="../03-agent-configuration" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/02-agent-with-agents-sdk" />