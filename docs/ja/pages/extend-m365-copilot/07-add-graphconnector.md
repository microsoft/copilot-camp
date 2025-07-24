---
search:
  exclude: true
---
# ラボ E7 - 統合: Microsoft Copilot Connector を利用した Trey Genie への知識機能の追加

---8<--- "e-labs-prelude.md"

本ラボでは、ご自身のデータを Microsoft Graph に追加し、その後、宣言型エージェントが自らの知識として有機的に活用する方法を学びます。 この過程で、Microsoft Copilot Connector をデプロイし、 Trey Genie 宣言型エージェント内で Connector を利用する方法を学習します。

本ラボで学習できる内容は：

- ご自身のデータを Microsoft Graph に取り込み、 Microsoft 365 のさまざまな体験を強化するための Microsoft Copilot Connector のデプロイ
- Trey Genie 宣言型エージェントをカスタマイズし、 Copilot Connector をその知識の拡張機能として利用する方法
- アプリの実行とテスト方法

  <div class="note-box">
            📘 <strong>注意事項:</strong>       本ラボはラボ E4 を基盤としています。 ラボ E2～E6 と同じフォルダー内で作業を継続できるはずですが、参考のためにソリューションフォルダーが提供されています。
    本ラボ用の完成済み Trey Genie 宣言型ソリューションは、<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-research-labEB-END</a> フォルダー内にあります。
    Microsoft Copilot Connector のソースコードは、<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector" target="_blank">/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector</a> フォルダー内にあります。
        </div>

!!! note "前提条件: Tenant Admin Access"
    本ラボの実行には追加の前提条件が必要です。 Microsoft Copilot Connectors は app-only 認証を用いて Connector API へアクセスするため、<mark>tenant administrator privileges</mark> が必要となります。

!!! note "前提条件: Azure Functions Visual Studio Code extension"
    - [Azure Functions Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions){target=_blank}

## 演習 1 : Copilot Connector の展開

### Step 1: サンプルプロジェクトのダウンロード

