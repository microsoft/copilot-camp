---
search:
  exclude: true
---
# ラボ MCS5 - Power Platform カスタム コネクタ

このラボでは、 Microsoft Copilot Studio で作成した エージェント を Power Platform のカスタム コネクタで拡張する方法を学びます。具体的には、想定上の採用候補者リストを管理するためのカスタム REST API を利用します。API で提供される機能は次のとおりです。

- 候補者を一覧表示する  
- 特定の候補者を取得する  
- 新しい候補者を追加する  
- 候補者を削除する  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/f_HrMbg6kOU" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要をご覧ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>


Microsoft 365 Copilot の Copilot Studio では、これらの機能を利用して、前回の [ラボ MCS4](../04-extending-m365-copilot){target=_blank} で作成したカスタム エージェント をさらに強化できます。

!!! note
    このラボは前回の [ラボ MCS4](../04-extending-m365-copilot){target=_blank} を前提としています。同じ エージェント を引き続き使用し、新しい機能を追加してください。

このラボで学ぶこと

- REST API を Power Platform のカスタム コネクタとして公開する方法  
- Power Platform で外部 REST API への通信を保護する方法  
- エージェント からカスタム コネクタを利用する方法  

## エクササイズ 1 : REST API の作成

このラボでは簡単のため、あらかじめ用意された REST API を使用します。このエクササイズでは、API をダウンロードしてローカルで実行できるように構成します。

### Step 1: REST API のダウンロードとテスト

サンプル REST API は TypeScript と Node.js で構築された Azure Function で、名前は `HR Service` です。ソースコードは [こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/path-m-lab-mcs5-connectors/hr-service&filename=hr-service){target=_blank} からダウンロードできます。

ZIP を展開し、対象フォルダーを Visual Studio Code で開きます。以下のスクリーンショットはプロジェクト構成の概要です。

![Visual Studio Code で表示した HR Service プロジェクトのアウトライン。http フォルダーには API テスト用の .http ファイルがあり、src フォルダーにはサンプル データと Azure Function、本体の Open API 仕様ファイルなどが配置されている。](../../../assets/images/make/copilot-studio-05/custom-connector-01.png)

主な構成要素は次のとおりです。

- `http` : Visual Studio Code で API をテストするための .http ファイルが入っています。  
- `src/data/candidates.json` : サンプルの候補者リストを格納した JSON ファイルです。  
- `src/functions/candidatesFunction.ts` : Azure Function の実装本体です。  
- `src/openapi.json` : JSON 形式の Open API 仕様ファイルです。  
- `src/openapi.yaml` : YAML 形式の Open API 仕様ファイルです。  
- `askCandidateData.json` : 新規候補者データ入力用のアダプティブ カードの JSON です。  
- `dev-tunnel-steps.md` : ローカルで動作する REST API を公開する Dev Tunnel の手順です。  
- `local.settings.json.sample` : 後ほど使用するサンプル設定ファイルです。  

`local.settings.json.sample` を `local.settings.json` にリネームし、F5 キーでプロジェクトを起動します。Visual Studio Code で `http/ht-service.http` を開き、`http://localhost:7071/api/candidates` の GET リクエスト横にある **Send request** を選択して候補者一覧を取得します。画面右側にレスポンス ヘッダーと JSON 形式の候補者リストが表示されます。

![Visual Studio Code 内で HTTP リクエストを実行。左に .http ファイル、右にレスポンス。下部の **Terminal** に OAuth 無効化のメッセージ。](../../../assets/images/make/copilot-studio-05/custom-connector-02.png)

画面下部 **Terminal** には呼び出しのトレースが表示され、`OAuth is disabled. Skipping token validation` と出力されています。現時点では API は匿名アクセスが可能です。

<cc-end-step lab="mcs5" exercise="1" step="1" />

### Step 2: API を Entra ID に登録する

