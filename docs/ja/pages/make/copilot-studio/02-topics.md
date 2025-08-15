---
search:
  exclude: true
---
# ラボ MCS2 - トピックの定義

このラボでは、Microsoft Copilot Studio でカスタムトピックを作成する方法を学びます。トピックは エージェント の中核となるビルディングブロックです。トピックを使用すると、エンド ユーザー に対して単一ターンまたはマルチターンの会話体験を提供できます。トピックは、 ユーザー と エージェント の会話がどのように展開するかを、個別の対話パスとして定義します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ZVHkBiH6RxQ" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前回の [Lab MCS1](../01-first-agent){target=_blank} を基にしています。同じ エージェント を使い続け、新しい機能で強化していきます。

トピックはグラフィカル デザイナーで作成することも、自然言語で意図を記述して作成することもできます。トピックを作成した後、詳細な微調整が必要な場合は低レベルのコードエディターで定義を編集することも可能です。

トピックには 2 種類あります。

- システム トピック : Microsoft Copilot Studio により自動生成されます。無効化は可能ですが削除はできません。
- カスタム トピック : エージェント 作成者が独自の対話パスを提供するために作成します。

!!! note "トピックに関する追加情報"
    Microsoft Copilot Studio で作成された エージェント のトピックについての詳細は、[こちらの記事](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topics-overview){target=_blank} を参照してください。また、システム トピックの詳細は [Use system topics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-system-topics){target=_blank} を参照できます。

このラボで学習する内容:

- Generative AI ベースのオーケストレーションの活用方法
- シングルターン トピックの作成方法
- マルチターン トピックの作成方法
- Adaptive Card を使用した ユーザー との対話方法

## Exercise 1 : Generative AI ベースのオーケストレーション

この演習では、[Lab MCS1](../01-first-agent){target=_blank} で作成した エージェント に Generative AI ベースのオーケストレーションを有効化します。執筆時点ではプレビュー機能です。

### Step 1: Generative AI ベースのオーケストレーションを有効化する

Copilot Studio 製 エージェント の重要な機能の 1 つにジェネレーティブ オーケストレーションがあります。ジェネレーティブ オーケストレーションでは、 エージェント が最適なナレッジ ベース、トピック、アクションを選択し、 ユーザー の問い合わせやイベント トリガーに応答します。 

デフォルトではクラシック オーケストレーションが使用され、 ユーザー のクエリに最も一致するトリガー フレーズを持つトピックが起動されます。ジェネレーティブ オーケストレーションを使用すると、Copilot Studio が ユーザー の自然言語プロンプトから意図を理解し、最適な項目を判断します。 

