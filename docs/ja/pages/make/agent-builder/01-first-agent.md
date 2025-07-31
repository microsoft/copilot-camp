---
search:
  exclude: true
---
# ラボ MAB1 - 最初のエージェント構築

---8<--- "ja/mab-labs-prelude.md"

このラボでは、Copilot Studio エージェント ビルダーを使用してシンプルな宣言型エージェントを作成します。今回のエージェントは、 ユーザー が家庭菜園を維持・改善する際に役立つよう設計されています。エージェントの知識ベースは、SharePoint Online に保存されたドキュメントのセットと、パブリック Web コンテンツに基づいています。さらに、ユーザー に植物や花の名前をヒントから当ててもらうゲームで楽しませることもできます。

このラボで学習する内容:

- Microsoft 365 Copilot 用宣言型エージェントとは
- Copilot Studio エージェント ビルダーで宣言型エージェントを作成する
- 特定の指示を使ってゲームを作成し、エージェントをカスタマイズする
- SharePoint Online に保存されたドキュメントを参照するようエージェントを構成する
- 画像生成機能をエージェントに追加する
- エージェントを他の人と共有する方法を学ぶ

## はじめに

宣言型エージェントは、Microsoft 365 Copilot と同じスケーラブルなインフラストラクチャとプラットフォームを活用しつつ、特定領域に特化してニーズを満たすよう調整されています。標準の Microsoft 365 Copilot チャットと同じインターフェイスを使用しながら、対象タスクのみに集中できるよう専門家として機能します。

宣言型エージェント作成へようこそ ☺️！ あなた自身の Copilot で魔法を起こしましょう。

このラボでは、Copilot Studio エージェント ビルダーで宣言型エージェントを作成し、サンプルの指示を与えるところから始めます。

次に、植物や花の名前を当てるゲームに特化させるため、エージェントを変更します。

さらに、SharePoint Online に保存したファイルをエージェントに渡し、仮想の知識ベースとして参照させます。

最後に、組織内の他の人とエージェントを共有します。

![The initial UI of the Gardener agent with a couple of guesses from the user.](../../../assets/images/make/agent-builder-01/gardener-agent.gif)

## 演習 1: 宣言型エージェントの作成

さぁ始めましょう！ 💪🏼 Copilot Studio エージェント ビルダーでゼロからエージェントを作成します。

### 手順 1: エージェントを説明する

