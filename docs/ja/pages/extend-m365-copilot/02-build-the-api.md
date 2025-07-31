---
search:
  exclude: true
---
# ラボ E2 - API の構築

このラボでは、 Azure Functions を基盤にした API を設定し、 Microsoft 365 Copilot の API プラグインとしてインストールします。  
<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/XO2aG3YPbPc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早くご覧ください。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## 概要

このラボでは、架空のコンサルティング会社である Trey Research 向けに REST API をセットアップします。 `/api/consultants` パスでコンサルタント情報、 `/api/me` パスで現在の ユーザー 情報を取得できます。現時点では認証をサポートしていないため、常に「Avery Howard」が現在の ユーザー として返されます。認証機能とログイン ユーザー へのアクセスは、 [ラボ E6](./06-add-authentication.md) で追加します。

コードは TypeScript で記述された Azure Functions で構成され、バックエンドには Azure Table Storage のデータベースがあります。ローカルでアプリを実行する際は、 Azurite ストレージエミュレーターが Table Storage を提供します。

???+ Question "How did you create this API?"
    プロジェクトは Agents Toolkit を使用して作成しました。 VS Code で空のフォルダーを開き、 Agents Toolkit から新しいアプリ プロジェクトを作成すると、同じスキャフォールディングを作成できます。 「Agent」を選択し、「Declarative Agent」と「Add plugin」を順に選択してください。

## 演習 1: 開始用アプリケーションの構成と実行

### ステップ 1: 追加の前提条件をインストールする

このラボでは、追加で以下の前提条件が必要です。今すぐインストールしてください。

