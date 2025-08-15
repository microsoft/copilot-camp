---
search:
  exclude: true
---
# ラボ E7 - 統合: Microsoft Copilot Connector を使った Trey Genie の Knowledge 機能追加

---8<--- "ja/e-labs-prelude.md"

このラボでは、独自データを Microsoft Graph に取り込み、宣言型エージェントが独自のナレッジとして自然に活用できるようにする方法を学習します。その過程で、Microsoft Copilot Connector のデプロイ方法と、それを Trey Genie の宣言型エージェントで使用する方法を習得します。

このラボで学習する内容:

- Microsoft Copilot Connector を使って独自データを Microsoft Graph に取り込み、Microsoft 365 の各種エクスペリエンスで活用する
- Trey Genie の宣言型エージェントをカスタマイズし、Copilot Connector を Knowledge 機能として追加する
- アプリを実行し、テストする方法を学ぶ

<div class="note-box">
            📘 <strong>Note:</strong> このラボは Lab E4 の内容を基にしています。ラボ E2-E6 と同じフォルダーで作業を続けられますが、参照用のソリューション フォルダーも用意されています。  
    このラボの完成版 Trey Genie 宣言型ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END</a> フォルダーにあります。  
    Microsoft Copilot Connector のソースコードは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector</a> フォルダーにあります。
</div>

!!! note "前提条件: テナント管理者アクセス"
    このラボを実行するには追加の前提条件が必要です。Microsoft Copilot Connector はアプリのみ認証で API にアクセスするため、<mark>テナント管理者権限</mark>が必要です。

!!! note "前提条件: Azure Functions Visual Studio Code 拡張機能"
    - [Azure Functions Visual Studio Code 拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions){target=_blank}

## Exercise 1 : Copilot Connector のデプロイ

### Step 1: サンプル プロジェクトのダウンロード

