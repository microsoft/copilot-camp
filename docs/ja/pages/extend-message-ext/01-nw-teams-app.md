---
search:
  exclude: true
---
# ラボ M1 - Northwind メッセージ拡張機能の理解

このラボでは、ベースアプリである Northwind メッセージ拡張機能を実行します。最初の演習ではソースコードに慣れていただき、最後にアプリケーションを Teams で実行します。

???+ "Extend Teams Message Extension ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ拡張機能の理解](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) (📍現在地)
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証を追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクション コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/05-add-action) 

このラボで行うこと:

- Northwind メッセージ拡張機能のコードを簡単に確認する
- アプリケーションを Teams で実行する

## Exercise 1 - コードツアー

まず、ベースアプリである Northwind のコードを確認しましょう。 

### Step 1 - マニフェストを確認する

Microsoft 365 アプリケーションの中核はアプリケーション マニフェストです。ここに、Microsoft 365 がアプリケーションへアクセスするために必要な情報を記述します。

前のラボで使用した **Northwind** 作業ディレクトリ内の **appPackage** フォルダーにある [manifest.json](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/appPackage/manifest.json) を開きます。この JSON ファイルはアイコン ファイルとともに ZIP 形式にまとめられ、アプリケーション パッケージを構成します。"icons" プロパティにはこれらアイコンへのパスが含まれています。

~~~json
"icons": {
    "color": "Northwind-Logo3-192-${{TEAMSFX_ENV}}.png",
    "outline": "Northwind-Logo3-32.png"
},
~~~

アイコン名の中に `${{TEAMSFX_ENV}}` というトークンがあることに注目してください。Agents Toolkit はこれを環境名（"local" や "dev" など）に置き換えます。そのため環境に応じてアイコンの色が変わります。

続いて "name" と "description" を確認します。description がかなり長いことに気付くでしょう。これはユーザーと Copilot の双方が、アプリケーションの機能と利用シーンを理解するために重要です。

~~~json
    "name": {
        "short": "Northwind Inventory",
        "full": "Northwind Inventory App"
    },
    ...
~~~

少し下へスクロールすると "composeExtensions" があります。Compose extension はメッセージ拡張機能の旧称で、ここにアプリのメッセージ拡張機能が定義されています。

この中に bot があり、その ID は Agents Toolkit により挿入されます。

