---
search:
  exclude: true
---
# ラボ MCS2 – トピック定義

このラボでは、Microsoft Copilot Studio においてカスタム トピックを作成する方法を学びます。トピックはエージェントの基本構成要素です。トピックを使用することで、ユーザーに対して １ターン または 複数ターン の会話体験を提供できます。トピックは、ユーザー と エージェント間の会話が、明確な相互作用パスを通してどのように発展するかを定義します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ZVHkBiH6RxQ" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を確認してください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前のラボ [Lab MCS1](../01-first-agent){target=_blank} を基にしています。同じエージェントで作業を継続し、新たな機能で機能性を向上させることができます。

トピックは、グラフィカル デザイナーを使用するか、自然言語で意図を記述することで作成できます。新しいトピックを作成した後、詳細な微調整が必要な場合には、ロー レベルのコード エディターで定義を編集することも可能です。

トピックには、２種類のタイプがあります：

- システム トピック： Microsoft Copilot Studio によって自動定義されます。無効化することはできますが、削除することはできません。
- カスタム トピック： エージェント作成者によって、カスタムな相互作用パスを提供するために作成されます。

!!! note "トピックに関する追加情報"
    Microsoft Copilot Studio で作成されたエージェントのトピックに関する追加情報は、[次の記事](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/topics-overview){target=_blank} を参照してください。また、システム トピックの詳細については、[Use system topics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-system-topics){target=_blank} をご覧ください。

このラボでは、以下の内容を学びます：

- 生成 AI に基づく オーケストレーション の利用方法
- シングルターン トピック の作成方法
- マルチターン トピック の作成方法
- adaptive cards を使用してユーザーと対話する方法

## 演習 1 : 生成 AI に基づくオーケストレーション

この最初の演習では、[Lab MCS1](../01-first-agent){target=_blank} で作成したエージェントに、現在プレビュー中の新機能である生成 AI に基づくオーケストレーション を使用させる方法を有効にします。

### ステップ 1 : 生成 AI に基づくオーケストレーション の有効化

Copilot Studio で作成されたエージェントの重要な機能の一つが生成 AI に基づくオーケストレーション です。生成 AI に基づくオーケストレーション を用いることで、エージェントはユーザーとの対話やクエリへの回答、またはイベント トリガーへの応答のために、最適なナレッジ ベース、トピック、アクションを選択することができます。

デフォルトでは、エージェントはクラシック オーケストレーション を使用しており、これはユーザーのクエリに最も近いトリガーフレーズに一致するトピックをトリガーすることで応答することを意味します。生成 AI に基づくオーケストレーション を使用すると、Copilot Studio はユーザーが自然言語で提供したプロンプトを処理し、ユーザーの意図を理解して最適なアイテムをトリガーします。

