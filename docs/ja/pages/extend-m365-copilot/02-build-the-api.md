---
search:
  exclude: true
---
# ラボ E2 - API の構築

このラボでは、 Azure Functions に基づく API をセットアップし、 Microsoft 365 Copilot の API プラグインとしてインストールします。
<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/XO2aG3YPbPc" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を把握しましょう。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## 紹介

このラボでは、架空のコンサルティング会社 Trey Research のための REST API をセットアップします。この API は、コンサルタントに関する情報にアクセスするための `/api/consultants` パスと、現在の ユーザー に関する情報にアクセスするための `/api/me` パス を提供します。現時点では API は認証をサポートしていないため、現在の ユーザー は常に "Avery Howard" となります。[ラボ E6](./06-add-authentication.md) では、認証とログインした ユーザー へアクセスする機能を追加します。

コードは TypeScript で記述された Azure Functions で構成され、 Azure Table storage のデータベースによって支えられています。アプリをローカルで実行する場合、テーブルストレージは Azurite ストレージ エミュレーター によって提供されます。

???+ Question "How did you create this API?"
    このプロジェクトは Agents Toolkit を使用して作成されました。VS Code で空のフォルダーを開き、 Agents Toolkit を起動して新しいアプリプロジェクトを作成し、「エージェント」、「宣言型エージェント」、および「プラグインを追加」を順に選択することで、同じスキャフォールディングを自分のプロジェクトに作成できます。

## 演習 1：初期アプリケーションの構成と実行

### ステップ 1：追加の前提条件のインストール

このラボでは、いくつかの追加の前提条件が必要です。今すぐインストールしてください。

