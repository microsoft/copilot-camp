---
search:
  exclude: true
---
# ラボ E1 - インストラクションベースの **Geo Locator Game** エージェント

このラボでは、インストラクションとファイルで提供される補足知識を使って、基本的な宣言型エージェントを作成します。  
作成するエージェントは、仕事の合間に楽しく学習できるよう、世界各地の都市を探索するゲームを提供します。抽象的な手掛かりを提示し、都市を当てるまでに使った手掛かりが少ないほど高得点になります。ゲーム終了時に最終スコアが表示されます。

このラボで学ぶ内容は次のとおりです。

- Agents Toolkit テンプレートを使用して宣言型エージェントを作成する  
- インストラクションを使ってエージェントを **Geo Locator Game** にカスタマイズする  
- アプリを実行してテストする方法を学ぶ  
- ボーナス課題として SharePoint Teams サイトを使用する

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/VDhRFMH3Qbs" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>ビデオでラボの概要を確認しましょう。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## はじめに

宣言型エージェントは、 Microsoft 365 Copilot と同じスケーラブルなインフラストラクチャとプラットフォームを活用しながら、特定のニーズにフォーカスできるよう調整されています。  
標準の Microsoft 365 Copilot チャットと同じインターフェイスを使用しつつ、特定のタスクにのみ集中する専門家として機能します。

このラボでは、 Agents Toolkit に用意されている既定テンプレートを使って宣言型エージェントを作成するところから始めます。その後、このエージェントを **Geo Locator Game** に特化させるよう修正します。

AI の目的は、世界中のさまざまな都市について学びながら、仕事の合間に楽しい休憩時間を提供することです。都市を推測するための抽象的な手掛かりを提示し、手掛かりを多く使うほど得点は低くなります。ゲーム終了時に最終スコアが明らかになります。

![The initial UI of the Geo Locator Game with a couple of guesses from the user.](../../assets/images/extend-m365-copilot-01/game.png)

ボーナスとして、エージェントに秘密の日記 🕵🏽 や地図 🗺️ のファイルを参照させ、プレイヤーへのチャレンジ要素を増やします。

それでは始めましょう 💪🏼

## Exercise 1: テンプレートから宣言型エージェントをスキャフォールドする
宣言型エージェントに必要なファイル構成さえ把握していれば、任意のエディターで作成できます。ただし、 Agents Toolkit を使用するとファイル生成だけでなく、デプロイや公開も簡単に行えます。  
そのため、このラボでは Agents Toolkit を使用して作業を簡素化します。

### Step 1: Agents Toolkit をインストールする

- ** Visual Studio Code ** の拡張機能タブを開き、 **Microsoft 365 Agents Toolkit** を検索します。  
- 選択してインストールします。

<cc-end-step lab="e1a" exercise="1" step="1" />

### Step 2: Agents Toolkit で宣言型エージェントアプリを作成する

左側の **Agents Toolkit** 拡張機能 1️⃣ を開き、 **Create a New Agent/App** 2️⃣ を選択します。

![The UI of the Agents Toolkit to start creating a new app with the 'Create a New Agent' button highlighted.](../../assets/images/extend-m365-copilot-01/atk-create-new-agent.png)

パネルが開くので、プロジェクトタイプの一覧から **Declarative Agent** を選択します。

![The project types available when creating a new app with Agents Toolkit. Options include 'Agent', which is highlighted.](../../assets/images/extend-m365-copilot-01/atk-da.png)

続いて、基本の宣言型エージェントを作成するか、 API プラグイン付きにするかを尋ねられます。 **No Action** を選択してください。

![The Agents Toolkit app creation flow with the type of Declarative Agent with 'No plugin' selected.](../../assets/images/extend-m365-copilot-01/atk-no-action.png)

!!! tip "ここでアクション付きにしない理由"
     次のラボで REST API を構築し、その API を宣言型エージェントにアクションとして統合する方法を学びます。今回は宣言型エージェントの作成だけに集中しましょう。小さなステップから！

