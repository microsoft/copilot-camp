---
search:
  exclude: true
---
# ラボ M3 - 新しい検索コマンドでプラグインを拡張

このラボでは、Northwind プラグインに新しいコマンドを追加して機能を拡張します。現在のメッセージ拡張機能は Northwind の在庫データベース内の製品情報を提供しますが、Northwind の顧客に関する情報は提供しません。ユーザーが指定した顧客名で注文された製品を取得する API 呼び出しに関連付けられた新しいコマンドを追加しましょう。 

???+ "Extend Teams Message Extension ラボの移動手順 (Extend Path)"
    - [Lab M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [Lab M1 - Northwind メッセージ拡張機能を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [Lab M2 - Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [Lab M3 - 新しい検索コマンドでプラグインを拡張](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)(📍現在位置)
    - [Lab M4 - 認証を追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [Lab M5 - アクションコマンドでプラグインを拡張](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! tip "NOTE"
    すべてのコード変更を含む完成版は [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab03-Enhance-NW-Teams/Northwind/) からダウンロードできます。トラブルシューティングに便利です。  
    編集をリセットしたい場合は、リポジトリを再度クローンして最初からやり直せます。



## 演習 1 - コード変更

### 手順 1 - Message Extension / プラグイン UI を拡張

前のラボで使用した **Northwind** 作業ディレクトリ内の **appPackage** フォルダーにある **manifest.json** を開きます。  
commands 配列内で `discountSearch` を探します。その閉じ波かっこ `}` の後ろにカンマ `,` を追加します。次に `companySearch` コマンドのスニペットをコピーして commands 配列に追加します。

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
    "id" は UI とコードを結び付けるキーです。この値は discount/product/SearchCommand.ts の `COMMAND_ID` として定義されています。各ファイルに一意の `COMMAND_ID` があり、"id" の値と対応していることを確認してください。

### 手順 2 - 会社名による製品検索を実装
会社名で製品を検索し、その会社が注文した製品一覧を返す機能を実装します。以下のテーブルを使って情報を取得してください。

| Table         | Find        | Look Up By    |
| ------------- | ----------- | ------------- |
| Customer      | Customer Id | Customer Name |
| Orders        | Order Id    | Customer Id   |
| OrderDetail   | Product     | Order Id      |

動作の流れ:  
Customer テーブルで Customer Name から Customer Id を取得します。次に Orders テーブルで Customer Id を使って関連する Order Id を取得します。各 Order Id について、OrderDetail テーブルで関連する製品を取得します。最後に、指定された会社名が注文した製品一覧を返します。

**.\src\northwindDB\products.ts** を開きます。

1 行目の `import` 文を更新して `OrderDetail`, `Order`, `Customer` を含めます。以下のようになります。
```javascript
import {
    TABLE_NAME, Product, ProductEx, Supplier, Category, OrderDetail,
    Order, Customer
} from './model';
```
次に、`import { getInventoryStatus } from '../adaptiveCards/utils';` の直後に、下記スニペットの `searchProductsByCustomer()` 関数を追加します。

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



### 手順 3 - 新しいコマンド用ハンドラーの作成

VS Code で **src/messageExtensions** フォルダー内の **productSearchCommand.ts** を複製し、コピーしたファイル名を "customerSearchCommand.ts" に変更します。

`COMMAND_ID` 定数の値を以下に変更します:
```javascript
const COMMAND_ID = "companySearch";
```
次の `import` 文を:

```JavaScript
import { searchProducts } from "../northwindDB/products";`
```
から

```JavaScript
import { searchProductsByCustomer } from "../northwindDB/products";
```
に置き換えます。

既存の **handleTeamsMessagingExtensionQuery** ブロック内のコードを、以下のスニペットで置き換えます:

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

**src** フォルダーの **searchApp.ts** を開き、次の `import` 文を追加します:

```javascript
import customerSearchCommand from "./messageExtensions/customerSearchCommand";
```

`handleTeamsMessagingExtensionQuery` ハンドラー関数の switch 文に、以下の case を追加します:

```javascript
      case customerSearchCommand.COMMAND_ID: {
        return customerSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      }
```

!!! tip "Note"
    Message Extension / プラグインを UI から操作する場合、このコマンドは明示的に呼び出されます。しかし、Microsoft 365 Copilot から呼び出される場合は、Copilot オーケストレーターによってトリガーされます。

## 演習 2 - アプリを実行！会社名で製品を検索

これで、Microsoft 365 Copilot 用プラグインとしてサンプルをテストする準備が整いました。

### 手順 1: 更新したアプリをローカルで実行

ローカルデバッガーが起動したままの場合は停止します。新しいコマンドを manifest に追加したため、新しいパッケージでアプリを再インストールする必要があります。  
**appPackage** フォルダー内の **manifest.json** で manifest バージョンを "1.0.9" から "1.0.10" に更新します。これによりアプリの新しい変更が反映されます。 

デバッガーを再起動します。キーボードの  F5  を押すか、開始ボタン 1️⃣ をクリックしてください。デバッグ プロファイル選択画面が表示されたら **Debug in Teams (Edge)** 2️⃣ を選択するか、他のプロファイルを選びます。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

デバッグを開始すると Teams がブラウザーで開きます。Agents Toolkit にサインインした同じ資格情報でログインしてください。  
ログインすると Microsoft Teams が開き、アプリケーションを開くかどうかのダイアログが表示されます。 

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開くとすぐにアプリをどこで開くかを尋ねられます。既定では個人チャットです。チャンネルやグループチャットも選択できます。**Open** を選択してください。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとの個人チャット画面になります。ただし Copilot でテストするため、次の手順に進みます。 

Teams で **Chat** をクリックし、**Copilot** を選択します (最上部のオプションのはずです)。  
**Plugin アイコン** をクリックし、**Northwind Inventory** を選択してプラグインを有効にします。

### 手順 2: Copilot で新コマンドをテスト

次のプロンプトを入力します: 

*What are the products ordered by 'Consolidated Holdings' in Northwind Inventory?*

ターミナル出力では、Copilot がクエリを理解し、`companySearch` コマンドを実行して、Copilot が抽出した会社名を渡していることが分かります。  
![03-07-response-customer-search](../../assets/images/extend-message-ext-03/03-08-terminal-query-output.png)

Copilot での出力例:  
![03-07-response-customer-search](../../assets/images/extend-message-ext-03/03-07-response-customer-search.png)

次のプロンプトも試してみましょう:

*What are the products ordered by 'Consolidated Holdings' in Northwind Inventory? Please list the product name, price and supplier in a table.*

### 手順 3: Message Extension としてコマンドをテスト (任意)

もちろん、前のラボと同様に、この新しいコマンドを Message Extension としてもテストできます。

1. Teams のサイドバーで **Chats** を開き、任意のチャットを選択するか、新しいチャットを開始します。  
2. **+** アイコンをクリックして Apps セクションにアクセスします。  
3. Northwind Inventory アプリを選択します。  
4. **Customer** という新しいタブが表示されていることを確認してください。  
5. **Consolidated Holdings** を検索すると、この会社が注文した製品が表示されます。Copilot が先ほど返した結果と一致します。

![The new command used as a message extension](../../assets/images/extend-message-ext-03/03-08-customer-message-extension.png)

<cc-next />

## おめでとうございます
これでプラグインチャンピオンになりました。次は認証でプラグインを保護しましょう。次のラボへ進むには **Next** を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/03-enhance-nw-plugin" />