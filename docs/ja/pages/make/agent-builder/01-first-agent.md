---
search:
  exclude: true
---
# ラボ MAB1 - 最初のエージェント構築

---8<--- "ja/mab-labs-prelude.md"

このラボでは、Copilot Studio エージェントビルダーを使用してシンプルな宣言型エージェントを作成します。今回作成するエージェントは、ユーザーが家庭菜園を維持・改善できるよう支援するものです。エージェントのナレッジベースは SharePoint Online に保存されたドキュメントとパブリック Web コンテンツに基づいています。また、植物や花の名前を手がかりから当てるゲームでユーザーと楽しくやり取りすることもできます。

このラボで学べること:

- Microsoft 365 Copilot 向け宣言型エージェントとは何か  
- Copilot Studio エージェントビルダーで宣言型エージェントを作成する方法  
- ゲームを作成するためにエージェントをカスタマイズする方法  
- SharePoint Online に保存されたドキュメントをエージェントの参照元として構成する方法  
- エージェントに画像生成機能を追加する方法  
- エージェントを他の人と共有する方法  
- エージェントを他の人と共有する方法を学習する  

## はじめに

宣言型エージェントは Microsoft 365 Copilot と同じスケーラブルなインフラストラクチャとプラットフォームを活用し、特定分野にフォーカスしたニーズに合わせて構成できます。  
これらは特定領域の専門家として機能し、通常の Microsoft 365 Copilot チャットと同じインターフェースを使用しながら、与えられたタスクのみに集中させることができます。  

宣言型エージェント作成へようこそ ☺️！ さっそく Copilot に魔法をかけましょう！

このラボではまず、Copilot Studio エージェントビルダーを使って宣言型エージェントを作成し、サンプルの指示を与えてスタートします。  

次に、植物または花の名前当てゲームに専念させるようエージェントを変更します。  

さらに、SharePoint Online に保存したファイルをエージェントに渡して仮想ナレッジベースとします。  

最後に、エージェントを組織内の他の人と共有します。

![The initial UI of the Gardener agent with a couple of guesses from the user.](../../../assets/images/make/agent-builder-01/gardener-agent.gif)

## 演習 1: 宣言型エージェントの作成

さあ始めましょう！ 💪🏼 Copilot Studio エージェントビルダーを使ってゼロからエージェントを作ります。

### 手順 1: エージェントを説明する

