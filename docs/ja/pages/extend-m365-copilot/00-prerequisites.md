---
search:
  exclude: true
---
# ラボ E0 - セットアップ

このラボでは、Microsoft 365 Copilot でテーラーメイドな AI 支援を実現する Copilot エージェントを構築・テスト・デプロイするための開発環境をセットアップします。 

!!! note "Microsoft 365 Copilot 開発環境のセットアップ"
    このラボでは、すでにテナントが用意されていることを前提としています。テナントの取得方法については、[こちらのページ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/prerequisites){target=_blank} を参照してください。

このラボで学習できる内容:

- ラボで使用するために Microsoft 365 テナントの Teams アップロード ポリシーを構成する方法
- Visual Studio Code 用 Microsoft 365 Agents Toolkit をインストールして構成する方法


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/VDhRFMH3Qbs" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>ビデオでラボの概要を短時間で確認できます。</div>
            <div class="disclaimer-box">
            ⚠️ <strong>注意事項:</strong> これらのサンプルとラボは学習およびデモ目的で提供されています。プロダクション環境での利用を想定していません。プロダクションで使用する場合は、必ず品質を向上させてからご利用ください。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## 演習 1 : Teams アップロード ポリシーの構成

### 手順 1: Teams のカスタム アプリのアップロードを有効化

既定では、エンド ユーザーがアプリを直接アップロードすることはできません。Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、Agents Toolkit から直接アップロードできるようにテナントを構成します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスし、Microsoft 365 管理センターを開きます。

2️⃣ 管理センター左側のペインで **Show all** を選択し、ナビゲーションを展開します。ペインが開いたら **Teams** を選択して Microsoft Teams 管理センターを開きます。

3️⃣ Microsoft Teams 管理センターの左ペインで **Teams apps** のアコーディオンを展開し、**Setup Policies** を選択します。App setup policy の一覧が表示されるので **Global (Org-wide default)** ポリシーを選択します。

4️⃣ 最初のスイッチ **Upload custom apps** が **On** になっていることを確認します。

5️⃣ 画面を下までスクロールし、**Save** ボタンを選択して変更を保存します。

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="e0" exercise="1" step="1" />

## 演習 2: Agents Toolkit と前提条件のインストール

Windows、Mac、Linux のいずれのマシンでもラボを実施できますが、前提条件をインストールする権限が必要です。インストールが許可されていない場合は、別のマシン（または仮想マシン）を用意してください。

### 手順 1: Visual Studio Code のインストール

**Agents Toolkit for Visual Studio Code** を使用するためには、Visual Studio Code が必要です。以下からダウンロードしてください。  
[Visual Studio Code](https://code.visualstudio.com/download){target=_blank}

<cc-end-step lab="e0" exercise="2" step="1" />

### 手順 2: Node.js のインストール

Node.js はコンピューター上で JavaScript を実行するためのプログラムで、Microsoft Edge や Google Chrome などのブラウザーで使用されているオープンソースの「V8」エンジンを利用しています。このワークショップで使用する Web サーバー コードを実行するために Node.js が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、バージョン v22 をインストールしてください。このラボは Node バージョン v22.18.0 で最終テストされています。既に別のバージョンの Node.js がインストールされている場合は、[Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（Windows の場合は [こちらのバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}）を使用すると、同一マシンで簡単に Node.js のバージョンを切り替えられます。

<cc-end-step lab="e0" exercise="2" step="2" />

### 手順 3: Agents Toolkit のインストール

このラボは **Microsoft 365 Agents Toolkit** バージョン 6.0 をベースにしています。

!!! tip "Agents Toolkit とは?"
    Microsoft 365 Agents Toolkit は Microsoft Teams Toolkit の進化版で、Microsoft 365 Copilot、Microsoft Teams、Microsoft 365 向けのエージェントおよびアプリの開発を支援します。

以下の手順に従ってインストールしてください。

1️⃣ Visual Studio Code を開き、左のツールバーから **Extensions** をクリックします。

2️⃣ 「Microsoft 365 Agents」と検索し、Agents Toolkit を見つけます。

3️⃣ **Install** をクリックします。

![agents toolkit](../../assets/images/extend-m365-copilot-00/agents-toolkit.png)

!!! note "Agents Toolkit をインストール済みだが非表示の場合"
    以前に Agents Toolkit をインストールし、Visual Studio のサイドバーで非表示にした場合、表示されないことがあります。左のサイドバーを右クリックし、Agents Toolkit にチェックを入れて表示を復元してください。

<cc-end-step lab="e0" exercise="2" step="3" />


---8<--- "ja/e-congratulations.md"

これで Microsoft 365 Copilot 向けの最初の拡張機能を作成する準備が整いました。次のラボで Declarative Agent を作成しましょう。 

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/00-prerequisites--ja" />