---
search:
  exclude: true
---
# ラボ MCS5 - Power Platform custom connector

このラボでは、Microsoft Copilot Studio を使用して構築したエージェントに Power Platform カスタムコネクターを介して拡張する方法を理解していただきます。具体的には、カスタム REST API を利用して、人材募集用の候補者一覧（仮想）を管理します。API は以下の機能を提供します:

- 候補者の一覧表示
- 特定候補者の取得
- 新しい候補者の追加
- 候補者の削除

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/f_HrMbg6kOU" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早く把握できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>


Microsoft 365 Copilot 内の Copilot Studio では、これらの機能を利用して、以前の [ラボ MCS4](../04-extending-m365-copilot){target=_blank} で作成したエージェントの可能性をさらに引き出すことができます。

!!! note
    このラボは前のラボ、[ラボ MCS4](../04-extending-m365-copilot){target=_blank} を前提として構築されています。同じエージェントで作業を継続し、新たな機能で拡張することが可能です。

このラボで学習する内容:

- Power Platform カスタムコネクターを利用して REST API を公開する方法
- Power Platform における外部 REST API への通信を安全にする方法
- エージェントからカスタムコネクターを利用する方法

## エクササイズ 1 : REST API の作成

簡便さのため、このラボではあらかじめ構築された REST API を使用します。このエクササイズでは、ローカルで実行できるようにダウンロードと設定を行います。

### ステップ 1: REST API のダウンロードとテスト

サンプル REST API は、TypeScript および Node.js で構築された Azure Function で、名前は `HR Service` です。ソースコードは [こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/copilot-studio/path-m-lab-mcs5-connectors/hr-service&filename=hr-service){target=_blank} からダウンロード可能です。

zip ファイルからファイルを展開し、Visual Studio Code で対象フォルダーを開いてください。以下のスクリーンショットは、プロジェクト構造の概要を示しています。

![Visual Studio Code での HR Service プロジェクト概要。http フォルダにいくつかの .http ファイルがあり、src フォルダ内にはサンプルデータと実際の Azure Function、二つの Open API 仕様ファイル、いくつかの JSON 構成ファイルが存在します。](../../../assets/images/make/copilot-studio-05/custom-connector-01.png)

プロジェクト概要の主な要素:

- `http`: このフォルダーには Visual Studio Code で REST API をテストする際に役立ついくつかの .http ファイルがあります。
- `src/data/candidates.json`: この JSON ファイルは、サービスの初期データソースとして使用される仮想の候補者一覧を含んでいます。
- `src/functions/candidatesFunction.ts`: Azure Function の実際の実装です。
- `src/openapi.json`: JSON 形式で保存された Azure Function の Open API 仕様ファイルです。
- `src/openapi.yaml`: Yaml 形式で保存された Azure Function の Open API 仕様ファイルです。
- `askCandidateData.json`: 新しい候補者のデータを収集するための アダプティブカード の JSON です。
- `dev-tunnel-steps.md`: ローカルで実行中の REST API に対してリバースプロキシを確立する Dev Tunnel を構築するための簡単な手順です。
- `local.settings.json.sample`: このラボで後ほど使用するサンプル構成ファイルです。

`local.settings.json.sample` ファイルの名前を `local.settings.json` に変更し、F5 キーを押してプロジェクトを開始してください。
Visual Studio Code で `http/ht-service.http` ファイルを開き、`http://localhost:7071/api/candidates` に対する GET リクエストの近くにある **Send request** コマンドを選択して、新たなリクエストをトリガーし、候補者一覧を取得してください。
画面右側には、リクエストの出力結果が表示され、いくつかのレスポンスヘッダーおよび候補者の JSON 一覧が確認できます。

![Visual Studio Code での HTTP リクエストの実行例。左側にリクエスト一覧が記載された .http ファイルがあり、候補者一覧を取得するリクエストがハイライトされています。右側には GET リクエストのレスポンス（いくつかの HTTP ヘッダーと JSON ボディ）が表示され、下部には OAuth 無効に関するメッセージが出力された **Terminal** が表示されています。](../../../assets/images/make/copilot-studio-05/custom-connector-02.png)

