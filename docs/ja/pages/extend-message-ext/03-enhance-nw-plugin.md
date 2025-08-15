---
search:
  exclude: true
---
# Lab M3 - 新しい検索コマンドによるプラグインの拡張

この lab では、Northwind プラグインに新しいコマンドを追加して機能を拡張します。現在のメッセージ拡張機能は Northwind 在庫データベース内の商品情報を提供できますが、Northwind の顧客に関する情報は提供できません。ユーザーが指定した顧客名で注文された商品を取得する API 呼び出しに関連付けられた新しいコマンドを追加してください。 

???+ "Navigating the Extend Teams Message Extension labs (Extend Path)"
    - [Lab M0 - Prerequisites](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [Lab M1 - Get to know Northwind message extension](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [Lab M2 - Run app in Microsoft 365 Copilot](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [Lab M3 - Enhance plugin with new search command](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)(📍You are here)
    - [Lab M4 - Add authentication](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [Lab M5 - Enhance plugin with an action command](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! tip "NOTE"
    すべてのコード変更を含む完成版は [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab03-Enhance-NW-Teams/Northwind/) からダウンロードできます。トラブルシューティングに便利です。  
    変更をリセットしたい場合は、リポジトリを再クローンしてやり直してください。



## Exercise 1 - コードの変更

### Step 1 -  Message Extension / プラグイン UI の拡張 

前の lab で使用した **Northwind** 作業ディレクトリで **appPackage** フォルダー内の **manifest.json** を開きます。  
commands 配列内の `discountSearch` を探します。その閉じカッコの後ろにカンマ `,` を追加してください。次に、`companySearch` コマンドのスニペットをコピーして commands 配列に追加します。

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
    "id" は UI とコードをつなぐキーです。この値は `discount/product/SearchCommand.ts` ファイルで `COMMAND_ID` として定義されています。各ファイルには一意の `COMMAND_ID` があり、"id" の値と対応しています。

### Step 2 - 会社名による商品検索の実装
会社名で検索し、その会社が注文した商品の一覧を返す機能を実装します。以下の表を参考に情報を取得してください。

| Table         | Find        | Look Up By    |
| ------------- | ----------- | ------------- |
| Customer      | Customer Id | Customer Name |
| Orders        | Order Id    | Customer Id   |
| OrderDetail   | Product     | Order Id      |

仕組みは次のとおりです：  
Customer テーブルで顧客名から Customer Id を取得します。Orders テーブルを Customer Id で検索し、それに関連する Order Id を取得します。各 Order Id について、OrderDetail テーブルで関連する商品を探します。最後に、指定した会社が注文した商品の一覧を返します。

**.\src\northwindDB\products.ts** を開きます。

1 行目の `import` 文を更新して `OrderDetail`、`Order`、`Customer` を追加してください。最終的には次のようになります。  
```javascript
import {
    TABLE_NAME, Product, ProductEx, Supplier, Category, OrderDetail,
    Order, Customer
} from './model';
```

`import { getInventoryStatus } from '../adaptiveCards/utils';` の直後に、以下のスニペットのように新しい関数 `searchProductsByCustomer()` を追加します。

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



### Step 3: 新しいコマンド用ハンドラーの作成

VS Code で **src/messageExtensions** フォルダー内の **productSearchCommand.ts** ファイルを複製し、コピーしたファイル名を `customerSearchCommand.ts` に変更します。

`COMMAND_ID` 定数の値を次のように変更します。  
```javascript
const COMMAND_ID = "companySearch";
```

以下の import 文を

```JavaScript
import { searchProducts } from "../northwindDB/products";`
```
から
```JavaScript
import { searchProductsByCustomer } from "../northwindDB/products";
```
へ置き換えてください。

`handleTeamsMessagingExtensionQuery` の中括弧内にある既存コードを、次のスニペットで置き換えます。

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
このステップでは、`companySearch` コマンドを前ステップで実装したハンドラーへルーティングします。

**src** フォルダー内の **searchApp.ts** を開き、次の import 文を追加します。 

```javascript
import customerSearchCommand from "./messageExtensions/customerSearchCommand";
```

`handleTeamsMessagingExtensionQuery` ハンドラ関数の switch 文に、次のように case 文を追加します。

```javascript
      case customerSearchCommand.COMMAND_ID: {
        return customerSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      }
```

!!! tip "Note"
    UI ベースの操作ではこのコマンドが明示的に呼び出されますが、Microsoft 365 Copilot から呼び出される場合は Copilot オーケストレーターによってトリガーされます。

## Exercise 2 - アプリを実行！会社名で商品を検索する

これで Microsoft 365 Copilot のプラグインとしてサンプルをテストする準備が整いました。

### Step 1: 更新したアプリをローカルで実行

ローカルデバッガーが動作中の場合は停止してください。新しいコマンドを追加したので、更新されたパッケージでアプリを再インストールする必要があります。  
**appPackage** フォルダー内の **manifest.json** で manifest バージョンを `"1.0.9"` から `"1.0.10"` に更新します。これによりアプリの変更が反映されます。 

F5 を押すか、スタートボタン 1️⃣ をクリックしてデバッガーを再起動します。デバッグプロファイルを選択する画面が表示されたら **Debug in Teams (Edge)** 2️⃣ を選択、または別のプロファイルを選択してください。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

デバッグを開始すると、Teams がブラウザーで開きます。Agents Toolkit にサインインしたのと同じ資格情報でログインしてください。  
ログイン後、Microsoft Teams がアプリを開くかどうか確認するダイアログを表示します。 

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開くとすぐに、どこでアプリを開くかを尋ねられます。既定では個人チャットです。チャンネルやグループチャットも選択できます。「Open」を選択してください。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとの個人チャットに入ります。ただし、今回は Copilot でテストするので次の手順に従ってください。 

Teams で **Chat** をクリックし、その後 **Copilot** を選択します。Copilot はリストの最上部にあるはずです。  
**Plugin アイコン** をクリックし、**Northwind Inventory** を選択してプラグインを有効化します。

### Step 2: Copilot で新しいコマンドをテスト

次のプロンプトを入力します。 

*What are the products ordered by 'Consolidated Holdings' in Northwind Inventory?*

ターミナル出力には、Copilot がクエリを理解し `companySearch` コマンドを実行、会社名を引数として渡したことが表示されます。  
![03-07-response-customer-search](../../assets/images/extend-message-ext-03/03-08-terminal-query-output.png)

Copilot での出力は次のとおりです。  
![03-07-response-customer-search](../../assets/images/extend-message-ext-03/03-07-response-customer-search.png)

他にも次のプロンプトを試してみてください。

*What are the products ordered by 'Consolidated Holdings' in Northwind Inventory? Please list the product name, price and supplier in a table.*

### Step 3: メッセージ拡張機能としてコマンドをテスト (任意)

もちろん、前の lab と同様に、この新しいコマンドをメッセージ拡張機能としてもテストできます。

1. Teams のサイドバーで **Chats** に移動し、任意のチャットを開くか新しいチャットを開始します。  
2. **+** アイコンをクリックして Apps セクションを開きます。  
3. **Northwind Inventory** アプリを選択します。  
4. **Customer** という新しいタブが表示されていることを確認します。  
5. **Consolidated Holdings** を検索し、この会社が注文した商品を確認します。Copilot で得た結果と一致するはずです。  

![The new command used as a message extension](../../assets/images/extend-message-ext-03/03-08-customer-message-extension.png)

<cc-next />

## Congratulations
これでプラグイン チャンピオンです。次は、認証を追加してプラグインを保護しましょう。次の lab へ進み、「Next」を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/03-enhance-nw-plugin--ja" />