!!! pied-piper "注意事項"
    生成 AI に基づくオーケストレーション の有効化は、課金の計算方法に影響を与える可能性があります。[billing for generative mode](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-billed-sessions){target=_blank} で詳細をご確認ください。クラシック オーケストレーション と生成 AI に基づくオーケストレーション との間には、ナレッジの検索方法やサポートされるデータ ソースなど、主要な違いがあります。既存のエージェントに生成モードをオンにする前に、[既知の制限事項](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-generative-actions#known-limitations-for-generative-orchestration){target=_blank} をお読みください。

生成 AI に基づくオーケストレーション を有効にするには、ブラウザーを開き、ターゲット Microsoft 365 テナントの作業用アカウントを使用して [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、Microsoft Copilot Studio の利用を開始してください。

1️⃣ **Agents** の一覧を表示し、次に 2️⃣ 前の Lab MCS1 で作成したエージェントを編集してください。

![Microsoft Copilot Studio のエージェント一覧画面と、編集対象のエージェントを選択している画面。](../../../assets/images/make/copilot-studio-02/edit-agent-01.png)

**Overview** タブで、以下のスクリーンショットに示すように、名称 **Orchestration** のトグルを有効にしてください。

![生成 AI に基づくオーケストレーション が有効化され、ハイライト表示された Microsoft Copilot Studio の画面。](../../../assets/images/make/copilot-studio-02/generative-orchestration-01.png)

生成 AI に基づくオーケストレーション の有効化には通常しばらく時間がかかります。設定が適用されたら、エージェントをパブリッシュして変更を確定してください。

<cc-end-step lab="mcs2" exercise="1" step="1" />

## 演習 2 : シングルターン トピック作成

この演習では、新しいトピックを作成してユーザーからの入力を収集し、その入力に基づいてフィードバックを提供します。具体的には、トピックは現在のユーザーの役割に関する情報を収集し、提供された役割に基づいたエージェントの利用方法を案内します。

### ステップ 1 : 新しいシングルターン トピックの作成

新しいトピックを作成するには、画面上部で 1️⃣ **Topics** タブ を選択し、次に 2️⃣ **+ Add a topic** を選び、最後に 3️⃣ **From blank** を選択してカスタム トピックの作成を開始してください。

!!! info "Copilot を使用したトピック作成"
    自然言語による説明を提供するだけで、新しいトピックを作成でき、Copilot がトピックを下書きしてくれる点にご留意ください。

![新しいトピック作成時の Microsoft Copilot Studio の画面。**Topics** タブがハイライトされ、**+ Add a topic** のドロップダウン メニューと **From blank** オプションが選択されています。](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-01.png)

Copilot Studio は、新しいトピックを定義するためのグラフィカル デザイナーを提供します。トピックの最初の構成要素は **Trigger** アクションであり、これはトピックの動作内容を記述するために使用します。生成 AI に基づくオーケストレーション が有効な場合、アクション内に自然言語でトピックの目的を定義できるテキスト エリアが表示されます。このラボでの作業のため、以下の内容を入力してください：

```txt
This topic can handle queries like these: collect user's role and provide feedback, 
give me a feedback based on my role, what's your feedback for my role?
```

クラシック オーケストレーション を使用する場合、単一の記述テキストの代わりに、５ ～ １０ 個のトリガーフレーズや文章を指定することが可能です。

![新しいトピック設計時の Microsoft Copilot Studio の画面。**Trigger** アクションに、この演習ステップで提案された値がトリガー条件として設定され、新しいアクションを追加するボタンがハイライトされています。](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-02.png)

<cc-end-step lab="mcs2" exercise="2" step="1" />

### ステップ 2 : ユーザー入力の収集

画面中央の **+** ボタンを選択して、現在のトピックに新しいアクションやステップを追加します。**+** ボタンを選択すると、利用可能なすべてのアクションの一覧が表示されます。主なオプションは以下の通りです：

- Send a message： ユーザーにメッセージを送信します。メッセージはテキスト、画像、ビデオ、adaptive card などにすることができます。
- Ask a question： ユーザーに入力を求めます。入力はテキスト、画像、ビデオ、添付ファイル、adaptive card などにすることができます。
- Ask with adaptive card： Adaptive Card を利用してユーザーから内容を収集します。
- Add a condition： 変数や定数値の比較に基づいて、トピックに分岐を追加します。
- Variable management： トピックレベル、グローバル、システム、または環境でのスコープを持つ変数を管理します。
- Topic management： 現在のトピックのライフサイクルを管理します。
- Add an action： Power Automate フロー、カスタム コネクター、またはマルチエージェント シナリオでの他のエージェントなど、外部アクションを利用します。
- Advanced： 外部 HTTP REST API の利用、生成 AI による回答の使用、イベントやアクティビティの送信など、高度な機能を提供します。

![現在のトピックに追加するアクションを選択するメニュー。利用可能なオプションは、send a message、ask a question、ask with adaptive card、add a condition、variable management、topic management、add an action、advanced です。](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-03.png)

ユーザーの入力を収集するために、**Ask a question** アクションを追加します。ユーザーの役割を尋ねるために、以下の値を質問テキストとして提供してください。

```txt
What is your role?
```

なお、デフォルトでは Copilot Studio は、**Identify** 設定フィールドで強調表示されているように、収集された入力に `Multiple choice options` データ型を割り当てます。**Identify** 設定フィールドの直下にある **+ New option** コマンドを選択し、以下の３つの値を順に追加してください：

- Candidate
- Employee
- HR staff member

このアクションは、ユーザーが選択した値を自動的にトピックレベルの変数に保存します。アクションの右上にある三点リーダーを選択して **Properties** コマンドを選ぶか、またはアクション下部の変数を選択して名前やその他設定を更新することができます。

![プロパティの表示、アクションの名前変更、アクションの削除、コメントの追加などのコマンドが表示されるアクションのコンテキスト メニュー。](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-04.png)

例えば、変数名を `UserRole` に変更できます。完全に設定された際のアクションの表示例は以下の通りです。

![質問テキスト、結果のデータ型、オプション、選択されたオプションを保存する変数、および変数のスコープが表示された、すべての設定およびコマンドがハイライトされた完全に設定済みのアクション。](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-05.png)

<cc-end-step lab="mcs2" exercise="2" step="2" />

### ステップ 3 : ユーザーへのフィードバックの提供

次に、画面中央の **+** ボタンを選択して **Add a condition** を追加します。左側の分岐で **Select a variable** オプションを選択し、前のステップで作成した **userRole** 変数を選んでください。その後、条件の値として `userRole is equal to Candidate` となるように設定します。同様の手順をさらに２回繰り返し、`userRole is equal to Employee` および `userRole is equal to HR staff member` 用の条件を設定してください。最後の条件は `All other conditions` としてください。

各分岐内で、ユーザーに対して専門的なフィードバックを行うためのカスタム ロジックを指定できます。そのために、各 **Condition** 分岐の下にある **+** コマンドを選択し、**Send a message** タイプのアクションを追加してください。必要に応じて、各分岐に複数のアクションを追加することも可能です。

例えば、３つの分岐それぞれに以下のフィードバック メッセージを提供することができます：

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

`All other conditions` 分岐では、**Topic management** グループにある **Redirect** アクションを設定して、System Topic の **Fallback** にフォールバックすることができます。

![各オプションに応じたメッセージが送信され、ユーザーがサポートされていないオプションを選択した場合に **Fallback** トピックへリダイレクトされる条件分岐。](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-06.png)

この非常にシンプルなトピックのロジックは、これで完成です。

<cc-end-step lab="mcs2" exercise="2" step="3" />

### ステップ 4 : 現在のトピックの終了

カスタム トピックのフローを適切に完了するため、**Topic management** グループにある **End current topic** タイプの新しいアクションを追加します。この最後のアクションは、トピックの会話が完了したことを Copilot Studio に通知します。

![現在のトピック フローに挿入された **End current topic** アクション。](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-07.png)

<cc-end-step lab="mcs2" exercise="2" step="4" />

### ステップ 5 : 現在のトピックのテスト

これでトピックを保存してテストする準備が整いました。デザイナーの右上にある **Save** ボタンを選択し、表示されるダイアログ ウィンドウでトピックの名前を指定してから、再度 **Save** ボタンを選択してください。

![トピックに名前を割り当てて保存するためのダイアログ ウィンドウ。](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-08.png)

例として、トピックの名前を `Collect user's role` としてください。次に、デザイナーの右上にある **Test** コマンドを選択してテストパネルを開き、以下のプロンプトを入力します：

```txt
What's your feedback for my role?
```

エージェントは役割の選択を促し、選択に応じた特定のフィードバックが得られます。以下のスクリーンショットをご覧ください。

![Microsoft Copilot Studio 内のテストパネルで動作中のエージェント。](../../../assets/images/make/copilot-studio-02/create-topic-single-turn-09.png)

これで演習 2 は完了です。お疲れ様でした！次は演習 3 に進み、マルチターン トピックの作成に取り組んでください。

<cc-end-step lab="mcs2" exercise="2" step="5" />

## 演習 3 : マルチターン トピック作成

シンプルな対話の場合、質問と回答が１回ずつのシングルターン対話を作成します。しかし、内容の充実したトピックの場合、ユーザー と エージェント間で複数回のやりとりが必要なマルチターン対話が求められます。この演習では、新しい役割の候補者に関するデータを収集するためのマルチターン トピックを作成します。

### ステップ 1 : 新しいマルチターン トピックの作成

新しい候補者について、以下の情報を収集するトピックを作成すると仮定してください：

- First name
- Last name
- E-mail
- Current role

上記の情報を収集するため、演習 2 のステップ 1 に記載された手順に従って新しいトピックを作成してください。トピックの **Trigger** 説明として、以下の内容を設定できます：

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

次に、上記の各情報項目について、**Ask a question** タイプのアクションでユーザーに対して入力を促す必要があります。ただし、この演習では、回答の値は要求される項目に応じて異なります。例えば、first name、last name、current role は単純なテキスト フィールドとなりますが、e-mail 項目は有効な e-mail である必要があります。

そのため、first name、last name、current role の各フィールドについては、**Ask a question** アクションの **Identify** プロパティから **User's entire response** を実際のエンティティ タイプとして選択できます。これにより、ユーザーが提供したテキスト値が実際の収集値として取得されます。変数の型は Copilot Studio によって自動的に `string` に更新されます。ユーザーが提供した値を保持する各変数に、意味のある名前を付けてください。

以下のスクリーンショットでは、first name の入力アクションの定義例が示されています。同様に last name および current role についても定義可能です。

![候補者の first name を収集し、ユーザーが提供した任意の値を受け入れて string 型の変数に保存するように設定された **Ask a question** アクション。](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-01.png)

e-mail 項目については、**Identify** プロパティのエンティティとして **Email** を選択し、Copilot Studio が自動的にユーザーの入力を e-mail の検証ルールに従って検証できるようにします。基盤となる変数は引き続き `string` となります。

![ユーザーが提供した email 型の値のみを受け付け、候補者の e-mail を収集するように設定された **Ask a question** アクション。](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-02.png)

これで、候補者に関するすべての情報を収集し、ユーザーにフィードバックを提供する準備が整いました。

<cc-end-step lab="mcs2" exercise="3" step="1" />

### ステップ 2 : ユーザーへのフィードバック提供

収集した入力に基づいて、ユーザーに収集データの確認メッセージを送信できます。**Send a message** タイプの新しいアクションを追加し、収集された入力が保存されている変数を使用してメッセージの内容を構築してください。
メッセージに変数を追加するには、**Send a message** アクションのツールバーにある **{x}** コマンドを選択し、目的の変数を選んでください。

![変数の挿入コマンドがハイライトされ、現在のトピックで利用可能な変数一覧が表示された **Send a message** アクション。](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-03.png)

現在のトピックで定義された変数、システム変数、または環境変数を挿入することが可能です。すべての変数を用いて再確認メッセージを構成すると、以下のスクリーンショットのようになります。

![参照されたすべての変数が含まれた **Send a message** アクション。](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-04.png)

ユーザーからの最終確認のために、**Ask a question** タイプのアクションを挿入し、以下のメッセージを入力してください：

```txt
Is it ok for you to insert this new candidate?
```

アクションを `Yes` および `No` の回答に対応するよう構成してください。演習 2 のステップ 3 と同様、各結果に対する各分岐を設定できます。簡略化のため、各分岐ごとに **Send a message** アクションを一つずつ使用し、ユーザーのフィードバックに応じてサムズアップやサムズダウンの絵文字をメッセージの内容として配置することも可能です。最後に、**End current topic** タイプのアクションを追加してトピックを完了させてください。

![最後の **Ask a question** アクション、ユーザー入力を管理する３つの分岐、および **End current topic** の最終アクションを含むトピックの最終部分。](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-05.png)

これでトピックを保存し、例えば `Register a new candidate` という名前を付け、統合テスト インターフェイスでテストすることができます。以下はマルチターン トピックとの対話のスクリーンショットです。また、e-mail 項目で誤った値が提供された場合、Copilot Studio が自動的に再入力を促すことにもご注意ください。

![候補者情報全体を収集するための一連の質問と回答が行われるマルチターン トピックとの対話。](../../../assets/images/make/copilot-studio-02/create-topic-multi-turn-06.png)

<cc-end-step lab="mcs2" exercise="3" step="2" />

## 演習 4 : Adaptive Cards の利用

複数の **Ask a question** アクションを使用して入力を収集することは一つの選択肢ですが、多くのデータを収集する必要がある場合や、ユーザーとの洗練された対話を実現したい場合、Adaptive Card の利用を検討することができます。

<details open>
<summary>Adaptive Cards の概要</summary>

Adaptive Cards は、アプリケーションやサービス間で交換可能な、JSON で作成されたプラットフォームに依存しない UI スニペットです。アプリに配信されると、その JSON はネイティブ UI に変換され、環境に自動的に適応します。これにより、主要なプラットフォームやフレームワーク間で軽量な UI の設計と統合が可能となります.
    <div class="video">
      <iframe src="//www.youtube.com/embed/pYe2NqKhJoM" frameborder="0" allowfullscreen></iframe>
      <div>Adaptive Cards はあらゆる場所で利用されています。</div>
    </div>
</details>

### ステップ 1 : Adaptive Cards を使用した入力の収集

新しい候補者について、以下の情報を収集するための別のトピックを作成すると想定してください：

- First name
- Last name
- E-mail
- Current role
- Spoken languages
- Skills

特に、Spoken languages および Skills は複数選択可能なリスト形式の値です。

そのため、**Topics** タブを開き、トリガー条件の重複を避けるために演習 3 で作成したトピックを無効にしてください。その後、演習 2 ステップ 1 の手順に従って新しいトピックを作成します。トピックの **Trigger** 説明として、以下の内容を設定できます：

```txt
This topic helps to collect information about a new candidate to process. Trigger sentences can be: 
register a new candidate, create a new candidate, add a new candidate.
```

次に、**Ask with adaptive card** タイプの新しいアクションを追加し、1️⃣ 新しいアクションのボディを選択して、2️⃣ **Edit adaptive card** ボタンを選択します。そして、以下の JSON をアクションの **Adaptive card designer** 内の **Card payload editor** に入力してください。

![Adaptive card の JSON を定義するためにサイドパネルが開かれている状態で、**Ask with adaptive card** アクションを追加しているトピックの画面。](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-01.png)

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

Adaptive card の JSON を更新すると、Copilot Studio はトピック デザイナーの UI 上にカードのプレビューをレンダリングします（以下のスクリーンショット参照）。また、Copilot Studio はユーザーが提供した値を収集するためのトピックレベルの変数セットを自動的に定義します。

![サイドパネルが開かれ、適切な Adaptive card の JSON が定義された状態で **Ask with adaptive card** アクションを追加しているトピックの画面。デザイナー上には実際の Adaptive card のプレビューと、ユーザーが提供した値を収集するための出力引数の一覧が表示されています。](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-02.png)

<cc-end-step lab="mcs2" exercise="4" step="1" />

### ステップ 2 : Adaptive Cards を使用したフィードバック提供

これで、Adaptive card を使用して収集データの再確認をユーザーにフィードバックすることも可能です。**+** コマンドを選択し、**Send a message** タイプの新しいアクションを追加します。次に、新しいアクションの左上にある **+ Add** を選択し、**Adaptive card** を選択してメッセージタイプを Adaptive card に切り替えます。

![**Send a message** アクションで送信するメッセージとして Adaptive card を追加するためのコマンド ボックス。](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-03.png)

サイドパネルが表示され、**Edit adaptive card** コマンドを選択して Adaptive card の内容を定義できます。以下の JSON を **Adaptive card designer** の **Card payload editor** にコピーして貼り付けてください。

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

Adaptive card の JSON を貼り付ける際、テキスト エリアの上部で **Edit JSON** オプションが選択されていること（これはデフォルトの設定です）が非常に重要です。これは、実際の Adaptive card の JSON を編集していることを意味します。JSON を貼り付けたテキスト エリアからフォーカスが外れると、**Send a message** アクションが Adaptive card のプレビューを開始します。ご覧の通り、Adaptive card はすべての変数（firstname、lastname など）の静的な値をレンダリングしています。

![右側のサイドパネルに Adaptive card の JSON が表示され、アクション本文に Adaptive card のプレビューが表示されている **Send a message** アクション。](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-04.png)

次に、**JSON Card** と表示されたドロップダウンを選択し、**Formula Card** に切り替えて、静的な値を現在のトピックで定義された実際の変数に置き換えてください。

![右側のサイドパネルに Adaptive card の JSON が表示され、アクション本文に Adaptive card のプレビューがある **Send a message** アクション。](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-05.png)

エディターを展開するボタンを選択すると、静的な値をトピックレベルの変数の実際の値を参照する数式に置き換え始めることができます。

![【Formula card】モードで Adaptive card の JSON を編集中の **Send a message** アクションのサイドパネル。エディターを展開するボタンが表示されています。](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-06.png)

変数や PowerFx 関数を参照するのに役立つインテリセンス機能を備えた高度なエディターが表示されるダイアログがポップアップし、以下のスクリーンショットのように表示されます。

![変数や PowerFx 関数の参照を支援するインテリセンス機能を備えた Adaptive card エディター。](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-07.png)

一つずつ、すべての静的な値を実際の変数に置き換えることができます。特に、Spoken languages と Skills は値のリスト（`Table` 型の変数）であるため、それらの値をレンダリングするには、PowerFx の `Concat` 関数と `Text` 関数を使用して、結果を実際の文字列に変換する必要があります。以下に、すべての数式が適用された Adaptive card の JSON 内容を示します。

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
    PowerFx 関数の詳細については、[Create expressions using Power Fx](https://learn.microsoft.com/en-us/microsoft-copilot-studio/advanced-power-fx){target=_blank} をご参照ください。

<cc-end-step lab="mcs2" exercise="4" step="2" />

### ステップ 3 : 現在のトピックのテスト

トピックの最後に **End current topic** アクションを追加し、保存して、例えば `Register new candidate with adaptive cards` と名前を付け、エージェントデザイナーの右側にあるテストパネルでテストしてください。以下のスクリーンショットでは、トピックがユーザーとどのように対話するかをご確認いただけます。

![Adaptive card を使用して新しい候補者の情報を収集し、別の Adaptive card でフィードバックを提供するトピック。](../../../assets/images/make/copilot-studio-02/create-topic-adaptive-card-08.png)

これで、トピックは準備完了かつ完全に機能しています。今後のラボでは、実際に外部の HR サービスにデータを保存して新しい候補者のレコードを作成する方法を学びます。

<cc-end-step lab="mcs2" exercise="4" step="3" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントは、複数のトピックを通じた複数の会話パスをサポートするようになりました。次のラボでは、カスタム Actions の利用方法を学びます。

<a href="../03-actions">こちら</a>から Lab MCS3 を開始し、Microsoft Copilot Studio を使用してエージェントのアクションを定義してください。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/02-topics" />