---
search:
  exclude: true
---
# ラボ MCS3 - ツールの定義

このラボでは、Microsoft Copilot Studio で **ツール** を作成する方法を学びます。ツールはエージェントのもう一つの主要な構成要素であり、外部の Power Platform コネクター（ネイティブまたはカスタム）、外部 REST API、Power Automate フロー、MCP (Model Context Protocol) サーバーなどを追加してエージェントの機能を拡張できます。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ZVHkBiH6RxQ" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早く確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前回の [ラボ MCS2](../02-topics){target=_blank} を前提としています。同じエージェントを引き続き使用し、新しい機能を追加して改善してください。

ツールはグラフィカル デザイナーで作成できます。作成後、詳細な調整が必要な場合は低レベルのコード エディターで定義を編集することも可能です。

このラボで学ぶこと:

- Power Platform コネクターを呼び出すツールの作成方法
- Power Automate フローを呼び出すツールの作成方法
- トピックからツールを呼び出す方法

## Exercise 1 : Microsoft Copilot Studio でツールを作成する

この演習では、[ラボ MCS2](../02-topics){target=_blank} で作成したエージェントを強化し、Excel Online を使用して SharePoint Online のドキュメント ライブラリに保存された Excel スプレッドシートから仮想的な候補者リストを取得します。その後、同じスプレッドシートに新しい候補者を追加できる Power Automate フローを利用するツールを追加します。

### Step 1: Power Platform コネクターの利用

新しいツールを作成するには、画面上部の 1️⃣ **Tools** タブを選択し、2️⃣ **+ Add a tool** を選択します。

![Microsoft Copilot Studio で新しいツールを作成するインターフェイス。**Tools** タブと **+ Add a tool** コマンドが強調表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-01.png)

ツールの種類を選択できるダイアログが表示されます。既定では **Featured** ツールが表示され、Excel Online など一般的なサービスと連携できます。 

![新しいツール作成時のインターフェイス。「Featured」ツールの一覧と "+ New tool" コマンドが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02a.png)

**+ New tool** コマンドを選択すると、次のオプションから新しいツールを作成できます。