~~~json
    "composeExtensions": [
        {
            "botId": "${{BOT_ID}}",
            "commands": [
                {
                    ...
~~~

メッセージ拡張機能は Azure Bot Framework を介して通信します。これにより Microsoft 365 とアプリケーション間で高速かつ安全な通信が可能になります。プロジェクトを初めて実行した際、Agents Toolkit がボットを登録し、その ID をここへ配置します。

このメッセージ拡張機能には 2 つのコマンドがあり、`commands` 配列で定義されています。1 つ取り出して構造を見てみましょう。

~~~json
{
    "id": "discountSearch",
    "context": [
        "compose",
        "commandBox"
    ],
    "description": "Search for discounted products by category",
    "title": "Discounts",
    "type": "query",
    "parameters": [
        {
            "name": "categoryName",
            "title": "Category name",
            "description": "Enter the category to find discounted products",
            "inputType": "text"
        }
    ]
},
~~~

これは Northwind のカテゴリ内で値引き商品を検索するためのコマンドです。受け取るパラメーターは "categoryName" の 1 つだけです。

それでは最初のコマンド "inventorySearch" に戻ります。こちらは 5 つのパラメーターを持ち、より高度なクエリが可能です。

~~~json
{
    "id": "inventorySearch",
    ...
    "parameters": [
        ...
    ]
},
~~~

### Step 2 - 「Bot」コードを確認する

ルート フォルダーの **src** フォルダーにある **searchApp.ts** を開きます。このアプリケーションには Azure Bot Framework と通信する "bot" コードが含まれており、[Bot Builder SDK](https://learn.microsoft.com/azure/bot-service/index-bf-sdk?view=azure-bot-service-4.0) を使用しています。

bot は SDK クラス **TeamsActivityHandler** を継承しています。

~~~typescript
export class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }
~~~

**TeamsActivityHandler** のメソッドをオーバーライドすることで、Microsoft 365 から送られてくるメッセージ（"activities" と呼ばれます）を処理できます。

最初に紹介するのは Messaging Extension Query アクティビティです（"messaging extension" もメッセージ拡張機能の旧称）。ユーザーがメッセージ拡張機能内で入力したとき、または Copilot が呼び出したときに実行されます。

~~~typescript
  // Handle search message extension
  public async handleTeamsMessagingExtensionQuery(
    context: TurnContext,
    query: MessagingExtensionQuery
  ): Promise<MessagingExtensionResponse> {

    switch (query.commandId) {
      case productSearchCommand.COMMAND_ID: {
        return productSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      }
      case discountedSearchCommand.COMMAND_ID: {
        return discountedSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      }
    }
  }
~~~

ここでは command ID に基づきクエリを振り分けるだけです。command ID は前述のマニフェストで使用しているものと同じです。

アプリが処理するもう 1 つのアクティビティはアダプティブ カード アクションです。ユーザーがアダプティブ カード上の「Update stock」や「Reorder」をクリックした際に発生します。アダプティブ カード アクション専用のメソッドはないため、より汎用的な `onInvokeActivity()` をオーバーライドし、アクティビティ名を確認して適切なハンドラーへ振り分けています。Invoke アクティビティがクエリの場合は、`handleTeamsMessagingExtensionQuery()` が呼ばれます。

~~~typescript
...
~~~

### Step 3 - メッセージ拡張機能コマンドのコードを確認する

コードをモジュール化し読みやすく再利用しやすいものにするため、各メッセージ拡張機能コマンドは独自の TypeScript モジュールになっています。例として **src/messageExtensions/discountSearchCommand.ts** を見てみましょう。

まず、モジュールは `COMMAND_ID` という定数をエクスポートしており、これはマニフェストにある command ID と同じです。これにより **searchApp.ts** の switch 文が正しく機能します。

続いて、カテゴリ別の値引き商品を検索する `handleTeamsMessagingExtensionQuery()` 関数を提供しています。

```JavaScript
async function handleTeamsMessagingExtensionQuery(
    context: TurnContext,
    query: MessagingExtensionQuery
): Promise<MessagingExtensionResponse> {

    // Seek the parameter by name, don't assume it's in element 0 of the array
    let categoryName = cleanupParam(query.parameters.find((element) => element.name === "categoryName")?.value);
    console.log(`💰 Discount query #${++queryCount}: Discounted products with categoryName=${categoryName}`);

    const products = await getDiscountedProductsByCategory(categoryName);

    console.log(`Found ${products.length} products in the Northwind database`)
    const attachments = [];
    products.forEach((product) => {
        const preview = CardFactory.heroCard(product.ProductName,
            `Avg discount ${product.AverageDiscount}%<br />Supplied by ${product.SupplierName} of ${product.SupplierCity}`,
            [product.ImageUrl]);

        const resultCard = cardHandler.getEditCard(product);
        const attachment = { ...resultCard, preview };
        attachments.push(attachment);
    });
    return {
        composeExtension: {
            type: "result",
            attachmentLayout: "list",
            attachments: attachments,
        },
    };
}
```

`query.parameters` 配列のインデックスは、マニフェストでのパラメーター順と一致するとは限りません。マルチパラメーター コマンドの場合に問題となりますが、コードはインデックスをハードコードせずパラメーター名で値を取得します。

パラメーターを整形（トリムし、Copilot がワイルドカードとして使用する `"*"` を処理）した後、Northwind データ アクセス層の `getDiscountedProductsByCategory()` を呼び出します。

その後、製品ごとに 2 種類のカードを作成します。

* _プレビュー_ カード: "hero" カードで実装（アダプティブ カード以前の簡易カード）。Teams の検索結果や Copilot の一部引用で表示。
* _結果_ カード: すべての詳細を含むアダプティブ カードで実装。

次のステップではアダプティブ カードのコードと、Adaptive Card Designer を確認します。

### Step 4 - アダプティブ カードと関連コードを確認する

プロジェクトのアダプティブ カードは **src/adaptiveCards** フォルダーにあります。3 つの JSON ファイルで構成されています。

* **editCard.json** - メッセージ拡張機能または Copilot 参照で最初に表示されるカード
* **successCard.json** - ユーザーが操作を行った後、成功を示すカード
* **errorCard.json** - 操作が失敗した場合に表示されるカード

Adaptive Card Designer で edit カードを見てみましょう。ブラウザーで [https://adaptivecards.io](https://adaptivecards.io) を開き、上部の "Designer" をクリックします。

![image](../../assets/images/extend-message-ext-01/05-01-AdaptiveCardDesigner-01.png)

`"text": "📦 ${productName}",` のようなデータ バインディング式に注目してください。これはデータの `productName` プロパティをカード上のテキストにバインドしています。

次に、ホスト アプリケーションを 1️⃣ "Microsoft Teams" に設定します。Card Payload Editor 2️⃣ に **editCard.json** の内容を、Sample Data Editor 3️⃣ に **sampleData.json** の内容を貼り付けます。サンプル データはコードで使用している製品データと同一です。

![image](../../assets/images/extend-message-ext-01/05-01-AdaptiveCardDesigner-02.png)

カードがレンダリングされて表示されます（Designer が一部フォーマットを扱えず小さなエラーが出る場合があります）。

ページ上部でテーマやエミュレート デバイスを変更し、ダーク テーマやモバイル デバイスでの見え方を確認してみてください。サンプル アプリのアダプティブ カードもこのツールで作成しました。

Visual Studio Code に戻り、**cardHandler.ts** を開きます。`getEditCard()` 関数は各メッセージ拡張機能コマンドから呼び出され、結果カードを取得します。コードはアダプティブ カード JSON（テンプレート）を読み込み、製品データをバインドします。バインド後はテンプレートと同じ構造の JSON ですが、バインディング式がすべて実データに置き換えられています。最後に `CardFactory` モジュールを使用して、最終 JSON をレンダリング用のアダプティブ カード オブジェクトへ変換します。

~~~typescript
function getEditCard(product: ProductEx): any {
    ...
}
~~~

下へスクロールすると、カード上の各アクション ボタンのハンドラーが見つかります。カードはボタンがクリックされると `data.txtStock`（数量入力ボックス）と `data.productId` を送信します。

~~~typescript
async function handleTeamsCardActionUpdateStock(context: TurnContext) {
    ...
}
~~~

ご覧のとおり、コードはこれら 2 つの値を取得し、データベースを更新してからメッセージと更新済みデータを含む新しいカードを送信します。

## Exercise 2 - メッセージ拡張機能としてサンプルを実行

### Step 1 - プロジェクトの初期設定

Visual Studio Code で作業フォルダーを開きます。すでに開いている場合はそのまま続けてください。

Agents Toolkit は環境変数を **env** フォルダーに保存し、初回起動時に自動で値を設定します。ただしサンプル アプリ固有の値が 1 つあり、それが Northwind データベースへの接続文字列です。

このプロジェクトでは Northwind データベースを Azure Table Storage に保存しています。ローカルデバッグ時には [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite?tabs=visual-studio) ストレージ エミュレーターを使用します。プロジェクトはほぼ組み込み済みですが、接続文字列を設定しないとビルドできません。

必要な設定は **env/.env.local.user.sample** に用意されています。このファイルを **env** フォルダーにコピーし、**.env.local.user** という名前に変更してください。ここには機密性の高い設定を記述します。

Visual Studio Code での手順:
1. **env** フォルダーを展開し **.env.local.user.sample** を右クリックして "Copy" を選択。
2. **env** フォルダー内を右クリックして "Paste" を選択。
3. 生成された **.env.local.user copy.sample** を右クリックして "Rename" を選択し **.env.local.user** に変更。

![Copy .env.local.user.sample to .env.local.user](../../assets/images/extend-message-ext-01/02-01-Setup-Project-01.png)

作成した **.env.local.user** には次の 1 行が含まれているはずです。

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

（実際には秘密ではありませんが、本番 Azure へデプロイする場合には秘密情報になります）

### Step 2 - アプリケーションをローカルで実行

F5 キーを押すか、スタート ボタン 1️⃣ をクリックしてデバッグを開始します。デバッグ プロファイルを選択する画面が表示されたら "Debug in Teams (Edge)" 2️⃣ を選択するか、別のプロファイルを選びます。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

次の画面が表示された場合は **env/.env.local.user** ファイルを修正する必要があります（前ステップ参照）。

![Error is displayed because of a missing environment variable](../../assets/images/extend-message-ext-01/02-01-Setup-Project-06.png)

初回実行時には NodeJS のファイアウォール許可を求められる場合があります。アプリケーションの通信に必要なので許可してください。

npm パッケージの読み込みに時間がかかる場合があります。最終的にブラウザー ウィンドウが開き、ログインを求められます。

Teams がブラウザー ウィンドウで開きます。Agents Toolkit にサインインしたものと同じ資格情報でログインしてください。ログイン後、Microsoft Teams にアプリを開くダイアログが表示されます。

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開くと、アプリをどこで開くかを尋ねられます。既定では個人チャットです。チャネルやグループチャットも選択できます。 "Open" をクリックします。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとの個人チャットに入ります。

### Step 3 - Microsoft Teams でテスト

Teams でアプリをテストするには、チャット メッセージ入力欄の "+" をクリックし、"+ アプリを追加" を選択してダイアログを開きます。青い背景の "Northwind Inventory" アプリを選択します。

![select app](../../assets/images/extend-message-ext-01/choose-app.gif)

アプリを開くと既定タブ "Products Inventory" に検索ボックスが表示されます。"Discount" 検索タブはグレーアウトされています。
Northwind データベースにある製品 "Chai" を検索して、項目が表示されるか確認します。

![search app](../../assets/images/extend-message-ext-01/nw-me-working.png)

Chai のカードを選択して会話に送信できます。

さらに、アダプティブ カードのボタン アクションをテストすることもできます。 

![search app](../../assets/images/extend-message-ext-01/action-working.gif)

これでメッセージ拡張機能が正常に動作し、プラグインとして利用できる状態であることが確認できました。次のラボで確認します。

> NOTE: 実際に便利なのは他のユーザーとの会話内で使用する場合です。Northwind Inventory アプリとのチャットはテスト用です。

### Step 4 - 高度なクエリ

Visual Studio Code に戻り、**appPackage** ディレクトリの **manifest.json** を開きます。インストール時に表示されたアプリ情報がすべてここにあります。

少し下へスクロールして `composeExtensions:` を探します。
Compose extensions はメッセージ拡張機能の旧称で、Northwind Inventory メッセージ拡張機能がここで定義されています。

参照用に短縮した JSON を示します。

~~~json
"composeExtensions": [
    {
        "botId": "${{BOT_ID}}",
        "commands": [
            ...
        ]
    }
],
~~~

まず bot ID があることに注目してください。Microsoft Teams は Azure ボット チャネルを使用してアプリケーションとセキュアなリアルタイム メッセージを交換します。Agents Toolkit がボットを登録し ID を設定します。

次に commands コレクションがあります。これは Teams の検索ダイアログのタブに対応します。本アプリでは主に Copilot 用に設計されています。

最初のコマンドは製品名で検索しました。もう一方も試してみましょう。

"Discounts" タブに "Beverages"、"Dairy"、"Produce" のいずれかを入力すると、そのカテゴリ内で値引きされている製品が表示されます。Copilot はこれを利用して値引き商品の質問に回答します。

![Searching for beverages under the discount tab](../../assets/images/extend-message-ext-01/02-03-Test-Multi-02.png)

再び最初のコマンドを確認します。5 つのパラメーターがあることがわかります。

~~~json
"parameters": [
    ...
]
~~~

残念ながら Teams は最初のパラメーターしか表示できませんが、Copilot は 5 つすべてを使用できます。これにより Northwind 在庫データに対してより高度なクエリが可能になります。

Teams UI の制限を回避するため、"Northwind Inventory" タブでは最大 5 つのパラメーターをカンマ区切りで入力できます。形式は次のとおりです。

~~~text
name,category,inventoryStatus,supplierCity,supplierName
~~~

![Entering multiple comma separated fields into the Northwind Inventory tab](../../assets/images/extend-message-ext-01/02-03-Test-Multi-04.png)

上記 JSON の説明を参考にクエリを入力してみましょう。入力中は Visual Studio Code のデバッグ コンソールに各クエリが表示されるので確認してください。

* "chai" - 名前が "chai" で始まる製品を検索
* "c,bev" - カテゴリが "bev" で始まり名前が "c" で始まる製品を検索
* ",,out" - 在庫切れの製品を検索
* ",,on,london" - ロンドンのサプライヤーで発注済みの製品を検索
* "tofu,produce,,osaka" - カテゴリ "produce" で大阪のサプライヤー、名前が "tofu" で始まる製品を検索

各クエリ語が製品リストを絞り込みます。クエリ語の形式は任意ですが、各パラメーターの description に Copilot へ説明をしっかり書いてください。

### Step 6 (任意) - Azure Storage Explorer で Northwind データベースを表示

Northwind データベースはシンプルですが本物です。データを確認・編集したい場合は Azurite 実行中に Azure Storage Explorer を開きます。

!!! Note
    アプリを実行すると Azurite が自動起動します。詳細は [Azurite ドキュメント](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank} を参照してください。プロジェクトが正常に起動していればストレージを閲覧できます。

Northwind データを表示するには "Emulator & Attached" → "Storage Accounts" → "Emulator - Default Ports" → "Tables" の順に開きます。古典的な Northwind データベース テーブルが確認できます（NO SQL 環境ではあまり便利ではありませんが存在します）。

![Azure Storage Explorer showing the Northwind database tables](../../assets/images/extend-message-ext-01/02-06-AzureStorageExplorer-01.png)

コードは各クエリで Products テーブルを読み込みますが、他のテーブルはアプリ起動時のみアクセスします。そのため新しいカテゴリを追加した場合は、アプリを再起動しないと表示されません。

<cc-next />

## おめでとうございます

Northwind メッセージ拡張機能の実行をマスターしました。次のラボではこれを Microsoft 365 Copilot のプラグインとしてテストします。[次へ] を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/01-nw-teams-app" />