!!! pied-piper "注意事項"
    ジェネレーティブ オーケストレーションを有効にすると課金計算に影響する場合があります。詳細は [Generative モードの課金](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-billed-sessions){target=_blank} をご確認ください。ナレッジ検索方法やサポートされるデータ ソースなど、クラシック オーケストレーションとの主な違いがあります。既存 エージェント で Generative モードを有効にする前に、[既知の制限事項](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions#known-limitations-for-generative-orchestration){target=_blank} をお読みください。

Generative オーケストレーションを有効にするには、ブラウザーを開き、対象の Microsoft 365 テナントの作業アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスします。

1️⃣ **Agents** の一覧を表示し、2️⃣ 前回の Lab MCS1 で作成した エージェント を編集します。

![The interface of Microsoft Copilot Studio when browsing the agents and selecting one item to edit.](../../../assets/images/make/copilot-studio-02/edit-agent-01.png)

**Overview** タブで **Orchestration** トグルを有効にします。

![The interface of Microsoft Copilot Studio with the generative orchestration enabled and highlighted.](../../../assets/images/make/copilot-studio-02/generative-orchestration-01.png)

有効化には数分かかる場合があります。設定が適用されたら、 エージェント を発行して変更を確定します。

<cc-end-step lab="mcs2" exercise="1" step="1" />

## Exercise 2 : シングルターン トピックの作成

この演習では、 ユーザー から入力を収集し、その入力に基づいてフィードバックを返すトピックを作成します。具体的には、 ユーザー の現在の役割を収集し、その役割に応じたガイダンスを提示します。

### Step 1: 新しいシングルターン トピックの作成

画面上部で 1️⃣ **Topics** タブを選択し、2️⃣ **+ Add a topic** を選択、さらに 3️⃣ **From blank** を選択して新しいカスタム トピックを作成します。

!!! info "Copilot でのトピック作成"
    自然言語で説明を入力するだけで、Copilot がトピックを下書きしてくれるオプションもあります。

![The interface of Microsoft Copilot Studio when creating a new topic. There is the **Topics** tab highlighted, with the **+ Add a topic** dropdown menu, and the **From blank** option highlighted.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-01.png)

Copilot Studio はトピック定義用のグラフィカル デザイナーを表示します。最初のビルディング ブロックは **Trigger** アクションで、トピックの目的を記述します。ジェネレーティブ オーケストレーションが有効な場合、ここに自然言語でトピックの目的を入力できます。本ラボでは次の内容を入力してください。

```txt
This topic can handle queries like these: collect user's role and provide feedback, 
give me a feedback based on my role, what's your feedback for my role?
```

クラシック オーケストレーションの場合は、説明文の代わりに 5 ～ 10 個のトリガー フレーズを設定します。

![The interface of Microsoft Copilot Studio when designing a new topic. There is a **Trigger** action with the value suggested in this exercise step as the trigger condition. There is also the button to add new actions highlighted.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-02.png)

<cc-end-step lab="mcs2" exercise="2" step="1" />

### Step 2: ユーザー入力の収集

画面中央の **+** ボタンを選択し、トピックに新しいアクションまたはステップを追加します。主なオプションは以下のとおりです。

- Send a message: ユーザー にメッセージを送信します。テキスト、画像、ビデオ、Adaptive Card などを送信可能です。
- Ask a question: ユーザー に入力を求めます。テキスト、画像、ビデオ、添付ファイル、Adaptive Card などを受け付けます。
- Ask with adaptive card: Adaptive Card を使って ユーザー から入力を収集します。
- Add a condition: 変数や定数値の比較に基づく分岐を追加します。
- Variable management: 変数を管理します (トピック レベル、グローバル、システム、環境)。
- Topic management: 現在のトピックのライフサイクルを管理します。
- Add an action: Power Automate フロー、カスタム コネクター、マルチ エージェント シナリオでの他 エージェント など外部アクションを呼び出します。
- Advanced: 外部 HTTP REST API の呼び出し、generative answers、イベント/アクティビティ送信などの高度な機能を提供します。

![The menu to select actions to add to the current topic. There available options are: send a message, ask a question, ask with adaptive card, add a condition, variable management, topic management, add an action, advanced.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-03.png)

ユーザー入力を収集するために **Ask a question** アクションを追加します。 ユーザー に役割を尋ねるため、質問文に次の値を設定します。

```txt
What is your role?
```

デフォルトでは Copilot Studio が `Multiple choice options` データ型を割り当て、**Identify** フィールドに表示されます。
**Identify** フィールド直下の **+ New option** を選択し、以下 3 つの値を追加します。

- Candidate
- Employee
- HR staff member

アクションは選択された値をトピック レベル変数に自動的に格納します。アクション右上の三点リーダーから **Properties** を選択してカスタマイズするか、アクション下部の変数名を選んで名前などを変更できます。

![The context menu of the action with commands to: see properties, rename the action, delete the action, add a comment to the action.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-04.png)

たとえば変数名を `UserRole` に変更します。設定完了後のアクションは次のようになります。

![The action fully configured with all the settings and commands highlighted. There is the question text, the data type for the result, the options, the variable to store the selected option, and the scope of the variable.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-05.png)

<cc-end-step lab="mcs2" exercise="2" step="2" />

### Step 3: ユーザーへのフィードバック

次に **+** ボタンを選択し、**Add a condition** を追加します。左側のブランチで **Select a variable** を選択し、前ステップで作成した **userRole** 変数を選択します。その後、条件値を選択し `userRole is equal to Candidate` となるよう設定します。
同様に `userRole is equal to Employee` と `userRole is equal to HR staff member` を追加し、最後に `All other conditions` を残します。

各ブランチ内で ユーザー へ専門的なフィードバックを提供するロジックを設定します。各 **Condition** ブランチ下の **+** コマンドを選択し、**Send a message** アクションを追加してください。必要に応じて複数アクションを追加できます。

各ブランチのメッセージ例:

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

`All other conditions` ブランチでは **Topic management** グループから **Redirect** アクションを選択し、システム トピック **Fallback** へフォールバックさせます。

![The condition branches with messages sent to the user for each option and a redirection to the **Fallback** topic in case the user did not provide any of the supported options.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-06.png)

シンプルなトピック ロジックが完成しました。

<cc-end-step lab="mcs2" exercise="2" step="3" />

### Step 4: 現在のトピックを終了する

カスタム トピックのフローを正しく完了させるため、**Topic management** グループから **End current topic** アクションを追加します。このアクションでトピックの会話が終了したことを Copilot Studio に伝えます。

![The **End current topic** action inserted in the current topic flow.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-07.png)

<cc-end-step lab="mcs2" exercise="2" step="4" />

### Step 5: トピックのテスト

準備が整ったのでトピックを保存しテストします。デザイナー右上の **Save** を選択し、表示されるダイアログでトピック名を入力して **Save** を選択します。

![The dialog window to assign a name to the topic and to save it.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-08.png)

トピック名は例として `Collect user's role` とします。デザイナー右上の **Test** を選択してテスト パネルを開き、次のプロンプトを入力します。

```txt
What's your feedback for my role?
```

 エージェント が役割の選択を促し、選択に応じたフィードバックを表示します。

![The agent in action in the test panel inside Microsoft Copilot Studio.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-09.png)

Exercise 2 は完了です。次の Exercise 3 でマルチターン トピックを作成しましょう。

<cc-end-step lab="mcs2" exercise="2" step="5" />

## Exercise 3 : マルチターン トピックの作成

単純な対話では 1 質問 1 回答のシングルターン会話で済みますが、より高度なトピックでは ユーザー と エージェント 間で複数回のやり取りが必要です。この演習では、新しい候補者に関するデータを収集するマルチターン トピックを作成します。

### Step 1: 新しいマルチターン トピックの作成

新しい候補者について次の情報を収集すると想定します。

- First name
- Last name
- E-mail
- Current role

情報収集のため、Exercise 2 Step 1 と同様に新しいトピックを作成します。
トピックの **Trigger** 説明例:

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

上記各フィールドごとに **Ask a question** アクションで ユーザー に入力を求めます。ただし回答のデータ型はフィールドによって異なります。first name、last name、current role は単純なテキストですが、e-mail は有効なメール アドレスである必要があります。

first name、last name、current role では **Identify** プロパティを **User's entire response** に設定し、 ユーザー が入力したテキストをそのまま取得します。変数型は Copilot Studio により自動的に `string` になります。それぞれの変数にわかりやすい名前を付けてください。
以下のスクリーンショットは first name 入力アクションの設定例です。同様に last name と current job role も設定します。

![The **Ask a question** action configured to collect the candidate's first name and store it into a variable of type string, accepting any value provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-01.png)

e-mail フィールドでは **Identify** を **Email** エンティティに設定し、Copilot Studio がメール アドレスのバリデーションを自動で行います。基になる変数は `string` のままです。

![The **Ask a question** action configured to collect the candidate's e-mail accepting only values of type email provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-02.png)

これで候補者情報をすべて収集できるようになり、 ユーザー へフィードバックを返せます。

<cc-end-step lab="mcs2" exercise="3" step="1" />

### Step 2: ユーザーへのフィードバック

収集した入力に基づき、確認メッセージを ユーザー に送信します。**Send a message** アクションを追加し、収集した値を格納した変数を使ってメッセージ内容を構築します。
変数をメッセージに挿入するには、**Send a message** アクションのツールバーにある **{x}** を選択し、目的の変数を選びます。

![The action **Send a message** with the insert variable command highlighted and the list of variables available in the current topic.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-03.png)

現在のトピックで定義された変数、システム変数、環境変数を挿入できます。
すべての変数を含む確認メッセージを設定すると、次のようになります。

![The action **Send a message** with all the referenced variables.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-04.png)

最終確認として **Ask a question** アクションを挿入し、メッセージを次のように設定します。

```txt
Is it ok for you to insert this new candidate?
```

回答として `Yes` と `No` をサポートするよう設定します。Exercise 2 Step 3 と同様に、それぞれの結果に対するブランチを構成します。簡単のため、各ブランチに **Send a message** アクションを 1 つずつ置き、 ユーザー のフィードバックに応じて👍または👎の絵文字を送るだけにします。最後に **End current topic** アクションを追加してトピックを完了します。

![The final part of the topic with the last **Ask a question** action, three branches to manage the user's input and one final action to **End current topic**.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-05.png)

トピックを保存し、例として `Register a new candidate` という名前を付け、統合テスト インターフェースでテストしてください。
以下はマルチターン トピックとの対話例です。e-mail フィールドに不正な値を入力すると、Copilot Studio が自動で再入力を求める点にも注目してください。

![The interaction with the multi-turn topic, where there are a set of questions and answers to collect all the candidate data.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-06.png)


<cc-end-step lab="mcs2" exercise="3" step="2" />

## Exercise 4 : Adaptive Card の活用

複数の **Ask a question** アクションで入力を収集する方法もありますが、多くのデータを収集したい場合や見た目を整えたい場合は Adaptive Card の使用を検討できます。

<details open>
<summary>Adaptive Card とは？</summary>

Adaptive Card は JSON で記述されるプラットフォーム非依存の UI スニペットで、アプリやサービス間でやり取りできます。アプリに届くと、JSON は自動的に環境に適応したネイティブ UI に変換されます。これにより主要なプラットフォームやフレームワークで軽量 UI を設計・統合できます。
    <div class="video">
      <iframe src="//www.youtube.com/embed/pYe2NqKhJoM" frameborder="0" allowfullscreen></iframe>
      <div>Adaptive cards are everywhere</div>
    </div>
</details>

### Step 1: Adaptive Card で入力を収集する

次の候補者情報を収集するトピックをさらに作成すると想定します。

- First name
- Last name
- E-mail
- Current role
- Spoken languages
- Skills

ここで Spoken languages と Skills は複数選択可能なリストです。

**Topics** タブを開き、Exercise 3 で作成したトピックを無効化してトリガー条件の競合を避けます。その後、Exercise 2 Step 1 と同様に新しいトピックを作成します。トピックの **Trigger** 説明例:

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

次に **Ask with adaptive card** アクションを追加し、1️⃣ アクション本体を選択して 2️⃣ **Edit adaptive card** ボタンをクリックします。**Adaptive card designer** の **Card payload editor** に次の JSON を入力します。

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

JSON を更新すると、Copilot Studio がトピック デザイナーでカードのプレビューを表示します。また、 ユーザー が入力した値を受け取るトピック レベル変数が自動生成されます。

![The interface of the topic when adding an **Ask with adaptive card** action, with the side panel open and a proper JSON of the adaptive card defined. On the designer there is a preview of the actual adaptive card and a list of output arguments to collect the values provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-02.png)

<cc-end-step lab="mcs2" exercise="4" step="1" />

### Step 2: Adaptive Card でフィードバックを提供する

収集したデータの要約を Adaptive Card で ユーザー に表示します。**Send a message** アクションを追加し、左上の **+ Add** を選択して **Adaptive card** を選び、メッセージ種別を Adaptive Card に変更します。

![The command box to add an adaptive card as the message to send with the **Send a message** action.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-03.png)

右側のパネルで **Edit adaptive card** を選択し、**Card payload editor** に次の JSON をコピー & ペーストします。

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

ペースト時にテキストエリア上部の **Edit JSON** が選択されていることを確認してください (デフォルト設定)。フォーカスを外すと **Send a message** アクションで Adaptive Card のプレビューが表示されます。現時点では変数部分が静的値で表示されています。

![The **Send a message** action configured to render an adaptive card. In the side panel on the right side there is the JSON of the adaptive card. In the body of the action there is a preview of the adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-04.png)

ドロップダウン **JSON Card** を **Formula Card** に切り替え、静的値をトピック レベル変数への参照に置き換えます。

![The **Send a message** action configured to render an adaptive card. In the side panel on the right side there is the JSON of the adaptive card. In the body of the action there is a preview of the adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-05.png)

エディター拡張ボタンを選択すると、インテリセンス付きの詳細エディターが表示されます。

![The side panel of the **Send a message** action while editing the adaptive card JSON in **Formula card** mode. There is a button to expand the editor.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-06.png)

![The adaptive card editor with intellisense to reference variables and PowerFx functions.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-07.png)

静的値を 1 つずつ変数参照に置き換えます。Spoken languages と Skills は値のリスト (`Table` 型) なので、PowerFx の `Concat` 関数と `Text` 関数を使用して文字列に変換します。以下はすべての式を適用した後の Adaptive Card JSON です。

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

トピックの末尾に **End current topic** アクションを追加し、保存して `Register new candidate with adaptive cards` などの名前を付けて、デザイナー右側のテスト パネルでテストします。以下のスクリーンショットは ユーザー との対話例です。

![The topic collecting information about a new candidate using an adaptive card and providing feedback through another adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-08.png)

これでトピックは完成し、正常に動作します。今後のラボでは外部 HR サービスにデータを保存して本物の候補者レコードを作成する方法を学びます。

<cc-end-step lab="mcs2" exercise="4" step="3" />

---8<--- "ja/mcs-congratulations.md"

これで エージェント は複数のトピックによる会話パスをサポートできるようになりました。次のラボではカスタム アクションの操作方法を学びます。

<a href="../03-actions">ここから</a> Lab MCS3 を開始し、Copilot Studio で エージェント にアクションを定義しましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/02-topics--ja" />