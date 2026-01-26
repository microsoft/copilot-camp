---
search:
  exclude: true
---
# ラボ E1 - Geo Locator ゲーム エージェントのインストラクション

本ラボでは、インストラクションとファイル経由で提供される補助知識を使用して、基本的な宣言型エージェントを作成します。  
このエージェントは、仕事の合間に世界中の都市を楽しく学べるように設計されています。抽象的な手掛かりを提示し、利用した手掛かりが少ないほど高得点を獲得できます。ゲーム終了時には最終スコアが表示されます。

このラボで学習する内容:

- Agents Toolkit テンプレートを使用して宣言型エージェントを作成する  
- インストラクションをカスタマイズして Geo Locator ゲームを構築する  
- アプリの実行とテスト方法を学ぶ  
- ボーナス演習として、SharePoint Teams サイトを使用する  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/VDhRFMH3Qbs" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を短時間で確認できます。</div>
        </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

## はじめに

宣言型エージェントは Microsoft 365 Copilot と同じスケーラブルなインフラとプラットフォームを活用し、特定領域に特化したニーズに対応します。  
標準の Microsoft 365 Copilot チャットと同じインターフェースで利用でき、特定タスクのみに集中させることが可能です。

このラボでは、まず Agents Toolkit の既定テンプレートを使って宣言型エージェントを構築します。その後、エージェントを Geo Locator ゲームに特化させます。

AI の目的は、仕事の合間に楽しい休憩を提供しながら世界各地の都市について学習できるよう支援することです。抽象的な手掛かりから都市を当てると、使用した手掛かりが少ないほど多くのポイントを獲得できます。ゲーム終了時に最終スコアが公開されます。

![Geo Locator ゲームの初期 UI とユーザーの数回の推測](../../assets/images/extend-m365-copilot-01/game.png)

ボーナスとして、エージェントに秘密の日記 🕵🏽 と地図 🗺️ を参照させ、プレイヤーへのチャレンジを増やします。  

それでは始めましょう 💪🏼

## 演習 1: テンプレートから宣言型エージェントをスキャフォールディングする
宣言型エージェントのファイル構成を理解していれば任意のエディターでも作成できますが、Agents Toolkit を使うとファイル生成からデプロイ・公開まで簡単に行えます。  
ここでは Agents Toolkit を使用し、できる限りシンプルに進めます。

### 手順 1: Agents Toolkit をインストールする

- Visual Studio Code の拡張機能タブを開き、 **Microsoft 365 Agents Toolkit** を検索します。  
- 選択してインストールします。

<cc-end-step lab="e1a" exercise="1" step="1" />

### 手順 2: Agents Toolkit で宣言型エージェント アプリを作成する

Visual Studio Code 左側の Agents Toolkit 拡張機能 1️⃣ を開き、 **Create a New Agent/App** 2️⃣ を選択します。

![Agents Toolkit の UI。新規アプリ作成で 'Create a New Agent' ボタンが強調表示](../../assets/images/extend-m365-copilot-01/atk-create-new-agent.png)

パネルが開くので、プロジェクト タイプの一覧から **Declarative Agent** を選択します。

![Agents Toolkit で利用可能なプロジェクト タイプ。'Agent' が強調表示](../../assets/images/extend-m365-copilot-01/atk-da.png)

次に、基本的な宣言型エージェントを作成するか、API プラグイン付きにするか尋ねられます。 **No Action** を選択します。

![Declarative Agent タイプ選択で 'No plugin' が選択されている](../../assets/images/extend-m365-copilot-01/atk-no-action.png)

!!! tip "ここでアクション付きにしない理由"
     次のラボで REST API を構築し、その API を宣言型エージェントにアクションとして統合する方法を学びます。今回は宣言型エージェントのみを作成します。少しずつ進めましょう！

続いて、プロジェクト フォルダーを作成するディレクトリを入力します。

![新規アプリ保存先パスの入力プロンプト](../../assets/images/extend-m365-copilot-01/atk-folder.png)

アプリケーション名として `Geo Locator Game` と入力し、Enter を押します。 

![アプリ名入力プロンプト](../../assets/images/extend-m365-copilot-01/atk-app-name.png)

数秒で指定フォルダーにプロジェクトが生成され、新しい Visual Studio Code ウィンドウで開きます。これが作業用フォルダーです。

![新規アプリがスキャフォールディングされ README が表示された VS Code](../../assets/images/extend-m365-copilot-01/atk-scaffold.png)

お疲れさまです！ 基本の宣言型エージェントが準備できました。次に、Geo Locator ゲーム用にカスタマイズするためファイルを確認しましょう。

<cc-end-step lab="e1a" exercise="1" step="2" />

### 手順 3: Agents Toolkit でアカウントを設定する
左側の Agents Toolkit アイコン 1️⃣ を選択し、"Accounts" セクションで "Sign in to Microsoft 365" 2️⃣ をクリックして、ご自身の Microsoft 365 アカウントでサインインします。

