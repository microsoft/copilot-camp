---
search:
  exclude: true
---
# Lab MSA2 - SharePoint エージェントの共有

---8<--- "ja/msa-labs-prelude.md"

このラボでは、SharePoint エージェントを直接リンクで共有する方法と Microsoft Teams チャット内で共有する方法を学習します。

## Exercise 1: SharePoint エージェントの共有

すべての SharePoint エージェントはファイルであるため、簡単に他の人と共有できます。

### Step 1: 人と SharePoint エージェントを共有する

ドキュメント ライブラリにローカル保存されている場合でも、サイト レベルで承認・公開されている場合でも、SharePoint エージェントを共有するには、エージェント名の横にある **...** 1️⃣ を選択し、**Share** 2️⃣ を選びます。

![SharePoint エージェントのコンテキスト メニューで、エージェントを **Share** するオプションが強調表示されている。](../../../assets/images/make/sharepoint-agents-02/share-spagent-01.png)

SharePoint Online のモダンなファイル共有エクスペリエンスが表示され、.agent ファイルを組織内の他の人と共有できます。ほかの SharePoint Online ファイルと同様に、共有相手（ユーザー、グループ、メール）を指定し、リンクを取得するか共有通知メールを送信するかを選択できます。リンクをコピーする場合は、好きな場所に貼り付けられます。

![SharePoint Online でエージェントを共有する際の共有 UI。共有相手を検索するフィールドや、共有通知メール本文のメッセージ入力欄、「Copy link」「Send」のボタンが表示されている。](../../../assets/images/make/sharepoint-agents-02/share-spagent-02.png)

共有リンクを開くと、対象ユーザーはエージェント ダイアログへ直接アクセスでき、没入型のフルスクリーン SharePoint エージェント エクスペリエンス内でエージェントと対話できます。

<cc-end-step lab="msa2" exercise="1" step="1" />

### Step 2: Microsoft Teams 経由で SharePoint エージェントを共有する

Microsoft Teams を通じてエージェントを共有することもできます。エージェント名の横にある **...** 1️⃣ を選び、**Copy link for Teams** 2️⃣ を選択するだけです。

![SharePoint エージェントのコンテキスト メニューで、エージェントの **Copy link for Teams** オプションが強調表示されている。](../../../assets/images/make/sharepoint-agents-02/share-spagent-03.png)

すると、エージェント ファイルの共有リンクが生成されクリップボードにコピーされます。確認メッセージにも、生成されたリンクを Microsoft Teams のグループ チャットに貼り付ける準備ができていると表示されます。

![Teams 用リンク取得の確認ダイアログ。「Paste this link in a Teams group chat to add this agent」と明記されている。](../../../assets/images/make/sharepoint-agents-02/share-spagent-04.png)

ダイアログで **Settings** を選ぶと、リンクへアクセスできる人の設定や有効期限の設定が可能です。内部的には通常の SharePoint Online の共有リンクが作成されます。リンクをグループ チャットに貼り付けてみましょう。

![SharePoint エージェントのリンクを貼り付けた Microsoft Teams チャット。リンクのアンファーリング拡張機能により、エージェント情報を表示するカードが展開されている。](../../../assets/images/make/sharepoint-agents-02/share-spagent-05.png)

リンクを貼り付けると、エージェント情報を示す見栄えの良いアダプティブカードが表示されます。これは .agent ファイルを処理するカスタム リンク アンファーリング拡張機能によるものです。リンク付きメッセージを送信すると、カードの表示が少し変わり、エージェントを **Add to this chat** するコマンドと **View details** コマンドが表示されます。

![エージェントのリンクのアダプティブカードを表示する Microsoft Teams チャット。「Add to this chat」と「View details」のボタンがある。](../../../assets/images/make/sharepoint-agents-02/share-spagent-06.png)

**Add to this chat** を選択して数秒待ちます。成功するとエージェントがチャットに追加された旨のメッセージと、エージェントからのウェルカム メッセージが表示されます。問題が発生した場合、**Add to this chat** ボタンは無効になり **Error adding to chat** と表示されます。チャットを更新して再試行することもできます。

![エージェントが追加されたことを通知し、エージェント自身のウェルカム メッセージが表示された Microsoft Teams チャット。](../../../assets/images/make/sharepoint-agents-02/share-spagent-07.png)

<cc-end-step lab="msa2" exercise="1" step="2" />

### Step 3: Microsoft Teams で共有されたエージェントとの対話

これで Microsoft Teams のグループ チャット内でエージェントと対話できます。エージェントを呼び出すときは、名前でメンション (@HR Agent) し、処理してほしいプロンプトを送ります。たとえば、次のようなプロンプトを使用できます。

```text
How can I improve my career?
```

![新しいチャット メッセージで @HR Agent をメンションした Microsoft Teams チャット。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-01.png)

SharePoint エージェントはプロンプトを処理し、回答を生成しますが、セキュリティ上の理由から回答はすぐにチャットへは投稿されません。内容と引用されたドキュメントを確認する必要があります。**View response** を選び、回答を確認しましょう。

![エージェントが返答した際の Microsoft Teams チャット。「View response」を選択すると、生成された回答を共有前に確認できる。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-02.png)

**View response** を選択するとポップアップ ダイアログが表示され、回答全文と必要に応じて参照された添付ファイルを確認できます。問題なければ、実際の回答メッセージをチャットへ送信できます。

![エージェントの回答プレビュー ダイアログ。下部に「Send」と「Don't send」のボタン、さらに次の 24 時間エージェントの回答を信頼して自動送信するチェックボックスがある。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-03.png)

回答と添付ファイルに問題がなければ **Send** を選択して送信します。今後 24 時間はエージェントの回答を信頼し、確認を省略するよう指示することも可能です。回答に満足できない場合や、参照ドキュメントを共有したくない場合は **Don't send** を選択します。するとチャットには「[YOUR USER DISPLAY NAME] reviewed my response to the request made and suggested that I don't share it at this time.」というエージェントからのメッセージが表示されます。

![内容が承認されなかった場合にエージェントが送信するメッセージ。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-04.png)

これで Microsoft Teams と SharePoint エージェントの連携を楽しめます。

<cc-end-step lab="msa2" exercise="1" step="3" />

---8<--- "ja/msa-congratulations.md"

Lab MSA2 - SharePoint エージェントの共有 を完了しました!

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agents/02-sharing-agents--ja" />