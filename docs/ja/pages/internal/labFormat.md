---
search:
  exclude: true
---
---8<--- "ja/heading.md"

# ラボ コンテンツの書式設定ガイド

## テキスト要素の書式

これらのテキスト要素は ラボ の手順に埋め込まれているため、書式設定は常にインラインです。

| Element | Treatment | Example |
|---|---|---|
| 関数名 | 等幅フォントで括弧を付ける | Then, call `myFunction()` to do something ... |
| 言語キーワード | 等幅フォント | ... insert at the top of the `try` block ... |
| コード内のシンボル (変数名、オブジェクト名など) | 等幅フォント | ... the `foo` object contains something random ... |
| ファイル名とフォルダー名 | **太字** |  Copy the contents of **foo.js** into the **bar** folder |
| 画面上のテキスト | 二重引用符で囲む | Now click on the "foo" button |

## インクルード

複数のページで使用するコンテンツは /docs/includes フォルダー内のインクルード ファイルに配置してください。

構文は次のとおりです:

<blockquote>--8<-- "all-labs-toc.md"</blockquote>

例を示します::

--8<-- "all-labs-toc.md"

## ラボ ステップ

Copilot Developer Camp ラボでは、受講者が進捗を追跡できるようにカスタム Web コントロールを使用します。各ラボ ステップの末尾に `<cc-end-step />` 要素を追加してください。詳細は [このテスト ページ](../../test) を参照してください。

## ハイパーリンク

ラボ内のリンクは相対パスを使用し、現在のウィンドウで開くようにします [このように](./labFormat.md)。

ラボ外へ遷移するリンク (同じリポジトリ内のソース コードへのリンクを含む) は新しいウィンドウで開くようにします [このように](https://github.com/microsoft/app-camp/blob/main/src/create-core-app/aad/A01-begin-app/client/index.html){target=_blank}

## アドモニション

[アドモニションのドキュメントはこちら](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)  
Copilot Developer Camp での使用方法は次のとおりです。

!!! example "チャレンジ"
    自分で試してみましょう

!!! note
    手順を強調または明確化したい場合に使用します

!!! tip
    ヒントやベスト プラクティスを示す場合に使用します

!!! warning
    ラボを進める際によくある落とし穴について警告する場合に使用します

!!! danger
    本番アプリケーションで発生し得るセキュリティ問題や安定性の問題について警告する場合に使用します

???+ info "ビデオ ブリーフィング"
    <div class="video">
      <iframe src="//www.youtube.com/embed/EQuB8l4sccg" frameborder="0" allowfullscreen></iframe>
      <div>Caption</div>
    </div>

???+ info "ビデオ ブリーフィング"
    <div class="video">
      <img src="/copilot-camp/assets/images/video-coming-soon.png"></img>
      <div>Caption</div>
    </div>

???+ info "詳細情報"
    <div class="tinyVideo">
      <iframe src="//www.youtube.com/embed/EQuB8l4sccg" frameborder="0" allowfullscreen></iframe>
      <div>Caption 1</div>
    </div>
    <div class="tinyVideo">
      <iframe src="//www.youtube.com/embed/EQuB8l4sccg" frameborder="0" allowfullscreen></iframe>
      <div>Caption 2</div>
    </div>
    <div class="tinyVideo">
      <img src="/copilot-camp/assets/images/video-coming-soon.png"></img>
      <div>Caption 3</div>
    </div>

??? info "TL;DR"
    本質的ではないものの参考になる追加情報を提供する場合に使用します