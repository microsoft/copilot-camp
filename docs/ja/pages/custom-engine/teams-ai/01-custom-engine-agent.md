---
search:
  exclude: true
---
# ラボ BTA1 - Teams AI library で最初のカスタムエンジン エージェント

このラボでは、Visual Studio Code 用 **M365 Agents Toolkit** を使用してカスタムエンジン エージェントを作成します。また、カスタムエンジン エージェント内で **Azure OpenAI** モデルを利用し、初めてのプロンプトを定義します。

このラボで学習する内容:

- カスタムエンジン エージェントとは何かを理解する  
- **Azure OpenAI** サービスとデプロイメントモデルを作成する  
- **M365 Agents Toolkit** を使用してカスタムエンジン エージェントを作成する  
- カスタムエンジン エージェントでプロンプトを定義する  
- アプリを実行してテストする方法を学ぶ  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Onk04pehtjE" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を手早く確認しましょう。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## はじめに

カスタムエンジン エージェント構築の旅へようこそ!  
このコースでは、最先端の **Azure OpenAI** モデルを活用し、Microsoft Teams 用のカスタムエンジン エージェントを作成します。特定のプロンプトを定義し、複雑なデータを統合し、高度なスキルを追加して、独自性の高いエージェントを構築しましょう。カスタムモデルとオーケストレーションを組み合わせることで、高度なタスクや複雑な会話、ワークフローに対応し、パーソナライズされた卓越した体験を提供できます。それでは、最初のカスタムエンジン エージェントの構築を始めましょう!

???+ info "その前に… カスタムエンジン エージェントとは?"
    カスタムエンジン エージェントは **Generative AI** を活用したチャットボットで、洗練された対話体験を提供します。  
    Teams AI library を用いて構築され、プロンプト・アクション・モデル統合の管理や UI カスタマイズなど、包括的な AI 機能を備えています。これにより Microsoft プラットフォームと連携したシームレスで魅力的なエクスペリエンスを実現できます。

## エクササイズ 1: Azure OpenAI サービスとモデルの作成

このエクササイズでは、特に **Azure OpenAI** の GPT モデルをカスタムエンジン エージェントで利用する方法を示します。ただし、カスタムエンジン エージェントは GPT モデルだけに限定されません。お好みのモデルでもお試しいただけます。

??? check "Small Language Model と Large Language Model の使い分け"
    Small Language Model (SLM) と Large Language Model (LLM)、さらにはさまざまな GPT モデルを選択する際は、プロジェクトの複雑さ、計算リソース、効率性を考慮してください。  

    - **LLM:** パラメーター数が数十億規模で、人間の言語を深く理解・生成できるため、複雑でニュアンスのあるタスクに最適です。例: GPT-4、LLaMA 2、BERT、PaLM  
      **例:** 複雑なカスタマーサポート、文脈を踏まえた詳細回答、短いプロンプトから高品質な記事を生成、大量の学術論文の要約や洞察抽出など。

    - **SLM:** パラメーターが少なく、特定タスク向けに最適化されているため、速度と効率が重要なシナリオで有効です。例: Phi-3 (Microsoft)、ALBERT (Google)、DistilBERT (HuggingFace)  
      **例:** クラウド不要のテキスト分析、高速応答が求められる音声コマンド、スマートホーム制御など。

    OpenAI の GPT モデルは LLM の代表例です。モデル選択のポイント:  
    - **gpt-4:** 最も高度。深い理解と生成能力が必要なタスク向け。  
    - **gpt-4o:** 特定タスクに最適化され、より高速かつ効率的。  
    - **gpt-35-turbo:** コストを抑えつつバランスの取れた性能。幅広い用途に適しています。

