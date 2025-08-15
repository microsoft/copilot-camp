---
search:
  exclude: true
---
# Lab E1 - Instructions ベースの Geo Locator Game エージェント

この lab では、指示とファイルによる補足知識を活用して、基本的な宣言型エージェントを作成します。  
作成するエージェントは、仕事の合間に楽しみながら学習できるよう、世界各地の都市を探索するゲームを提供します。抽象的な手がかりを基に都市名を当て、手がかりを多く使うほど獲得ポイントは減少します。ゲーム終了時に最終スコアが表示されます。

この lab で学習する内容:

- Agents Toolkit のテンプレートを使用して宣言型エージェントを作成する方法  
- instructions を使って Geo Locator Game に合わせてエージェントをカスタマイズする方法  
- アプリを実行・テストする方法  
- ボーナス演習として SharePoint Teams サイトを使用する方法  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/VDhRFMH3Qbs" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画で lab の概要を短時間で確認しましょう。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## はじめに

宣言型エージェントは、 Microsoft 365 Copilot と同じスケーラブルなインフラとプラットフォームを活用しつつ、特定領域にフォーカスしたニーズに応えるよう最適化されています。  
標準の Microsoft 365 Copilot チャットと同じインターフェースを使いながら、特定のタスクに特化した **エージェント** として機能します。

この lab では、まず Agents Toolkit で提供されるデフォルトテンプレートを使って宣言型エージェントを作成します。  
次に、このエージェントを Geo Locator Game 用にカスタマイズします。

AI の目的は、仕事の合間に楽しい休憩を提供しつつ、世界各都市について学べるようサポートすることです。抽象的な手がかりを提示し、都市名を当てるまでに使った手がかりが少ないほど高得点となります。最後に合計スコアを発表します。

![The initial UI of the Geo Locator Game with a couple of guesses from the user.](../../assets/images/extend-m365-copilot-01/game.png)

ボーナスとして、エージェントに秘密の日記 🕵🏽 と地図 🗺️ を参照させ、プレイヤーへのチャレンジを強化します。

それでは始めましょう 💪🏼

## Exercise 1: テンプレートから宣言型エージェントをスキャフォールディングする
アプリ パッケージの構成を把握していれば、任意のエディターで宣言型エージェントを作成できますが、 Agents Toolkit を使うとファイル生成、デプロイ、公開を一括で行えるため便利です。  
この lab では Agents Toolkit を使用して進めます。

### Step 1: Agents Toolkit をインストールする

- Visual Studio Code の拡張機能タブを開き、 **Microsoft 365 Agents Toolkit** を検索します。  
- 選択してインストールします。

<cc-end-step lab="e1a" exercise="1" step="1" />

### Step 2: Agents Toolkit で宣言型エージェント アプリを作成する

Visual Studio Code 左側の Agents Toolkit 拡張機能 1️⃣ を開き、 **Create a New Agent/App** 2️⃣ を選択します。  

![The UI of the Agents Toolkit to start creating a new app with the 'Create a New Agent' button highlighted.](../../assets/images/extend-m365-copilot-01/atk-create-new-agent.png)

パネルが開いたら、プロジェクト タイプ一覧から **Declarative Agent** を選択します。

![The project types available when creating a new app with Agents Toolkit. Options include 'Agent', which is highlighted.](../../assets/images/extend-m365-copilot-01/atk-da.png)

次に、基本的な宣言型エージェントか、 API プラグイン付きかを選択します。 **No Action** を選択してください。

![The Agents Toolkit app creation flow with the type of Declarative Agent with 'No plugin' selected.](../../assets/images/extend-m365-copilot-01/atk-no-action.png)

!!! tip "なぜここで Action 付きにしないの？"
    次の lab で REST API を構築し、その API を Action として宣言型エージェントに統合する方法を学びます。今回は宣言型エージェントのみを作成します。ステップ・バイ・ステップで進めましょう！

次に、プロジェクト フォルダーを作成するディレクトリを入力します。

![The Agents Toolkit app creation flow with the prompt to provide a target path where to store the new app.](../../assets/images/extend-m365-copilot-01/atk-folder.png)

