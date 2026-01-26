---
search:
  exclude: true
---
# ラボ MCS3 - ツールの定義

このラボでは、Microsoft Copilot Studio でツールを作成する方法を学習します。ツールはエージェントのもう 1 つのコア構成要素です。ツールを使用すると、エージェントの機能を拡張し、外部 Power Platform コネクタ (ネイティブまたはカスタム)、外部 REST API、Power Automate フロー、MCP (Model Context Protocol) サーバーなどを追加できます。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ZVHkBiH6RxQ" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前のラボ [ラボ MCS2](../02-topics){target=_blank} を基に構築されています。同じエージェントで作業を続け、新しい機能で強化できます。

ツールはグラフィカル デザイナーで作成できます。ツールを作成した後、詳細な微調整が必要な場合は低レベルのコード エディターで定義を編集することも可能です。

このラボで学習する内容:

- Power Platform コネクタを呼び出すツールの作成方法
- Power Automate フローを呼び出すツールの作成方法
- トピックからツールを呼び出す方法

## エクササイズ 1 : Microsoft Copilot Studio でのツール作成

このエクササイズでは、[ラボ MCS2](../02-topics){target=_blank} で作成したエージェントを強化し、SharePoint Online ドキュメント ライブラリに保存されている Excel スプレッドシートから架空の候補者リストを取得するために Excel Online を使用します。その後、同じスプレッドシートに新しい候補者を追加できる Power Automate フローを利用するツールを追加します。

### ステップ 1: Power Platform コネクタの使用

新しいツールを作成するには、画面上部で 1️⃣ **Tools** タブを選択し、2️⃣ **+ Add a tool** を選択します。

![The interface of Microsoft Copilot Studio when creating a new tool. There is the **Tools** tab highlighted, with the **+ Add a tool** command.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-01.png)

ツールの種類を選択するダイアログが表示されます。既定では **Featured** ツールがいくつかあり、Excel Online など一般的なサービスと連携できます。 

![The interface of Microsoft Copilot Studio when creating a new tool. There is the list of "Featured" tools and the command "+ New tool" to create a new tool.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02a.png)

**+ New tool** を選択して、次のオプションから新しいツールを一から作成することもできます。

