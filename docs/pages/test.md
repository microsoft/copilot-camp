# Lab T1 - Test Bob's new Web Controls

In this lab, you, the Copilot Camp content developer, will learn how to use custom web controls to provide an enhanced user experience.

!!! info "Where did I leave off?"
    <cc-last-completed-step />

## Exercise 1: Learn the controls

In this exercise, you'll learn how to use the `<cc-lab-end-step>` web control, which allows users to log their process at the end of each step.

### Step 1: Write the markup

Each step must begin with a 3rd level header ("###") that includes the name of the step.
Then insert the `<cc-lab-end-step>` control at the end of the step.

For example,

~~~html
### Step 1: Write the markup

... (all the instructions go here)

<cc-lab-end-step lab="t1" exercise="1" step="1" />
~~~

The control needs your lab, exercise, and step so it can store the checkbox state uniquely across page refreshes.

<cc-lab-end-step lab="t1" exercise="1" step="1" />

### Step 2: Test the checkboxes and step tracking

Notice the checkbox at the bottom of each step. When users check it, several things happen:

* A check mark is added to the step heading
* An encouraging message is added below the checkbox
* The "where did I leave off" message at the top of the lab, if present, is updated
* Telemetry logs the completion (anonymously)

Try it out now!

<cc-lab-end-step lab="t1" exercise="1" step="2" />

### Step 3: Test the last completed step control

Now, with some checkboxes checked, notice that the "Where did I leave off" message is now a hyperlink that brings you directly to the last step that you completed. Here is the markup if you want to include one of these:

To add one of these to your page, use this web control:
~~~html
<cc-last-completed-step />
~~~

These are written using standard web components. Checkbox state is kept in local storage so it will persist across lab sessions so long as the user returns with the same browser and profile, the checkboxes will be as they left them. If you're curious, [here is the code](https://github.com/microsoft/copilot-camp/blob/main/docs/javascripts/cc-lab-end-step.js){target=_blank}.

<cc-lab-end-step lab="t1" exercise="1" step="3" />

## Exercise 2: Give feedback

### Step 1: Do you like it?

Is it useful? Whow could it be improved?

<cc-lab-end-step lab="t1" exercise="2" step="1" />

### Step 2: Long steps are no problem

The initial implementation concerned me that if a step is really long, like this one, that people won't scroll up to check it off. So I moved the checkboxes to the bottom.
Please scroll past all the fake Latin and check it out!

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

<cc-lab-end-step lab="t1" exercise="2" step="2" />

### Step 3: More ideas

OK this is fun but I need to write another lab now :)
However - I do have more ideas including:

1. Table of contents control that will list all exercises and steps at the top of a lab page. This should be pretty straight forward.

2. Path navigation control that will list the labs in a path, with a "you are here". This will need to be separate from the others because the exercise and step controls depend on sharing the same web page.

<cc-lab-end-step lab="t1" exercise="2" step="3" />
