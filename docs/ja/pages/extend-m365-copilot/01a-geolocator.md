---
search:
  exclude: true
---
# ラボ E1 - Instructions ベースの Gelocator ゲーム エージェント

このラボでは、instructions とファイル経由で提供される補足知識を用いて、基本的な宣言型エージェントを作成します。  
作成するエージェントは、世界中の都市を探検しながら楽しく学べる休憩時間を提供することを目的としています。エージェントは抽象的な手がかりを提示し、  ユーザー が都市を当てるゲームです。手がかりを多く使うほど得点は低くなり、最後に最終スコアが表示されます。

このラボで学べること:

- Agents Toolkit テンプレートを使用して宣言型エージェントを作成する方法  
- instructions を使ってエージェントをカスタマイズし、Geo Locator Game を実装する方法  
- アプリを実行・テストする方法  
- ボーナス演習として、SharePoint Teams サイトを使用する方法  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/VDhRFMH3Qbs" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早く確認できます。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## はじめに

宣言型エージェントは、Microsoft 365 Copilot と同じスケーラブルなインフラストラクチャとプラットフォームを活用し、特定領域に特化したニーズにフォーカスできるよう最適化されています。  
標準の Microsoft 365 Copilot チャットと同じインターフェイスを利用しつつ、特定のタスクに専念する  エージェント として機能します。

このラボでは、まず Agents Toolkit の既定テンプレートを使用して宣言型エージェントを作成します。  
次に、エージェントを地理位置当てゲームに特化させるよう変更します。

AI の目的は、仕事の合間に楽しい休憩を提供しながら、世界中のさまざまな都市について学べるようにすることです。抽象的なヒントを提供し、都市を当ててもらいます。ヒントを多く使うほど得点は下がり、ゲーム終了時に最終スコアが表示されます。

![The initial UI of the Geo Locator Game with a couple of guesses from the user.](../../assets/images/extend-m365-copilot-01/game.png)

ボーナスとして、エージェントに秘密の日記 🕵🏽 と地図 🗺️ のファイルを参照させ、プレイヤーへの挑戦を増やします。

それでは始めましょう 💪🏼

## 演習 1: テンプレートから宣言型エージェントをスキャフォールディングする
宣言型エージェントを作成するには、アプリ パッケージ内のファイル構造を理解していれば任意のエディターを使用できます。しかし、Agents Toolkit を使えばファイル生成だけでなく、アプリのデプロイや発行も簡単に行えます。  
ここではシンプルに Agents Toolkit を使用します。

### 手順 1: Agents Toolkit のインストール

- Visual Studio Code の拡張機能タブに移動し、 **Microsoft 365 Agents Toolkit** を検索します。  
- 選択してインストールします。

<cc-end-step lab="e1a" exercise="1" step="1" />

### 手順 2: Agents Toolkit で宣言型エージェント アプリを作成する

Visual Studio Code 左側の Agents Toolkit 拡張機能 1️⃣ を開き、 **Create a New Agent/App** 2️⃣ を選択します。

![The UI of the Agents Toolkit to start creating a new app with the 'Create a New Agent' button highlighted.](../../assets/images/extend-m365-copilot-01/atk-create-new-agent.png)

パネルが開いたら、プロジェクトタイプの一覧から **Declarative Agent** を選択します。

![The project types available when creating a new app with Agents Toolkit. Options include 'Agent', which is highlighted.](../../assets/images/extend-m365-copilot-01/atk-da.png)

次に、基本的な宣言型エージェントを作成するか、API プラグイン付きにするか尋ねられます。  **No Action** オプションを選択してください。

![The Agents Toolkit app creation flow with the type of Declarative Agent with 'No plugin' selected.](../../assets/images/extend-m365-copilot-01/atk-no-action.png)

!!! tip "ここで Action 付きにしない理由"
     次のラボで REST API を構築し、その API を Action として宣言型エージェントに統合する方法を学びます。今回は宣言型エージェントのみを作成します。段階的に進めましょう!

続いて、プロジェクト フォルダーを作成するディレクトリーを入力します。

![The Agents Toolkit app creation flow with the prompt to provide a target path where to store the new app.](../../assets/images/extend-m365-copilot-01/atk-folder.png)

