---
search:
  exclude: true
---
# ラボ M2 - Microsoft 365 Copilot でアプリを実行する
このラボでは、Northwind アプリを Microsoft 365 Copilot のプラグインとして実行します。 

???+ "Extend Teams Message Extension ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 事前準備](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ拡張機能の概要](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) (📍現在位置)
    - [ラボ M3 - 新しい検索コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証を追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクション コマンドを追加してプラグインを強化](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! note "NOTE"
    すべてのコード変更を反映した完成版は [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/) からダウンロードできます。トラブルシューティングに便利です。
    編集内容をリセットしたい場合は、リポジトリを再度クローンしてやり直してください。

このラボで学ぶこと:

- Microsoft Teams で動かしたメッセージ拡張機能を Microsoft Copilot で実行する  
- ナチュラル ランゲージ プロンプトを使用して Northwind データベースを検索し、アイテムを見つける方法を理解する  


## 演習 1 - Copilot プラグインとしてサンプルを実行する

前のラボから続けている場合はデバッガーを起動したまま Step 1 をスキップし Step 2 に進めます。停止している場合は Step 1 から開始してください。 

### Step 1 : アプリをローカルで実行する

F5 キーを押してデバッグを開始するか、スタート ボタン 1️⃣ をクリックして再起動します。デバッグ プロファイルの選択画面が現れるので、Debug in Teams (Edge) 2️⃣ などを選択します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

デバッグを開始すると Teams がブラウザー ウィンドウで開きます。Agents Toolkit にサインインしたものと同じ資格情報でログインしていることを確認してください。  
Teams が開くとアプリを開くかどうか尋ねるダイアログが表示されます。 

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開くとすぐにアプリをどこで開くか聞かれます。既定では個人チャットですが、チャンネルやグループ チャットも選択できます。「Open」をクリックします。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとの個人チャットが開きます。

## Step 2 - Microsoft 365 Copilot でテストする (単一パラメーター)
!!! tip inline "Reminder"
    以下の演習を行うには、お使いのアカウントに Microsoft 365 Copilot の有効な ライセンス が必要です。

ブラウザーで Teams [https://teams.microsoft.com/v2/](https://teams.microsoft.com/v2/) を開き、開発用テナントでログインします。  
Microsoft 365 Copilot をお持ちの場合、新しいアプリが自動的にチャット一覧の上部にピン留めされます。Teams を開いて **Chats** を選択すると Copilot が表示されます。



Copilot 画面が開いたら、チャット UI の左下 (作成ボックスの下) にあるプラグイン アイコン 1️⃣ をクリックし、Northwind Inventory プラグインを有効にします 2️⃣ 。

![Small panel with a toggle for each plugin](../../assets/images/extend-message-ext-02/03-02-Plugin-Panel.png)

最良の結果を得るため、各プロンプトまたは関連するプロンプト セットの前に「New chat」と入力するか、右上の **New chat** アイコンをクリックして新しいチャットを開始してください。

![Copilot showing its new chat screen](../../assets/images/extend-message-ext-02/03-01-New-Chat.png)

以下はメッセージ拡張機能の単一パラメーターのみを利用するサンプル プロンプトです。

* *Northwind Inventory で Chai の情報を探して*  
  *(英語原文: Find information about Chai in Northwind Inventory)*

* *Northwind の割引された seafood を検索し、製品名・サプライヤー名・平均割引率・期間別収益を表で示して*  
  *(英語原文: Find discounted seafood in Northwind. Show a table with the products, supplier names, average discount rate, and revenue per period.)*

まず最初のプロンプト *Northwind Inventory で Chai の情報を探して* を試してみましょう。

![Copilot showing chai](../../assets/images/extend-message-ext-02/copilot-response.png)

返されたアダプティブ カードを使用して製品に対するアクションを試してみてください。1 件のみ返された場合は上図のようにカード全体が表示されます。複数件の場合、Copilot は各カードの横に小さな数字を表示します。その数字にカーソルを合わせるとカードが表示され、回答の下部に参照もリストされます。

複数件が返され、参照が表示される例を次に示します。

![Copilot citations](../../assets/images/extend-message-ext-02/citations.png)

次に *Northwind の割引された seafood を検索し、製品名・サプライヤー名・平均割引率・期間別収益を表で示して* を試してください。

![Copilot showing chai](../../assets/images/extend-message-ext-02/table.png)

テスト中はアプリケーション内のログ メッセージを確認しましょう。  
- Visual Studio Code でプロジェクトを実行しているウィンドウに切り替えます。  
- 「Start application」タスクが実行中のターミナルを探します。  

Copilot がプラグインを呼び出したタイミングが確認できます。たとえば先ほどのプロンプトの後、次のようなログが表示されます。

![log messages shows a discount search for seafood](../../assets/images/extend-message-ext-02/vscode-log.png)



## Step 3 - Microsoft 365 Copilot でテストする (複数パラメーター)

この演習では、サンプル プラグインのマルチパラメーター機能を使用するプロンプトを試します。名前、カテゴリ、在庫状況、サプライヤーの都市、在庫レベルでデータを取得する要求を行います。これらは [manifest](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/appPackage/manifest.json) で定義されています。

例として **Northwind で在庫 100 個超えの beverages を探して** と入力してみましょう。Copilot が応答するためには次の条件を満たす必要があります。

* カテゴリが **beverages**
* 在庫状況が **in stock**
* 在庫レベルが **100 個超え**

![Copilot citations](../../assets/images/extend-message-ext-02/citations.png)

プラグイン コードは 3 つすべてのフィルターを適用し、結果セットを提供します。

VS Code のターミナルでログ メッセージを見ると、Copilot がこれらの要件を理解し、最初のメッセージ拡張コマンドで 3 つのパラメーターを正しく設定したことが分かります。

![Screen shot of log showing a query for categoryName=beverages and stockLevel=100- ](../../assets/images/extend-message-ext-02/multi-query.png)


このプロンプトを使用すると、Copilot は OneDrive 内のファイルも検索し、各サプライヤーの契約書から支払い条件を見つける場合があります。その場合、参照には Northwind Inventory アイコンではなく Word アイコンが表示されます。

例を示します。

![Copilot extracted payment terms from contracts in SharePoint](../../assets/images/extend-message-ext-02/03-06c-PaymentTerms.png)

さらに試せるプロンプト:

- *在庫が少ない Northwind の dairy 製品を探して。製品名・サプライヤー・在庫数・発注中数を表で示して*  
  *(英語原文: Find Northwind dairy products that are low on stock. Show me a table with the product, supplier, units in stock and on order.)*

- *Tofu の発注が部分納品になっています。Northwind でサプライヤーを探し、在庫状況をまとめ、MOQ ポリシーに従い部分納品を停止するよう依頼するメールを下書きしてください*  

- *London の Microsoft Community Days に Northwind がブースを出します。現地サプライヤーがいる製品を探し、ブースと製品を宣伝する LinkedIn 投稿を作成してください*  

- *SNS で需要が高いが Northwind で在庫が少ない London の beverage は何ですか。参照として製品詳細を提示し、在庫を更新してください*  

どのプロンプトが最も効果的か試してみてください。独自のプロンプトも作成し、ログ メッセージを観察して Copilot がどのようにプラグインへアクセスするか確認しましょう。

<cc-next />

## おめでとうございます

Microsoft 365 Copilot でプラグインをテストする作業を完了しました。次のラボに進み、検索条件を追加するコードを書いてみましょう。**Next** を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/02-nw-plugin" />