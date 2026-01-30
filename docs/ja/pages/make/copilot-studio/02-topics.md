---
search:
  exclude: true
---
# ラボ MCS2 - トピックの定義

このラボでは、Microsoft Copilot Studio でカスタム トピックを作成する方法を学習します。トピックは エージェント の主要な構成要素です。トピックを使用すると、エンド ユーザー に単一ターンまたはマルチターンの会話体験を提供できます。トピックは、ユーザー と エージェント との会話がどのように発展するかを、個別のインタラクション パスとして定義します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ZVHkBiH6RxQ" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を簡単に確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前の [ラボ MCS1](../01-first-agent){target=_blank} を基盤として進めます。同じ エージェント を引き続き使用し、新しい機能で強化していきます。

トピックは、グラフィカル デザイナーを使用するか、自然言語で意図を説明して作成できます。新しいトピックを作成した後、詳細な微調整が必要な場合は、低レベルのコード エディターで定義を編集することも可能です。

トピックには 2 種類あります。

- システム トピック: Microsoft Copilot Studio により自動生成されます。無効化はできますが削除はできません。
- カスタム トピック: エージェント 作者が独自のインタラクション パスを提供するために作成します。

!!! note "トピックに関する追加情報"
    Microsoft Copilot Studio で作成した エージェント のトピックについては、[こちらの記事](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topics-overview){target=_blank} をご覧ください。システム トピックの詳細は [Use system topics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-system-topics){target=_blank} を参照してください。

このラボでは、次の内容を学習します。

- 生成 AI に基づくオーケストレーションの活用方法
- シングルターン トピックの作成方法
- マルチターン トピックの作成方法
- Adaptive Card を使用した ユーザー との対話方法

## Exercise 1 : 生成 AI に基づくオーケストレーション

最初の演習では、[ラボ MCS1](../01-first-agent){target=_blank} で作成した エージェント で、プレビュー機能である生成 AI オーケストレーションを有効にします。

### Step 1: 生成 AI オーケストレーションの理解

Copilot Studio で作成した エージェント の重要な機能の 1 つが生成オーケストレーションです。生成オーケストレーションでは、エージェント が最適なナレッジ ベース、トピック、アクションを選択して ユーザー と対話し、質問に回答したり、イベント トリガーに応答したりします。

現在、Copilot Studio の エージェント は既定で生成 AI オーケストレーションを使用します。Copilot Studio は ユーザー から提供された自然言語のプロンプトを解析して意図を理解し、最適な項目をトリガーします。必要に応じて、クラシック オーケストレーションに戻すこともできます。クラシック オーケストレーションでは、エージェント はユーザーのクエリに最も一致するトリガー フレーズを持つトピックを起動して応答します。

Copilot Studio では **Deep reasoning**（プレビュー機能）も有効にでき、AI アクションの高度な推論を実現できます。

オーケストレーションと Deep reasoning を構成するには、ブラウザーを開き、対象 Microsoft 365 テナントの業務アカウントで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスして Microsoft Copilot Studio を開始します。

1️⃣ **Agents** の一覧を表示し、2️⃣ 前回のラボ MCS1 で作成した エージェント を編集します。

![Microsoft Copilot Studio のエージェント一覧で、編集するアイテムを選択する画面](../../../assets/images/make/copilot-studio-02/edit-agent-01.png)

以下のスクリーンショットのように、画面右上の **Settings** コマンドを選択します。

![Microsoft Copilot Studio のインターフェースで "Settings" コマンドが強調表示されている](../../../assets/images/make/copilot-studio-02/edit-settings-01.png)

設定の最初のセクションが **Orchestration** で、ここから **generative AI orchestration** と **classic orchestration** を切り替えたり、**Deep reasoning** を有効化したりできます。設定の反映には少し時間がかかります。設定が適用されたらウィンドウを閉じ、エージェント を発行して変更を確定します。

![Microsoft Copilot Studio のインターフェースで "Settings" コマンドが強調表示されている](../../../assets/images/make/copilot-studio-02/generative-orchestration-01.png)

このラボでは **generative AI orchestration** を使用し、**Deep reasoning** は有効にしません。

<cc-end-step lab="mcs2" exercise="1" step="1" />

## Exercise 2 : シングルターン トピックの作成

この演習では、ユーザー から入力を取得し、その入力に基づいてフィードバックを返す新しいトピックを作成します。具体的には、現在の ユーザー の役割を収集し、入力された役割に基づいて エージェント の利用方法を案内します。

### Step 1: 新しいシングルターン トピックの作成

