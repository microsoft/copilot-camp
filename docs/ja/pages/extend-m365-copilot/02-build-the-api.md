---
search:
  exclude: true
---
# ラボ E2 - API の構築

このラボでは Azure Functions をベースとした API をセットアップし、Microsoft 365 Copilot の API プラグインとしてインストールします。
<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/XO2aG3YPbPc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を短時間で確認できます。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## 概要

このラボでは、架空のコンサルティング会社 Trey Research 用の REST API をセットアップします。  
コンサルタントに関する情報を取得する `/api/consultants` パスと、現在のユーザーに関する情報を取得する `/api/me` パスを提供します。  
現時点では認証をサポートしていないため、現在のユーザーは常に「Avery Howard」となります。認証とログインユーザーへのアクセス機能は [ラボ E6](./06a-add-authentication-ttk.md) で追加します。

コードは TypeScript で記述された Azure Functions で構成されており、バックエンドとして Azure Table Storage のデータベースを使用します。ローカル実行時には Azurite ストレージ エミュレーターが Table Storage を提供します。

???+ Question "How did you create this API?"
    このプロジェクトは Microsoft 365 エージェント Toolkit を使用して作成しました。VS Code で空のフォルダーを開き、Agents Toolkit を実行すると同じスキャフォールディングを生成できます。詳しくは [こちら](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/build-declarative-agents){target=_blank} をご覧ください。

## 演習 1: 初期アプリケーションの構成と実行

### ステップ 1: 追加前提条件のインストール

このラボでは追加で以下の前提条件が必要です。今すぐインストールしてください。

