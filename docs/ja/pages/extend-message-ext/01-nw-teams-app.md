---
search:
  exclude: true
---
# ラボ M1 - Northwind メッセージ エクステンションを理解する
このラボでは、ベース アプリである Northwind メッセージ エクステンションを実行します。最初の演習ではソース コードに慣れ、最後に Teams でアプリケーションを起動します。

???+ "Extend Teams Message Extension ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ エクステンションを理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) (📍現在地)
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドでプラグインを拡張](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証を追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクション コマンドを追加してプラグインを拡張](/copilot-camp/pages/extend-message-ext/05-add-action) 

このラボで行うこと:

- Northwind メッセージ エクステンションのクイック コード ツアー
- Teams 上でアプリケーションを実行

## Exercise 1 - コード ツアー

ベース アプリの Northwind のコードを確認しましょう。 


### Step 1 - manifest の確認

Microsoft 365 アプリケーションの核となるのはアプリケーション マニフェストです。ここに Microsoft 365 がアプリケーションへアクセスするための情報を記述します。

前のラボで作成した **Northwind** 作業ディレクトリ内の **appPackage** フォルダーにある [manifest.json](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/appPackage/manifest.json) を開きます。この JSON ファイルはアイコン ファイルと共に zip アーカイブに入れられ、アプリ パッケージを構成します。"icons" プロパティにはそれらアイコンへのパスが含まれます。

~~~json
"icons": {
    "color": "Northwind-Logo3-192-${{TEAMSFX_ENV}}.png",
    "outline": "Northwind-Logo3-32.png"
},
~~~

アイコン名の中に `${{TEAMSFX_ENV}}` というトークンがあることに注目してください。Agents Toolkit はこのトークンを環境名 (例: "local" や "dev" — 開発用 Azure デプロイの場合) に置き換えます。したがって環境によってアイコンの色が変わります。

続いて "name" と "description" を見てみましょう。description がかなり長い点に注意してください。これは ユーザーと Copilot の双方がアプリケーションの機能と利用シーンを理解するために重要です。

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

少し下へスクロールして "composeExtensions" を探します。Compose extension はメッセージ エクステンションの旧称で、ここでアプリのメッセージ エクステンションが定義されています。

その中に bot があり、ID は Agents Toolkit により挿入されます。

