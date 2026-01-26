---
search:
  exclude: true
---
# カスタム エンジン エージェントの構築

**カスタム エンジン エージェント** は、 Microsoft 365 Copilot 向けのエージェントの一種で、完全な制御を実現します。宣言型エージェントが Microsoft 365 Copilot のモデルとオーケストレーションに依存するのに対し、カスタム エンジン エージェントでは、独自の基盤モデル、オーケストレーター、セキュリティ スタックを使用できます。このアプローチは、エージェントの動作、データ アクセス、推論ロジックを特定の要件やインフラストラクチャに合わせて調整する必要がある場合に最適です。

![カスタム エンジン エージェントのアーキテクチャ図。最下層には任意の基盤モデルを使用できます。また、オーケストレーターも完全にカスタマイズ可能です。ナレッジ、スキル、自律的機能は外部 SDK やライブラリを利用したカスタム コードで実装できます。ユーザー エクスペリエンスは Microsoft 365 Copilot、 Microsoft Teams 、またはその他のサポートされているチャネルで提供できます。](../../assets/images/m365-custom-engine-agent.png)

## このラボで行うこと

Copilot Developer Camp の Build Path では、 Microsoft 365 Copilot と連携するカスタム エンジン エージェントの構築をさらに深く学習します。

C# と **Microsoft 365 Agents SDK** を使用して、 Microsoft Teams、 Microsoft 365 Copilot、外部チャネルをサポートするクロスチャネルのカスタム エンジン エージェントを作成し、オーケストレーション レイヤーを完全に制御できるようにします。

## 学習コースの選択

カスタム エンジン エージェントを構築するために、2 つのハンズオン学習コースを用意しています。シナリオや興味に合ったものを選択してください。

### Option 1: [Start with Microsoft Foundry](./agents-sdk/)

このコースは **Microsoft Foundry** から始まります。ここでエージェントのコア指示、ツール、パーソナリティを定義します。その後、 Microsoft 365 Agents SDK と Visual Studio を使用してエージェントを具現化し、 Semantic Kernel を活用してオーケストレーションをカスタマイズします。そして、 Microsoft Teams でエージェントをテストし、 Copilot Chat に組み込み、 Microsoft 365 の各アプリケーションで稼働させます。

**適している方:** Microsoft Foundry から開始し、マルチステップ推論に Semantic Kernel を活用したい開発者

**構築できるもの:** インテント ハンドリング、プランナー統合、システム メッセージ設定を備え、 Microsoft 365 全体で動作するカスタム エンジン エージェント

### Option 2: [Start with Agent Framework](./agent-framework/)

保険金請求処理向けの AI アシスタントをゼロから構築します。基本的な対話型エージェントから始め、ドキュメント検索、セマンティック ポリシー検索、マルチモーダル ビジョン解析、安全な認証など、実践的な機能を段階的に追加します。各ラボは Build-A-Feature 方式で前の内容を拡張していきます。

**適している方:** Agent Framework を使用して本番環境レベルのエージェントをハンズオンで構築したい開発者

**構築できるもの:** Azure AI Search、ビジョン モデル、 SharePoint、 Microsoft Graph、 MCP ツールを統合した保険金請求アシスタントの完全版

---8<--- "ja/b-labs-branches.md"

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/index--ja" />