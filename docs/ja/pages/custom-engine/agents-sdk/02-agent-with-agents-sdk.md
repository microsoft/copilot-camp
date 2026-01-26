---
search:
  exclude: true
---
# ラボ BMA2 - M365 Agents SDK を使用した初めてのエージェント構築

このラボでは、エンタープライズ グレードでスケーラブルかつマルチチャネル対応のエージェントを構築するための Microsoft 365 Agents SDK と Microsoft 365 Agents Toolkit について学習します。 Visual Studio で新しいエージェント プロジェクトを作成し、 Test Tool でテストする方法を体験します。この演習を通じて、エージェント機能を Microsoft 365 アプリや Copilot Chat に効果的に統合する方法を理解できます。

## 演習 1: M365 Agents SDK を使用して最初のエージェントを構築

### 手順 1: Visual Studio で Echo Bot を作成する

Microsoft Foundry を使用してエージェントの構築方法を確認しましたので、今度はローカルで Microsoft 365 Agents SDK を使用して独自のエージェントを構築してみましょう。この SDK を使用すると、 Microsoft Teams、 Microsoft 365 Copilot、その他お好みのチャネルで動作するマルチチャネルかつ本番環境対応のエージェントを作成できます。

1.  Visual Studio 2022 を開き、 ** 新しいプロジェクトの作成 ** を選択します。  
1.  検索ボックスに ** Microsoft 365 Agents ** テンプレートと入力して選択します。  
1.  エージェントの名前を `ContosoHRAgent` と入力し、 ** 作成 ** を選択します。  
1.  テンプレート一覧から ** Echo Bot ** を選択し、 ** 作成 ** をクリックします。  
1.  プロジェクト テンプレートが生成されたら、右側の Solution Explorer でエージェント テンプレートを確認します。 ** ContosoHRAgent ** プロジェクトを展開します。  
    - ** Program.cs ** を開くと、 Web サーバーを構成してエージェントをホストしていることがわかります。認証、ルーティング、ストレージなどの必要なサービスを設定し、 ** EchoBot ** を登録してメモリ ベースの状態管理を注入しています。  
    - ** Bot > EchoBot.cs ** を開くと、このサンプルでは ** Microsoft.Agents.Builder ** を使用して基本的な AI エージェントを設定していることが確認できます。ユーザーがチャットに参加するとウェルカム メッセージを送信し、メッセージを受信するとメッセージ数をカウントしながら同じ内容を返します。  

今回は ** Echo Bot ** から開始しました。これはユーザーが送信したメッセージをそのまま繰り返すシンプルなボットで、セットアップを確認し、会話がどのように処理されるかを理解するのに役立ちます。

<cc-end-step lab="bma2" exercise="1" step="1" />

### 手順 2: Test Tool でエージェントをテストする

Echo エージェントをテストするには、 ** Start ** か ** F5 ** を押します。これにより localhost 上で Test Tool が自動的に起動し、エージェントと対話できます。 Visual Studio から自己署名 SSL 証明書の作成確認が求められた場合は、承認して続行してください。

エージェントのメッセージ「Hello and Welcome!」が表示されるまで待ち、続いて “Hi” や “Hello” などを入力します。エージェントが入力内容をそのままエコーすることを確認してください。

![The local Microsoft 365 Agents Playground when testing locally the Echo Bot. On the left side of the screen there is an emulated chat, while on the right side of the screen there is a panel with the history of the interaction between the user and the agent.](https://github.com/user-attachments/assets/4562052d-856b-44d5-b2dd-27623d9bed11)

次の演習に進む前に、 Visual Studio でデバッグ セッションを停止してください。

<cc-end-step lab="bma2" exercise="1" step="2" />

---8<--- "ja/b-congratulations.md"

M365 Agents SDK を使用したラボ BMA2 - 最初のエージェント構築 が完了しました！このシンプルなエージェントは、より強力なエクスペリエンスを構築するための土台となります。次のステップでは、これを Microsoft Foundry エージェントと組み合わせ、よりリッチでコンテキストを考慮した回答を実現します。

続いてラボ BMA3 - Microsoft Foundry エージェントと M365 Agents SDK の統合 に進んでください。 ** 次へ ** を選択します。

<cc-next url="../03-agent-configuration" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/02-agent-with-agents-sdk--ja" />