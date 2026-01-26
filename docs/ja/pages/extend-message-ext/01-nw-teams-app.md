---
search:
  exclude: true
---
# ラボ M1 - Northwind メッセージ拡張機能の概要
このラボでは、ベース アプリである Northwind メッセージ拡張機能を実行します。最初の演習でソースコードに慣れ、最後に Teams でアプリケーションを実行します。

???+ "Extend Teams Message Extension ラボのナビゲーション (Extend Path)"
    - [Lab M0 - 事前準備](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [Lab M1 - Northwind メッセージ拡張機能の概要](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) (📍現在地)
    - [Lab M2 - Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [Lab M3 - 新しい検索コマンドでプラグインを拡張](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [Lab M4 - 認証を追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [Lab M5 - アクション コマンドでプラグインを拡張](/copilot-camp/pages/extend-message-ext/05-add-action) 

このラボで行うこと:

- Northwind メッセージ拡張機能のコードを素早く確認する
- Teams 上でアプリケーションを実行する

## Exercise 1 - コード ツアー

まず、Northwind というベース アプリのコードを確認します。 

### Step 1 - マニフェストの確認

Microsoft 365 アプリケーションのコアはアプリケーション マニフェストです。ここに Microsoft 365 がアプリケーションへアクセスするための情報を記載します。

前のラボで使用した **Northwind** 作業ディレクトリ内の **appPackage** フォルダーにある [manifest.json](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/appPackage/manifest.json) を開きます。この JSON ファイルはアイコン ファイルと共に zip にまとめられ、アプリ パッケージになります。"icons" プロパティにはそれらアイコンへのパスが含まれます。

~~~json
"icons": {
    "color": "Northwind-Logo3-192-${{TEAMSFX_ENV}}.png",
    "outline": "Northwind-Logo3-32.png"
},
~~~

アイコン名にあるトークン `${{TEAMSFX_ENV}}` に注目してください。Agents Toolkit はこれを環境名 (例: "local" や "dev") に置き換えます。そのため、環境ごとにアイコンの色が変わります。

次に "name" と "description" を見てください。description がかなり長いことに気付くでしょう。これはユーザーと Copilot の双方がアプリの機能と利用シーンを理解するために重要です。

~~~json
    "name": {
        "short": "Northwind Inventory",
        "full": "Northwind Inventory App"
    },
    "description": {
        "short": "App allows you to find and update product inventory information",
        "full": "Northwind Inventory is the ultimate tool for managing your product inventory. With its intuitive interface and powerful features, you'll be able to easily find your products by name, category, inventory status, and supplier city. You can also update inventory information with the app. \n\n **Why Choose Northwind Inventory:** \n\n Northwind Inventory is the perfect solution for businesses of all sizes that need to keep track of their inventory. Whether you're a small business owner or a large corporation, Northwind Inventory can help you stay on top of your inventory management needs. \n\n **Features and Benefits:** \n\n - Easy Product Search through Microsoft Copilot. Simply start by saying, 'Find northwind dairy products that are low on stock' \r - Real-Time Inventory Updates: Keep track of inventory levels in real-time and update them as needed \r  - User-Friendly Interface: Northwind Inventory's intuitive interface makes it easy to navigate and use \n\n **Availability:** \n\n To use Northwind Inventory, you'll need an active Microsoft 365 account . Ensure that your administrator enables the app for your Microsoft 365 account."
    },
~~~

少し下にスクロールすると "composeExtensions" があります。compose extension はメッセージ拡張機能の旧称で、ここに拡張機能が定義されています。

この中には Bot があり、その ID は Agents Toolkit が挿入します。

~~~json
    "composeExtensions": [
        {
            "botId": "${{BOT_ID}}",
            "commands": [
                {
                    ...
~~~

メッセージ拡張機能は Azure Bot Framework を使って通信し、Microsoft 365 とアプリケーション間の高速かつ安全なチャネルを提供します。プロジェクトを最初に実行した際、Agents Toolkit が Bot を登録し、ここに Bot ID を設定しました。

このメッセージ拡張機能には `commands` 配列で定義された 2 つのコマンドがあります。1 つ取り上げて構造を見てみましょう。

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

これは Northwind のカテゴリ内で割引商品を検索するコマンドです。このコマンドは "categoryName" という 1 つのパラメーターを受け取ります。

では最初のコマンド "inventorySearch" に戻りましょう。こちらは 5 つのパラメーターを持ち、より高度な検索が可能です。

~~~json
{
    "id": "inventorySearch",
    "context": [
        "compose",
        "commandBox"
    ],
    "description": "Search products by name, category, inventory status, supplier location, stock level",
    "title": "Product inventory",
    "type": "query",
    "parameters": [
        {
            "name": "productName",
            "title": "Product name",
            "description": "Enter a product name here",
            "inputType": "text"
        },
        {
            "name": "categoryName",
            "title": "Category name",
            "description": "Enter the category of the product",
            "inputType": "text"
        },
        {
            "name": "inventoryStatus",
            "title": "Inventory status",
            "description": "Enter what status of the product inventory. Possible values are 'in stock', 'low stock', 'on order', or 'out of stock'",
            "inputType": "text"
        },
        {
            "name": "supplierCity",
            "title": "Supplier city",
            "description": "Enter the supplier city of product",
            "inputType": "text"
        },
        {
            "name": "stockQuery",
            "title": "Stock level",
            "description": "Enter a range of integers such as 0-42 or 100- (for >100 items). Only use if you need an exact numeric range.",
            "inputType": "text"
        }
    ]
},
~~~

### Step 2 - 「Bot」コードの確認

ルート フォルダーの **src** にある **searchApp.ts** を開きます。このアプリケーションには Bot コードが含まれ、[Bot Builder SDK](https://learn.microsoft.com/azure/bot-service/index-bf-sdk?view=azure-bot-service-4.0) を使用して Azure Bot Framework と通信します。

Bot は SDK クラス **TeamsActivityHandler** を継承しています。

~~~typescript
export class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

  ...
~~~

**TeamsActivityHandler** のメソッドをオーバーライドすることで、Microsoft 365 から送られてくるメッセージ (activity) を処理できます。

最初に紹介するのは Messaging Extension Query アクティビティです (「messaging extension」はメッセージ拡張機能の旧称)。ユーザーがメッセージ拡張機能に入力したときや Copilot が呼び出したときに実行されます。

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

ここでは commandId に基づきクエリをディスパッチしているだけです。commandId は前述のマニフェストで使用したものと同じです。

もう一つ必要なのはアダプティブ カード アクションの処理です。ユーザーがアダプティブ カードの「Update stock」や「Reorder」をクリックしたときなどに発生します。アダプティブ カード アクション専用のメソッドはないため、`onInvokeActivity()` をオーバーライドし、activity 名で分岐します。該当しない場合は基底実装を呼び出し、メッセージ拡張クエリであれば `handleTeamsMessagingExtensionQuery()` が実行されます。

~~~typescript
import {
  TeamsActivityHandler,
  TurnContext,
  MessagingExtensionQuery,
  MessagingExtensionResponse,
  InvokeResponse
} from "botbuilder";
import productSearchCommand from "./messageExtensions/productSearchCommand";
import discountedSearchCommand from "./messageExtensions/discountSearchCommand";
import revenueSearchCommand from "./messageExtensions/revenueSearchCommand";
import actionHandler from "./adaptiveCards/cardHandler";

export class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

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

  // Handle adaptive card actions
  public async onInvokeActivity(context: TurnContext): Promise<InvokeResponse> {
    let runEvents = true;
    // console.log (`🎬 Invoke activity received: ${context.activity.name}`);
    try {
      if(context.activity.name==='adaptiveCard/action'){
        switch (context.activity.value.action.verb) {
          case 'ok': {
            return actionHandler.handleTeamsCardActionUpdateStock(context);
          }
          case 'restock': {
            return actionHandler.handleTeamsCardActionRestock(context);
          }
          case 'cancel': {
            return actionHandler.handleTeamsCardActionCancelRestock(context);
          }
          default:
            runEvents = false;
            return super.onInvokeActivity(context);
        }
      } else {
          runEvents = false;
          return super.onInvokeActivity(context);
      }
    } ...
~~~

### Step 3 - メッセージ拡張コマンドのコード確認

コードをモジュール化して読みやすく再利用しやすくするため、各メッセージ拡張コマンドは個別の TypeScript モジュールに分けられています。例として **src/messageExtensions/discountSearchCommand.ts** を見てみましょう。

まず、モジュールは `COMMAND_ID` 定数をエクスポートしており、これは app マニフェストの commandId と一致し、**searchApp.ts** の switch 文で利用されます。

続いて `handleTeamsMessagingExtensionQuery()` 関数が実装され、カテゴリ別の割引商品検索を処理します。

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

`query.parameters` 配列のインデックスがマニフェスト内でのパラメーターの順序と一致しない場合があります。そのためコードではインデックスをハードコーディングせず、パラメーター名で値を取得しています。パラメーターを整形した後、Northwind データ アクセス レイヤーの `getDiscountedProductsByCategory()` を呼び出します。

その後、取得した各商品について 2 種類のカードを作成します。

* プレビュー カード: 旧来の "hero" カードで実装。検索結果一覧や Copilot の一部引用で表示されます。
* 結果カード: すべての詳細を含む "adaptive" カードで実装。

次の手順では、アダプティブ カードのコードを確認し、Adaptive Card Designer を使用します。

### Step 4 - アダプティブ カードと関連コードの確認

プロジェクトのアダプティブ カードは **src/adaptiveCards** フォルダーにあります。3 つのカードが JSON ファイルとして実装されています。

* **editCard.json** - メッセージ拡張機能または Copilot 参照で最初に表示されるカード
* **successCard.json** - ユーザーが操作を行った後に成功を示すカード。editCard とほぼ同じですが、メッセージが追加されています。
* **errorCard.json** - 操作失敗時に表示されるカード

まず edit カードを Adaptive Card Designer で確認しましょう。ブラウザーで [https://adaptivecards.io](https://adaptivecards.io) を開き、上部の "Designer" をクリックします。

![image](../../assets/images/extend-message-ext-01/05-01-AdaptiveCardDesigner-01.png)

`"text": "📦 ${productName}",` のようなデータ バインディング式に注目してください。これはデータの `productName` プロパティをカードのテキストにバインドします。

次に 1️⃣ として「Microsoft Teams」をホスト アプリケーションに選択します。Card Payload Editor に **editCard.json** の内容を 2️⃣、Sample Data Editor に **sampleData.json** の内容を 3️⃣ として貼り付けます。サンプル データはコードで使用される製品と同一です。

![image](../../assets/images/extend-message-ext-01/05-01-AdaptiveCardDesigner-02.png)

カードがレンダリングされた状態で表示されるはずです。デザイナーが一部フォーマットを表示できないため、小さなエラーが出る場合があります。

ページ上部で Theme や Emulated Device を変更し、ダーク テーマやモバイル デバイスでの表示を確認してみてください。このツールはサンプル アプリのアダプティブ カード作成に使用しました。

次に Visual Studio Code に戻り、**cardHandler.ts** を開きます。`getEditCard()` 関数は各メッセージ拡張コマンドから呼び出され、結果カードを取得します。コードはアダプティブ カードの JSON (テンプレート) を読み込み、製品データとバインドします。最終的に `CardFactory` でレンダリング用オブジェクトへ変換します。

~~~typescript
function getEditCard(product: ProductEx): any {

    var template = new ACData.Template(editCard);
    var card = template.expand({
        $root: {
            productName: product.ProductName,
            unitsInStock: product.UnitsInStock,
            productId: product.ProductID,
            categoryId: product.CategoryID,
            imageUrl: product.ImageUrl,
            supplierName: product.SupplierName,
            supplierCity: product.SupplierCity,
            categoryName: product.CategoryName,
            inventoryStatus: product.InventoryStatus,
            unitPrice: product.UnitPrice,
            quantityPerUnit: product.QuantityPerUnit,
            unitsOnOrder: product.UnitsOnOrder,
            reorderLevel: product.ReorderLevel,
            unitSales: product.UnitSales,
            inventoryValue: product.InventoryValue,
            revenue: product.Revenue,
            averageDiscount: product.AverageDiscount
        }
    });
    return CardFactory.adaptiveCard(card);
}
~~~

さらに下へスクロールすると、カード上の各アクション ボタンのハンドラーが見つかります。カードはアクション ボタンがクリックされると `data.txtStock` (数量入力ボックス) と `data.productId` (更新対象製品を示す) を送信します。

~~~typescript
async function handleTeamsCardActionUpdateStock(context: TurnContext) {

    const request = context.activity.value;
    const data = request.action.data;
    console.log(`🎬 Handling update stock action, quantity=${data.txtStock}`);

    if (data.txtStock && data.productId) {

        const product = await getProductEx(data.productId);
        product.UnitsInStock = Number(data.txtStock);
        await updateProduct(product);

        var template = new ACData.Template(successCard);
        var card = template.expand({
            $root: {
                productName: product.ProductName,
                unitsInStock: product.UnitsInStock,
                productId: product.ProductID,
                categoryId: product.CategoryID,
                imageUrl: product.ImageUrl,
                ...
~~~

このように、受け取った値でデータベースを更新し、新しいカードを送信して結果を表示します。

## Exercise 2 - メッセージ拡張機能としてサンプルを実行

### Step 1 - プロジェクトの初期セットアップ

Visual Studio Code で作業フォルダーを開きます。すでにコード ツアーで開いている場合は続行してください。

Agents Toolkit は環境変数を **env** フォルダーに保存し、初回起動時に自動で値を設定します。ただし、このサンプル アプリ固有の設定として Northwind データベースへの接続文字列が必要です。

本プロジェクトでは Northwind データベースを Azure Table Storage に保存し、ローカル デバッグ時は [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite?tabs=visual-studio) エミュレーターを使用します。接続文字列がないとビルドできません。

必要な設定は **env/.env.local.user.sample** にあります。このファイルを **env** フォルダーでコピーし、**.env.local.user** という名前に変更してください。ここに秘密情報や機密設定を記述します。

手順が不明な場合は、Visual Studio Code で **env** フォルダーを展開し **.env.local.user.sample** を右クリックして「Copy」を選択します。その後 **env** フォルダー内で右クリックし「Paste」を選択します。新しいファイル **.env.local.user copy.sample** が作成されるので右クリックして「Rename」を選択し **.env.local.user** に変更します。

![Copy .env.local.user.sample to .env.local.user](../../assets/images/extend-message-ext-01/02-01-Setup-Project-01.png)

作成した **.env.local.user** には次の行が含まれます。

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

(本来は秘密にする値ですが、デバッグ用なので問題ありません。Azure にデプロイする場合は実際の接続文字列を設定してください)

### Step 2 - アプリケーションをローカル実行

F5 キーを押すかスタート ボタン 1️⃣ をクリックしてデバッグを開始します。デバッグ プロファイルの選択が表示されたら Debug in Teams (Edge) 2️⃣ を選択するか、別のプロファイルを選択します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

下図の画面が表示された場合は **env/.env.local.user** の設定が間違っています。前の手順を参照して修正してください。

![Error is displayed because of a missing environment variable](../../assets/images/extend-message-ext-01/02-01-Setup-Project-06.png)

初回起動時は NodeJS がファイアウォール通過を求める場合があります。通信のために許可してください。

npm パッケージのロードに時間がかかる可能性がありますが、最終的にブラウザー ウィンドウが開き、ログインを求められます。

デバッグではブラウザー版 Teams が開きます。Agents Toolkit と同じ資格情報でサインインしてください。
サインイン後、Teams が開きアプリの起動ダイアログが表示されます。

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開くとすぐにアプリをどこで開くか選択する画面になります。既定は個人チャットですが、チャネルやグループ チャットも選択できます。「Open」をクリックします。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとの個人チャットが開きました。

### Step 3 - Microsoft Teams でテスト

Teams でアプリをテストするには、チャットのメッセージ作成エリアにある「+」をクリックし、「+ Get more apps」を選択してアプリ検索ダイアログを開きます。青い背景の「Northwind Inventory」アプリを選択します。

![select app](../../assets/images/extend-message-ext-01/choose-app.gif)

アプリが開くと既定タブ「Products Inventory」に検索ボックスが表示されます。「Discount」検索タブはグレー表示です。
Northwind データベースに存在する商品「Chai」と入力し、項目が表示されるか確認します。

![search app](../../assets/images/extend-message-ext-01/nw-me-working.png)

「Chai」のカードを選択して会話に送信できます。

アダプティブ カードのボタン アクションも次のようにテスト可能です。

![search app](../../assets/images/extend-message-ext-01/action-working.gif)

これでメッセージ拡張機能が正常に動作し、次のラボでプラグインとして利用できることが確認できました。

> NOTE: 実際に役立つのは他のユーザーとの会話内です。Northwind Inventory アプリとのチャットはテスト専用です。

### Step 4 - 高度なクエリ

Visual Studio Code に戻り、**appPackage** ディレクトリの **manifest.json** を開きます。アプリ インストール時に表示された情報がすべてここにあります。

少し下にスクロールして `composeExtensions:` を確認してください。
ここに Northwind Inventory メッセージ拡張機能が定義されています。

参照しやすいように抜粋を示します。

~~~json
"composeExtensions": [
    {
        "botId": "${{BOT_ID}}",
        "commands": [
            {
                "id": "inventorySearch",
                ...
                "description": "Search products by name, category, inventory status, supplier location, stock level",
                "title": "Product inventory",
                "type": "query",
                "parameters": [ ... ]
            },
            {
                "id": "discountSearch",
                ...
                "description": "Search for discounted products by category",
                "title": "Discounts",
                "type": "query",
                "parameters": [ ...]
            }
        ]
    }
],
~~~

まず Bot ID があることに注目してください。Microsoft Teams は Azure Bot チャネルを使って安全かつリアルタイムにアプリとメッセージを交換します。Agents Toolkit が Bot を登録し、この ID を設定します。

続いてコマンドのコレクションがあります。これは Teams の検索ダイアログに表示されるタブに対応します。本アプリではコマンドは主に Copilot 向けですが、通常のユーザーも利用できます。

最初のコマンドは製品名検索で既に実行しました。次のコマンドも試してみましょう。

「Discounts」タブに "Beverages"、"Dairy"、"Produce" のいずれかを入力すると、該当カテゴリで割引されている商品が表示されます。Copilot はこれを使用して割引商品に関する質問に回答します。

![Searching for beverages under the discount tab](../../assets/images/extend-message-ext-01/02-03-Test-Multi-02.png)

次に最初のコマンドをもう一度確認してください。5 つのパラメーターがあります。

~~~json
"parameters": [
    {
        "name": "productName",
        "title": "Product name",
        "description": "Enter a product name here",
        "inputType": "text"
    },
    {
        "name": "categoryName",
        "title": "Category name",
        "description": "Enter the category of the product",
        "inputType": "text"
    },
    {
        "name": "inventoryStatus",
        "title": "Inventory status",
        "description": "Enter what status of the product inventory. Possible values are 'in stock', 'low stock', 'on order', or 'out of stock'",
        "inputType": "text"
    },
    {
        "name": "supplierCity",
        "title": "Supplier city",
        "description": "Enter the supplier city of product",
        "inputType": "text"
    },
    {
        "name": "stockQuery",
        "title": "Stock level",
        "description": "Enter a range of integers such as 0-42 or 100- (for >100 items). Only use if you need an exact numeric range.",
        "inputType": "text"
    }
]
~~~

残念ながら Teams は最初のパラメーターしか表示できませんが、Copilot は 5 つすべてを利用できます。これにより Northwind 在庫データの高度なクエリが可能になります。

Teams UI の制限を回避するため、"Northwind Inventory" タブでは最大 5 つのパラメーターをカンマ区切りで入力できます。形式は次のとおりです。

~~~text
name,category,inventoryStatus,supplierCity,supplierName
~~~

![Entering multiple comma separated fields into the Northwind Inventory tab](../../assets/images/extend-message-ext-01/02-03-Test-Multi-04.png)

上記 JSON の description を参考にしてクエリを入力してください。以下を試し、Visual Studio Code のデバッグ コンソールでクエリが実行される様子を確認しましょう。

* "chai" - 名前が "chai" で始まる商品を検索
* "c,bev" - 名前が "c" で始まりカテゴリが "bev" で始まる商品
* ",,out" - 在庫切れの商品
* ",,on,london" - ロンドンのサプライヤーからの発注中の商品
* "tofu,produce,,osaka" - カテゴリ "produce"、サプライヤーが大阪、名前が "tofu" で始まる商品

各クエリは商品リストを絞り込みます。クエリ形式は任意ですが、Copilot にパラメーター description でしっかり説明してください。

### Step 6 (オプション) - Azure Storage Explorer で Northwind データベースを表示

Northwind データベースはシンプルですが実在します。データを確認・編集したい場合は Azurite が動作中に Azure Storage Explorer を開きます。

!!! Note
  アプリ実行で Azurite が自動起動します。詳細は [Azurite ドキュメント](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank} を参照してください。プロジェクトが正常に起動していればストレージを閲覧できます。

Northwind データを表示するには、「Emulator & Attached」→「Storage Accounts」→「Emulator - Default Ports」→「Tables」と展開します。NO SQL 環境では扱いづらいものの、昔ながらの Northwind テーブルが確認できます。

![Azure Storage Explorer showing the Northwind database tables](../../assets/images/extend-message-ext-01/02-06-AzureStorageExplorer-01.png)

コードは各クエリで Products テーブルを読み込みますが、他のテーブルはアプリ起動時のみアクセスします。そのため新しいカテゴリを追加した場合はアプリを再起動してください。

<cc-next />

## おめでとうございます

Northwind メッセージ拡張機能の実行方法を習得しました。次のラボでは Microsoft 365 Copilot のプラグインとしてテストします。「Next」を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/01-nw-teams-app--ja" />