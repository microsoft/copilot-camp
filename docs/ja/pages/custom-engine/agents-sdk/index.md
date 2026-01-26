---
search:
  exclude: true
---
# はじめに - M365 Agents SDK と Semantic Kernel で独自エージェントを構築する

Copilot Developer Camp の **Build Path** では、Microsoft Teams、Microsoft 365 Copilot Chat、さらに外部チャネルでも動作するカスタム エンジン エージェントを、M365 Agents SDK と Semantic Kernel を使って開発します。

???+ info "カスタム エンジン エージェントとは？"
    カスタム エンジン エージェントは、Generative AI によって駆動され、オーケストレーション レイヤーによって強化されたチャットボットです。M365 Agents SDK を使用して構築する場合、これらのエージェントはインテント処理、プランナー統合、システム メッセージ構成などの機能を中心に構成されます。Semantic Kernel フレームワークは、マルチステップ推論と外部ツールの利用を支え、エージェントが自律的に動作しつつ、Microsoft 365 をはじめとするさまざまな環境で一貫性とセキュリティを確保します。

この旅は Microsoft Foundry から始まります。ここでエージェントのコア命令、ツール、個性を定義します。その後、M365 Agents SDK と Visual Studio を使ってエージェントに命を吹き込み、動作をカスタマイズし、オーケストレーションのために Semantic Kernel と統合します。さらに Microsoft Teams でエージェントをテストし、Copilot Chat へ取り込み、Microsoft 365 アプリケーション全体でその力を体験します。

<hr />
このラボには複数の演習が含まれています。順番に進めてください。各演習は前の内容を土台にしています。

* Microsoft Foundry でエージェントを準備する
* M365 Agents SDK を使って最初のエージェントを構築する
* SDK でエージェントのプロパティを構成する
* Microsoft Foundry を使って Teams と統合する
* エージェントを Microsoft 365 Copilot Chat に取り込む

## <a href="./00-prerequisites">Lab BMA0 で開発環境をセットアップし、ここから始めましょう</a>

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/index--ja" />