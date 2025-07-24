---
search:
  exclude: true
---
# ラボ MCS ― Microsoft Copilot Studio の理解

Microsoft Copilot Studio を使用することで、カスタムエージェント の作成における最大限 の可能性を手に入れることができます。これを利用して、Microsoft Teams 、カスタム Web サイト、Skype、Slack など、さまざまなチャンネルでホストできるエージェント を作成できます。また、Microsoft 365 Copilot チャット 内でもエージェント をホストすることが可能です。

Copilot Studio エージェント は、Microsoft 365 Copilot と同じインフラストラクチャ、オーケストレーター、基盤モデル、およびセキュリティ制御を使用しており、一貫性があり親しみやすいユーザー エクスペリエンス を実現します。

![Copilot Studio エージェント アーキテクチャ図。最も基本となる部分は、Microsoft Copilot Studio によって提供される基盤モデルですが、カスタマイズすることが可能です。オーケストレーター は Copilot Studio により提供されます。エージェント は、カスタム知識およびグラウンディング データ、カスタムスキル、そして自律機能も提供します。ユーザー エクスペリエンス は Microsoft Teams 、Microsoft 365 Copilot、Microsoft SharePoint Online など多岐に渡るプラットフォームで提供されます。](../../../assets/images/copilot-studio-agent.png)

ナレッジ ベース は以下のようなものです:

- SharePoint Online
- OneDrive for Business
- パブリック Web サイト
- Microsoft Dataverse テーブル
- Power Platform コネクタ
- etc.

エージェント は、トピック を通じてユーザー と対話し、これによりシングルターンまたはマルチターン の会話を定義できます。  
すべてのエージェント は、Power Automate フロー、Power Platform コネクタ、外部 REST API などと連携するためのカスタムアクション を備えることが可能です。  
一般的に、Microsoft Copilot Studio を利用すれば、コード を一行も記述する必要なく、非常に強力なエージェント を作成することができます。

![新しいエージェント 作成時の Microsoft Copilot Studio の UI。ユーザー に対して名前、ロゴ、説明、自然言語の指示などを求めます。](../../../assets/images/make-global-intro/copilot-studio-01.png)

Microsoft Copilot Studio を利用するには、エージェント の作成または保守を行う各ユーザー に対してユーザーライセンス（_per user license_ とも呼ばれます）が必要です。さらに、Microsoft Copilot Studio には組織レベル のライセンス（_tenant license_ とも呼ばれます）が必要です。2024 年 12 月 1 日より、Copilot Studio メッセージ に対して Pay‑As‑You‑Go がサポートされるため、顧客 は消費するメッセージ容量に対してのみ支払う柔軟性を得ることができます。

<hr />

---8<--- "ja/mcs-labs-toc.md"

## <a href="./00-prerequisites">ここから開始</a> ラボ MCS0（Copilot Studio 用環境構築）

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/index" />