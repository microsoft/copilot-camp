---
search:
  exclude: true
---
# ラボ T1 - Bob の新しい Web コントロールのテスト

!!! abstract "どこまで終えましたか？"
    <cc-last-completed-step />

!!! abstract "目次"
    <cc-table-of-contents />

## エクササイズ 1: コントロールの習得

### ステップ 1: マークアップの作成

各ステップは、そのステップ名を含む 3 レベルヘッダー ( `###` ) で始める必要があります。  
そして、ステップの最後に `<cc-end-step>` コントロールを挿入します。

たとえば、

~~~html
### Step 1: Write the markup

... (all the instructions go here)

<cc-end-step lab="t1" exercise="1" step="1" />
~~~

このコントロールは、ページを再読み込みしてもチェックボックスの状態を一意に保持できるように、ラボ、エクササイズ、およびステップを指定する必要があります。

目次を表示するには  
~~~html
!!! abstract "Table of Contents"
    <cc-table-of-contents />
~~~

最新の完了ステップを表示するには  
~~~html
!!! abstract "Where did I leave off?"
    <cc-last-completed-step />
~~~

各ステップの下部にあるチェックボックスに注目してください。ユーザーがこれをオンにすると、次のようなことが起こります。

* ステップの見出しにチェックマークが追加される  
* 目次の該当ステップにもチェックマークが付く  
* ラボの先頭にある「どこまで終えましたか？」メッセージが更新される  
* チェックボックスの下に励ましのメッセージが表示される  
* テレメトリに完了状況が匿名で記録される  

さっそく試してみましょう。

<cc-end-step lab="t1" exercise="1" step="1" />

### ステップ 2: h2 と h3 要素の順序確認

これらのコントロールは DOM を操作するため、次の条件が満たされている必要があります。

 - 各エクササイズに対し、単語 "Exercise" で始まる h2 ( ## ) があること  
 - 各ステップに対し h3 ( ### ) があること  
 - 各エクササイズに少なくとも 1 つのステップが含まれていること  
 - ステップの最後の要素が `<cc-end-step />` であること  

<cc-end-step lab="t1" exercise="1" step="2" />

### ステップ 3: リンクのテスト

いくつかのチェックボックスをオンにした状態で、「どこまで終えましたか？」メッセージがハイパーリンクに変わり、最後に完了したステップの末尾へ直接ジャンプすることに気付いてください。

一方、目次内のリンクは各ステップの冒頭へ移動します。

<cc-end-step lab="t1" exercise="1" step="3" />

### ステップ 4: 動作のしくみ

これらのコントロールは標準の Web コンポーネントで実装されています。チェックボックスの状態はローカル ストレージに保存されるため、ユーザーが同じブラウザーとプロファイルで戻ってくれば、前回の状態が保持されます。  
ご興味があれば、[コードはこちら](https://github.com/microsoft/copilot-camp/blob/main/docs/javascripts/cc-lab-step.js){target=_blank} です。

<cc-end-step lab="t1" exercise="1" step="4" />

## エクササイズ 2: フィードバックの提供

### ステップ 1: 満足度の確認

役に立ちましたか？ 改善点はありますか？

<cc-end-step lab="t1" exercise="2" step="1" />

### ステップ 2: 長いステップへの対応

最初の実装では、各ステップの見出しに 1 つのチェックボックスを置いていました。  
しかし、このステップのように非常に長い場合、チェックを入れるために先頭まで戻らないことがあります。そのため、チェックボックスを末尾に移動しました。  
以下のダミーのラテン語をスクロールして、ぜひ試してみてください！

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

### ステップ 3: 感謝

Copilot Developer Camp の Web コントロールをテストしていただき、ありがとうございます！

<cc-end-step lab="t1" exercise="2" step="3" />