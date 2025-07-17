---
search:
  exclude: true
---
# ラボ E7 ‑ 統合: Microsoft Copilot Connector を使用した Trey Genie への Knowledge 機能の追加

---8<--- "ja/e-labs-prelude.md"

このラボでは、独自データを Microsoft Graph に追加し、宣言型エージェントが独自の知識として自然に活用できるようにする方法を学習します。その過程で、Microsoft Copilot Connector をデプロイし、Trey Genie 宣言型エージェントでコネクターを使用する方法を習得します。  

このラボで学習する内容:  

- Microsoft Copilot Connector を使って独自データを Microsoft Graph にデプロイし、Microsoft 365 のさまざまなエクスペリエンスで利用できるようにする  
- Trey Genie 宣言型エージェントをカスタマイズし、Copilot Connector を知識拡張のための capability として追加する  
- アプリの実行方法とテスト方法を習得する  

  <div class="note-box">
            📘 <strong>注:</strong> このラボは <strong>ラボ E4</strong> を基盤としています。E2–E6 のラボと同じフォルダーで作業を続けられますが、参照用にソリューション フォルダーも用意しています。  
    本ラボの完成済み Trey Genie 宣言型ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END</a> フォルダーにあります。  
    Microsoft Copilot Connector のソース コードは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector</a> フォルダーにあります。
        </div>



!!! note "Prerequisites: Tenant Admin Access"
    このラボを実行するには追加の前提条件が必要です。Microsoft Copilot Connector はアプリのみ認証でコネクター API にアクセスするため、<mark>テナント管理者権限</mark> が必要です。

!!! note "Prerequisites: Azure Functions Visual Studio Code extension"
    - [Azure Functions Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions){target=_blank}

## Exercise 1 : Copilot Connector のデプロイ

### Step 1: サンプル プロジェクトのダウンロード

