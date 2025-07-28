---
search:
  exclude: true
---
# ラボ MCS - Microsoft Copilot Studio の理解

Microsoft Copilot Studio を使用すると、カスタム エージェントを最大限に活用できます。Microsoft Teams、カスタム Web サイト、Skype、Slack など、複数のチャネルでホストできるエージェントを作成できます。また、Microsoft 365 Copilot チャット内でエージェントをホストすることも可能です。

Copilot Studio のエージェントは、Microsoft 365 Copilot と同じインフラストラクチャ、オーケストレーター、基盤モデル、セキュリティ制御を使用するため、一貫性が高く、ユーザーにとって馴染みのあるエクスペリエンスを提供します。

![Copilot Studio agent architecture diagram. At the very basis there is the foundational model, which is provided by Microsoft Copilot Studio, but you can customize it. The orchestrator is provided by Copilot Studio. The agent provides also custom knowledge and grounding data, custom skills, and autonomous capabilities. The user experience is provided in Microsoft Teams, Microsoft 365 Copilot, Microsoft SharePoint Online, and much more.](../../../assets/images/copilot-studio-agent.png)

ナレッジ ベースとして利用できるリソースの例:

- SharePoint Online
- OneDrive for Business
- 公開 Web サイト
- Microsoft Dataverse テーブル
- Power Platform コネクター
- など

エージェントはトピックを通じてユーザーと対話し、単一ターンまたはマルチターンの会話を定義できます。  
各エージェントには Power Automate フロー、Power Platform コネクター、外部 REST API などと連携するカスタム アクションを設定できます。  
一般的に、Copilot Studio ではコードを一行も書かずに非常に強力なエージェントを作成できます。

![The UI of Microsoft Copilot Studio when creating a new agent. It prompts the user for a name, logo, description, instructions in natural language, etc.](../../../assets/images/make-global-intro/copilot-studio-01.png)

Copilot Studio を使用するには、エージェントを作成または保守する各ユーザーに対してユーザー ライセンス ( _per user license_ とも呼ばれます) が必要です。さらに、組織レベルの Copilot Studio ライセンス ( _tenant license_ とも呼ばれます) も必要です。2024 年 12 月 1 日から、Copilot Studio メッセージに対して Pay-As-You-Go がサポートされ、利用したメッセージ容量に応じて柔軟に支払うことが可能になります。

<hr />

---8<--- "ja/mcs-labs-toc.md"

## <a href="./00-prerequisites">ここから開始</a> — ラボ MCS0 で Copilot Studio の環境をセットアップします。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/index" />