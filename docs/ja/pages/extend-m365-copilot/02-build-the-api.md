---
search:
  exclude: true
---
# ラボ E2 - API の構築

このラボでは Azure Functions を基盤とした API を構築し、それを Microsoft 365 Copilot の API プラグインとしてインストールします。
<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/XO2aG3YPbPc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早く確認できます。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## 概要

このラボでは、架空のコンサルティング会社 Trey Research 向けに REST API を構築します。コンサルタント情報を取得する `/api/consultants` と、現在のユーザー情報を取得する `/api/me` の 2 つのエンドポイントを提供します。現時点では認証をサポートしていないため、常に「Avery Howard」が現在のユーザーとして返されます。[ラボ E6](./06-add-authentication.md) では認証を追加し、ログイン ユーザーを取得できるようにします。

コードは TypeScript で記述された Azure Functions で、バックエンドには Azure Table Storage を使用します。ローカルでアプリを実行するときは、Azurite ストレージ エミュレーターが Table Storage を提供します。

???+ Question "How did you create this API?"
    プロジェクトは Agents Toolkit で作成しました。VS Code で空のフォルダーを開き、Agents Toolkit から新しいアプリ プロジェクトを作成し、「Agent」→「Declarative Agent」→「Add plugin」を選択すると、同じスキャフォールディングを作成できます。

## 演習 1: 開始アプリケーションの構成と実行

### 手順 1: 追加の前提条件をインストールする

このラボでは追加で以下をインストールする必要があります。今すぐインストールしてください。

