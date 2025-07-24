---
search:
  exclude: true
---
# ラボ BMA2 - M365 Agents SDK を使用して初めてのエージェントを構築

このラボでは、 Microsoft 365 Agents SDK および Microsoft 365 Agents Toolkit を使用して、エンタープライズグレード で スケーラブル な マルチチャネル エージェントを構築する方法をご紹介いたします。 Visual Studio を使って新しいエージェント プロジェクトを作成し、 Test Tool 内でテストする方法を学びます。この体験を通じて、エージェント機能を Microsoft 365 アプリや Copilot Chat に効果的に統合する方法を実証いたします。

## 演習 1: M365 Agents SDK を使用して初めてのエージェントを構築

### ステップ 1: Visual Studio を使用してエコーボットを作成

Azure AI Foundry を使用してエージェントを構築する方法をご覧いただいたので、方向転換して Microsoft 365 Agents SDK を使用してローカルで独自のエージェントを構築する方法を探求してみましょう。この SDK を使用すれば、 Microsoft Teams 、 Microsoft 365 Copilot 、およびその他のお好みのチャネルで動作する、マルチチャネルで本番環境向けのエージェントを構築できます。

1. Visual Studio 2022 を開き、 **Create a new project** を選択します。
1. **Microsoft 365 Agents** テンプレートを検索して選択します。
1. エージェントの名前を `ContosoHRAgent` として指定し、 **Create** を選択します。  
1. テンプレートの一覧から **Echo Bot** を選択し、 **Create** を選択します。
1. プロジェクト テンプレートが生成されたら、右側のパネルにある Solution Explorer に移動してエージェント テンプレートを確認します。 **ContosoHRAgent** プロジェクトを展開してください。
    - **Program.cs** を開くと、このコードはエージェントをホストする Web サーバーの設定と実行を行っています。認証、ルーティング、ストレージなどの必要なサービスをセットアップし、 **EchoBot** を登録し、メモリベースの状態管理を注入します。
    - **Bot > EchoBot.cs** を開いて、このサンプルが **Microsoft.Agents.Builder** を使用して基本的な AI エージェントを設定していることを確認してください。チャットに ユーザー が参加した際にウェルカムメッセージを送信し、任意のメッセージを受信してそれに対してカウント付きでエコー返答を行います。

これで、ユーザーが送信したメッセージを単純に繰り返すシンプルなボットである **Echo Bot** を開始しました。これは、セットアップの確認や、会話がどのようにバックグラウンドで処理されるかを理解するための有用な方法です。

<cc-end-step lab="bma2" exercise="1" step="1" />

### ステップ 2: Test Tool でエージェントをテスト

エコー エージェントをテストするには、 **Start** または **F5** を押してください。これによりローカルホストで Test Tool が自動的に起動し、エージェントと対話できるようになります。 Visual Studio からローカルでアプリケーションをテストするために自己発行の SSL 証明書の作成確認を求められた場合は、確認して先に進んでください。

エージェントの「Hello and Welcome!」というメッセージが表示されるまでお待ちいただき、その後、「Hi」や「Hello」など何かを入力してください。エージェントがすべてのメッセージをエコー返答する様子をご確認ください。

![ローカルで Echo Bot をテストする際のローカル Microsoft 365 Agents Playground 。画面左側にはエミュレーションされたチャットが表示され、画面右側には ユーザー とエージェント間のやり取りの履歴が確認できるパネルが表示されています。](https://github.com/user-attachments/assets/4562052d-856b-44d5-b2dd-27623d9bed11)

<cc-end-step lab="bma2" exercise="1" step="2" />

---8<--- "ja/b-congratulations.md"

Lab BMA2 - M365 Agents SDK を使用して初めてのエージェントを構築 は完了しました！このシンプルなエージェントは、より高度な体験の基盤となります。次のステップでは、これを Azure AI Foundry エージェント と組み合わせ、より豊かなコンテキストに基づく回答を実現します。

これで Lab BMA3 - M365 Agents SDK と Azure AI Foundry エージェント の統合へと進む準備が整いました。Next を選択してください。

<cc-next url="../03-agent-configuration" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/02-agent-with-agents-sdk" />