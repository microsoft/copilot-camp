---
search:
  exclude: true
---
# ラボ MCS2 - トピックの定義

このラボでは、Microsoft Copilot Studio でカスタム トピックを作成する方法を学習します。トピックは エージェント の主要な構成要素です。トピックを使うことで、エンド ユーザー に対して単一ターンまたはマルチターンの会話体験を提供できます。トピックは、 ユーザー と エージェント の会話がどのように展開されるかを、個別の対話パスで定義します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ZVHkBiH6RxQ" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご確認ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前回の [ラボ MCS1](../01-first-agent){target=_blank} を基にしています。同じ エージェント を継続して使用し、新しい機能を追加していきます。

トピックは、グラフィカル デザイナーで作成することも、自然言語で意図を記述して作成することもできます。新しいトピックを作成した後、詳細な微調整が必要な場合は、低レベル コード エディターで定義を編集することも可能です。

トピックには 2 種類あります。

- システム トピック: Microsoft Copilot Studio によって自動的に定義されます。無効化はできますが削除はできません。
- カスタム トピック: エージェント 作者が作成し、独自の対話パスを提供します。

!!! note "トピックの詳細情報"
    Microsoft Copilot Studio で作成した エージェント のトピックに関する詳細は、[こちらの記事](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topics-overview){target=_blank} をご覧ください。システム トピックについては [Use system topics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-system-topics){target=_blank} を参照してください。

このラボで学習する内容:

- Generative AI ベースのオーケストレーションの利用方法
- シングルターン トピックの作成方法
- マルチターン トピックの作成方法
- Adaptive Card を使用した ユーザー との対話方法

## Exercise 1 : Generative AI ベースのオーケストレーション

最初の演習では、[ラボ MCS1](../01-first-agent){target=_blank} で作成した エージェント に Generative AI ベースのオーケストレーションを有効化します。執筆時点ではプレビュー機能です。

### Step 1: Generative AI ベースのオーケストレーションを有効化する

Copilot Studio で作成した エージェント の重要な機能の 1 つに、Generative オーケストレーションがあります。Generative オーケストレーションを使用すると、 エージェント は最適なナレッジ ベース、トピック、アクションを選択し、 ユーザー のクエリやイベント トリガーに応答できます。

既定では、 エージェント はクラシック オーケストレーションを使用します。これは、 ユーザー が入力したクエリに最も近いトリガー フレーズを持つトピックを起動して応答します。Generative オーケストレーションでは、Copilot Studio が ユーザー の自然言語プロンプトを処理して意図を理解し、最適な項目を判断します。

