---
search:
  exclude: true
---
# ラボ M1 - Northwind メッセージ拡張機能を知る

このラボでは、ベース アプリである Northwind メッセージ拡張機能を実行します。最初の演習でソース コードに慣れ、最後に Teams でアプリを実行します。

???+ "Extend Teams Message Extension ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ拡張機能を知る](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) (📍現在位置)
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証を追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクション コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/05-add-action) 

このラボで行うこと:

- Northwind メッセージ拡張機能のコードをクイック ツアーする  
- アプリケーションを Teams で実行する  

## 演習 1 - コード ツアー

まず、Northwind と呼ばれるベース アプリのコードを確認します。

### 手順 1 - マニフェストを確認する

Microsoft 365 アプリケーションのコアはアプリケーション マニフェストです。ここで Microsoft 365 がアプリにアクセスするための情報を提供します。

前のラボで使用した作業ディレクトリ **Northwind** の **appPackage** フォルダーにある [manifest.json](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/appPackage/manifest.json) を開きます。この JSON ファイルはアイコン ファイルと共に zip 形式で格納され、アプリ パッケージを構成します。`"icons"` プロパティにはこれらのアイコンへのパスが含まれます。

```json
"icons": {
    "color": "Northwind-Logo3-192-${{TEAMSFX_ENV}}.png",
    "outline": "Northwind-Logo3-32.png"
},
```

アイコン名に `${{TEAMSFX_ENV}}` トークンが含まれている点に注目してください。Agents Toolkit はこのトークンを `local` や `dev` など環境名で置き換えます。そのため、環境によってアイコンの色が変わります。

次に `"name"` と `"description"` を見てみましょう。説明がかなり長いことに気付くはずです。これは、ユーザーと Copilot の双方にアプリが何を行い、いつ使うべきかを理解させるために重要です。

```json
    "name": {
        "short": "Northwind Inventory",
        "full": "Northwind Inventory App"
    },
    "description": {
        "short": "App allows you to find and update product inventory information",
        "full": "Northwind Inventory is the ultimate tool for managing your product inventory. With its intuitive interface and powerful features, you'll be able to easily find your products by name, category, inventory status, and supplier city. You can also update inventory information with the app. \n\n **Why Choose Northwind Inventory:** \n\n Northwind Inventory is the perfect solution for businesses of all sizes that need to keep track of their inventory. Whether you're a small business owner or a large corporation, Northwind Inventory can help you stay on top of your inventory management needs. \n\n **Features and Benefits:** \n\n - Easy Product Search through Microsoft Copilot. Simply start by saying, 'Find northwind dairy products that are low on stock' \r - Real-Time Inventory Updates: Keep track of inventory levels in real-time and update them as needed \r  - User-Friendly Interface: Northwind Inventory's intuitive interface makes it easy to navigate and use \n\n **Availability:** \n\n To use Northwind Inventory, you'll need an active Microsoft 365 account . Ensure that your administrator enables the app for your Microsoft 365 account."
    },
```

少しスクロールすると `"composeExtensions"` があります。`compose extension` はメッセージ拡張機能の旧称で、ここにアプリのメッセージ拡張機能が定義されています。

この中には Bot があり、その ID は Agents Toolkit によって提供されます。

```json
    "composeExtensions": [
        {
            "botId": "${{BOT_ID}}",
            "commands": [
                {
                    ...
```

メッセージ拡張機能は Azure Bot Framework を使用して通信します。これにより Microsoft 365 とアプリケーション間で高速かつ安全な通信チャネルが確立されます。プロジェクトを初めて実行した際に Agents Toolkit が Bot を登録し、その Bot ID がここに設定されます。

このメッセージ拡張機能には 2 つのコマンドがあり、`commands` 配列で定義されています。1 つ取り上げて構造を見てみましょう。

```json
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
```

これは Northwind のカテゴリ内で割引商品を検索できるようにします。このコマンドは `"categoryName"` という 1 つのパラメーターを受け取ります。

では最初のコマンド `"inventorySearch"` に戻りましょう。こちらは 5 つのパラメーターがあり、より高度なクエリが可能です。

```json
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
```

### 手順 2 - 「Bot」コードを確認する