アプリケーション名を `Geo Locator Game` と入力し、Enter を押します。  

![The Agents Toolkit app creation flow with the prompt to provide a name for the app.](../../assets/images/extend-m365-copilot-01/atk-app-name.png)

数秒でプロジェクトが指定フォルダーに作成され、新しい Visual Studio Code ウィンドウで開きます。これが作業フォルダーです。

![Visual Studio Code with the new app scaffolded and ready to be extendend and the README file on the screen.](../../assets/images/extend-m365-copilot-01/atk-scaffold.png)

お疲れさまでした！ベースとなる宣言型エージェントのセットアップが完了しました。次に、 Geo Locator Game 用にカスタマイズするためにファイル構成を確認しましょう。

<cc-end-step lab="e1a" exercise="1" step="2" />

### Step 3: Agents Toolkit でアカウントを設定する
左側で Agents Toolkit アイコン 1️⃣ を選択し、"Accounts" セクションの **Sign in to Microsoft 365** 2️⃣ をクリックして、自分の Microsoft 365 アカウントでログインします。  

![The UI of Agents Toolkit to allow logging into a target Microsoft 365 tenant.](../../assets/images/extend-m365-copilot-01/atk-accounts.png)

ブラウザーが開き、 Microsoft 365 へのログインが完了すると「You are signed in now and close this page」と表示されますので、そのページを閉じます。

"Custom App Upload Enabled" チェッカーに緑のチェックが付いているか確認します。付いていない場合は、 Teams アプリをアップロードする権限がありません。 lab の Exercise 1 の手順を参照してください。  

"Copilot Access Enabled" チェッカーも緑か確認します。緑でない場合、 Copilot のライセンスがありません。ライセンスが必須です。

![The UI of Agents Toolkit after logging in, when the checkmarks are green.](../../assets/images/extend-m365-copilot-01/atk-accounts-logged.png)

ではコード ツアーを始めましょう。

<cc-end-step lab="e1a" exercise="1" step="3" />

### Step 4: アプリのファイル構成を理解する

ベース プロジェクトの構成は次のとおりです。 

| フォルダー/ファイル                     | 内容 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `.vscode`                            | デバッグ用 VS Code ファイル |
| `appPackage`                         | Teams アプリ マニフェスト、エージェント マニフェスト、 API 仕様（ある場合）のテンプレート |
| `env`                                | 環境変数ファイル (デフォルトは `.env.dev`) |
| `appPackage/color.png`               | アプリのロゴ画像 |
| `appPackage/outline.png`             | アプリのロゴ（アウトライン） |
| `appPackage/declarativeAgent.json` | 宣言型エージェントの設定と構成を定義 |
| `appPackage/instruction.txt`         | 宣言型エージェントの動作を定義 |
| `appPackage/manifest.json`           | 宣言型エージェントのメタデータを定義する Teams アプリ マニフェスト |
| `m365agent.yml`                      | Agents Toolkit のメイン プロジェクト ファイル (プロパティと Stage 定義) |

この lab で特に重要なのは **appPackage/instruction.txt** です。  
プレーンテキストで自然言語の指示を書き込めます。

もう 1 つ重要なのが **appPackage/declarativeAgent.json** です。  
ここでは Microsoft 365 Copilot を拡張するためのスキーマに従って設定します。主なプロパティは次のとおりです。  

- `$schema` : スキーマ参照  
- `version` : スキーマ バージョン  
- `name` : 宣言型エージェントの名前  
- `description` : 説明  
- `instructions` : **instructions.txt** へのパス。ここに指示を直接書くことも可能ですが、本 lab では **instruction.txt** を使用します。

さらに **appPackage/manifest.json** には、パッケージ名や開発者名、アプリが使用するエージェントの参照などの重要なメタデータが含まれます。次の抜粋はその一部です:

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

ブランドに合わせて `color.png` と `outline.png` のロゴを変更することも可能です。本 lab では **color.png** を変更してエージェントを目立たせます。

<cc-end-step lab="e1a" exercise="1" step="4" />

