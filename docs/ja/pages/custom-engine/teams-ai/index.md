---
search:
  exclude: true
---
# イントロ - Teams AI ライブラリで独自のエージェントを構築

Copilot Developer Camp の Build Path では、Teams AI ライブラリを使用して Microsoft Teams 上で動作するカスタム エンジン エージェントを開発します。このエージェントは、人事 (Human Resources) 部門が履歴書を管理したり、新しい求人情報を作成したりするのを支援するよう特別に設計されています。

???+ info "カスタム エンジン エージェントとは？"
    カスタム エンジン エージェントは、生成 AI を活用したチャットボットで、高度な会話体験を提供します。これらのエージェントは Teams AI ライブラリを用いて構築され、プロンプトやアクション、モデル統合の管理から UI カスタマイズの豊富なオプションに至るまで、包括的な AI 機能を備えています。これにより、チャットボットは AI の持つあらゆる機能を最大限に活用し、Microsoft プラットフォームと調和したシームレスで魅力的な体験を実現できます。

この学習は、M365 Agents Toolkit、Teams AI ライブラリ、Azure OpenAI を使って基本的なカスタム エンジン エージェントを構築するところから始まります。その後、さまざまな履歴書を検索できる Retrieval Augmented Generation (RAG) を実装し、Copilot らしい外観と操作感を持たせるための UI 強化を施します。最後に、認証を有効化してカスタム エンジン エージェントを保護し、Microsoft Graph を使用して Microsoft 365 データを取り込みます。この高度なカスタム エンジン エージェントは、カスタム AI モデルとオーケストレーターを活用し、人事部門の固有のニーズを満たします。

<hr />

---8<--- "ja/b-labs-toc.md"
  
## <a href="./00-prerequisites">ここから開始</a> して Lab BTA0 を実施し、開発環境をセットアップしましょう。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/index" />