トピックを作成するには、画面上部の 1️⃣ **Topics** タブを選択し、2️⃣ **+ Add a topic** を選んでから 3️⃣ **From blank** をクリックして新しいカスタム トピックの作成を開始します。

!!! info "Copilot でトピックを作成"
    自然言語で説明を入力するだけで、新しいトピックを Copilot に下書きさせることも可能です。

![Microsoft Copilot Studio でトピックを作成する画面。**Topics** タブ、**+ Add a topic** ドロップダウン、**From blank** が強調表示](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-01.png)

Copilot Studio はトピックを定義するグラフィカル デザイナーを表示します。トピックの最初のビルディング ブロックは **Trigger** アクションで、トピックが何を行うかを記述します。生成オーケストレーションが有効な場合、このアクションにはトピックの目的を自然言語で定義できるテキスト エリアがあります。このラボでは、次の内容を入力してください。

```txt
This topic can handle queries like these: collect user's role and provide feedback, 
give me a feedback based on my role, what's your feedback for my role?
```

クラシック オーケストレーションを使用する場合は、単一の説明テキストの代わりに、5 ～ 10 個のトリガー フレーズまたは文を指定します。

![Microsoft Copilot Studio で新規トピックを設計する画面。**Trigger** アクションがあり、本演習で提案された値がトリガー条件として設定されている。新しいアクションを追加するボタンが強調表示](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-02.png)

<cc-end-step lab="mcs2" exercise="2" step="1" />

### Step 2: ユーザー入力の取得

画面中央の **+** ボタンを選択して、現在のトピックに新しいアクションまたはステップを追加します。**+** ボタンを選択すると、利用可能なアクションの一覧が表示されます。主なオプションは次のとおりです。

- Send a message: ユーザー にメッセージを送信します。テキスト、画像、動画、Adaptive Card などが使用可能です。
- Ask a question: ユーザー に入力を求めます。テキスト、画像、動画、添付ファイル、Adaptive Card などを受け付けます。
- Ask with adaptive card: Adaptive Card を使用して ユーザー から内容を収集します。
- Add a condition: 変数と定数の比較に基づいてブランチを追加します。
- Variable management: 変数を管理します。スコープはトピック レベル、グローバル、システム、環境のいずれかです。
- Topic management: 現在のトピックのライフサイクルを管理します。
- Add an tool: Power Automate フロー、カスタム コネクタ、MCP ツールなどの外部ツールを利用します。
- Add an agent: マルチ エージェント シナリオで エージェント を追加します。
- Advanced: 外部 HTTP REST API の呼び出し、生成回答の使用、イベントやアクティビティの送信など、高度な機能を提供します。

![トピックに追加できるアクションを選択するメニュー。](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-03.png)

ユーザー入力を収集するために **Ask a question** アクションを追加します。ユーザー に役割を尋ねるため、質問テキストには次の値を入力します。

```txt
What is your role?
```

既定では、Copilot Studio は収集した入力に `Multiple choice options` データ型を割り当てます。これは **Identify** 設定フィールドで確認できます。
**Identify** の下にある **+ New option** コマンドを選択し、次の 3 つの値を順に追加します。

- Candidate
- Employee
- HR staff member

このアクションは ユーザー が選択した値をトピック レベルの変数に自動的に保存します。アクション右上の三点リーダーから **Properties** を選択してアクションをカスタマイズしたり、アクション下部の変数を選択して名前などの設定を変更したりできます。

![アクションのコンテキスト メニュー。](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-04.png)

たとえば、変数名を `UserRole` に変更できます。完全に設定すると、アクションは次のようになります。

![設定完了したアクション。](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-05.png)

<cc-end-step lab="mcs2" exercise="2" step="2" />

### Step 3: ユーザー へのフィードバック

次に、画面中央の **+** ボタンを選択して **Add a condition** を追加します。左側のブランチで **Select a variable** を選択し、前のステップで作成した **userRole** 変数を選びます。その後、条件値を選択して `userRole is equal to Candidate` のような条件を設定します。
同様に、`userRole is equal to Employee` と `userRole is equal to HR staff member` の条件を 2 回追加します。最後のブランチは `All other conditions` とします。

各ブランチ内で、ユーザー に特化したフィードバックを提供するロジックを定義できます。各 **Condition** ブランチの下部にある **+** コマンドを選択し、**Send a message** アクションを追加します。必要に応じて複数アクションを追加できます。

3 つのブランチには、たとえば次のようなフィードバック メッセージを設定できます。

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

`All other conditions` ブランチでは、**Topic management** グループにある **Redirect** アクションを構成し、システム トピック **Fallback** へフォールバックさせます。

