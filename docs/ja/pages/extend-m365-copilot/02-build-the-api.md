---
search:
  exclude: true
---
# ラボ E2 - API の構築

このラボでは Azure Functions を基盤とした API をセットアップし、それを Microsoft 365 Copilot の API プラグインとしてインストールします。
<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/XO2aG3YPbPc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を短時間で確認できます。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## はじめに

このラボでは、仮想のコンサルティング会社 Trey Research 用の REST API をセットアップします。API ではコンサルタント情報（パス `/api/consultants`）と現在のユーザー情報（パス `/api/me`）へアクセスできます。現時点では認証をサポートしていないため、現在のユーザーは常に «Avery Howard» になります。[Lab E6](./06-add-authentication.md) では認証を追加し、ログイン中のユーザーを取得できるようにします。

コードは TypeScript で記述された Azure Functions で構成され、Azure Table Storage のデータベースをバックエンドに使用します。ローカルでアプリを実行する際、Table Storage は Azurite ストレージエミュレーターによって提供されます。

???+ Question "How did you create this API?"
    このプロジェクトは Agents Toolkit を使用して作成しました。VS Code で空のフォルダーを開き Agents Toolkit を起動することで、同じスキャフォールディングを自分のプロジェクトでも作成できます。「Create a new app project」を選択し、「Agent」→「Declarative Agent」→「Add plugin」の順に選択してください。

## 演習 1: 開始アプリケーションの設定と実行

### 手順 1: 追加の前提条件をインストールする

このラボでは追加でいくつかの前提条件が必要です。以下をインストールしてください。

