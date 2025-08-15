---
search:
  exclude: true
---
# Lab MCS2 - トピックの定義

このラボでは、Microsoft Copilot Studio でカスタム トピックを作成する方法を学習します。トピックはエージェントの主要な構成要素です。トピックを使用すると、エージェントはエンド ユーザーに対して単一ターンまたはマルチターンの会話体験を提供できます。トピックは、ユーザーとエージェントの間の会話が離散的なインタラクション パスを通じてどのように発展するかを定義します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ZVHkBiH6RxQ" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご覧いただけます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前回の [Lab MCS1](../01-first-agent){target=_blank} を基にしています。同じエージェントを継続して使用し、新しい機能を追加して機能性を向上させてください。

トピックは、グラフィカル デザイナーを使用するか、ナチュラル ランゲージで意図を記述することで作成できます。新しいトピックを作成した後、詳細な微調整が必要な場合は、低レベルのコード エディターで定義を編集することもできます。

トピックには次の 2 種類があります。

- System Topics: Microsoft Copilot Studio によって自動的に定義されます。無効化は可能ですが、削除はできません。
- Custom Topics: エージェントの作成者がカスタム インタラクション パスを提供するために作成します。

!!! note "トピックに関する追加情報"
    Microsoft Copilot Studio で作成したエージェントのトピックについては、[こちらの記事](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topics-overview){target=_blank} をご覧ください。System Topics については、[Use system topics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-system-topics){target=_blank} を参照してください。

このラボでは、次の内容を学習します。

- Generative AI を使用したオーケストレーションの活用方法
- シングルターン トピックの作成方法
- マルチターン トピックの作成方法
- Adaptive Card を使用したユーザーとの対話方法

## Exercise 1 : Generative AI を使用したオーケストレーション

この最初の演習では、[Lab MCS1](../01-first-agent){target=_blank} で作成したエージェントにおいて、プレビュー段階の新機能である Generative AI ベースのオーケストレーションを有効にします。

### Step 1: Generative AI ベースのオーケストレーションを有効化する

Copilot Studio で作成されたエージェントの重要な機能の 1 つが **generative orchestration** です。generative orchestration を用いると、エージェントはユーザーのクエリやイベント トリガーに応答するために、最適なナレッジ ベース、トピック、アクションを選択できます。 

既定ではエージェントは **classic orchestration** を使用しており、ユーザーのクエリに最も一致するトリガー フレーズを持つトピックが呼び出されます。一方、generative orchestration では、Copilot Studio がユーザーが入力したナチュラル ランゲージのプロンプトを解析し、最適なアイテムを判断してトリガーします。 

