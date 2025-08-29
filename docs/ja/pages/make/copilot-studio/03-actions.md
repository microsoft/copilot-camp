---
search:
  exclude: true
---
# ラボ MCS3 - ツールの定義

このラボでは、Microsoft Copilot Studio でツールを作成する方法を学習します。ツールはエージェントのもう 1 つの主要な構成要素であり、外部の Power Platform コネクター（既定またはカスタム）、外部 REST API、Power Automate フロー、MCP サーバーなどを追加することでエージェントの機能を拡張できます。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ZVHkBiH6RxQ" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を簡単に確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前回の [ラボ MCS2](../02-topics){target=_blank} を基にしています。同じエージェントを引き続き使用し、新しい機能を追加して改善します。

ツールはグラフィカル デザイナーで作成できます。作成後、詳細な調整が必要な場合は低レベルのコード エディターで定義を編集することもできます。

このラボで学習する内容:

- Power Platform コネクターを呼び出すツールの作成方法
- Power Automate フローを呼び出すツールの作成方法
- トピックからツールを呼び出す方法

## 演習 1 : Microsoft Copilot Studio でツールを作成する

この演習では、[ラボ MCS2](../02-topics){target=_blank} で作成したエージェントを拡張し、SharePoint Online ドキュメント ライブラリに保存された Excel スプレッドシートから仮想的な候補者リストを取得するために Excel Online を使用します。その後、同じスプレッドシートに新しい候補者を追加できる Power Automate フローを利用するツールを追加します。

### ステップ 1: Power Platform コネクターを利用する

新しいツールを作成するには、画面上部の 1️⃣ **Tools** タブを選択し、2️⃣ **+ Add a tool** を選択してツールの作成を開始します。

![Microsoft Copilot Studio のツール作成画面。**Tools** タブと **+ Add a tool** コマンドが強調表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-01.png)

ツールの種類を選択できるダイアログが表示されます。既定では **Featured** ツールがいくつか表示され、Excel Online などの一般的なサービスと連携できます。 

![Microsoft Copilot Studio のツール作成ダイアログ。Featured ツールの一覧と "+ New tool" コマンドが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02a.png)

**+ New tool** コマンドを選択すると、次のオプションから新しいツールをゼロから作成できます。