* [Azure functions core tool](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-csharp#install-the-azure-functions-core-tools){target=_blank} 
* [REST Client add-in for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=humao.rest-client){target=_blank}：これらのツールキットのいずれかを使用してローカルで API をテストします
* （オプション）[Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank}：これを使用すると、 Trey Research のデータベースを閲覧および変更できます

<cc-end-step lab="e2" exercise="1" step="1" />

### ステップ 2：初期アプリケーションのダウンロード

まず、[https://github.com/microsoft/copilot-camp](https://github.com/microsoft/copilot-camp){target=_blank} から Copilot Developer Camp リポジトリをダウンロードします。「Code」ボタンを選択し、コンテンツをクローンまたはダウンロードしてください。

リポジトリ内の **/src/extend-m365-copilot/path-e-lab02-build-api/trey-research** に初期コードが配置されています。
このフォルダーを、作業を行いたいコンピューター上の任意の場所にコピーしてください。以降、このフォルダーを「作業フォルダー」として参照します。

!!! note
    次のいくつかのラボはこのラボを基に構築されるため、ラボ E2～E6 では同じフォルダー内で作業を続けられます。このラボの完了時点では Github 上で表示されるファイルは変更されていないため、フォルダー **/src/extend-m365-copilot/path-e-lab02-build-api/trey-research** はラボの開始時と終了時で同一です。

<cc-end-step lab="e2" exercise="1" step="2" />

### ステップ 3：ローカル環境ファイルのセットアップ

作業フォルダーを Visual Studio Code で開いてください。フォルダー内のファイル作成者を信頼するか尋ねるポップアップが表示された場合は、「Yes, I trust the authors」を選択してください。**/env/.env.local.user.sample** ファイルを **/env/.env.local.user** にコピーします。もし **env.local.user** が既に存在する場合は、以下の行が含まれていることを確認してください：

~~~text
SECRET_STORAGE_ACCOUNT_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

<cc-end-step lab="e2" exercise="1" step="3" />

### ステップ 4：依存関係のインストール

作業フォルダーでコマンドラインを開き、以下を入力してください：

~~~sh
npm install
~~~

<cc-end-step lab="e2" exercise="1" step="4" />

### ステップ 5：アプリケーションの実行

Visual Studio Code の左サイドバーから Microsoft 365 Agents Toolkit のロゴをクリックして Agents Toolkit を開いてください。Microsoft 365 にログインしており、Custom App Uploads と Copilot Access Enabled のインジケーターが緑色のチェックマークになっていることを確認してください。

![Visual Studio Code with the Agents Toolkit enabled and the accounts section with green checkmarks.](../../assets/images/extend-m365-copilot-02/atk-accounts-logged.png)

次に、F5 キーを押して Microsoft Edge でデバッグするか、または「local」環境上にカーソルを合わせ、表示されるデバッガーシンボル 1️⃣ をクリックし、希望のブラウザー 2️⃣ を選択してください。

![Visual Studio Code with the Agents Toolkit enabled, the debug mode active for local environment, and the option to start debugging in the Microsoft Edge browser.](../../assets/images/extend-m365-copilot-02/atk-debug.png)

最終的にブラウザーが開きます（初回以降は高速です）。次のラボで Copilot を使用してログインしますが、当面はブラウザーを最小化してアプリを実行し続け、API のテストに進みます。

![The debug session in the browser, with suggestion to minimize the browser window.](../../assets/images/extend-m365-copilot-02/run-in-ttk03.png)

<cc-end-step lab="e2" exercise="1" step="5" />

## 演習 2：アプリの web サービスのテスト

Trey Research プロジェクトは API プラグインであるため、当然 API が含まれています。この演習では、API を手動でテストし、その機能を理解します。

### ステップ 1：/me リソースの GET

デバッガーが実行中の状態で 1️⃣、Visual Studio Code のコードビューに切り替え、2️⃣、**http** フォルダーを開いて **treyResearchAPI.http** ファイルを選択してください。3️⃣

続行する前に、4️⃣「Debug console」タブを開いてログファイルを表示し、「Attach to Backend」と名付けられたコンソールが選択されていることを確認してください。5️⃣

次に、6️⃣ **treyResearchAAPI.http** 内で `{{base_url}}/me` のリンクのすぐ上にある「Send Request」リンクをクリックしてください。

![Visual Studio Code with the output of the request triggered in the treyResearchAPI.http file.](../../assets/images/extend-m365-copilot-02/run-in-ttk05.png)

右側のパネルにレスポンスが表示され、下部パネルにリクエストのログが記録されます。レスポンスにはログイン中の ユーザー に関する情報が表示されますが、現時点では認証が実装されていないため（ラボ 6 で追加予定）、アプリは架空のコンサルタント "Avery Howard" の情報を返します。レスポンスをスクロールして、 Avery の詳細情報やプロジェクト割り当ての一覧を確認してください。

<cc-end-step lab="e2" exercise="2" step="1" />

### ステップ 2：他のメソッドおよびリソースの試行

次に、 `{{base_url}}/me/chargeTime` に対して POST リクエストを送信してみてください。これにより、 Avery の作業時間 3 時間が Woodgrove Bank プロジェクトにチャージされます。これは、ローカルでホストされている Azure Table Storage のエミュレーションであるプロジェクト データベースに保存されるため、システムは Avery がこれらの時間を実行したことを記憶します。（確認するために、再度 `/me` リソースを呼び出し、Woodgrove プロジェクトの `"deliveredThisMonth"` プロパティを確認してください。）

.http ファイル内の他の様々な GET リクエストも試し、さまざまなスキル、認証、役割、可用性を持つコンサルタントを検索してください。これらすべての情報は Copilot が ユーザー からのプロンプトに回答する際に利用されます。

<cc-end-step lab="e2" exercise="2" step="2" />

### ステップ 3：データベースの確認（オプション）

[Azure Storage Explorer](https://azure.microsoft.com/products/storage/storage-explorer){target=_blank} をインストールしている場合、アプリケーションのデータを確認および変更できます。データは Azure Table Storage に保存されており、ここでは Azurite エミュレーターを使用してローカルで実行されています。

!!! note
    前の演習で `npm install` を実行した際に Azurite エミュレーターがインストールされました。詳細は [Azurite documention here](https://learn.microsoft.com/azure/storage/common/storage-use-azurite){target=_blank} をご確認ください。プロジェクトを開始すると Azurite は自動的に起動します。したがって、プロジェクトが正常に開始されていればストレージを閲覧できます。

Azure Storage Explorer 内で、「Emulator & Attached」 を開き、「(Emulator: Default Ports)」 コレクションを選択し、「Tables」 までドリルダウンしてください。3 つのテーブルが表示されるはずです：

  * **Consultant:** このテーブルには Trey Research のコンサルタントに関する詳細情報が保存されています。
  * **Project:** このテーブルには Trey Research のプロジェクトの詳細情報が保存されています。
  * **Assignment:** このテーブルにはコンサルタントのプロジェクトへのアサイン情報が保存されています。例えば、 Avery Howard の Woodgrove Bank プロジェクトへのアサインなどです。このテーブルには、該当コンサルタントがプロジェクトにおいて実行した時間の JSON 表現を含む "delivered" フィールドが含まれています。

![The UI of the Azure Storage Explorer while browsing the local storage tables for Consultant, Project, and Assignment.](../../assets/images/extend-m365-copilot-02/azure-storage-explorer01.png)

<cc-end-step lab="e2" exercise="2" step="3" />

---8<--- "ja/e-congratulations.md"

ラボサンプル API の構築に成功しました！これで、API を Copilot プラグインに変換し、宣言型エージェントを通じて公開することができます。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/02-build-the-api" />