---
search:
  exclude: true
---
# ラボ MCS3 - アクションの定義

このラボでは、Microsoft Copilot Studio でアクションを作成する方法を学習します。アクションは エージェント のもう 1 つの主要な構成要素です。アクションを使用すると、外部の Power Platform コネクター (ネイティブまたはカスタム)、外部 REST API、Power Automate フローなどを追加して エージェント の機能を拡張できます。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ZVHkBiH6RxQ" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を短時間で確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    本ラボは前回の [Lab MCS2](../02-topics){target=_blank} を基にしています。同じ エージェント を継続して使用し、新しい機能を追加して改善します。

アクションはグラフィカル デザイナーで作成できます。新しいアクションを作成した後、詳細な微調整が必要な場合は低レベルのコード エディターで定義を編集することもできます。

このラボで学習する内容:

- Power Platform コネクターを呼び出すアクションの作成方法
- Power Automate フローを呼び出すアクションの作成方法
- トピックからアクションを呼び出す方法

## 演習 1 : Microsoft Copilot Studio でアクションを作成する

この演習では、[Lab MCS2](../02-topics){target=_blank} で作成した エージェント を強化し、Excel Online を使用して SharePoint Online のドキュメント ライブラリに保存されている Excel スプレッドシートから仮想的な候補者一覧を取得できるようにします。さらに、同じスプレッドシートに新しい候補者を追加できる Power Automate フローを呼び出すアクションも追加します。

### 手順 1: Power Platform コネクターを利用する

新しいアクションを作成するには、画面上部の 1️⃣ **Actions** タブを選択し、2️⃣ **+ Add an action** を選択します。

![Microsoft Copilot Studio のインターフェースで新しいアクションを作成する画面。**Actions** タブと **+ Add an action** コマンドが強調表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-01.png)

アクションの種類を選択するダイアログが表示されます。既定では **Featured** アクションがいくつか表示され、Excel Online などの一般的なサービスと連携できます。**+ New action** を選択すると、以下のオプションから新しいアクションを作成できます。