## Exercise 2: instructions とアイコンを更新する

### Step 1: アイコンとマニフェストを更新する

まずはロゴを置き換えます。[こちら](../../assets/images/extend-m365-copilot-01/color.png){target=_blank} の画像をコピーし、プロジェクト ルートの **appPackage** フォルダー内に同名で上書きします。

次に、 **appPackage/manifest.json** を開き、 **copilotAgents** ノードを探します。  
`declarativeAgents` 配列の最初の `id` の値を `declarativeAgent` から `dcGeolocator` に変更し、一意にします。

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

続いて **appPackage/instruction.txt** を開き、以下の内容で既存の内容を完全に置き換えてください。

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

次のステップで、会話スターターを追加してユーザーがエージェントとやり取りしやすくします。

!!! tip "**appPackage** 内に独自ファイルを含める"
    **appPackage/declarativeAgent.json** には次の行があります:

    `"instructions": "$[file('instruction.txt')]",`

    これは **instruction.txt** の内容を取り込みます。パッケージ内の他の JSON ファイルでも、この手法でモジュール化できます。

<cc-end-step lab="e1a" exercise="2" step="1" />

### Step 2 : 会話スターターを追加する

会話スターターを追加して、宣言型エージェントとの対話を活性化しましょう。

会話スターターの主なメリット:

- **エンゲージメント**: ユーザーが気軽に対話を始められる  
- **コンテキスト設定**: 会話の方向性とトーンを提示  
- **効率性**: 目的を明確にし、スムーズに進行  
- **ユーザー維持**: 興味を引き、再訪を促進

`declarativeAgent.json` を開き、`instructions` ノードの直後にカンマ `,` を追加し、以下のコードを貼り付けます。

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

これでエージェントへの変更は完了です。テストを行いましょう。

<cc-end-step lab="e1a" exercise="2" step="2" />

### Step 3: アプリをテストする

アプリをテストするには、 Visual Studio Code の `Agents Toolkit` 拡張を開きます。左ペインの "LIFECYCLE" で "Provision" を選択します。 Agents Toolkit の利点として、公開が非常に簡単です。  

![The UI of Agents Toolkit highlighting the 'Provision' command under the 'Lifecycle' group of commands.](../../assets/images/extend-m365-copilot-01/atk-provision.png)

Agents Toolkit は `appPackage` フォルダー内のファイルを zip にパッケージし、あなたのアプリ カタログに宣言型エージェントをインストールします。

