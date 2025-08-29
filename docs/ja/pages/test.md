---
search:
  exclude: true
---
# ラボ T1 - Bob の新しい Web コントロールのテスト

!!! abstract "前回の学習箇所"
    <cc-last-completed-step />

!!! abstract "目次"
    <cc-table-of-contents />

## エクササイズ 1: コントロールの学習

この演習では、各ステップの最後にユーザーが進捗を記録できる `<cc-end-step>` Web コントロールの使い方を学習します。

### Step 1: マークアップの記述

各ステップは 3rd レベルヘッダー (「###」) で始まり、ステップ名を含める必要があります。  
その後、ステップの最後に `<cc-end-step>` コントロールを挿入します。

たとえば、

~~~html
### Step 1: Write the markup

... (all the instructions go here)

<cc-end-step lab="t1" exercise="1" step="1" />
~~~

このコントロールには `lab`、`exercise`、`step` が必要です。これにより、ページを再読み込みしてもチェックボックス状態が一意に保持されます。

目次を表示する場合は以下を使用します。
~~~html
!!! abstract "目次"
    <cc-table-of-contents />
~~~

「前回の学習箇所」を表示する場合は以下を使用します。
~~~html
!!! abstract "前回の学習箇所"
    <cc-last-completed-step />
~~~

各ステップの下部にあるチェックボックスを確認してください。ユーザーがチェックすると次のことが行われます。

* ステップ見出しにチェックマークが追加される  
* 目次の該当ステップにもチェックマークが追加される  
* ラボ上部の「前回の学習箇所」メッセージ (存在する場合) が更新される  
* チェックボックスの下に励ましのメッセージが表示される  
* Telemetry で完了が匿名で記録される  

ぜひお試しください！

<cc-end-step lab="t1" exercise="1" step="1" />

### Step 2: h2 と h3 の順序を確認する

コントロールは DOM を操作します。そのため、以下のルールを守る必要があります。

 - 各エクササイズには「Exercise」で始まる h2 (##) がある  
 - 各ステップには h3 (###) がある  
 - 各エクササイズに少なくとも 1 つのステップがある  
 - ステップの最後の要素が `<cc-end-step />` である  

<cc-end-step lab="t1" exercise="1" step="2" />

### Step 3: リンクをテストする

いくつかのチェックボックスをオンにした状態で、「前回の学習箇所」がハイパーリンクになり、最後に完了したステップの末尾へ直接移動できるようになっていることを確認してください。

一方、目次内のリンクは各ステップの先頭へ移動します。

<cc-end-step lab="t1" exercise="1" step="3" />

### Step 4: 仕組み

これらは標準の Web コンポーネントで作成されています。チェックボックスの状態はローカルストレージに保存されるため、同じブラウザーとプロファイルでラボに戻れば、チェック状態が保持されています。興味があれば、[こちらがコードです](https://github.com/microsoft/copilot-camp/blob/main/docs/javascripts/cc-lab-step.js){target=_blank}。

<cc-end-step lab="t1" exercise="1" step="4" />

## エクササイズ 2: フィードバックの提供

### Step 1: 気に入りましたか？

便利だと思いますか？どのように改善できるでしょうか？

<cc-end-step lab="t1" exercise="2" step="1" />

### Step 2: 長いステップも問題なし

初期実装では、各ステップのヘッダーに 1 つのチェックボックスを配置していました。  
しかし、このステップのように非常に長い場合、ユーザーは上までスクロールしてチェックを入れないかもしれません。そこで、チェックボックスを下部に移動しました。大量のダミー文をスクロールして確認してみてください！

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

Copilot Developer Camp の Web コントロールをテストしていただき、ありがとうございます！

<cc-end-step lab="t1" exercise="2" step="3" />