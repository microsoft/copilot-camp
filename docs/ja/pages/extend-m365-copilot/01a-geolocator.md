---
search:
  exclude: true
---
# ラボ E1 – インストラクションに基づく Gelocator ゲーム エージェント

このラボでは、ファイルを通して提供されるインストラクションと補足知識を用いて、基本的な declarative エージェント を作成します。あなたのエージェントは、世界各国の都市を探索する手助けをすることで、仕事の合間に楽しく学びながらリフレッシュできるよう設計されています。抽象的なヒントを提示し、都市を当てさせる仕組みで、使用するヒントが多いほど獲得ポイントが少なくなります。最後に、最終スコアが明らかになります。

このラボで学ぶこと：

- Agents Toolkit テンプレートを使用して declarative エージェント を作成する
- インストラクション を活用して geo locator ゲーム向けにエージェント をカスタマイズする
- アプリの実行方法とテスト方法を学ぶ
- ボーナス演習として、 SharePoint Teams サイトが必要になります

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

Declarative エージェント は、 Microsoft 365 Copilot のスケーラブルなインフラおよびプラットフォームを活用しながら、特定の分野に焦点を合わせたカスタマイズが施されています。特定の業務内容やテーマに関する専門家として機能し、通常の Microsoft 365 Copilot チャットと同じインターフェースを利用しつつ、専らそのタスクに注力することを可能にします。

このラボでは、初めに Agents Toolkit を用いてツールに備え付けられたデフォルトテンプレートから declarative エージェント を構築します。これは、取り掛かりやすくするためのものです。次に、エージェント を geo locator ゲームに特化するよう修正します。

あなたの AI の目的は、仕事の合間の楽しいリフレッシュだけでなく、世界各国の都市について学ぶ手助けをすることにあります。抽象的なヒントを提示し、都市を特定させます。利用するヒントが多いほど獲得ポイントは減少し、ゲーム終了時に最終スコアが表示されます。

![The initial UI of the Geo Locator Game with a couple of guesses from the user.](../../assets/images/extend-m365-copilot-01/game.png)

ボーナスとして、エージェント に秘密の日記 🕵🏽 および 地図 🗺️ を参照ファイルとして追加し、プレイヤーにさらなるチャレンジを提供します。

さあ、始めましょう 💪🏼

## エクササイズ 1： テンプレートから declarative エージェント をスキャフォールドする

アプリパッケージ内のファイル構成が分かっていれば、任意のエディターで declarative エージェント を作成できます。しかし、Agents Toolkit のようなツールを使えば、自動でファイル生成やアプリのデプロイ、公開まで手助けしてくれるため、非常に簡単です。そこで、できるだけ手軽にするために Agents Toolkit を利用します。

### ステップ 1： Agents Toolkit のインストール

- Visual Studio Code の拡張機能 タブに移動し、 **Microsoft 365 Agents Toolkit** を検索してください。
- 選択してインストールします。

<cc-end-step lab="e1a" exercise="1" step="1" />

### ステップ 2： Agents Toolkit を使って declarative エージェント アプリを作成する

Visual Studio Code エディターの左側 1️⃣ にある Agents Toolkit 拡張機能に移動し、 **Create a New Agent/App** 2️⃣ を選択します。

![The UI of the Agents Toolkit to start creating a new app with the 'Create a New Agent' button highlighted.](../../assets/images/extend-m365-copilot-01/atk-create-new-agent.png)

パネルが表示され、プロジェクトの種類一覧から **Declarative Agent** を選択する必要があります。

![The project types available when creating a new app with Agents Toolkit. Options include 'Agent', which is highlighted.](../../assets/images/extend-m365-copilot-01/atk-da.png)

次に、基本の declarative エージェント を作成するか、API プラグイン付きのものを作成するかの選択が求められます。 **No Action** オプションを選択してください。

![The Agents Toolkit app creation flow with the type of Declarative Agent with 'No plugin' selected.](../../assets/images/extend-m365-copilot-01/atk-no-action.png)

!!! tip "なぜここでアクション付きにしないのか？"
    次のラボで REST API を構築し、これを使ってプラグインを作成する方法も学びます。このパスの次のラボで、その API を declarative エージェント のアクションとして統合する手順を学びます。ここでは、単に declarative エージェント を作成するだけです。初歩から進めましょう！

次に、プロジェクトフォルダーを作成するディレクトリを入力します。

![The Agents Toolkit app creation flow with the prompt to provide a target path where to store the new app.](../../assets/images/extend-m365-copilot-01/atk-folder.png)

続いて、アプリケーション名として `Geo Locator Game` を入力し、 Enter キーを押します。

![The Agents Toolkit app creation flow with the prompt to provide a name for the app.](../../assets/images/extend-m365-copilot-01/atk-app-name.png)

