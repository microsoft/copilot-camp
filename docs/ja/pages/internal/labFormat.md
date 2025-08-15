---
search:
  exclude: true
---
---8<--- "ja/heading.md"

# ラボ コンテンツのフォーマット ガイド

## テキスト要素のフォーマット

これらのテキスト要素はラボの手順に組み込まれているため、フォーマットは常にインラインです。

| 要素 | 処理 | 例 |
|---|---|---|
| 関数名 | 等幅フォント + 括弧 | Then, call `myFunction()` to do something ... |
| 言語キーワード | 等幅フォント | ... insert at the top of the `try` block ... |
| コード内の記号 (変数、オブジェクト名など) | 等幅フォント | ... the `foo` object contains something random ... |
| ファイル名・フォルダー名 | **太字** | **foo.js** の内容を **bar** フォルダーにコピーします |
| 画面上のテキスト | 二重引用符で囲む | Now click on the "foo" button |

## インクルード

複数のページで使用するコンテンツは /docs/includes フォルダーのインクルード ファイルに配置します。

構文は次のとおりです:

<blockquote>--8<-- "ja/all-labs-toc.md"</blockquote>

例を以下に示します::

--8<-- "ja/all-labs-toc.md"

## ラボ手順

Copilot Developer Camp のラボでは、受講者が進捗を追跡できるようにカスタム Web コントロールを使用します。各ラボ手順の末尾に `<cc-end-step />` 要素を追加してください。詳細は [このテスト ページ](../../test) を参照してください。

## ハイパーリンク

ラボ内のリンクは相対リンクとし、現在のウィンドウで開くようにします [このように](./labFormat.md)。

ラボ外へ移動するリンク (同じリポジトリ内のソース コードへのリンクを含む) は新しいウィンドウで開くようにします [このように](https://github.com/microsoft/app-camp/blob/main/src/create-core-app/aad/A01-begin-app/client/index.html){target=_blank}

## アドモニション

[アドモニションのドキュメントはこちら](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)
Copilot Developer Camp での使用例を示します:

!!! example "チャレンジ"
    自分で試してみましょう

!!! note
    手順を強調または明確化するために使用します

!!! tip
    ヒントやベスト プラクティスを提示する際に使用します

!!! warning
    ラボ実施時によくある落とし穴について警告する際に使用します

!!! danger
    本番アプリケーションで発生し得るセキュリティ問題や安定性問題について警告する際に使用します

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
    必須ではないものの参考になる追加情報を提供する際に使用します