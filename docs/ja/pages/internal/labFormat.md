---
search:
  exclude: true
---
---8<--- "ja/heading.md"

# ラボ内容のフォーマット ガイド

## テキスト要素のフォーマット

これらのテキスト要素はラボの指示内に埋め込まれているため、フォーマットは常にインラインです

| 要素 | 処理 | 例 |
|---|---|---|
| 関数名 | 丸括弧付き等幅 | Then, call `myFunction()` to do something ... |
| 言語キーワード | 等幅 | ... insert at the top of the `try` block ... |
| コード中の記号（変数名、オブジェクト名など） | 等幅 | ... the `foo` object contains something random ... |
| ファイル名とフォルダー名 | 太字 | **foo.js** の内容を **bar** フォルダーにコピー |
| 画面上のテキスト | 二重引用符で囲む | Now click on the "foo" button |

## インクルード

複数ページで使用されるコンテンツは、/docs/includes フォルダー内のインクルードファイルに配置すべきです。

以下は構文です:

<blockquote>--8<-- "all-labs-toc.md"</blockquote>

以下は例です::

--8<-- "all-labs-toc.md"

## ラボ手順

Copilot Developer Camp ラボでは、独自の Web コントロールを使用して、学生の進捗を追跡するのに役立ちます。それぞれのラボ手順の最後に `<cc-end-step />` 要素を含める必要があります。詳細は [this test page](../../test) をご参照ください。

## ハイパーリンク

ラボ内のリンクは相対指定可能で、現在のウィンドウ内で開くべきです [like this](./labFormat.md).

ラボの外部にあるリンク、または同じリポジトリ内のソースコードへのリンクは、新しいウィンドウで開く必要があります [like this](https://github.com/microsoft/app-camp/blob/main/src/create-core-app/aad/A01-begin-app/client/index.html){target=_blank}

## アドモニション

[アドモニションのドキュメントはこちら](https://squidfunk.github.io/mkdocs-material/reference/admonitions/).
Copilot Developer Camp での使用例は以下の通りです:

!!! example "Challenge"
    以下、ご自身で試してみてください。

!!! note
    このフォーマットを使用して、指示事項を強調または明確化してください。

!!! tip
    このフォーマットを使用して、ヒントやベスト プラクティスを示してください。

!!! warning
    ラボの完了時によくある落とし穴について、学生に警告するためにこのフォーマットを使用してください。

!!! danger
    本番アプリケーションで発生する可能性のあるセキュリティ上または安定性の問題について、学生に警告するためにこのフォーマットを使用してください。

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
    このフォーマットを使用して、興味はあるものの必須ではない補足情報を提供してください。