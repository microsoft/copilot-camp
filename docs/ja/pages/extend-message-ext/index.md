---
search:
  exclude: true
---
# Teams メッセージ拡張機能のプラグイン化

!!! pied-piper inline "注意事項"
    これらのサンプルおよびラボは、教育およびデモンストレーション目的で提供されています。実運用を前提としたものではありません。実運用に使用する場合は、必ずプロダクション品質にアップグレードしてください。

Extend のこのパスでは、Teams のメッセージ拡張機能を Microsoft 365 Copilot のプラグインとして使用する方法を学習します。サンプルの[ソースコード](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind)に含まれる動作するメッセージ拡張機能から開始し、それを Microsoft 365 Copilot でプラグインとして実行します。さらに、コードを拡張して追加機能を実装します。ソースコードでは Northwind データベースを利用しており、実際の業務シナリオに近い形でプラグインをテストできます。

<hr />

> このラボでは、Northwind はワシントン州ワラワラに拠点を置く高級食品の E-コマース企業として設定されています。製品の在庫および財務データにアクセスできる Northwind Inventory アプリケーションを操作します。

!!! info "各ラボへのリンク"
    - [Lab M0 - Prerequisites](/copilot-camp/pages/extend-message-ext/00-prerequisites) 開発環境をセットアップする  
    - [Lab M1 - Get to know Northwind message extension](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) Northwind メッセージ拡張機能を理解する  
    - [Lab M2 - Run app in Microsoft 365 Copilot](/copilot-camp/pages/extend-message-ext/02-nw-plugin) Northwind メッセージ拡張機能を Microsoft 365 Copilot のプラグインとして実行する  
    - [Lab M3 - Enhance plugin with new search command](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin) 新しい検索コマンドでプラグインを強化する  
    - [Lab M4 - Add authentication](/copilot-camp/pages/extend-message-ext/04-add-authentication) 認証でプラグインを保護する  
    - [Lab M5 - Enhance plugin with an action command](/copilot-camp/pages/extend-message-ext/05-add-action) 新しいアクションコマンドでプラグインを強化する  

## <a href="./00-prerequisites">ここから開始</a> — Lab M0 での開発環境セットアップ

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/index" />