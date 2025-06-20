---
search:
  exclude: true
---
# ラボ T1 - Bob の新しい Web コントロールのテスト

このラボでは、Copilot Developer Camp のコンテンツ開発者であるあなたが、カスタム Web コントロールを使用してユーザー エクスペリエンスを向上させる方法を学びます。

!!! abstract "どこまで進んでいましたか？"
    <cc-last-completed-step />

!!! abstract "目次"
    <cc-table-of-contents />

## Exercise 1: コントロールの学習

このエクササイズでは、各ステップの最後にユーザーが進捗を記録できる `<cc-end-step>` Web コントロールの使い方を学びます。

### Step 1: マークアップの記述

各ステップは、ステップ名を含む 3rd レベル ヘッダー（`###`）で始める必要があります。  
その後、ステップの最後に `<cc-end-step>` コントロールを挿入します。

例:

~~~html
### Step 1: Write the markup

... (all the instructions go here)

<cc-end-step lab="t1" exercise="1" step="1" />
~~~

コントロールは、チェックボックス状態をページ再読み込み後も一意に保持できるよう、`lab`、`exercise`、`step` の 3 つの属性が必要です。

目次を表示するには次のように記述します。

~~~html
!!! abstract "Table of Contents"
    <cc-table-of-contents />
~~~

最後に完了したステップを表示するには次のように記述します。

~~~html
!!! abstract "Where did I leave off?"
    <cc-last-completed-step />
~~~

各ステップ下部のチェックボックスをオンにすると、次のことが起こります。

* ステップ見出しにチェック マークが追加される  
* 目次の該当ステップにもチェック マークが追加される  
* ラボ上部の「どこまで進んでいましたか？」メッセージ（存在する場合）が更新される  
* チェックボックス下部に励ましのメッセージが表示される  
* テレメトリに完了状況が匿名で記録される  

さっそく試してみましょう！

<cc-end-step lab="t1" exercise="1" step="1" />

### Step 2: h2 と h3 の順序確認

コントロールは DOM を探索するため、以下の条件を満たしている必要があります。

 - 各エクササイズごとに、「Exercise」という単語で始まる h2（`##`）がある  
 - 各ステップごとに h3（`###`）がある  
 - 各エクササイズに少なくとも 1 つ以上のステップがある  
 - ステップの最後に `<cc-end-step />` が配置されている  

<cc-end-step lab="t1" exercise="1" step="2" />

### Step 3: リンクのテスト

いくつかのチェックボックスをオンにした状態で確認すると、「どこまで進んでいましたか？」メッセージは最後に完了したステップの末尾へ直接ジャンプするハイパーリンクになります。

一方、目次のリンクは各ステップの先頭にジャンプします。

<cc-end-step lab="t1" exercise="1" step="3" />

### Step 4: 仕組み

これらのコントロールは標準の Web コンポーネントで作成されています。チェックボックスの状態は Local Storage に保存されるため、同じブラウザーとプロファイルでラボに戻れば、前回の状態が維持されます。詳しく知りたい方は [こちらのコード](https://github.com/microsoft/copilot-camp/blob/main/docs/javascripts/cc-lab-step.js){target=_blank} をご覧ください。

<cc-end-step lab="t1" exercise="1" step="4" />

## Exercise 2: フィードバックの提供

### Step 1: 気に入りましたか？

便利だと思いましたか？どのように改善できるでしょうか？

<cc-end-step lab="t1" exercise="2" step="1" />

### Step 2: 長いステップも問題なし

初期実装では各ステップの見出しに 1 つのチェックボックスを配置していました。  
しかしこのステップのように非常に長い場合、チェックを入れるためだけに上までスクロールしないかもしれません。そのため、チェックボックスを下部へ移動しました。  
以下のダミー テキストをスクロールして確認してください！

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

### Step 3: ありがとうございます！

Copilot Developer Camp Web コントロールのテストにご協力いただき、ありがとうございました！

<cc-end-step lab="t1" exercise="2" step="3" />