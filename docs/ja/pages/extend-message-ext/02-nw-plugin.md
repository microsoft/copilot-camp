---
search:
  exclude: true
---
# ラボ M2 - Microsoft 365 Copilot でのアプリ実行

???+ "Extend Teams メッセージ拡張ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ拡張の概要](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - Microsoft 365 Copilot でのアプリ実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) (📍You are here)
    - [ラボ M3 - プラグインの検索コマンド拡張](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証の追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクション コマンドでのプラグイン拡張](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! note "NOTE"
    すべてのコード変更を含む完成版は [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/) からダウンロードできます。トラブルシューティングに役立ちます。
    編集内容をリセットする必要がある場合は、リポジトリを再度クローンしてやり直してください。

このラボでは、以下を行います。

- Microsoft Teams で実行したメッセージ拡張を Microsoft Copilot 上で実行します  
- 自然言語プロンプトを使用して Northwind データベース内のアイテムを検索・発見する方法を学びます  


## 演習 1 - Copilot プラグインとしてのサンプル実行

前のラボから続けている場合は、デバッガーをそのまま動かした状態で Step 1 をスキップし、Step 2 に進んでも構いません。停止している場合は Step 1 から始めてください。 

### Step 1 : アプリをローカルで実行

F5 キーを押してデバッグを開始するか、スタート ボタン 1️⃣ をクリックして再起動します。デバッグ プロファイルの選択画面が表示されたら、**Debug in Teams (Edge)** 2️⃣ または他のプロファイルを選択します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

デバッグが開始されると、Teams がブラウザー ウィンドウで開きます。Agents Toolkit にサインインしたものと同じ資格情報でログインしていることを確認してください。  
Microsoft Teams に入ると、アプリを開くかどうかを尋ねるダイアログが表示されます。 

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開くとすぐに、アプリをどこで開くかを尋ねられます。既定では個人チャットです。チャネルやグループ チャットも選択できます。**Open** を選択してください。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとの個人チャット画面に入ります。

## Step 2 - Microsoft 365 Copilot でのテスト（単一パラメーター）
!!! tip inline "Reminder"
    以下の演習を行うには、お使いのアカウントに Microsoft 365 Copilot の有効な ライセンス が必要です。
ブラウザーで Teams ([https://teams.microsoft.com/v2/](https://teams.microsoft.com/v2/)) を開き、開発者テナントでサインインしてください。  
Microsoft 365 Copilot をお持ちの場合、新しいアプリがチャットの上部に自動的にピン留めされます。Teams を開いて **Chats** を選択すると Copilot が表示されます。



Copilot アプリ画面に入ったら、作成ボックス下部左側のチャット UI を確認します。プラグイン アイコン 1️⃣ があるはずです。これをクリックし、Northwind Inventory プラグインを有効に 2️⃣ します。

![Small panel with a toggle for each plugin](../../assets/images/extend-message-ext-02/03-02-Plugin-Panel.png)

最良の結果を得るために、各プロンプト、または関連するプロンプトのセットの前に **New chat** と入力するか、右上の **New chat** アイコンをクリックして新しいチャットを開始してください。

![Copilot showing its new chat screen](../../assets/images/extend-message-ext-02/03-01-New-Chat.png)

以下は、メッセージ拡張の単一パラメーターのみを使用するプロンプト例です。

* *Find information about Chai in Northwind Inventory*

* *Find discounted seafood in Northwind. Show a table with the products, supplier names, average discount rate, and revenue per period.*

最初のプロンプト *Find information about Chai in Northwind Inventory* を試してみましょう。

![Copilot showing chai](../../assets/images/extend-message-ext-02/copilot-response.png)

返された Adaptive Card を利用して商品の操作を試してください。1 件のみ返された場合、Copilot は上記のようにカード全体を表示することがあります。複数件の場合は、小さな番号が表示されます。その番号にカーソルを合わせると Adaptive Card が表示されます。回答の下には参照も一覧表示されます。

複数アイテムが返り、参照が付いた例を示します。

![Copilot citations](../../assets/images/extend-message-ext-02/citations.png)

次に *Find discounted seafood in Northwind. Show a table with the products, supplier names, average discount rate, and revenue per period.* を試してください。

![Copilot showing chai](../../assets/images/extend-message-ext-02/table.png)

テスト中は、アプリケーション内のログ メッセージを確認してください。
- Visual Studio Code に戻り、プロジェクトが実行中のターミナルを開きます。
- 「Start application」タスクが実行されているターミナルを探します。

Copilot がプラグインを呼び出すタイミングを確認できます。前述のプロンプト後、以下のようなログが表示されるはずです。

![log messages shows a discount search for seafood](../../assets/images/extend-message-ext-02/vscode-log.png)



## Step 3 - Microsoft 365 Copilot でのテスト（複数パラメーター）

この演習では、サンプル プラグインの複数パラメーター機能を試します。これらのプロンプトでは、[マニフェスト](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/appPackage/manifest.json) で定義されている名前、カテゴリ、在庫状況、仕入先の都市、在庫レベルによってデータを取得します。

例として **Find Northwind beverages with more than 100 items in stock** と入力してみてください。Copilot が応答するには、以下を満たす商品を特定する必要があります。

* カテゴリが **beverages**  
* 在庫状況が **in stock**  
* 在庫レベルが **more than 100**  

![Copilot citations](../../assets/images/extend-message-ext-02/citations.png)

プラグインのコードは 3 つのフィルターすべてを適用し、結果セットを返します。

VS Code のターミナルでログ メッセージを見ると、Copilot がこの要件を理解し、最初のメッセージ拡張コマンドで 3 つのパラメーターを埋めたことがわかります。

![Screen shot of log showing a query for categoryName=beverages and stockLevel=100- ](../../assets/images/extend-message-ext-02/multi-query.png)


このプロンプトを使用すると、Copilot は OneDrive のファイルも検索し、各仕入先との契約書にある支払条件を見つける場合があります。その際、一部の参照には Northwind Inventory のアイコンではなく Word のアイコンが表示されます。

例を示します。

![Copilot extracted payment terms from contracts in SharePoint](../../assets/images/extend-message-ext-02/03-06c-PaymentTerms.png)

さらに試せるプロンプトをいくつか紹介します。

- *Find Northwind dairy products that are low on stock. Show me a table with the product, supplier, units in stock and on order.*

- *We’ve been receiving partial orders for Tofu. Find the supplier in Northwind and draft an email summarizing our inventory and reminding them they should stop sending partial orders per our MOQ policy.*

- *Northwind will have a booth at Microsoft Community Days in London. Find products with local suppliers and write a LinkedIn post to promote the booth and products.*

- *What beverage is high in demand due to social media that is low stock in Northwind in London. Reference the product details to update stock.*

どのプロンプトが最も効果的か試してみてください。独自のプロンプトを作成し、ログ メッセージを観察して Copilot がどのようにプラグインへアクセスするか確認しましょう。

<cc-next />

## おめでとうございます

Microsoft 365 Copilot でプラグインをテストできました。次のラボでは、別の検索条件を追加するコードを実装します。**Next** を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/02-nw-plugin" />