指定したフォルダー内に数秒でプロジェクトが作成され、新たな Visual Studio Code のプロジェクトウィンドウで開きます。これが作業フォルダーとなります。

![Visual Studio Code with the new app scaffolded and ready to be extendend and the README file on the screen.](../../assets/images/extend-m365-copilot-01/atk-scaffold.png)

素晴らしいです！ 基本の declarative エージェント のセットアップが完了しました。次に、エージェント を geo locator ゲームアプリにカスタマイズするため、含まれているファイルを確認してください。

<cc-end-step lab="e1a" exercise="1" step="2" />

### ステップ 3： Agents Toolkit でのアカウント設定

左側 1️⃣ にある Agents Toolkit アイコンを選択し、「Accounts」セクションで **Sign in to Microsoft 365** 2️⃣ をクリックし、あなたの Microsoft 365 アカウントでサインインしてください。

![The UI of Agents Toolkit to allow logging into a target Microsoft 365 tenant.](../../assets/images/extend-m365-copilot-01/atk-accounts.png)

ブラウザウィンドウが開き、 Microsoft 365 へのサインインが促されます。「You are signed in now and close this page」と表示されたら、ウィンドウを閉じてください。

次に、「Custom App Upload Enabled」のチェックマークが緑色になっていることを確認します。緑色でない場合、あなたの ユーザー アカウントには Teams アプリのアップロード権限がないことを意味します。このラボのエクササイズ 1 の手順に従ってください。

次に、「Copilot Access Enabled」のチェックマークが緑色になっていることを確認します。緑色でない場合、あなたの ユーザー アカウントには Copilot のライセンスが付与されていないことになります。これはラボを進めるために必要です。

![The UI of Agents Toolkit after logging in, when the checkmarks are green.](../../assets/images/extend-m365-copilot-01/atk-accounts-logged.png)

さあ、コードツアーを始めましょう。

<cc-end-step lab="e1a" exercise="1" step="3" />

### ステップ 4： アプリ内ファイルの理解

基本プロジェクトの構成は以下のとおりです：

| Folder/File                          | Contents                                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `.vscode`                            | デバッグ用の VSCode ファイル                                                                                        |
| `appPackage`                         | Teams アプリのマニフェスト、エージェント マニフェスト、および（存在する場合）API 仕様のテンプレート                          |
| `env`                                | デフォルトの `.env.dev` ファイルを含む環境ファイル                                                                    |
| `appPackage/color.png`               | アプリケーションのロゴ画像                                                                                           |
| `appPackage/outline.png`             | アプリケーションのロゴアウトライン画像                                                                              |
| `appPackage/declarativeAgent.json`   | declarative エージェント の設定および構成を定義                                                                        |
| `appPackage/instruction.txt`         | declarative エージェント の動作を定義する内容                                                                          |
| `appPackage/manifest.json`           | declarative エージェント のメタデータを定義する Teams アプリのマニフェスト                                             |
| `m365agent.yml`                      | 主な Agents Toolkit プロジェクトファイル。プロジェクトファイルでは、プロパティおよび構成ステージの定義という 2 つの主要な事項を定義しています。 |

このラボで注目するファイルは、主にエージェント に必要なコア指示が記載された **appPackage/instruction.txt** です。これはプレーンテキストファイルであり、自然言語で指示を記述できます。

もう一つ重要なファイルは **appPackage/declarativeAgent.json** です。ここでは、新たな declarative エージェント を Microsoft 365 Copilot に拡張するためのスキーマが記載されています。このファイルのスキーマが持つプロパティは以下のとおりです：

- 「$schema」：スキーマ参照です
- 「version」：スキーマのバージョンです
- 「name」：declarative エージェント の名称を表しています
- 「description」：説明を提供します
- 「instructions」：動作指示を決定するためのディレクティブを記載した **instruction.txt** ファイルへのパスを提供します。ここには、指示をプレーンテキストとして直接記入することも可能ですが、このラボでは **instruction.txt** ファイルを使用します。

さらに重要なファイルは `appPackage/manifest.json` で、パッケージ名、開発者名、そしてアプリが利用するエージェント への参照など、重要なメタデータが含まれています。以下の manifest.json ファイルの抜粋は、これらの詳細を示しています：

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
ロゴ画像ファイル `color.png` および `outline.png` を、アプリのブランドに合わせて更新することも可能です。本ラボでは、エージェント を際立たせるために **color.png** アイコンを変更します。

<cc-end-step lab="e1a" exercise="1" step="4" />

## エクササイズ 2： インストラクションとアイコンの更新

### ステップ 1： アイコンとマニフェストの更新

