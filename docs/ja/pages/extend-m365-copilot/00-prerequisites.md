---
search:
  exclude: true
---
# ラボ E0 - セットアップ

このラボでは、Microsoft 365 Copilot を使用してカスタム AI 支援を実現する Copilot エージェントを構築・テスト・デプロイするための開発環境をセットアップします。 

!!! note "Microsoft 365 Copilot の開発環境をセットアップする"
    このラボでは、すでにテナントをお持ちであることを前提としています。テナントの取得方法については、現在の手順を説明した  
    [こちらのページ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/prerequisites){target=_blank} を参照してください。

このラボで学習する内容:

- ラボ用に Microsoft 365 テナントの Teams アップロードポリシーを構成する方法  
- Visual Studio Code 向け Microsoft 365 Agents Toolkit をインストールして構成する方法


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/VDhRFMH3Qbs" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を短時間で確認できます。</div>
            <div class="disclaimer-box">
            ⚠️ <strong>注意事項:</strong> これらのサンプルとラボは学習およびデモ目的のために提供されています。運用環境での使用を意図したものではありません。運用環境で使用する場合は、必ず運用レベルにアップグレードしてください。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## Exercise 1 : Teams アップロードポリシーの構成

### Step 1: Teams カスタムアプリのアップロードを有効化する

既定では、エンド ユーザーがアプリを直接アップロードすることはできず、Teams 管理者がエンタープライズアプリ カタログにアップロードする必要があります。この手順では、Agents Toolkit が直接アップロードできるようにテナントを構成します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスします。これは Microsoft 365 管理センターです。  

2️⃣ 左側のナビゲーションで **Show all** を選択してすべてのメニューを表示し、**Teams** を選択して Microsoft Teams 管理センターを開きます。  

3️⃣ Teams 管理センターの左ナビゲーションで Teams apps を展開し、**Setup policies** を選択します。App setup policy の一覧が表示されたら **Global (Org-wide default)** ポリシーを選択します。  

4️⃣ 最初のスイッチ **Upload custom apps** が **On** になっていることを確認します。  

5️⃣ 画面を下までスクロールし、**Save** ボタンを必ずクリックして変更を保存します。  

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="e0" exercise="1" step="1" />

## Exercise 2: Agents Toolkit と前提条件のインストール

このラボは Windows、Mac、Linux のいずれのマシンでも実施できますが、前提条件をインストールできる権限が必要です。ご自身の PC にアプリをインストールできない場合は、別のマシン（または仮想マシン）をご用意ください。

### Step 1: Visual Studio Code のインストール

** Agents Toolkit for Visual Studio Code ** を利用するには、当然ながら Visual Studio Code が必要です。こちらからダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}  
このラボの執筆時点で使用した VS Code のバージョン: 1.106.3

<cc-end-step lab="e0" exercise="2" step="1" />

### Step 2: Node.js のインストール

Node.js はコンピューター上で JavaScript を実行するためのプログラムで、Microsoft Edge や Google Chrome などのブラウザーでも使用されているオープンソースの「V8」エンジンを利用しています。本ワークショップで使用する Web サーバー コードを実行するために Node.js が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、バージョン v22 をインストールしてください。このラボは Node バージョン v22.18.0 で最後にテストされました。すでに別のバージョンの Node.js がインストールされている場合は、[Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（または [Windows 向け](https://github.com/coreybutler/nvm-windows){target=_blank}）を利用して、同じマシンで簡単に Node.js のバージョンを切り替えられるようにすると便利です。

<cc-end-step lab="e0" exercise="2" step="2" />

### Step 3: Agents Toolkit のインストール

このラボは ** Microsoft 365 Agents Toolkit ** バージョン 6.4.1 を使用しています。

!!! tip "Agents Toolkit とは?"
    Microsoft 365 Agents Toolkit は、Microsoft Teams Toolkit の進化版であり、Microsoft 365 Copilot、Microsoft Teams、Microsoft 365 向けのエージェントやアプリを開発するためのツールセットです。

以下の手順はスクリーンショットに示されています。

1️⃣ Visual Studio Code を開き、拡張機能アイコンをクリックします。  

2️⃣ 「Microsoft 365 Agents」を検索し、Agents Toolkit を見つけます。  

3️⃣ **Install** をクリックします。  

![agents toolkit](../../assets/images/extend-m365-copilot-00/agents-toolkit.png)

!!! note "Agents Toolkit をインストール済みだが非表示の場合"
    以前に Agents Toolkit をインストールし、その後 Visual Studio のサイドバーで非表示にした場合、アイコンが見当たらなくなることがあります。左サイドバーを右クリックし、Agents Toolkit にチェックを入れて再表示してください。

<cc-end-step lab="e0" exercise="2" step="3" />


---8<--- "ja/e-congratulations.md"

これで Microsoft 365 Copilot 向けの最初の拡張機能を作成する準備が整いました。次のラボで Declarative エージェントを作成しましょう。 

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/00-prerequisites--ja" />