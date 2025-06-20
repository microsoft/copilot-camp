---
search:
  exclude: true
---
# Lab E2 - API を構築する

この lab では Azure Functions をベースとした API をセットアップし、Microsoft 365 Copilot の API プラグインとしてインストールします。  
<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/XO2aG3YPbPc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオで lab の概要を素早く把握できます。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## はじめに

この lab では Trey Research という架空のコンサルティング会社向けに REST API をセットアップします。コンサルタント情報にアクセスする `/api/consultants` と、現在のユーザー情報にアクセスする `/api/me` を提供します。現時点では認証をサポートしていないため、現在のユーザーは常に「Avery Howard」になります。認証およびログインユーザー取得機能は [Lab E6](./06-add-authentication.md) で追加します。

コードは TypeScript で記述された Azure Functions で構成され、バックエンドには Azure Table Storage のデータベースを使用します。ローカルでアプリを実行するときは、Azurite ストレージエミュレーターが Table Storage を提供します。

???+ Question "この API はどのように作成しましたか？"
    プロジェクトは Agents Toolkit を使用して作成しました。VS Code で空のフォルダーを開き、Agents Toolkit から新しいアプリ プロジェクトを作成して同じスキャフォールディングを得ることができます。「Agent」を選択し、続いて「Declarative Agent」→「Add plugin」を選びます。

## Exercise 1: スタートアプリを構成して実行する

### Step 1: 追加の前提条件をインストールする

この lab ではいくつか追加の前提条件が必要です。今すぐインストールしてください。