まずは、ロゴの差し替えという簡単な作業を行います。[こちら](../../assets/images/extend-m365-copilot-01/color.png){target=_blank} の画像をコピーし、ルートプロジェクト内の **appPackage** フォルダーにある同名の画像と置き換えてください。

次に、ルートプロジェクト内の **appPackage/manifest.json** ファイルを開き、 **copilotAgents** ノードを探します。declarativeAgents 配列の最初のエントリの id 値を `declarativeAgent` から `dcGeolocator` に更新し、この ID をユニークなものにします。

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

次に、ルートプロジェクト内の **appPackage/instruction.txt** ファイルを開き、以下の指示内容をコピー＆ペーストして、既存の内容を上書きしてください。

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
次のステップでは、エージェント が会話のきっかけを提供することで ユーザー と関わる手助けをできるようにします。

!!! tip "独自のファイルを **appPackage** 内に含める場合"
    **appPackage/declarativeAgent.json** 内の以下の行に注目してください：

    `"instructions": "$[file('instruction.txt')]",`

    これにより、**instruction.txt** ファイルから指示内容が取り込まれます。パッケージファイルをモジュール化したい場合、**appPackage** フォルダー内の任意の JSON ファイルでこの手法を利用できます。

<cc-end-step lab="e1a" exercise="2" step="1" />

### ステップ 2： 会話開始促しの追加

会話開始促しを追加することで、declarative エージェント とのユーザー エンゲージメントを向上させることができます。

会話開始促しの利点：

- **Engagement**：インタラクションを開始しやすくし、ユーザーが安心して参加できるよう促します。
- **Context Setting**：会話のトーンや話題を設定し、ユーザーがどのように進めるべきかを導きます。
- **Efficiency**：明確な焦点を持つことで曖昧さを減少させ、円滑な会話の進行を可能にします。
- **User Retention**：適切に設計された開始促しは、ユーザーの関心を引き、繰り返しの利用を促します。

ファイル `declarativeAgent.json` を開き、`instructions` ノードの直後にカンマ `,` を追加し、以下のコードを貼り付けてください。

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

これでエージェント への変更は完了です。さあ、テストに移りましょう。

<cc-end-step lab="e1a" exercise="2" step="2" />

### ステップ 3： アプリのテスト

アプリをテストするには、Visual Studio Code 内の `Agents Toolkit` 拡張機能に戻ってください。左側のペインが開き、「LIFECYCLE」内の「Provision」を選択します。Agents Toolkit の利便性がここに現れており、パブリッシュが非常に簡単です。

![The UI of Agents Toolkit highlighting the 'Provision' command under the 'Lifecycle' group of commands.](../../assets/images/extend-m365-copilot-01/atk-provision.png)

このステップでは、Agents Toolkit が `appPackage` フォルダー内のすべてのファイルを zip ファイルにパッケージ化し、あなたのアプリ カタログに declarative エージェント をインストールします。

