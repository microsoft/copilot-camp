---
search:
  exclude: true
---
# ラボ BTA1 - Teams AI ライブラリによる最初のカスタムエンジン エージェント

このラボでは、Visual Studio Code 用 M365 Agents Toolkit を使用してカスタムエンジン エージェントを構築します。さらに、Azure OpenAI モデルをカスタムエンジン エージェントで利用し、最初のプロンプトを定義します。

このラボで学習すること:

- カスタムエンジン エージェントとは何かを理解する  
- Azure OpenAI サービスとデプロイメント モデルを作成する  
- M365 Agents Toolkit でカスタムエンジン エージェントを作成する  
- カスタムエンジン エージェントにプロンプトを定義する  
- アプリを実行してテストする方法を学ぶ  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Onk04pehtjE" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>動画でラボの概要を確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## 概要

カスタムエンジン エージェント構築の旅へようこそ! このコースでは、最新の Azure OpenAI モデルを活用し、Microsoft Teams 向けのカスタムエンジン エージェントを作成します。特定のプロンプトを定義し、複雑なデータを統合し、高度なスキルを追加して、真にユニークなエージェントを構築できます。カスタムモデルとオーケストレーションを利用することで、エージェントは高度なタスクや複雑な会話、ワークフローを処理し、卓越したパーソナライズ体験を提供します。それでは、最初のカスタムエンジン エージェントの構築を始めましょう!

???+ info "まずは思い出しましょう… カスタムエンジン エージェントとは?"
    カスタムエンジン エージェントは、Generative AI を活用したチャットボットで、洗練された会話体験を提供します。Teams AI ライブラリを使用して構築され、プロンプト、アクション、モデル統合の管理をはじめ、UI カスタマイズの幅広いオプションなど、包括的な AI 機能を備えています。これにより、Microsoft プラットフォームに沿ったシームレスで魅力的な体験を実現しながら、AI のすべての機能を最大限に活用できます。

## 演習 1: Azure OpenAI サービスとモデルの作成

この演習では、特に Azure OpenAI の GPT モデルをカスタムエンジン エージェントで作成・利用する方法を示します。ただし、カスタムエンジン エージェントは GPT モデルに限定されません。他のモデルでも自由にお試しいただけます。

??? check "Small と Large Language Models の選び方"
    Small Language Models (SLM) と Large Language Models (LLM)、および複数の GPT モデルを選択する際には、プロジェクトの複雑性、計算リソース、効率性といった特定のニーズを考慮することが重要です。  

    - **LLM:** 多くのパラメーターを持ち、人間の言語理解・生成に優れ、複雑で高度なタスクに最適です。GPT-4、LLaMA 2、BERT、PaLM などが例です。  
      ***例:** 複雑な顧客問い合わせの対応、文脈を考慮した詳細回答、短いプロンプトから高品質な記事を生成、膨大な学術論文の要約と洞察抽出など。*

    - **SLM:** パラメーター数が少なく、リソースが限られた環境で高速・効率的に動作します。Phi-3 (Microsoft)、ALBERT (Google)、DistilBERT (HuggingFace) などが例です。  
      ***例:** クラウドリソース不要の効率的なテキスト解析、低遅延で正確に応答する音声コマンド、スマートホームの自然言語操作など。*
    
    OpenAI の GPT シリーズは LLM の代表例です。モデル選定時の目安は次のとおりです。  
    
    - **gpt-4:** 最も高度で、広範な理解と生成能力が必要なタスク向き。  
    - **gpt-4o:** 特定タスクに最適化され、高速かつ効率的。  
    - **gpt-35-turbo:** コストを抑えつつ良好な性能を提供し、幅広い用途に適します。  

