---
search:
  exclude: true
---
# Teams メッセージ拡張機能をプラグインとして拡張

!!! pied-piper inline "注意事項"
    これらのサンプルおよびラボは、学習とデモンストレーションを目的としており、本番環境での使用を想定していません。本番環境に導入する場合は、必ずコードを本番レベルの品質にアップグレードしてください。

Extend コースでは、Teams メッセージ拡張機能を Microsoft 365 Copilot のプラグインとして使用する方法を学習します。まずは、サンプル[ ソースコード](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind)に含まれる稼働中のメッセージ拡張機能を Microsoft 365 Copilot のプラグインとして実行します。その後、コードを拡張して追加機能を実装します。ソースコードでは Northwind Database を利用しており、企業データを用いた実践的なテストが可能です。  
<hr />

> このラボでは、Northwind はワシントン州ワラワラにある高級食品の e-commerce 企業として設定されています。Northwind Inventory アプリケーションを使用して、製品在庫および財務データにアクセスします。

!!! info "以下がラボです"
    - [Lab M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 開発環境をセットアップする
    - [Lab M1 - Northwind メッセージ拡張機能の理解](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) Northwind メッセージ拡張機能を理解する
    - [Lab M2 - アプリを Microsoft 365 Copilot で実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) Northwind メッセージ拡張機能を Microsoft 365 Copilot のプラグインとして実行する
    - [Lab M3 - 新しい検索コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin) 新しい検索コマンドを追加してプラグインを強化する
    - [Lab M4 - 認証を追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) プラグインを認証で保護する
    - [Lab M5 - アクション コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/05-add-action) 新しいアクション コマンドを追加してプラグインを強化する

## <a href="./00-prerequisites">こちら</a> の Lab M0 から開始し、開発環境をセットアップしてください。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/index--ja" />