---
search:
  exclude: true
---
# ラボ 10: OAuth 保護付き MCP サーバーへの Declarative エージェント接続

このラボでは、**OAuth 2.0 保護**された Model Context Protocol (MCP) サーバーを使用して Zava Insurance の請求システムを稼働させ、Microsoft 365 Copilot の Declarative エージェントと統合します。ラボ 08 では匿名 MCP サーバーを扱いましたが、本ラボでは**Microsoft Entra ID 認証**を追加し、企業レベルのセキュリティで請求データへアクセスできるようにします。

## シナリオ

ラボ 08 の MCP サーバーを基盤として、**Zava Insurance** は本番運用のために請求システムを保護する必要があります。匿名 MCP サーバーは開発とテストには最適でしたが、セキュリティ チームは本番環境へのデプロイ前に OAuth 2.0 認証を必須としています。開発チームは **Microsoft Entra ID** 認証を組み込み、認可されたユーザーのみが機密性の高い請求データにアクセスできるようにしなければなりません。この認証付き MCP サーバーは JWT トークンを検証し、スコープベースの権限を実装し、**RFC 9728** に準拠した保護リソース メタデータのディスカバリーを行います。これにより、**Microsoft 365 Copilot** の Declarative エージェントとの安全な統合が実現します。

---

## 🎯 ラボの目標

このラボを完了すると、次のことができるようになります。

- Microsoft Entra ID アプリ登録を作成し、OAuth 2.0 認証を設定する  
- セキュアな MCP サーバー運用のための環境変数を構成する  
- OAuth 保護付き Zava MCP サーバーをビルドして実行する  
- Microsoft Entra ID での JWT トークン検証の仕組みを理解する  
- 保護された MCP サーバーに対して認証を行う Declarative エージェントを作成する  
- 認証済みの自然言語クエリでエージェントをテストする  

---

## 📚 前提条件

ラボを始める前に、以下が準備できていることを確認してください。

- **Node.js 22+**  
- **VS Code** と **Microsoft 365 Agents Toolkit 拡張機能** v6.4.2 以降  
- Copilot ライセンスを含む **Microsoft 365 開発者アカウント**  
- Microsoft Entra ID にアクセスできる **Azure サブスクリプション**  
- TypeScript/JavaScript、REST API、JSON、OAuth 2.0 の基礎知識  
- VS Code Dev Tunnels 用の GitHub アカウント  
- **ラボ 08** を完了していること（推奨）  

---

## Exercise 1: 開発環境のセットアップ

この演習では、認証付き MCP サーバーのコードをクローンし、ローカル開発環境を構築します。

### Step 1: リポジトリをクローンする

ターミナルを開き、次を実行します。

```bash
git clone https://github.com/microsoft/copilot-camp.git
cd src/extend-m365-copilot/path-e-lab10-mcp-auth/zava-mcp-server
```
<cc-end-step lab="e10" exercise="1" step="1" />

### Step 2: 依存関係をインストールする

必須パッケージをインストールします。

```bash
npm install
```

主要な依存関係がインストールされます。

<cc-end-step lab="e10" exercise="1" step="2" />

### Step 3: プロジェクト構成を確認する

VS Code でプロジェクトを開きます。

```bash
code .
```

主なディレクトリ:

- `src/` - TypeScript ソースコード  
- `src/auth/` - OAuth 認証モジュール（本ラボで追加）  
- `data/` - サンプル JSON データ  

`src/auth/oauth.ts` にはトークン検証と保護リソース メタデータのための OAuth 2.0 実装が含まれています。

<cc-end-step lab="e10" exercise="1" step="3" />

これでサンプル データと認証機能を備えたコードベースが準備できました。

---

## Exercise 2: Microsoft Entra ID アプリ登録の作成

認証付き MCP サーバーを実行する前に、OAuth 2.0 認証を処理するためのアプリケーションを Microsoft Entra ID に登録します。

### Step 1: アプリ登録を作成する

