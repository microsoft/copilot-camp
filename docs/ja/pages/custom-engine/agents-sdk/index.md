---
search:
  exclude: true
---
# イントロ - M365 Agents SDK および Semantic Kernel を使用して独自の エージェント を構築

Copilot Developer Camp の ビルドパス において、Microsoft Teams や Microsoft 365 Copilot Chat、さらには外部チャネルで動作するカスタムエンジン エージェント を開発します。

???+ info "カスタムエンジン エージェント とは？"
    カスタムエンジン エージェント は、 Generative AI によりパワードされたチャットボット であり、オーケストレーションレイヤー によって拡張されています。M365 Agents SDK を使用して構築される場合、これら の エージェント は、インテント処理、プランナー統合、およびシステムメッセージの設定 などの機能を中心に構築されています。

    Semantic Kernel フレームワーク は、多段階推論 と 外部ツール の使用 を可能にし、エージェント が自律的に動作するとともに、Microsoft 365 をはじめとする幅広いサービスで一貫性があり安全な体験 を提供できるようにします。

この旅は Azure AI Foundry から始まり、ここでエージェント のコア instructions, tools, および個性 を定義します。そこから、Microsoft 365 Agents SDK と Visual Studio を使用してエージェント に命を吹き込み、その挙動 をカスタマイズするとともに、オーケストレーション用に Semantic Kernel と統合します。その後、Microsoft Teams でエージェント をテストし、Copilot Chat に組み込み、Microsoft 365 アプリケーション全体で実際に動作する様子 をご確認いただきます。

<hr />
本ラボ には複数の演習 が含まれています。各演習 は前の演習 を基に構築されているため、順番に完了してください:

* Azure AI Foundry でエージェント の準備を行う
* M365 Agents SDK を使用して最初の エージェント を構築する
* SDK を使用してエージェント のプロパティ を構成する
* Azure AI Foundry を使用してエージェント を Teams と統合する
* Microsoft 365 Copilot Chat にエージェント を組み込む

## <a href="./00-prerequisites">こちら</a> から開始 ― ラボ BMA0 で開発環境 をセットアップする

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/index" />