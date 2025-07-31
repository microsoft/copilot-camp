---
search:
  exclude: true
---
# ラボ MCS - Microsoft Copilot Studio の概要

Microsoft Copilot Studio を使用すると、カスタム エージェントを最大限に活用できます。Microsoft Teams、カスタム Web サイト、Skype、Slack など、複数のチャネルでホストできるエージェントを作成可能です。また、Microsoft 365 Copilot チャット内でエージェントをホストすることもできます。

Copilot Studio のエージェントは、Microsoft 365 Copilot と同じインフラストラクチャ、オーケストレーター、基盤モデル、セキュリティ制御を使用しているため、一貫性があり親しみやすい ユーザー エクスペリエンス を実現できます。

![Copilot Studio エージェントのアーキテクチャ図。最下層に Microsoft Copilot Studio が提供する基盤モデルがあり、カスタマイズも可能です。オーケストレーターは Copilot Studio が提供します。エージェントはカスタム ナレッジとグラウンディング データ、カスタム スキル、自律機能を提供します。ユーザー エクスペリエンス は Microsoft Teams、Microsoft 365 Copilot、Microsoft SharePoint Online などで提供されます。](../../../assets/images/copilot-studio-agent.png)

ナレッジ ベースには次のようなものを利用できます:

- SharePoint Online
- OneDrive for Business
- 公開 Web サイト
- Microsoft Dataverse テーブル
- Power Platform コネクター
- など

エージェントはトピックを通じてユーザーと対話し、単一ターンまたはマルチターンの会話を定義できます。  
各エージェントは、Power Automate フロー、Power Platform コネクター、外部 REST API などと連携するカスタム アクションを持つことができます。  
一般的に、Copilot Studio ではコードを一切書かずに強力なエージェントを作成できます。

![Microsoft Copilot Studio の UI で新しいエージェントを作成している画面。名前、ロゴ、説明、自然言語での指示などを入力するプロンプトが表示されている。](../../../assets/images/make-global-intro/copilot-studio-01.png)

Copilot Studio を使用するには、エージェントを作成または管理する各ユーザーに対してユーザー ライセンス ( _per user license_ とも呼ばれます) が必要です。さらに、組織レベルの Copilot Studio ライセンス ( _tenant license_ とも呼ばれます) も必要です。2024 年 12 月 1 日から、メッセージ単位で課金される Pay-As-You-Go が Copilot Studio メッセージでサポートされ、消費したメッセージ容量に対してのみ支払う柔軟性が提供されます。

<hr />

---8<--- "ja/mcs-labs-toc.md"

## <a href="./00-prerequisites">こちらから開始</a> (Lab MCS0) して、Copilot Studio 用の環境をセットアップしましょう。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/index--ja" />