次に、プロジェクトフォルダーを作成するディレクトリを入力します。

![The Agents Toolkit app creation flow with the prompt to provide a target path where to store the new app.](../../assets/images/extend-m365-copilot-01/atk-folder.png)

アプリケーション名として `Geo Locator Game` と入力し、 Enter キーを押します。

![The Agents Toolkit app creation flow with the prompt to provide a name for the app.](../../assets/images/extend-m365-copilot-01/atk-app-name.png)

指定したフォルダーに数秒でプロジェクトが作成され、新しい Visual Studio Code ウィンドウで開きます。これが作業用フォルダーです。

![Visual Studio Code with the new app scaffolded and ready to be extendend and the README file on the screen.](../../assets/images/extend-m365-copilot-01/atk-scaffold.png)

お疲れさまです！ベースの宣言型エージェントがセットアップできました。次に、ファイル内容を確認し、 **Geo Locator Game** にカスタマイズしましょう。

<cc-end-step lab="e1a" exercise="1" step="2" />

### Step 3: Agents Toolkit でアカウントを設定する
左側の **Agents Toolkit** アイコン 1️⃣ を選択し、"Accounts" セクションの **Sign in to Microsoft 365** 2️⃣ をクリックして、自身の Microsoft 365 アカウントでサインインします。

![The UI of Agents Toolkit to allow logging into a target Microsoft 365 tenant.](../../assets/images/extend-m365-copilot-01/atk-accounts.png)

ブラウザーが開き、 Microsoft 365 へのサインインを求めます。"You are signed in now and close this page" と表示されたらページを閉じます。

"Custom App Upload Enabled" に緑のチェックマークが付いていることを確認します。付いていない場合、そのユーザーが Teams アプリをアップロードする権限を持っていません。ラボの Exercise 1 の手順を参照して設定してください。

次に "Copilot Access Enabled" に緑のチェックマークがあるか確認します。無い場合、そのユーザーが Copilot のライセンスを持っていません。ライセンスが必要です。

![The UI of Agents Toolkit after logging in, when the checkmarks are green.](../../assets/images/extend-m365-copilot-01/atk-accounts-logged.png)

それではコードツアーを行いましょう。

<cc-end-step lab="e1a" exercise="1" step="3" />

### Step 4: アプリ内のファイルを理解する

ベースプロジェクトの構成は次のとおりです。

| フォルダー／ファイル | 内容 |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| `.vscode` | デバッグ用 VS Code 設定ファイル |
| `appPackage` | Teams アプリのマニフェスト、エージェントマニフェスト、 API 仕様 (存在する場合) のテンプレート |
| `env` | デフォルトの `.env.dev` を含む環境設定ファイル |
| `appPackage/color.png` | アプリのロゴ画像 |
| `appPackage/outline.png` | アプリのロゴ（アウトライン）画像 |
| `appPackage/declarativeAgent.json` | 宣言型エージェントの設定および構成 |
| `appPackage/instruction.txt` | 宣言型エージェントの動作を定義するインストラクション |
| `appPackage/manifest.json` | 宣言型エージェントのメタデータを定義する Teams アプリマニフェスト |
| `m365agent.yml` | Agents Toolkit のメインプロジェクトファイル。プロパティと構成ステージを定義 |

このラボで特に重要なのは **appPackage/instruction.txt** です。エージェントの主要ディレクティブが含まれています。  
プレーンテキストなので、自然言語でインストラクションを記述できます。

もう一つ重要なのは **appPackage/declarativeAgent.json** で、 Microsoft 365 Copilot を新しい宣言型エージェントで拡張するためのスキーマが定義されています。主なプロパティは以下のとおりです。

- `$schema`: スキーマ参照  
- `version`: スキーマバージョン  
- `name`: 宣言型エージェントの名前  
- `description`: 説明  
- `instructions`: **instructions.txt** へのパス。ここに直接テキストで記述することも可能ですが、本ラボでは **instructions.txt** を使用します。

