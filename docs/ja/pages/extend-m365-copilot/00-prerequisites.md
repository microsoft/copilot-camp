---
search:
  exclude: true
---
# ラボ E0 - セットアップ

このラボでは、Microsoft 365 Copilot を活用してあなただけの AI 支援を実現する Copilot エージェントをビルド、テスト、デプロイするための開発環境をセットアップします。

!!! note "Microsoft 365 Copilot の開発環境をセットアップする"
    このラボでは、すでにテナントをお持ちであることを前提としています。テナントの取得方法については、[こちらのページ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/prerequisites){target=_blank} を参照してください。

このラボで学習する内容:

- ラボ用に Microsoft 365 テナントの Teams アップロード ポリシーを構成する方法  
- Visual Studio Code 用 Microsoft 365 Agents Toolkit をインストールして構成する方法


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/VDhRFMH3Qbs" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く把握できます。</div>
            <div class="disclaimer-box">
            ⚠️ <strong>注意事項:</strong> これらのサンプルおよびラボは、学習およびデモンストレーションを目的としており、本番環境での使用を想定していません。本番環境で使用する場合は、必ずプロダクション品質にアップグレードしてください。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## 演習 1: Teams のアップロード ポリシーを構成する

### Step 1: Teams のカスタム アプリのアップロードを有効にする

既定では、エンドユーザーがアプリを直接アップロードすることはできません。Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。このステップでは、Agents Toolkit が直接アップロードできるようにテナントを設定します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスし、Microsoft 365 管理センターを開きます。

2️⃣ 左側のナビゲーションで **Show all** を選択してメニューを展開し、**Teams** を選択して Microsoft Teams 管理センターを開きます。

3️⃣ 左ペインで **Teams apps** セクションを展開し、**Setup Policies** を選択します。表示されたポリシー一覧から **Global (Org-wide default)** ポリシーを選択します。

4️⃣ 最初のスイッチ **Upload custom apps** が **On** になっていることを確認します。

5️⃣ 画面を下までスクロールし、**Save** をクリックして変更を保存します。

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="e0" exercise="1" step="1" />

## 演習 2: Agents Toolkit と前提条件をインストールする

これらのラボは Windows、Mac、Linux のいずれのマシンでも実施できますが、前提条件をインストールできる権限が必要です。インストールが許可されていない場合は、別のマシン（または仮想マシン）を用意してください。

### Step 1: Visual Studio Code をインストールする

**Agents Toolkit for Visual Studio Code** を利用するには Visual Studio Code が必要です。以下からダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}。

<cc-end-step lab="e0" exercise="2" step="1" />

### Step 2: Node.js をインストールする

Node.js は JavaScript をローカルで実行できるプログラムで、Microsoft Edge や Google Chrome などで使用されているオープンソースの V8 エンジンを使用しています。本ワークショップで使用する Web サーバーのコードを実行するために Node.js が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、ご使用の OS 向けにバージョン 18 もしくは 16 をインストールしてください。このラボは Node.js 18.16.0 でテストされています。すでに別バージョンをお使いの場合は、[Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（Windows の場合は [こちらのバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}）を使うと、同じマシンで簡単にバージョンを切り替えられます。

<cc-end-step lab="e0" exercise="2" step="2" />

### Step 3: Agents Toolkit をインストールする

このラボは **Microsoft 365 Agents Toolkit** バージョン 6.0 を使用しています。

!!! tip "Agents Toolkit とは?"
    Microsoft 365 Agents Toolkit は、Microsoft Teams Toolkit が進化したもので、Microsoft 365 Copilot、Microsoft Teams、Microsoft 365 向けのエージェントやアプリを開発するためのツールです。

以下の手順に従ってインストールしてください。

1️⃣ Visual Studio Code を開き、左側の **Extensions** アイコンをクリックします。  

2️⃣ 「Microsoft 365 Agents」で検索し、Agents Toolkit を見つけます。  

3️⃣ **Install** をクリックします。  

![agents toolkit](../../assets/images/extend-m365-copilot-00/agents-toolkit.png)

!!! note "Agents Toolkit をインストール済みだが非表示の場合"
    以前に Agents Toolkit をインストールして Visual Studio のサイドバーから非表示にした場合、見当たらなくて戸惑うことがあります。左サイドバーを右クリックし、Agents Toolkit にチェックを入れると再表示されます。

<cc-end-step lab="e0" exercise="2" step="3" />


---8<--- "ja/e-congratulations.md"

これで Microsoft 365 Copilot の最初の拡張機能を作成する準備が整いました。次のラボで Declarative Agent を作成しましょう。 

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/00-prerequisites" />