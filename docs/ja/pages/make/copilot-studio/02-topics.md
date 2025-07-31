---
search:
  exclude: true
---
# ラボ MCS2 － トピックの定義

このラボでは、Microsoft Copilot Studio でカスタム トピックを作成する方法を学習します。トピックは エージェント の主要な構成要素です。トピックを使用すると、エンド ユーザー に対してシングルターンまたはマルチターンの会話体験を提供できます。トピックは ユーザー と エージェント 間の会話がどのように展開するかを、個々の対話パスとして定義します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ZVHkBiH6RxQ" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご覧ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前回の [ラボ MCS1](../01-first-agent){target=_blank} を基にしています。同じ エージェント を継続して作業し、機能を強化していきます。

トピックはグラフィカル デザイナーを使用して作成することも、自然言語で意図を説明して作成することもできます。新しいトピックを作成した後、低レベルのコード エディターで定義を編集し、詳細な調整を行うことも可能です。

トピックには 2 種類あります。

- System トピック: Microsoft Copilot Studio により自動的に定義されます。無効化はできますが削除はできません。
- Custom トピック: エージェント 作者が作成し、独自の対話パスを提供します。

!!! note "トピックに関する追加情報"
    Microsoft Copilot Studio の エージェント におけるトピックの詳細は、[こちらの記事](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topics-overview){target=_blank} を参照してください。System トピックについては、[Use system topics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-system-topics){target=_blank} をご覧ください。

このラボで学習する内容:

- Generative AI ベースのオーケストレーションの活用方法
- シングルターン トピックの作成方法
- マルチターン トピックの作成方法
- ユーザー と対話するための Adaptive Card の使用方法

## 演習 1 : Generative AI ベースのオーケストレーション

最初の演習では、[ラボ MCS1](../01-first-agent){target=_blank} で作成した エージェント に Generative AI ベースのオーケストレーションを有効化します。この機能は執筆時点でプレビュー中です。

### Step 1: Generative AI ベースのオーケストレーションを有効化する

Copilot Studio で作成された エージェント の重要な機能の 1 つが Generative Orchestration です。Generative Orchestration を使用すると、 エージェント は最適なナレッジ ベース、トピック、アクションを選択して ユーザー と対話し、ユーザー の問い合わせに回答したり、イベント トリガーに応答したりできます。 

既定では、 エージェント は Classic Orchestration を使用します。Classic Orchestration では、 エージェント は ユーザー の問い合わせと最も一致するトリガー フレーズを持つトピックを起動して応答します。Generative Orchestration では、Copilot Studio が自然言語で入力されたプロンプトを処理して ユーザー の意図を理解し、最適な項目をトリガーします。 

