---
search:
  exclude: true
---
# はじめに - Teams AI Library で独自エージェントを構築

Copilot Developer Camp の Build Path では、Teams AI Library を使用して Microsoft Teams 上で動作するカスタム エンジン エージェントを開発します。このエージェントは、履歴書の管理や新しい求人情報の作成など、人事部門の業務を支援するよう特別に設計されます。

???+ info "カスタム エンジン エージェントとは？"
    カスタム エンジン エージェントは、Generative AI を活用したチャットボットで、高度な会話体験を提供するように設計されています。カスタム エンジン エージェントは Teams AI Library を用いて構築され、プロンプト、アクション、モデルの統合管理など包括的な AI 機能に加え、UI カスタマイズの幅広いオプションを提供します。これにより、Microsoft プラットフォームに適合したシームレスで魅力的なエクスペリエンスを実現しながら、AI の機能を最大限活用できます。

まずは、M365 Agents Toolkit、Teams AI Library、Azure OpenAI を使用して基本的なカスタム エンジン エージェントを構築します。その後、多様な履歴書を検索できる Retrieval Augmented Generation (RAG) を実装し、Copilot 体験のような外観と操作感を実現する UI 強化を行い、さらに認証を有効化してエージェントを保護し、Microsoft Graph を使用して Microsoft 365 のデータを取り込みます。この高度なカスタム エンジン エージェントは、カスタム AI モデルとオーケストレーターを活用し、人事部門の固有のニーズに応えます。

<hr />

---8<--- "ja/b-labs-toc.md"
  
## <a href="./00-prerequisites">まずはこちら</a> — Lab BTA0 で開発環境をセットアップします。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/index--ja" />