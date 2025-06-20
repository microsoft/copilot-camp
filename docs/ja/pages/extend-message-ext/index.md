---
search:
  exclude: true
---
# Teams メッセージ拡張機能をプラグインとして拡張する
!!! pied-piper inline "注意事項"
    これらのサンプルとラボは、教育およびデモンストレーション目的のみを想定しており、本番環境での使用を目的としていません。 本番環境で使用する場合は、必ず本番品質へとアップグレードしてください。

この Extend のパスでは、Teams メッセージ拡張機能を Microsoft 365 Copilot のプラグインとして使用する方法を学習します。まず、サンプルの [source code](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind) に含まれている稼働中のメッセージ拡張機能を使用し、Microsoft 365 Copilot でプラグインとして実行します。さらに、いくつかの追加機能を盛り込むためにコードを拡張していきます。サンプル コードは Northwind データベースを利用しており、実際の企業データに近い形でプラグインをテストできます。  
<hr />

> このラボでは、Northwind はワシントン州ワラワラに拠点を置く高級食品の e-commerce 事業として設定されています。皆さんは製品在庫および財務データへアクセスする Northwind Inventory アプリケーションを操作します。

!!! info "ラボ一覧"
    - [Lab M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 開発環境をセットアップする  
    - [Lab M1 - Northwind メッセージ拡張機能を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) Northwind メッセージ拡張機能について学ぶ  
    - [Lab M2 - Microsoft 365 Copilot でアプリを実行する](/copilot-camp/pages/extend-message-ext/02-nw-plugin) Northwind メッセージ拡張機能を Microsoft 365 Copilot のプラグインとして実行する  
    - [Lab M3 - 新しい検索コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin) 新しい検索コマンドを追加してプラグインを拡張する  
    - [Lab M4 - 認証を追加する](/copilot-camp/pages/extend-message-ext/04-add-authentication) プラグインを認証で保護する  
    - [Lab M5 - アクション コマンドでプラグインを強化する](/copilot-camp/pages/extend-message-ext/05-add-action) 新しいアクション コマンドを追加してプラグインを拡張する  

## <a href="./00-prerequisites">ここから開始</a> — Lab M0 で開発環境をセットアップしましょう。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/index" />