![条件分岐の設定例。](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-06.png)

これでシンプルなロジックが完成しました。

<cc-end-step lab="mcs2" exercise="2" step="3" />

### Step 4: 現在のトピックを終了する

カスタム トピックのフローを適切に完了するため、**Topic management** グループにある **End current topic** アクションを追加します。この最後のアクションは、トピックの会話が完了したことを Copilot Studio に通知します。

![**End current topic** アクションを追加](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-07.png)

<cc-end-step lab="mcs2" exercise="2" step="4" />

### Step 5: トピックのテスト

トピックを保存してテストできる状態になりました。デザイナー右上の **Save** ボタンを選択し、表示されるダイアログでトピック名を入力して **Save** をもう一度選びます。

![トピック名を入力して保存するダイアログ](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-08.png)

例として、トピック名を `Collect user's role` とします。次にデザイナー右上の **Test** コマンドを選択してテスト パネルを開き、次のプロンプトを入力します。

```txt
What's your feedback for my role?
```

エージェント は役割の選択を求め、選択内容に応じて特定のフィードバックを返します。

![テスト パネルでのエージェントの挙動](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-09.png)

Exercise 2 は完了です。次は Exercise 3 でマルチターン トピックを作成しましょう。

<cc-end-step lab="mcs2" exercise="2" step="5" />

## Exercise 3 : マルチターン トピックの作成

単純な対話では 1 つの質問と 1 つの回答だけのシングルターン会話を作成します。しかし、より内容のあるトピックには ユーザー と エージェント の複数回のやり取りが必要です。この演習では、新しい役割候補者のデータを収集するマルチターン トピックを作成します。

### Step 1: 新しいマルチターン トピックの作成

新しい候補者について次の情報を収集するとします。

- First name
- Last name
- E-mail
- Current role

これらの情報を収集するため、Exercise 2 Step 1 に従って新しいトピックを作成します。
トピックの **Trigger** 説明は次のようにします。

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

上記の各情報フィールドごとに **Ask a question** アクションで ユーザー に入力を求めます。ただし、回答の型はフィールドによって異なります。たとえば first name、last name、current role は単純なテキスト フィールドですが、e-mail は有効なメール形式である必要があります。

first name、last name、current role の各フィールドでは、**Ask a question** アクションの **Identify** プロパティで **User's entire response** を選択します。これにより ユーザー が入力したテキストがそのまま値として取得されます。Copilot Studio は変数型を自動的に `string` に設定します。各変数にわかりやすい名前を付けてください。
次のスクリーンショットは first name の入力アクションの例です。同様に last name と current job role も設定します。

![候補者の first name を収集する Ask a question アクション](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-01.png)

e-mail フィールドでは **Identify** プロパティで **Email** エンティティを選択し、Copilot Studio が入力値をメール形式で自動検証するようにします。変数型は `string` のままです。

![e-mail を収集する Ask a question アクション](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-02.png)

これで候補者情報の収集準備が整い、ユーザー にフィードバックを提供できます。

<cc-end-step lab="mcs2" exercise="3" step="1" />

### Step 2: ユーザー へのフィードバック

収集した入力に基づき、ユーザー にデータを確認するメッセージを送ります。**Send a message** アクションを追加し、入力値が保存された変数を使用してメッセージ内容を構成します。
メッセージに変数を挿入するには、**Send a message** アクションのツールバーにある **{x}** コマンドを選択し、目的の変数を選びます。

![変数挿入コマンドと変数一覧](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-03.png)

現在のトピックで定義された変数、システム変数、環境変数を挿入できます。
変数を含めた確認メッセージを設定すると、次のようになります。

![変数を参照する Send a message アクション](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-04.png)

最終確認のため、**Ask a question** アクションを挿入し、次のメッセージを入力します。

```txt
Is it ok for you to insert this new candidate?
```

回答として `Yes` と `No` を設定します。Exercise 2 Step 3 と同様に、各結果用のブランチを構成します。ここでは簡単のため、各ブランチに **Send a message** アクションを 1 つずつ配置し、ユーザー のフィードバックに応じて 👍 または 👎 の絵文字を送信します。最後に **End current topic** アクションを追加してトピックを完了します。

![最後の Ask a question とブランチ](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-05.png)

トピックを保存し、たとえば `Register a new candidate` という名前を付けて、統合テスト インターフェースでテストします。
以下のスクリーンショットはマルチターン トピックとの対話例です。e-mail フィールドに不正な値を入力すると、Copilot Studio が自動で再入力を促す様子も確認できます。