* [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-csharp#install-the-azure-functions-core-tools){target=_blank} 
* [Visual Studio Code 用 REST Client アドイン](https://marketplace.visualstudio.com/items?itemName=humao.rest-client){target=_blank}: これを使用してローカルで API をテストします
* （任意）[Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank}: Trey Research データベースの閲覧と変更が可能になります

<cc-end-step lab="e2" exercise="1" step="1" />

### 手順 2: 開始アプリケーションをダウンロードする

[このリンク]
(https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab02-build-api/trey-research&filename=path-e-lab02-build-api) からベース プロジェクトのソースコード ZIP ファイルをダウンロードします。

`path-e-lab02-build-api` フォルダーを解凍し、作業用に使用したい場所へコピーします。本資料では以降、このフォルダーを「作業フォルダー」と呼びます。

!!! note
    これ以降の複数のラボはこのラボを土台に進めます。ラボ E2 ～ E6 まで同じフォルダーで作業を続けられます。本ラボ完了時点では GitHub 上に見えるファイルは変更されないため、フォルダー **/src/extend-m365-copilot/path-e-lab02-build-api/trey-research** はラボの開始前と終了後で同一です。

<cc-end-step lab="e2" exercise="1" step="2" />

### 手順 3: ローカル環境ファイルを設定する

作業フォルダーを Visual Studio Code で開きます。フォルダー内のファイルの作成者を「信頼するか」を尋ねるポップアップが表示された場合は「はい、作成者を信頼します」を選択してください。 **/env/.env.local.user.sample** を **/env/.env.local.user** にコピーします。すでに **env.local.user** が存在する場合は、次の行が含まれていることを確認します。

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

<cc-end-step lab="e2" exercise="1" step="3" />

### 手順 4: 依存関係をインストールする

作業フォルダーでコマンド ラインを開き、次を実行します。

~~~sh
npm install
~~~

<cc-end-step lab="e2" exercise="1" step="4" />

### 手順 5: アプリケーションを実行する

Visual Studio Code の左サイドバーで Microsoft 365 Agents Toolkit のロゴをクリックして Agents Toolkit を開きます。Microsoft 365 にサインインし、Custom App Uploads と Copilot Access Enabled のいずれも緑色のチェックマークが付いていることを確認します。

![Agents Toolkit が有効化され、アカウント セクションに緑色のチェックマークが表示された Visual Studio Code。](../assets/images/extend-m365-copilot-02/atk-accounts-logged.png)

これで単純に  F5 で Microsoft Edge を使用してデバッグを開始できます。または「local」環境にカーソルを合わせて表示されるデバッガー アイコン 1️⃣ をクリックし、好みのブラウザーを選択 2️⃣ してもかまいません。

![Agents Toolkit が有効化され、ローカル環境でデバッグ モードがアクティブになり、Microsoft Edge でデバッグを開始できる Visual Studio Code。](../assets/images/extend-m365-copilot-02/atk-debug.png)

しばらくするとブラウザーが起動します（2 回目以降は高速です）。次のラボで Copilot とテストするためにサインインしますが、今はブラウザーを最小化してアプリを実行したままにし、API のテストを続けます。

![ブラウザーでのデバッグ セッション。ブラウザー ウィンドウを最小化することを推奨。](../assets/images/extend-m365-copilot-02/run-in-ttk03.png)

<cc-end-step lab="e2" exercise="1" step="5" />

## 演習 2: アプリの Web サービスをテストする

Trey Research プロジェクトは API プラグインであるため、当然ながら API が含まれています。この演習では API を手動でテストし、その機能を理解します。 

### 手順 1: `/me` リソースを GET する

デバッガーを実行したまま 1️⃣、Visual Studio Code のコード ビューに切り替え 2️⃣ ます。 **http** フォルダーを開き、 **treyResearchAPI.http** ファイルを選択 3️⃣ します。

続ける前に、「Debug console」タブ 4️⃣ を開き、コンソール「Attach to Backend」が選択されていることを確認 5️⃣ してログ ファイルを表示します。

次に **treyResearchAPI.http** 内の `{{base_url}}/me` 直前にある「Send Request」リンクをクリック 6️⃣ します。

![treyResearchAPI.http ファイルが開かれ、デバッグ モード中にサンプル HTTP リクエストを送信できるショートカットが表示された Visual Studio Code。](../assets/images/extend-m365-copilot-02/run-in-ttk04.png)

右ペインにレスポンスが、下ペインにリクエストのログが表示されます。レスポンスにはログイン ユーザーの情報が表示されますが、認証はまだ実装していない（ラボ 6 で実装）ため、架空のコンサルタント「Avery Howard」の情報が返されます。Avery の詳細情報やプロジェクト割り当ての一覧を確認してみてください。

![treyResearchAPI.http でトリガーしたリクエストの出力が表示されている Visual Studio Code。](../assets/images/extend-m365-copilot-02/run-in-ttk05.png)

<cc-end-step lab="e2" exercise="2" step="1" />

### 手順 2: 他のメソッドとリソースを試す

次に `{{base_url}}/me/chargeTime` への  POST リクエストを送信してみましょう。これにより、Woodgrove Bank プロジェクトに 3 時間分の Avery の時間がチャージされます。これはローカルでホストされている Azure Table Storage のエミュレーション環境に保存されるため、システムは Avery がこの時間を提供したことを記憶しています。（確認するには `/me` を再度呼び出し、Woodgrove プロジェクトの `"deliveredThisMonth"` プロパティを確認してください）。

続けて .http ファイル内の各種  GET リクエストを送信し、スキル、認定資格、ロール、空き状況などでコンサルタントを検索してみてください。これらの情報はすべて Copilot から参照でき、ユーザー プロンプトへの回答に利用されます。

<cc-end-step lab="e2" exercise="2" step="2" />

### 手順 3: データベースを確認する（任意）

[Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank} をインストールしている場合、アプリケーション データを閲覧・変更できます。データは Azure Table Storage に保存されており、このラボでは Azurite エミュレーターがローカルで実行されています。

!!! note
    前の演習で `npm install` を実行した際、Azurite ストレージ エミュレーターがインストールされました。詳細は [Azurite のドキュメント](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank} を参照してください。プロジェクトを開始すると Azurite も自動的に起動します。プロジェクトが正常に起動していればストレージを表示できます。

Azure Storage Explorer では「Emulator & Attached」を展開し、「(Emulator: Default Ports)」コレクションを選択して「Tables」を展開します。次の 3 つのテーブルが表示されるはずです。

  * **Consultant:** Trey Research のコンサルタント情報を保持
  * **Project:** Trey Research のプロジェクト情報を保持
  * **Assignment:** コンサルタントとプロジェクトの割り当てを保持。Avery Howard が Woodgrove Bank プロジェクトに割り当てられている情報などが含まれます。このテーブルには、コンサルタントが時間を提供した履歴を JSON 形式で保持する "delivered" フィールドがあります。

![Consultant、Project、Assignment の各テーブルをローカル ストレージで閲覧している Azure Storage Explorer の UI。](../assets/images/extend-m365-copilot-02/azure-storage-explorer01.png)

<cc-end-step lab="e2" exercise="2" step="3" />

---8<--- "ja/e-congratulations.md"

これでラボ サンプル API の構築に成功しました！この後はプラグイン化し、Declarative エージェント経由で公開していきます。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/02-build-the-api--ja" />