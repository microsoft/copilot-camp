---
search:
  exclude: true
---
# Teams Message Extension プラグイン拡張
!!! pied-piper inline "注意事項"
    これらのコード例およびラボは、教育およびデモンストレーション目的で提供されるものであり、本番環境での利用を意図していません。本番品質にアップグレードせずに本番環境へ導入しないでください。

この Extend のパスでは、Microsoft 365 Copilot におけるプラグインとしての Teams Message Extension の利用方法を学びます。まず、ソースコードにある動作する message extension のサンプルから始め、Microsoft 365 Copilot のプラグインとして実行します。また、コードにいくつかの追加機能を実装して拡張します。ソースコードでは Northwind Database を利用しており、実際のビジネスシナリオにおけるプラグインのテストに必要な企業データを提供します。

<hr />

> このラボでは、 Northwind は Walla Walla , Washington に拠点を置く専門食品の eコマース事業として運営されています。 Northwind Inventory アプリケーションを使用して、製品の在庫および財務データへアクセスします。

!!! info "ラボ一覧"
    - [Lab M0 - Prerequisites](/copilot-camp/pages/extend-message-ext/00-prerequisites)　開発環境のセットアップ
    - [Lab M1 - Get to know Northwind message extension](/copilot-camp/pages/extend-message-ext/01-nw-teams-app)　Northwind メッセージ拡張を理解する
    - [Lab M2 - Run app in Microsoft 365 Copilot](/copilot-camp/pages/extend-message-ext/02-nw-plugin)　Microsoft 365 Copilot 上で Northwind メッセージ拡張をプラグインとして実行
    - [Lab M3 - Enhance plugin with new search command](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)　新しい検索コマンドを追加してプラグインを拡張
    - [Lab M4 - Add authentication](/copilot-camp/pages/extend-message-ext/04-add-authentication)　プラグインに認証を追加
    - [Lab M5 - Enhance plugin with an action command](/copilot-camp/pages/extend-message-ext/05-add-action)　新しい action command を追加してプラグインを拡張

## <a href="./00-prerequisites">まずはこちら</a>　－　Lab M0 で開発環境をセットアップ

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/index" />