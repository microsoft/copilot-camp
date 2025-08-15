---
search:
  exclude: true
---
# カスタムエンジン エージェントの構築

**カスタムエンジン エージェント** は、Microsoft 365 Copilot 用のエージェントの一種で、完全な制御が可能です。宣言型エージェントが Microsoft 365 Copilot のモデルとオーケストレーションに依存するのに対し、カスタムエンジン エージェントでは独自の基盤モデル、オーケストレーター、セキュリティスタックを持ち込めます。エージェントの動作、データアクセス、推論ロジックを特定の要件やインフラストラクチャに合わせて調整する必要がある場合に最適です。

![Custom engine agent architecture diagram. At the very basis you can have any foundational model of your choice. Also the orchestrator is completely customizable. Knowledge, skills, and autonomous capabilities can be implemented with custom code, relying on external SDKs and libraries. The user experience can be in Microsoft 365 Copilot, in Microsoft Teams, or any other supported channel.](../../assets/images/m365-custom-engine-agent.png)

## 実施内容

Copilot Developer Camp の Build Path では、Microsoft 365 Copilot および/または Microsoft Teams と連携するカスタムエンジン エージェントの構築をさらに深掘りします。

開発体験の好みに応じて、次の 2 つのハンズオン ラボから選択できます。

* C#、 **Microsoft 365 Agents SDK**、Semantic Kernel を使用して、クロスチャネルのカスタムエンジン エージェントを作成します。このオプションでは、Microsoft Teams、Microsoft 365 Copilot、外部チャネルをサポートし、オーケストレーション層を完全に制御できます。
* TypeScript と **Teams AI Library** を使用してカスタムエンジン エージェントを作成します。このオプションは Microsoft Teams に最適化されており、ライブラリがバックグラウンドで処理するシンプルなオーケストレーションを提供します。

---

---8<--- "ja/b-labs-branches.md"

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/index--ja" />