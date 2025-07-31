---
search:
  exclude: true
---
# ラボ M2 - Microsoft 365 Copilot でアプリを実行する
このラボでは、Northwind アプリを Microsoft 365 Copilot のプラグインとして実行します。 

???+ "Extend Teams Message Extension ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ拡張機能を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行する](/copilot-camp/pages/extend-message-ext/02-nw-plugin) (📍現在位置)
    - [ラボ M3 - 新しい検索コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証を追加する](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクション コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! note "注意"
    すべてのコード変更を含む完成版は [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/) からダウンロードできます。トラブルシューティングに役立ちます。  
    変更をリセットしたい場合は、リポジトリを再度クローンしてやり直してください。

このラボで行うこと:

- Microsoft Teams で実行したメッセージ拡張機能を Microsoft Copilot で実行する  
- 自然言語プロンプトを使用して Northwind データベースを検索し、項目を見つける方法を学習する  


## 演習 1 - Copilot プラグインとしてサンプルを実行する

前のラボから続けている場合はデバッガーを起動したままにして Step 1 をスキップし Step 2 に進んでください。停止している場合は Step 1 から始めます。 

### Step 1 : アプリをローカルで実行する

F5 キーを押すか 1️⃣ のスタート ボタンをクリックしてデバッグを開始します。デバッグ プロファイルの選択画面が表示されたら、「Debug in Teams (Edge)」2️⃣ などを選択します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

デバッグ開始後、ブラウザーで Teams が開きます。Agents Toolkit にサインインしたのと同じ資格情報でログインしてください。  
Teams が開くと、アプリを開くかどうかのダイアログが表示されます。 

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開くとすぐに、どの場所でアプリを開くかを尋ねられます。既定では個人チャットです。チャネルやグループ チャットも選択できます。「Open」を選択してください。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとの個人チャット画面に入ります。

## Step 2 - Microsoft 365 Copilot でテストする (単一パラメーター)
!!! tip inline "リマインダー"
    以下の演習を行うには、アカウントに Microsoft 365 Copilot の有効な ライセンス が必要です。
ブラウザーで [https://teams.microsoft.com/v2/](https://teams.microsoft.com/v2/) を開き、開発者テナントでログインします。  
Microsoft 365 Copilot をお持ちの場合、新しいアプリがチャットの上部に自動的にピン留めされます。Teams を開き、「Chats」を選択すると Copilot が表示されます。



Copilot アプリ画面で、チャット UI の左下、作成ボックスの下にプラグイン アイコン 1️⃣ が表示されます。クリックして Northwind Inventory プラグインを有効にします 2️⃣ 。

![Small panel with a toggle for each plugin](../../assets/images/extend-message-ext-02/03-02-Plugin-Panel.png)

最良の結果を得るには、各プロンプトまたは関連するプロンプト セットの前に「New chat」と入力するか、右上の **New chat** アイコンをクリックして新しいチャットを開始してください。

![Copilot showing its new chat screen](../../assets/images/extend-message-ext-02/03-01-New-Chat.png)

以下は、メッセージ拡張機能の単一パラメーターのみを使用するプロンプト例です。

* *Find information about Chai in Northwind Inventory*

* *Find discounted seafood in Northwind. Show a table with the products, supplier names, average discount rate, and revenue per period.*

まずは *Find information about Chai in Northwind Inventory* を試してみましょう。

![Copilot showing chai](../../assets/images/extend-message-ext-02/copilot-response.png)

返されたアダプティブ カードを使って製品に対してアクションを実行してみてください。1 件のみの場合は上図のようにカード全体が表示されます。複数の場合、Copilot は各アイテムの横に小さな数字を表示し、その数字にマウスオーバーするとカードが表示されます。回答の下部には参照も表示されます。

複数アイテムが返され、参照が付いている例を示します。

![Copilot citations](../../assets/images/extend-message-ext-02/citations.png)

次に *Find discounted seafood in Northwind. Show a table with the products, supplier names, average discount rate, and revenue per period.* を実行します。

![Copilot showing chai](../../assets/images/extend-message-ext-02/table.png)

テスト中はアプリケーションのログ メッセージを確認してください。
- Visual Studio Code に戻り、プロジェクトが実行されているターミナルを探します。
- 「Start application」タスクが走っているターミナルを確認します。

Copilot がプラグインを呼び出したタイミングがわかります。前述のプロンプト後は以下のログが表示されるはずです。

![log messages shows a discount search for seafood](../../assets/images/extend-message-ext-02/vscode-log.png)



## Step 3 - Microsoft 365 Copilot でテストする (複数パラメーター)

この演習では、サンプル プラグインの複数パラメーター機能を利用するプロンプトを試します。これらのプロンプトは、[マニフェスト](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/appPackage/manifest.json) で定義されている名前、カテゴリー、在庫状況、サプライヤーの都市、在庫レベルでデータを取得します。

例として **Find Northwind beverages with more than 100 items in stock** と入力してみてください。Copilot は以下の条件で製品を特定する必要があります。

* カテゴリーが **beverages**  
* インベントリー ステータスが **in stock**  
* 在庫レベルが **more than 100**  

![Copilot citations](../../assets/images/extend-message-ext-02/citations.png)

プラグイン コードは 3 つすべてのフィルターを適用して結果セットを提供します。

VS Code のターミナルのログ メッセージを見ると、Copilot が要件を理解し、最初のメッセージ拡張コマンドに 3 つのパラメーターを渡していることがわかります。

![Screen shot of log showing a query for categoryName=beverages and stockLevel=100- ](../../assets/images/extend-message-ext-02/multi-query.png)


このプロンプトを使用すると、Copilot は OneDrive 内のファイルも検索し、各サプライヤーの契約書から支払条件を取得する場合があります。その場合、一部の参照に Northwind Inventory アイコンではなく Word アイコンが表示されます。

例を示します。

![Copilot extracted payment terms from contracts in SharePoint](../../assets/images/extend-message-ext-02/03-06c-PaymentTerms.png)

さらに試せるプロンプトをいくつか紹介します。

- *Find Northwind dairy products that are low on stock. Show me a table with the product, supplier, units in stock and on order.*

- *We’ve been receiving partial orders for Tofu. Find the supplier in Northwind and draft an email summarizing our inventory and reminding them they should stop sending partial orders per our MOQ policy.*

- *Northwind will have a booth at Microsoft Community Days  in London. Find products with local suppliers and write a LinkedIn post to promote the booth and products.*

- *What beverage is high in demand due to social media that is low stock in Northwind in London. Reference the product details to update stock.*

どのプロンプトが最も効果的か試してみてください。独自のプロンプトも作成し、ログ メッセージを観察して Copilot がプラグインにアクセスする様子を確認しましょう。

<cc-next />

## まとめ

Microsoft 365 Copilot でプラグインをテストできました。次のラボで、別の検索条件を追加するコードを書きましょう。**Next** を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/02-nw-plugin--ja" />