次に、アプリケーション名として `Geo Locator Game` を入力し、Enter を押します。

![The Agents Toolkit app creation flow with the prompt to provide a name for the app.](../../assets/images/extend-m365-copilot-01/atk-app-name.png)

数秒でプロジェクトが指定フォルダーに作成され、新しい Visual Studio Code ウィンドウで開きます。これが作業フォルダーです。

![Visual Studio Code with the new app scaffolded and ready to be extendend and the README file on the screen.](../../assets/images/extend-m365-copilot-01/atk-scaffold.png)

お疲れさまです! ベースの宣言型エージェントがセットアップできました。次に、geo locator game アプリにカスタマイズできるようファイルを確認しましょう。

<cc-end-step lab="e1a" exercise="1" step="2" />

### 手順 3: Agents Toolkit でアカウントを設定する
左側の Agents Toolkit アイコン 1️⃣ を選択します。 "Accounts" の下で "Sign in to Microsoft 365" 2️⃣ をクリックし、ご自身の Microsoft 365 アカウントでログインします。

![The UI of Agents Toolkit to allow logging into a target Microsoft 365 tenant.](../../assets/images/extend-m365-copilot-01/atk-accounts.png)

ブラウザーが開き Microsoft 365 へのログインが促されます。 "You are signed in now and close this page" と表示されたら閉じてください。

"Custom App Upload Enabled" のチェックマークが緑であることを確認します。緑でない場合は、Teams アプリのアップロード権限がありません。ラボの Exercise 1 の手順を参照してください。

"Copilot Access Enabled" も緑であることを確認します。緑でない場合は Copilot の  ライセンス を保有していません。ラボを続行するには必要です。

![The UI of Agents Toolkit after logging in, when the checkmarks are green.](../../assets/images/extend-m365-copilot-01/atk-accounts-logged.png)

それではコード ツアーを行いましょう。

<cc-end-step lab="e1a" exercise="1" step="3" />

### 手順 4: アプリ内のファイルを理解する

ベース プロジェクトの構成は次のとおりです:

| フォルダー / ファイル                       | 内容                                                                 |
| ------------------------------------ | -------------------------------------------------------------------- |
| `.vscode`                            | デバッグ用 VSCode ファイル                                           |
| `appPackage`                         | Teams アプリ manifest、エージェント manifest、API 仕様（ある場合）のテンプレート |
| `env`                                | 環境ファイル。既定で `.env.dev`  が含まれます |
| `appPackage/color.png`               | アプリ ロゴ画像 |
| `appPackage/outline.png`             | アプリ ロゴ輪郭画像 |
| `appPackage/declarativeAgent.json` | 宣言型エージェントの設定と構成を定義 |
| `appPackage/instruction.txt`         | 宣言型エージェントの動作を定義 |
| `appPackage/manifest.json`           | 宣言型エージェント用 Teams アプリ manifest |
| `m365agent.yml`                       | Agents Toolkit プロジェクト ファイル。プロパティと Stage 定義を含む |

今回のラボで特に重要なのは **appPackage/instruction.txt** です。エージェントの核となるディレクティブを記述するプレーンテキストファイルで、自然言語で指示を書けます。

もうひとつ重要なのが **appPackage/declarativeAgent.json** です。Microsoft 365 Copilot を拡張するためのスキーマを持っています。主なプロパティは次のとおりです。

- `$schema` : スキーマ参照  
- `version` : スキーマ バージョン  
- `name` : 宣言型エージェントの名前  
- `description` : 説明  
- `instructions` : **instructions.txt** へのパス。動作を決定するディレクティブを保持します。ここに直接テキストを書いても構いませんが、このラボでは **instructions.txt** を使用します。

さらに **appPackage/manifest.json** には、パッケージ名、開発者名、アプリが使用するエージェント参照など、重要なメタデータが含まれます。以下は manifest.json の抜粋です:

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
ブランドに合わせるため、`color.png` と `outline.png` を更新することもできます。本ラボでは **color.png** を変更してエージェントを目立たせます。

<cc-end-step lab="e1a" exercise="1" step="4" />

## 演習 2: instructions とアイコンの更新

### 手順 1: アイコンと manifest の更新

