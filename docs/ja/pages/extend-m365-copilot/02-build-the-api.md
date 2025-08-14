---
search:
  exclude: true
---
# ラボ E2 - API の構築

このラボでは、 Azure Functions をベースにした API を構築し、 Microsoft 365 Copilot 用の API プラグインとしてインストールします。
<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/XO2aG3YPbPc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## はじめに

このラボでは、仮想のコンサルティング会社 Trey Research 用に REST API をセットアップします。この API では、コンサルタントに関する情報を取得する `/api/consultants` パスと、現在の ユーザー に関する情報を取得する `/api/me` パスを提供します。現時点では認証をサポートしていないため、現在の ユーザー は常に “Avery Howard” になります。認証とログイン ユーザー へのアクセス機能は、 [ラボ E6](./06-add-authentication.md) で追加します。

コードは TypeScript で記述された Azure Functions で構成され、バックエンドには Azure Table Storage のデータベースを使用しています。ローカルでアプリを実行する際は、 Azurite ストレージ エミュレーターが Table Storage を提供します。

???+ Question "この API はどのように作成したのですか？"
    プロジェクトは Agents Toolkit を使用して作成しました。 VS Code で空のフォルダーを開き、 Agents Toolkit から同じスキャフォールディングを作成できます。新しいアプリ プロジェクトを作成し、「エージェント」→「宣言型エージェント」→「プラグインを追加」を選択してください。

## 演習 1: スタート アプリケーションの構成と実行

### 手順 1: 追加の前提条件をインストールする

このラボでは、いくつかの追加前提条件が必要です。以下をインストールしてください。

