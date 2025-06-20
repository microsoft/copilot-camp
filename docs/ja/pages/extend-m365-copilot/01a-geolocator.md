---
search:
  exclude: true
---
# ラボ E1 - インストラクション ベースの Gelocator ゲーム エージェント

このラボでは、instructions とファイルで提供される補足知識を用いて、基本的な宣言型エージェントを作成します。作成するエージェントは、仕事の合間に楽しみながら世界中の都市を学習できるように設計されています。都市を当てるための抽象的なヒントを提示し、ヒントを多く使うほど獲得ポイントが少なくなります。ゲーム終了時に最終スコアが表示されます。

このラボで学習する内容:

- Agents Toolkit テンプレートを使用した宣言型エージェントの作成
- instructions を用いたエージェントのカスタマイズによる Geo Locator ゲームの構築
- アプリの実行およびテスト方法
- ボーナス演習として、SharePoint Teams サイトを使用

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

宣言型エージェントは Microsoft 365 Copilot と同じスケーラブルなインフラとプラットフォームを活用し、特定領域にフォーカスしたニーズに合わせて最適化されています。標準の Microsoft 365 Copilot チャットと同じインターフェイスを使用しながら、特定タスクに特化した専門家として機能します。

本ラボでは、はじめに Agents Toolkit で提供される既定テンプレートを用いて宣言型エージェントを構築します。その後、エージェントを Geo Locator ゲームに特化させるよう修正します。

この AI の目的は、仕事の休憩時間に楽しみながら世界中のさまざまな都市について学べるようにすることです。都市を識別するための抽象的なヒントを提供し、必要なヒントが多いほどポイントが減少します。ゲーム終了時に最終スコアが表示されます。

![Geo Locator Game の初期 UI と、ユーザーによる数回の推測。](../../assets/images/extend-m365-copilot-01/game.png)

ボーナスとして、エージェントに秘密の日記 🕵🏽 と地図 🗺️ を参照させ、プレイヤーへさらに難易度の高いチャレンジを提供します。

それでは始めましょう 💪🏼

## 演習 1: テンプレートから宣言型エージェントをスキャフォールディング
宣言型エージェント用のファイル構成を理解していれば、任意のエディターで作成できますが、Agents Toolkit を使用するとファイル作成からデプロイ、公開まで簡単に行えます。ここでは Agents Toolkit を使用して作業をシンプルに進めます。

### 手順 1: Agents Toolkit をインストール

- Visual Studio Code の拡張機能タブを開き、**Microsoft 365 Agents Toolkit** を検索します。
- 拡張機能を選択し、インストールします。

<cc-end-step lab="e1a" exercise="1" step="1" />

### 手順 2: Agents Toolkit で宣言型エージェント アプリを作成

Visual Studio Code 左側で Agents Toolkit 拡張機能 1️⃣ を開き、**Create a New Agent/App** 2️⃣ を選択します。

![Agents Toolkit で新しいアプリを作成する UI。'Create a New Agent' ボタンがハイライト。](../../assets/images/extend-m365-copilot-01/atk-create-new-agent.png)

パネルが開くので、プロジェクト タイプ一覧から **Declarative Agent** を選択します。

![Agents Toolkit で利用できるプロジェクト タイプ。'Agent' オプションがハイライト。](../../assets/images/extend-m365-copilot-01/atk-da.png)

次に、基本的な宣言型エージェントを作成するか、API プラグイン付きで作成するかを選択します。**No Action** を選択してください。

![Declarative Agent の種類選択画面で 'No plugin' が選択されている。](../../assets/images/extend-m365-copilot-01/atk-no-action.png)

!!! tip "ここでアクション付きにしない理由"
     次のラボで REST API を構築し、さらにその API をアクションとして宣言型エージェントに統合する方法を学びます。今回は宣言型エージェントだけを作成します。Baby steps!

続いて、プロジェクト フォルダーを作成するディレクトリを入力します。

![アプリ保存先パスの入力プロンプト。](../../assets/images/extend-m365-copilot-01/atk-folder.png)

次に、アプリケーション名として `Geo Locator Game` を入力し、Enter を押します。

