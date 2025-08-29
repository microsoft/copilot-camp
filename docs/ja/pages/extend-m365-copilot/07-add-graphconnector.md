---
search:
  exclude: true
---
# ラボ E7 - 統合: Microsoft Copilot Connector を使用して Trey Genie にナレッジ機能を追加

---8<--- "ja/e-labs-prelude.md"

このラボでは、独自データを Microsoft Graph に追加し、宣言型エージェントが独自のナレッジとして自然に活用できるようにする方法を学習します。その過程で、Microsoft Copilot Connector をデプロイし、それを Trey Genie の宣言型エージェントで使用する方法を習得します。 

このラボで学ぶ内容:

- 独自データを Microsoft Graph に取り込む Microsoft Copilot Connector をデプロイし、Microsoft 365 のさまざまなエクスペリエンスで活用する  
- Trey Genie の宣言型エージェントをカスタマイズし、Copilot Connector を機能として追加してナレッジを拡張する  
- アプリの実行とテスト方法を学ぶ  

  <div class="note-box">
            📘 <strong>Note:</strong> このラボは Lab E4 を基盤としています。E2-E6 のラボと同じフォルダーで作業を続けることができますが、参照用にソリューション フォルダーも提供されています。  
    このラボの完成版 Trey Genie 宣言型ソリューションは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END</a> フォルダーにあります。  
    Microsoft Copilot Connector のソースコードは <a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector</a> フォルダーにあります。
        </div>



!!! note "Prerequisites: Tenant Admin Access"
    このラボを実行するには追加の前提条件が必要です。Microsoft Copilot Connector はアプリのみの認証でコネクタ API にアクセスするため、<mark>テナント管理者権限</mark>が必要です。

!!! note "Prerequisites: Azure Functions Visual Studio Code extension"
    - [Azure Functions Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions){target=_blank}

## 演習 1 : Copilot Connector をデプロイする

### 手順 1: サンプル プロジェクトをダウンロードする

