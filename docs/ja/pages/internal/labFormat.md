---
search:
  exclude: true
---
---8<--- "ja/heading.md"

# ラボ コンテンツの書式ガイド

## テキスト要素のフォーマット

これらのテキスト要素はラボの指示内に埋め込まれており、常にインラインで書式設定されます。

| 要素 | 表記 | 例 |
|---|---|---|
| 関数名 | 等幅フォントで括弧を付ける | Then, call `myFunction()` to do something ... |
| 言語キーワード | 等幅フォント | ... insert at the top of the `try` block ... |
| コード内のシンボル（変数名、オブジェクト名など） | 等幅フォント | ... the `foo` object contains something random ... |
| ファイル名とフォルダー名 | 太字 |  Copy the contents of **foo.js** into the **bar** folder |
| 画面上のテキスト | 二重引用符で囲む | Now click on the "foo" button |

## インクルード

複数ページで使用するコンテンツは、/docs/includes フォルダーのインクルード ファイルに配置してください。

構文は次のとおりです。

<blockquote>--8<-- "all-labs-toc.md"</blockquote>

例を示します::

--8<-- "all-labs-toc.md"

## ラボ ステップ

Copilot Developer Camp のラボでは、進捗を追跡するためのカスタム Web コントロールを使用します。各ラボ ステップの最後には `<cc-end-step />` エレメントを配置してください。詳細は [このテスト ページ](../../test) を参照してください。

## ハイパーリンク

ラボ内のリンクは相対リンクにし、同じウィンドウで開くようにします [このように](./labFormat.md)。

ラボ外へのリンク（同一リポジトリ内のソース コードへのリンクを含む）は新しいウィンドウで開くようにします [このように](https://github.com/microsoft/app-camp/blob/main/src/create-core-app/aad/A01-begin-app/client/index.html){target=_blank}

## アドモニション

[アドモニションのドキュメントはこちら](https://squidfunk.github.io/mkdocs-material/reference/admonitions/) を参照してください。
Copilot Developer Camp での使用例を以下に示します。

!!! example "Challenge"
    自分で試してみましょう。

!!! note
    手順を強調または明確化するときに使用します。

!!! tip
    ヒントやベスト プラクティスを示すときに使用します。

!!! warning
    ラボを行う際によくある落とし穴について警告します。

!!! danger
    本番アプリケーションで発生しうるセキュリティまたは安定性の問題について警告します。

???+ info "ビデオ ブリーフィング"
    <div class="video">
      <iframe src="//www.youtube.com/embed/EQuB8l4sccg" frameborder="0" allowfullscreen></iframe>
      <div>キャプション</div>
    </div>

???+ info "ビデオ ブリーフィング"
    <div class="video">
      <img src="/copilot-camp/assets/images/video-coming-soon.png"></img>
      <div>キャプション</div>
    </div>

???+ info "詳細情報"
    <div class="tinyVideo">
      <iframe src="//www.youtube.com/embed/EQuB8l4sccg" frameborder="0" allowfullscreen></iframe>
      <div>キャプション 1</div>
    </div>
    <div class="tinyVideo">
      <iframe src="//www.youtube.com/embed/EQuB8l4sccg" frameborder="0" allowfullscreen></iframe>
      <div>キャプション 2</div>
    </div>
    <div class="tinyVideo">
      <img src="/copilot-camp/assets/images/video-coming-soon.png"></img>
      <div>キャプション 3</div>
    </div>

??? info "TL;DR"
    参考情報として役立つが必須ではない詳細を提供するフォーマットです