---
search:
  exclude: true
---
# ラボ MCS3 - ツールの定義

このラボでは、Microsoft Copilot Studio でツールを作成する方法を学びます。ツールはエージェントの中核的な構成要素の 1 つです。ツールを使用すると、外部の Power Platform コネクター (ネイティブまたはカスタム) や外部 REST API、Power Automate フロー、MCP (Model Context Protocol) サーバーなどを追加し、エージェントの機能を拡張できます。

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
    このラボは前回の [ラボ MCS2](../02-topics){target=_blank} を土台にしています。同じエージェントを使い続け、新しい機能で強化してください。

ツールはグラフィカル デザイナーで作成できます。また、作成後に低レベル コード エディターで定義を編集し、細かな調整を行うことも可能です。

このラボで学ぶ内容:

- Power Platform コネクターを呼び出すツールの作成方法
- Power Automate フローを呼び出すツールの作成方法
- トピックからツールを呼び出す方法

## Exercise 1 : Microsoft Copilot Studio でのツール作成

この演習では、[ラボ MCS2](../02-topics){target=_blank} で作成したエージェントを拡張し、Excel Online を使用して SharePoint Online のドキュメント ライブラリに保存された Excel ブックから想定上の候補者リストを取得できるようにします。次に、同じブックへ新しい候補者を追加する Power Automate フローを呼び出すツールを追加します。

### Step 1: Power Platform コネクターの利用

新しいツールを作成するには、画面上部で 1️⃣ **Tools** タブを選択し、2️⃣ **+ Add a tool** を選択してツールの作成を開始します。

![新しいツールを作成する際の Microsoft Copilot Studio のインターフェース。**Tools** タブと **+ Add a tool** コマンドが強調表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-01.png)

ツールの種類を選択するダイアログが表示されます。既定では **Featured** ツールがいくつか用意されており、Excel Online などの一般的なサービスと連携できます。

![新しいツールを作成する際のインターフェース。Featured ツールの一覧と "+ New tool" コマンドが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02a.png)

**+ New tool** を選択してツールをゼロから作成することもできます。選択肢は以下のとおりです。