Microsoft 365 Copilot BizChat [https://microsoft365.com/copilot/](https://microsoft365.com/copilot/){target=_blank} を開き、あなたの開発者テナントでログインしてください。

Copilot アプリが読み込まれると、右側のパネルから **Geo Locator Game** を探してください。

![The UI of Microsoft 365 Copilot with the list of agents on the right side and the 'Geo Locator Game' agent highlighted.](../../assets/images/extend-m365-copilot-01/launch-geo.png)

見つからない場合は、リストが長くなっている可能性があるため、「see more」を選択してリストを展開し、エージェント を探してください。

起動後、エージェント との集中チャットウィンドウが表示され、会話開始促しが以下のように示されます：

![The UI of Microsoft 365 Copilot when the 'Geo Locator Game' agent is selected. The image highlights the conversation starters.](../../assets/images/extend-m365-copilot-01/launched-geo.png)

会話開始促しのいずれかを選択すると、そのプロンプトが作成メッセージ ボックスに自動入力され、 Enter キーを押すだけで送信できます。エージェント はあくまでアシスタントとして待機しています 🟢

ゲームのデモもご覧ください。

![A video of the 'Geo Locator Game' in action with a user guessing a couple of cities and the agent showing the collected points.](../../assets/images/extend-m365-copilot-01/demo.gif)

<cc-end-step lab="e1a" exercise="2" step="3" />

## エクササイズ 3： 参照用ファイルの追加 (ボーナスエクササイズ)

同じゲームを何度もプレイしていると飽きてしまいます。楽しくエンゲージメントを維持するためには、定期的に更新されるデータへのアクセスが必要です。エージェント に新たな能力を付与して、ゲームをリフレッシュし、チャレンジの難易度を上げましょう。前述のとおり、declarative エージェント には主に 3 つの機能があり、そのうちの 1 つが SharePoint サイトや OneDrive への参照です。では、エージェント に数個のファイルへのアクセス機能を追加しましょう。

### ステップ 1： SharePoint へのファイルアップロード

この [リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab01a-declarative-copilot/geo-locator-lab-sample/sharepoint-docs&filename=sharepoint-docs){target=_blank} をクリックして、2 つの PDF ファイルが含まれた zip ファイルをダウンロードしてください。

zip ファイルから 2 つのファイルを解凍し、同じテナント内の SharePoint Teams サイトのドキュメント ライブラリ **Documents** にアップロードします。これらのドキュメントは、ゲームをよりチャレンジングにするための **historical_map.pdf** と **travelers_diary** です。

サイトの絶対 URL をコピーしてください。例： `https://xyz.sharepoint.com/sites/contoso` 。

> [!NOTE]
> ファイルやフォルダーの完全なパスを取得するには、SharePoint の「Copy direct link」オプションを使用できます。対象のファイルまたはフォルダーを右クリックして「Details」を選択し、「Path」までスクロールしてコピーアイコンをクリックしてください。

次に、次のステップに進みます。

<cc-end-step lab="e1a" exercise="3" step="1" />

### ステップ 2： declarative エージェント マニフェストの更新

環境ファイル **.env.dev** を開き、新たな変数 "SP_SITE_URL" を作成し、SharePoint サイトの絶対 URL をその値として貼り付けます。

次に、エージェント マニフェスト **appPackage/declarativeAgent.json** を開き、conversation_starters 配列の後にカンマ `,` を追加し、以下の新しい配列オブジェクトを貼り付けて、特定の SharePoint サイトのデータを参照するエージェント の機能を拡張します。

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
これにより、declarative エージェント はこの SharePoint サイト内のドキュメントを参照できるようになり、ゲームに刺激が加えられます。URL の追加に制限はありません 💪🏼

<cc-end-step lab="e1a" exercise="3" step="2" />

### ステップ 3： アプリマニフェストのアップグレード

次に、**appPackage/manifest.json** ファイルを開き、アプリの `version` を "1.0.0" から "1.0.1" にアップグレードし、インストール時に変更が反映されるようにしてください。

<cc-end-step lab="e1a" exercise="3" step="3" />

### ステップ 4： アプリのテスト

- アプリをテストするには、Visual Studio Code 内の `Agents Toolkit` 拡張機能に戻ってください。左側のペインが開き、「LIFECYCLE」内の「Provision」を選択し、アップグレードされた declarative エージェント をパッケージ化してあなたのアプリ カタログにインストールします。

- 開発者テナントにログインした状態で、Microsoft 365 Copilot BizChat [https://microsoft365.com/copilot/](https://microsoft365.com/copilot/){target=_blank} を開いてください。

- 再度 **Geo Locator Game** を起動します。

![The UI of Microsoft 365 Copilot when the 'Geo Locator Game' agent is selected. The image highlights the conversation starters.](../../assets/images/extend-m365-copilot-01/launched-geo.png)

今回は、旅行日記をベースにしたチャレンジに挑戦してください。2 番目の会話開始促しを選択します。

![The 'Geo Locator Game' when relying on the travel diary. The agent answers providing a reference to the travelers_diary.pdf document stored in SharePoint Online.](../../assets/images/extend-m365-copilot-01/traveller.gif)

これで、あなたはまさに declarative エージェント の達人となりました。こちらの動画で詳細をご覧ください。

 <div class="tinyVideo">
      <iframe src="//www.youtube.com/embed/QTP4PfXyyNk" frameborder="0" allowfullscreen></iframe>
      <div>Declarative エージェント の紹介</div>
    </div>

<cc-end-step lab="e1a" exercise="3" step="4" />

## リソース
- [Declarative エージェント](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-declarative-copilot){target=_blank}
- [Declarative agent マニフェスト スキーマ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-manifest){target=_blank}
- [サポートされるコンテンツ タイプ](https://learn.microsoft.com/microsoftsearch/semantic-index-for-copilot#supported-content-types){target=_blank}
- [Declarative エージェント の機能](https://learn.microsoft.com/microsoft-365-copilot/extensibility/declarative-agent-capabilities-ids?tabs=explorer){target=_blank}
- [エージェント の検証ガイドライン](https://learn.microsoft.com/microsoftteams/platform/concepts/deploy-and-publish/appsource/prepare/review-copilot-validation-guidelines){target=_blank}


---8<--- "ja/e-congratulations.md"

ゲーム エージェント の構築、お疲れ様でした 🎉 ！ 次のラボでは、REST API を作成し、これを使ってプラグインを構築、そして別のエージェント によって解決された実際のビジネスシナリオに取り組みます。非常にエキサイティングな内容です。次のラボに進むには **Next** を選択してください。

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