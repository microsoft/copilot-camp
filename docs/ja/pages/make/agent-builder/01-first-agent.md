---
search:
  exclude: true
---
# ラボ MAB1 - 初めてのエージェント構築

---8<--- "ja/mab-labs-prelude.md"

このラボでは、 Copilot Studio エージェントビルダー を使用して、シンプルな宣言型エージェントを作成します。エージェントは、ユーザーがホームガーデンの維持や改善を支援するために設計されています。エージェントの知識ベースは、 SharePoint Online に保存された一連のドキュメントおよびパブリック Web コンテンツに基づいています。また、エージェントは、複数の手がかりに基づいて植物や花の名前を推測する楽しいゲームにユーザーを参加させることも可能です。

本ラボで学ぶ内容:

- Microsoft 365 Copilot 用宣言型エージェントとは何か
- Copilot Studio エージェントビルダー を使用して宣言型エージェントを作成する
- 特定の指示を用いてゲームを作成するようにエージェントをカスタマイズする
- SharePoint Online に保存された一連のドキュメントに基づいてエージェントを設定する
- エージェントに画像生成機能を有効にする
- エージェントを他の人と共有する
- エージェントの共有方法を学ぶ

## 概要

宣言型エージェントは、 Microsoft 365 Copilot と同じスケーラブルなインフラストラクチャおよびプラットフォームを活用し、特定のニーズに焦点を合わせるためにカスタマイズされています。特定分野の専門家として機能し、標準の Microsoft 365 Copilot チャットと同じインターフェイスを使用できる一方で、特定のタスクに専念します。

宣言型エージェント作成の旅へようこそ ☺️！ Copilot を活用して魔法のような成果を生み出しましょう！

本ラボでは、まず Copilot Studio エージェントビルダー を使用して宣言型エージェントを構築し、サンプルの指示セットを提供する方法を学びます。次に、エージェントを植物や花の名前を当てるゲームに特化するように変更します。さらに、エージェントに SharePoint Online に保存されたファイルを参照させ、仮想の知識ベースとします。最後に、エージェントを組織内の他の人と共有します。

![ユーザーからのいくつかの推測が表示された Gardener エージェントの初期の UI](../../../assets/images/make/agent-builder-01/gardener-agent.gif)

## 演習 1：宣言型エージェント作成

始めましょう！ 💪🏼 Copilot Studio エージェントビルダー を使用して、最初からエージェントを作成します。

### ステップ 1：エージェントの説明

