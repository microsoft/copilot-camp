---
search:
  exclude: true
---
# Lab M2 ― Microsoft 365 Copilot でのアプリ実行
このラボでは、 Northwind アプリを Microsoft 365 Copilot のプラグインとして実行します。

???+ "Teams メッセージ拡張ラボのナビゲーション (Extend Path)"
    - [Lab M0 ― 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [Lab M1 ― Northwind メッセージ拡張の概要](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [Lab M2 ― Microsoft 365 Copilot でのアプリ実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) (📍You are here)
    - [Lab M3 ― 新しい検索コマンドでプラグイン拡張](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [Lab M4 ― 認証の追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [Lab M5 ― アクションコマンドでプラグイン拡張](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! note "注意事項"
    すべてのコード変更を含んだ完成版演習は [from here](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/) からダウンロードできます。これはトラブルシューティングに役立つ場合があります。  
    編集内容をリセットする必要がある場合は、リポジトリを再度クローンして最初から始めることができます。

このラボでは、以下を実施します:

- Microsoft Teams 上で実行したメッセージ拡張を Microsoft Copilot で実行する
- 自然言語プロンプトを使用して、 Northwind データベース内のアイテムを検索・発見する方法を学ぶ


## 演習 1 ― Copilot プラグインとしてのサンプル実行

前のラボから引き続きの場合は、デバッガーを継続して実行している状態ならステップ 1 をスキップしてステップ 2 に進んでください。既に停止している場合は、ステップ 1 から始めます。

### ステップ 1 : ローカルでアプリ実行

デバッグを開始するには、 F5 をクリックして再起動するか、開始ボタン 1️⃣ をクリックしてください。デバッグプロファイルを選択する機会が表示されるので、 Teams (Edge) の Debug を選択するか、他のプロファイルを選んでください。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

デバッグ実行により Teams がブラウザーウィンドウで開きます。Agents Toolkit にサインインしたのと同じ資格情報でログインしてください。ログイン後、 Microsoft Teams がアプリを開くかどうかを確認するダイアログを表示します。

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

アプリが開かれると、どこでアプリを開くか尋ねられます。デフォルトはパーソナルチャットになっており、なお、チャンネルまたはグループチャットでも選択できます。「Open」を選択してください。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これで、アプリとのパーソナルチャット状態になります。

## ステップ 2 ― Microsoft 365 Copilot でのテスト（単一パラメーター）

!!! tip inline "リマインダー"
    以下の演習を実行するには、 アカウントに有効な Microsoft 365 Copilot のライセンスが必要です。  
    ブラウザーの Teams（[https://teams.microsoft.com/v2/](https://teams.microsoft.com/v2/)）に開発者テナントでログインしてください。  
    Microsoft 365 Copilot をお持ちの場合、新しいアプリが自動的にチャット上部にピン留めされます。Teams を開いて、「chats」を選択すると、Copilot が表示されます。

Copilot アプリの画面に入ったら、チャットユーザーインターフェースの左下、作成ボックスの下にプラグインアイコン 1️⃣ が表示されます。これをクリックして、 Northwind Inventory プラグインを有効にしてください 2️⃣ 。

![Small panel with a toggle for each plugin](../../assets/images/extend-message-ext-02/03-02-Plugin-Panel.png)

より良い結果を得るには、各プロンプトまたは関連するプロンプトのセットの前に、「New chat」と入力するか、右上の **New chat** アイコンをクリックして新しいチャットを開始してください。

![Copilot showing its new chat screen](../../assets/images/extend-message-ext-02/03-01-New-Chat.png)

以下はメッセージ拡張の単一パラメーターのみを使用するプロンプトの例です:

* *Northwind Inventory で Chai の情報を探す*

* *Northwind で割引対象のシーフードを探す。製品、サプライヤー名、平均割引率、期間ごとの収益を含むテーブルを表示する*

まずは最初のプロンプトを試してみましょう。 *Northwind Inventory で Chai の情報を探す*

![Copilot が Chai を表示](../../assets/images/extend-message-ext-02/copilot-response.png)

これらの adaptive cards を使用して、製品に対して操作を実行してみてください。もし単一のアイテムが返された場合、Copilot は上記のようにカード全体を表示することがあります。複数の応答の場合、Copilot は各アイテムの横に小さな番号を表示するかもしれません。これらの番号にカーソルを合わせると、adaptive card が表示されます。参照情報も応答の下部に一覧となります。

複数のアイテムが参照情報とともに返された例を示します.

![Copilot citations](../../assets/images/extend-message-ext-02/citations.png)

次に、*Northwind で割引対象のシーフードを探す。製品、サプライヤー名、平均割引率、期間ごとの収益を含むテーブルを表示する* を試してください.

![Copilot がテーブルを表示](../../assets/images/extend-message-ext-02/table.png)

テスト中は、アプリケーション内のログメッセージを確認してください。
- プロジェクトが実行中の Visual Studio Code に移動してください。
- 「Start application」タスクが実行されているターミナルを見つけてください。

Copilot がプラグインを呼び出すタイミングがログに表示されます。例えば、前述のプロンプトの後に以下のログが表示されます。

![シーフードに対する割引検索を示すログメッセージ](../../assets/images/extend-message-ext-02/vscode-log.png)

## ステップ 3 ― Microsoft 365 Copilot でのテスト（複数パラメーター）

この演習では、サンプルプラグインの複数パラメーター機能を活用するいくつかのプロンプトを試します。これらのプロンプトは、[the manifest](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/appPackage/manifest.json) に定義されている名前、カテゴリ、在庫状況、サプライヤーの都市、および在庫レベルに基づいて取得可能なデータを要求します。

例えば、**Find Northwind beverages with more than 100 items in stock** とプロンプトを入力してみてください。応答するために、Copilot は以下の条件に該当する製品を特定する必要があります:

* カテゴリが **beverages**
* 在庫状況が **in stock**
* 在庫レベルが **100 を超える**

![Copilot の引用文](../../assets/images/extend-message-ext-02/citations.png)

プラグインコードはこれら 3 つのフィルターを適用し、結果セットを提供します。

VS Code のターミナル内のログメッセージを見ると、Copilot がこの要求を理解し、最初のメッセージ拡張コマンドに 3 つのパラメーターを埋め込むことができたことが確認できます.

![categoryName=beverages と stockLevel=100- のクエリを示すログのスクリーンショット](../../assets/images/extend-message-ext-02/multi-query.png)

このプロンプトを使用することにより、Copilot は各サプライヤーの契約書から支払い条件を探すために OneDrive ファイルも検索するかもしれません。この場合、いくつかの参照には Northwind Inventory アイコンではなく、Word のアイコンが表示されることに気付くでしょう.

![Copilot が SharePoint の契約書から支払い条件を抽出](../../assets/images/extend-message-ext-02/03-06c-PaymentTerms.png)

さらに試すためのプロンプト例をいくつかご紹介します:

- *Northwind で在庫が少ない乳製品を見つける。製品、サプライヤー、在庫単位数、および発注数を含むテーブルを表示する.*
- *Tofu に対して部分的な注文が届いています。Northwind でサプライヤーを見つけ、在庫状況を要約し、MOQ ポリシーに基づいて部分注文の送付を停止するよう通知するメールのドラフトを作成する.*
- *Northwind は London の Microsoft Community Days にブースを出展します。現地のサプライヤーがいる製品を探し、ブースと製品を宣伝する LinkedIn 投稿を書く.*
- *London の Northwind で在庫が少なく、ソーシャルメディアの影響により需要が高い飲料は何か。製品詳細を参照して在庫を更新する.*

どのプロンプトが最も効果的でしたか？ ご自身でプロンプトを考え、ログメッセージを確認して、Copilot がどのようにプラグインにアクセスするかを観察してみてください.

<cc-next />

## おめでとうございます

Microsoft 365 Copilot でプラグインのテストを見事に完了しました。次は別の検索基準に対応するコードを追加するために、次のラボに進んでください。**Next** を選択してください.

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/02-nw-plugin" />