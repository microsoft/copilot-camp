---
search:
  exclude: true
---
# Lab M1 - Northwind メッセージエクステンションの理解

このラボでは、基本アプリである Northwind メッセージエクステンションを実行します。最初の演習でソースコードに慣れていただき、最後に Teams でアプリケーションを実行します。

???+ "Extend Teams Message Extension ラボのナビゲーション (Extend Path)"
    - [Lab M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [Lab M1 - Northwind メッセージエクステンションの理解](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) (📍現在位置)
    - [Lab M2 - Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [Lab M3 - 新しい検索コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)
    - [Lab M4 - 認証の追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [Lab M5 - アクションコマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/05-add-action) 

このラボでは、以下を行います:

- Northwind メッセージエクステンションのコードツアーを実施
- Teams 上でアプリケーションを実行

## エクササイズ 1 - コードツアー

基本アプリである Northwind のコードを確認しましょう。

### ステップ 1 - マニフェストの確認

Microsoft 365 アプリケーションの核となるのはアプリケーションマニフェストです。ここに Microsoft 365 がアプリケーションにアクセスするために必要な情報が記載されています。

前回のラボで使用した作業ディレクトリ内の **Northwind** フォルダーで、**appPackage** フォルダー内の [manifest.json](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/appPackage/manifest.json) ファイルを開いてください。この JSON ファイルは、アイコンファイルと共に zip アーカイブに格納され、アプリケーションパッケージを作成します。 "icons" プロパティには、これらのアイコンへのパスが含まれています。

~~~json
"icons": {
    "color": "Northwind-Logo3-192-${{TEAMSFX_ENV}}.png",
    "outline": "Northwind-Logo3-32.png"
},
~~~

アイコン名の一部にあるトークン `${{TEAMSFX_ENV}}` に注目してください。Agents Toolkit はこのトークンを、例えば "local" や "dev" などの環境名に置き換えます。したがって、環境に応じてアイコンの色が変化します。

次に "name" と "description" を確認してください。description は非常に長いことに気づくでしょう。これは、ユーザーと Copilot の両方がアプリケーションの機能や利用シーンを理解するために重要です。

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

少し下にスクロールして "composeExtensions" を確認してください。Compose extension はメッセージエクステンションの従来の名称であり、ここでアプリのメッセージエクステンションが定義されています。

その中に、Agents Toolkit によって供給される ID を持つボットが定義されています。

~~~json
    "composeExtensions": [
        {
            "botId": "${{BOT_ID}}",
            "commands": [
                {
                    ...
~~~

メッセージエクステンションは、Azure Bot Framework を利用して通信を行います。これにより、Microsoft 365 とアプリケーション間で迅速かつ安全な通信チャネルが確立されます。プロジェクトを初めて実行した際、Agents Toolkit はボットを登録し、そのボット ID をここに配置します。

このメッセージエクステンションには 2 つのコマンドがあり、これらは `commands` 配列で定義されています。ひとつのコマンドを選び、その構造を見てみましょう。

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

これにより、ユーザーは Northwind のカテゴリー内で割引対象の商品を検索できるようになります。このコマンドは 1 つのパラメーター "categoryName" を受け取ります。

さて、最初のコマンド "inventorySearch" に戻りましょう。こちらは 5 つのパラメーターがあり、より洗練されたクエリが可能です。

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

### ステップ 2 - 「Bot」コードの確認

ルートフォルダー内の **src** フォルダーにある **searchApp.ts** ファイルを開いてください。このアプリケーションには、[Bot Builder SDK](https://learn.microsoft.com/azure/bot-service/index-bf-sdk?view=azure-bot-service-4.0) を使用して Azure Bot Framework と通信する「bot」コードが含まれています。

ボットが SDK クラス **TeamsActivityHandler** を拡張している点にご注目ください。

~~~typescript
export class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

  ...
~~~

**TeamsActivityHandler** のメソッドをオーバーライドすることで、Microsoft 365 から送られるメッセージ（「activities」と呼ばれる）を処理できるようになります。

最初の処理対象は、メッセージングエクステンションクエリ活動です（「messaging extension」はメッセージエクステンションの従来の名称です）。この関数は、ユーザーがメッセージエクステンションに入力を開始したとき、または Copilot が呼び出したときに実行されます。

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

ここで行っているのは、コマンド ID に応じてクエリを適切に振り分ける処理です。これらは先述のマニフェストに含まれるコマンド ID と同じものです。

アプリが処理するもうひとつのアクティビティタイプは、ユーザーが Adaptive Card 上の「Update stock」や「Reorder」などのアクションをクリックした場合に発生する Adaptive Card アクションです。Adaptive Card アクション専用のメソッドは存在しないため、コードでは `onInvokeActivity()` をオーバーライドしています。これは、メッセージエクステンションのクエリなども含む、より広範なアクティビティクラスです。そのため、コードはアクティビティ名を手動で確認し、適切なハンドラーに振り分けています。もしアクティビティ名が Adaptive Card アクションに該当しなければ、`else` 節で基本実装の `onInvokeActivity()` が実行され、Invoke アクティビティがクエリの場合は `handleTeamsMessagingExtensionQuery()` が呼び出されます。

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

### ステップ 3 - メッセージエクステンションコマンドコードの確認

コードをよりモジュール化し、読みやすく再利用可能にするために、各メッセージエクステンションコマンドは独自の TypeScript モジュールに配置されています。例として、**src/messageExtensions/discountSearchCommand.ts** を確認してみましょう。

まず、モジュールは定数 `COMMAND_ID` をエクスポートしています。これは、アプリマニフェストに記載されているのと同じコマンド ID であり、**searchApp.ts** 内の switch 文が正しく動作するために使用されます。

次に、割引対象商品のカテゴリー別検索を処理する関数 `handleTeamsMessagingExtensionQuery()` を提供しています。

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

`query.parameters` 配列のインデックスが、マニフェスト内のパラメーターの位置と必ずしも対応しないことに注意してください。これは複数パラメーターのコマンドの場合にのみ問題となりますが、コードはインデックスをハードコーディングするのではなく、パラメーター名に基づいて値を取得します。パラメーターの整形（トリムや、場合によっては Copilot が "*" を全てに一致するワイルドカードとみなす問題への対処）を行った後、コードは Northwind のデータアクセス層を呼び出し、`getDiscountedProductsByCategory()` を実行します。

その後、各製品について 2 種類のカードを生成します:

* _preview_ card ― 「hero」カードとして実装され、Adaptive Card 以前のシンプルなカードです。これは検索結果のユーザーインターフェースや、Copilot の一部の引用に表示されます。
* _result_ card ― Adaptive Card として実装され、すべての詳細情報が含まれています。

次のステップでは、Adaptive Card のコードを確認し、Adaptive Card デザイナーについて見ていきます。

### ステップ 4 - Adaptive Card と関連コードの確認

プロジェクトの Adaptive Card は **src/adaptiveCards** フォルダー内にあります。3 種類のカードがあり、各カードは JSON ファイルとして実装されています。

* **editCard.json** ― メッセージエクステンションまたは Copilot リファレンスで表示される最初のカード
* **successCard.json** ― ユーザーのアクション後、成功を示すために表示されるカード。edit card とほぼ同じですが、ユーザーへのメッセージが含まれています。
* **errorCard.json** ― アクションが失敗した場合に表示されるカード

Adaptive Card Designer で edit card を確認してみましょう。ウェブブラウザーで [https://adaptivecards.io](https://adaptivecards.io) を開き、上部の "Designer" オプションをクリックしてください。

![image](../../assets/images/extend-message-ext-01/05-01-AdaptiveCardDesigner-01.png)

例えば、`"text": "📦 ${productName}",` のようなデータバインディング表現に注目してください。これはカード上のテキストにデータの `productName` プロパティをバインドしています。

次に、ホストアプリケーションとして "Microsoft Teams" を選択 1️⃣ してください。**editCard.json** の内容全体を Card Payload Editor に貼り付け、**sampleData.json** の内容を Sample Data Editor に貼り付けます 2️⃣ 3️⃣ 。サンプルデータは、コード内で提供される製品データと同一です。

![image](../../assets/images/extend-message-ext-01/05-01-AdaptiveCardDesigner-02.png)

Designer 上でカードがレンダリングされるはずですが、Adaptive Card の形式の一部が Designer で正しく表示されないため、若干のエラーが発生する場合があります。

ページ上部近くで Theme や Emulated Device を変更して、カードがダークテーマやモバイルデバイス上でどのように表示されるか確認してみてください。これはサンプルアプリケーションの Adaptive Card を作成するために使用されたツールです。

次に、Visual Studio Code に戻り、**cardHandler.ts** を開いてください。各メッセージエクステンションコマンドから結果カードを取得するために、`getEditCard()` 関数が呼び出されます。このコードは、テンプレートとみなされる Adaptive Card JSON を読み込み、製品データにバインドします。その結果、テンプレートと同一のカードにデータバインディング表現がすべて反映された JSON が得られ、最後に `CardFactory` モジュールを使用して、最終的な JSON をレンダリング用の Adaptive Card オブジェクトへと変換します。

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

さらに下にスクロールすると、カード上の各アクションボタンのハンドラーが見つかります。カードではアクションボタンがクリックされるとデータが送信され、具体的にはカード上の "Quantity" 入力ボックスである `data.txtStock` と、製品更新を識別するために各カードアクションで送信される `data.productId` が含まれます。

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

ご覧のとおり、コードはこれらの 2 つの値を取得しデータベースを更新、その後、メッセージと更新後のデータを含む新たなカードを送信します。

## エクササイズ 2 - サンプルをメッセージエクステンションとして実行

### ステップ 1 - 初回利用向けプロジェクトセットアップ

Visual Studio Code で作業フォルダーを開いてください。既にコードツアーで開いている場合は、そのまま続行して構いません。

Agents Toolkit は環境変数を **env** フォルダーに保存し、プロジェクト初回起動時に全ての値を自動で埋め込みます。しかし、サンプルアプリケーション固有の値として Northwind データベースへの接続文字列があります。

このプロジェクトでは、Northwind データベースは Azure Table Storage に保存され、ローカルでデバッグする場合は [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite?tabs=visual-studio) ストレージエミュレーターが使用されます。多くはプロジェクトに組み込まれていますが、接続文字列が提供されなければプロジェクトはビルドされません。

必要な設定は **env/.env.local.user.sample** ファイルに記載されています。このファイルのコピーを **env** フォルダーに作成し、名前を **.env.local.user** に変更してください。ここにはシークレットや機密設定が保存されます。

方法が分からない場合は、以下の手順に従ってください。Visual Studio Code で **env** フォルダーを展開し、**.env.local.user.sample** を右クリックして「コピー」を選択します。その後、**env** フォルダー内の任意の場所を右クリックして「貼り付け」を選択します。すると、**.env.local.user copy.sample** という名前のファイルが作成されます。同じメニューからこのファイルの名前を **.env.local.user** に変更してください。

![Copy .env.local.user.sample to .env.local.user](../../assets/images/extend-message-ext-01/02-01-Setup-Project-01.png)

生成された **.env.local.user** ファイルには、以下の行が含まれているはずです:

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

(秘密ではありませんが、Azure にデプロイする際には秘密になる可能性があります！)

### ステップ 2 - ローカルでアプリケーションの実行

F5 をクリックしてデバッグを開始するか、スタートボタン 1️⃣ をクリックしてください。デバッグプロファイルの選択画面が表示されたら、Teams (Edge) でのデバッグ 2️⃣ を選ぶか、他のプロファイルを選択してください。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

もしこの画面が表示された場合は、前述の **env/.env.local.user** ファイルを修正する必要があります。

![Error is displayed because of a missing environment variable](../../assets/images/extend-message-ext-01/02-01-Setup-Project-06.png)

アプリの初回起動時、NodeJS にファイアウォールを通過させる許可が求められることがあります。これは、アプリケーションの通信のために必要です。

最初の起動時は、npm パッケージの読み込みに時間がかかる場合があります。最終的にはブラウザーウィンドウが開き、ログインを促されます。

デバッグ実行中、Teams がブラウザーウィンドウで開かれます。Agents Toolkit にサインインしたのと同じ資格情報でログインしてください。
ログイン後、Microsoft Teams が開き、アプリを開くかどうかのダイアログが表示されます。

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

アプリを開くとすぐに、どこでアプリを開くか尋ねられます。デフォルトはパーソナルチャットです。チャンネルまたはグループチャットでの選択も可能ですので、「Open」を選択してください。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これで、アプリとのパーソナルチャットが開始されます。

### ステップ 3 - Microsoft Teams でのテスト

Teams 上でアプリをテストするには、チャットのメッセージ作成エリアにある「＋」アイコンを選択してください。そして「＋ Get more apps」ボタンを選んでアプリ検索ダイアログを開きます。青い背景の "Northwind Inventory" アプリを選択してください。以下の手順を参照してください。

![select app](../../assets/images/extend-message-ext-01/choose-app.gif)

作成エリアからアプリを開くと、デフォルトタブ "Products Inventory" に検索ボックスが表示されます。また、"Discount" タブはグレー表示されます。
製品を検索するために "Chai" と入力してください。Northwind データベースに存在する製品が下記のように表示されるはずです。

![search app](../../assets/images/extend-message-ext-01/nw-me-working.png)

"Chai" のカードを選択し、会話内に送信することが可能です。

また、Adaptive Card のボタンアクションも下記のようにテストできます。

![search app](../../assets/images/extend-message-ext-01/action-working.gif)

これにより、メッセージエクステンションが正しく動作しており、次のラボでプラグインとして使用する準備が整っていることが確認できます。

> 注意事項: これは他の ユーザー との会話でのみ有用です。Northwind Inventory アプリ内のチャットはテスト用です。

### ステップ 4 - 高度なクエリ

Visual Studio Code に戻り、**appPackage** ディレクトリ内の **manifest.json** を確認してください。インストール時に表示されたアプリ情報がすべて記載されています。

少し下までスクロールし、`composeExtensions:` を確認してください。
Compose extensions は従来のメッセージエクステンションの名称であり、Northwind Inventory メッセージエクステンションがここで定義されています。

以下は参照用の省略版 JSON です。

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

まず、ボット ID が設定されていることに注目してください。これは、Microsoft Teams が Azure ボットチャネルを使用して、アプリケーションと安全かつリアルタイムにメッセージを交換するためです。Agents Toolkit はボットの登録を行い、ID を自動で埋め込みます。

次に、コマンドのコレクションがあります。これらは Teams の検索ダイアログ内のタブに対応しています。このアプリケーションでは、これらのコマンドは通常の ユーザー よりも、むしろ Copilot を対象としています。

既に、製品名で検索する最初のコマンドは実行済みです。もう一方のコマンドも試してみてください。

"Discounts" タブに "Beverages"、"Dairy"、または "Produce" と入力すると、各カテゴリー内で割引が適用された製品が表示されます。Copilot はこれを用いて、割引対象商品に関する質問に回答します。

![Searching for beverages under the discount tab](../../assets/images/extend-message-ext-01/02-03-Test-Multi-02.png)

次に、最初のコマンドを再確認してください。5 つのパラメーターがあることに気づくでしょう。

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

残念ながら、Teams では最初のパラメーターのみが表示されますが、Copilot は全 5 つのパラメーターを利用できます。これにより、Northwind 在庫データに対してより高度なクエリが可能となります。

Teams の UI 制限への対策として、"Northwind Inventory" タブでは最大 5 つのパラメーターをカンマ区切りで以下のフォーマットで受け付けます:

~~~text
name,category,inventoryStatus,supplierCity,supplierName
~~~

![Entering multiple comma separated fields into the Northwind Inventory tab](../../assets/images/extend-message-ext-01/02-03-Test-Multi-04.png)

クエリを入力する際は、上記の JSON 内の説明をよく読み、適切に入力してください。以下の例を試してみると、Visual Studio Code のデバッグコンソールタブに各クエリが実行される様子が表示されます。

* "chai" ― "chai" で始まる製品名を検索
* "c,bev" ― "c" で始まる製品名と "bev" で始まるカテゴリーの製品を検索
* ",,out" ― 在庫切れの製品を検索
* ",,on,london" ― ロンドンのサプライヤーからの "on order" 製品を検索
* "tofu,produce,,osaka" ― "tofu" で始まる製品名、"produce" カテゴリー、サプライヤーが大阪の製品を検索

各クエリ項目が製品リストを絞り込みます。クエリ項目の形式は任意ですが、各パラメーターの説明で Copilot に十分説明してください。

### ステップ 6 (オプション) - Azure Storage Explorer で Northwind データベースの確認

Northwind データベースは派手ではありませんが、実際に存在します。データを確認または修正したい場合は、Azurite が実行中に Azure Storage Explorer を起動してください。

!!! 注意
  アプリの実行により Azurite が自動で起動されます。詳細は [Azurite documention here](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank} をご参照ください。プロジェクトが正常に開始されていれば、ストレージの内容を閲覧できます。

Northwind のデータを見るには、「Emulator & Attached」、「Storage Accounts」、「Emulator - Default Ports」、「Tables」を開いてください。そこには、従来の Northwind データベースのテーブルが表示されます。NO SQL 環境では使い勝手は劣りますが、存在は確認できます。

![Azure Storage Explorer showing the Northwind database tables](../../assets/images/extend-message-ext-01/02-06-AzureStorageExplorer-01.png)

コードは各クエリ時に Products テーブルを読み込みますが、他のテーブルはアプリ起動時のみアクセスされます。そのため、新しいカテゴリーを追加した場合は、表示される前にアプリを再起動する必要があります。

<cc-next />

## おめでとうございます

Northwind メッセージエクステンションの実行方法を習得しました。次のラボでは、Microsoft 365 Copilot のプラグインとしてテストします。Next を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/01-nw-teams-app" />