---
search:
  exclude: true
---
# Microsoft 365 Copilot 拡張

**宣言型エージェント** は Microsoft 365 用のエージェント の一種です。Microsoft 365 Copilot を拡張することで、宣言型エージェント を構築することができます。特定のシナリオ に合わせたエージェント を作成するために、カスタム知識 とカスタムアクション を定義します。

宣言型エージェント は Microsoft 365 Copilot と同じインフラストラクチャ、オーケストレーター、ファウンデーションモデル、およびセキュリティコントロール を使用しており、一貫性 があり慣れ親しんだユーザー体験 を提供します。

![Declarative agent architecture diagram. At the very basis there is the foundational model of Microsoft 365 Copilot, as well as the same orchestrator. The agent provides also custom knowledge and grounding data, and custom skills as actions, triggers, and workflows.. The user experience is available in Microsoft 365 Copilot.](../../assets/images/m365-declarative-agent.png)

## 実施内容

Copilot Developer Camp の Extend Path では、人事部向けにカスタマイズされたアシスタント を構築します。プロセス は、宣言型エージェント の作成の基本 を理解することから始まり、基本的な宣言型エージェント の構築、そして本格的なアシスタント の開発へと進んでいきます。この高度なアシスタント には、組織データ を取得するために Microsoft 365 テナント と連携した認証メカニズム などのセキュリティ機能 が備えられます。

| Section                            | Purpose                                                 |
| ---------------------------------- | ------------------------------------------------------- |
| **Setup**                          | 前提条件 の準備 をします。                    |
| **Declarative Agent Fundamentals** | 宣言型エージェント の概念 に焦点を当て、ベーステンプレート から始め、さらに掘り下げていきます。 |
| **Build and Integrate API**        | API の作成 とエージェント への接続 を網羅。 Adaptive cards を用いてユーザーインターフェース をアップグレードします。         |
| **Authentication**                 | 認証 に関連するラボ をサブ項目 として含みます。            |
| **Integration**                    | Copilot コネクター などで機能 を拡張します。                |

## [ここから開始](./00-prerequisites)（開発環境構築用ラボ E0）

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/index" />