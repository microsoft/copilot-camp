---
search:
  exclude: true
---
# ラボ E0 - セットアップ

このラボでは、Microsoft 365 Copilot を活用して、カスタマイズされた AI アシスタンスを実現するための Copilot エージェントを構築、テスト、デプロイするための開発環境をセットアップします。

!!! note "Microsoft 365 Copilot のための開発環境のセットアップ"
    このラボでは、セットアップに必要なテナントをすでに所有していることを前提としています。テナントの取得方法については、[page here](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/prerequisites){target=_blank} をご参照ください。

このラボでは、以下を学びます：

- Microsoft 365 テナントの Teams アップロードポリシーをラボ利用に向けて設定する方法
- Visual Studio Code 用 Microsoft 365 Agents Toolkit のインストールと設定方法


<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/VDhRFMH3Qbs" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早くご確認いただけます。</div>
            <div class="disclaimer-box">
            ⚠️ <strong>注意事項:</strong> これらのコード例およびラボは、教育およびデモンストレーション目的で提供されており、商用利用を意図していません。生産環境で使用する前に、商用品質にアップグレードしてください。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## エクササイズ 1：Teams アップロードポリシーの設定

### ステップ 1：Teams カスタムアプリのアップロードを有効にする

デフォルトでは、エンドユーザーが直接アプリケーションをアップロードすることはできません。その代わりに、Teams 管理者が企業向けアプリ カタログにアップロードする必要があります。このステップでは、Agents Toolkit による直接アップロードが利用できるよう、テナントの設定を行います。

1️⃣ [https://admin.microsoft.com/](https://admin.microsoft.com/){target=_blank} にアクセスしてください。これは Microsoft 365 管理センターです。

2️⃣ 管理センターの左側ペインで **Show all** を選択し、全ナビゲーションを表示します。ペインが展開したら、**Teams** を選択して Microsoft Teams 管理センターを開いてください。

3️⃣ Microsoft Teams 管理センターの左側ペインで、Teams アプリのアコーディオンを展開してください。**Setup Policies** を選択すると、アプリセットアップポリシーの一覧が表示されます。その後、**Global (Org-wide default) policy** を選択してください。

4️⃣ 最初のスイッチ、**Upload custom apps** が **On** になっていることを確認してください。

5️⃣ 下にスクロールし、**Save** ボタンを選択して変更を保存してください。

> 変更が反映されるまで最大で 24 時間かかる場合がありますが、通常はもっと早く反映されます。

<cc-end-step lab="e0" exercise="1" step="1" />

## エクササイズ 2：Agents Toolkit と必要条件のインストール

これらのラボは、Windows、Mac、または Linux マシンで実行できますが、必要な prerequisites をインストールする権限が必要です。もし、お使いのコンピューターでアプリケーションのインストールが許可されていない場合は、ワークショップの間使用できる別のマシン（または仮想マシン）を用意する必要があります。

### ステップ 1：Visual Studio Code のインストール

ご承知の通り、**Agents Toolkit for Visual Studio Code** の動作には Visual Studio Code が必要です。こちらからダウンロードできます: [Visual Studio Code](https://code.visualstudio.com/download){target=_blank}.

<cc-end-step lab="e0" exercise="2" step="1" />

### ステップ 2：Node.js のインストール

Node.js は、コンピューター上で JavaScript を実行できるプログラムです。Microsoft Edge や Google Chrome などの人気ウェブブラウザでも使用されているオープンソースの "V8" エンジンを使用しています。このワークショップで使用される Web サーバーのコードを実行するために Node.js が必要となります。

https://nodejs.org/en/download/ にアクセスして、使用している OS に対してバージョン 18 または 16 の Node.js をインストールしてください。このラボは Node.js バージョン 18.16.0 でテスト済みです。すでに別のバージョンの Node.js がインストールされている場合、同一コンピューター上で Node.js のバージョンを簡単に切り替えられる [Node Version Manager](https://github.com/nvm-sh/nvm){target=_blank}（Microsoft Windows の場合は [このバリエーション](https://github.com/coreybutler/nvm-windows){target=_blank}）を設定することをお勧めします。

<cc-end-step lab="e0" exercise="2" step="2" />

### ステップ 3：Agents Toolkit のインストール

これらのラボは、**Microsoft 365 Agents Toolkit** バージョン 6.0 をベースにしています。

!!! tip "Agents Toolkit とは？"
    Microsoft 365 Agents Toolkit は Microsoft Teams Toolkit の進化版であり、Microsoft 365 Copilot、Microsoft Teams、Microsoft 365 用のエージェントおよびアプリの開発を支援するために設計されています。

以下のスクリーンショットに示す手順に従ってください。

1️⃣ Visual Studio Code を開き、拡張機能ツールバーのボタンをクリックしてください。

2️⃣ 「Microsoft 365 Agents」で検索し、Agents Toolkit を見つけてください。

3️⃣ **Install** をクリックしてください。

![agents toolkit](../../assets/images/extend-m365-copilot-00/agents-toolkit.png)

!!! note "Agents Toolkitがインストール済みでも非表示の場合"
    以前に Agents Toolkit をインストールし、Visual Studio サイドバーで非表示にした場合、表示されない理由に疑問を持たれるかもしれません。左側のサイドバーを右クリックし、Agents Toolkit のチェックをオンにして表示させてください。

<cc-end-step lab="e0" exercise="2" step="3" />


---8<--- "ja/e-congratulations.md"

これで、Microsoft 365 Copilot の最初の拡張機能を作成する準備が整いました。次のラボに進み、 Declarative Agent を作成してください。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/00-prerequisites" />