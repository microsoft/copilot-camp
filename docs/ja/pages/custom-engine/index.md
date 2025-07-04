---
search:
  exclude: true
---
# カスタム エンジン エージェントの構築

**カスタム エンジン エージェント** は、Microsoft 365 Copilot 用のエージェントの一種で、完全なコントロールを提供します。宣言型エージェントが Microsoft 365 Copilot のモデルとオーケストレーションに依存するのに対し、カスタム エンジン エージェントでは、独自のファウンデーション モデル、オーケストレーター、セキュリティ スタックを持ち込むことができます。このアプローチは、エージェントの動作、データ アクセス、推論ロジックを特定の要件やインフラストラクチャに合わせて調整する必要がある場合に最適です。

![カスタム エンジン エージェントは、お好みのオーケストレーター、ファウンデーション モデル、セキュリティ コントロールを利用します。](../../assets/images/m365-custom-engine-agent.png)

## 実施内容

Copilot Developer Camp の Build Path では、Microsoft 365 Copilot および/または Microsoft Teams と統合するカスタム エンジン エージェントの構築をさらに深く学習します。

開発経験に合わせて、次の 2 つのハンズオン演習から選択できます。

* C#、**Microsoft 365 Agents SDK**、および Semantic Kernel を使用して、クロスチャネルのカスタム エンジン エージェントを作成します。このオプションは Microsoft Teams、Microsoft 365 Copilot、外部チャネルをサポートし、オーケストレーション レイヤーを完全に制御できます。
* TypeScript と **Teams AI Library** を使用してカスタム エンジン エージェントを作成します。このオプションは Microsoft Teams 向けに最適化されており、ライブラリがバックグラウンドで処理するシンプルなオーケストレーション体験を提供します。

---

---8<--- "ja/b-labs-branches.md"

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/index" />