---
search:
  exclude: true
---
# ラボ MCS2 - トピックの定義

このラボでは、 Microsoft Copilot Studio でカスタム トピックを作成する方法を学習します。トピックはエージェントの主要な構成要素です。トピックを使用すると、エージェントがエンド ユーザーに対してシングルターンまたはマルチターンの会話体験を提供できます。トピックは、ユーザーとエージェント間の会話が個別の対話パスを通じてどのように進行するかを定義します。

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
    このラボは前回の [Lab MCS1](../01-first-agent){target=_blank} を基盤としています。同じエージェントを継続して作業し、新しい機能で強化してください。

トピックはグラフィカル デザイナーを使用するか、自然言語で意図を記述して作成できます。トピックを作成した後、詳細な微調整が必要な場合は、低レベルのコード エディターで定義を編集することも可能です。

トピックには 2 種類あります。

- システム トピック: Microsoft Copilot Studio によって自動生成されます。無効化は可能ですが削除はできません。
- カスタム トピック: エージェント作成者が独自の対話パスを提供するために作成します。

!!! note "トピックに関する追加情報"
    Microsoft Copilot Studio で作成したエージェントのトピックに関しては、[こちらの記事](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topics-overview){target=_blank} を参照してください。システム トピックについては [Use system topics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-system-topics){target=_blank} をご覧ください。

このラボで学習する内容:

- ジェネレーティブ AI に基づくオーケストレーションの利用方法
- シングルターン トピックの作成方法
- マルチターン トピックの作成方法
- Adaptive Card を使用したユーザーとの対話方法

## 演習 1 : Generative AI に基づくオーケストレーション

最初の演習では、 [Lab MCS1](../01-first-agent){target=_blank} で作成したエージェントに対して、プレビュー段階の新機能である Generative AI に基づくオーケストレーションを有効化します。

### 手順 1: ジェネレーティブ オーケストレーションの有効化

Copilot Studio で作成したエージェントの重要な機能の 1 つがジェネレーティブ オーケストレーションです。これにより、エージェントはユーザーとの対話やイベント トリガーへの応答時に、最適なナレッジ ベース、トピック、アクションを選択できます。 

既定ではエージェントはクラシック オーケストレーションを使用します。この場合、エージェントはユーザーの入力と最も一致するトリガー フレーズを持つトピックを起動して応答します。ジェネレーティブ オーケストレーションでは、 Copilot Studio がユーザーの自然言語プロンプトを解析し、起動すべき最適な要素を判断します。 

