---
search:
  exclude: true
---
# Lab MCS5 - Power Platform カスタム コネクタ

この lab では、Microsoft Copilot Studio で作成した エージェント を Power Platform のカスタム コネクタを使って拡張する方法を学びます。具体的には、架空の求人候補者リストを管理するカスタム REST API を利用します。この API は以下の機能を提供します。

- 候補者の一覧取得
- 特定候補者の取得
- 新しい候補者の追加
- 候補者の削除

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/f_HrMbg6kOU" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画で lab の概要を短時間でご確認ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

Microsoft 365 Copilot では、Copilot Studio 内でこれらの機能を活用し、前回の [Lab MCS4](../04-extending-m365-copilot){target=_blank} で作成したカスタム エージェント の可能性をさらに広げることができます。

!!! note
    この lab は前回の [Lab MCS4](../04-extending-m365-copilot){target=_blank} を基にしています。同じ エージェント を継続利用し、新しい機能を追加してください。

この lab で学習する内容:

- Power Platform のカスタム コネクタで REST API を公開する方法
- Power Platform で外部 REST API との通信をセキュリティ保護する方法
- エージェント からカスタム コネクタを利用する方法

## 演習 1 : REST API の作成

本 lab では簡単に進めるため、事前に用意された REST API を使用します。この演習では API をダウンロードして構成し、ローカルで実行できるようにします。

### 手順 1: REST API のダウンロードとテスト

サンプル REST API は TypeScript と Node.js で構築された Azure Function で、`HR Service` という名前です。ソースコードは [こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/path-m-lab-mcs5-connectors/hr-service&filename=hr-service){target=_blank} からダウンロードできます。

zip を展開し、対象フォルダーを Visual Studio Code で開きます。以下のスクリーンショットはプロジェクト構成の概要です。

![Visual Studio Code での HR Service プロジェクトのアウトライン。http フォルダーに API テスト用の .http ファイルが 2 つ、src フォルダーにサンプル データと Azure Function の実装、OpenAPI 仕様ファイル (JSON と YAML)、いくつかの JSON 設定ファイルがある。](../../../assets/images/make/copilot-studio-05/custom-connector-01.png)

プロジェクトの主な構成要素:

- `http`: Visual Studio Code で REST API をテストするための .http ファイルが入っています。
- `src/data/candidates.json`: サービスの初期データ ソースとして使う架空の候補者リスト。
- `src/functions/candidatesFunction.ts`: Azure Function の実装本体。
- `src/openapi.json`: Azure Function 用 OpenAPI 仕様 (JSON)。
- `src/openapi.yaml`: Azure Function 用 OpenAPI 仕様 (YAML)。
- `askCandidateData.json`: 新しい候補者を登録するための Adaptive Card の JSON。
- `dev-tunnel-steps.md`: ローカルで動作する REST API をリバース プロキシ公開する Dev Tunnel 手順。
- `local.settings.json.sample`: 本 lab で後ほど使用するサンプル設定ファイル。

`local.settings.json.sample` を `local.settings.json` にリネームし、F5 を押してプロジェクトを起動します。Visual Studio Code で `http/ht-service.http` を開き、`http://localhost:7071/api/candidates` の GET リクエスト横に表示される **Send request** を選択して候補者リストの取得リクエストを実行します。
画面右側にレスポンス ヘッダーと JSON 形式の候補者リストが表示されます。

![Visual Studio Code で HTTP リクエストを実行している様子。左側に .http ファイル、右側に GET リクエストのレスポンスが表示され、下部の **Terminal** には OAuth 無効メッセージがハイライトされている。](../../../assets/images/make/copilot-studio-05/custom-connector-02.png)

画面下部の **Terminal** には、実行した API 呼び出しのトレースと `OAuth is disabled. Skipping token validation` というメッセージが表示されます。現時点では API は匿名アクセス可能です。

<cc-end-step lab="mcs5" exercise="1" step="1" />

### 手順 2: Entra ID への API 登録

