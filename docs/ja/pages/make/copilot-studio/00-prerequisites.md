---
search:
  exclude: true
---
# ラボ MCS0 - セットアップ

このラボでは、Microsoft Copilot Studio を使用してエージェントを作成し始めるために、Microsoft 365 テナントをセットアップおよび構成します。  
Copilot Studio は Microsoft Power Platform の一部であり、[Microsoft Power Platform Licensing Guide](https://go.microsoft.com/fwlink/?linkid=2085130){target=_blank} に従って専用の ライセンス が必要です。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RF9RBhPp6v8" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を簡単に確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note "Microsoft 365 Copilot と Microsoft Copilot Studio 用の開発環境をセットアップする"
    このラボでは、すでに開発者テナントをお持ちであることを前提としています。テナントの入手方法については、
    [こちらのページ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/prerequisites){target=_blank} を参照してください。また、新しい Power Platform 環境を作成できるよう、Power Platform 管理者である ユーザー アカウントを保有していることも前提としています。

このラボで学習する内容:

- ラボ用の専用環境を作成する方法
- Microsoft Copilot Studio をセットアップおよび構成する方法

!!! pied-piper "注意事項"
    これらのサンプルおよびラボは、学習およびデモンストレーション目的のために提供されています。運用環境での使用を意図していません。運用環境で使用する場合は、必ず運用レベルにアップグレードしてください。

## 演習 1 : Power Platform 環境の作成

Power Platform では、ニーズに応じて複数の環境を作成し、簡単に切り替えることができます。  
環境にはアプリ、フロー、データ、エージェントなどが保存され、各環境はほかの環境から完全に分離されています。  
Power Platform の環境については、[概要ドキュメント](https://learn.microsoft.com/en-us/power-platform/admin/environments-overview){target=_blank} を参照してください。

!!! note "Power Platform の管理者権限"
    この演習の手順を実行するには、対象テナントで Power Platform 管理者である ユーザー アカウントが必要です。そのようなアカウントがない場合は、Power Platform 管理者に環境を作成してもらい、その環境へのアクセス権を付与してもらってください。

### 手順 1: 新しい Power Platform 環境の作成

これらのラボを実施するために、新しい専用環境を作成します。このトレーニングの終了後に環境を削除すれば、関連するリソースと設定をまとめて削除できます。以下の手順で環境を作成してください。

- ブラウザーを開き、対象の Microsoft 365 テナントの職場 アカウントを使用して [https://admin.powerplatform.com](https://admin.powerplatform.com){target=_blank} にアクセスします。

- 1️⃣ **Manage** セクションで 2️⃣ **Environments** パネルを選択し、3️⃣ **+ New** を選択して 4️⃣ **New environment** ペインを開きます。

![The user interface of the Microsoft Power Platform Admin center to create a new environment.](../../../assets/images/make/copilot-studio-00/new-environment-01.png)

- 環境の一意な名前を指定します。たとえば「Copilot Dev Camp」などです。

- **Make this a Managed Environment** 設定は既定値 (オフ) のままにします。

- 必要に応じて **Region** を選択します。

- **Get new features early** 設定は既定値 (オフ) のままにします。

- **Type** 設定で **Developer** を選択します。

!!! note "環境タイプについて"
    **Type** 設定で **Trial** を選択することもできます。Trial 環境は 30 日間有効で、自動的に削除されます。**Trial** 環境の詳細は[こちら](https://learn.microsoft.com/en-gb/microsoft-copilot-studio/environments-first-run-experience#trial-environments){target=_blank} を、その他の環境タイプの詳細は[こちら](https://learn.microsoft.com/en-us/power-platform/admin/environments-overview#power-platform-environment-types){target=_blank} を参照してください。

- そのほかの設定は変更しないでください。

- **Next** を選択します。

- **Language** と **Currency** を選択するか、既定値のままにします。

![The user interface of the Microsoft Power Platform Admin center to configure language, currency and final settings for a new environment.](../../../assets/images/make/copilot-studio-00/new-environment-02.png)

- そのほかの設定は変更せず、**Save** を選択して環境を作成します。

新しい環境が準備されるまでしばらく時間がかかります。Power Platform 管理センターの環境一覧で状況を確認できます。

![The list of environment with the new one in "Preparing" status and a green box informing you that the new environment is preparing.](../../../assets/images/make/copilot-studio-00/new-environment-03.png)

環境が準備完了になると、一覧に状態が反映されます。

![The list of environment with the new one in "Ready" status and a green box informing you that the new environment was successfully created.](../../../assets/images/make/copilot-studio-00/new-environment-04.png)

<cc-end-step lab="mcs0" exercise="1" step="1" />

## 演習 2 : Microsoft Copilot Studio

Microsoft Copilot Studio を使用するには、有効な ライセンス が必要であり、使用したいテナントでライセンスをアクティブ化する必要があります。

!!! note "Microsoft Copilot Studio のライセンス"
    Microsoft Copilot Studio にアクセスする ライセンス には複数のオプションがあります。[Power Platform Licensing Guide](https://go.microsoft.com/fwlink/?LinkId=2085130){target=_blank} を参照してください。

### 手順 1: Microsoft Copilot Studio の有効化

Copilot Studio を有効化するには、次の手順を実行します。

- ブラウザーを開き、対象 Microsoft 365 テナントの職場 アカウントを使用して [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスします。

- Copilot Studio を初めて起動し、ライセンスを保有していない場合、次の画面が表示され、トライアル期間を開始できます。

![The web page to start a trial period for Copilot Studio. You need to provide your country, to choose whether you want to receive messages from Microsoft about offerts, and to select to start the free trial period.](../../../assets/images/make/copilot-studio-00/mcs-trial-01.png)

!!! note "Copilot Studio の無料トライアル期間"
    Copilot Studio の無料トライアル ライセンス については
    [こちらのドキュメント](https://learn.microsoft.com/en-us/microsoft-copilot-studio/sign-up-individual){target=_blank} を参照してください。

- 画面右上の 1️⃣ **Environment** セクションを選択し、演習 1 で作成した 2️⃣ 環境を選択します。

![The user interface of Copilot Studio when selecting a target environment. There are all the available environments in the upper right corner of the screen and you can choose the one to target.](../../../assets/images/make/copilot-studio-00/new-environment-05.png)

- Copilot Studio が再読み込みされ、新しい環境で使用できるようになります。

<cc-end-step lab="mcs0" exercise="2" step="1" />

---8<--- "ja/mcs-congratulations.md"

これで Copilot Studio で最初の エージェント を作成する準備が整いました。 

<a href="../01-first-agent">ここから開始</a> し、ラボ MCS1 で Copilot Studio を使って最初の エージェント を作成しましょう。  
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/00-prerequisites" />