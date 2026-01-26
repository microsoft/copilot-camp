---
search:
  exclude: true
---
# イントロ - Teams AI ライブラリでエージェントを構築

Copilot Developer Camp の Build Path では、Teams AI ライブラリを使用して Microsoft Teams 全体で動作するカスタム エンジン エージェントを開発します。このエージェントは、人事部門が履歴書を管理し、新しい求人情報を作成するなどの業務を支援するよう特別に設計されています。

???+ info "カスタム エンジン エージェントとは？"
    カスタム エンジン エージェントは、Generative AI を活用したチャットボットで、高度な会話体験を提供します。カスタム エンジン エージェントは Teams AI ライブラリを使用して構築され、プロンプト、アクション、モデル統合の管理をはじめ、UI カスタマイズに関する多彩なオプションなど、包括的な AI 機能を備えています。これにより、Microsoft プラットフォームと連携しながら、AI のフル機能を活用したシームレスで魅力的な体験を実現できます。

このラボでは、まず M365 Agents Toolkit、Teams AI ライブラリ、Azure OpenAI を利用して基本的なカスタム エンジン エージェントを構築することから始めます。その後、さまざまな履歴書を検索できる Retrieval Augmented Generation (RAG) を実装し、Copilot らしい外観と操作感を持つ UI 強化を適用します。最後に、認証を有効化してカスタム エンジン エージェントを保護し、Microsoft Graph を使用して Microsoft 365 データを取り込む方法を学びます。この高度なカスタム エンジン エージェントは、カスタム AI モデルとオーケストレーターを活用し、人事部門の特有のニーズに対応します。

<hr />

---8<--- "ja/b-labs-toc.md"
  
## <a href="./00-prerequisites">ここから開始</a> — ラボ BTA0 では、開発環境をセットアップします。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/index--ja" />