Copilot Studio エージェント ビルダーで宣言型エージェントを作成するには、[Microsoft 365 Copilot チャット ホームページ](https://www.microsoft365.com/copilot){target=_blank} を開き、右側のパネルにある **Create an agent** を選択します。以下の図のように、利用可能なエージェントが一覧表示されます。

![Microsoft 365 Copilot Chat with the 'Create an agent' command highlighted.](../../../assets/images/make/agent-builder-01/create-agent-01.png)

Copilot Studio エージェント ビルダーがポップアップ表示され、カスタム エージェントの定義を開始できます。テンプレートを選択して開始することも、自然言語でエージェントを *説明* することも可能です。**Configure** オプションを選択して手動で構成することもできますが、それは後ほど行います。以下の説明を入力してください。

```txt
You are an expert gardener and you help users to maintain and improve their home garden
providing detailed instructions and advice about the best practices for home gardening.
```

![The user experience of the Copilot Studio agent builder. On the lower left side there is a textbox that you can use to provide instructions to the agent builder, while on the right side there is a preview of the agent.](../../../assets/images/make/agent-builder-01/create-agent-02.png)

指示を入力すると、エージェント ビルダーは新しいエージェントの名前を尋ねます。名前には *Gardener* と入力してください。エージェント ビルダーと対話している間、ダイアログ右側にはエージェントのプレビューと、いくつかの会話スターターが表示されます。エージェント ビルダーが指示の詳細化を求めた場合、次の文を入力します。

```txt
Suggest ways to keep plants and flowers shining and gorgeous
```

![The user experience of the Copilot Studio agent builder. On the lower left side there is the interaction with the agent builder, while on the right side there is a preview of the agent.](../../../assets/images/make/agent-builder-01/create-agent-03.png)

エージェント ビルダーが必要な情報をすべて取得するまで対話を続けます。強調すべき点を尋ねられたら、次の文を入力します。

```txt
Highlight the importance of nature and plants/flowers to be present in every house!
```

エージェントの話し方を尋ねられたら、次の文で答えます。

```txt
Use a professional, yet friendly, tone.
```

最後に、追加の修正がないことを伝え、画面右上の **Create** ボタンを選択します。

![The user experience of the Copilot Studio agent builder with the 'Create' button highlighted.](../../../assets/images/make/agent-builder-01/create-agent-04.png)

Copilot Studio エージェント ビルダーは、提供した指示に基づいて新しいエージェントを作成します。

<cc-end-step lab="mab1" exercise="1" step="1" />

### 手順 2: エージェントをテストする

エージェントが準備できると、エージェントへのリンクと、組織内の他の人と共有するためのリンクを含むポップアップ ダイアログが表示されます。

![The dialog confirming the creation of the new 'Gardener' agent, providing a link to the agent and actions to share the agent.](../../../assets/images/make/agent-builder-01/create-agent-05.png)

**Go to agent** ボタンを選択すると、作成したばかりのエージェントの実際のユーザー エクスペリエンスに移動します。

![The user experience of the 'Gardener' agent that you have just created. There is the name of the agent at the top of the screen, followed by a set of conversation starters generated by the Copilot Studio agent builder, and then the textbox to provide a new prompt to the agent.](../../../assets/images/make/agent-builder-01/create-agent-06.png)

エージェントとやり取りを開始するには、最初の提案プロンプトをクリックし、エージェントの応答を確認してください。これでエージェントは準備完了です。おめでとうございます！

![The user experience of the 'Gardener' agent in action. There is a prompt at the top of the left side of the screen and the response from Microsoft 365 Copilot. On the right side there are the available agents and the recent chats.](../../../assets/images/make/agent-builder-01/create-agent-07.png)

<cc-end-step lab="mab1" exercise="1" step="2" />

## 演習 2: エージェントのカスタマイズ

次はエージェントを少しカスタマイズします。カスタム アイコンを追加し、植物／花の名前当てゲームのルールを定義します。

Microsoft 365 Copilot Chat の右上にある **New chat** を選択して新しいチャットを開始します。前と同様に、画面右側で **Create an agent** コマンドを選択します。同じダイアログが表示されたら、左上の **Copilot Studio** ロゴの横にある **My Copilot Agent** ドロップダウンを選択し、**View all agents** を選択して作成済みエージェントの一覧を表示します。

![The user experience of Copilot Studio agent builder when editing an already existing agent. There is a command in the upper left side of the dialog to view all the agents that you already defined.](../../../assets/images/make/agent-builder-01/update-agent-01.png)

作成済みエージェントの一覧を含む新しいダイアログが表示されます。

![The user experience of Copilot Studio agent builder when showing the list of agents. There is the 'Gardener' agent highlighted with a list of action to edit, share, download, and delete the agent.](../../../assets/images/make/agent-builder-01/update-agent-02.png)

各エージェントには、編集・共有・ダウンロード・削除のコマンドがあります。

### 手順 1: カスタム アイコンを設定する

先ほど作成した **Gardener** エージェントを編集しましょう。ダイアログは **Configure** パネルがアクティブになった状態で開きます。演習 1 で入力した説明が、すべてエージェントの設定項目として反映されていることが確認できます。設定可能な項目は次のとおりです。

- **Icon**: エージェントのアイコンをカスタマイズ
- **Name**: エージェント名
- **Description**: エージェントの説明
- **Instructions**: システムプロンプト。システム ロールと行動ルールを定義
- **Knowledge**: エージェントの知識ベースを構成
- **Actions**: 本稿執筆時点では開発中
- **Capabilities**: コード実行や画像生成などの機能を有効化
- **Starter prompts**: 最大 6 件のスターター プロンプトを設定

アイコンをカスタマイズするには、既定アイコンの横にある編集ボタンを選択します。

ポップアップ ダイアログでアイコンと背景色を変更できます。便利のため、[こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/agent-builder/color.png) からサンプル アイコンをダウンロードしてアップロードしてください。背景色は RGB 値 #F1F1F1 を設定します。

![The dialog to update the icon and background color for the agent. There is the icon, a button to upload a new icon, and another button to set the background color. In the lower right corner there are buttons to save or cancel.](../../../assets/images/make/agent-builder-01/update-agent-03.png)

<cc-end-step lab="mab1" exercise="2" step="1" />

### 手順 2: 植物／花当てゲームのルールを定義する

エージェントの設定を編集したまま、**Instructions** フィールドの内容を次の値に更新します。

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

設定ダイアログ右上の **Update** ボタンを選択します。更新には少し時間がかかります。完了したら **Go to agent** を選択して結果を確認します。プロンプトを入力すると、エージェントがゲームを始めるよう促します。

![The updated agent with the new icon and the final sentence to engage the user to play the game highlighted.](../../../assets/images/make/agent-builder-01/update-agent-05.png)

参考までに、植物の名前を当てるサンプル ダイアログを以下に示します。

![A sample interaction between the user and the agent while guessing the name of a plant.](../../../assets/images/make/agent-builder-01/update-agent-06.png)

<cc-end-step lab="mab1" exercise="2" step="2" />

## 演習 3: SharePoint Online の知識ベースを追加

この演習では、Word ドキュメントを **Gardener** エージェントの追加知識ベースとして設定します。

### 手順 1: 知識ベース ドキュメントをアップロードする

特定情報を含む Microsoft Word ドキュメントをいくつか知識ベースとして追加します。

この [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/agent-builder/sharepoint-docs&filename=sharepoint-docs) を選択して、４つの DOCX ファイルが入った zip ファイルをダウンロードします。

zip を展開し、同じテナントの SharePoint Teams サイトにアップロードします。ドキュメント ライブラリ **Documents** に配置してください。ファイルは次の４つです: **Basic Aspects of Gardening and Maintaining a Healthy Garden.docx**、**Common Plants List.docx**、**Healing a Plant in Your Garden**、**The Most Common Types of Plants in a Home Garden.docx**。これにより、エージェントはより専門的になり、ゲームも難易度が上がります。

サイトの絶対 URL（例: `https://xyz.sharepoint.com/sites/contoso`）をコピーし、次の手順に進みます。

<cc-end-step lab="mab1" exercise="3" step="1" />

### 手順 2: SharePoint Online ドキュメントを追加する

エージェント一覧に戻り、**Gardener** エージェントを編集して **Knowledge** セクションまでスクロールします。SharePoint 知識ベース用のフィールドに SharePoint Online サイトの URL を貼り付けます。URL の代わりに **Browse** ボタンを使い、テナント内のサイトを検索して選択してもかまいません。

![The configuration dialog of the agent with the 'Knowledge' section and the 'SharePoint' URL field highlighted.](../../../assets/images/make/agent-builder-01/update-agent-07.png)

エージェントを更新して再度対話すると、カスタム知識ベースに基づいた、より専門的な回答が得られます。

<cc-end-step lab="mab1" exercise="3" step="2" />

## 演習 4: エージェントの最終調整

この演習では、**Gardener** エージェントに画像生成機能を追加し、同僚と共有します。

### 手順 1: 画像生成機能を追加する

再度 **Gardener** エージェントを編集し、設定パネルを下にスクロールして **Capabilities** セクションを見つけます。**Image generator** オプションを有効にし、エージェントを更新します。

![The configuration dialog of the agent with the 'Capabilities' section and the 'Image generator' option selected and highlighted.](../../../assets/images/make/agent-builder-01/update-agent-08.png)

エージェントをリロードして、次のプロンプトを入力します。

```txt
Generate the image of a dozen of red roses
```

下図は生成された画像の出力例です。

![The 'Gardener' agent with the answer to a prompt that generated an image of a dozen of red roses.](../../../assets/images/make/agent-builder-01/update-agent-09.png)

<cc-end-step lab="mab1" exercise="4" step="1" />

### 手順 2: エージェントを共有する

これで同僚とエージェントを共有する準備が整いました。最後にもう一度エージェントを編集します。
右上の **Update** ボタンの横にある **Share** ボタンを選択すると、共有ダイアログが表示され、次の共有対象を選択できます。

- 組織内のすべての人
- セキュリティ グループ経由で組織内の特定ユーザー
- 自分のみ

特定ユーザーと共有するオプションを選択し、共有対象のメール アドレスを入力して **Save** を選択します。
共有プロセスが完了すると、共有した ユーザー に渡せる URL を含むダイアログが表示されます。

![The panel to configure the sharing target. Available options are 'Anyone in your organization', 'Specific users in your organization via security groups', or 'Only you'. The panel also provides a button to 'Save' the sharing option and a URL to access the agent.](../../../assets/images/make/agent-builder-01/update-agent-10.png)

<cc-end-step lab="mab1" exercise="4" step="2" />

---8<--- "ja/mab-congratulations.md"

素晴らしいエージェントが完成しましたね 🎉 ! これで **Copilot Studio エージェント ビルダー** コースは終了です。Gardener エージェントの作成はいかがでしたか？ ぜひ感想をお聞かせください 💜

## 参考資料
- [宣言型エージェント](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-declarative-copilot){target=_blank}
- [Copilot Studio エージェント ビルダーでエージェントを構築する](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-build){target=_blank}
- [Copilot Studio エージェント ビルダーのエージェントを公開・管理する](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-publish){target=_blank}

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/01-first-agent--ja" />