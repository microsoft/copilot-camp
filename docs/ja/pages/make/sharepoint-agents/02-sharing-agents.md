---
search:
  exclude: true
---
# ラボ MSA2 - SharePoint エージェントの共有

---8<--- "ja/msa-labs-prelude.md"

このラボでは、直接リンクや Microsoft Teams のチャットを使用して SharePoint エージェントを他の人と共有する方法を学びます。

## Exercise 1: SharePoint エージェントの共有

すべての SharePoint エージェントはファイルであるため、簡単に他の人と共有できます。

### 手順 1: SharePoint エージェントを他の人と共有する

SharePoint エージェントがドキュメント ライブラリ内にある場合でも、サイト レベルで承認・昇格されている場合でも、エージェント名の横にある **...** 1️⃣ を選択し、**共有** 2️⃣ を選択します。

![SharePoint エージェントのコンテキスト メニュー。「共有」オプションが強調表示されている。](../../../assets/images/make/sharepoint-agents-02/share-spagent-01.png)

SharePoint Online のモダンなファイル共有エクスペリエンスが表示され、.agent ファイルを組織内の他の人と共有できます。ほかの SharePoint Online ファイルと同様に、共有先の対象 (ユーザー、グループ、メール アドレス) を選択し、リンクを取得するか共有通知メールを送信できます。リンクをコピーする場合は、コピーしたリンクを好きな場所に貼り付けてください。

![SharePoint Online でエージェントを共有する際の共有 UX。共有対象を検索するフィールド、共有通知メールの本文に使用するテキスト メッセージ入力フィールド、「リンクをコピー」「送信」ボタンがある。](../../../assets/images/make/sharepoint-agents-02/share-spagent-02.png)

共有リンクは対象ユーザーをエージェント ダイアログに直接誘導するため、没入型で全画面表示の SharePoint エージェント エクスペリエンス内で直接エージェントと対話できます。

<cc-end-step lab="msa2" exercise="1" step="1" />

### 手順 2: Microsoft Teams 経由で SharePoint エージェントを共有する

エージェントを Microsoft Teams 経由で共有することもできます。その場合は、エージェント名の横にある **...** 1️⃣ を選択し、**Copy link for Teams** 2️⃣ を選択するだけです。

![SharePoint エージェントのコンテキスト メニュー。「Copy link for Teams」オプションが強調表示されている。](../../../assets/images/make/sharepoint-agents-02/share-spagent-03.png)

これにより、エージェント ファイルの共有リンクが生成され、クリップボードにコピーされます。確認メッセージには、生成されたリンクを Microsoft Teams のグループ チャットに貼り付ける準備ができていることが示されます。

![Teams 用リンク取得の確認ダイアログ。「このリンクを Teams グループ チャットに貼り付けてエージェントを追加する」と明記されている。](../../../assets/images/make/sharepoint-agents-02/share-spagent-04.png)

ダイアログの **Settings** リンクを選択すると、リンクにアクセスできるユーザーを設定したり、リンクの有効期限を設定したりできます。内部的には通常の SharePoint Online の共有リンクが作成されます。リンクをグループ チャットに貼り付けて、どのように表示されるかを確認しましょう。

![Microsoft Teams のチャットに SharePoint エージェントのリンクを貼り付けた様子。リンクのアンファーリング拡張機能がカードを表示し、エージェントの情報を提供している。](../../../assets/images/make/sharepoint-agents-02/share-spagent-05.png)

リンクを貼り付けると、エージェントの情報を含む見栄えの良いアダプティブ カードが表示されます。これは .agent ファイルを処理するカスタムのリンク アンファーリング拡張機能によるものです。リンクを含むチャット メッセージを送信すると、カードの表示が少し変わり、エージェントを **Add to this chat** でチャットに追加するコマンドが表示されます。

![Microsoft Teams のチャットに表示されるアダプティブ カード。エージェントを「Add to this chat」で追加するボタンがある。](../../../assets/images/make/sharepoint-agents-02/share-spagent-06.png)

コマンドを選択して数秒待ちます。成功すると、エージェントがチャットに追加されたことを示すメッセージと、エージェントからのウェルカム メッセージが表示されます。問題が発生した場合、**Add to this chat** ボタンは無効化され、テキストが **Error adding to chat** に変わります。チャットを更新してもう一度試すこともできます。

![Microsoft Teams のチャットにエージェントが追加されたことを示すメッセージと、エージェント自身からのウェルカム メッセージ。](../../../assets/images/make/sharepoint-agents-02/share-spagent-07.png)

<cc-end-step lab="msa2" exercise="1" step="2" />

### 手順 3: Microsoft Teams で共有されたエージェントと対話する

これで、Microsoft Teams のグループ チャット エクスペリエンス内でエージェントと対話できます。エージェントを呼び出すときは、名前でメンション (@HR Agent) し、処理したいプロンプトを送信します。たとえば、次のようなプロンプトを使用できます。

```text
How can I improve my career?
```

![Microsoft Teams のチャットで @HR Agent をメンションした新しいメッセージ。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-01.png)

SharePoint エージェントはプロンプトを処理し、回答を生成します。ただし、セキュリティ上の理由から回答は直接チャットに送信されません。回答内容と、回答の生成に参照されたドキュメントを確認する必要があります。**View response** コマンドを選択して回答を確認します。

![エージェントが返信した際の Microsoft Teams チャット。「View response」コマンドで AI 生成回答を共有前に確認できる。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-02.png)

**View response** を選択するとポップアップ ダイアログが表示され、回答全文と参照された添付ファイル (ある場合) を共有前に確認できます。回答に問題がなければ、実際の回答メッセージをチャットに送信できます。

![エージェントの回答プレビュー ダイアログ。ダイアログ下部に「Send」と「Don't send」の 2 つのコマンドがあり、次の 24 時間エージェントの回答を信頼して送信するためのチェックボックスもある。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-03.png)

回答と添付ファイルが問題ないことを確認したら **Send** を選択してください。次の 24 時間はエージェントの回答を自動的に信頼して送信するよう Microsoft Teams に指示することもできます。回答に満足できない場合、または回答内で参照されているドキュメントのいずれかを開示したくない場合は **Don't send** を選択します。グループ チャットのユーザーには、エージェントから「[YOUR USER DISPLAY NAME] reviewed my response to the request made and suggested that I don't share it at this time.」というメッセージが表示されます。

![提供された内容が承認されなかった場合にエージェントが送信するメッセージ。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-04.png)

これで Microsoft Teams と SharePoint エージェントの統合をお楽しみいただけます。

<cc-end-step lab="msa2" exercise="1" step="3" />

---8<--- "ja/msa-congratulations.md"

ラボ MSA2 - SharePoint エージェントの共有 を完了しました!

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agents/02-sharing-agents--ja" />