さらに **appPackage/manifest.json** には、パッケージ名、開発者名、アプリで利用するエージェントの参照など、重要なメタデータが含まれます。次の抜粋はその一部です。

```JSON
"copilotAgents": {
        "declarativeAgents": [            
            {
                "id": "declarativeAgent",
                "file": "declarativeAgent.json"
            }
        ]
    },
```

ロゴファイル `color.png` と `outline.png` を差し替えてブランドに合わせることもできます。本ラボでは **color.png** を変更してエージェントを目立たせます。

<cc-end-step lab="e1a" exercise="1" step="4" />

## Exercise 2: インストラクションとアイコンを更新する

### Step 1: アイコンとマニフェストを更新する

まずはロゴを差し替えます。 [こちら](../../assets/images/extend-m365-copilot-01/color.png){target=_blank} の画像をコピーし、プロジェクトルートの **appPackage** フォルダーにある同名ファイルと置き換えます。

次に、ルートプロジェクトの **appPackage/manifest.json** を開き、 **copilotAgents** ノードを探します。 `declarativeAgents` 配列の最初の `id` を `declarativeAgent` から `dcGeolocator` に変更して、一意の ID にします。

<pre>
 "copilotAgents": {
        "declarativeAgents": [            
            {
                "id": "<b>dcGeolocator</b>",
                "file": "declarativeAgent.json"
            }
        ]
    },
</pre>

続いて **appPackage/instruction.txt** を開き、下記のインストラクションで既存内容を上書きしてください。

```txt
System Role: You are the game host for a geo-location guessing game. Your goal is to provide the player with clues about a specific city and guide them through the game until they guess the correct answer. You will progressively offer more detailed clues if the player guesses incorrectly. You will also reference PDF files in special rounds to create a clever and immersive game experience.

Game play Instructions:
Game Introduction Prompt
Use the following prompt to welcome the player and explain the rules:
Welcome to the Geo Location Game! I’ll give you clues about a city, and your task is to guess the name of the city. After each wrong guess, I’ll give you a more detailed clue. The fewer clues you use, the more points you score! Let’s get started. Here’s your first clue:
Clue Progression Prompts
Start with vague clues and become progressively specific if the player guesses incorrectly. Use the following structure:
Clue 1: Provide a general geographical clue about the city (e.g., continent, climate, latitude/longitude).
Clue 2: Offer a hint about the city’s landmarks or natural features (e.g., a famous monument, a river).
Clue 3: Give a historical or cultural clue about the city (e.g., famous events, cultural significance).
Clue 4: Offer a specific clue related to the city’s cuisine, local people, or industry.
Response Handling
After the player’s guess, respond accordingly:

If the player guesses correctly, say:
That’s correct! You’ve guessed the city in [number of clues] clues and earned [score] points. Would you like to play another round?
If the guess is wrong, say:
Nice try! [followed by more clues]
PDF-Based Scenario
For special rounds, use a PDF file to provide clues from a historical document, traveler's diary, or ancient map:
This round is different! I’ve got a secret document to help us. I’ll read clues from this [historical map/traveler’s diary] and guide you to guess the city. Here’s the first clue:
Reference the specific PDF to extract details: Do not provide the citations and also link to the document since its a secret document for generating the questions.
Traveler's Diary PDF,Historical Map PDF. Do not provide the citations and also link to the document since its a secret document for generating the questions.
Use emojis where necessary to have friendly tone. 
Scorekeeping System
Track how many clues the player uses and calculate points:

1 clue: 10 points
2 clues: 8 points
3 clues: 5 points
4 clues: 3 points
End of Game Prompt
After the player guesses the city or exhausts all clues, prompt:
Would you like to play another round, try a special challenge?

```

次の手順で、ユーザーがエージェントとやり取りしやすくなるよう、会話スターターを追加します。

!!! tip "**appPackage** 内のファイルをモジュール化"
    **appPackage/declarativeAgent.json** の以下の行に注目してください。

    `"instructions": "$[file('instruction.txt')]",`

    これは **instruction.txt** からインストラクションを読み込む指定です。  
    **appPackage** 内の他の JSON ファイルでも、この手法でファイルを分割管理できます。