* [Azure Functions Core Tool](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-csharp#install-the-azure-functions-core-tools){target=_blank} 
* [Visual Studio Code 用 REST Client アドイン](https://marketplace.visualstudio.com/items?itemName=humao.rest-client){target=_blank}: これを使用してローカルで API をテストします
* （任意） [Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank}: Trey Research データベースを表示・編集できます

<cc-end-step lab="e2" exercise="1" step="1" />

### ステップ 2: 開始用アプリケーションをダウンロードする

[https://github.com/microsoft/copilot-camp](https://github.com/microsoft/copilot-camp){target=_blank} から Copilot Developer Camp リポジトリをダウンロードします。「Code」ボタンを選択し、内容をクローンまたはダウンロードしてください。

リポジトリ内の **/src/extend-m365-copilot/path-e-lab02-build-api/trey-research** に開始用コードがあります。  
このフォルダーを作業したい場所にコピーしてください。以降、このフォルダーを「作業フォルダー」と呼びます。

!!! note
    以降の複数のラボは本ラボを基に進み、ラボ E2～E6 を同じフォルダーで継続できます。ラボ完了時点では GitHub に見えているファイルは変更されていないため、 **/src/extend-m365-copilot/path-e-lab02-build-api/trey-research** はラボの開始時と終了時で同一です。

<cc-end-step lab="e2" exercise="1" step="2" />

### ステップ 3: ローカル環境ファイルを設定する

作業フォルダーを Visual Studio Code で開きます。  
「このフォルダーのファイルの作成者を信頼しますか？」というダイアログが表示された場合は、「はい、作成者を信頼します」を選択してください。

**/env/.env.local.user.sample** を **/env/.env.local.user** にコピーします。  
すでに **env.local.user** が存在する場合は、次の行が含まれていることを確認してください:

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

<cc-end-step lab="e2" exercise="1" step="3" />

### ステップ 4: 依存関係をインストールする

作業フォルダーでコマンドラインを開き、次を実行します:

~~~sh
npm install
~~~

<cc-end-step lab="e2" exercise="1" step="4" />

### ステップ 5: アプリケーションを実行する

Visual Studio Code で左のサイドバーにある Microsoft 365 Agents Toolkit のロゴをクリックし、 Agents Toolkit を開きます。 Microsoft 365 にログインしていることを確認し、 Custom App Uploads と Copilot Access Enabled が緑のチェックマークになっていることを確認してください。

![Visual Studio Code で Agents Toolkit が有効化され、アカウントセクションが緑のチェックマークになっている様子。](../../assets/images/extend-m365-copilot-02/atk-accounts-logged.png)

あとは F5 キーを押して Microsoft Edge でデバッグするか、または「local」環境にカーソルを合わせて表示されるデバッグアイコン 1️⃣ をクリックし、お好みのブラウザーを選択 2️⃣ します。

![Visual Studio Code で Agents Toolkit が有効化され、ローカル環境でデバッグモードがアクティブになり、 Microsoft Edge でデバッグを開始するオプションが表示されている様子。](../../assets/images/extend-m365-copilot-02/atk-debug.png)

しばらくするとブラウザーが開きます（2 回目以降は高速です）。次のラボで Copilot とテストするためにログインしますが、今回はブラウザーを最小化してアプリを実行し続け、 API テストに進みましょう。

![ブラウザーでのデバッグセッションが表示され、ウィンドウを最小化する提案が示されている様子。](../../assets/images/extend-m365-copilot-02/run-in-ttk03.png)

<cc-end-step lab="e2" exercise="1" step="5" />

## 演習 2: アプリの Web サービスをテストする

Trey Research プロジェクトは API プラグインであり、当然ながら API を含んでいます。この演習では、 API を手動でテストし、その機能を理解します。 

### ステップ 1: /me リソースを GET する

デバッガーがまだ実行中 1️⃣ の状態で、 Visual Studio Code のコードビューに切り替え 2️⃣ ます。 **http** フォルダーを開き、 **treyResearchAPI.http** ファイルを選択 3️⃣ してください。

作業を進める前に、「Debug console」タブ 4️⃣ を開き、 「Attach to Backend」コンソールが選択されている 5️⃣ ことを確認して、ログファイルが表示されている状態にします。

次に **treyResearchAPI.http** 内の `{{base_url}}/me` の上にある「Send Request」リンクをクリック 6️⃣ します。

![Visual Studio Code で treyResearchAPI.http ファイルが開かれ、デバッグモードでサンプル HTTP リクエストを送信するショートカットが表示されている様子。](../../assets/images/extend-m365-copilot-02/run-in-ttk04.png)

右側のペインにレスポンスが表示され、下部のペインにはリクエストのログが表示されます。レスポンスにはログイン ユーザー に関する情報が表示されますが、まだ認証を実装していないため（ Lab 6 で追加予定）、架空のコンサルタント「Avery Howard」の情報が返されます。レスポンスをスクロールして、プロジェクトアサインメントのリストなど Avery の詳細を確認してください。

![treyResearchAPI.http ファイルでトリガーしたリクエストの出力が表示されている Visual Studio Code の様子。](../../assets/images/extend-m365-copilot-02/run-in-ttk05.png)

<cc-end-step lab="e2" exercise="2" step="1" />

### ステップ 2: 他のメソッドとリソースを試す

`{{base_url}}/me/chargeTime` への POST リクエストを送信してみましょう。これにより Avery の時間が Woodgrove Bank プロジェクトに 3 時間チャージされます。この情報はローカルにホストされた Azure Table Storage エミュレーションのプロジェクトデータベースに保存されるため、 Avery がこの時間を提供したことが記録されます。（確認するには、 `/me` リソースを再度呼び出し、 Woodgrove プロジェクトの `"deliveredThisMonth"` プロパティを確認してください）。

続けて .http ファイルのさまざまな GET リクエストを試し、スキル、認定、ロール、空き状況でコンサルタントを検索してみてください。これらすべての情報は Copilot から利用可能となり、 ユーザー のプロンプトに応じて回答できます。

<cc-end-step lab="e2" exercise="2" step="2" />

### ステップ 3: データベースを確認する（任意）

[Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank} をインストールしている場合、アプリケーションのデータを確認・編集できます。データは Azure Table Storage に保存されますが、今回は Azurite エミュレーターを使用してローカルで実行されています。

!!! note
    前の演習で `npm install` を実行した際に Azurite ストレージエミュレーターがインストールされています。詳細は [Azurite のドキュメント](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank} を参照してください。プロジェクトを起動すると Azurite も自動的に起動します。したがって、プロジェクトが正常に起動していればストレージを閲覧できます。

Azure Storage Explorer で「Emulator & Attached」を展開し、「(Emulator: Default Ports)」コレクションを選択して「Tables」までドリルダウンしてください。次の 3 つのテーブルが表示されます:

  * **Consultant:** Trey Research のコンサルタントの詳細を保存
  * **Project:** Trey Research のプロジェクトの詳細を保存
  * **Assignment:** コンサルタントとプロジェクトのアサインメントを保存。例として Avery Howard の Woodgrove Bank プロジェクトへのアサインメントなど。このテーブルには、コンサルタントが時間を報告した履歴を JSON で保持する "delivered" フィールドがあります。

![Azure Storage Explorer の UI で、 Consultant、 Project、 Assignment のローカルストレージテーブルを閲覧している様子。](../../assets/images/extend-m365-copilot-02/azure-storage-explorer01.png)

<cc-end-step lab="e2" exercise="2" step="3" />

---8<--- "ja/e-congratulations.md"

ラボ サンプル API を正常に構築できました！ 次はこれを Copilot プラグインとして公開し、 Declarative エージェント経由で利用できるようにします。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/02-build-the-api--ja" />