- New prompt: 自然言語で作成したプロンプトを使用する AI アクションを利用
- New Power Automate flow: Power Automate フローを利用 (詳細は [手順 2](#step-2-consuming-a-power-automate-flow))
- New custom connector: Power Platform のカスタム コネクターを利用
- Upload a skill: Bot Framework SDK で構築したスキルを追加 (詳細は [こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/configuration-add-skills){target=_blank})
- New REST API: 外部 REST API を利用 (詳細は [こちら](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-rest-api){target=_blank})

![新しいアクションを作成するダイアログ。**Featured** アクションと **Library** 全体、さらに **+ New Action** コマンドが展開されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-02.png)

目的のオプションが Featured にない場合は **Library** に切り替え、テキスト検索してください。

今回は **Excel Online (Business)** ファミリーの **List rows present in a table** を選択します。まず **Next** ボタンを選択し、コネクター接続のプロセスを進めます。

![ターゲットの Power Platform コネクターへ接続するダイアログ。接続情報と Next ボタン、Cancel ボタン、Back ボタンが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-03.png)

次にアクションを構成するダイアログが表示されます。設定項目は以下のとおりです。

- Name: アクションの識別名  
- Description: ジェネレーティブ オーケストレーションがアクションを使用すべきか判断するための自然言語の説明  
- Authentication settings: 認証方法の設定  
- Inputs and outputs: 入出力パラメーターの設定 (必要に応じて)  
- Response settings: ユーザーへの応答方法の設定  

アクションを構成する前に候補者一覧用の Excel ファイルを準備します。サンプル ファイルは [こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/copilot-studio/Candidates/Sample-list-of-candidates.xlsx?raw=true){target=_blank} からダウンロードしてください。

同じテナント内の SharePoint Teams サイトの **Documents** ライブラリにファイルをアップロードします。このドキュメントは Microsoft 365 Copilot で生成された仮想的な候補者一覧です。

- サイト コレクションの絶対 URL をコピー (例: `https://xyz.sharepoint.com/sites/contoso/`)
- ドキュメント ライブラリ名をコピー (例: `Shared documents`)
- ファイル名もコピー (例: `Sample-list-of-candidates.xlsx`)

Microsoft Copilot Studio に戻り、アクションの構成を完了します。

![Name、Description、Authentication を設定済みのアクション作成ダイアログ。**Add action** と **Cancel** ボタンがある。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-04.png)

設定内容:

- Name: List HR candidates
- Description: List candidates for an HR role
- Authentication: User authentication

**Add action** を選択してアクションを保存します。アクション一覧が表示されるので、作成したアクションをクリックして編集します。

![アクション一覧。新しいアクションの名前、トリガー条件、説明、状態などの基本情報が表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-05.png)

編集ダイアログで **Action name** をわかりやすい名前に変更します。次に **Inputs** タブを開き、入力パラメーターを設定します。既定では必須の入力はすべて **Identify as** プロパティが `User's entire response` になっています。

![アクションの入力パラメーターを設定するタブ。各パラメーターの詳細設定が一覧表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-06.png)

各入力パラメーターの **How will the agent fill this input?** を `Set as a value` に変更し、静的値を設定します。確認ダイアログで同意し、それぞれの入力に手動で値を入力します。

![**Location** 入力パラメーターの設定。値のソースを手動の静的値に変更している。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-07.png)

静的値:

- Location: Excel を保存した SharePoint Online サイトの URL (例: `https://xyz.sharepoint.com/sites/contoso/`)
- Document Library: ドキュメント ライブラリ名 (例: `Shared Documents`)
- File: Excel ファイル名 (例: `Sample-list-of-candidates.xlsx`)
- Table: `Candidates_Table`

![推奨設定どおりに構成された入力パラメーター一覧。すべて手動入力で設定済み。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-08.png)

画面右上の **Save** を選択して更新を保存します。

<cc-end-step lab="mcs3" exercise="1" step="1" />

### 手順 2: 新しいアクションをテストする

更新した エージェント を公開し、統合テスト パネルまたは Microsoft Teams で試す準備ができました。

[Lab MCS2](../02-topics){target=_blank} でジェネレーティブ オーケストレーションを有効にしているので、次のようなプロンプトを エージェント に送るだけでアクションを呼び出せます。

```txt
Show me the list of candidates for an HR role
```

Copilot Studio では、ジェネレーティブ オーケストレーションとテスト パネルを使用する際、既定で Activity map が表示され、オーケストレーターの動作を確認できます。次のスクリーンショットは前述のプロンプトに対する Activity map です。オーケストレーターはユーザーの意図を識別し、手順 1 で作成したアクションをトリガーします。また、手動で設定した入力パラメーターも確認できます。

Power Platform コネクターは有効な接続が必要なため、外部データ ソースを使用する前に **Connect** するよう求められます。

![提案プロンプトを処理する エージェント。ページ中央に Activity map と手動設定された入力パラメーターが表示され、テスト パネルでコネクター接続を促している。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-09.png)

**Connect** を選択し、接続を有効化します。新しいタブで現在のセッションの接続一覧が開き、`Excel Online (Business)` への接続が表示されます。**Connect** リンクを選択し、**Create or pick a connection** ダイアログで接続を作成します。接続が完了したら エージェント に戻り、**Retry** を選択してアクションを実行します。テスト パネルに Excel スプレッドシートから取得した候補者一覧が表示されます。

![テスト パネルに Excel スプレッドシートから取得した候補者一覧が表示されている。](../../../assets/images/make/copilot-studio-03/create-action-excel-connector-10.png)

お疲れさまでした。次の手順に進みましょう。

<cc-end-step lab="mcs3" exercise="1" step="2" />

### 手順 3: Power Automate フローを利用する

この手順では Power Automate フローを呼び出すアクションを作成します。ユーザー入力に基づき、Excel スプレッドシートに新しい候補者を追加するとします。外部の Power Automate フローを呼び出すアクションを作成すれば、スプレッドシートのテーブルに新しい行を追加できます。

画面上部の **Actions** タブから **+ Add an action** を選択し、**+ New action** → **New Power Automate flow** を選択します。新しいブラウザー タブで Power Automate のフローデザイナーが開きます。

![カスタム アクション用 Power Automate フローの初期状態。「Run a flow from Copilot」と「Respond to Copilot」のアクションが表示されている。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-01.png)

フローには `Run a flow from Copilot` というトリガーと `Respond to Copilot` という終了アクションがあります。この 2 つの間にビジネス プロセスを定義し、Copilot Studio のアクションが起動時に入力を渡し、結果を返します。最初のアクションを選択してプロパティを編集し、Copilot から受け取る入力パラメーターを設定します。

![トリガー アクションのプロパティ。firstname、lastname、role、expertise の 4 つの入力パラメーターと、サポートされる型の一覧が表示されている。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-02.png)

候補者を追加するため、以下の入力パラメーターを設定します。

- Firstname: text  
- Lastname: text  
- Role: text  
- Expertise: text  

次に 2 つのアクションの間に **Excel Online** コネクターの **Add a new row into a table** アクションを追加します。スプレッドシートを指定し、列フィールドとトリガー アクションの入力パラメーターをマッピングします。アクション名を `Add new candidate row` に変更します。

![Excel スプレッドシートのテーブルに新しい行を追加するフロー アクションのプロパティ。ファイルの場所と列フィールドが入力パラメーターにマッピングされている。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-03.png)

続いて `Respond to Copilot` アクションを選択し、プロパティを編集して `Text` 型の出力パラメーター `Result` を追加します。値には入力パラメーターを使ったメッセージを設定します。

![`Respond to Copilot` アクションのプロパティ。入力パラメーターを基に候補者が追加されたことを確認するメッセージを生成している。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-04.png)

フローに `Insert new candidate for HR` などの名前を付け、保存して発行します。その後、アクション編集画面のタブに戻り、利用可能なアクションを更新するよう求められたら **Refresh** します。作成したフローが **Featured** アクションに表示されるはずです。表示されない場合は名前で検索してください。

![**Featured** グループに新しいフローが表示されているアクション一覧。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-05.png)

新しいアクションを選択し、手順 1 と同様に設定します。例:

- Name: Insert new candidate for HR  
- Description: Insert new candidate into the Excel spreadsheet for HR  

**Add action** を選択し、アクションを編集して入力を適切にマッピングします。
次のようなプロンプトでアクションをトリガーしてみましょう。

```txt
Insert a new candidate into the Excel spreadsheet of HR. The candidate firstname is John, 
the lastname is White, the role is "HR Administrator", and the expertise is "Compliance".
```

前手順と同様、最初の実行時は Excel Online への接続が必要です。**Connect** を選択し、接続後に **Retry** を選択してアクションを実行します。

![新しいアクション呼び出し時の Activity map。ユーザーに接続を促し、その後アクションを再試行するよう表示されている。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-06.png)

アクション実行後、Power Automate フローで定義したメッセージが表示され、スプレッドシートに新しい候補者が追加されます。

![エージェントからの応答メッセージと、Excel スプレッドシートに追加された新しい行が確認できる。](../../../assets/images/make/copilot-studio-03/create-action-flow-connector-07.png)

<cc-end-step lab="mcs3" exercise="1" step="3" />

## 演習 2 : トピック内からアクションを呼び出す

この演習では、作成したアクションをトピック内で利用します。

### 手順 1: トピックからアクションを呼び出す

まず空白から新しいトピックを作成し、名前を `Add a new candidate to Excel` とします。[Lab MCS2 の演習 4](../02-topics#exercise-4--using-adaptive-cards){target=_blank} と同じ手順に従ってください。

トリガーの説明例:

```txt
This topic helps users to insert new candidates in the Excel spreadsheet of HR.
Triggering sentences can be: add a new a new row to the persistence storage.
```

簡単にするため、ここではすべての手順を詳しく説明しません。詳細は Lab MCS2 を参照してください。

以下は **Ask with adaptive card** アクションで候補者の入力を収集するためのアダプティブ カード JSON です。

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

続いて **Add an action** グループから **Action (preview)** タブを選択し、[演習 1 - 手順 3](#step-3-consuming-a-power-automate-flow) で作成したアクションを選択します。アクションの入力パラメーターと、アダプティブ カードで取得した変数をマッピングします。

![トピック デザイナーでアクションを追加する画面。**Add an action** グループに エージェント のアクションが一覧表示されている。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-01.png)

Lab MCS2 で作成した他のトピックを無効化し、新しいトピックを呼び出して Excel に候補者を追加します。例として次のプロンプトを使用してください。

```txt
Add a new a new row to the persistence storage
```

アダプティブ カードに入力して送信すると、トピック経由でアクションが実行され、Excel スプレッドシートに新しい候補者が追加されます。

![トピックを使った操作で Excel スプレッドシートに新しい候補者行が追加されている。](../../../assets/images/make/copilot-studio-03/use-action-in-topic-02.png)

<cc-end-step lab="mcs3" exercise="2" step="1" />

---8<--- "ja/mcs-congratulations.md"

これで エージェント がアクションをサポートできるようになりました。次のラボでは、Microsoft Copilot Studio を使用して Microsoft 365 Copilot Chat 用の エージェント を作成する方法を学びます。

<a href="../04-extending-m365-copilot">Lab MCS4 を開始する</a> と、Microsoft Copilot Studio で Microsoft 365 Copilot Chat 用の エージェント を作成する方法を学習できます。
<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/03-actions" />