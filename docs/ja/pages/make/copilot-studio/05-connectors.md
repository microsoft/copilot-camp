---
search:
  exclude: true
---
# Lab MCS5 - Power Platform custom connector

このラボでは、Microsoft Copilot Studio で作成した エージェント を Power Platform のカスタム コネクタで拡張する方法を理解します。具体的には、仮想的な採用候補者リストを管理するためのカスタム REST API を利用します。この API では以下の機能を提供します。

- 候補者の一覧取得
- 特定の候補者の取得
- 新しい候補者の追加
- 候補者の削除

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/f_HrMbg6kOU" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を短時間で確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

Microsoft 365 Copilot では、Copilot Studio 内でこれらの機能を活用し、前回の [Lab MCS4](../04-extending-m365-copilot){target=_blank} で作成したカスタム エージェント の可能性をさらに高めることができます。

!!! note
    本ラボは前回の [Lab MCS4](../04-extending-m365-copilot){target=_blank} を基にしています。同じ エージェント を引き続き使用し、新たな機能を追加していきます。

このラボで学ぶこと:

- REST API を Power Platform カスタム コネクタとして公開する方法
- Power Platform で外部 REST API との通信を保護する方法
- エージェント からカスタム コネクタを利用する方法

## Exercise 1 : REST API の作成

本ラボではシンプルにするため、あらかじめ用意された REST API を使用します。この演習ではそれをダウンロードし、ローカルで実行できるように構成します。

### Step 1: REST API のダウンロードとテスト

サンプル REST API は TypeScript と Node.js で構築された Azure Function `HR Service` です。ソースコードは [こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/path-m-lab-mcs5-connectors/hr-service&filename=hr-service){target=_blank} からダウンロードできます。

zip を展開し、対象フォルダーを Visual Studio Code で開きます。以下のスクリーンショットはプロジェクト構成の概要です。

![Visual Studio Code における HR Service プロジェクトの構成。](../../../assets/images/make/copilot-studio-05/custom-connector-01.png)

プロジェクトの主な要素は次のとおりです。

- `http`: REST API をテストするための .http ファイルが入っています。  
- `src/data/candidates.json`: サービスの初期データとして使用する仮想的な候補者リスト。  
- `src/functions/candidatesFunction.ts`: Azure Function の実装。  
- `src/openapi.json`: Open API 仕様 (JSON)。  
- `src/openapi.yaml`: Open API 仕様 (YAML)。  
- `askCandidateData.json`: 新規候補者データを収集するアダプティブ カードの JSON。  
- `dev-tunnel-steps.md`: ローカルで実行する REST API をリバース プロキシ公開する Dev Tunnel の手順。  
- `local.settings.json.sample`: 後で使用するサンプル設定ファイル。  

`local.settings.json.sample` を `local.settings.json` にリネームし、F5 キーでプロジェクトを起動します。Visual Studio Code で `http/ht-service.http` を開き、`http://localhost:7071/api/candidates` の GET リクエスト横にある **Send request** コマンドを選択して候補者一覧を取得します。画面右側にレスポンスが表示され、ヘッダーと候補者リストの JSON を確認できます。

![Visual Studio Code での HTTP リクエスト実行例。](../../../assets/images/make/copilot-studio-05/custom-connector-02.png)

画面下部の **Terminal** ウィンドウには、発行した API コールのトレースと `OAuth is disabled. Skipping token validation` というメッセージが表示され、現在 API が匿名アクセス可能であることが分かります。

<cc-end-step lab="mcs5" exercise="1" step="1" />

### Step 2: Entra ID での API 登録

