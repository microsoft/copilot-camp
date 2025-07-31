---
search:
  exclude: true
---
# ラボ MCS3 - ツールの定義

このラボでは、Microsoft Copilot Studio でツールを作成する方法を学習します。ツールはエージェントのもう 1 つの主要な構成要素であり、外部の Power Platform コネクター（ネイティブまたはカスタム）、外部 REST API、Power Automate フロー、MCP (Model Context Protocol) サーバーなどを追加してエージェントの機能を拡張できます。

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
    このラボは前回の [ラボ MCS2](../02-topics){target=_blank} を基にしています。同じエージェントを引き続き使用し、新しい機能で改善できます。

ツールはグラフィカル デザイナーを使用して作成できます。ツールを作成した後、詳細な微調整が必要な場合は、低レベルのコード エディターで定義を編集することも可能です。

このラボで学習する内容:

- Power Platform コネクターを呼び出すツールの作成方法
- Power Automate フローを呼び出すツールの作成方法
- トピックからツールを呼び出す方法

## 演習 1 : Microsoft Copilot Studio でツールを作成する

この演習では、[ラボ MCS2](../02-topics){target=_blank} で作成したエージェントを拡張し、SharePoint Online のドキュメント ライブラリに保存された Excel スプレッドシートから、候補者の仮想リストを取得できるようにします。その後、同じスプレッドシートに新しい候補者を追加できる Power Automate フローを呼び出すツールを追加します。

### 手順 1: Power Platform コネクターの利用

新しいツールを作成するには、画面上部の 1️⃣ **ツール** タブを選択し、2️⃣ **+ ツールを追加** を選択します。

![Microsoft Copilot Studio で新しいツールを作成する画面インターフェイス。**ツール** タブと **+ ツールを追加** コマンドが強調表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-01.png)

ツールの種類を選択するダイアログが表示されます。既定では **Featured** ツールがいくつか表示され、Excel Online などの一般的なサービスと連携できます。 

![Microsoft Copilot Studio で新しいツールを作成するダイアログ。「Featured」ツールの一覧と、新しいツールを作成する **+ New tool** コマンドが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02a.png)

**+ New tool** コマンドを選択すると、以下から選択してゼロからツールを作成できます。