* [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-csharp#install-the-azure-functions-core-tools){target=_blank}  
* [Visual Studio Code 用 REST Client アドイン](https://marketplace.visualstudio.com/items?itemName=humao.rest-client){target=_blank}: ローカルで API をテストする際に使用します  
* (任意) [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank}: Trey Research のデータベースを表示および編集できます  

<cc-end-step lab="e2" exercise="1" step="1" />

### 手順 2: スタート アプリケーションをダウンロードする

ベース プロジェクトのソース コード ZIP ファイルを [こちらのリンク]
(https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab02-build-api/trey-research&filename=path-e-lab02-build-api) からダウンロードします。

`path-e-lab02-build-api` フォルダーを解凍し、ご自身の作業場所にコピーしてください。以降、このフォルダーを「作業フォルダー」と呼びます。

!!! note
    次の複数のラボは本ラボの内容を基に進みます。ラボ E2〜E6 までは同じフォルダーで作業を続けられます。このラボの完了時点では GitHub 上のファイルは変更されないため、 **/src/extend-m365-copilot/path-e-lab02-build-api/trey-research** フォルダーはラボ開始時と終了時で同一です。

<cc-end-step lab="e2" exercise="1" step="2" />

### 手順 3: ローカル環境ファイルを設定する

作業フォルダーを Visual Studio Code で開きます。フォルダーの内容を信頼するかどうかを尋ねるダイアログが表示された場合は、「Yes, I trust the authors」を選択してください。 **/env/.env.local.user.sample** ファイルを **/env/.env.local.user** にコピーします。すでに **env.local.user** が存在する場合は、次の行が含まれていることを確認してください。

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

<cc-end-step lab="e2" exercise="1" step="3" />

### 手順 4: 依存関係をインストールする

作業フォルダーでコマンド ラインを開き、次のコマンドを実行します。

~~~sh
npm install
~~~

<cc-end-step lab="e2" exercise="1" step="4" />

### 手順 5: アプリケーションを実行する

Visual Studio Code の左サイドバーで Microsoft 365 Agents Toolkit のロゴをクリックして Agents Toolkit を開きます。 Microsoft 365 にログインし、 Custom App Uploads と Copilot Access Enabled のインジケーターがどちらも緑のチェックマークであることを確認します。

![Visual Studio Code with the Agents Toolkit enabled and the accounts section with green checkmarks.](../../assets/images/extend-m365-copilot-02/atk-accounts-logged.png)

これで F5 を押して Microsoft Edge でデバッグを開始できます。または「local」環境にカーソルを合わせて表示されるデバッガーアイコン 1️⃣ をクリックし、好みのブラウザーを選択 2️⃣ しても構いません。

![Visual Studio Code with the Agents Toolkit enabled, the debug mode active for local environment, and the option to start debugging in the Microsoft Edge browser.](../../assets/images/extend-m365-copilot-02/atk-debug.png)

しばらくするとブラウザーが起動します（2 回目以降は高速です）。次のラボで Copilot と共にログインしてテストしますが、今はブラウザーを最小化し、アプリを実行したまま API のテストを進めます。

![The debug session in the browser, with suggestion to minimize the browser window.](../../assets/images/extend-m365-copilot-02/run-in-ttk03.png)

<cc-end-step lab="e2" exercise="1" step="5" />

## 演習 2: アプリの Web サービスをテストする

Trey Research プロジェクトは API プラグインであるため、当然 API を含んでいます。この演習では、 API を手動でテストし、その機能を確認します。 

### 手順 1: `/me` リソースを GET する

デバッガーが実行中のまま 1️⃣、 Visual Studio Code のコード ビューに切り替え 2️⃣、 **http** フォルダーを開いて **treyResearchAPI.http** ファイルを選択 3️⃣ します。

続いて「Debug console」タブを開き 4️⃣、「Attach to Backend」コンソールが選択されていることを確認 5️⃣ して、ログ ファイルが表示されるようにします。

次に **treyResearchAPI.http** 内の `{{base_url}}/me` のすぐ上にある「Send Request」リンクをクリック 6️⃣ してください。

![Visual Studio Code with the sample treyResearchAPI.http file open and the shortcut to send a sample HTTP request while in debug mode.](../../assets/images/extend-m365-copilot-02/run-in-ttk04.png)

右側のパネルにレスポンスが表示され、下部パネルにはリクエストのログが表示されます。レスポンスにはログイン ユーザー の情報が示されますが、まだ認証を実装していないため（ラボ 6 で実装予定）、架空のコンサルタント “Avery Howard” の情報が返されます。レスポンスをスクロールし、 Avery の詳細やプロジェクト アサインメントの一覧を確認してください。

![Visual Studio Code with the output of the request triggered in the treyResearchAPI.http file.](../../assets/images/extend-m365-copilot-02/run-in-ttk05.png)

<cc-end-step lab="e2" exercise="2" step="1" />

### 手順 2: 他のメソッドとリソースを試す

次に `{{base_url}}/me/chargeTime` への POST リクエストを送信してください。これにより、 Woodgrove Bank プロジェクトに Avery の時間を 3 時間計上します。データはローカルでホストされている Azure Table Storage エミュレーションのプロジェクト データベースに保存されるため、システムはこの時間を記憶します。（確認するには、再度 `/me` リソースを呼び出し、 Woodgrove プロジェクトの `"deliveredThisMonth"` プロパティを確認してください）。

続けて .http ファイル内のさまざまな GET リクエストを試し、スキル、認定資格、ロール、空き状況でコンサルタントを検索してみてください。これらの情報はすべて Copilot が ユーザー のプロンプトに回答する際に利用できます。

<cc-end-step lab="e2" exercise="2" step="2" />

### 手順 3: データベースを確認する (任意)

[Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank} をインストールしている場合、アプリのデータを確認および編集できます。データは Azure Table Storage に保存されていますが、今回は Azurite エミュレーターを使用してローカルで実行しています。

!!! note
    前の演習で `npm install` を実行した際に Azurite ストレージ エミュレーターがインストールされました。詳細は [Azurite のドキュメント](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank} を参照してください。プロジェクトを起動すると Azurite も自動的に起動します。プロジェクトが正常に開始された状態であれば、ストレージを閲覧できます。

Azure Storage Explorer で「Emulator & Attached」を開き、「(Emulator: Default Ports)」コレクションを選択して「Tables」を展開してください。次の 3 つのテーブルが表示されます。

  * **Consultant:** Trey Research のコンサルタント情報を格納  
  * **Project:** Trey Research のプロジェクト情報を格納  
  * **Assignment:** コンサルタントとプロジェクトのアサインメントを格納。例として Avery Howard が Woodgrove Bank プロジェクトに割り当てられています。このテーブルには、そのコンサルタントがプロジェクトで累積して提供した時間を JSON 形式で保持する `delivered` フィールドがあります。  

![The UI of the Azure Storage Explorer while browsing the local storage tables for Consultant, Project, and Assignment.](../../assets/images/extend-m365-copilot-02/azure-storage-explorer01.png)

<cc-end-step lab="e2" exercise="2" step="3" />

---8<--- "ja/e-congratulations.md"

これでラボのサンプル API を構築できました。次はこれをプラグイン化し、宣言型 エージェント を通じて公開します。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/02-build-the-api--ja" />