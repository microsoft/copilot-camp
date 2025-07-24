---
search:
  exclude: true
---
# ラボ MCS3 - ツール定義

このラボでは、 Microsoft Copilot Studio  におけるツールの作成方法について学習します。ツールはエージェントのコアな基本構成要素のひとつです。ツールを利用することで、外部 Power Platform コネクター（ネイティブまたはカスタム）、外部 REST API、Power Automate フロー、 MCP (Model Context Protocol) サーバーなどへの対応を追加し、エージェントの機能を拡張できます。

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
    このラボは前のラボ [ラボ MCS2](../02-topics){target=_blank} を基にしています。同じエージェントで作業を継続し、新たな機能を追加することでその機能性を向上させることができるはずです。

ツールはグラフィカルデザイナーを使用して作成できます。新しいツールを作成した後、必要に応じて詳細な微調整を行うため、低レベルのコードエディターでその定義を編集することも可能です。

このラボで学習する内容:

- Power Platform コネクターを呼び出すツールの作成方法
- Power Automate フローを呼び出すツールの作成方法
- トピックからツールを呼び出す方法

## 演習 1 : Microsoft Copilot Studio でのツール作成

この演習では、[ラボ MCS2](../02-topics){target=_blank} で作成したエージェントを拡張し、SharePoint Online の文書ライブラリーに保存された Excel スプレッドシートから架空の候補者リストを取得するために Excel Online を利用します。その後、同じスプレッドシートに新しい候補者を追加できる Power Automate フローを利用するツールを追加します。

### Step 1: Power Platform コネクターの利用

新しいツールを作成するには、画面上部で 1️⃣ **Tools** タブを選択し、次に 2️⃣ **+ Add a tool** を選択して新しいツールの作成を開始します。

![Microsoft Copilot Studio の新規ツール作成画面。**Tools** タブがハイライト表示され、**+ Add a tool** コマンドが表示されています。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-01.png)

ツールの種類を選択するためのダイアログウィンドウが表示されます。初期設定では、Excel Online のコンテンツやその他の一般的なサービスと連携することができる **Featured** ツールなどいくつかのツールが用意されています。

![Microsoft Copilot Studio の新規ツール作成画面。**Featured** ツールの一覧と、新しいツールを作成するための「+ New tool」コマンドが表示されています。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02a.png)

**+ New tool** コマンドを選択して、以下の選択肢から新しいツールを一から作成することもできます：

