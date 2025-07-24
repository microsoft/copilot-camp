---
search:
  exclude: true
---
# Lab MSA2 - Sharing SharePoint エージェント

---8<--- "ja/msa-labs-prelude.md"

このラボでは、Microsoft Teams チャット内や直接リンクを利用して SharePoint エージェント を他の人と共有する方法をご覧いただきます。

## エクササイズ 1：SharePoint エージェント の共有

すべての SharePoint エージェント はファイルであるため、他の人と簡単に共有できます。

### ステップ 1：SharePoint エージェント を利用者と共有

SharePoint エージェント をドキュメントライブラリ内のローカルなもの、またはサイトレベルで承認・昇格されたものなど、どちらの場合でも、エージェント名の横にある **...** 1️⃣ を選択し、次にエージェント を **Share** 2️⃣ するオプションを選択できます。

![SharePoint エージェント のコンテキストメニュー。エージェント を「Share」するオプションが強調表示されています。](../../../assets/images/make/sharepoint-agents-02/share-spagent-01.png)

SharePoint Online の最新のファイル共有ユーザーエクスペリエンスが表示され、組織内の他の人と .agent ファイル を共有することができます。他の SharePoint Online ファイル と同様に、共有対象のユーザー、グループ、またはメールアドレスを選択し、ファイルへのリンクを取得するか、共有通知メールを送信するかを選択できます。リンクをコピーする場合は、任意の場所に貼り付けることができます。

![SharePoint Online の共有ユーザーエクスペリエンス。共有対象を検索するフィールド、共有通知メール本文に使用するテキストメッセージ入力欄、および「Copy link」や 「Send」 などのボタンが表示されています。](../../../assets/images/make/sharepoint-agents-02/share-spagent-02.png)

共有リンクをクリックすると、対象ユーザーは直接エージェント のダイアログに移動し、没入感のある全画面表示の SharePoint エージェント 体験内でエージェント と対話できるようになります。

<cc-end-step lab="msa2" exercise="1" step="1" />

### ステップ 2：Microsoft Teams を介した SharePoint エージェント の共有

もうひとつの興味深いオプションとして、Microsoft Teams を介してエージェント を共有する方法があります。そのためには、エージェント名の横にある **...** 1️⃣ を選択し、次に **Copy link for Teams** 2️⃣ のオプションを選択するだけです。

![SharePoint エージェント のコンテキストメニュー。エージェント の「Copy link for Teams」オプションが強調表示されています。](../../../assets/images/make/sharepoint-agents-02/share-spagent-03.png)

これにより、エージェント ファイル の共有リンクが生成され、クリップボードにコピーされます。確認メッセージからもその様子がわかります。確認メッセージでは、生成されたリンクが Microsoft Teams のグループチャットに貼り付ける準備が整っていることも確認できます。

![エージェント の Teams 用リンク取得リクエストの確認ダイアログ。Microsoft Teams で「Paste this link in a Teams group chat to add this agent」と明示されています。](../../../assets/images/make/sharepoint-agents-02/share-spagent-04.png)

ダイアログ内では、**Settings** リンクを選択して、共有リンクへのアクセス権限を設定したり、リンクの有効期限を任意に設定することもできます。内部的には、SharePoint Online の通常の共有リンク が作成されます。
実際にリンクをグループチャットに貼り付け、どのように表示されるか確認してみましょう。

![SharePoint エージェント のリンクを貼り付けた際の Microsoft Teams のグループチャット。リンクが美しいカードとして展開され、エージェント に関する情報が表示されています。](../../../assets/images/make/sharepoint-agents-02/share-spagent-05.png)

グループチャットにリンクを貼り付けると、エージェント に関する情報を提供する美しいアダプティブカード が表示されます。これは、.agent ファイル を処理するための Microsoft Teams 用カスタムリンク展開拡張機能によるものです。リンクを含むチャットメッセージを送信すると、アダプティブカード はやや表示が変化し、エージェント を **Add to this chat** するコマンドを提供します。

![エージェント のリンクに対してアダプティブカード を表示している Microsoft Teams のグループチャット。エージェント を「Add to this chat」するためのコマンドボタンがあります。](../../../assets/images/make/sharepoint-agents-02/share-spagent-06.png)

コマンドを選択し、数秒お待ちください。正常に実行されると、エージェント がチャットに追加されたことを確認するメッセージが表示され、エージェント 自体からのウェルカムメッセージもすぐに確認できます。何らかの問題が発生した場合、**Add to this chat** のコマンドボタンは無効になり、表示テキストが **Error adding to chat** に変更されます。チャットを更新して再度エージェント を追加することも可能です。

![エージェント の追加と、エージェント 自身からのウェルカムメッセージを通知する Microsoft Teams のグループチャット。](../../../assets/images/make/sharepoint-agents-02/share-spagent-07.png)

<cc-end-step lab="msa2" exercise="1" step="2" />

### ステップ 3：Microsoft Teams 内での共有エージェント との対話

これで、Microsoft Teams のグループチャット内でエージェント と対話できるようになりました。エージェント を起動させたい場合は、単に名前を使ってメンション（例：@HR Agent）し、処理するためのプロンプト を送信してください。たとえば、以下のようなプロンプト を使用できます。

```text
How can I improve my career?
```

![新しいチャットメッセージで @HR Agent をメンションした際の Microsoft Teams チャット。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-01.png)

SharePoint エージェント はプロンプト を処理して回答を提供します。しかし、セキュリティ上の理由から、回答はすぐにチャットに表示されません。エージェント によって参照されたドキュメントと共に、その内容を確認する必要があります。**View response** コマンド を選択して、回答 を評価してください。

![プロンプト に対するエージェント の返信時の Microsoft Teams チャット。AI生成の回答を他の人に送信する前に評価できるよう、「View response」 コマンド が表示されています。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-02.png)

**View response** を選択すると、ポップアップダイアログ が表示され、回答 全体のテキストおよび（存在する場合は）参照された添付ファイルを、他の人と共有する前に確認できます。回答 にご納得いただけた場合は、実際の応答メッセージ をチャットに送信することを確認できます。

![エージェント からの回答をプレビューするダイアログ。ダイアログ下部には「Send」と「Don't send」の 2 つのコマンドがあり、現在の回答に対してどの操作をするか選択できます。また、今後 24 時間エージェント からの回答を信頼して送信するためのチェックボックスもあります。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-03.png)

**Send** コマンド を選択して、回答 および添付ファイル が問題ないことを確認してください。また、確認要求を避けるために、今後 24 時間エージェント からの回答 をすべて信頼するよう Microsoft Teams に指示することもできます。回答 にご満足いただけない場合や、エージェント により参照された 1 つまたは複数のドキュメント を公開したくない場合は、**Don't send** コマンド を選択してください。グループチャットのユーザーは、エージェント から「[YOUR USER DISPLAY NAME] reviewed my response to the request made and suggested that I don't share it at this time.」といったメッセージを受け取ります。

![承認されなかったコンテンツについてエージェント から送信されたメッセージ。](../../../assets/images/make/sharepoint-agents-02/shared-spagent-in-teams-04.png)

これにより、Microsoft Teams と SharePoint エージェント の統合をお楽しみいただけます。

<cc-end-step lab="msa2" exercise="1" step="3" />

---8<--- "ja/msa-congratulations.md"

Lab MSA2 - Sharing SharePoint エージェント を完了しました！

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/sharepoint-agents/02-sharing-agents" />