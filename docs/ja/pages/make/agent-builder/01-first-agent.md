---
search:
  exclude: true
---
# ラボ MAB1 - はじめてのエージェント構築

---8<--- "ja/mab-labs-prelude.md"

このラボでは、 Copilot Studio エージェントビルダーを使ってシンプルな宣言型エージェントを作成します。作成するエージェントは、ユーザーが自宅のガーデンを維持・改善する手助けをします。エージェントのナレッジベースは、 SharePoint Online に保存された一連のドキュメントと、公開 Web コンテンツに基づいています。また、植物や花の名前を当てるゲームでユーザーと楽しく交流することもできます。

このラボで学ぶ内容:

- Microsoft 365 Copilot の宣言型エージェントとは  
- Copilot Studio エージェントビルダーで宣言型エージェントを作成する方法  
- 特定の instructions を用いてゲームを作成するためのエージェントのカスタマイズ  
- SharePoint Online に保存されたドキュメントをナレッジベースとして設定する方法  
- 画像生成を有効にする方法  
- エージェントを他の人と共有する方法  
- 他の人とエージェントを共有する方法を学ぶ  

## 概要

宣言型エージェントは、 Microsoft 365 Copilot と同じスケーラブルなインフラとプラットフォームを活用し、特定領域にフォーカスしたエキスパートとして機能します。標準の Microsoft 365 Copilot チャットと同じインターフェイスを使いながら、特定のタスクにのみ集中するように設計されています。 

あなた自身の宣言型エージェント作成へようこそ ☺️! さっそく Copilot を魔法のように活用しましょう!

このラボでは、 Copilot Studio エージェントビルダーを使い、サンプルの instructions を与えて宣言型エージェントを作成します。まずは手始めとして作ってみましょう。  

次に、植物や花の名前を当てるゲームに特化したエージェントへと変更します。  

さらに、 SharePoint Online に保存したファイルをナレッジベースとしてエージェントに提供します。  

最後に、組織内の他の人とエージェントを共有します。

![The initial UI of the Gardener agent with a couple of guesses from the user.](../../../assets/images/make/agent-builder-01/gardener-agent.gif)

## 演習 1: 宣言型エージェントの作成 

それでは始めましょう! 💪🏼 Copilot Studio エージェントビルダーでゼロからエージェントを作成します。

### 手順 1: エージェントの説明

