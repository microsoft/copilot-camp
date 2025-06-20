---
search:
  exclude: true
---
# Lab MAB1 - はじめてのエージェント構築

---8<--- "ja/mab-labs-prelude.md"

このラボでは、Copilot Studio エージェント ビルダーを使ってシンプルな宣言型エージェントを作成します。作成するエージェントは、 ユーザー が家庭菜園を維持・改善するのをサポートするよう設計されています。エージェントのナレッジ ベースは SharePoint Online に保存されたドキュメントと公開 Web コンテンツに基づきます。また、エージェントはヒントを基に植物や花の名前を当てるゲームで ユーザー とやり取りすることもできます。

このラボで学ぶ内容:

- Microsoft 365 Copilot の宣言型エージェントとは何か
- Copilot Studio エージェント ビルダーで宣言型エージェントを作成する方法
- 特定の instructions を使ってゲームを作成し、エージェントをカスタマイズする方法
- SharePoint Online に保存されたドキュメントをナレッジ ベースとしてエージェントに設定する方法
- エージェントで画像生成を有効にする方法
- エージェントを他の人と共有する方法
- エージェントを共有する方法を学ぶ

## はじめに

宣言型エージェントは、Microsoft 365 Copilot と同じスケーラブルなインフラストラクチャとプラットフォームを活用し、特定のニーズにフォーカスできるよう調整されています。これらは特定領域のエキスパートとして機能し、通常の Microsoft 365 Copilot チャットと同じインターフェースで利用しつつ、指定されたタスクにのみ集中させることができます。

宣言型エージェント作成の旅へようこそ ☺️！さっそく Copilot に魔法をかけましょう！

まずは Copilot Studio エージェント ビルダーで宣言型エージェントを作成し、サンプルの instructions を追加します。

次に、植物や花の名前を当てるゲームにフォーカスするようエージェントを改良します。

さらに、SharePoint Online に保存したファイルをナレッジ ベースとしてエージェントに提供します。

最後に、エージェントを組織内の他の人と共有します。

![The initial UI of the Gardener agent with a couple of guesses from the user.](../../../assets/images/make/agent-builder-01/gardener-agent.gif)

## エクササイズ 1: 宣言型エージェントの作成

さあ始めましょう！💪🏼 まずは Copilot Studio エージェント ビルダーでエージェントをゼロから作成します。

### Step 1: エージェントを説明する