~~~json
    "composeExtensions": [
        {
            "botId": "${{BOT_ID}}",
            "commands": [
                {
                    ...
~~~

メッセージ エクステンションは Azure Bot Framework を通じて通信します。これは Microsoft 365 とアプリケーション間で迅速かつ安全な通信チャネルを提供します。プロジェクトを初めて実行した際、Agents Toolkit が bot を登録し、その bot ID がここに挿入されました。

このメッセージ エクステンションには 2 つのコマンドがあり、`commands` 配列で定義されています。1 つ取り上げて構造を見てみましょう。

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

これは Northwind のカテゴリ内で割引商品を検索するためのものです。パラメーターは "categoryName" 1 つです。

では最初のコマンド "inventorySearch" に戻りましょう。こちらには 5 つのパラメーターがあり、より高度な検索が可能です。

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



### Step 2 - 「Bot」コードを確認

ルート フォルダーの **src** にある **searchApp.ts** を開きます。このアプリケーションには Azure Bot Framework と通信する「bot」コードが含まれており、[Bot Builder SDK](https://learn.microsoft.com/azure/bot-service/index-bf-sdk?view=azure-bot-service-4.0) を使用しています。

bot は SDK クラス **TeamsActivityHandler** を継承している点に注目してください。

~~~typescript
export class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

  ...
~~~

**TeamsActivityHandler** のメソッドをオーバーライドすることで、Microsoft 365 から送られるメッセージ (「アクティビティ」) を処理できます。

最初の例は Messaging Extension Query アクティビティです (「messaging extension」はメッセージ エクステンションの旧称)。ユーザーがメッセージ エクステンションに入力したり Copilot が呼び出したりすると実行されます。

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

ここでは単に command ID に基づいてクエリをディスパッチしています。これらは先ほど manifest で確認した command ID と同じです。

アプリが処理するもう一つのアクティビティはアダプティブ カード アクションです。ユーザーがアダプティブ カード上の「Update stock」や「Reorder」をクリックしたときなどに発生します。アダプティブ カード アクション専用のメソッドはないため、コードではより汎用的な `onInvokeActivity()` をオーバーライドしています。ここでアクティビティ名を手動で確認し、適切なハンドラーにディスパッチします。アクティビティ名がアダプティブ カード アクションでなければ、`else` 句で基底実装を呼び出し、Invoke がクエリであれば先ほどの `handleTeamsMessagingExtensionQuery()` が実行されます。

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

### Step 3 - メッセージ エクステンション コマンドのコードを確認

コードをモジュール化し読みやすく再利用しやすくするため、各メッセージ エクステンション コマンドはそれぞれ独立した TypeScript モジュールになっています。例として **src/messageExtensions/discountSearchCommand.ts** を見てください。

まず、このモジュールは定数 `COMMAND_ID` をエクスポートし、manifest に記載された command ID と同じ値を保持します。これが **searchApp.ts** の switch 文で機能するために必要です。

次に、カテゴリ別の割引商品クエリを処理する `handleTeamsMessagingExtensionQuery()` 関数を提供しています。

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

`query.parameters` 配列のインデックスが manifest 上のパラメーターの順序と一致しない可能性がある点に注意してください。マルチパラメーター コマンドで特に問題になりますが、このコードではインデックスをハードコードせずパラメーター名で値を取得します。
パラメーターのトリムや Copilot が "*"(ワイルドカード) を想定する場合への対処を行った後、Northwind データ アクセス層の `getDiscountedProductsByCategory()` を呼び出します。

その後、各商品に対して 2 種類のカードを生成します。

* _プレビュー_ カード: "hero" カードで実装 (アダプティブ カード以前のシンプルな形式)。検索結果や Copilot の引用で表示されます。
* _結果_ カード: 商品詳細を含むアダプティブ カードで実装。

次のステップで、アダプティブ カードのコードを確認し、Adaptive Card Designer を試します。

### Step 4 - アダプティブ カードと関連コードを確認

プロジェクトのアダプティブ カードは **src/adaptiveCards** フォルダーにあります。3 つのカードがそれぞれ JSON で実装されています。

* **editCard.json** - メッセージ エクステンションまたは Copilot 参照によって最初に表示されるカード
* **successCard.json** - ユーザー操作が成功した際に表示されるカード (editCard にメッセージを追加)
* **errorCard.json** - 操作失敗時に表示されるカード

Adaptive Card Designer で editCard を見てみましょう。ブラウザーで [https://adaptivecards.io](https://adaptivecards.io) を開き、上部の "Designer" をクリックします。

![image](../assets/images/extend-message-ext-01/05-01-AdaptiveCardDesigner-01.png)

`"text": "📦 ${productName}",` のようなデータ バインディング式に注目してください。これはデータの `productName` プロパティをカードのテキストにバインドします。

次にホスト アプリケーションを "Microsoft Teams" に設定 1️⃣、**editCard.json** の内容を Card Payload Editor に貼り付け 2️⃣、**sampleData.json** の内容を Sample Data Editor に貼り付け 3️⃣ ます。sampleData はコードで使用している商品データと同一です。

![image](../assets/images/extend-message-ext-01/05-01-AdaptiveCardDesigner-02.png)

デザイナーがサポートしていない書式のため小さなエラーは出ますが、カードがレンダリングされます。

ページ上部で Theme や Emulated Device を変更し、ダーク モードやモバイル デバイスでの表示を確認してみましょう。サンプル アプリのカードはこのツールで作成しました。

Visual Studio Code に戻り **cardHandler.ts** を開きます。`getEditCard()` 関数は各メッセージ エクステンション コマンドから呼び出され、結果カードを取得します。コードはアダプティブ カード JSON (テンプレート) を読み込み、商品データとバインドします。最終的に JSON が生成され、`CardFactory` でアダプティブ カード オブジェクトに変換されます。

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

スクロールするとカード上の各アクション ボタン ハンドラーがあります。カードはボタン クリック時に `data.txtStock` (数量ボックス) と `data.productId` を送信し、どの商品を更新するかコードに知らせます。

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

ご覧の通り、コードはこれら 2 つの値を取得し、データベースを更新後、メッセージを含む新しいカードを送信します。

## Exercise 2 - メッセージ エクステンションとしてサンプルを実行

### Step 1 - プロジェクトの初期設定

作業フォルダーを Visual Studio Code で開きます。コード ツアーですでに開いていればそのまま進めます。

Agents Toolkit は環境変数を **env** フォルダーに保存し、初回起動時に自動で値を入力します。ただしサンプル アプリ固有の値が 1 つあります。それは Northwind データベースへの接続文字列です。

このプロジェクトでは Northwind データベースを Azure Table Storage に保存し、ローカル デバッグ時は [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite?tabs=visual-studio) エミュレーターを使用します。プロジェクトのビルドには接続文字列が必要です。

設定は **env/.env.local.user.sample** に用意されています。このファイルを **env** フォルダー内でコピーし、**.env.local.user** という名前にします。ここにはシークレットや機密設定を保存します。

Visual Studio Code での手順: **env** フォルダーを展開し **.env.local.user.sample** を右クリック →「Copy」。**env** フォルダーを右クリック →「Paste」。**.env.local.user copy.sample** が作成されるのでリネームして **.env.local.user** とします。

![Copy .env.local.user.sample to .env.local.user](../assets/images/extend-message-ext-01/02-01-Setup-Project-01.png)

作成した **.env.local.user** には次の行が含まれます。

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

(機密ではありませんが、Azure にデプロイする場合はシークレットになり得ます)

### Step 2 - アプリケーションをローカルで実行

F5 キーまたはスタート ボタン 1️⃣ をクリックしてデバッグを開始します。デバッグ プロファイルを選択する画面が表示されたら Debug in Teams (Edge) 2️⃣ を選択するか、別のプロファイルを選択します。

![Run application locally](../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

もし次の画面が表示された場合は **env/.env.local.user** を修正する必要があります (前ステップ参照)。

![Error is displayed because of a missing environment variable](../assets/images/extend-message-ext-01/02-01-Setup-Project-06.png)

初回起動時には NodeJS のファイアウォール通過許可を求められる場合があります。これは通信のために必要です。

npm パッケージ読込で少し時間がかかりますが、最終的にブラウザー ウィンドウが開き、ログインを求められます。

デバッグにより Teams がブラウザーで開きます。Agents Toolkit にサインインしたのと同じ資格情報でログインしてください。
ログイン後、Microsoft Teams がアプリを開くダイアログを表示します。 

![Open](../assets/images/extend-message-ext-01/nw-open.png)

開くとすぐにアプリをどこで開くか尋ねられます。既定では個人チャットですが、チャネルやグループ チャットも選択可能です。「Open」を選択します。

![Open surfaces](../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとの個人チャットが開きます。


### Step 3 - Microsoft Teams でテスト

Teams でアプリをテストするには、チャットのメッセージ作成領域の "+" アイコンを選択し、「+ Get more apps」をクリックしてアプリ検索ダイアログを開きます。青い背景の "Northwind Inventory" を選択してください。操作手順は下図を参照してください。

![select app](../assets/images/extend-message-ext-01/choose-app.gif)

アプリが開くと、既定タブ「Products Inventory」に検索ボックスが表示されます。「Discount」検索タブはグレー表示です。
Northwind データベースに存在する製品 "Chai" を入力し、アイテムが表示されるか確認します。

![search app](../assets/images/extend-message-ext-01/nw-me-working.png)

Chai のカードを選択して会話に送信できます。 

さらにアダプティブ カード上のボタン アクションもテストできます。 

![search app](../assets/images/extend-message-ext-01/action-working.gif)


これでメッセージ エクステンションが機能し、次のラボでプラグインとして使用できる準備が整ったことを確認できます。


> NOTE: 実際に有用なのは他の ユーザーとの会話内です。Northwind Inventory アプリとのチャットはテスト目的のみです。


### Step 4 - 高度なクエリ 

Visual Studio Code に戻り、**appPackage** ディレクトリ内の **manifest.json** を確認します。インストール時に表示されたアプリ情報がここに含まれています。

少し下へスクロールして `composeExtensions:` を確認します。
Compose extensions はメッセージ エクステンションの旧称で、ここに Northwind Inventory メッセージ エクステンションが定義されています。

参照しやすいように JSON を抜粋します。

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

まず bot ID がある点に注意してください。Microsoft Teams は Azure bot channel を使ってアプリと安全なリアルタイム メッセージを交換します。Agents Toolkit が bot を登録し、ID を埋め込みます。

続いて commands のコレクションがあります。これは Teams の検索ダイアログのタブに対応します。このアプリではコマンドは主に Copilot 向けです！

最初のコマンドは商品名で検索しました。次のコマンドも試してみましょう。

"Discounts" タブに "Beverages"、"Dairy"、"Produce" のいずれかを入力すると、そのカテゴリで割引中の商品が表示されます。Copilot はこれを利用して割引商品に関する質問に回答します。

![Searching for beverages under the discount tab](../assets/images/extend-message-ext-01/02-03-Test-Multi-02.png)

次に最初のコマンドを再度確認すると、5 つのパラメーターがあることに気づきます。

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

残念ながら Teams UI では最初のパラメーターしか表示できませんが、Copilot は 5 つすべてを利用できます。これにより Northwind 在庫データを高度に検索できます。

Teams UI の制限を回避するため、「Northwind Inventory」タブでは最大 5 つのパラメーターをカンマ区切りで入力できます。形式は次のとおりです。

~~~text
name,category,inventoryStatus,supplierCity,supplierName
~~~

![Entering multiple comma separated fields into the Northwind Inventory tab](../assets/images/extend-message-ext-01/02-03-Test-Multi-04.png)

上記 JSON の description を参考にクエリを入力してください。以下を試しつつ、Visual Studio Code のデバッグ コンソールで各クエリが実行される様子を確認しましょう。

* "chai" - "chai" で始まる商品名を検索
* "c,bev" - 名前が "c" で始まりカテゴリが "bev" で始まる商品を検索
* ",,out" - 在庫切れ商品のみを検索
* ",,on,london" - ロンドンの仕入先で発注中の商品を検索
* "tofu,produce,,osaka" - 名前が "tofu" で始まり、カテゴリ "produce"、仕入先が大阪の商品のみを検索

各クエリ項目は商品リストを絞り込みます。項目の形式は自由ですが、各パラメーターの description で Copilot に説明しましょう。


### Step 6 (任意) - Azure Storage Explorer で Northwind データベースを確認

Northwind データベースはシンプルながら実データです。中身を覗いたり編集したりしたい場合は、Azurite が動作中に Azure Storage Explorer を開いてください。 

!!! Note
    アプリ実行で Azurite が自動起動します。詳細は [Azurite のドキュメント](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank} を参照してください。プロジェクトが正常に起動していればストレージを閲覧できます。

Northwind データを表示するには "Emulator & Attached" → "Storage Accounts" → "Emulator - Default Ports" → "Tables" と展開します。そこに旧 Northwind データベースのテーブルが表示されます。NO SQL 環境では扱いにくいテーブルですが、確かに存在します。

![Azure Storage Explorer showing the Northwind database tables](../assets/images/extend-message-ext-01/02-06-AzureStorageExplorer-01.png)

コードは各クエリで Products テーブルを読み込みますが、他のテーブルはアプリ起動時のみアクセスします。新しいカテゴリを追加した場合は、アプリを再起動すると反映されます。

<cc-next />

## おめでとうございます

Northwind メッセージ エクステンションの実行をマスターしました。次のラボでは Microsoft 365 Copilot のプラグインとしてテストします。Next を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/01-nw-teams-app" />