開始前に [Azure サブスクリプションの前提条件](./00-prerequisites.md#exercise-3-get-an-azure-subscription){target=_blank} を完了してください。

### 手順 1: Azure OpenAI サービス リソースの作成

???+ info "利用したいモデルが対象リージョンで利用可能か確認しましょう"
    Azure OpenAI サービスを作成する前に、[モデル一覧とリージョン対応表](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models?tabs=python-secure%2Cglobal-standard%2Cstandard-chat-completions#model-summary-table-and-region-availability){target=_blank} を確認してください。例えば `gpt-4` を利用する場合、選択したリージョンで **Standard** または **Global Standard** タイプとして利用可能であることが必要です。

1. ブラウザーで [Azure Portal](https://portal.azure.com) を開きます。  
1. **Create a resource** を選択し、`Azure OpenAI` を検索して選択し **Create**。  
1. 次を入力して **Next** を選択します。  
    - **Subscription:** 使用する Azure サブスクリプション  
    - **Resource group:** リソースを含めるリソースグループ (新規または既存)  
    - **Region:** インスタンスのリージョン (モデルが利用可能なリージョンを選択)  
    - **Name:** 例 `MyOpenAIResource` などわかりやすい名前  
    - **Pricing Tier:** 現在は `Standard` のみ  
1. ネットワーク構成を選択し **Next**。  
1. Tags は既定のまま **Next**。  
1. 設定を確認し **Create** をクリック。  

デプロイ完了後、リソースの **Keys and Endpoint** を開き、`KEY 1` と `Endpoint` をコピーして保存しておきます (エクササイズ 2 で使用)。

<cc-end-step lab="bta1" exercise="1" step="1" />

### 手順 2: デプロイメントモデルの作成

Azure OpenAI サービスで `Azure AI Foundry` に移動し、デプロイメントモデルを作成します。

??? check "Azure AI Foundry とは?"
    **Azure AI Foundry** は `gpt-35-turbo`、`gpt-4`、`Dall-e` などの OpenAI モデルを試し、プロンプトを作成・調整・ファインチューニングできるプレイグラウンドです。また `Phi-3`、`Llama 3.1` など OpenAI 以外のモデルや Speech、Vision など Azure AI サービスへもアクセスできます。  

    *Generative AI とプロンプティングについては、この Doodle to Code 動画もご覧ください!*  
    <iframe src="//www.youtube.com/embed/PGI6oxbcYDc?si=02JzvwHpnOx3rsSD" frameborder="0" allowfullscreen></iframe>

Azure AI Foundry で **Deployments** タブ > **Deploy model** > **Deploy base model** を選択し、`gpt-4` など使用したいモデルを検索して **Confirm**。次を入力して **Deploy**:

- **Deployment name:** 例 `gpt-4` (モデル名と同じにするとわかりやすい)  
- **Select a model:** `gpt-4` を推奨  
- **Deployment type:** Global Standard  

!!! tip "Quota が不足している場合の対処"
    モデル選択時に **No quota available** と表示される場合は以下を検討してください。  
    1. バージョンまたはデプロイタイプを変更する  
    2. [クォータの追加申請または調整](https://oai.azure.com/portal/96d4a6668daf4335bc1273c1bb46cb4f/quota){target=_blank} を行う  

モデルが作成できたら **Open in playground** をクリックし、**Prompt samples** からお好みのプロンプトを選んでテストします。

例として "Shakespearean Writing Assistant" を選び **Use prompt** を押し、「tell me about Istanbul」と入力してみてください。詩的で描写豊かな回答に驚くことでしょう ✍️。

![The UI of Azure AI Foundry while testing a model in the Chat Playground. There are setup settings on the left and a chat on the right where the 'tell me about Istanbul' prompt gets a long and detailed answer.](../../../assets/images/custom-engine-01/azure-openai-studio-chat.png)

<cc-end-step lab="bta1" exercise="1" step="2" />

## エクササイズ 2: テンプレートからカスタムエンジン エージェントをスキャフォールディング

開始前に [必須の前提条件](./00-prerequisites.md){target=_blank} をすべて満たしていることを確認してください。

### 手順 1: M365 Agents Toolkit で新しいカスタムエンジン エージェントを作成

1. Visual Studio Code で **M365 Agents Toolkit** を開き **Create a New App** > **Custom Engine Agent** > **Basic AI Chatbot** を選択。  
1. **TypeScript** をプログラミング言語に、**Azure OpenAI** を Large Language Model に選択。  
    1. Azure OpenAI のキーを貼り付け Enter。  
    1. Azure OpenAI のエンドポイントを貼り付け Enter (末尾にスラッシュ `/` を付けない)。  
    1. Azure OpenAI のデプロイメントモデル名を入力し Enter。  
1. プロジェクトルートのフォルダーを選択。  
1. プロジェクト名を `CareerGenie` などと入力し Enter。  

以上の情報を入力すると、数秒でプロジェクトがスキャフォールディングされます。

<cc-end-step lab="bta1" exercise="2" step="1" />

### 手順 2: プロンプトをカスタマイズしてアプリをテスト

プロンプトは AI 言語モデルと対話し、その挙動を制御するために不可欠です。プロンプトを慎重に設計することで、AI を望ましい出力へ導けます。ここでは Career Genie のプロンプトをカスタマイズし、エージェントの挙動を定義します。

プロジェクトフォルダー内の `src/prompts/chat/skprompt.txt` を開き、既存のテキストを次のプロンプトに置き換えてください。

```html
You are a career specialist named "Career Genie" that helps Human Resources team for writing job posts.
You are friendly and professional.
You always greet users with excitement and introduce yourself first.
You like using emojis where appropriate.
```

アプリの挙動を素早く確認するには **Teams App Test Tool** を使用します。後ほど Microsoft Teams 上でカスタムエンジン エージェントを実行・デバッグします。

??? check "Teams App Test Tool について"
    **Teams App Test Tool** (Test Tool) は、M365 Agents Toolkit に含まれる機能で、Microsoft Teams の UI や動作を模した Web ベースのチャット環境でボットアプリをデバッグ・テスト・改善できます。Microsoft 365 テナントや Dev トンネルを用意せずに済むため、開発プロセスを効率化できます。

Visual Studio Code の **Run and Debug** タブで **Debug in Test Tool** を選択しデバッグを開始します。Teams App Test Tool がブラウザーで開き、すぐにカスタムエンジン エージェントと会話できます。以下の質問例で挙動を試してみてください:

- 「Can you help me write a job post for a Senior Developer role?」  
- 「What would be the list of required skills for a Project Manager role?」  
- 「Can you share a job template?」

![Test Career Genie in App Test Tool. There is a UI looking almost like the real Microsoft Teams one, with a chat area that allows to interact with the custom engine agent. On the right side there is a log panel with detailed logs about the interactions between the user and the bot.](../../../assets/images/custom-engine-01/teams-app-test-tool.png)

??? info "M365 Agents Toolkit が裏側で行う処理"
    デバッグ開始時、M365 Agents Toolkit は次のような処理を自動で実行します。  
    - Node.js、Microsoft 365 アカウント (ローカル/Dev デバッグ時)、ポート占有状況など必須要件をチェック  
    - (ローカルデバッグ時) Public URL をローカルポートへ転送するトンネリングサービスを起動  
    - `teamsapp.yml`、`teamsapp.local.user`、`teamsapp.testtool.user` に従い、Teams App ID の作成、ボット登録、アプリ マニフェストの実行、`appPackage/` へのアプリパッケージ生成などのライフサイクルステージ **provision** を実行  
    - `env/` にある env ファイルへ変数を作成または更新  

テストが完了したらデバッグセッションを終了し、Visual Studio Code のターミナルを閉じてください。

<cc-end-step lab="bta1" exercise="2" step="2" />

---8<--- "ja/b-congratulations.md"

カスタムエンジン エージェントを **Azure OpenAI** と **M365 Agents Toolkit** で構築するラボ BTA1 を完了しました! さらに深く学習したい場合は、このラボのソースコードが [Copilot Developer Camp リポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab01-From-TTK-template/CareerGenie){target=_blank} にありますのでご覧ください。

次のラボ BTA2 「Azure AI Search でデータをインデックス化してカスタムエンジン エージェントに取り込む」に進みましょう。**Next** を選択してください。

<cc-next url="../02-rag" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/01-custom-engine-agent--ja" />