---
search:
  exclude: true
---
# ラボ E0 - セットアップ

このラボでは、Microsoft 365 Copilot を活用したカスタム AI 支援を実現するために、Copilot エージェントを構築・テスト・デプロイする開発環境をセットアップします。

!!! note "Microsoft 365 Copilot の開発環境をセットアップする"
    このラボでは、すでにテナントをお持ちであることを前提としています。テナントの取得方法については、[こちらのページ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/prerequisites){target=_blank}を参照してください。

このラボで学ぶ内容:

- Microsoft 365 テナントの Teams アップロード ポリシーをラボ用に構成する方法
- Visual Studio Code 用 Microsoft 365 Agents Toolkit のインストールと構成方法


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/VDhRFMH3Qbs" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を短時間で確認できます。</div>
            <div class="disclaimer-box">
            ⚠️ <strong>Disclaimer:</strong> これらのサンプルおよびラボは、教育およびデモンストレーション目的で提供されています。これらをそのまま本番環境に導入しないでください。使用する場合は本番環境向けに十分な品質へのアップグレードが必要です。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## エクササイズ 1 : Teams のアップロード ポリシーの構成

### Step 1: Teams のカスタム アプリのアップロードを有効化する

既定では、エンド ユーザーはアプリを直接アップロードできず、Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、Agents Toolkit で直接アップロードできるようにテナントを構成します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスし、Microsoft 365 管理センターを開きます。  

2️⃣ 管理センターの左ペインで **Show all** を選択してナビゲーション全体を表示し、**Teams** を選択して Microsoft Teams 管理センターを開きます。  

3️⃣ Microsoft Teams 管理センターの左ペインで **Teams apps** を展開し、**Setup Policies** を選択します。ポリシー一覧が表示されたら **Global (Org-wide default)** ポリシーを選択します。  

4️⃣ 最初の切り替えスイッチ **Upload custom apps** が **On** になっていることを確認します。  

5️⃣ 画面を下までスクロールし、**Save** ボタンを選択して変更を保存します。  

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="e0" exercise="1" step="1" />

## エクササイズ 2: Agents Toolkit と前提条件のインストール

このラボは Windows、Mac、Linux のいずれのマシンでも実施できますが、前提条件をインストールできる権限が必要です。アプリのインストールが許可されていない場合は、別のマシン（または仮想マシン）を用意してください。

### Step 1: Visual Studio Code のインストール

**Agents Toolkit for Visual Studio Code** を利用するには Visual Studio Code が必要です。以下からダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}。

<cc-end-step lab="e0" exercise="2" step="1" />

### Step 2: Node.js のインストール

Node.js は JavaScript をローカルで実行できるプログラムで、Microsoft Edge や Google Chrome などのブラウザーで使われているオープンソースの「V8」エンジンを利用します。本ワークショップで使用する Web サーバー コードを実行するために必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} からバージョン v22 をインストールしてください。このラボは Node バージョン v22.18.0 で最終確認されています。すでに別のバージョンの Node.js がインストールされている場合は、[Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（Windows の場合は [こちらのバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}）をセットアップすると、同じマシンで Node.js のバージョンを簡単に切り替えられます。

<cc-end-step lab="e0" exercise="2" step="2" />

### Step 3: Agents Toolkit のインストール

このラボは **Microsoft 365 Agents Toolkit** バージョン 6.0 を使用します。

!!! tip "Agents Toolkit とは?"
    Microsoft 365 Agents Toolkit は Microsoft Teams Toolkit の進化版であり、Microsoft 365 Copilot、Microsoft Teams、Microsoft 365 向けのエージェントやアプリの開発を支援します。

以下の画面例の手順に従ってインストールしてください。

1️⃣ Visual Studio Code を開き、サイドバーの **Extensions** ボタンをクリックします。  

2️⃣ 「Microsoft 365 Agents」で検索し、Agents Toolkit を見つけます。  

3️⃣ **Install** をクリックします。  

![agents toolkit](../../assets/images/extend-m365-copilot-00/agents-toolkit.png)

!!! note "Agents Toolkit をインストール済みだが表示されない場合"
    以前に Agents Toolkit をインストールし、Visual Studio のサイドバーで非表示にした場合、アイコンが見当たらないことがあります。左サイドバーを右クリックして **Agents Toolkit** にチェックを入れると再表示できます。

<cc-end-step lab="e0" exercise="2" step="3" />


---8<--- "ja/e-congratulations.md"

これで Microsoft 365 Copilot 向けの最初の拡張機能を作成する準備が整いました。次のラボでは Declarative Agent を作成しましょう。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/00-prerequisites--ja" />