**Terminal** ウィンドウの下部には、トリガーした API 呼び出しのトレースと `OAuth is disabled. Skipping token validation` というメッセージが表示されます。現時点では、API は匿名アクセス可能です。

<cc-end-step lab="mcs5" exercise="1" step="1" />

### ステップ 2: Entra ID への API 登録

次に、API へのアクセスを安全にするための設定を行います。まず、対象の Microsoft 365 テナントの作業用アカウントで、ブラウザを開き [https://entra.microsoft.com](https://entra.microsoft.com){target=_blank} にアクセスし、Microsoft Entra 管理センターにサインインしてください。サインイン後、左側のメニューバーから 1️⃣ **App registrations** を選択し、次に 2️⃣ **+ New registration** コマンドを選択して、対象テナントに新しいアプリケーションを登録します。

![Microsoft Entra 管理センターのユーザーインターフェイス。左側メニューの **App registration** と **+ New registration** コマンドがハイライトされています。](../../../assets/images/make/copilot-studio-05/custom-connector-03.png)

`Register an application` ページが表示されます。例として `HR-Service-API` などのアプリケーション名を入力してください。認証の対象を対象テナント内のみとし、画面下部の **Register** ボタンを選択してください。

![新しいアプリケーションを登録するページ。アプリケーション名「HR-Service-API」、シングルテナント認証の選択、アプリケーション登録ボタンがハイライトされています。](../../../assets/images/make/copilot-studio-05/custom-connector-04.png)

Microsoft Entra はアプリケーションを登録し、**Overview** ページに登録されたアプリケーションの情報を表示します。後ほど必要になるため、Client ID と Tenant ID の値をコピーしてください。

左側メニューから 1️⃣ **Expose an API** を選択し、次に 2️⃣ **+ Add a scope** を選択して、カスタム API 用の新たな権限スコープを追加します。初めてスコープを追加する際は、**Application ID URI** の構成が必要となります。初期値は `api://<Client-Id>` となっているはずです。**Save and continue** を選択して、アプリケーション固有の URI を保存してください。そして、3️⃣ 右側に表示されるパネルでスコープの設定を行い、4️⃣ **Add scope** を選択して操作を確定してください。

スコープを作成することにより、API 用のカスタム委任権限スコープを定義できます。API の利用者は、この権限スコープを含む OAuth 2.0 トークンを提供する必要があり、これにより API を利用可能となります。

![アプリケーションの新たな権限スコープの設定ページ。右側に新たな権限スコープの設定パネルが表示されています。](../../../assets/images/make/copilot-studio-05/custom-connector-05.png)

権限スコープ設定のための提案値は次の通りです:

- Scope name: スコープの実際の名称。例: `HR.Consume`
- Who can consent?: スコープに対して管理者のみが同意するか、管理者と通常のユーザーの両方が同意できるかを定義します。`Admins and users` を選択してください。
- Admin consent display name: 管理者同意用の短い表示名。例: `HR.Consume`
- Admin consent description: 管理者同意用のスコープ説明。例: `Allows consuming the HR Service`
- User consent display name: ユーザー同意用の短い表示名。例: `HR.Consume`
- User consent description: ユーザー同意用のスコープ説明。例: `Allows consuming the HR Service`
- State: スコープが **Enabled** か **Disabled** かを定義します。有効なままにしておきます。

権限スコープの構成が完了すると、アプリケーションに定義されたスコープ一覧に新しいスコープが表示されます。

![現在のアプリケーションに設定された権限スコープ。スコープ名、誰が同意できるか、管理者同意表示名、ユーザー同意表示名、そして有効状態が表示されています。](../../../assets/images/make/copilot-studio-05/custom-connector-06.png)

次に、左側メニューから 1️⃣ **Manifest** を選択し、2️⃣ **Microsoft Graph App Manifest (new)** を使用してマニフェストファイルの内容を編集、3️⃣ `requestedAccessTokenVersion` プロパティの値を `2` に更新してください。これは、API が v2.0 タイプの JWT トークンを期待していることを示します。

!!! note
    Microsoft Graph App Manifest とトークン v2.0 に関する追加情報は、記事 [Understand the app manifest (Microsoft Graph format)](https://learn.microsoft.com/en-us/entra/identity-platform/reference-microsoft-graph-app-manifest){target=_blank} をご参照ください。

![Entra アプリケーションのマニフェスト編集ページ。`requestedAccessTokenVersion` プロパティとその値 "2" がハイライトされています。](../../../assets/images/make/copilot-studio-05/custom-connector-07.png)

Visual Studio Code に戻り、刚登録したアプリケーションの設定に合わせて `local.settings.json` ファイルを更新してください。`<Client-ID>` と `<Tenant-ID>` のプレースホルダーを実際の値に置き換え、`UseOAuth` プロパティの値を `true` に変更してください。

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

REST API プロジェクトを再起動すると、API は保護され、Authorization ヘッダーに OAuth 2.0 トークンが含まれているかどうかを確認します。トークンが提供されない、または無効なトークンの場合、API は HTTP ステータス 401 （Unauthorized）で応答します。

<cc-end-step lab="mcs5" exercise="1" step="2" />

### ステップ 3: dev tunnel の構成

次に、REST API をパブリック URL で公開する必要があります。開発マシンでローカルに API プロジェクトを実行しているため、リバースプロキシツールを利用して `localhost` をパブリック URL 経由で公開する必要があります。簡単のため、Microsoft が提供する dev tunnel ツールを以下の手順で使用してください:

- [こちらの手順](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started){target=_blank} に従って、開発環境に dev tunnel をインストールしてください。
- 次のコマンドを実行して、dev tunnel にログインします:

```console
devtunnel user login
```

- 次のコマンド群を実行して、dev tunnel をホストしてください:

```console
devtunnel create hr-service -a --host-header unchanged
devtunnel port create hr-service -p 7071
devtunnel host hr-service
```

コマンドラインには、ホスティングポート、「Connect via browser」URL、ネットワークアクティビティを検査するための URL といった接続情報が表示されます。

![コンソールウィンドウで実行中の devtunnel。ホスティングポート、ブラウザ経由接続 URL、ネットワークアクティビティ検査用の URL が表示されています。](../../../assets/images/extend-m365-copilot-06/devtunnel-output.png)

「Connect via browser」URL をコピーし、安全な場所に保存してください。

ラボの演習を進める間、devtunnel コマンドを実行し続けてください。再起動が必要な場合は、最後のコマンド `devtunnel host hr-service` を再実行してください。

<cc-end-step lab="mcs5" exercise="1" step="3" />

### ステップ 4: Entra ID への Consumer 登録

Power Platform からカスタムコネクターを介して API を消費するためには、Microsoft Entra ID に consumer アプリケーションも登録する必要があります。[Microsoft Entra 管理センター](https://entra.microsoft.com){target=_blank} に戻り、左側のメニューバーから **App registrations** を再度選択し、**+ New registration** コマンドを選択して、対象テナントに新しいアプリケーションを登録します。今回は、新しいアプリケーション名を `HR-Service-Consumer` としてください。ステップ 1 と同様に、シングルテナント認証を構成して登録を行ってください。

Microsoft Entra はアプリケーションを登録し、**Overview** ページに新規登録されたアプリケーションの情報を表示します。先ほどのように、Client ID と Tenant ID の値をコピーしてください。

![Microsoft Entra ID で consumer アプリケーションの新しいクライアントシークレットを作成するページ。説明と有効期限を設定するフィールド、およびシークレット追加のコマンドが表示されています。](../../../assets/images/make/copilot-studio-05/custom-connector-08.png)

左側メニューから 1️⃣ **Certificates & Secrets** を選択し、次に 2️⃣ **+ New secret** を選択して、新しいクライアントシークレットを追加してください。その後、3️⃣ シークレットの名前と有効期間を設定し、4️⃣ **Add** コマンドを選択して新しいシークレットを作成します。新しいシークレットの値を先ほどコピーした Client ID と Tenant ID とともに安全な場所に保存してください。

次に、権限ページに切り替え、左側メニューから 1️⃣ **API permissions** を選択し、2️⃣ **+ Add a permission** を選択してください。右側に表示されたパネルで、3️⃣ **APIs my organization uses** を選択、検索して 4️⃣ `HR-Service-API` を選択してください。

![Microsoft Entra 管理センターの、consumer アプリケーションに新しい権限を付与するページ。右側パネルにテナントに登録された API の一覧が表示され、「HR-Service-API」がハイライトされています。](../../../assets/images/make/copilot-studio-05/custom-connector-09.png)

対象 API を選択すると、サイドパネルが更新され、先ほど設定した `HR.Consume` 型の委任権限を選択できるようになります。権限を選択後、**Add permission** コマンドを選択して、consumer アプリケーションに権限を追加してください。
権限が追加されたら、**Grand admin consent for ...** コマンドを選択し、アプリケーションへの権限付与を完了してください。

![アプリケーションに権限を付与する Microsoft Entra 管理センターのパネル。**Delegated permissions** グループが選択され、**HR.Consume** 権限がハイライトされています。**Add permission** コマンドが表示されています。](../../../assets/images/make/copilot-studio-05/custom-connector-10.png)

このプロセスの最後に、consumer アプリケーションは以下のスクリーンショットで示される権限が構成されます。

![consumer アプリケーションの権限。**User.Read** と **HR.Consume** の両権限が Delegated 型で表示されています。](../../../assets/images/make/copilot-studio-05/custom-connector-11.png)

今後の手順で構成を更新するため、consumer アプリケーションのタブを開いたままにしておいてください。

<cc-end-step lab="mcs5" exercise="1" step="4" />

## エクササイズ 2 : カスタムコネクターの作成

このエクササイズでは、HR Service API を消費するための Power Platform カスタムコネクターを作成します。

### ステップ 1: カスタムコネクターの作成

新しいカスタムコネクターを作成するには、ブラウザを開き、対象テナントの作業用アカウントで [https://make.powerautomate.com](https://make.powerautomate.com){target=_blank} にアクセスして Power Automate を起動してください。左側のメニューパネルから **More** → **Discover all** を選択し、**Custom connectors** を探します。頻繁に使用する場合は、このメニュー項目をピン留めすることも可能です。カスタムコネクターの一覧ページが表示されたら、**+ New custom connector** コマンドを選択し、**Import an OpenAPI file** を選んでください。

![Power Platform カスタムコネクターの作成メニュー。**Import an OpenAPI file** オプションがハイライトされています。](../../../assets/images/make/copilot-studio-05/custom-connector-12.png)

コネクター名を入力し、`HR-Service` の OpenAPI JSON ファイルを参照してください。ファイルは [こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/path-m-lab-mcs5-connectors/hr-service/src/openapi.json?raw=true){target=_blank} でも入手可能です。名前と Open API 仕様ファイルの指定後、**Continue** ボタンを選択してコネクターの作成を完了してください。

![OpenAPI JSON ファイルから新規カスタムコネクターを作成するダイアログ。コネクターの名前と OpenAPI 仕様ファイルのパスが表示され、**Continue** コマンドがハイライトされています。](../../../assets/images/make/copilot-studio-05/custom-connector-13.png)

複数のタブによる登録プロセスが表示されます。最初のタブは **General** で、ここでカスタムアイコン、カラー、説明を構成できます。また、**General** タブでは **Host** の値を設定する必要があります。ここには、エクササイズ 1 - ステップ 3 でコピーした dev tunnel URL のホスト名を入力してください。最後に、デフォルト値 `/` をそのまま使用できる **Base URL** を設定します。

![Power Platform カスタムコネクターの **General** 設定タブ。アイコン、背景色、説明、プロトコル（HTTP または HTTPS）、ホスト名、Base URL のフィールドがあり、画面下部に **Security** コマンドがあります。](../../../assets/images/make/copilot-studio-05/custom-connector-14.png)

画面下部の **Security** コマンドを選択して、コネクターのセキュリティ設定に切り替えてください。**Security** タブでは認証タイプとして `OAuth 2.0` を選択し、続けて `Azure Active Directory` をサポートする OAuth 2.0 プロトコルの種類として指定します。

![カスタムコネクターの **Security** タブでの認証タイプ設定。選択されている値は `OAuth 2.0` です。](../../../assets/images/make/copilot-studio-05/custom-connector-15.png)

`OAuth 2.0` と `Azure Active Directory` を選択すると、セキュリティ設定に必要な各項目の入力が求められます。具体的には次の項目です:

- Client ID: エクササイズ 1 - ステップ 4 で登録した consumer アプリケーションの `<Client-Id>`
- Client secret: 同じくエクササイズ 1 - ステップ 4 で登録した consumer アプリケーションの `<Client-Secret>`
- Authorization URL: Entra ID の認証 URL。GCC テナントを使用していない限り、デフォルト値のままで大丈夫です。
- Tenant ID: エクササイズ 1 - ステップ 4 で登録した consumer アプリケーションの `<Tenant-Id>`
- Resource URL: エクササイズ 1 - ステップ 2 で `HR-Service-API` アプリケーションに登録した `<Application-ID-URI>`。通常、`api://<Client-Id>` の形式となります（この `<Client-Id>` は `HR-Service-API` アプリケーションのものです）。
- Enable on-behalf-of login: `False` のままで維持してください。
- Scope: エクササイズ 1 - ステップ 2 で設定した `HR.Consume` スコープです。
- Redirect URL: これは読み取り専用のフィールドですが、後ほど使用します。

![`OAuth 2.0`（`Azure Active Directory` 選択時）の設定。Client ID、Client secret、Authorization URL、Tenant ID、Resource URL、Enabled on-behalf-of login、Scope、Redirect URL の各設定項目が表示されています。](../../../assets/images/make/copilot-studio-05/custom-connector-16.png)

右上隅の **Create connector** コマンドを選択して、コネクター設定を保存してください。コネクターが保存されると、**Security** タブが再読み込みされ、**Redirect URL** フィールドに実際の値が表示されます。その値をコピーし、Microsoft Entra ID 管理センターに戻ります。エクササイズ 1 - ステップ 4 で登録した consumer アプリケーションにアクセスし、左側のメニューから 1️⃣ **Authentication** を選択、次に 2️⃣ **+ Add a platform** を選びます。右側に表示されたパネルで、3️⃣ **Web** を選択し、4️⃣ 先ほどコピーした **Redirect URL** を貼り付け、5️⃣ **Configure** を選択して新設定を確定します。

![consumer アプリケーションの **Web** 認証用設定ページ。](../../../assets/images/make/copilot-studio-05/custom-connector-17.png)

これにより、Power Platform の認証フローで使用するリダイレクト URL として、consumer アプリケーションが構成されました。

![**Web** 認証用リダイレクト URL を設定した consumer アプリケーションのパネル。](../../../assets/images/make/copilot-studio-05/custom-connector-18.png)

その後、カスタムコネクター定義に戻り、**Definition** タブに切り替えます。ここには、OpenAPI 仕様ファイルから取得された REST API のすべての操作が表示されます。特に変更を加える必要はありません。**Test** タブに切り替えて、REST API が期待どおりに動作しているかテストすることもできます。

<cc-end-step lab="mcs5" exercise="2" step="1" />

### ステップ 2: カスタムコネクターのテスト

**Test** タブでは、左側に操作の一覧が表示されます。例として **getCandidates** 操作を選択し、**+ New connection** コマンドを選択して対象のコネクターに接続します。Power Platform のプロンプトに従い認証を完了すると、接続が確立されます。接続ができたら、**Test operation** コマンドを選択して操作をテストし、画面下部に出力結果を確認してください。

![Power Platform カスタムコネクターのテストページ。上部に構成済みの接続、中央にテストする操作、下部に HTTP リクエストの出力結果が表示されています。](../../../assets/images/make/copilot-studio-05/custom-connector-19.png)

<cc-end-step lab="mcs5" exercise="2" step="2" />

## エクササイズ 3 : カスタムコネクターの利用

このエクササイズでは、エクササイズ 2 で作成したカスタムコネクターを利用します。

### ステップ 1: エージェントからカスタムコネクターを利用する

このステップでは、[ラボ MCS4](../04-extending-m365-copilot){target=_blank} で作成した Microsoft 365 Copilot Chat 用エージェントからカスタムコネクターを利用します。

ブラウザを開き、対象テナントの作業用アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、Microsoft Copilot Studio を起動してください。

次に、1️⃣ Copilot Studio 内のエージェント一覧を参照し、2️⃣ **Microsoft 365 Copilot** という名前のエージェントを選択してください。

![エージェント一覧から **Microsoft 365 Copilot** エージェントを選択している Microsoft Copilot Studio のインターフェイス。](../../../assets/images/make/copilot-studio-04/create-agent-m365-copilot-chat-01.png)

次に、`Agentic HR` エージェントを編集し、**Actions** セクションに移動して **+ Add action** を選択してください。ラボ MCS4 - エクササイズ 2 - ステップ 1 で既に確認した手順に従ってください。ただし、今回は **Custom connector** アクショングループを選択し、`HR-Services` を検索します。エクササイズ 2 - ステップ 1 で作成した `HR-Services` コネクターに定義された操作が一覧表示されます。

`Get all candidates` アクションを選択し、対象のカスタムコネクターへの接続を確認してください。
アクションは以下のように構成します:

- Name: `Get all candidates`
- Description: `Lists all the HR candidates from an external system`
- Authentication: `User authentication`

**Add action** コマンドを選択してアクションを追加してください。新しいアクションを作成後、ラボ MCS4 - エクササイズ 2 - ステップ 1 で作成した古いアクションを無効にします。アクションを無効にするには、アクション横の三点リーダー (...) をクリックし、**Status** を `Off` に切り替えます。

![Microsoft 365 Copilot Chat 用エージェントでアクションの有効/無効を切り替えるステータスメニュー。](../../../assets/images/make/copilot-studio-05/custom-connector-20.png)

エージェントを公開し、更新されたら、Microsoft 365 Copilot Chat で次のプロンプトを使用して新しいアクションをテストしてください。

```text
Lists all the HR candidates from an external system
```

Microsoft 365 Copilot Chat は、外部 REST API の利用許可を求めるメッセージを表示します。複数回テストする場合は **Allow once**、今後のリクエストでも REST API を消費する場合は **Always allow** を選択してください。

![外部 REST API の利用許可を求める Microsoft 365 Copilot Chat のプロンプト。**Always allow**、**Allow once**、**Cancel** のコマンドが表示されています。](../../../assets/images/make/copilot-studio-05/custom-connector-21.png)

その後、Microsoft 365 Copilot Chat は安全に外部 REST API にアクセスするためにサインインするよう求めるメッセージを表示します。

![外部 REST API の利用のためにサインインを促す Microsoft 365 Copilot Chat のプロンプト。**Sign in to Agentic HR** コマンドで認証をトリガーします。](../../../assets/images/make/copilot-studio-05/custom-connector-22.png)

**Sign in to Agentic HR** を選択して認証し、対象のカスタムコネクターに接続してください。接続が確立されたら、Microsoft 365 Copilot Chat に戻り、先ほどと同じプロンプトを再実行します。HR Service プロジェクトで定義された候補者一覧が表示され、レスポンス下部には外部サービスからの応答であることを示すアイコンが確認できます。

![外部 API から取得された候補者一覧を提供している Microsoft 365 Copilot Chat。](../../../assets/images/make/copilot-studio-05/custom-connector-23.png)

最後に、Visual Studio Code に戻り、画面下部の **Terminal** エリアに、API による REST リクエストのトレースが表示されていることを確認してください。また、`Token is valid for user <username>` というメッセージがハイライトされ、Microsoft 365 Copilot 内から API を消費するユーザーに対して認証が成功していることが示されています。

![Visual Studio Code の **Terminal** ウィンドウにトレース情報が表示されています。](../../../assets/images/make/copilot-studio-05/custom-connector-24.png)

素晴らしいです！カスタムコネクターを構成し、Microsoft 365 Copilot Chat 内で利用できるようになりました！

<cc-end-step lab="mcs5" exercise="3" step="1" />

---8<--- "ja/mcs-congratulations.md"

ラボ MCS5 - Power Platform custom connector を完了しました！

<!-- 
<a href="../06-mcp">Start here</a> with Lab MCS6, to learn how to consume an MCP server in Copilot Studio.
<cc-next /> 
-->

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/05-connectors" />