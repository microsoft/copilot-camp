---
search:
  exclude: true
---
---8<--- "ja/heading.md"

# ラボ コンテンツの書式設定ガイド

## テキスト要素の書式設定

これらのテキスト要素はラボの手順に組み込まれているため、書式は常にインラインで適用されます。

| 要素 | 表記方法 | 例 |
|---|---|---|
| 関数名 | 等幅フォント + かっこ | その後、 `myFunction()` を呼び出して何かを行います ... |
| 言語キーワード | 等幅フォント | ... `try` ブロックの先頭に挿入します ... |
| コード内のシンボル (変数、オブジェクト名など) | 等幅フォント | ... `foo` オブジェクトにはランダムなものが含まれています ... |
| ファイル名とフォルダー名 | 太字 | **foo.js** の内容を **bar** フォルダーにコピーします |
| 画面上のテキスト | 二重引用符で囲む | 次に "foo" ボタンをクリックします |

## インクルード

複数のページで使用するコンテンツは、 /docs/includes フォルダー内のインクルード ファイルに配置してください。

構文は次のとおりです。

<blockquote>--8<-- "ja/all-labs-toc.md"</blockquote>

例を次に示します::

--8<-- "ja/all-labs-toc.md"

## ラボ ステップ

Copilot Developer Camp のラボでは、受講者が進捗を追跡できるようにカスタム Web コントロールを使用しています。各ラボ ステップの最後に `<cc-end-step />` 要素を含めるようにしてください。詳細は [このテスト ページ](../../test) を参照してください。

## ハイパーリンク

ラボ内のリンクは相対パスにでき、現在のウィンドウ内で開くようにします [この例](./labFormat.md)。

ラボの外に移動するリンク (同じリポジトリ内のソース コードへのリンクを含む) は、新しいウィンドウで開くようにします [この例](https://github.com/microsoft/app-camp/blob/main/src/create-core-app/aad/A01-begin-app/client/index.html){target=_blank}

## アドモニション

[アドモニションのドキュメントはこちら](https://squidfunk.github.io/mkdocs-material/reference/admonitions/) を参照してください。Copilot Developer Camp では次のように使用します:

!!! example "Challenge"
    自分で試してみましょう

!!! note
    手順を強調または補足する場合に使用します

!!! tip
    ヒントやベスト プラクティスを示す場合に使用します

!!! warning
    ラボの実施でよくある落とし穴について警告する場合に使用します

!!! danger
    本番アプリケーションで発生し得るセキュリティや安定性の問題について警告する場合に使用します

???+ info "Video briefing"
    <div class="video">
      <iframe src="//www.youtube.com/embed/EQuB8l4sccg" frameborder="0" allowfullscreen></iframe>
      <div>キャプション</div>
    </div>

???+ info "Video briefing"
    <div class="video">
      <img src="/copilot-camp/assets/images/video-coming-soon.png"></img>
      <div>キャプション</div>
    </div>

???+ info "More information"
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
    本質的ではないが参考になる追加情報を提供する場合に使用します