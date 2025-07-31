---
search:
  exclude: true
---
# Lab BTA1 - 最初のカスタムエンジン エージェント (Teams AI library)

このラボでは、Visual Studio Code 用 M365 Agents Toolkit を使用してカスタムエンジン エージェントを構築します。さらに、Azure OpenAI モデルをカスタムエンジン エージェントで利用し、最初のプロンプトを定義します。

このラボで行うこと:

- カスタムエンジン エージェントとは何かを学習
- Azure OpenAI サービスとデプロイメントモデルを作成
- M365 Agents Toolkit を使用してカスタムエンジン エージェントを作成
- カスタムエンジン エージェントでプロンプトを定義
- アプリの実行方法とテスト方法を学習

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Onk04pehtjE" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を素早く確認しましょう。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## 概要

カスタムエンジン エージェントを構築するエキサイティングな旅へようこそ！このコースでは、最先端の Azure OpenAI モデルを使用して Microsoft Teams 用のカスタムエンジン エージェントを作成します。特定のプロンプトを定義し、複雑なデータを統合し、高度なスキルを追加して、真にユニークなエージェントを実現できます。カスタムモデルとオーケストレーションを活用することで、エージェントは高度なタスク、複雑な会話、ワークフローを処理し、卓越したパーソナライズド体験を提供します。それでは、さっそく最初のカスタムエンジン エージェントを構築していきましょう！

???+ info "その前に… カスタムエンジン エージェントとは？"
    カスタムエンジン エージェントは、Generative AI を搭載したチャットボットで、洗練された会話体験を提供します。Teams AI library を使用して構築され、プロンプト、アクション、モデル統合の管理に加え、UI カスタマイズの幅広いオプションを提供します。これにより、Microsoft プラットフォームと連携しつつ、AI のフル機能を活用したシームレスで魅力的な体験を実現できます。

## 演習 1: Azure OpenAI サービスとモデルの作成

この演習では、特に Azure OpenAI の GPT モデルをカスタムエンジン エージェントで作成および活用する方法を示します。ただし、カスタムエンジン エージェントは GPT モデルに限定されません。ご希望のモデルで試すことも可能です。

??? check "Small Language Model と Large Language Model の選択"
    Small Language Model (SLM) と Large Language Model (LLM)、さらにさまざまな GPT モデルを選択する際は、プロジェクトの複雑さ、計算リソース、効率性などを考慮することが重要です。

    - **LLM:** 複雑でニュアンスを要するタスクに最適。数十億のパラメーターを持ち、人間の言語理解と生成に優れます。GPT-4、LLaMA 2、BERT、PaLM などが例です。  
      ***例:** 複雑な顧客問い合わせへの対応、詳細で文脈を考慮した回答、高品質な記事生成、大量の論文要約、重要インサイト抽出など。*

    - **SLM:** スピードと効率が求められるリソース制限下での迅速なタスクに適しています。パラメーター数が少なく、特定タスクに最適化。Phi-3 (Microsoft)、ALBERT (Google)、DistilBERT (HuggingFace) などが例です。  
      ***例:** クラウドリソース不要のテキスト分析、低レイテンシで応答する音声コマンド、スマートホーム自動化など。*
    
    OpenAI の GPT モデルは LLM の代表例です。OpenAI モデル選択時の主なポイントは次のとおりです。
    
    - **gpt-4:** 最も高度なモデルで、深い理解と生成能力が必要な複雑タスクに最適。
    - **gpt-4o:** 特定タスク向けに最適化され、より高速・効率的。
    - **gpt-35-turbo:** コストを抑えつつ優れた性能を提供し、幅広い用途に適合。

