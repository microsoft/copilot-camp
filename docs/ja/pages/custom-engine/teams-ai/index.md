---
search:
  exclude: true
---
# イントロ ― Teams AI Library を使用した独自エージェント構築

Build Path の Copilot Developer Camp では、Teams AI Library を利用して Microsoft Teams 全体で動作するカスタム エンジン エージェントを開発します。このエージェントは、人事部門が履歴書を管理し、新しい求人情報を作成するなどの業務を支援するよう特別に設計されています。

???+ info "カスタム エンジン エージェントとは？"
    カスタム エンジン エージェントは、Generative AI を活用したチャットボットであり、高度な会話体験を提供するよう設計されています。これらのエージェントは Teams AI Library を使用して構築され、プロンプト、アクション、モデル統合の管理を含む包括的な AI 機能と、UI を柔軟にカスタマイズできる豊富なオプションを備えています。これにより、チャットボットが AI の全機能を最大限に活用しつつ、Microsoft プラットフォームに沿ったシームレスで魅力的な体験を提供できます。

この学習は、M365 Agents Toolkit、Teams AI Library、Azure OpenAI を使用して基本的なカスタム エンジン エージェントを構築するところから始まります。続いて、多様な履歴書を検索できる Retrieval Augmented Generation (RAG) を実装し、Copilot らしい外観と操作感を実現するための UI 強化を適用し、最後に認証を有効にしてカスタム エンジン エージェントを保護し、Microsoft Graph を使用して Microsoft 365 データを統合します。この高度なカスタム エンジン エージェントは、カスタム AI モデルとオーケストレーターを活用して、人事部門の固有のニーズに対応します。

<hr />

---8<--- "ja/b-labs-toc.md"
  
## <a href="./00-prerequisites">ここから開始</a> ― ラボ BTA0 で開発環境をセットアップしましょう。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/index--ja" />