- Prompt: 自然言語で記述したプロンプトを使用して構築した AI ツールを利用します。
- Agent flow: Power Automate フローを利用します ( [ステップ 2](#step-2-consuming-a-power-automate-flow) を参照)。
- Computer use: エージェントが Web やデスクトップ アプリを直接使用できるようにします。
- Custom connector: Power Platform カスタム コネクタを利用します。
- REST API: 外部 REST API を利用します。詳細は [こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank} を参照してください。
- Model Context Protocol: 外部 Model Context Protocol (MCP) サーバーのツールを利用します。

![The dialog to create a new tool with the available options: Prompt, Agent flow, Custom connector, REST API, Model Context Protocol. There is also a "Back" command to go back to the Featured tools.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02.png)

目的のオプションが Featured に見当たらない場合は **All** グループに切り替え、テキストで検索してください。

今回のステップでは、Featured ツール **Excel Online (Business)** を選択し、**List rows present in a table** を選択します。最初に **Connection** を選択し、**Create new connection** で外部コネクタに接続します。

![The dialog to connect to the target Power Platform connector with details about the connection, if any, or a button to create a new connection. There is also a back button to start over.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

アカウントでサインインし、Excel Online (Business) へのアクセスを許可します。接続が構成されると **Add to agent** または **Add and configure** コマンドが表示されます。

![The dialog to add the actual tool to the agent. There are commands to **Add to agent** or **Add and configure** the tool. There is also a back button to start over.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03b.png)

続いてツールを構成するページが表示されます。設定する内容は次のとおりです。

- Name: ツールの説明的な名前  
- Description: ジェネレーティブ オーケストレーションがツールを使用するタイミングを判断するための自然言語の説明  
- Inputs: ツールの入力引数 (必要に応じて)  
- Completion: リクエストとユーザーへのレスポンスの処理方法  

ツールを構成する前に、候補者リストを含む Excel スプレッドシートを準備します。次の [リンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank} からサンプル Excel ファイルをダウンロードしてください。

ファイルを、Copilot Studio を使用している同じテナント内の SharePoint Teams サイトの **Documents** ライブラリにアップロードします。このドキュメントは Microsoft 365 Copilot によって生成された架空の候補者リストです。

- サイトの絶対 URL をコピー: 例 `https://xyz.sharepoint.com/sites/contoso/`  
- ドキュメント ライブラリ名をコピー: 例 `Shared documents`  
- ファイル名をコピー: 例 `Sample-list-of-candidates.xlsx`  

Microsoft Copilot Studio に戻り、ツール設定を完了します。

![The dialog to configure the tool with the Name, description, inputs, and completion.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-04.png)

以下の設定を使用します。

- Name: List HR candidates  
- Description: HR ポジションの候補者一覧  

**Inputs** タブを選択し、入力引数を設定します。既定では必須引数すべてが **Fill as** プロパティで `Dynamically fill with AI` になっています。

![The tab to configure the input arguments of the tool. There is a list of arguments with specific settings for each of them and with "Fill as" with value "Dynamically fill with AI".](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-05.png)

各入力引数の **Fill using** 設定を `Custom value` に変更し、すべての引数に固定値を指定します。

固定値:

- Location: スプレッドシートを保存した SharePoint Online サイト コレクションの URL  
  例 `https://xyz.sharepoint.com/sites/contoso/`  
- Document Library: ドキュメント ライブラリ名  
  例 `Shared Documents`  
- File: Excel ファイル名  
  例 `Sample-list-of-candidates.xlsx`  
- Table: `Candidates_Table`

サイト、ライブラリ、ファイル、テーブルは Copilot Studio の UI で参照できます。

![The tab to configure the input arguments of the tool. There is a list of arguments with specific settings for each of them.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-06.png)

画面右上の **Save** ボタンを選択してツールを保存します。

<cc-end-step lab="mcs3" exercise="1" step="1" />

### ステップ 2: 新しいツールのテスト

更新したエージェントを発行し、統合テスト パネルまたは Microsoft Teams で試してみましょう。

[ラボ MCS2](../02-topics){target=_blank} でジェネレーティブ オーケストレーションを有効にしたため、次のようなプロンプトを入力するだけでツールを簡単に呼び出せます。

```txt
Show me the list of candidates for an HR role
```

Copilot Studio でジェネレーティブ オーケストレーションを使用し、テスト パネル内でプロンプトを実行すると、既定でアクティビティ マップが表示され、オーケストレーターの動作を確認できます。以下のスクリーンショットは先ほどのプロンプトのアクティビティ マップです。オーケストレーターはユーザーの意図を把握し、ステップ 1 で作成したツールを実行します。手動で設定した入力引数も確認できます。

Power Platform コネクタは有効な接続を必要とするため、エージェントは外部データ ソースを使用する前に **Connect** を求めます。

![The agent serving the suggested prompt. There is the Activity map in the main body of the page, with all the manually defined input arguments. There is also, in the test panel a prompt to connect to the external connector.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-09.png)

**Connect** を選択し、接続を有効化します。新しいブラウザー タブで現在のセッションのアクティブな接続一覧が表示され、`Excel Online (Business)` への接続が含まれています。**Connect** リンクを選択し、**Create or pick a connection** ダイアログで接続を確立します。接続が完了したらエージェントに戻り、**Retry** を選択してツールを実行します。テスト パネルに Excel スプレッドシートから取得した候補者リストが表示されます。

![The test panel with the output of the tool showing a list of candidates retrieved from the Excel spreadsheet.](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-10.png)

ここまでで完了です。次のステップに進みましょう。

<cc-end-step lab="mcs3" exercise="1" step="2" />

### ステップ 3: Agent flow の利用

このステップでは、Power Automate フローを利用するツールを作成します。ユーザー入力に基づき、新しい候補者を Excel スプレッドシートに追加するケースを想定します。Power Automate フローを呼び出すツールを作成し、Excel テーブルに新しい行を追加します。

作成手順: 画面上部で **Tools** タブ → **+ Add a tool** を選択。今回は **+ New tool** → **Agent flow** を選択します。**Agent flows** デザイナーが開き、新しいフローが表示されます。

![The initial design of the Agent flow to define a custom tool for an agent. There is a trigger action with name "When an agent calls the flow" and there is a closing action with name "Respond to the agent".](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-01.png)

フローには開始トリガー `When an agent calls the flow` と終了アクション `Respond to the agent` があらかじめ配置されています。Copilot Studio のツールは、これら 2 つのアクションの間でビジネス プロセスを実行し、必要に応じて入力を受け取り、レスポンスを返します。最初のアクションを選択してプロパティを編集し、入力引数を設定します。

![The properties of the trigger action with four input arguments for firstname, lastname, role, and expertise. There is also the list of supported type for input arguments.](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-02.png)

候補者を追加できるよう、次の 4 つの入力パラメーターを設定します。

- Firstname: text  
- Lastname: text  
- Role: text  
- Expertise: text  

次に、2 つのアクションの間に **Excel Online (Business)** コネクタの **Add a row into a table** アクションを追加します。スプレッドシートを指定し、列フィールドとトリガーの入力パラメーターをマッピングします。アクション名は `Add new candidate row` に変更します。

![The properties of the flow action to add a new row to the Excel spreadsheet table. There are the coordinates of the target file and the column fields mapping to the input argument of the triggering action invoked by Copilot.](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-03.png)

終了アクション `Respond to Copilot` を選択し、プロパティを編集して `Text` 型の出力パラメーター `Result` を追加します。値には、入力パラメーターに基づいてメッセージを生成する式を設定します。

![The properties of the flow action `Respond to Copilot`. There is an output parameter with a calculated value based on the input parameters provided and confirming that the candidate was inserted into the target list.](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-04.png)

**Save draft** を選択し、**Overview** タブでフロー名を編集します。例: `Insert new candidate for HR`。フローを公開し、エージェントのツール画面に戻ります。再度ツール追加ダイアログを開き、**Flow** フィルターを選択すると作成した Agent flow が表示されます。見つからない場合は名前で検索してください。

![The list of tools with the new flow available in the group of **Flow** items.](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-05.png)

新しいツールを選択し、**Add and configure** を選択して以下の設定を行います。

- Name: Insert new candidate for HR  
- Description: HR 向け Excel スプレッドシートに新しい候補者を追加します  

**Save** を選択するとツールが準備完了です。次のプロンプトでツールを呼び出してみましょう。

```txt
Insert a new candidate into the Excel spreadsheet of HR. The candidate firstname is John, 
the lastname is White, the role is "HR Administrator", and the expertise is "Compliance".
```

前ステップ同様、初回は Excel Online への接続が必要です。**Connect** を選択し、接続後 **Retry** を選択してツールを実行します。

![The Activity map while invoking the new tool. The agent is prompting the user to connect and then retry invoking the tool.](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-06.png)

ツール実行後、Power Automate フローで設定したレスポンス メッセージが表示され、Excel スプレッドシートのテーブルに新しい候補者が追加されます。

<cc-end-step lab="mcs3" exercise="1" step="3" />

## エクササイズ 2 : トピック内からのツール呼び出し

このエクササイズでは、作成したツールをトピック内から呼び出します。

### ステップ 1: トピックからツールを呼び出す

まず空のトピックを作成し、名前を `Add a new candidate to Excel` にします。[ラボ MCS2 のエクササイズ 4](../02-topics#exercise-4--using-adaptive-cards){target=_blank} と同じ手順に従ってください。

トリガーの説明例:

```txt
This topic helps users to insert new candidates in the Excel spreadsheet of HR.
Triggering sentences can be: add a new a new row to the persistence storage.
```

簡潔にするため詳細はここでは扱いません。必要に応じてラボ MCS2 を参照してください。

以下は、**Ask with adaptive card** アクションで候補者情報を収集するためのアダプティブ カードの JSON です。

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

その後、**Add an tool** グループから新しいツールを追加し、**Tool** タブで [エクササイズ 1 - ステップ 3](#step-3-consuming-a-power-automate-flow) で作成したツールを選択します。

![The topic designer while adding a new tool from the current agent. There is the list of all the tools defined in the agent, available under the group **Add a tool**.](../../../assets/images/make/copilot-studio-03/use-action-in-topic-01.png)

次に、ツールの入力引数をアダプティブ カードで取得した変数にマッピングします。

![The tool configuration when setting the values for the input arguments expected by the tool definition. There is a "+ Set value" command and a list of input (text, text_1, text_2, and text_3) mapping to the actual input arguments of the Agent flow.](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02a.png)

各入力引数について **+ Set value** を選択し、以下のように対応付けます。

- text: 名前  
- text_1: 姓  
- text_2: 現在の役職  
- text_3: 専門分野  

Copilot Studio のデータ バインディングを使用して、各入力引数にトピック レベル変数を割り当てます。最終的にツール アクションは次のようになります。

![The tool and all of its input arguments configured to match the corresponding topic variables with values collected by the user through an adaptive card.](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02b.png)

**End current topic** アクションを追加し、保存します。

ラボ MCS2 で作成した他のトピックを無効にし、次のプロンプトで新しいトピックを呼び出して Excel スプレッドシートに新しい候補者行を追加します。

```txt
Add a new a new row to the persistence storage
```

アダプティブ カードに情報を入力して送信すると、トピック経由でツールが実行され、Excel スプレッドシートに新しい候補者が追加されます。

![The interaction with the topic to create a new candidate row in the Excel spreadsheet and the update table in Excel.](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02.png)

<cc-end-step lab="mcs3" exercise="2" step="1" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントがツールをサポートしました。次のラボでは、Copilot Studio を使用して Microsoft 365 Copilot Chat 用の Declarative Agents を作成する方法を学習します。

<a href="../04-extending-m365-copilot">ここから</a> ラボ MCS4 を開始し、Microsoft 365 Copilot Chat 用の Declarative Agents を Copilot Studio で作成する方法を学びましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/03-actions--ja" />