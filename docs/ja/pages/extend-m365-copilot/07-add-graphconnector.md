---
search:
  exclude: true
---
# ラボ E7 - インテグレーション: Microsoft Copilot Connector を使用して Trey Genie にナレッジ機能を追加

---8<--- "ja/e-labs-prelude.md"

このラボでは、独自データを Microsoft Graph に追加し、宣言型エージェントが自らのナレッジとして自然に活用できるようにする方法を学びます。具体的には、 Microsoft Copilot Connector をデプロイし、それを Trey Genie の宣言型エージェントで利用する手順を習得します。

このラボで学ぶ内容:

- 独自データの Microsoft Copilot Connector を Microsoft Graph にデプロイし、さまざまな Microsoft 365 エクスペリエンスで活用する  
- Trey Genie の宣言型エージェントをカスタマイズし、 Copilot Connector をナレッジ拡張の capability として追加する  
- アプリを実行・テストする方法を学ぶ  

  <div class="note-box">
            📘 <strong>Note:</strong> このラボは Lab E4 の続きです。 E2〜E6 の同じフォルダーで作業を続けられますが、リファレンス用にソリューション フォルダーも用意されています。  
    このラボの完成版 Trey Genie 宣言型ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END</a> フォルダーにあります。  
    Microsoft Copilot Connector のソースコードは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector</a> フォルダーにあります。
        </div>



!!! note "前提条件: テナント管理者アクセス"
    このラボを実行するには追加の前提条件が必要です。 Microsoft Copilot Connectors は app-only 認証で connector API にアクセスするため、<mark>テナント管理者権限</mark> が必要です。

!!! note "前提条件: Azure Functions Visual Studio Code 拡張機能"
    - [Azure Functions Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions){target=_blank}

## Exercise 1 : Copilot Connector のデプロイ

### Step 1: サンプル プロジェクトのダウンロード

