---
search:
  exclude: true
---
# Lab MAB1 - 最初のエージェントを作成する

---8<--- "ja/mab-labs-prelude.md"

このラボでは、 Copilot Studio エージェント ビルダーを使用してシンプルな宣言型エージェントを作成します。今回作成するエージェントは、ユーザーが家庭菜園を維持・改善できるよう支援するためのものです。エージェントのナレッジ ベースは SharePoint Online に保存されている一連のドキュメントと公開 Web コンテンツに基づいています。また、このエージェントはヒントを基に植物や花の名前を当てるゲームでユーザーと交流することもできます。

このラボで学習する内容:

- Microsoft 365 Copilot 向け宣言型エージェントとは
- Copilot Studio エージェント ビルダーで宣言型エージェントを作成する方法
- 特定の指示を使ってゲームを作成するためにエージェントをカスタマイズする方法
- SharePoint Online に保存されたドキュメントをエージェントのナレッジ ベースとして構成する方法
- エージェントで画像生成を有効にする方法
- エージェントを他の人と共有する方法
- エージェントを共有する方法を学ぶ

## はじめに

宣言型エージェントは、 Microsoft 365 Copilot と同じスケーラブルなインフラとプラットフォームを活用しつつ、特定のニーズにフォーカスできるように調整されています。特定分野の専門家として機能し、標準の Microsoft 365 Copilot チャットと同じインターフェイスを使用しながら、指定されたタスクのみに集中させることができます。 

宣言型エージェント作成の世界へようこそ ☺️！それでは、 Copilot の魔法をかけてみましょう！

このラボでは、 Copilot Studio エージェント ビルダーを使ってサンプルの指示を入力し、宣言型エージェントの作成を始めます。まずは手を動かしてみましょう。 

次に、植物や花の名前当てゲームに特化したエージェントへと改造します。 

さらに、 SharePoint Online に保存したファイルをエージェントの仮想ナレッジ ベースとして参照できるようにします。 

最後に、エージェントを組織内の他の人と共有します。

![The initial UI of the Gardener agent with a couple of guesses from the user.](../../../assets/images/make/agent-builder-01/gardener-agent.gif)

## Exercise 1: 宣言型エージェントの作成

さっそく始めましょう 💪🏼。 Copilot Studio エージェント ビルダーを使ってゼロからエージェントを作成します。

### Step 1: エージェントを説明する

