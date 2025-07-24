---
search:
  exclude: true
---
# ラボ E6b - OAuth を使用した Entra ID 認証の追加（手動セットアップ）

このラボでは、OAuth 2.0 を使用して Entra ID をアイデンティティプロバイダーとして用いることで、API プラグインに認証を追加します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/1IhyztqkuJo" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を確認してください。</div>
            <div class="note-box">
            📘 <strong>注意事項:</strong>   このラボは前のラボ E5 を踏襲しています。ラボ E5 を完了している場合は、同じフォルダーで作業を続けることができます。完了していない場合は、<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> からラボ E5 のソリューションフォルダーをコピーし、そこでするようにしてください。
    このラボの完成ソリューションは、<a src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab06b-add-oauth/trey-research-lab06b-END" target="_blank">/src/extend-m365-copilot/path-e-lab06b-add-oauth/trey-research-lab06b-END</a> フォルダーにあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


!!! note
    このラボでは Entra ID の詳細なセットアップ手順が多数あります。
    Agents Toolkit の新バージョンが利用可能で、多くの手順を自動化できます。近々、より簡素化されたバージョンのラボを提供する予定です。

このラボでは、プラグインと API を保護するために使用される Entra ID アプリケーションを登録します。始める前に、アプリ情報の安全な保存場所を選んでください。以下の値を保存する必要があります:

~~~text
API Base URL: 
API service Application (client) ID: 
API service Directory (tenant) ID: 
Authorization endpoint: 
Token endpoint: 
API service client secret: 
API scope: 
Plugin service application (client) ID: 
Plugin service client secret: 
~~~

## エクササイズ 1: 永続的なデベロッパートンネルの設定（任意）

デフォルトでは、Agents Toolkit は、プロジェクトを起動するたびに新しいデベロッパートンネル、つまりローカルで動作する API にアクセスするための新しい URL を作成します。通常、Agents Toolkit は必要な場所で URL を自動更新するため問題ありませんが、このラボは手動セットアップなので、デバッガーを開始するたびに Entra ID と Teams Developer Portal で URL を手動更新する必要があります。そのため、変更されない URL の永続的なデベロッパートンネルを設定することをお勧めします。

??? Note "永続的なトンネルを設定したくない場合は、このノートを開いてください ▶▶▶"
    Agents Toolkit が提供するデベロッパートンネルを使用しても構いません。プロジェクトが動作したら、ターミナルタブ 1️⃣ で「Start local tunnel」ターミナル 2️⃣ を選択し、Forwarding URL 3️⃣ をコピーしてください。ただし、この URL はプロジェクト開始のたびに変わるため、アプリ登録の返信 URL（エクササイズ 2 のステップ 1）と Teams Developer Portal の URL（エクササイズ 5 のステップ 1）を手動で更新する必要があります。
    ![Developer tunnel URL](../assets/images/extend-m365-copilot-06/oauth-A0.png)

### ステップ 1: デベロッパートンネル CLI のインストール

