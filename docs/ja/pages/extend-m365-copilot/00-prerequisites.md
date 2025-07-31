---
search:
  exclude: true
---
# ラボ E0 - セットアップ

このラボでは、Microsoft 365 Copilot を活用して、ニーズに合わせた AI 支援を実現する Copilot エージェントを開発・テスト・デプロイするための開発環境をセットアップします。

!!! note "Microsoft 365 Copilot 用の開発環境をセットアップする"
    このラボでは、すでにテナントをお持ちであることを前提としています。テナントの取得方法については、[こちらのページ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/prerequisites){target=_blank}をご参照ください。

このラボで学習する内容:

- ラボで使用するために Microsoft 365 テナントの Teams アップロードポリシーを構成する方法  
- Visual Studio Code 用 Microsoft 365 Agents Toolkit をインストールして構成する方法  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/VDhRFMH3Qbs" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要をご覧ください。</div>
            <div class="disclaimer-box">
            ⚠️ <strong>注意事項:</strong> これらのサンプルおよびラボは、学習およびデモ目的で提供されています。運用環境での使用を想定していません。運用環境に導入する場合は、必ず本番品質へアップグレードしてください。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## 演習 1: Teams のアップロードポリシーを構成する

### 手順 1: Teams のカスタムアプリのアップロードを有効化する

既定では、エンドユーザーはアプリを直接アップロードできず、Teams 管理者がエンタープライズ アプリ カタログにアップロードする必要があります。この手順では、Agents Toolkit で直接アップロードできるようにテナントを構成します。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスし、Microsoft 365 管理センターを開きます。  

2️⃣ 左側のペインで **すべて表示** を選択し、ナビゲーションを展開します。開いたペインで **Teams** を選択して Microsoft Teams 管理センターを開きます。  

3️⃣ 左側のペインで **Teams アプリ** を展開し、**セットアップ ポリシー** を選択します。**アプリ セットアップ ポリシー** の一覧が表示されるので、**グローバル (組織全体の既定)** ポリシーを選択します。  

4️⃣ **カスタム アプリのアップロードを許可** のスイッチが **オン** になっていることを確認します。  

5️⃣ ページを下までスクロールし、**保存** ボタンを選択して変更を保存します。  

> 変更が反映されるまで最大 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="e0" exercise="1" step="1" />

## 演習 2: Agents Toolkit と前提条件をインストールする

このラボは Windows、Mac、Linux のいずれのマシンでも実施できますが、前提条件をインストールできる必要があります。PC にアプリをインストールできない場合は、別のマシン（または仮想マシン）をご用意ください。

### 手順 1: Visual Studio Code をインストールする

**Agents Toolkit for Visual Studio Code** を利用するには、当然ながら Visual Studio Code が必要です。以下からダウンロードしてください: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}  

<cc-end-step lab="e0" exercise="2" step="1" />

### 手順 2: Node.js をインストールする

Node.js は、JavaScript をローカルで実行できるプログラムで、Microsoft Edge や Google Chrome といったブラウザーで使用されているオープンソースの V8 エンジンを使用しています。本ラボで使用する Web サーバーのコードを実行するために Node.js が必要です。

[https://nodejs.org/en/download/](https://nodejs.org/en/download/){target=_blank} にアクセスし、バージョン 18 または 16 をお使いの OS に合わせてインストールしてください。本ラボは Node.js バージョン 18.16.0 でテストされています。すでに別のバージョンがインストールされている場合は、[Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（Windows の場合は[こちらのバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}）を使うと、同一マシンで Node.js のバージョンを簡単に切り替えられます。  

<cc-end-step lab="e0" exercise="2" step="2" />

### 手順 3: Agents Toolkit をインストールする

このラボは **Microsoft 365 Agents Toolkit** バージョン 6.0 を使用しています。

!!! tip "Agents Toolkit とは?"
    Microsoft 365 Agents Toolkit は Microsoft Teams Toolkit の進化版であり、Microsoft 365 Copilot、Microsoft Teams、Microsoft 365 向けのエージェントおよびアプリの開発を支援します。

以下の手順を画面のスクリーンショットに従って実施してください。

1️⃣ Visual Studio Code を開き、拡張機能アイコンをクリックします。  

2️⃣ 「Microsoft 365 Agents」で検索し、Agents Toolkit を見つけます。  

3️⃣ **Install** をクリックします。  

![agents toolkit](../../assets/images/extend-m365-copilot-00/agents-toolkit.png)

!!! note "Agents Toolkit がインストール済みで非表示の場合"
    以前に Agents Toolkit をインストールし、Visual Studio のサイドバーで非表示にした場合は、表示されないことがあります。左サイドバーを右クリックし、Agents Toolkit にチェックを入れると再表示できます。  

<cc-end-step lab="e0" exercise="2" step="3" />

---8<--- "ja/e-congratulations.md"

これで Microsoft 365 Copilot 向けの最初の拡張機能を作成する準備が整いました。次のラボで Declarative Agent を作成しましょう。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/00-prerequisites--ja" />