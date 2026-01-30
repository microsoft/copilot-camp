---
search:
  exclude: true
---
# ラボ MCS - Microsoft Copilot Studio の理解

Microsoft Copilot Studio を使用すると、カスタム エージェント を最大限に活用できます。Microsoft Teams、カスタム Web サイト、Skype、Slack など、複数のチャネルでホストできる エージェント を作成できます。また、Microsoft 365 Copilot チャット内で エージェント をホストすることも可能です。

Copilot Studio の エージェント は、Microsoft 365 Copilot と同じインフラストラクチャ、オーケストレーター、基盤モデル、セキュリティ制御を使用するため、ユーザー に一貫性のある馴染み深いエクスペリエンスを提供します。

![Copilot Studio agent architecture diagram. At the very basis there is the foundational model, which is provided by Microsoft Copilot Studio, but you can customize it. The orchestrator is provided by Copilot Studio. The agent provides also custom knowledge and grounding data, custom skills, and autonomous capabilities. The user experience is provided in Microsoft Teams, Microsoft 365 Copilot, Microsoft SharePoint Online, and much more.](../../../assets/images/copilot-studio-full-agent.png)

ナレッジ ベース として使用できるソース:

- SharePoint Online
- OneDrive for Business
- 公開 Web サイト
- Microsoft Dataverse テーブル
- Power Platform コネクター
- など

エージェント はトピックを通じて ユーザー と対話し、単一ターンまたは複数ターンの会話を定義できます。  
各 エージェント には、Power Automate フロー、Power Platform コネクター、外部 REST API などと連携するカスタム アクションを追加できます。  
概して、Copilot Studio を使用すれば、コードを 1 行も記述せずに非常に強力な エージェント を作成できます。

![The UI of Microsoft Copilot Studio when creating a new agent. It prompts the user for a name, logo, description, instructions in natural language, etc.](../../../assets/images/make-global-intro/copilot-studio-01.png)

Copilot Studio を利用するには、エージェント を作成または保守するそれぞれの ユーザー に対して ユーザー ライセンス (_per user license_) が必要です。さらに、組織レベルの Copilot Studio ライセンス (_tenant license_) も必要です。2024 年 12 月 1 日より、Copilot Studio のメッセージに対して Pay-As-You-Go がサポートされ、消費したメッセージ容量にのみ課金される柔軟なオプションが提供されます。

<hr />

---8<--- "ja/mcs-labs-toc.md"

## <a href="./00-prerequisites">Lab MCS0 から開始</a> — Copilot Studio 用の環境をセットアップします。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/index--ja" />