---
search:
  exclude: true
---
# 概要 - M365 Agents SDK と Semantic Kernel でエージェントを構築する

Copilot Developer Camp の Build Path では、Microsoft 365 Agents SDK と Semantic Kernel を使用して、Microsoft Teams、Microsoft 365 Copilot Chat、さらには外部チャネルでも動作するカスタム エンジン エージェントを開発します。

???+ info "カスタム エンジン エージェントとは？"
    カスタム エンジン エージェントは、生成 AI を基盤とし、オーケストレーション レイヤーによって強化されたチャットボットです。M365 Agents SDK で構築すると、これらのエージェントはインテント処理、プランナー統合、システムメッセージ構成といった機能を中心に設計されます。Semantic Kernel フレームワークは、マルチステップ推論と外部ツールの利用を可能にし、エージェントが自律的に動作しながら Microsoft 365 をはじめとする環境で一貫性とセキュリティの高いエクスペリエンスを提供できるようにします。

この旅は Azure AI Foundry から始まり、そこでエージェントの基本的な指示、ツール、そしてパーソナリティを定義します。その後、Microsoft 365 Agents SDK と Visual Studio を使ってエージェントに命を吹き込み、挙動をカスタマイズしながらオーケストレーションのために Semantic Kernel と統合します。最後に Microsoft Teams でテストし、Copilot Chat に取り込んで、Microsoft 365 アプリ全体でエージェントが活躍する様子を確認します。

<hr />
このラボには複数の演習が含まれています。それぞれの演習は前の演習を基盤としているため、順番に進めてください。

* Azure AI Foundry でエージェントを準備する
* M365 Agents SDK を使用して最初のエージェントを構築する
* SDK を用いてエージェントのプロパティを構成する
* Azure AI Foundry を使って Teams と統合する
* エージェントを Microsoft 365 Copilot Chat に導入する

## <a href="./00-prerequisites">ここから開始</a> — Lab BMA0 で開発環境をセットアップします。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/index--ja" />