!!! pied-piper "注意事項"
    Generative オーケストレーションを有効にすると、課金方法に影響する場合があります。詳細は [Billing for generative mode](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-billed-sessions){target=_blank} を参照してください。クラシックと Generative の違いとして、ナレッジ検索方法やサポートされるデータ ソースがあります。既存 エージェント で Generative モードをオンにする前に、[既知の制限](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions#known-limitations-for-generative-orchestration){target=_blank} をご確認ください。

Generative オーケストレーションを有効にするには、ブラウザを開き、対象 Microsoft 365 テナントの作業アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスします。

1️⃣ **Agents** の一覧を表示し、2️⃣ 前回のラボ MCS1 で作成した エージェント を編集します。

![The interface of Microsoft Copilot Studio when browsing the agents and selecting one item to edit.](../../../assets/images/make/copilot-studio-02/edit-agent-01.png)

**Overview** タブで **Orchestration** トグルをオンにします。

![The interface of Microsoft Copilot Studio with the generative orchestration enabled and highlighted.](../../../assets/images/make/copilot-studio-02/generative-orchestration-01.png)

Generative オーケストレーションの有効化には少し時間がかかります。設定後、変更を確定するために エージェント を発行してください。

<cc-end-step lab="mcs2" exercise="1" step="1" />

## Exercise 2 : シングルターン トピックの作成

この演習では、 ユーザー から入力を収集し、その入力に基づいてフィードバックを返す新しいトピックを作成します。具体的には、現在の ユーザー の役割を取得し、役割に応じたガイダンスを返します。

### Step 1: 新しいシングルターン トピックの作成

新しいトピックを作成するには、画面上部で 1️⃣ **Topics** タブを選択し、2️⃣ **+ Add a topic** をクリックして 3️⃣ **From blank** を選択します。

!!! info "Copilot でトピックを作成"
    自然言語で説明を入力するだけで、新しいトピックを Copilot に作成させることもできます。

![The interface of Microsoft Copilot Studio when creating a new topic. There is the **Topics** tab highlighted, with the **+ Add a topic** dropdown menu, and the **From blank** option highlighted.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-01.png)

Copilot Studio ではトピックを定義するグラフィカル デザイナーが表示されます。最初のビルディング ブロックは **Trigger** アクションで、トピックの目的を記述します。Generative オーケストレーションが有効な場合、ここに自然言語でトピックの目的を記述できます。ラボでは次の内容を入力してください。

```txt
This topic can handle queries like these: collect user's role and provide feedback, 
give me a feedback based on my role, what's your feedback for my role?
```

クラシック オーケストレーションを使用する場合は、5～10 個のトリガー フレーズを指定します。

![The interface of Microsoft Copilot Studio when designing a new topic. There is a **Trigger** action with the value suggested in this exercise step as the trigger condition. There is also the button to add new actions highlighted.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-02.png)

<cc-end-step lab="mcs2" exercise="2" step="1" />

### Step 2: ユーザー の入力を収集する

画面中央の **+** ボタンを選択して、新しいアクションまたはステップを追加します。**+** を選択すると、利用可能なアクションの一覧が表示されます。主なオプションは以下のとおりです。

- Send a message: テキスト、画像、動画、Adaptive Card などを送信
- Ask a question: テキスト、画像、動画、添付ファイル、Adaptive Card などを入力として要求
- Ask with adaptive card: Adaptive Card を使用して入力を収集
- Add a condition: 変数や定数の比較に基づく分岐を追加
- Variable management: 変数を管理 (トピック レベル、グローバル、システム、環境)
- Topic management: 現在のトピックのライフサイクル管理
- Add an action: Power Automate フロー、カスタム コネクタ、マルチ エージェント シナリオで他の エージェント などを呼び出し
- Advanced: 外部 HTTP REST API、ジェネレーティブ アンサー、イベントやアクティビティの送信などの高度な機能

![The menu to select actions to add to the current topic. There available options are: send a message, ask a question, ask with adaptive card, add a condition, variable management, topic management, add an action, advanced.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-03.png)

ユーザー の入力を収集するために **Ask a question** アクションを追加します。 ユーザー の役割を尋ねるため、質問テキストに次を入力します。

```txt
What is your role?
```

既定では、Copilot Studio は収集した入力に `Multiple choice options` データ型を割り当てます (**Identify** 設定フィールドで確認可能)。**Identify** のすぐ下にある **+ New option** を選択し、次の 3 つの値を追加します。

- Candidate
- Employee
- HR staff member

このアクションは、 ユーザー が選択した値をトピック レベルの変数に自動的に保存します。アクション右上の 3 点リーダーから **Properties** を選択してカスタマイズするか、アクション下部の変数名を選択して名前などを変更できます。

![The context menu of the action with commands to: see properties, rename the action, delete the action, add a comment to the action.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-04.png)

たとえば、変数名を `UserRole` に変更します。設定が完了したアクションは次のようになります。

![The action fully configured with all the settings and commands highlighted. There is the question text, the data type for the result, the options, the variable to store the selected option, and the scope of the variable.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-05.png)

<cc-end-step lab="mcs2" exercise="2" step="2" />

### Step 3: ユーザー にフィードバックを提供する

次に **+** ボタンを選択して **Add a condition** を追加します。左側のブランチで **Select a variable** を選択し、前のステップで作成した **userRole** 変数を選択します。続いて条件値を設定し、`userRole is equal to Candidate` とします。
同様にして `userRole is equal to Employee`、`userRole is equal to HR staff member` の条件を追加します。最後のブランチは `All other conditions` とします。

各ブランチ内で、 ユーザー に対して専用のフィードバックを送るロジックを指定します。各 **Condition** ブランチの下にある **+** コマンドを選択し、**Send a message** アクションを追加します。必要であれば複数のアクションを追加可能です。

3 つのブランチには、例えば次のフィードバック メッセージを設定します。

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

`All other conditions` ブランチでは、**Topic management** グループにある **Redirect** アクションを設定し、システム トピック **Fallback** にフォールバックさせます。

![The condition branches with messages sent to the user for each option and a redirection to the **Fallback** topic in case the user did not provide any of the supported options.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-06.png)

簡単なロジックのトピックが完成しました。

<cc-end-step lab="mcs2" exercise="2" step="3" />

### Step 4: トピックを終了する

カスタム トピックのフローを適切に完了するため、**Topic management** グループから **End current topic** アクションを追加します。このアクションにより、トピックの会話が完了したことを Copilot Studio に通知します。

![The **End current topic** action inserted in the current topic flow.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-07.png)

<cc-end-step lab="mcs2" exercise="2" step="4" />

### Step 5: トピックをテストする

トピックを保存してテストする準備ができました。デザイナー右上の **Save** ボタンを選択し、表示されるダイアログでトピック名を入力して **Save** を再度選択します。

![The dialog window to assign a name to the topic and to save it.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-08.png)

たとえば、トピック名を `Collect user's role` とします。次にデザイナー右上の **Test** コマンドを選択してテスト パネルを開き、次のプロンプトを入力します。

```txt
What's your feedback for my role?
```

エージェント が役割の選択を促し、選択に応じたフィードバックを返します。

![The agent in action in the test panel inside Microsoft Copilot Studio.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-09.png)

Exercise 2 が完了しました。次は Exercise 3 でマルチターン トピックを作成します。

<cc-end-step lab="mcs2" exercise="2" step="5" />

## Exercise 3 : マルチターン トピックの作成

単純な対話では 1 つの質問と 1 つの回答だけのシングルターン会話で十分ですが、内容のあるトピックでは ユーザー と エージェント の間で複数回のやり取りが必要です。この演習では、新しい候補者に関するデータを収集するマルチターン トピックを作成します。

### Step 1: 新しいマルチターン トピックの作成

新しい候補者について、次の情報を収集すると仮定します。

- 名
- 姓
- E-mail
- 現在の役職

これらの情報を収集するため、Exercise 2 Step 1 と同様に新しいトピックを作成します。トピックの **Trigger** の説明例:

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

それぞれの情報フィールドについて **Ask a question** アクションで入力を求めます。ただし、回答の型はフィールドによって異なります。名、姓、現在の役職はシンプルなテキスト、E-mail は有効なメール アドレスである必要があります。

名、姓、現在の役職については、**Ask a question** アクションの **Identify** プロパティで **User's entire response** を選択します。これで ユーザー が入力したテキストをそのまま取得できます。変数型は Copilot Studio により `string` になります。各変数にはわかりやすい名前を付けてください。以下のスクリーンショットは名の入力アクションの例です。同じ手順で姓と現在の役職も設定します。

![The **Ask a question** action configured to collect the candidate's first name and store it into a variable of type string, accepting any value provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-01.png)

E-mail フィールドでは **Identify** プロパティで **Email** エンティティを選択し、Copilot Studio が入力を自動的に検証できるようにします。変数型は `string` のままです。

![The **Ask a question** action configured to collect the candidate's e-mail accepting only values of type email provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-02.png)

これで候補者に関する情報をすべて収集できました。次に ユーザー へフィードバックを送ります。

<cc-end-step lab="mcs2" exercise="3" step="1" />

### Step 2: ユーザー へのフィードバック

収集した入力に基づいて、確認メッセージを送ります。**Send a message** アクションを追加し、変数を使用してメッセージを構成します。変数を挿入するには、**Send a message** アクションのツールバーにある **{x}** コマンドを選択し、目的の変数を選択します。

![The action **Send a message** with the insert variable command highlighted and the list of variables available in the current topic.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-03.png)

トピック内の変数、システム変数、環境変数を挿入できます。すべての変数を含めた確認メッセージは次のようになります。

![The action **Send a message** with all the referenced variables.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-04.png)

最終確認として、**Ask a question** アクションを追加し、次のメッセージを入力します。

```txt
Is it ok for you to insert this new candidate?
```

回答として `Yes` と `No` をサポートするよう設定します。Exercise 2 Step 3 と同様に、それぞれの分岐を構成します。簡単にするため、各分岐に **Send a message** アクションを 1 つずつ追加し、ユーザー のフィードバックに応じて👍または👎の絵文字を送ります。最後に **End current topic** アクションを追加して完了です。

![The final part of the topic with the last **Ask a question** action, three branches to manage the user's input and one final action to **End current topic**.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-05.png)

トピックを保存し、たとえば `Register a new candidate` と名付け、組み込みのテスト インターフェースでテストしてください。以下は対話のスクリーンショットです。E-mail フィールドで正しくない値を入力すると、Copilot Studio が自動で再入力を促す点にも注目してください。

![The interaction with the multi-turn topic, where there are a set of questions and answers to collect all the candidate data.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-06.png)


<cc-end-step lab="mcs2" exercise="3" step="2" />

## Exercise 4 : Adaptive Card の利用

複数の **Ask a question** アクションで入力を収集するのは 1 つの方法ですが、多くのデータを取得したい場合や、見栄えの良い対話を実現したい場合は Adaptive Card の使用を検討できます。

<details open>
<summary>Adaptive Card とは?</summary>

Adaptive Card は JSON で記述されたプラットフォーム非依存の UI スニペットで、アプリやサービス間で交換できます。アプリに配信されると、JSON は自動的に環境に適応したネイティブ UI に変換されます。これにより、主要なプラットフォームやフレームワークで軽量 UI を設計・統合できます。
    <div class="video">
      <iframe src="//www.youtube.com/embed/pYe2NqKhJoM" frameborder="0" allowfullscreen></iframe>
      <div>Adaptive Card はあらゆる場所で利用されています</div>
    </div>
</details>

### Step 1: Adaptive Card で入力を収集する

新しい候補者について、次の情報を収集すると仮定します。

- 名
- 姓
- E-mail
- 現在の役職
- 話せる言語
- スキル

話せる言語とスキルは複数選択可能なリストです。

**Topics** タブを開き、Exercise 3 で作成したトピックを無効化してトリガー条件の競合を避けます。その後、Exercise 2 Step 1 の手順で新しいトピックを作成します。トピックの **Trigger** の説明例:

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

次に **Ask with adaptive card** アクションを追加し、1️⃣ アクションのボディを選択して 2️⃣ **Edit adaptive card** ボタンをクリックします。**Adaptive card designer** の **Card payload editor** に次の JSON を入力します。

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

JSON を更新すると、Copilot Studio はトピック デザイナーの UI 内にカードのプレビューを表示し、 ユーザー が入力した値を収集するためのトピック レベル変数を自動定義します。

![The interface of the topic when adding an **Ask with adaptive card** action, with the side panel open and a proper JSON of the adaptive card defined. On the designer there is a preview of the actual adaptive card and a list of output arguments to collect the values provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-02.png)

<cc-end-step lab="mcs2" exercise="4" step="1" />

### Step 2: Adaptive Card でフィードバックを提供する

Adaptive Card を使用して、収集したデータの要約を ユーザー に表示することもできます。**Send a message** アクションを追加し、左上の **+ Add** を選択して **Adaptive card** を選びます。

![The command box to add an adaptive card as the message to send with the **Send a message** action.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-03.png)

右側のパネルで **Edit adaptive card** を選択し、次の JSON を **Card payload editor** にコピー & ペーストします。

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

JSON を貼り付ける際、テキスト エリア上部の **Edit JSON** が選択されていることを確認してください (既定でオン)。フォーカスを外すと **Send a message** アクションがカードをプレビューし、すべての変数に静的値が表示されます。

![The **Send a message** action configured to render an adaptive card. In the side panel on the right side there is the JSON of the adaptive card. In the body of the action there is a preview of the adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-04.png)

**JSON Card** ドロップダウンを **Formula Card** に切り替え、トピック レベル変数を参照する式に置き換えます。

![The **Send a message** action configured to render an adaptive card. In the side panel on the right side there is the JSON of the adaptive card. In the body of the action there is a preview of the adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-05.png)

エディターを展開し、静的値を順番に変数参照に置き換えます。

![The side panel of the **Send a message** action while editing the adaptive card JSON in **Formula card** mode. There is a button to expand the editor.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-06.png)

ダイアログが表示され、IntelliSense 付きの高度なエディターで変数や PowerFx 関数を参照できます。

![The adaptive card editor with intellisense to reference variables and PowerFx functions.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-07.png)

静的値をすべて変数に置き換えます。特に、話せる言語とスキルは `Table` 型の値なので、PowerFx の `Concat` 関数と `Text` 関数を使用して文字列に変換します。すべての式を設定した後の JSON は次のとおりです。

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

!!! note "PowerFx 関数の詳細"
    PowerFx 関数の詳細は [Create expressions using Power Fx](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-power-fx){target=_blank} をご覧ください。

<cc-end-step lab="mcs2" exercise="4" step="2" />

### Step 3: トピックをテストする

最後に **End current topic** アクションを追加し、トピックを保存して `Register new candidate with adaptive cards` などの名前を付け、デザイナー右側のテスト パネルでテストします。以下のスクリーンショットは ユーザー との対話例です。

![The topic collecting information about a new candidate using an adaptive card and providing feedback through another adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-08.png)

これでトピックは完成です。次のラボでは、外部 HR サービスにデータを保存して実際に新しい候補者レコードを作成する方法を学びます。

<cc-end-step lab="mcs2" exercise="4" step="3" />

---8<--- "ja/mcs-congratulations.md"

これで エージェント は複数のトピックを通じて複数の会話パスをサポートします。次のラボではカスタム Action の取り扱いを学習します。

<a href="../03-actions">こちらから</a> ラボ MCS3 を開始し、Copilot Studio で エージェント に Action を定義しましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/02-topics" />