![アプリ名入力プロンプト。](../../assets/images/extend-m365-copilot-01/atk-app-name.png)

数秒でプロジェクトが指定フォルダーに作成され、新しい Visual Studio Code ウィンドウで開かれます。これが作業用フォルダーです。

![新しくスキャフォールドされたアプリと README が表示された Visual Studio Code。](../../assets/images/extend-m365-copilot-01/atk-scaffold.png)

お疲れさまです！ 基本的な宣言型エージェントのセットアップが完了しました。次はファイル内容を確認し、Geo Locator ゲーム向けにカスタマイズしていきましょう。

<cc-end-step lab="e1a" exercise="1" step="2" />

### 手順 3: Agents Toolkit でアカウント設定

左側で Agents Toolkit アイコン 1️⃣ を選択し、「Accounts」セクションの **Sign in to Microsoft 365** 2️⃣ をクリックして、ご自身の Microsoft 365 アカウントでログインします。

![Microsoft 365 テナントへログインするための Agents Toolkit UI。](../../assets/images/extend-m365-copilot-01/atk-accounts.png)

ブラウザー ウィンドウが開き、Microsoft 365 へのログインが求められます。「You are signed in now and close this page」と表示されたらページを閉じてください。

次に "Custom App Upload Enabled" のチェックマークが緑であることを確認します。緑でない場合は、ユーザー アカウントに Teams アプリをアップロードする権限がありません。ラボの演習 1 の手順に従ってください。

続いて "Copilot Access Enabled" のチェックマークが緑であることを確認します。緑でない場合は、Copilot の license がありません。ラボを続行するには必須です。

![ログイン後、チェックマークが緑になった Agents Toolkit UI。](../../assets/images/extend-m365-copilot-01/atk-accounts-logged.png)

それではコードツアーを行いましょう。

<cc-end-step lab="e1a" exercise="1" step="3" />

### 手順 4: アプリのファイル構成を理解する

ベース プロジェクトは次のようになっています:

| フォルダー / ファイル                  | 内容                                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `.vscode`                            | デバッグ用 VS Code ファイル                                                                      |
| `appPackage`                         | Teams アプリ マニフェスト、エージェント マニフェスト、API 仕様 (ある場合) のテンプレート          |
| `env`                                | 環境ファイル。デフォルトは `.env.dev`                                                             |
| `appPackage/color.png`               | アプリのロゴ画像                                                                                 |
| `appPackage/outline.png`             | アプリのロゴアウトライン画像                                                                     |
| `appPackage/declarativeAgent.json`   | 宣言型エージェントの設定および構成                                                                |
| `appPackage/instruction.txt`         | 宣言型エージェントの動作を定義する指示                                                            |
| `appPackage/manifest.json`           | 宣言型エージェントのメタデータを定義する Teams アプリ マニフェスト                               |
| `m365agent.yml`                      | Agents Toolkit プロジェクト ファイル (プロパティおよび構成ステージを定義)                        |

本ラボで最も重要なのは **appPackage/instruction.txt** で、エージェントのコア指示を記述します。プレーン テキスト ファイルで、自然言語の instructions を記載できます。

もう 1 つ重要なのが **appPackage/declarativeAgent.json** です。Microsoft 365 Copilot を新規宣言型エージェントで拡張するためのスキーマを持ちます。主なプロパティは以下です。

- `$schema`: スキーマ リファレンス
- `version`: スキーマのバージョン
- `name`: 宣言型エージェントの名前
- `description`: 説明
- `instructions`: **instructions.txt** ファイルへのパス。指示を値として直接書くことも可能ですが、本ラボでは **instructions.txt** を使用します。

さらに `appPackage/manifest.json` には、パッケージ名、開発者名、アプリで利用するエージェントの参照などの重要なメタデータが含まれます。以下は manifest.json の抜粋です。

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

ブランドに合わせたい場合は `color.png` と `outline.png` のロゴファイルを変更できます。本ラボでは、エージェントのアイコンとして **color.png** を変更します。

<cc-end-step lab="e1a" exercise="1" step="4" />