ルート フォルダーの **src** にある **searchApp.ts** を開きます。このアプリケーションには Azure Bot Framework と通信する「bot」コードが含まれており、[Bot Builder SDK](https://learn.microsoft.com/azure/bot-service/index-bf-sdk?view=azure-bot-service-4.0){target=_blank} を利用しています。

Bot は SDK クラス **TeamsActivityHandler** を継承しています。

```typescript
export class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

  ...
```

**TeamsActivityHandler** のメソッドをオーバーライドすることで、Microsoft 365 から送られるメッセージ (アクティビティ) を処理できます。

最初に紹介するのは Messaging Extension Query アクティビティです (「messaging extension」はメッセージ拡張機能の旧称)。ユーザーがメッセージ拡張機能で入力したとき、または Copilot が呼び出したときに実行されます。

```typescript
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
```

ここでは `commandId` に基づいてクエリをディスパッチしているだけです。これは先ほどマニフェストで示したコマンド ID と同じものです。

アプリが処理するもう 1 つのアクティビティは Adaptive Card のアクションです。たとえば、ユーザーが Adaptive Card 上の「Update stock」や「Reorder」をクリックした場合です。Adaptive Card 専用のメソッドがないため、`onInvokeActivity()` をオーバーライドし、アクティビティ名を確認して適切なハンドラーにディスパッチします。もしメッセージ拡張のクエリであれば、`else` 節で基底実装を呼び出し、`handleTeamsMessagingExtensionQuery()` が呼ばれます。

```typescript
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
```

### 手順 3 - メッセージ拡張コマンドのコードを確認する

コードをよりモジュール化・可読化・再利用しやすくするため、各メッセージ拡張コマンドは独自の TypeScript モジュールに分割されています。例として **src/messageExtensions/discountSearchCommand.ts** を見てみましょう。

まず、モジュールは `COMMAND_ID` 定数をエクスポートしています。これはアプリ マニフェストにあるコマンド ID と同じで、**searchApp.ts** の switch 文が正しく機能するために必要です。

次に `handleTeamsMessagingExtensionQuery()` 関数があり、カテゴリ別の割引商品検索クエリを処理します。

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

`query.parameters` 配列のインデックスはマニフェストでの位置と一致しない場合があります。特に複数パラメーターのコマンドで発生しがちですが、コードはインデックスを固定せずパラメーター名で値を取得します。  
パラメーターをトリムし、Copilot が `"*"` をワイルドカードとして送る場合を考慮した後、Northwind データ アクセス レイヤーの `getDiscountedProductsByCategory()` を呼び出します。

次に商品をイテレートし、各商品に対し 2 種類のカードを生成します。

* _プレビュー_ カード: 旧来のシンプルな Hero カード。検索結果や Copilot の引用で表示されます。  
* _結果_ カード: 詳細を含む Adaptive Card。  

次の手順では Adaptive Card のコードを確認し、Adaptive Card Designer を体験します。

### 手順 4 - Adaptive Card と関連コードを確認する

プロジェクトの Adaptive Card は **src/adaptiveCards** フォルダーにあります。JSON ファイルで 3 種類あります。

* **editCard.json** - メッセージ拡張機能または Copilot 参照から最初に表示されるカード  
* **successCard.json** - ユーザーが操作した後、成功を示すカード (editCard とほぼ同じでメッセージが追加)  
* **errorCard.json** - アクション失敗時に表示するカード  

Adaptive Card Designer で editCard を見てみましょう。ブラウザーで [https://adaptivecards.io](https://adaptivecards.io){target=_blank} を開き、上部の「Designer」をクリックします。

![image](../../assets/images/extend-message-ext-01/05-01-AdaptiveCardDesigner-01.png)

`"text": "📦 ${productName}",` などのデータ バインディング式に注目してください。データの `productName` プロパティがカード上のテキストにバインドされます。

次にホスト アプリケーションとして「Microsoft Teams」1️⃣ を選択し、Card Payload Editor 2️⃣ に **editCard.json** の全内容を貼り付け、Sample Data Editor 3️⃣ に **sampleData.json** の全内容を貼り付けます。サンプル データはコードで使用されている商品データと同一です。

![image](../../assets/images/extend-message-ext-01/05-01-AdaptiveCardDesigner-02.png)

1 つの Adaptive Card フォーマットを Designer が表示できないため小さなエラーが出る場合がありますが、カードは問題なく表示されます。

ページ上部付近の Theme や Emulated Device を変更すると、ダーク テーマやモバイル デバイスでの表示を確認できます。本サンプル アプリの Adaptive Card もこのツールで作成しました。

Visual Studio Code に戻り **cardHandler.ts** を開きます。`getEditCard()` 関数は各メッセージ拡張コマンドから呼び出され、結果カードを取得します。コードはテンプレートとして Adaptive Card JSON を読み込み、商品データをバインドします。結果は同じカードの JSON で、バインディング式がすべて値に置き換わっています。最後に `CardFactory` モジュールで最終 JSON を Adaptive Card オブジェクトに変換しレンダリングします。

```typescript
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
```

さらに下へスクロールすると、カード上のアクション ボタンごとのハンドラーがあります。カードはアクション時に `data.txtStock` (数量入力欄) と `data.productId` を送信しており、どの商品を更新するかをコード側に知らせます。

```typescript
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
```

ご覧のとおり、コードはこれら 2 つの値を取得し、データベースを更新し、メッセージ付きの新しいカードを送信します。

## 演習 2 - メッセージ拡張機能としてサンプルを実行

### 手順 1 - プロジェクトの初期設定

Visual Studio Code で作業フォルダーを開きます。コード ツアーですでに開いている場合はそのまま続けます。

Agents Toolkit は環境変数を **env** フォルダーに保存し、初回実行時に自動設定します。ただしサンプル アプリ専用の値が 1 つあり、それが Northwind データベースへの接続文字列です。

このプロジェクトでは Northwind データベースを Azure Table Storage に格納しており、ローカル デバッグ時には [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite?tabs=visual-studio){target=_blank} エミュレーターを使用します。ほとんどはプロジェクトに組み込まれていますが、接続文字列を設定しないとビルドできません。

必要な設定は **env/.env.local.user.sample** に用意されています。このファイルを **env** フォルダーにコピーし、名前を **.env.local.user** に変更してください。ここに機密設定を格納します。

方法が不明な場合は以下を参考にしてください。**env** フォルダーを展開し **.env.local.user.sample** を右クリックして「Copy」を選択。次に **env** フォルダー内で右クリックし「Paste」を選択します。**.env.local.user copy.sample** が作成されるので、コンテキスト メニューで名前を **.env.local.user** に変更します。

![Copy .env.local.user.sample to .env.local.user](../../assets/images/extend-message-ext-01/02-01-Setup-Project-01.png)

作成した **.env.local.user** には次の 1 行が含まれているはずです。

```text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
```

(今回はシークレットではありませんが、Azure にデプロイする場合はシークレットになり得ます。)

### 手順 2 - アプリケーションをローカルで実行

F5 キーを押すか開始ボタン 1️⃣ をクリックしてデバッグを開始します。デバッグ プロファイルを選択するダイアログが表示されるので、「Debug in Teams (Edge)」2️⃣ を選ぶか別のプロファイルを選択します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

次の画面が表示された場合は **env/.env.local.user** ファイルが正しくないので、前の手順を確認してください。

![Error is displayed because of a missing environment variable](../../assets/images/extend-message-ext-01/02-01-Setup-Project-06.png)

初回実行時には NodeJS のファイアウォール許可を求められることがあります。これは通信のために必要です。

npm パッケージの読み込みで少し時間がかかりますが、最終的にブラウザーが開きサインインを求められます。

デバッグでは Teams がブラウザー ウィンドウで開きます。Agents Toolkit にサインインしたのと同じ資格情報でログインしてください。
ログイン後、Microsoft Teams が開きアプリを開くかどうか尋ねるダイアログが表示されます。

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開くとすぐにどの場所でアプリを開くかを尋ねられます。既定は個人チャットですが、チャンネルやグループ チャットも選べます。「Open」を選択します。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとの個人チャットが開きます。

### 手順 3 - Microsoft Teams でテスト

アプリを Teams でテストするには、チャットのメッセージ入力領域の「＋」を選択し、「+ Get more apps」ボタンを選びます。ダイアログでアプリを検索し、青い背景の「Northwind Inventory」を選択します。

![select app](../../assets/images/extend-message-ext-01/choose-app.gif)

アプリを開くと、既定タブ「Products Inventory」に検索ボックスが表示されます。「Discount」検索タブはグレー表示です。
Northwind データベースにある商品名 "Chai" を入力して検索し、アイテムが表示されるか確認します。

![search app](../../assets/images/extend-message-ext-01/nw-me-working.png)

Chai のカードを選択し、会話に送信できます。

Adaptive Card のボタン アクションも以下のようにテストできます。

![search app](../../assets/images/extend-message-ext-01/action-working.gif)

これでメッセージ拡張機能が動作し、次のラボでプラグインとして利用できる準備が整ったことを確認できます。

> NOTE: 実際に役立つのは他のユーザーとの会話内です。Northwind Inventory アプリとのチャットはテスト用です。

### 手順 4 - 高度なクエリ

Visual Studio Code に戻り、**appPackage** ディレクトリの **manifest.json** を開きます。アプリ インストール時に表示された情報がここにすべて記述されています。

少しスクロールして `composeExtensions:` を確認します。`compose extension` はメッセージ拡張機能の旧称で、Northwind Inventory メッセージ拡張機能がここで定義されています。

参照しやすいように JSON を抜粋します。

```json
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
```

まず Bot ID がある点に注目してください。Microsoft Teams は Azure Bot チャネルを使用してアプリと安全・リアルタイムにメッセージを交換します。Agents Toolkit が Bot を登録し ID を設定します。

次に `commands` のコレクションがあります。これは Teams の検索ダイアログのタブに対応します。本アプリでは、このコマンドは通常のユーザーよりも Copilot 向けを想定しています。

最初のコマンドを既に実行し、商品名で検索しました。今度はもう一方を試してみましょう。

"Discounts" タブに "Beverages"、"Dairy"、"Produce" のいずれかを入力すると、そのカテゴリ内で割引されている商品が表示されます。Copilot はこれを利用して割引商品に関する質問に回答します。

![Searching for beverages under the discount tab](../../assets/images/extend-message-ext-01/02-03-Test-Multi-02.png)

次に最初のコマンドを再度確認します。こちらには 5 つのパラメーターがあります。

```json
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
```

残念ながら Teams は最初のパラメーターしか表示できませんが、Copilot は 5 つすべてを利用できます。これにより Northwind 在庫データの高度なクエリが可能になります。

Teams UI の制限を回避するため、「Northwind Inventory」タブでは最大 5 つのパラメーターをカンマ区切りで入力できます。形式は次のとおりです。

```text
name,category,inventoryStatus,supplierCity,supplierName
```

![Entering multiple comma separated fields into the Northwind Inventory tab](../../assets/images/extend-message-ext-01/02-03-Test-Multi-04.png)

上記 JSON の説明を参考にしながら次のクエリを試してみてください。実行中は Visual Studio Code のデバッグ コンソールで各クエリが表示されます。

* `"chai"` - 商品名が "chai" で始まる商品を検索  
* `"c,bev"` - カテゴリが "bev" で始まり、商品名が "c" で始まる商品を検索  
* `",,out"` - 在庫切れの商品を検索  
* `",,on,london"` - ロンドンのサプライヤーからの発注中の商品を検索  
* `"tofu,produce,,osaka"` - カテゴリ "produce"、サプライヤー所在地 Osaka、商品名が "tofu" で始まる商品を検索  

各クエリ語が商品リストを絞り込みます。クエリ語の形式は任意ですが、各パラメーターの説明を Copilot に分かりやすく書くことが重要です。

### 手順 6 (オプション) - Azure Storage Explorer で Northwind データベースを表示

Northwind データベースはシンプルですが実データです。データを確認・編集したい場合は Azurite 実行中に Azure Storage Explorer を開いてください。 

!!! Note
    アプリを実行すると Azurite が自動で起動します。詳細は [Azurite ドキュメント](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank} を参照してください。プロジェクトが正常に起動していればストレージを閲覧できます。

Northwind データを表示するには、「Emulator & Attached」>「Storage Accounts」>「Emulator - Default Ports」>「Tables」へ進みます。昔懐かしい Northwind データベース テーブルが表示されます (NO SQL 環境では少々扱いづらいですが)。

![Azure Storage Explorer showing the Northwind database tables](../../assets/images/extend-message-ext-01/02-06-AzureStorageExplorer-01.png)

コードは各クエリ時に Products テーブルを読み取りますが、他のテーブルはアプリ起動時のみアクセスします。したがって新しいカテゴリを追加した場合、アプリを再起動しなければ反映されません。

<cc-next />

## まとめ

Northwind メッセージ拡張機能の実行方法を習得しました。次のラボでは、Microsoft 365 Copilot プラグインとしてテストします。「Next」を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/01-nw-teams-app--ja" />