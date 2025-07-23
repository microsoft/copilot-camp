---
search:
  exclude: true
---
# ラボ MCS - Microsoft Copilot Studio の概要

Microsoft Copilot Studio を使うと、カスタム エージェント を最大限に活用できます。Microsoft Teams、カスタム Web サイト、Skype、Slack など、複数のチャネルでホストできる エージェント を作成できます。また、Microsoft 365 Copilot チャット内でも エージェント をホストできます。

Copilot Studio の エージェント は、Microsoft 365 Copilot と同じインフラストラクチャ、オーケストレーター、基盤モデル、セキュリティ制御を使用するため、ユーザー にとって一貫性のある馴染み深いエクスペリエンスを提供します。

![Copilot Studio の エージェント アーキテクチャ図。最下層に基盤モデルがあり、Microsoft Copilot Studio から提供されますがカスタマイズ可能です。オーケストレーターは Copilot Studio から提供されます。エージェント はカスタム ナレッジとグラウンディング データ、カスタム スキル、自律的な機能も提供します。ユーザー エクスペリエンスは Microsoft Teams、Microsoft 365 Copilot、Microsoft SharePoint Online などで提供されます。](../../../assets/images/copilot-studio-agent.png)

ナレッジ ベースとして利用できるのは次のとおりです。

- SharePoint Online
- OneDrive for Business
- 公開 Web サイト
- Microsoft Dataverse テーブル
- Power Platform コネクタ
- など

エージェント はトピックを介して ユーザー と対話し、シングルターンまたはマルチターンの会話を定義できます。  
各 エージェント は、Power Automate フロー、Power Platform コネクタ、外部 REST API などと連携するカスタム アクションを持つことができます。  
一般的に、Copilot Studio を使えば、コードを 1 行も書かずに非常に強力な エージェント を作成できます。

![Microsoft Copilot Studio の UI で新しい エージェント を作成している画面。名前、ロゴ、説明、自然言語による instructions などの入力が求められています。](../../../assets/images/make-global-intro/copilot-studio-01.png)

Copilot Studio を利用するには、エージェント を作成または保守する各 ユーザー に対して ユーザー ライセンス（_per user license_ とも呼ばれます）が必要です。さらに、組織レベルの Copilot Studio ライセンス（_tenant license_ とも呼ばれます）も必要です。2024 年 12 月 1 日からは、Copilot Studio メッセージに対する従量課金制 (Pay-As-You-Go) がサポートされ、使用したメッセージ容量に応じて柔軟に支払えるようになります。

<hr />

---8<--- "ja/mcs-labs-toc.md"

## <a href="./00-prerequisites">こちらから開始</a>（Lab MCS0）し、Copilot Studio 用の環境をセットアップしましょう。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/index" />