- Prompt: 自然言語で記述したプロンプトを使用する AI ツールを利用
- Agent flow: Power Automate フローを利用（[Step 2](#step-2-consuming-a-power-automate-flow) を参照）
- Custom connector: Power Platform カスタム コネクターを利用
- REST API: 外部 REST API を利用。詳細は [こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank}。
- Model Context Protocol: 外部 MCP サーバーのツールを利用

![新しいツールを作成するダイアログ。Prompt、Agent flow、Custom connector、REST API、Model Context Protocol の各オプションがある。「Back」コマンドで Featured ツールへ戻れる。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02.png)

目的のオプションが Featured にない場合は **All** グループに切り替え、テキスト検索してください。

今回のステップでは **Excel Online (Business)** を選択し、**List rows present in a table** を選びます。まず外部コネクターへの接続が必要なので **Connection** で **Create new connection** を選択し、手順に従って接続を作成します。

![ターゲットの Power Platform コネクターへ接続するダイアログ。接続情報または新規接続ボタンがある。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

アカウントでサインインし、Excel Online (Business) へのアクセスを許可します。接続が完了すると、**Add to agent** と **Add and configure** のコマンドが表示されます。

![エージェントにツールを追加するダイアログ。**Add to agent** と **Add and configure** のコマンドがある。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03b.png)

続いてツールの設定ページが開きます。以下を入力します。

- Name: ツールの説明的な名前
- Description: 生成オーケストレーションがツールを使用するタイミングを判断するための自然言語による説明
- Inputs: ツールの入力パラメーター
- Completion: 要求とユーザーへの応答の処理方法

設定前に候補者リスト入りの Excel スプレッドシートを用意する必要があります。次の [リンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank} からサンプル ファイルをダウンロードしてください。

同じテナントの SharePoint Teams サイトの **Documents** ライブラリにアップロードします。このドキュメントは仮想的な候補者リストとして Microsoft 365 Copilot によって生成されました。

- サイトの絶対 URL をコピーします（例: `https://xyz.sharepoint.com/sites/contoso/`）
- ドキュメント ライブラリ名をコピーします（例: `Shared documents`）
- ファイル名もコピーします（例: `Sample-list-of-candidates.xlsx`）

Copilot Studio に戻り、ツール設定を完了させます。

![ツール設定ダイアログ。Name、Description、Inputs、Completion を入力。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-04.png)

設定例:

- Name: List HR candidates
- Description: List candidates for an HR role

次に **Inputs** タブで入力パラメーターを設定します。既定では必須項目が **Fill as** に `Dynamically fill with AI` となっています。

![入力パラメーター設定タブ。各引数の "Fill as" が "Dynamically fill with AI" になっている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-05.png)

各引数の **Fill using** を `Custom value` に変更し、すべてを固定値に設定します。

静的値:

- Location: `https://xyz.sharepoint.com/sites/contoso/`
- Document Library: `Shared Documents`
- File: `Sample-list-of-candidates.xlsx`
- Table: `Candidates_Table`

Copilot Studio の UI からサイト、ライブラリ、ファイル、テーブルを参照して選択できます。

![入力パラメーターを設定したタブ。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-06.png)

画面右上の **Save** を選択してツールを保存します。

<cc-end-step lab="mcs3" exercise="1" step="1" />

### Step 2: 新しいツールをテストする

更新したエージェントを発行し、統合テスト パネルまたは Microsoft Teams で試してみましょう。

[ラボ MCS2](../02-topics){target=_blank} で生成オーケストレーションを有効にしたので、以下のようなプロンプトを入力するだけで新しく作成したツールを呼び出せます。

```txt
Show me the list of candidates for an HR role
```

Copilot Studio のテスト パネルでプロンプトを使うと、デフォルトで **Activity map** が表示され、オーケストレーターの動作を確認できます。次のスクリーンショットは先程のプロンプトの Activity map です。オーケストレーターがユーザーの意図を認識し、Step 1 で作成したツールを起動していることがわかります。手動で設定した入力パラメーターも確認できます。

Power Platform コネクターには有効な接続が必要なため、エージェントはユーザーに **Connect** を促します。

![推奨プロンプトを処理するエージェント。Activity map が表示され、手動入力パラメーターが確認できる。テスト パネルでは外部コネクターへの接続を促している。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-09.png)

**Connect** を選択して接続を有効化します。新しいブラウザー タブに現在のセッションの接続一覧が表示され、`Excel Online (Business)` への接続が含まれています。**Connect** リンクを選択し、**Create or pick a connection** ダイアログで接続を有効にします。接続後、エージェントに戻り **Retry** を選択してツールを実行します。テスト パネルにスプレッドシートから取得した候補者リストが表示されます。

![テスト パネルにツールの出力として候補者リストが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-10.png)

素晴らしい！次のステップへ進みましょう。

<cc-end-step lab="mcs3" exercise="1" step="2" />

### Step 3: エージェント フローの利用

このステップでは、Power Automate フローを呼び出すツールを作成します。ユーザー入力に基づき Excel スプレッドシートに新しい候補者を追加するとしましょう。外部 Power Automate フローを呼び出すツールを作成し、スプレッドシートのテーブルに新しい行を追加します。

**Tools** タブで **+ Add a tool** を選択し、**+ New tool** → **Agent flow** を選択します。**Agent flows** デザイナーが開き、新しいフローが表示されます。

![エージェント フローの初期デザイン。「When an agent calls the flow」と「Respond to the agent」のアクションがある。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-01.png)

フローには開始トリガー `When an agent calls the flow` と終了アクション `Respond to the agent` が用意されています。この間にビジネス プロセスを定義し、Copilot Studio ツールが入力パラメーターを渡して実行し、応答をエージェントへ返します。最初のアクションを選択してプロパティを編集し、入力パラメーターを設定します。

![トリガー アクションのプロパティ。firstname、lastname、role、expertise の 4 つの入力が設定されている。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-02.png)

候補者を追加するため、次の 4 つの入力パラメーターを設定します。

- Firstname: text
- Lastname: text
- Role: text
- Expertise: text

次に、2 つの既定アクションの間に **Excel Online (Business)** コネクターの **Add a row into a table** アクションを追加します。候補者リストのスプレッドシートを指定し、列フィールドをトリガー アクションの入力パラメーターにマッピングします。アクション名は `Add new candidate row` とします。

![Excel スプレッドシート テーブルに新しい行を追加するフロー アクションのプロパティ。列フィールドが入力パラメーターにマッピングされている。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-03.png)

最後に `Respond to Copilot` アクションを編集し、`Result` という Text 型の出力パラメーターを追加します。値は入力パラメーターを使ったメッセージ式にします。

![`Respond to Copilot` アクションのプロパティ。入力パラメーターを使って候補者が追加されたことを示すメッセージを返す。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-04.png)

**Save draft** し、**Overview** タブの **Details** でフロー名を `Insert new candidate for HR` のように変更してから Publish します。エージェントに戻り、新しいツールを追加するダイアログで **Flow** フィルターを選択すると、作成した Agent flow が表示されます。表示されない場合は名前で検索してください。

![**Flow** グループに新しいフローが表示されたツール一覧。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-05.png)

ツールを選択し、**Add and configure** で設定します。例:

- Name: Insert new candidate for HR
- Description: Insert new candidate into the Excel spreadsheet for HR

**Save** を選択すると Agent flow ベースのツールが利用可能になります。次のようなプロンプトでツールを呼び出してみましょう。

```txt
Insert a new candidate into the Excel spreadsheet of HR. The candidate firstname is John, 
the lastname is White, the role is "HR Administrator", and the expertise is "Compliance".
```

初回実行時は Excel Online への接続が必要です。**Connect** を選択し、接続後 **Retry** でツールを実行します。

![新しいツールを呼び出す際の Activity map。ユーザーに接続を促している。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-06.png)

ツールが実行されると、Power Automate フローで定義したメッセージが返され、スプレッドシートに新しい候補者が追加されます。

<cc-end-step lab="mcs3" exercise="1" step="3" />

## Exercise 2 : トピック内からツールを呼び出す

この演習では、先ほど作成したツールをトピック内で使用します。

### Step 1: トピックからツールを呼び出す

まず空白から新しいトピックを作成し、名前を `Add a new candidate to Excel` とします。[ラボ MCS2 の Exercise 4](../02-topics#exercise-4--using-adaptive-cards){target=_blank} と同じ手順を踏んでください。

トリガーの説明例:

```txt
This topic helps users to insert new candidates in the Excel spreadsheet of HR.
Triggering sentences can be: add a new a new row to the persistence storage.
```

簡単にするため詳細は省略しますが、ラボ MCS2 を参照してください。

次の JSON は **Ask with adaptive card** アクションで候補者情報を収集するためのアダプティブ カードです。

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
            "id": "current_role",
            "placeholder": "Current Role"
        },
        {
            "type": "Input.Text",
            "id": "expertise",
            "placeholder": "Expertise"
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

続いて **Add an tool** グループの **Tool** タブから、[Exercise 1 - Step 3](#step-3-consuming-a-power-automate-flow) で作成したツールを選択します。

![トピック デザイナーで新しいツールを追加する画面。エージェントのツール一覧が表示されている。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-01.png)

ツールの入力パラメーターとアダプティブ カードで取得した変数をマッピングします。

![ツールの入力パラメーター設定画面。「+ Set value」コマンドで text, text_1, text_2, text_3 を Agent flow の引数にマッピング。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02a.png)

**+ Set value** で下記の通り対応付けます。

- text: first name
- text_1: last name
- text_2: current role
- text_3: expertise

Copilot Studio のデータ バインディングで、各入力パラメーターを **Ask with adaptive card** で取得したトピック変数へ設定します。最終的には以下の画像のようになります。

![ユーザー入力で収集したトピック変数とツールの入力パラメーターがバインディングされている。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02b.png)

**End current topic** アクションを追加して保存します。

ラボ MCS2 で作成した他のトピックを無効化し、次のプロンプトで新しいトピックを呼び出して Excel に行を追加します。

```txt
Add a new a new row to the persistence storage
```

アダプティブ カードに入力し送信すると、トピック経由でツールが起動し、スプレッドシートに候補者が追加されます。

![トピックを通じて新しい候補者を追加した結果と Excel の更新済みテーブル。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02.png)

<cc-end-step lab="mcs3" exercise="2" step="1" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントはツールをサポートしました。次のラボでは、Copilot Studio を使用して Microsoft 365 Copilot Chat 用の Declarative Agents を作成する方法を学びます。

<a href="../04-extending-m365-copilot">こちらから</a> ラボ MCS4 を開始し、Microsoft 365 Copilot Chat 用 Declarative Agents の作成方法を学んでください。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/03-actions--ja" />