次に API へのアクセスを保護します。ブラウザーで [https://entra.microsoft.com](https://entra.microsoft.com){target=_blank} を開き、対象 Microsoft 365 テナントの作業アカウントでサインインします。1️⃣ 左メニューの **App registrations** を選択し、2️⃣ **+ New registration** をクリックして新しいアプリケーションを登録します。

![Microsoft Entra admin center で **App registrations** と **+ New registration** が強調表示されている。](../../../assets/images/make/copilot-studio-05/custom-connector-03.png)

`Register an application` ページでアプリ名を `HR-Service-API` などに設定し、対象テナントのみをサポートするように選択して **Register** を押します。

![アプリ登録ページ。アプリ名「HR-Service-API」、シングルテナント選択、Register ボタンが強調。](../../../assets/images/make/copilot-studio-05/custom-connector-04.png)

登録後の **Overview** ページで Client ID と Tenant ID をコピーしておきます。

左メニューから 1️⃣ **Expose an API** を選択し、2️⃣ **+ Add a scope** をクリック。初回は **Application ID URI** を構成する必要があり、既定値 `api://<Client-Id>` のまま **Save and continue** を押します。その後 3️⃣ 右側のパネルでスコープを設定し、4️⃣ **Add scope** で確定します。

![新しいスコープ設定パネル。](../../../assets/images/make/copilot-studio-05/custom-connector-05.png)

推奨値の例:

- Scope name : `HR.Consume`  
- Who can consent? : `Admins and users`  
- Admin consent display name : `HR.Consume`  
- Admin consent description : `Allows consuming the HR Service`  
- User consent display name : `HR.Consume`  
- User consent description : `Allows consuming the HR Service`  
- State : **Enabled**  

スコープを作成すると、アプリのスコープ一覧に表示されます。

![構成済みのスコープ一覧。](../../../assets/images/make/copilot-studio-05/custom-connector-06.png)

次に 1️⃣ **Manifest** を選択し、2️⃣ **Microsoft Graph App Manifest (new)** で編集し、3️⃣ `requestedAccessTokenVersion` を `2` に設定します。これで API が v2.0 の JWT トークンを受け取ることを示します。

!!! note
    Microsoft Graph App Manifest と v2.0 トークンの詳細は [Understand the app manifest (Microsoft Graph format)](https://learn.microsoft.com/en-us/entra/identity-platform/reference-microsoft-graph-app-manifest){target=_blank} を参照してください。

![manifest 編集画面。requestedAccessTokenVersion が "2" に設定されている。](../../../assets/images/make/copilot-studio-05/custom-connector-07.png)

Visual Studio Code に戻り、`local.settings.json` を更新します。`<Client-ID>` と `<Tenant-ID>` を実際の値に置き換え、`UseOAuth` を `true` に変更します。

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

### Step 3: Dev Tunnel の構成

次に REST API を公開 URL でアクセスできるようにします。ローカルホストを外部に公開するために Microsoft の dev tunnel ツールを使用します。

- [こちらの手順](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank} に従って dev tunnel をインストール  
- 次のコマンドで dev tunnel にログイン:

```console
devtunnel user login
```

- 以下のコマンドでトンネルをホスト:

```console
devtunnel create hr-service -a --host-header unchanged
devtunnel port create hr-service -p 7071
devtunnel host hr-service
```

コンソールに接続情報が表示されます。

![devtunnel の出力例。](../../../assets/images/extend-m365-copilot-06/devtunnel-output.png)

「Connect via browser」の URL をコピーしておきます。

ラボ作業中は devtunnel を終了させず、そのままにしてください。再起動する場合は `devtunnel host hr-service` を再実行します。

<cc-end-step lab="mcs5" exercise="1" step="3" />

### Step 4: Consumer アプリを Entra ID に登録する

Power Platform のカスタム コネクタから API を呼び出すには、Consumer アプリも Entra ID に登録する必要があります。前と同様に [Microsoft Entra admin center](https://entra.microsoft.com){target=_blank} で **App registrations** → **+ New registration** を選択し、`HR-Service-Consumer` という名前でシングルテナント設定のまま登録します。

登録後の **Overview** ページで Client ID と Tenant ID をコピーします。

左メニューの 1️⃣ **Certificates & Secrets** → 2️⃣ **+ New secret**、3️⃣ 説明と有効期限を入力し、4️⃣ **Add** でシークレットを生成します。値を安全な場所に保存してください。

次に 1️⃣ **API permissions** → 2️⃣ **+ Add a permission**、右パネルで 3️⃣ **APIs my organization uses** を選択し、`HR-Service-API` を検索して 4️⃣ 選択します。

![API permission 追加画面で HR-Service-API がハイライト。](../../../assets/images/make/copilot-studio-05/custom-connector-09.png)

続くパネルで `HR.Consume` の Delegated permission を選び **Add permission** を押します。追加後、**Grand admin consent for ...** を選択してアプリに権限を付与します。

![Delegated permission HR.Consume を選択し Add permission を押す画面。](../../../assets/images/make/copilot-studio-05/custom-connector-10.png)

結果として、次のように `User.Read` と `HR.Consume` の 2 つの Delegated 権限が設定されます。

![Consumer アプリの権限一覧。](../../../assets/images/make/copilot-studio-05/custom-connector-11.png)

このタブは今後も使うので開いたままにしておきます。

<cc-end-step lab="mcs5" exercise="1" step="4" />

## エクササイズ 2 : カスタム コネクタの作成

このエクササイズでは HR Service API を利用する Power Platform カスタム コネクタを作成します。

### Step 1: カスタム コネクタの作成

ブラウザーで [https://make.powerautomate.com](https://make.powerautomate.com){target=_blank} にアクセスし、左メニューの **More** → **Discover all** から **Custom connectors** を見つけます。**+ New custom connector** → **Import an OpenAPI file** を選択します。

![新しいカスタム コネクタ作成メニューで **Import an OpenAPI file** が強調。](../../../assets/images/make/copilot-studio-05/custom-connector-12.png)

コネクタ名を入力し、`HR-Service` の OpenAPI JSON ファイルを指定します。ファイルは [こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/path-m-lab-mcs5-connectors/hr-service/src/openapi.json?raw=true){target=_blank} にもあります。設定後 **Continue** をクリックします。

![OpenAPI JSON からのコネクタ作成ダイアログ。](../../../assets/images/make/copilot-studio-05/custom-connector-13.png)

マルチタブ形式の設定画面が開きます。最初の **General** タブでアイコンや色、説明を設定できます。また **Host** に Dev Tunnel のホスト名を、**Base URL** は `/` のままにします。

![**General** タブ設定画面。](../../../assets/images/make/copilot-studio-05/custom-connector-14.png)

画面下部の **Security** をクリックし、認証タイプを `OAuth 2.0`、プロバイダーを `Azure Active Directory` に設定します。

![認証タイプで OAuth 2.0 が選択されている。](../../../assets/images/make/copilot-studio-05/custom-connector-15.png)

設定項目:

- Client ID : Exercise 1 - Step 4 で登録した Consumer アプリの `<Client-Id>`  
- Client secret : 同じく `<Client-Secret>`  
- Authorization URL : 既定値  
- Tenant ID : Consumer アプリの `<Tenant-Id>`  
- Resource URL : Exercise 1 - Step 2 で設定した `<Application-ID-URI>` (`api://<Client-Id>`)  
- Enable on-behalf-of login : `False`  
- Scope : `HR.Consume`  
- Redirect URL : 後ほど使用  

![OAuth 2.0 設定項目一覧。](../../../assets/images/make/copilot-studio-05/custom-connector-16.png)

右上の **Create connector** で保存すると **Security** タブが再読み込みされ、**Redirect URL** に値が入ります。その値をコピーし、Entra admin center で Consumer アプリに戻ります。1️⃣ **Authentication** → 2️⃣ **+ Add a platform**、3️⃣ **Web** を選択し、4️⃣ コピーした Redirect URL を貼り付けて 5️⃣ **Configure** します。

![Web 認証の構成画面。](../../../assets/images/make/copilot-studio-05/custom-connector-17.png)

![Redirect URL が構成された状態。](../../../assets/images/make/copilot-studio-05/custom-connector-18.png)

カスタム コネクタ画面に戻り **Definition** タブを確認すると、OpenAPI 仕様から取得した操作が一覧表示されます。変更は不要です。必要なら **Test** タブで API が動作するか確認できます。

<cc-end-step lab="mcs5" exercise="2" step="1" />

### Step 2: カスタム コネクタのテスト

**Test** タブの左側に操作一覧が表示されます。例として **getCandidates** を選び、**+ New connection** で接続を作成します。接続後 **Test operation** を押すと、画面下部にレスポンスが表示されます。

![カスタム コネクタのテスト画面。](../../../assets/images/make/copilot-studio-05/custom-connector-19.png)

<cc-end-step lab="mcs5" exercise="2" step="2" />

## エクササイズ 3 : カスタム コネクタの利用

このエクササイズでは、作成したカスタム コネクタを実際の エージェント から呼び出します。

### Step 1: エージェント からのカスタム コネクタ利用

まずブラウザーで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスします。1️⃣ エージェント 一覧から **Microsoft 365 Copilot** を選択します。

![Copilot Studio で Microsoft 365 Copilot エージェント を選択。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-01.png)

`Agentic HR` エージェント を編集し、**Actions** セクションで **+ Add action** をクリックします。[ラボ MCS4](../04-extending-m365-copilot){target=_blank} と同様に進めますが、今回は **Custom connector** グループで `HR-Services` を検索します。`HR-Services` コネクタで定義したアクションが表示されます。

`Get all candidates` アクションを選択し、接続を作成して以下のように構成します。

- Name : `Get all candidates`  
- Description : `Lists all the HR candidates from an external system`  
- Authentication : `User authentication`  

**Add action** で追加したら、ラボ MCS4 で作成した旧アクションは無効化します。アクション右の [...] をクリックし **Status** を `Off` に切り替えます。

![アクションの有効/無効切り替え。](../../../assets/images/make/copilot-studio-05/custom-connector-20.png)

エージェント を公開し、更新後に次のプロンプトで動作を確認します。

```text
Lists all the HR candidates from an external system
```

Microsoft 365 Copilot Chat が外部 REST API の利用許可を求めてくるので、**Allow once** もしくは **Always allow** を選択します。

![外部 REST API へのアクセス許可ダイアログ。](../../../assets/images/make/copilot-studio-05/custom-connector-21.png)

続いてサインインを要求されるので **Sign in to Agentic HR** を選択し、接続を確立します。その後同じプロンプトを再実行すると、HR Service プロジェクトの候補者一覧が表示され、下部のアイコンで外部サービスからの応答であることが分かります。

![候補者一覧の表示結果。](../../../assets/images/make/copilot-studio-05/custom-connector-23.png)

Visual Studio Code の **Terminal** にはトレースが表示され、`Token is valid for user <username>` と認証済みであることが確認できます。

![Terminal でのトレース表示。](../../../assets/images/make/copilot-studio-05/custom-connector-24.png)

これでカスタム コネクタを構成し、Microsoft 365 Copilot Chat で利用できました!

<cc-end-step lab="mcs5" exercise="3" step="1" />

---8<--- "ja/mcs-congratulations.md"

ラボ MCS5 - Power Platform カスタム コネクタ を完了しました!

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/05-connectors" />