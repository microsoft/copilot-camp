---
search:
  exclude: true
---
# ラボ E0 - セットアップ

このラボでは、Microsoft 365 Copilot を使用して、お客様専用の AI 支援を実現する Copilot エージェントを構築、テスト、デプロイするための開発環境をセットアップします。

!!! note "Microsoft 365 Copilot の開発環境をセットアップする"
    このラボでは、既にテナントをお持ちであることを前提としています。テナント取得方法の最新情報については [こちらのページ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/prerequisites){target=_blank} を参照してください。

このラボで学習する内容:

- ラボで使用するために Microsoft 365 テナントの Teams アップロード ポリシーを構成する方法
- Visual Studio Code 用 Microsoft 365 Agents Toolkit をインストールして構成する方法


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/VDhRFMH3Qbs" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
            <div class="disclaimer-box">
            ⚠️ <strong>注意事項:</strong> これらのサンプルおよびラボは学習およびデモ用であり、運用環境での使用を意図したものではありません。運用環境に導入する場合は、必ず本番品質へアップグレードしてください。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## 演習 1 : Teams のアップロード ポリシーを構成する

### 手順 1: Teams のカスタム アプリのアップロードを有効にする

既定では、エンド ユーザーはアプリを直接アップロードできず、Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、Agents Toolkit から直接アップロードできるようにテナントが構成されていることを確認します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスし、Microsoft 365 管理センターを開きます。  

2️⃣ 左側のナビゲーションで **Show all** を選択し、すべてのメニューを表示します。開いたら **Teams** を選択して Microsoft Teams 管理センターを開きます。  

3️⃣ 左側の Microsoft Teams 管理センター ナビゲーションで **Teams apps** を展開し、**Setup Policies** を選択します。App setup policy の一覧が表示されるので、**Global (Org-wide default)** ポリシーを選択します。  

4️⃣ 先頭のスイッチ **Upload custom apps** が **On** になっていることを確認します。  

5️⃣ 変更を保存するため、画面を下にスクロールして **Save** ボタンを選択します。  

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="e0" exercise="1" step="1" />

## 演習 2: Agents Toolkit と前提条件をインストールする

このラボは Windows、Mac、Linux のいずれのマシンでも実施できますが、前提条件をインストールできる権限が必要です。インストールが許可されていない場合は、別のマシン (または仮想マシン) を用意してください。

### 手順 1: Visual Studio Code をインストールする

**Agents Toolkit for Visual Studio Code** を使用するには Visual Studio Code が必要です。以下からダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}。

<cc-end-step lab="e0" exercise="2" step="1" />

### 手順 2: Node.js をインストールする

Node.js は、オープンソースの V8 エンジンを使用してコンピューター上で JavaScript を実行できるプログラムです。このワークショップで使用する Web サーバー コードを実行するために Node.js が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、バージョン v22 をインストールしてください。このラボは Node バージョン v22.18.0 で検証されています。既に別のバージョンがインストールされている場合は、[Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank} (Windows の場合は [こちらのバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}) を利用すると、同一マシンで簡単に Node.js のバージョンを切り替えられます。

<cc-end-step lab="e0" exercise="2" step="2" />

### 手順 3: Agents Toolkit をインストールする

これらのラボは **Microsoft 365 Agents Toolkit** バージョン 6.0 を基盤としています。

!!! tip "Agents Toolkit とは?"
    Microsoft 365 Agents Toolkit は Microsoft Teams Toolkit の進化版であり、Microsoft 365 Copilot、Microsoft Teams、および Microsoft 365 向けのエージェントとアプリを開発するためのツールです。

以下の手順に従ってインストールします。

1️⃣ Visual Studio Code を開き、サイドバーの **Extensions** アイコンをクリックします。  

2️⃣ 「Microsoft 365 Agents」と検索し、Agents Toolkit を見つけます。  

3️⃣ **Install** をクリックします。  

![agents toolkit](../../assets/images/extend-m365-copilot-00/agents-toolkit.png)

!!! note "Agents Toolkit をインストール済みだが非表示の場合"
    過去に Agents Toolkit をインストールしてサイドバーから非表示にした場合、表示されなくて戸惑うかもしれません。左サイドバーを右クリックし、Agents Toolkit にチェックを入れて再表示してください。

<cc-end-step lab="e0" exercise="2" step="3" />


---8<--- "ja/e-congratulations.md"

これで Microsoft 365 Copilot の拡張機能を初めて作成する準備が整いました。次のラボで Declarative エージェントを作成しましょう。 

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/00-prerequisites--ja" />