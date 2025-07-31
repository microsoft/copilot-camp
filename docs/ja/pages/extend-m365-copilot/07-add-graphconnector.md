---
search:
  exclude: true
---
# ラボ E7 - 統合: Microsoft Copilot Connector を使用して Trey Genie にナレッジ機能を追加

---8<--- "ja/e-labs-prelude.md"

このラボでは、独自データを Microsoft Graph に追加し、宣言型エージェントがそのデータをナレッジとして有機的に活用できるようにする方法を学習します。具体的には、Microsoft Copilot Connector をデプロイし、Trey Genie 宣言型エージェントでコネクタを使用する方法を学びます。

このラボで学習する内容:

- 独自データを Microsoft Graph に取り込む Microsoft Copilot Connector をデプロイし、Microsoft 365 の各種エクスペリエンスで利用できるようにする  
- Trey Genie 宣言型エージェントをカスタマイズして、Copilot Connector をナレッジ拡張の **capability** として利用する  
- アプリを実行してテストする方法を学ぶ  

  <div class="note-box">
            📘 <strong>Note:</strong> このラボは Lab E4 を前提としています。ラボ E2〜E6 と同じフォルダーを引き続き使用できますが、参照用のソリューション フォルダーも用意しています。  
    このラボの完成形である Trey Genie 宣言型ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END</a> フォルダーにあります。  
    Microsoft Copilot Connector のソースコードは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector</a> フォルダーにあります。
        </div>



!!! note "Prerequisites: Tenant Admin Access"
    このラボを実行するには追加の前提条件が必要です。Microsoft Copilot Connectors はアプリのみ認証でコネクタ API にアクセスするため、<mark>テナント管理者権限</mark> が必要です。

!!! note "Prerequisites: Azure Functions Visual Studio Code extension"
    - [Azure Functions Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions){target=_blank}

## 演習 1 : Copilot Connector のデプロイ

### 手順 1: サンプル プロジェクトのダウンロード