まずロゴを置き換えます。[こちら](../../assets/images/extend-m365-copilot-01/color.png){target=_blank} の画像をコピーし、ルート プロジェクトの **appPackage** フォルダー内の同名ファイルと置き換えてください。

次に **appPackage/manifest.json** を開き、 **copilotAgents** ノードを探します。declarativeAgents 配列の最初のエントリの id 値を `declarativeAgent` から `dcGeolocator` に変更して一意にします。

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

続いて **appPackage/instruction.txt** を開き、以下の内容で既存の内容を上書きします。

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
次の手順で、  ユーザー が会話を始めやすいよう conversation starters を追加します。  

!!! tip "**appPackage** 内に独自ファイルを含める"
    **appPackage/declarativeAgent.json** の次の行に注目してください:

    `"instructions": "$[file('instruction.txt')]",`

    これは **instruction.txt** から instructions を読み込む方法です。パッケージ ファイルをモジュール化したい場合、**appPackage** 内の他の JSON ファイルでも同じテクニックを使用できます。

<cc-end-step lab="e1a" exercise="2" step="1" />

### 手順 2 : Conversation Starters を追加する

宣言型エージェントに conversation starters を追加すると、  ユーザー とのエンゲージメントを高められます。

Conversation starters の利点:

- **エンゲージメント**: 会話を開始しやすくし、  ユーザー の参加を促します。  
- **コンテキスト設定**: 会話のトーンとトピックを示し、進め方をガイドします。  
- **効率**: 明確な焦点を提供することで曖昧さを減らし、スムーズな会話を促進します。  
- **ユーザー維持**: よく設計された starters は興味を維持し、リピート利用を促します。  

`declarativeAgent.json` を開き、`instructions` ノードの直後にコンマ `,` を追加し、以下のコードを貼り付けます。

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

これでエージェントの変更は完了です。次にテストしましょう。

<cc-end-step lab="e1a" exercise="2" step="2" />

### 手順 3: アプリをテストする

アプリをテストするには、Visual Studio Code の `Agents Toolkit` 拡張を開きます。左ペインの "LIFECYCLE" で "Provision" を選択します。Agents Toolkit により公開が簡単になります。 

![The UI of Agents Toolkit highlighting the 'Provision' command under the 'Lifecycle' group of commands.](../../assets/images/extend-m365-copilot-01/atk-provision.png)

このステップでは Agents Toolkit が `appPackage` フォルダー内のファイルを zip にパッケージし、宣言型エージェントを自身のアプリ カタログにインストールします。

