---
search:
  exclude: true
---
# Teams メッセージ拡張機能のプラグイン拡張
!!! pied-piper inline "注意事項"
    これらのサンプルとラボは、学習およびデモンストレーション目的で提供されています。運用環境での使用を想定していません。運用環境に導入する場合は、必ず運用レベルの品質に更新してください。

この Extend のコースでは、 Teams メッセージ拡張機能を Microsoft 365 Copilot のプラグインとして使用する方法を学習します。サンプルの [ソースコード](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind) は既に動作するメッセージ拡張機能を提供しており、これを Microsoft 365 Copilot のプラグインとして実行します。また、いくつかの追加機能を実装してコードを強化します。ソースコードでは Northwind Database を利用しており、実際のシナリオと同様にエンタープライズ データを使ってプラグインをテストできます。  
<hr />

> このラボでは、Northwind はワシントン州ワラワラに拠点を置く高級食品の e-commerce 企業として設定されています。あなたは製品在庫と財務データにアクセスする Northwind Inventory アプリケーションを操作します。

!!! info "ラボはこちら"
    - [Lab M0 - 前提条件](/copilot-camp/pages/extend-message-ext/00-prerequisites) 開発環境をセットアップする  
    - [Lab M1 - Northwind メッセージ拡張機能を理解する](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) Northwind メッセージ拡張機能を理解する  
    - [Lab M2 - Microsoft 365 Copilot でアプリを実行](/copilot-camp/pages/extend-message-ext/02-nw-plugin) Northwind メッセージ拡張機能を Microsoft 365 Copilot のプラグインとして実行する  
    - [Lab M3 - 新しい検索コマンドでプラグインを強化](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin) 新しい検索コマンドでプラグインを強化する  
    - [Lab M4 - 認証を追加](/copilot-camp/pages/extend-message-ext/04-add-authentication) 認証でプラグインを保護する  
    - [Lab M5 - アクション コマンドを追加してプラグインを強化](/copilot-camp/pages/extend-message-ext/05-add-action) 新しいアクション コマンドでプラグインを強化する  

## <a href="./00-prerequisites">ここから開始</a> — Lab M0 で開発環境をセットアップします。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/index--ja" />