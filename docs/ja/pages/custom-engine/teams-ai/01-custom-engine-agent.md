---
search:
  exclude: true
---
# ラボ BTA1 – Teams AI ライブラリ を用いた初のカスタム エンジン エージェント

このラボでは Visual Studio Code 用 M365 Agents Toolkit を使用してカスタム エンジン エージェント を作成します。また、カスタム エンジン エージェント で Azure OpenAI モデル を利用し、最初のプロンプト を定義します。

このラボで行うこと：

- カスタム エンジン エージェント とは何かを学ぶ
- Azure OpenAI サービス と デプロイメント モデル を作成する
- M365 Agents Toolkit を使用してカスタム エンジン エージェント を作成する
- カスタム エンジン エージェント にプロンプト を定義する
- アプリ の実行 と テスト 方法 を学ぶ

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/Onk04pehtjE" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボ の概要 をすばやく把握してください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## 紹介

カスタム エンジン エージェント の構築というエキサイティングな旅へようこそ！このコースでは、最新の Azure OpenAI モデル を使用して Microsoft Teams 用 のカスタム エンジン エージェント を作成します。具体的なプロンプト を定義したり、複雑なデータ を統合したり、高度なスキル を追加したりすることで、エージェント を真にユニークなものにできます。カスタム モデル と オーケストレーション を活用することで、エージェント は高度なタスク、複雑な会話、およびワークフロー を実行し、卓越したパーソナライズされた体験 を提供いたします。それでは、早速初のカスタム エンジン エージェント の構築を始めましょう！

???+ info "何よりも先に、念頭に置いておきたいこと… カスタム エンジン エージェント とは？"
    カスタム エンジン エージェント は生成型 AI によって動作するチャットボットであり、洗練された会話体験 を提供することを目的としております。カスタム エンジン エージェント は Teams AI ライブラリ を使用して構築され、プロンプト、アクション、および モデル 統合 の管理、さらに UI カスタマイズ の豊富なオプション を提供いたします。これにより、チャットボット は Microsoft プラットフォーム に適合しながら AI の全機能 を活用し、シームレスで魅力的な体験 を実現いたします。

## 演習 1: Azure OpenAI サービス および モデル の作成

この演習では、カスタム エンジン エージェント で Azure OpenAI の GPT モデル を作成および活用する方法 を具体的に示します。ただし、カスタム エンジン エージェント は GPT モデル のみを利用する必要はなく、別のモデル で本ラボ を試すことも可能です。

??? check "小規模言語モデル と 大規模言語モデル の選択"
    小規模言語モデル（ SLMS ）と大規模言語モデル（ LLMs ）の選択、及び各種 GPT モデル の中から選ぶ際は、複雑さ、計算リソース、効率性 など、プロジェクト の具体的なニーズ を考慮することが重要です。

    - **LLMs:** 複雑かつ精緻なタスク に最適で、数十億のパラメーター を有し、人間 の言語 の理解 や生成 に卓越しております。GPT-4、 LLaMA 2、 BERT、 PaLM などが例として挙げられます。  
    ***Example scenarios:** 複雑な顧客からの問い合わせ の処理、詳細かつ文脈に即した回答 の提供、簡潔なプロンプト から高品質な記事 の生成、大量の学術論文 の要約、主要な知見 の抽出、詳細な質問 への回答。*

    - **SLMs:** 手早く実行するタスク に向いており、パラメーター 数 が少なく、特定のタスク に最適化され、計算資源 が限られている環境 に適しております。Microsoft の Phi-3、Google の ALBERT、 HuggingFace の DistilBERT などが例です。  
    ***Example scenarios:** クラウドリソース を必要とせず効率的なテキスト解析、最小限の遅延 で正確かつ応答性の高い音声コマンド の実現、自然言語 によるスマート ホーム の自動化 と制御。*
    
    OpenAI の GPT モデル は大規模言語モデル の代表例 でございます。OpenAI のモデル を選択する際は、以下 の利点 をご考慮ください：
    
    - **gpt-4:** 最も先進的 なモデル で、非常に複雑なタスク に対し、広範な理解 と生成 能力 を要求する場合 に適しております。

    - **gpt-4o:** 特定のタスク に最適化されたバージョン で、該当分野 においてより高速かつ効率的なパフォーマンス を実現いたします。

    - **gpt-35-turbo:** コスト を抑えながらも良好なパフォーマンス を提供するバランス の取れたモデル で、幅広い用途 に理想的でございます。

