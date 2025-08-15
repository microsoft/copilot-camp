---
search:
  exclude: true
---
# ラボ E2 - API の構築

このラボでは Azure Functions をベースにした API をセットアップし、Microsoft 365 Copilot の API プラグインとしてインストールします。

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

## はじめに

このラボでは、架空のコンサルティング会社 Trey Research 向けに REST API を設定します。  
コンサルタントに関する情報へアクセスする `/api/consultants` と、現在のユーザー情報へアクセスする `/api/me` の 2 つの API を提供します。現時点では認証をサポートしていないため、現在のユーザーは常に「Avery Howard」となります。認証とログイン ユーザーの取得機能は [ラボ E6](./06-add-authentication.md) で追加します。

コードは TypeScript で記述された Azure Functions で構成され、バックエンドには Azure Table Storage を使用します。ローカルでアプリを実行するときは、Azurite ストレージ エミュレーターが Table Storage を提供します。

???+ Question "どのようにしてこの API を作成したのですか？"
    プロジェクトは Agents Toolkit を使用して作成しました。VS Code で空のフォルダーを開き、Agents Toolkit から「New app project」を選択し、「Agent」→「Declarative Agent」→「Add plugin」を順に選択すれば、同じスキャフォールディングを作成できます。

## Exercise 1: 開始アプリケーションの構成と実行

### Step 1: 追加の前提条件をインストールする

このラボでは追加の前提条件が必要です。以下をインストールしてください。

