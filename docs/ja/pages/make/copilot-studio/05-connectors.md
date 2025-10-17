---
search:
  exclude: true
---
# ラボ MCS5 - Power Platform カスタム コネクタ

このラボでは、Microsoft Copilot Studio で作成したエージェントを Power Platform のカスタム コネクタで拡張する方法を学習します。具体的には、架空の求人候補者リストを管理するカスタム REST API を利用します。この API では次の機能を提供しています。

- 候補者の一覧取得  
- 特定候補者の取得  
- 新しい候補者の追加  
- 候補者の削除  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/f_HrMbg6kOU" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご覧ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

Microsoft 365 Copilot の Copilot Studio では、これらの機能を活用して前回の [Lab MCS4](../04-extending-m365-copilot){target=_blank} で作成したカスタム エージェントの可能性を高めることができます。

!!! note
    このラボは前回の [Lab MCS4](../04-extending-m365-copilot){target=_blank} を基にしています。同じエージェントを引き続き使用し、新しい機能を追加して強化してください。

このラボで学習する内容:

- REST API を Power Platform カスタム コネクタとして公開する方法  
- Power Platform で外部 REST API との通信を保護する方法  
- カスタム コネクタをエージェントから利用する方法  

開始前に以下を準備してください。

- [Visual Studio Code](https://code.visualstudio.com/){target=_blank}  
- [REST Client 拡張機能 (VS Code)](https://marketplace.visualstudio.com/items?itemName=humao.rest-client){target=_blank}  
- [Node.js v.22 以降](https://nodejs.org/en){target=_blank}  
- [Dev tunnel](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank}  

## 演習 1 : REST API の作成

このラボでは簡略化のため、既成の REST API を使用します。この演習では API をダウンロードして構成し、ローカルで実行できるようにします。

### 手順 1: REST API のダウンロードとテスト

サンプル REST API は TypeScript と Node.js で構築された Azure Function で、名前は `HR Service` です。ソース コードは [こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/path-m-lab-mcs5-connectors/hr-service&filename=hr-service){target=_blank} からダウンロードできます。

ZIP を展開し、対象フォルダーを Visual Studio Code で開きます。以下のスクリーンショットはプロジェクト構成の概要です。

![Visual Studio Code で表示した HR Service プロジェクトの概要。http フォルダーに API テスト用 .http ファイル、src フォルダーにサンプル データと Azure Function 実装、Open API 仕様ファイルなどがある。](../../../assets/images/make/copilot-studio-05/custom-connector-01.png)

主な構成要素:

- `http`: REST API を VS Code でテストするための .http ファイルが入っています。  
- `src/data/candidates.json`: 初期データ ソースとして使用する候補者リストの JSON ファイル。  
- `src/functions/candidatesFunction.ts`: Azure Function 本体。  
- `src/openapi.json`: JSON 形式の Open API 仕様ファイル。  
- `src/openapi.yaml`: YAML 形式の Open API 仕様ファイル。  
- `askCandidateData.json`: 新規候補者登録用の Adaptive Card の JSON。  
- `dev-tunnel-steps.md`: Dev Tunnel を構築しローカル API をリバース プロキシする手順。  
- `local.settings.json.sample`: 後ほど使用するサンプル設定ファイル。  

`local.settings.json.sample` を `local.settings.json` にリネームし、F5 キーでプロジェクトを起動します。Visual Studio Code で `http/ht-service.http` を開き、`http://localhost:7071/api/candidates` への GET リクエスト横の **Send request** を選択して候補者リストを取得します。画面右側にレスポンス ヘッダーと JSON が表示されます。

![VS Code で HTTP リクエストを実行している様子。左に .http ファイル、右にレスポンス、下部ターミナルに OAuth 無効化メッセージが表示。](../../../assets/images/make/copilot-studio-05/custom-connector-02.png)

画面下部の **Terminal** には API コールのトレースと `OAuth is disabled. Skipping token validation` のメッセージが表示されます。現在 API は匿名でアクセス可能です。

<cc-end-step lab="mcs5" exercise="1" step="1" />

### 手順 2: API を Entra ID に登録

次に API へのアクセスを保護します。ブラウザーで [https://entra.microsoft.com](https://entra.microsoft.com){target=_blank} を開き、対象 Microsoft 365 テナントの職場アカウントでサインインします。  
1️⃣ 左メニューで **App registrations** を選び、2️⃣ **+ New registration** を選択して新しいアプリを登録します。

![Entra 管理センターで **App registrations** と **+ New registration** が強調表示。](../../../assets/images/make/copilot-studio-05/custom-connector-03.png)

`Register an application` ページでアプリ名に `HR-Service-API` などを入力し、シングル テナント認証を選択して **Register** を押します。

![新規アプリ登録ページ。アプリ名「HR-Service-API」、シングルテナント、**Register** ボタンが強調。](../../../assets/images/make/copilot-studio-05/custom-connector-04.png)

登録後、**Overview** ページに Client ID と Tenant ID が表示されるので控えておきます。

左メニューで 1️⃣ **Expose an API** を選択し、2️⃣ **+ Add a scope** をクリックします。初回は **Application ID URI** の設定が必要です。既定値 `api://<Client-Id>` をそのまま **Save and continue** します。  
右側のパネルでスコープを設定し、4️⃣ **Add scope** で追加します。

![アプリの新しいスコープ設定画面。右パネルで各種プロパティを入力。](../../../assets/images/make/copilot-studio-05/custom-connector-05.png)

推奨値:

- Scope name: `HR.Consume`  
- Who can consent?: `Admins and users`  
- Admin consent display name: `HR.Consume`  
- Admin consent description: `Allows consuming the HR Service`  
- User consent display name: `HR.Consume`  
- User consent description: `Allows consuming the HR Service`  
- State: **Enabled**

スコープ作成後、一覧に表示されます。

![構成済みスコープ一覧。](../../../assets/images/make/copilot-studio-05/custom-connector-06.png)

次に 1️⃣ **Manifest** を開き、2️⃣ **Microsoft Graph App Manifest (new)** で編集し、`requestedAccessTokenVersion` を `2` に更新します。これは JWT トークンの v2.0 を要求する設定です。

!!! note
    Microsoft Graph App Manifest と v2.0 トークンについては [こちら](https://learn.microsoft.com/en-us/entra/identity-platform/reference-microsoft-graph-app-manifest){target=_blank} を参照してください。

![`requestedAccessTokenVersion` を "2" に設定した manifest 編集画面。](../../../assets/images/make/copilot-studio-05/custom-connector-07.png)

Visual Studio Code に戻り、`local.settings.json` を編集して `<Client-ID>` と `<Tenant-ID>` を実値に置換し、`UseOAuth` を `true` に変更します。

```JSON
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AAD_APP_CLIENT_ID": "<Client-ID>",
    "AAD_APP_TENANT_ID": "<Tenant-ID>",
    "AAD_APP_OAUTH_AUTHORITY": "https://login.microsoftonline.com/<Tenant-ID>",
    "UseOAuth": "true"
  }
}
```

REST API プロジェクトを再起動すると、Authorization ヘッダーに OAuth 2.0 トークンを要求するようになります。トークンがなければ HTTP 401 (Unauthorized) が返されます。

<cc-end-step lab="mcs5" exercise="1" step="2" />

### 手順 3: Dev tunnel の構成

次に REST API を公開 URL でアクセスできるようにします。ローカルで実行しているため、`localhost` を公開するリバース プロキシとして Dev tunnel を使用します。

- [こちらの手順](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank} に従って Dev tunnel をインストール  
- 次のコマンドで Dev tunnel にログイン:

```console
devtunnel user login
```

- 次のコマンドでトンネルをホスト:

```console
devtunnel create hr-service -a --host-header unchanged
devtunnel port create hr-service -p 7071
devtunnel host hr-service
```

実行後、接続情報が表示されます。

![Dev tunnel 実行中のコンソール。](../../../assets/images/extend-m365-copilot-06/devtunnel-output.png)

「Connect via browser」の URL をコピーして保存してください。演習中は Dev tunnel を実行したままにします。再起動が必要な場合は `devtunnel host hr-service` を再実行してください。

<cc-end-step lab="mcs5" exercise="1" step="3" />

### 手順 4: コンシューマー アプリの Entra ID 登録

Power Platform からカスタム コネクタを使うには、コンシューマー アプリも登録する必要があります。Entra 管理センターで **App registrations** → **+ New registration** を選択し、`HR-Service-Consumer` という名前でシングル テナント設定のまま登録します。

登録後の **Overview** で Client ID と Tenant ID を控えておきます。

![コンシューマー アプリにクライアント シークレットを追加する画面。](../../../assets/images/make/copilot-studio-05/custom-connector-08.png)

1️⃣ **Certificates & Secrets** → 2️⃣ **+ New secret** → 3️⃣ 名前と有効期限を設定 → 4️⃣ **Add** でシークレットを作成し、値を安全な場所に保存します。

次に 1️⃣ **API permissions** → 2️⃣ **+ Add a permission** → 3️⃣ **APIs my organization uses** で `HR-Service-API` を検索し 4️⃣ 選択します。

![API への権限付与画面。`HR-Service-API` が選択。](../../../assets/images/make/copilot-studio-05/custom-connector-09.png)

`HR.Consume` デリゲート権限を選択し **Add permission** をクリックします。追加後 **Grand admin consent for ...** を選択して同意を付与します。

![`HR.Consume` 権限を追加する画面。](../../../assets/images/make/copilot-studio-05/custom-connector-10.png)

最終的な権限は次のようになります。

![コンシューマー アプリの権限一覧 (`User.Read` と `HR.Consume`)。](../../../assets/images/make/copilot-studio-05/custom-connector-11.png)

このタブは後の手順でも使用するため開いたままにしておきます。

<cc-end-step lab="mcs5" exercise="1" step="4" />

## 演習 2 : カスタム コネクタの作成

この演習では HR Service API を利用する Power Platform カスタム コネクタを作成します。

### 手順 1: カスタム コネクタの作成

ブラウザーで [https://make.powerautomate.com](https://make.powerautomate.com){target=_blank} を開き、`Copilot Dev Camp` 環境に切り替えます。左メニューで **More** → **Discover all** → **Custom connectors** を開きます。**+ New custom connector** → **Import an OpenAPI file** を選択します。

![カスタム コネクタ作成メニュー。](../../../assets/images/make/copilot-studio-05/custom-connector-12.png)

コネクタ名を入力し、`HR-Service` の OpenAPI JSON ファイルを指定します。ファイルは [こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/path-m-lab-mcs5-connectors/hr-service/src/openapi.json?raw=true){target=_blank} にもあります。入力後 **Continue** をクリックします。

![OpenAPI JSON から新規コネクタ作成ダイアログ。](../../../assets/images/make/copilot-studio-05/custom-connector-13.png)

マルチタブの登録画面が開きます。最初の **General** タブでアイコンや説明を設定し、**Host** に Dev tunnel のホスト名を入力します。**Base URL** は `/` のままで構いません。

![General タブ設定画面。](../../../assets/images/make/copilot-studio-05/custom-connector-14.png)

ページ下部の **Security** を選択し **Security** タブへ移動します。認証タイプに `OAuth 2.0`、プロバイダーに `Azure Active Directory` を選択します。

![Security タブで `OAuth 2.0` を選択。](../../../assets/images/make/copilot-studio-05/custom-connector-15.png)

必要な設定:

- Client ID: 演習 1-手順 4 で登録した `HR-Service-Consumer` の `<Client-Id>`  
- Client secret: 同じく `<Client-Secret>`  
- Authorization URL: 既定値  
- Tenant ID: `<Tenant-Id>`  
- Resource URL: 演習 1-手順 2 で設定した `api://<Client-Id>` (`HR-Service-API` の Client ID)  
- Enable on-behalf-of login: `False`  
- Scope: `HR.Consume`  
- Redirect URL: 後で使用  

![OAuth 2.0 設定詳細。](../../../assets/images/make/copilot-studio-05/custom-connector-16.png)

右上の **Create connector** で保存すると **Redirect URL** に値が表示されます。それをコピーし Entra 管理センターに戻ります。コンシューマー アプリで 1️⃣ **Authentication** → 2️⃣ **+ Add a platform** → 3️⃣ **Web** を選び、4️⃣ コピーした Redirect URL を貼り付け 5️⃣ **Configure** します。

![Web 認証の構成画面。](../../../assets/images/make/copilot-studio-05/custom-connector-17.png)

これで Power Platform からのリダイレクト URL が許可されました。

![Redirect URL 設定パネル。](../../../assets/images/make/copilot-studio-05/custom-connector-18.png)

カスタム コネクタ画面に戻り **Definition** タブで OpenAPI 由来の操作を確認できます。変更不要です。必要なら **Test** タブで動作確認できます。

<cc-end-step lab="mcs5" exercise="2" step="1" />

### 手順 2: カスタム コネクタのテスト

**Test** タブの左側に操作一覧があります。例として **getCandidates** を選択し **+ New connection** で接続を作成します。接続後 **Test operation** をクリックし、下部に出力が表示されることを確認します。

![カスタム コネクタのテスト画面。](../../../assets/images/make/copilot-studio-05/custom-connector-19.png)

<cc-end-step lab="mcs5" exercise="2" step="2" />

## 演習 3 : カスタム コネクタの利用

この演習では演習 2 で作成したカスタム コネクタを利用します。

### 手順 1: エージェントからカスタム コネクタを使用する

[Lab MCS4](../04-extending-m365-copilot){target=_blank} で作成した Microsoft 365 Copilot Chat 用エージェントにカスタム コネクタを組み込みます。

ブラウザーで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} を開きます。  
1️⃣ エージェント一覧から **Microsoft 365 Copilot** を 2️⃣ 選択します。

![Copilot Studio で **Microsoft 365 Copilot** エージェントを選択。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-01.png)

`Agentic HR` エージェントを編集し **Actions** セクションで **+ Add action** を選択します。Lab MCS4 と同様の手順ですが、今回は **Custom connector** から `HR-Services` を検索します。`Get all candidates` アクションを選び接続を許可します。

設定:

- Name: `Get all candidates`  
- Description: `Lists all the HR candidates from an external system`  
- Authentication: `User authentication`  

**Add action** で追加し、Lab MCS4 で作成した旧アクションは無効化します。三点リーダ (...) → **Status** を `Off` に切り替えます。

![アクションの有効/無効切替。](../../../assets/images/make/copilot-studio-05/custom-connector-20.png)

エージェントを発行し、準備ができたら次のプロンプトでテストします。

```text
Lists all the HR candidates from an external system
```

Microsoft 365 Copilot Chat が外部 REST API へのアクセス許可を求めてきます。**Allow once** または **Always allow** を選択します。

![外部 REST API への同意を求めるプロンプト。](../../../assets/images/make/copilot-studio-05/custom-connector-21.png)

次にサインインを要求されるので **Sign in to Agentic HR** をクリックし認証を完了します。その後、再度同じプロンプトを実行すると候補者一覧が表示され、応答下部に外部サービスからの返信であることを示すアイコンが付きます。

![外部 API から取得した候補者一覧。](../../../assets/images/make/copilot-studio-05/custom-connector-23.png)

Visual Studio Code の **Terminal** にはリクエスト トレースが表示され、`Token is valid for user <username>` のメッセージで認証が確認できます。

![VS Code の Terminal トレース。](../../../assets/images/make/copilot-studio-05/custom-connector-24.png)

素晴らしい! カスタム コネクタを構成し、Microsoft 365 Copilot Chat 内で利用できました。

<cc-end-step lab="mcs5" exercise="3" step="1" />

---8<--- "ja/mcs-congratulations.md"

ラボ MCS5 - Power Platform カスタム コネクタが完了しました!

<a href="../06-mcp">こちら</a> から Lab MCS6 を開始し、Copilot Studio で MCP サーバーを利用する方法を学びましょう。  
<cc-next /> 

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/05-connectors--ja" />