* [Azure Functions Core Tool](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-csharp#install-the-azure-functions-core-tools){target=_blank}  
* [Visual Studio Code 用 REST Client アドイン](https://marketplace.visualstudio.com/items?itemName=humao.rest-client){target=_blank}: これらのツールキットのいずれかを使用してローカルで API をテストします  
* (任意) [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank}: Trey Research のデータベースを表示・編集できます  

<cc-end-step lab="e2" exercise="1" step="1" />

### Step 2: スタートアプリをダウンロードする

[https://github.com/microsoft/copilot-camp](https://github.com/microsoft/copilot-camp){target=_blank} から Copilot Developer Camp リポジトリをダウンロードします。「Code」ボタンを選んで、クローンまたはダウンロードしてください。

リポジトリの **/src/extend-m365-copilot/path-e-lab02-build-api/trey-research** にスタートコードがあります。  
このフォルダーを作業したい場所にコピーしてください。今後、このフォルダーを「作業フォルダー」と呼びます。

!!! note
    これ以降の複数の lab はこの lab を基礎にしており、E2 〜 E6 まで同じフォルダーで作業を続けられます。今回の lab を完了しても Github 上で見えるファイルは変更されませんので、フォルダー **/src/extend-m365-copilot/path-e-lab02-build-api/trey-research** は lab の開始時と終了時で同じ状態です。

<cc-end-step lab="e2" exercise="1" step="2" />

### Step 3: ローカル環境ファイルをセットアップする

作業フォルダーを Visual Studio Code で開きます。「このフォルダーのファイルの作成者を信頼しますか？」というポップアップが表示された場合は、「はい、作成者を信頼します」を選択してください。**/env/.env.local.user.sample** を **/env/.env.local.user** にコピーします。すでに **env.local.user** がある場合は、次の行が含まれていることを確認してください。

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

<cc-end-step lab="e2" exercise="1" step="3" />

### Step 4: 依存関係をインストールする

作業フォルダーでコマンドラインを開き、次を実行します:

~~~sh
npm install
~~~

<cc-end-step lab="e2" exercise="1" step="4" />

### Step 5: アプリを実行する

Visual Studio Code の左サイドバーで Microsoft 365 Agents Toolkit のロゴをクリックし、Agents Toolkit を開きます。Microsoft 365 にログインし、「Custom App Uploads」と「Copilot Access Enabled」のインジケーターがどちらも緑のチェックマークであることを確認してください。

![Visual Studio Code with the Agents Toolkit enabled and the accounts section with green checkmarks.](../../assets/images/extend-m365-copilot-02/atk-accounts-logged.png)

その後、F5 キーを押して Microsoft Edge でデバッグを開始するか、「local」環境上にカーソルを合わせて表示されるデバッガーアイコン 1️⃣ をクリックし、任意のブラウザーを選択 2️⃣ します。

![Visual Studio Code with the Agents Toolkit enabled, the debug mode active for local environment, and the option to start debugging in the Microsoft Edge browser.](../../assets/images/extend-m365-copilot-02/atk-debug.png)

しばらくするとブラウザーが開きます（2 回目以降は高速です）。次の lab で Copilot と一緒にログインしますが、今はブラウザーを最小化してアプリを実行し続け、API のテストに進みましょう。

![The debug session in the browser, with suggestion to minimize the browser window.](../../assets/images/extend-m365-copilot-02/run-in-ttk03.png)

<cc-end-step lab="e2" exercise="1" step="5" />

## Exercise 2: アプリの Web サービスをテストする

Trey Research プロジェクトは API プラグインであるため、当然 API を含みます。この演習では API を手動でテストし、その機能を学びます。

### Step 1: `/me` リソースを GET する

デバッガーが動作したまま 1️⃣、Visual Studio Code のコードビューに切り替え 2️⃣、**http** フォルダーを開き **treyResearchAPI.http** ファイルを選択 3️⃣ します。

続けてログファイルが表示されていることを確認するため、「Debug console」タブ 4️⃣ を開き、コンソール「Attach to Backend」 が選択されていることを確認 5️⃣ してください。

次に **treyResearchAPI.http** の `{{base_url}}/me` の上にある「Send Request」をクリック 6️⃣ します。

![Visual Studio Code with the sample treyResearchAPI.http file open and the shortcut to send a sample HTTP request while in debug mode.](../../assets/images/extend-m365-copilot-02/run-in-ttk04.png)

右ペインにレスポンスが表示され、下ペインにリクエストのログが表示されます。レスポンスにはログインユーザーの情報が示されていますが、まだ認証を実装していないため（Lab 6 で追加します）、架空のコンサルタント「Avery Howard」の情報が返されます。レスポンスをスクロールして Avery の詳細やプロジェクト割り当ての一覧を確認してください。

![Visual Studio Code with the output of the request triggered in the treyResearchAPI.http file.](../../assets/images/extend-m365-copilot-02/run-in-ttk05.png)

<cc-end-step lab="e2" exercise="2" step="1" />

### Step 2: 他のメソッドとリソースを試す

次に、`{{base_url}}/me/chargeTime` への POST リクエストを送信してみましょう。これにより Woodgrove Bank プロジェクトに Avery の時間を 3 時間課金します。これはプロジェクトデータベース（ローカルでホストされた Azure Table Storage エミュレーション）に保存されるため、システムは Avery がこれらの時間を提供したことを記憶します。（確認するには `/me` リソースを再度呼び出し、Woodgrove プロジェクト下の `"deliveredThisMonth"` プロパティを確認してください）

続けて .http ファイル内の各種 GET リクエストを試し、スキル、認定資格、役割、空き状況でコンサルタントを検索してみてください。これらの情報はすべて Copilot がユーザープロンプトに回答する際に利用できます。

<cc-end-step lab="e2" exercise="2" step="2" />

### Step 3: データベースを確認する (任意)

[Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank} をインストール済みの場合、アプリケーションのデータを確認・編集できます。データは Azure Table Storage に保存され、この例では Azurite エミュレーターでローカル実行されています。

!!! note
    前の演習で `npm install` を実行した際に Azurite ストレージエミュレーターがインストールされました。詳しくは [Azurite のドキュメント](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank} を参照してください。プロジェクトを起動すると Azurite も自動的に起動します。プロジェクトが正常に開始されていればストレージを閲覧できます。

Azure Storage Explorer 内で「Emulator & Attached」を開き、「(Emulator: Default Ports)」コレクションを選択して「Tables」を展開します。次の 3 つのテーブルが表示されるはずです:

  * **Consultant:** Trey Research のコンサルタント詳細を格納します  
  * **Project:** Trey Research のプロジェクト詳細を格納します  
  * **Assignment:** コンサルタントのプロジェクト割当を格納します。例として、Avery Howard の Woodgrove Bank プロジェクトの割当があります。このテーブルには、コンサルタントがプロジェクトで提供した時間を時系列で表す JSON の `delivered` フィールドがあります。  

![The UI of the Azure Storage Explorer while browsing the local storage tables for Consultant, Project, and Assignment.](../../assets/images/extend-m365-copilot-02/azure-storage-explorer01.png)

<cc-end-step lab="e2" exercise="2" step="3" />

---8<--- "ja/e-congratulations.md"

lab サンプル API を構築できました！続いてこれを Copilot プラグインとして構成し、Declarative エージェント経由で公開しましょう。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/02-build-the-api" />