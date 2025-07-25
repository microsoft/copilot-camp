---
search:
  exclude: true
---
# ラボ MCS3 - ツールの定義

Microsoft Copilot Studio でツールを作成する方法を学びます。ツールはエージェントのもう一つのコア構成要素で、外部の Power Platform コネクター (ネイティブまたはカスタム)、外部 REST API、Power Automate フロー、MCP サーバーなどへの対応を追加してエージェントの機能を拡張できます。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ZVHkBiH6RxQ" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を短くご覧ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前回の [ラボ MCS2](../02-topics){target=_blank} を基にしています。同じエージェントを引き続き使用し、新しい機能を追加して強化できます。

ツールはグラフィカル デザイナーで作成できます。作成後、詳細な微調整が必要な場合はロー レベルのコード エディターで定義を編集することも可能です。

このラボでは次のことを学びます。

- Power Platform コネクターを呼び出すツールの作成方法  
- Power Automate フローを呼び出すツールの作成方法  
- トピックからツールを呼び出す方法  

## Exercise 1 : Microsoft Copilot Studio でのツール作成

この演習では、[ラボ MCS2](../02-topics){target=_blank} で作成したエージェントを拡張し、Excel Online を使って SharePoint Online のドキュメント ライブラリに保存されている Excel スプレッドシートから仮想的な候補者リストを取得します。さらに同じスプレッドシートに新しい候補者を追加できる Power Automate フローを使用するツールも追加します。

### Step 1: Power Platform コネクターの利用

新しいツールを作成するには、画面上部の 1️⃣ **Tools** タブを選択し、2️⃣ **+ Add a tool** を選択します。

![Microsoft Copilot Studio で新しいツールを作成する際のインターフェイス。**Tools** タブと **+ Add a tool** コマンドがハイライトされています。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-01.png)

ツールの種類を選択するダイアログが表示されます。既定では **Featured** に Excel Online などよく使用されるサービス用ツールがいくつかあります。 

![新しいツールを作成するダイアログ。Featured ツールの一覧と "+ New tool" コマンドがあります。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02a.png)

**+ New tool** を選択して次のオプションから作成することもできます。