!!! pied-piper "注意事項"
    Generative orchestration を有効にすると、課金方法に影響する場合があります。詳細は [billing for generative mode](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-billed-sessions){target=_blank} をご確認ください。classic と generative のオーケストレーションには、ナレッジ検索方法やサポートされるデータ ソースなど、重要な違いがあります。既存のエージェントで generative モードを有効にする前に、[既知の制限事項](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions#known-limitations-for-generative-orchestration){target=_blank} を必ずお読みください。

Generative orchestration を有効にするには、ブラウザーを開き、対象の Microsoft 365 テナントの業務アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、Microsoft Copilot Studio を起動します。

1️⃣ **Agents** 一覧を表示し、2️⃣ 前回の Lab MCS1 で作成したエージェントを編集します。

![The interface of Microsoft Copilot Studio when browsing the agents and selecting one item to edit.](../../../assets/images/make/copilot-studio-02/edit-agent-01.png)

**Overview** タブで **Orchestration** トグルを有効にします。下図を参照してください。

![The interface of Microsoft Copilot Studio with the generative orchestration enabled and highlighted.](../../../assets/images/make/copilot-studio-02/generative-orchestration-01.png)

Generative orchestration が有効になるまでには時間がかかる場合があります。設定が適用されたら、エージェントを公開して変更を確定します。

<cc-end-step lab="mcs2" exercise="1" step="1" />

## Exercise 2 : シングルターン トピックの作成

この演習では、ユーザーから入力を収集し、その入力に基づいてフィードバックを提供する新しいトピックを作成します。具体的には、現在のユーザーの役割を収集し、役割に応じたガイダンスを返します。

### Step 1: 新しいシングルターン トピックを作成する

新しいトピックを作成するには、画面上部の 1️⃣ **Topics** タブを選択し、2️⃣ **+ Add a topic** を選択して、3️⃣ **From blank** をクリックします。

!!! info "Copilot でトピックを作成する"
    ナチュラル ランゲージで説明を入力し、Copilot にトピックを下書きさせることもできます。

![The interface of Microsoft Copilot Studio when creating a new topic. There is the **Topics** tab highlighted, with the **+ Add a topic** dropdown menu, and the **From blank** option highlighted.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-01.png)

Copilot Studio はトピックを定義するためのグラフィカル デザイナーを表示します。トピックの最初のビルディング ブロックは **Trigger** アクションで、トピックが何をするかを説明します。Generative orchestration が有効な場合、トリガー アクションにはナチュラル ランゲージでトピックの目的を定義するテキスト エリアがあります。ラボでは次の内容を入力してください。

```txt
This topic can handle queries like these: collect user's role and provide feedback, 
give me a feedback based on my role, what's your feedback for my role?
```

Classic orchestration を使用する場合は、説明文の代わりに 5 ～ 10 個程度のトリガー フレーズを指定します。

![The interface of Microsoft Copilot Studio when designing a new topic. There is a **Trigger** action with the value suggested in this exercise step as the trigger condition. There is also the button to add new actions highlighted.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-02.png)

<cc-end-step lab="mcs2" exercise="2" step="1" />

### Step 2: ユーザー入力を収集する

中央の **+** ボタンを選択して、新しいアクションやステップを現在のトピックに追加します。**+** ボタンを選択すると、利用可能なアクションの一覧が表示されます。主なオプションは次のとおりです。

- Send a message: ユーザーにメッセージを送信します。テキスト、画像、ビデオ、Adaptive Card などが使用できます。
- Ask a question: ユーザーに入力を求めます。テキスト、画像、ビデオ、添付ファイル、Adaptive Card などを収集できます。
- Ask with adaptive card: Adaptive Card を使用してユーザーから入力を収集します。
- Add a condition: 変数や定数値の比較に基づいてブランチを追加します。
- Variable management: トピック レベル、グローバル、system、environment スコープの変数を管理します。
- Topic management: 現在のトピックのライフサイクルを管理します。
- Add an action: Power Automate フロー、カスタム コネクター、マルチエージェント シナリオでの他エージェントなど外部アクションを利用します。
- Advanced: 外部 HTTP REST API の呼び出し、generative answers の使用、イベントやアクティビティの送信など、高度な機能を提供します。

![The menu to select actions to add to the current topic. There available options are: send a message, ask a question, ask with adaptive card, add a condition, variable management, topic management, add an action, advanced.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-03.png)

ユーザー入力を収集するため、**Ask a question** アクションを追加します。ユーザーに役割を尋ねるため、次の質問文を入力してください。

```txt
What is your role?
```

既定では Copilot Studio は収集した入力に `Multiple choice options` データ型を割り当てます。**Identify** 設定フィールドのすぐ下にある **+ New option** を選択し、以下の 3 つの値を追加します。

- Candidate
- Employee
- HR staff member

このアクションは、ユーザーが選択した値をトピック レベルの変数に自動的に格納します。アクションの右上隅の三点リーダーをクリックし **Properties** を選択すると詳細設定を変更できます。また、アクション下部の変数をクリックして名前や設定を更新することも可能です。

![The context menu of the action with commands to: see properties, rename the action, delete the action, add a comment to the action.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-04.png)

たとえば変数名を `UserRole` に変更します。完全に設定したアクションは次のようになります。

![The action fully configured with all the settings and commands highlighted. There is the question text, the data type for the result, the options, the variable to store the selected option, and the scope of the variable.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-05.png)

<cc-end-step lab="mcs2" exercise="2" step="2" />

### Step 3: ユーザーへフィードバックを返す

次に中央の **+** ボタンを選択して **Add a condition** を追加します。左側のブランチで **Select a variable** を選択し、前のステップで作成した **userRole** 変数を指定します。その後、条件値として `userRole is equal to Candidate` となるよう設定します。同様に `userRole is equal to Employee` と `userRole is equal to HR staff member` の条件を追加します。最後に `All other conditions` ブランチを残してください。

各ブランチ内で、ユーザーに対する特定のフィードバックを設定できます。各 **Condition** ブランチの下にある **+** コマンドを選択し、**Send a message** アクションを追加します。必要に応じて複数のアクションを追加してもかまいません。

3 つのブランチそれぞれに、たとえば次のメッセージを設定できます。

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

`All other conditions` ブランチには **Topic management** グループの **Redirect** アクションを配置し、System Topic の **Fallback** へフォールバックさせます。

![The condition branches with messages sent to the user for each option and a redirection to the **Fallback** topic in case the user did not provide any of the supported options.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-06.png)

シンプルなトピック ロジックが完成しました。

<cc-end-step lab="mcs2" exercise="2" step="3" />

### Step 4: 現在のトピックを終了する

カスタム トピックのフローを正しく完結させるために、**Topic management** グループにある **End current topic** アクションを追加します。このアクションはトピックの会話が完了したことを Copilot Studio に通知します。

![The **End current topic** action inserted in the current topic flow.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-07.png)

<cc-end-step lab="mcs2" exercise="2" step="4" />

### Step 5: トピックをテストする

これでトピックを保存してテストする準備が整いました。デザイナー右上の **Save** ボタンをクリックし、表示されるダイアログでトピック名を入力して **Save** を再度クリックします。

![The dialog window to assign a name to the topic and to save it.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-08.png)

たとえばトピック名を `Collect user's role` とします。次にデザイナー右上の **Test** コマンドをクリックしてテスト パネルを開き、次のプロンプトを入力します。

```txt
What's your feedback for my role?
```

エージェントは役割の選択を求め、選択内容に応じたフィードバックを表示します。以下のスクリーンショットを参照してください。

![The agent in action in the test panel inside Microsoft Copilot Studio.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-09.png)

Exercise 2 が完了しました。続いて Exercise 3 でマルチターン トピックを作成します。

<cc-end-step lab="mcs2" exercise="2" step="5" />

## Exercise 3 : マルチターン トピックの作成

簡単なやり取りでは、質問と回答が 1 回ずつのシングルターン会話で十分です。しかし内容が多い場合は、ユーザーとエージェント間で複数回のやり取りが必要なマルチターン会話が求められます。この演習では、新しい役職の候補者に関するデータを収集するマルチターン トピックを作成します。

### Step 1: 新しいマルチターン トピックを作成する

新しい候補者について、次の情報を収集するとします。

- First name
- Last name
- E-mail
- Current role

これらの情報を収集するため、Exercise 2 Step 1 と同様の手順で新しいトピックを作成します。トピックの **Trigger** 説明は次のようにします。

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

各項目について **Ask a question** アクションでユーザーに質問します。ただし、回答のデータ型は項目によって異なります。たとえば first name, last name, current role は単純なテキストですが、e-mail は有効なメール形式が必要です。

first name、last name、current role については、**Ask a question** アクションの **Identify** プロパティで **User's entire response** を選択し、任意のテキストを取得します。Copilot Studio により変数型は `string` になります。変数には分かりやすい名前を付けてください。以下のスクリーンショットは first name の設定例です。同様の設定を last name と current role でも行います。

![The **Ask a question** action configured to collect the candidate's first name and store it into a variable of type string, accepting any value provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-01.png)

e-mail については **Identify** プロパティで **Email** を選択し、入力がメール形式であることを Copilot Studio に自動検証させます。変数型は `string` のままです。

![The **Ask a question** action configured to collect the candidate's e-mail accepting only values of type email provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-02.png)

これで候補者情報をすべて収集できる準備が整いました。次にユーザーにフィードバックを提供します。

<cc-end-step lab="mcs2" exercise="3" step="1" />

### Step 2: ユーザーへフィードバックを提供する

収集した入力に基づき、データを確認するメッセージをユーザーに送信します。**Send a message** アクションを追加し、入力を格納した変数を使用してメッセージを組み立てます。メッセージに変数を追加するには、**Send a message** アクションのツールバーにある **{x}** コマンドを選択し、目的の変数を選びます。

![The action **Send a message** with the insert variable command highlighted and the list of variables available in the current topic.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-03.png)

現在のトピックで定義された変数、system 変数、environment 変数を挿入できます。すべての変数を使用してレポート メッセージを構成すると、次のようになります。

![The action **Send a message** with all the referenced variables.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-04.png)

最後の確認として、**Ask a question** アクションを挿入し、次のメッセージを入力します。

```txt
Is it ok for you to insert this new candidate?
```

回答として `Yes` と `No` を設定します。Exercise 2 Step 3 と同様に、それぞれの分岐に対してロジックを設定します。ここではシンプルに各ブランチで **Send a message** アクションを 1 つ使用し、ユーザーのフィードバックに応じてサムズアップまたはサムズダウンの絵文字を送信します。最後に **End current topic** アクションを追加してトピックを完了させます。

![The final part of the topic with the last **Ask a question** action, three branches to manage the user's input and one final action to **End current topic**.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-05.png)

トピックを保存し、たとえば `Register a new candidate` という名前を付け、組み込みテスト インターフェースでテストしてください。下図はマルチターン トピックとの対話例です。e-mail が正しくない場合、Copilot Studio が自動で再入力を求めることも確認できます。

![The interaction with the multi-turn topic, where there are a set of questions and answers to collect all the candidate data.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-06.png)


<cc-end-step lab="mcs2" exercise="3" step="2" />

## Exercise 4 : Adaptive Card の使用

複数の **Ask a question** アクションで入力を収集する方法はありますが、多くのデータを収集したい場合や見栄えのよいインタラクションを実現したい場合は、Adaptive Card の使用を検討できます。

<details open>
<summary>Adaptive Card とは？</summary>

Adaptive Card は JSON で記述されたプラットフォーム非依存の UI スニペットで、アプリやサービス間で交換できます。アプリに配信されると、JSON がネイティブ UI に変換され、環境に自動で適応します。これにより、主要なプラットフォームやフレームワークで軽量 UI を設計・統合できます。
    <div class="video">
      <iframe src="//www.youtube.com/embed/pYe2NqKhJoM" frameborder="0" allowfullscreen></iframe>
      <div>Adaptive Card はあらゆる場所で利用されています</div>
    </div>
</details>

### Step 1: Adaptive Card で入力を収集する

次の情報を新しい候補者から収集すると仮定します。

- First name
- Last name
- E-mail
- Current role
- Spoken languages
- Skills

特に spoken languages と skills は複数選択可能なリストです。

**Topics** タブを開き、Exercise 3 で作成したトピックを無効にしてトリガーの重複を防ぎます。その後、Exercise 2 Step 1 と同様の手順で新しいトピックを作成します。トピックの **Trigger** 説明は次のようにします。

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

次に **Ask with adaptive card** アクションを追加し、1️⃣ 新しいアクションの本体を選択して、2️⃣ **Edit adaptive card** ボタンをクリックします。**Adaptive card designer** の **Card payload editor** に次の JSON を入力します。

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

JSON を更新すると、トピック デザイナーの UI に Adaptive Card のプレビューが表示されます。また、Copilot Studio はユーザーが入力した値を格納するトピック レベルの変数を自動生成します。

![The interface of the topic when adding an **Ask with adaptive card** action, with the side panel open and a proper JSON of the adaptive card defined. On the designer there is a preview of the actual adaptive card and a list of output arguments to collect the values provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-02.png)

<cc-end-step lab="mcs2" exercise="4" step="1" />

### Step 2: Adaptive Card でフィードバックを提供する

収集したデータのレポートを Adaptive Card でユーザーに表示します。**+** コマンドを選択し **Send a message** アクションを追加します。次に **+ Add** をクリックして **Adaptive card** を選択し、メッセージを Adaptive Card に切り替えます。

![The command box to add an adaptive card as the message to send with the **Send a message** action.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-03.png)

右側のサイド パネルで **Edit adaptive card** を選択し、**Adaptive card designer** の **Card payload editor** に次の JSON を貼り付けます。

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

JSON を貼り付ける際、テキストエリア上部の **Edit JSON** を選択していることを確認してください（既定で選択されています）。フォーカスを外すと **Send a message** アクションに Adaptive Card のプレビューが表示され、変数の代わりに静的値がレンダリングされます。

![The **Send a message** action configured to render an adaptive card. In the side panel on the right side there is the JSON of the adaptive card. In the body of the action there is a preview of the adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-04.png)

ドロップダウンの **JSON Card** を **Formula Card** に切り替え、静的値をトピック レベルの変数に置き換えます。

![The **Send a message** action configured to render an adaptive card. In the side panel on the right side there is the JSON of the adaptive card. In the body of the action there is a preview of the adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-05.png)

エディターを拡張するボタンをクリックし、変数や PowerFx 関数を参照して静的値を置き換えます。

![The side panel of the **Send a message** action while editing the adaptive card JSON in **Formula card** mode. There is a button to expand the editor.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-06.png)

ダイアログが表示され、IntelliSense 付きの高度なエディターで編集できます。

![The adaptive card editor with intellisense to reference variables and PowerFx functions.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-07.png)

静的値を変数に置き換えてください。spoken languages と skills は `Table` 型（リスト）なので、PowerFx の `Concat` 関数と `Text` 関数を使用して文字列に変換します。すべての式を設定した Adaptive Card JSON は次のとおりです。

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

### Step 3: トピックをテストする

最後に **End current topic** アクションを追加し、トピックを保存して `Register new candidate with adaptive cards` などの名前を付け、デザイナー右側のテスト パネルでテストします。次のスクリーンショットはユーザーとの対話例です。

![The topic collecting information about a new candidate using an adaptive card and providing feedback through another adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-08.png)

これでトピックは準備完了です。次のラボでは、外部 HR サービスにデータを保存し、実際に候補者レコードを作成する方法を学びます。

<cc-end-step lab="mcs2" exercise="4" step="3" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントは複数のトピックを通じて多様な会話パスをサポートできるようになりました。次のラボでは、カスタム Action の扱い方を学習します。

<a href="../03-actions">こちらから</a> Lab MCS3 を開始し、Copilot Studio でエージェントに Action を定義しましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/02-topics--ja" />