- ブラウザーで [このリンク](https://download-directory.github.io?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector&filename=trey-feedback-connector){target=_blank} にアクセスします  
- **trey-feedback-connector.zip** ファイルを解凍します  

!!! note
    解凍したサンプル プロジェクトのフォルダー名は **trey-feedback-connector** です。この中には **content** というフォルダーがあり、Trey Research のコンサルタントに関するクライアントからのフィードバック ファイルが格納されています。これらのファイルはすべて AI が生成したデモ用データです。  
    目標は、これらの外部ファイルを Microsoft 365 データとしてデプロイし、宣言型エージェント Trey Genie のナレッジ ベースとして利用できるようにすることです。 

<cc-end-step lab="e7" exercise="1" step="1" />

### 手順 2: 外部接続を作成する

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
- **F5** を押すと、コネクタ API が認証して Microsoft Graph にデータを読み込むために必要な Entra ID アプリ登録が作成されます  
- `Terminal` ウィンドウの `func:host start` タスクで、下記のリンクが表示されます。このリンクを使用してアプリにアプリのみの権限を付与できます  

![コネクタ Function 実行中の Visual Studio Code の UI。データ読み込みに使用するアプリに権限を付与するためのリンクが表示されている。](../../assets/images/extend-m365-copilot-GC/entra-link.png)

- リンクをコピーし、Microsoft 365 テナントのテナント管理者としてログインしているブラウザーで開きます  
- **Grant admin consent** ボタンを使用してアプリに必要な権限を付与します  

![Microsoft Entra の UI で、データ読み込みに使用するアプリの ‘API permissions’ ページを表示し、‘Grant admin consent for ...’ コマンドを強調表示している。](../../assets/images/extend-m365-copilot-GC/consent.png)

- 権限が付与されると、コネクタが外部接続を作成し、スキーマをプロビジョニングして **content** フォルダーのサンプル コンテンツを Microsoft 365 テナントに取り込みます。完了まで少し時間がかかるため、そのままプロジェクトを実行しておきます  
- **content** フォルダー内のすべてのファイルが読み込まれたら、デバッガーを停止できます  
- このコネクタ プロジェクト フォルダーは閉じても問題ありません  

<cc-end-step lab="e7" exercise="1" step="2" />

### 手順 3: Microsoft 365 アプリでコネクタ データをテストする

データが Microsoft 365 テナントに取り込まれたので、通常の検索でコンテンツが取得できるかを Microsoft365.com で確認してみましょう。

[https://www.microsoft365.com/](https://www.microsoft365.com/){target=_blank} にアクセスし、上部の検索ボックスに `thanks Avery` と入力します。

外部接続からの結果が以下のように表示されます。これらはコンサルタント Avery Howard へのクライアント フィードバックです。

![ユーザーが ‘thanks Avery’ を検索した際の Microsoft 365 の検索結果ページ。外部接続からの 2 件の結果がハイライトされている。](../../assets/images/extend-m365-copilot-GC/search-m365.png)

これでデータが Microsoft 365 データ (Microsoft Graph) の一部になったため、次にこのコネクタ データを Trey Research の宣言型エージェント **Trey Genie** の集中ナレッジとして追加します。

<cc-end-step lab="e7" exercise="1" step="3" />

## 演習 2 : Copilot Connector を宣言型エージェントに追加する

前の演習では、新しい外部接続を作成してデータを Microsoft 365 テナントに取り込みました。次に、このコネクタを宣言型エージェントに統合し、Trey Research のコンサルタントに関する集中ナレッジを提供します。

### 手順 1: Microsoft Copilot Connector の connection id を取得する

演習 1 では、Copilot Connector の構成値を含む **.env.local** ファイルの環境変数を追加しました。  
connection id として設定した値は `tfcfeedback` です。Agents Toolkit がこのコネクタをデプロイする際、環境値 `local` のサフィックスが自動で付与されるため、connection id は `tfcfeedbacklocal` になります。  
ただし、最も確実に Copilot Connector の id を取得する方法は Graph Explorer を使用することです。  

- [Microsoft Graph Explorer](https://aka.ms/ge){target=_blank} に管理者アカウントでサインインします  
- 右上のユーザー アバターを選択し **Consent to permissions** をクリックします  
- `ExternalConnection.Read.All` を検索し、その権限に対して Consent を実行します。プロンプトに従って承認してください  
- リクエスト フィールドに `https://graph.microsoft.com/v1.0/external/connections?$select=id,name` を入力し、Run query を選択します  
- 目的のコネクタを見つけ、その id プロパティをコピーします  

![Graph Explorer でコネクタを取得するクエリ結果を表示し、カスタム コネクタ ‘tfcfeedbacklocal’ の ID をハイライトしている。](../../assets/images/extend-m365-copilot-GC/graph-connector-id.png)


<cc-end-step lab="e7" exercise="2" step="1" />

### 手順 2: 宣言型エージェントのマニフェストを更新する

Lab 4 で作成した宣言型エージェントに戻りましょう。すでに開いている場合はそのまま続行、開いていない場合は以下のフォルダーにある Lab 4 の完成版を開きます: [**/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END**](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END){target=_blank}。

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
これで機能が追加されたので、テストする準備が整いました。

<cc-end-step lab="e7" exercise="2" step="2" />

## 演習 3: Copilot でエージェントをテストする

アプリケーションをテストする前に、`appPackage\manifest.json` のアプリ パッケージ マニフェストのバージョンを更新します。以下の手順に従ってください。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` ファイルを開きます。

2. JSON ファイル内の `version` フィールドを見つけます。例:  
   ```json
   "version": "1.0.0"
   ```

3. バージョン番号を小さくインクリメントします。例:  
   ```json
   "version": "1.0.1"
   ```

4. 変更後、ファイルを保存します。

### 手順 1: アプリケーションを起動する

この更新により、プラットフォームが変更を検出し、アプリの最新バージョンを適用します。

**F5** を押してプロジェクトを起動し、アプリ パッケージを再デプロイします。  
Microsoft Teams が起動した後、Copilot に戻ります。右側のフライアウト 1️⃣ で以前のチャットとエージェントを表示し、Trey Genie Local エージェント 2️⃣ を選択します。

![Microsoft 365 Copilot で Trey Genie エージェントが動作している様子。右側にはカスタム宣言型エージェントと他のエージェントが表示され、メイン領域には会話スターターとプロンプト入力欄がある。](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e7" exercise="3" step="1" />

### 手順 2: Copilot でナレッジをテストする

Trey Genie のイマーシブ エクスペリエンスで、次のプロンプトを使用してテストします。

- Can you check for any feedback from clients for consultants Trey Research  
- How did Avery's guidance specifically streamline the product development process?  

![Microsoft 365 Copilot で Trey Genie エージェントがカスタム コネクタのコンテンツをもとにリクエストを処理している様子。](../../assets/images/extend-m365-copilot-GC/GC-Trey-Feedback.gif)

<cc-end-step lab="e7" exercise="3" step="2" />


---8<--- "ja/e-congratulations.md"

ラボ「Add Copilot Connector」を完了しました。お疲れさまでした！

<!-- <cc-award path="Extend" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/07-add-graphconnector--ja" />