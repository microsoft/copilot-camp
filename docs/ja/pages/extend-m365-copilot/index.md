---
search:
  exclude: true
---
# Microsoft 365 Copilot の拡張

**Declarative エージェント** は、Microsoft 365 向けのエージェントの一種です。Microsoft 365 Copilot を拡張することで作成でき、特定のシナリオに合わせたカスタム ナレッジとカスタム アクションを定義して構築します。

Declarative エージェントは、Microsoft 365 Copilot と同じインフラストラクチャ、オーケストレーター、基盤モデル、セキュリティ制御を使用するため、一貫性があり親しみやすいユーザー エクスペリエンスを提供します。

![Declarative agent architecture diagram. At the very basis there is the foundational model of Microsoft 365 Copilot, as well as the same orchestrator. The agent provides also custom knowledge and grounding data, and custom skills as actions, triggers, and workflows.. The user experience is available in Microsoft 365 Copilot.](../../assets/images/m365-declarative-agent.png)

## このラボで行うこと

Copilot Developer Camp の Extend Path では、人事部門向けにカスタマイズされたアシスタントを構築します。まず Declarative エージェント作成の基本を理解し、シンプルな Declarative エージェントを作成してから、フル機能を備えたアシスタントへと発展させます。
この高度なアシスタントには、組織データを取得するために Microsoft 365 テナントと連携した認証メカニズムを含むセキュリティ機能が搭載されます。

| Section                            | Purpose                                                 |
| ---------------------------------- | ------------------------------------------------------- |
| **セットアップ**                     | 前提条件の準備を行います。                               |
| **Declarative エージェントの基礎**    | Declarative エージェントの概念に集中し、ベース テンプレートから始めてさらに探求します。 |
| **API の構築と統合**                | API の作成とエージェントへの接続を扱います。Adaptive Cards で UI を強化します。 |
| **認証**                           | 認証関連のラボをすべて含みます。                         |
| **統合**                           | Copilot コネクタなどで機能を拡張します。                |

## [Start here](./00-prerequisites) with Lab E0, where you'll set up development your environment

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/index--ja" />