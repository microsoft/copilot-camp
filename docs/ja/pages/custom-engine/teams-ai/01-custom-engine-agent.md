---
search:
  exclude: true
---
# ラボ BTA1 - Teams AI ライブラリによる初めてのカスタム エンジン エージェント

このラボでは、Visual Studio Code 用 M365 Agents Toolkit を使用してカスタム エンジン エージェントを構築します。さらに、カスタム エンジン エージェントで Azure OpenAI モデルを利用し、最初のプロンプトを定義します。

このラボで学ぶこと:

- カスタム エンジン エージェントとは何かを理解する  
- Azure OpenAI サービスとデプロイ モデルを作成する  
- M365 Agents Toolkit でカスタム エンジン エージェントを作成する  
- カスタム エンジン エージェントでプロンプトを定義する  
- アプリを実行してテストする方法を学ぶ  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Onk04pehtjE" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>動画でラボの概要を確認しましょう。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## はじめに

カスタム エンジン エージェント作成の旅へようこそ! このコースでは、最新の Azure OpenAI モデルを活用して Microsoft Teams 用のカスタム エンジン エージェントを構築します。特定のプロンプトを定義し、複雑なデータを統合し、高度なスキルを追加して、真にユニークなエージェントを作成できます。カスタム モデルとオーケストレーションを利用することで、高度なタスクや複雑な会話、ワークフローを処理し、卓越したパーソナライズされた体験を提供します。それでは、さっそく最初のカスタム エンジン エージェントを構築しましょう!

???+ info "その前に… カスタム エンジン エージェントとは?"
    カスタム エンジン エージェントは、Generative AI を活用したチャットボットで、洗練された会話体験を提供します。Teams AI ライブラリを使って構築され、プロンプト、アクション、モデル統合の管理や UI カスタマイズなど、包括的な AI 機能を備えています。これにより、Microsoft プラットフォームと連携しながら、AI の全機能をフル活用したシームレスで魅力的な体験を実現します。

## 演習 1: Azure OpenAI サービスとモデルを作成する

この演習では、特に Azure OpenAI の GPT モデルをカスタム エンジン エージェントで作成・利用する方法を紹介します。ただし、カスタム エンジン エージェントは GPT モデルに限定されません。お好みの他モデルでも試すことができます。

??? check "Small と Large Language Model の選択"
    Small Language Model (SLM) と Large Language Model (LLM)、およびさまざまな GPT モデルを選択するときは、プロジェクトの複雑さ、計算リソース、効率性などの要件を考慮することが重要です。  
    - **LLM:** パラメーター数が数十億規模で、人間言語の理解と生成に優れ、複雑で微妙なタスクに最適です。GPT-4、LLaMA 2、BERT、PaLM などが例です。  
      ***利用例:** 複雑な問い合わせ対応、詳細で文脈を踏まえた回答、高品質な記事生成、学術論文の大量要約、主要インサイト抽出、詳細質問への回答*  
    - **SLM:** パラメーター数が少なく、特定タスクに最適化されているため、リソースを抑え高速・効率的に処理できます。Microsoft の Phi-3、Google の ALBERT、HuggingFace の DistilBERT などが例です。  
      ***利用例:** クラウド不要の高速テキスト解析、低遅延音声コマンド、スマートホーム制御*  
    
    OpenAI の GPT シリーズは LLM の代表例です。モデル選択時のポイントは次のとおりです。  
    - **gpt-4:** 最も高性能で、広範な理解・生成が求められる高度なタスクに最適。  
    - **gpt-4o:** 特定タスク向けに最適化され、高速・効率的に動作。  
    - **gpt-35-turbo:** コストを抑えつつ優れた性能を提供し、多様な用途に適します。  

