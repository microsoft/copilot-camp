---
search:
  exclude: true
---
# ラボ M2 - Microsoft 365 Copilot でアプリ実行

このラボでは、Northwind アプリを Microsoft 365 Copilot のプラグインとして実行します。

???+ "Extend Teams メッセージ拡張ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ拡張を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) (📍現在のラボ)
    - [ラボ M3 - 新しい検索コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証を追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクション コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! note "注意"
    すべてのコード変更を含む完成版は [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/) からダウンロードできます。トラブルシューティングに役立ちます。  
    変更をリセットしたい場合は、リポジトリを再度クローンして最初からやり直してください。

このラボで学ぶこと:

- Microsoft Teams で実行したメッセージ拡張を Microsoft Copilot で実行する方法
- 自然言語プロンプトを使用して Northwind データベース内の項目を検索・取得する方法  

## 演習 1 - Copilot プラグインとしてサンプルを実行

前のラボから続けている場合はデバッガーをそのまま稼働させ Step 1 をスキップして Step 2 に進んでください。停止している場合は Step 1 から開始します。 

### Step 1 : アプリをローカルで実行

F5 を押してデバッグを開始するか、スタート ボタン 1️⃣ をクリックして再起動します。デバッグ プロファイルを選択する画面が表示されるので、Debug in Teams (Edge) 2️⃣ を選択するか、別のプロファイルを選択します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

デバッグが開始するとブラウザーで Teams が開きます。Agents Toolkit にサインインしたものと同じ資格情報でログインしてください。  
Teams が開くと、アプリを開くかどうかのダイアログが表示されます。 

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開くと、どの場所でアプリを開くか尋ねられます。既定では個人チャットです。チャンネルやグループ チャットも選択できます。「Open」を選択してください。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとの個人チャット画面になります。

## Step 2 - Microsoft 365 Copilot でテスト (単一パラメーター)
!!! tip inline "リマインダー"
    以下の演習を行うには、使用しているアカウントに Microsoft 365 Copilot の有効なライセンスが必要です。

開発者テナントでログインした状態でブラウザーから Teams ([https://teams.microsoft.com/v2/](https://teams.microsoft.com/v2/)) を開きます。  
Microsoft 365 Copilot をお持ちの場合は、新しいアプリが自動的にチャット一覧の上部に固定されます。Teams を開いて「Chats」を選択すると Copilot が表示されます。



Copilot の画面に入ったら、チャット UI の下部左側、入力ボックスの下にあるプラグイン アイコン 1️⃣ をクリックし、Northwind Inventory プラグイン 2️⃣ を有効にします。

![Small panel with a toggle for each plugin](../../assets/images/extend-message-ext-02/03-02-Plugin-Panel.png)

最良の結果を得るために、各プロンプトまたは関連する一連のプロンプトの前に「New chat」と入力するか、右上の **New chat** アイコンをクリックして新しいチャットを開始してください。

![Copilot showing its new chat screen](../../assets/images/extend-message-ext-02/03-01-New-Chat.png)

以下はメッセージ拡張の単一パラメーターのみを使用するいくつかのプロンプト例です。

* *Find information about Chai in Northwind Inventory*

* *Find discounted seafood in Northwind. Show a table with the products, supplier names, average discount rate, and revenue per period.*

まずは *Find information about Chai in Northwind Inventory* を試してみましょう。

![Copilot showing chai](../../assets/images/extend-message-ext-02/copilot-response.png)

返された Adaptive Card を使って製品に対するアクションを実行できます。1 件のみ返された場合、Copilot は上図のようにカード全体を表示することがあります。複数件の場合は各項目の横に小さな数字が表示され、その数字にカーソルを合わせるとカードが表示されます。回答の下部には参照も表示されます。

複数項目と参照の例を示します。

![Copilot citations](../../assets/images/extend-message-ext-02/citations.png)

次に、 *Find discounted seafood in Northwind. Show a table with the products, supplier names, average discount rate, and revenue per period.* を試してみてください。

![Copilot showing chai](../../assets/images/extend-message-ext-02/table.png)

テスト中はアプリケーションのログ メッセージを確認してください。  
- Visual Studio Code に戻り、プロジェクトを実行しているターミナルを開きます。  
- 「Start application」タスクが実行中のターミナルを探します。

Copilot がプラグインを呼び出したタイミングを確認できます。たとえば、先ほどのプロンプト後には次のようなログが表示されます。

![log messages shows a discount search for seafood](../../assets/images/extend-message-ext-02/vscode-log.png)



## Step 3 - Microsoft 365 Copilot でテスト (複数パラメーター)

この演習では、サンプル プラグインのマルチパラメーター機能を活用するプロンプトを試します。これらのプロンプトでは、[マニフェスト](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/appPackage/manifest.json) で定義されている名前、カテゴリ、在庫状況、サプライヤーの都市、在庫レベルによってデータを取得します。

たとえば **Find Northwind beverages with more than 100 items in stock** と入力してみてください。Copilot が応答するには次の条件を満たす製品を特定する必要があります。

* カテゴリが **beverages**
* 在庫状況が **in stock**
* 在庫レベルが **100 個超**

![Copilot citations](../../assets/images/extend-message-ext-02/citations.png)

プラグインのコードは 3 つすべてのフィルターを適用し、結果を返します。

VS Code のターミナルでログ メッセージを確認すると、Copilot がこの要件を理解し、最初のメッセージ拡張コマンドで 3 つのパラメーターを設定していることがわかります。

![Screen shot of log showing a query for categoryName=beverages and stockLevel=100- ](../../assets/images/extend-message-ext-02/multi-query.png)


このプロンプトを使用すると、Copilot は OneDrive 内のファイルを検索し、各サプライヤーの契約書にある支払い条件を探す場合もあります。この場合、一部の参照には Northwind Inventory アイコンではなく Word アイコンが付くことに注意してください。

例:

![Copilot extracted payment terms from contracts in SharePoint](../../assets/images/extend-message-ext-02/03-06c-PaymentTerms.png)

さらに試せるプロンプト例:

- *Find Northwind dairy products that are low on stock. Show me a table with the product, supplier, units in stock and on order.*

- *We’ve been receiving partial orders for Tofu. Find the supplier in Northwind and draft an email summarizing our inventory and reminding them they should stop sending partial orders per our MOQ policy.*

- *Northwind will have a booth at Microsoft Community Days in London. Find products with local suppliers and write a LinkedIn post to promote the booth and products.*

- *What beverage is high in demand due to social media that is low stock in Northwind in London. Reference the product details to update stock.*

どのプロンプトが最もよい結果になるか試してみてください。独自のプロンプトも作成し、Copilot がプラグインにどのようにアクセスするかログ メッセージで観察しましょう。

<cc-next />

## おめでとうございます

Microsoft 365 Copilot でプラグインをテストする作業が完了しました。次のラボでは、別の検索条件を追加するコードを実装します。 **Next** を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/02-nw-plugin--ja" />