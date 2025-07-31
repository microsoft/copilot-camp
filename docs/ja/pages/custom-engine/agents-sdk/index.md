---
search:
  exclude: true
---
# 概要 - M365 Agents SDK と Semantic Kernel でエージェントを構築する

Build パスの Copilot Developer Camp では、Microsoft Teams、Microsoft 365 Copilot Chat、さらには外部チャネルで動作するカスタム エンジン エージェントを、Microsoft 365 Agents SDK と Semantic Kernel を用いて開発します。

???+ info "カスタム エンジン エージェントとは？"
    カスタム エンジン エージェントは、生成 AI によるチャットボットであり、オーケストレーション レイヤーによって強化されています。M365 Agents SDK を使用して構築すると、インテント処理、プランナー統合、システムメッセージ構成などの機能を中心に構成されます。Semantic Kernel フレームワークは、複数ステップ推論や外部ツールの使用を可能にし、エージェントが自律的に動作しつつ、Microsoft 365 内外で一貫性とセキュリティの高い体験を提供できるようにします。

この旅は Azure AI Foundry から始まります。ここでエージェントのコア指示、ツール、パーソナリティーを定義します。その後、Microsoft 365 Agents SDK と Visual Studio を使用してエージェントに命を吹き込み、動作をカスタマイズし、オーケストレーションのために Semantic Kernel と統合します。次に Microsoft Teams でエージェントをテストし、Copilot Chat に取り込み、Microsoft 365 アプリケーション全体でエージェントが活躍する様子を確認します。

<hr />
ラボには複数の演習が用意されています。各演習は前の内容を前提としているため、順番に進めてください。

* Azure AI Foundry でエージェントを準備する
* M365 Agents SDK を使って最初のエージェントを構築する
* SDK でエージェントのプロパティを構成する
* Azure AI Foundry でエージェントを Teams に統合する
* エージェントを Microsoft 365 Copilot Chat に取り込む

## <a href="./00-prerequisites">ここから開始</a> — ラボ BMA0 で開発環境をセットアップします。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/index--ja" />