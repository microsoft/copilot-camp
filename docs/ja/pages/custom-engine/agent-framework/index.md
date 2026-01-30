---
search:
  exclude: true
---
# Zava Insurance エージェントの構築 - Microsoft 365 Agents SDK と Agent Framework

このラーニングパスでは、保険査定人のクレーム処理を効率化する AI 搭載アシスタント **Zava Insurance エージェント** を作成します。Microsoft 365 Agents SDK と Agent Framework を使用して、Microsoft Teams および Microsoft 365 Copilot 全体で動作するカスタムエンジン エージェントを構築します。

???+ info "Zava Insurance エージェントについて"
    Zava Insurance は架空の保険会社で、査定人がクレームの迅速な処理、ポリシー情報の検索、損害写真の分析、通知の送信を行う必要があります。ここでは AI を活用し、シンプルなところから始めて Build-A-Feature (BAF) 方式で段階的に高度な機能を追加するエージェントを作成します。

まずは基本的な対話型エージェントから始め、ドキュメント検索、セマンティック ポリシー検索、マルチモーダル ビジョン分析、安全な認証など、実運用レベルの機能を段階的に強化していきます。

Microsoft 365 Agents SDK は、Microsoft 365 Copilot と Teams へのデプロイに必要なインフラを提供し、メッセージルーティング、アクティビティ、チャネル固有の動作を処理します。Agent Framework は、LLM との対話、ツール呼び出し、インテリジェントな意思決定など、エージェントの AI 機能を支えます。

<hr />

## 作成するもの

各ラボでは **Build with Agent Framework (BAF)** 方式に従い、順にエージェントへ新機能を追加していきます。

* [**Lab BAF0**](./00-prerequisites): 前提条件 ‑ 開発環境をセットアップ
* [**Lab BAF1**](./01-build-and-run): ビルドと実行 ‑ プラグインとツールを備えた基本的な対話型エージェントを作成
* [**Lab BAF2**](./02-add-claim-search): クレーム検索の追加 ‑ Azure AI Search Knowledgebases を統合し高度なクレーム検索を実装
* [**Lab BAF3**](./03-add-vision-analysis): ビジョン分析の追加 ‑ Mistral ビジョンモデルで損害写真を AI 分析
* [**Lab BAF4**](./04-add-policy-search): ポリシー検索の追加 ‑ ポリシー検証と SharePoint ドキュメント検索を実装
* [**Lab BAF5**](./05-add-communication): 通信機能の追加 ‑ Microsoft Graph でプロフェッショナルなメール送信と調査レポート生成
* [**Lab BAF6**](06-add-copilot-api): Work IQ API の追加 ‑ Copilot Retrieval API を通じて SharePoint Online のコンテンツを利用し RAG を導入
* [**Lab BAF7**](./07-add-mcp-tools): MCP ツールの追加 ‑ 外部 MCP サーバーが提供する MCP ツールでエージェントを強化

各ラボは前のラボを土台にしており、**サービス → プラグイン → 統合 → テスト** のパターンで進行します。

## <a href="./00-prerequisites">ここから開始</a> ‑ Lab BAF0 で開発環境をセットアップしましょう。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agent-framework/index--ja" />