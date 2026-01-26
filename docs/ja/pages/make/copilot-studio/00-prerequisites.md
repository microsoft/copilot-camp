---
search:
  exclude: true
---
# ラボ MCS0 - セットアップ

このラボでは、 Microsoft 365 テナントをセットアップして構成し、 Microsoft Copilot Studio でエージェントの作成を開始します。  
Copilot Studio は Microsoft Power Platform の一部であり、 [Microsoft Power Platform Licensing Guide](https://go.microsoft.com/fwlink/?linkid=2085130){target=_blank} に従った専用のライセンスが必要です。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RF9RBhPp6v8" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note " Microsoft 365 Copilot と Microsoft Copilot Studio の開発環境をセットアップする"
    本ラボでは、すでに開発者テナントが用意されていることを前提としています。テナントの取得方法については  
    [こちらのページ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/prerequisites){target=_blank} を参照してください。また、 Power Platform 管理者権限を持つユーザー アカウントが必要です。新しい Power Platform 環境を作成するためです。

このラボで学習する内容:

- ラボ専用の環境を作成する方法
- Microsoft Copilot Studio をセットアップして構成する方法

!!! pied-piper "注意事項"
    これらのサンプルおよびラボは教育目的とデモンストレーション目的で提供されています。  
    本番環境での使用を意図したものではありません。本番環境に導入する場合は、必ず品質を向上させてから実施してください。

## 演習 1 : Power Platform 環境の作成

 Power Platform では、目的に合わせて複数の環境を作成し、簡単に切り替えることができます。  
環境にはアプリ、フロー、データ、エージェントなどが保存され、各環境は完全に分離されています。  
詳細は [概要ドキュメント](https://learn.microsoft.com/en-us/power-platform/admin/environments-overview){target=_blank} をご覧ください。

!!! note "Power Platform の管理者権限"
    この演習を進めるには、対象テナントで Power Platform 管理者権限を持つユーザー アカウントが必要です。権限がない場合は、 Power Platform 管理者に環境の作成とアクセス権の付与を依頼してください。

### 手順 1: 新しい Power Platform 環境の作成

これらのラボを実施するために専用の環境を作成します。トレーニング終了後に環境を削除すれば、関連リソースや設定をまとめて削除できます。以下の手順で環境を作成してください。

- ブラウザーで、対象 Microsoft 365 テナントの職場アカウントを使用して [https://admin.powerplatform.com](https://admin.powerplatform.com){target=_blank} にアクセスします。

- 1️⃣ **Manage** セクションで 2️⃣ **Environments** パネルを選択し、 3️⃣ **+ New** を選択して 4️⃣ **New environment** ウィンドウを開きます。

![The user interface of the Microsoft Power Platform Admin center to create a new environment.](../../../assets/images/make/copilot-studio-00/new-environment-01.png)

- 環境の一意な名前を指定します。例: 「Copilot Dev Camp」。
- **Make this a Managed Environment** は既定値 (オフ) のままにします。
- **Group** は空白のままにします。
- **Region** をニーズに合わせて選択します。
- **Get new features early** は既定値 (オフ) のままにします。
- **Type** には **Developer** を選択します。

!!! note "環境タイプについて"
    **Type** に **Trial** を選択すると、30 日間有効で自動的に削除される完全機能の環境を利用できます。 **Trial** 環境の詳細は [こちら](https://learn.microsoft.com/en-gb/microsoft-copilot-studio/environments-first-run-experience#trial-environments){target=_blank} を参照してください。また、利用可能なすべての環境タイプの詳細は [こちら](https://learn.microsoft.com/en-us/power-platform/admin/environments-overview#power-platform-environment-types){target=_blank} を参照してください。

- そのほかの設定は変更せず、 **Next** を選択します。
- **Language** と **Currency** を選択するか、既定値のままにします。

![The user interface of the Microsoft Power Platform Admin center to configure language, currency and final settings for a new environment.](../../../assets/images/make/copilot-studio-00/new-environment-02.png)

- そのほかの設定は変更せず、 **Save** を選択して環境を作成します。

作成した環境が準備中であることは、 Power Platform Admin center の環境一覧で確認できます。

![The list of environment with the new one in "Preparing" status and a green box informing you that the new environment is preparing.](../../../assets/images/make/copilot-studio-00/new-environment-03.png)

環境の準備が完了すると、一覧に「Ready」と表示されます。

![The list of environment with the new one in "Ready" status and a green box informing you that the new environment was successfully created.](../../../assets/images/make/copilot-studio-00/new-environment-04.png)

<cc-end-step lab="mcs0" exercise="1" step="1" />

## 演習 2 : Microsoft Copilot Studio

 Microsoft Copilot Studio を利用するには、有効なライセンスを取得し、使用するテナントでアクティブ化する必要があります。

!!! note "Microsoft Copilot Studio のライセンス"
    Microsoft Copilot Studio をライセンス付きで利用する方法は複数あります。詳細は [Power Platform Licensing Guide](https://go.microsoft.com/fwlink/?LinkId=2085130){target=_blank} を参照してください。

### 手順 1: Microsoft Copilot Studio のアクティブ化

 Copilot Studio をアクティブ化する手順は次のとおりです。

- ブラウザーで、対象 Microsoft 365 テナントの職場アカウントを使用して [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスします。

- 初めて Copilot Studio を実行し、ライセンスがない場合は、次の画面が表示され、トライアル期間を開始できます。

![The web page to start a trial period for Copilot Studio. You need to provide your country, to choose whether you want to receive messages from Microsoft about offerts, and to select to start the free trial period.](../../../assets/images/make/copilot-studio-00/mcs-trial-01.png)

!!! note "Copilot Studio の無料トライアル"
    Copilot Studio の無料トライアル ライセンスについては  
    [こちらのドキュメント](https://learn.microsoft.com/en-us/microsoft-copilot-studio/sign-up-individual){target=_blank} を参照してください。

- 画面右上の 1️⃣ **Environment** セクションを選択し、演習 1 で作成した 2️⃣ 環境を選択します。

![The user interface of Copilot Studio when selecting a target environment. There are all the available environments in the upper right corner of the screen and you can choose the one to target.](../../../assets/images/make/copilot-studio-00/new-environment-05.png)

- Copilot Studio が再読み込みされ、新しい環境での利用準備が整います。

<cc-end-step lab="mcs0" exercise="2" step="1" />

---8<--- "ja/mcs-congratulations.md"

これで Copilot Studio で最初のエージェントを作成する準備が整いました。 

<a href="../01-first-agent">こちらから</a> Lab MCS1 を開始し、 Copilot Studio で最初のエージェントを作成しましょう。  
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/00-prerequisites--ja" />