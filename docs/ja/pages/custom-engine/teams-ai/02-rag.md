---
search:
  exclude: true
---
# ラボ BTA2 - Azure AI Search におけるデータのインデックス作成

本ラボでは、カスタムエンジン エージェント向けに Retrieval-Augmented Generation の機能を有効化し、Azure AI Search と連携してデータに関するチャットを実現します。

本ラボの内容：

- Retrieval-Augmented Generation (RAG) の概要の習得
- Azure リソースのセットアップ
- ドキュメントの Azure AI Search へのアップロード
- Vector Search 対応のためのカスタムエンジン エージェント の準備
- アプリの実行とテスト方法の習得

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/J7IZULJsagM" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を手早くご確認いただけます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## 紹介

前回の演習では、カスタムエンジン エージェントの作成方法と、AI チャットボット Career Genie の動作を定義するためのプロンプトのカスタマイズ方法を学びました。本演習では、履歴書のコレクションに対して vector search を適用し、ジョブ要件に最適な候補者を見つけます。Career Genie で vector search を有効にするため、"Azure AI Foundry on your data" 機能を使用して以下を実施します：

- Azure AI Search でインデックスの作成
- 履歴書（PDF ドキュメント）の vector embedding の生成
- ドキュメントをチャンク単位で Azure AI Search にアップロード

最後に、カスタムエンジン エージェントと Azure AI Search を連携し、データに関するチャットを実現して最適な結果を取得します。

???+ info "Retrieval-Augmented Generation (RAG) とは？"
    Retrieval-Augmented Generation (RAG) は、言語モデルによって生成される応答の品質を向上させるために人工知能で用いられる技法です。以下はその理解を深めるための簡単な例です：

    あなたが質問に対する回答を作成できるスマートアシスタントを持っていると想像してください。時には、このアシスタントが素晴らしい回答を出すために必要な情報を十分に持っていない場合があります。そこで RAG を使用すると、アシスタントは大規模なドキュメント、ビデオ、画像のコレクションから情報を検索できるようになります。適切な情報を見つけた後、その情報を用いてより正確で詳細な応答を作成します。

    このように、RAG は以下の二つの工程を組み合わせています：

    - **Retrieval:** 大規模なデータプールから関連情報を見つける工程
    - **Generation:** その情報を用いて詳細で正確な応答を生成する工程
    
    この手法により、より情報に基づいた有用な回答を提供できるため、質問への回答、記事の執筆、研究支援などのタスクに非常に効果的です。
    
    *この Doodle to Code ビデオを視聴して RAG についてさらに学びましょう！*

    <iframe src="//www.youtube.com/embed/1k4XGgsqfTM?si=P6O9baroreDKizb" frameborder="0" allowfullscreen></iframe>

??? tip "Vector Search の利点"
    Vector Search は、単純な単語の一致ではなく意味に基づいて情報を迅速かつ正確に検索するための先進的な技法です。従来のテキストベースの検索が正確なキーワード一致に依存するのに対し、vector search は数値ベクトルを用いて、クエリに類似した内容を検索します。これにより、Vector Search は以下の点に対応可能です：

    - **意味的または概念的類似性:** 異なる単語を使用していても意味が近い概念の一致（例: "pastry" と "croissant"）
    - **多言語コンテンツ:** 異なる言語間の同等コンテンツの検索（例: 英語の "pastry" とドイツ語の "gebäck"）
    - **複数のコンテンツタイプ:** テキストと画像など、異なるフォーマット間の検索
    
    Vector Search の仕組みは以下の通りです：
    
    1. **テキストをベクトルに変換:** 単語や文章を、その内容や意味を捉える数値の配列（ベクトル）に変換します。これは、word embedding やディープラーニングモデルなどの技法を用いて実施されます。
    2. **ベクトルの保存:** 生成されたベクトルを、効率的な処理が可能な専用データベースに保存します。
    3. **ベクトルを用いた検索:** 検索時に、クエリもベクトルに変換され、意味的に類似したベクトルをデータベースから探し出します。これは、単語の完全一致に頼らず、意味の類似度に基づいています。

    例えば、"how to bake a cake" を検索した場合、システムは "cake recipes" や "baking tips" に該当するドキュメントを見つけ出すことが可能です。これにより、文脈や意味に基づいて関連性の高い情報が検索され、特に大規模なデータセット内での検索において効果を発揮します。

    まとめると、Vector Search は言葉の背後にある意味に重点を置くことで、より正確で関連性の高い検索結果を実現します。

