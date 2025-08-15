---
search:
  exclude: true
---
# ラボ M3 - 新しい検索コマンドでプラグインを拡張

このラボでは、Northwind プラグインに新しいコマンドを追加して拡張します。現在のメッセージ拡張機能は Northwind 在庫データベース内の製品情報を提供できますが、Northwind の顧客に関する情報は提供できません。ユーザーが指定した会社名で注文された製品を取得する API 呼び出しに関連付けられた新しいコマンドを追加してください。 

???+ "Extend Teams Message Extension ラボのナビゲーション (Extend Path)"
    - [Lab M0 - 事前準備](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [Lab M1 - Northwind メッセージ拡張機能を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [Lab M2 - Microsoft 365 Copilot でアプリを実行する](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [Lab M3 - 新しい検索コマンドでプラグインを拡張](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin) (📍現在地)
    - [Lab M4 - 認証を追加する](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [Lab M5 - アクション コマンドでプラグインを拡張する](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! tip "NOTE"
    すべてのコード変更を含む完成版は [こちら](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab03-Enhance-NW-Teams/Northwind/) からダウンロードできます。トラブルシューティング時に便利です。  
    編集内容をリセットしたい場合は、リポジトリを再クローンしてやり直すことができます。



## 演習 1 - コード変更

### 手順 1 - Message Extension / プラグインのユーザー インターフェースを拡張する 

前のラボで作成した作業ディレクトリ **Northwind** 内の **appPackage** フォルダーにある **manifest.json** を開きます。  
commands 配列内で `discountSearch` を探します。`discountSearch` コマンドの閉じかっこの後ろにカンマ ( , ) を追加します。その後、`companySearch` コマンドのスニペットをコピーして commands 配列に追加してください。

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
    "id" は UI とコードを結び付けるキーです。この値は `discount/product/SearchCommand.ts` ファイルで `COMMAND_ID` 定数として定義されています。各ファイルには固有の `COMMAND_ID` があり、"id" の値と対応しています。

### 手順 2 - 会社名での製品検索を実装する
会社名で製品を検索し、その会社が注文した製品一覧を返す機能を実装します。必要な情報は下記のテーブルから取得できます。

| Table         | Find            | Look Up By     |
| ------------- | --------------- | -------------- |
| Customer      | Customer Id     | Customer Name  |
| Orders        | Order Id        | Customer Id    |
| OrderDetail   | Product         | Order Id       |

仕組みは以下のとおりです。  
Customer テーブルで Customer Name から Customer Id を取得します。その Customer Id で Orders テーブルを照会し、関連する Order Id を取得します。各 Order Id について OrderDetail テーブルから関連する製品を取得し、最終的に指定した会社名で注文された製品の一覧を返します。

**.\src\northwindDB\products.ts** を開きます。

1 行目の `import` 文を更新し、`OrderDetail`, `Order`, `Customer` を含めます。以下のようになります。  
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



### 手順 3 - 新しいコマンド用のハンドラーを作成する

VS Code で **src/messageExtensions** フォルダーにある **productSearchCommand.ts** を複製し、コピーしたファイル名を `customerSearchCommand.ts` に変更します。

`COMMAND_ID` 定数の値を以下のように変更してください。  
```javascript
const COMMAND_ID = "companySearch";
```

下記の import 文を:

```JavaScript
import { searchProducts } from "../northwindDB/products";`
```
から

```JavaScript
import { searchProductsByCustomer } from "../northwindDB/products";
```
へ置き換えます。

**handleTeamsMessagingExtensionQuery** の既存の波かっこの中身を下記スニペットに差し替えます。

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


### 手順 4 - コマンド ルーティングを更新する
この手順では、`companySearch` コマンドを前手順で実装したハンドラーにルーティングします。

**src** フォルダーにある **searchApp.ts** を開き、次の `import` 文を追加します。

```javascript
import customerSearchCommand from "./messageExtensions/customerSearchCommand";
```

`handleTeamsMessagingExtensionQuery` ハンドラー関数の `switch` 文に、下記の `case` 文を追加します。

```javascript
      case customerSearchCommand.COMMAND_ID: {
        return customerSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      }
```

!!! tip "Note"
    UI ベースの Message Extension / プラグイン操作では、このコマンドが明示的に呼び出されます。しかし Microsoft 365 Copilot から呼び出された場合は、Copilot オーケストレーターによってコマンドがトリガーされます。

## 演習 2 - アプリを実行して会社名で検索する

これで Microsoft 365 Copilot のプラグインとしてサンプルをテストする準備が整いました。

### 手順 1: 更新したアプリをローカルで実行する

ローカル デバッガーが動いたままの場合は停止します。新しいコマンドを追加したため、パッケージを新たにインストールする必要があります。  
**appPackage** フォルダー内の **manifest.json** で `manifestVersion` を "1.0.9" から "1.0.10" に更新してください。これによりアプリの変更が反映されます。 

F5 キーを押すかスタート ボタン 1️⃣ をクリックしてデバッガーを再起動します。デバッグ プロファイルの選択を求められたら **Debug in Teams (Edge)** 2️⃣ を選択するか、別のプロファイルを選んでください。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

デバッグを開始すると、ブラウザー内で Teams が開きます。Agents Toolkit にサインインしたのと同じ資格情報でログインしてください。  
ログインすると Microsoft Teams がアプリを開くかどうか確認するダイアログを表示します。 

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開くとすぐに、どこでアプリを開くかを尋ねられます。既定ではパーソナル チャットです。チャンネルやグループ チャットも選択できます。[Open] を選択してください。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとのパーソナル チャット画面に入ります。しかし今回は Copilot でテストするため、次の手順に進みます。 

Teams で **Chat** をクリックし、続いて **Copilot** を選択します (最上位に表示されているはずです)。  
**Plugin アイコン** をクリックし、**Northwind Inventory** を選択してプラグインを有効化します。

### 手順 2: Copilot で新しいコマンドをテストする

次のプロンプトを入力します。 

*What are the products ordered by 'Consolidated Holdings' in Northwind Inventory?*

ターミナル出力では、Copilot がクエリを理解し `companySearch` コマンドを実行して、Copilot が抽出した会社名を渡していることが確認できます。  
![03-07-response-customer-search](../../assets/images/extend-message-ext-03/03-08-terminal-query-output.png)

Copilot での出力例は次のとおりです。  
![03-07-response-customer-search](../../assets/images/extend-message-ext-03/03-07-response-customer-search.png)

ほかにも次のプロンプトを試してみてください。

*What are the products ordered by 'Consolidated Holdings' in Northwind Inventory? Please list the product name, price and supplier in a table.*

### 手順 3: Message Extension としてコマンドをテストする (オプション)

もちろん、この新しいコマンドはサンプルを Message Extension として使用してテストすることもできます（前のラボと同様）。

1. Teams のサイドバーで **Chats** セクションに移動し、任意のチャットを選択するか新しいチャットを開始します。  
2. + 記号をクリックして **Apps** セクションを開きます。  
3. Northwind Inventory アプリを選択します。  
4. すると **Customer** という新しいタブが表示されます。  
5. **Consolidated Holdings** を検索して、この会社が注文した製品を確認してください。Copilot で前手順に表示されたものと一致するはずです。

![The new command used as a message extension](../../assets/images/extend-message-ext-03/03-08-customer-message-extension.png)

<cc-next />

## おめでとうございます
これでプラグイン チャンピオンです。次は認証でプラグインを保護しましょう。次のラボに進むには「Next」を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/03-enhance-nw-plugin--ja" />