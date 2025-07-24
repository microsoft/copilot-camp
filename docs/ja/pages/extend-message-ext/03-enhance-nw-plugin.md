---
search:
  exclude: true
---
# ラボ M3 - 新規検索コマンドでプラグインを強化

このラボでは、Northwind プラグインに新しいコマンドを追加して強化します。現在のメッセージ拡張機能では、Northwind 在庫データベース内の商品情報は提供されていますが、Northwind の顧客に関する情報は提供されていません。今回のタスクは、ユーザーによって指定された顧客名に基づいて注文された商品を取得する API 呼び出しに関連付けられた新しいコマンドを導入することです。

???+ "Extend Teams Message Extension ラボ（Extend Path）"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ拡張機能の概要](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新規検索コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)(📍あなたはここにいます)
    - [ラボ M4 - 認証の追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - 動作コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! tip "注意事項"
    全てのコード変更を含む完成版の演習は、[こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab03-Enhance-NW-Teams/Northwind/)からダウンロードできます。トラブルシューティングの際に役立つ場合があります。
    編集内容をリセットする必要がある場合は、リポジトリを再度クローンして最初からやり直すことができます。

## 演習 1 - コード変更

### Step 1 -  メッセージ拡張機能／プラグインユーザーインターフェイスの拡張 

前のラボで使用した作業ディレクトリ **Northwind** 内の、 **appPackage** フォルダーにある **manifest.json** を開きます。
commands 配列の中から discountSearch を探します。discountSearch コマンドの閉じ括弧の後にコンマ , を追加してください。その後、companySearch コマンドのコードスニペットをコピーし、commands 配列に追加します。

```json
{
    "id": "companySearch",
    "context": [
        "compose",
        "commandBox"
    ],
    "description": "Given a company name, search for products ordered by that company",
    "title": "Customer",
    "type": "query",
    "parameters": [
        {
            "name": "companyName",
            "title": "Company name",
            "description": "The company name to find products ordered by that company",
            "inputType": "text"
        }
    ]
}
```
!!! tip "COMMAND_ID"
    「id」は UI とコード間の接続を意味します。この値は discount/product/SearchCommand.ts ファイル内で COMMAND_ID として定義されています。各ファイルが、一意の COMMAND_ID を持ち、「id」の値と対応している点に注目してください。

### Step 2 -  Company による商品検索の実装
Company 名での商品の検索を実装し、その Company の注文商品リストを返します。下記テーブルの情報を参照してください:

| Table         | Find        | Look Up By    |
| ------------- | ----------- | ------------- |
| Customer      | Customer Id | Customer Name |
| Orders        | Order Id    | Customer Id   |
| OrderDetail   | Product     | Order Id      |

動作の流れは以下の通りです:  
Customer テーブルを使用して、Customer Name から Customer Id を取得します。Customer Id を使用して Orders テーブルから関連する Order Id を取得します。各 Order Id について、OrderDetail テーブルから対応する商品を見つけます。最後に、指定された Company 名で注文された商品のリストを返します。

**.\src\northwindDB\products.ts** を開いてください。

1 行目の `import` 文を、OrderDetail、Order、Customer を含むように更新してください。以下のようになります:
```javascript
import {
    TABLE_NAME, Product, ProductEx, Supplier, Category, OrderDetail,
    Order, Customer
} from './model';
```
`import { getInventoryStatus } from '../adaptiveCards/utils';` の直後に、下記のスニペットを参考に新しい関数 `searchProductsByCustomer()` を追加してください。

```javascript
export async function searchProductsByCustomer(companyName: string): Promise<ProductEx[]> {

    let result = await getAllProductsEx();

    let customers = await loadReferenceData<Customer>(TABLE_NAME.CUSTOMER);
    let customerId="";
    for (const c in customers) {
        if (customers[c].CompanyName.toLowerCase().includes(companyName.toLowerCase())) {
            customerId = customers[c].CustomerID;
            break;
        }
    }
    
    if (customerId === "") 
        return [];

    let orders = await loadReferenceData<Order>(TABLE_NAME.ORDER);
    let orderdetails = await loadReferenceData<OrderDetail>(TABLE_NAME.ORDER_DETAIL);
    // build an array orders by customer id
    let customerOrders = [];
    for (const o in orders) {
        if (customerId === orders[o].CustomerID) {
            customerOrders.push(orders[o]);
        }
    }
    
    let customerOrdersDetails = [];
    // build an array order details customerOrders array
    for (const od in orderdetails) {
        for (const co in customerOrders) {
            if (customerOrders[co].OrderID === orderdetails[od].OrderID) {
                customerOrdersDetails.push(orderdetails[od]);
            }
        }
    }

    // Filter products by the ProductID in the customerOrdersDetails array
    result = result.filter(product => 
        customerOrdersDetails.some(order => order.ProductID === product.ProductID)
    );

    return result;
}
```

### Step 3: 新規コマンドのハンドラーの作成

VS Code で、 **src/messageExtensions** フォルダー内の **productSearchCommand.ts** ファイルを複製し、コピーしたファイルの名前を "customerSearchCommand.ts" に変更してください。

定数 COMMAND_ID の値を以下のように変更してください:
```javascript
const COMMAND_ID = "companySearch";
```
以下の import 文を、

```JavaScript
import { searchProducts } from "../northwindDB/products";`
```
から

```JavaScript
import { searchProductsByCustomer } from "../northwindDB/products";
```
に置き換えてください。

既存の **handleTeamsMessagingExtensionQuery** の中の括弧内に、既存のコードを下記スニペットに置き換えてください:

```javascript
 
    let companyName;

    // Validate the incoming query, making sure it's the 'companySearch' command
    // The value of the 'companyName' parameter is the company name to search for
    if (query.parameters.length === 1 && query.parameters[0]?.name === "companyName") {
        [companyName] = (query.parameters[0]?.value.split(','));
    } else { 
        companyName = cleanupParam(query.parameters.find((element) => element.name === "companyName")?.value);
    }
    console.log(`🍽️ Query #${++queryCount}:\ncompanyName=${companyName}`);    

    const products = await searchProductsByCustomer(companyName);

    console.log(`Found ${products.length} products in the Northwind database`)
    const attachments = [];
    products.forEach((product) => {
        const preview = CardFactory.heroCard(product.ProductName,
            `Customer: ${companyName}`, [product.ImageUrl]);

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

```

### Step 4 - コマンドルーティングの更新
このステップでは、`companySearch` コマンドを先ほど実装したハンドラーにルーティングします。

**src** フォルダー内の **searchApp.ts** を開き、以下の import 文を追加してください: 

```javascript
import customerSearchCommand from "./messageExtensions/customerSearchCommand";
```

ハンドラー関数 `handleTeamsMessagingExtensionQuery` 内の switch 文に、以下の case 文を追加してください:

```javascript
      case customerSearchCommand.COMMAND_ID: {
        return customerSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      }
```

!!! tip "注意事項"
    メッセージ拡張機能／プラグインの UI 操作では、このコマンドは明示的に呼び出されます。しかし、Microsoft 365 Copilot によって呼び出された場合、コマンドは Copilot オーケストレーターによってトリガーされます。

## 演習 2 - アプリの実行！ Company 名による商品検索

これで、Microsoft 365 Copilot 用のプラグインとしてサンプルをテストする準備が整いました。

### Step 1: 更新後のアプリをローカルで実行

ローカルデバッガーが実行中の場合は停止してください。新しいコマンドでマニフェストを更新しているため、新しいパッケージでアプリを再インストールする必要があります。 
**appPackage** フォルダー内の **manifest.json** ファイルで、バージョン "1.0.9" を "1.0.10" に更新してください。これにより、アプリの新しい変更が反映されます。 

F5 キーをクリックしてデバッガーを再起動するか、開始ボタン 1️⃣ をクリックしてください。デバッグプロファイルを選択する機会が与えられますので、Teams 内のデバッグ (Edge) 2️⃣ を選ぶか、他のプロファイルを選択してください。

![Run application locally](../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

デバッグ実行時、Teams がブラウザーウィンドウで開きます。Agents Toolkit にサインインしたのと同じ資格情報でログインしてください。
ログイン後、Microsoft Teams が開き、アプリを起動するかどうかのダイアログが表示されます。

![Open](../assets/images/extend-message-ext-01/nw-open.png)

アプリを開くと、すぐにどこでアプリを開くかの選択が求められます。デフォルトでは個人チャットになっています。他のチャネルやグループチャットで選択することも可能です。 "Open" を選択してください。

![Open surfaces](../assets/images/extend-message-ext-01/nw-open-2.png)

これにより、アプリとの個人チャットが開始されます。しかし、今回は Copilot でのテストですので、次の指示に従ってください。 

Teams の **Chat** をクリックし、次に **Copilot** をクリックしてください。Copilot が最上位のオプションになっているはずです。
**プラグイン アイコン** をクリックし、**Northwind Inventory** を選択してプラグインを有効にしてください。

### Step 2: Copilot で新規コマンドをテスト

プロンプトを入力してください: 

*What are the products ordered by 'Consolidated Holdings' in Northwind Inventory?*

ターミナルの出力には、Copilot がクエリを理解し、`companySearch` コマンドを実行して、Copilot により抽出された company 名を渡したことが示されます。
![03-07-response-customer-search](../assets/images/extend-message-ext-03/03-08-terminal-query-output.png)

Copilot での出力は以下の通りです:
![03-07-response-customer-search](../assets/images/extend-message-ext-03/03-07-response-customer-search.png)

別のプロンプトも試してみてください:

*What are the products ordered by 'Consolidated Holdings' in Northwind Inventory? Please list the product name, price and supplier in a table.*

### Step 3: メッセージ拡張機能としてコマンドをテスト（オプション）

もちろん、この新しいコマンドは、前のラボで行ったように、サンプルをメッセージ拡張機能として使用してテストすることも可能です。

1. Teams のサイドバーで、**Chats** セクションに移動し、任意のチャットを選択するか、同僚との新しいチャットを開始してください。
2. ＋ アイコンをクリックして Apps セクションにアクセスしてください。
3. Northwind Inventory アプリを選択してください。
4. 新たに **Customer** と表示されるタブがあることに注目してください。
5. **Consolidated Holdings** を検索すると、この会社によって注文された商品が表示されます。それらは直前のステップで Copilot が返したものと一致します。

![The new command used as a message extension](../assets/images/extend-message-ext-03/03-08-customer-message-extension.png)

<cc-next />

## おめでとうございます
あなたは今やプラグインのチャンピオンです。次のラボに進み、プラグインに認証を追加してセキュリティを確保しましょう。 "Next" を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/03-enhance-nw-plugin" />