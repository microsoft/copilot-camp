---
search:
  exclude: true
---
# ラボ BTA1 - Teams AI ライブラリで最初のカスタム エンジン エージェント

このラボでは、Visual Studio Code 用 M365 Agents Toolkit を使用してカスタム エンジン エージェントを構築します。さらに、Azure OpenAI モデルをエージェントで利用し、最初のプロンプトを定義します。

このラボで学習すること:

- カスタム エンジン エージェントとは何か
- Azure OpenAI サービスとデプロイメント モデルの作成方法
- M365 Agents Toolkit でカスタム エンジン エージェントを作成する方法
- エージェントにプロンプトを定義する方法
- アプリを実行してテストする方法

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

カスタム エンジン エージェントの構築というエキサイティングな旅へようこそ! このコースでは、最先端の Azure OpenAI モデルを使用して Microsoft Teams 用のカスタム エージェントを作成します。特定のプロンプトを定義し、複雑なデータを統合し、高度なスキルを追加して、真にユニークなエージェントを実現しましょう。カスタム モデルとオーケストレーションを活用することで、高度なタスク、複雑な会話、ワークフローにも対応し、卓越したパーソナライズド エクスペリエンスを提供できます。それでは、最初のカスタム エンジン エージェント作成を始めましょう!

???+ info "その前に... カスタム エンジン エージェントとは？"
    カスタム エンジン エージェントは、Generative AI によって強化されたチャットボットで、高度な会話体験を提供します。Teams AI ライブラリを使用して構築され、プロンプト、アクション、モデル統合の管理を含む包括的な AI 機能と、豊富な UI カスタマイズ オプションを備えています。これにより、Microsoft プラットフォームと連携したシームレスで魅力的な体験を実現します。

## エクササイズ 1: Azure OpenAI サービスとモデルの作成

このエクササイズでは、特に Azure OpenAI の GPT モデルをカスタム エンジン エージェントで利用する方法を説明します。ただし、GPT モデルに限定されるわけではありません。お好みのモデルで試すことも可能です。

??? check "Small Language Model と Large Language Model の選択"
    Small Language Model (SLM) と Large Language Model (LLM)、および複数の GPT モデルの中から選択する際は、プロジェクトの複雑さ、計算リソース、効率性のニーズを考慮することが重要です。

    - **LLM:** 複雑でニュアンスのあるタスクに最適。パラメーター数は数十億規模で、人間の言語理解・生成に優れています。GPT-4、LLaMA 2、BERT、PaLM などが例です。  
      ***例:** 複雑な顧客問い合わせへの対応、詳細で文脈を踏まえた回答、高品質な記事の生成、大量の学術論文の要約、主要インサイトの抽出など。*

    - **SLM:** リソースが限られ、速度と効率が重要な軽量タスク向け。パラメーター数が少なく、特定タスクに最適化されています。Microsoft の Phi-3、Google の ALBERT、HuggingFace の DistilBERT などが例です。  
      ***例:** クラウド リソース不要のテキスト分析、低遅延での音声コマンド応答、自然言語によるスマートホーム操作など。*
    
    OpenAI の GPT シリーズは代表的な LLM です。モデル選択の際は以下の特長を参考にしてください。
    
    - **gpt-4:** 最も高度なモデルで、深い理解と生成能力が必要なタスクに最適。
    - **gpt-4o:** 特定タスクに最適化され、高速かつ効率的に動作。
    - **gpt-35-turbo:** コストを抑えつつ良好な性能を発揮し、幅広い用途に適しています。