作業を開始する前に [Azure サブスクリプションの前提条件](./00-prerequisites.md#exercise-3-get-an-azure-subscription){target=_blank} を完了しておいてください。

### 手順 1: Azure OpenAI サービス リソースを作成する

???+ info "希望モデルがサービス リージョンで利用可能か確認"
    Azure OpenAI サービスを作成する前に、[モデルの概要表とリージョン別提供状況](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models?tabs=python-secure%2Cglobal-standard%2Cstandard-chat-completions#model-summary-table-and-region-availability){target=_blank} を確認してください。使用したい `gpt-4` などのモデルが、選択するリージョンの **Standard** または **Global Standard** タイプで利用可能であることを必ず確認します。

1. 任意のブラウザーで [Azure Portal](https://portal.azure.com) を開きます。  
1. **Create a resource** を選択し、`Azure OpenAI` を検索して選択後、**Create** をクリックします。  
1. 次の項目を入力し **Next** をクリックします。  
    - **Subscription:** Azure OpenAI サービス用の Azure サブスクリプション  
    - **Resource group:** リソースを格納する Azure リソース グループ (新規または既存)  
    - **Region:** インスタンスのリージョン (希望モデルが利用可能なリージョンを選択)  
    - **Name:** 例 `MyOpenAIResource` などのわかりやすい名前  
    - **Pricing Tier:** 現在は `Standard` のみ  
1. ネットワーク設定を選択し **Next**。  
1. Tags は既定のまま **Next**。  
1. 内容を確認し **Create** をクリックします。  

作成完了後、リソースに移動し左ペインの **Keys and Endpoint** を開きます。`KEY 1` と `Endpoint` をコピーして保存してください。後の演習 2 で使用します。

<cc-end-step lab="bta1" exercise="1" step="1" />

### 手順 2: デプロイ モデルを作成する

Azure OpenAI サービス内で `Azure AI Foundry` に移動し、デプロイ モデルを作成します。

??? check "Azure AI Foundry とは?"
    Azure AI Foundry は `gpt-35-turbo`、`gpt-4`、`Dall-e` などの OpenAI モデルを試し、ユースケースに合わせたプロンプト作成やファインチューニングを行うプレイグラウンドです。`Phi-3`、`Llama 3.1` など OpenAI 以外のモデルも扱え、Speech、Vision など他の Azure AI サービスへの入り口にもなります。  

    *Generative AI とプロンプトについては、この Doodle to Code 動画もご覧ください!*  
    
    <iframe src="//www.youtube.com/embed/PGI6oxbcYDc?si=02JzvwHpnOx3rsSD" frameborder="0" allowfullscreen></iframe>

Azure AI Foundry で **Deployments** タブ → **Deploy model** → **Deploy base model** を選択し、`gpt-4` など使用したいモデルを検索して **Confirm**。以下を入力し **Deploy** をクリックします。

- **Deployment name:** モデル名と同じ `gpt-4` など推奨  
- **Select a model:** `gpt-4` など  
- **Deployment type:** Global Standard  

!!! tip "ヒント: No quota available の対処"
    モデル選択時に **No quota available** が表示された場合は、次のいずれかを行います。  
    1. 別バージョンまたはデプロイ タイプを選択する  
    2. 他のデプロイを整理し、[クォータを申請または調整](https://oai.azure.com/portal/96d4a6668daf4335bc1273c1bb46cb4f/quota){target=_blank} する  

モデルが作成できたら **Open in playground** をクリックし、**Prompt samples** から例を選んでテストします。

例として "Shakespearean Writing Assistant" を選び **Use prompt**。たとえば "tell me about Istanbul" と入力すると、詩的で豊かな回答に驚くでしょう ✍️。

![Azure AI Foundry で Chat Playground をテストしている UI。左に設定、右にチャットがあり、'tell me about Istanbul' に長く詳細な回答が示されている。](../../../assets/images/custom-engine-01/azure-openai-studio-chat.png)

<cc-end-step lab="bta1" exercise="1" step="2" />

## 演習 2: テンプレートからカスタム エンジン エージェントをスキャフォールディングする

作業を開始する前に、すべての [必須前提条件](./00-prerequisites.md){target=_blank} を完了しておいてください。

### 手順 1: M365 Agents Toolkit で新しいカスタム エンジン エージェントを作成する

1. Visual Studio Code の M365 Agents Toolkit で **Create a New App** → **Custom Engine Agent** → **Basic AI Chatbot** を選択します。  
1. プログラミング言語は **TypeScript**、Large Language Model は **Azure OpenAI** を選びます。  
    1. Azure OpenAI キーを貼り付け Enter。  
    1. Azure OpenAI エンドポイントを貼り付け Enter。(末尾にスラッシュを含めないでください)  
    1. Azure OpenAI デプロイ モデル名を入力し Enter。  
1. プロジェクト ルートのフォルダーを選択します。  
1. プロジェクト名を `CareerGenie` などと入力し Enter。  

以上の情報を入力すると、数秒でプロジェクトがスキャフォールディングされます。

<cc-end-step lab="bta1" exercise="2" step="1" />

### 手順 2: プロンプトをカスタマイズしてアプリをテストする

プロンプトは AI 言語モデルとの対話において不可欠で、モデルの振る舞いを指示します。適切に作成することで、AI から望む出力を得られます。ここでは Career Genie の行動を定義するため、プロンプトをカスタマイズします。

プロジェクトの `src/prompts/chat/skprompt.txt` を開き、既存のテキストを以下のプロンプトに置き換えます。

```html
You are a career specialist named "Career Genie" that helps Human Resources team for writing job posts.
You are friendly and professional.
You always greet users with excitement and introduce yourself first.
You like using emojis where appropriate.
```

アプリの動作をすばやく確認するには Teams App Test Tool を利用できます。後ほど Microsoft Teams 上でカスタム エンジン エージェントを実行・デバッグします。

??? check "Teams App Test Tool について"
    Teams App Test Tool (Test Tool) は、M365 Agents Toolkit に含まれる機能で、Microsoft Teams に近い Web チャット環境で Teams ボット アプリをデバッグ・テスト・改善できます。Microsoft 365 テナントや dev トンネルが不要なため、開発が効率化されます。

Visual Studio Code で **Run and Debug** タブ → **Debug in Test Tool** を選択してデバッグを開始します。ブラウザーで Teams App Test Tool が開き、すぐにカスタム エンジン エージェントとチャットできます。動作確認用の質問例:

- 「Can you help me write a job post for a Senior Developer role?」
- 「What would be the list of required skills for a Project Manager role?」
- 「Can you share a job template?」

![App Test Tool で Career Genie をテストしている画面。Teams そっくりの UI があり、右側にはユーザーとボットのやり取りの詳細ログが表示されている。](../../../assets/images/custom-engine-01/teams-app-test-tool.png)

??? info "M365 Agents Toolkit が裏側で行うこと"
    デバッグ開始時、M365 Agents Toolkit は裏側で次のタスクを自動実行します。  
    - Node.js、Microsoft 365 アカウント (ローカルまたは dev デバッグ時)、ポート占有などの前提条件チェック  
    - ローカル デバッグ時のトンネル サービス起動 (公開 URL をローカル ポートへ転送)  
    - `teamsapp.yml`、`teamsapp.local.user`、`teamsapp.testtool.user` に定義された provision ステージを実行し、Teams App ID 生成、ボット登録、アプリ マニフェスト適用、`appPackage/` にアプリ パッケージ作成  
    - `env/` フォルダーの env ファイルへ変数を作成または更新  

テストが完了したら、デバッグ セッションを終了し、Visual Studio Code のターミナルを閉じてください。

<cc-end-step lab="bta1" exercise="2" step="2" />

---8<--- "ja/b-congratulations.md"

Azure OpenAI と M365 Agents Toolkit を使用してカスタム エンジン エージェントを構築する「ラボ BTA1 - First custom engine agent」が完了しました! さらに学習したい場合は、本ラボのソース コードを [Copilot Developer Camp レポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab01-From-TTK-template/CareerGenie){target=_blank} で確認できます。

次のラボ BTA2「Azure AI Search でデータをインデックス化してエージェントに取り込む」に進みましょう。Next をクリックしてください。

<cc-next url="../02-rag" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/01-custom-engine-agent" />