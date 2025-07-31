---
search:
  exclude: true
---
# ラボ MCS0 - セットアップ

このラボでは、Microsoft 365 テナントを設定し、Microsoft Copilot Studio でエージェントを作成できるように構成します。  
Copilot Studio は Microsoft Power Platform の一部であり、[Microsoft Power Platform Licensing Guide](https://go.microsoft.com/fwlink/?linkid=2085130){target=_blank} に記載されているように専用の **ライセンス** が必要です。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RF9RBhPp6v8" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早くご覧いただけます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note "Microsoft 365 Copilot と Microsoft Copilot Studio の開発環境のセットアップ"
    本ラボでは、既に開発者テナントがあることを前提としています。テナントの取得方法については、[こちらのページ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/prerequisites){target=_blank} を参照してください。また、新しい Power Platform 環境を作成できるよう、Power Platform 管理者の権限を持つ **ユーザー** アカウントがあることも前提となります。

このラボで学ぶ内容:

- ラボ用の専用環境を作成する方法
- Microsoft Copilot Studio をセットアップして構成する方法

!!! pied-piper "注意事項"
    これらのサンプルおよびラボは教育目的・デモンストレーション目的で提供されています。  
    本番環境での使用を想定していません。本番環境で利用する場合は、必ずプロダクション品質にアップグレードしてください。

## 演習 1 : Power Platform 環境の作成

Power Platform では、用途に応じて複数の環境を作成し、簡単に切り替えることができます。  
環境にはアプリ、フロー、データ、エージェント などが保存され、各環境は完全に分離されています。  
Power Platform 環境の詳細については、この[概要ドキュメント](https://learn.microsoft.com/en-us/power-platform/admin/environments-overview){target=_blank} を参照してください。

!!! note "Power Platform の管理者権限"
    この演習を進めるには、対象テナントで Power Platform 管理者である **ユーザー** アカウントが必要です。  
    もし権限がない場合は、Power Platform 管理者に環境の作成と、その環境へのアクセス権付与を依頼してください。

### 手順 1: 新しい Power Platform 環境の作成

本ラボでは、演習用に専用の環境を作成します。トレーニングが終了したら環境を削除するだけで、関連リソースや設定をまとめて削除できます。以下の手順で環境を作成してください。

- ブラウザーを開き、対象の Microsoft 365 テナントの職場アカウントで [https://admin.powerplatform.com](https://admin.powerplatform.com){target=_blank} にアクセスします。

- 1️⃣ **Manage** セクションで 2️⃣ **Environments** パネルを選択し、3️⃣ **+ New** をクリックして 4️⃣ **New environment** ウィンドウを開きます。

![Microsoft Power Platform 管理センターで新しい環境を作成するための UI。](../../../assets/images/make/copilot-studio-00/new-environment-01.png)

- 環境名を一意になるよう入力します。例: “Copilot Dev Camp”。

- **Make this a Managed Environment** は既定値 (オフ) のままにします。

- 必要に応じて **Region** を選択します。

- **Get new features early** は既定値 (オフ) のままにします。

- **Type** は **Developer** を選択します。

!!! note "環境タイプについて"
    **Type** として **Trial** を選択することもできます。この場合、機能がフルに使える環境が 30 日間提供され、期間終了後に自動で削除されます。  
    **Trial** 環境の詳細は[こちら](https://learn.microsoft.com/en-gb/microsoft-copilot-studio/environments-first-run-experience#trial-environments){target=_blank}、環境タイプ全般の詳細は[こちら](https://learn.microsoft.com/en-us/power-platform/admin/environments-overview#power-platform-environment-types){target=_blank} を参照してください。

- それ以外の設定は変更せず **Next** を選択します。

- **Language** と **Currency** を選択するか、既定値のままにします。

![新しい環境の言語、通貨、最終設定を構成する UI。](../../../assets/images/make/copilot-studio-00/new-environment-02.png)

- 他の設定は変更せず **Save** を選択して環境を作成します。

新しい環境の準備には少し時間がかかります。準備状況は Power Platform 管理センターの環境一覧で確認できます。

![環境一覧に「Preparing」状態の新しい環境と、それを示す緑色のボックスが表示されている。](../../../assets/images/make/copilot-studio-00/new-environment-03.png)

環境が準備完了になると、一覧に **Ready** と表示されます。

![環境一覧に「Ready」状態の新しい環境と、正常に作成されたことを示す緑色のボックスが表示されている。](../../../assets/images/make/copilot-studio-00/new-environment-04.png)

<cc-end-step lab="mcs0" exercise="1" step="1" />

## 演習 2 : Microsoft Copilot Studio

Microsoft Copilot Studio を使用するには、有効な **ライセンス** が必要であり、利用したいテナントでライセンスをアクティブ化する必要があります。

!!! note "Microsoft Copilot Studio のライセンス"
    Copilot Studio を利用するためのライセンス取得方法は複数あります。詳細は [Power Platform Licensing Guide](https://go.microsoft.com/fwlink/?LinkId=2085130){target=_blank} を参照してください。

### 手順 1: Microsoft Copilot Studio の有効化

Copilot Studio を有効化するには、次の手順を実行します。

- ブラウザーを開き、対象の Microsoft 365 テナントの職場アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスします。

- 初めて Copilot Studio を開き、まだライセンスがない場合は、以下のような画面が表示され、トライアルを開始できます。

![Copilot Studio のトライアルを開始する Web ページ。国を指定し、Microsoft からのオファー受信を選択し、無料トライアルを開始します。](../../../assets/images/make/copilot-studio-00/mcs-trial-01.png)

!!! note "Copilot Studio 無料トライアル"
    Copilot Studio の無料トライアル ライセンスの詳細は、[こちらのドキュメント](https://learn.microsoft.com/en-us/microsoft-copilot-studio/sign-up-individual){target=_blank} を参照してください。

- 画面右上の 1️⃣ **Environment** セクションを選択し、演習 1 で作成した 2️⃣ 環境を選びます。

![Copilot Studio の UI で環境を選択する様子。画面右上に利用可能な環境が一覧表示され、ターゲット環境を選択できる。](../../../assets/images/make/copilot-studio-00/new-environment-05.png)

- 環境を選択すると Copilot Studio が再読み込みされ、新しい環境で利用できるようになります。

<cc-end-step lab="mcs0" exercise="2" step="1" />

---8<--- "ja/mcs-congratulations.md"

これで Copilot Studio で最初のエージェントを作成する準備が整いました。

<a href="../01-first-agent">こちら</a> からラボ MCS1 に進み、Copilot Studio で最初のエージェントを作成しましょう。  
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/00-prerequisites--ja" />