開始する前に、[Azure サブスクリプションの前提条件](./00-prerequisites.md#exercise-3-get-an-azure-subscription){target=_blank} を完了しておいてください。

### 手順 1: Azure OpenAI サービス リソースの作成

???+ info "希望モデルがサービス リージョンで利用可能か確認しましょう"
    Azure OpenAI サービスを特定のリージョンに作成する前に、[モデル サマリー表とリージョン対応状況](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models?tabs=python-secure%2Cglobal-standard%2Cstandard-chat-completions#model-summary-table-and-region-availability){target=_blank} を確認してください。使用したいモデル（例: `gpt-4`）が **Standard** または **Global Standard** タイプで選択したリージョンに存在することを確かめましょう。

1. 任意のブラウザーで [Azure Portal](https://portal.azure.com) を開きます。  
1. **Create a resource** を選択し、`Azure OpenAI` を検索して選択、続いて **Create** をクリックします。  
1. 次の情報を入力し **Next** を選択します。  
    - **Subscription:** Azure OpenAI サービス用の Azure サブスクリプション  
    - **Resource group:** リソースを格納する Azure リソース グループ (新規作成または既存グループを使用)  
    - **Region:** インスタンスのリージョン (希望のモデルが利用可能なリージョンを選択)  
    - **Name:** `MyOpenAIResource` などのわかりやすい名前  
    - **Pricing Tier:** 現在は `Standard` のみ  
1. ネットワーク構成を選択し **Next**。  
1. Tags セクションは既定のまま **Next**。  
1. 内容を確認し **Create** をクリック。  

作成が完了したらリソースに移動し、左側の **Keys and Endpoint** を開きます。後のエクササイズ 2 で使用する `KEY 1` と `Endpoint` をコピーして保存してください。

<cc-end-step lab="bta1" exercise="1" step="1" />

### 手順 2: デプロイメント モデルの作成

Azure OpenAI サービス内で `Microsoft Foundry` に移動し、デプロイメント モデルを作成します。

??? check "Microsoft Foundry とは？"
    Microsoft Foundry は、`gpt-35-turbo`、`gpt-4`、`Dall-e` などの OpenAI モデルを試し、独自プロンプトを作成・モデルをファインチューニングできるプレイグラウンドです。また `Phi-3`、`Llama 3.1` など OpenAI 以外のモデルや、Speech、Vision など他の Azure AI サービスへもアクセス可能な出発点となります。
    
    *Generative AI とプロンプティングについては、この Doodle to Code ビデオをご覧ください!*  
    
    <iframe src="//www.youtube.com/embed/PGI6oxbcYDc?si=02JzvwHpnOx3rsSD" frameborder="0" allowfullscreen></iframe>

Microsoft Foundry で **Deployments** タブを開き、**Deploy model** → **Deploy base model** を選択します。使用したいモデル (例: `gpt-4`) を検索し **Confirm**。次を入力して **Deploy** をクリックします。

- **Deployment name:** モデル名と同じ `gpt-4` など推奨  
- **Select a model:** `gpt-4` など  
- **Deployment type:** Global Standard  

!!! tip "ヒント: No quota available メッセージへの対処"
    モデル選択時に **No quota available** のメッセージが表示されることがあります。次のいずれかで対処できます。  
    1. 異なるバージョンまたは Deployment type を選択する  
    2. 他のデプロイメントのリソースを解放するか、[クォータの追加/調整を申請](https://oai.azure.com/portal/96d4a6668daf4335bc1273c1bb46cb4f/quota){target=_blank}

モデル作成後、**Open in playground** をクリックし、**Prompt samples** からサンプルを選んでテストしましょう。

例として "Shakespearean Writing Assistant" を選択し **Use prompt**。例えば "tell me about Istanbul" と質問すると、詩的で詳細な回答が得られます ✍️。

![Chat Playground でモデルをテストしている Microsoft Foundry の UI。左に設定、右にチャット。「tell me about Istanbul」のプロンプトに長い説明的回答が表示されている。](../../../assets/images/custom-engine-01/azure-openai-studio-chat.png)

<cc-end-step lab="bta1" exercise="1" step="2" />

## エクササイズ 2: テンプレートからカスタム エンジン エージェントをスキャフォールディング

開始前に、すべての[必要な前提条件](./00-prerequisites.md){target=_blank}を完了しておいてください。

### 手順 1: M365 Agents Toolkit で新しいカスタム エンジン エージェントを作成

1. Visual Studio Code で M365 Agents Toolkit を開き、**Create a New App** → **Custom Engine Agent** → **Basic AI Chatbot** を選択します。  
1. **TypeScript** を選択し、Large Language Model として **Azure OpenAI** を選びます。  
    1. Azure OpenAI キーを貼り付け Enter。  
    1. Azure OpenAI エンドポイントを貼り付け Enter (末尾にスラッシュ `/` を含めない)。  
    1. Azure OpenAI デプロイメント モデル名を入力し Enter。  
1. プロジェクト ルートのフォルダーを選択します。  
1. プロジェクト名を `CareerGenie` などと入力し Enter。  

以上でプロジェクトは数秒でスキャフォールディングされます。

<cc-end-step lab="bta1" exercise="2" step="1" />

### 手順 2: プロンプトをカスタマイズしてアプリをテスト

プロンプトは AI 言語モデルと対話し、その挙動を制御するために不可欠です。適切にプロンプトを設計することで、AI を望む出力へ導くことができます。さっそくプロンプトをカスタマイズし、Career Genie の振る舞いを定義しましょう。

プロジェクト フォルダーの `src/prompts/chat/skprompt.txt` を開き、既存のテキストを次のプロンプトに置き換えます。

```html
You are a career specialist named "Career Genie" that helps Human Resources team for writing job posts.
You are friendly and professional.
You always greet users with excitement and introduce yourself first.
You like using emojis where appropriate.
```

アプリの動作を素早く確認するには、Teams App Test Tool を利用できます。後ほど、Microsoft Teams 上でエージェントを実行・デバッグします。

??? check "Teams App Test Tool について"
    Teams App Test Tool (Test Tool) は、M365 Agents Toolkit に含まれる機能で、Microsoft Teams の動作・外観を模した Web ベースのチャット環境で Teams ボットをデバッグ、テスト、改善できます。Microsoft 365 テナントや Dev トンネルを必要とせず、開発を効率化します。

Visual Studio Code の **Run and Debug** タブから **Debug in Test Tool** を選択してデバッグを開始します。ブラウザーで Teams App Test Tool が開き、すぐにエージェントとチャットを開始できます。動作確認にお勧めの質問例:

- 「シニア開発者の求人票を書いてもらえますか？」
- 「プロジェクト マネージャー職に必要なスキル一覧を教えてください」
- 「求人テンプレートを共有してください」

![App Test Tool で Career Genie をテストしている画面。Microsoft Teams に似た UI でチャットし、右側に詳細ログが表示されている。](../../../assets/images/custom-engine-01/teams-app-test-tool.png)

??? info "M365 Agents Toolkit の裏側で行われる処理"
    デバッグを開始すると、M365 Agents Toolkit は次のようなタスクを自動で実行します。  
    - Node.js や Microsoft 365 アカウント (ローカル/Dev デバッグ時)、ポート占有状況などの前提条件を確認  
    - (ローカル デバッグ時) ローカル トンネル サービスを起動してパブリック URL をローカル ポートへ転送  
    - `teamsapp.yml`、`teamsapp.local.user` または `teamsapp.testtool.user` に定義されたライフサイクル ステージ *provision* を実行し、Teams App ID の作成、ボット登録、アプリ マニフェストの適用、`appPackage/` 内へのパッケージ作成を実施  
    - `env/` フォルダー内の env ファイルへ変数を新規作成または更新  

テストが完了したらデバッグ セッションを終了し、Visual Studio Code のターミナルを閉じてください。

<cc-end-step lab="bta1" exercise="2" step="2" />

---8<--- "ja/b-congratulations.md"

Azure OpenAI と M365 Agents Toolkit を用いたカスタム エンジン エージェント構築のラボ BTA1 を完了しました! さらに深く学びたい場合は、このラボのソース コードを [Copilot Developer Camp リポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab01-From-TTK-template/CareerGenie){target=_blank} で確認できます。

次は、**ラボ BTA2 - Azure AI Search でデータをインデックス化してエージェントに取り込む** へ進みましょう。Next をクリックしてください。

<cc-next url="../02-rag" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/01-custom-engine-agent--ja" />