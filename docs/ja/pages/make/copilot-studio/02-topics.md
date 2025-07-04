---
search:
  exclude: true
---
# ラボ MCS2 - トピックの定義

このラボでは、Microsoft Copilot Studio でカスタム トピックを作成する方法を学習します。トピックは エージェント の主要な構成要素です。トピックを使用すると、エンド ユーザーに対して単一ターンまたはマルチターンの会話体験を提供できます。トピックは、ユーザーと エージェント 間の会話がどのように進行するかを、個別の対話パスとして定義します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ZVHkBiH6RxQ" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボを簡単に確認しましょう。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前回の [ラボ MCS1](../01-first-agent){target=_blank} を基礎としています。同じ エージェント を引き続き利用し、新しい機能で強化できます。

トピックは、グラフィカル デザイナーを使用して作成することも、自然言語で意図を記述して作成することもできます。トピックを作成した後は、詳細な調整が必要な場合に低レベルのコード エディターで定義を編集することも可能です。

トピックには次の 2 種類があります。

- システム トピック: Microsoft Copilot Studio により自動的に定義されます。無効化はできますが、削除はできません。  
- カスタム トピック: エージェント 作成者がカスタムの対話パスを提供するために作成します。

!!! note "トピックに関する追加情報"
    Microsoft Copilot Studio で作成した エージェント のトピックについては、[こちらの記事](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topics-overview){target=_blank} を参照してください。システム トピックについては、[Use system topics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-system-topics){target=_blank} を参照するとより深く学べます。

このラボで学ぶ内容:

- 生成 AI に基づくオーケストレーションの活用方法
- シングルターン トピックの作成方法
- マルチターン トピックの作成方法
- Adaptive Card を使用したユーザーとの対話方法

## Exercise 1 : 生成 AI に基づくオーケストレーション

最初の演習では、[ラボ MCS1](../01-first-agent){target=_blank} で作成した エージェント に対して、生成 AI に基づくオーケストレーションを有効化します。この機能は執筆時点でプレビュー中です。

### Step 1: 生成 AI オーケストレーションの有効化

Copilot Studio で作成した エージェント の重要な機能の 1 つが、生成オーケストレーションです。生成オーケストレーションにより、エージェント はユーザーの問い合わせやイベント トリガーに応じて、最適なナレッジ ベース、トピック、アクションを選択できます。

既定では、 エージェント はクラシック オーケストレーションを使用します。クラシック オーケストレーションでは、ユーザーの問い合わせと最も一致するトリガー フレーズを持つトピックが起動します。生成オーケストレーションでは、Copilot Studio がユーザーの自然言語プロンプトを解析し、起動すべき最適な項目を判断します。

