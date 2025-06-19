---
search:
  exclude: true
---
---8<--- "ja/heading.md"

# ラボコンテンツの書式設定ガイド

## テキスト要素の書式設定

これらのテキスト要素はラボの指示内に組み込まれているため、常にインラインで書式設定します。

| 要素 | 表記方法 | 例 |
|---|---|---|
| 関数名 | 等幅フォント、かっこ付き | Then, call `myFunction()` to do something ... |
| 言語キーワード | 等幅フォント | ... insert at the top of the `try` block ... |
| コード中のシンボル（変数、オブジェクト名など） | 等幅フォント | ... the `foo` object contains something random ... |
| ファイル名とフォルダー名 | 太字 |  Copy the contents of **foo.js** into the **bar** folder |
| 画面上のテキスト | 二重引用符で囲む | Now click on the "foo" button |

## インクルードファイル

複数のページで使用されるコンテンツは、/docs/includes フォルダーのインクルードファイルに配置してください。

以下が構文です:

<blockquote>--8<-- "all-labs-toc.md"</blockquote>

例::

--8<-- "ja/all-labs-toc.md"

## ラボステップ

Copilot Developer Camp ラボでは、受講者が進捗を追跡できるカスタム Web コントロールを使用します。各ラボステップの最後に `<cc-end-step />` 要素を追加してください。詳細は [こちらのテストページ](../../test) を参照してください。

## ハイパーリンク

ラボ内のリンクは相対パスにでき、同じウィンドウ内で開くようにします [このように](./labFormat.md)。

ラボの外部、または同じリポジトリ内のソースコードへのリンクは新しいウィンドウで開くようにします [このように](https://github.com/microsoft/app-camp/blob/main/src/create-core-app/aad/A01-begin-app/client/index.html){target=_blank}

## アドモンション

[アドモンションのドキュメントはこちら](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)  
Copilot Developer Camp での使用方法は次のとおりです:

!!! example "チャレンジ"
    自分で試してみましょう

!!! note
    説明を強調したり明確化したりする際に使用します

!!! tip
    ヒントやベストプラクティスを示す際に使用します

!!! warning
    ラボを進める際によくある落とし穴について警告します

!!! danger
    本番アプリで発生し得るセキュリティや安定性の問題について警告します

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
    付随情報として興味深いが必須ではない詳細を提供する際に使用します