- Prompt: 自然言語で記述したプロンプトを使用して AI ツールを利用
- Agent flow: Power Automate フローを利用（[ステップ 2](#step-2-consuming-a-power-automate-flow) を参照）
- Custom connector: Power Platform カスタム コネクターを利用
- REST API: 外部 REST API を利用。詳細は [こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank} を参照
- Model Context Protocol: 外部 MCP サーバーのツールを利用

![新しいツールを作成するダイアログ。Prompt、Agent flow、Custom connector、REST API、Model Context Protocol のオプションが表示されている。「Back」コマンドで Featured ツールに戻れる。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02.png)

Featured の一覧に目的のオプションがない場合は、**All** グループに切り替えてテキスト検索してください。

ここでは **Excel Online (Business)** を選び、**List rows present in a table** を選択します。最初に **Connection** で **Create new connection** を選択して外部コネクターへ接続します。

![対象 Power Platform コネクターへの接続ダイアログ。接続の詳細または新規接続ボタンが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

アカウントでサインインし、Excel Online (Business) へのアクセスを許可します。接続が構成されると **Add to agent** または **Add and configure** のコマンドが表示されます。

![エージェントにツールを追加するダイアログ。**Add to agent** と **Add and configure** のコマンドがある。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03b.png)

次にツールの設定ページが表示されます。設定項目:

- Name: ツールのわかりやすい名前  
- Description: ジェネレーティブ オーケストレーションがツールを使用するタイミングを判断するための自然言語の説明  
- Inputs: ツールの入力パラメーター  
- Completion: ツールがリクエストと応答をどのように処理するか  

ツールを設定する前に、候補者リスト用の Excel スプレッドシートを準備します。以下のリンクからサンプル ファイルをダウンロードしてください。  
[リンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank}

ファイルを同じテナントの SharePoint Teams サイトの **Documents** ライブラリにアップロードします。このドキュメントは Microsoft 365 Copilot により生成された仮想の候補者リストです。

- サイトの絶対 URL をコピー: 例 `https://xyz.sharepoint.com/sites/contoso/`
- ドキュメント ライブラリ名をコピー: 例 `Shared documents`
- ファイル名をコピー: 例 `Sample-list-of-candidates.xlsx`

Copilot Studio に戻り、ツール設定を完了します。

![ツール設定ダイアログ。Name、Description、Inputs、Completion がある。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-04.png)

設定値:

- Name: List HR candidates
- Description: List candidates for an HR role

**Inputs** タブを選び、入力パラメーターを設定します。既定では必須パラメーターは **Fill as** が `Dynamically fill with AI` になっています。

![入力パラメーター設定タブ。「Fill as」が "Dynamically fill with AI" の項目が表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-05.png)

各入力パラメーターの **Fill using** で `Custom value` に切り替え、次の静的値を設定します。

- Location: スプレッドシートを保存した SharePoint Online サイト コレクションの URL（例 `https://xyz.sharepoint.com/sites/contoso/`）
- Document Library: ドキュメント ライブラリ名（例 `Shared Documents`）
- File: Excel ファイル名（例 `Sample-list-of-candidates.xlsx`）
- Table: `Candidates_Table`

Copilot Studio の UI からサイト、ライブラリ、ファイル、テーブルを参照して設定できます。

![入力パラメーター設定後の画面。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-06.png)

画面右上の **Save** を選択してツールを保存します。

<cc-end-step lab="mcs3" exercise="1" step="1" />

### ステップ 2: 新しいツールをテストする

更新したエージェントを発行し、統合テスト パネルや Microsoft Teams で試してみましょう。

[ラボ MCS2](../02-topics){target=_blank} でジェネレーティブ オーケストレーションを有効にしたため、次のようなプロンプトを入力するだけでツールを呼び出せます。

```txt
Show me the list of candidates for an HR role
```

テスト パネルでプロンプトを実行すると、デフォルトで Activity map が表示され、オーケストレーターの動作を確認できます。下図では、ユーザーの意図が認識され、ステップ 1 で作成したツールが呼び出されています。手動で設定した入力パラメーターも確認できます。

Power Platform コネクターを利用するためには有効な接続が必要なため、エージェントは **Connect** ボタンで接続を促します。

![プロンプト実行時の Activity map。手動設定の入力パラメーターが確認でき、テスト パネルでは外部コネクターへの接続を求められている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-09.png)

**Connect** を選択し、接続を有効化します。新しいタブで現在のセッションの接続一覧が表示され、`Excel Online (Business)` の **Connect** を選択して **Create or pick a connection** ダイアログで接続します。接続完了後、エージェント画面に戻り **Retry** を選択してツールを実行します。テスト パネルに Excel スプレッドシートから取得した候補者リストが表示されます。

![ツール実行後、候補者リストを表示するテスト パネル。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-10.png)

これで準備完了です。次のステップへ進みましょう。

<cc-end-step lab="mcs3" exercise="1" step="2" />

### ステップ 3: Agent flow を利用する

このステップでは Power Automate フローを利用するツールを作成します。ユーザーの入力に基づき、Excel スプレッドシートに新しい候補者を追加するフローを呼び出します。

まず画面上部の **Tools** タブで **+ Add a tool** を選択し、**+ New tool** → **Agent flow** を選択します。**Agent flows** デザイナーが開き、新しいフローが表示されます。

![Agent flow デザインの初期画面。「When an agent calls the flow」トリガーと「Respond to the agent」アクションが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-01.png)

フローには `When an agent calls the flow` トリガーと `Respond to the agent` 終了アクションがあります。Copilot Studio が入力パラメーターを渡してビジネス プロセスを実行し、結果をエージェントへ返す仕組みです。まずトリガー アクションを選択してプロパティを編集し、入力パラメーターを設定します。

![トリガー アクションのプロパティ。firstname、lastname、role、expertise の 4 つの入力パラメーター。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-02.png)

候補者を追加できるよう、次の 4 つのテキスト パラメーターを設定します。

- Firstname
- Lastname
- Role
- Expertise

次に 2 つのアクションの間に **Excel Online (Business)** の **Add a row into a table** アクションを追加します。候補者リストのスプレッドシートを対象に設定し、列フィールドをトリガー アクションの入力とマッピングします。アクション名を `Add new candidate row` に変更します。

![Excel スプレッドシートに行を追加するフロー アクションの設定画面。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-03.png)

最後に `Respond to Copilot` アクションで出力パラメーター `Result`（Text 型）を追加し、以下のようなメッセージを返す数式を設定します。

![`Respond to Copilot` アクションのプロパティ。入力値を基に候補者追加完了メッセージを生成。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-04.png)

**Save draft** で保存し、**Overview** タブの **Details** でフロー名を `Insert new candidate for HR` などに変更します。フローを発行し、エージェント編集画面に戻ります。再度ツール追加ダイアログを開き、**Flow** フィルターで先ほど発行したエージェント フローを選択します。見つからない場合は名前で検索してください。

![Flow グループに新しいフローが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-05.png)

ツールを選択し **Add and configure** を選択して設定します。例:

- Name: Insert new candidate for HR
- Description: Insert new candidate into the Excel spreadsheet for HR

**Save** を選ぶとエージェント フロー ベースのツールが準備完了です。次のプロンプトでツールを呼び出してみましょう。

```txt
Insert a new candidate into the Excel spreadsheet of HR. The candidate firstname is John, 
the lastname is White, the role is "HR Administrator", and the expertise is "Compliance".
```

前ステップ同様、初回は Excel Online への接続が必要です。**Connect** → **Retry** の順に選択してツールを実行します。

![ツール呼び出し時の Activity map。接続後に再試行を促す表示。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-06.png)

ツール実行後、Power Automate フローで定義した応答メッセージが返され、Excel スプレッドシートに新しい候補者が追加されます。

<cc-end-step lab="mcs3" exercise="1" step="3" />

## 演習 2 : トピック内からツールを呼び出す

この演習では、作成したツールをトピック内で呼び出します。

### ステップ 1: トピックからツールを呼び出す

まず空のトピックを作成し、名前を `Add a new candidate to Excel` とします。[ラボ MCS2 の演習 4](../02-topics#exercise-4--using-adaptive-cards){target=_blank} と同様の手順に従ってください。

トリガーの説明例:

```txt
This topic helps users to insert new candidates in the Excel spreadsheet of HR.
Triggering sentences can be: add a new a new row to the persistence storage.
```

簡潔にするため詳細手順は割愛しますが、必要に応じてラボ MCS2 を参照してください。以下は候補者情報を収集する **Ask with adaptive card** アクション用の JSON です。

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

次に **Add an tool** グループから **Tool** タブを開き、[演習 1 - ステップ 3](#step-3-consuming-a-power-automate-flow) で作成したツールを追加します。

![トピック デザイナーでツールを追加する画面。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-01.png)

ツールの入力パラメーターを、アダプティブ カードで取得した変数にマッピングします。

![ツールの入力パラメーターとトピック変数のマッピング設定。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02a.png)

各入力パラメーターに対して **+ Set value** を選択し、以下のように割り当てます。

- text: 名
- text_1: 姓
- text_2: 役職
- text_3: 専門分野

Copilot Studio のデータ バインドを使用して、各パラメーターをトピック変数に設定します。

![ツールの入力がトピック変数にバインドされた状態。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02b.png)

**End current topic** アクションを追加して保存します。

ラボ MCS2 で作成した他のトピックを無効化し、次のプロンプトで新しいトピックを呼び出し、Excel スプレッドシートに行を追加します。

```txt
Add a new a new row to the persistence storage
```

アダプティブ カードに入力して送信すると、トピック経由でツールが起動し、Excel スプレッドシートに新しい候補者が追加されます。

![トピックを通じて行を追加した後のやり取りと、更新された Excel テーブル。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02.png)

<cc-end-step lab="mcs3" exercise="2" step="1" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントがツールをサポートしました。次のラボでは、Copilot Studio を使用して Microsoft 365 Copilot Chat 用の Declarative Agents を作成する方法を学習します。

<a href="../04-extending-m365-copilot">こちらから</a> ラボ MCS4 を開始し、Copilot Studio で Microsoft 365 Copilot Chat 用 Declarative Agents を作成する方法を学びましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/03-actions--ja" />