Copilot Studio エージェントビルダーで宣言型エージェントを作成するには、 [Microsoft 365 Copilot チャットのホームページ](https://www.microsoft365.com/copilot){target=_blank} を開き、右側のパネルにある **Create an agent** を選択します。そこには利用可能なエージェント一覧が表示されています。

![Microsoft 365 Copilot Chat with the 'Create an agent' command highlighted.](../../../assets/images/make/agent-builder-01/create-agent-01.png)

Copilot Studio エージェントビルダーのウィンドウが表示され、カスタムエージェントの定義を開始できます。テンプレートを選んで始めることも、自然言語で *説明* を入力して作成することも可能です。手動で詳細設定を行う場合は **Configure** を選択できますが、それは後ほど行います。次の説明文を入力してください。

````txt
You are an expert gardener and you help users to maintain and improve their home garden
providing detailed instructions and advice about the best practices for home gardening.
````

![The user experience of the Copilot Studio agent builder. On the lower left side there is a textbox that you can use to provide instructions to the agent builder, while on the right side there is a preview of the agent.](../../../assets/images/make/agent-builder-01/create-agent-02.png)

instructions を入力すると、エージェントビルダーから新しいエージェントの名前を尋ねられます。名前は *Gardener* と入力してください。エージェントビルダーと対話している間、ダイアログの右側にエージェントのプレビューや会話スターターが表示されます。さらに instructions の調整を求められたら、次の文を入力します。  

````txt
Suggest ways to keep plants and flowers shining and gorgeous
````

![The user experience of the Copilot Studio agent builder. On the lower left side there is the interaction with the agent builder, while on the right side there is a preview of the agent.](../../../assets/images/make/agent-builder-01/create-agent-03.png)

必要な情報がそろうまでエージェントビルダーと対話を続けます。強調すべき点を尋ねられたら、以下の文を入力してください。  

````txt
Highlight the importance of nature and plants/flowers to be present in every house!
````

エージェントの話し方について尋ねられたら、次の文を入力します。  

````txt
Use a professional, yet friendly, tone.
````

最後に、これ以上の調整が不要であることを伝え、画面右上の **Create** ボタンを選択します。 

![The user experience of the Copilot Studio agent builder with the 'Create' button highlighted.](../../../assets/images/make/agent-builder-01/create-agent-04.png)

Copilot Studio エージェントビルダーが、入力した instructions に基づいて新しいエージェントを作成します。 

<cc-end-step lab="mab1" exercise="1" step="1" />

### 手順 2: エージェントのテスト

エージェントが準備できると、エージェントへのリンクと組織内で共有するためのリンクが表示されたポップアップダイアログが開きます。

![The dialog confirming the creation of the new 'Gardener' agent, providing a link to the agent and actions to share the agent.](../../../assets/images/make/agent-builder-01/create-agent-05.png)

**Go to agent** ボタンを選択すると、作成したエージェントの実際のユーザー体験画面が表示されます。

![The user experience of the 'Gardener' agent that you have just created. There is the name of the agent at the top of the screen, followed by a set of conversation starters generated by the Copilot Studio agent builder, and then the textbox to provide a new prompt to the agent.](../../../assets/images/make/agent-builder-01/create-agent-06.png)

対話を始めるには、最初の提案プロンプトをクリックしてエージェントの応答を確認してください。これでエージェントの準備完了です。おめでとうございます!

![The user experience of the 'Gardener' agent in action. There is a prompt at the top of the left side of the screen and the response from Microsoft 365 Copilot. On the right side there are the available agents and the recent chats.](../../../assets/images/make/agent-builder-01/create-agent-07.png)

<cc-end-step lab="mab1" exercise="1" step="2" />

## 演習 2: エージェントのカスタマイズ 

ここではエージェントを少しカスタマイズします。カスタムアイコンを追加し、植物や花の名前当てゲームのルールを定義します。

Microsoft 365 Copilot Chat 画面右上の **New chat** ボタンから新しいチャットを開始します。前と同じように画面右側の **Create an agent** を選択してください。  
表示されるダイアログ左上にある **Copilot Studio** ロゴ横の **My Copilot Agent** ドロップダウンから **View all agents** を選択し、作成済みのエージェント一覧を表示します。

![The user experience of Copilot Studio agent builder when editing an already existing agent. There is a command in the upper left side of the dialog to view all the agents that you already defined.](../../../assets/images/make/agent-builder-01/update-agent-01.png)

作成済みエージェントのリストが新しいダイアログで表示されます。

![The user experience of Copilot Studio agent builder when showing the list of agents. There is the 'Gardener' agent highlighted with a list of action to edit, share, download, and delete the agent.](../../../assets/images/make/agent-builder-01/update-agent-02.png)

各エージェントには、編集・共有・ダウンロード・削除のコマンドがあります。

### 手順 1: カスタムアイコンの設定

先ほど作成した **Gardener** エージェントを編集します。ダイアログは **Configure** パネルがアクティブな状態で開きます。演習 1 で入力した説明が、個々の設定に反映されていることを確認できます。  
設定項目は以下のとおりです。

- **Icon**: エージェントのアイコンをカスタマイズ  
- **Name**: エージェント名  
- **Description**: エージェントの説明  
- **Instructions**: システムプロンプト (システムロールと振る舞いを定義)  
- **Knowledge**: ナレッジベースの設定  
- **Actions**: 執筆時点では開発中  
- **Capabilities**: コード実行や画像生成などの機能を有効化  
- **Starter prompts**: 最大 6 件のスタータープロンプト  

エージェントのアイコンをカスタマイズするには、デフォルトアイコン横の編集ボタンを選択します。  
表示されるダイアログでアイコン画像と背景色を変更できます。サンプルアイコンは [こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/agent-builder/color.png) からダウンロードし、アップロードしてください。背景色は `#F1F1F1` を設定します。

![The dialog to update the icon and background color for the agent. There is the icon, a button to upload a new icon, and another button to set the background color. In the lower right corner there are buttons to save or cancel.](../../../assets/images/make/agent-builder-01/update-agent-03.png)

<cc-end-step lab="mab1" exercise="2" step="1" />

### 手順 2: 植物／花当てゲームのルール定義

同じくエージェントの設定画面で、 **Instructions** フィールドの内容を次の内容に置き換えます。  

````txt
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
````

![The dialog with the agent settings updated accordingly to the lab instructions and with the 'Update' button highlighted.](../../../assets/images/make/agent-builder-01/update-agent-04.png)

画面右上の **Update** ボタンを選択します。更新が完了したら **Go to agent** をクリックし、最終結果を確認します。エージェントにリクエストを送ると、ゲームに誘導されることを確認してください。

![The updated agent with the new icon and the final sentence to engage the user to play the game highlighted.](../../../assets/images/make/agent-builder-01/update-agent-05.png)

参考までに、実際に植物名を当てるやり取りの例を示します。

![A sample interaction between the user and the agent while guessing the name of a plant.](../../../assets/images/make/agent-builder-01/update-agent-06.png)

<cc-end-step lab="mab1" exercise="2" step="2" />

## 演習 3: SharePoint Online ナレッジベースの追加

この演習では、 Word ドキュメントを **Gardener** エージェントの追加ナレッジベースとして設定します。

### 手順 1: ナレッジベースドキュメントのアップロード

まず、植物や花に関する情報を含む Microsoft Word ドキュメントを用意しましょう。

[こちらのリンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/agent-builder/sharepoint-docs&filename=sharepoint-docs) から 4 つの DOCX ファイルを含む zip をダウンロードします。  

zip を解凍し、同じテナント内の SharePoint Teams サイトにアップロードします。 **Documents** ドキュメント ライブラリに保存してください。  
ファイルは以下の 4 つです。  
- **Basic Aspects of Gardening and Maintaining a Healthy Garden.docx**  
- **Common Plants List.docx**  
- **Healing a Plant in Your Garden**  
- **The Most Common Types of Plants in a Home Garden.docx**

これによりエージェントがより専門的になり、ゲームも難易度が上がります。  

サイトの絶対 URL をコピーします (例: `https://xyz.sharepoint.com/sites/contoso`)。次の手順で使用します。

<cc-end-step lab="mab1" exercise="3" step="1" />

### 手順 2: SharePoint Online ドキュメントを参照できるようにする

エージェント一覧に戻り、 **Gardener** エージェントを編集します。 **Knowledge** セクションまでスクロールし、 SharePoint ナレッジベース用フィールドに先ほどコピーしたサイト URL を貼り付けます。 **Browse** ボタンを使ってテナント内のサイトを検索することも可能です。

![The configuration dialog of the agent with the 'Knowledge' section and the 'SharePoint' URL field highlighted.](../../../assets/images/make/agent-builder-01/update-agent-07.png)

エージェントを更新し、再度対話してみましょう。カスタムナレッジベースに基づいた、より専門的な回答が得られるはずです。

<cc-end-step lab="mab1" exercise="3" step="2" />

## 演習 4: エージェントの仕上げ

この演習では、 **Gardener** エージェントに画像生成機能を追加し、同僚と共有します。

### 手順 1: 画像生成機能の追加

再度 **Gardener** エージェントを編集し、設定パネルを下にスクロールして **Capabilities** セクションを見つけます。 **Image generator** オプションを有効にし、エージェントを更新します。

![The configuration dialog of the agent with the 'Capabilities' section and the 'Image generator' option selected and highlighted.](../../../assets/images/make/agent-builder-01/update-agent-08.png)

エージェントを再読み込みし、次のプロンプトを入力します。

````txt
Generate the image of a dozen of red roses
````

次の画像は、生成されたイメージの例です。

![The 'Gardener' agent with the answer to a prompt that generated an image of a dozen of red roses.](../../../assets/images/make/agent-builder-01/update-agent-09.png)

<cc-end-step lab="mab1" exercise="4" step="1" />

### 手順 2: エージェントの共有

準備が整ったら、エージェントを同僚と共有しましょう。エージェントを編集し、画面右上の **Update** ボタン横にある **Share** ボタンを選択します。  
共有ダイアログが表示され、以下の対象から選択できます。

- 組織内の全員  
- セキュリティ グループ経由の特定ユーザー  
- 自分のみ  

特定ユーザーとの共有を選択し、共有相手のメールアドレスを入力して **Save** ボタンを押します。  
共有処理の完了後、エージェントにアクセスできる URL が表示されますので、共有相手に送信してください。

![The panel to configure the sharing target. Available options are 'Anyone in your organization', 'Specific users in your organization via security groups', or 'Only you'. The panel also provides a button to 'Save' the sharing option and a URL to access the agent.](../../../assets/images/make/agent-builder-01/update-agent-10.png)

<cc-end-step lab="mab1" exercise="4" step="2" />

---8<--- "ja/mab-congratulations.md"

Great job on making your agent 🎉 ! This is the end of the **Copilot Studio agent builder** path! Did you enjoy making the Gardener agent? Let us know about your experience and feedback. 💜

## Resources
- [Declarative agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-declarative-copilot){target=_blank}
- [Build agents with Copilot Studio agent builder](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-build){target=_blank}
- [Publish and manage Copilot Studio agent builder agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-publish){target=_blank}

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/01-first-agent" />