!!! pied-piper "注意事項"
    生成オーケストレーションを有効にすると、課金方法に影響する場合があります。[生成モードの課金](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-billed-sessions){target=_blank} をご確認ください。クラシック オーケストレーションとの主な違いとして、ナレッジ検索方法やサポートされるデータ ソースがあります。既存の エージェント で生成モードを有効化する前に、[既知の制限事項](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions#known-limitations-for-generative-orchestration){target=_blank} を必ずお読みください。

生成オーケストレーションを有効にするには、ブラウザーで対象 Microsoft 365 テナントの職場アカウントを使用して [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、Microsoft Copilot Studio を開きます。

1️⃣ **Agents** の一覧を表示し、2️⃣ 前回のラボで作成した エージェント を編集します。

![The interface of Microsoft Copilot Studio when browsing the agents and selecting one item to edit.](../../../assets/images/make/copilot-studio-02/edit-agent-01.png)

**Overview** タブで **Orchestration** のトグルを有効化します。

![The interface of Microsoft Copilot Studio with the generative orchestration enabled and highlighted.](../../../assets/images/make/copilot-studio-02/generative-orchestration-01.png)

生成オーケストレーションの有効化にはしばらく時間がかかります。設定が適用されたら、 エージェント を発行して変更を確定します。

<cc-end-step lab="mcs2" exercise="1" step="1" />

## Exercise 2 : シングルターン トピックの作成

この演習では、ユーザーから入力を取得し、その入力に基づいてフィードバックを返す新しいトピックを作成します。具体的には、ユーザーの現在の役割を収集し、その役割に応じたガイダンスを提供します。

### Step 1: 新しいシングルターン トピックの作成

画面上部で 1️⃣ **Topics** タブを選択し、2️⃣ **+ Add a topic** をクリックして、3️⃣ **From blank** を選び、新しいカスタム トピックを作成します。

!!! info "Copilot でトピックを作成"
    自然言語で説明を入力するだけで、Copilot がトピックを下書きしてくれるオプションもあります。

![The interface of Microsoft Copilot Studio when creating a new topic. There is the **Topics** tab highlighted, with the **+ Add a topic** dropdown menu, and the **From blank** option highlighted.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-01.png)

Copilot Studio はグラフィカル デザイナーを表示します。トピックの最初のビルディング ブロックは **Trigger** アクションです。生成オーケストレーションが有効な場合、ここに自然言語でトピックの目的を記述できます。このラボでは次の内容を入力してください。

```txt
This topic can handle queries like these: collect user's role and provide feedback, 
give me a feedback based on my role, what's your feedback for my role?
```

クラシック オーケストレーションを使用する場合は、説明文の代わりに 5～10 個のトリガー フレーズまたは文を指定します。

![The interface of Microsoft Copilot Studio when designing a new topic. There is a **Trigger** action with the value suggested in this exercise step as the trigger condition. There is also the button to add new actions highlighted.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-02.png)

<cc-end-step lab="mcs2" exercise="2" step="1" />

### Step 2: ユーザー入力の収集

画面中央の **+** ボタンを選択して、現在のトピックに新しいアクションまたはステップを追加します。主なオプションは以下のとおりです。

- Send a message: ユーザーにメッセージを送信します。テキスト、画像、動画、Adaptive Card などが利用可能。  
- Ask a question: ユーザーに入力を求めます。テキスト、画像、動画、添付ファイル、Adaptive Card などが利用可能。  
- Ask with adaptive card: Adaptive Card を使用してユーザーから入力を収集します。  
- Add a condition: 変数と定数値の比較に基づいて分岐を追加します。  
- Variable management: トピック レベル、グローバル、システム、環境スコープの変数を管理します。  
- Topic management: 現在のトピックのライフサイクルを管理します。  
- Add an action: Power Automate フロー、カスタム コネクタ、マルチ エージェント シナリオでの他の エージェント など外部アクションを呼び出します。  
- Advanced: 外部 HTTP REST API の呼び出し、生成回答の使用、イベントやアクティビティの送信など高度な機能を提供します。  

![The menu to select actions to add to the current topic. There available options are: send a message, ask a question, ask with adaptive card, add a condition, variable management, topic management, add an action, advanced.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-03.png)

ユーザー入力を収集するために **Ask a question** アクションを追加します。ユーザーの役割を尋ねるので、質問文には次の値を入力します。

```txt
What is your role?
```

既定では、Copilot Studio は収集した入力に `Multiple choice options` データ型を割り当てます（**Identify** フィールドで確認できます）。**Identify** フィールドの下にある **+ New option** を選択し、次の 3 つの値を順に追加します。

- Candidate  
- Employee  
- HR staff member  

このアクションは、ユーザーが選択した値をトピック スコープの変数に自動的に保存します。アクション右上の 3 点リーダーを選択し **Properties** を開くか、アクション下部の変数を選択して名前などを変更できます。

![The context menu of the action with commands to: see properties, rename the action, delete the action, add a comment to the action.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-04.png)

たとえば変数名を `UserRole` に変更できます。設定完了後のアクションは次のようになります。

![The action fully configured with all the settings and commands highlighted. There is the question text, the data type for the result, the options, the variable to store the selected option, and the scope of the variable.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-05.png)

<cc-end-step lab="mcs2" exercise="2" step="2" />

### Step 3: ユーザーへのフィードバック

次に **+** ボタンを選択し **Add a condition** を追加します。左側のブランチで **Select a variable** を選び、前ステップで作成した **userRole** 変数を選択します。その後、条件値を `userRole is equal to Candidate` と設定してください。さらに同様の手順で `userRole is equal to Employee` と `userRole is equal to HR staff member` を追加し、最後に `All other conditions` を残します。

各ブランチ内で、ユーザーに合わせたフィードバックを提供するロジックを追加します。各 **Condition** ブランチの下にある **+** を選び、**Send a message** アクションを追加します。必要に応じて複数のアクションを追加してもかまいません。

3 つのブランチに対して、たとえば次のメッセージを使用できます。

- Candidate  

```txt
You are a new candidate, as such you can submit your resume for evaluation.
```

- Employee  

```txt
As an employee, you can ask me about how to improve your career or about 
how to learn more about your growth mindset.
```

- HR staff member  

```txt
As an HR staff member, you can manage the list of candidates and all the hiring procedures.
```

`All other conditions` ブランチでは、**Topic management** グループにある **Redirect** アクションを使用し、システム トピック **Fallback** にフォールバックさせます。

![The condition branches with messages sent to the user for each option and a redirection to the **Fallback** topic in case the user did not provide any of the supported options.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-06.png)

これでトピックのシンプルなロジックが完成しました。

<cc-end-step lab="mcs2" exercise="2" step="3" />

### Step 4: 現在のトピックを終了

カスタム トピックのフローを正しく完了させるために、**Topic management** グループにある **End current topic** アクションを追加します。このアクションは、トピックの会話が完了したことを Copilot Studio に伝えます。

![The **End current topic** action inserted in the current topic flow.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-07.png)

<cc-end-step lab="mcs2" exercise="2" step="4" />

### Step 5: トピックのテスト

トピックを保存してテストする準備ができました。デザイナー右上の **Save** ボタンを選択し、表示されるダイアログでトピック名を入力して **Save** をもう一度クリックします。

![The dialog window to assign a name to the topic and to save it.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-08.png)

たとえばトピック名を `Collect user's role` とします。次にデザイナー右上の **Test** を選択してテスト パネルを開き、次のプロンプトを入力します。

```txt
What's your feedback for my role?
```

エージェント は役割の選択を促し、選択に応じたフィードバックを返します。

![The agent in action in the test panel inside Microsoft Copilot Studio.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-09.png)

Exercise 2 が完了しました。続いて Exercise 3 でマルチターン トピックを作成します。

<cc-end-step lab="mcs2" exercise="2" step="5" />

## Exercise 3 : マルチターン トピックの作成

単純な対話では、1 つの質問と 1 つの回答だけのシングルターン会話を作成します。しかし、より実質的なトピックでは、ユーザーと エージェント の間で複数回のやり取りが必要です。この演習では、新しい候補者に関するデータを収集するマルチターン トピックを作成します。

### Step 1: 新しいマルチターン トピックの作成

新しい候補者について次の情報を収集したいと想定します。

- 名  
- 姓  
- E-mail  
- 現在の職種  

これらの情報を収集するために、Exercise 2 Step 1 の手順に従って新しいトピックを作成します。トピックの **Trigger** には次を入力します。

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

各項目ごとに **Ask a question** アクションでユーザーに質問します。ただし、回答のデータ型は項目によって異なります。名・姓・現在の職種はテキスト、E-mail は有効なメール形式である必要があります。

名・姓・現在の職種では、**Ask a question** アクションの **Identify** プロパティで **User's entire response** を選択します。これにより、ユーザーが入力したテキストがそのまま値として取得され、変数型は `string` になります。各変数には分かりやすい名前を付けてください。以下のスクリーンショットは名の入力例です。同様に姓と現在の職種についても設定してください。

![The **Ask a question** action configured to collect the candidate's first name and store it into a variable of type string, accepting any value provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-01.png)

E-mail 項目では **Identify** プロパティで **Email** を選択し、Copilot Studio がメール形式を自動検証できるようにします。変数型は `string` のままです。

![The **Ask a question** action configured to collect the candidate's e-mail accepting only values of type email provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-02.png)

これで候補者の情報をすべて収集できるので、ユーザーに確認メッセージを送信します。

<cc-end-step lab="mcs2" exercise="3" step="1" />

### Step 2: ユーザーへのフィードバック

収集した入力に基づいて確認メッセージを送信します。**Send a message** アクションを追加し、メッセージ内容に入力変数を差し込みます。変数を挿入するには、**Send a message** アクションのツールバーにある **{x}** をクリックし、目的の変数を選択します。

![The action **Send a message** with the insert variable command highlighted and the list of variables available in the current topic.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-03.png)

トピック内の変数、システム変数、環境変数を挿入できます。すべての変数を含むメッセージを設定すると次のようになります。

![The action **Send a message** with all the referenced variables.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-04.png)

最後の確認として **Ask a question** アクションを追加し、次のメッセージを設定します。

```txt
Is it ok for you to insert this new candidate?
```

回答は `Yes` と `No` をサポートし、Exercise 2 Step 3 と同様に各結果のブランチを構成します。簡単にするため、各ブランチで **Send a message** アクションを 1 つずつ使用し、👍 または 👎 の絵文字だけを送信します。最後に **End current topic** アクションを追加して完了です。

![The final part of the topic with the last **Ask a question** action, three branches to manage the user's input and one final action to **End current topic**.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-05.png)

トピックを保存し、`Register a new candidate` などの名前を付けてテストパネルで動作を確認してください。E-mail の入力が無効な場合には Copilot Studio が自動で再入力を促すことも確認できます。

![The interaction with the multi-turn topic, where there are a set of questions and answers to collect all the candidate data.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-06.png)

<cc-end-step lab="mcs2" exercise="3" step="2" />

## Exercise 4 : Adaptive Card の利用

複数の **Ask a question** アクションを使って入力を集める方法もありますが、多くのデータを収集する場合や、より見栄えの良い対話を実現したい場合は Adaptive Card の使用を検討できます。

<details open>
<summary>Adaptive Card とは？</summary>

Adaptive Card は JSON で記述されたプラットフォーム非依存の UI スニペットです。アプリやサービス間でやり取りされ、受信側アプリでは環境に合わせてネイティブ UI に変換されます。これにより、主要なプラットフォームやフレームワークで軽量 UI を設計・統合できます。
    <div class="video">
      <iframe src="//www.youtube.com/embed/pYe2NqKhJoM" frameborder="0" allowfullscreen></iframe>
      <div>Adaptive Card はあらゆる場所で利用されています</div>
    </div>
</details>

### Step 1: Adaptive Card での入力収集

次の候補者情報を収集する新しいトピックを作成するとします。

- 名  
- 姓  
- E-mail  
- 現在の職種  
- 話せる言語  
- スキル  

特に、言語とスキルは複数選択リストです。

**Topics** タブを開き、Exercise 3 で作成したトピックを無効化してトリガー条件の競合を避けてください。その後、Exercise 2 Step 1 の手順で新しいトピックを作成します。トピックの **Trigger** には次を入力します。

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

次に **Ask with adaptive card** アクションを追加し、1️⃣ アクション本体を選択して 2️⃣ **Edit adaptive card** ボタンをクリックします。**Adaptive card designer** の **Card payload editor** に次の JSON を入力してください。

![The interface of the topic when adding an **Ask with adaptive card** action, with the side panel open to define the JSON of the adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-01.png)

```json
{
    "type": "AdaptiveCard",
    "body": [
        {
            "type": "TextBlock",
            "size": "Medium",
            "weight": "Bolder",
            "text": "New HR Candidate Information"
        },
        {
            "type": "Input.Text",
            "id": "firstname",
            "placeholder": "First Name"
        },
        {
            "type": "Input.Text",
            "id": "lastname",
            "placeholder": "Last Name"
        },
        {
            "type": "Input.Text",
            "id": "email",
            "placeholder": "Email"
        },
        {
            "type": "Input.Text",
            "id": "current_role",
            "placeholder": "Current Role"
        },
        {
            "type": "Input.ChoiceSet",
            "id": "spoken_languages",
            "placeholder": "Spoken Languages",
            "isMultiSelect": true,
            "choices": [
                {
                    "title": "English",
                    "value": "English"
                },
                {
                    "title": "French",
                    "value": "French"
                },
                {
                    "title": "German",
                    "value": "German"
                },
                {
                    "title": "Italian",
                    "value": "Italian"
                },
                {
                    "title": "Portuguese",
                    "value": "Portuguese"
                },
                {
                    "title": "Spanish",
                    "value": "Spanish"
                }
            ]
        },
        {
            "type": "Input.ChoiceSet",
            "id": "skills",
            "placeholder": "Skills",
            "isMultiSelect": true,
            "choices": [
                {
                    "title": "Computer Programming",
                    "value": "Computer Programming"
                },
                {
                    "title": "Project Management",
                    "value": "Project Management"
                },
                {
                    "title": "Team Lead",
                    "value": "Team Lead"
                }
            ]
        }
    ],
    "actions": [
        {
            "type": "Action.Submit",
            "title": "Submit"
        }
    ],
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.5"
}
```

JSON を更新すると、Copilot Studio がデザイナー内にカードのプレビューを表示し、ユーザー入力を格納するトピック レベルの変数も自動生成します。

![The interface of the topic when adding an **Ask with adaptive card** action, with the side panel open and a proper JSON of the adaptive card defined. On the designer there is a preview of the actual adaptive card and a list of output arguments to collect the values provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-02.png)

<cc-end-step lab="mcs2" exercise="4" step="1" />

### Step 2: Adaptive Card でフィードバック

ユーザーに収集データのサマリーを表示するための Adaptive Card を送信します。**+** を選択して **Send a message** アクションを追加し、左上の **+ Add** を選択して **Adaptive card** を選びます。

![The command box to add an adaptive card as the message to send with the **Send a message** action.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-03.png)

右側のパネルで **Edit adaptive card** を選択し、次の JSON を **Card payload editor** に貼り付けます。

```JSON
{
  "type": "AdaptiveCard",
  "body":
    [
      {
        "type": "TextBlock",
        "size": "Medium",
        "weight": "Bolder",
        "text": "Candidate Summary"
      },
      {
        "type": "FactSet",
        "facts":
          [
            { "title": "First Name:", "value": "firstname" },
            { "title": "Last Name:", "value": "lastname" },
            { "title": "Email:", "value": "email" },
            { "title": "Current Role:", "value": "current_role" },
            { "title": "Spoken Languages:", "value": "spoken_languages" },
            { "title": "Skills:", "value": "skills" }
          ]
      }
    ],
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "version": "1.3"
}
```

JSON を貼り付ける際は、テキストエリア上部の **Edit JSON** が選択されていることを確認してください（既定で選択されています）。フォーカスを外すと **Send a message** アクションにカードのプレビューが表示されます。現時点では各変数が静的値で表示されています。

![The **Send a message** action configured to render an adaptive card. In the side panel on the right side there is the JSON of the adaptive card. In the body of the action there is a preview of the adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-04.png)

プルダウンで **JSON Card** を **Formula Card** に切り替え、静的値をトピック レベル変数に置き換えます。

![The **Send a message** action configured to render an adaptive card. In the side panel on the right side there is the JSON of the adaptive card. In the body of the action there is a preview of the adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-05.png)

エディターを展開し、変数や PowerFx 関数を使用して値を動的に設定します。

![The side panel of the **Send a message** action while editing the adaptive card JSON in **Formula card** mode. There is a button to expand the editor.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-06.png)

表示されたダイアログではインテリセンスが利用でき、変数や PowerFx 関数を参照できます。

![The adaptive card editor with intellisense to reference variables and PowerFx functions.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-07.png)

静的値をすべて変数に置き換えてください。言語とスキルは `Table` 型のリストなので、PowerFx の `Concat` 関数と `Text` 関数を組み合わせて文字列に変換します。最終的な JSON は以下のようになります。

```JSON
{
  type: "AdaptiveCard",
  body: [
    {
      type: "TextBlock",
      size: "Medium",
      weight: "Bolder",
      text: "Candidate Summary"
    },
    {
      type: "FactSet",
      facts: [
        {
          title: "First Name:",
          value: Topic.firstname
        },
        {
          title: "Last Name:",
          value: Topic.lastname
        },
        {
          title: "E-mail:",
          value: Topic.email
        },
        {
          title: "Current Role:",
          value: Topic.current_role
        },
        {
          title: "Spoken Languages:",
          value: Text(Concat(Topic.spoken_languages, Value, ", "))
        },
        {
          title: "Skills:",
          value: Text(Concat(Topic.skills, Value, ", "))
        }
      ]
    }
  ],
  '$schema': "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.3"
}
```

!!! note "PowerFx 関数に関する追加情報"
    PowerFx 関数の詳細は [Create expressions using Power Fx](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-power-fx){target=_blank} を参照してください。

<cc-end-step lab="mcs2" exercise="4" step="2" />

### Step 3: トピックのテスト

トピックの最後に **End current topic** アクションを追加し、`Register new candidate with adaptive cards` などの名前で保存します。デザイナー右側のテスト パネルで動作を確認してください。

![The topic collecting information about a new candidate using an adaptive card and providing feedback through another adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-08.png)

これでトピックは完全に機能します。今後のラボでは、外部 HR サービスにデータを保存して実際の候補者レコードを作成する方法を学びます。

<cc-end-step lab="mcs2" exercise="4" step="3" />

---8<--- "ja/mcs-congratulations.md"

これで複数のトピックを通じて多彩な会話パスをサポートする エージェント が完成しました。次のラボではカスタム Action を扱います。

<a href="../03-actions">こちらから</a> ラボ MCS3 を始め、Copilot Studio で エージェント に Action を定義しましょう。  
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/02-topics" />