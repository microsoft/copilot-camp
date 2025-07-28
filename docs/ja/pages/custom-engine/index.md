---
search:
  exclude: true
---
# カスタム エンジン エージェントの構築

**Custom engine agents** は、Microsoft 365 Copilot 向けのエージェントの一種で、完全な制御を提供します。宣言型エージェントが Microsoft 365 Copilot のモデルとオーケストレーションに依存するのに対し、custom engine agents では独自の foundation model、オーケストレーター、およびセキュリティ スタックを持ち込むことができます。このアプローチは、エージェントの挙動、データ アクセス、推論ロジックを特定の要件やインフラストラクチャに合わせて調整する必要がある場合に最適です。

![カスタム エンジン エージェントのアーキテクチャ図。最下層には任意の foundation model を配置できます。オーケストレーターも完全にカスタマイズ可能です。ナレッジ、スキル、自律機能は外部 SDK やライブラリに依存したカスタム コードで実装できます。ユーザー エクスペリエンスは Microsoft 365 Copilot、Microsoft Teams、またはその他のサポートされているチャネルで提供できます。](../../assets/images/m365-custom-engine-agent.png)

## 実施内容

Copilot Developer Camp の Build Path では、Microsoft 365 Copilot および / または Microsoft Teams と連携するカスタム エンジン エージェントの構築をさらに深掘りします。

以下の 2 つのハンズオンから、好みの開発スタイルに応じて選択してください。

* C#、 ** Microsoft 365 Agents SDK **、Semantic Kernel を使用してクロスチャネルのカスタム エンジン エージェントを作成します。このオプションは Microsoft Teams、Microsoft 365 Copilot、外部チャネルをサポートし、オーケストレーション レイヤーを完全に制御できます。  
* TypeScript と ** Teams AI Library ** を使用してカスタム エンジン エージェントを作成します。このオプションは Microsoft Teams に最適化されており、ライブラリが裏側でオーケストレーションを処理するため、簡潔な開発体験を提供します。

---

---8<--- "ja/b-labs-branches.md"

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/index" />