Microsoft 365 Copilot BizChat を開きます: [https://microsoft365.com/copilot/](https://microsoft365.com/copilot/){target=_blank}  
開発者テナントでログインしてください。

Copilot アプリがロードされたら、右側のリストから "Geo Locator Game" を探します。  

![The UI of Microsoft 365 Copilot with the list of agents on the right side and the 'Geo Locator Game' agent highlighted.](../../assets/images/extend-m365-copilot-01/launch-geo.png)

見つからない場合はリストが長い可能性があります。"see more" を選択して展開してください。

起動すると、エージェント専用チャット ウィンドウが開き、会話スターターが表示されます。  

![The UI of Microsoft 365 Copilot when the 'Geo Locator Game' agent is selected. The image highlights the conversation starters.](../../assets/images/extend-m365-copilot-01/launched-geo.png)

会話スターターのいずれかを選択すると、メッセージ入力欄にスターター プロンプトが入力され、 Enter を押すのを待っています。エージェントはあなたの操作を待っています 🟢

ゲームのデモはこちら。  

![A video of the 'Geo Locator Game' in action with a user guessing a couple of cities and the agent showing the collected points.](../../assets/images/extend-m365-copilot-01/demo.gif)

<cc-end-step lab="e1a" exercise="2" step="3" />

## Exercise 3: 参照用ファイルを追加する (ボーナス演習) 

同じゲームを繰り返すと飽きてしまいます。常に最新データにアクセスし、難易度を調整できるようにしましょう。  
前述のとおり、宣言型エージェントには SharePoint サイトや OneDrive を参照する機能があります。ここでは、エージェントに 2 つのファイルへアクセスさせます。

### Step 1: SharePoint にファイルをアップロードする

こちらの zip ファイルをダウンロードしてください: [link](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab01a-declarative-copilot/geo-locator-lab-sample/sharepoint-docs&filename=sharepoint-docs){target=_blank}

zip を展開し、2 つの PDF (**historical_map.pdf** と **travelers_diary**) を同じテナント内の SharePoint Teams サイトの **Documents** ライブラリにアップロードします。

サイトの絶対 URL をコピーします。例: `https://xyz.sharepoint.com/sites/contoso`

> [!NOTE]  
> ファイルやフォルダーの完全パスは、SharePoint の "Copy direct link" で取得できます。対象を右クリックして Details > Path > コピー アイコンの順に選択してください。

次のステップへ進みます。

<cc-end-step lab="e1a" exercise="3" step="1" />

### Step 2: 宣言型エージェント マニフェストを更新する

環境ファイル **.env.dev** を開き、変数 `SP_SITE_URL` を作成し、 SharePoint サイトの絶対 URL を値として設定します。

次に **appPackage/declarativeAgent.json** を開き、`conversation_starters` 配列の後ろにカンマ `,` を追加して、以下のオブジェクトを貼り付けます。

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

これで宣言型エージェントが指定 SharePoint サイトのドキュメントを参照できるようになり、ゲームがさらに刺激的になります。  
URL は複数追加可能です 💪🏼

<cc-end-step lab="e1a" exercise="3" step="2" />

### Step 3: アプリ マニフェストをアップグレードする

**appPackage/manifest.json** を開き、`version` を `"1.0.0"` から `"1.0.1"` に更新し、変更を反映させます。

<cc-end-step lab="e1a" exercise="3" step="3" />

### Step 4: アプリをテストする

- Visual Studio Code の `Agents Toolkit` 拡張に戻り、"LIFECYCLE" で "Provision" を選択し、更新された宣言型エージェントをパッケージ・インストールします。  
- Microsoft 365 Copilot BizChat を開き、開発者テナントでログインします。  
- 再度 "Geo Locator Game" を起動します。  

![The UI of Microsoft 365 Copilot when the 'Geo Locator Game' agent is selected. The image highlights the conversation starters.](../../assets/images/extend-m365-copilot-01/launched-geo.png)

今回は旅の日記を基にしたチャレンジを試してみましょう。2 番目の会話スターターを選択してください。  

![The 'Geo Locator Game' when relying on the travel diary. The agent answers providing a reference to the travelers_diary.pdf document stored in SharePoint Online.](../../assets/images/extend-m365-copilot-01/traveller.gif)

これで宣言型エージェントの達人になりました。詳しくは次の動画をご覧ください。  

 <div class="tinyVideo">
      <iframe src="//www.youtube.com/embed/QTP4PfXyyNk" frameborder="0" allowfullscreen></iframe>
      <div>宣言型エージェントの紹介</div>
    </div>

<cc-end-step lab="e1a" exercise="3" step="4" />

## 参考資料
- [Declarative agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-declarative-copilot){target=_blank}
- [Declarative agent manifest schema](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-manifest){target=_blank}
- [Supported content types](https://learn.microsoft.com/microsoftsearch/semantic-index-for-copilot#supported-content-types){target=_blank}
- [Capabilities of Declarative agents](https://learn.microsoft.com/microsoft-365-copilot/extensibility/declarative-agent-capabilities-ids?tabs=explorer){target=_blank}
- [Validation guidelines for Agents](https://learn.microsoft.com/microsoftteams/platform/concepts/deploy-and-publish/appsource/prepare/review-copilot-validation-guidelines){target=_blank}

---8<--- "ja/e-congratulations.md"

ゲーム エージェントの構築おめでとうございます 🎉! 次の lab では、 REST API を作成し、それを使ってプラグインを構築し、別のエージェントで実際のビジネス シナリオを解決します。ワクワクする内容が待っています。 **Next** を選択して次の lab へ進みましょう。

<cc-next />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/01a-geolocator--ja" />