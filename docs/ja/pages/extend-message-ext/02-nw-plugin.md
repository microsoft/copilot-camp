---
search:
  exclude: true
---
# ラボ M2 - Microsoft 365 Copilot でアプリを実行する
このラボでは、Northwind アプリを Microsoft 365 Copilot のプラグインとして実行します。 

???+ "Extend Teams Message Extension ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ拡張機能を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行する](/copilot-camp/pages/extend-message-ext/02-nw-plugin) (📍ここです)
    - [ラボ M3 - 新しい検索コマンドでプラグインを拡張する](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証を追加する](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクション コマンドでプラグインを拡張する](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! note "NOTE"
    すべてのコード変更を含む完成版は [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/) からダウンロードできます。トラブルシューティングに役立ちます。  
    編集内容をリセットする必要がある場合は、リポジトリを再度クローンしてやり直してください。

このラボでは次を行います:

- Microsoft Teams で実行したメッセージ拡張機能を Microsoft Copilot で実行する  
- Northwind データベース内の項目を自然言語プロンプトで検索・取得する方法を学習する 


## Exercise 1 - Copilot プラグインとしてサンプルを実行する

前のラボから続けている場合はデバッガーをそのまま実行したままにできるので Step 1 をスキップして Step 2 へ進んでください。停止している場合は Step 1 から始めます。 

### Step 1 : アプリをローカルで実行する

F5 キーを押すかスタート ボタン 1️⃣ をクリックしてデバッグを開始します。デバッグ プロファイルを選択する画面が表示されたら **Debug in Teams (Edge)** 2️⃣ などを選択してください。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

デバッグを開始するとブラウザーで Teams が開きます。Agents Toolkit にサインインしたのと同じ資格情報でログインしていることを確認してください。  
Teams が開くとアプリを開くかどうかのダイアログが表示されます。 

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開くとすぐに、どこでアプリを開くかを尋ねられます。既定ではパーソナル チャットです。チャンネルやグループ チャットも選択できます。「Open」を選択します。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとのパーソナル チャットが開始されます。

## Step 2 - Microsoft 365 Copilot でテストする (単一パラメーター)
!!! tip inline "Reminder"
    以下の操作を行うには、あなたのアカウントに有効な Microsoft 365 Copilot のライセンス が必要です。
ブラウザーで Teams にアクセスします: [https://teams.microsoft.com/v2/](https://teams.microsoft.com/v2/)  
開発者テナントでログインしてください。  
Microsoft 365 Copilot を使える場合、新しいアプリがチャットの上部に自動的にピン留めされます。Teams を開き、「Chats」を選択すると Copilot が表示されます。



Copilot アプリを開いたら、チャット UI の左下、作成ボックスの下を確認します。プラグイン アイコン 1️⃣ があるのでクリックし、Northwind Inventory プラグインを有効にします 2️⃣ 。

![Small panel with a toggle for each plugin](../../assets/images/extend-message-ext-02/03-02-Plugin-Panel.png)

最良の結果を得るには、各プロンプトや関連プロンプトのセットの前に「New chat」と入力するか、右上の **New chat** アイコンをクリックして新しいチャットを開始してください。

![Copilot showing its new chat screen](../../assets/images/extend-message-ext-02/03-01-New-Chat.png)

以下はメッセージ拡張機能の単一パラメーターのみを使用するプロンプト例です:

* *Find information about Chai in Northwind Inventory*

* *Find discounted seafood in Northwind. Show a table with the products, supplier names, average discount rate, and revenue per period.*

まずは *Find information about Chai in Northwind Inventory* を試します。

![Copilot showing chai](../../assets/images/extend-message-ext-02/copilot-response.png)

Adaptive Card を使って製品に対するアクションを実行してみてください。単一の項目が返される場合、Copilot は上図のようにカード全体を表示することがあります。複数の応答がある場合、Copilot は各項目の横に小さな数字を表示します。数字にカーソルを合わせると Adaptive Card が表示されます。参照 (Reference) も応答の下にリストされます。

複数の項目が返され、参照付きで表示される例を示します。

![Copilot citations](../../assets/images/extend-message-ext-02/citations.png)

次に *Find discounted seafood in Northwind. Show a table with the products, supplier names, average discount rate, and revenue per period.* を試してください。

![Copilot showing chai](../../assets/images/extend-message-ext-02/table.png)

テスト中はアプリケーションのログ メッセージを確認してください。
- Visual Studio Code に戻り、プロジェクトが実行中の端末を探します。
- 「Start application」タスクが動作しているターミナルを確認します。

Copilot がプラグインを呼び出したタイミングがわかるはずです。前述のプロンプト後には以下のようなログが表示されます。

![log messages shows a discount search for seafood](../../assets/images/extend-message-ext-02/vscode-log.png)



## Step 3 - Microsoft 365 Copilot でテストする (複数パラメーター)

この演習では、サンプル プラグインのマルチパラメーター機能を利用するプロンプトを試します。これらのプロンプトでは、[マニフェスト](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/appPackage/manifest.json) に定義された名前、カテゴリ、在庫状況、サプライヤーの都市、在庫数でデータを取得します。

例として **Find Northwind beverages with more than 100 items in stock** と入力してみてください。Copilot が応答するためには、次の条件に合致する製品を識別する必要があります:

* カテゴリが **beverages**
* 在庫状況が **in stock**
* 在庫数が **more than 100**

![Copilot citations](../../assets/images/extend-message-ext-02/citations.png)

プラグインのコードは 3 つすべてのフィルターを適用し、結果セットを提供します。

VS Code のターミナルのログ メッセージを見ると、Copilot がこの要件を理解し、最初のメッセージ拡張コマンドで 3 つのパラメーターを入力できていることがわかります。

![Screen shot of log showing a query for categoryName=beverages and stockLevel=100- ](../../assets/images/extend-message-ext-02/multi-query.png)


このプロンプトを使用すると、Copilot は OneDrive ファイルも検索して各サプライヤー契約の支払条件を見つけることがあります。この場合、一部の参照は Northwind Inventory のアイコンではなく Word のアイコンで表示されます。

例を示します:

![Copilot extracted payment terms from contracts in SharePoint](../../assets/images/extend-message-ext-02/03-06c-PaymentTerms.png)

さらに試せるプロンプトをいくつか示します:

- *Find Northwind dairy products that are low on stock. Show me a table with the product, supplier, units in stock and on order.*

- *We’ve been receiving partial orders for Tofu. Find the supplier in Northwind and draft an email summarizing our inventory and reminding them they should stop sending partial orders per our MOQ policy.*

- *Northwind will have a booth at Microsoft Community Days  in London. Find products with local suppliers and write a LinkedIn post to promote the booth and products.*

- *What beverage is high in demand due to social media that is low stock in Northwind in London. Reference the product details to update stock.*

どのプロンプトが最も効果的でしょうか。独自のプロンプトも作成し、Copilot がプラグインにどのようにアクセスしているかログ メッセージを観察してください。

<cc-next />

## Congratulations

Microsoft 365 Copilot でのプラグイン テストを見事に完了しました。次のラボに進み、別の検索基準を追加するコードを実装しましょう。**Next** を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/02-nw-plugin--ja" />