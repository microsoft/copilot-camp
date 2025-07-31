---
search:
  exclude: true
---
---8<--- "ja/heading.md"

# ラボ コンテンツのフォーマットガイド

## テキスト要素のフォーマット

これらのテキスト要素はラボの手順に埋め込まれているため、常にインラインでフォーマットされます。

| 要素 | 取り扱い | 例 |
|---|---|---|
| 関数名 | 等幅フォントと括弧 | Then, call `myFunction()` to do something ... |
| 言語キーワード | 等幅フォント | ... insert at the top of the `try` block ... |
| コード内のシンボル (変数名、オブジェクト名など) | 等幅フォント | ... the `foo` object contains something random ... |
| ファイル名・フォルダー名 | **太字** | **foo.js** の内容を **bar** フォルダーにコピーします |
| 画面上のテキスト | 二重引用符で囲む | Now click on the "foo" button |

## インクルード

複数のページで使用するコンテンツは `/docs/includes` フォルダー内のインクルードファイルに配置してください。

書式は次のとおりです：

<blockquote>--8<-- "all-labs-toc.md"</blockquote>

例を示します::

--8<-- "all-labs-toc.md"

## ラボ手順

Copilot Developer Camp のラボでは、学習者が進捗を追跡できるようにカスタム Web コントロールを使用します。各ラボ手順の末尾に `<cc-end-step />` 要素を追加してください。詳細は [このテストページ](../../test) を参照してください。

## ハイパーリンク

ラボ内リンクは相対パスとし、同じウィンドウで開くようにしてください [例](./labFormat.md)。

ラボ外へのリンク、同じリポジトリ内のソース コードへのリンクなどは新しいウィンドウで開くようにしてください [例](https://github.com/microsoft/app-camp/blob/main/src/create-core-app/aad/A01-begin-app/client/index.html){target=_blank}

## アドモニション

[アドモニションのドキュメントはこちら](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)  
Copilot Developer Camp では次のように使用します：

!!! example "チャレンジ"
    自分で試してみましょう

!!! note
    手順を補足・明確化する際に使用します

!!! tip
    ヒントやベスト プラクティスを示す際に使用します

!!! warning
    ラボを進める上での一般的な落とし穴について警告する際に使用します

!!! danger
    本番アプリケーションで発生し得るセキュリティや安定性の問題について警告する際に使用します

???+ info "ビデオ概要"
    <div class="video">
      <iframe src="//www.youtube.com/embed/EQuB8l4sccg" frameborder="0" allowfullscreen></iframe>
      <div>キャプション</div>
    </div>

???+ info "ビデオ概要"
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
    補足的な詳細を提供する際に使用します。必須ではありません