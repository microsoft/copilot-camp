---
search:
  exclude: true
---
# ラボ MSA - SharePoint エージェントの理解

**SharePoint エージェント** は、SharePoint Online に保存されているコンテンツに特化したエージェントを最も簡単に作成する方法です。  
SharePoint エージェントは Microsoft 365 Copilot と同じインフラストラクチャ、オーケストレーター、基盤モデル、セキュリティ制御を使用するため、一貫性のある馴染み深いユーザー エクスペリエンスが提供されます。

![SharePoint エージェントのアーキテクチャ図。最下層には Microsoft 365 Copilot の基盤モデルと同じオーケストレーターがあります。エージェントはカスタム ナレッジとグラウンディング データも提供します。ユーザー エクスペリエンスは SharePoint Online、Microsoft Teams、Microsoft 365 Copilot で提供されます。](../../../assets/images/sharepoint-agent.png)

SharePoint エージェントが対象とできる範囲:

- サイト
- ライブラリ
- ドキュメント

SharePoint エージェントは、作成されたライブラリ内またはサイト レベルで、SharePoint Online のユーザー エクスペリエンスから利用できます。  
SharePoint エージェントを作成するには、対象のライブラリに対して *contribute* 権限が必要です。  
サイトの *owner* であれば、サイト レベルで SharePoint エージェントを公開することもできます。

SharePoint エージェントは Microsoft Teams に共有することもでき、1 対 1 やグループ チャットでのユーザー エクスペリエンスを向上させます。

![ドキュメント ライブラリで新しい SharePoint エージェントを作成する際のウェルカム画面。作成する SharePoint エージェントに関する基本情報を入力するダイアログが表示されています。](../../../assets/images/make-global-intro/sharepoint-agent-01.png)

Microsoft 365 Copilot ライセンスが割り当てられている場合、または Copilot Studio の容量がある場合、あるいは組織で従量課金制 (Pay-As-You-Go) の課金が設定されている場合は、SharePoint エージェントを利用できます。

<hr />

<!-- ---8<--- "msa-labs-toc.md" -->

<!-- ## <a href="./01-first-agent">Start here</a> with Lab MSA1, where you'll make your first agent with Copilot Studio agent builder. -->

## <a href="./01-first-agent">ここから始める</a> － ラボ MSA1 で最初の SharePoint エージェントを作成しましょう。
<cc-next url="./01-first-agent" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agent/index" />