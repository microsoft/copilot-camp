---
search:
  exclude: true
---
# Lab MCS3 - ツールの定義

このラボでは、Microsoft Copilot Studio でツールを作成する方法を学習します。ツールはエージェントのもう 1 つのコア構成要素です。ツールを追加することで、外部の Power Platform コネクタ（ネイティブまたはカスタム）、外部 REST API、Power Automate フロー、MCP (Model Context Protocol) サーバーなどを利用し、エージェントの機能を拡張できます。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ZVHkBiH6RxQ" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を短時間で確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    本ラボは前回の [Lab MCS2](../02-topics){target=_blank} の続きです。同じエージェントを使い、新しい機能を追加してさらに改善します。

ツールはグラフィカル デザイナーで作成できます。ツールを作成した後、詳細な調整が必要な場合は、低レベルのコード エディターで定義を編集することもできます。

このラボで学習する内容:

- Power Platform コネクタを呼び出すツールの作成方法
- Power Automate フローを呼び出すツールの作成方法
- トピックからツールを呼び出す方法

## Exercise 1 : Microsoft Copilot Studio でのツール作成

この演習では、[Lab MCS2](../02-topics){target=_blank} で作成したエージェントを拡張し、SharePoint Online ドキュメント ライブラリに保存された Excel スプレッドシートから、候補者の仮想リストを取得するために Excel Online を使用します。さらに、同じスプレッドシートに新しい候補者を追加する Power Automate フローを呼び出すツールを追加します。

### Step 1: Power Platform コネクタの利用

新しいツールを作成するには、画面上部で 1️⃣ **Tools** タブを選択し、2️⃣ **+ Add a tool** を選択します。

![Microsoft Copilot Studio で新しいツールを作成するインターフェイス。**Tools** タブと **+ Add a tool** コマンドが強調表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-01.png)

ダイアログが表示され、作成するツールの種類を選択できます。既定では **Featured** ツールがいくつか用意されており、Excel Online などの一般的なサービスと連携できます。 

![新しいツールを作成するインターフェイス。Featured ツールの一覧と "+ New tool" コマンドが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02a.png)

**+ New tool** を選択して、以下のオプションからツールをゼロから作成することもできます。

