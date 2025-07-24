---
search:
  exclude: true
---
# ラボ T1 - Test Bob's new Web Controls のテスト

このラボでは、あなたは Copilot Developer Camp コンテンツデベロッパーとして、カスタム Web Controls を利用し、より優れたユーザー体験を提供する方法を学びます。

!!! abstract "どこまで進みましたか？"
    <cc-last-completed-step />

!!! abstract "目次"
    <cc-table-of-contents />

## 演習 1: コントロールの学習

この演習では、各ステップの終わりにユーザーが処理をログできる `<cc-end-step>` Web コントロールの使い方を学びます。

### ステップ 1: マークアップの記述

各ステップは、「###」から始まる 3 レベルのヘッダーでステップ名を含む必要があります。  
その後、ステップの最後に `<cc-end-step>` コントロールを挿入します。

例えば、

~~~html
### Step 1: Write the markup

... (all the instructions go here)

<cc-end-step lab="t1" exercise="1" step="1" />
~~~

このコントロールは、ページのリフレッシュ間でチェックボックスの状態を一意に保存するために、あなたのラボ、演習、ステップを必要とします。

目次には、以下を使用します。
~~~html
!!! abstract "Table of Contents"
    <cc-table-of-contents />
~~~

最新の完了ステップを表示するには、以下を使用します。
~~~html
!!! abstract "Where did I leave off?"
    <cc-last-completed-step />
~~~

各ステップの下部にあるチェックボックスにご注目ください。ユーザーがこれをチェックすると、以下のことが起こります：

* ステップ見出しにチェックマークが追加されます  
* 目次内のステップにチェックマークが追加されます  
* ラボ上部にある「どこまで進みましたか？」メッセージ（存在する場合）が更新されます  
* チェックボックスの下に励ましのメッセージが追加されます  
* テレメトリーが（匿名で）完了を記録します

ぜひお試しください！

<cc-end-step lab="t1" exercise="1" step="1" />

### ステップ 2: h2 および h3 要素の順序を確認する

