---
search:
  exclude: true
---
# イントロ - M365 Agents SDK と Semantic Kernel で独自エージェントを構築

Copilot Developer Camp の Build Path では、Microsoft 365 Teams、Microsoft 365 Copilot Chat、さらに外部チャネルでも動作するカスタム エンジン エージェントを、 M365 Agents SDK と Semantic Kernel を使って開発します。

???+ info "カスタム エンジン エージェントとは?"
    カスタム エンジン エージェントは、生成 AI によって駆動され、オーケストレーション レイヤーによって強化されたチャットボットです。 M365 Agents SDK を使用して構築する場合、これらのエージェントはインテント処理、プランナー統合、システムメッセージ構成などの機能を中心に設計されます。Semantic Kernel フレームワークはマルチステップ推論と外部ツールの利用を実現し、エージェントが自律的に行動しながらも Microsoft 365 全体で一貫性とセキュリティの高いエクスペリエンスを提供できるようにします。

この旅は Azure AI Foundry から始まり、エージェントのコアとなる instructions、tools、パーソナリティを定義します。その後、 M365 Agents SDK と Visual Studio を用いてエージェントを具体化し、動作をカスタマイズし、オーケストレーションのために Semantic Kernel と統合します。最後に Microsoft Teams でエージェントをテストし、Copilot Chat に取り込み、Microsoft 365 の各アプリケーションで動作させます。

<hr />
本ラボには複数の演習が含まれています。各演習は前の内容を基盤としているため、順番に進めてください。

* Azure AI Foundry でエージェントを準備する  
* M365 Agents SDK を使って最初のエージェントを構築する  
* SDK でエージェントのプロパティを構成する  
* Azure AI Foundry でエージェントを Teams と統合する  
* エージェントを Microsoft 365 Copilot Chat に取り込む  

## <a href="./00-prerequisites">ここから開始</a> — ラボ BMA0 で開発環境をセットアップします。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/index" />