- ブラウザーで [このリンク](https://download-directory.github.io?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector&filename=trey-feedback-connector){target=_blank} にアクセスします  
- **trey-feedback-connector.zip** ファイルを展開します  

!!! note
    展開後のフォルダー名は **trey-feedback-connector** です。このフォルダー内の **content** フォルダーには、Trey Research のコンサルタントに対するさまざまなクライアントからのフィードバック ファイルが含まれています。これらのファイルはすべて AI により生成されたデモ用データです。  
    目的は、これらの外部ファイルを Microsoft 365 データに取り込み、宣言型エージェント Trey Genie のナレッジ ベースとして利用できるようにすることです。 

<cc-end-step lab="e7" exercise="1" step="1" />

### 手順 2: 外部接続の作成

- Visual Studio Code で **trey-feedback-connector** フォルダーを開きます  
- Visual Studio Code のアクティビティ バーで Agents Toolkit 拡張機能を開きます  
- ルート フォルダー **trey-feedback-connector** の **env** フォルダーに **.env.local** ファイルを作成します  
- 新しく作成したファイルに以下の内容を貼り付けます  

```txt
APP_NAME=TreyFeedbackConnectorApp
CONNECTOR_ID=tfcfeedback
CONNECTOR_NAME=Trey Feedback Connector
CONNECTOR_DESCRIPTION=The Trey Feedback Connector seamlessly integrate feedback data from various clients about consultants in Trey Research.
CONNECTOR_BASE_URL=https://localhost:3000/

```
- **F5** を押すと、コネクタ API が認証して Microsoft Graph にデータをロードするために必要な Entra ID アプリ登録の作成が開始されます  
- `Terminal` ウィンドウの `func:host start` タスクに、アプリのみ権限を付与するためのリンクが表示されます  

![The UI of Visual Studio Code while running the connector function, with a prompt to use a link to grant permissions to the app used to load data.](../../assets/images/extend-m365-copilot-GC/entra-link.png)

- このリンクをコピーし、Microsoft 365 テナントのテナント管理者としてサインインしているブラウザーで開きます  
- **Grant admin consent** ボタンを使用してアプリに必要な権限を付与します  

![The UI of Microsoft Entra showing the 'API permissions' page of the app used to load data and highlighting the 'Grant admin consent for ...' command.](../../assets/images/extend-m365-copilot-GC/consent.png)

- 権限付与が完了すると、コネクタが外部接続を作成し、スキーマをプロビジョニングして **content** フォルダー内のサンプル コンテンツを Microsoft 365 テナントに取り込みます。処理には少し時間がかかるため、プロジェクトを実行したままにしてください  
- **content** フォルダー内のすべてのファイルがロードされたら、デバッガーを停止できます  
- このコネクタ プロジェクト フォルダーは閉じてもかまいません  

<cc-end-step lab="e7" exercise="1" step="2" />

### 手順 3: Microsoft365 アプリでコネクタ データをテスト

データが Microsoft 365 テナントにロードされたので、Microsoft365.com の通常の検索でコンテンツが取得できるかテストします。

[https://www.microsoft365.com/](https://www.microsoft365.com/){target=_blank} にアクセスし、上部の検索ボックスに `thanks Avery` と入力します。

Avery Howard コンサルタントへのクライアント フィードバックが外部接続から検索結果として表示されます。

![The search result page of Microsoft 365 highlighting 2 result items based on the search query 'thanks Avery' provided by the user.](../../assets/images/extend-m365-copilot-GC/search-m365.png)

データが Microsoft 365 データ、つまり Microsoft Graph の一部になったので、次はこのコネクタ データを Trey Research の宣言型エージェント **Trey Genie** のフォーカス ナレッジとして追加しましょう。

<cc-end-step lab="e7" exercise="1" step="3" />

## 演習 2 : Declarative Agent への Copilot Connector の追加

前の演習で、新しい外部接続を作成しデータを Microsoft 365 テナントに取り込みました。次は、このコネクタを宣言型エージェントに統合し、Trey Research のコンサルタントに関するフォーカス ナレッジを提供します。

### 手順 1: Microsoft Copilot Connector の connection id を取得

演習 1 で、Copilot Connector の構成値を含む **.env.local** ファイルに環境変数を追加しました。  
connection id の値として `tfcfeedback` を指定しました。Agents Toolkit がこのコネクタをデプロイすると、環境値（例: `local`）のサフィックスが connection id に追加されます。したがって、connection id は `tfcfeedbacklocal` と推測できます。  
ただし、最も簡単な方法は Graph Explorer を使用することです。

- [Microsoft Graph Explorer](https://aka.ms/ge){target=_blank} にアクセスし、管理者アカウントでサインインします  
- 右上のユーザー アバターを選択し、**Consent to permissions** を選択します  
- `ExternalConnection.Read.All` を検索して Consent を付与します。表示されるプロンプトに従って承諾します  
- リクエスト フィールドに `https://graph.microsoft.com/v1.0/external/connections?$select=id,name` と入力し、Run query を選択します  
- 対象のコネクタを探し、その id プロパティをコピーします  

![The Microsoft Graph Explorer showing the output of a query to retrieve all the connectors, with the ID 'tfcfeedbacklocal' of the custom connector highlighted.](../../assets/images/extend-m365-copilot-GC/graph-connector-id.png)


<cc-end-step lab="e7" exercise="2" step="1" />

### 手順 2: Declarative Agent マニフェストの更新

Lab 4 の宣言型エージェントの作業を再開します。すでに開いている場合はそのまま進めてください。未開の場合は、[**/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END**](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END){target=_blank} の Lab 4 完成ソリューションを開きます。

- Trey Genie 宣言型エージェントの Lab 4 ソリューションを開きます  
- **appPackage\trey-declarative-agent.json** を開きます  
- `capabilities` 配列に以下の項目を追加し、保存します  

```JSON
 {
            "name": "GraphConnectors",
            "connections": [
                {
                    "connection_id": "tfcfeedbacklocal"
                }
            ]
}
```
capability を追加したので、テストを行います。

<cc-end-step lab="e7" exercise="2" step="2" />

## 演習 3: Copilot でエージェントをテスト

アプリケーションをテストする前に、`appPackage\manifest.json` ファイルでアプリ パッケージの manifest version を更新します。手順は次のとおりです。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` ファイルを開きます  

2. JSON ファイル内の `version` フィールドを探します。次のようになっています:  
   ```json
   "version": "1.0.0"
   ```

3. バージョン番号を少しだけインクリメントします。例:  
   ```json
   "version": "1.0.1"
   ```

4. ファイルを保存します  

### 手順 1: アプリケーションの起動

この更新により、プラットフォームが変更を検出して最新バージョンのアプリを適切に適用します。

**F5** を押してプロジェクトを起動し、アプリケーション パッケージを再デプロイさせます。Microsoft Teams が起動した後、Copilot に戻ります。右側のフライアウト 1️⃣ で過去のチャットとエージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot showing the Trey Genie agent in action. On the right side there is the custom declarative agent, together with other agents. In the main body of the page there are the conversation starters and the textbox to provide a prompt for the agent.](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e7" exercise="3" step="1" />

### 手順 2: Copilot でのナレッジ テスト

Trey Genie の没入型エクスペリエンスで、以下のプロンプトを使用してテストします。

- Can you check for any feedback from clients for consultants Trey Research  
- How did Avery's guidance specifically streamline the product development process?  

![The Trey Genie agent in action in Microsoft 365 Copilot, processing requests that relate on the content available through the custom connector.](../../assets/images/extend-m365-copilot-GC/GC-Trey-Feedback.gif)

<cc-end-step lab="e7" exercise="3" step="2" />


---8<--- "ja/e-congratulations.md"

Add Copilot Connector ラボを完了しました。お疲れさまでした!

<!-- <cc-award path="Extend" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/07-add-graphconnector--ja" />