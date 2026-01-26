---
search:
  exclude: true
---
# ラボ E7 - 統合: Microsoft Copilot Connector を使用して Trey Genie に Knowledge 機能を追加

---8<--- "ja/e-labs-prelude.md"

このラボでは、独自データを Microsoft Graph に追加し、宣言型エージェントがそのデータを自身の知識として自然に利用できるようにする方法を学習します。その過程で、Microsoft Copilot Connector をデプロイし、Trey Genie 宣言型エージェントでそのコネクターを使用する方法を習得します。

このラボで学習する内容:

- 独自データを Microsoft Copilot Connector で Microsoft Graph にデプロイし、Microsoft 365 のさまざまなエクスペリエンスで活用する方法  
- Trey Genie 宣言型エージェントをカスタマイズし、Copilot Connector を Knowledge 機能として追加する方法  
- アプリを実行してテストする方法  

  <div class="note-box">
            📘 <strong>Note:</strong>       本ラボは Lab E4 を基にしています。E2–E6 のラボと同じフォルダーで作業を継続できますが、参照用にソリューション フォルダーも用意されています。  
    本ラボの完成済み Trey Genie 宣言型ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END</a> フォルダーにあります。  
    Microsoft Copilot Connector のソース コードは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector</a> フォルダーにあります。
        </div>



!!! note "前提条件: テナント管理者アクセス"
    本ラボを実行するには追加の前提条件が必要です。Microsoft Copilot Connector はアプリ専用認証でコネクター API にアクセスするため、<mark>テナント管理者権限</mark>が必要です。

!!! note "前提条件: Azure Functions Visual Studio Code 拡張機能"
    - [Azure Functions Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions){target=_blank}

## Exercise 1 : Copilot Connector のデプロイ

### Step 1: サンプル プロジェクトのダウンロード

