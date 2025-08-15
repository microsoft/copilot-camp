---
search:
  exclude: true
---
# カスタム エンジン エージェントの構築

**カスタム エンジン エージェント** は、Microsoft 365 Copilot 向けのエージェントであり、完全な制御が可能です。宣言型エージェントが Microsoft 365 Copilot のモデルとオーケストレーションに依存するのに対し、カスタム エンジン エージェントでは、お好みの基盤モデル、オーケストレーター、セキュリティ スタックを持ち込むことができます。このアプローチは、エージェントの動作、データ アクセス、または推論ロジックを特定の要件やインフラストラクチャに合わせて調整する必要がある場合に最適です。

![カスタム エンジン エージェントのアーキテクチャ図。最下層では、任意の基盤モデルを使用できます。オーケストレーターも完全にカスタマイズ可能です。ナレッジ、スキル、自律機能は外部 SDK やライブラリを利用したカスタム コードで実装できます。ユーザー エクスペリエンスは Microsoft 365 Copilot、Microsoft Teams、またはその他のサポートされているチャネルで提供できます。](../../assets/images/m365-custom-engine-agent.png)

## 今回行うこと

Copilot Developer Camp の Build Path では、Microsoft 365 Copilot および/または Microsoft Teams と統合するカスタム エンジン エージェントの構築をさらに深掘りします。

開発スタイルに合わせて、次の 2 つのハンズオン エクササイズから選択できます。

* C#、 **Microsoft 365 Agents SDK**、および Semantic Kernel を使用してクロスチャネルのカスタム エンジン エージェントを作成します。このオプションは Microsoft Teams、Microsoft 365 Copilot、外部チャネルをサポートしており、オーケストレーション層を完全に制御できます。
* TypeScript と **Teams AI Library** を使用してカスタム エンジン エージェントを作成します。このオプションは Microsoft Teams に最適化されており、ライブラリが裏側でオーケストレーションを簡素化して処理します。

---

---8<--- "ja/b-labs-branches.md"

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/index--ja" />