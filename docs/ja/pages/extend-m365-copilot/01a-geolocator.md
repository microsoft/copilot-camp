---
search:
  exclude: true
---
# ラボ E1 - 指示ベース Geo Locator ゲーム エージェント

このラボでは、ファイルで提供される補足知識と指示を用いて、基本的な宣言型エージェントを作成します。  
作成するエージェントは、仕事の合間に楽しみながら世界各都市を学べるゲームを提供します。抽象的な手掛かりを提示し、都市を当てるまでに使用した手掛かりが少ないほど高得点が得られます。ゲーム終了時に最終スコアが表示されます。

このラボで学べること:

- Agents Toolkit テンプレートを使用して宣言型エージェントを作成する方法  
- 指示をカスタマイズして Geo Locator ゲームを構築する方法  
- アプリを実行しテストする方法  
- ボーナス演習として、SharePoint Teams サイトを使用する方法  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/VDhRFMH3Qbs" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要をご覧ください。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## はじめに

宣言型エージェントは、Microsoft 365 Copilot と同じスケーラブルなインフラとプラットフォームを活用し、特定のニーズにフォーカスした体験を提供します。  
特定分野やビジネス ニーズの専門家として機能し、標準の Microsoft 365 Copilot チャットと同じインターフェイスで利用できますが、特定タスクのみに集中します。

このラボでは、まず Agents Toolkit の既定テンプレートを用いて宣言型エージェントを構築します。  
次に、エージェントを Geo Locator ゲームに特化したものへと変更します。

AI の目的は、仕事の合間に楽しく世界各都市を学べる時間を提供することです。抽象的なヒントをもとに都市を当ててもらい、ヒントを多く使うほど得点は低くなります。ゲーム終了時に合計スコアが表示されます。

![The initial UI of the Geo Locator Game with a couple of guesses from the user.](../../assets/images/extend-m365-copilot-01/game.png)

ボーナスとして、エージェントに秘密の日記 🕵🏽 と地図 🗺️ のファイル参照を与え、プレイヤーへのチャレンジを増やします。

それでは始めましょう 💪🏼

## 演習 1: テンプレートから宣言型エージェントをスキャフォールディングする
宣言型エージェントのファイル構成を把握していれば、任意のエディターでも作成できますが、Agents Toolkit を使うとファイル作成からデプロイ、公開まで簡単に行えます。  
ここでは Agents Toolkit を使用し、できるだけシンプルに進めます。

### 手順 1: Agents Toolkit のインストール

- Visual Studio Code の拡張機能タブを開き、 **Microsoft 365 Agents Toolkit** を検索します。  
- 選択してインストールします。

<cc-end-step lab="e1a" exercise="1" step="1" />

### 手順 2: Agents Toolkit で宣言型エージェント アプリを作成

Visual Studio Code 左側にある Agents Toolkit 拡張機能 1️⃣ を開き、 **Create a New Agent/App** 2️⃣ を選択します。

![The UI of the Agents Toolkit to start creating a new app with the 'Create a New Agent' button highlighted.](../../assets/images/extend-m365-copilot-01/atk-create-new-agent.png)

パネルが開いたら、プロジェクト タイプの一覧から **Declarative Agent** を選択します。

![The project types available when creating a new app with Agents Toolkit. Options include 'Agent', which is highlighted.](../../assets/images/extend-m365-copilot-01/atk-da.png)

次に、基本的な宣言型エージェントか API プラグインを持つものかを選択する画面が表示されます。 **No Action** を選びます。

![The Agents Toolkit app creation flow with the type of Declarative Agent with 'No plugin' selected.](../../assets/images/extend-m365-copilot-01/atk-no-action.png)

!!! tip "なぜここで Action 付きエージェントを作成しないのですか？"
    次のラボで REST API を構築し、その API を Action として宣言型エージェントに組み込む方法を学びます。今回は宣言型エージェントのみを作成します。まずは一歩ずつ！

続いて、プロジェクト フォルダーを作成するディレクトリを入力します。

![The Agents Toolkit app creation flow with the prompt to provide a target path where to store the new app.](../../assets/images/extend-m365-copilot-01/atk-folder.png)