## 演習 2: instructions とアイコンの更新

### 手順 1: アイコンとマニフェストの更新

まずロゴを置き換えます。こちらの画像 [link](../../assets/images/extend-m365-copilot-01/color.png){target=_blank} をコピーし、プロジェクト ルートの **appPackage** フォルダーに同名で上書きしてください。

次に、プロジェクト ルートの **appPackage/manifest.json** を開き、**copilotAgents** ノードを探します。declarativeAgents 配列の最初の要素の id 値を `declarativeAgent` から `dcGeolocator` に変更し、一意にします。

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

続いて **appPackage/instruction.txt** を開き、以下の内容で既存内容をすべて上書きします。

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

次の手順で、ユーザーがエージェントと対話しやすいように conversation starters を追加します。  

!!! tip "**appPackage** 内に独自ファイルを含める"
    **appPackage/declarativeAgent.json** にある次の行に注目してください:

    `"instructions": "$[file('instruction.txt')]",`

    これは **instruction.txt** の内容を取り込みます。**appPackage** フォルダー内の任意の JSON ファイルで同じ手法を用い、ファイルをモジュール化できます。

<cc-end-step lab="e1a" exercise="2" step="1" />

### 手順 2: Conversation starters の追加

Conversation starters を追加して宣言型エージェントのエンゲージメントを高めましょう。

Conversation starters のメリット:

- **エンゲージメント**: ユーザーの対話を促し、参加しやすくします。
- **コンテキスト設定**: 会話のトーンとトピックを提示し、進行をガイドします。
- **効率**: 明確なフォーカスを示すことで曖昧さを減らし、スムーズに会話を進めます。
- **ユーザー リテンション**: 良質なスターターはユーザーの興味を維持し、再度の利用を促します。

`declarativeAgent.json` を開き、`instructions` ノードの直後にカンマ `,` を追加し、以下コードを貼り付けます。

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

これでエージェントへの変更は完了です。次はテストします。

<cc-end-step lab="e1a" exercise="2" step="2" />

### 手順 3: アプリのテスト

`Visual Studio Code` の `Agents Toolkit` 拡張機能を開き、左ペインの "LIFECYCLE" から **Provision** を選択します。Agents Toolkit のおかげで公開がとても簡単です。

![Lifecycle グループで 'Provision' がハイライトされた Agents Toolkit UI。](../../assets/images/extend-m365-copilot-01/atk-provision.png)

この操作で Agents Toolkit は `appPackage` 内のファイルを zip にまとめ、宣言型エージェントをユーザー自身のアプリ カタログにインストールします。