本演習を始める前に、[Azure subscription prerequisite](./00-prerequisites.md#exercise-3-get-an-azure-subscription){target=_blank} を完了してください。

### ステップ 1: Azure OpenAI サービス リソース の作成

???+ info "以降のステップで作成したいモデル が選択した Azure OpenAI サービス リージョン に利用可能であること を確認してください"
    特定のリージョン で Azure OpenAI サービス を作成する前に、[Model summary table and region availability](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models?tabs=python-secure%2Cglobal-standard%2Cstandard-chat-completions#model-summary-table-and-region-availability){target=_blank} をご確認ください。ご利用になりたい `gpt-4` などのモデル が、ご希望 のリージョン で **Standard** または **Global Standard** タイプ として提供されているか を必ずご確認ください。

1. ご使用 のブラウザー を開き、[Azure Portal](https://portal.azure.com) にアクセスしてください。
1. **Create a resource** を選択し、`Azure OpenAI` を検索します。Azure OpenAI サービス を選択の上、**Create** をクリックしてください。
1. 以下 の詳細 を入力し、**Next** を選択してください:
    - **Subscription:** Azure OpenAI サービス 用 の Azure subscription
    - **Resource group:** Azure OpenAI リソース を含む Azure リソース グループ。新しいグループ を作成するか、既存 のグループ をご利用いただけます。
    - **Region:** インスタンス のリージョン。（作成するリージョン でデプロイメントモデル が利用可能であること を確認してください。）
    - **Name:** Azure OpenAI サービス リソース の説明的な名前。例: `MyOpenAIResource`
    - **Pricing Tier:** リソース の価格プラン。現状、Azure OpenAI サービス では `Standard` タイア のみがご利用いただけます。
1. ご希望 のネットワーク構成 を選択し、**Next** をクリックしてください。
1. Tags セクション はそのままで、**Next** を選択してください。
1. 最後に、Azure OpenAI サービス の詳細 をご確認の上、**Create** をクリックしてください。

Azure OpenAI サービス の作成が正常に完了しましたら、リソース に移動し、左側 のパネル から **Keys and Endpoint** を選択してください。その後、後の演習 で必要となる `KEY 1` と `Endpoint` をコピーし保存してください。

<cc-end-step lab="bta1" exercise="1" step="1" />

### ステップ 2: デプロイメント モデル の作成

Azure OpenAI サービス 内で、`Azure AI Foundry` に移動し、デプロイメント モデル を作成してください。

??? check "Azure AI Foundry とは？"
    Azure AI Foundry は、`gpt-35-turbo`、`gpt-4`、または `Dall-e` などの OpenAI モデル を試すためのプレイグラウンドであり、ユースケース に合わせたユニークなプロンプト の作成やモデル のファインチューニング を支援いたします。また、OpenAI 以外 のモデル、例えば `Phi-3` や `Llama 3.1`、さらには Speech、Vision などの他の Azure AI サービス を試すための出発点 としてもご利用いただけます。

    *この Doodle to Code ビデオ をご覧いただき、生成型 AI と プロンプティング についてさらに学んでください！*
    
    <iframe src="//www.youtube.com/embed/PGI6oxbcYDc?si=02JzvwHpnOx3rsSD" frameborder="0" allowfullscreen></iframe>

Azure AI Foundry で、**Deployments** タブ、**Deploy model**、および **Deploy base model** を順に選択してください。`gpt-4` などご希望 のモデル を検索し、**Confirm** をクリックしてください。以下 の詳細 を入力し、**Deploy** を選択してください:

- **Deployment name:** 選択したデプロイメント モデル と同一の名前 を使用することが推奨されます。例: `gpt-4`
- **Select a model:** モデル を選択します。`gpt-4` が推奨されます。
- **Deployment type:** Global Standard

!!! tip "ヒント: 利用可能なクォータがない場合 の対応"
    モデル を選択すると、設定ページ 上部 に **No quota available** というメッセージ が表示される場合がございます。これに対応するため、以下 の 2 つのオプション がございます:
    1. 別のバージョン または デプロイメント タイプ を選択する
    2. 他のデプロイメント で使用中 のリソース を解放するため、[追加クォータ の申請 または 既存クォータ の調整](https://oai.azure.com/portal/96d4a6668daf4335bc1273c1bb46cb4f/quota){target=_blank} を実施する

モデル の作成が成功しましたら、**Open in playground** を選択し、上部 の **Prompt samples** から利用可能なプロンプト のいずれか を選択してテストしてください。

例えば、「Shakespearean Writing Assistant」を選択し、**Use prompt** をクリック。その後「tell me about Istanbul」 等の質問 を送信すると、記述的かつ詩的なスタイル の応答 に驚かれることでしょう ✍️。

![Azure AI Foundry の UI 。左側に設定項目、右側にチャット領域 があり、'tell me about Istanbul' のプロンプト に対して長文かつ詳細な回答 が表示されている様子。](../../../assets/images/custom-engine-01/azure-openai-studio-chat.png)

<cc-end-step lab="bta1" exercise="1" step="2" />

## 演習 2: テンプレート からカスタム エンジン エージェント のスキャフォールド作成

この演習を始める前に、すべての [必須 前提条件](./00-prerequisites.md){target=_blank} を完了してください。

### ステップ 1: M365 Agents Toolkit を使用して新しいカスタム エンジン エージェント を作成する

1. Visual Studio Code で M365 Agents Toolkit を開き、**Create a New App** > **Custom Engine Agent** > **Basic AI Chatbot** を選択してください。
1. プログラミング言語 として **TypeScript** を選択し、 大規模言語モデル として **Azure OpenAI** を選択してください。
    1. Azure OpenAI の key を貼り付け、Enter キー を押してください。
    1. Azure OpenAI の endpoint を貼り付け、Enter キー を押してください。（Endpoint には URL の末尾にフォワードスラッシュ が含まれていないこと をご確認ください。）
    1. Azure OpenAI のデプロイメント モデル 名 を入力し、Enter キー を押してください。
1. プロジェクト のルートフォルダー を選択してください。
1. プロジェクト に `CareerGenie` などの名前 を指定し、Enter キー を押してください。

上記 のすべて の詳細 を入力すると、数秒でプロジェクト が正常にスキャフォールド作成されます。

<cc-end-step lab="bta1" exercise="2" step="1" />

### ステップ 2: プロンプト のカスタマイズ と アプリのテスト

プロンプト は AI 言語モデル と対話し、その動作 を指示するための不可欠な入力（質問） です。プロンプト を慎重に作成することで、AI に目的 の出力 を生成 させるよう導くことが可能です。それでは、カスタム エンジン エージェント のプロンプト をカスタマイズし、CareerGenie の動作 を定義いたしましょう！

プロジェクト フォルダー 内の `src/prompts/chat/skprompt.txt` に移動し、既存 のテキスト を次のプロンプト に置き換えてください:

```html
You are a career specialist named "Career Genie" that helps Human Resources team for writing job posts.
You are friendly and professional.
You always greet users with excitement and introduce yourself first.
You like using emojis where appropriate.
```

アプリ の動作 を迅速にテストするには、Teams App Test Tool をご利用いただけます。後ほどの演習 で、Microsoft Teams 上 でカスタム エンジン エージェント を実行 およびデバッグいたします。

??? check "Teams App Test Tool の詳細情報"
    Teams App Test Tool（または単に Test Tool ） は、M365 Agents Toolkit 内 の機能 で、開発者 が Webベース のチャット環境 で Teams ボット アプリケーション をデバッグ、テスト、および改善 できるよう支援いたします。このツール は Microsoft Teams の動作、外観、および使い心地 を模倣しており、Microsoft 365 テナント や dev tunnel の必要 を排除し、開発プロセス を効率化 します。

Visual Studio Code の **Run and Debug** タブ を選択し、**Debug in Test Tool** をクリックしてアプリ のデバッグ を開始してください。Teams App Test Tool がブラウザー に表示され、直ちにカスタム エンジン エージェント とチャット を始めることが可能です。動作 をテストするための推奨質問 には、以下 などがございます：

- "Can you help me write a job post for a Senior Developer role?"
- "What would be the list of required skills for a Project Manager role?"
- "Can you share a job template?"

![Teams App Test Tool で CareerGenie をテスト。実際の Microsoft Teams に近い UI が表示され、カスタム エンジン エージェント と対話可能なチャットエリアが含まれ、右側 にはユーザー とボット のやり取り の詳細ログ を示すログパネル が表示されています。](../../../assets/images/custom-engine-01/teams-app-test-tool.png)

??? info "M365 Agents Toolkit が内部で実行する処理"
    アプリ のデバッグ を開始すると、M365 Agents Toolkit が内部で以下 の必要なタスク を自動的に実行いたします：

    - Node.js、Microsoft 365 アカウント（ローカルまたは dev でデバッグする場合）およびポート使用状況 の確認。
    - ローカルでのデバッグの場合、パブリック URL をローカルポート に転送するためのローカル トンネリング サービス の開始。
    - Teams App ID の作成、ボット登録 の完了、アプリ マニフェスト の実行、さらに `appPackage/` フォルダー に格納されるアプリ パッケージ の作成のため、`teamsapp.yml`、`teamsapp.local.user`、または `teamsapp.testtool.user` ファイル 内 のライフサイクル ステージ provision の実行。
    - `env/` フォルダー 内 の env ファイル への変数 の作成 または更新。

テスト が正常に完了しましたら、デバッグ セッション を終了し、Visual Studio Code のターミナル を閉じてください。

<cc-end-step lab="bta1" exercise="2" step="2" />

---8<--- "ja/b-congratulations.md"

Azure OpenAI および M365 Agents Toolkit を用いてカスタム エンジン エージェント を構築するラボ、ラボ BTA1 – 初のカスタム エンジン エージェント が完了いたしました。さらに探求されたく存じます場合は、本ラボ のソースコード が [Copilot Developer Camp repo](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab01-From-TTK-template/CareerGenie){target=_blank} にてご確認いただけます。

次は、ラボ BTA2 – Azure AI Search でデータ をインデックス化し、カスタム エンジン エージェント にデータ を取り込む の準備が整いました。次へ を選択してください。

<cc-next url="../02-rag" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/01-custom-engine-agent" />