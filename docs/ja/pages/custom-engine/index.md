---
search:
  exclude: true
---
# カスタムエンジンエージェント構築

**カスタムエンジンエージェント** は Microsoft 365 Copilot 用のエージェントの一種で、ユーザーに完全な制御権を提供いたします。宣言型エージェントが Microsoft 365 Copilot のモデルやオーケストレーションに依存するのに対し、カスタムエンジンエージェントでは、ユーザー自身の基礎モデル、オーケストレーター、セキュリティスタックを持ち込むことができます。このアプローチは、エージェントの動作、データアクセス、または推論ロジックを特定の要件やインフラに合わせて最適化する必要がある場合に理想的です。

![Custom engine agent architecture diagram. At the very basis you can have any foundational model of your choice. Also the orchestrator is completely customizable. Knowledge, skills, and autonomous capabilities can be implemented with custom code, relying on external SDKs and libraries. The user experience can be in Microsoft 365 Copilot, in Microsoft Teams, or any other supported channel.](../../assets/images/m365-custom-engine-agent.png)

## 作業内容

Copilot Developer Camp の Build Path では、Microsoft 365 Copilot および/または Microsoft Teams と統合するカスタムエンジンエージェントの構築について、さらに深く学びます。

ご自身の開発体験に合わせて、以下の 2 つの実践的な演習からお選びいただきます：

* C#、**Microsoft 365 Agents SDK**、および Semantic Kernel を使用して、クロスチャネルのカスタムエンジンエージェントを作成します。このオプションは Microsoft Teams、Microsoft 365 Copilot、ならびに外部チャネルをサポートし、オーケストレーション層に対する完全な制御を提供します。
* TypeScript と **Teams AI Library** を使用して、カスタムエンジンエージェントを作成します。このオプションは Microsoft Teams に最適化されており、ライブラリが裏側で処理するシンプルなオーケストレーション体験を提供します。

---

---8<--- "ja/b-labs-branches.md"

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/index" />