Copilot Studio エージェントビルダー を使用して宣言型エージェントを作成するには、[Microsoft 365 Copilot チャット ホームページ](https://www.microsoft365.com/copilot){target=_blank} を開き、右側のパネルにある利用可能なエージェントの一覧から **Create an agent** を選択してください。

![『Create an agent』コマンドが強調表示された Microsoft 365 Copilot チャット](../../../assets/images/make/agent-builder-01/create-agent-01.png)

Copilot Studio エージェントビルダー がポップアップし、カスタムエージェントの定義を開始できます。テンプレートから開始することも、単に自然言語でエージェントを *describe* することも可能です。手動でエージェントを構成するために **Configure** オプションを選択することもできますが、それは後ほど行います。最初に次の初期説明を入力してください:

```txt
You are an expert gardener and you help users to maintain and improve their home garden
providing detailed instructions and advice about the best practices for home gardening.
```

![Copilot Studio エージェントビルダー のユーザー体験。左下にエージェントビルダーへ指示を入力するためのテキストボックスがあり、右側にはエージェントのプレビューが表示されています。](../../../assets/images/make/agent-builder-01/create-agent-02.png)

指示を入力すると、エージェントビルダーから新しいエージェントの名前の入力を求められます。*Gardener* という名前を入力してください。エージェントビルダーとの対話中、ダイアログの右側にエージェント本体のプレビューやいくつかの会話のスターターが表示されます。エージェントビルダーがさらに指示の精査を求めた場合は、次の文章を入力してください。

```txt
Suggest ways to keep plants and flowers shining and gorgeous
```

![Copilot Studio エージェントビルダー のユーザー体験。ダイアログの左下にエージェントビルダーとのやり取りが表示され、右側にはエージェントのプレビューが表示されています。](../../../assets/images/make/agent-builder-01/create-agent-03.png)

エージェントの作成に必要な全ての情報が入力されるまで、エージェントビルダーと対話を続けてください。もし、エージェントビルダーからどの点を強調すべきか尋ねられたら、次の文章を入力してください。

```txt
Highlight the importance of nature and plants/flowers to be present in every house!
```

エージェントの話し方についてエージェントビルダーから尋ねられた場合は、次の文章で回答してください。

```txt
Use a professional, yet friendly, tone.
```

最後に、これ以上の修正は不要であると伝え、画面右上の **Create** ボタンを選択してください。

![『Create』ボタンが強調表示された Copilot Studio エージェントビルダー のユーザー体験](../../../assets/images/make/agent-builder-01/create-agent-04.png)

Copilot Studio エージェントビルダー は、入力された指示に基づいて新しいエージェントを作成します。

<cc-end-step lab="mab1" exercise="1" step="1" />

### ステップ 2：エージェントのテスト

エージェントが準備完了になると、エージェントへのリンクと組織内の他の人とエージェントを共有するためのリンクが表示されたポップアップダイアログが表示されます。

![‘Gardener’ エージェントの作成を確認するダイアログ。エージェントへのリンクとエージェントを共有するためのアクションが提供されています。](../../../assets/images/make/agent-builder-01/create-agent-05.png)

**Go to agent** ボタンを選択してください。すると、作成したばかりの新しいエージェントの実際のユーザー体験へと案内されます。

![作成した ‘Gardener’ エージェントのユーザー体験。画面上部にエージェントの名前が表示され、 Copilot Studio エージェントビルダー で生成された会話のスターターが続き、その下にエージェントへ新たなプロンプトを入力するテキストボックスが表示されています。](../../../assets/images/make/agent-builder-01/create-agent-06.png)

エージェントとの対話を開始するには、最初の提案されたプロンプトをクリックし、エージェントからの応答を確認してください。これでエージェントの準備は完了です。おめでとうございます！

![動作中の ‘Gardener’ エージェントのユーザー体験。画面左上にプロンプトが表示され、 Microsoft 365 Copilot からの応答が表示されています。右側には利用可能なエージェントと最近のチャットが表示されています。](../../../assets/images/make/agent-builder-01/create-agent-07.png)

<cc-end-step lab="mab1" exercise="1" step="2" />

## 演習 2：エージェントのカスタマイズ

ここでエージェントを少しカスタマイズします。カスタムアイコンを追加し、植物または花の名前を当てるゲームのルールを定義します。

Microsoft 365 Copilot チャットのユーザーインターフェイス右上にある **New chat** ボタンを選んで最初から開始します。前回と同様に、画面右側の **Create an agent** コマンドを選択してください。最初のエージェントを作成する際に使用したのと同じダイアログが表示されます。今回は、ダイアログの左上にある **Copilot Studio** ロゴのすぐ横にあるエージェント名 **My Copilot Agent** のドロップダウンを選択し、そこから **View all agents** を選択して、Copilot Studio エージェントビルダー で作成したエージェントの全一覧を確認してください。

![既存のエージェントを編集する際の Copilot Studio エージェントビルダー のユーザー体験。既に定義済みのエージェントを全て表示するコマンドがダイアログの左上にあります。](../../../assets/images/make/agent-builder-01/update-agent-01.png)

作成したエージェントの全一覧が表示された新しいダイアログが開きます。

![エージェント一覧が表示された Copilot Studio エージェントビルダー のユーザー体験。‘Gardener’ エージェントが強調表示され、編集、共有、ダウンロード、削除のアクションが一覧化されています。](../../../assets/images/make/agent-builder-01/update-agent-02.png)

各エージェントには、編集、共有、ダウンロード、削除の各コマンドが用意されています。

### ステップ 1：カスタムアイコンの提供

先ほど作成した **Gardener** エージェントを編集しましょう。ダイアログは **Configure** パネルがアクティブな状態で開始されます。構成設定を確認すると、本ラボの演習 1 で入力したすべての説明が現在エージェントの具体的な設定として反映されているのがわかります。

定義できる構成設定は以下の通りです:

- **Icon**：エージェントのアイコンをカスタマイズするため
- **Name**：エージェントの名前を指定するため
- **Description**：エージェントの説明を定義するため
- **Instructions**：エージェントのシステムプロンプトであり、システムプロンプトでシステムロール及び動作規則を定義します
- **Knowledge**：エージェント用の各種知識ベースを設定するため
- **Actions**：（本稿作成時点では開発中のセクションです）
- **Capabilities**：コードの解釈や画像生成などの機能を有効にするため
- **Starter prompts**：最大 6 つのスタータープロンプトをエージェント用に設定するため

エージェントのアイコンをカスタマイズするには、デフォルトのアイコンのすぐ横にある編集ボタンを選択してください。

ダイアログが表示され、アイコンとアイコンの背景色を変更できます。便利なように、[こちら](https://github.com/microsoft/copilot-camp/blob/main/src/make/agent-builder/color.png)からサンプルアイコンをダウンロードし、エージェント用のカスタムアイコンとしてアップロードできます。また、背景色は次の RGB 値を使用して定義できます： #F1F1F1.

![エージェントのアイコンと背景色を更新するためのダイアログ。アイコン、アイコンをアップロードするためのボタン、背景色を設定するための別のボタンがあり、右下に保存またはキャンセルのボタンが配置されています。](../../../assets/images/make/agent-builder-01/update-agent-03.png)

<cc-end-step lab="mab1" exercise="2" step="1" />

### ステップ 2：植物・花名推測ゲームのルール定義

エージェントの設定編集中に、**Instructions** 構成フィールドの内容を次の値に更新してください。

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

![本ラボの指示に従ってエージェント設定が更新されたダイアログ。『Update』ボタンが強調表示されています。](../../../assets/images/make/agent-builder-01/update-agent-04.png)

設定ダイアログの右上にある **Update** ボタンを選択してください。更新にはしばらく時間がかかりますが、完了したら **Go to agent** を選択して最終結果を確認できます。特に、エージェントにリクエストを送信して、エージェントがゲームに参加するよう促すことを確認してください。

![新しいアイコンと、ユーザーにゲームへの参加を促す最終文が強調表示された更新済みエージェント。](../../../assets/images/make/agent-builder-01/update-agent-05.png)

参考までに、植物の名前を推測する際のエージェントとのサンプルダイアログを以下に示します。

![植物の名前を推測する際の、ユーザーとエージェント間のサンプル対話。](../../../assets/images/make/agent-builder-01/update-agent-06.png)

<cc-end-step lab="mab1" exercise="2" step="2" />

## 演習 3：SharePoint Online 知識ベースの追加

本演習では、**Gardener** エージェントの追加の知識ベースとして、いくつかの Word ドキュメントを追加します。

### ステップ 1：知識ベースドキュメントのアップロード

では、植物や花に関する特定の情報が記載された Microsoft Word ドキュメントなど、カスタム知識ベースのコンテンツを追加しましょう。

この [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/make/agent-builder/sharepoint-docs&filename=sharepoint-docs) を選択して、4 つの DOCX ファイルが含まれた zip ファイルをダウンロードしてください。

zip ファイルから 4 つのファイルを抽出し、このラボをテストしているテナント内の SharePoint Teams サイトにアップロードしてください。ファイルはドキュメントライブラリ **Documents** に配置します。

これらのドキュメントは **Basic Aspects of Gardening and Maintaining a Healthy Garden.docx**、**Common Plants List.docx**、**Healing a Plant in Your Garden**、および **The Most Common Types of Plants in a Home Garden.docx** であり、エージェントの専門性を高め、ゲームをより難しくするためのものです。

サイトの絶対 URL（例： `https://xyz.sharepoint.com/sites/contoso` ）をコピーし、次のステップに進んでください。

<cc-end-step lab="mab1" exercise="3" step="1" />

### ステップ 2：SharePoint Online ドキュメントのサポート追加

エージェント一覧に戻り、**Gardener** エージェントを編集して、**Knowledge** タイトルの設定セクションまでスクロールします。SharePoint Online サイトの URL を、SharePoint 知識ベースを提供するためのフィールドに貼り付けてください。URL を貼り付ける代わりに、**Browse** ボタンを選択してテナント内でサイトを検索することも可能です。

![『Knowledge』セクションおよび『SharePoint』 URL フィールドが強調表示されたエージェントの設定ダイアログ。](../../../assets/images/make/agent-builder-01/update-agent-07.png)

エージェントを更新し、再度対話してください。提供されたカスタム知識ベースに基づいた、より専門的な応答が得られるようになります。

<cc-end-step lab="mab1" exercise="3" step="2" />

## 演習 4：エージェントの最終調整

本演習では、**Gardener** エージェントに画像生成機能を追加し、同僚と共有します。

### ステップ 1：画像生成機能の追加

再度 **Gardener** エージェントを編集し、設定パネルを下にスクロールして **Capabilities** セクションを見つけます。**Image generator** オプションを有効にし、エージェントを更新してください。

![『Capabilities』セクションで **Image generator** オプションが選択され強調表示されたエージェントの設定ダイアログ。](../../../assets/images/make/agent-builder-01/update-agent-08.png)

エージェントを再読み込みし、次のプロンプトを入力してください:

```txt
Generate the image of a dozen of red roses
```

以下の画像では、生成された画像を含む出力が確認できます。

![プロンプトへの応答として、12 本の赤いバラの画像が生成された ‘Gardener’ エージェント。](../../../assets/images/make/agent-builder-01/update-agent-09.png)

<cc-end-step lab="mab1" exercise="4" step="1" />

### ステップ 2：エージェントの共有

これでエージェントを同僚と共有する準備が整いました。エージェントを最後に編集してください。

画面右上の **Update** ボタンのすぐ横に **Share** ボタンが表示されています。

それを選択すると、以下のターゲットのいずれかとエージェントを共有するかを選択できる共有ダイアログが表示されます:

- 組織内のすべてのユーザー
- セキュリティグループを介して組織内の特定のユーザー
- 自分のみ

特定のユーザーと共有するオプションを選択し、共有対象のメールアドレスを入力後、**Save** ボタンを選択して共有設定を確定してください。

共有プロセスの最後に、エージェントを共有したユーザーに渡せる URL が表示されたダイアログが現れます。

![共有ターゲットを設定するパネル。利用可能なオプションは、‘組織内のすべてのユーザー’、‘セキュリティグループを介して組織内の特定のユーザー’、または‘自分のみ’です。パネルには、共有オプションを保存するためのボタンとエージェントにアクセスするための URL も表示されています。](../../../assets/images/make/agent-builder-01/update-agent-10.png)

<cc-end-step lab="mab1" exercise="4" step="2" />

---8<--- "ja/mab-congratulations.md"

エージェントの作成、素晴らしい仕事でした 🎉 ！これで **Copilot Studio agent builder** のパスは終了です！ Gardener エージェントの作成はいかがでしたか？ ご意見・ご感想をお聞かせください。💜

## リソース
- [宣言型エージェント](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-declarative-copilot){target=_blank}
- [Copilot Studio エージェントビルダー によるエージェント作成](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-build){target=_blank}
- [Copilot Studio エージェントビルダー エージェントの公開と管理](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/copilot-studio-agent-builder-publish){target=_blank}

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/01-first-agent" />