<cc-end-step lab="e1a" exercise="2" step="1" />

### Step 2 : 会話スターターを追加する

宣言型エージェントに会話スターターを追加すると、ユーザーエンゲージメントを高められます。

会話スターターの主なメリットは以下のとおりです。

- **エンゲージメント**: 交流を始めやすくし、ユーザーが気軽に参加できる  
- **コンテキスト設定**: 会話のトーンとトピックを示し、進行方向をガイド  
- **効率性**: 明確なフォーカスを提示することで曖昧さを減らし、スムーズに会話が進む  
- **ユーザー維持**: 興味を引き続け、再利用を促進  

`declarativeAgent.json` を開き、 `instructions` ノードの直後にカンマ `,` を追加し、次のコードを貼り付けます。

```JSON
 "conversation_starters": [
      { 
            "title": "Getting Started",
            "text":"I am ready to play the Geo Location Game! Give me a city to guess, and start with the first clue."          

         },
        {
            "title": "Ready for a Challenge",
            "text": "Let us try something different. Can we play a round using the travelers diary?"
        },
        { 
            "title": "Feeling More Adventurous",
            "text": "I am in the mood for a challenge! Can we play the game using the historical map? I want to see if I can figure out the city from those ancient clues."
        }
    ]
```

すべての変更が完了したので、テストに進みます。

<cc-end-step lab="e1a" exercise="2" step="2" />

### Step 3: アプリをテストする

アプリをテストするには、 ` Visual Studio Code ` の ` Agents Toolkit ` 拡張機能を開きます。左ペインの "LIFECYCLE" で **Provision** を選択します。  
Agents Toolkit が **appPackage** 内のファイルを ZIP 化し、エージェントを自身のアプリカタログにインストールしてくれます。

![The UI of Agents Toolkit highlighting the 'Provision' command under the 'Lifecycle' group of commands.](../../assets/images/extend-m365-copilot-01/atk-provision.png)

