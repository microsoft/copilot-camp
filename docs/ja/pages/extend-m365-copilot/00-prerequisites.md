---
search:
  exclude: true
---
# ラボ E0 - セットアップ

このラボでは、 Copilot エージェントをビルド、テスト、デプロイするための開発環境をセットアップし、 Microsoft 365 Copilot であなただけの AI 支援を実現できるようにします。 

!!! note "Microsoft 365 Copilot 用の開発環境をセットアップする"
    このラボでは、すでにテナントをお持ちであることを前提としています。テナントの取得方法については、[こちらのページ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/prerequisites){target=_blank} を参照してください。

このラボで学習する内容:

- ラボ用に Microsoft 365 テナントの Teams アップロード ポリシーを構成する方法  
- Visual Studio Code 用 Microsoft 365 Agents Toolkit をインストールして構成する方法


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/VDhRFMH3Qbs" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早く確認できます。</div>
            <div class="disclaimer-box">
            ⚠️ <strong>注意事項:</strong> これらのサンプルとラボは学習およびデモンストレーションを目的としており、製品環境での利用を想定していません。製品環境で使用する場合は、必ずプロダクション品質へアップグレードしてください。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## Exercise 1 : Teams アップロード ポリシーの構成

### Step 1: Teams カスタムアプリのアップロードを有効化

既定では、エンド ユーザーはアプリを直接アップロードできず、 Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。このステップでは、 Agents Toolkit による直接アップロードができるようにテナントを設定します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスし、 Microsoft 365 管理センターを開きます。  

2️⃣ 左ペインで **Show all** を選択してナビゲーションを展開し、**Teams** を選択して Microsoft Teams 管理センターを開きます。  

3️⃣ 左ペインで **Teams apps** を展開し、**Setup Policies** を選択します。表示された App setup policy の一覧から **Global (Org-wide default) policy** を選択します。  

4️⃣ 最初のスイッチ **Upload custom apps** が **On** になっていることを確認します。  

5️⃣ 画面を下にスクロールし、**Save** ボタンをクリックして変更を保存します。  

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="e0" exercise="1" step="1" />

## Exercise 2: Agents Toolkit と前提条件のインストール

これらのラボは Windows、Mac、Linux のいずれのマシンでも実施できますが、前提条件をインストールできる環境が必要です。PC にアプリをインストールできない場合は、別のマシン（または仮想マシン）を用意してください。

### Step 1: Visual Studio Code のインストール

**Visual Studio Code 用 Agents Toolkit** を使用するには、当然ながら Visual Studio Code が必要です。以下からダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}。

<cc-end-step lab="e0" exercise="2" step="1" />

### Step 2: Node.js のインストール

Node.js は JavaScript をローカルで実行できるプログラムで、 Microsoft Edge や Google Chrome などのブラウザーで採用されているオープン ソースの V8 エンジンを使用します。本ワークショップで使用する Web サーバー コードを実行するために Node.js が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、お使いの OS 向けにバージョン 18 または 16 をインストールしてください。本ラボでは Node.js 18.16.0 で動作確認済みです。すでに別バージョンがインストールされている場合は、[Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（または [Windows 版](https://github.com/coreybutler/nvm-windows){target=_blank}）を設定すると、複数バージョンを簡単に切り替えられます。

<cc-end-step lab="e0" exercise="2" step="2" />

### Step 3: Agents Toolkit のインストール

このラボは **Microsoft 365 Agents Toolkit** バージョン 6.0 を使用しています。

!!! tip "Agents Toolkit とは?"
    Microsoft 365 Agents Toolkit は Microsoft Teams Toolkit の進化版であり、 Microsoft 365 Copilot、 Microsoft Teams、および Microsoft 365 向けのエージェントやアプリを開発するためのツールです。

以下の手順に従ってインストールしてください。

1️⃣ Visual Studio Code を開き、サイドバーの **Extensions** をクリック  

2️⃣ 「Microsoft 365 Agents」と検索し、 Agents Toolkit を見つける  

3️⃣ **Install** をクリック  

![agents toolkit](../../assets/images/extend-m365-copilot-00/agents-toolkit.png)

!!! note "Agents Toolkit をインストール済みだが非表示の場合"
    以前に Agents Toolkit をインストール後、 Visual Studio のサイドバーから非表示にした場合、アイコンが見当たらないことがあります。左側のサイドバーを右クリックし、 Agents Toolkit にチェックを入れると再表示されます。

<cc-end-step lab="e0" exercise="2" step="3" />


---8<--- "ja/e-congratulations.md"

これで Microsoft 365 Copilot の拡張機能を初めて作成する準備が整いました。次のラボでは Declarative Agent を作成しましょう。 

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/00-prerequisites" />