- Prompt： 自然言語で記述されたプロンプトを使用して構築された AI ツールを利用できます。
- Agent flow： Power Automate フローを利用できます（[Step 2](#step-2-testing-the-new-tool) を参照）。
- Custom connector： Power Platform のカスタム コネクターを利用できます。
- REST API： 外部 REST API を利用できます。詳細は [here](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank} をご覧ください。
- Model Context Protocol： 外部 Model Context Protocol (MCP) サーバーからツールを利用するためのものです。

![利用可能な選択肢： Prompt、Agent flow、Custom connector、REST API、Model Context Protocol を表示する新しいツール作成ダイアログです。Featured ツールに戻るための「Back」コマンドもあります。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02.png)

もし一覧内に目的のオプションが見当たらない場合は、単に **All** グループに切り替え、テキストで検索してください。

現在のステップを完了するには、Featured ツールの **Excel Online (Business)** を選択し、次に **List rows present in a table** を選択します。まずは、**Connection** を選択し、**Create new connection** を選択してプロセスを進め、外部コネクターに接続する必要があります。

![対象の Power Platform コネクターへの接続に関する詳細や、新たな接続を作成するためのボタンが表示されるダイアログです。再度最初から始めるための戻るボタンもあります。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

アカウントにログインして Excel Online (Business) へのアクセスを許可する必要があります。接続が構成されると、ツールを **Add to agent** あるいは **Add and configure** するためのコマンドが表示されたダイアログが現れます。

![エージェントに実際のツールを追加するためのダイアログです。**Add to agent** または **Add and configure** のコマンドが表示され、再度最初から始めるための戻るボタンもあります。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03b.png)

次に、実際のツールを構成するページが表示されます。以下の項目を指定する必要があります：

- Name： ツールの説明的な名前を指定します。
- Description： 生成的オーケストレーションでツールの利用タイミングを判定するために使用される自然言語による説明文です。
- Inputs： ツールの入力引数（存在する場合）を定義します。
- Completion： ツールが要求をどのように処理し、ユーザーに応答するかを定義します。

ツールの構成を行う前に、候補者のリストが記載された Excel スプレッドシートを準備する必要があります。
こちらの [link](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank} を選択して、サンプルの Excel ファイルをダウンロードしてください。

ファイルを、 Microsoft Copilot Studio  でエージェントを作成している同一テナント内の SharePoint Teams サイトの **Documents** ライブラリーにアップロードしてください。この文書は、架空の候補者リストを用意するために Microsoft 365 Copilot によって生成されました。

- サイトの絶対 URL をコピーします。例： `https://xyz.sharepoint.com/sites/contoso/`
- 文書ライブラリーの名前をコピーします。例： `Shared documents`
- ファイル名もコピーしてください。例： `Sample-list-of-candidates.xlsx`

次に、Microsoft Copilot Studio に戻り、ツールの構成を完了してください。

![Name、Description、Inputs、Completion を設定するためのツール構成ダイアログです。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-04.png)

以下の設定を使用します：

- Name： List HR candidates
- Description： List candidates for an HR role

次に **Inputs** タブを選択し、入力引数の設定を開始してください。

デフォルトでは、すべての必須の入力引数は、各入力引数の **Fill as** プロパティに `Dynamically fill with AI` と表示されるように設定されています。

![各入力引数に対する特定の設定と、値として `Dynamically fill with AI` を示す「Fill as」が表示されるタブです。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-05.png)

各入力引数の **Fill using** 設定を選択し、静的な値を指定するために `Custom value` に切り替えてください。

以下の静的な値を使用します：

- Location： Excel スプレッドシートを保存した SharePoint Online サイト コレクションの URL を使用します。例： `https://xyz.sharepoint.com/sites/contoso/`
- Document Library： Excel スプレッドシートを保存した文書ライブラリーの名前を使用します。例： `Shared Documents`
- File： Excel ファイルの名前を指定します。例： `Sample-list-of-candidates.xlsx`
- Table： `Candidates_Table`

Microsoft Copilot Studio のネイティブ UI を通じて、サイト、ライブラリー、ファイル、テーブルを参照することができます。

![各入力引数の設定一覧が表示されるタブです。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-06.png)

画面右上の **Save** ボタンを選択して、更新したツールを保存してください。

<cc-end-step lab="mcs3" exercise="1" step="1" />

### Step 2: 新規ツールのテスト

これで、更新されたエージェントを公開し、統合テストパネルまたは Microsoft Teams で動作を試す準備が整いました。

[ラボ MCS2](../02-topics){target=_blank} で生成的オーケストレーションを有効にしているため、エージェントに以下のようなプロンプトを提供するだけで、先ほど作成したツールを簡単に呼び出すことができます：

```txt
Show me the list of candidates for an HR role
```

生成的オーケストレーションを利用してテストパネル内でプロンプトを呼び出す際の Copilot Studio の大きな利点は、デフォルトでオーケストレーターの動作を調査するための Activity map が表示される点です。以下のスクリーンショットでは、前述のプロンプトに対する Activity map を見ることができます。オーケストレーターはプロンプトに基づいてユーザーの意図を把握し、 Step 1 で作成したツールを起動します。また、手動で定義された入力引数を検証することも可能です。

Power Platform コネクターは有効な接続が必要なため、外部データソースを利用する前に、エージェントはユーザーに **Connect** を促します。

![提案されたプロンプトを提供するエージェントの画面です。ページ本体にはすべての手動で定義された入力引数と共に Activity map が表示され、テストパネルには外部コネクターへ接続するためのプロンプトもあります。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-09.png)

**Connect** ボタンを選択して接続を有効化してください。新しいブラウザタブで、現在のセッションの有効な接続一覧（`Excel Online (Business)` への接続を含む）が表示されます。**Create or pick a connection** というタイトルが付いた専用ダイアログを通じて接続を有効化するため、**Connect** リンクを選択してください。接続が完了したらエージェントに戻り、**Retry** コマンドを選択して対象接続に対してツールを実行してください。テストパネルには、Excel スプレッドシートから取得された候補者リストが表示されます。

![Excel スプレッドシートから取得された候補者リストが表示されるツールの出力を示すテストパネルです。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-10.png)

お疲れさまでした。これで、次のステップに進むことができます。

<cc-end-step lab="mcs3" exercise="1" step="2" />

### Step 3: Agent flow の利用

このステップでは、Power Automate フローを利用するツールを作成します。たとえば、ユーザーの入力に基づいて Excel スプレッドシートに新しい候補者を追加したい場合、Excel スプレッドシート内のテーブルに新しい行を追加する外部 Power Automate フローを呼び出すツールを簡単に作成できます。

このようなツールを作成するには、画面上部で **Tools** タブを選択し、次に **+ Add a tool** を選択して新しいツールの作成を開始します。今回は、**+ New tool** ボタンを選択し、さらに **Agent flow** を選択してください。すると、**Agent flows** デザイナーが開き、新しいフローが表示されます。

![エージェント用のカスタムツールを定義するための Agent flow の初期デザインです。トリガーアクション「When an agent calls the flow」と、終了アクション「Respond to the agent」が含まれています。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-01.png)

このフローは、 `When an agent calls the flow` という名前の初期トリガーアクションと、 `Respond to the agent` という名前の最終アクションを持っています。基本的な考え方は、これら二つのアクションの間に独自の業務プロセスを定義できる点にあり、 Copilot Studio ツールがその業務プロセスを起動し、最終的に一つ以上の入力引数を提供し、エージェントに応答を返します。最初のアクションを選択してプロパティを編集してください。フローの入力引数のセットを構成することで、Copilot Studio はアクション起動時にそのフローへ入力を供給することが可能となります。

![firstname、lastname、role、expertise の 4 つの入力引数が設定されたトリガーアクションのプロパティです。また、入力引数のサポートされる型の一覧も表示されています。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-02.png)

新しい候補者を追加できるようにするため、次の設定で 4 つの入力パラメーターを構成してください：

- Firstname： text
- Lastname： text
- Role： text
- Expertise： text

次に、既存の 2 つのアクションの間に、 **Excel Online (Business)** コネクターからの **Add a row into a table** タイプの新しいアクションを追加します。
新しいフローアクションを構成して、候補者リストが記載された Excel スプレッドシートを対象としてください。行の列フィールドを、 Copilot によって呼び出されるトリガーアクションで定義された実際の入力パラメーターに対応付け、アクション名を `Add new candidate row` に変更してください。以下のスクリーンショットでアクションの構成を確認できます。

![Excel スプレッドシートのテーブルに新しい行を追加するフローアクションのプロパティです。対象ファイルの座標と、Copilot によって呼び出されるトリガーアクションの入力引数にマッピングされた列フィールドが表示されています。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-03.png)

次に、最終アクションである `Respond to Copilot` を選択し、そのプロパティを編集して、型 `Text`、名前 `Result` の出力パラメーターを追加します。出力パラメーターの値を、以下のスクリーンショットに示すようなメッセージを生成する数式に設定してください。

![`Respond to Copilot` フローアクションのプロパティです。入力パラメーターに基づいて計算された値を持つ出力パラメーターがあり、候補者が対象リストに挿入されたことを確認しています。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-04.png)

次に、**Save draft** を選択し、**Overview** タブでフローの名前を更新して、エージェントフローの **Details** を編集します。例えば、 `Insert new candidate for HR` といった名前を使用できます。フローを公開して、ツールを編集中のエージェントに戻ります。新しいツールを追加するためのダイアログウィンドウを再度開き、フィルターとして **Flow** を選択すると、先ほど作成した新しい Agent flow が表示されます。表示されない場合は、名前で検索してみてください。

![**Flow** アイテムのグループ内に、新しいフローが表示されたツールの一覧です。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-05.png)

新しいツールを選択し、次のダイアログウィンドウで **Add and configure** を選択して、Step 1 と同様に設定を行い、利用してください。例えば、次の設定を使用します：

- Name： Insert new candidate for HR
- Description： Insert new candidate into the Excel spreadsheet for HR

**Save** ボタンを選択すると、Agent flow に基づく新しいツールが準備されます。
次に、以下のプロンプトを使用してツールを起動しましょう：

```txt
Insert a new candidate into the Excel spreadsheet of HR. The candidate firstname is John, 
the lastname is White, the role is "HR Administrator", and the expertise is "Compliance".
```

前のステップと同様に、ツールを初めて使用する際は、Excel Online への接続が必要ですので、まず **Connect** ボタンを選択してください。接続が完了したら、**Retry** ボタンを選択してツールを実行してください。

![新しいツールを呼び出している際の Activity map です。エージェントはユーザーに接続を促し、その後ツールの再実行を求めています。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-06.png)

ツールの実行後、エージェントが Power Automate フローで定義した応答メッセージを返すのが確認でき、さらに、新しい候補者が Excel スプレッドシート内のテーブルに追加されます。

<cc-end-step lab="mcs3" exercise="1" step="3" />

## 演習 2 : トピックからツールを呼び出す

この演習では、先ほど定義したツールをトピック内で利用します。

### Step 1: トピックからツールを呼び出す

まず、ブランクから新しいツールを作成し、名前を `Add a new candidate to Excel` と設定してください。そして、[ラボ MCS2 の Exercise 4 -- using adaptive cards](../02-topics#exercise-4--using-adaptive-cards){target=_blank} で定義された手順に従ってください。

トリガーの説明は、以下のような内容にすることができます：

```txt
This topic helps users to insert new candidates in the Excel spreadsheet of HR.
Triggering sentences can be: add a new a new row to the persistence storage.
```

簡略化のため、ここではすべての手順を説明しません。詳細についてはラボ MCS2 を参照してください。

以下に、候補者に関する入力引数を **Ask with adaptive card** アクションを通じて収集するために利用できる adaptive card の JSON を示します。

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

次に、**Add a tool** グループから新しいツールを追加し、**Tool** タブを選択して、[Exercise 1 - Step 3](#step-3-consuming-a-power-automate-flow) で先ほど作成したツールを選択してください。

![現在のエージェントから新しいツールを追加しているトピックデザイナーです。エージェントに定義されたすべてのツールが、**Add a tool** グループ内に一覧表示されています。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-01.png)

次に、ツールの入力引数を、ユーザーが adaptive card を通じて収集した変数にマッピングする必要があります。

![ツール定義で期待される入力引数に値を設定する際のツール設定画面です。`+ Set value` コマンドと、Agent flow の実際の入力引数にマッピングされる入力（text, text_1, text_2, text_3）の一覧が表示されています。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02a.png)

各入力引数に対して **+ Set value** を選択し、以下のように対応する引数を選択してください：

- text： ファーストネームを表します。
- text_1： ラストネームを表します。
- text_2： 現在の役割を表します。
- text_3： 専門知識を表します。

次に、Copilot Studio のデータバインディングを使用して、**Ask with adaptive card** アクションを通じてユーザーから収集した対応するトピックレベルの変数に各入力引数を設定します。最終的に、ツールアクションは以下の画像のようになります。

![ユーザーが adaptive card を通じて収集した値で、対応するトピック変数にマッピングされたツールとそのすべての入力引数の設定が表示されています。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02b.png)

**End current topic** アクションを追加して保存してください。

次に、ラボ MCS2 で作成した他のトピックを無効にし、以下のプロンプトを使用して、Excel スプレッドシートに新しい候補者の行を挿入するために新しいトピックを実行してください：

```txt
Add a new a new row to the persistence storage
```

adaptive card に入力し、リクエストを送信してください。ツールはトピックを通じて起動され、Excel スプレッドシートに新たな候補者が追加されます。

![Excel スプレッドシートに新しい候補者の行を作成し、テーブルが更新される際のトピックとのやり取りです。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02.png)

<cc-end-step lab="mcs3" exercise="2" step="1" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントはツールに対応しました。次のラボでは、 Copilot Studio を利用して Microsoft 365 Copilot Chat 用の Declarative Agents を作成する方法について学習します。

<a href="../04-extending-m365-copilot">こちら</a>からラボ MCS4 を開始し、 Microsoft 365 Copilot Chat 用の Declarative Agents を作成するための Copilot Studio の利用方法を学んでください。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/03-actions" />