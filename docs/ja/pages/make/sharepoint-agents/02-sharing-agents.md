---
search:
  exclude: true
---
# ラボ MSA2 - SharePoint エージェントの共有

---8<--- "ja/msa-labs-prelude.md"

このラボでは、直接リンクまたは Microsoft Teams のチャット内で SharePoint エージェントを他のユーザーと共有する方法を説明します。

## 演習 1: SharePoint エージェントの共有

SharePoint エージェントはファイルであるため、簡単に他のユーザーと共有できます。

### 手順 1: SharePoint エージェントをユーザーと共有する

SharePoint エージェントがドキュメント ライブラリにローカルであっても、サイト レベルで承認されて昇格されていても、エージェント名の横にある **...** 1️⃣ を選択し、**Share** 2️⃣ を選択します。

![SharePoint エージェントのコンテキスト メニュー。エージェントを「Share」するオプションが強調表示されている。](../../../assets/images/make/sharepoint-agents-02/share-spagent-01.png)

SharePoint Online のモダンなファイル共有エクスペリエンスが表示され、.agent ファイルを組織内の他のユーザーと共有できます。ほかの SharePoint Online ファイルと同様に、共有相手（ユーザー、グループ、メール）を選択し、リンクを取得するか、共有通知メールを送信できます。リンクをコピーした場合は、好みの場所に貼り付けられます。

![SharePoint Online の共有 UX。共有相手を検索するフィールド、通知メール本文用のメッセージ入力フィールド、「Copy link」と「Send」のボタンが表示されている。](../../../assets/images/make/sharepoint-agents-02/share-spagent-02.png)

共有リンクを開くと、対象ユーザーはエージェント ダイアログに直接移動し、没入型かつ全画面の SharePoint エージェント エクスペリエンスでエージェントと対話できます。

<cc-end-step lab="msa2" exercise="1" step="1" />

### 手順 2: Microsoft Teams で SharePoint エージェントを共有する

興味深いオプションとして、エージェントを Microsoft Teams で共有できます。そのためには、エージェント名の横にある **...** 1️⃣ を選択し、**Copy link for Teams** 2️⃣ を選択します。

![SharePoint エージェントのコンテキスト メニュー。「Copy link for Teams」オプションが強調表示されている。](../../../assets/images/make/sharepoint-agents-02/share-spagent-03.png)

これによりエージェント ファイルの共有リンクが生成され、クリップボードにコピーされます。確認メッセージには、生成されたリンクが Microsoft Teams のグループ チャットに貼り付けられる準備ができていることが表示されます。

![リンク取得の確認ダイアログ。「Paste this link in a Teams group chat to add this agent」というテキストが表示されている。](../../../assets/images/make/sharepoint-agents-02/share-spagent-04.png)

ダイアログの **Settings** リンクを選択すると、共有リンクへのアクセス許可と、有効期限を設定できます。内部的には通常の SharePoint Online の共有リンクが作成されます。
では、リンクをグループ チャットに貼り付けてみましょう。

![Microsoft Teams チャットに SharePoint エージェントのリンクを貼り付けたときの表示。リンク アンファール拡張機能によりカードがレンダリングされている。](../../../assets/images/make/sharepoint-agents-02/share-spagent-05.png)

リンクを貼り付けると、エージェント情報を含む美しいアダプティブ カードが表示されます。これは .agent ファイルを処理する Teams のカスタム リンク アンファール拡張機能によるものです。リンク付きチャット メッセージを送信すると、カードがわずかに変化し、エージェントを **Add to this chat** するコマンドが表示されます。

![エージェントを「Add to this chat」するボタンが表示されたアダプティブ カード。](../../../assets/images/make/sharepoint-agents-02/share-spagent-06.png)

コマンドを選択し、数秒待ちます。成功すると、エージェントがチャットに追加されたことを示すメッセージと、エージェントからのウェルカム メッセージが表示されます。問題が発生した場合、**Add to this chat** ボタンは無効化され、テキストが **Error adding to chat** に変わります。チャットを更新して再試行することもできます。

![エージェントが追加されたことを通知し、エージェントからのウェルカム メッセージが表示されている Microsoft Teams チャット。](../../../assets/images/make/sharepoint-agents-02/share-spagent-07.png)

<cc-end-step lab="msa2" exercise="1" step="2" />

### 手順 3: Microsoft Teams で共有エージェントと対話する

これで、Microsoft Teams のグループ チャット内でエージェントと対話できます。エージェントを呼び出すには、名前でメンション (@HR Agent) し、処理してほしいプロンプトを送信します。たとえば、次のようなプロンプトを使用できます。

```text
How can I improve my career?
```

![新しいチャット メッセージで @HR Agent をメンションしている Microsoft Teams チャット。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-01.png)

SharePoint エージェントはプロンプトを処理して回答を生成します。ただし、セキュリティ上の理由から回答は直接チャットには投稿されません。内容と、回答生成に参照されたドキュメントを確認する必要があります。**View response** コマンドを選択して回答を確認します。 

![エージェントが返信した際の Microsoft Teams チャット。「View response」コマンドで AI 生成回答を確認できる。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-02.png)

**View response** を選択するとポップアップ ダイアログが表示され、回答全文と参照添付ファイル（ある場合）を共有前に確認できます。問題なければ、回答メッセージをチャットに送信できます。

![エージェントの回答プレビュー ダイアログ。下部に「Send」と「Don't send」のコマンドがあり、次の 24 時間エージェント回答を信頼するチェックボックスもある。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-03.png)

回答と添付ファイルに問題がなければ **Send** を選択します。今後 24 時間、エージェントからの回答を自動的に承認するよう Microsoft Teams に指示することも可能です。回答に満足できない場合や、参照ドキュメントの公開を望まない場合は **Don't send** を選択します。グループ チャットのユーザーには、エージェントから「[YOUR USER DISPLAY NAME] reviewed my response to the request made and suggested that I don't share it at this time.」というメッセージが表示されます。

![承認されなかった場合にエージェントが送信するメッセージ。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-04.png)

これで Microsoft Teams と SharePoint エージェントの連携をお楽しみいただけます。

<cc-end-step lab="msa2" exercise="1" step="3" />

---8<--- "ja/msa-congratulations.md"

ラボ MSA2 - SharePoint エージェントの共有 を完了しました！

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agents/02-sharing-agents--ja" />