アプリケーション名に `Geo Locator Game` と入力して Enter を押します。

![The Agents Toolkit app creation flow with the prompt to provide a name for the app.](../../assets/images/extend-m365-copilot-01/atk-app-name.png)

数秒でプロジェクトが指定フォルダーに作成され、Visual Studio Code の新しいウィンドウで開きます。これが作業用フォルダーです。

![Visual Studio Code with the new app scaffolded and ready to be extendend and the README file on the screen.](../../assets/images/extend-m365-copilot-01/atk-scaffold.png)

お疲れさまでした！ 基本の宣言型エージェントがセットアップできました。次に、Geo Locator ゲーム アプリへカスタマイズするためにファイル内容を確認しましょう。

<cc-end-step lab="e1a" exercise="1" step="2" />

### 手順 3: Agents Toolkit でアカウント設定

左側の Agents Toolkit アイコン 1️⃣ を選択し、「Accounts」セクションで **Sign in to Microsoft 365** 2️⃣ をクリックし、ご自身の Microsoft 365 アカウントでログインします。

![The UI of Agents Toolkit to allow logging into a target Microsoft 365 tenant.](../../assets/images/extend-m365-copilot-01/atk-accounts.png)

ブラウザー ウィンドウが開き、Microsoft 365 へのログインが完了すると「You are signed in now and close this page」と表示されますので閉じてください。

続いて "Custom App Upload Enabled" のチェックマークが緑になっていることを確認します。緑でない場合は、Teams アプリをアップロードする権限がありません。ラボの演習 1 の手順に従ってください。

同様に "Copilot Access Enabled" が緑であることを確認します。緑でない場合は Copilot のライセンスが付与されていません。ラボを続行するには必須です。

![The UI of Agents Toolkit after logging in, when the checkmarks are green.](../../assets/images/extend-m365-copilot-01/atk-accounts-logged.png)

それではコード ツアーに進みましょう。

<cc-end-step lab="e1a" exercise="1" step="3" />

### 手順 4: アプリ内のファイルを理解する

プロジェクト構成:

| フォルダー/ファイル                       | 内容 |
| ------------------------------------ | -------------------------------------------------------------------------------- |
| `.vscode`                            | デバッグ用 VS Code 設定 |
| `appPackage`                         | Teams アプリ マニフェスト、エージェント マニフェスト、API 仕様 (存在する場合) |
| `env`                                | 環境ファイル (`.env.dev` が既定) |
| `appPackage/color.png`               | アプリ ロゴ画像 |
| `appPackage/outline.png`             | アプリ ロゴのアウトライン画像 |
| `appPackage/declarativeAgent.json` | 宣言型エージェントの設定と構成 |
| `appPackage/instruction.txt`         | 宣言型エージェントの動作を定義する指示 |
| `appPackage/manifest.json`           | Teams アプリ マニフェスト |
| `m365agent.yml`                      | Agents Toolkit プロジェクト ファイル (プロパティと Stage 定義) |

本ラボで特に重要なのは **appPackage/instruction.txt** です。  
プレーン テキストで自然言語の指示を書きます。

もう一つ重要なのが **appPackage/declarativeAgent.json** です。Microsoft 365 Copilot を拡張するためのスキーマが定義されています。主なプロパティ:

- `$schema`: スキーマ リファレンス  
- `version`: スキーマ バージョン  
- `name`: 宣言型エージェントの名前  
- `description`: 説明  
- `instructions`: **instruction.txt** へのパス。ここに直接指示テキストを入力することも可能ですが、本ラボでは **instruction.txt** を使用します。  

さらに **appPackage/manifest.json** には、パッケージ名、開発者名、アプリが利用するエージェントの参照など重要なメタデータが含まれます。以下は manifest.json の抜粋です:

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

`color.png` と `outline.png` を差し替えてアプリのブランドに合わせることもできます。本ラボでは **color.png** を変更します。

<cc-end-step lab="e1a" exercise="1" step="4" />

## 演習 2: 指示とアイコンを更新

### 手順 1: アイコンとマニフェストを更新

