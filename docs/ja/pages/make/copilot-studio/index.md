---
search:
  exclude: true
---
# Lab MCS - Microsoft Copilot Studio の概要

Microsoft Copilot Studio を使用すると、カスタム エージェントを最大限に構築できます。これらのエージェントは Microsoft Teams、カスタム Web サイト、Skype、Slack などの複数チャネルでホストできるほか、Microsoft 365 Copilot チャット内に配置することも可能です。

Copilot Studio のエージェントは、Microsoft 365 Copilot と同じインフラストラクチャ、オーケストレーター、基盤モデル、およびセキュリティ コントロールを利用するため、ユーザーへ一貫した慣れ親しんだエクスペリエンスを提供します。

![Copilot Studio エージェントのアーキテクチャ図。基盤となるモデルは Microsoft Copilot Studio によって提供されますが、カスタマイズも可能です。オーケストレーターは Copilot Studio が提供します。エージェントはカスタム ナレッジやグラウンディング データ、カスタム スキル、自律機能も提供します。ユーザー エクスペリエンスは Microsoft Teams、Microsoft 365 Copilot、Microsoft SharePoint Online などで提供されます。](../../../assets/images/copilot-studio-agent.png)

ナレッジ ベースとして利用できるデータ ソースの例:

- SharePoint Online
- OneDrive for Business
- 公開 Web サイト
- Microsoft Dataverse テーブル
- Power Platform コネクタ
- など

エージェントはトピックを通じてユーザーと対話します。トピックでは、単一ターンまたはマルチターンの会話を定義できます。  
それぞれのエージェントには、Power Automate フロー、Power Platform コネクタ、外部 REST API などと連携するカスタム アクションを追加できます。  
一般的に、Copilot Studio を使用すると、コードを 1 行も記述することなく非常に強力なエージェントを作成できます。

![Microsoft Copilot Studio の UI。新しいエージェントを作成する際、名前、ロゴ、説明、自然言語による指示などを入力する画面が表示されます。](../../../assets/images/make-global-intro/copilot-studio-01.png)

Copilot Studio を使用するには、エージェントを作成または保守する各ユーザーに _per user license_（ユーザー単位の ライセンス）が必要です。さらに、組織レベルで Copilot Studio の _tenant license_（テナント ライセンス）も必要になります。2024 年 12 月 1 日より、Copilot Studio のメッセージに対して Pay-As-You-Go がサポートされ、使用したメッセージ分のみを柔軟に支払えるようになります。

<hr />

---8<--- "ja/mcs-labs-toc.md"

## <a href="./00-prerequisites">ここから開始</a>する Lab MCS0 では、Copilot Studio 用の環境をセットアップします。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/index--ja" />