---
search:
  exclude: true
---
# カスタムエンジン エージェントの構築

**カスタムエンジン エージェント** は、 Microsoft 365 Copilot 向けのエージェントの一種で、完全な制御を提供します。宣言型エージェントが Microsoft 365 Copilot のモデルとオーケストレーションに依存するのに対し、カスタムエンジン エージェントでは独自の基盤モデル、オーケストレーター、セキュリティ スタックを利用できます。このアプローチは、エージェントの挙動、データ アクセス、推論ロジックを特定の要件やインフラストラクチャに合わせて調整する必要がある場合に最適です。

![カスタムエンジン エージェントのアーキテクチャ図。基盤として任意のファウンデーションモデルを選択できます。オーケストレーターも完全にカスタマイズ可能です。ナレッジ、スキル、自律機能は外部 SDK やライブラリを使用したカスタム コードで実装できます。ユーザー エクスペリエンスは Microsoft 365 Copilot、 Microsoft Teams、またはその他のサポートされるチャネルで提供できます。](../../assets/images/m365-custom-engine-agent.png)

## 実施内容

 Copilot Developer Camp の Build Path で、 Microsoft 365 Copilot と統合するカスタムエンジン エージェントの構築をさらに深く学びます。

 C#、 **Microsoft 365 Agents SDK**、および Semantic Kernel を使用してクロスチャネルのカスタムエンジン エージェントを作成し、 Microsoft Teams、 Microsoft 365 Copilot、外部チャネルをサポートしながら、オーケストレーション レイヤーを完全に制御します。

---

---8<--- "ja/b-labs-branches.md"

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/index--ja" />