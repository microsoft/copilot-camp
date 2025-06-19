---
search:
  exclude: true
---
# ラボ E7 - 統合: Microsoft Copilot Connector を使用した Trey Genie への Knowledge 機能追加

---8<--- "ja/e-labs-prelude.md"

このラボでは、独自データを Microsoft Graph に追加し、宣言型エージェントが その知識として自然に活用できるようにする方法を学習します。  
その過程で、Microsoft Copilot Connector をデプロイし、Trey Genie の宣言型エージェントでコネクターを使用する方法を習得します。

このラボで学習する内容:

- 独自データの Microsoft Copilot Connector を Microsoft Graph にデプロイし、Microsoft 365 の各種エクスペリエンスで活用する  
- Trey Genie の宣言型エージェントをカスタマイズし、Copilot Connector を知識拡張の機能として追加する  
- アプリを実行してテストする方法を学ぶ  

<div class="note-box">
            📘 <strong>Note:</strong> このラボは Lab E4 を基盤としています。E2〜E6 の各ラボと同じフォルダーで作業を続けられますが、参照用にソリューション フォルダーも提供されています。  
    このラボの完成済み Trey Genie 宣言型ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END</a> フォルダーにあります。  
    Microsoft Copilot Connector のソース コードは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector</a> フォルダーにあります。
        </div>

!!! note "前提条件: テナント管理者アクセス"
    このラボを実行するには追加の前提条件が必要です。Copilot Connector はアプリのみ認証でコネクター API にアクセスするため、<mark>テナント管理者権限</mark>が必要です。

!!! note "前提条件: Azure Functions Visual Studio Code 拡張機能"
    - [Azure Functions Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions){target=_blank}

## Exercise 1 : Copilot Connector のデプロイ

### 手順 1: サンプル プロジェクトのダウンロード