![Microsoft 365 テナントへのサインインを行う Agents Toolkit UI](../../assets/images/extend-m365-copilot-01/atk-accounts.png)

ブラウザーが開きサインインを促します。"You are signed in now and close this page" と表示されたらページを閉じます。

"Custom App Upload Enabled" に緑のチェックが付いていることを確認します。付いていない場合、ユーザーに Teams アプリをアップロードする権限がありません。ラボの演習 1 の手順を参照してください。

"Copilot Access Enabled" も緑のチェックが必要です。付いていない場合は Copilot ライセンスがありません。ラボを続行するには必須です。

![サインイン後、チェックマークが緑になった Agents Toolkit UI](../../assets/images/extend-m365-copilot-01/atk-accounts-logged.png)

それではコード ツアーを行いましょう。

<cc-end-step lab="e1a" exercise="1" step="3" />

### 手順 4: アプリ内ファイルの理解

基本プロジェクトの構成は次のとおりです:

| フォルダー / ファイル | 内容 |
| -------------------- | ----------------------------------------------------------------------------- |
| `.vscode` | デバッグ用 VS Code 設定 |
| `appPackage` | Teams アプリ マニフェスト、エージェント マニフェスト、API 仕様（存在する場合）のテンプレート |
| `env` | 環境ファイル。既定の `.env.dev` を含む |
| `appPackage/color.png` | アプリ ロゴ画像 |
| `appPackage/outline.png` | ロゴのアウトライン画像 |
| `appPackage/declarativeAgent.json` | 宣言型エージェントの設定と構成 |
| `appPackage/instruction.txt` | 宣言型エージェントの動作を定義する指示 |
| `appPackage/manifest.json` | Teams アプリ マニフェスト (宣言型エージェントのメタデータ) |
| `m365agent.yml` | Agents Toolkit プロジェクトファイル。プロパティと Stage 定義を保持 |

本ラボで特に重要なのは **appPackage/instruction.txt** です。エージェントの中心となる指示を自然言語で記述できます。  

もう一つ重要なのが **appPackage/declarativeAgent.json** で、宣言型エージェントを拡張するスキーマが定義されています。主なプロパティを見てみましょう。

- `$schema` : スキーマ参照  
- `version` : スキーマ バージョン  
- `name` : 宣言型エージェントの名前  
- `description` : 説明  
- `instructions` : **instructions.txt** へのパス。ここに指示を外部ファイルとして参照できます。もちろん文字列として直接記載しても構いませんが、本ラボでは **instruction.txt** を使います。

さらに **appPackage/manifest.json** には、パッケージ名、開発者名、アプリが利用するエージェント参照など重要なメタデータが含まれます。以下は manifest.json の抜粋です:

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

必要に応じてロゴ ファイル `color.png` と `outline.png` をブランドに合わせて変更できます。本ラボではエージェントを目立たせるため **color.png** を変更します。 

<cc-end-step lab="e1a" exercise="1" step="4" />

## 演習 2: インストラクションとアイコンを更新する

### 手順 1: アイコンとマニフェストを更新する

まずロゴを差し替えます。[こちら](../../assets/images/extend-m365-copilot-01/color.png){target=_blank} の画像をコピーし、プロジェクト ルートの **appPackage** フォルダーにある同名ファイルと置き換えます。

次に **appPackage/manifest.json** を開き、 **copilotAgents** ノード内の declarativeAgents 配列 1 件目の `id` を `declarativeAgent` から `dcGeolocator` に変更してユニークにします。

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

続いて **appPackage/instruction.txt** を開き、下記インストラクションで内容を上書きしてください。

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

次の手順では、ユーザーがエージェントと対話しやすくするため会話スターターを追加します。  

!!! tip "独自ファイルを **appPackage** に含める"
    **appPackage/declarativeAgent.json** のこの行に注目してください。

    `"instructions": "$[file('instruction.txt')]",`

    これは **instruction.txt** の内容を読み込んでいます。複数ファイルに分割したい場合、**appPackage** 内の任意の JSON で同様に参照できます。

<cc-end-step lab="e1a" exercise="2" step="1" />

### 手順 2: 会話スターターを追加する

宣言型エージェントに会話スターターを追加すると、ユーザー エンゲージメントを高められます。  

主なメリット:

- **エンゲージメント**: 対話のきっかけを作り、ユーザーが気軽に利用できます。  
- **コンテキスト設定**: 会話のトーンやトピックを示し、進行をガイドします。  
- **効率性**: 焦点を明確にすることで曖昧さを減らし、スムーズに会話が進みます。  
- **ユーザー維持**: 良いスターターは興味を惹きつけ、再利用を促します。  

`declarativeAgent.json` を開き、`instructions` ノードの後ろにカンマ `,` を追加し、下記コードを貼り付けます。

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