- ブラウザーで [このリンク](https://download-directory.github.io?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector&filename=trey-feedback-connector){target=_blank} を開く
- **trey-feedback-connector.zip** ファイルを展開する

!!! note
    展開されたサンプル プロジェクト フォルダーは **trey-feedback-connector** です。この中の **content** フォルダーには、Trey Research のコンサルタントに対するさまざまなクライアントのフィードバック ファイルが含まれています。これらのファイルはすべて AI により生成されたデモ用データです。  
    目的は、これらの外部ファイルを Microsoft 365 データとしてデプロイし、宣言型エージェント Trey Genie のナレッジ ベースとして利用できるようにすることです。 

<cc-end-step lab="e7" exercise="1" step="1" />

### Step 2: 外部接続の作成

- **trey-feedback-connector** フォルダーを Visual Studio Code で開く
- Visual Studio Code のアクティビティ バーで Agents Toolkit 拡張機能を開く
- ルート フォルダー **trey-feedback-connector** の **env** フォルダーに **.env.local** ファイルを作成
- 新しく作成したファイルに以下を貼り付ける

```txt
APP_NAME=TreyFeedbackConnectorApp
CONNECTOR_ID=tfcfeedback
CONNECTOR_NAME=Trey Feedback Connector
CONNECTOR_DESCRIPTION=The Trey Feedback Connector seamlessly integrate feedback data from various clients about consultants in Trey Research.
CONNECTOR_BASE_URL=https://localhost:3000/

```
- **F5** を押すと、コネクター API が認証して Microsoft Graph にデータをロードするために必要な Entra ID アプリ登録が作成されます
- `Terminal` ウィンドウの `func:host start` タスクで、以下のリンクが表示されます。このリンクを使って Entra ID アプリにアプリのみ権限を付与できます  

![The UI of Visual Studio Code while running the connector function, with a prompt to use a link to grant permissions to the app used to load data.](../../assets/images/extend-m365-copilot-GC/entra-link.png)

- リンクをコピーし、Microsoft 365 テナントのテナント管理者アカウントでログインしているブラウザーで開く
- **Grant admin consent** ボタンを使ってアプリに必要な権限を付与する  

![The UI of Microsoft Entra showing the 'API permissions' page of the app used to load data and highlighting the 'Grant admin consent for ...' command.](../../assets/images/extend-m365-copilot-GC/consent.png)

- 権限が付与されると、コネクターは外部接続を作成し、スキーマをプロビジョニングし、**content** フォルダー内のサンプル コンテンツを Microsoft 365 テナントに取り込みます。完了までしばらく時間がかかるため、そのまま実行しておきます。
- **content** フォルダー内のすべてのファイルのロードが完了したら、デバッガーを停止できます。
- コネクター プロジェクト フォルダーは閉じてもかまいません。

<cc-end-step lab="e7" exercise="1" step="2" />

### Step 3: Microsoft 365 アプリでコネクター データをテストする

データが Microsoft 365 テナントにロードされたので、通常の検索で内容がヒットするか確認しましょう。

[https://www.microsoft365.com/](https://www.microsoft365.com/){target=_blank} にアクセスし、上部の検索ボックスに `thanks Avery` と入力します。

結果として、外部接続から取得されたクライアントのフィードバックが表示されます。以下はコンサルタント Avery Howard へのフィードバックの例です。

![The search result page of Microsoft 365 highlighting 2 result items based on the search query 'thanks Avery' provided by the user.](../../assets/images/extend-m365-copilot-GC/search-m365.png)

データが Microsoft 365 データ (Microsoft Graph) の一部になったので、このコネクターデータを Trey Research の宣言型エージェント **Trey Genie** のフォーカスド ナレッジとして追加しましょう。

<cc-end-step lab="e7" exercise="1" step="3" />

## Exercise 2 : 宣言型エージェントに Copilot Connector を追加

前の演習で、Microsoft 365 テナントにデータを取り込む新しい外部接続を作成しました。次に、このコネクターを宣言型エージェントに統合し、Trey Research のコンサルタントに関するフォーカスド ナレッジを提供します。

### Step 1: Microsoft Copilot Connector の connection id を取得

演習 1 で **.env.local** ファイルに環境変数を追加し、Copilot Connector の設定値を定義しました。  
connection id に `tfcfeedback` を指定しましたが、Agents Toolkit がコネクターをデプロイすると、環境値である `local` がサフィックスとして追加され `tfcfeedbacklocal` になります。  
ただし、Copilot Connector の id を取得する最も簡単な方法は Graph Explorer を使うことです。

- [Microsoft Graph Explorer](https://aka.ms/ge){target=_blank} にアクセスし、管理者アカウントでサインイン
- 右上のユーザー アバターを選択し、**Consent to permissions** を選択
- `ExternalConnection.Read.All` を検索して Consent を付与。手順に従って承認を完了
- リクエスト フィールドに `https://graph.microsoft.com/v1.0/external/connections?$select=id,name` を入力し、Run query を選択
- 目的のコネクターを見つけ、id プロパティをコピー

![The Microsoft Graph Explorer showing the output of a query to retrieve all the connectors, with the ID 'tfcfeedbacklocal' of the custom connector highlighted.](../../assets/images/extend-m365-copilot-GC/graph-connector-id.png)

<cc-end-step lab="e7" exercise="2" step="1" />

### Step 2: 宣言型エージェント マニフェストの更新

Lab 4 で作成した宣言型エージェントに戻ります。すでに開いている場合は続行、開いていない場合は [**/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END**](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END){target=_blank} フォルダーの完成版を開きます。

- Trey Genie 宣言型エージェントの Lab 4 ソリューションを開く
- **appPackage\trey-declarative-agent.json** を開く
- `capabilities` 配列に以下の項目を追加し、保存

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
Capability を追加したので、テストしましょう。

<cc-end-step lab="e7" exercise="2" step="2" />

## Exercise 3: Copilot でエージェントをテスト

アプリケーションをテストする前に、`appPackage\manifest.json` ファイルでアプリ パッケージのマニフェスト バージョンを更新します。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` ファイルを開く  
2. JSON ファイル内の `version` フィールドを探す。例:  
   ```json
   "version": "1.0.0"
   ```

3. バージョン番号を小さくインクリメントする。例:  
   ```json
   "version": "1.0.1"
   ```

4. 変更後、ファイルを保存

### Step 1: アプリケーションの起動

この更新により、プラットフォームが変更を検知し、最新バージョンを適用します。

**F5** を押してプロジェクトを起動し、アプリ パッケージを再デプロイします。  
Microsoft Teams が開いた後、Copilot に戻り、右側のフライアウト 1️⃣ を開いて過去のチャットとエージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot showing the Trey Genie agent in action. On the right side there is the custom declarative agent, together with other agents. In the main body of the page there are the conversation starters and the textbox to provide a prompt for the agent.](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e7" exercise="3" step="1" />

### Step 2: Copilot でナレッジをテスト

Trey Genie のイマーシブ エクスペリエンスで、以下のプロンプトを使用してテストします。

- Can you check for any feedback from clients for consultants Trey Research
- How did Avery's guidance specifically streamline the product development process?

![The Trey Genie agent in action in Microsoft 365 Copilot, processing requests that relate on the content available through the custom connector.](../../assets/images/extend-m365-copilot-GC/GC-Trey-Feedback.gif)

<cc-end-step lab="e7" exercise="3" step="2" />

---8<--- "ja/e-congratulations.md"

Copilot Connector の追加ラボを完了しました。お疲れさまでした!

<!-- <cc-award path="Extend" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/07-add-graphconnector--ja" />