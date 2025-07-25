---
search:
  exclude: true
---
# イントロ – M365 Agents SDK と Semantic Kernel を使用したエージェント構築

Copilot Developer Camp の Build Path では、M365 Agents SDK と Semantic Kernel を利用して、Microsoft Teams、Microsoft 365 Copilot Chat、さらには外部チャネルでも動作するカスタム エンジン エージェントを開発します。

???+ info "カスタム エンジン エージェントとは？"
    カスタム エンジン エージェントは、Generative AI を基盤にオーケストレーション レイヤーで強化されたチャットボットです。M365 Agents SDK を用いて構築すると、インテント処理、プランナー連携、システムメッセージ構成などの機能を中心に設計されます。Semantic Kernel フレームワークがマルチステップ推論と外部ツールの利用を可能にし、エージェントが自律的に動作しながら Microsoft 365 などで一貫性と安全性の高い体験を提供します。

この旅は Azure AI Foundry から始まります。そこで、エージェントの core instructions、tools、personality を定義します。その後、M365 Agents SDK と Visual Studio を使用してエージェントを実装し、Semantic Kernel と連携させることでオーケストレーションを行います。完成したエージェントを Microsoft Teams でテストし、Copilot Chat に取り込み、Microsoft 365 の各アプリケーションでその機能を確認します。

<hr />
このラボは複数の演習で構成されています。前の演習の成果を基に進むため、順番に実施してください。

* Azure AI Foundry でエージェントを準備する
* M365 Agents SDK で最初のエージェントを構築する
* SDK を使用してエージェントのプロパティを構成する
* Azure AI Foundry を使って Teams と統合する
* エージェントを Microsoft 365 Copilot Chat に取り込む

## <a href="./00-prerequisites">ここから開始</a> — Lab BMA0 で開発環境をセットアップします。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/index" />