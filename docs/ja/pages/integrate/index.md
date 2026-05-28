---
search:
  exclude: true
---
# Microsoft 365 Copilot との統合

この一連のラボおよび記事では、エージェントを接続する方法、外部ツールやデータ ソースを統合する方法、Copilot API を利用する方法を学習できます。これらを通じて、最新の統合パターンを使用して Microsoft 365 Copilot エージェントを作成する方法を理解できます。

## 接続型エージェントの概要

接続型エージェントを使用すると、Microsoft 365 Copilot エージェントは他のエージェントと統合して機能を拡張できます。これにより、ドメイン固有の専門知識や外部システムへのアクセスを持つエージェントに特化したタスクを委任できます。このアプローチにより、マルチ エージェント アーキテクチャを構築できます。

マルチ エージェント アーキテクチャは **モジュール化と専門化** の原則に基づいています。すべてのシナリオを 1 つのモノリシックなエージェントで処理する代わりに、複雑な問題を複数の専門エージェントに分割し、それぞれが特定のドメインやタスクに専念します。この手法により **スケーラビリティ**、**管理性**、**保守性** が向上します。

この哲学は次の原則に従います。

- **単一責任**: 各エージェントは 1 つのドメインまたはタスクに集中するため、開発・テスト・保守が容易です  
- **委任**: メイン (オーケストレーター) エージェントがユーザーの意図に基づき、特化エージェントへのタスク移譲を判断します  
- **再利用性**: 特化エージェントは複数のソリューションで共有でき、機能のライブラリを形成します  
- **関心の分離**: 各チームが各エージェントを所有し、それぞれのガバナンス、セキュリティ、デプロイ ライフサイクルを管理できます  

接続型エージェントは、Microsoft Copilot Studio エージェント、宣言型エージェント、カスタム エンジン エージェントなど、あらゆる種類のエージェントで活用できます。

## MCP (Model Context Protocol) の概要

MCP は、AI アシスタントが外部データ ソースやツールに安全に接続できるようにするオープンソースの標準プロトコルです。MCP は、スマートフォンをあらゆる機器に接続する USB-C のように、AI モデルがツール、アプリ、データへ接続するための「ユニバーサル プラグ」と言えます。MCP により、AI エージェントは (API 呼び出し、ファイルの読み取り、メッセージ送信、データ書き込みなど) を個別にコードを書くことなく実行できます。

これにより、開発者は時間を節約し、AI ソリューションをより強力・柔軟で保守しやすいものにできます。

### MCP のアーキテクチャ

次の図は、MCP のハイレベル アーキテクチャを示しています。

![The general architecture of MCP (Model Context Protocol). There is a MCP Host on the left side, which leverages a LLM/Orchestrator to consume MCP via a MCP client. On the right side there are MCP servers offering tools, resources, and prompts. The communication happens over STDIO or HTTP and can be secured with variout technologies.](../../assets/images/MCP-Architecture.png)

アーキテクチャでは、以下の主要コンポーネントを定義しています。

- **MCP Host**: 1 つまたは複数の `MCP Client` を調整・管理する AI アプリケーション  
- **MCP Client**: `MCP Server` と接続を維持し、`MCP Host` が利用するコンテキストを取得するコンポーネント  
- **MCP Server**: `MCP Client` にコンテキストを提供するプログラム  

### MCP Server が公開できる機能

各 MCP Server は、次の 3 種類の機能を公開できます。

- **Tools**: LLM がユーザーの要求に基づき能動的に呼び出す関数。データベースへの書き込み、外部 API 呼び出し、ファイルの変更、その他のロジック実行などを行えます。  
- **Resources**: ファイル コンテンツ、データベース スキーマ、API ドキュメントなど、コンテキスト提供用の読み取り専用データ ソース。  
- **Prompts**: 具体的な Tools や Resources と連携してモデルに指示を与える事前構築済みのインストラクション テンプレート。  

### 通信プロトコル

`MCP Client` と対応する `MCP Server` 間の通信は、次の 2 種類のプロトコルに基づきます。

- **stdio (ローカル)**: ローカル環境で稼働する MCP Server 向け  
- **Streamable HTTP (リモート)**: Azure などにデプロイされた公開 MCP Server 向け  

トランスポート プロトコルにかかわらず、通信は `JSON-RPC 2.0` メッセージを使用し、匿名アクセスまたは API Key や OAuth 2.0 による HTTPS でのセキュリティ保護が可能です。

### さらに学ぶ

MCP については、[Model Context Protocol (MCP) for beginners](https://github.com/microsoft/mcp-for-beginners) トレーニング クラスで学習できます。

## Copilot API の概要

Copilot API は Copilot の強力な AI 機能へプログラムからアクセスできる手段を提供し、開発者がカスタム エクスペリエンスの構築、ワークフローの自動化、アプリケーションへの Copilot 統合を実現します。宣言的アプローチとは異なり、Copilot API を使用すると、会話、コンテキスト、ユーザー インタラクションをきめ細かく制御できます。

利用可能な API は次のとおりです。

- Retrieval API  
- Search API (プレビュー)  
- Interaction Export API  
- Change Notifications API (プレビュー)  
- Meeting Insights API (プレビュー)  
- Chat API (プレビュー)  

### さらに学ぶ

Copilot API については、[Microsoft 365 Copilot APIs overview](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-apis-overview) を参照してください。

---

## 統合パスの選択

以下は、Microsoft 365 Copilot のエージェントを外部エージェント、プラットフォーム、システムと統合するための各種ラボです。シナリオやニーズに最も適したラボを選択してください。

- Microsoft Copilot Studio  
    - [Lab MCS6 - MCP Server を利用する](../make/copilot-studio/06-mcp)  
    - [Lab MCS8 - Azure AI Search を使用した RAG の統合](../make/copilot-studio/08-rag)  
    - [Lab MCS9 - Connected Agents](../make/copilot-studio/09-connected-agents)  
    - [Lab MCS10 - OAuth 2.0 で保護された MCP Server を利用する](../make/copilot-studio/10-mcp-oauth)  
- Declarative Agents  
    - [Lab E08 - 宣言型エージェントを MCP Server に接続する](../extend-m365-copilot/08-mcp-server)  
    - [Lab E09 - Connected Agents - Zava のマルチ エージェント請求オーケストレーション](../extend-m365-copilot/09-connected-agent)  
    - [Lab E10 - 宣言型エージェントを OAuth 保護された MCP Server に接続する](../extend-m365-copilot/10-mcp-auth)  
- Custom Engine Agents  
    - [Lab BAF06 - Add Copilot Retrieval API 統合を追加する](../custom-engine/agent-framework/06-add-copilot-api)  
    - [Lab BAF07 - MCP Tools 統合を追加する](../custom-engine/agent-framework/07-add-mcp-tools)  


<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/integrate/index--ja" />