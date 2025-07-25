---
search:
  exclude: true
---
# 概要 - Teams AI ライブラリで独自エージェントを構築

Copilot Developer Camp の Build Path では、Microsoft Teams 上で動作するカスタム エンジン エージェントを Teams AI ライブラリを使って開発します。このエージェントは、人事部門が履歴書を管理したり、新しい求人情報を作成したりするのを支援するよう設計されています。

???+ info "カスタム エンジン エージェントとは？"
    カスタム エンジン エージェントは、Generative AI を活用したチャットボットで、高度な対話体験を提供します。カスタム エンジン エージェントは Teams AI ライブラリを使用して構築され、プロンプト、アクション、モデル統合の管理を含む包括的な AI 機能と、UI カスタマイズの豊富なオプションを備えています。これにより、Microsoft プラットフォームと連携しつつ、AI の機能を最大限に活用したシームレスで魅力的なエクスペリエンスを実現できます。

この学習は、M365 Agents Toolkit、Teams AI ライブラリ、Azure OpenAI を用いて基本的なカスタム エンジン エージェントを構築するところから始まります。その後、さまざまな履歴書を検索できる Retrieval Augmented Generation (RAG) を実装し、Copilot のような UI を適用してチャットボットの見た目と操作感を向上させ、最終的には認証を有効化してカスタム エンジン エージェントを保護し、Microsoft Graph を利用して Microsoft 365 データを統合します。この高度なカスタム エンジン エージェントは、カスタム AI モデルとオーケストレーターを活用し、人事部門の固有のニーズを満たします。

<hr />

---8<--- "ja/b-labs-toc.md"
  
## <a href="./00-prerequisites">まずは Lab BTA0 から</a> — 開発環境をセットアップしましょう。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/index" />