- ブラウザーで [このリンク](https://download-directory.github.io?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector&filename=trey-feedback-connector){target=_blank} を開きます  
- **trey-feedback-connector.zip** ファイルを展開します  

!!! note
    展開したフォルダー名は **trey-feedback-connector** です。この中の **content** フォルダーには、 Trey Research のコンサルタントに関するクライアントのフィードバック ファイルが含まれています。これらはすべて AI により生成されたデモ用データです。  
    目的は、これら外部ファイルを Microsoft 365 データとしてデプロイし、宣言型エージェント Trey Genie のナレッジベースとして利用できるようにすることです。 

<cc-end-step lab="e7" exercise="1" step="1" />

### Step 2: 外部接続の作成

- **trey-feedback-connector** フォルダーを Visual Studio Code で開きます  
- Visual Studio Code のアクティビティ バーで Agents Toolkit 拡張機能を開きます  
- ルート フォルダー **trey-feedback-connector** の **env** フォルダー内に **.env.local** ファイルを作成します  
- 作成したファイルに次の内容を貼り付けます  

```txt
APP_NAME=TreyFeedbackConnectorApp
CONNECTOR_ID=tfcfeedback
CONNECTOR_NAME=Trey Feedback Connector
CONNECTOR_DESCRIPTION=The Trey Feedback Connector seamlessly integrate feedback data from various clients about consultants in Trey Research.
CONNECTOR_BASE_URL=https://localhost:3000/

```
- **F5** を押すと、コネクター API が認証しデータを Microsoft Graph に読み込むための Entra ID アプリ登録が作成されます  
- `Terminal` ウィンドウの `func:host start` タスクに、アプリに app-only 権限を付与するためのリンクが表示されます  

![The UI of Visual Studio Code while running the connector function, with a prompt to use a link to grant permissions to the app used to load data.](../../assets/images/extend-m365-copilot-GC/entra-link.png)

- リンクをコピーし、テナント管理者アカウントでログインしているブラウザーで開きます  
- **Grant admin consent** ボタンを使用して必要な権限を付与します  

![The UI of Microsoft Entra showing the 'API permissions' page of the app used to load data and highlighting the 'Grant admin consent for ...' command.](../../assets/images/extend-m365-copilot-GC/consent.png)

- 権限付与後、コネクターが外部接続を作成し、スキーマをプロビジョニングして **content** フォルダーのサンプル コンテンツを Microsoft 365 テナントに取り込みます。処理にはしばらく時間がかかるため、プロジェクトは実行したままにしておきます。  
- **content** フォルダー内のすべてのファイルがロードされたら、デバッガーを停止してかまいません。  
- このコネクター プロジェクト フォルダーは閉じても問題ありません。  

<cc-end-step lab="e7" exercise="1" step="2" />

### Step 3: Microsoft 365 アプリでコネクター データをテスト

データが Microsoft 365 テナントにロードされたので、 Microsoft365.com の通常検索で内容が取得できるかを確認しましょう。

[https://www.microsoft365.com/](https://www.microsoft365.com/){target=_blank} を開き、検索ボックスに `thanks Avery` と入力します。

下図のように、コンサルタント Avery Howard へのクライアント フィードバックが外部接続の検索結果として表示されます。

![The search result page of Microsoft 365 highlighting 2 result items based on the search query 'thanks Avery' provided by the user.](../../assets/images/extend-m365-copilot-GC/search-m365.png)

データが Microsoft 365 データ (Microsoft Graph) の一部となったので、このコネクター データを Trey Research の宣言型エージェント **Trey Genie** のフォーカスド ナレッジとして追加しましょう。

<cc-end-step lab="e7" exercise="1" step="3" />

## Exercise 2 : 宣言型エージェントに Copilot Connector を追加

前のエクササイズで、データを Microsoft 365 テナントにロードする外部接続を構成しました。次は、このコネクターを宣言型エージェントに統合し、 Trey Research のコンサルタントに関するフォーカスド ナレッジを提供します。

### Step 1: Microsoft Copilot Connector の connection id を取得

エクササイズ 1 で **.env.local** ファイルに環境変数を追加しました。  
ここで設定した connection id は `tfcfeedback` です。 Agents Toolkit がこのコネクターをデプロイすると、環境値 (例: `local`) のサフィックスが付与されるため、 connection id は `tfcfeedbacklocal` になります。  
ただし、最も確実な方法は Graph Explorer を使用することです。

- [Microsoft Graph Explorer](https://aka.ms/ge){target=_blank} に管理者アカウントでサインインします  
- 右上のユーザー アバターを選択し **Consent to permissions** をクリック  
- `ExternalConnection.Read.All` を検索して Consent を与え、プロンプトに従います  
- リクエスト欄に `https://graph.microsoft.com/v1.0/external/connections?$select=id,name` と入力して **Run query** を実行  
- 目的のコネクターを見つけ、 id プロパティをコピーします  

![The Microsoft Graph Explorer showing the output of a query to retrieve all the connectors, with the ID 'tfcfeedbacklocal' of the custom connector highlighted.](../../assets/images/extend-m365-copilot-GC/graph-connector-id.png)


<cc-end-step lab="e7" exercise="2" step="1" />

### Step 2: 宣言型エージェント マニフェストを更新

Lab 4 の宣言型エージェントを再開します。すでに開いている場合はそのまま、または次のフォルダーにある Lab 4 の完成版を開きます: [**/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END**](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END){target=_blank}。

- Trey Genie 宣言型エージェントの Lab 4 ソリューションを開きます  
- **appPackage\trey-declarative-agent.json** を開きます  
- `capabilities` 配列に次の項目を追加し、保存します  

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
capability を追加したので、テストを開始します。

<cc-end-step lab="e7" exercise="2" step="2" />

## Exercise 3: Copilot でエージェントをテスト

アプリケーションをテストする前に、 `appPackage\manifest.json` ファイルでアプリ パッケージの manifest バージョンを更新します。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` ファイルを開きます  
2. JSON ファイル内の `version` フィールドを探します。次のようになっています:  
   ```json
   "version": "1.0.0"
   ```
3. バージョン番号を小さい値でインクリメントします。例:  
   ```json
   "version": "1.0.1"
   ```
4. 変更後、ファイルを保存します。  

### Step 1: アプリケーションの起動

この更新により、プラットフォームが変更を検出し、最新バージョンを正しく適用します。

**F5** を押してプロジェクトを起動し、アプリ パッケージを再デプロイします。  
Microsoft Teams が開いた後、 Copilot に戻り、右側のフライアウト 1️⃣ でこれまでのチャットとエージェントを表示し、 Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot showing the Trey Genie agent in action. On the right side there is the custom declarative agent, together with other agents. In the main body of the page there are the conversation starters and the textbox to provide a prompt for the agent.](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e7" exercise="3" step="1" />

### Step 2: Copilot でナレッジをテスト

Trey Genie の没入型エクスペリエンスで、次のプロンプトを使用してテストします。

- コンサルタント Trey Research へのクライアント フィードバックを確認できますか  
- Avery のガイダンスは製品開発プロセスをどのように効率化しましたか  

![The Trey Genie agent in action in Microsoft 365 Copilot, processing requests that relate on the content available through the custom connector.](../../assets/images/extend-m365-copilot-GC/GC-Trey-Feedback.gif)

<cc-end-step lab="e7" exercise="3" step="2" />


---8<--- "ja/e-congratulations.md"

このラボ「Copilot Connector の追加」を完了しました。お疲れさまでした!

<!-- <cc-award path="Extend" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/07-add-graphconnector" />