- ブラウザーで [このリンク](https://download-directory.github.io?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector&filename=trey-feedback-connector){target=_blank} を開きます  
- **trey-feedback-connector.zip** ファイルを解凍します

!!! note
    解凍されたサンプル プロジェクト フォルダーは **trey-feedback-connector** です。この中の **content** フォルダーには、Trey Research のコンサルタントに対するクライアントからのフィードバック ファイルが含まれています。これらのファイルはすべて AI により作成されたデモ用データです。  
    目標は、これらの外部ファイルを Microsoft 365 データとしてデプロイし、宣言型エージェント Trey Genie の知識ベースとして利用できるようにすることです。

<cc-end-step lab="e7" exercise="1" step="1" />

### 手順 2: 外部接続の作成

- **trey-feedback-connector** フォルダーを Visual Studio Code で開きます  
- Visual Studio Code のアクティビティ バーで Agents Toolkit 拡張機能を開きます  
- ルート フォルダー **trey-feedback-connector** の **env** フォルダーに **.env.local** ファイルを作成します  
- 作成したファイルに次の内容を貼り付けます  

```txt
APP_NAME=TreyFeedbackConnectorApp
CONNECTOR_ID=tfcfeedback
CONNECTOR_NAME=Trey Feedback Connector
CONNECTOR_DESCRIPTION=The Trey Feedback Connector seamlessly integrate feedback data from various clients about consultants in Trey Research.
CONNECTOR_BASE_URL=https://localhost:3000/

```

- **F5** を押すと、コネクター API が Microsoft Graph にデータを読み込むために必要な Entra ID アプリ登録の作成が開始されます  
- `Terminal` ウィンドウの `func:host start` タスクで、アプリにアプリのみ権限を付与するためのリンクが表示されます  

![The UI of Visual Studio Code while running the connector function, with a prompt to use a link to grant permissions to the app used to load data.](../../assets/images/extend-m365-copilot-GC/entra-link.png)

- リンクをコピーし、Microsoft 365 テナントのテナント管理者アカウントでログインしているブラウザーで開きます  
- **Grant admin consent** ボタンを使用して、アプリに必要な権限を付与します  

![The UI of Microsoft Entra showing the 'API permissions' page of the app used to load data and highlighting the 'Grant admin consent for ...' command.](../../assets/images/extend-m365-copilot-GC/consent.png)

- 権限付与が完了すると、コネクターが外部接続を作成し、スキーマをプロビジョニングしたうえで **content** フォルダーのサンプル コンテンツを Microsoft 365 テナントに取り込みます。完了までしばらく時間がかかるため、プロジェクトは実行したままにしてください。  
- **content** フォルダー内のすべてのファイルが読み込まれたら、デバッガーを停止できます。  
- コネクターのプロジェクト フォルダーは閉じてもかまいません。

<cc-end-step lab="e7" exercise="1" step="2" />

### 手順 3: Microsoft 365 アプリでコネクター データをテストする

データが Microsoft 365 テナントに読み込まれたので、Microsoft365.com の通常検索でコンテンツがヒットするか確認しましょう。

[https://www.microsoft365.com/](https://www.microsoft365.com/){target=_blank} にアクセスし、上部の検索ボックスに `thanks Avery` と入力します。

外部接続から返された結果が表示され、コンサルタント Avery Howard に対するクライアントのフィードバックが確認できます。

![The search result page of Microsoft 365 highlighting 2 result items based on the search query 'thanks Avery' provided by the user.](../../assets/images/extend-m365-copilot-GC/search-m365.png)

これでデータが Microsoft 365 データ (Microsoft Graph) の一部になりました。次に、このコネクター データを Trey Research の宣言型エージェント **Trey Genie** の重点知識として追加します。

<cc-end-step lab="e7" exercise="1" step="3" />

## Exercise 2 : Copilot Connector を宣言型エージェントに追加

前の演習で、新しい外部接続を作成し、データを Microsoft 365 テナントに読み込みました。次に、このコネクターを宣言型エージェントに統合し、Trey Research のコンサルタントに関する集中した知識を提供します。

### 手順 1: Microsoft Copilot Connector の connection id を取得する

演習 1 では、Copilot Connector の構成値を **.env.local** に追加しました。  
connection id の値は `tfcfeedback` です。Agents Toolkit がコネクターをデプロイすると、環境値 (例: `local`) がサフィックスとして追加されるため、connection id は `tfcfeedbacklocal` になります。  
ただし、もっとも簡単な確認方法は Graph Explorer を使用することです。

- [Microsoft Graph Explorer](https://aka.ms/ge){target=_blank} にブラウザーでアクセスし、管理者アカウントでサインインします  
- 右上のユーザー アバターを選択し、**Consent to permissions** をクリックします  
- `ExternalConnection.Read.All` を検索し、その権限に Consent を付与します。プロンプトに従って承認してください  
- リクエスト フィールドに `https://graph.microsoft.com/v1.0/external/connections?$select=id,name` と入力し、Run query を選択します  
- 目的のコネクターを探し、その id プロパティをコピーします  

![The Microsoft Graph Explorer showing the output of a query to retrieve all the connectors, with the ID 'tfcfeedbacklocal' of the custom connector highlighted.](../../assets/images/extend-m365-copilot-GC/graph-connector-id.png)

<cc-end-step lab="e7" exercise="2" step="1" />

### 手順 2: 宣言型エージェント マニフェストの更新

Lab 4 の宣言型エージェントに戻りましょう。既に開いている場合はそのまま続行し、開いていない場合は次のフォルダーにある Lab 4 の完成版を開きます: [**/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END**](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END){target=_blank}。

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

これで機能が追加されました。テストを行いましょう。

<cc-end-step lab="e7" exercise="2" step="2" />

## Exercise 3: Copilot でエージェントをテストする

アプリケーションをテストする前に、`appPackage\manifest.json` ファイルでアプリ パッケージのマニフェスト バージョンを更新します。次の手順に従ってください。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` ファイルを開きます。  

2. JSON ファイル内の `version` フィールドを探します。例:  
   ```json
   "version": "1.0.0"
   ```

3. バージョン番号を小さい値でインクリメントします。例:  
   ```json
   "version": "1.0.1"
   ```

4. 変更を保存します。

### 手順 1: アプリケーションの起動

この更新により、プラットフォームは変更を検出し、最新バージョンのアプリを正しく適用します。

**F5** を押してプロジェクトを起動し、アプリ パッケージを再デプロイします。  
Microsoft Teams が起動した後、Copilot に戻ります。右側のフライアウト 1️⃣ を開いて以前のチャットとエージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot showing the Trey Genie agent in action. On the right side there is the custom declarative agent, together with other agents. In the main body of the page there are the conversation starters and the textbox to provide a prompt for the agent.](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e7" exercise="3" step="1" />

### 手順 2: Copilot で知識をテストする

Trey Genie のイマーシブ エクスペリエンスで、次のプロンプトを使用してテストします。

- Can you check for any feedback from clients for consultants Trey Research  
- How did Avery's guidance specifically streamline the product development process?

![The Trey Genie agent in action in Microsoft 365 Copilot, processing requests that relate on the content available through the custom connector.](../../assets/images/extend-m365-copilot-GC/GC-Trey-Feedback.gif)

<cc-end-step lab="e7" exercise="3" step="2" />

---8<--- "ja/e-congratulations.md"

Add Copilot Connector ラボを完了しました。お疲れさまでした!

<!-- <cc-award path="Extend" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/07-add-graphconnector" />