まずロゴを差し替えます。[こちら](../../assets/images/extend-m365-copilot-01/color.png){target=_blank} の画像をコピーし、プロジェクト ルートの **appPackage** フォルダー内の同名ファイルに置き換えます。

次に **appPackage/manifest.json** を開き、 **copilotAgents** ノードを探します。`declarativeAgents` 配列の最初の `id` を `declarativeAgent` から `dcGeolocator` へ変更し、一意になるようにします。

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

続いて **appPackage/instruction.txt** を開き、下記の指示で既存内容を上書きします。

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

次の手順で、ユーザーが会話を始めやすいようにコンバーセーション スターターを追加します。  

!!! tip "独自ファイルを **appPackage** に含める"
    **appPackage/declarativeAgent.json** には次の行があります:

    `"instructions": "$[file('instruction.txt')]",`

    これは **instruction.txt** から指示を読み込む設定です。**appPackage** 配下の任意の JSON ファイルで同様にファイルをモジュール化できます。

<cc-end-step lab="e1a" exercise="2" step="1" />

### 手順 2 : コンバーセーション スターターを追加

コンバーセーション スターターを追加すると、ユーザー エンゲージメントを高められます。  

主な効果:

- **エンゲージメント**: 会話を開始しやすくし、ユーザーの参加を促進  
- **コンテキスト設定**: 会話のトーンやトピックを明確化  
- **効率性**: 目的を示すことで曖昧さを減らし、スムーズに会話を進行  
- **ユーザー維持**: 魅力的なスターターがリピート利用を促進  

`declarativeAgent.json` を開き、`instructions` ノードの後ろにカンマ `,` を追加して下記コードを貼り付けます。

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

これでエージェントへの変更は完了です。テストしましょう。

<cc-end-step lab="e1a" exercise="2" step="2" />

### 手順 3: アプリをテスト

`Visual Studio Code` の `Agents Toolkit` 拡張機能を開き、左ペインの "LIFECYCLE" から "Provision" を選択します。Agents Toolkit がファイルをパッケージ化し、エージェントをアプリ カタログにインストールしてくれます。

![The UI of Agents Toolkit highlighting the 'Provision' command under the 'Lifecycle' group of commands.](../../assets/images/extend-m365-copilot-01/atk-provision.png)