- ブラウザーで [こちらのリンク](https://download-directory.github.io?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector&filename=trey-feedback-connector){target=_blank} を開きます  
- **trey-feedback-connector.zip** ファイルを解凍します  

!!! note
    解凍後のフォルダー名は **trey-feedback-connector** です。このフォルダー内の **content** フォルダーには、Trey Research のコンサルタントに対するさまざまなクライアントからのフィードバック ファイルが含まれています。これらのファイルはすべて AI によって生成されたデモ用データです。  
    目的は、これらの外部ファイルを Microsoft 365 データに取り込み、宣言型エージェント Trey Genie のナレッジ ベースとして利用できるようにすることです。 

<cc-end-step lab="e7" exercise="1" step="1" />

### Step 2: 外部接続の作成

- Visual Studio Code で **trey-feedback-connector** フォルダーを開きます  
- Visual Studio Code のアクティビティ バーで Agents Toolkit 拡張機能を開きます  
- ルート フォルダー **trey-feedback-connector** 内の **env** フォルダーに **.env.local** ファイルを作成します  
- 新規作成したファイルに以下の内容を貼り付けます  

```txt
APP_NAME=TreyFeedbackConnectorApp
CONNECTOR_ID=tfcfeedback
CONNECTOR_NAME=Trey Feedback Connector
CONNECTOR_DESCRIPTION=The Trey Feedback Connector seamlessly integrate feedback data from various clients about consultants in Trey Research.
CONNECTOR_BASE_URL=https://localhost:3000/

```
- **F5** を押すと、コネクター API が認証してデータを Microsoft Graph に読み込むための Entra ID アプリ登録が作成されます  
- `Terminal` ウィンドウの `func:host start` タスクで、以下のリンクが表示されます。このリンクを使用して、Entra ID アプリにアプリ専用の権限を付与できます  

![コネクター関数実行中の Visual Studio Code の UI。アプリに権限を付与するリンクが表示されている。](../../assets/images/extend-m365-copilot-GC/entra-link.png)

- リンクをコピーし、Microsoft 365 テナントのテナント管理者としてログインしているブラウザーで開きます  
- **Grant admin consent** ボタンを使用して必要な権限を付与します  

![Microsoft Entra の UI。読み込み用アプリの 'API permissions' ページで 'Grant admin consent for ...' コマンドが強調表示されている。](../../assets/images/extend-m365-copilot-GC/consent.png)

- 権限付与が完了すると、コネクターは外部接続を作成し、スキーマをプロビジョニングし、サンプルの **content** フォルダー内のコンテンツを Microsoft 365 テナントに取り込みます。少し時間がかかるので、プロジェクトを実行したままにしてください。  
- **content** フォルダー内のすべてのファイルが読み込まれたら、デバッガーを停止できます。  
- このコネクター プロジェクト フォルダーは閉じても構いません。  

<cc-end-step lab="e7" exercise="1" step="2" />

### Step 3: Microsoft 365 アプリでコネクター データをテスト

データが Microsoft 365 テナントに読み込まれたので、通常の検索で内容がヒットするか確認します。

[https://www.microsoft365.com/](https://www.microsoft365.com/){target=_blank} にアクセスし、上部の検索ボックスに `thanks Avery` と入力します。

すると、外部接続からの結果が表示されます。これはコンサルタント Avery Howard に対するクライアント フィードバックです。

![Microsoft 365 の検索結果ページ。ユーザーが入力した検索クエリ 'thanks Avery' に基づき、2 件の結果アイテムがハイライトされている。](../../assets/images/extend-m365-copilot-GC/search-m365.png)

データが Microsoft 365 データ、つまり Microsoft Graph の一部となったので、このコネクター データを Trey Research 向け宣言型エージェント **Trey Genie** のフォーカスド ナレッジとして追加します。

<cc-end-step lab="e7" exercise="1" step="3" />

## Exercise 2 : Copilot Connector を宣言型エージェントに追加

前のエクササイズで、新しい外部接続を作成しデータを Microsoft 365 テナントに取り込みました。次に、このコネクターを宣言型エージェントに統合し、Trey Research のコンサルタントに関するフォーカスド ナレッジを提供します。

### Step 1: Microsoft Copilot Connector の connection id を取得

Exercise 1 で **.env.local** ファイルに環境変数を追加し、Copilot Connector の構成値を設定しました。  
connection id として `tfcfeedback` を指定しましたが、Agents Toolkit がこのコネクターをデプロイすると、環境値 `local` がサフィックスとして付与されます。そのため、connection id は `tfcfeedbacklocal` と推測できます。  
ただし、最も簡単に Copilot Connector の id を取得する方法は Graph Explorer を使用することです。

- [Microsoft Graph Explorer](https://aka.ms/ge){target=_blank} にアクセスし、管理者アカウントでサインインします  
- 右上のユーザー アバターを選択し **Consent to permissions** をクリックします  
- `ExternalConnection.Read.All` を検索して選択し、同意を与えます。指示に従って同意を完了します  
- リクエスト フィールドに `https://graph.microsoft.com/v1.0/external/connections?$select=id,name` と入力し **Run query** を選択します  
- 目的のコネクターを見つけ、その id プロパティをコピーします  

![Microsoft Graph Explorer でコネクター一覧を取得するクエリの出力。カスタム コネクター ID 'tfcfeedbacklocal' がハイライトされている。](../../assets/images/extend-m365-copilot-GC/graph-connector-id.png)


<cc-end-step lab="e7" exercise="2" step="1" />

### Step 2: 宣言型エージェント マニフェストの更新

Lab 4 の宣言型エージェントに戻ります。既に開いている場合はそのまま続行、もしくは次のフォルダーにある Lab 4 の完成ソリューションを開きます: [**/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END**](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END){target=_blank}。

- Trey Genie 宣言型エージェントの Lab 4 ソリューションを開きます  
- **appPackage\trey-declarative-agent.json** を開きます  
- `capabilities` 配列に次を追加し、保存します  

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
これで機能が追加されました。テストを行います。

<cc-end-step lab="e7" exercise="2" step="2" />

## Exercise 3: Copilot でエージェントをテスト

アプリケーションをテストする前に、`appPackage\manifest.json` ファイルでパッケージのマニフェスト バージョンを更新します。手順:

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` ファイルを開きます。  

2. JSON ファイルの `version` フィールドを見つけます。例:  
   ```json
   "version": "1.0.0"
   ```

3. バージョン番号を小さくインクリメントします。例:  
   ```json
   "version": "1.0.1"
   ```

4. 変更後、ファイルを保存します。  

### Step 1: アプリケーションの起動

この更新により、プラットフォームが変更を検出し、最新バージョンのアプリを適用できます。

**F5** を押してプロジェクトを起動し、アプリケーション パッケージを再デプロイします。  
Microsoft Teams が起動します。Copilot に戻ったら、右側のフライアウト 1️⃣ を開き、履歴チャットとエージェントを表示して **Trey Genie Local** エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot で Trey Genie エージェントが動作している画面。右側にカスタム宣言型エージェントが表示され、中央には会話スターターとプロンプト入力ボックスがある。](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e7" exercise="3" step="1" />

### Step 2: Copilot でナレッジをテスト

Trey Genie の没入型体験で、次のプロンプトを使用してテストします

- Can you check for any feedback from clients for consultants Trey Research  
- How did Avery's guidance specifically streamline the product development process?  

![Microsoft 365 Copilot 内で Trey Genie エージェントがカスタム コネクター経由のコンテンツを利用してリクエストを処理している様子。](../../assets/images/extend-m365-copilot-GC/GC-Trey-Feedback.gif)

<cc-end-step lab="e7" exercise="3" step="2" />


---8<--- "ja/e-congratulations.md"

このラボ「Add Copilot Connector」を完了しました。お疲れさまでした!

<!-- <cc-award path="Extend" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/07-add-graphconnector--ja" />