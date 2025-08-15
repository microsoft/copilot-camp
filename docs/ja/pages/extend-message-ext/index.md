---
search:
  exclude: true
---
# Teams メッセージ拡張機能のプラグイン拡張
!!! pied-piper inline "注意事項"
    これらのサンプルおよびラボは学習およびデモンストレーションを目的としており、本番環境での使用を想定していません。実運用に組み込む際は、必ず本番品質へとアップグレードしてください。

Extend のこのパスでは、 Teams メッセージ拡張機能を Microsoft 365 Copilot のプラグインとして使用する方法を学習します。提供されている[サンプルのソースコード](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind)から開始し、 Microsoft 365 Copilot でプラグインとして実行します。また、コードにいくつかの追加機能を実装して強化します。ソースコードは Northwind データベースを利用しており、実際のエンタープライズ データを用いたプラグインのテストが可能です。  
<hr />

> このラボでは、Northwind がワシントン州ワラワラに拠点を置く高級食品の e コマース ビジネスとして運営されています。あなたは、製品在庫と財務データにアクセスできる Northwind Inventory アプリケーションを使用します。

!!! info "ラボ一覧"
    - [Lab M0 - 前提条件](/copilot-camp/ja/pages/extend-message-ext/00-prerequisites) 開発環境をセットアップする  
    - [Lab M1 - Northwind メッセージ拡張機能を理解する](/copilot-camp/ja/pages/extend-message-ext/01-nw-teams-app) Northwind メッセージ拡張機能を理解する  
    - [Lab M2 - Microsoft 365 Copilot でアプリを実行する](/copilot-camp/ja/pages/extend-message-ext/02-nw-plugin) Northwind メッセージ拡張機能を Microsoft 365 Copilot のプラグインとして実行する  
    - [Lab M3 - 新しい検索コマンドでプラグインを強化する](/copilot-camp/ja/pages/extend-message-ext/03-enhance-nw-plugin) 新しい検索コマンドでプラグインを強化する  
    - [Lab M4 - 認証を追加する](/copilot-camp/ja/pages/extend-message-ext/04-add-authentication) 認証でプラグインを保護する  
    - [Lab M5 - アクション コマンドでプラグインを強化する](/copilot-camp/ja/pages/extend-message-ext/05-add-action) 新しいアクション コマンドでプラグインを強化する  

## <a href="./00-prerequisites">ここから開始</a> — Lab M0 で開発環境をセットアップしましょう。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/index--ja" />