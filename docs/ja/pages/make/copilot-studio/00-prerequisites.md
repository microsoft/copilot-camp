---
search:
  exclude: true
---
# ラボ MCS0 - セットアップ

本ラボでは、 Microsoft 365 テナント をセットアップし、 Microsoft Copilot Studio を使用して エージェント を作成するための構成を行います。  
Microsoft Copilot Studio は Microsoft Power Platform オファリング の一部であり、専用のライセンス が必要です。詳細は [Microsoft Power Platform Licensing Guide](https://go.microsoft.com/fwlink/?linkid=2085130){target=_blank} をご参照ください。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/RF9RBhPp6v8" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボ の概要 を素早く確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note "Microsoft 365 Copilot および Microsoft Copilot Studio 用開発環境セットアップ"
    本ラボでは、既に開発者テナント をお持ちであることを前提としています。対象のテナント でテナント を取得する方法については、[こちらのページ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/prerequisites){target=_blank} をご参照ください。また、新しい Power Platform 環境 を作成できるように、Power Platform 管理者 権限 を持つ ユーザーアカウント をご用意ください。

本ラボで学習する内容:

- ラボ 用 の専用環境 の作成方法
- Microsoft Copilot Studio のセットアップおよび構成方法

!!! pied-piper "注意事項"
    これらのサンプルおよびラボ は、教育およびデモンストレーション目的 で提供されており、本番環境 での使用を目的としておりません。  
    本番品質 へアップグレードしない限り、本番環境 へ導入しないでください。

## 演習 1 : Power Platform 環境 の作成

Microsoft Power Platform を使用すると、ニーズ に合わせてさまざまな 環境 を作成し、簡単 に切り替えることができます。  
各 環境 にはアプリ、フロー、データ、エージェント 等 が保存され、各 環境 は他の 環境 とは完全 に分離されています。  
Power Platform 環境 の詳細 については、こちらの [概要ドキュメント](https://learn.microsoft.com/en-us/power-platform/admin/environments-overview){target=_blank} をご覧ください。

!!! note "Power Platform 管理者権限"
    本演習 の手順 を進めるためには、対象テナント で Power Platform 管理者 権限 を持つ ユーザーアカウント が必要です。  
    そのようなアカウント をお持ちでない場合は、Power Platform 管理者 に環境 の作成および新しい 環境 へのアクセス権 の付与 を依頼してください。

### ステップ 1: 新しい Power Platform 環境 の作成

これら のラボ を利用するため、新しい専用 環境 を作成します。  
このトレーニング パス の最後 に、関連リソース および設定 をすべて削除できるようにするためです。  
以下 は、環境 を作成する手順 です。

- ブラウザー を開き、対象 Microsoft 365 テナント の 仕事用アカウント を使用して [https://admin.powerplatform.com](https://admin.powerplatform.com){target=_blank} にアクセスします。

- 1️⃣ の **Manage** セクション に移動し、2️⃣ の **Environments** パネル を選択し、3️⃣ の **+ New** を選択して 4️⃣ の **New environment** ペーン を開きます。

![新しい環境 を作成するための Microsoft Power Platform 管理センター のユーザー インターフェイス。](../../../assets/images/make/copilot-studio-00/new-environment-01.png)

- 環境 に一意 の名前 を指定します。例として、"Copilot Dev Camp" を使用することができます。

- **Make this a Managed Environment** 設定 はデフォルト値 (off) のままにします。

- ニーズ に合わせて **Region** を選択します。

- **Get new features early** 設定 はデフォルト値 (off) のままにします。

- **Type** 設定 で **Developer** を選択します。

!!! note "環境タイプ の理解"
    お好みの場合は、**Type** 設定 で **Trial** を選択することもできます。  
    これにより、30 日間有効 な完全機能 の環境 が作成され、その後自動 に削除されます。  
    **Trial** 環境 の詳細 については、[こちら](https://learn.microsoft.com/en-gb/microsoft-copilot-studio/environments-first-run-experience#trial-environments){target=_blank} をご覧ください。  
    さらに、利用可能 なすべて の環境タイプ の詳細 な説明 については、[こちら](https://learn.microsoft.com/en-us/power-platform/admin/environments-overview#power-platform-environment-types){target=_blank} をご覧ください。

- その他 の設定 はそのままにします。

- **Next** を選択します。

- **Language** および **Currency** を選択するか、またはデフォルト のもの を使用します。

![新しい環境 のための言語、通貨、および最終設定 を構成するための Microsoft Power Platform 管理センター のユーザー インターフェイス。](../../../assets/images/make/copilot-studio-00/new-environment-02.png)

- その他 の設定 はそのままにし、**Save** を選択して環境 を実際 に作成します。

新しい 環境 が準備 されるまでにはしばらく時間 がかかります。  
Power Platform 管理センター の 環境 一覧 でその状態 をご確認ください。

![「Preparing」 状態 にある新しい 環境 と、新しい 環境 が準備中 であることを示す緑色 のボックス を含む 環境 一覧。](../../../assets/images/make/copilot-studio-00/new-environment-03.png)

新しい 環境 の準備 が整うと、環境 一覧 に情報 が表示されます。

![「Ready」 状態 にある新しい 環境 と、新しい 環境 が正常 に作成されたことを示す緑色 のボックス を含む 環境 一覧。](../../../assets/images/make/copilot-studio-00/new-environment-04.png)

<cc-end-step lab="mcs0" exercise="1" step="1" />

## 演習 2 : Microsoft Copilot Studio

Microsoft Copilot Studio を使用するには、有効 なライセンス を取得し、使用する対象テナント で有効化する必要 があります。

!!! note "Microsoft Copilot Studio ライセンス"
    Microsoft Copilot Studio へのライセンス アクセス を得る方法 は複数あります。  
    [Power Platform Licensing Guide](https://go.microsoft.com/fwlink/?LinkId=2085130){target=_blank} をご参照ください。

### ステップ 1: Microsoft Copilot Studio の有効化

Copilot Studio を有効化 するには、次 の手順 に従ってください。

- ブラウザー を開き、対象 Microsoft 365 テナント の 仕事用アカウント を使用して [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスします。

- もし初めて Copilot Studio を実行し、ライセンス をお持ちでない場合、以下 の画面 が表示され、試用期間 を開始することができます。

![Copilot Studio の試用期間 を開始するためのウェブページ。国 を選択し、Microsoft からのオファー に関するメッセージ 受信 の可否 を選択し、無料試用期間 を開始します。](../../../assets/images/make/copilot-studio-00/mcs-trial-01.png)

!!! note "Copilot Studio 無料試用期間"
    Copilot Studio の無料試用ライセンス に関する追加情報 は、[こちらのドキュメント](https://learn.microsoft.com/en-us/microsoft-copilot-studio/sign-up-individual){target=_blank} をご覧ください。

- 画面右上 の 1️⃣ **Environment** セクション を選択し、演習 1 で作成した 環境 を選択します。

![ターゲット 環境 を選択する際 の Copilot Studio のユーザー インターフェイス。画面右上 に利用可能 なすべて の環境 が表示され、ターゲット とする 環境 を選択できます。](../../../assets/images/make/copilot-studio-00/new-environment-05.png)

- Copilot Studio が再読み込み され、その後、新しい 環境 での使用 を開始できます。

<cc-end-step lab="mcs0" exercise="2" step="1" />

---8<--- "ja/mcs-congratulations.md"

これで、Microsoft Copilot Studio を使用して最初 の エージェント を作成する準備 が整いました。 

<a href="../01-first-agent">こちら</a> の Lab MCS1 から開始してください。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/00-prerequisites" />