- ブラウザーで、[このリンク](https://download-directory.github.io?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-bonus-gc-lab/trey-feedback-connector&filename=trey-feedback-connector){target=_blank} にアクセス
- **trey-feedback-connector.zip** ファイルを展開

!!! note
    サンプルプロジェクトの展開されたフォルダーは **trey-feedback-connector** です。 この中に **content** フォルダーがあり、これは Trey Research のコンサルタント向けに各クライアントからのフィードバックファイルで構成されています。 これらのファイルはすべて AI によって作成されたもので、デモ目的のみです。 
    目的は、これらの外部ファイルを Microsoft 365 のデータとしてデプロイし、宣言型エージェント Trey Genie のためのナレッジベースとして利用可能にすることです。 

<cc-end-step lab="e7" exercise="1" step="1" />

### Step 2: 外部接続の作成

- Visual Studio Code で **trey-feedback-connector** フォルダーを開く
- Visual Studio Code のアクティビティバーで Agents Toolkit 拡張機能を開く
- ルートフォルダー **trey-feedback-connector** 内の **env** フォルダーに **.env.local** ファイルを作成
- 新規作成したファイルに下記内容を貼り付け

```txt
APP_NAME=TreyFeedbackConnectorApp
CONNECTOR_ID=tfcfeedback
CONNECTOR_NAME=Trey Feedback Connector
CONNECTOR_DESCRIPTION=The Trey Feedback Connector seamlessly integrate feedback data from various clients about consultants in Trey Research.
CONNECTOR_BASE_URL=https://localhost:3000/

```
- **F5** を選択すると、 Connector API が認証され Microsoft Graph へデータをロードするために必要な Entra ID アプリ登録の作成が開始されます
- `Terminal` ウィンドウの `func:host start` タスクにおいて、下記リンクが表示されます。 このリンクを利用して、 Entra ID アプリに対する app-only パーミッションを付与してください

![Visual Studio Code 上で Connector Function の実行中に、アプリへのパーミッション付与用リンクを使用するよう促すプロンプトが表示された UI。](../assets/images/extend-m365-copilot-GC/entra-link.png)

- リンクをコピーし、 Microsoft 365 テナントの tenant admin としてログインしているブラウザーで開く
- **Grant admin consent** ボタンを使用して、必要なパーミッションをアプリに付与する

![Microsoft Entra の UI で、データロード用アプリの「API permissions」ページを表示し、「Grant admin consent for ...」コマンドが強調表示された画面。](../assets/images/extend-m365-copilot-GC/consent.png)

- パーミッションが付与されると、 Connector は外部接続を作成し、スキーマのプロビジョニングおよび **content** フォルダー内のサンプルコンテンツの取り込みを Microsoft 365 テナントに対して実施します。 少々時間がかかりますので、プロジェクトを実行した状態にしておいてください。 
- **content** フォルダー内の全ファイルが読み込まれたら、デバッガーを停止可能です。 
- この Connector プロジェクトフォルダーを閉じることも可能です。

<cc-end-step lab="e7" exercise="1" step="2" />

### Step 3: Microsoft365 アプリでの Connector データテスト

データが Microsoft 365 テナントに読み込まれたので、通常の検索が Microsoft365.com のコンテンツを拾っているかテストしてみましょう。

[https://www.microsoft365.com/](https://www.microsoft365.com/){target=_blank} にアクセスし、上部の検索ボックスに `thanks Avery` と入力してください。

外部接続からの結果、基本的にはコンサルタント Avery Howard 向けのクライアントのフィードバックが表示されます。

![ユーザーが入力した検索クエリ 'thanks Avery' に基づいて 2 件の結果項目がハイライト表示された Microsoft 365 の検索結果ページ。](../assets/images/extend-m365-copilot-GC/search-m365.png)

データが Microsoft 365 のデータ、つまり Microsoft Graph の一部となったので、次はこの Connector データを Trey Research 用の宣言型エージェント **Trey Genie** のフォーカスされた知識として追加していきます。

<cc-end-step lab="e7" exercise="1" step="3" />

## 演習 2 : 宣言型エージェントへの Copilot Connector の追加

前回の演習では、データを Microsoft 365 テナントに取り込むための新しい外部接続を確立しました。 次は、この Connector を統合し、 Trey Research のコンサルタントに関するフォーカスされた知識を提供するため、宣言型エージェントに組み込みます。

### Step 1: Microsoft Copilot Connector の connection id を取得

演習 1 では、 Copilot Connector 用の構成値が記載された環境変数を **.env.local** ファイルに追加しました。 
設定した connection id の値は `tfcfeedback` です。 Agents Toolkit がこの Connector をデプロイする際、環境値（例: `local` ）のサフィックスを connection id に付与します。 よって、 connection id は `tfcfeedbacklocal` と推測できます。
しかし、 Copilot Connector id を取得する最も確実な方法は Graph Explorer を利用することです。

- [Microsoft Graph Explorer](https://aka.ms/ge){target=_blank} にアクセスし、管理者アカウントでサインイン
- 右上のユーザーアバターを選択し、 **Consent to permissions** を選択
- `ExternalConnection.Read.All` を検索し、そのパーミッションに対して Consent を選択。 プロンプトに従って同意を付与
- リクエストフィールドに `https://graph.microsoft.com/v1.0/external/connections?$select=id,name` と入力し、 Run query を選択
- 対象の Connector を見つけ、その id プロパティをコピー

![Microsoft Graph Explorer で、カスタム Connector の ID 'tfcfeedbacklocal' が強調表示されている、すべての Connector を取得するクエリの出力結果。](../assets/images/extend-m365-copilot-GC/graph-connector-id.png)

<cc-end-step lab="e7" exercise="2" step="1" />

### Step 2: 宣言型エージェントマニフェストの更新

次に、ラボ 4 で作成した宣言型エージェントに戻ります。 既に開いている場合はそのまま作業を続けるか、こちらの完成済みラボ 4 ソリューション [**/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END**](https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab04-enhance-api-plugin/trey-research-lab04-END){target=_blank} に移動してください。

- Trey Genie 宣言型エージェントのラボ 4 ソリューションを開く
- **appPackage\trey-declarative-agent.json** を開く
- `capabilities` 配列に下記項目を追加して保存

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
これで能力が追加されたので、テストを実施しましょう。

<cc-end-step lab="e7" exercise="2" step="2" />

## 演習 3: Copilot におけるエージェントのテスト

アプリケーションテストの前に、 `appPackage\manifest.json` ファイル内のアプリパッケージのマニフェストバージョンを更新してください。 以下の手順に従います：

1. プロジェクトの `appPackage` フォルダー内にある `manifest.json` ファイルを開く。

2. JSON ファイル内の `version` フィールドを探す。 以下のようになっているはずです：  
   ```json
   "version": "1.0.0"
   ```

3. バージョン番号を少しだけインクリメントしてください。 例えば、以下のように変更：  
   ```json
   "version": "1.0.1"
   ```

4. 変更後、ファイルを保存する。

### Step 1: アプリケーションの起動

この更新により、プラットフォームは変更を検知し、最新版アプリのパッケージを正しく適用します。

**F5** を選択してプロジェクトを起動し、アプリケーションパッケージの再デプロイを強制してください。
Microsoft Teams に移動します。 Copilot に戻ったら、右側のフライアウト 1️⃣ を開き、以前のチャットとエージェントを表示して Trey Genie Local エージェント 2️⃣ を選択してください。

![Microsoft 365 Copilot 上でアクション中の Trey Genie エージェント。 右側にはカスタム宣言型エージェントが、その他のエージェントとともに表示されています。 ページのメイン部分には、会話のスターターとエージェントへのプロンプトを入力するテキストボックスが配置されています。](../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-end-step lab="e7" exercise="3" step="1" />

### Step 2: Copilot での知識テスト

没入型の Trey Genie 体験において、以下のプロンプトを使用してテストしてください

- Can you check for any feedback from clients for consultants Trey Research
- How did Avery's guidance specifically streamline the product development process?

![Microsoft 365 Copilot 内でアクション中の Trey Genie エージェント。 カスタム Connector 経由で利用可能なコンテンツに関連するリクエストを処理している様子。](../assets/images/extend-m365-copilot-GC/GC-Trey-Feedback.gif)

<cc-end-step lab="e7" exercise="3" step="2" />

---8<--- "e-congratulations.md"

Copilot Connector の追加ラボを完了しました。 よくできました！

<!-- <cc-award path="Extend" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/07-add-graphconnector" />