## 演習 1: Azure リソースのセットアップ

この演習を始める前に、[Azure サブスクリプションの前提条件](./00-prerequisites.md#exercise-3-get-an-azure-subscription){target=_blank}を完了してください。

### ステップ 1: Azure AI Search サービス リソースの作成

??? check "Azure AI Search とは？"
    Azure AI Search (旧称 "Azure Cognitive Search") は、ユーザー所有のコンテンツに対して、従来型および生成型 AI 検索アプリケーション向けに大規模かつ安全な情報検索を提供します。検索サービスを作成する際、以下の機能を利用します：

    - search index 上で vector search、全文検索、およびハイブリッド検索を行うための検索エンジン
    - データチャンク分割とベクトル化を統合したリッチなインデックス作成
    - vector クエリ、テキスト検索、ハイブリッド クエリに対応するリッチなクエリ構文
    - Azure AI サービスおよび Azure OpenAI との統合

1. お好みのブラウザを開き、[Azure Portal](https://portal.azure.com){target=_blank}へアクセスします。
1. **Create a resource** を選択し、次に `Azure AI Search` を検索します。Azure AI Search サービスを選択して **Create** をクリックします。
1. 以下の詳細を入力し、**Review + Create** を選択します：
    - **Subscription:** Azure AI Search サービス用の Azure サブスクリプション
    - **Resource group:** 既に作成済みの、Azure OpenAI サービス用のリソース グループを選択
    - **Name:** 例として `copilotcamp-ai-search` のような、Azure AI Search サービス リソースの説明的な名前
    - **Location:** インスタンスの場所
    - **Pricing Tier:** Basic

Azure AI Search サービス リソースの作成が成功したら、リソースの **Overview** 画面で `Url` をコピーして保存します。次に、**Keys** タブ内の **Settings** に移動し、`Primary admin key` をコピーして保存します。これらは後の演習で必要となります。

<cc-end-step lab="bta2" exercise="1" step="1" />

### ステップ 2: ストレージ アカウント サービス リソースの作成

1. お好みのブラウザを開き、[Azure Portal](https://portal.azure.com){target=_blank}へアクセスします。
1. **Create a resource** を選択し、次に `Storage Account` を検索します。Storage Account サービスを選択し、**Create** をクリックします。
1. 以下の詳細を入力し、**Review** を選択後、**Create** をクリックします：
    - **Subscription:** Azure Storage Account サービス用の Azure サブスクリプション
    - **Resource group:** 既に作成済みの、Azure OpenAI サービス用のリソース グループを選択
    - **Name:** 例として `copilotcampstorage` のような、Azure Storage Account サービス リソースの説明的な名前
    - **Region:** インスタンスの場所
    - **Performance:** Standard
    - **Redundancy:** Geo-redundant storage (GRS)

<cc-end-step lab="bta2" exercise="1" step="2" />

### ステップ 3: `text-embedding-ada-002` モデルの作成

??? info " `text-embedding-ada-002` の役割は？"
    Azure OpenAI 上の `text-embedding-ada-002` モデルは、テキストをその意味を表現する数値ベクトルに変換します。これにより、単語の完全一致ではなく意味の類似性に基づく vector search が可能となります。複数言語や様々なコンテンツタイプに対応し、言語やフォーマットを超えてテキストを比較する際に有用です。Azure AI Search と連携することで、最も関連性が高く文脈に即した情報を検索結果として提供できます。このモデルは、先進的な検索ソリューションや自然言語理解を必要とするアプリケーションの構築に最適です。

お使いのブラウザで [Azure AI Foundry](https://oai.azure.com/portal){target=_blank} を開き、**Deployments** を選択します。**Create a new deployment** を選択し、以下の詳細を入力後、**Create** をクリックします：

- **Select a model:** `text-embedding-ada-002`
- **Model version:** Default
- **Deployment type:** Standard
- **Deployment name:** 例として `text-embeddings` のような覚えやすい名前を選択
- **Content Filter:** Default

!!! tip "ヒント: 利用可能なクォータが無い場合の対処法"
    モデルを選択すると、設定画面の上部に **No quota available** というメッセージが表示される場合があります。その際は以下の二つの選択肢があります：
    1. 別のバージョンまたはデプロイメントタイプを選択する
    2. [こちら](https://oai.azure.com/portal/96d4a6668daf4335bc1273c1bb46cb4f/quota){target=_blank} から、他のデプロイメントで使用しているリソースのクォータを解放するか、既存のクォータを調整する

<cc-end-step lab="bta2" exercise="1" step="3" />

## 演習 2: Azure AI Foundry Chat Playground を使用してドキュメントを Azure AI Search にアップロード

この演習では、[fictitious_resumes.zip](https://github.com/microsoft/copilot-camp/raw/main/src/custom-engine-agent/Lab02-RAG/CareerGenie/fictitious_resumes.zip) をダウンロードし、フォルダーを解凍してください。

### ステップ 1: Azure AI Search へのドキュメントアップロード

1. お使いのブラウザで [Azure AI Foundry](https://oai.azure.com/portal){target=_blank} を開き、**Chat** playground を選択します。**Setup** セクションで、まず **Reset** を選択してシステムプロンプトおよびユーザープロンプトの内容をリセットし、Shakespearean writing に関連する code examples を削除して初期状態に戻します。既に Chat playground が空のデフォルト設定の場合は、次のステップに進んでください。

     ![The Setup section of the Chat Playground in Azure AI Foundry with the commands to reset the content of the system prompt and of the user prompt highlighted.](../../../assets/images/custom-engine-02/reset-chat-playground.png)

1. **Add your data** を選択し、次に **Add a data source** を選択します。

    ![The UI of Azure AI Foundry with the 'Add a data source' command highlighted in the Setup section, to upload custom data sources for the current model in the Chat Playground.](../../../assets/images/custom-engine-02/add-your-data-aoai.png)

1. **Upload files (preview)** を選択し、以下の情報を入力後、**Next** をクリックします：

    - **Subscription:** 作成済みの Azure リソースのサブスクリプションを選択
    - **Select Azure Blob storage resource:** 使用するストレージ リソースとして `copilotcampstorage` を選択（*Azure OpenAI needs your permission to access this resource* というメッセージが表示された場合は、**Turn on CORS** を選択してください。）
    - **Select Azure AI Search resource:** Azure AI Search リソースとして `copilotcamp-ai-search` を選択
    - **Enter the index name:** 例として `resumes` のようにインデックス名を入力；後ほど `INDEX_NAME` 環境変数で使用するためメモしておいてください
    - **Add vector search to this search resource** のチェックボックスを選択
    - **Select an embedding model:** 使用する embedding モデルとして `text-embeddings` を選択

インデックス名は後で `INDEX_NAME` 環境変数で使用するので必ずメモしてください。

![The UI to add a custom data source with fields to select subscription, Azure Storage, Azure AI Search, index name, and embedding model.](../../../assets/images/custom-engine-02/add-data-source-aoai.png)

1. **Browse for a file** を選択し、`resumes` フォルダー内の pdf ドキュメントを選択します。その後、**Upload files** と **Next** をクリックします。
1. Search type として `Vector` を、chunk size として `1024(Default)` を選択し、**Next** をクリックします。
1. 認証タイプに `API Key` を選択し、**Next** をクリックします。

データの取り込みが完了するまで数分かかります。データの準備が整ったら、テストに進んでください。

<cc-end-step lab="bta2" exercise="2" step="1" />

!!! note "注意"
    一度データのインデックスを作成すると、Chat Playground を閉じたり更新しても、Azure AI Search 上にインデックスは残ります。もし Chat Playground がリセットされ再度データの追加が必要になった場合、アップロード操作で再インデックスする必要はなく、Add Your Data セクションから既存のインデックスを選択してテストできます。

### ステップ 2: Azure AI Foundry でデータのテスト

データの取り込みが完了したら、Chat playground を使用してデータに関する質問を投げかけてください。 

例えば、*「少なくとも 2 年の .NET 経験があり、スペイン語対応可能な役割に適した候補者を提案してもらえますか？」* といった質問が可能です。

!!! tip "ヒント: データを最大限に活用するために"
    Vector Search を試す前に、データセットを確認してください。`resumes` フォルダー内の様々な言語、多様な職種、経験年数、スキルなどを含む履歴書をご覧いただき、必要なスキル、言語、職種、経験年数などに応じて最適な候補者を見つけ出すための質問をチャットで行ってみてください。複合的な要件を組み合わせて、検索体験に挑戦してみましょう。

![The Chat Playground in Azure AI Foundry once custom data has been processed. On the left side, in the Setup section, there is the configuration of the Azure AI Search service as a custom data source. On the right side, in the chat there is a sample prompt with a detailed answer based on the processed documents.](../../../assets/images/custom-engine-02/chat-with-your-data-aoai.png)

<cc-end-step lab="bta2" exercise="2" step="2" />

### ステップ 3: Azure AI Search 上でのインデックス確認

データセットについてさらに理解を深めるため、Chat playground の Add your data セクションから `resumes` を選択します。これにより、Azure AI Search 上の resumes インデックスにリダイレクトされます。

![The image highlights the link to the index in Azure AI Search configured in the Setup section of the Chat Playground in Azure AI Foundry](../../../assets/images/custom-engine-02/index-aoai.png)

まず、データ内に vector コンテンツを含めるため、Resumes インデックスページの **Fields** タブを選択し、**contentVector** のチェックボックスをオンにして **Save** をクリックします。

![The UI of Azure AI Search when adding the contentVector field to the search index with the fields tab, the contentVector field, and the save button highlighted.](../../../assets/images/custom-engine-02/add-contentvector.png)

**Search explorer** タブに戻り、Resumes インデックスページ内の **Query options** を選択して **API version** を `2024-11-01-preview` に変更し、**Close** をクリックします。データを表示するには **Search** を押してください。

!!! tip "ヒント: `contentVector` パラメーターの確認"
    データをスクロールして確認すると、各ドキュメントに pdf ドキュメントの数値ベクトルを含む `contentVector` パラメーターが存在することがわかります。これらの数値ベクトルは、Vector Search において最適な結果を見つけるために使用されます。

![The Search Explorer for the current index in Azure AI Search, showing search data with the contentVector field highlighted with the numeric vectors values.](../../../assets/images/custom-engine-02/contentvector-in-your-data.png)

<cc-end-step lab="bta2" exercise="2" step="3" />

## 演習 3: アプリと Azure AI Search の統合

この演習では、Azure OpenAI の text embedding デプロイメント名、Azure AI Search のキーおよびエンドポイントを取得してください。

### ステップ 1: 環境変数の設定

Career Genie プロジェクト内の `env/.env.local.user` に移動し、以下の環境変数を貼り付けます：

```json
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME='<Your-Text-Embedding-Model-Name>'
SECRET_AZURE_SEARCH_KEY='<Your-Azure-AI-Search-Key>'
AZURE_SEARCH_ENDPOINT='<Your-Azure-AI-Search-Endpoint>'
INDEX_NAME='<Your-index-name>'
```

`teamsapp.local.yml` を開き、ファイルの末尾、`uses: file/createOrUpdateEnvironmentFile` の下に以下のスニペットを追加してください：

```yml
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME: ${{AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME}}
AZURE_SEARCH_KEY: ${{SECRET_AZURE_SEARCH_KEY}}
AZURE_SEARCH_ENDPOINT: ${{AZURE_SEARCH_ENDPOINT}}
INDEX_NAME: ${{INDEX_NAME}}
```

`src/config.ts` に移動し、`config` 内に以下のスニペットを追加してください：

```typescript
azureOpenAIEmbeddingDeploymentName: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME,
azureSearchKey: process.env.AZURE_SEARCH_KEY,
azureSearchEndpoint: process.env.AZURE_SEARCH_ENDPOINT,
indexName: process.env.INDEX_NAME,
```

<cc-end-step lab="bta2" exercise="3" step="1" />

### ステップ 2: データ ソースとしての Azure AI Search の設定

プロジェクト内の `src/prompts/chat/config.json` を開き、`completion` ブラケット内に `data_sources` を追加してください：

```json
"data_sources": [
    {
        "type": "azure_search",
        "parameters": {
            "endpoint": "$searchEndpoint",
            "index_name": "$indexName",
            "authentication": {
                "type": "api_key",
                "key": "$searchApiKey"
            },
            "query_type":"vector",
            "in_scope": true,
            "strictness": 3,
            "top_n_documents": 3,
            "embedding_dependency": {
            "type": "deployment_name",
            "deployment_name": "$azureOpenAIEmbeddingDeploymentName"
            }
        }
    }
]
```

プロジェクト内の `src/prompts/chat/skprompt.txt` を開き、プロンプトを以下の内容に更新してください：

```
You are a career specialist named "Career Genie" that helps Human Resources team for finding the right candidate for the jobs. 
You are friendly and professional.
You always greet users with excitement and introduce yourself first.
You like using emojis where appropriate.
Always mention all citations in your content.
```

Visual Studio Code のターミナルを開き、プロジェクトルートから以下のスクリプトを実行してください：

```powershell
npm install fs
```

`src/app/app.ts` に移動し、`OpenAIModel` に以下のパラメーターを追加してください：

```typescript
azureApiVersion: '2024-02-15-preview'
```

`src/app/app.ts` ファイルの先頭に、以下の import を追加してください：

```typescript
import fs from 'fs';
```
    
`src/app/app.ts` 内の `ActionPlanner` の `defaultPrompt` を以下のコード スニペットに置き換えてください：

```typescript
defaultPrompt: async () => {
    const template = await prompts.getPrompt('chat');
    const skprompt = fs.readFileSync(path.join(__dirname, '..', 'prompts', 'chat', 'skprompt.txt'));

    const dataSources = (template.config.completion as any)['data_sources'];

    dataSources.forEach((dataSource: any) => {
      if (dataSource.type === 'azure_search') {
        dataSource.parameters.authentication.key = config.azureSearchKey;
        dataSource.parameters.endpoint = config.azureSearchEndpoint;
        dataSource.parameters.indexName = config.indexName;
        dataSource.parameters.embedding_dependency.deployment_name =
          config.azureOpenAIEmbeddingDeploymentName;
        dataSource.parameters.role_information = `${skprompt.toString('utf-8')}`;
      }
    });

    return template;
}
```

<cc-end-step lab="bta2" exercise="3" step="2" />

### ステップ 3: アプリのデバッグとデータとのチャット

!!! pied-piper "注意事項: テスト ツールではなくローカルでデバッグしてください"
   これまでアプリに実装した一部の先進機能は、Teams の Test Tool 上では正しく動作しない場合があります。そのため、今後は Test Tool ではなくローカルの Teams でアプリをデバッグしてください。

今回は Teams 上で Career Genie をテストしてみましょう。Visual Studio Code の **Run and Debug** タブから **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択してデバッグを開始します。ブラウザで Microsoft Teams が起動します。Teams 上にアプリの詳細が表示されたら、**Add** を選択し、アプリとチャットを開始してください。

!!! tip "ヒント: この演習はローカルでテストしてください"
    Teams AI ライブラリの一部機能は、Teams App Test Tool ではスムーズに動作しないため、必ず Teams 上でローカルの環境でテストおよびデバッグを行ってください。

データセットに関連する質問を投げかけてください。`resumes` フォルダー内の pdf ドキュメントを確認して、データの内容を把握し、複数の要件を組み合わせた複雑な質問をして、カスタムエンジン エージェントに挑戦してください。以下は一例です：

- 少なくとも 2 年の .NET 経験があり、スペイン語対応可能な役割に適した候補者を提案してもらえますか？
- 他に優秀な候補者はいますか？
- 5 年以上の Python 開発経験が必要なポジションに適した人物は誰ですか？
- 7 年以上の経験があり、日本語対応可能なシニア デベロッパーの候補者はいますか？

![Animation of the interaction with the Career Genie custom engine agent. The user interacts with the bot providing subsequent prompts and looking for a specific candidate based on some requirements.](../../../assets/images/custom-engine-02/byod-teams.gif)

<cc-end-step lab="bta2" exercise="3" step="3" />

---8<--- "ja/b-congratulations.md"

ラボ BTA2 - Azure AI Search におけるデータのインデックス作成 が完了しました。これにより、カスタムエンジン エージェントへデータを取り込む準備が整いました。さらに探求したい場合は、本ラボのソースコードが [Copilot Developer Camp repo](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab02-RAG/CareerGenie){target=_blank} にて公開されています。

次は、ラボ BTA3 - Enhance User Experience with the Powered by AI kit に進みます。Next を選択してください。

<cc-next url="../03-powered-by-ai" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/02-rag" />