---
search:
  exclude: true
---
# Lab BAF0 - 事前準備

このラボでは、 Microsoft 365 Agents SDK と Agent Framework を使用して開発するカスタムエンジン エージェントをビルド、テスト、デプロイするための開発環境をセットアップします。

このラボで学習する内容:

-  Microsoft 365 環境のセットアップ  
-  Visual Studio Code への Microsoft 365 Agents Toolkit のインストールと構成  
-  必要なリソースを作成するための Azure 環境の準備  
-  必要な開発ツールのインストール  

!!! pied-piper "注意事項"
    これらのサンプルおよびラボは、教育目的とデモンストレーション目的で提供されています。運用環境での利用を想定していません。運用環境に導入する場合は、必ずプロダクション品質に更新してください。

!!! note "注"
    独自のカスタムエンジン エージェントをインストールして実行するには、管理者権限を持つ Microsoft 365 テナントが必要です。カスタムエンジン エージェントをテストするために Microsoft 365 Copilot ライセンスは不要です。

## Exercise 1 : Microsoft Teams のセットアップ

### Step 1: Teams へのカスタムアプリのアップロードを有効化する

既定では、エンド ユーザーはアプリを直接アップロードできず、 Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、 M365 Agents Toolkit による直接アップロードが可能になるようにテナントを設定します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} に移動して Microsoft 365 管理センターを開きます。

2️⃣ 管理センター左側のパネルで **すべてを表示** を選択し、ナビゲーションを展開します。パネルが開いたら **Teams** を選択して Microsoft Teams 管理センターを開きます。

3️⃣ Microsoft Teams 管理センター左側で **Teams アプリ** を展開し、 **セットアップ ポリシー** を選択します。アプリのセットアップ ポリシー一覧が表示されるので **Global (Org-wide default)** ポリシーを選択します。

4️⃣ **カスタムアプリのアップロード** スイッチが **オン** になっていることを確認します。

5️⃣ 画面を下までスクロールし、 **保存** ボタンを選択して変更を保存します。

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="baf0" exercise="1" step="1" />

## Exercise 2: 開発環境のセットアップ

このラボは Windows、 macOS、 Linux いずれのマシンでも実施できますが、前提条件をインストールできる権限が必要です。アプリケーションをインストールできない場合は、別のマシン（または仮想マシン）を使用してください。

### Step 1: Visual Studio Code のインストール

