---
search:
  exclude: true
---
# ラボ BTA1 - Teams AI ライブラリでの最初のカスタム エンジン エージェント

このラボでは、Visual Studio Code 用 M365 Agents Toolkit を使用してカスタム エンジン エージェントを構築します。さらに、Azure OpenAI モデルを活用し、最初のプロンプトを定義します。

このラボで行うこと:

- カスタム エンジン エージェントとは何かを学ぶ  
- Azure OpenAI サービスとデプロイ モデルを作成する  
- M365 Agents Toolkit でカスタム エンジン エージェントを作成する  
- カスタム エンジン エージェントにプロンプトを定義する  
- アプリの実行とテスト方法を学ぶ  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Onk04pehtjE" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く確認しましょう。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## はじめに

カスタム エンジン エージェントを構築するエキサイティングな旅へようこそ! このコースでは、最先端の Azure OpenAI モデルを使用して Microsoft Teams 用のカスタム エンジン エージェントを作成します。特定のプロンプトを定義し、複雑なデータを統合し、高度なスキルを追加して、真にユニークなエージェントを実現できます。カスタム モデルとオーケストレーションを利用することで、エージェントは高度なタスク、複雑な会話、ワークフローをこなし、卓越したパーソナライズされた体験を提供します。さあ、最初のカスタム エンジン エージェントの構築を始めましょう!

???+ info "まずは思い出しましょう… カスタム エンジン エージェントとは?"
    カスタム エンジン エージェントは、Generative AI によって強化されたチャットボットで、洗練された会話体験を提供するよう設計されています。Teams AI ライブラリを用いて構築されており、プロンプト、アクション、モデル統合の管理を含む総合的な AI 機能と、豊富な UI カスタマイズ オプションを提供します。これにより、Microsoft プラットフォームに合わせたシームレスで魅力的な体験を実現しつつ、AI の機能を最大限活用できます。

## 演習 1: Azure OpenAI サービスとモデルの作成

この演習では、特に Azure OpenAI の GPT モデルをカスタム エンジン エージェントで作成・利用する方法を示します。ただし、カスタム エンジン エージェントは GPT モデルに限定されません。お好みのモデルでラボを試すことも可能です。

??? check "小規模言語モデルと大規模言語モデルの選択"
    Small Language Models (SLM) と Large Language Models (LLM)、およびさまざまな GPT モデルを選択する際には、プロジェクトの複雑さ、計算リソース、効率性などを考慮することが重要です。

    - **LLM:** 深い理解力が必要な複雑で微妙なタスクに最適です。数十億のパラメーターを持ち、人間の言語を理解・生成することに優れています。GPT-4、LLaMA 2、BERT、PaLM などが例です。  
      ***想定シナリオ:** 複雑な顧客問い合わせへの対応、詳細で文脈を意識した回答、短いプロンプトからの高品質な記事生成、大量の学術論文の要約、重要な洞察の抽出、詳細な質問への回答。*

    - **SLM:** スピードと効率が重要でリソースが限られている短時間のタスクに適しています。パラメーターが少なく、特定タスク向けに最適化されています。Phi-3 (Microsoft)、ALBERT (Google)、DistilBERT (HuggingFace) などが例です。  
      ***想定シナリオ:** クラウド リソースなしで効率的にテキスト分析を行う、最小限の遅延で正確かつ応答性の高い音声コマンドを実現、自然言語によるスマートホームの自動化と制御。*
    
    OpenAI の GPT モデルは LLM の代表例です。モデル選択時には、次の利点を検討してください。
    
    - **gpt-4:** 最も高度なモデルで、広範な理解力と生成能力を要する高度なタスクに適しています。

    - **gpt-4o:** 特定タスク向けに最適化されており、その領域でより高速かつ効率的に動作します。

    - **gpt-35-turbo:** コストを抑えつつ良好なパフォーマンスを提供し、幅広い用途に最適です。