次に、API へのアクセスを保護します。まず、対象 Microsoft 365 テナントの職場アカウントでブラウザーから [https://entra.microsoft.com](https://entra.microsoft.com){target=_blank} にアクセスし、Microsoft Entra 管理センターを開きます。サインイン後、1️⃣ 左側メニューで **App registrations** を選択し、2️⃣ **+ New registration** をクリックして新しいアプリを登録します。

![Microsoft Entra 管理センターで **App registrations** と **+ New registration** をハイライトした画面。](../../../assets/images/make/copilot-studio-05/custom-connector-03.png)

`Register an application` ページでアプリ名 (例: `HR-Service-API`) を入力、対象テナントのみを選択し、画面下部の **Register** を選択します。

![アプリ登録ページ。アプリ名 "HR-Service-API"、シングルテナント認証が設定され、登録ボタンがハイライトされている。](../../../assets/images/make/copilot-studio-05/custom-connector-04.png)

登録後、**Overview** ページにクライアント ID とテナント ID が表示されるので控えておきます。

左メニューから 1️⃣ **Expose an API** を選択し、2️⃣ **+ Add a scope** をクリックして新しいアクセス許可スコープを追加します。最初のスコープ追加時には **Application ID URI** を設定する必要があります。既定値 `api://<Client-Id>` をそのまま使用し **Save and continue** を選択します。次に 3️⃣ 右側パネルでスコープ設定を入力し、4️⃣ **Add scope** をクリックします。

![アプリのスコープ設定画面。右側パネルでスコープの詳細を入力している。](../../../assets/images/make/copilot-studio-05/custom-connector-05.png)

推奨設定例:

- Scope name: `HR.Consume`
- Who can consent?: `Admins and users`
- Admin consent display name: `HR.Consume`
- Admin consent description: `Allows consuming the HR Service`
- User consent display name: `HR.Consume`
- User consent description: `Allows consuming the HR Service`
- State: **Enabled**

スコープ追加後、一覧に表示されます。

![追加されたスコープ "HR.Consume" が一覧に表示されている画面。](../../../assets/images/make/copilot-studio-05/custom-connector-06.png)

続いて 1️⃣ **Manifest** を選択し、2️⃣ **Microsoft Graph App Manifest (new)** でマニフェストを編集し、3️⃣ `requestedAccessTokenVersion` を `2` に変更します。これで API が v2.0 タイプの JWT を要求します。

!!! note
    Microsoft Graph App Manifest と v2.0 トークンの詳細は [Understand the app manifest (Microsoft Graph format)](https://learn.microsoft.com/en-us/entra/identity-platform/reference-microsoft-graph-app-manifest){target=_blank} を参照してください。

![`requestedAccessTokenVersion` プロパティを "2" に設定したマニフェスト編集画面。](../../../assets/images/make/copilot-studio-05/custom-connector-07.png)

Visual Studio Code に戻り、`local.settings.json` を編集してアプリの設定を反映します。`<Client-ID>` と `<Tenant-ID>` を実際の値に置き換え、`UseOAuth` を `true` にします。

```JSON
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AAD_APP_CLIENT_ID": "<Client-ID>",
    "AAD_APP_TENANT_ID": "<Tenant-ID>",
    "AAD_APP_OAUTH_AUTHORITY": "https://login.microsoftonline.com/<Tenant-ID>",
    "UseOAuth": false
  }
}
```

REST API プロジェクトを再起動すると、API は保護され Authorization ヘッダーに OAuth 2.0 トークンを要求します。トークンがない、または無効な場合は HTTP 401 (Unauthorized) が返されます。

<cc-end-step lab="mcs5" exercise="1" step="2" />

### 手順 3: Dev Tunnel の構成

REST API を公開 URL でアクセスできるようにする必要があります。ローカル環境で API を実行しているため、リバース プロキシ ツールで `localhost` を公開 URL にマッピングします。ここでは Microsoft 提供の Dev Tunnel を利用します。

- [こちらの手順](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank} に従い Dev Tunnel をインストールします。
- 次のコマンドで Dev Tunnel にログインします。

```console
devtunnel user login
```

- 次のコマンドでトンネルをホストします。

```console
devtunnel create hr-service -a --host-header unchanged
devtunnel port create hr-service -p 7071
devtunnel host hr-service
```

コンソールには接続情報が表示されます。

![devtunnel 実行中のコンソール。ホスティングポート、Connect via browser URL、ネットワークアクティビティ確認用 URL が表示されている。](../../../assets/images/extend-m365-copilot-06/devtunnel-output.png)

「Connect via browser」の URL をコピーして保存してください。

lab 中は devtunnel コマンドを起動したままにしておきます。再起動する場合は `devtunnel host hr-service` を再実行してください。

<cc-end-step lab="mcs5" exercise="1" step="3" />

### 手順 4: Entra ID でのコンシューマー登録

Power Platform のカスタム コネクタから API を呼び出すため、Microsoft Entra ID にコンシューマー アプリを登録します。再度 [Microsoft Entra 管理センター](https://entra.microsoft.com){target=_blank} で **App registrations** を選択し、**+ New registration** をクリックします。今回はアプリ名を `HR-Service-Consumer` とし、シングルテナント認証で登録します。

登録後、**Overview** ページでクライアント ID とテナント ID を控えておきます。

1️⃣ **Certificates & Secrets** を開き、2️⃣ **+ New secret** を選択、3️⃣ 説明と有効期限を設定し、4️⃣ **Add** をクリックします。生成されたシークレット値をクライアント ID・テナント ID とともに安全な場所へ保存してください。

次に 1️⃣ **API permissions** を開き、2️⃣ **+ Add a permission** をクリックします。右側パネルで 3️⃣ **APIs my organization uses** を選択し、`HR-Service-API` を検索して 4️⃣ 選択します。

![コンシューマー アプリに権限を追加する画面。"HR-Service-API" が選択されている。](../../../assets/images/make/copilot-studio-05/custom-connector-09.png)

選択後、パネルが更新されるので、先ほど作成した `HR.Consume` の委任アクセス許可を選択し **Add permission** をクリックします。追加後 **Grant admin consent for ...** を選択して許可を付与します。

![委任アクセス許可 "HR.Consume" を選択するパネル。](../../../assets/images/make/copilot-studio-05/custom-connector-10.png)

最終的に以下のように権限が設定されます。

![コンシューマー アプリの権限一覧。"User.Read" と "HR.Consume" の委任アクセス許可が表示されている。](../../../assets/images/make/copilot-studio-05/custom-connector-11.png)

このタブは開いたままにしておいてください。次の手順で設定を追加します。

<cc-end-step lab="mcs5" exercise="1" step="4" />

## 演習 2 : カスタム コネクタの作成

この演習では HR Service API を呼び出す Power Platform カスタム コネクタを作成します。

### 手順 1: カスタム コネクタの作成

ブラウザーで [https://make.powerautomate.com](https://make.powerautomate.com){target=_blank} を開き、対象テナントの職場アカウントでサインインします。左側メニューで **More** → **Discover all** と進み、**Custom connectors** を探します。頻繁に使用する場合はピン留めできます。カスタム コネクタ一覧ページで **+ New custom connector** → **Import an OpenAPI file** を選択します。

![カスタム コネクタ作成メニュー。**Import an OpenAPI file** がハイライトされている。](../../../assets/images/make/copilot-studio-05/custom-connector-12.png)

コネクタ名を入力し、`HR-Service` の OpenAPI JSON ファイルを選択します。ファイルは [こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/path-m-lab-mcs5-connectors/hr-service/src/openapi.json?raw=true){target=_blank} からも取得できます。入力後 **Continue** をクリックします。

![OpenAPI JSON からカスタム コネクタを作成するダイアログ。名前とファイルパスが入力され、**Continue** がハイライト。](../../../assets/images/make/copilot-studio-05/custom-connector-13.png)

マルチタブの登録プロセスが始まります。最初の **General** タブではアイコン、色、説明を設定できます。また **Host** に Dev Tunnel のホスト名を入力し、**Base URL** はデフォルト `/` のままにします。

![カスタム コネクタの **General** タブ設定画面。](../../../assets/images/make/copilot-studio-05/custom-connector-14.png)

ページ下部の **Security** をクリックして **Security** タブへ移動し、認証タイプに `OAuth 2.0` を選択します。その後、OAuth 2.0 のフレーバーとして `Azure Active Directory` を選択します。

![**Security** タブで認証タイプに `OAuth 2.0` を選択した画面。](../../../assets/images/make/copilot-studio-05/custom-connector-15.png)

`Azure Active Directory` を選択すると追加設定が表示されます。以下を入力してください。

- Client ID: 演習 1 - 手順 4 で登録したコンシューマー アプリの `<Client-Id>`
- Client secret: 同じアプリの `<Client-Secret>`
- Authorization URL: 既定値 (テナント共通)
- Tenant ID: `<Tenant-Id>`
- Resource URL: 演習 1 - 手順 2 で設定した `<Application-ID-URI>` (`api://<Client-Id>`)
- Enable on-behalf-of login: `False`
- Scope: `HR.Consume`
- Redirect URL: 読み取り専用 (後ほど使用)

![Azure AD 用 `OAuth 2.0` 設定項目。](../../../assets/images/make/copilot-studio-05/custom-connector-16.png)

右上の **Create connector** をクリックして保存します。保存が完了すると **Security** タブが再読み込みされ、**Redirect URL** に実際の値が表示されます。コピーして Entra 管理センターに戻り、コンシューマー アプリの 1️⃣ **Authentication** を開き、2️⃣ **+ Add a platform** → 3️⃣ **Web** を選択し、4️⃣ コピーした URL を貼り付けて 5️⃣ **Configure** をクリックします。

![コンシューマー アプリの **Web** 認証設定画面。](../../../assets/images/make/copilot-studio-05/custom-connector-17.png)

これで Power Platform からのリダイレクト URL が登録されました。

![コンシューマー アプリに **Redirect URL** が追加された画面。](../../../assets/images/make/copilot-studio-05/custom-connector-18.png)

再びカスタム コネクタ編集画面に戻り **Definition** タブへ移動します。OpenAPI から取得した全操作が表示されるので、ここでは変更不要です。必要に応じて **Test** タブで API の動作確認が可能です。

<cc-end-step lab="mcs5" exercise="2" step="1" />

### 手順 2: カスタム コネクタのテスト

**Test** タブでは左側に操作一覧が表示されます。例えば **getCandidates** を選択し、**+ New connection** をクリックして Power Platform のプロンプトに従い認証します。接続が作成されたら **Test operation** をクリックし、画面下部にレスポンスが表示されることを確認します。

![カスタム コネクタの **Test** タブで操作をテストしている画面。](../../../assets/images/make/copilot-studio-05/custom-connector-19.png)

<cc-end-step lab="mcs5" exercise="2" step="2" />

## 演習 3 : カスタム コネクタの利用

この演習では、演習 2 で作成したカスタム コネクタを利用します。

### 手順 1: エージェントからカスタム コネクタを呼び出す

[Lab MCS4](../04-extending-m365-copilot){target=_blank} で作成した Microsoft 365 Copilot Chat 用 エージェント からカスタム コネクタを呼び出します。

ブラウザーで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} を開きます。1️⃣ エージェント一覧から **Microsoft 365 Copilot** を 2️⃣ 選択します。

![Microsoft Copilot Studio でエージェント一覧を表示し **Microsoft 365 Copilot** を選んでいる画面。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-01.png)

`Agentic HR` エージェントを編集し、**Actions** セクションで **+ Add action** をクリックします。(Lab MCS4 - 演習 2 - 手順 1 と同様です。) ただし今回は **Custom connector** グループを選択し、`HR-Services` を検索します。演習 2 で作成した `HR-Services` コネクタのアクションが表示されます。

`Get all candidates` アクションを選択し、カスタム コネクタへの接続を承認します。
設定:

- Name: `Get all candidates`
- Description: `Lists all the HR candidates from an external system`
- Authentication: `User authentication`

**Add action** をクリックして追加します。Lab MCS4 - 演習 2 - 手順 1 で作成した旧アクションは無効化してください。アクション右横の (...) をクリックし **Status** を `Off` に切り替えます。

![Microsoft 365 Copilot Chat エージェントでアクションの有効/無効を切り替えるメニュー。](../../../assets/images/make/copilot-studio-05/custom-connector-20.png)

エージェントを発行し、更新完了後 Microsoft 365 Copilot Chat で次のプロンプトを入力してテストします。

```text
Lists all the HR candidates from an external system
```

Microsoft 365 Copilot Chat は外部 REST API の利用許可を求めます。**Allow once** (テスト毎に確認) もしくは **Always allow** (常時許可) を選択します。

![外部 REST API 利用許可を求めるダイアログ。](../../../assets/images/make/copilot-studio-05/custom-connector-21.png)

続いて安全にアクセスするためサインインを要求します。

![外部 REST API へのサインインを促すメッセージ。](../../../assets/images/make/copilot-studio-05/custom-connector-22.png)

**Sign in to Agentic HR** を選択して認証後、同じプロンプトを再度入力すると、HR Service プロジェクトに定義された候補者リストが表示されます。レスポンス下部のアイコンで外部サービスから取得したことが分かります。

![外部 API から取得した候補者リストを表示する Microsoft 365 Copilot Chat。](../../../assets/images/make/copilot-studio-05/custom-connector-23.png)

Visual Studio Code の **Terminal** には REST リクエストのトレースが表示され、`Token is valid for user <username>` と認証されたことが確認できます。

![Visual Studio Code の **Terminal** でトレースを確認している画面。](../../../assets/images/make/copilot-studio-05/custom-connector-24.png)

素晴らしいです! カスタム コネクタを構成し、Microsoft 365 Copilot Chat 内で利用できました。

<cc-end-step lab="mcs5" exercise="3" step="1" />

---8<--- "ja/mcs-congratulations.md"

Lab MCS5 - Power Platform カスタム コネクタ が完了しました!

<!-- 
<a href="../06-mcp">Start here</a> with Lab MCS6, to learn how to consume an MCP server in Copilot Studio.
<cc-next /> 
-->

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/05-connectors" />