!!! pied-piper "注意事項"
    ジェネレーティブ オーケストレーションを有効にすると、課金方法に影響する可能性があります。詳細は [生成モードの課金](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-billed-sessions){target=_blank} をご確認ください。クラシック オーケストレーションとの相違点として、ナレッジ検索の方法やサポートされるデータ ソースがあります。既存のエージェントで生成モードを有効にする前に、[既知の制限事項](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions#known-limitations-for-generative-orchestration){target=_blank} を必ずお読みください。

ジェネレーティブ オーケストレーションを有効にするには、ブラウザーを開き、対象の Microsoft 365 テナントの職場アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、 Microsoft Copilot Studio を起動します。

1️⃣ **Agents** の一覧を表示して 2️⃣ 前回の Lab MCS1 で作成したエージェントを編集します。

![Microsoft Copilot Studio のエージェント一覧で、編集するエージェントを選択している画面](../../../assets/images/make/copilot-studio-02/edit-agent-01.png)

**Overview** タブで **Orchestration** トグルを有効化します。

![ジェネレーティブ オーケストレーションを有効化した状態を示す Microsoft Copilot Studio の画面](../../../assets/images/make/copilot-studio-02/generative-orchestration-01.png)

有効化には多少時間がかかります。設定が適用されたら、エージェントを発行して変更を確定してください。

<cc-end-step lab="mcs2" exercise="1" step="1" />

## 演習 2 : シングルターン トピックの作成

この演習では、ユーザーから入力を取得し、その入力に基づいてフィードバックを返す新しいトピックを作成します。具体的には、ユーザーの現在の役割を収集し、役割に応じたガイダンスを提供します。

### 手順 1: 新しいシングルターン トピックの作成

画面上部の 1️⃣ **Topics** タブを選択し、2️⃣ **+ Add a topic** を選択して 3️⃣ **From blank** をクリックして新しいカスタム トピックを作成します。

!!! info "Copilot でトピックを作成"
    自然言語で説明を入力して Copilot にトピックを下書きさせることも可能です。

![Microsoft Copilot Studio で新しいトピックを作成する画面](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-01.png)

Copilot Studio はトピックを定義するグラフィカル デザイナーを表示します。トピックの最初のブロックは **Trigger** アクションで、トピックの目的を説明します。ジェネレーティブ オーケストレーションが有効な場合、このアクションには自然言語でトピックの目的を記述するテキスト エリアがあります。ラボの手順に従い、次の内容を入力してください。

```txt
This topic can handle queries like these: collect user's role and provide feedback, 
give me a feedback based on my role, what's your feedback for my role?
```

クラシック オーケストレーションを使用している場合は、1 つの説明文の代わりに 5〜10 個のトリガー フレーズや文を指定します。

![新しいトピックを設計している Microsoft Copilot Studio の画面](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-02.png)

<cc-end-step lab="mcs2" exercise="2" step="1" />

### 手順 2: ユーザー入力の取得

画面中央の **+** ボタンを選択して、トピックに新しいアクションまたはステップを追加します。**+** ボタンを選択すると、利用可能なアクションの一覧が表示されます。主なオプションは次のとおりです。

- Send a message: ユーザーにメッセージを送信します (テキスト、画像、ビデオ、Adaptive Card など)。
- Ask a question: ユーザーに入力を求めます (テキスト、画像、ビデオ、添付ファイル、Adaptive Card など)。
- Ask with adaptive card: Adaptive Card を使用してユーザーから情報を収集します。
- Add a condition: 変数や定数の比較に基づく分岐を追加します。
- Variable management: トピック レベル、グローバル、システム、環境スコープの変数を管理します。
- Topic management: 現在のトピックのライフ サイクルを管理します。
- Add an action: Power Automate フロー、カスタム コネクタ、マルチエージェント シナリオでの他のエージェントなど外部アクションを呼び出します。
- Advanced: 外部 HTTP REST API の呼び出し、生成回答の利用、イベントやアクティビティの送信などの高度な機能を提供します。

![利用可能なアクションを示すメニュー](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-03.png)

ユーザー入力を取得するため、**Ask a question** アクションを追加します。ユーザーに役割を尋ねるため、質問テキストに次を入力します。

```txt
What is your role?
```

既定では Copilot Studio は収集した入力に `Multiple choice options` のデータ型を割り当てます。**Identify** 設定フィールドの下にある **+ New option** を選択し、次の 3 つの値を追加します。

- Candidate
- Employee
- HR staff member

このアクションは、ユーザーが選択した値をトピック レベルの変数に自動的に保存します。アクション右上の 3 点リーダーを選択して **Properties** を開くか、アクション下部の変数をクリックすると、名前や設定を変更できます。

![アクションのコンテキスト メニュー](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-04.png)

たとえば、変数名を `UserRole` に変更できます。設定完了後のアクションは次のようになります。

![設定が完了した **Ask a question** アクション](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-05.png)

<cc-end-step lab="mcs2" exercise="2" step="2" />

### 手順 3: ユーザーへのフィードバック

次に **+** ボタンを選択し、**Add a condition** を追加します。左側のブランチで **Select a variable** を選択し、前手順で作成した **userRole** 変数を指定します。条件値には `userRole is equal to Candidate` を設定します。
同様の手順を 2 回繰り返し、`userRole is equal to Employee` と `userRole is equal to HR staff member` の条件を追加します。最後に `All other conditions` 用のブランチを残します。

各ブランチ内で、ユーザーに特化したフィードバックを提供するロジックを設定できます。各 **Condition** ブランチの下の **+** コマンドを選択し、**Send a message** アクションを追加します。必要に応じて複数追加しても構いません。

3 つのブランチには、例えば次のメッセージを設定できます。

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

`All other conditions` ブランチでは、**Topic management** 内の **Redirect** アクションを使用し、システム トピック **Fallback** へフォールバックさせます。

![条件分岐とメッセージ、および **Fallback** トピックへのリダイレクト](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-06.png)

シンプルなトピック ロジックが完成しました。

<cc-end-step lab="mcs2" exercise="2" step="3" />

### 手順 4: 現在のトピックを終了

カスタム トピックのフローを正しく完了させるため、**Topic management** グループから **End current topic** アクションを追加します。このアクションにより、トピックの会話が完了したことを Copilot Studio に通知します。

![**End current topic** アクション](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-07.png)

<cc-end-step lab="mcs2" exercise="2" step="4" />

### 手順 5: トピックのテスト

トピックを保存してテストする準備ができました。デザイナー右上の **Save** を選択し、表示されるダイアログでトピック名を入力して **Save** をクリックします。

![トピック名を入力して保存するダイアログ](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-08.png)

例として、トピック名を `Collect user's role` とします。次にデザイナー右上の **Test** を選択してテスト パネルを開き、次のプロンプトを入力します。

```txt
What's your feedback for my role?
```

エージェントが役割を尋ね、選択に応じたフィードバックを返します。

![テスト パネルで動作するエージェント](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-09.png)

演習 2 は完了です。次の演習 3 ではマルチターン トピックを作成します。

<cc-end-step lab="mcs2" exercise="2" step="5" />

## 演習 3 : マルチターン トピックの作成

簡単な対話では、質問 1 つと回答 1 つのシングルターン会話で済みます。しかし、より内容のあるトピックでは、ユーザーとエージェントの間で複数回のやり取りが必要です。この演習では、新しい役職候補者に関するデータを収集するマルチターン トピックを作成します。

### 手順 1: 新しいマルチターン トピックの作成

新しい候補者について次の情報を収集すると仮定します。

- First name
- Last name
- E-mail
- Current role

これらの情報を集めるため、演習 2 手順 1 と同様に新しいトピックを作成します。トピックの **Trigger** 説明は次のようにします。

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

各項目ごとに **Ask a question** アクションでユーザーに入力を促します。ただし、回答のデータ型は項目によって異なります。たとえば first name、last name、current role は単純なテキスト、e-mail は有効なメール形式が必要です。

first name、last name、current role については **Ask a question** アクションの **Identify** プロパティで **User's entire response** を選択します。これにより、ユーザーが入力したテキストがそのまま値として取得されます。変数型は自動的に `string` になります。各変数にはわかりやすい名前を付けてください。
以下のスクリーンショットは first name の入力アクションの例です。last name と current job role も同様に設定します。

![候補者の名前を収集する **Ask a question** アクション](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-01.png)

e-mail 項目では **Identify** プロパティのエンティティとして **Email** を選択し、 Copilot Studio がメール形式を自動検証します。変数型は `string` のままです。

![候補者のメール アドレスを収集する **Ask a question** アクション](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-02.png)

これで候補者に関するすべての情報を収集できるようになりました。次にユーザーへフィードバックを返します。

<cc-end-step lab="mcs2" exercise="3" step="1" />

### 手順 2: ユーザーへのフィードバック

収集した入力に基づき、確認メッセージを送信します。**Send a message** アクションを追加し、収集した値を格納した変数を使ってメッセージを構成します。
変数を挿入するには、**Send a message** アクションのツールバーにある **{x}** を選択し、目的の変数を選択します。

![変数挿入コマンドを示す **Send a message** アクション](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-03.png)

現在のトピックで定義した変数、システム変数、環境変数を挿入できます。
すべての変数を含む確認メッセージは次のようになります。

![変数が挿入された **Send a message** アクション](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-04.png)

最終確認として、**Ask a question** アクションを追加し、次のメッセージを設定します。

```txt
Is it ok for you to insert this new candidate?
```

回答として `Yes` と `No` をサポートするように設定します。演習 2 手順 3 と同様に、各結果に対してブランチを構成します。簡単にするため、**Send a message** アクションを 2 つ追加し、ユーザーのフィードバックに応じて👍または👎の絵文字を送信します。最後に **End current topic** アクションを追加してトピックを完了します。

![最終確認とトピック終了部分](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-05.png)

トピックを保存し、`Register a new candidate` などの名前を付け、統合テスト インターフェイスで試してください。次のスクリーンショットはマルチターン トピックとの対話例です。e-mail フィールドの値が無効な場合、 Copilot Studio が自動で再入力を促している点にも注目してください。

![候補者データを収集するマルチターン トピック](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-06.png)


<cc-end-step lab="mcs2" exercise="3" step="2" />

## 演習 4 : Adaptive Card の使用

複数の **Ask a question** アクションで入力を収集するのは 1 つの方法ですが、多くのデータを収集する場合や、より見栄えの良いユーザー体験を提供したい場合は Adaptive Card の使用を検討できます。

<details open>
<summary>Adaptive Card とは?</summary>

Adaptive Card は JSON で記述されたプラットフォーム非依存の UI スニペットで、アプリやサービス間でやり取りできます。アプリに配信されると、JSON はネイティブ UI に変換され、環境に自動適応します。これにより、主要プラットフォームやフレームワーク間で軽量 UI を設計・統合できます。
    <div class="video">
      <iframe src="//www.youtube.com/embed/pYe2NqKhJoM" frameborder="0" allowfullscreen></iframe>
      <div>Adaptive Card はあらゆる場所で活用されています</div>
    </div>
</details>

### 手順 1: Adaptive Card で入力を収集

次の情報を新しい候補者から収集するトピックを作成するとします。

- First name
- Last name
- E-mail
- Current role
- Spoken languages
- Skills

特に、spoken languages と skills は複数選択可能なリストです。

**Topics** タブを開き、演習 3 で作成したトピックを無効化してトリガー条件の競合を避けます。その後、演習 2 手順 1 と同様に新しいトピックを作成します。トピックの **Trigger** 説明は次のようにします。

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

次に **Ask with adaptive card** アクションを追加し、1️⃣ アクション本体を選択して 2️⃣ **Edit adaptive card** ボタンをクリックします。**Adaptive card designer** の **Card payload editor** に次の JSON を入力します。

![**Ask with adaptive card** アクションを追加した画面](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-01.png)

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

JSON を更新すると、 Copilot Studio はトピック デザイナーでカードのプレビューを表示し、ユーザー入力を取得するためのトピック レベル変数を自動生成します。

![JSON を定義した後のプレビュー](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-02.png)

<cc-end-step lab="mcs2" exercise="4" step="1" />

### 手順 2: Adaptive Card でフィードバックを提供

収集したデータのまとめをユーザーに表示するため、 Adaptive Card を使用します。**+** コマンドで **Send a message** アクションを追加し、左上の **+ Add** を選択して **Adaptive card** に切り替えます。

![Adaptive Card を追加するコマンド](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-03.png)

右側のパネルで **Edit adaptive card** を選択し、**Card payload editor** に次の JSON を貼り付けます。

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

JSON を貼り付ける際、テキスト エリア上部の **Edit JSON** (既定) が選択されていることを確認してください。フォーカスを外すと **Send a message** アクションにカードのプレビューが表示されます。現時点では firstname、lastname などは静的値です。

![プレビューが表示された **Send a message** アクション](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-04.png)

ドロップダウンで **Edit JSON** を **Edit Formula** に切り替え、静的値をトピック変数に置き換えます。

![**Edit Formula** モードへの切り替え](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-05.png)

エディターを展開し、静的値を順番に変数参照に置き換えます。

![エディターを展開した状態](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-06.png)

ダイアログが開き、インテリセンス付きの高度なエディターが表示されます。

![インテリセンスを備えたエディター](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-07.png)

静的値をすべて変数に置き換えます。spoken languages と skills は `Table` 型 (値のリスト) なので、 PowerFx の `Concat` と `Text` 関数を使って文字列に変換します。すべての式を適用した後の JSON は次のとおりです。

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
    PowerFx 関数の詳細は [Create expressions using Power Fx](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-power-fx){target=_blank} を参照してください。

<cc-end-step lab="mcs2" exercise="4" step="2" />

### 手順 3: トピックのテスト

トピックの末尾に **End current topic** アクションを追加し、保存して `Register new candidate with adaptive cards` などの名前を付けます。右側のテスト パネルで動作を確認してください。次のスクリーンショットはユーザーとの対話例です。

![Adaptive Card で情報を収集し、フィードバックを提供するトピック](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-08.png)

これでトピックは準備完了です。今後のラボでは、外部 HR サービスにデータを保存して実際の候補者レコードを作成する方法を学習します。

<cc-end-step lab="mcs2" exercise="4" step="3" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントは複数のトピックによる多様な会話パスをサポートできるようになりました。次のラボでは、カスタム Action の扱い方を学習します。

<a href="../03-actions">こちら</a> から Lab MCS3 を開始し、 Copilot Studio でエージェントの Action を定義しましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/02-topics" />