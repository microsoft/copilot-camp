---
search:
  exclude: true
---
# ラボ M1 - Northwind メッセージ拡張を理解する
このラボでは、ベースアプリである Northwind メッセージ拡張を実行します。最初の演習ではソースコードに慣れ、最後にアプリケーションを Teams で実行します。

???+ "Extend Teams Message Extension ラボのナビゲーション (Extend Path)"
    - [ラボ M0 - 前提条件](/copilot-camp/ja/pages/extend-message-ext/00-prerequisites) 
    - [ラボ M1 - Northwind メッセージ拡張を理解する](/copilot-camp/ja/pages/extend-message-ext/01-nw-teams-app) (📍現在地)
    - [ラボ M2 - Microsoft 365 Copilot でアプリを実行する](/copilot-camp/ja/pages/extend-message-ext/02-nw-plugin) 
    - [ラボ M3 - 新しい検索コマンドでプラグインを強化する](/copilot-camp/ja/pages/extend-message-ext/03-enhance-nw-plugin)
    - [ラボ M4 - 認証を追加する](/copilot-camp/ja/pages/extend-message-ext/04-add-authentication) 
    - [ラボ M5 - アクション コマンドでプラグインを強化する](/copilot-camp/ja/pages/extend-message-ext/05-add-action) 

このラボで行うこと:

- Northwind メッセージ拡張のクイックコードツアー
- アプリケーションを Teams 上で実行

## Exercise 1 - コードツアー

まずは Northwind と呼ばれるベースアプリのコードを確認しましょう。 


### Step 1 - マニフェストを確認する

Microsoft 365 アプリケーションの中核はアプリケーション マニフェストです。ここで Microsoft 365 がアプリケーションへアクセスするための情報を提供します。

前のラボで作成した **Northwind** という作業ディレクトリ内の **appPackage** フォルダーにある [manifest.json](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind/appPackage/manifest.json) ファイルを開きます。この JSON ファイルはアイコンファイルと共に ZIP にまとめられ、アプリケーション パッケージとなります。`icons` プロパティにはアイコンへのパスが含まれています。

~~~json
"icons": {
    "color": "Northwind-Logo3-192-${{TEAMSFX_ENV}}.png",
    "outline": "Northwind-Logo3-32.png"
},
~~~

アイコン名に含まれるトークン `${{TEAMSFX_ENV}}` に注目してください。Agents Toolkit がこれを環境名 (例: `local` や `dev` など) に置き換えます。そのため環境ごとにアイコンの色が変わります。

次に `name` と `description` を見てみましょう。description がかなり長いことに気付くはずです。これは ユーザー と Copilot の両方がアプリケーションの機能と使用シーンを理解するために重要です。

~~~json
    "name": {
        "short": "Northwind Inventory",
        "full": "Northwind Inventory App"
    },
    ...
~~~

少し下にスクロールして `composeExtensions` を探します。Compose extension はメッセージ拡張の旧称で、ここにアプリのメッセージ拡張が定義されています。

この中に Agents Toolkit が供給した bot ID 付きの bot が存在します。