Copilot Studio エージェント ビルダーで宣言型エージェントを作成するには、[Microsoft 365 Copilot チャット ホーム ページ](https://www.microsoft365.com/copilot){target=_blank} を開き、右側のパネルにある **Create an agent** を選択します。そこには利用可能なエージェントの一覧が表示され、下図のようになります。

![Microsoft 365 Copilot Chat with the 'Create an agent' command highlighted.](../../../assets/images/make/agent-builder-01/create-agent-01.png)

Copilot Studio エージェント ビルダーが表示されたら、カスタム エージェントを定義します。テンプレートから開始することも、自然言語でエージェントを *説明* することもできます。**Configure** オプションを選んで手動で設定することもできますが、それは後ほど行います。まずは次の説明を入力してください。

```txt
You are an expert gardener and you help users to maintain and improve their home garden
providing detailed instructions and advice about the best practices for home gardening.
```

![The user experience of the Copilot Studio agent builder. On the lower left side there is a textbox that you can use to provide instructions to the agent builder, while on the right side there is a preview of the agent.](../../../assets/images/make/agent-builder-01/create-agent-02.png)

instructions を入力すると、エージェント ビルダーから新しいエージェントの名前を尋ねられます。名前に *Gardener* と入力してください。エージェント ビルダーと対話している間、ダイアログの右側にはエージェントのプレビューが表示され、会話のスターターも提案されます。さらに instructions の詳細化を求められたら、次の文章を入力します。

```txt
Suggest ways to keep plants and flowers shining and gorgeous
```

![The user experience of the Copilot Studio agent builder. On the lower left side there is the interaction with the agent builder, while on the right side there is a preview of the agent.](../../../assets/images/make/agent-builder-01/create-agent-03.png)

エージェント ビルダーが必要な情報をすべて取得できるまで対話を続けます。強調すべきポイントを尋ねられたら、次の文章を入力してください。

```txt
Highlight the importance of nature and plants/flowers to be present in every house!
```

エージェントの話し方を尋ねられたら、次の文章を入力します。

```txt
Use a professional, yet friendly, tone.
```

最後に追加の調整がないことを伝え、画面右上の **Create** ボタンを選択します。

![The user experience of the Copilot Studio agent builder with the 'Create' button highlighted.](../../../assets/images/make/agent-builder-01/create-agent-04.png)

Copilot Studio エージェント ビルダーが、提供された instructions に基づいて新しいエージェントを作成します。

<cc-end-step lab="mab1" exercise="1" step="1" />

### Step 2: エージェントをテストする

エージェントが準備できると、エージェントへのリンクと組織内の他の人と共有するリンクを含むポップアップ ダイアログが表示されます。

![The dialog confirming the creation of the new 'Gardener' agent, providing a link to the agent and actions to share the agent.](../../../assets/images/make/agent-builder-01/create-agent-05.png)

**Go to agent** ボタンを選択すると、作成したエージェントのユーザー エクスペリエンスが開きます。

![The user experience of the 'Gardener' agent that you have just created. There is the name of the agent at the top of the screen, followed by a set of conversation starters generated by the Copilot Studio agent builder, and then the textbox to provide a new prompt to the agent.](../../../assets/images/make/agent-builder-01/create-agent-06.png)

エージェントと対話を始めるには、最初の推奨プロンプトをクリックし、エージェントの応答を確認します。これでエージェントが完成しました。おめでとうございます！

![The user experience of the 'Gardener' agent in action. There is a prompt at the top of the left side of the screen and the response from Microsoft 365 Copilot. On the right side there are the available agents and the recent chats.](../../../assets/images/make/agent-builder-01/create-agent-07.png)

<cc-end-step lab="mab1" exercise="1" step="2" />

## エクササイズ 2: エージェントのカスタマイズ

次はエージェントを少しカスタマイズします。カスタム アイコンを追加し、植物や花の名前を当てるゲームのルールを定義します。

Microsoft 365 Copilot Chat の右上にある **New chat** ボタンで新しいチャットを開始し、先ほどと同様に右側の **Create an agent** を選択します。
先ほど使用したのと同じダイアログが表示されます。今回は、ダイアログ左上の **Copilot Studio** ロゴの横にある **My Copilot Agent** ドロップダウンを選択し、**View all agents** を選択して Copilot Studio エージェント ビルダーで作成したエージェント一覧を表示します。

![The user experience of Copilot Studio agent builder when editing an already existing agent. There is a command in the upper left side of the dialog to view all the agents that you already defined.](../../../assets/images/make/agent-builder-01/update-agent-01.png)

作成したエージェントの一覧が表示されます。

![The user experience of Copilot Studio agent builder when showing the list of agents. There is the 'Gardener' agent highlighted with a list of action to edit, share, download, and delete the agent.](../../../assets/images/make/agent-builder-01/update-agent-02.png)

各エージェントに対して、編集・共有・ダウンロード・削除のコマンドがあります。

### Step 1: カスタム アイコンを設定する

先ほど作成した **Gardener** エージェントを編集します。ダイアログは **Configure** パネルから始まります。ラボのエクササイズ 1 で入力した説明がエージェントの個別設定になっていることを確認できます。
設定できる項目:

- **Icon**: エージェントのアイコンをカスタマイズ
- **Name**: エージェントの名前
- **Description**: エージェントの説明
- **Instructions**: エージェントの system prompt。システム ロールと動作ルールを定義
- **Knowledge**: ナレッジ ベースの設定
- **Actions**: 執筆時点では開発中
- **Capabilities**: コード解釈や画像生成などの機能を有効化
- **Starter prompts**: エージェント用のスターター プロンプトを最大 6 件設定

アイコンをカスタマイズするには、既定のアイコン横にある編集ボタンを選択します。

ダイアログが表示され、アイコンと背景色を変更できます。サンプル アイコンを [こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/agent-builder/color.png) からダウンロードしてアップロードしてください。背景色は RGB 値 #F1F1F1 を設定します。

![The dialog to update the icon and background color for the agent. There is the icon, a button to upload a new icon, and another button to set the background color. In the lower right corner there are buttons to save or cancel.](../../../assets/images/make/agent-builder-01/update-agent-03.png)

<cc-end-step lab="mab1" exercise="2" step="1" />

### Step 2: 植物／花当てゲームのルールを定義する

引き続きエージェントの設定を編集し、**Instructions** フィールドの内容を次の値に更新します。

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

画面右上の **Update** ボタンを選択します。更新には少し時間がかかります。完了後 **Go to agent** を選択し結果を確認します。エージェントにリクエストを送ると、ゲームに参加するよう促されることを確認してください。

![The updated agent with the new icon and the final sentence to engage the user to play the game highlighted.](../../../assets/images/make/agent-builder-01/update-agent-05.png)

参考までに、エージェントと植物名を当てるやり取りの例を示します。

![A sample interaction between the user and the agent while guessing the name of a plant.](../../../assets/images/make/agent-builder-01/update-agent-06.png)

<cc-end-step lab="mab1" exercise="2" step="2" />

## エクササイズ 3: SharePoint Online ナレッジ ベースの追加

このエクササイズでは、Word ドキュメントを **Gardener** エージェントの追加ナレッジ ベースとして設定します。

### Step 1: ナレッジ ベース ドキュメントのアップロード

まずは、カスタム ナレッジ ベースとして植物や花に関する情報が記載された Microsoft Word ドキュメントをアップロードします。

この [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/agent-builder/sharepoint-docs&filename=sharepoint-docs) から 4 つの DOCX ファイルを含む zip ファイルをダウンロードしてください。

zip を展開し、同じテナントの SharePoint Teams サイトにアップロードします。ドキュメント ライブラリ **Documents** に配置してください。
ファイルは **Basic Aspects of Gardening and Maintaining a Healthy Garden.docx**、**Common Plants List.docx**、**Healing a Plant in Your Garden**、**The Most Common Types of Plants in a Home Garden.docx** です。これによりエージェントがより専門的になり、ゲームも難しくなります。

サイトの絶対 URL（例: `https://xyz.sharepoint.com/sites/contoso`）をコピーし、次のステップへ進みます。

<cc-end-step lab="mab1" exercise="3" step="1" />

### Step 2: SharePoint Online ドキュメントのサポートを追加

エージェント一覧に戻り、**Gardener** エージェントを編集して **Knowledge** セクションまでスクロールします。SharePoint ナレッジ ベースのフィールドに先ほどコピーした SharePoint Online サイトの URL を貼り付けます。もしくは **Browse** ボタンからテナント内のサイトを検索することもできます。

![The configuration dialog of the agent with the 'Knowledge' section and the 'SharePoint' URL field highlighted.](../../../assets/images/make/agent-builder-01/update-agent-07.png)

エージェントを更新して再度対話すると、カスタム ナレッジ ベースに基づいたより専門的な回答を得られるようになります。

<cc-end-step lab="mab1" exercise="3" step="2" />

## エクササイズ 4: エージェントの最終仕上げ

このエクササイズでは、**Gardener** エージェントに画像生成機能を追加し、同僚と共有します。

### Step 1: 画像生成機能を追加する

再度 **Gardener** エージェントを編集し、設定パネルを下にスクロールして **Capabilities** セクションを探します。**Image generator** オプションを有効にしてエージェントを更新します。

![The configuration dialog of the agent with the 'Capabilities' section and the 'Image generator' option selected and highlighted.](../../../assets/images/make/agent-builder-01/update-agent-08.png)

エージェントを再読み込みし、次のプロンプトを入力します。

```txt
Generate the image of a dozen of red roses
```

以下の画像は生成された結果例です。

![The 'Gardener' agent with the answer to a prompt that generated an image of a dozen of red roses.](../../../assets/images/make/agent-builder-01/update-agent-09.png)

<cc-end-step lab="mab1" exercise="4" step="1" />

### Step 2: エージェントを共有する

準備が整ったらエージェントを共有します。最後にもう一度エージェントを編集します。
右上の **Update** ボタンの隣に **Share** ボタンがあります。
選択すると共有ダイアログが表示され、以下の対象から共有先を選べます。

- 組織内の全員
- 組織内の特定のユーザー（セキュリティ グループ経由）
- 自分のみ

特定のユーザーと共有するオプションを選択し、共有相手のメール アドレスを入力して **Save** を選択します。
共有プロセス完了後、コピー可能な URL が表示され、共有した ユーザー に送信できます。

![The panel to configure the sharing target. Available options are 'Anyone in your organization', 'Specific users in your organization via security groups', or 'Only you'. The panel also provides a button to 'Save' the sharing option and a URL to access the agent.](../../../assets/images/make/agent-builder-01/update-agent-10.png)

<cc-end-step lab="mab1" exercise="4" step="2" />

---8<--- "ja/mab-congratulations.md"

エージェントの作成、お疲れさまでした 🎉 ! これで **Copilot Studio エージェント ビルダー** コースは終了です！Gardener エージェントの作成は楽しめましたか？ぜひご感想をお聞かせください 💜

## 参考資料
- [Declarative agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-declarative-copilot){target=_blank}
- [Build agents with Copilot Studio agent builder](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-build){target=_blank}
- [Publish and manage Copilot Studio agent builder agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-publish){target=_blank}

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/01-first-agent" />