開始する前に [Azure サブスクリプションの前提条件](./00-prerequisites.md#exercise-3-get-an-azure-subscription){target=_blank} を完了してください。

### 手順 1: Azure OpenAI サービス リソースの作成

???+ info "使用したいモデルが選択したリージョンで利用可能か確認しましょう"
    Azure OpenAI サービスを作成する前に、[Model summary table and region availability](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models?tabs=python-secure%2Cglobal-standard%2Cstandard-chat-completions#model-summary-table-and-region-availability){target=_blank} を確認し、使用したい `gpt-4` などのモデルが **Standard** または **Global Standard** タイプでそのリージョンに存在することを確認してください。

1. 任意のブラウザーで [Azure Portal](https://portal.azure.com) を開きます。  
1. **Create a resource** を選択し、`Azure OpenAI` を検索して選択後、**Create** をクリックします。  
1. 以下を入力して **Next** をクリックします。  
    - **Subscription:** 本サービスを配置する Azure サブスクリプション  
    - **Resource group:** リソースを格納するリソース グループ (新規または既存)  
    - **Region:** インスタンスを配置するリージョン (モデルが利用可能なリージョン)  
    - **Name:** `MyOpenAIResource` などわかりやすい名前  
    - **Pricing Tier:** 現時点では `Standard` のみ  
1. 任意のネットワーク構成を選択し **Next**。  
1. Tags はデフォルトのまま **Next**。  
1. 入力内容を確認し **Create** をクリックします。  

作成が完了したらリソースに移動し、左ペインの **Keys and Endpoint** を開きます。後の演習 2 で使用する `KEY 1` と `Endpoint` をコピーして保存してください。

<cc-end-step lab="bta1" exercise="1" step="1" />

### 手順 2: デプロイメントモデルの作成

Azure OpenAI サービスで `Azure AI Foundry` に移動し、デプロイメントモデルを作成します。

??? check "Azure AI Foundry とは？"
    Azure AI Foundry は、`gpt-35-turbo`、`gpt-4`、`Dall-e` などの OpenAI モデルを試すためのプレイグラウンドです。ユースケースに合わせたプロンプト作成やモデルのファインチューニングが行えます。また、`Phi-3`、`Llama 3.1` など OpenAI 以外のモデルや、Speech・Vision など他の Azure AI サービスの出発点としても利用できます。

    *Generative AI とプロンプティングについては、この Doodle to Code 動画を視聴してください！*
    
    <iframe src="//www.youtube.com/embed/PGI6oxbcYDc?si=02JzvwHpnOx3rsSD" frameborder="0" allowfullscreen></iframe>

Azure AI Foundry で **Deployments** タブ → **Deploy model** → **Deploy base model** を選択し、`gpt-4` など使用したいモデルを検索して **Confirm**。以下を入力し **Deploy** します:

- **Deployment name:** `gpt-4` などモデル名と同じ名前を推奨  
- **Select a model:** `gpt-4` を推奨  
- **Deployment type:** Global Standard  

!!! tip "ヒント: No quota available メッセージの対処"
    モデル選択時に **No quota available** が表示された場合は次のいずれかを実行してください。  
    1. 別バージョンまたはデプロイメントタイプを選択  
    2. [クォータを追加申請または調整](https://oai.azure.com/portal/96d4a6668daf4335bc1273c1bb46cb4f/quota){target=_blank}

モデルが作成されたら **Open in playground** をクリックし、**Prompt samples** から例を選択してテストします。

例として "Shakespearean Writing Assistant" を選び **Use prompt** し、「tell me about Istanbul」など質問してみましょう。詩的で描写豊かな回答に驚くことでしょう ✍️。

![The UI of Azure AI Foundry while testing a model in the Chat Playground. There are setup settings on the left and a chat on the right where the 'tell me about Istanbul' prompt gets a long and detailed answer.](../../../assets/images/custom-engine-01/azure-openai-studio-chat.png)

<cc-end-step lab="bta1" exercise="1" step="2" />

## 演習 2: テンプレートからカスタムエンジン エージェントをスキャフォールディング

開始前に [必須前提条件](./00-prerequisites.md){target=_blank} をすべて完了してください。

### 手順 1: M365 Agents Toolkit で新しいカスタムエンジン エージェントを作成

1. Visual Studio Code で M365 Agents Toolkit を開き、**Create a New App** → **Custom Engine Agent** → **Basic AI Chatbot** を選択します。  
1. **TypeScript** を選択し、Large Language Model として **Azure OpenAI** を選びます。  
    1. Azure OpenAI キーを貼り付け Enter。  
    1. Azure OpenAI エンドポイントを貼り付け Enter (末尾にスラッシュを含めない)。  
    1. Azure OpenAI デプロイメントモデル名を入力し Enter。  
1. プロジェクトのルートフォルダーを選択。  
1. プロジェクト名に `CareerGenie` などを入力し Enter。  

これで数秒でプロジェクトがスキャフォールディングされます。

<cc-end-step lab="bta1" exercise="2" step="1" />

### 手順 2: プロンプトをカスタマイズしてアプリをテスト

プロンプトは AI 言語モデルと対話し、その挙動を指示するために不可欠です。適切なプロンプトを作成することで、AI が望ましい出力を生成するよう導けます。ここでは Career Genie の挙動を定義するため、プロンプトをカスタマイズします。

プロジェクトフォルダーで `src/prompts/chat/skprompt.txt` を開き、既存のテキストを次のプロンプトに置き換えます。

```html
You are a career specialist named "Career Genie" that helps Human Resources team for writing job posts.
You are friendly and professional.
You always greet users with excitement and introduce yourself first.
You like using emojis where appropriate.
```

アプリの挙動をすばやく確認するには、Teams App Test Tool を使用できます。後ほど演習内で、Microsoft Teams 上でカスタムエンジン エージェントを実行・デバッグします。

??? check "Teams App Test Tool とは"
    Teams App Test Tool (Test Tool) は、M365 Agents Toolkit に含まれる機能で、Microsoft Teams の外観と操作感を模した Web ベースのチャット環境で Teams ボットアプリをデバッグ・テスト・改良できます。Microsoft 365 テナントや Dev トンネルが不要なため、開発プロセスが簡素化されます。

Visual Studio Code の **Run and Debug** タブで **Debug in Test Tool** を選択してデバッグを開始します。Teams App Test Tool がブラウザーで開き、すぐにカスタムエンジン エージェントと会話を始められます。以下の質問例で挙動を確認しましょう。

- "Can you help me write a job post for a Senior Developer role?"  
- "What would be the list of required skills for a Project Manager role?"  
- "Can you share a job template?"  

![Test Career Genie in App Test Tool. There is a UI looking almost like the real Microsoft Teams one, with a chat area that allows to interact with the custom engine agent. On the right side there is a log panel with detailed logs about the interactions between the user and the bot.](../../../assets/images/custom-engine-01/teams-app-test-tool.png)

??? info "M365 Agents Toolkit が裏で行っていること"
    デバッグ開始時、M365 Agents Toolkit は以下を自動で実施します。  
    - Node.js や Microsoft 365 アカウント (ローカル/Dev デバッグ時)、ポート占有などの前提条件チェック  
    - ローカルデバッグ時のパブリック URL 転送用トンネルサービス起動  
    - `teamsapp.yml`、`teamsapp.local.user`、`teamsapp.testtool.user` に定義されたライフサイクルステージ *provision* の実行 (Teams App ID の作成、ボット登録、アプリ マニフェストの適用、`appPackage/` へのパッケージ作成など)  
    - `env/` フォルダーの env ファイルへの変数作成・更新  

テストが完了したら、デバッグセッションを終了し、Visual Studio Code のターミナルを閉じます。

<cc-end-step lab="bta1" exercise="2" step="2" />

---8<--- "ja/b-congratulations.md"

あなたは Lab BTA1 - 最初のカスタムエンジン エージェント を完了しました。Azure OpenAI と M365 Agents Toolkit を使用してカスタムエンジン エージェントを構築できましたね。さらに学習を進めたい場合、ラボのソースコードは [Copilot Developer Camp リポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab01-From-TTK-template/CareerGenie){target=_blank} で確認できます。

次は Lab BTA2 - Azure AI Search でデータをインデックス化し、カスタムエンジン エージェントにデータを取り込みましょう。[Next] を選択してください。

<cc-next url="../02-rag" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/01-custom-engine-agent--ja" />