Copilot Studio エージェントビルダーで宣言型エージェントを作成するには、[Microsoft 365 Copilot チャットのホームページ](https://www.microsoft365.com/copilot){target=_blank} を開き、右側パネルの **Create an agent** を選択します。そこには利用可能なエージェントの一覧が表示されています。以下の画像を参照してください。

![Microsoft 365 Copilot Chat with the 'Create an agent' command highlighted.](../../../assets/images/make/agent-builder-01/create-agent-01.png)

Copilot Studio エージェントビルダーがポップアップし、カスタムエージェントの定義を開始できます。テンプレートを選択して開始するか、自然言語でエージェントを *説明* することもできます。**Configure** オプションを選択して手動で構成することも可能ですが、それは後ほど行います。まずは次の初期説明を入力してください。

```txt
You are an expert gardener and you help users to maintain and improve their home garden
providing detailed instructions and advice about the best practices for home gardening.
```

![The user experience of the Copilot Studio agent builder. On the lower left side there is a textbox that you can use to provide instructions to the agent builder, while on the right side there is a preview of the agent.](../../../assets/images/make/agent-builder-01/create-agent-02.png)

指示を入力すると、エージェントビルダーから新しいエージェント名の入力を求められます。*Gardener* と入力してください。エージェントビルダーとのやり取り中、ダイアログ右側にはエージェントのプレビューと会話スターターが表示されます。さらに詳細を尋ねられたら、次の文章を入力します。

```txt
Suggest ways to keep plants and flowers shining and gorgeous
```

![The user experience of the Copilot Studio agent builder. On the lower left side there is the interaction with the agent builder, while on the right side there is a preview of the agent.](../../../assets/images/make/agent-builder-01/create-agent-03.png)

必要な情報が揃うまでエージェントビルダーと対話を続けます。強調すべき点を尋ねられたら、次の文章を入力します。

```txt
Highlight the importance of nature and plants/flowers to be present in every house!
```

エージェントの口調について尋ねられたら、次の文章で回答してください。

```txt
Use a professional, yet friendly, tone.
```

最後に、これ以上の修正はないと伝え、画面右上の **Create** ボタンを選択します。 

![The user experience of the Copilot Studio agent builder with the 'Create' button highlighted.](../../../assets/images/make/agent-builder-01/create-agent-04.png)

Copilot Studio エージェントビルダーが、入力した指示に基づいて新しいエージェントを作成します。 

<cc-end-step lab="mab1" exercise="1" step="1" />

### 手順 2: エージェントをテストする

エージェントが準備できると、エージェントへのリンクと組織内で共有するためのリンクを含むポップアップダイアログが表示されます。

![The dialog confirming the creation of the new 'Gardener' agent, providing a link to the agent and actions to share the agent.](../../../assets/images/make/agent-builder-01/create-agent-05.png)

**Go to agent** ボタンを選択すると、作成したエージェントの実際のユーザーエクスペリエンスが表示されます。

![The user experience of the 'Gardener' agent that you have just created. There is the name of the agent at the top of the screen, followed by a set of conversation starters generated by the Copilot Studio agent builder, and then the textbox to provide a new prompt to the agent.](../../../assets/images/make/agent-builder-01/create-agent-06.png)

エージェントと対話を開始するには、最初の提案プロンプトをクリックし、エージェントからの応答を確認してください。これでエージェントは準備完了です。おめでとうございます！

![The user experience of the 'Gardener' agent in action. There is a prompt at the top of the left side of the screen and the response from Microsoft 365 Copilot. On the right side there are the available agents and the recent chats.](../../../assets/images/make/agent-builder-01/create-agent-07.png)

<cc-end-step lab="mab1" exercise="1" step="2" />

## 演習 2: エージェントのカスタマイズ

次はエージェントを少しカスタマイズします。カスタムアイコンを追加し、植物または花の名前当てゲームのルールを定義します。

Microsoft 365 Copilot Chat 画面右上の **New chat** を選択して新しいチャットを開始します。先ほどと同じように右側の **Create an agent** コマンドを選択してください。  
前と同じダイアログが表示されます。今回は、ダイアログ左上にある **Copilot Studio** ロゴの横、**My Copilot Agent** のドロップダウンを選択し、**View all agents** を選びます。これで Copilot Studio エージェントビルダーで作成したすべてのエージェント一覧が表示されます。

![The user experience of Copilot Studio agent builder when editing an already existing agent. There is a command in the upper left side of the dialog to view all the agents that you already defined.](../../../assets/images/make/agent-builder-01/update-agent-01.png)

エージェントの一覧が新しいダイアログで表示されます。

![The user experience of Copilot Studio agent builder when showing the list of agents. There is the 'Gardener' agent highlighted with a list of action to edit, share, download, and delete the agent.](../../../assets/images/make/agent-builder-01/update-agent-02.png)

各エージェントには編集、共有、ダウンロード、削除の各コマンドがあります。

### 手順 1: カスタムアイコンを設定する

先ほど作成した **Gardener** エージェントを編集します。ダイアログは **Configure** パネルが表示された状態で開きます。演習 1 で入力した説明が、今ではエージェントの具体的な設定項目になっていることが確認できます。  
設定できる項目は以下のとおりです。

- **Icon**: エージェントのアイコンをカスタマイズ  
- **Name**: エージェント名  
- **Description**: エージェントの説明  
- **Instructions**: システムプロンプト。システムロールと動作ルールを定義  
- **Knowledge**: ナレッジベースの構成  
- **Actions**: 執筆時点では開発中  
- **Capabilities**: コード解釈や画像生成などの機能を有効化  
- **Starter prompts**: 最大 6 つのスタータープロンプトを設定  

エージェントのアイコンをカスタマイズするには、デフォルトアイコン横の編集ボタンを選択します。

アイコンと背景色を変更できるダイアログが表示されます。サンプルアイコンを [こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/agent-builder/color.png) からダウンロードし、アップロードしてください。背景色は RGB 値 #F1F1F1 を指定します。

![The dialog to update the icon and background color for the agent. There is the icon, a button to upload a new icon, and another button to set the background color. In the lower right corner there are buttons to save or cancel.](../../../assets/images/make/agent-builder-01/update-agent-03.png)

<cc-end-step lab="mab1" exercise="2" step="1" />

### 手順 2: 植物・花当てゲームのルールを定義する

エージェントの設定編集画面で **Instructions** フィールドの内容を次の値に更新します。

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

画面右上の **Update** ボタンを選択します。更新にはしばらく時間がかかります。完了したら **Go to agent** を選択し、最終結果を確認します。プロンプトを入力すると、エージェントがゲームに誘導することを確認できます。

![The updated agent with the new icon and the final sentence to engage the user to play the game highlighted.](../../../assets/images/make/agent-builder-01/update-agent-05.png)

参考までに、植物名を当てる際のサンプル対話を示します。

![A sample interaction between the user and the agent while guessing the name of a plant.](../../../assets/images/make/agent-builder-01/update-agent-06.png)

<cc-end-step lab="mab1" exercise="2" step="2" />

## 演習 3: SharePoint Online ナレッジベースの追加

この演習では、Word ドキュメントを **Gardener** エージェントの追加ナレッジベースとして設定します。

### 手順 1: ナレッジベースドキュメントをアップロードする

まずはカスタムナレッジベースとして、植物と花に関する情報が入った Microsoft Word ドキュメントを追加しましょう。

この [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/agent-builder/sharepoint-docs&filename=sharepoint-docs) から DOCX ファイル 4 件を zip 形式でダウンロードしてください。

zip を展開し、同一テナント内の SharePoint Teams サイトの **Documents** ライブラリにアップロードします。  
ファイルは **Basic Aspects of Gardening and Maintaining a Healthy Garden.docx**、**Common Plants List.docx**、**Healing a Plant in Your Garden**、**The Most Common Types of Plants in a Home Garden.docx** です。これによりエージェントの専門性が高まり、ゲームもよりチャレンジングになります。

サイトの絶対 URL（例: `https://xyz.sharepoint.com/sites/contoso`）をコピーして次の手順に進みます。

<cc-end-step lab="mab1" exercise="3" step="1" />

### 手順 2: SharePoint Online ドキュメントを追加する

エージェント一覧に戻り、**Gardener** エージェントを編集して **Knowledge** セクションまでスクロールします。SharePoint ナレッジベース用のフィールドに先ほどコピーした SharePoint Online サイトの URL を貼り付けます。**Browse** ボタンを使用してテナント内のサイトを検索し、選択することもできます。

![The configuration dialog of the agent with the 'Knowledge' section and the 'SharePoint' URL field highlighted.](../../../assets/images/make/agent-builder-01/update-agent-07.png)

エージェントを更新し、再度対話してみましょう。カスタムナレッジベースに基づいた、より専門的な回答が得られるはずです。

<cc-end-step lab="mab1" exercise="3" step="2" />

## 演習 4: エージェントの最終調整

この演習では、**Gardener** エージェントに画像生成機能を追加し、同僚と共有します。

### 手順 1: 画像生成機能を追加する

**Gardener** エージェントを再度編集し、構成パネル内を下へスクロールして **Capabilities** セクションを見つけます。**Image generator** オプションを有効にし、エージェントを更新します。

![The configuration dialog of the agent with the 'Capabilities' section and the 'Image generator' option selected and highlighted.](../../../assets/images/make/agent-builder-01/update-agent-08.png)

エージェントをリロードして、次のプロンプトを入力します。

```txt
Generate the image of a dozen of red roses
```

以下の画像は生成されたイメージの例です。

![The 'Gardener' agent with the answer to a prompt that generated an image of a dozen of red roses.](../../../assets/images/make/agent-builder-01/update-agent-09.png)

<cc-end-step lab="mab1" exercise="4" step="1" />

### 手順 2: エージェントを共有する

準備が整ったら、最後にエージェントを同僚と共有しましょう。エージェントを再度編集します。  
右上の **Update** ボタンの横にある **Share** ボタンを選択すると、共有ダイアログが表示されます。以下のいずれかで共有対象を選択できます。

- 組織内の誰でも  
- 組織内の特定ユーザー (セキュリティグループ経由)  
- 自分のみ  

特定ユーザーと共有するオプションを選び、共有相手のメールアドレスを入力して **Save** ボタンを選択します。  
共有プロセスが完了すると、エージェントにアクセスするための URL が表示されます。この URL を共有相手に送ってください。

![The panel to configure the sharing target. Available options are 'Anyone in your organization', 'Specific users in your organization via security groups', or 'Only you'. The panel also provides a button to 'Save' the sharing option and a URL to access the agent.](../../../assets/images/make/agent-builder-01/update-agent-10.png)

<cc-end-step lab="mab1" exercise="4" step="2" />

---8<--- "ja/mab-congratulations.md"

エージェントの作成、お疲れさまでした 🎉 ! これで **Copilot Studio エージェントビルダー** コースは終了です。Gardener エージェント作りはいかがでしたか？ ぜひ体験談やフィードバックをお聞かせください 💜

## 参考情報
- [宣言型エージェント](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-declarative-copilot){target=_blank}
- [Copilot Studio エージェントビルダーでエージェントを構築する](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-build){target=_blank}
- [Copilot Studio エージェントビルダーの発行と管理](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-publish){target=_blank}

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/01-first-agent--ja" />