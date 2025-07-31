---
search:
  exclude: true
---
# Lab M3 - 新しい検索コマンドでプラグインを拡張

この lab では、Northwind プラグインに新しいコマンドを追加して機能を拡張します。現在のメッセージ拡張機能は Northwind 在庫データベース内の製品情報を提供しますが、Northwind の顧客に関する情報は提供しません。ユーザーが指定した顧客名で注文された製品を取得する API 呼び出しに紐づく新しいコマンドを導入してください。 

???+ "Extend Teams Message Extension ラボのナビゲーション (Extend Path)"
    - [Lab M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [Lab M1 - Northwind メッセージ拡張を知る](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [Lab M2 - Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [Lab M3 - 新しい検索コマンドでプラグインを拡張](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin) (📍現在地)
    - [Lab M4 - 認証を追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [Lab M5 - アクションコマンドを追加してプラグインを強化](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! tip "NOTE"
    すべてのコード変更を含む完成済みの演習は [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab03-Enhance-NW-Teams/Northwind/) からダウンロードできます。トラブルシューティングに役立ちます。  
    編集内容をリセットしたい場合は、リポジトリを再度クローンして最初からやり直してください。



## Exercise 1 - コード変更

### Step 1 - メッセージ拡張 / プラグインの UI を拡張する 

前の lab で使用した **Northwind** 作業フォルダー内の **appPackage** フォルダーにある **manifest.json** を開きます。  
commands 配列内で `discountSearch` を探してください。`discountSearch` コマンドの閉じ中かっこ直後にカンマ ( , ) を追加します。続いて、`companySearch` コマンドのスニペットをコピーして commands 配列に追加します。

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
    「id」は UI とコードを結び付けるキーです。この値は discount/product/SearchCommand.ts ファイルの `COMMAND_ID` として定義されています。各ファイルに固有の `COMMAND_ID` があり、manifest の「id」と対応していることを確認してください。

### Step 2 - 会社名による製品検索を実装する
会社名で製品を検索し、その会社が注文した製品の一覧を返す機能を実装します。以下のテーブルを使用して情報を取得してください。

| Table         | Find        | Look Up By    |
| ------------- | ----------- | ------------- |
| Customer      | Customer Id | Customer Name |
| Orders        | Order Id    | Customer Id   |
| OrderDetail   | Product     | Order Id      |

仕組みは次のとおりです:  
Customer テーブルを使用して Customer Name から Customer Id を取得します。Orders テーブルを Customer Id でクエリし、関連する Order Id を取得します。各 Order Id について、OrderDetail テーブルから関連製品を取得します。最後に、指定した会社名で注文された製品のリストを返します。

**.\src\northwindDB\products.ts** を開きます。

1 行目の `import` 文を更新して、OrderDetail、Order、Customer を含めます。以下のようになります。
```javascript
import {
    TABLE_NAME, Product, ProductEx, Supplier, Category, OrderDetail,
    Order, Customer
} from './model';
```
`import { getInventoryStatus } from '../adaptiveCards/utils';` の直後に、以下のスニペットのとおり `searchProductsByCustomer()` 関数を追加します。

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



### Step 3: 新しいコマンド用のハンドラーを作成する

VS Code で **src/messageExtensions** フォルダー内の **productSearchCommand.ts** を複製し、コピーしたファイルを "customerSearchCommand.ts" にリネームします。

`COMMAND_ID` 定数の値を次のように変更します:
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
に置き換えます。

**handleTeamsMessagingExtensionQuery** の既存の波かっこ `{}` 内のコードを、下記スニペットに置き換えます。

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


### Step 4 - コマンドルーティングを更新する
このステップでは、`companySearch` コマンドを前のステップで実装したハンドラーにルーティングします。

**src** フォルダーの **searchApp.ts** を開き、以下の import 文を追加します。

```javascript
import customerSearchCommand from "./messageExtensions/customerSearchCommand";
```

`handleTeamsMessagingExtensionQuery` ハンドラー関数の switch 文に、次の case 文を追加します。

```javascript
      case customerSearchCommand.COMMAND_ID: {
        return customerSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      }
```

!!! tip "Note"
    メッセージ拡張 / プラグインの UI 操作では、このコマンドは明示的に呼び出されますが、Microsoft 365 Copilot から呼び出される場合は Copilot オーケストレーターによってトリガーされます。

## Exercise 2 - アプリを実行！会社名で製品を検索

これで、Microsoft 365 Copilot 用プラグインとしてサンプルをテストする準備が整いました。

### Step 1: 更新したアプリをローカルで実行する

ローカルデバッガーが起動したままの場合は停止してください。manifest に新しいコマンドを追加したため、新しいパッケージでアプリを再インストールする必要があります。  
**appPackage** フォルダー内の **manifest.json** で、manifest バージョンを "1.0.9" から "1.0.10" に更新します。これによりアプリの新しい変更が反映されます。 

F5 キーを押すか、スタートボタン 1️⃣ をクリックしてデバッガーを再起動します。デバッグプロファイルを選択するダイアログが表示されたら、Debug in Teams (Edge) 2️⃣ を選択するか、別のプロファイルを選択してください。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

デバッグが開始されると、ブラウザー ウィンドウで Teams が開きます。Agents Toolkit にサインインしたものと同じ資格情報でログインしてください。  
Teams が開いたら、アプリを開くかどうかを尋ねるダイアログが表示されます。 

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開くとすぐに、どのサーフェスでアプリを開くか選択するよう求められます。既定ではパーソナルチャットです。チャンネルやグループチャットを選択することも可能です。「Open」を選択してください。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとのパーソナルチャットに入ります。ただし Copilot でテストするため、次の手順に従ってください。 

Teams で **Chat** をクリックし、その後 **Copilot** をクリックします。Copilot は最上位に表示されます。  
**Plugin アイコン** をクリックし、**Northwind Inventory** を選択してプラグインを有効化します。

### Step 2: Copilot で新しいコマンドをテストする

次のプロンプトを入力します: 

*What are the products ordered by 'Consolidated Holdings' in Northwind Inventory?*

ターミナル出力には、Copilot がクエリを理解し `companySearch` コマンドを実行、会社名を抽出して渡したことが表示されます。  
![03-07-response-customer-search](../../assets/images/extend-message-ext-03/03-08-terminal-query-output.png)

Copilot の出力例:  
![03-07-response-customer-search](../../assets/images/extend-message-ext-03/03-07-response-customer-search.png)

次のプロンプトも試してみてください:

*What are the products ordered by 'Consolidated Holdings' in Northwind Inventory? Please list the product name, price and supplier in a table.*

### Step 3: メッセージ拡張としてコマンドをテストする (オプション)

もちろん、前の lab と同様にサンプルをメッセージ拡張として使用して、この新しいコマンドをテストすることも可能です。

1. Teams サイドバーの **Chats** セクションに移動し、任意のチャットを選択するか新しいチャットを開始します。  
2. + 記号をクリックして Apps セクションにアクセスします。  
3. Northwind Inventory アプリを選択します。  
4. **Customer** という新しいタブが表示されていることを確認してください。  
5. **Consolidated Holdings** を検索し、この会社が注文した製品を確認します。Copilot が前のステップで返した結果と一致します。

![The new command used as a message extension](../../assets/images/extend-message-ext-03/03-08-customer-message-extension.png)

<cc-next />

## Congratulations
これでプラグイン チャンピオンです！ 次は認証でプラグインを保護しましょう。次の lab に進むには「Next」を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/03-enhance-nw-plugin--ja" />