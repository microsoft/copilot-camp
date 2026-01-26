---
search:
  exclude: true
---
# ラボ M3 - 新しい検索コマンドによるプラグインの拡張

このラボでは、Northwind プラグインに新しいコマンドを追加して拡張します。現在のメッセージ拡張は Northwind 在庫データベース内の製品情報を提供しますが、Northwind の顧客に関連する情報は提供しません。ここでは、 ユーザー が指定した会社名で注文された製品を取得する API 呼び出しに関連付けられた新しいコマンドを追加します。 

???+ "Extend Teams Message Extension ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ拡張の概要](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドによるプラグインの拡張](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)(📍現在地)
    - [ラボ M4 - 認証の追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクションコマンドによるプラグインの拡張](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! tip "NOTE"
    すべてのコード変更を含む完成版の演習は [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab03-Enhance-NW-Teams/Northwind/) からダウンロードできます。トラブルシューティングに役立ちます。
    変更をリセットしたい場合は、リポジトリを再度クローンしてやり直してください。



## 演習 1 - コード変更

### 手順 1 - メッセージ拡張 / プラグイン UI の拡張

前回のラボで作成した **Northwind** 作業ディレクトリ内の **appPackage** フォルダーにある **manifest.json** を開きます。
commands 配列の中で `discountSearch` を探します。`discountSearch` コマンドの閉じカッコの後ろにカンマ , を追加します。その後 `companySearch` コマンドのスニペットをコピーして commands 配列に追加します。

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
    "id" は UI とコードを結び付けるキーです。この値は discount/product/SearchCommand.ts ファイルで `COMMAND_ID` として定義されています。各ファイルには固有の `COMMAND_ID` があり、"id" の値と対応しています。

### 手順 2 - 会社名による製品検索の実装
会社名で製品を検索し、その会社が注文した製品の一覧を返す機能を実装します。以下のテーブルを参考にしてください。

| Table         | 検索対象        | 参照キー        |
| ------------- | --------------- | --------------- |
| Customer      | Customer Id     | Customer Name   |
| Orders        | Order Id        | Customer Id     |
| OrderDetail   | Product         | Order Id        |

動作概要:  
Customer テーブルで Customer Name から Customer Id を取得します。次に Orders テーブルで Customer Id を使って関連する Order Id を取得します。各 Order Id について、OrderDetail テーブルで関連製品を取得します。最後に、指定した会社名が注文した製品の一覧を返します。

**.\src\northwindDB\products.ts** を開きます。

1 行目の `import` 文を更新して `OrderDetail`, `Order`, `Customer` を含めます。次のようになります。
```javascript
import {
    TABLE_NAME, Product, ProductEx, Supplier, Category, OrderDetail,
    Order, Customer
} from './model';
```
`import { getInventoryStatus } from '../adaptiveCards/utils';` の直後に、下記スニペットのとおり `searchProductsByCustomer()` 関数を追加します。

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



### 手順 3 - 新しいコマンド用のハンドラー作成

VS Code で **src/messageExtensions** フォルダーにある **productSearchCommand.ts** を複製し、コピーしたファイルの名前を **customerSearchCommand.ts** に変更します。

`COMMAND_ID` 定数の値を次のように変更します。
```javascript
const COMMAND_ID = "companySearch";
```
以下の import 文を:

```JavaScript
import { searchProducts } from "../northwindDB/products";`
```
から

```JavaScript
import { searchProductsByCustomer } from "../northwindDB/products";
```
へ置き換えます。

**handleTeamsMessagingExtensionQuery** の既存の波かっこ内のコードを下記スニペットに置き換えます。

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


### 手順 4 - コマンドルーティングの更新
この手順では、`companySearch` コマンドを前手順で実装したハンドラーにルーティングします。

**src** フォルダーにある **searchApp.ts** を開き、次の import 文を追加します。 

```javascript
import customerSearchCommand from "./messageExtensions/customerSearchCommand";
```

`handleTeamsMessagingExtensionQuery` ハンドラー関数の switch 文に、以下の case 文を追加します。

```javascript
      case customerSearchCommand.COMMAND_ID: {
        return customerSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      }
```

!!! tip "Note"
    メッセージ拡張 / プラグインを UI で操作するときは、このコマンドが明示的に呼び出されます。しかし、Microsoft 365 Copilot から呼び出される場合は、Copilot オーケストレーターによってトリガーされます。

## 演習 2 - アプリを実行! 会社名で製品を検索

これで、Microsoft 365 Copilot のプラグインとしてサンプルをテストできる準備が整いました。

### 手順 1: 更新したアプリをローカルで実行

ローカルデバッガーが実行中の場合は停止します。新しいコマンドで manifest を更新したため、新しいパッケージでアプリを再インストールする必要があります。  
**appPackage** フォルダー内の **manifest.json** で `version` を "1.0.9" から "1.0.10" に更新します。これによりアプリの変更が反映されます。 

F5 キーを押すか、スタートボタン 1️⃣ をクリックしてデバッガーを再起動します。デバッグ プロファイルを選択する画面が表示されるので、Debug in Teams (Edge) 2️⃣ か別のプロファイルを選択します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

デバッグを開始するとブラウザー ウィンドウで Teams が開きます。Agents Toolkit にサインインしたのと同じ資格情報でログインしてください。  
Teams が開くと、アプリを開くかどうかのダイアログが表示されます。 

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開くとすぐに、アプリをどこで開くか尋ねられます。既定では **Personal Chat** ですが、チャネルまたはグループ チャットも選択できます。「Open」を選択します。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとのパーソナル チャットに入ります。ただし、今回は Copilot でテストするので次の手順に従ってください。 

Teams で **Chat** をクリックし、**Copilot** を選択します。Copilot が最上部に表示されます。  
**Plugin アイコン** をクリックし、**Northwind Inventory** を選択してプラグインを有効にします。

### 手順 2: Copilot で新しいコマンドをテスト

次のプロンプトを入力します。 

*What are the products ordered by 'Consolidated Holdings' in Northwind Inventory?*

ターミナル出力には Copilot がクエリを理解し、会社名を抽出して `companySearch` コマンドを実行したことが表示されます。  
![03-07-response-customer-search](../../assets/images/extend-message-ext-03/03-08-terminal-query-output.png)

Copilot での出力例:  
![03-07-response-customer-search](../../assets/images/extend-message-ext-03/03-07-response-customer-search.png)

他にも次のプロンプトを試せます。  

*What are the products ordered by 'Consolidated Holdings' in Northwind Inventory? Please list the product name, price and supplier in a table.*

### 手順 3: メッセージ拡張としてコマンドをテスト (オプション)

もちろん、この新しいコマンドをメッセージ拡張としてもテストできます。前のラボと同様です。

1. Teams のサイドバーで **Chats** に移動し、任意のチャットを開くか新しいチャットを開始します。  
2. + アイコンをクリックして **Apps** セクションにアクセスします。  
3. Northwind Inventory アプリを選択します。  
4. **Customer** という新しいタブが追加されていることを確認します。  
5. **Consolidated Holdings** を検索し、この会社が注文した製品を確認します。Copilot が前手順で返した結果と一致します。  

![The new command used as a message extension](../../assets/images/extend-message-ext-03/03-08-customer-message-extension.png)

<cc-next />

## おめでとうございます
これでプラグインチャンピオンになりました。次は認証でプラグインを保護します。次のラボに進み、「Next」を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/03-enhance-nw-plugin--ja" />