!!! pied-piper "注意事項"
    Generative Orchestration を有効にすると、課金方法に影響する可能性があります。[Generative モードの課金](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-billed-sessions){target=_blank} についてご確認ください。Classic と Generative の間には、ナレッジの検索方法やサポートされるデータ ソースなど重要な違いがあります。既存 エージェント で Generative モードを有効化する前に、[既知の制限](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions#known-limitations-for-generative-orchestration){target=_blank} をお読みください。

Generative Orchestration を有効化するには、ブラウザーを開き、対象の Microsoft 365 テナントの職場アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、Microsoft Copilot Studio を起動します。

1️⃣ **Agents** の一覧を表示し、2️⃣ 前回のラボで作成した エージェント を編集します。

![The interface of Microsoft Copilot Studio when browsing the agents and selecting one item to edit.](../../../assets/images/make/copilot-studio-02/edit-agent-01.png)

**Overview** タブで **Orchestration** という名前のトグルを有効化します（下図参照）。

![The interface of Microsoft Copilot Studio with the generative orchestration enabled and highlighted.](../../../assets/images/make/copilot-studio-02/generative-orchestration-01.png)

Generative Orchestration の有効化には少し時間がかかります。設定が適用されたら、 エージェント を公開して変更を確定します。

<cc-end-step lab="mcs2" exercise="1" step="1" />

## 演習 2 : シングルターン トピックの作成

この演習では、 ユーザー から入力を取得し、その入力に基づいてフィードバックを返す新しいトピックを作成します。具体的には、現在の ユーザー の役割 (ロール) を収集し、入力されたロールに応じて エージェント の利用方法をガイダンスします。

### Step 1: 新しいシングルターン トピックの作成

新しいトピックを作成するには、画面上部の 1️⃣ **Topics** タブを選択し、2️⃣ **+ Add a topic** を選択して、3️⃣ **From blank** を選びます。

!!! info "Copilot でトピックを作成"
    自然言語で説明を入力するだけで Copilot がトピックを下書きすることもできます。

![The interface of Microsoft Copilot Studio when creating a new topic. There is the **Topics** tab highlighted, with the **+ Add a topic** dropdown menu, and the **From blank** option highlighted.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-01.png)

Copilot Studio はトピックを定義するためのグラフィカル デザイナーを表示します。トピックの最初のビルディング ブロックは **Trigger** アクションで、トピックが何を行うかを説明します。Generative Orchestration が有効な場合、このアクションには自然言語でトピックの目的を定義できるテキスト エリアがあります。このラボでは次の内容を入力してください。

```txt
This topic can handle queries like these: collect user's role and provide feedback, 
give me a feedback based on my role, what's your feedback for my role?
```

Classic Orchestration を使用する場合は、説明文の代わりに 5～10 個のトリガー フレーズまたは文を指定します。

![The interface of Microsoft Copilot Studio when designing a new topic. There is a **Trigger** action with the value suggested in this exercise step as the trigger condition. There is also the button to add new actions highlighted.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-02.png)

<cc-end-step lab="mcs2" exercise="2" step="1" />

### Step 2: ユーザー からの入力を収集する

画面中央の **+** ボタンを選択して、現在のトピックに新しいアクションまたはステップを追加します。**+** ボタンを選ぶと、利用可能なアクションの一覧が表示されます。主なオプションは次のとおりです。

- Send a message: ユーザー にメッセージを送信します。テキスト、画像、動画、Adaptive Card などが使用できます。
- Ask a question: ユーザー へ入力を要求します。テキスト、画像、動画、添付ファイル、Adaptive Card などが利用可能です。
- Ask with adaptive card: Adaptive Card を使用して ユーザー からコンテンツを収集します。
- Add a condition: 変数や定数値の比較に基づいて分岐を追加します。
- Variable management: トピックレベル、グローバル、システム、環境などの変数を管理します。
- Topic management: 現在のトピックのライフサイクルを管理します。
- Add an action: Power Automate フロー、カスタム コネクタ、マルチ エージェント シナリオの他 エージェント など外部アクションを呼び出します。
- Advanced: 外部 HTTP REST API の呼び出し、Generative Answers、イベントやアクティビティの送信など高度な機能を提供します。

![The menu to select actions to add to the current topic. There available options are: send a message, ask a question, ask with adaptive card, add a condition, variable management, topic management, add an action, advanced.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-03.png)

ユーザー の入力を収集するため、**Ask a question** アクションを追加します。 ユーザー に役割を尋ねるので、質問テキストに次を入力します。

```txt
What is your role?
```

既定では Copilot Studio は収集した入力に `Multiple choice options` データ型を割り当て、**Identify** 設定フィールドに表示されます。
**Identify** フィールド直下の **+ New option** を選択し、以下 3 つの値を一つずつ追加します。

- Candidate
- Employee
- HR staff member

このアクションは ユーザー が選択した値をトピックレベルの変数に自動的に保存します。アクション右上の三点リーダーを選択し **Properties** コマンドでアクションをカスタマイズするか、アクション下部の変数を選択して名前などを更新できます。

![The context menu of the action with commands to: see properties, rename the action, delete the action, add a comment to the action.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-04.png)

たとえば、変数名を `UserRole` に変更できます。完全に設定したアクションは次のようになります。

![The action fully configured with all the settings and commands highlighted. There is the question text, the data type for the result, the options, the variable to store the selected option, and the scope of the variable.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-05.png)

<cc-end-step lab="mcs2" exercise="2" step="2" />

### Step 3: ユーザー へのフィードバックを提供する

次に、画面中央の **+** ボタンを選択して **Add a condition** を追加します。左側のブランチで **Select a variable** を選択し、前ステップで作成した **userRole** 変数を選択します。その後、条件値を選択して `userRole is equal to Candidate` のように設定します。
同様の手順を 2 回繰り返し、`userRole is equal to Employee` と `userRole is equal to HR staff member` の条件を作成します。最後に `All other conditions` 用の条件を残します。

各ブランチ内で、 ユーザー へ専門的なフィードバックを提供する独自ロジックを指定できます。各 **Condition** ブランチの下で **+** コマンドを選択し、**Send a message** アクションを追加します。必要に応じて各ブランチに複数のアクションを追加可能です。

各ブランチにはたとえば次のフィードバック メッセージを設定できます。

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

`All other conditions` ブランチでは、**Topic management** グループの **Redirect** アクションを構成し、System トピック **Fallback** にフォールバックします。

![The condition branches with messages sent to the user for each option and a redirection to the **Fallback** topic in case the user did not provide any of the supported options.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-06.png)

このシンプルなトピック ロジックはこれで準備完了です。

<cc-end-step lab="mcs2" exercise="2" step="3" />

### Step 4: 現在のトピックを終了する

カスタム トピックのフローを正しく完了するため、**Topic management** グループの **End current topic** アクションを追加します。このアクションにより、トピックの会話が完了したことを Copilot Studio に通知します。

![The **End current topic** action inserted in the current topic flow.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-07.png)

<cc-end-step lab="mcs2" exercise="2" step="4" />

### Step 5: 現在のトピックをテストする

これでトピックを保存してテストする準備が整いました。デザイナー右上の **Save** ボタンを選択し、表示されるダイアログでトピック名を入力して **Save** を選択します。

![The dialog window to assign a name to the topic and to save it.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-08.png)

例として、トピック名を `Collect user's role` とします。次にデザイナー右上の **Test** コマンドを選択してテスト パネルを開き、次のプロンプトを入力します。

```txt
What's your feedback for my role?
```

エージェント はロールを選択するよう促し、選択に応じたフィードバックを返します（下図参照）。

![The agent in action in the test panel inside Microsoft Copilot Studio.](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-09.png)

演習 2 が完了しました。次の演習 3 ではマルチターン トピックを作成します。

<cc-end-step lab="mcs2" exercise="2" step="5" />

## 演習 3 : マルチターン トピックの作成

単純な対話では、1 つの質問と 1 つの回答だけのシングルターン会話を作成します。しかし、より本格的なトピックでは、 ユーザー と エージェント の間で複数回のやり取りを行うマルチターン会話が必要です。この演習では、新しい候補者に関するデータを収集するマルチターン トピックを作成します。

### Step 1: 新しいマルチターン トピックの作成

新しい候補者について、次の情報を収集するトピックを作成するとします。

- First name
- Last name
- E-mail
- Current role

これらの情報を収集するため、演習 2 の Step 1 で説明した手順に従って新しいトピックを作成します。
トピックの **Trigger** 説明は次のようにします。

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

上記の各フィールドごとに、**Ask a question** アクションで ユーザー に入力を求める必要があります。ただし、この演習では回答の種類がフィールドによって異なります。たとえば first name、last name、current role は単純なテキスト フィールドですが、e-mail フィールドは有効な e-mail である必要があります。

first name、last name、current role では **Ask a question** アクションの **Identify** プロパティで **User's entire response** を選択し、 ユーザー が入力したテキストをそのまま取得します。変数型は Copilot Studio により自動的に `string` となります。各変数にわかりやすい名前を付けてください。
次のスクリーンショットは first name 入力アクションの例です。last name と current job role も同様に設定します。

![The **Ask a question** action configured to collect the candidate's first name and store it into a variable of type string, accepting any value provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-01.png)

e-mail フィールドでは **Identify** プロパティで **Email** エンティティを選択し、Copilot Studio が入力を e-mail の検証規則で自動判定するようにします。変数は同じく `string` です。

![The **Ask a question** action configured to collect the candidate's e-mail accepting only values of type email provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-02.png)

これで候補者のすべての情報が収集できるようになり、 ユーザー へフィードバックを提供できます。

<cc-end-step lab="mcs2" exercise="3" step="1" />

### Step 2: ユーザー へのフィードバックを提供する

収集した入力を基に、 ユーザー へデータを確認するメッセージを送ります。**Send a message** アクションを追加し、収集した値を格納した変数を使用してメッセージ内容を構築します。
メッセージに変数を追加するには、**Send a message** アクションのツールバーにある **{x}** コマンドを選択し、目的の変数を選択します。

![The action **Send a message** with the insert variable command highlighted and the list of variables available in the current topic.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-03.png)

現在のトピックで定義された変数、システム変数、環境変数を挿入できます。
すべての変数を含む確認メッセージを設定すると、下図のようになります。

![The action **Send a message** with all the referenced variables.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-04.png)

最終確認のために **Ask a question** アクションを挿入し、次のメッセージを入力します。

```txt
Is it ok for you to insert this new candidate?
```

回答として `Yes` と `No` をサポートするよう設定します。演習 2 の Step 3 と同様に、各結果用のブランチを構成します。ここでは簡単のため、各ブランチに **Send a message** アクションを 1 つずつ設定し、 ユーザー のフィードバックに応じてサムズアップまたはサムズダウンの絵文字をメッセージ内容とします。最後に **End current topic** アクションを追加してトピックを終了します。

![The final part of the topic with the last **Ask a question** action, three branches to manage the user's input and one final action to **End current topic**.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-05.png)

トピックを保存し、例えば `Register a new candidate` という名前を付け、組み込みテスト インターフェースでテストします。
以下はマルチターン トピックとの対話例のスクリーンショットです。e-mail フィールドに正しくない値を入力すると、Copilot Studio が自動的に再入力を促すことも確認できます。

![The interaction with the multi-turn topic, where there are a set of questions and answers to collect all the candidate data.](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-06.png)


<cc-end-step lab="mcs2" exercise="3" step="2" />

## 演習 4 : Adaptive Card の使用

複数の **Ask a question** アクションで入力を収集する方法もありますが、多くのデータを収集する場合や ユーザー とのやり取りをより魅力的にしたい場合は Adaptive Card の利用を検討してください。

<details open>
<summary>Adaptive Card とは？</summary>

Adaptive Card は JSON で記述されたプラットフォーム非依存の UI スニペットで、アプリやサービス間で交換できます。アプリに配信されると、JSON はネイティブ UI に変換され、環境に自動適応します。これにより、主要なプラットフォームやフレームワーク全体で軽量 UI を設計・統合できます。
    <div class="video">
      <iframe src="//www.youtube.com/embed/pYe2NqKhJoM" frameborder="0" allowfullscreen></iframe>
      <div>Adaptive Card はあらゆる場所で活用されています</div>
    </div>
</details>

### Step 1: Adaptive Card で入力を収集する

次の情報を収集する新しいトピックを作成するとします。

- First name
- Last name
- E-mail
- Current role
- Spoken languages
- Skills

特に、Spoken languages と Skills は複数選択のリストです。

**Topics** タブを開き、演習 3 で作成したトピックを無効化してトリガー条件の重複を防いでから、新しいトピックを作成します（演習 2 の Step 1 を参照）。トリガーの **Trigger** 説明は次のようにします。

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

次に **Ask with adaptive card** アクションを追加し、1️⃣ アクション本体を選択して 2️⃣ **Edit adaptive card** ボタンを選択します。**Adaptive card designer** の **Card payload editor** に次の JSON を入力します。

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

JSON を更新すると、Copilot Studio がトピック デザイナーの UI に Adaptive Card のプレビューを表示します。また、 ユーザー が入力した値を収集するトピックレベルの変数も自動的に定義されます。

![The interface of the topic when adding an **Ask with adaptive card** action, with the side panel open and a proper JSON of the adaptive card defined. On the designer there is a preview of the actual adaptive card and a list of output arguments to collect the values provided by the user.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-02.png)

<cc-end-step lab="mcs2" exercise="4" step="1" />

### Step 2: Adaptive Card でフィードバックを提供する

Adaptive Card を使用して ユーザー に収集データの概要を表示することもできます。**Send a message** アクションを追加し、左上の **+ Add** を選択して **Adaptive card** を選び、メッセージを Adaptive Card に切り替えます。

![The command box to add an adaptive card as the message to send with the **Send a message** action.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-03.png)

サイド パネルが表示されるので **Edit adaptive card** を選択し、**Adaptive card designer** の **Card payload editor** に次の JSON を貼り付けます。

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

JSON を貼り付ける際、テキスト エリア上部の **Edit JSON** オプションが選択されていることを確認してください（既定値）。フォーカスを外すと **Send a message** アクションが Adaptive Card のプレビューを開始します。現状ではすべての変数 (firstname など) が静的値として表示されます。

![The **Send a message** action configured to render an adaptive card. In the side panel on the right side there is the JSON of the adaptive card. In the body of the action there is a preview of the adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-04.png)

次に **JSON Card** のドロップダウンを **Formula Card** に切り替え、静的値をトピックレベルの実際の変数に置き換えます。

![The **Send a message** action configured to render an adaptive card. In the side panel on the right side there is the JSON of the adaptive card. In the body of the action there is a preview of the adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-05.png)

エディターを展開するボタンを選び、静的値を変数参照に置き換えます。

![The side panel of the **Send a message** action while editing the adaptive card JSON in **Formula card** mode. There is a button to expand the editor.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-06.png)

ダイアログが表示され、IntelliSense 付きの高度なエディターで変数や Power Fx 関数を参照できます（下図）。

![The adaptive card editor with intellisense to reference variables and PowerFx functions.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-07.png)

静的値をすべて変数に置き換えます。特に Spoken languages と Skills は値のリスト (`Table` 型変数) なので、Power Fx の `Concat` 関数と `Text` 関数を使用して文字列に変換します。すべての式を適用した Adaptive Card JSON は以下のとおりです。

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
    Power Fx 関数の詳細は [Create expressions using Power Fx](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-power-fx){target=_blank} を参照してください。

<cc-end-step lab="mcs2" exercise="4" step="2" />

### Step 3: 現在のトピックをテストする

トピックの最後に **End current topic** アクションを追加し、保存して `Register new candidate with adaptive cards` などの名前を付け、デザイナー右側のテスト パネルで実行します。以下のスクリーンショットは ユーザー との対話例です。

![The topic collecting information about a new candidate using an adaptive card and providing feedback through another adaptive card.](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-08.png)

これでトピックは完成し、完全に動作します。次回以降のラボでは、外部 HR サービスにデータを保存して実際に新しい候補者レコードを作成する方法を学びます。

<cc-end-step lab="mcs2" exercise="4" step="3" />

---8<--- "ja/mcs-congratulations.md"

これで エージェント は複数のトピックを通じて多様な会話パスをサポートできるようになりました。次のラボではカスタム アクションの扱い方を学びます。

<a href="../03-actions">こちら</a> からラボ MCS3 を開始し、Copilot Studio で エージェント にアクションを定義しましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/02-topics--ja" />