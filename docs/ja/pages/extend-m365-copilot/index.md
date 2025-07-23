---
search:
  exclude: true
---
# Microsoft 365 Copilot の拡張

**Declarative agents** は Microsoft 365 向けのエージェントの一種です。Microsoft 365 Copilot を拡張して作成します。カスタム ナレッジとカスタム アクションを定義し、特定のシナリオに合わせたエージェントを作成できます。

Declarative agents は、Microsoft 365 Copilot と同じインフラストラクチャ、オーケストレーター、基盤モデル、セキュリティ制御を使用するため、一貫性があり、ユーザーにとって親しみやすいエクスペリエンスを提供します。

![Declarative agent architecture diagram. At the very basis there is the foundational model of Microsoft 365 Copilot, as well as the same orchestrator. The agent provides also custom knowledge and grounding data, and custom skills as actions, triggers, and workflows.. The user experience is available in Microsoft 365 Copilot.](../../assets/images/m365-declarative-agent.png)

## 実施内容

Copilot Developer Camp の Extend Path では、Human Resources 部門向けにカスタマイズされたアシスタントを構築します。まず、Declarative agent 作成の基礎を学び、基本的な Declarative agent を作成し、その後フル機能のアシスタントへと発展させます。  
この高度なアシスタントにはセキュリティ機能が組み込まれており、Microsoft 365 テナントと連携した認証メカニズムを通じて組織データへアクセスできるようになります。

| Section                            | Purpose                                                 |
| ---------------------------------- | ------------------------------------------------------- |
| **Setup**                          | 必要な前提条件を準備します。                    |
| **Declarative Agent Fundamentals** | Declarative agent の基本概念に焦点を当て、ベース テンプレートから始めてさらに深く学びます。 |
| **Build and Integrate API**        | API の作成とエージェントへの接続を扱います。Adaptive Cards でユーザー インターフェースを強化します。         |
| **Authentication**                 | 認証に関連するすべてのラボが含まれています。            |
| **Integration**                    | Copilot コネクターなどで機能を拡張します。                |

## [こちらから開始](./00-prerequisites) — Lab E0 で開発環境をセットアップします

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/index" />