Microsoft 365 Copilot BizChat を開きます: [https://microsoft365.com/copilot/](https://microsoft365.com/copilot/){target=_blank}  
開発テナントでサインインしてください。

Copilot アプリが読み込まれたら、右側のパネルから "Geo Locator Game" を探します。

![The UI of Microsoft 365 Copilot with the list of agents on the right side and the 'Geo Locator Game' agent highlighted.](../../assets/images/extend-m365-copilot-01/launch-geo.png)

見つからない場合は一覧が長い可能性があります。"see more" を展開して探してください。

起動すると、エージェント専用のチャット画面が開き、下図のようにコンバーセーション スターターが表示されます。

![The UI of Microsoft 365 Copilot when the 'Geo Locator Game' agent is selected. The image highlights the conversation starters.](../../assets/images/extend-m365-copilot-01/launched-geo.png)

スターターの一つを選択すると、メッセージ ボックスに自動入力されます。Enter を押すまでアシスタントは待機します 🟢

ゲームのデモをご覧ください。

![A video of the 'Geo Locator Game' in action with a user guessing a couple of cities and the agent showing the collected points.](../../assets/images/extend-m365-copilot-01/demo.gif)

<cc-end-step lab="e1a" exercise="2" step="3" />

## 演習 3: 参照用ファイルを追加 (ボーナス)

同じゲームを繰り返すだけでは飽きてしまいます。ゲームを常に新鮮でチャレンジングに保つため、定期的に更新されるデータへアクセスできるようにしましょう。前述のとおり、宣言型エージェントには SharePoint サイトや OneDrive を参照する機能があります。ここではエージェントに 2 つのファイルをアクセスさせます。

### 手順 1: SharePoint にファイルをアップロード

以下の ZIP ファイルをダウンロードします: [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab01a-declarative-copilot/geo-locator-lab-sample/sharepoint-docs&filename=sharepoint-docs){target=_blank}

ZIP を展開し、同一テナントの SharePoint Teams サイトの **Documents** ライブラリへ 2 つの PDF ファイル (**historical_map.pdf**, **travelers_diary**) をアップロードします。

サイトの絶対 URL をコピーします (例: `https://xyz.sharepoint.com/sites/contoso`)。

> [!NOTE]
> ファイルやフォルダーのフル パスは SharePoint の「Copy direct link」で取得できます。対象を右クリックし Details → Path のコピーアイコンを選択してください。

次の手順へ進みます。

<cc-end-step lab="e1a" exercise="3" step="1" />

### 手順 2: 宣言型エージェント マニフェストを更新

環境ファイル **.env.dev** を開き、変数 `SP_SITE_URL` を追加して SharePoint サイトの絶対 URL を値として設定します。

続いて **appPackage/declarativeAgent.json** を開き、`conversation_starters` 配列の後ろにカンマ `,` を追加し、下記の配列オブジェクトを貼り付けて SharePoint データ参照機能を拡張します。

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

これで宣言型エージェントがこの SharePoint サイトのドキュメントを読み取れるようになり、ゲームがさらにスパイスアップされます。  
URL は制限なく追加可能です 💪🏼

<cc-end-step lab="e1a" exercise="3" step="2" />

### 手順 3: アプリ マニフェストをアップグレード

**appPackage/manifest.json** を開き、`version` を `"1.0.0"` から `"1.0.1"` に更新します。これによりインストール時に変更が反映されます。

<cc-end-step lab="e1a" exercise="3" step="3" />

### 手順 4: アプリをテスト

- `Visual Studio Code` の `Agents Toolkit` 拡張機能を開き、左ペインの "LIFECYCLE" から "Provision" を実行してアップグレード版エージェントをパッケージ化・インストールします。  
- Microsoft 365 Copilot BizChat ([https://microsoft365.com/copilot/](https://microsoft365.com/copilot/){target=_blank}) を開き、開発テナントでサインインします。  
- 再度 "Geo Locator Game" を起動します。

![The UI of Microsoft 365 Copilot when the 'Geo Locator Game' agent is selected. The image highlights the conversation starters.](../../assets/images/extend-m365-copilot-01/launched-geo.png)

今回は旅行日記を使ったチャレンジを試してください。2 つ目のコンバーセーション スターターを選びます。

![The 'Geo Locator Game' when relying on the travel diary. The agent answers providing a reference to the travelers_diary.pdf document stored in SharePoint Online.](../../assets/images/extend-m365-copilot-01/traveller.gif)

あなたは宣言型エージェントのボスになりましたね。詳しくは次の動画をご覧ください。

 <div class="tinyVideo">
      <iframe src="//www.youtube.com/embed/QTP4PfXyyNk" frameborder="0" allowfullscreen></iframe>
      <div>Declarative エージェントの紹介</div>
    </div>

<cc-end-step lab="e1a" exercise="3" step="4" />

## 参考資料
- [Declarative agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-declarative-copilot){target=_blank}
- [Declarative agent manifest schema](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-manifest){target=_blank}
- [Supported content types](https://learn.microsoft.com/microsoftsearch/semantic-index-for-copilot#supported-content-types){target=_blank}
- [Capabilities of Declarative agents](https://learn.microsoft.com/microsoft-365-copilot/extensibility/declarative-agent-capabilities-ids?tabs=explorer){target=_blank}
- [Validation guidelines for Agents](https://learn.microsoft.com/microsoftteams/platform/concepts/deploy-and-publish/appsource/prepare/review-copilot-validation-guidelines){target=_blank}

---8<--- "ja/e-congratulations.md"

ゲーム エージェントの構築お疲れさまでした 🎉! 次のラボでは REST API を作成し、それを使ってプラグインを構築し、別のエージェントで実際のビジネス シナリオを解決していきます。ワクワクしますね。 **Next** を選択して次のラボへ進みましょう。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/01a-geolocator--ja" />

<!-- <script src="https://giscus.app/client.js"
        data-repo="microsoft/copilot-camp"
        data-repo-id="R_kgDOLMKPIA"
        data-mapping="number"
        data-term="548"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script> -->