Microsoft 365 Copilot BizChat  [https://microsoft365.com/copilot/](https://microsoft365.com/copilot/){target=_blank}  に開発者テナントでログインしてアクセスします。

Copilot アプリが読み込まれたら、右側のパネルから "Geo Locator Game" を見つけます。

![The UI of Microsoft 365 Copilot with the list of agents on the right side and the 'Geo Locator Game' agent highlighted.](../../assets/images/extend-m365-copilot-01/launch-geo.png)

見つからない場合、リストが長い可能性があります。"see more" を選択して展開してください。

起動するとエージェント専用のチャット ウィンドウが開き、下図のように conversation starters が表示されます:

![The UI of Microsoft 365 Copilot when the 'Geo Locator Game' agent is selected. The image highlights the conversation starters.](../../assets/images/extend-m365-copilot-01/launched-geo.png)

いずれかの conversation starter を選択すると、作成ボックスに自動入力され、Enter を押すだけで送信できます。エージェントは  ユーザー の操作を待ちます 🟢

ゲームのデモをご覧ください。 

![A video of the 'Geo Locator Game' in action with a user guessing a couple of cities and the agent showing the collected points.](../../assets/images/extend-m365-copilot-01/demo.gif)

<cc-end-step lab="e1a" exercise="2" step="3" />

## 演習 3: 参照用ファイルを追加する (ボーナス演習)

同じゲームを繰り返すだけでは飽きてしまいます。ゲームを楽しく刺激的に保つには、定期的に更新されるデータにアクセスできるようにする必要があります。ここではエージェントにファイル参照の機能を追加して、ゲームを刷新し難易度を上げましょう。先ほど学んだ通り、宣言型エージェントには SharePoint サイトや OneDrive を参照する能力があります。それでは、エージェントにいくつかのファイルへアクセスする能力を追加しましょう。

### 手順 1: SharePoint へファイルをアップロードする

この zip ファイルをダウンロードしてください: [link](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab01a-declarative-copilot/geo-locator-lab-sample/sharepoint-docs&filename=sharepoint-docs){target=_blank}

zip を展開し、同じテナント内の SharePoint Teams サイトのドキュメント ライブラリ **Documents** に 2 つの PDF (**historical_map.pdf** と **travelers_diary**) をアップロードします。

サイトの絶対 URL をコピーします。例: `https://xyz.sharepoint.com/sites/contoso`

> [!NOTE]
> ファイルやフォルダーのフル パスを取得するには、SharePoint の "Copy direct link" を使用します。対象を右クリックして Details → Path → コピー アイコンを選択してください。

準備ができたら次の手順へ進みます。

<cc-end-step lab="e1a" exercise="3" step="1" />

### 手順 2: 宣言型エージェント manifest を更新する

環境ファイル **.env.dev** を開き、"SP_SITE_URL" という新しい変数を作成して、SharePoint サイトの絶対 URL を値として設定します。

次に **appPackage/declarativeAgent.json** を開き、conversation_starters 配列の後ろにコンマ `,` を追加し、SharePoint データ参照機能を拡張する以下の配列オブジェクトを貼り付けます。

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
これにより、エージェントはこの SharePoint サイトのドキュメントを読み取ってゲームを盛り上げられるようになります。  
URL の数に制限はありません 💪🏼

<cc-end-step lab="e1a" exercise="3" step="2" />

### 手順 3: アプリ manifest をアップグレードする

**appPackage/manifest.json** を開き、アプリ `version` を "1.0.0" から "1.0.1" に更新して変更を反映させます。

<cc-end-step lab="e1a" exercise="3" step="3" />

### 手順 4: アプリをテストする

- 再度 Visual Studio Code の `Agents Toolkit` 拡張を開きます。左ペインの "LIFECYCLE" で "Provision" を選択し、アップグレードした宣言型エージェントをパッケージして自身のアプリ カタログにインストールします。  
- Microsoft 365 Copilot BizChat  [https://microsoft365.com/copilot/](https://microsoft365.com/copilot/){target=_blank}  にログインします。  
- 再び "Geo Locator Game" を起動します。  

![The UI of Microsoft 365 Copilot when the 'Geo Locator Game' agent is selected. The image highlights the conversation starters.](../../assets/images/extend-m365-copilot-01/launched-geo.png)

今回は旅行日記をもとにしたチャレンジを試してみてください。2 つ目の conversation starter を選びましょう。

![The 'Geo Locator Game' when relying on the travel diary. The agent answers providing a reference to the travelers_diary.pdf document stored in SharePoint Online.](../../assets/images/extend-m365-copilot-01/traveller.gif)

これであなたは宣言型エージェントの達人です。詳しくは次の動画をご覧ください。

 <div class="tinyVideo">
      <iframe src="//www.youtube.com/embed/QTP4PfXyyNk" frameborder="0" allowfullscreen></iframe>
      <div>Introducing Declarative agents</div>
    </div>

<cc-end-step lab="e1a" exercise="3" step="4" />

## リソース
- [Declarative agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-declarative-copilot){target=_blank}
- [Declarative agent manifest schema](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-manifest){target=_blank}
- [Supported content types](https://learn.microsoft.com/microsoftsearch/semantic-index-for-copilot#supported-content-types){target=_blank}
- [Capabilities of Declarative agents](https://learn.microsoft.com/microsoft-365-copilot/extensibility/declarative-agent-capabilities-ids?tabs=explorer){target=_blank}
- [Validation guidelines for Agents](https://learn.microsoft.com/microsoftteams/platform/concepts/deploy-and-publish/appsource/prepare/review-copilot-validation-guidelines){target=_blank}

---8<--- "ja/e-congratulations.md"

素晴らしい! ゲーム エージェントを構築できました 🎉  
次のラボでは REST API を作成し、それを使ったプラグインを構築し、別のエージェントで実際のビジネス シナリオを解決します。ワクワクする内容が続きます。 **Next** を選択して次のラボへ進んでください。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/01a-geolocator" />

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