1️⃣ [https://code.visualstudio.com/](https://code.visualstudio.com/){target=_blank} から Visual Studio Code をダウンロードしてインストールします。

2️⃣ インストール後に Visual Studio Code を起動します。

<cc-end-step lab="baf0" exercise="2" step="1" />

### Step 2: .NET 9 SDK のインストール

Microsoft 365 Agents SDK と Agent Framework でエージェントをビルドおよび実行するには .NET 9 SDK が必要です。

1️⃣ [https://dotnet.microsoft.com/download/dotnet/9.0](https://dotnet.microsoft.com/download/dotnet/9.0){target=_blank} から .NET 9 SDK をダウンロードしてインストールします。

2️⃣ ターミナルを開き、次のコマンドを実行してインストールを確認します。

```bash
dotnet --version
```

バージョン 9.0.x 以上が表示されれば成功です。

<cc-end-step lab="baf0" exercise="2" step="2" />

### Step 3: C# Dev Kit 拡張機能のインストール

1️⃣ Visual Studio Code で、サイドバーの拡張機能アイコンをクリックするか `Ctrl+Shift+X` (Windows/Linux) または `Cmd+Shift+X` (Mac) を押して **拡張機能ビュー** を開きます。

2️⃣ **C# Dev Kit** を検索し、 **Install** をクリックします。

<cc-end-step lab="baf0" exercise="2" step="3" />

### Step 4: Microsoft 365 Agents Toolkit 拡張機能のインストール

1️⃣ Visual Studio Code の拡張機能ビューで **Microsoft 365 Agents Toolkit** を検索し、 **Install** をクリックします。

2️⃣ インストール後、サイドバーに Microsoft 365 Agents Toolkit のアイコンが表示されます。

<cc-end-step lab="baf0" exercise="2" step="4" />

### Step 5: Azure CLI のインストール

Azure CLI は Azure リソースのプロビジョニングと管理に必要です。

1️⃣ [https://learn.microsoft.com/cli/azure/install-azure-cli](https://learn.microsoft.com/cli/azure/install-azure-cli){target=_blank} から Azure CLI をダウンロードしてインストールします。

2️⃣ ターミナルを開き、次のコマンドを実行してインストールを確認します。

```bash
az --version
```

3️⃣ Azure にサインインします。

```bash
az login
```

<cc-end-step lab="baf0" exercise="2" step="5" />

### Step 6: DevTunnel のインストール

DevTunnel はローカル開発とデバッグに必要です。インターネットからローカルマシンへの安全なトンネルを作成します。

**Windows:**

```bash
winget install Microsoft.DevTunnel
```

**macOS/Linux:**

```bash
curl -sL https://aka.ms/DevTunnelCliInstall | bash
```

インストール確認:

```bash
devtunnel --version
```

!!! tip "DevTunnel の代替案"
    DevTunnel は Visual Studio 2022 にも含まれています。 Visual Studio 2022 をインストール済みの場合、すでに DevTunnel が利用可能です。

<cc-end-step lab="baf0" exercise="2" step="6" />

## Exercise 3: Azure 環境のセットアップ

このコースを完了するには、 Microsoft Foundry リソースを作成して AI モデルをデプロイするための Azure サブスクリプションが必要です。

### Step 1: Azure サブスクリプションの取得

まだ Azure サブスクリプションをお持ちでない場合は、 [Azure 無料アカウント](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} を有効化できます。最初の 30 日間で使用できる 200 ドル分のクレジットが付与されます。

Azure 無料アカウントを有効化する手順:

1️⃣ [Azure free account](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0044p){target=_blank} ページにアクセスし、 **Activate** を選択します。

2️⃣ 任意のアカウントでログインします。ラボで使用する Microsoft 365 テナント アカウントの使用を推奨します。

3️⃣ Privacy Statement にチェックを入れ、 **Next** を選択します。

4️⃣ 本人確認のため携帯電話番号を入力します。

5️⃣ 一時的な認証のため支払い情報を入力します。従量課金制へ移行しない限り請求されません。完了したら **Sign up** を選択します。

!!! tip "ヒント: 30 日以降の Azure リソース管理"
    無料アカウントは 30 日間のみ利用可能です。30 日終了時点で無料サブスクリプションに稼働中のサービスがないか確認してください。継続して Azure サービスを使用する場合は、支出制限を解除して従量課金サブスクリプションへアップグレードする必要があります。

<cc-end-step lab="baf0" exercise="3" step="1" />

### Step 2: Microsoft Foundry プロジェクトの作成とモデルのデプロイ

このラボでは、言語モデルをデプロイした Microsoft Foundry プロジェクトが必要です。

1️⃣ [Microsoft Foundry](https://ai.azure.com){target=_blank} にアクセスし、 Azure アカウントでサインインします。  
2️⃣ **+ Create new** → **Microsoft Foundry resource** → **Next** の順に選択します。

3️⃣ プロジェクト名は推奨値のままにし、 **Create** を選択します。プロジェクトのスキャフォールディングには通常 3～5 分かかります。

!!! tip "リージョン選択"
    すべてのラボで必要なモデルをサポートしている **France Central** リージョンを選択してください。

4️⃣ プロジェクト作成後、左側の **Deployments** に移動します。

5️⃣ **+ Deploy model** をクリックし、 **Deploy base model** を選択します。

6️⃣ **gpt-4.1** を検索して選択し、 **Confirm** → **Deploy** を選択します。

!!! important "モデル選択"
    スムーズに進めるため、必ず **gpt-4.1** を使用してください。ラボでは gpt-4.1 向けに最適化された知識ベース回答合成を使用しています。他のモデルを使用すると予期しない動作になる場合があります。

!!! tip "認証情報の保存"
    次の情報を Microsoft Foundry プロジェクトから取得して安全な場所に保存してください。次のラボで必要になります。  

    - **Endpoint URL**: Project settings → Properties（例: `https://your-resource.cognitiveservices.azure.com/`）  
    - **API Key**: 「Keys and Endpoint」セクション  
    - **Model Deployment Name**: gpt-4.1 デプロイ時に指定した名前  

!!! note "追加モデル"
    埋め込みや画像解析用の追加モデルのデプロイや、 Azure AI Search などの他の Azure サービスの作成は、後続のラボで行います。

<cc-end-step lab="baf0" exercise="3" step="2" />

### Step 3: コンテンツ セーフティ フィルターの構成

保険分野では「injury」「collision」「damage」のような用語がデフォルトのコンテンツ フィルターによりブロックされる可能性があります。閾値を下げたカスタム コンテンツ フィルターを作成します。

1️⃣ Microsoft Foundry でプロジェクトを開きます。

2️⃣ 左側の **Guardrails + Controls** → **Content filters** を選択します。

3️⃣ **+ Create content filter** をクリックします。

4️⃣ フィルター名を **InsuranceLowFilter** と入力します。

5️⃣ **Input filters**（ユーザーが送信する内容）の設定を次のように変更します:

- **Violence**: **Low**
- **Hate**: **Low**
- **Sexual**: **Low**
- **Self-harm**: **Low**
- Prompt shields for jailbreak attacks: Off
- Prompt shields for indirect attacks: Off

6️⃣ **Next** を選択し、 **Output filters**（ AI が生成する内容）にも同じ設定を行います:

- **Violence**: **Low**
- **Hate**: **Low**
- **Sexual**: **Low**
- **Self-harm**: **Low**
- Protected material for text: Off
- Protected material for code: Off
- Groundedness (Preview): Off

7️⃣ **Next** を選択します。

8️⃣ 「Apply filter to deployments」で **gpt-4.1** デプロイメントを選択します。

9️⃣ **Replace** を選択して新しいフィルターを適用します。

🔟 最後に **Create filter** を選択します。

!!! warning "この設定が必要な理由"
    保険請求には「injury」「accident」「collision」「bodily harm」などの正当な用語が含まれますが、デフォルトのコンテンツ フィルターではこれらがブロックされる可能性があります。閾値を **Low** に設定することで、極端なコンテンツのみをブロックし、通常の保険用語を許可します。

!!! tip "運用環境へのデプロイ"
    運用環境では、組織のコンテンツ セーフティ ポリシーを確認し、フィルター設定を適切に調整してください。ここでの設定は開発とテストを目的としています。

<cc-end-step lab="baf0" exercise="3" step="3" />

---8<--- "ja/b-congratulations.md"

Lab BAF0 - 事前準備 が完了しました！

次は Lab BAF1 - 最初のエージェントの構築と実行 に進みましょう。 **Next** を選択してください。

<cc-next url="../01-build-and-run" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/00-prerequisites--ja" />