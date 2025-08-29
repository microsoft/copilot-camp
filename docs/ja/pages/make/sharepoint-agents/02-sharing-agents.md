---
search:
  exclude: true
---
# ラボ MSA2 - SharePoint エージェントの共有

---8<--- "ja/msa-labs-prelude.md"

このラボでは、SharePoint エージェントを直接リンクで共有する方法や Microsoft Teams のチャット内で共有する方法を学びます。

## Exercise 1: SharePoint エージェントの共有

すべての SharePoint エージェントはファイルとして保存されるため、簡単に他の人と共有できます。

### Step 1: SharePoint エージェントを人と共有する

エージェントがドキュメント ライブラリ ローカルであっても、サイト レベルで承認・昇格されたものであっても、エージェント名の横にある **...** 1️⃣ を選択し、**共有** 2️⃣ を選びます。

![The context menu of a SharePoint agent with the option to "Share" the agent highlighted.](../../../assets/images/make/sharepoint-agents-02/share-spagent-01.png)

SharePoint Online の最新のファイル共有エクスペリエンスが表示され、.agent ファイルを組織内の他の人と共有できます。ほかの SharePoint Online ファイルと同様に、共有対象（ユーザー、グループ、メール）を選択し、リンクを取得するか共有通知メールを送信するかを選べます。リンクをコピーした場合は、必要な場所に貼り付けてください。

![The sharing UX of SharePoint Online when sharing an agent with others. There are the field to search for targets of sharing. There is a field to write a text message to use in the body of the sharing notification email. And there are couple of buttons to "Copy link" or "Send" the shared resource.](../../../assets/images/make/sharepoint-agents-02/share-spagent-02.png)

共有リンクを開くと、対象ユーザーはエージェント ダイアログに直接移動し、没入感のある全画面の SharePoint エージェント エクスペリエンス内でエージェントと対話できます。

<cc-end-step lab="msa2" exercise="1" step="1" />

### Step 2: Microsoft Teams 経由で SharePoint エージェントを共有する

エージェントを Microsoft Teams で共有することもできます。その場合は、エージェント名の横にある **...** 1️⃣ を選択し、**Teams 用リンクをコピー** 2️⃣ を選びます。

![The context menu of a SharePoint agent with the option to "Copy link for Teams" for the agent highlighted.](../../../assets/images/make/sharepoint-agents-02/share-spagent-03.png)

これによりエージェント ファイルの共有リンクが生成され、クリップボードにコピーされます。確認メッセージにも、生成されたリンクが Microsoft Teams のグループ チャットへ貼り付ける準備ができていることが示されています。

![The confirmation dialog for the request to get a link for Teams for the agent. There is a clear text stating that you need to "Paste this link in a Teams group chat to add this agent" in Microsoft Teams.](../../../assets/images/make/sharepoint-agents-02/share-spagent-04.png)

ダイアログの **設定** リンクを選ぶと、共有リンクへのアクセス権やリンクの有効期限を設定できます。内部的には通常の SharePoint Online 共有リンクが作成されます。
では、このリンクをグループ チャットに貼り付けてみましょう。

![The Microsoft Teams chat when pasting the link to the SharePoint agent. There is a link unfurling extension that renders the link with a nice looking card, providing information about the agent.](../../../assets/images/make/sharepoint-agents-02/share-spagent-05.png)

リンクをグループ チャットに貼り付けると、エージェント情報を表示する見栄えの良いアダプティブ カードが展開されます。これは .agent ファイルを処理するカスタムのリンク アンファーリング拡張機能によるものです。リンクを含むチャット メッセージを送信しましょう。アダプティブ カードは表示が少し変わり、エージェントを **このチャットに追加** するコマンドが表示されます。

![The Microsoft Teams chat rendering the adaptive card for the link to the agent. There is a command button to "Add to this chat" the agent.](../../../assets/images/make/sharepoint-agents-02/share-spagent-06.png)

コマンドを選択し、数秒待ちます。成功すると、エージェントがチャットに追加された旨のメッセージとエージェントからの歓迎メッセージが表示されます。問題がある場合は **このチャットに追加** のボタンが無効になり、テキストが **チャットへの追加エラー** に変わります。チャットを更新して再度試すことも可能です。

![The Microsoft Teams chat informing that the agent was added and with the welcome message from the agent itself.](../../../assets/images/make/sharepoint-agents-02/share-spagent-07.png)

<cc-end-step lab="msa2" exercise="1" step="2" />

### Step 3: Microsoft Teams で共有されたエージェントと対話する

これで、Microsoft Teams のグループ チャット内でエージェントと対話できます。エージェントを呼び出すときは、名前でメンション (@HR Agent) し、処理してほしいプロンプトを送信します。たとえば、次のようなプロンプトを使用できます。

```text
How can I improve my career?
```

![The Microsoft Teams chat when at mentioning @HR Agent in a new chat message.](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-01.png)

SharePoint エージェントはプロンプトを処理して回答を生成しますが、セキュリティ上の理由から回答はすぐにチャットに投稿されません。内容と、回答生成に参照されたドキュメントを確認する必要があります。**応答を表示** コマンドを選択して回答を確認してください。 

![The Microsoft Teams chat when the agent replies back to a prompt. There is a command to "View response", which allows you to evaluate the AI-generated response before sending it to others.](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-02.png)

**応答を表示** を選ぶとポップアップ ダイアログが表示され、回答全文と参照された添付ファイル（ある場合）を共有前に確認できます。問題なければ、実際の回答メッセージをチャットに送信できます。

![A dialog providing a preview of the response from the agent. At the bottom of the dialog there are two commands: "Send" and "Don't send" to choose what to do with the current answers. There is also a checkbox that you can select to trust and send answer from the agent for the next 24 hours.](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-03.png)

内容と添付ファイルに問題がなければ **送信** を選択します。次の 24 時間、エージェントからの回答を自動的に信頼して送信するよう Microsoft Teams に指示することもできます。回答に満足できない場合や、参照されたドキュメントの一部を公開したくない場合は **送信しない** を選択してください。グループ チャットのユーザーには、エージェントから「[あなたの表示名] が私の回答を確認し、現時点では共有しないよう提案しました。」というメッセージが表示されます。

![The message sent by the agent when the content provided is not approved.](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-04.png)

これで Microsoft Teams と SharePoint エージェントの統合を楽しむことができます。

<cc-end-step lab="msa2" exercise="1" step="3" />

---8<--- "ja/msa-congratulations.md"

ラボ MSA2 - SharePoint エージェントの共有 を完了しました!

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agents/02-sharing-agents--ja" />