* [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-csharp#install-the-azure-functions-core-tools){target=_blank}  
* [Visual Studio Code 用 REST Client アドイン](https://marketplace.visualstudio.com/items?itemName=humao.rest-client){target=_blank}: これを使用してローカルで API をテストします  
* （任意）[Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank}: Trey Research のデータベースを閲覧・編集できます  

<cc-end-step lab="e2" exercise="1" step="1" />

### Step 2: 開始アプリケーションをダウンロードする

[このリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab02-build-api/trey-research&filename=path-e-lab02-build-api) からベース プロジェクトのソースコード ZIP ファイルをダウンロードします。

解凍後、`path-e-lab02-build-api` フォルダーを作業用の任意の場所にコピーしてください。以降、このフォルダーを「作業フォルダー」と呼びます。

!!! note
    この後の複数のラボは今回のラボを基盤に進めます。ラボ E2〜E6 まで同じフォルダーで作業できます。  
    このラボ終了時点では GitHub 上で確認できるファイルは変更されません。したがって **/src/extend-m365-copilot/path-e-lab02-build-api/trey-research** はラボの開始時と終了時で同一です。

<cc-end-step lab="e2" exercise="1" step="2" />

### Step 3: ローカル環境ファイルを設定する

作業フォルダーを Visual Studio Code で開きます。フォルダーの作成者を信頼するか尋ねるダイアログが表示された場合は「Yes, I trust the authors」を選択してください。  
**/env/.env.local.user.sample** を **/env/.env.local.user** にコピーします。すでに **env.local.user** が存在する場合は、以下の行が含まれていることを確認してください。

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

<cc-end-step lab="e2" exercise="1" step="3" />

### Step 4: 依存関係をインストールする

作業フォルダーでコマンド ラインを開き、次を実行します。

~~~sh
npm install
~~~

<cc-end-step lab="e2" exercise="1" step="4" />

### Step 5: アプリケーションを実行する

Visual Studio Code の左サイドバーで Microsoft 365 Agents Toolkit のロゴをクリックして Agents Toolkit を開きます。Microsoft 365 にサインインし、「Custom App Uploads」と「Copilot Access Enabled」がいずれも緑のチェックマークで表示されていることを確認してください。

![Visual Studio Code の Agents Toolkit が有効化され、アカウント セクションに緑のチェックマークが表示されている様子。](../../assets/images/extend-m365-copilot-02/atk-accounts-logged.png)

F5 キーを押して Microsoft Edge でデバッグを開始するか、「local」環境にマウスを合わせて表示されるデバッガー アイコン 1️⃣ をクリックし、ブラウザーを選択 2️⃣ してもかまいません。

![Visual Studio Code の Agents Toolkit でローカル環境のデバッグ モードを有効にし、Microsoft Edge でデバッグを開始するオプションが表示された様子。](../../assets/images/extend-m365-copilot-02/atk-debug.png)

しばらくするとブラウザーが開きます（2 回目以降は速くなります）。次のラボで Copilot からテストしますが、今はブラウザーを最小化してアプリを実行させたままにし、API のテストを行います。

![ブラウザーでデバッグ セッションが開始され、ウィンドウを最小化する提案が示されている様子。](../../assets/images/extend-m365-copilot-02/run-in-ttk03.png)

<cc-end-step lab="e2" exercise="1" step="5" />

## Exercise 2: アプリの Web サービスをテストする

Trey Research プロジェクトは API プラグインであるため、当然 API を含みます。この演習では API を手動でテストし、その機能を理解します。

### Step 1: /me リソースを GET する

デバッガーを実行したまま 1️⃣、Visual Studio Code のコード ビューに切り替え 2️⃣ ます。**http** フォルダーを開き、**treyResearchAPI.http** ファイルを選択 3️⃣ します。

続行する前に「Debug console」タブ 4️⃣ を開き、「Attach to Backend」コンソール 5️⃣ が選択されていることを確認して、ログ ファイルが表示されるようにしてください。

次に **treyResearchAPI.http** の `{{base_url}}/me` の上にある「Send Request」リンク 6️⃣ をクリックします。

![Visual Studio Code で treyResearchAPI.http ファイルを開き、デバッグ モードでサンプル HTTP リクエストを送信するショートカットを示す様子。](../../assets/images/extend-m365-copilot-02/run-in-ttk04.png)

右パネルにレスポンスが表示され、下部パネルにリクエストのログが表示されます。レスポンスにはログイン ユーザーの情報が表示されますが、まだ認証を実装していない（これはラボ 6 で実装）ため、架空のコンサルタント「Avery Howard」の情報が返されます。スクロールして Avery の詳細を確認してみてください。プロジェクト割り当てのリストも含まれています。

![Visual Studio Code で treyResearchAPI.http をトリガーした結果の出力を示す様子。](../../assets/images/extend-m365-copilot-02/run-in-ttk05.png)

<cc-end-step lab="e2" exercise="2" step="1" />

### Step 2: 他のメソッドとリソースを試す

次に `{{base_url}}/me/chargeTime` への POST リクエストを送信してみてください。これにより Avery の時間を 3 時間、Woodgrove Bank プロジェクトへ請求します。これはローカルにホストされた Azure Table Storage エミュレーションのプロジェクト データベースに保存されるため、システムは Avery がその時間を実際に提供したことを記憶します。（確認するには、もう一度 `/me` リソースを呼び出し、Woodgrove プロジェクトの `"deliveredThisMonth"` プロパティを確認してください。）

続けて .http ファイル内のさまざまな GET リクエストを試し、スキル、資格、ロール、空き時間別にコンサルタントを検索してみましょう。これらの情報はすべて Copilot からのユーザー プロンプトに応答するために利用できます。

<cc-end-step lab="e2" exercise="2" step="2" />

### Step 3: データベースを確認する（任意）

[Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank} をインストールしている場合、アプリケーション データを閲覧・編集できます。データは Azure Table Storage に保存されていますが、この場合は Azurite エミュレーターでローカルに実行されています。

!!! note
    前の演習で `npm install` を実行した際、Azurite ストレージ エミュレーターもインストールされました。詳細は [Azurite ドキュメント](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank} を参照してください。プロジェクトを開始すると Azurite も自動的に起動するので、プロジェクトが正常に起動していればストレージを閲覧できます。

Azure Storage Explorer で「Emulator & Attached」を開き、「(Emulator: Default Ports)」コレクションを選択して「Tables」に展開します。3 つのテーブルが表示されるはずです。

  * **Consultant:** Trey Research のコンサルタントの詳細を格納  
  * **Project:** Trey Research のプロジェクトの詳細を格納  
  * **Assignment:** コンサルタントのプロジェクト割り当て（例: Avery Howard の Woodgrove Bank プロジェクトへの割り当て）を格納。このテーブルには、コンサルタントが時間を提供した履歴を JSON 形式で保持する "delivered" フィールドがあります。  

![Azure Storage Explorer でローカル ストレージ テーブル Consultant、Project、Assignment を閲覧している様子。](../../assets/images/extend-m365-copilot-02/azure-storage-explorer01.png)

<cc-end-step lab="e2" exercise="2" step="3" />

---8<--- "ja/e-congratulations.md"

これでラボのサンプル API を構築できました。次はこれをプラグイン化し、Declarative エージェント経由で公開しましょう。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/02-build-the-api--ja" />