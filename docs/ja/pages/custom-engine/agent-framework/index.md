---
search:
  exclude: true
---
# Microsoft 365 Agents SDK と Agent Framework を使用した Zava Insurance エージェントの構築

このラーニングパスでは、**Zava Insurance エージェント** を構築します。これは、保険アジャスターが請求処理を効率化できるよう支援する AI 搭載アシスタントです。Microsoft 365 Agents SDK と Agent Framework を使用して、Microsoft Teams と Microsoft 365 Copilot 全体で動作するカスタムエンジンエージェントを作成します。

???+ info "Zava Insurance エージェントについて"
    Zava Insurance は架空の保険会社で、アジャスターが迅速に請求を処理し、ポリシー情報を検索し、損傷写真を分析し、通知を送信できるよう支援する必要があります。ここでは、AI を活用してこれらすべてを実行するエージェントを、シンプルなところから始めて Build-A-Feature (BAF) アプローチで段階的に高度な機能を追加しながら構築します。

まずは基本的な会話エージェントから始め、ドキュメント検索、セマンティック ポリシー検索、マルチモーダルのビジョン分析、安全な認証など、実運用レベルの機能を順次追加していきます。

Microsoft 365 Agents SDK は、メッセージ ルーティング、アクティビティ、およびチャネル固有の動作を処理しながら、エージェントを Microsoft 365 Copilot および Teams にデプロイする基盤を提供します。Agent Framework は、LLM との対話、ツール呼び出し、インテリジェントな意思決定など、エージェントの AI 機能を支えます。

<hr />

## 作成する内容

このラボは **Build with Agent Framework (BAF)** アプローチに従い、エージェントに新しい機能を段階的に追加していきます。

* [**Lab BAF0**](./00-prerequisites): 前提条件 - 開発環境をセットアップする  
* [**Lab BAF1**](./01-build-and-run): Build and Run - プラグインとツールを備えた基本的な会話エージェントを作成する  
* [**Lab BAF2**](./02-add-claim-search): Add Claims Search - Azure AI Search Knowledgebases を統合して高度な請求検索を実装する  
* [**Lab BAF3**](./03-add-vision-analysis): Add Vision Analysis - Mistral ビジョンモデルを使用して AI ベースの損傷写真分析を有効化する  
* [**Lab BAF4**](./04-add-policy-search): Add Policy Search - ポリシー検証と SharePoint ドキュメント検索を実装する  
* [**Lab BAF5**](./05-add-communication): Add Communication Capabilities - Microsoft Graph を介してプロフェッショナルなメールを送信し、調査レポートを生成する  
* [**Lab BAF6**](06-add-copilot-api): Add Copilot Retrieval API Integration を利用して SharePoint Online に保存されたコンテンツから RAG を追加する  
* [**Lab BAF7**](./07-add-mcp-tools): Add MCP Tools - 外部 MCP サーバーが提供する MCP ツールでエージェントを拡張する  

各ラボは前のラボを基盤としており、**Services → Plugins → Integration → Testing** のパターンに従います。

## <a href="./00-prerequisites">まずは Lab BAF0 から</a> 開発環境をセットアップしましょう。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/index--ja" />