Microsoft 365 Copilot BizChat を開きます: [https://microsoft365.com/copilot/](https://microsoft365.com/copilot/){target=_blank}  
開発者テナントのアカウントでサインインしてください。

Copilot アプリが読み込まれたら、右側のリストから **Geo Locator Game** を見つけます。

![The UI of Microsoft 365 Copilot with the list of agents on the right side and the 'Geo Locator Game' agent highlighted.](../../assets/images/extend-m365-copilot-01/launch-geo.png)

見つからない場合は "see more" を展開して探してください。

起動すると、そのエージェント専用のチャットウィンドウが開き、会話スターターが表示されます。

![The UI of Microsoft 365 Copilot when the 'Geo Locator Game' agent is selected. The image highlights the conversation starters.](../../assets/images/extend-m365-copilot-01/launched-geo.png)

会話スターターのいずれかを選択すると、入力ボックスに自動で挿入されます。 Enter キーを押すまで送信されません 🟢

ゲームのデモはこちらです。

![A video of the 'Geo Locator Game' in action with a user guessing a couple of cities and the agent showing the collected points.](../../assets/images/extend-m365-copilot-01/demo.gif)

<cc-end-step lab="e1a" exercise="2" step="3" />

## Exercise 3: 参照用ファイルを追加する (ボーナス)

同じゲームを繰り返すだけでは飽きてしまいます。ゲームを楽しく保つには、定期的に更新されるデータへのアクセスが必要です。ここでは、エージェントに SharePoint サイトや OneDrive のファイルを参照させる機能を追加し、チャレンジを強化します。

### Step 1: SharePoint にファイルをアップロードする

2 つの PDF が入った ZIP ファイルを [こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab01a-declarative-copilot/geo-locator-lab-sample/sharepoint-docs&filename=sharepoint-docs){target=_blank} からダウンロードしてください。

ZIP を展開し、同じテナントの SharePoint Teams サイトの **Documents** ドキュメントライブラリに **historical_map.pdf** と **travelers_diary.pdf** をアップロードします。

サイトの絶対 URL をコピーします。例: `https://xyz.sharepoint.com/sites/contoso`

> [!NOTE]  
> ファイルやフォルダーの完全パスは、 SharePoint の “Copy direct link” 機能で取得できます。対象を右クリックし **Details** を選択後、 **Path** のコピーアイコンをクリックしてください。

完了したら次の手順に進みます。

<cc-end-step lab="e1a" exercise="3" step="1" />

### Step 2: 宣言型エージェントマニフェストを更新する

**.env.dev** を開き、 `SP_SITE_URL` という新しい変数を作成して、先ほどの SharePoint サイトの絶対 URL を値に設定します。

続いて **appPackage/declarativeAgent.json** を開き、 `conversation_starters` 配列の後ろにカンマ `,` を追加し、下記の配列オブジェクトを貼り付けます。これでエージェントが特定の SharePoint サイトのドキュメントを参照できるようになります。

```JSON
 "capabilities": [
        {

            "name": "OneDriveAndSharePoint",
            "items_by_url": [
            {
                "url": "${{SP_SITE_URL}}"
            }
        ]
        }
    ]
```

これにより、ゲームを盛り上げるためのドキュメント参照が可能になりました。 URL の数に制限はありません 💪🏼

<cc-end-step lab="e1a" exercise="3" step="2" />

### Step 3: アプリマニフェストをアップグレードする

**appPackage/manifest.json** を開き、 `version` を `"1.0.0"` から `"1.0.1"` に更新して変更を反映させます。

<cc-end-step lab="e1a" exercise="3" step="3" />

### Step 4: アプリをテストする

1. ` Visual Studio Code ` の ` Agents Toolkit ` 拡張機能に戻り、左ペインの "LIFECYCLE" で **Provision** を選択して、更新済みエージェントをパッケージ化しアプリカタログにインストールします。  
2. Microsoft 365 Copilot BizChat [https://microsoft365.com/copilot/](https://microsoft365.com/copilot/){target=_blank} を開きます。  
3. **Geo Locator Game** を再度起動します。

![The UI of Microsoft 365 Copilot when the 'Geo Locator Game' agent is selected. The image highlights the conversation starters.](../../assets/images/extend-m365-copilot-01/launched-geo.png)

今回は旅行日記を使ったチャレンジを試してください。 2 番目の会話スターターを選択します。

![The 'Geo Locator Game' when relying on the travel diary. The agent answers providing a reference to the travelers_diary.pdf document stored in SharePoint Online.](../../assets/images/extend-m365-copilot-01/traveller.gif)

これであなたは宣言型エージェントのボスです。詳細は次のビデオをご覧ください。

 <div class="tinyVideo">
      <iframe src="//www.youtube.com/embed/QTP4PfXyyNk" frameborder="0" allowfullscreen></iframe>
      <div>宣言型エージェント入門</div>
    </div>

<cc-end-step lab="e1a" exercise="3" step="4" />

## リソース
- [宣言型エージェント](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-declarative-copilot){target=_blank}
- [宣言型エージェントマニフェスト スキーマ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-manifest){target=_blank}
- [サポートされるコンテンツタイプ](https://learn.microsoft.com/microsoftsearch/semantic-index-for-copilot#supported-content-types){target=_blank}
- [宣言型エージェントの機能](https://learn.microsoft.com/microsoft-365-copilot/extensibility/declarative-agent-capabilities-ids?tabs=explorer){target=_blank}
- [エージェントの検証ガイドライン](https://learn.microsoft.com/microsoftteams/platform/concepts/deploy-and-publish/appsource/prepare/review-copilot-validation-guidelines){target=_blank}

---8<--- "ja/e-congratulations.md"

素晴らしい！ゲームエージェントを構築できました 🎉 次のラボでは REST API を作成し、それを使ったプラグインを構築して、別のエージェントで実際のビジネスシナリオを解決していきます。ワクワクですね。 **Next** を選択して次のラボに進みましょう。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/01a-geolocator--ja" />