開発者テナントで Microsoft 365 Copilot BizChat [https://microsoft365.com/copilot/](https://microsoft365.com/copilot/){target=_blank} を開きます。

Copilot が起動したら、右側パネルから "Geo Locator Game" を探します。

![Microsoft 365 Copilot の右側エージェント一覧で 'Geo Locator Game' がハイライト。](../../assets/images/extend-m365-copilot-01/launch-geo.png)

見当たらない場合は一覧が長い可能性があります。"see more" を選択して展開してください。

起動すると、エージェント専用のチャット ウィンドウが表示され、以下のように conversation starters が確認できます。

![エージェント選択後の Copilot UI。conversation starters がハイライト。](../../assets/images/extend-m365-copilot-01/launched-geo.png)

いずれかの conversation starter を選択すると、作成メッセージ ボックスに入力され、Enter を押すのを待ちます。アシスタントはユーザーの操作を待機します 🟢

ゲームのデモをご覧ください。

![ユーザーが都市を推測し、ポイントが表示される Geo Locator Game のデモ動画。](../../assets/images/extend-m365-copilot-01/demo.gif)

<cc-end-step lab="e1a" exercise="2" step="3" />

## 演習 3: 参照用ファイルの追加 (ボーナス演習)

同じゲームを繰り返すだけでは飽きてしまいます。ゲームを楽しく保つには、定期的に更新されるデータへのアクセスが必要です。エージェントに新しい能力を付与し、ゲームをリフレッシュして難易度を上げましょう。前述のとおり、宣言型エージェントには SharePoint サイトや OneDrive を参照する機能があります。それではエージェントが 2 つのファイルにアクセスできるようにします。

### 手順 1: SharePoint へファイルをアップロード

以下のリンクから 2 つの PDF ファイルを含む zip をダウンロードしてください。[link](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab01a-declarative-copilot/geo-locator-lab-sample/sharepoint-docs&filename=sharepoint-docs){target=_blank}

zip を展開し、同一テナントの SharePoint Teams サイトの **Documents** ドキュメント ライブラリにアップロードします。ファイルは **historical_map.pdf** と **travelers_diary** です。

サイトの絶対 URL をコピーします。例: `https://xyz.sharepoint.com/sites/contoso`

> [!NOTE]
> ファイルやフォルダーの完全パスは SharePoint の「Copy direct link」オプションで取得できます。対象を右クリックし、Details → Path → コピーアイコンを選択します。

次の手順に進みます。

<cc-end-step lab="e1a" exercise="3" step="1" />

### 手順 2: 宣言型エージェント マニフェストの更新

**.env.dev** 環境ファイルを開き、新しい変数 `SP_SITE_URL` を作成して SharePoint サイトの絶対 URL を値として設定します。

続いて **appPackage/declarativeAgent.json** を開き、`conversation_starters` 配列の後にカンマ `,` を追加し、以下のコードを貼り付けます。

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

これにより、宣言型エージェントはこの SharePoint サイトのドキュメントを参照してゲームを盛り上げられるようになります。URL は複数追加可能です 💪🏼

<cc-end-step lab="e1a" exercise="3" step="2" />

### 手順 3: アプリ マニフェストのアップグレード

**appPackage/manifest.json** を開き、`version` を `"1.0.0"` から `"1.0.1"` に更新して変更を反映させます。

<cc-end-step lab="e1a" exercise="3" step="3" />

### 手順 4: アプリのテスト

- `Visual Studio Code` の `Agents Toolkit` 拡張機能を開き、"LIFECYCLE" から **Provision** を選択してアップグレード版をパッケージ化・インストールします。
- 開発者テナントで Microsoft 365 Copilot BizChat [https://microsoft365.com/copilot/](https://microsoft365.com/copilot/){target=_blank} を開きます。
- 再度 "Geo Locator Game" を起動します。

![Copilot で 'Geo Locator Game' エージェントが選択された状態。conversation starters がハイライト。](../../assets/images/extend-m365-copilot-01/launched-geo.png)

今回は旅行日記に基づくチャレンジを試してみましょう。2 番目の conversation starter を選択します。

![旅行日記を参照して回答するエージェント。travelers_diary.pdf への参照が表示。](../../assets/images/extend-m365-copilot-01/traveller.gif)

あなたは宣言型エージェントのボスになりました。こちらの動画でさらに詳しく学べます。

 <div class="tinyVideo">
      <iframe src="//www.youtube.com/embed/QTP4PfXyyNk" frameborder="0" allowfullscreen></iframe>
      <div>Declarative agents の紹介</div>
    </div>

<cc-end-step lab="e1a" exercise="3" step="4" />

## 参考資料
- [Declarative agents](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-declarative-copilot){target=_blank}
- [Declarative agent manifest schema](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-manifest){target=_blank}
- [Supported content types](https://learn.microsoft.com/microsoftsearch/semantic-index-for-copilot#supported-content-types){target=_blank}
- [Capabilities of Declarative agents](https://learn.microsoft.com/microsoft-365-copilot/extensibility/declarative-agent-capabilities-ids?tabs=explorer){target=_blank}
- [Validation guidelines for Agents](https://learn.microsoft.com/microsoftteams/platform/concepts/deploy-and-publish/appsource/prepare/review-copilot-validation-guidelines){target=_blank}

---8<--- "ja/e-congratulations.md"

ゲーム エージェントの構築、お疲れさまでした 🎉! 次のラボでは REST API を作成し、それを使ってプラグインを構築し、別のエージェントで実際のビジネス シナリオを解決します。ワクワクする内容が待っています。**Next** を選択して次のラボへ進んでください。

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