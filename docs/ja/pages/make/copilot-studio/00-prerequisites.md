---
search:
  exclude: true
---
# ラボ MCS0 - セットアップ

このラボでは、Microsoft 365 テナントをセットアップして Microsoft Copilot Studio で エージェント を作成できるように構成します。  
Copilot Studio は Microsoft Power Platform 製品の一部であり、[Microsoft Power Platform Licensing Guide](https://go.microsoft.com/fwlink/?linkid=2085130){target=_blank} に記載されているとおり、専用の ライセンス が必要です。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RF9RBhPp6v8" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を簡単にご確認いただけます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note "Microsoft 365 Copilot と Microsoft Copilot Studio 用の開発環境をセットアップする"
    このラボでは、すでに開発者テナントが用意されていることを前提としています。テナントの取得方法については、[こちらのページ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/prerequisites){target=_blank} を参照してください。また、新しい Power Platform 環境を作成できるように、Power Platform 管理者権限を持つ ユーザー アカウントがあることも前提としています。

このラボで学習する内容:

- ラボ専用の環境を作成する方法
- Microsoft Copilot Studio をセットアップして構成する方法

!!! pied-piper "注意事項"
    これらのサンプルとラボは、教育およびデモンストレーションを目的としたものです。運用環境で使用することを想定していません。運用環境に導入する場合は、必ず運用レベルにアップグレードしてください。

## Exercise 1 : Power Platform 環境の作成

Power Platform では、用途に応じて複数の環境を作成し、簡単に切り替えることができます。  
環境にはアプリ、フロー、データ、 エージェント などが保存され、各環境は相互に完全に分離されています。Power Platform の環境については、この [概要ドキュメント](https://learn.microsoft.com/en-us/power-platform/admin/environments-overview){target=_blank} を参照してください。

!!! note "Power Platform の管理者権限"
    この Exercise の手順を実行するには、対象テナントで Power Platform 管理者ロールを持つ ユーザー アカウントが必要です。該当するアカウントがない場合は、Power Platform 管理者に環境の作成と、その環境へのアクセス権付与を依頼してください。

### Step 1: 新しい Power Platform 環境を作成する

このラボでは、学習用に専用の環境を作成します。トレーニング終了後に環境ごと削除すれば、関連リソースや設定をまとめて消去できます。以下の手順で環境を作成してください。

- ブラウザーを開き、対象 Microsoft 365 テナントの職場アカウントで [https://admin.powerplatform.com](https://admin.powerplatform.com){target=_blank} にアクセスします。

- 1️⃣ **Manage** セクションで 2️⃣ **Environments** パネルを選択し、3️⃣ **+ New** をクリックして 4️⃣ **New environment** ペインを開きます。

![The user interface of the Microsoft Power Platform Admin center to create a new environment.](../../../assets/images/make/copilot-studio-00/new-environment-01.png)

- 環境の一意な名前を入力します。たとえば「Copilot Dev Camp」など。

- **Make this a Managed Environment** は既定値 (オフ) のままにします。

- **Region** をニーズに合わせて選択します。

- **Get new features early** は既定値 (オフ) のままにします。

- **Type** には **Developer** を選択します。

!!! note "環境タイプについて"
    必要に応じて **Type** に **Trial** を選択することもできます。Trial 環境は 30 日間利用でき、期間終了後に自動的に削除されます。**Trial** 環境の詳細は[こちら](https://learn.microsoft.com/en-gb/microsoft-copilot-studio/environments-first-run-experience#trial-environments){target=_blank}。また、すべての環境タイプの詳細説明は[こちら](https://learn.microsoft.com/en-us/power-platform/admin/environments-overview#power-platform-environment-types){target=_blank}を参照してください。

- そのほかの設定は変更せず **Next** を選択します。

- **Language** と **Currency** を選択するか、既定値のままにします。

![The user interface of the Microsoft Power Platform Admin center to configure language, currency and final settings for a new environment.](../../../assets/images/make/copilot-studio-00/new-environment-02.png)

- ほかの設定はすべて既定値のままにし、**Save** を選択して環境を作成します。

新しい環境が準備中の間は、Power Platform 管理センターの環境一覧にステータスが表示されます。

![The list of environment with the new one in "Preparing" status and a green box informing you that the new environment is preparing.](../../../assets/images/make/copilot-studio-00/new-environment-03.png)

環境の準備が完了すると、一覧に状態が反映されます。

![The list of environment with the new one in "Ready" status and a green box informing you that the new environment was successfully created.](../../../assets/images/make/copilot-studio-00/new-environment-04.png)

<cc-end-step lab="mcs0" exercise="1" step="1" />

## Exercise 2 : Microsoft Copilot Studio

Microsoft Copilot Studio を使用するには、有効な ライセンス が必要であり、使用するテナントでアクティブ化する必要があります。

!!! note "Microsoft Copilot Studio のライセンス"
    Microsoft Copilot Studio を利用する方法はいくつかあります。詳細は [Power Platform Licensing Guide](https://go.microsoft.com/fwlink/?LinkId=2085130){target=_blank} を参照してください。

### Step 1: Microsoft Copilot Studio をアクティブ化する

Copilot Studio をアクティブ化するには、次の手順を実行します。

- ブラウザーを開き、対象 Microsoft 365 テナントの職場アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスします。

- Copilot Studio を初めて起動し、 ライセンス を持っていない場合、次の画面が表示され Trial 期間を開始できます。

![The web page to start a trial period for Copilot Studio. You need to provide your country, to choose whether you want to receive messages from Microsoft about offerts, and to select to start the free trial period.](../../../assets/images/make/copilot-studio-00/mcs-trial-01.png)

!!! note "Copilot Studio の無料 Trial 期間"
    Copilot Studio の無料 Trial ライセンスについては [こちらのドキュメント](https://learn.microsoft.com/en-us/microsoft-copilot-studio/sign-up-individual){target=_blank} を参照してください。

- 画面右上の 1️⃣ **Environment** セクションを選択し、Exercise 1 で作成した 2️⃣ 環境を選びます。

![The user interface of Copilot Studio when selecting a target environment. There are all the available environments in the upper right corner of the screen and you can choose the one to target.](../../../assets/images/make/copilot-studio-00/new-environment-05.png)

- Copilot Studio がリロードされ、新しい環境で使用する準備が整います。

<cc-end-step lab="mcs0" exercise="2" step="1" />

---8<--- "ja/mcs-congratulations.md"

これで Copilot Studio で最初の エージェント を作成する準備が整いました。 

<a href="../01-first-agent">こちら</a>の Lab MCS1 から始めて、Copilot Studio で最初の エージェント を作成しましょう。  
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/00-prerequisites" />