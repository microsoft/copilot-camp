---
search:
  exclude: true
---
# ラボ MSA2 - SharePoint エージェントの共有

---8<--- "ja/msa-labs-prelude.md"

このラボでは、SharePoint エージェントを直接リンクで共有する方法と Microsoft Teams のチャット内で共有する方法を学習します。

## 演習 1: SharePoint エージェントを共有する

すべての SharePoint エージェントはファイルとして保存されるため、簡単に他の人と共有できます。

### ステップ 1: SharePoint エージェントを他の人と共有する

ドキュメント ライブラリ内にローカルで存在する場合でも、サイト レベルで承認・昇格されている場合でも、SharePoint エージェントの名前の横にある **...** 1️⃣ を選択し、**共有** 2️⃣ を選択します。

![SharePoint エージェントのコンテキスト メニュー。エージェントを「共有」するオプションが強調表示されている。](../assets/images/make/sharepoint-agents-02/share-spagent-01.png)

SharePoint Online の最新のファイル共有 UI が表示され、.agent ファイルを組織内の他のユーザーと共有できます。他の SharePoint Online ファイルと同様に、共有相手（ユーザー、グループ、メール）を選択し、リンクを取得するか共有通知メールを送信できます。リンクをコピーした場合は、お好きな場所に貼り付けられます。

![SharePoint Online の共有 UX。共有対象を検索するフィールド、共有通知メールの本文に入れるメッセージ入力欄、「リンクのコピー」や「送信」ボタンがある。](../assets/images/make/sharepoint-agents-02/share-spagent-02.png)

共有リンクを開くと、対象ユーザーはエージェント ダイアログに直接アクセスでき、没入型の全画面 SharePoint エージェント エクスペリエンス内でエージェントと対話できます。

<cc-end-step lab="msa2" exercise="1" step="1" />

### ステップ 2: Microsoft Teams 経由で SharePoint エージェントを共有する

エージェントを Microsoft Teams 経由で共有することも可能です。その場合は、エージェント名の横にある **...** 1️⃣ を選択し、**Teams 用リンクをコピー** 2️⃣ を選択します。

![SharePoint エージェントのコンテキスト メニュー。「Teams 用リンクをコピー」のオプションが強調表示されている。](../assets/images/make/sharepoint-agents-02/share-spagent-03.png)

これにより、エージェント ファイルの共有リンクが生成されクリップボードにコピーされます。確認メッセージには、生成されたリンクを Microsoft Teams のグループ チャットに貼り付ける準備ができていることが示されています。

![エージェントの Teams 用リンク取得の確認ダイアログ。「このリンクを Teams グループ チャットに貼り付けてエージェントを追加してください」という案内文がある。](../assets/images/make/sharepoint-agents-02/share-spagent-04.png)

ダイアログの **設定** リンクを選択すると、共有リンクにアクセスできるユーザーやリンクの有効期限を設定できます。内部では通常の SharePoint Online の共有リンクが作成されます。リンクをグループ チャットに貼り付けてみましょう。

![Microsoft Teams のチャットに SharePoint エージェントのリンクを貼り付けた様子。リンクの unfurling によりエージェント情報を含むカードが表示される。](../assets/images/make/sharepoint-agents-02/share-spagent-05.png)

リンクをチャットに貼り付けると、エージェント情報を示すアダプティブ カードが表示されます。これは .agent ファイルを処理するカスタムのリンク unfurling 拡張機能によるものです。チャット メッセージを送信すると、カードの表示が少し変わり、エージェントを **このチャットに追加** するコマンドが表示されます。

![Microsoft Teams のチャットで、エージェントのリンクがアダプティブ カードとしてレンダリングされ、「このチャットに追加」ボタンが表示されている。](../assets/images/make/sharepoint-agents-02/share-spagent-06.png)

コマンドを選択し、数秒待ちます。成功すると、エージェントがチャットに追加された旨のメッセージと、エージェントからのウェルカム メッセージが表示されます。問題が発生した場合、**このチャットに追加** ボタンが無効になり、テキストが **チャットへの追加でエラー** に変わります。チャットを更新して再試行することも可能です。

![Microsoft Teams のチャット。エージェントが追加されたことを示すメッセージと、エージェントからのウェルカム メッセージが表示されている。](../assets/images/make/sharepoint-agents-02/share-spagent-07.png)

<cc-end-step lab="msa2" exercise="1" step="2" />

### ステップ 3: Microsoft Teams で共有エージェントと対話する

これで、Microsoft Teams のグループ チャット内でエージェントと対話できます。エージェントを呼び出すときは、エージェント名でメンション (@HR Agent) し、プロンプトを送信します。例えば、次のようなプロンプトを使えます。

```text
How can I improve my career?
```

![Microsoft Teams チャットで @HR Agent をメンションしている様子。](../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-01.png)

SharePoint エージェントはプロンプトを処理し回答を生成します。ただし、セキュリティ上の理由から回答はすぐにはチャットに投稿されません。内容と参照ドキュメントを確認する必要があります。**View response** コマンドを選択して回答を確認します。 

![Microsoft Teams チャットでエージェントが応答した際の表示。「View response」コマンドにより、AI 生成回答を送信前に確認できる。](../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-02.png)

**View response** を選択するとポップアップ ダイアログが表示され、回答テキスト全体と添付ファイル（ある場合）を共有前に確認できます。問題なければ回答をチャットに送信できます。

![エージェントからの回答プレビュー ダイアログ。下部に「Send」と「Don't send」のボタンがあり、次の 24 時間エージェントの回答を信頼して自動送信するチェックボックスもある。](../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-03.png)

回答と添付ファイルが妥当であれば **Send** を選択します。今後 24 時間、エージェントの回答を自動で信頼するよう設定することも可能です。回答が不適切、または参照ドキュメントを共有したくない場合は **Don't send** を選択します。するとチャット内のユーザーには「[YOUR USER DISPLAY NAME] reviewed my response to the request made and suggested that I don't share it at this time.」というメッセージが表示されます。

![不承認の場合にエージェントが送信するメッセージ。](../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-04.png)

Microsoft Teams と SharePoint エージェントの統合をお楽しみください。

<cc-end-step lab="msa2" exercise="1" step="3" />

---8<--- "ja/msa-congratulations.md"

Lab MSA2 - SharePoint エージェントの共有 を完了しました!

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agents/02-sharing-agents" />