~~~json
    "composeExtensions": [
        {
            "botId": "${{BOT_ID}}",
            "commands": [
                {
                    ...
~~~

メッセージ拡張は Azure Bot Framework を用いて通信します。これにより Microsoft 365 とアプリ間で高速かつ安全な通信チャネルが確立されます。プロジェクトを初めて実行した際に Agents Toolkit が bot を登録し、その bot ID をここに配置します。

このメッセージ拡張には 2 つのコマンドがあり、`commands` 配列に定義されています。1 つ選んで構造を確認してみましょう。

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

これは Northwind のカテゴリー内で割引商品を検索するためのコマンドです。単一パラメーター `categoryName` を受け取ります。

では最初のコマンド `inventorySearch` に戻りましょう。こちらは 5 つのパラメーターを持ち、より高度なクエリが可能です。

~~~json
{
    "id": "inventorySearch",
    ...
},
~~~



### Step 2 - 「Bot」コードを確認する

ルートフォルダーの **src** にある **searchApp.ts** ファイルを開きます。このアプリケーションには Azure Bot Framework と通信する「bot」コードが含まれており、[Bot Builder SDK](https://learn.microsoft.com/azure/bot-service/index-bf-sdk?view=azure-bot-service-4.0) を利用しています。

bot は SDK の **TeamsActivityHandler** クラスを拡張しています。

~~~typescript
export class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

  ...
~~~

**TeamsActivityHandler** のメソッドをオーバーライドすることで、Microsoft 365 から送られるメッセージ (アクティビティ) を処理できます。

最初に紹介するのは Messaging Extension Query アクティビティです (「messaging extension」はメッセージ拡張の旧称)。ユーザーがメッセージ拡張に入力したときや Copilot が呼び出したときに実行されます。

~~~typescript
  // Handle search message extension
  public async handleTeamsMessagingExtensionQuery(
    context: TurnContext,
    query: MessagingExtensionQuery
  ): Promise<MessagingExtensionResponse> {
...
~~~

実際には command ID に基づいてクエリをディスパッチしているだけです。これらの command ID は前述のマニフェストで使用されているものと同一です。

もう 1 つアプリが処理すべきアクティビティは adaptive card のアクションです。そこで `onInvokeActivity()` をオーバーライドし、アクティビティ名をチェックして適切なハンドラーへディスパッチします。Invoke がメッセージ拡張のクエリだった場合はベース実装が `handleTeamsMessagingExtensionQuery()` を呼び出します。

~~~typescript
import {
  TeamsActivityHandler,
  TurnContext,
  MessagingExtensionQuery,
...
~~~

### Step 3 - メッセージ拡張コマンドのコードを確認する

コードをモジュール化し読みやすく再利用しやすくするため、各メッセージ拡張コマンドは独自の TypeScript モジュールに分けられています。例として **src/messageExtensions/discountSearchCommand.ts** を見てみましょう。

まずモジュールが `COMMAND_ID` 定数をエクスポートしており、これがマニフェストと一致することにより **searchApp.ts** の switch が正しく機能します。

次に `handleTeamsMessagingExtensionQuery()` 関数がカテゴリー別割引商品検索を処理します。

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

`query.parameters` 配列のインデックスがマニフェストの順序と一致しない場合があるので、パラメーター名で値を取得しています。

パラメーターを整形した後、Northwind のデータアクセス層 `getDiscountedProductsByCategory()` を呼び出します。

その後、各商品について 2 種類のカードを作成します。

* プレビュー カード: 「ヒーロー」カードで実装。検索結果や Copilot の引用で表示
* 結果カード: 詳細を含む「アダプティブ」カード

次のステップでアダプティブカードのコードとデザイナーを確認します。

### Step 4 - アダプティブカードと関連コードを確認する

プロジェクトのアダプティブカードは **src/adaptiveCards** フォルダーにあります。3 つの JSON ファイルで実装されています。

* **editCard.json** - メッセージ拡張または Copilot 参照で最初に表示されるカード
* **successCard.json** - ユーザー操作成功時に表示
* **errorCard.json** - 操作失敗時に表示

edit カードを Adaptive Card Designer で見てみましょう。ブラウザーで [https://adaptivecards.io](https://adaptivecards.io) を開き、上部の「Designer」をクリックします。

![image](../../assets/images/extend-message-ext-01/05-01-AdaptiveCardDesigner-01.png)

`"text": "📦 ${productName}"` のようなデータバインディング式に注目してください。これはデータの `productName` プロパティをカード上のテキストにバインドします。

ホストアプリケーションに「Microsoft Teams」 1️⃣ を選択し、Card Payload Editor 2️⃣ に **editCard.json** の内容、Sample Data Editor 3️⃣ に **sampleData.json** の内容を貼り付けます。

![image](../../assets/images/extend-message-ext-01/05-01-AdaptiveCardDesigner-02.png)

カードがレンダリングされますが、デザイナーが一部フォーマットを表示できず小さなエラーが出る場合があります。

ページ上部で Theme や Emulated Device を変更し、ダークテーマやモバイルでの表示を確認してみてください。

Visual Studio Code に戻り **cardHandler.ts** を開きます。`getEditCard()` 関数は各メッセージ拡張コマンドから呼び出され、結果カードを取得します。テンプレートとしてアダプティブカード JSON を読み込み、製品データにバインドし、`CardFactory` でレンダリング用のアダプティブカード オブジェクトに変換します。

~~~typescript
function getEditCard(product: ProductEx): any {
...
}
~~~

さらに下へスクロールすると、カード上の各アクションボタンのハンドラーが見つかります。カードはクリック時に `data.txtStock` と `data.productId` を送信し、どの製品を更新するかを示します。

~~~typescript
async function handleTeamsCardActionUpdateStock(context: TurnContext) {
...
}
~~~

コードはこれらの値を取得し、データベースを更新して新しいカードを返します。

## Exercise 2 - メッセージ拡張としてサンプルを実行

### Step 1 - プロジェクトの初期設定

Visual Studio Code で作業フォルダーを開きます。すでに開いている場合はそのまま進めてください。

Agents Toolkit は環境変数を **env** フォルダーに保存し、初回起動時に自動で値を設定します。ただしサンプル固有の値が 1 つあります。それは Northwind データベースへの接続文字列です。

本プロジェクトでは Northwind データベースを Azure Table Storage に保存し、ローカルデバッグ時には [Azurite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite?tabs=visual-studio) エミュレーターを使用します。プロジェクトをビルドするには接続文字列が必要です。

必要な設定は **env/.env.local.user.sample** にあります。このファイルを **env** フォルダー内でコピーして **.env.local.user** という名前に変更してください。

わからない場合は以下の手順を参照してください。**env** フォルダーを展開し **.env.local.user.sample** を右クリック → Copy。次に **env** フォルダー内で右クリック → Paste。新しいファイル **.env.local.user copy.sample** が作成されます。右クリック → Rename で **.env.local.user** に変更します。

![Copy .env.local.user.sample to .env.local.user](../../assets/images/extend-message-ext-01/02-01-Setup-Project-01.png)

作成された **.env.local.user** には次の行が含まれます。

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

(ローカル開発用なので秘密ではありませんが、Azure にデプロイする場合はシークレットになる可能性があります)

### Step 2 - アプリケーションをローカル実行

F5 キー、または 1️⃣ の再生ボタンをクリックしてデバッグを開始します。デバッグプロファイルの選択が求められたら、Debug in Teams (Edge) 2️⃣ などを選択します。

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

もし次の画面が表示されたら **env/.env.local.user** を修正する必要があります。

![Error is displayed because of a missing environment variable](../../assets/images/extend-message-ext-01/02-01-Setup-Project-06.png)

初回実行時は NodeJS のファイアウォール通過を許可するよう求められる場合があります。

npm パッケージの読み込みに時間がかかることがありますが、最終的にブラウザーが開きログインを求められます。

Teams がブラウザーで開き、Agents Toolkit と同じ資格情報でログインしてください。
Teams が起動するとアプリケーションを開くダイアログが表示されます。

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

開く場所を尋ねられます。既定ではパーソナルチャットですが、チャネルやグループチャットも選択可能です。「Open」を選択してください。

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

これでアプリとのパーソナルチャットが開始されます。


### Step 3 - Microsoft Teams でテスト

Teams でアプリをテストするには、チャットのメッセージ作成エリアの「+」を選択し、「+ Get more apps」をクリックします。検索ダイアログで背景が青い「Northwind Inventory」アプリを選択します。以下の手順を参照してください。

![select app](../../assets/images/extend-message-ext-01/choose-app.gif)

アプリを開くと、既定タブ「Products Inventory」に検索ボックスが表示され、「Discount」検索タブはグレーで非活性です。
Northwind データベースに存在する製品名「Chai」と入力し、項目が表示されることを確認します。

![search app](../../assets/images/extend-message-ext-01/nw-me-working.png)

カードを選択して会話に送信できます。 

また、アダプティブカード上のボタン操作も以下のようにテストできます。 

![search app](../../assets/images/extend-message-ext-01/action-working.gif)


これでメッセージ拡張が正常に動作し、次のラボでプラグインとして使用する準備ができたことが確認できます。


> NOTE: これは他の ユーザー との会話でこそ有用です。Northwind Inventory アプリ内のチャットはテスト用です。


### Step 4 - 高度なクエリ 

Visual Studio Code に戻り **appPackage** ディレクトリの **manifest.json** を開きます。インストール時に表示されたアプリ情報がすべて記載されています。

少し下にスクロールして `composeExtensions:` を確認してください。
compose extensions はメッセージ拡張の旧称で、Northwind Inventory のメッセージ拡張がここに定義されています。

わかりやすいように JSON を抜粋します。

~~~json
"composeExtensions": [
    {
        "botId": "${{BOT_ID}}",
        "commands": [
...
        ]
    }
],
~~~

最初に bot ID があることに注目してください。Teams は Azure bot チャネルを使用してアプリと安全・リアルタイムにメッセージを交換します。Agents Toolkit が bot を登録し ID を設定します。

次にコマンドのコレクションがあります。これは Teams の検索ダイアログのタブに対応します。本アプリではコマンドは主に Copilot 向けです。

最初のコマンドでは製品名で検索しました。次のコマンドも試してみましょう。

「Discounts」タブに `Beverages`, `Dairy`, `Produce` などを入力すると、該当カテゴリーで割引中の製品が表示されます。Copilot はこれを使用して割引製品に関する質問に回答します。

![Searching for beverages under the discount tab](../../assets/images/extend-message-ext-01/02-03-Test-Multi-02.png)

最初のコマンドを再度見ると、5 つのパラメーターがあることがわかります。

~~~json
"parameters": [
    ...
]
~~~

残念ながら Teams では最初のパラメーターしか表示できませんが、Copilot は 5 つすべてを使用できます。これで Northwind 在庫データに対しより高度なクエリが可能になります。

Teams UI の制限を回避するため、「Northwind Inventory」タブでは最大 5 つのパラメーターをカンマ区切りで入力できます。形式は以下のとおりです。

~~~text
name,category,inventoryStatus,supplierCity,supplierName
~~~

![Entering multiple comma separated fields into the Northwind Inventory tab](../../assets/images/extend-message-ext-01/02-03-Test-Multi-04.png)

JSON の説明を参考に次のクエリを入力してみてください。実行時には Visual Studio Code のデバッグコンソールに各クエリが表示されます。

* `chai` - 名前が「chai」で始まる製品を検索
* `c,bev` - カテゴリーが「bev」で始まり名前が「c」で始まる製品
* `,,out` - 在庫切れの製品
* `,,on,london` - ロンドンのサプライヤーで発注中の製品
* `tofu,produce,,osaka` - カテゴリーが「produce」で大阪のサプライヤーかつ名前が「tofu」で始まる製品

各クエリ用語が製品リストをフィルタリングします。クエリ用語の形式は任意ですが、各パラメーターの description で Copilot に説明するようにしてください。


### Step 6 (任意) - Azure Storage Explorer で Northwind データベースを表示

Northwind データベースはシンプルですが実データです。データを確認・編集したい場合は Azurite が実行中に Azure Storage Explorer を開いてください。 

!!! Note
    アプリを実行すると Azurite が自動的に起動します。詳細は [Azurite のドキュメント](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank} を参照してください。プロジェクトが正常に起動していればストレージを閲覧できます。

「Emulator & Attached」→「Storage Accounts」→「Emulator - Default Ports」→「Tables」を展開すると、Northwind データベースのテーブルが表示されます。

![Azure Storage Explorer showing the Northwind database tables](../../assets/images/extend-message-ext-01/02-06-AzureStorageExplorer-01.png)

コードは各クエリで Products テーブルを読み込みますが、他のテーブルはアプリ起動時のみアクセスします。新しいカテゴリーを追加した場合はアプリを再起動してください。

<cc-next />

## おめでとうございます

Northwind メッセージ拡張の実行をマスターしました。次のラボでは Microsoft 365 Copilot のプラグインとしてテストします。「Next」を選択してください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/01-nw-teams-app--ja" />