* [Azure Functions Core Tool](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-csharp#install-the-azure-functions-core-tools){target=_blank}  
* [REST Client アドイン (Visual Studio Code)](https://marketplace.visualstudio.com/items?itemName=humao.rest-client){target=_blank} : API をローカルでテストする際に使用します  
* (任意) [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank} : Trey Research データベースを閲覧・変更する際に使用します  

<cc-end-step lab="e2" exercise="1" step="1" />

### 手順 2: 開始アプリケーションをダウンロードする

[https://github.com/microsoft/copilot-camp](https://github.com/microsoft/copilot-camp){target=_blank} から Copilot Developer Camp リポジトリをダウンロードします。「Code」ボタンを選択し、クローンまたはダウンロードしてください。

開始コードは **/src/extend-m365-copilot/path-e-lab02-build-api/trey-research** にあります。これを作業用フォルダーとして任意の場所にコピーします。以降の手順ではこのフォルダーを「作業フォルダー」と呼びます。

!!! note
    次の複数のラボはこのラボを土台に進めますので、ラボ E2〜E6 を通じて同じフォルダーで作業を続けられます。このラボ完了時点では GitHub 上のファイルは変更されないため、**/src/extend-m365-copilot/path-e-lab02-build-api/trey-research** フォルダーの内容はラボの開始時と終了時で同一です。

<cc-end-step lab="e2" exercise="1" step="2" />

### 手順 3: ローカル環境ファイルをセットアップする

作業フォルダーを Visual Studio Code で開きます。フォルダーのファイルの作成者を信頼するか尋ねるポップアップが表示された場合は、「Yes, I trust the authors」を選択してください。**/env/.env.local.user.sample** を **/env/.env.local.user** にコピーします。**env.local.user** が既に存在する場合は、次の行が含まれていることを確認します。

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

<cc-end-step lab="e2" exercise="1" step="3" />

### 手順 4: 依存関係をインストールする

作業フォルダーでコマンドラインを開き、次を実行します。

~~~sh
npm install
~~~

<cc-end-step lab="e2" exercise="1" step="4" />

### 手順 5: アプリケーションを実行する

Visual Studio Code の左サイドバーで Microsoft 365 Agents Toolkit のロゴをクリックして Agents Toolkit を開きます。Microsoft 365 にサインインし、Custom App Uploads と Copilot Access Enabled のインジケーターがいずれも緑のチェックマークになっていることを確認してください。

![Visual Studio Code with the Agents Toolkit enabled and the accounts section with green checkmarks.](../../assets/images/extend-m365-copilot-02/atk-accounts-logged.png)

F5 キーを押して Microsoft Edge でデバッグするか、「local」環境にカーソルを合わせて表示されるデバッガーアイコン 1️⃣ をクリックし、ブラウザーを選択 2️⃣ します。

![Visual Studio Code with the Agents Toolkit enabled, the debug mode active for local environment, and the option to start debugging in the Microsoft Edge browser.](../../assets/images/extend-m365-copilot-02/atk-debug.png)

しばらくするとブラウザーが起動します（2 回目以降は高速になります）。次のラボで Copilot と共にログインしてテストしますが、今回はブラウザーを最小化してアプリを実行したままにし、API のテストに進みましょう。

![The debug session in the browser, with suggestion to minimize the browser window.](../../assets/images/extend-m365-copilot-02/run-in-ttk03.png)

<cc-end-step lab="e2" exercise="1" step="5" />

## 演習 2: アプリの Web サービスをテストする

Trey Research プロジェクトは API プラグインであり、当然 API を含んでいます。この演習では API を手動でテストし、その機能を把握します。

### 手順 1: `/me` リソースを GET する

デバッガーを実行したまま 1️⃣、Visual Studio Code のコードビューに切り替え 2️⃣、**http** フォルダーの **treyResearchAPI.http** ファイル 3️⃣ を開きます。

進む前に「Debug console」タブ 4️⃣ を開き、「Attach to Backend」コンソールが選択されている 5️⃣ ことを確認してログを表示させておきます。

次に **treyResearchAPI.http** の `{{base_url}}/me` 行の上にある「Send Request」リンク 6️⃣ をクリックします。

![Visual Studio Code with the sample treyResearchAPI.http file open and the shortcut to send a sample HTTP request while in debug mode.](../../assets/images/extend-m365-copilot-02/run-in-ttk04.png)

右ペインにレスポンスが、下ペインにリクエストのログが表示されます。認証はまだ実装していない（Lab 6 で追加予定）ため、アプリは架空のコンサルタント «Avery Howard» の情報を返します。レスポンスをスクロールし、Avery の詳細やプロジェクト割り当ての一覧を確認してください。

![Visual Studio Code with the output of the request triggered in the treyResearchAPI.http file.](../../assets/images/extend-m365-copilot-02/run-in-ttk05.png)

<cc-end-step lab="e2" exercise="2" step="1" />

### 手順 2: 他のメソッドとリソースを試す

続いて `{{base_url}}/me/chargeTime` の POST リクエストを送ってみましょう。これにより Avery の工数を Woodgrove Bank プロジェクトに 3 時間分チャージします。これはローカルの Azure Table Storage エミュレーションに保存されるため、システムは Avery がこれらの時間を提供したことを記憶します。（確認したい場合は `/me` リソースを再度呼び出し、Woodgrove プロジェクトの `"deliveredThisMonth"` プロパティを見てください）。

さらに .http ファイル内の各種 GET リクエストを試し、スキルや認定資格、役割、空き状況でコンサルタントを検索してみましょう。これら全ての情報は Copilot がユーザーのプロンプトに回答する際に使用できます。

<cc-end-step lab="e2" exercise="2" step="2" />

### 手順 3: データベースを確認する（任意）

[Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank} をインストール済みの場合、アプリケーションのデータを閲覧・変更できます。データは Azure Table Storage に保存されており、今回は Azurite エミュレーターでローカル実行されています。

!!! note
    前の演習で `npm install` を実行した際、Azurite ストレージエミュレーターもインストールされています。詳細は [Azurite ドキュメント](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank} を参照してください。プロジェクト起動時に Azurite も自動で起動するため、プロジェクトが正しく開始されていればストレージを確認できます。

Azure Storage Explorer で「Emulator & Attached」→「(Emulator: Default Ports)」→「Tables」の順に展開すると、次の 3 つのテーブルが表示されます。

* **Consultant:** Trey Research のコンサルタント情報  
* **Project:** Trey Research のプロジェクト情報  
* **Assignment:** コンサルタントとプロジェクトの割り当て情報（例: Avery Howard が Woodgrove Bank プロジェクトに割り当てられている）。このテーブルには、各コンサルタントがプロジェクトで消化した工数を時系列で保持する `"delivered"` フィールドが JSON 形式で保存されています。  

![The UI of the Azure Storage Explorer while browsing the local storage tables for Consultant, Project, and Assignment.](../../assets/images/extend-m365-copilot-02/azure-storage-explorer01.png)

<cc-end-step lab="e2" exercise="2" step="3" />

---8<--- "ja/e-congratulations.md"

ラボのサンプル API を構築できました！ 次はこれを Copilot プラグインにし、Declarative エージェント経由で公開していきましょう。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/02-build-the-api" />