コントロールは DOM を探査しており、以下の条件が満たされている必要があります：

 - 各演習の冒頭に「Exercise」という単語で始まる h2 (##) があること  
 - 各ステップには h3 (###) があること  
 - 各演習に少なくとも 1 つのステップがあること  
 - ステップの最後が `<cc-end-step />` となっていること

<cc-end-step lab="t1" exercise="1" step="2" />

### ステップ 3: リンクのテスト

いくつかのチェックボックスがチェックされた状態で、「どこまで進みましたか？」メッセージが、直近に完了したステップの末尾に直接ジャンプするハイパーリンクに変わることにお気づきください。  
一方、目次内のリンクは各ステップの冒頭に移動します。

<cc-end-step lab="t1" exercise="1" step="3" />

### ステップ 4: 動作の仕組み

これらは標準の Web Components を利用して記述されています。チェックボックスの状態はローカルストレージに保持されるため、ユーザーが同じブラウザとプロファイルで戻ってくる限り、ラボ セッション間で状態が保持されます。ご興味があれば、[こちらのコード](https://github.com/microsoft/copilot-camp/blob/main/docs/javascripts/cc-lab-step.js){target=_blank}をご覧ください。

<cc-end-step lab="t1" exercise="1" step="4" />

## 演習 2: フィードバックの提供

### ステップ 1: お気に召しましたか？

有用でしたか？ どのように改善できるでしょうか？

<cc-end-step lab="t1" exercise="2" step="1" />

### ステップ 2: 長いステップも問題ありません

初期の実装では、各ステップの見出しに 1 つのチェックボックスが配置されていました。  
もし非常に長いステップの場合、ユーザーは上部までスクロールしてチェックしない可能性があるため、チェックボックスを下部に移動しました。  
偽のラテン語テキストをすべてスクロールして、ぜひご確認ください！

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam quis nulla elit. Sed tortor turpis, mollis non pretium a, consectetur at augue. Fusce eu mi in sem imperdiet accumsan. Phasellus ullamcorper magna vel tincidunt dapibus. Pellentesque congue commodo finibus. Morbi scelerisque porta velit dictum tincidunt. Suspendisse potenti. Ut a mi suscipit, varius tellus id, luctus nisi. Aenean nec magna vel tortor fermentum laoreet. Praesent mattis hendrerit arcu nec rutrum. Maecenas sit amet sagittis ex, id interdum eros. Donec euismod a nisi nec efficitur. Cras sit amet massa elementum augue efficitur maximus non sed neque. Maecenas sit amet fringilla risus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Ut ultrices sem dui, eu posuere orci fermentum commodo. Nam elementum ac est sit amet feugiat. Integer eget erat pharetra, tempus sem vel, consectetur arcu. Etiam vulputate porta tellus ac viverra. Mauris id aliquam mauris, sit amet rutrum lacus. Vivamus tincidunt in massa vitae varius. Donec luctus nunc eget sodales ultricies. Curabitur molestie, urna ac sodales efficitur, ipsum odio condimentum nisl, quis imperdiet erat velit ut orci. Nunc fermentum mi nec sapien pellentesque iaculis.

Praesent iaculis feugiat justo, at rutrum turpis venenatis eu. Phasellus tempus tincidunt purus, non semper nisi gravida id. Quisque tempor urna vitae malesuada ultrices. Nulla elit ipsum, rhoncus tempor ligula vel, aliquam commodo diam. Maecenas tristique ullamcorper blandit. Vivamus in congue tortor, rhoncus faucibus nisl. Curabitur non est justo. Fusce vitae tincidunt purus. Duis malesuada leo tellus, nec faucibus neque vehicula at. Morbi nisl risus, congue a finibus in, venenatis eget augue. Nulla tempor eu nibh id imperdiet. Maecenas scelerisque posuere nibh in dapibus. Maecenas aliquam ornare magna sed pulvinar. Aenean vel placerat elit. Nunc faucibus imperdiet fringilla. In sit amet ipsum lectus.

Morbi in congue sem. Duis suscipit enim eu erat congue, a dapibus tortor fringilla. Cras at purus gravida leo condimentum molestie id ut sapien. Morbi in eros a magna finibus efficitur quis ac lacus. Curabitur vitae elit et felis iaculis convallis a quis sem. Vivamus sit amet sollicitudin metus, ut pulvinar ex. Nunc justo lacus, eleifend ac semper quis, condimentum a quam. Nunc sagittis urna erat, nec rhoncus urna pulvinar id. Integer fermentum fermentum sollicitudin. Mauris et vestibulum massa, at eleifend tortor. Nulla vehicula eu odio ut semper. Cras et nibh lacus. Duis in magna sit amet nunc finibus faucibus vel ut eros. Cras ullamcorper efficitur velit eu fermentum.

Proin eget vulputate lectus. Vestibulum sit amet bibendum nisl, vel interdum odio. Sed sed odio lectus. Ut et magna vitae risus imperdiet posuere. Phasellus enim velit, tempor sed consectetur in, cursus id velit. Vestibulum sed lobortis purus. Sed libero nisi, vulputate sed nulla in, fermentum imperdiet odio. Vestibulum pellentesque blandit congue. In venenatis euismod tortor, nec sagittis ante placerat eget. Sed at nunc nunc. Curabitur consequat elit ut hendrerit vestibulum. Ut maximus laoreet condimentum. Suspendisse eget sem neque. Cras in lorem facilisis, rutrum quam vel, dictum justo.

Integer interdum mollis nulla at blandit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus aliquam commodo aliquam. Maecenas rhoncus nisl vel purus sodales, id vestibulum eros viverra. Donec vehicula semper urna. In auctor consectetur libero quis eleifend. Etiam a tellus sed metus suscipit blandit non at neque. Suspendisse placerat semper est eu commodo. Nam nunc augue, cursus nec commodo in, elementum at lacus. Duis est arcu, cursus ac rhoncus sed, hendrerit in odio. Duis congue nisi faucibus ipsum convallis, eu dapibus ante rhoncus. Suspendisse eu eros et ligula ultrices tincidunt.

Sed blandit, felis vel auctor pharetra, nibh tellus mollis nisi, ac feugiat nisl nunc et urna. Nunc magna tortor, lobortis eu congue eget, pulvinar sit amet dolor. Sed nec mattis ante. Maecenas convallis tristique lacinia. Suspendisse non tellus quis lorem sodales finibus. Curabitur rutrum vel odio at viverra. Morbi maximus nibh sit amet nisl pellentesque bibendum. Pellentesque ultricies ex ante, at hendrerit magna posuere sed.

Proin luctus faucibus posuere. In malesuada hendrerit arcu, et mattis ante maximus ac. Phasellus dictum nibh ac neque rutrum ultrices. Nullam sed aliquam enim. Nullam nisl erat, interdum a porta eget, congue in nisl. Nullam ligula elit, ornare eget nisl eu, aliquet semper metus. Mauris pulvinar justo sem. Fusce nec ullamcorper urna. Cras eget metus eget lectus volutpat aliquet non pharetra massa. In vitae nisi arcu.

Sed sit amet convallis massa, vehicula auctor justo. Aliquam ultricies porttitor nulla eu lobortis. Vestibulum viverra, risus nec dapibus venenatis, eros neque bibendum augue, sit amet faucibus arcu mauris eget quam. Quisque sed mollis tellus, ac tempus elit. Sed orci lorem, tincidunt vitae egestas iaculis, finibus non sem. Curabitur quis semper est, sed tempus risus. Duis dictum lorem vulputate felis convallis, commodo sagittis diam condimentum. Curabitur vitae erat nibh. Mauris vulputate maximus libero id dignissim. Quisque viverra ante tellus, id sollicitudin elit interdum quis.

Nunc massa velit, gravida a nunc in, efficitur viverra sapien. Sed viverra ullamcorper hendrerit. Quisque cursus felis tortor, ut facilisis lectus volutpat vel. Sed scelerisque auctor tempor. Duis ante diam, pretium vitae rhoncus id, mollis vitae lorem. Mauris pretium lorem sem, sit amet iaculis sem ullamcorper ac. Fusce vel arcu aliquet, vulputate leo at, aliquet massa. Ut at imperdiet eros. Mauris gravida mi rutrum mi egestas, sit amet varius tellus pellentesque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer varius nunc in arcu posuere, suscipit fringilla erat commodo. Aenean vitae nisi non felis semper commodo. Donec eget neque ornare, lobortis augue nec, pharetra est. Sed accumsan semper diam, eget pharetra mauris feugiat id. Pellentesque ac velit vitae purus sollicitudin dapibus. Mauris posuere interdum nisi sed pellentesque.

<cc-end-step lab="t1" exercise="2" step="2" />

### ステップ 3: ありがとうございました！

Copilot Developer Camp の Web Controls をテストしていただき、ありがとうございます！

<cc-end-step lab="t1" exercise="2" step="3" />