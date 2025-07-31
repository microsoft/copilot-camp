---
search:
  exclude: true
---
# イントロ - Teams AI Library で独自の エージェント を構築する

Copilot Developer Camp の Build Path では、 Teams AI Library を使用して Microsoft Teams 上で動作するカスタム エンジン エージェント を開発します。 この エージェント は、人事部門が履歴書を管理したり、新しい求人票を作成したりするなどの業務を支援するように設計されています。

???+ info "カスタム エンジン エージェント とは?"
    カスタム エンジン エージェント は、生成 AI を活用したチャットボットであり、高度な会話体験を提供するように設計されています。 カスタム エンジン エージェント は Teams AI Library を使用して構築され、プロンプト、アクション、モデル統合の管理に加え、 UI カスタマイズのための豊富なオプションなど、包括的な AI 機能を提供します。 これにより、チャットボットが AI の持つ能力を最大限に活用しつつ、 Microsoft プラットフォームと整合したシームレスで魅力的な体験を実現できます。

この旅は、 M365 Agents Toolkit、 Teams AI Library、 Azure OpenAI を使用して基本的なカスタム エンジン エージェント を構築することから始まります。 次に、 RAG (Retrieval Augmented Generation) を実装して多様な履歴書を検索できるようにし、 UI を強化して Copilot らしい見た目と操作感を実現します。 最後に認証を有効化してカスタム エンジン エージェント を保護し、 Microsoft Graph を使用して Microsoft 365 データを取り込みます。 この高度なカスタム エンジン エージェント は、カスタム AI モデルとオーケストレーターを活用し、人事部門の特有のニーズに対応します。

<hr />

---8<--- "ja/b-labs-toc.md"
  
## <a href="./00-prerequisites">ここから始める</a> - Lab BTA0 で開発環境をセットアップします。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/index--ja" />