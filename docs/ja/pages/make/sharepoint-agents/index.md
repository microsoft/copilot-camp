---
search:
  exclude: true
---
# ラボ MSA - SharePoint エージェント の理解

SharePoint エージェント は SharePoint Online に保存されているコンテンツに特化したエージェントを作成する最も簡単な方法です。  
SharePoint エージェント は Microsoft 365 Copilot と同じインフラ、オーケストレーター、基盤モデル、及びセキュリティ コントロール を使用しており、一貫性のある親しみやすいユーザー エクスペリエンス を保証します。

![SharePoint エージェント のアーキテクチャ ダイアグラム。最も基本となるのは Microsoft 365 Copilot の基盤モデルと同じオーケストレーターです。エージェント はカスタム ナレッジ および グラウンディング データ も提供します。ユーザー エクスペリエンス は SharePoint Online 、 Microsoft Teams 、または Microsoft 365 Copilot で提供されます。](../../../assets/images/sharepoint-agent.png)

SharePoint エージェント は以下を対象とできます：

- サイト
- ライブラリ
- ドキュメント

SharePoint エージェント は、作成されたライブラリ内またはサイトレベルで、SharePoint Online のユーザー エクスペリエンス内から使用できます。SharePoint エージェント を作成するには、対象ライブラリに対して *contribute* 権限 を持つ必要があります。また、サイトの *owner* はサイトレベルで SharePoint エージェント を昇格させることもできます。

SharePoint エージェント は、Microsoft Teams で共有することもでき、チャット（1 対 1 またはグループチャット）のユーザー エクスペリエンス を向上させます。

![ライブラリ内で新しい SharePoint エージェント を作成する際のウェルカム 画面。これから作成される新しい SharePoint エージェント の基本情報が表示されたダイアログが存在します。](../../../assets/images/make-global-intro/sharepoint-agent-01.png)

Microsoft 365 Copilot ライセンス、または Copilot Studio capacity が割り当てられている場合、あるいは組織が Pay-As-You-Go 請求 を設定している場合、SharePoint エージェント を使用できます。

<hr />

<!-- ---8<--- "ja/msa-labs-toc.md" -->

## <a href="./01-first-agent">こちらから開始</a> Lab MSA1 - 最初の SharePoint エージェント 作成
<cc-next url="./01-first-agent" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agent/index" />