- Prompt: 自然言語で記述したプロンプトを用いて AI ツールを呼び出します。
- Agent flow: Power Automate フローを呼び出します (詳しくは [Step 2](#step-2-consuming-a-power-automate-flow) を参照)。
- Custom connector: Power Platform カスタム コネクターを呼び出します。
- REST API: 外部 REST API を呼び出します。詳細は [こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank} を参照してください。
- Model Context Protocol: 外部 MCP サーバーのツールを呼び出します。

![新しいツールを作成するダイアログ。Prompt、Agent flow、Custom connector、REST API、Model Context Protocol のオプションがある。戻るボタンも表示。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02.png)

目的のオプションが Featured にない場合は **All** グループに切り替え、テキスト検索で探します。

今回の手順では、Featured ツール **Excel Online (Business)** を選択し **List rows present in a table** を選びます。まず **Connection** で **Create new connection** を選択して外部コネクターへの接続を作成します。

![対象の Power Platform コネクターへ接続するダイアログ。接続の詳細、または新規接続ボタンが表示。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

アカウントでサインインし、Excel Online (Business) へのアクセスを許可します。接続が構成されると **Add to agent** または **Add and configure** のコマンドが表示されます。

![エージェントへツールを追加するダイアログ。**Add to agent** と **Add and configure** コマンドがある。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03b.png)

続いてツールの設定ページが表示されます。以下を入力します。

- Name: ツールの説明的な名前
- Description: ジェネレーティブ オーケストレーションがツールを使用するタイミングを判断するための自然言語による説明
- Inputs: ツールの入力パラメーター
- Completion: ツールがユーザーへのリクエストとレスポンスをどのように処理するか

設定を行う前に、候補者リストを含む Excel ブックを準備します。次の [リンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank} からサンプル ファイルをダウンロードしてください。

同じテナント内の SharePoint Teams サイトの **Documents** ライブラリにアップロードします。ドキュメントは Microsoft 365 Copilot で生成した想定上の候補者リストです。

- サイト コレクションの絶対 URL をコピー (例: `https://xyz.sharepoint.com/sites/contoso/`)
- ドキュメント ライブラリ名をコピー (例: `Shared documents`)
- ファイル名もコピー (例: `Sample-list-of-candidates.xlsx`)

Microsoft Copilot Studio に戻り、ツール設定を完了します。

![ツールの Name、Description、Inputs、Completion を設定するダイアログ。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-04.png)

以下の設定を使用します。

- Name: List HR candidates
- Description: List candidates for an HR role

次に **Inputs** タブを選択し、入力パラメーターを設定します。既定では必須入力が **Fill as** プロパティ `Dynamically fill with AI` になっています。

![ツールの入力引数を設定するタブ。"Fill as" が "Dynamically fill with AI"。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-05.png)

各入力パラメーターの **Fill using** を `Custom value` に変更し、静的値を設定します。

- Location: Excel ブックを保存した SharePoint Online サイトの URL (例: `https://xyz.sharepoint.com/sites/contoso/`)
- Document Library: ブックを保存したドキュメント ライブラリ名 (例: `Shared Documents`)
- File: Excel ファイル名 (例: `Sample-list-of-candidates.xlsx`)
- Table: `Candidates_Table`

サイト、ライブラリ、ファイル、テーブルは Copilot Studio の UI で参照できます。

![入力引数を設定した画面。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-06.png)

画面右上の **Save** を選択し、ツールを保存します。

<cc-end-step lab="mcs3" exercise="1" step="1" />

### Step 2: 新しいツールのテスト

更新したエージェントを発行し、組み込みのテスト パネルまたは Microsoft Teams で試してみましょう。

[ラボ MCS2](../02-topics){target=_blank} でジェネレーティブ オーケストレーションを有効にしたので、以下のようなプロンプトを送るだけで作成したツールを呼び出せます。

```txt
Show me the list of candidates for an HR role
```

ジェネレーティブ オーケストレーションを使用し、テスト パネル内でプロンプトを送信すると **Activity map** が自動表示され、オーケストレーターの動作を確認できます。次のスクリーンショットでは、ユーザーの意図を識別し、Step 1 で作成したツールが呼び出されていることがわかります。手動で設定した入力パラメーターも確認できます。

Power Platform コネクターを利用するには有効な接続が必要なため、エージェントは **Connect** を求めます。

![提案されたプロンプトに応答するエージェント。Activity map が表示され、手動で設定した入力パラメーターが確認できる。テスト パネルでは外部コネクターへの接続を促している。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-09.png)

**Connect** を選択して接続を有効化します。新しいブラウザー タブで現在のセッションの接続一覧が表示され、`Excel Online (Business)` への接続が含まれます。**Connect** リンクを選択し **Create or pick a connection** ダイアログで接続を確立したら、エージェントに戻り **Retry** を選択してツールを実行します。テスト パネルに Excel ブックから取得した候補者リストが表示されます。

![ツールの出力として候補者リストが表示されたテスト パネル。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-10.png)

ここまで順調です。次のステップへ進みましょう。

<cc-end-step lab="mcs3" exercise="1" step="2" />

### Step 3: Agent flow の利用

ここでは Power Automate フローを呼び出すツールを作成します。ユーザー入力に基づき Excel ブックへ新しい候補者を追加するシナリオを想定します。外部 Power Automate フローを呼び出して Excel テーブルに行を追加するツールを作成します。

まず画面上部の **Tools** タブで **+ Add a tool** を選択し、新しいツールの作成を開始します。今回は **+ New tool** を選択し **Agent flow** を選びます。すると **Agent flows** デザイナーに遷移し、新しいフローが表示されます。

![カスタム ツール用 Agent flow の初期デザイン。トリガーアクション「When an agent calls the flow」と終了アクション「Respond to the agent」がある。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-01.png)

フローには開始トリガー `When an agent calls the flow` と終了 `Respond to the agent` があらかじめ用意されています。この 2 つのアクションの間にビジネス プロセスを定義し、Copilot Studio のツールがそれを呼び出します。最初のアクションを選択してプロパティを編集し、入力パラメーターを構成します。

![トリガーアクションのプロパティ。firstname、lastname、role、expertise の 4 つの入力パラメーターが設定されている。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-02.png)

候補者を追加できるよう、以下の 4 つの入力パラメーターを設定します。

- Firstname: text  
- Lastname: text  
- Role: text  
- Expertise: text  

次に 2 つの既定アクションの間に **Excel Online (Business)** コネクターの **Add a row into a table** アクションを追加します。Excel ブックの候補者リストを対象に設定し、列フィールドとトリガーの入力パラメーターをマッピングします。アクション名を `Add new candidate row` に変更します。

![Excel テーブルに行を追加するフローアクションのプロパティ。ファイルの場所と列フィールドが入力パラメーターにマッピングされている。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-03.png)

最後の `Respond to Copilot` アクションを選択し、プロパティで `Text` 型の出力パラメーター `Result` を追加します。値には入力パラメーターを用いたメッセージを設定します。

![`Respond to Copilot` アクションのプロパティ。候補者がリストに追加されたことを知らせる計算文字列が設定されている。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-04.png)

**Save draft** し、**Overview** タブの **Details** でフロー名を `Insert new candidate for HR` などに変更します。フローを発行し、エージェントに戻ります。再びツールの追加ダイアログを開き、フィルター **Flow** を選択すると作成した Agent flow が表示されます。表示されない場合は名前で検索します。

![**Flow** グループに新しいフローが表示されているツール一覧。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-05.png)

新しいツールを選択し、次のダイアログで **Add and configure** を選んで設定します。例として以下を使用します。

- Name: Insert new candidate for HR
- Description: Insert new candidate into the Excel spreadsheet for HR

**Save** を選択すると Agent flow ベースのツールが完成します。次のようなプロンプトでツールを実行してみましょう。

```txt
Insert a new candidate into the Excel spreadsheet of HR. The candidate firstname is John, 
the lastname is White, the role is "HR Administrator", and the expertise is "Compliance".
```

前ステップ同様、初回使用時は Excel Online への接続が必要です。**Connect** を選んで接続後、**Retry** を選択してツールを実行します。

![新しいツール呼び出し時の Activity map。接続後に Retry を促している。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-06.png)

ツール実行後、Power Automate フローで定義したメッセージが返され、Excel テーブルに新しい候補者が追加されます。

<cc-end-step lab="mcs3" exercise="1" step="3" />

## Exercise 2 : トピック内からツールを呼び出す

この演習では、作成したツールをトピック内で利用します。

### Step 1: トピックからのツール呼び出し

まず空のトピックを作成し、名前を `Add a new candidate to Excel` とします。[ラボ MCS2 Exercise 4](../02-topics#exercise-4--using-adaptive-cards){target=_blank} と同じ手順に従ってください。

トリガリングの説明は次のようにします。

```txt
This topic helps users to insert new candidates in the Excel spreadsheet of HR.
Triggering sentences can be: add a new a new row to the persistence storage.
```

簡潔にするため詳細手順はここでは割愛しますが、ラボ MCS2 を参照してください。

以下は **Ask with adaptive card** アクションで候補者情報を収集するためのアダプティブ カード JSON です。

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

次に **Add a tool** グループから **Tool** タブを選び、[Exercise 1 - Step 3](#step-3-consuming-a-power-automate-flow) で作成したツールを追加します。

![トピック デザイナーでエージェントのツールを追加する画面。**Add a tool** グループにすべてのツールが表示されている。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-01.png)

続いて、ツールの入力パラメーターをアダプティブ カードで取得した変数にマッピングします。

![ツールの入力パラメーター設定画面。"+ Set value" コマンドで input に text, text_1, text_2, text_3 を割り当てている。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02a.png)

各入力パラメーターを次のように割り当てます。

- text: 名
- text_1: 姓
- text_2: 現在の役割
- text_3: 専門分野

Copilot Studio のデータ バインディングを使い、各入力を **Ask with adaptive card** で取得したトピック変数に設定します。最終的に下図のようになります。

![アダプティブ カードで取得したトピック変数にツールの入力パラメーターがバインドされている。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02b.png)

**End current topic** アクションを追加して保存します。

ラボ MCS2 で作成した他のトピックを無効化し、次のプロンプトで新トピックを起動して Excel に候補者を追加します。

```txt
Add a new a new row to the persistence storage
```

アダプティブ カードに入力し送信すると、トピック経由でツールが実行され、Excel に新しい候補者行が追加されます。

![トピックとの対話で候補者を追加し、Excel のテーブルが更新された様子。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02.png)

<cc-end-step lab="mcs3" exercise="2" step="1" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントがツールをサポートしました。次のラボでは、Copilot Studio を使用して Microsoft 365 Copilot Chat の Declarative Agents を作成する方法を学びます。

<a href="../04-extending-m365-copilot">こちら</a>からラボ MCS4 を開始し、Copilot Studio で Microsoft 365 Copilot Chat 用 Declarative Agents を作成する方法を学びましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/03-actions" />