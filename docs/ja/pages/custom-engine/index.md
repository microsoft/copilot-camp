---
search:
  exclude: true
---
# カスタム エンジン エージェントの構築

**カスタム エンジン エージェント** は Microsoft 365 Copilot 向けのエージェントの一種で、完全なコントロールを提供します。宣言型エージェントが Microsoft 365 Copilot のモデルとオーケストレーションに依存するのに対し、カスタム エンジン エージェントでは、独自の基盤モデル、オーケストレーター、セキュリティ スタックを利用できます。このアプローチは、エージェントの動作、データ アクセス、推論ロジックを特定の要件やインフラストラクチャに合わせて調整する必要がある場合に最適です。

![カスタム エンジン エージェントのアーキテクチャ図。最下層には任意の基盤モデルを配置できます。オーケストレーターも完全にカスタマイズ可能です。Knowledge、Skills、Autonomous Capabilities は外部 SDK やライブラリを利用したカスタム コードで実装できます。ユーザー エクスペリエンスは Microsoft 365 Copilot、Microsoft Teams、あるいは他のサポートされているチャネル上に実装できます。](../../assets/images/m365-custom-engine-agent.png)

## 実施内容

Copilot Developer Camp の Build Path では、Microsoft 365 Copilot や Microsoft Teams と統合するカスタム エンジン エージェントの構築をさらに深掘りします。

開発環境の好みに応じて、次の 2 つのハンズオンから選択できます。

* C#、 **Microsoft 365 Agents SDK**、Semantic Kernel を使用してチャネル横断型のカスタム エンジン エージェントを作成します。このオプションは Microsoft Teams、Microsoft 365 Copilot、および外部チャネルをサポートし、オーケストレーション レイヤーを完全に制御できます。
* TypeScript と **Teams AI Library** を使用してカスタム エンジン エージェントを作成します。このオプションは Microsoft Teams に最適化されており、ライブラリがバックエンドでオーケストレーションを処理するため、シンプルな開発体験を提供します。

---

---8<--- "ja/b-labs-branches.md"

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/index--ja" />