* [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-csharp#install-the-azure-functions-core-tools){target=_blank}  
* [Visual Studio Code 用 REST Client アドイン](https://marketplace.visualstudio.com/items?itemName=humao.rest-client){target=_blank}: これを使ってローカルで API をテストします  
* （任意）[Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank}: Trey Research データベースを閲覧・編集できます  

<cc-end-step lab="e2" exercise="1" step="1" />

### ステップ 2: 初期アプリケーションのダウンロード

ベース プロジェクトのソースコード ZIP ファイルを [こちらのリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab02-build-api/trey-research&filename=path-e-lab02-build-api){target=_blank} からダウンロードします。

`path-e-lab02-build-api` フォルダーを解凍し、作業を行いたい場所にコピーしてください。以降、このフォルダーを「作業フォルダー」と呼びます。

!!! note
    今後のラボは本ラボの内容を基に進みます。ラボ E2～E6 では同じフォルダーを継続して利用できます。ラボ完了時点で GitHub 上のファイルには変更がないため、**/src/extend-m365-copilot/path-e-lab02-build-api/trey-research** フォルダーの内容はラボ開始前後で同一です。

<cc-end-step lab="e2" exercise="1" step="2" />

### ステップ 3: ローカル環境ファイルのセットアップ

作業フォルダーを Visual Studio Code で開きます。  
「このフォルダー内のファイルの作成者を信頼しますか?」というポップアップ ダイアログが表示された場合は、［はい、作者を信頼します］を選択してください。  

**/env/.env.local.user.sample** ファイルを **/env/.env.local.user** にコピーします。**env.local.user** がすでに存在する場合は、次の行が含まれていることを確認してください。

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

<cc-end-step lab="e2" exercise="1" step="3" />

### ステップ 4: 依存関係のインストール

作業フォルダーでコマンド ライン / VS Code ターミナルを開き、次のコマンドを実行します。

~~~sh
npm install
~~~

<cc-end-step lab="e2" exercise="1" step="4" />

### ステップ 5: アプリケーションの実行

Visual Studio Code の左サイドバーで Microsoft 365 エージェント Toolkit のロゴをクリックし、Agents Toolkit を開きます。Microsoft 365 にサインインしており、Custom App Uploads と Copilot Access Enabled の両インジケーターが緑色のチェックマークであることを確認してください。

> エージェントをアップロードしてテストするには、Microsoft 365 エージェント Toolkit へのサインインが必要です。  
プロジェクト ウィンドウ内で左側メニューから Microsoft 365 エージェント Toolkit アイコンを選択し、Accounts、Environment、Development などのセクションが表示されるアクティビティ バーを開きます。  
「Accounts」セクションで「Sign in to Microsoft 365」を選択すると、サインインまたは Microsoft 365 開発者サンドボックスの作成、もしくは Cancel を選択するダイアログが表示されます。「Sign in」を選択してください。  
サインインが完了したらブラウザーを閉じ、プロジェクト ウィンドウに戻ります。

![Visual Studio Code with the Agents Toolkit enabled and the accounts section with green checkmarks.](../../assets/images/extend-m365-copilot-02/atk-accounts-logged.png)

F5 キーを押すか、VS Code のメニューから **Run > Start Debugging** を選択して Microsoft Edge でデバッグを開始します。

または、「local」環境にカーソルを合わせて表示されるデバッガー アイコン 1️⃣ をクリックし、続いて希望するブラウザー 2️⃣ を選択しても構いません。

![Visual Studio Code with the Agents Toolkit enabled, the debug mode active for local environment, and the option to start debugging in the Microsoft Edge browser.](../../assets/images/extend-m365-copilot-02/atk-debug.png)

しばらくするとブラウザーが開きます（2 回目以降は高速です）。次のラボで Copilot とテストする際にログインしますが、今回はアプリを実行させたままブラウザーを最小化し、API のテストに進みます。

![The debug session in the browser, with suggestion to minimize the browser window.](../../assets/images/extend-m365-copilot-02/run-in-ttk03.png)

<cc-end-step lab="e2" exercise="1" step="5" />

## 演習 2: アプリの Web サービスをテストする

Trey Research プロジェクトは API プラグインですので、当然 API を含んでいます。この演習では API を手動でテストし、機能を理解します。

### ステップ 1: `/me` リソースを GET する

デバッガーを起動したまま 1️⃣、Visual Studio Code のコード ビューに切り替え 2️⃣、**http** フォルダーを開いて **treyResearchAPI.http** ファイルを選択します 3️⃣。

作業を進める前に、「Debug console」タブを開き 4️⃣、「Attach to Backend」というコンソールが選択されていることを確認します 5️⃣。

**treyResearchAPI.http** で `{{base_url}}/me` のすぐ上にある「Send Request」リンクをクリックします 6️⃣。

![Visual Studio Code with the sample treyResearchAPI.http file open and the shortcut to send a sample HTTP request while in debug mode.](../../assets/images/extend-m365-copilot-02/run-in-ttk04.png)

右側のパネルにレスポンスが表示され、下部パネルにリクエストのログが表示されます。レスポンスにはログイン ユーザーの情報が表示されますが、まだ認証を実装していないため（ラボ 6a で追加予定）、架空のコンサルタント「Avery Howard」の情報が返されます。  
レスポンスをスクロールして Avery の詳細を確認し、プロジェクト アサインメントの一覧も見てみましょう。

![Visual Studio Code with the output of the request triggered in the treyResearchAPI.http file.](../../assets/images/extend-m365-copilot-02/run-in-ttk05.png)

<cc-end-step lab="e2" exercise="2" step="1" />

### ステップ 2: 他のメソッドとリソースの試用

次に `{{base_url}}/me/chargeTime` への POST リクエストを送信してみましょう。これにより、Avery の時間を Woodgrove Bank プロジェクトに 3 時間分チャージします。  
これはプロジェクト データベース（ローカルでホストされている Azure Table Storage エミュレーション）に保存されるため、システムはこれらの時間を記憶します。確認するには `/me` リソースを再度呼び出し、Woodgrove プロジェクトの `"deliveredThisMonth"` プロパティを参照してください。

続いて .http ファイル内のさまざまな GET リクエストを試し、スキル、認定資格、ロール、空き状況などでコンサルタントを検索してみてください。これらの情報はすべてエージェントが利用でき、ユーザーのプロンプトに応答する際に使用されます。

テストが完了したら、VS Code メニュー **Run > Stop Debugging** でデバッガーを停止します。.http ファイル 1️⃣ とレスポンス ビュー 2️⃣ など、VS Code 内のウィンドウも閉じてください。

![Visual Studio Code close windows](../../assets/images/extend-m365-copilot-02/close-window.png)

<cc-end-step lab="e2" exercise="2" step="2" />

### ステップ 3: データベースの確認（任意）

[Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank} をインストール済みの場合、アプリケーションのデータを確認・編集できます。データは Azure Table Storage に保存されており、この例では Azurite エミュレーターでローカルに実行されています。

!!! note
    前の演習で `npm install` を実行した際、Azurite ストレージ エミュレーターもインストールされています。詳細は [Azurite のドキュメント](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank} を参照してください。プロジェクトを起動すると Azurite も自動的に起動します。プロジェクトが正常に起動していればストレージを閲覧できます。

Azure Storage Explorer で「Emulator & Attached」を開き、「(Emulator: Default Ports)」を選択後、「Tables」までドリルダウンします。次の 3 つのテーブルが表示されます。

  * **Consultant:** Trey Research のコンサルタント情報を格納  
  * **Project:** Trey Research のプロジェクト情報を格納  
  * **Assignment:** コンサルタントとプロジェクトのアサイン情報を格納。例として Avery Howard の Woodgrove Bank プロジェクトへのアサインが含まれます。`delivered` フィールドには、該当コンサルタントが時間を納品した履歴を JSON 形式で保持します。  

![The UI of the Azure Storage Explorer while browsing the local storage tables for Consultant, Project, and Assignment.](../../assets/images/extend-m365-copilot-02/azure-storage-explorer01.png)

<cc-end-step lab="e2" exercise="2" step="3" />

---8<--- "ja/e-congratulations.md"

ラボ サンプル API の構築に成功しました。次はこれをプラグイン化し、Declarative エージェント経由で公開しましょう。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/02-build-the-api--ja" />