- Prompt : 自然言語で記述したプロンプトを使用して AI ツールを利用  
- Agent flow : Power Automate フローを利用 ( [Step 2](#step-2-consuming-a-power-automate-flow) 参照)  
- Custom connector : Power Platform のカスタム コネクターを利用  
- REST API : 外部 REST API を利用。詳細は [こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank}  
- Model Context Protocol : 外部 MCP サーバーのツールを利用  

![新しいツールを作成するダイアログ。Prompt、Agent flow、Custom connector、REST API、Model Context Protocol のオプションがあります。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02.png)

Featured に目的のオプションがない場合は **All** グループに切り替えてテキスト検索してください。

ここでは **Excel Online (Business)** を選択し、**List rows present in a table** を選択します。最初に **Connection** で **Create new connection** を選択し、外部コネクターに接続します。

![Power Platform コネクターへの接続ダイアログ。接続情報が表示され、新規接続ボタンがあります。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

自分のアカウントでサインインし、Excel Online (Business) へのアクセスを許可します。接続が構成されると **Add to agent** または **Add and configure** のコマンドが表示されます。

![ツールをエージェントに追加するダイアログ。**Add to agent** と **Add and configure** コマンドがあります。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03b.png)

次にツールを設定するページが表示されます。入力する項目は以下のとおりです。

- Name : ツールの説明的な名前  
- Description : ジェネレーティブ オーケストレーションがツール使用タイミングを判断するための自然言語の説明  
- Inputs : ツールの入力パラメーター定義  
- Completion : ツールがユーザーの要求と応答をどのように処理するか  

ツールを設定する前に候補者リストを含む Excel ファイルを準備します。  
[こちらのリンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank} からサンプル ファイルをダウンロードしてください。

同じテナントの SharePoint Teams サイトの **Documents** ライブラリにアップロードします。これは Microsoft 365 Copilot で作成した仮の候補者リストです。

- サイトの絶対 URL をコピー例: `https://xyz.sharepoint.com/sites/contoso/`  
- ドキュメント ライブラリ名をコピー例: `Shared documents`  
- ファイル名をコピー例: `Sample-list-of-candidates.xlsx`  

Microsoft Copilot Studio に戻ってツール設定を完了します。

![ツールを設定するダイアログ。Name、Description、Inputs、Completion の設定があります。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-04.png)

設定例:

- Name: List HR candidates  
- Description: List candidates for an HR role  

**Inputs** タブで入力パラメーターを設定します。既定では必須項目が **Fill as** の値 `Dynamically fill with AI` で設定されています。

![ツールの入力パラメーター設定タブ。各パラメーターが "Fill as" に "Dynamically fill with AI" を設定。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-05.png)

各パラメーターの **Fill using** を `Custom value` に変更し、以下の固定値を入力します。

- Location : 例 `https://xyz.sharepoint.com/sites/contoso/`  
- Document Library : 例 `Shared Documents`  
- File : 例 `Sample-list-of-candidates.xlsx`  
- Table : `Candidates_Table`

サイト、ライブラリ、ファイル、テーブルは UI から参照できます。

![入力パラメーターを設定した例。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-06.png)

画面右上の **Save** を選択してツールを保存します。

<cc-end-step lab="mcs3" exercise="1" step="1" />

### Step 2: 新しいツールのテスト

更新したエージェントを発行し、統合テスト パネルまたは Microsoft Teams で試します。

[ラボ MCS2](../02-topics){target=_blank} でジェネレーティブ オーケストレーションを有効にしたので、次のようなプロンプトを渡すだけで簡単にツールを呼び出せます。

```txt
Show me the list of candidates for an HR role
```

Copilot Studio のテスト パネルでプロンプトを使用するとデフォルトで Activity map が表示され、オーケストレーターの動作を確認できます。下図は先ほどのプロンプトの Activity map です。オーケストレーターがユーザーの意図を特定し、Step 1 で作成したツールを起動していることがわかります。手動で設定した入力パラメーターも確認可能です。

Power Platform コネクターには有効な接続が必要なため、エージェントはユーザーに **Connect** を促します。

![Activity map と接続プロンプト。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-09.png)

**Connect** を選択して接続を有効化します。新しいブラウザー タブで現在のセッションの接続一覧が表示され、`Excel Online (Business)` への接続が含まれています。**Connect** リンクを選択し **Create or pick a connection** ダイアログで接続を作成します。接続後、エージェントに戻り **Retry** を選択してツールを実行します。テスト パネルに Excel から取得した候補者リストが表示されます。

![ツールの出力として候補者リストが表示されているテスト パネル。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-10.png)

ここまで順調です。次のステップへ進みましょう。

<cc-end-step lab="mcs3" exercise="1" step="2" />

### Step 3: Agent flow の利用

ここでは Power Automate フローを呼び出すツールを作成します。ユーザー入力に基づき Excel スプレッドシートに新しい候補者を追加したいとします。そのために外部 Power Automate フローを呼び出し、テーブルに行を追加するツールを作成します。

画面上部の **Tools** タブで **+ Add a tool** を選択し、**+ New tool** → **Agent flow** を選択します。**Agent flows** デザイナーが開き、新しいフローが表示されます。

![Agent flow の初期デザイン。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-01.png)

フローには `When an agent calls the flow` というトリガーと `Respond to the agent` という終了アクションがあります。この間に任意のビジネス プロセスを定義し、Copilot Studio ツールが入力パラメーターを渡して起動し、結果を返します。トリガー アクションを選択して入力パラメーターを設定します。

![トリガー アクションのプロパティ。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-02.png)

以下の 4 つの入力パラメーターを追加します。

- Firstname : text  
- Lastname : text  
- Role : text  
- Expertise : text  

次に、2 つのアクションの間に **Excel Online (Business)** コネクターの **Add a row into a table** アクションを追加します。候補者リストの Excel に接続し、列フィールドをトリガーの入力パラメーターにマッピングします。アクション名を `Add new candidate row` に変更します。

![行追加アクションの設定。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-03.png)

最後の `Respond to Copilot` アクションで出力パラメーター `Result` (Text) を追加し、メッセージを計算式で設定します。

![Respond to Copilot の設定。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-04.png)

**Save draft** し、**Overview** タブの **Details** でフロー名を `Insert new candidate for HR` などに変更します。フローを発行し、ツールを編集していたエージェントに戻ります。新しいツールを追加するダイアログで **Flow** フィルターを選択すると作成した Agent flow が表示されます。見つからない場合は名前で検索します。

![Flow グループに新しいフローが表示。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-05.png)

新しいツールを選択し **Add and configure** で設定します。例:

- Name: Insert new candidate for HR  
- Description: Insert new candidate into the Excel spreadsheet for HR  

**Save** を選択してツールを準備します。次のプロンプトでツールを呼び出してみましょう。

```txt
Insert a new candidate into the Excel spreadsheet of HR. The candidate firstname is John, 
the lastname is White, the role is "HR Administrator", and the expertise is "Compliance".
```

初回利用時は Excel Online への接続が必要です。**Connect** を選択し、接続後 **Retry** を選択してください。

![ツール呼び出し中の Activity map。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-06.png)

実行後、Power Automate フローで定義した応答メッセージが返り、Excel テーブルに新しい候補者が追加されます。

<cc-end-step lab="mcs3" exercise="1" step="3" />

## Exercise 2 : トピック内からツールを呼び出す

この演習では、作成したツールをトピック内から利用します。

### Step 1: トピックからツールを呼び出す

まず空のトピックを作成し、名前を `Add a new candidate to Excel` とします。[ラボ MCS2 の Exercise 4](../02-topics#exercise-4--using-adaptive-cards){target=_blank} と同様の手順に従ってください。

トリガーの説明例:

```txt
This topic helps users to insert new candidates in the Excel spreadsheet of HR.
Triggering sentences can be: add a new a new row to the persistence storage.
```

詳細は簡略化のため割愛しますが、必要に応じてラボ MCS2 を参照してください。

以下は **Ask with adaptive card** アクションで候補者情報を取得するためのアダプティブ カード JSON です。

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

次に **Add an tool** グループから **Tool** タブを選択し、[Exercise 1 - Step 3](#step-3-consuming-a-power-automate-flow) で作成したツールを選択します。

![トピック デザイナーでツールを追加している例。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-01.png)

ツールの入力パラメーターをアダプティブ カードで収集した変数にマッピングします。

![入力パラメーター マッピング設定。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02a.png)

**+ Set value** を選択し、次のように対応付けます。

- text : 名  
- text_1 : 姓  
- text_2 : 現在の役職  
- text_3 : 専門分野  

Copilot Studio のデータ バインディングを使用して各入力をトピック レベル変数に設定します。最終的には次のようになります。

![ツールと入力パラメーターがトピック変数にバインドされた例。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02b.png)

**End current topic** アクションを追加して保存します。

ラボ MCS2 で作成した他のトピックを無効化し、次のプロンプトで新しいトピックを呼び出して Excel に行を追加します。

```txt
Add a new a new row to the persistence storage
```

アダプティブ カードに入力し送信すると、トピック経由でツールが呼び出され、Excel にさらに候補者が追加されます。

![トピックとの対話と Excel での更新結果。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02.png)

<cc-end-step lab="mcs3" exercise="2" step="1" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントがツールをサポートしました。次のラボでは、Copilot Studio を使用して Microsoft 365 Copilot Chat 用の Declarative Agents を作成する方法を学びます。

<a href="../04-extending-m365-copilot">Start here</a> からラボ MCS4 を開始し、Copilot Studio で Microsoft 365 Copilot Chat 用 Declarative Agents を作成する方法を学んでください。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/03-actions" />