これでエージェントへの変更は完了です。テストに進みましょう。

<cc-end-step lab="e1a" exercise="2" step="2" />

### 手順 3: アプリをテストする

アプリをテストするには、`Visual Studio Code` の `Agents Toolkit` 拡張機能を開き、左ペインの "LIFECYCLE" から "Provision" を選択します。Agents Toolkit がファイルをパッケージ化し、アプリカタログにインストールします。

![Agents Toolkit の 'Lifecycle' で 'Provision' が強調表示](../../assets/images/extend-m365-copilot-01/atk-provision.png)

Microsoft 365 Copilot BizChat [https://microsoft365.com/copilot/](https://microsoft365.com/copilot/){target=_blank} に開発者テナントでログインし、右側のリストから "Geo Locator Game" を探します。

![Microsoft 365 Copilot の右パネルで 'Geo Locator Game' エージェントが強調表示](../../assets/images/extend-m365-copilot-01/launch-geo.png)

見当たらない場合は "see more" でリストを展開してください。

エージェントを起動すると専用チャット ウィンドウが開き、会話スターターが表示されます。

![Geo Locator Game 起動時の会話スターター](../../assets/images/extend-m365-copilot-01/launched-geo.png)

スターターを選択すると入力ボックスに反映され、Enter を押すのを待ちます 🟢

ゲームのデモをご覧ください。

![Geo Locator Game のデモ](../../assets/images/extend-m365-copilot-01/demo.gif)

<cc-end-step lab="e1a" exercise="2" step="3" />

## 演習 3: 参照用ファイルを追加する (ボーナス)

同じゲームを繰り返すだけでは飽きてしまいます。継続的に更新されるデータにアクセスできれば、楽しさとチャレンジが向上します。宣言型エージェントの機能の一つである SharePoint / OneDrive 参照を活用し、エージェントにファイル参照能力を追加しましょう。

### 手順 1: SharePoint にファイルをアップロードする

2 つの PDF を含む zip を [こちら](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab01a-declarative-copilot/geo-locator-lab-sample/sharepoint-docs&filename=sharepoint-docs){target=_blank} からダウンロードします。

zip を解凍し、同じテナント内の SharePoint Teams サイトの **Documents** ライブラリに **historical_map.pdf** と **travelers_diary.pdf** をアップロードします。

サイトの絶対 URL をコピーします (例: `https://xyz.sharepoint.com/sites/contoso`)。

> [!NOTE]
> ファイルまたはフォルダーのフルパスを取得するには、SharePoint で "Copy direct link" を使用します。対象を右クリックし Details → Path → コピーアイコンを選択してください。

準備ができたら次の手順へ進みます。

<cc-end-step lab="e1a" exercise="3" step="1" />

### 手順 2: 宣言型エージェント マニフェストを更新する

**.env.dev** を開き、`SP_SITE_URL` という変数を追加し、先ほどコピーした SharePoint サイト URL を値として設定します。

次に **appPackage/declarativeAgent.json** を開き、`conversation_starters` 配列の後ろにカンマ `,` を追加し、SharePoint サイトを参照するための以下の配列オブジェクトを貼り付けます。

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
これでエージェントは指定 SharePoint サイトのドキュメントを読み取り、ゲームをさらに盛り上げられるようになりました。  
URL は制限なく追加できます 💪🏼

<cc-end-step lab="e1a" exercise="3" step="2" />

### 手順 3: アプリ マニフェストをアップグレードする

**appPackage/manifest.json** を開き、`version` を `"1.0.0"` から `"1.0.1"` に変更してアップグレードを反映させます。

<cc-end-step lab="e1a" exercise="3" step="3" />

### 手順 4: アプリをテストする

- `Visual Studio Code` の `Agents Toolkit` で "LIFECYCLE" → "Provision" を実行し、更新された宣言型エージェントをパッケージ化・インストールします。  
- Microsoft 365 Copilot BizChat [https://microsoft365.com/copilot/](https://microsoft365.com/copilot/){target=_blank} にログインします。  
- 再び "Geo Locator Game" を起動します。

![Geo Locator Game の起動画面](../../assets/images/extend-m365-copilot-01/launched-geo.png)

今回は旅行日記に基づくチャレンジを試してみましょう。2 番目の会話スターターを選択します。

![travelers_diary.pdf を参照している Geo Locator Game](../../assets/images/extend-m365-copilot-01/traveller.gif)

これであなたは宣言型エージェントのボスです。さらに詳しくは次の動画をご覧ください。

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

ゲーム エージェントの構築、お疲れさまでした 🎉 ！次のラボでは REST API を作成し、それを使ったプラグインの構築と、別のエージェントでビジネス シナリオを解決する方法を学びます。ワクワクする内容が待っています。 **Next** を選択して次のラボへ進みましょう。

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