- ブラウザーで [このリンク](https://download-directory.github.io?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector&filename=trey-feedback-connector){target=_blank} を開きます。  
- **trey-feedback-connector.zip** ファイルを展開します。  

!!! note
    展開したサンプル プロジェクトのフォルダーは **trey-feedback-connector** です。この中の **content** フォルダーには、Trey Research のコンサルタントに対する各顧客からのフィードバック ファイルが入っています。これらのファイルはすべて AI により生成されたデモ用データです。  
    目的は、これらの外部ファイルを Microsoft 365 データとしてデプロイし、宣言型エージェント Trey Genie のナレッジ ベースとして利用できるようにすることです。 

<cc-end-step lab="e7" exercise="1" step="1" />

### Step 2: 外部接続の作成

- **trey-feedback-connector** フォルダーを Visual Studio Code で開きます。  
- Visual Studio Code の Activity Bar で Agents Toolkit 拡張機能を開きます。  
- ルート フォルダー **trey-feedback-connector** 内の **env** フォルダーに **.env.local** ファイルを作成します。  
- 作成したファイルに次の内容を貼り付けます。  

```txt
APP_NAME=TreyFeedbackConnectorApp
CONNECTOR_ID=tfcfeedback
CONNECTOR_NAME=Trey Feedback Connector
CONNECTOR_DESCRIPTION=The Trey Feedback Connector seamlessly integrate feedback data from various clients about consultants in Trey Research.
CONNECTOR_BASE_URL=https://localhost:3000/

```

- **F5** を押すと、コネクター API が Microsoft Graph にデータを読み込むために必要な Entra ID アプリ登録が自動作成されます。  
- `Terminal` ウィンドウの `func:host start` タスクには、アプリにアプリのみ権限を付与するためのリンクが表示されます。  

![The UI of Visual Studio Code while running the connector function, with a prompt to use a link to grant permissions to the app used to load data.](../../assets/images/extend-m365-copilot-GC/entra-link.png)

- このリンクをコピーし、Microsoft 365 テナントのテナント管理者としてログインしているブラウザーで開きます。  
- **Grant admin consent** ボタンを使用してアプリに必要な権限を付与します。  

![The UI of Microsoft Entra showing the 'API permissions' page of the app used to load data and highlighting the 'Grant admin consent for ...' command.](../../assets/images/extend-m365-copilot-GC/consent.png)

- 権限付与が完了すると、コネクターは外部接続を作成し、スキーマをプロビジョニングして **content** フォルダーのサンプル コンテンツを Microsoft 365 テナントに取り込みます。完了までしばらくかかるので、プロジェクトは起動したままにしてください。  
- **content** フォルダー内のすべてのファイルが読み込まれたら、デバッガーを停止できます。  
- このコネクター プロジェクト フォルダーは閉じても問題ありません。  

<cc-end-step lab="e7" exercise="1" step="2" />

### Step 3: Microsoft 365 アプリでコネクター データをテスト

データが Microsoft 365 テナントに読み込まれたので、Microsoft365.com の通常の検索で内容が取得できるか確認します。

[https://www.microsoft365.com/](https://www.microsoft365.com/){target=_blank} を開き、上部の検索ボックスに `thanks Avery` と入力します。

外部接続から得られた結果が以下のように表示されます。これはコンサルタント Avery Howard に対する顧客フィードバックです。

![The search result page of Microsoft 365 highlighting 2 result items based on the search query 'thanks Avery' provided by the user.](../../assets/images/extend-m365-copilot-GC/search-m365.png)

データが Microsoft 365 データ、つまり Microsoft Graph の一部になったので、このコネクター データを **Trey Genie** と呼ばれる Trey Research の宣言型エージェントの集中ナレッジとして追加しましょう。

<cc-end-step lab="e7" exercise="1" step="3" />

## Exercise 2 : 宣言型エージェントへの Copilot Connector の追加

前の演習で外部接続を作成し、データを Microsoft 365 テナントに取り込みました。次に、このコネクターを宣言型エージェントに統合し、Trey Research のコンサルタントに関する集中ナレッジを提供します。

### Step 1: Microsoft Copilot Connector の connection id を取得

演習 1 では、Copilot Connector の構成値を含む **.env.local** ファイルに環境変数を追加しました。  
そこで設定した connection id は `tfcfeedback` です。Agents Toolkit がこのコネクターをデプロイすると、環境値（ここでは `local`）がサフィックスとして付くため、connection id は `tfcfeedbacklocal` になります。  
ただし、最も確実な方法は Graph Explorer を利用することです。  

- [Microsoft Graph Explorer](https://aka.ms/ge){target=_blank} に管理者アカウントでサインインします。  
- 右上のユーザー アバターを選択し、**Consent to permissions** をクリックします。  
- `ExternalConnection.Read.All` を検索し、その権限に Consent を付与します。プロンプトに従って承認します。  
- リクエスト フィールドに `https://graph.microsoft.com/v1.0/external/connections?$select=id,name` を入力し、Run query を選択します。  
- 対象のコネクターを見つけて、その id プロパティをコピーします。  

![The Microsoft Graph Explorer showing the output of a query to retrieve all the connectors, with the ID 'tfcfeedbacklocal' of the custom connector highlighted.](../../assets/images/extend-m365-copilot-GC/graph-connector-id.png)

<cc-end-step lab="e7" exercise="2" step="1" />

### Step 2: 宣言型エージェント マニフェストの更新

ラボ 4 で作成した宣言型エージェントを再開します。既に開いている場合はそのまま進め、開いていない場合は完成済みラボ 4 ソリューション [**/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END**](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END){target=_blank} を開きます。  

- Trey Genie 宣言型エージェントのラボ 4 ソリューションを開きます。  
- **appPackage\trey-declarative-agent.json** を開きます。  
- `capabilities` 配列に次のアイテムを追加し、保存します。  

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

capability を追加したので、次はテストです。

<cc-end-step lab="e7" exercise="2" step="2" />

## Exercise 3: Copilot でのエージェント テスト

アプリをテストする前に、`appPackage\manifest.json` でアプリ パッケージの manifest version を更新します。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` ファイルを開きます。  

2. JSON ファイル内の `version` フィールドを見つけます。次のようになっています。  
   ```json
   "version": "1.0.0"
   ```  

3. バージョン番号を小さくインクリメントします。例:  
   ```json
   "version": "1.0.1"
   ```  

4. 変更後にファイルを保存します。  

### Step 1: アプリケーションの起動

この更新により、プラットフォームが変更を検出し、最新バージョンのアプリを正しく適用します。

**F5** を押してプロジェクトを起動し、アプリ パッケージを再デプロイさせます。  
Microsoft Teams が開いた後、Copilot に戻ります。右側のフライアウト 1️⃣ を開いて以前のチャットとエージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot showing the Trey Genie agent in action. On the right side there is the custom declarative agent, together with other agents. In the main body of the page there are the conversation starters and the textbox to provide a prompt for the agent.](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e7" exercise="3" step="1" />

### Step 2: Copilot でのナレッジ テスト

Trey Genie の没入型エクスペリエンスで次のプロンプトを試してください。

- Can you check for any feedback from clients for consultants Trey Research  
- How did Avery's guidance specifically streamline the product development process?  

![The Trey Genie agent in action in Microsoft 365 Copilot, processing requests that relate on the content available through the custom connector.](../../assets/images/extend-m365-copilot-GC/GC-Trey-Feedback.gif)

<cc-end-step lab="e7" exercise="3" step="2" />


---8<--- "ja/e-congratulations.md"

You have completed lab Add Copilot Connector, Well done!

<!-- <cc-award path="Extend" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/07-add-graphconnector" />