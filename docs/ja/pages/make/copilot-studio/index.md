---
search:
  exclude: true
---
# ラボ MCS - Microsoft Copilot Studio の理解

Microsoft Copilot Studio を使用すれば、カスタム エージェント を最大限に活用して作成できます。作成したエージェントは Microsoft Teams、カスタム Web サイト、Skype、Slack など、複数のチャネルでホストできます。また、Microsoft 365 Copilot チャット内でエージェントをホストすることも可能です。

Copilot Studio のエージェントは、Microsoft 365 Copilot と同じインフラストラクチャ、オーケストレーター、基盤モデル、セキュリティ制御を利用しており、一貫性のある使い慣れた ユーザー エクスペリエンス を提供します。

![Copilot Studio agent architecture diagram. At the very basis there is the foundational model, which is provided by Microsoft Copilot Studio, but you can customize it. The orchestrator is provided by Copilot Studio. The agent provides also custom knowledge and grounding data, custom skills, and autonomous capabilities. The user experience is provided in Microsoft Teams, Microsoft 365 Copilot, Microsoft SharePoint Online, and much more.](../../../assets/images/copilot-studio-agent.png)

ナレッジ ベースとして利用できるソース:

- SharePoint Online
- OneDrive for Business
- 公開 Web サイト
- Microsoft Dataverse テーブル
- Power Platform コネクタ
- など

エージェント はトピックを介して ユーザー と対話し、単一ターンまたはマルチターンの会話を定義できます。  
各エージェントには、Power Automate フロー、Power Platform コネクタ、外部 REST API などと連携するカスタム アクションを持たせることができます。  
一般的に、Copilot Studio を使用すれば、コードを一切記述しなくても非常に強力なエージェント を作成できます。

![The UI of Microsoft Copilot Studio when creating a new agent. It prompts the user for a name, logo, description, instructions in natural language, etc.](../../../assets/images/make-global-intro/copilot-studio-01.png)

Copilot Studio を利用するには、エージェント を作成または保守する各 ユーザー に対して ユーザー ライセンス ( _per user license_ ) が必要です。さらに、組織レベルの Copilot Studio ライセンス ( _tenant license_ ) も必要です。2024 年 12 月 1 日以降、Copilot Studio メッセージでは Pay-As-You-Go がサポートされ、消費したメッセージ容量に対してのみ料金を支払う柔軟性が得られます。

<hr />

---8<--- "ja/mcs-labs-toc.md"

## <a href="./00-prerequisites">ここから開始</a> — Lab MCS0 で Copilot Studio 用の環境をセットアップします。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/index--ja" />