次に API へのアクセスを保護します。ブラウザーで [https://entra.microsoft.com](https://entra.microsoft.com){target=_blank} を開き、対象 Microsoft 365 テナントの職場アカウントでサインインします。左メニューから 1️⃣ **App registrations** を選択し、2️⃣ **+ New registration** をクリックして新しいアプリケーションを登録します。

![Entra 管理センターでの App registrations と +New registration の強調表示。](../../../assets/images/make/copilot-studio-05/custom-connector-03.png)

`Register an application` ページで名前に `HR-Service-API` を入力し、対象テナントのみ認証を許可する設定で **Register** を選択します。

![新規アプリ登録ページ。](../../../assets/images/make/copilot-studio-05/custom-connector-04.png)

登録後に表示される **Overview** ページで Client ID と Tenant ID をコピーしておきます。

左メニューの 1️⃣ **Expose an API** を選択し、2️⃣ **+ Add a scope** をクリックします。初回は **Application ID URI** の設定が求められ、既定値 `api://<Client-Id>` をそのまま **Save and continue** で保存します。右側のパネルで 3️⃣ スコープ設定を入力し、4️⃣ **Add scope** で確定します。

![スコープ設定画面。](../../../assets/images/make/copilot-studio-05/custom-connector-05.png)

推奨設定例:

- Scope name: `HR.Consume`
- Who can consent?: `Admins and users`
- Admin consent display name: `HR.Consume`
- Admin consent description: `Allows consuming the HR Service`
- User consent display name: `HR.Consume`
- User consent description: `Allows consuming the HR Service`
- State: **Enabled**

設定後、スコープ一覧に追加されます。

![スコープ一覧。](../../../assets/images/make/copilot-studio-05/custom-connector-06.png)

続いて 1️⃣ **Manifest** を開き、2️⃣ **Microsoft Graph App Manifest (new)** エディターで 3️⃣ `requestedAccessTokenVersion` を `2` に更新します。これにより v2.0 の JWT トークンを要求するようになります。

!!! note
    Microsoft Graph App Manifest と v2.0 トークンについては [Understand the app manifest (Microsoft Graph format)](https://learn.microsoft.com/en-us/entra/identity-platform/reference-microsoft-graph-app-manifest){target=_blank} を参照してください。

![Manifest 編集画面。](../../../assets/images/make/copilot-studio-05/custom-connector-07.png)

Visual Studio Code に戻り、`local.settings.json` を編集して Client ID、Tenant ID を置き換え、`UseOAuth` を `true` に設定します。

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

REST API プロジェクトを再起動すると、Authorization ヘッダーに OAuth 2.0 トークンを要求するようになります。不正または未提供の場合、API は HTTP 401 (Unauthorized) を返します。

<cc-end-step lab="mcs5" exercise="1" step="2" />

### Step 3: Dev Tunnel の構成

ローカルの REST API を公開するため、Dev Tunnel を使用して `localhost` をパブリック URL にマッピングします。以下の手順に従ってください。

- [こちらの手順](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank} に従い Dev Tunnel をインストール  
- 次のコマンドでサインイン:

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

![Dev Tunnel 実行結果。](../../../assets/images/extend-m365-copilot-06/devtunnel-output.png)

「Connect via browser」URL をコピーし、控えておきます。トンネルを停止した場合は `devtunnel host hr-service` で再開できます。

<cc-end-step lab="mcs5" exercise="1" step="3" />

### Step 4: Entra ID にコンシューマー登録

Power Platform のカスタム コネクタから API を利用するため、コンシューマー アプリも登録します。[Microsoft Entra admin center](https://entra.microsoft.com){target=_blank} で **App registrations** → **+ New registration** を選択し、`HR-Service-Consumer` という名前でシングル テナント認証を設定して登録します。

**Overview** ページで Client ID と Tenant ID をコピーします。

![クライアント シークレット作成画面。](../../../assets/images/make/copilot-studio-05/custom-connector-08.png)

1️⃣ **Certificates & Secrets** → 2️⃣ **+ New secret** を選択し、3️⃣ 説明と期間を設定して 4️⃣ **Add**。シークレット値を安全な場所に保存します。

次に 1️⃣ **API permissions** → 2️⃣ **+ Add a permission** → 3️⃣ **APIs my organization uses** で `HR-Service-API` を検索し、4️⃣ 選択します。

![API 選択画面。](../../../assets/images/make/copilot-studio-05/custom-connector-09.png)

表示されたパネルで `HR.Consume` の Delegated permission を選択し **Add permission** をクリック。追加後 **Grant admin consent for ...** を実行して許可を付与します。

![権限追加パネル。](../../../assets/images/make/copilot-studio-05/custom-connector-10.png)

最終的に以下のような権限が設定されます。

![権限リスト。](../../../assets/images/make/copilot-studio-05/custom-connector-11.png)

このタブは今後も使用するため開いたままにしておきます。

<cc-end-step lab="mcs5" exercise="1" step="4" />

## Exercise 2 : カスタム コネクタの作成

この演習では HR Service API を利用する Power Platform カスタム コネクタを作成します。

### Step 1: カスタム コネクタの作成

ブラウザーで [https://make.powerautomate.com](https://make.powerautomate.com){target=_blank} を開き、左メニューの **More** → **Discover all** → **Custom connectors** を選択します。**+ New custom connector** → **Import an OpenAPI file** をクリックします。

![カスタム コネクタ作成メニュー。](../../../assets/images/make/copilot-studio-05/custom-connector-12.png)

コネクタ名を入力し、`HR-Service` の OpenAPI JSON ファイルを指定します。ファイルは [こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/path-m-lab-mcs5-connectors/hr-service/src/openapi.json?raw=true){target=_blank} でも取得できます。**Continue** で作成を完了します。

![OpenAPI インポート ダイアログ。](../../../assets/images/make/copilot-studio-05/custom-connector-13.png)

多段階の設定画面が表示されます。最初の **General** タブではアイコンや色、説明を設定できます。また **Host** に Dev Tunnel のホスト名を入力し、**Base URL** は `/` のままにします。

![General タブ。](../../../assets/images/make/copilot-studio-05/custom-connector-14.png)

画面下部の **Security** をクリックし、認証タイプに `OAuth 2.0`、フレーバーに `Azure Active Directory` を選択します。

![Security タブの認証タイプ設定。](../../../assets/images/make/copilot-studio-05/custom-connector-15.png)

必要な設定を入力します。

- Client ID: `<Client-Id>` (HR-Service-Consumer)  
- Client secret: `<Client-Secret>` (HR-Service-Consumer)  
- Authorization URL: 既定値  
- Tenant ID: `<Tenant-Id>` (HR-Service-Consumer)  
- Resource URL: `<Application-ID-URI>` (`api://<Client-Id>` 形式、HR-Service-API の Client ID)  
- Enable on-behalf-of login: `False`  
- Scope: `HR.Consume`  
- Redirect URL: 読み取り専用 (後ほど使用)  

![OAuth 2.0 設定。](../../../assets/images/make/copilot-studio-05/custom-connector-16.png)

右上の **Create connector** で保存します。保存後、**Redirect URL** に値が表示されるのでコピーし、Entra 管理センターの HR-Service-Consumer アプリへ戻ります。1️⃣ **Authentication** → 2️⃣ **+ Add a platform** → 3️⃣ **Web** を選び、4️⃣ コピーした URL を貼り付けて 5️⃣ **Configure**。

![Web 認証設定ページ。](../../../assets/images/make/copilot-studio-05/custom-connector-17.png)

これで Power Platform からのリダイレクト URL が許可されました。

![Redirect URL 設定完了パネル。](../../../assets/images/make/copilot-studio-05/custom-connector-18.png)

カスタム コネクタ定義に戻り **Definition** タブを確認すると、OpenAPI から取得した操作が一覧されます。特に変更は不要です。**Test** タブに切り替えて動作確認も可能です。

<cc-end-step lab="mcs5" exercise="2" step="1" />

### Step 2: カスタム コネクタのテスト

**Test** タブ左側の操作一覧から **getCandidates** などを選択し、**+ New connection** で接続を作成して認証します。接続後 **Test operation** をクリックすると結果が下部に表示されます。

![カスタム コネクタ テスト画面。](../../../assets/images/make/copilot-studio-05/custom-connector-19.png)

<cc-end-step lab="mcs5" exercise="2" step="2" />

## Exercise 3 : カスタム コネクタの利用

この演習では Exercise 2 で作成したカスタム コネクタを利用します。

### Step 1: エージェント からカスタム コネクタを利用

[Lab MCS4](../04-extending-m365-copilot){target=_blank} で作成した Microsoft 365 Copilot Chat 用 エージェント からカスタム コネクタを呼び出します。

[https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、1️⃣ エージェント 一覧から **Microsoft 365 Copilot** を 2️⃣ 選択します。

![エージェント 一覧画面。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-01.png)

`Agentic HR` エージェント を編集し、**Actions** → **+ Add action** をクリックします。Lab MCS4 と同様の手順ですが、今回は **Custom connector** を選択して `HR-Services` を検索します。**Get all candidates** アクションを選択し、接続を確立します。

設定:

- Name: `Get all candidates`
- Description: `Lists all the HR candidates from an external system`
- Authentication: `User authentication`

**Add action** で追加後、Lab MCS4 で作成した旧アクションを無効化します。アクション右の (…) → **Status** を `Off` に切り替えます。

![アクションの有効 / 無効 切り替え。](../../../assets/images/make/copilot-studio-05/custom-connector-20.png)

エージェント を発行し、更新完了後 Microsoft 365 Copilot Chat で次のプロンプトを入力してテストします。

```text
Lists all the HR candidates from an external system
```

Microsoft 365 Copilot Chat から外部 REST API の利用許可を求められるので **Allow once** または **Always allow** を選択します。

![利用許可ダイアログ。](../../../assets/images/make/copilot-studio-05/custom-connector-21.png)

続いてサインインを促すメッセージが表示されます。

![サインイン要求メッセージ。](../../../assets/images/make/copilot-studio-05/custom-connector-22.png)

**Sign in to Agentic HR** をクリックし認証後、再度同じプロンプトを実行すると、HR Service から取得した候補者リストが表示され、応答下部のアイコンで外部サービスからの情報であることが確認できます。

![候補者リスト表示。](../../../assets/images/make/copilot-studio-05/custom-connector-23.png)

Visual Studio Code の **Terminal** には REST リクエストのトレースと `Token is valid for user <username>` のメッセージが表示され、認証が成功していることがわかります。

![Terminal のトレース。](../../../assets/images/make/copilot-studio-05/custom-connector-24.png)

素晴らしい！カスタム コネクタを構成し、Microsoft 365 Copilot Chat から利用できるようになりました。

<cc-end-step lab="mcs5" exercise="3" step="1" />

---8<--- "ja/mcs-congratulations.md"

Lab MCS5 - Power Platform custom connector が完了しました！

<a href="../06-mcp">こちらから</a> Lab MCS6 を開始し、Copilot Studio で MCP サーバーを利用する方法を学びましょう。
<cc-next /> 

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/05-connectors--ja" />