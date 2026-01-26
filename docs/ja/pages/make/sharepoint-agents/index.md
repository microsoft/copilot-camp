---
search:
  exclude: true
---
# Lab MSA - SharePoint エージェントの理解

**SharePoint エージェント** は、 SharePoint Online に保存されたコンテンツに特化したエージェントを最も簡単に作成する方法です。  
SharePoint エージェントは、 Microsoft 365 Copilot と同じインフラストラクチャ、オーケストレーター、基盤モデル、セキュリティ制御を使用するため、一貫性のある馴染みやすいユーザー エクスペリエンスが保証されます。

![SharePoint エージェントのアーキテクチャ図。最下層に Microsoft 365 Copilot の基盤モデルと同じオーケストレーターがあり、その上でエージェントがカスタム ナレッジとグラウンディング データを提供します。ユーザー エクスペリエンスは SharePoint Online、 Microsoft Teams、または Microsoft 365 Copilot で提供されます。](../../../assets/images/sharepoint-agent.png)

SharePoint エージェントが対象にできるのは次のとおりです。

- サイト
- ライブラリ
- ドキュメント

SharePoint エージェントは、作成されたライブラリ内またはサイト レベルで、 SharePoint Online のユーザー エクスペリエンスから利用できます。対象ライブラリに対して SharePoint エージェントを作成するには、ユーザーに *contribute* 権限が必要です。サイトの *owner* も、サイト レベルで SharePoint エージェントを昇格させることができます。

SharePoint エージェントは Microsoft Teams で共有することもでき、1 対 1 チャットやグループ チャットでのユーザー エクスペリエンスを向上させます。

さらに、 SharePoint エージェントは Microsoft 365 Copilot Chat でも自動的にカスタム エージェントとして利用可能になります。

![ドキュメント ライブラリで新しい SharePoint エージェントを作成する際のウェルカム画面。作成する新しい SharePoint エージェントに関する基本情報を示すダイアログが表示されています。](../../../assets/images/make-global-intro/sharepoint-agent-01.png)

Microsoft 365 Copilot の ライセンス、 Copilot Studio のキャパシティ、または組織での Pay-As-You-Go 課金が設定されている場合は、SharePoint エージェントを利用できます。

<hr />

<!-- ---8<--- "ja/msa-labs-toc.md" -->

<!-- ## <a href="./01-first-agent">ここから開始</a> （Lab MSA1）。Copilot Studio Lite で最初のエージェントを作成しましょう。 -->

## <a href="./01-first-agent">ここから開始</a> （Lab MSA1）。最初の SharePoint エージェントを作成します。
<cc-next url="./01-first-agent" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agent/index--ja" />