以下はデベロッパートンネルをインストールするためのコマンドです。[Developer Tunnel の完全な手順とダウンロードリンクはここにあります。](https://learn.microsoft.com/azure/developer/dev-tunnels/get-started){target=_blank} 

| OS | コマンド |
| --- | --- |
| Windows | `winget install Microsoft.devtunnel` |
| Mac OS | `brew install --cask devtunnel` |
| Linux | `curl -sL https://aka.ms/DevTunnelCliInstall | bash` |

!!! tip
    devtunnel コマンドを利用する前に、コマンドラインを再起動してファイルパスを更新する必要がある場合があります。

インストールが完了したら、ログインが必要です。Microsoft 365 アカウントを使用してログインできます。

~~~sh
devtunnel user login
~~~

演習中は devtunnel コマンドを実行状態のままにしておいてください。再起動が必要な場合は、最後のコマンド `devtunnel user login` を再実行してください。

<cc-end-step lab="e6b" exercise="1" step="1" />

### ステップ 2: トンネルの作成とホスティング

次に、Azure Functions のローカルポート（7071）に対して永続的なトンネルを設定する必要があります。
以下のコマンドを使用し、必要に応じて "mytunnel" の代わりに任意の名前を指定してください。

~~~sh
devtunnel create mytunnel -a --host-header unchanged
devtunnel port create mytunnel -p 7071
devtunnel host mytunnel
~~~

コマンドラインには接続情報が表示されます。例えば、次のような情報です:

![コンソールウィンドウ内で実行中の devtunnel の表示。ホスティングポート、ブラウザー経由の接続 URL、およびネットワークアクティビティを検査するための URL が示されています。](../assets/images/extend-m365-copilot-06/devtunnel-output.png)

「Connect via browser」URL をコピーし、「API Base URL」として保存してください。

<cc-end-step lab="e6b" exercise="1" step="2" />

### ステップ 3: プロジェクト内の動的に生成されたトンネルの無効化

プロジェクトがローカルで動作している場合は停止してください。その後、[\.vscode\tasks.json](https://github.com/microsoft/copilot-camp/blob/main/src/extend-m365-copilot/path-e-lab06-add-auth/trey-research-lab06-END/.vscode/tasks.json){target=_blank} を編集し、「Start Teams App task」を探します。「Start local tunnel」の依存関係をコメントアウトし、その代わりに「Start Azurite emulator」の依存関係を追加してください。結果として、タスクは以下のようになります:

~~~json
{
    "label": "Start Teams App Locally",
    "dependsOn": [
        "Validate prerequisites",
        //"Start local tunnel",
        "Start Azurite emulator",
        "Create resources",
        "Build project",
        "Start application"
    ],
    "dependsOrder": "sequence"
},
~~~
<cc-end-step lab="e6b" exercise="1" step="3" />

### ステップ 4: サーバー URL の手動上書き

**env/.env.local** を開き、OPENAPI_SERVER_URL の値を永続的なトンネル URL に変更してください。

<cc-end-step lab="e6b" exercise="1" step="4" />

## エクササイズ 2: API 用の Entra ID アプリケーションの登録

### ステップ 1: 新しい Entra ID アプリ登録の追加

[Microsoft 365 Admin center](https://portal.office.com/AdminPortal/){target=_blank} あるいは直接 [https://entra.microsoft.com/](https://entra.microsoft.com/){target=_blank} から Entra ID 管理センターにアクセスしてください。開発テナントにログインしていることを確認してください。

画面に入ったら、「Identity」 1️⃣ をクリックし、その後「Applications」 2️⃣、そして「App registrations」 3️⃣ をクリックします。最後に、"+" 4️⃣ をクリックして新しいアプリ登録を追加してください。

![Microsoft Entra 管理センターで、登録されているアプリケーションの一覧と『New regitration』作成ボタンが表示されている様子。](../assets/images/extend-m365-copilot-06/oauth-A2.png)

例えば「My API Service」 1️⃣ といった、一意かつ説明的な名前を付けます。「Supported account types」として「Accounts in this organizational directory only (Microsoft only - single tenant)」 2️⃣ を選択。さらに、「Redirect URI (optional)」では「Web」を選択し、デベロッパートンネルの URL を入力してください 3️⃣。 

!!! Note "永続的なデベロッパートンネル URL を作成していない場合..."
    アプリケーションを起動するたびに、Agents Toolkit 内で新しいトンネル URL が作成されるので、「Redirect URI」フィールドをその都度新しい URL に更新する必要があります。

その後、「Register」 4️⃣ をクリックしてアプリケーションを登録してください。

![アプリケーションの名前、サポートされるアプリケーションタイプ、およびリダイレクト URI を入力する画面。『Register』ボタンも確認できます。](../assets/images/extend-m365-copilot-06/oauth-A4.png)

<cc-end-step lab="e6b" exercise="2" step="1" />

### ステップ 2: アプリケーション情報の安全な保管
Application ID（Client ID とも呼ばれます） 1️⃣ と Directory ID（Tenant ID とも呼ばれます） 2️⃣ を安全な場所に保存してください。後で必要になります。その後、Endpoints ボタン 3️⃣ をクリックして Endpoints フライアウトを開きます。

![登録されたアプリケーションの概要ページ。ここで Application ID と Directory ID のコピーや『Endpoints』コマンドの確認ができます。](../assets/images/extend-m365-copilot-06/oauth-A5.png)

次に、「OAuth 2.0 authorization endpoint (v2)」 1️⃣ と「OAuth 2.0 token endpoint (v2)」 2️⃣ という名前の2つのエンドポイント URL をコピーし、同じ安全な場所に保存してください。

![アプリケーションの Endpoints を表示するパネル。『OAuth 2.0 authorization endpoint (v2)』と『OAuth 2.0 token endpoint (v2)』のコピー ボタンがハイライトされています。](../assets/images/extend-m365-copilot-06/oauth-A7.png)

<cc-end-step lab="e6b" exercise="2" step="2" />

### ステップ 3: クライアント シークレットの作成

次に、「Certificates & secrets」 1️⃣ に移動し、「+ New client secret」 2️⃣ をクリックします。シークレットに名前を付け、期間を選択し、*Add* ボタンを押してください。シークレットが表示されます。シークレットは作成時にのみ表示されるので、必ずコピーして安全な場所に保管してください。

![『Certificates &amp; secrets』ページ。ここから『New client secret』を作成できます。](../assets/images/extend-m365-copilot-06/oauth-A11.png)

<cc-end-step lab="e6b" exercise="2" step="3" />

### ステップ 4: API Scope の公開

API への呼び出しを検証するために、API を呼び出す権限を表す API Scope を公開する必要があります。特定の操作を API 経由で許可するなど、非常に具体的なものにすることも可能ですが、ここではシンプルな Scope「access_as_user」を設定します。

まず、「Expose an API」 1️⃣ に移動し、「Application ID URI」の横にある「Add」 2️⃣ をクリックします。右側にフライアウトが表示されます。デフォルト値である api://＜your application (client) ID＞ のままで構いません。「Save and continue」 3️⃣ をクリックして進みます。

![登録されたアプリケーションの『Expose an API』ページ。サイドパネルでアプリケーションの一意な URI を設定しています。](../assets/images/extend-m365-copilot-06/oauth-A15.png)

「Add a scope」欄には、Scope 名として「access_as_user」 1️⃣ を入力します。残りのフィールドには以下の値を入力してください:

| フィールド | 値 |
| --- | --- |
| Who can consent? | Admins and users |
| Admin consent display name | Access My API as the user |
| Admin consent description | Allows an API to access My API as a user |
| User consent display name | Access My API as you |
| User consent description | Allows an app to access My API as you |
| State | Enabled |

入力が完了したら、「Add Scope」 2️⃣ をクリックしてください。

![登録されたアプリケーションの『Expose an API』ページで、Scope 名、同意可能なユーザー、管理者およびユーザーの表示名と説明、状態フラグの設定が表示されているサイドパネル。](../assets/images/extend-m365-copilot-06/oauth-A17.png)

<cc-end-step lab="e6b" exercise="2" step="4" />

### ステップ 5: API Scope の保存
コピーした Scope を「API Scope」として安全な場所に保管してください。

![カスタムスコープが作成された後の登録済みアプリケーションの『Expose an API』ページ。Scope 名のコピー ボタンがハイライトされています。](../assets/images/extend-m365-copilot-06/oauth-A17b.png)

<cc-end-step lab="e6b" exercise="2" step="5" />

## エクササイズ 3: プラグイン用 Entra ID アプリケーションの登録

これで API 用のアプリケーションが登録されたので、次はプラグイン自体の登録を行います。

!!! Note "2 つの Entra ID アプリ登録について"
    このラボは、既に API 用の登録済みアプリケーションを持ち、これをエージェントにプラグインとして統合する方法を示しています。そのため、アプリ登録は 2 つになっています。 
    ゼロから API を作成する場合、OAuth を安全に実装するために必ずしも 2 つのアプリ登録が必要というわけではありません。代わりに、既存のアプリ登録を使用できます。1 つのアプリ登録で行う方法については、この [learn module](https://learn.microsoft.com/en-us/training/modules/copilot-declarative-agent-api-plugin-auth/5-exercise-integrate-api-plugin-oauth){target=_blank} をご覧ください。

### ステップ 1: プラグインの登録

「App registrations」 セクションに戻り、2 つ目のアプリケーションを登録します。今回は「My API Plugin」 1️⃣ と名付け、「Supported account types」として再び「Accounts in this organizational directory only」 2️⃣ を設定してください。

「Redirect URL」では「Web」を選択し、今回は `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect` 3️⃣ に設定します。これは、API Plugin アプリケーションへのログイン完了後の Teams の処理場所です。

「Register」 ボタン 4️⃣ をクリックして登録を完了してください。

![アプリケーションの名前、サポートされるアプリケーションタイプ、およびリダイレクト URI を入力する画面。『Register』ボタンが表示されています。](../assets/images/extend-m365-copilot-06/oauth-B5.png)

先ほどと同様に、アプリの「Overview」ページを表示し、API Plugin アプリの Application (client) ID を保存してください。

<cc-end-step lab="e6b" exercise="3" step="1" />

### ステップ 2: クライアント シークレットの作成

先ほどと同様に、クライアント シークレットを作成し、安全な場所に「Plugin service client secret」として保存してください。

<cc-end-step lab="e6b" exercise="3" step="2" />

### ステップ 3: パーミッションの付与

プラグインは API サービスを呼び出す必要があるため、当然ながらそのための権限が必要です。まず「API permissions」に移動します。そして、「APIs my organization uses」タブ 1️⃣ をクリックし、API サービスを検索します 2️⃣。検索結果から API サービスを選択します 3️⃣。

![登録されたアプリケーションの『API permissions』ページ。サイドパネルで新しいパーミッション付与の操作が表示され、『APIs my organization uses』タブでは結果に 'My API Service' が表示されています。](../assets/images/extend-m365-copilot-06/oauth-B11.png)

次に、API サービスアプリケーションが表示されるので、「access_as_user」パーミッションを選択し、「Add permission」をクリックしてください。

![登録済みアプリケーションにパーミッションを追加するためのサイドパネル。『access_as_user』パーミッションが選択され、ハイライト表示され、『Add permission』ボタンも表示されています。](../assets/images/extend-m365-copilot-06/oauth-B12.png)

<cc-end-step lab="e6b" exercise="3" step="3" />

## エクササイズ 4: プラグインのアプリケーション ID を API アプリ登録に更新

### ステップ 1: API サービスアプリにプラグインの ID を追加

API Service アプリケーションは、API Plugin アプリケーションがトークンを発行することを許可する必要があります。そのために、API Service アプリケーションの App Registration に戻り、「Manifest」を選択し、`knownClientApplications` 1️⃣ のエントリーを探してください。そこに My Plugin App のクライアント ID を以下のように追加します:

~~~json
"knownClientApplications": [
    "<your-plugin-client-id>"
]
~~~

完了したら、「Save」 2️⃣ をクリックしてください。

![アプリケーションの Manifest 編集ページ。『knownClientApplications』エントリーと「Save」ボタンがハイライトされています。](../assets/images/extend-m365-copilot-06/oauth-C4.png)

<cc-end-step lab="e6b" exercise="4" step="1" />

## エクササイズ 5: Teams Developer Portal で OAuth 情報の登録

これでアプリはすべて設定されましたが、Microsoft 365 はまだそれについて何も知りません。アプリ マニフェストにシークレットを保存するのは安全ではないため、Teams ではこの情報を安全に保存するための場所が用意されています。このエクササイズでは、Teams Developer Portal を使用して OAuth クライアントアプリケーションを登録し、Copilot がユーザー認証を行えるようにします。

### ステップ 1: 新しい OAuth クライアント登録の作成

[https://dev.teams.microsoft.com](https://dev.teams.microsoft.com){target=_blank} の Teams Developer Portal にアクセスし、「Tools」 1️⃣ をクリック、その後「OAuth client registration」 2️⃣ を選択します。

![Teams Developer Portal の UI。『Tools』と『OAuth client registration』がハイライトされています。](../assets/images/extend-m365-copilot-06/oauth-C2.png)

クライアントアプリケーションがまだ登録されていなければ「Register client」を、既にある場合は「+ New OAuth client registration」をクリックし、フォームに入力してください。いくつかのフィールドは、これまでに安全な場所に保存してきた情報から取得します。

| フィールド | 値 |
| --- | --- |
| Name | 記憶に残る名前を選んでください |
| Base URL | API service Base URL |
| Restrict usage by org | 「My organization only」を選択 |
| Restrict usage by app | 「Any Teams app」を選択 |
| Client ID | **Plugin Application** (client) ID |
| Client secret | **Plugin Application** client secret |
| Authorization endpoint | API Service と API Plugin アプリで同じ認証エンドポイント |
| Token endpoint | API Service と API Plugin アプリで同じトークン エンドポイント |
| Refresh endpoint | API Service と API Plugin アプリで同じトークン エンドポイント |
| API scope | API Service アプリの scope |

![Teams Developer Portal で新しい OAuth クライアントを登録するページ。クライアント登録設定のための各種フィールドが表示されています。](../assets/images/extend-m365-copilot-06/oauth-C3ab.png)

!!! Note "永続的なデベロッパートンネル URL を作成していない場合..."
    アプリケーションを起動するたびに、Agents Toolkit 内で新しいトンネル URL が生成されるので、「Base URL」フィールドもその都度新しいトンネル URL に更新する必要があります。

<cc-end-step lab="e6b" exercise="5" step="1" />

### ステップ 2: OAuth 登録 ID の保存

![Teams Developer Portal で OAuth クライアント登録後の結果。登録確認のボックスと参照用の『Registration ID』が表示されています。](../assets/images/extend-m365-copilot-06/oauth-E1.png)

ポータル上に OAuth クライアント登録 ID が表示されます。次のステップで使用するために保存してください。

<cc-end-step lab="e6b" exercise="5" step="2" />

## エクササイズ 6: アプリケーション パッケージの更新

### ステップ 1: プラグインファイルの更新

Visual Studio Code で作業フォルダーを開いてください。**appPackage** フォルダー内の **trey-plugin.json** ファイルを開きます。ここには、Copilot が必要とする情報が格納されていますが、Open API Specification (OAS) ファイルには存在しません。

`Runtimes` の下に、`"auth": { "type": "None" }` として記載され、現在 API が認証されていない状態を示しています。これを以下のように変更し、Copilot に OAuth 設定を使用して認証するよう指示してください。

~~~json
"auth": {
  "type": "OAuthPluginVault",
  "reference_id":  "${{OAUTH_CLIENT_REGISTRATION_ID}}"
},
~~~

次に、**env/.env.local** ファイルに以下の行を追加してください:

~~~text
OAUTH_CLIENT_REGISTRATION_ID=<registration id you saved in the previous exercise>
~~~

次回、API プラグインを起動してプロンプトが表示されたとき、サインインを促されるはずです。
しかし、アプリケーションのセキュリティは確保されていません。誰でもインターネットから呼び出すことが可能です！
次のステップでは、実際の Microsoft 365 ユーザーとして API にアクセスするために、有効なログインを確認するコードを更新します。（「Avery Howard」は、Microsoft の架空の名前生成器から得た名前です。）

<cc-end-step lab="e6b" exercise="6" step="1" />

## エクササイズ 7: アプリケーション コードの更新

### ステップ 1: JWT バリデーションライブラリのインストール

作業ディレクトリのコマンドラインから、以下のコマンドを実行してください：

~~~sh
npm i jwt-validate
~~~

これにより、Entra ID からの認証トークンのバリデーションを行うライブラリがインストールされます。

!!! warning
    Microsoft は NodeJS 用の Entra ID トークンのサポートライブラリを提供していません。その代わりに、[こちらの詳細ドキュメント](https://learn.microsoft.com/entra/identity-platform/access-tokens#validate-tokens){target=_blank} を参照し、独自に実装してください。[Microsoft MVP Andrew Connell](https://www.voitanos.io/pages/about/#whos-behind-voitanos){target=_blank} による[もう一つの有用な記事](https://www.voitanos.io/blog/validating-entra-id-generated-oauth-tokens/){target=_blank}も参考になります。

    **このラボでは、[コミュニティ提供ライブラリ](https://www.npmjs.com/package/jwt-validate){target=_blank}（Waldek Mastykarz により提供）を使用します。このライブラリは上記のガイダンスに沿ったものです。なお、このライブラリは Microsoft によってサポートされておらず、MIT ライセンスの下で提供されるため、自己責任で使用してください。**
    
    サポートされるライブラリの進捗を追跡したい場合は、[こちらの Github イシュー](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/6113){target=_blank} をご覧ください。

<cc-end-step lab="e6b" exercise="7" step="1" />

### ステップ 2: API 用環境変数の追加

作業ディレクトリ内の **env** フォルダーにある **env.local** を開き、API Service アプリのクライアント ID とテナント ID 用の以下の行を追加してください。

~~~text
API_APPLICATION_ID=<your-api-service-client-id>
API_TENANT_ID=<your-tenant-id>
~~~

これらの値を Agents Toolkit 内で動作するコードで利用可能にするため、作業ディレクトリ直下の **teamsapp.local.yml** ファイルも更新する必要があります。コメント「Generate runtime environment variables」を探し、新しい値を STORAGE_ACCOUNT_CONNECTION_STRING の下に追加してください:

~~~yaml
  - uses: file/createOrUpdateEnvironmentFile
    with:
      target: ./.localConfigs
      envs:
        STORAGE_ACCOUNT_CONNECTION_STRING: ${{SECRET_STORAGE_ACCOUNT_CONNECTION_STRING}},
        API_APPLICATION_ID: ${{API_APPLICATION_ID}}
        API_TENANT_ID: ${{API_TENANT_ID}}
~~~

<cc-end-step lab="e6b" exercise="7" step="2" />

### ステップ 3: アイデンティティサービスの更新

この時点で、OAuth ログインは機能し、有効なアクセストークンが取得できるはずですが、コードがトークンの有効性を確認しなければ、ソリューションは安全ではありません。このステップでは、トークンの検証と、ユーザーの名前や ID などの情報の抽出を行うコードを追加します。

**src/services** フォルダー内の **IdentityService.ts** を開いてください。 
他の `import` 文とともに、次の行をファイルの先頭に追加します:

~~~typescript
import { TokenValidator, ValidateTokenOptions, getEntraJwksUri } from 'jwt-validate';
~~~

その後、`class Identity` の直後に次の行を追加してください:

~~~typescript
    private validator: TokenValidator;
~~~

次に、以下のコメントを探してください:

~~~typescript
// ** INSERT REQUEST VALIDATION HERE (see Lab E6) **
~~~

このコメントを次のコードで置き換えてください:

~~~typescript
// ユーザーの基本情報を取得するため、トークンのバリデーションを試みます
try {
    const { API_APPLICATION_ID, API_TENANT_ID } = process.env;
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        throw new HttpError(401, "Authorization token not found");
    }

    // Microsoft Entra の共通テナント用に新しいトークンバリデータを作成します
    if (!this.validator) {
        // 今後のリクエストで利用するため、新しいバリデータオブジェクトを作成し、Entra ID の署名キーをキャッシュします
        // マルチテナントの場合は、以下を使用:
        // const entraJwksUri = await getEntraJwksUri();
        const entraJwksUri = await getEntraJwksUri(API_TENANT_ID);
        this.validator = new TokenValidator({
            jwksUri: entraJwksUri
        });
        console.log ("Token validator created");
    }

    // シングルテナントアプリケーション向けのオプション
    const options: ValidateTokenOptions = {
        audience: `api://${API_APPLICATION_ID}`,
        issuer: `https://sts.windows.net/${API_TENANT_ID}/`,
        // ※ マルチテナントアプリの場合は、以下を参照:
        // issuer: "https://sts.windows.net/common/",
        // また、許可されたテナントのリストを管理し、テストすることもできます
        //   allowedTenants: [process.env["AAD_APP_TENANT_ID"]],
        scp: ["access_as_user"]
    };

    // トークンのバリデーション
    const validToken = await this.validator.validateToken(token, options);

    userId = validToken.oid;
    userName = validToken.name;
    userEmail = validToken.upn;
    console.log(`Request ${this.requestNumber++}: Token is valid for user ${userName} (${userId})`);
}
catch (ex) {
    // トークンが存在しない、または無効の場合 - 401 エラーを返します
    console.error(ex);
    throw new HttpError(401, "Unauthorized");
}
~~~

!!! Note "コードから学ぶ"
    この新しいソースコードを確認してください。最初に、HTTPs リクエストの `Authorization` ヘッダーからトークンを取得します。このヘッダーは「Bearer」＋半角スペース＋トークンの形式になっており、JavaScript の `split(" ")` を使用してトークンのみを取得します。

    また、認証が何らかの理由で失敗した場合、コードは例外を投げます。Azure function は適切なエラーを返します。

    その後、`jwks-validate` ライブラリを用いたバリデータを作成します。この呼び出しは、Entra ID から最新の署名キーを非同期で読み込むため、実行に時間がかかる場合があります。

    次に、`ValidateTokenOptions` オブジェクトを設定します。このオブジェクトに基づいて、トークンが Entra ID の秘密鍵で署名されているだけでなく、以下も検証されます:

    * _audience_ は API service アプリの URI と同じでなければなりません。これにより、トークンが当 Web サービス専用であることが保証されます

    * _issuer_ は当テナントのセキュリティトークンサービスから発行されたものでなければなりません

    * _scope_ は、アプリ登録で定義した `"access_as_user"` と一致している必要があります。

    トークンが有効な場合、ライブラリは全ての「クレーム」を含むオブジェクトを返します。これには、ユーザーの一意な ID、名前、メールアドレスが含まれます。これらの値を使用して、「Avery Howard」に依存しないようにします。

!!! Note "アプリがマルチテナントの場合"
    上記コード内のコメントを確認し、マルチテナントアプリのトークン検証方法について確認してください。

コードが `userId` を取得すると、ユーザーの Consultant レコードを探します。これは従来は Avery Howard の ID にハードコードされていましたが、今後はログインしたユーザーの ID を使用し、データベースに該当のレコードがなければ新規作成します。

結果として、初回実行時にログインユーザーのためにデフォルトのスキルや役割を持つ新しい Consultant レコードが作成されます。デモ用に変更する場合は、[Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/){target=_blank} を使用して変更できます。

![コンサルタントテーブルを編集中の Azure Storage Explorer の様子。現在のユーザーがハイライトされています。](../assets/images/extend-m365-copilot-06/oauth-azure-storage-explorer.png)

プロジェクトの割り当ては `Assignment` テーブルに保存され、プロジェクト ID と割り当てられたコンサルタントの consultant ID が参照されています。

<cc-end-step lab="e6b" exercise="7" step="3" />

## エクササイズ 8: アプリケーションのテスト

アプリケーションのテスト前に、`appPackage\manifest.json` ファイル内のアプリパッケージのマニフェストバージョンを更新してください。以下の手順に従ってください:

1. プロジェクトの `appPackage` フォルダー内にある `manifest.json` ファイルを開きます。

2. JSON ファイル内の `version` フィールドを探してください。以下のようになっているはずです:  
   ```json
   "version": "1.0.0"
   ```

3. バージョン番号を小さい数値にインクリメントしてください。例えば、次のように変更します:  
   ```json
   "version": "1.0.1"
   ```

4. 変更を保存してください。

### ステップ 1: アプリケーションの (再)起動

前のラボからアプリが動作中の場合は、停止してアプリパッケージの再作成を強制してください。

その後、F5 を押してアプリを再実行し、従来通りインストールしてください。

プラグインに「What Trey projects am I assigned to?」とプロンプトを出してください。確認カードが表示され、API の呼び出しが許可されるかどうか確認される場合があります。ここでは認証は行われていませんので、「Allow Once」をクリックして進んでください。

![Microsoft 365 Copilot が、API の呼び出し許可を確認するカードを表示しています。『Always allow』、『Allow once』、『Cancel』ボタンがあります。](../assets/images/extend-m365-copilot-06/oauth-run-01small.png)

確認カードはログインカードに置き換えられます。
「Sign in to Trey」をクリックしてサインインしてください。最初はログインと権限への同意を求めるポップアップウィンドウが表示されます。以降は、Entra ID により資格情報がローカルブラウザにキャッシュされるため、表示されない場合があります。

![Microsoft 365 Copilot が、サインイン用のカードを表示しています。『Sign in to Trey』ボタンと『Cancel』ボタンがあります。](../assets/images/extend-m365-copilot-06/oauth-run-02small.png)

管理者によってユーザーによる同意が許可されていない場合、次のようなメッセージが表示されることがあります:
![API の利用に対して管理者の承認を求める Microsoft Entra のポップアップダイアログ。](../assets/images/extend-m365-copilot-06/need-admin-approval.png)

これは、管理者がテナント全体でユーザーによる同意を制限しているためです。この場合、プラグインの API 登録に対して、管理者に手動で全ユーザーに対するグローバル同意を付与してもらう必要があります。

![Microsoft Entra に登録された『API Plugin』アプリケーションの『API permissions』ページ。『Grant admin consent ...』コマンドがハイライトされています。](../assets/images/extend-m365-copilot-06/approval-admin.png)


ログインカードは、Copilot がプロンプトに対して返す応答へと置き換えられます。データベースに新規追加されたため、いまだプロジェクトに割り当てられていません。

データベースに新規追加されたため、プロジェクトの割り当てはありません。

![実際のユーザーがプロジェクトに割り当てられていない場合の『Trey Genie』エージェントの応答。](../assets/images/extend-m365-copilot-06/oauth-run-03bsmall.png)

Copilot に「木のグローブ プロジェクトに追加して」と指示してください。必要な値を含めなかった場合、Copilot は詳細の入力を求めます。

![現在のユーザーをプロジェクトに追加する際、情報が不足している場合に詳細を求める『Trey Genie』エージェントの応答。必要な情報が全て揃うと、アクションの確認が表示されます。](../assets/images/extend-m365-copilot-06/oauth-run-05.png)

次に、「What are my skills and what projects am I assigned to?」と尋ね、デフォルトのスキルとプロジェクトの割り当てを確認してください。

![](../assets/images/extend-m365-copilot-06/oauth-run-07.png)

<cc-end-step lab="e6b" exercise="8" step="1" />

---8<--- "ja/e-congratulations.md"

ラボ E6b、Entra ID 認証の手動セットアップの完了おめでとうございます！

何か面白いことに挑戦してみませんか？Copilot Connector をソリューションに追加してみてはいかがでしょうか？

<cc-next url="../07-add-graphconnector" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/06b-add-authentication" />