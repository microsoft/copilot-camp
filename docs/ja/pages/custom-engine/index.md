---
search:
  exclude: true
---
# カスタムエンジン エージェントの構築

**カスタムエンジン エージェント** は、Microsoft 365 Copilot 向けのエージェントの一種で、開発者に完全な制御を提供します。宣言型エージェントが Microsoft 365 Copilot のモデルおよびオーケストレーションに依存するのに対し、カスタムエンジン エージェントでは、独自のファウンデーションモデル、オーケストレーター、セキュリティスタックを持ち込めます。このアプローチは、エージェントの動作、データアクセス、推論ロジックを特定の要件やインフラストラクチャに合わせて調整する必要がある場合に最適です。

![カスタムエンジン エージェントのアーキテクチャ図。ベースには任意のファウンデーションモデルを配置できます。オーケストレーターも完全にカスタマイズ可能です。ナレッジ、スキル、自律機能は外部 SDK やライブラリを利用してカスタムコードで実装できます。ユーザー エクスペリエンスは Microsoft 365 Copilot、Microsoft Teams、またはその他のサポートされているチャネルで提供できます。](../../assets/images/m365-custom-engine-agent.png)

## 実施内容

Copilot Developer Camp の Build Path では、Microsoft 365 Copilot および/または Microsoft Teams と統合するカスタムエンジン エージェントの構築をより深く学習します。

開発環境の好みに応じて、次の 2 つのハンズオン演習から選択できます。

* C#、 **Microsoft 365 Agents SDK**、および Semantic Kernel を使用して、クロスチャネル対応のカスタムエンジン エージェントを作成します。Microsoft Teams、Microsoft 365 Copilot、外部チャネルをサポートし、オーケストレーション層を完全に制御できます。
* TypeScript と **Teams AI Library** を使用して、カスタムエンジン エージェントを作成します。このオプションは Microsoft Teams に最適化されており、オーケストレーションはライブラリが裏側で処理するため、簡潔に実装できます。

---

---8<--- "ja/b-labs-branches.md"

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/index" />