Copilot Studio エージェント ビルダーで宣言型エージェントを作成するには、 [Microsoft 365 Copilot チャットのホーム ページ](https://www.microsoft365.com/copilot){target=_blank} を開き、右側のパネルにある **Create an agent** を選択します。ここには利用可能なエージェントの一覧が表示されています。下図を参照してください。

![Microsoft 365 Copilot Chat with the 'Create an agent' command highlighted.](../../../assets/images/make/agent-builder-01/create-agent-01.png)

Copilot Studio エージェント ビルダーがポップアップ表示され、カスタム エージェントの定義を開始できます。テンプレートを選択してもよいですし、自然言語による説明を入力してエージェントを *説明* してもかまいません。 **Configure** オプションを選択して手動で構成することもできますが、それは後ほど行います。以下の説明を入力してください。

```txt
You are an expert gardener and you help users to maintain and improve their home garden
providing detailed instructions and advice about the best practices for home gardening.
```

![The user experience of the Copilot Studio agent builder. On the lower left side there is a textbox that you can use to provide instructions to the agent builder, while on the right side there is a preview of the agent.](../../../assets/images/make/agent-builder-01/create-agent-02.png)

指示を入力すると、エージェント ビルダーが新規エージェントの名前を尋ねてきます。 *Gardener* と入力してください。エージェント ビルダーとの対話中、ダイアログ右側にはエージェントのプレビューが表示され、推奨される会話スターターも確認できます。エージェント ビルダーから追加の指示を求められたら、次の文を入力します。

```txt
Suggest ways to keep plants and flowers shining and gorgeous
```

![The user experience of the Copilot Studio agent builder. On the lower left side there is the interaction with the agent builder, while on the right side there is a preview of the agent.](../../../assets/images/make/agent-builder-01/create-agent-03.png)

エージェント ビルダーが必要な情報をすべて得るまで対話を続けます。さらに強調すべき内容を尋ねられたら、次の文を入力します。

```txt
Highlight the importance of nature and plants/flowers to be present in every house!
```

エージェントの話し方について尋ねられたら、次の文を入力します。

```txt
Use a professional, yet friendly, tone.
```

最後に、これ以上の調整はない旨を伝え、画面右上の **Create** ボタンを選択します。 

![The user experience of the Copilot Studio agent builder with the 'Create' button highlighted.](../../../assets/images/make/agent-builder-01/create-agent-04.png)

Copilot Studio エージェント ビルダーが、提供した指示に基づいて新しいエージェントを作成します。 

<cc-end-step lab="mab1" exercise="1" step="1" />

### Step 2: エージェントをテストする

エージェントが準備完了すると、エージェントへのリンクと組織内で共有するためのリンクを表示するポップアップ ダイアログが表示されます。

![The dialog confirming the creation of the new 'Gardener' agent, providing a link to the agent and actions to share the agent.](../../../assets/images/make/agent-builder-01/create-agent-05.png)

**Go to agent** ボタンを選択すると、作成したばかりのエージェントの実際のユーザー エクスペリエンスが表示されます。

![The user experience of the 'Gardener' agent that you have just created. There is the name of the agent at the top of the screen, followed by a set of conversation starters generated by the Copilot Studio agent builder, and then the textbox to provide a new prompt to the agent.](../../../assets/images/make/agent-builder-01/create-agent-06.png)

エージェントと対話するには、最初の推奨プロンプトをクリックし、エージェントの応答を確認します。これでエージェントの準備は完了です。おめでとうございます！

![The user experience of the 'Gardener' agent in action. There is a prompt at the top of the left side of the screen and the response from Microsoft 365 Copilot. On the right side there are the available agents and the recent chats.](../../../assets/images/make/agent-builder-01/create-agent-07.png)

<cc-end-step lab="mab1" exercise="1" step="2" />

## Exercise 2: エージェントをカスタマイズする

ここからはエージェントを少しカスタマイズします。カスタム アイコンを追加し、植物・花の名前当てゲームのルールを定義します。

Microsoft 365 Copilot Chat の右上にある **New chat** を選んで新しいチャットを開始します。続いて画面右側にある **Create an agent** コマンドを選択し、先ほどと同じ手順で進めます。
同じダイアログが表示されたら、左上の Copilot Studio ロゴ横にある **My Copilot Agent** のドロップダウンを選択し、 **View all agents** をクリックして自分が作成したエージェント一覧を表示します。

![The user experience of Copilot Studio agent builder when editing an already existing agent. There is a command in the upper left side of the dialog to view all the agents that you already defined.](../../../assets/images/make/agent-builder-01/update-agent-01.png)

自分が設計したすべてのエージェントを一覧できるダイアログが表示されます。

![The user experience of Copilot Studio agent builder when showing the list of agents. There is the 'Gardener' agent highlighted with a list of action to edit, share, download, and delete the agent.](../../../assets/images/make/agent-builder-01/update-agent-02.png)

各エージェントに対して、編集・共有・ダウンロード・削除のコマンドがあります。

### Step 1: カスタム アイコンを設定する

先ほど作成した **Gardener** エージェントを編集しましょう。ダイアログは **Configure** パネルがアクティブな状態で開きます。ラボの Exercise 1 で入力した説明が、各構成設定として反映されていることを確認できます。
主な設定項目は次のとおりです。

- **Icon**: エージェントのアイコンをカスタマイズ
- **Name**: エージェントの名前
- **Description**: エージェントの説明
- **Instructions**: システムプロンプト (システム ロールと行動規則)
- **Knowledge**: ナレッジ ベースの構成
- **Actions**: 本稿執筆時点では開発中
- **Capabilities**: コード解釈や画像生成などの機能を有効化
- **Starter prompts**: 最大 6 件のスターター プロンプトを設定

アイコンをカスタマイズするには、デフォルト アイコンの横にある編集ボタンを選択します。

アイコンと背景色を変更できるダイアログが表示されます。サンプル アイコンは [こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/agent-builder/color.png) からダウンロードし、アップロードしてください。背景色は RGB 値 `#F1F1F1` を指定します。

![The dialog to update the icon and background color for the agent. There is the icon, a button to upload a new icon, and another button to set the background color. In the lower right corner there are buttons to save or cancel.](../../../assets/images/make/agent-builder-01/update-agent-03.png)

<cc-end-step lab="mab1" exercise="2" step="1" />

### Step 2: 植物／花当てゲームのルールを設定する

エージェントの設定を編集したまま、 **Instructions** フィールドの内容を次の値に更新します。

```txt
You are an expert gardener and you help users to maintain and improve their home garden
providing detailed instructions and advice about the best practices for home gardening.
Here are your working rules:

- Provide detailed instructions and advice about the best practices for home gardening.
- Help users maintain and improve their home garden.
- Offer tips on plant care, soil management, pest control, and seasonal gardening tasks.
- Respond to user queries with clear and actionable steps.
- Be friendly, knowledgeable, and supportive in all interactions.
- Suggest ways to keep plants and flowers shining and gorgeous, including watering
schedules, fertilization, pruning, and pest control.
- Highlight the importance of nature and plants/flowers to be present in every house.
- Use a professional, yet friendly, tone in all responses.

Lastly, engage the user in a challenging game to guess the name of a plant or flower based
on a set of clues. Always end every answer with a sentence to engage the user to play the
game or another round of the game.
```

![The dialog with the agent settings updated accordingly to the lab instructions and with the 'Update' button highlighted.](../../../assets/images/make/agent-builder-01/update-agent-04.png)

画面右上の **Update** ボタンを選択します。更新には少し時間がかかります。完了後 **Go to agent** を選択し、結果を確認してください。プロンプトを入力すると、エージェントがゲームに誘導してくれるはずです。

![The updated agent with the new icon and the final sentence to engage the user to play the game highlighted.](../../../assets/images/make/agent-builder-01/update-agent-05.png)

参考として、エージェントと植物名を当てるやり取りのサンプルを以下に示します。

![A sample interaction between the user and the agent while guessing the name of a plant.](../../../assets/images/make/agent-builder-01/update-agent-06.png)

<cc-end-step lab="mab1" exercise="2" step="2" />

## Exercise 3: SharePoint Online ナレッジ ベースを追加する

この演習では、 Word ドキュメントを **Gardener** エージェントの追加ナレッジ ベースとして組み込みます。

### Step 1: ナレッジ ベース ドキュメントをアップロードする

まずは植物や花に関する情報をまとめた Microsoft Word ドキュメントを用意しましょう。

こちらの [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/agent-builder/sharepoint-docs&filename=sharepoint-docs) から 4 つの DOCX ファイルが入った zip ファイルをダウンロードしてください。

zip を展開し、テナント内の任意の SharePoint Teams サイトの **Documents** ドキュメント ライブラリにアップロードします。
ファイルは **Basic Aspects of Gardening and Maintaining a Healthy Garden.docx**、 **Common Plants List.docx**、 **Healing a Plant in Your Garden**、 **The Most Common Types of Plants in a Home Garden.docx** の 4 つです。これによりエージェントの専門性が高まり、ゲームもよりチャレンジングになります。

サイトの絶対 URL (例: `https://xyz.sharepoint.com/sites/contoso`) をコピーし、次のステップへ進みます。

<cc-end-step lab="mab1" exercise="3" step="1" />

### Step 2: SharePoint Online ドキュメントを参照させる

エージェント一覧に戻り、 **Gardener** エージェントを編集して **Knowledge** セクションまでスクロールします。 SharePoint ナレッジ ベース用のフィールドに先ほどコピーした SharePoint Online サイトの URL を貼り付けます。 **Browse** ボタンを使用してテナント内のサイトを検索しても構いません。

![The configuration dialog of the agent with the 'Knowledge' section and the 'SharePoint' URL field highlighted.](../../../assets/images/make/agent-builder-01/update-agent-07.png)

エージェントを更新し、再度対話してみましょう。カスタム ナレッジ ベースに基づいた、より専門的な回答が得られるはずです。

<cc-end-step lab="mab1" exercise="3" step="2" />

## Exercise 4: エージェントの最終調整

この演習では、 **Gardener** エージェントに画像生成機能を追加し、同僚と共有します。

### Step 1: 画像生成を有効化する

再び **Gardener** エージェントを編集し、構成パネルを下へスクロールして **Capabilities** セクションを探します。 **Image generator** オプションを有効化し、エージェントを更新します。

![The configuration dialog of the agent with the 'Capabilities' section and the 'Image generator' option selected and highlighted.](../../../assets/images/make/agent-builder-01/update-agent-08.png)

エージェントを再読み込みし、次のプロンプトを入力します。

```txt
Generate the image of a dozen of red roses
```

下図は生成された画像付きの応答例です。

![The 'Gardener' agent with the answer to a prompt that generated an image of a dozen of red roses.](../../../assets/images/make/agent-builder-01/update-agent-09.png)

<cc-end-step lab="mab1" exercise="4" step="1" />

### Step 2: エージェントを共有する

最後にエージェントを同僚と共有しましょう。エージェントをもう一度編集します。
右上の **Update** ボタンの横にある **Share** ボタンを選択すると、共有ダイアログがポップアップ表示され、次の共有対象を選択できます。

- 組織内の全員
- セキュリティ グループを通じた組織内の特定ユーザー
- 自分のみ

「特定ユーザー」を選択し、共有相手のメール アドレスを入力して **Save** ボタンをクリックします。
共有プロセスが完了すると、エージェントへアクセスするための URL が表示されます。この URL を共有相手に送付してください。

![The panel to configure the sharing target. Available options are 'Anyone in your organization', 'Specific users in your organization via security groups', or 'Only you'. The panel also provides a button to 'Save' the sharing option and a URL to access the agent.](../../../assets/images/make/agent-builder-01/update-agent-10.png)

<cc-end-step lab="mab1" exercise="4" step="2" />

---8<--- "ja/mab-congratulations.md"

素晴らしいエージェントが完成しましたね 🎉！これで **Copilot Studio エージェント ビルダー** コースは終了です。 Gardener エージェントの作成はいかがでしたか？ぜひご感想をお聞かせください 💜

## 参考資料
- [Declarative agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-declarative-copilot){target=_blank}
- [Build agents with Copilot Studio agent builder](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-build){target=_blank}
- [Publish and manage Copilot Studio agent builder agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-publish){target=_blank}

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/01-first-agent--ja" />