開始前に [Azure サブスクリプションの前提条件](./00-prerequisites.md#exercise-3-get-an-azure-subscription){target=_blank} を完了してください。

### 手順 1: Azure OpenAI サービス リソースの作成

???+ info "今後作成するモデルが Azure OpenAI サービスのリージョンで利用可能か確認してください"
    [モデル一覧とリージョン対応表](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/concepts/models?tabs=python-secure%2Cglobal-standard%2Cstandard-chat-completions#model-summary-table-and-region-availability){target=_blank} を確認し、使用したいモデル (例: `gpt-4`) が、作成予定のリージョンで **Standard** または **Global Standard** タイプとして利用できることを確認してください。

1. お好みのブラウザーで [Azure Portal](https://portal.azure.com) を開きます。  
1. **Create a resource** を選択し、`Azure OpenAI` を検索します。Azure OpenAI サービスを選択して **Create** をクリックします。  
1. 次の情報を入力し **Next** を選択します。  
    - **Subscription:** 使用する Azure サブスクリプション  
    - **Resource group:** リソースを含む Azure リソース グループ (新規作成または既存グループ)  
    - **Region:** インスタンスのリージョン (選択モデルが利用可能なリージョンを指定)  
    - **Name:** 例 `MyOpenAIResource` などのわかりやすい名前  
    - **Pricing Tier:** 現在は `Standard` のみ  
1. ネットワーク構成を選択し **Next** をクリックします。  
1. Tags セクションはデフォルトのまま **Next** をクリックします。  
1. 内容を確認し **Create** をクリックします。  

Azure OpenAI サービスが作成されたら、リソースの **Keys and Endpoint** を開き、`KEY 1` と `Endpoint` をコピーして保存してください。これは後の演習 2 で使用します。

<cc-end-step lab="bta1" exercise="1" step="1" />

### 手順 2: デプロイメント モデルの作成

Azure OpenAI サービスで `Azure AI Foundry` に移動し、デプロイメント モデルを作成します。

??? check "Azure AI Foundry とは?"
    Azure AI Foundry は `gpt-35-turbo`、`gpt-4`、`Dall-e` などの OpenAI モデルを試せるプレイグラウンドです。ユースケースに合わせてプロンプトを作成し、モデルをファインチューニングできます。また、`Phi-3`、`Llama 3.1` など OpenAI 以外のモデルも扱え、Speech や Vision など他の Azure AI サービスへの入口にもなります。  

    *Generative AI とプロンプティングについては、Doodle to Code の動画もご覧ください!*  
    <iframe src="//www.youtube.com/embed/PGI6oxbcYDc?si=02JzvwHpnOx3rsSD" frameborder="0" allowfullscreen></iframe>

Azure AI Foundry で **Deployments** タブを開き **Deploy model** → **Deploy base model** を選択します。使用するモデル (例: `gpt-4`) を検索し **Confirm** をクリックします。次の情報を入力し **Deploy** をクリックします。  

- **Deployment name:** 例 `gpt-4` のようにモデル名と同じ名前を推奨  
- **Select a model:** `gpt-4` を選択  
- **Deployment type:** Global Standard  

!!! tip "ヒント: No quota available メッセージへの対応"
    モデル選択時に **No quota available** というメッセージが表示されることがあります。対処方法は 2 つあります。  
    1. バージョンまたはデプロイメント タイプを変更する  
    2. 他のデプロイメントのリソースを解放し、[クォータの追加申請や調整](https://oai.azure.com/portal/96d4a6668daf4335bc1273c1bb46cb4f/quota){target=_blank} を行う  

モデルが作成されたら **Open in playground** を選択し、**Prompt samples** からプロンプトを一つ選んでテストできます。  

例として "Shakespearean Writing Assistant" を選び **Use prompt** をクリックし、「tell me about Istanbul」など質問してみましょう。詩的で詳細な回答に驚くはずです ✍️  

![Chat Playground でモデルをテストする Azure AI Foundry の UI。左に設定、右にチャット。「tell me about Istanbul」のプロンプトに長い詳細な返答が表示されている。](../../../assets/images/custom-engine-01/azure-openai-studio-chat.png)

<cc-end-step lab="bta1" exercise="1" step="2" />

## 演習 2: テンプレートからカスタムエンジン エージェントを生成

開始前に必須の [前提条件](./00-prerequisites.md){target=_blank} をすべて完了してください。

### 手順 1: M365 Agents Toolkit で新しいカスタムエンジン エージェントを作成

1. Visual Studio Code で M365 Agents Toolkit を開き、**Create a New App** → **Custom Engine Agent** → **Basic AI Chatbot** を選択します。  
1. プログラミング言語に **TypeScript**、Large Language Model に **Azure OpenAI** を選択します。  
    1. Azure OpenAI のキーを貼り付け、Enter キーを押します。  
    1. Azure OpenAI のエンドポイントを貼り付け、Enter キーを押します (URL 末尾にスラッシュを付けないでください)。  
    1. Azure OpenAI のデプロイメント モデル名を入力し、Enter キーを押します。  
1. プロジェクトのルート フォルダーを選択します。  
1. プロジェクト名を `CareerGenie` などと入力し、Enter キーを押します。  

以上の入力が完了すると、数秒でプロジェクトが生成されます。

<cc-end-step lab="bta1" exercise="2" step="1" />

### 手順 2: プロンプトをカスタマイズしてアプリをテスト

プロンプトは AI 言語モデルと対話し、その挙動を指示するために不可欠です。適切にプロンプトを作成することで、AI の出力を望む形へ導けます。それでは、Career Genie のプロンプトをカスタマイズし、エージェントの動作を定義しましょう。

プロジェクト フォルダーで `src/prompts/chat/skprompt.txt` を開き、既存のテキストを以下のプロンプトに置き換えます。

```html
You are a career specialist named "Career Genie" that helps Human Resources team for writing job posts.
You are friendly and professional.
You always greet users with excitement and introduce yourself first.
You like using emojis where appropriate.
```

動作を素早く確認するには、Teams App Test Tool を使用できます。本演習の後半では、Microsoft Teams 上でカスタムエンジン エージェントを実行・デバッグします。

??? check "Teams App Test Tool について詳しく"
    Teams App Test Tool (Test Tool) は、M365 Agents Toolkit に含まれる機能で、Microsoft Teams と同様の Web ベース チャット環境で Teams ボット アプリをデバッグ、テスト、改良できます。Microsoft 365 テナントや Dev トンネルを用意する必要がないため、開発プロセスが簡素化されます。

Visual Studio Code の **Run and Debug** タブで **Debug in Test Tool** を選択し、デバッグを開始します。ブラウザーに Teams App Test Tool が表示され、すぐにカスタムエンジン エージェントと対話できます。動作確認におすすめの質問例:

- 「Senior Developer 役職の求人票を書くのを手伝ってくれる？」  
- 「Project Manager 役職に必要なスキル一覧は？」  
- 「求人票のテンプレートを共有してくれる？」  

![App Test Tool で Career Genie をテストする様子。Microsoft Teams に似た UI でチャットが行え、右側にはユーザーとボット間の詳細ログが表示されている。](../../../assets/images/custom-engine-01/teams-app-test-tool.png)

??? info "M365 Agents Toolkit が裏で行う処理"
    デバッグ開始時、M365 Agents Toolkit は次のような必須タスクを自動で実行します。  

    - Node.js、Microsoft 365 アカウント (ローカルまたは Dev でのデバッグ時)、ポート使用状況などの前提条件チェック  
    - ローカル デバッグ時にパブリック URL をローカル ポートへ転送するトンネル サービスの起動  
    - `teamsapp.yml`、`teamsapp.local.user`、`teamsapp.testtool.user` に記載のプロビジョン ライフサイクル ステージを実行し、Teams App ID の作成、ボット登録、アプリ マニフェストの実行、`appPackage/` フォルダーへのアプリ パッケージ作成を実施  
    - `env/` フォルダー内の env ファイルに変数を作成または更新  

テストが完了したら、デバッグ セッションを終了し、Visual Studio Code のターミナルも閉じてください。

<cc-end-step lab="bta1" exercise="2" step="2" />

---8<--- "ja/b-congratulations.md"

Azure OpenAI と M365 Agents Toolkit を用いてカスタムエンジン エージェントを構築する Lab BTA1 を完了しました! さらに探求したい場合は、本ラボのソースコードを [Copilot Developer Camp リポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab01-From-TTK-template/CareerGenie){target=_blank} でご覧いただけます。

次は Lab BTA2 - Azure AI Search でデータをインデクシングし、カスタムエンジン エージェントにデータを取り込む方法へ進みましょう。Next を選択してください。

<cc-next url="../02-rag" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/01-custom-engine-agent" />