1. [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID** → **App registrations** に移動  
2. **New registration** をクリック  
3. 以下を設定  
   - **Name**: `Zava Claims MCP Server`  
   - **Supported account types**: `Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)`  
   - **Redirect URI**: 空欄（次のステップで設定）  
4. **Register** をクリック  
5. **Application (client) ID** をコピーしておく  

<cc-end-step lab="e10" exercise="2" step="1" />

### Step 2: プラットフォーム リダイレクト URI の構成

登録後、各プラットフォーム用のリダイレクト URI を設定します。

1. **Authentication** → **Platform configurations** に移動  
2. **Add a Web platform** を追加:  
   - **Add a platform** → **Web** を選択  
   - 以下のリダイレクト URI を追加  
     - `http://127.0.0.1:33418`  
     - `https://vscode.dev/redirect`  
     - `https://teams.microsoft.com/api/platform/v1.0/oAuthRedirect`  
   - **Implicit grant and hybrid flows** の両方を **無効** のままにする  
   - **Configure** をクリック  

<cc-end-step lab="e10" exercise="2" step="2" />

### Step 3: クライアント シークレットを作成する

1. **Certificates & secrets** → **Client secrets** に移動  
2. **New client secret** をクリック  
3. 説明を入力（例: `zava-mcp-secret`）し、有効期限を選択（推奨: 24 か月）  
4. **Add** をクリック  
5. **シークレット値を即座にコピー** - 再表示されません  

<cc-end-step lab="e10" exercise="2" step="3" />

### Step 4: API を公開する

1. **Expose an API** に移動  
2. **Application ID URI** の横にある **Set** をクリックし、デフォルト形式 `api://your-client-id` を承認  
3. **Add a scope** をクリックし、次を設定  
   - **Scope name**: `access_as_user`  
   - **Who can consent**: Admins and users  
   - **Admin consent display name**: `Access Zava Claims System`  
   - **Admin consent description**: `Allows the app to access Zava Claims data on behalf of the signed-in user`  
   - **User consent display name**: `Access Zava Claims System`  
   - **User consent description**: `Allows this app to access your Zava Claims data on your behalf`  
   - **State**: Enabled  
4. **Add scope** をクリック  

Microsoft Entra ID のアプリ登録が完了しました。

<cc-end-step lab="e10" exercise="2" step="4" />

---

## Exercise 3: 環境設定とローカル データベースの起動

この演習では、OAuth 用の環境変数を設定し、ローカル データベースを起動します。

### Step 1: Dev Tunnel で公開 URL を取得する

MCP サーバー用に HTTPS の公開 URL が必要です。

1. VS Code のターミナル パネルで **Ports** タブを選択  
2. **Forward a Port** をクリックし、ポート `3001` を入力  
3. 転送されたポート アドレスを右クリック → **Port Visibility** → **Public**  
4. トンネル URL をコピー（例: `https://abc123def456.use.devtunnels.ms`）  

**この URL を保存** - 後ほど環境変数に使用します。

<cc-end-step lab="e10" exercise="3" step="1" />

### Step 2: 環境変数を設定する

`zava-mcp-server` ディレクトリの `.env` ファイルを作成または更新し、OAuth 設定を追加します。

```bash
# OAuth Configuration (Required for authentication)
OAUTH_CLIENT_ID=<your-application-client-id>
OAUTH_CLIENT_SECRET=<your-client-secret-value>
OAUTH_AUTHORITY=https://login.microsoftonline.com/common
OAUTH_REDIRECT_URI=http://localhost:6274/oauth/callback/debug
OAUTH_SCOPES=api://<your-application-client-id>/access_as_user

# Resource Identifier (for MCP Inspector and RFC 9728 metadata)
RESOURCE_IDENTIFIER=<your-tunnel-url>

# CORS Configuration
ADDITIONAL_ALLOWED_ORIGINS=<your-tunnel-url>,http://localhost:6274
SERVER_BASE_URL=<your-tunnel-url>

# Server Configuration
PORT=3001
HOST=127.0.0.1
NODE_ENV=development

# Storage Configuration
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;"
```

プレースホルダーを置き換えてください。

- `<your-application-client-id>` - Entra ID アプリ登録の Application (client) ID  
- `<your-client-secret-value>` - コピーしたクライアント シークレット  
- `<your-tunnel-url>` - Step 1 で取得した Dev トンネル URL（例: `https://abc123def456.use.devtunnels.ms`）  

<cc-end-step lab="e10" exercise="3" step="2" />

### Step 3: Azure Storage エミュレーターを起動する

**Terminal 1** で Azurite エミュレーターを起動します。

```bash
npm run start:azurite
```

次のような出力が表示されます。  
```
Azurite Blob service is starting at http://127.0.0.1:10000
Azurite Queue service is starting at http://127.0.0.1:10001
Azurite Table service is starting at http://127.0.0.1:10002
```

**このターミナルは開いたままにしてください** - これがローカル データベース サーバーです。

<cc-end-step lab="e10" exercise="3" step="3" />

### Step 4: サンプル請求データを読み込む

**Terminal 2** で Zava のサンプル データを初期化します。

```bash
npm run init-data
```

読み込まれるデータ:

- **Claims** - 風害、水害、火災などの事例  
- **Contractors** - 屋根修理、水害復旧、総合請負業者  
- **Inspections** - 予定済みおよび完了済みの検査タスク  
- **Inspectors** - 専門分野を持つフィールド検査員  

すべてのテーブルが初期化された旨のメッセージが表示されます。

<cc-end-step lab="e10" exercise="3" step="4" />

---

## Exercise 4: OAuth 保護付き MCP サーバーを起動する

次に、OAuth トークンを検証してからアクセスを許可する認証付き MCP サーバーを起動します。

### Step 1: MCP サーバーをビルドして起動する

**Terminal 2** で（Terminal 1 の Azurite はそのまま）:

```bash
npm run build
npm run start:mcp-http
```

OAuth が有効になっていることを示すメッセージが表示されます。  
```
🚀 Zava Claims MCP HTTP Server started on 127.0.0.1:3001
Security: OAuth 2.0 authentication enabled
...
🔍 Protected Resource Metadata Endpoints (RFC 9728):
    GET  /.well-known/oauth-authorization-server - Standard OAuth metadata
...
```

<cc-end-step lab="e10" exercise="4" step="1" />

### Step 2: OAuth が有効か確認する

ブラウザーで次を開きます。  
```
http://127.0.0.1:3001/health
```

OAuth が有効であることを示す JSON 応答が返ります。

```json
{
  "status": "healthy",
  "timestamp": "2025-01-21T10:00:00.000Z",
  "service": "zava-claims-mcp-server",
  "authentication": "OAuth enabled"
}
```

`"authentication": "OAuth enabled"` と表示されれば、認証モードで実行されています。

<cc-end-step lab="e10" exercise="4" step="2" />

### Step 3: OAuth ディスカバリー エンドポイントをテストする

OAuth ディスカバリー エンドポイントを開きます。  
```
http://127.0.0.1:3001/.well-known/oauth-authorization-server
```

以下のような OAuth メタデータが表示されます。

- `issuer` - サーバーのベース URL  
- `authorization_endpoint` - Microsoft ログイン URL  
- `token_endpoint` - トークン交換 URL  
- `scopes_supported` - 利用可能な OAuth スコープ  

この RFC 9728 準拠のエンドポイントにより、MCP クライアントは認証要件をディスカバーできます。

<cc-end-step lab="e10" exercise="4" step="3" />

### Step 4: 認証が必須か確認する

認証なしで MCP ツールにアクセスしてみます。

```bash
curl -X POST "http://127.0.0.1:3001/mcp/tools/call" \
  -H "Content-Type: application/json" \
  -d '{"name":"get_claims","arguments":{}}'
```

`WWW-Authenticate` ヘッダー付きで 401 Unauthorized が返ります。

```json
{
  "error": "Missing Authorization header",
  "description": "Please include Bearer token in Authorization header",
  "auth_url": "https://your-tunnel-url/oauth/authorize",
  "resource_metadata_url": "https://your-tunnel-url/.well-known/oauth-authorization-server"
}
```

認証が正しく機能していることを確認できました。

<cc-end-step lab="e10" exercise="4" step="4" />

---

## Exercise 5: 新しい Declarative エージェント プロジェクトを作成する

Microsoft 365 Agents Toolkit を使用して、Zava の認証付き請求システムに接続する Declarative エージェント プロジェクトを作成します。

### Step 1: Microsoft 365 Agents Toolkit でエージェントを作成する

1. **VS Code** で新しいウィンドウを開く  
2. 左側のアクティビティ バーで **Microsoft 365 Agents Toolkit** アイコンをクリック  
3. プロンプトが表示されたら Microsoft 365 開発者アカウントでサインイン  
4. Agents Toolkit パネルで **Create a New Agent/App** をクリック  
5. テンプレートから **Declarative Agent** を選択  
6. **Add an Action** を選択  
7. **Start with an MCP server (preview)** を選択  
8. Exercise 3 で取得した公開 MCP Server URL（トンネル URL + `/mcp/messages`）を入力  
9. 既定のフォルダー（または任意の場所）を選択してエージェントをスキャフォールド  
10. プロジェクト詳細の入力を求められたら次を設定  
    - **Application Name**: `Zava Claims Assistant (Auth)`  

<cc-end-step lab="e10" exercise="5" step="1" />

### Step 2: MCP サーバー認証を構成する

生成されたプロジェクトで `.vscode/mcp.json` が開きます。これは MCP サーバーの設定ファイルです。

1. **Start** ボタンを選択してサーバーからツールを取得  
2. MCP サーバーが認証を要求し、Dynamic Client Registration をサポートしていない旨のダイアログが表示されます。手動で登録する必要があります  
3. すでに Entra ID にリダイレクト URI (`https://vscode.dev/redirect`, `http://127.0.0.1:33418`) を設定済みなので **Copy URIs & Proceed** を選択  
4. OAuth 資格情報の入力を求められたら、クライアント ID とシークレットを入力  
5. MCP サーバーとの認証を求められます  
6. ブラウザーが `http://127.0.0.1:33418` を開き、サインイン成功画面が表示されます。ブラウザーを閉じ、プロジェクトに戻ります  

![VS Code signed in with MCP server](../assets/images/extend-m365-copilot-10/vscode-mcp.png)

<cc-end-step lab="e10" exercise="5" step="2" />

### Step 3: ツールを追加しエージェントをプロビジョニングする

1. サーバーが起動し、利用可能なツールとプロンプト数が表示されます  
2. **ATK: Fetch action from MCP** を選択し、エージェントに追加するツールを選択  
3. テスト用に `get_claims` ツールを選択  
4. Teams Developer Portal でエージェントを構成するよう指示が出たら、手順に従う  
5. Authentication Type として **OAuth (with static registration)** を選択。ツールキットがプラグイン マニフェストを作成  
6. **Provision** を選択してテナントへプロビジョニング  
7. クライアント ID とシークレットの再入力を求められたら、前と同じ値を入力（Developer Portal の OAuth 登録用。ツールキットは資格情報を保存しません）  
8. スコープを追加: `api://<your-client-id>/access_as_user`  
9. **Confirm** を選択してプロビジョニング開始  

プロビジョニングが完了すると、Developer Portal 用のトークンが自動的に生成され、`.env.dev` に `MCP_DA_AUTH_ID_XXXX` のような変数として表示されます。

!!! note "Developer Portal での OAuth 登録"
    [Developer Portal での OAuth 登録方法](https://learn.microsoft.com/en-us/microsoftteams/platform/messaging-extensions/api-based-oauth#configure-oauth-in-developer-portal) を参照してください。Agents Toolkit はこれを自動で構成します。

これで OAuth 保護付き MCP サーバーに接続する Declarative エージェントが完成しました。

<cc-end-step lab="e10" exercise="5" step="3" />

---

## Exercise 6: 認証済みエージェント統合のテスト

Declarative エージェントが正常に認証し、OAuth 保護付き MCP サーバーと通信できるかテストします。

### Step 1: MCP サーバーが稼働中か確認する

テスト前に MCP サーバーが実行中であることを確認します。

1. zava-mcp-server プロジェクトを実行しているウィンドウを開く  
2. Azurite が稼働中か確認: `npm run start:azurite`  
3. MCP サーバーが稼働中か確認: `npm run start:mcp-http`  
4. Dev トンネルのポート転送が有効か確認  

<cc-end-step lab="e10" exercise="6" step="1" />

### Step 2: Microsoft 365 Copilot でテストする

1. [https://m365.cloud.microsoft/chat/](https://m365.cloud.microsoft/chat/) を開く  
2. 左サイドバーの **Agents** から **Zava Claims Assistant (Auth)** を選択  
3. 会話スターター「Find all claims」を入力  
4. エージェントがデータ取得前にサインインを促します。**Sign in** を選択  

![Agent sign-in prompt](../assets/images/extend-m365-copilot-10/sign-in.png)

5. サインイン後、エージェントが請求情報を返します  
6. MCP サーバーのターミナルで認証成功とツール呼び出しを確認できます  

![MCP Server authenticated](../assets/images/extend-m365-copilot-10/success.png)

<cc-end-step lab="e10" exercise="6" step="2" />

---

## 🎉 お疲れさまでした!

Zava Insurance の **OAuth 保護**付き Declarative エージェントを作成・デプロイし、認証付き MCP サーバーと安全に統合できました。

### 達成した内容

- ✅ OAuth 2.0 用の Microsoft Entra ID アプリ登録を作成  
- ✅ セキュリティを考慮した環境変数を設定  
- ✅ JWT トークン検証付き OAuth 保護 MCP サーバーを実行  
- ✅ RFC 9728 準拠の OAuth ディスカバリー エンドポイントをテスト  
- ✅ 認証付き MCP 統合の Declarative エージェントを作成  
- ✅ 請求データへのセキュアな自然言語クエリをテスト  

### ラボ 08 との主な違い

| 項目 | ラボ 08 (匿名) | ラボ 10 (認証付き) |
|------|---------------|---------------------|
| 認証 | なし - すべてのエンドポイントが公開 | OAuth 2.0 (Microsoft Entra ID) |
| トークン検証 | なし | JWKS に対する JWT 検証 |
| セキュリティ ヘッダー | なし | WWW-Authenticate とメタデータ URL |
| ディスカバリー | なし | RFC 9728 保護リソース メタデータ |
| エンタープライズ対応 | 開発のみ | 本番運用向けセキュリティ |

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extent/10-mcp-auth--ja" />

### 🔗 追加リソース
- **Build declarative agents for Microsoft 365 Copilot with MCP**: [https://devblogs.microsoft.com/microsoft365dev/build-declarative-agents-for-microsoft-365-copilot-with-mcp/](https://devblogs.microsoft.com/microsoft365dev/build-declarative-agents-for-microsoft-365-copilot-with-mcp/)
- **MCP Protocol Documentation**: [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)
- **Microsoft Entra ID Documentation**: [https://docs.microsoft.com/en-us/azure/active-directory/](https://docs.microsoft.com/en-us/azure/active-directory/)
- **RFC 9728 - OAuth 2.0 Protected Resource Metadata**: [https://datatracker.ietf.org/doc/html/rfc9728](https://datatracker.ietf.org/doc/html/rfc9728)
- **Azure Table Storage**: [Azure Documentation](https://docs.microsoft.com/en-us/azure/storage/tables/)