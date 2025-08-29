---
search:
  exclude: true
---
# イントロ - M365 Agents SDK と Semantic Kernel を使用したエージェント構築

Copilot Developer Camp の Build Path では、 Microsoft Teams、 Microsoft 365 Copilot Chat、さらに外部チャネルでも稼働するカスタム エンジン エージェントを、 Microsoft 365 Agents SDK と Semantic Kernel を用いて開発します。

???+ info "カスタム エンジン エージェントとは?"
    カスタム エンジン エージェントは、Generative AI で駆動され、オーケストレーション レイヤーによって強化されたチャットボットです。 M365 Agents SDK を使用して構築する場合、これらのエージェントはインテント処理、プランナー統合、システムメッセージ構成などの機能を中心に設計されます。 Semantic Kernel フレームワークは、多段階推論と外部ツールの利用を可能にし、 Microsoft 365 などの環境で一貫性と安全性を備えた自律的なエージェント動作を実現します。

このジャーニーは Azure AI Foundry から始まります。ここで、エージェントの基本となる指示、ツール、およびパーソナリティを定義します。その後、 Microsoft 365 Agents SDK と Visual Studio を使用してエージェントに命を吹き込み、動作をカスタマイズし、オーケストレーションのために Semantic Kernel と統合します。次に、 Microsoft Teams でエージェントをテストし、 Copilot Chat に組み込み、 Microsoft 365 アプリケーション全体での動作を確認します。

<hr />
本ラボは複数の演習で構成されています。各演習は前の内容を前提としているため、順番に進めてください。

* Azure AI Foundry でエージェントを準備する
* M365 Agents SDK を使用して最初のエージェントを構築する
* SDK でエージェントのプロパティを構成する
* Azure AI Foundry を使用して Teams と統合する
* エージェントを Microsoft 365 Copilot Chat に組み込む

## <a href="./00-prerequisites">ここから開始</a> — Lab BMA0 で開発環境をセットアップします。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/index--ja" />