---
search:
  exclude: true
---
# Microsoft 365 Copilot を拡張する

**宣言型エージェント** は、Microsoft 365 向けの エージェント の一種です。Microsoft 365 Copilot を拡張することで作成できます。カスタム ナレッジとカスタム アクションを定義し、特定のシナリオに合わせた エージェント を作成します。

宣言型エージェント は、Microsoft 365 Copilot と同じインフラストラクチャ、オーケストレーター、基盤モデル、セキュリティ制御を使用するため、一貫性があり、慣れ親しんだ ユーザー エクスペリエンスを提供します。

![Declarative agent architecture diagram. At the very basis there is the foundational model of Microsoft 365 Copilot, as well as the same orchestrator. The agent provides also custom knowledge and grounding data, and custom skills as actions, triggers, and workflows.. The user experience is available in Microsoft 365 Copilot.](../../assets/images/m365-declarative-agent.png)

## ここで行うこと

Copilot Developer Camp の Extend Path では、人事部門向けのカスタマイズされたアシスタントを構築します。まず、宣言型エージェント 作成の基本を理解し、基本的な 宣言型エージェント を作成した後、スキルを備えたフル機能のアシスタントへと発展させます。  
この高度なアシスタントにはセキュリティ機能が組み込まれており、Microsoft 365 テナントに接続した認証メカニズムを通じて組織データへアクセスできます。

| セクション                            | 目的                                                 |
| ---------------------------------- | ------------------------------------------------------- |
| **セットアップ**                          | 前提条件の準備を行います。                    |
| **宣言型エージェントの基本** | 宣言型エージェント の概念に焦点を当て、ベース テンプレートから始めてさらに探求します。 |
| **API の構築と統合**        | API の作成と エージェント への接続を扱います。Adaptive Cards で UI を強化します。         |
| **認証**                 | すべての認証関連ラボをサブ項目として含みます。            |
| **統合**                    | Copilot コネクタなどで機能を拡張します。                |

## [ここから始める](./00-prerequisites)：Lab E0 で開発環境をセットアップします

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/index" />