- Prompt: 自然言語で書かれたプロンプトを使用して作成された AI ツールを利用します。
- Agent flow: Power Automate フローを利用します（[Step 2](#step-2-consuming-a-power-automate-flow) を参照）。
- Custom connector: Power Platform のカスタム コネクタを利用します。
- REST API: 外部 REST API を利用します。詳細は [こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank} を参照してください。
- Model Context Protocol: 外部 MCP サーバーのツールを利用します。

![新しいツールを作成するダイアログ。Prompt、Agent flow、Custom connector、REST API、Model Context Protocol の各オプションが表示されている。"Back" コマンドで Featured ツールに戻れる。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02.png)

目的のオプションが Featured に見つからない場合は、**All** グループに切り替え、テキスト検索してください。

ここでは **Excel Online (Business)** を選択し、**List rows present in a table** を選択します。まず **Connection** で **Create new connection** を選び、外部コネクタへの接続を作成します。

![対象 Power Platform コネクタへの接続ダイアログ。既存の接続情報と新しい接続を作成するボタンが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

アカウントでログインし、Excel Online (Business) へのアクセスを許可します。接続が構成されたら、**Add to agent** または **Add and configure** を選択できます。

![エージェントにツールを追加するダイアログ。**Add to agent** と **Add and configure** のコマンドが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03b.png)

次にツールの設定ページが開きます。以下を設定します。

- Name: ツールの説明的な名前
- Description: ジェネレーティブ オーケストレーションがツールを使用するタイミングを判断するための自然言語による説明
- Inputs: 入力パラメーターの定義
- Completion: ツールがリクエストとユーザーへのレスポンスをどのように処理するか

ツールを構成する前に、候補者リスト用の Excel スプレッドシートを準備します。次の [リンク](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank} からサンプル Excel ファイルをダウンロードしてください。

同じテナントの SharePoint Teams サイトの **Documents** ライブラリにアップロードします。このドキュメントは例示用です。

- サイトの絶対 URL をコピー: 例 `https://xyz.sharepoint.com/sites/contoso/`
- ドキュメント ライブラリ名をコピー: 例 `Shared documents`
- ファイル名をコピー: 例 `Sample-list-of-candidates.xlsx`

Microsoft Copilot Studio に戻り、ツールの設定を完了します。

![ツールの設定ダイアログ。Name、Description、Inputs、Completion を設定する。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-04.png)

設定例:

- Name: List HR candidates
- Description: List candidates for an HR role

続いて **Inputs** タブを開き、入力パラメーターを設定します。既定では必須の入力パラメーターは **Fill as** が `Dynamically fill with AI` になっています。

![ツールの入力パラメーター設定タブ。各引数が表示され、"Fill as" が "Dynamically fill with AI"。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-05.png)

各入力の **Fill using** を `Custom value` に変更し、すべての入力を固定値にします。

- Location: `https://xyz.sharepoint.com/sites/contoso/`
- Document Library: `Shared Documents`
- File: `Sample-list-of-candidates.xlsx`
- Table: `Candidates_Table`

サイト、ライブラリ、ファイル、テーブルは Copilot Studio の UI から参照できます。

![入力パラメーターの設定が完了した画面。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-06.png)

画面右上の **Save** を選択してツールを保存します。

<cc-end-step lab="mcs3" exercise="1" step="1" />

### Step 2: 新しいツールのテスト

更新したエージェントを公開し、統合テスト パネルまたは Microsoft Teams で試してみましょう。

[Lab MCS2](../02-topics){target=_blank} でジェネレーティブ オーケストレーションを有効にしたので、以下のようなプロンプトを送るだけでツールを呼び出せます。

```txt
Show me the list of candidates for an HR role
```

Copilot Studio のテスト パネルでプロンプトを送ると、Activity map が表示されます。以下のスクリーンショットでは、オーケストレーターがユーザーの意図を認識し、Step 1 で作成したツールを呼び出している様子が確認できます。

Power Platform コネクタの利用には有効な接続が必要なため、エージェントはまず **Connect** を促します。

![Activity map と接続要求が表示された画面。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-09.png)

**Connect** を選択して接続を有効化し、ダイアログ **Create or pick a connection** で接続を確立します。その後エージェントに戻り **Retry** を選択すると、Excel スプレッドシートから候補者リストが取得されます。

![ツール実行後、スプレッドシートから取得した候補者リストが表示されるテストパネル。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-10.png)

ここまで順調です。次のステップへ進みましょう。

<cc-end-step lab="mcs3" exercise="1" step="2" />

### Step 3: Agent flow の利用

このステップでは Power Automate フローを呼び出すツールを作成します。ユーザー入力に基づき、スプレッドシートに新しい候補者を追加します。

1. 画面上部の **Tools** タブ → **+ Add a tool** を選択  
2. **+ New tool** → **Agent flow** を選択  

新しい **Agent flows** デザイナーが開き、フローが生成されます。

![Agent flow デザイナー初期画面。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-01.png)

フローには `When an agent calls the flow` トリガーと `Respond to the agent` アクションがあらかじめ配置されています。Copilot Studio は、トリガーで入力パラメーターを受け取り、フローを実行し、最後にレスポンスを返します。まずトリガーを選択し、以下の入力パラメーターを追加します。

![トリガーアクションのプロパティ設定画面。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-02.png)

- Firstname: text  
- Lastname: text  
- Role: text  
- Expertise: text  

次に **Add a row into a table**（Excel Online (Business) コネクタ）アクションを追加し、スプレッドシートを指定します。列フィールドをトリガーの入力にマッピングし、アクション名を `Add new candidate row` に変更します。

![行追加アクションの設定例。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-03.png)

最後に `Respond to Copilot` アクションのプロパティを開き、`Result` (Text) 出力を追加します。値には入力内容に基づくメッセージを設定します。

![Respond to Copilot アクションのプロパティ設定。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-04.png)

**Save draft** し、**Overview** タブでフロー名を `Insert new candidate for HR` などに変更して **Publish** します。

再びエージェントに戻り **+ Add a tool** → **Flow** フィルターを選択すると、作成したフローが表示されます。

![Flow グループに表示された新しいフロー。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-05.png)

ツールを選択し **Add and configure** で以下の設定を行います。

- Name: Insert new candidate for HR  
- Description: Insert new candidate into the Excel spreadsheet for HR  

**Save** を選択するとツールが準備完了です。次のプロンプトでツールを呼び出してみましょう。

```txt
Insert a new candidate into the Excel spreadsheet of HR. The candidate firstname is John, 
the lastname is White, the role is "HR Administrator", and the expertise is "Compliance".
```

初回実行時には Excel Online への接続が必要です。**Connect** → **Retry** の順に進めてください。

![ツール呼び出し時の Activity map と接続要求。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-06.png)

実行後、フローで設定したメッセージが返り、スプレッドシートに候補者が追加されます。

<cc-end-step lab="mcs3" exercise="1" step="3" />

## Exercise 2 : トピック内からツールを呼び出す

この演習では、作成したツールをトピック内で利用します。

### Step 1: トピックからツールを呼び出す

まず空のトピックを作成し、名前を `Add a new candidate to Excel` とします。[Lab MCS2 の Exercise 4](../02-topics#exercise-4--using-adaptive-cards){target=_blank} と同様の手順で進めてください。

トリガー用の説明例:

```txt
This topic helps users to insert new candidates in the Excel spreadsheet of HR.
Triggering sentences can be: add a new a new row to the persistence storage.
```

ここでは詳細を省略しますが、Lab MCS2 を参照してください。

以下は **Ask with adaptive card** アクションで候補者情報を取得する際に使用できるアダプティブ カードの JSON です。

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

続いて **Add an tool** グループ → **Tool** タブから、[Exercise 1 - Step 3](#step-3-consuming-a-power-automate-flow) で作成したツールを選択します。

![トピックデザイナーでのツール追加画面。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-01.png)

ユーザーがアダプティブ カードで入力した値を、ツールの入力パラメーターにマッピングします。

![ツールの入力パラメーターとトピック変数のマッピング設定。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02a.png)

- text: 名  
- text_1: 姓  
- text_2: 役割  
- text_3: 専門分野  

Copilot Studio のデータ バインディングを利用して、各パラメーターをトピック レベル変数に設定します。

![ツールの入力がトピック変数にマッピングされた最終状態。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02b.png)

**End current topic** アクションを追加し、保存します。

Lab MCS2 で作成した他のトピックを無効にし、以下のプロンプトで新しいトピックを呼び出してスプレッドシートに行を追加します。

```txt
Add a new a new row to the persistence storage
```

アダプティブ カードに入力して送信すると、トピック経由でツールが実行され、新しい候補者がスプレッドシートに追加されます。

![トピック操作と Excel の更新結果。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02.png)

<cc-end-step lab="mcs3" exercise="2" step="1" />

---8<--- "ja/mcs-congratulations.md"

あなたのエージェントはツールをサポートするようになりました。次のラボでは、Copilot Studio を使用して Microsoft 365 Copilot Chat 用の Declarative Agents を作成する方法を学びます。

<a href="../04-extending-m365-copilot">Lab MCS4</a> で、Copilot Studio を使って Microsoft 365 Copilot Chat 用の Declarative Agents を作成する方法を学びましょう。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/03-actions--ja" />