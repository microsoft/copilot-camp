---
search:
  exclude: true
---
# Teams メッセージ拡張プラグインの拡張
!!! pied-piper inline "Disclaimer"
    これらのサンプルおよびラボは、教育およびデモンストレーションを目的としており、本番環境での使用を意図したものではありません。本番環境で使用する場合は、必ず production quality にアップグレードしてください。

Extend のこのパスでは、Teams メッセージ拡張を Microsoft 365 Copilot の plugin として使用する方法を学習します。サンプルの [ソースコード](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab01-Run-NW-Teams/Northwind) に含まれる動作するメッセージ拡張から始め、これを Microsoft 365 Copilot の plugin として実行します。また、コードを拡張して追加機能を実装します。ソースコードは Northwind Database を利用しており、実際のシナリオと同様にエンタープライズ データを使って plugin をテストできます。  
<hr />

> このラボでは、Northwind はワシントン州ワラワラにある高級食品の e-commerce 事業として動作します。皆さんは Northwind Inventory アプリケーションを操作し、製品在庫と財務データへアクセスします。

!!! info "ラボ一覧"
    - [Lab M0 - Prerequisites](/copilot-camp/pages/extend-message-ext/00-prerequisites) 開発環境をセットアップする  
    - [Lab M1 - Get to know Northwind message extension](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) Northwind メッセージ拡張を理解する  
    - [Lab M2 - Run app in Microsoft 365 Copilot](/copilot-camp/pages/extend-message-ext/02-nw-plugin) Northwind メッセージ拡張を Microsoft 365 Copilot の plugin として実行する  
    - [Lab M3 - Enhance plugin with new search command](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin) 新しい検索コマンドで plugin を強化する  
    - [Lab M4 - Add authentication](/copilot-camp/pages/extend-message-ext/04-add-authentication) Authentication で plugin を保護する  
    - [Lab M5 - Enhance plugin with an action command](/copilot-camp/pages/extend-message-ext/05-add-action) 新しいアクション コマンドで plugin を強化する  

## <a href="./00-prerequisites">ここから開始</a> — Lab M0 で開発環境をセットアップしましょう。

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/index--ja" />