開始する前に [Azure サブスクリプションの前提条件](./00-prerequisites.md#exercise-3-get-an-azure-subscription){target=_blank} を完了してください。

### 手順 1: Azure OpenAI サービス リソースの作成

???+ info "後続の手順で作成するモデルが選択したリージョンで利用可能かを確認してください"
    [モデルの概要表とリージョンの対応状況](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models?tabs=python-secure%2Cglobal-standard%2Cstandard-chat-completions#model-summary-table-and-region-availability){target=_blank} を確認し、`gpt-4` など使用したいモデルが **Standard** または **Global Standard** タイプとして希望リージョンで利用可能かを確認してください。

1. 任意のブラウザーで [Azure Portal](https://portal.azure.com) を開きます。  
1. **リソースの作成** を選択し、`Azure OpenAI` を検索して選択し、**作成** をクリックします。  
1. 次の情報を入力し **次へ** をクリックします:  
    - **Subscription:** Azure OpenAI サービス用の Azure サブスクリプション  
    - **Resource group:** Azure OpenAI リソースを格納する Azure リソース グループ (新規作成または既存グループを使用)  
    - **Region:** インスタンスの場所 (デプロイ モデルが利用可能なリージョンを選択)  
    - **Name:** 例 `MyOpenAIResource` など、わかりやすい名前  
    - **Pricing Tier:** 現在 `Standard` のみ  
1. ネットワーク構成を選択し **次へ** をクリックします。  
1. Tags は既定のまま **次へ** をクリックします。  
1. 内容を確認し **作成** をクリックします。  

Azure OpenAI サービスが作成されたら、リソースに移動し、左ペインの **Keys and Endpoint** を選択します。`KEY 1` と `Endpoint` をコピーして保存してください。これらは演習 2 で使用します。

<cc-end-step lab="bta1" exercise="1" step="1" />

### 手順 2: デプロイ モデルの作成

Azure OpenAI サービスで `Microsoft Foundry` に移動し、デプロイ モデルを作成します。

??? check "Microsoft Foundry とは?"
    Microsoft Foundry は、`gpt-35-turbo`、`gpt-4`、`Dall-e` などの OpenAI モデルを試しながら、ユースケースに合わせたプロンプトを作成・微調整できるプレイグラウンドです。`Phi-3`、`Llama 3.1` など OpenAI 以外のモデルも扱え、Speech や Vision など他の Azure AI サービスへの入口にもなります。

    *Generative AI とプロンプティングについては、この Doodle to Code ビデオで学びましょう!*  
    
    <iframe src="//www.youtube.com/embed/PGI6oxbcYDc?si=02JzvwHpnOx3rsSD" frameborder="0" allowfullscreen></iframe>

Microsoft Foundry で **Deployments** タブを選択し **Deploy model** > **Deploy base model** をクリックします。`gpt-4` など使用したいモデルを検索し **Confirm** をクリックします。次の項目を入力し **Deploy** を選択します:

- **Deployment name:** モデル名と同じにすることを推奨 (例 `gpt-4`)  
- **Select a model:** `gpt-4` を推奨  
- **Deployment type:** Global Standard  

!!! tip "ヒント: 「No quota available」と表示された場合"
    モデル選択時に **No quota available** と表示された場合は次の 2 つの選択肢があります。  
    1. 別バージョンまたは別のデプロイ タイプを選択する  
    2. [クォータを増やすか既存のクォータを調整](https://oai.azure.com/portal/96d4a6668daf4335bc1273c1bb46cb4f/quota){target=_blank} してリソースを確保する  

モデルが作成されたら **Open in playground** をクリックし、上部の **Prompt samples** を選択して任意のプロンプトを試します。

例として "Shakespearean Writing Assistant" を選び **Use prompt** をクリックし、「tell me about Istanbul」などと質問してみましょう。詩的で描写豊かな回答に驚くはずです ✍️。

![The UI of Microsoft Foundry while testing a model in the Chat Playground. There are setup settings on the left and a chat on the right where the 'tell me about Istanbul' prompt gets a long and detailed answer.](../../../assets/images/custom-engine-01/azure-openai-studio-chat.png)

<cc-end-step lab="bta1" exercise="1" step="2" />

## 演習 2: テンプレートからカスタム エンジン エージェントをスキャフォールディング

開始前にすべての [必須前提条件](./00-prerequisites.md){target=_blank} を完了してください。

### 手順 1: M365 Agents Toolkit で新しいカスタム エンジン エージェントを作成する

1. Visual Studio Code で M365 Agents Toolkit を開き、**Create a New App** > **Custom Engine Agent** > **Basic AI Chatbot** を選択します。  
1. プログラミング言語に **TypeScript**、Large Language Model に **Azure OpenAI** を選択します。  
    1. Azure OpenAI のキーを貼り付けて Enter キーを押します。  
    1. Azure OpenAI のエンドポイントを貼り付けて Enter キーを押します (URL の末尾にスラッシュを含めないでください)。  
    1. Azure OpenAI のデプロイ モデル名を入力して Enter キーを押します。  
1. プロジェクト ルート用のフォルダーを選択します。  
1. プロジェクト名に `CareerGenie` などを入力し Enter キーを押します。  

上記の情報を入力すると、数秒でプロジェクトがスキャフォールディングされます。

<cc-end-step lab="bta1" exercise="2" step="1" />

### 手順 2: プロンプトをカスタマイズしてアプリをテストする

プロンプトは AI 言語モデルと対話し、その動作を指示するために不可欠です。適切にプロンプトを作成することで、AI に望ましい出力を生成させることができます。Career Genie の動作を定義するため、プロンプトをカスタマイズしてみましょう。

プロジェクト フォルダーで `src/prompts/chat/skprompt.txt` に移動し、既存のテキストを次のプロンプトで置き換えます。

```html
You are a career specialist named "Career Genie" that helps Human Resources team for writing job posts.
You are friendly and professional.
You always greet users with excitement and introduce yourself first.
You like using emojis where appropriate.
```

素早く動作を確認するには、Teams App Test Tool を使用できます。後ほどの手順では、Microsoft Teams 上でカスタム エンジン エージェントを実行・デバッグします。

??? check "Teams App Test Tool について"
    Teams App Test Tool (Test Tool) は、M365 Agents Toolkit に含まれる機能で、Microsoft Teams の動作・外観を模した Web ベースのチャット環境で Teams ボット アプリをデバッグ、テスト、改良できます。Microsoft 365 テナントや dev トンネルが不要なため、開発プロセスが簡素化されます。

Visual Studio Code の **Run and Debug** タブを開き、**Debug in Test Tool** を選択してデバッグを開始します。ブラウザーに Teams App Test Tool が開き、すぐにカスタム エンジン エージェントと会話できます。以下の質問例で動作を試してみてください:

- 「Senior Developer の求人票作成を手伝ってくれますか?」  
- 「Project Manager 役職に必要なスキル一覧を教えてください。」  
- 「求人テンプレートを共有してください。」  

![Test Career Genie in App Test Tool. There is a UI looking almost like the real Microsoft Teams one, with a chat area that allows to interact with the custom engine agent. On the right side there is a log panel with detailed logs about the interactions between the user and the bot.](../../../assets/images/custom-engine-01/teams-app-test-tool.png)

??? info "M365 Agents Toolkit が裏側で行う処理"
    デバッグ開始時、M365 Agents Toolkit は次のような必須タスクを自動で実行します。  

    - Node.js、Microsoft 365 アカウント (ローカルまたは dev でデバッグする場合)、ポート占有状況などの前提条件をチェック  
    - ローカル デバッグ時にトンネリング サービスを開始し、パブリック URL をローカル ポートへ転送  
    - `teamsapp.yml`、`teamsapp.local.user`、`teamsapp.testtool.user` に定義されたプロビジョン ライフサイクルを実行し、Teams App ID の作成、ボット登録、アプリ マニフェストの適用、`appPackage/` フォルダー内のアプリ パッケージ作成を実施  
    - `env/` フォルダー内の env ファイルに変数を作成または更新  

テストが完了したら、デバッグ セッションを終了し、Visual Studio Code のターミナルを閉じてください。

<cc-end-step lab="bta1" exercise="2" step="2" />

---8<--- "ja/b-congratulations.md"

Lab BTA1 - First custom engine agent を完了しました。Azure OpenAI と M365 Agents Toolkit を使用してカスタム エンジン エージェントを構築できましたね! さらに深掘りしたい場合は、このラボのソース コードが [Copilot Developer Camp リポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab01-From-TTK-template/CareerGenie){target=_blank} にあります。

次は Lab BTA2 - Azure AI Search でデータをインデックス化し、カスタム エンジン エージェントに取り込む方法を学びましょう。[Next] を選択してください。

<cc-next url="../02-rag" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/01-custom-engine-agent--ja" />