![マルチターン トピックとの対話](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-06.png)


<cc-end-step lab="mcs2" exercise="3" step="2" />

## Exercise 4 : Adaptive Card の使用

複数の **Ask a question** アクションで入力を収集するのは 1 つの方法です。しかし、多くのデータを集めたい場合や、見栄えの良い対話を実現したい場合は Adaptive Card の使用を検討できます。

<details open>
<summary>Adaptive Card とは？</summary>

Adaptive Card は JSON で記述されたプラットフォーム非依存の UI スニペットで、アプリやサービス間でやり取りできます。アプリに配信されると、JSON がネイティブ UI に変換され、環境に合わせて自動で適応します。これにより、主要なプラットフォームやフレームワークで軽量な UI の設計と統合が可能になります。
    <div class="video">
      <iframe src="//www.youtube.com/embed/pYe2NqKhJoM" frameborder="0" allowfullscreen></iframe>
      <div>Adaptive cards are everywhere</div>
    </div>
</details>

### Step 1: Adaptive Card での入力収集

次の情報を収集する新しいトピックを作成するとします。

- First name
- Last name
- E-mail
- Current role
- Spoken languages
- Skills

ここで、spoken languages と skills は複数選択可能な値のリストです。

まず **Topics** タブを開き、Exercise 3 で作成したトピックを無効化してトリガー条件の競合を避けます。次に Exercise 2 Step 1 の手順に従って新しいトピックを作成します。トピックの **Trigger** 説明は次のようにします。

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

続いて **Ask with adaptive card** アクションを追加し、1️⃣ アクションの本体を選択して 2️⃣ **Edit adaptive card** ボタンを押します。**Adaptive card designer** の **Card payload editor** に次の JSON を入力します。

![Ask with adaptive card アクションの追加](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-01.png)

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

JSON を更新すると、Copilot Studio はトピック デザイナー内でカードのプレビューをレンダリングします。また、ユーザー が入力した値を収集するトピック レベルの変数が自動生成されます。

![Adaptive Card プレビューと出力変数](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-02.png)

<cc-end-step lab="mcs2" exercise="4" step="1" />

### Step 2: Adaptive Card でのフィードバック

Adaptive Card を使って、収集したデータの要約を ユーザー に提示することもできます。**Send a message** アクションを追加し、左上の **+ Add** を選択して **Adaptive card** を選び、メッセージ種別を Adaptive Card に切り替えます。

![Adaptive card をメッセージとして追加するコマンド](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-03.png)

右側のパネルで **Edit adaptive card** を選択し、次の JSON を **Card payload editor** にコピーします。

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

JSON を貼り付ける際は、テキスト エリア上部の **Edit JSON** オプションが選択されていることを確認してください（既定で選択されています）。フォーカスを外すと、**Send a message** アクションに Adaptive Card のプレビューが表示され、すべての変数が固定値でレンダリングされます。

![静的値の Adaptive Card プレビュー](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-04.png)

次にドロップダウンで **JSON Card** から **Formula Card** に切り替え、静的値を現在のトピックで定義した実際の変数に置き換えます。

![Formula Card への切り替え](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-05.png)

エディターを展開し、変数や PowerFx 関数を参照しながら静的値を順に置き換えます。

![Formula Card エディターの拡張](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-06.png)

ポップアップの高度なエディターにはインテリセンスがあり、変数や PowerFx 関数を参照できます。

![高度なエディターのインテリセンス](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-07.png)

静的値をすべて変数に置き換える際、spoken languages と skills は `Table` 型の変数なので、PowerFx の `Concat` 関数と `Text` 関数を使用して文字列に変換します。すべての式を設定した後の JSON は次のとおりです。

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

トピックの末尾に **End current topic** アクションを追加し、トピックを保存して `Register new candidate with adaptive cards` などの名前を付け、デザイナー右側のテスト パネルで実行します。次のスクリーンショットは ユーザー との対話例です。

![Adaptive Card による情報収集とフィードバック](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-08.png)

これでトピックは完全に機能します。次のラボでは、外部 HR サービスにデータを保存して実際に候補者レコードを作成する方法を学びます。

<cc-end-step lab="mcs2" exercise="4" step="3" />

---8<--- "ja/mcs-congratulations.md"

これで、エージェント は複数のトピックを通じてさまざまな会話パスをサポートできるようになりました。次のラボでは、カスタム アクションの扱い方を学びます。

<a href="../03-actions">こちら</a> からラボ MCS3 を開始し、Copilot Studio で エージェント にアクションを定義しましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/02-topics--ja" />