- Prompt: 自然言語で記述したプロンプトによる AI ツールを利用します。
- Agent flow: Power Automate フローを利用します（[手順 2](#step-2-consuming-a-power-automate-flow) を参照）。
- Custom connector: Power Platform のカスタム コネクターを利用します。
- REST API: 外部 REST API を利用します。詳細は [こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank}。
- Model Context Protocol: 外部 MCP サーバーのツールを利用します。

![新しいツールを作成するダイアログ。Prompt、Agent flow、Custom connector、REST API、Model Context Protocol のオプションが表示されている。「Back」で Featured ツールに戻ることもできる。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02.png)

目的のオプションが Featured にない場合は **All** グループに切り替え、テキスト検索します。

今回は **Excel Online (Business)** の Featured ツールを選択し、**List rows present in a table** を選びます。まずは **Connection** を **Create new connection** で作成し、外部コネクターに接続します。

![Power Platform コネクターへ接続するダイアログ。接続の詳細または新しい接続を作成するボタンが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

アカウントでサインインし、Excel Online (Business) へのアクセスを許可します。接続が構成されると、**Add to agent** または **Add and configure** のコマンドが表示されます。

![エージェントにツールを追加するダイアログ。「Add to agent」または「Add and configure」のコマンドがある。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03b.png)

次にツールの設定ページが開きます。設定する項目:

- Name: ツールのわかりやすい名前
- Description: ジェネレーティブ オーケストレーションがツール使用を判断するための自然言語説明
- Inputs: ツールの入力引数
- Completion: ユーザーへのリクエストとレスポンスの処理方法

ツールを構成する前に、候補者リスト用の Excel スプレッドシートを準備します。
この [リンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank} からサンプル Excel ファイルをダウンロードしてください。

同じテナントの SharePoint Teams サイトの **Documents** ライブラリにアップロードします。このドキュメントは仮想の候補者リストとして Microsoft 365 Copilot で生成されています。

- サイトの絶対 URL をコピー: 例 `https://xyz.sharepoint.com/sites/contoso/`
- ドキュメント ライブラリ名をコピー: 例 `Shared documents`
- ファイル名をコピー: 例 `Sample-list-of-candidates.xlsx`

Microsoft Copilot Studio に戻り、ツール設定を完了します。

![ツールの設定ダイアログ。Name、Description、Inputs、Completion がある。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-04.png)

次の設定を使用します。

- Name: List HR candidates
- Description: List candidates for an HR role

続いて **Inputs** タブを開き、入力引数を設定します。
既定では必須の引数が **Fill as** に `Dynamically fill with AI` と設定されています。

![ツールの入力引数を設定するタブ。各引数の「Fill as」が「Dynamically fill with AI」になっている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-05.png)

各入力引数の **Fill using** を選択し、`Custom value` に切り替えて静的値を入力します。

静的値:

- Location: スプレッドシートを保存した SharePoint Online サイト コレクションの URL 例 `https://xyz.sharepoint.com/sites/contoso/`
- Document Library: ドキュメント ライブラリ名 例 `Shared Documents`
- File: Excel ファイル名 例 `Sample-list-of-candidates.xlsx`
- Table: `Candidates_Table`

Microsoft Copilot Studio の UI からサイト、ライブラリ、ファイル、テーブルを参照できます。

![入力引数を設定するタブ。各引数に静的値が設定されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-06.png)

画面右上の **Save** ボタンを選択してツールを保存します。

<cc-end-step lab="mcs3" exercise="1" step="1" />

### 手順 2: 新しいツールのテスト

更新したエージェントを発行し、統合テスト パネルまたは Microsoft Teams で試します。

[ラボ MCS2](../02-topics){target=_blank} でジェネレーティブ オーケストレーションを有効にしているため、次のようなプロンプトで簡単にツールを呼び出せます。

```txt
Show me the list of candidates for an HR role
```

Copilot Studio でテスト パネルのプロンプトを使用すると、デフォルトでオーケストレーターの動作を確認できる Activity map が表示されます。次のスクリーンショットは前述のプロンプトの Activity map です。オーケストレーターがユーザーの意図を識別し、手順 1 で作成したツールをトリガーしています。手動で定義した入力引数も検証できます。

Power Platform コネクターは有効な接続が必要なため、エージェントはユーザーに **Connect** を促します。

![提案したプロンプトを処理しているエージェント。Activity map には手動で設定した入力引数が表示され、テスト パネルには外部コネクターへの接続を促すメッセージがある。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-09.png)

**Connect** ボタンを選択し、接続を有効化します。新しいブラウザー タブに現在のセッションの接続一覧が表示され、その中に `Excel Online (Business)` の接続があります。**Connect** を選択し、**Create or pick a connection** ダイアログで接続を有効にします。接続が完了したらエージェントに戻り、**Retry** を選択してツールを実行します。テスト パネルにスプレッドシートから取得した候補者リストが表示されます。

![テスト パネルに Excel スプレッドシートから取得した候補者リストが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-10.png)

ここまで順調です。次の手順に進みましょう。

<cc-end-step lab="mcs3" exercise="1" step="2" />

### 手順 3: Agent flow の利用

この手順では Power Automate フローを呼び出すツールを作成します。ユーザー入力に基づき、新しい候補者を Excel スプレッドシートに追加するとします。外部 Power Automate フローを呼び出すツールを作成し、テーブルに新しい行を追加します。

まず画面上部の **ツール** タブを選択し、**+ ツールを追加** をクリックします。今回は **+ New tool** → **Agent flow** を選択します。**Agent flows** デザイナーが開き、新しいフローが表示されます。

![Agent flow の初期デザイン。トリガーアクション「When an agent calls the flow」と終了アクション「Respond to the agent」がある。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-01.png)

フローには `When an agent calls the flow` トリガーと `Respond to the agent` アクションがあります。この 2 つの間にビジネス プロセスを定義し、Copilot Studio のツールが入力を渡してプロセスを実行し、エージェントに応答を返します。最初のアクションを選択してプロパティを編集し、フローの入力パラメーターを構成します。

![トリガーアクションのプロパティ。firstname、lastname、role、expertise の 4 つの入力引数がある。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-02.png)

候補者追加のため、次の 4 つの入力パラメーターを設定します。

- Firstname: text
- Lastname: text
- Role: text
- Expertise: text

次に 2 つのアクションの間に **Excel Online (Business)** コネクターの **Add a row into a table** アクションを追加します。
スプレッドシートを指定し、列フィールドにトリガーの入力パラメーターをマップします。アクション名を `Add new candidate row` に変更します。

![Excel スプレッドシートのテーブルに行を追加するフローアクションのプロパティ。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-03.png)

続いて `Respond to Copilot` アクションを編集し、型 `Text` の出力パラメーター `Result` を追加します。出力値には入力パラメーターを使ったメッセージを設定します。

![`Respond to Copilot` アクションのプロパティ。入力値を用いて候補者が追加されたことを示すメッセージが設定されている。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-04.png)

**Save draft** をクリックし、**Overview** タブの **Details** でフロー名を `Insert new candidate for HR` などに変更します。フローを発行し、ツールを編集していたエージェントに戻ります。再びツール追加ダイアログを開き、フィルターを **Flow** にすると先ほどの Agent flow が表示されます。表示されない場合は名前で検索してください。

![**Flow** グループに新しいフローが表示されているツールのリスト。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-05.png)

新しいツールを選択し、**Add and configure** で設定を行います。例:

- Name: Insert new candidate for HR
- Description: Insert new candidate into the Excel spreadsheet for HR

**Save** を選択すると Agent flow ベースのツールが準備完了です。
次のようなプロンプトでツールを呼び出します。

```txt
Insert a new candidate into the Excel spreadsheet of HR. The candidate firstname is John, 
the lastname is White, the role is "HR Administrator", and the expertise is "Compliance".
```

前手順と同様、初回使用時は Excel Online への接続が必要です。**Connect** → **Retry** の順で実行してください。

![新しいツール呼び出し時の Activity map。接続後に Retry を促す。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-06.png)

ツール実行後、Power Automate フローで定義した応答メッセージが表示され、スプレッドシートに新しい候補者が追加されます。

<cc-end-step lab="mcs3" exercise="1" step="3" />

## 演習 2 : トピック内からツールを呼び出す

この演習では、先ほど定義したツールをトピック内で使用します。

### 手順 1: トピックからツールを呼び出す

まず空のツールを作成し、名前を `Add a new candidate to Excel` とします。[ラボ MCS2 の演習 4](../02-topics#exercise-4--using-adaptive-cards){target=_blank} と同じ手順に従ってください。

トリガー説明の例:

```txt
This topic helps users to insert new candidates in the Excel spreadsheet of HR.
Triggering sentences can be: add a new a new row to the persistence storage.
```

詳しい手順は簡略化しますが、必要に応じてラボ MCS2 を参照してください。

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

続いて **Add an tool** グループから **Tool** タブを選択し、[演習 1 - 手順 3](#step-3-consuming-a-power-automate-flow) で作成したツールを選びます。

![トピック デザイナーでツールを追加している画面。エージェントに定義済みのツールが一覧表示されている。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-01.png)

次に、ツールの入力引数をアダプティブ カードで取得した変数にマッピングします。

![ツール設定で入力引数に値を設定している画面。「+ Set value」コマンドがあり、text、text_1 などに Agent flow の引数をマッピングする。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02a.png)

各入力引数の **+ Set value** を選択し、次のように対応させます。

- text: 名
- text_1: 姓
- text_2: 現在の役職
- text_3: 専門分野

Copilot Studio のデータ バインド機能で、それぞれを **Ask with adaptive card** で収集したトピック変数に設定します。
最終的に次のようになります。

![ツールのすべての入力引数が、ユーザーから取得したトピック変数にマッピングされている。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02b.png)

**End current topic** アクションを追加して保存します。

次にラボ MCS2 で作成した他のトピックを無効化し、次のプロンプトで新しいトピックを呼び出して Excel スプレッドシートに新しい候補者を追加します。

```txt
Add a new a new row to the persistence storage
```

アダプティブ カードに入力して送信すると、トピック経由でツールが呼び出され、スプレッドシートに新しい候補者が追加されます。

![トピックで候補者を追加し、Excel のテーブルが更新されたことを示すインターフェイス。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02.png)

<cc-end-step lab="mcs3" exercise="2" step="1" />

---8<--- "ja/mcs-congratulations.md"

これでエージェントがツールをサポートしました。次のラボでは、Copilot Studio を使用して Microsoft 365 Copilot Chat 用の Declarative Agents を作成する方法を学習します。

<a href="../04-extending-m365-copilot">こちらから Lab MCS4</a> を開始し、Copilot Studio で Microsoft 365 Copilot Chat 用の Declarative Agents を作成する方法を学びましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/03-actions--ja" />