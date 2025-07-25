---
search:
  exclude: true
---
# ラボ MSA2 - SharePoint エージェントの共有

---8<--- "ja/msa-labs-prelude.md"

このラボでは、SharePoint エージェントを直接リンクで共有したり、Microsoft Teams のチャット内で共有したりする方法を学習します。

## 演習 1: SharePoint エージェントの共有

SharePoint エージェントはすべてファイルとして保存されているため、簡単に他のユーザーと共有できます。

### 手順 1: SharePoint エージェントを他のユーザーと共有する

SharePoint エージェントがドキュメント ライブラリ内のローカルであっても、サイト レベルで承認されて昇格されていても、エージェント名の横にある **...** 1️⃣ を選択し、**Share** 2️⃣ をクリックしてエージェントを共有できます。

![SharePoint エージェントのコンテキスト メニュー。「Share」オプションがハイライトされています。](../../../assets/images/make/sharepoint-agents-02/share-spagent-01.png)

SharePoint Online のモダンなファイル共有 UI が表示され、.agent ファイルを組織内の他のユーザーと共有できます。SharePoint Online の他のファイルと同様に、共有先のユーザー (ユーザー、グループ、またはメール アドレス) を選択し、ファイルへのリンクを取得するか、共有通知メールを送信できます。リンクをコピーした場合は、好きな場所に貼り付けられます。

![エージェントを共有するときの SharePoint Online の共有 UI。共有対象を検索するフィールド、共有通知メールの本文に使用するメッセージ入力欄、「Copy link」と「Send」のボタンがあります。](../../../assets/images/make/sharepoint-agents-02/share-spagent-02.png)

共有リンクを使用すると、対象ユーザーは直接エージェントのダイアログに移動し、没入型かつフルスクリーンの SharePoint エージェント エクスペリエンス内でエージェントと対話できます。

<cc-end-step lab="msa2" exercise="1" step="1" />

### 手順 2: Microsoft Teams で SharePoint エージェントを共有する

Microsoft Teams 経由でエージェントを共有することもできます。これを行うには、エージェント名の横にある **...** 1️⃣ を選択し、**Copy link for Teams** 2️⃣ を選択します。

![SharePoint エージェントのコンテキスト メニュー。「Copy link for Teams」オプションがハイライトされています。](../../../assets/images/make/sharepoint-agents-02/share-spagent-03.png)

これによりエージェント ファイルの共有リンクが生成され、クリップボードにコピーされます。確認メッセージでそれを確認できます。また、生成されたリンクは Microsoft Teams のグループ チャットに貼り付ける準備ができていることもわかります。

![エージェントの Teams 用リンクを取得したときの確認ダイアログ。「Paste this link in a Teams group chat to add this agent」と明確に記載されています。](../../../assets/images/make/sharepoint-agents-02/share-spagent-04.png)

ダイアログで **Settings** リンクを選択すると、共有リンクへのアクセス権や有効期限を設定できます。内部的には、通常の SharePoint Online の共有リンクが作成されます。リンクをグループ チャットに貼り付けて結果を見てみましょう。

![SharePoint エージェントへのリンクを貼り付けたときの Microsoft Teams チャット。リンク アンファーリング拡張機能がリンクをカードとして展開し、エージェントの情報を表示します。](../../../assets/images/make/sharepoint-agents-02/share-spagent-05.png)

リンクをグループ チャットに貼り付けると、エージェント情報を含む見栄えの良い Adaptive Card が表示されます。これは .agent ファイルを処理する Teams のカスタム リンク アンファーリング拡張によるものです。リンクを含むチャット メッセージを送信すると、Adaptive Card の表示が少し変わり、**Add to this chat** コマンドが表示されます。

![エージェントへのリンクを表す Adaptive Card を表示した Microsoft Teams チャット。「Add to this chat」ボタンがあります。](../../../assets/images/make/sharepoint-agents-02/share-spagent-06.png)

コマンドを選択し、数秒待ちます。正常に追加されると、エージェントがチャットに追加されたことを示すメッセージと、エージェント自身からのウェルカム メッセージが表示されます。問題が発生した場合、**Add to this chat** ボタンは無効化され、テキストが **Error adding to chat** に変わります。チャットを更新して再度エージェントの追加を試すこともできます。

![エージェントが追加されたことを示すメッセージと、エージェントからのウェルカム メッセージが表示された Microsoft Teams チャット。](../../../assets/images/make/sharepoint-agents-02/share-spagent-07.png)

<cc-end-step lab="msa2" exercise="1" step="2" />

### 手順 3: Microsoft Teams で共有されたエージェントと対話する

これでグループ チャット内でエージェントと対話できます。エージェントを呼び出す際は、エージェント名 (@HR Agent) を @ メンションし、処理してほしいプロンプトを送信します。たとえば、次のようなプロンプトを使用できます。

```text
How can I improve my career?
```

![@HR Agent を @ メンションしたときの Microsoft Teams チャット。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-01.png)

SharePoint エージェントはプロンプトを処理して回答を生成します。ただし、セキュリティ上の理由から回答はすぐにチャットに投稿されません。回答内容と、回答を生成する際に参照されたドキュメントを確認する必要があります。**View response** コマンドを選択して回答を確認します。 

![エージェントがプロンプトに回答したときの Microsoft Teams チャット。「View response」コマンドがあり、AI が生成した回答を他の人に送る前に確認できます。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-02.png)

**View response** を選択するとポップアップ ダイアログが表示され、回答全文と参照された添付ファイル (ある場合) を確認できます。回答に問題がなければ、実際の回答メッセージをチャットに送信できます。

![エージェントの回答プレビューを表示するダイアログ。ダイアログ下部に「Send」と「Don't send」のボタンがあり、回答を送信するかどうかを選択できます。また、今後 24 時間はエージェントからの回答を信頼して送信するチェックボックスもあります。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-03.png)

**Send** を選択すると、回答と添付ファイルに問題がないことを確認して送信します。また、次の 24 時間はエージェントからの回答を自動的に信頼して送信するよう Microsoft Teams に指示することもできます。回答に満足できない場合や、回答で参照されているドキュメントのいずれかを共有したくない場合は **Don't send** を選択します。グループ チャットのユーザーには、エージェントから「[あなたの表示名] が回答内容を確認し、現時点では共有しないよう提案しました。」というメッセージが表示されます。

![コンテンツが承認されなかった場合にエージェントが送信するメッセージ。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-04.png)

これで Microsoft Teams と SharePoint エージェントの連携をお楽しみいただけます。

<cc-end-step lab="msa2" exercise="1" step="3" />

---8<--- "ja/msa-congratulations.md"

Lab MSA2 - SharePoint エージェントの共有 を完了しました。お疲れさまでした!

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agents/02-sharing-agents" />