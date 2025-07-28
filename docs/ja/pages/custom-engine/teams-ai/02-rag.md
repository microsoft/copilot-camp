---
search:
  exclude: true
---
# ラボ BTA2 - Azure AI Search でデータをインデックス

このラボでは、カスタム エンジン エージェントで Retrieval-Augmented Generation を有効にし、 Azure AI Search と統合してデータと対話できるようにします。

このラボで行うこと:

- Retrieval-Augmented Generation ( RAG ) とは何かを学習
- Azure リソースのセットアップ
- ドキュメントを Azure AI Search にアップロード
- カスタム エンジン エージェントを Vector Search 用に準備
- アプリの実行方法とテスト方法を学習

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/J7IZULJsagM" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を簡単にご覧いただけます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## 概要

前回の演習では、カスタム エンジン エージェントを作成し、 AI チャットボット Career Genie の動作を定義するプロンプトをカスタマイズする方法を学びました。本演習では、履歴書コレクションに対してベクター検索を適用し、求人要件に最適な候補者を見つけます。 Career Genie でベクター検索を有効にするため、 “ Azure AI Foundry on your data ” 機能を使用して次を実行します。

- Azure AI Search にインデックスを作成
- 履歴書 (PDF ドキュメント) のベクター埋め込みを生成
- データをチャンクに分割し Azure AI Search にアップロード

最後に、カスタム エンジン エージェントを Azure AI Search と統合してデータと対話し、最良の結果を得ます。

???+ info "Retrieval-Augmented Generation ( RAG ) とは？"
    Retrieval-Augmented Generation ( RAG ) は、言語モデルが生成する回答の品質を向上させる AI 技術です。簡単な例で説明します。

    スマート アシスタントが質問に答えてくれるとします。アシスタントは常に十分な知識を持っているとは限りません。そこで RAG を使うと、アシスタントが大量のドキュメントや動画、画像などから情報を検索し (インターネット検索のように)、関連情報を取得してからより正確な回答を生成できます。

    RAG は次の 2 つのステップを組み合わせます。

    - **Retrieval:** 大量のデータから関連情報を検索
    - **Generation:** 取得した情報を基に詳細で正確な回答を生成
    
    これにより、質問応答、記事執筆、リサーチ支援などで、より有用で情報量の多い回答を提供できます。
    
    *Doodle to Code ビデオで RAG をさらに学びましょう！*

    <iframe src="//www.youtube.com/embed/1k4XGgsqfTM?si=P6O9baroreDKizb" frameborder="0" allowfullscreen></iframe>

??? tip "Vector Search を使用する利点"
    ベクター検索は、単なるキーワード一致ではなく「意味」に基づいて情報を高速かつ高精度に検索する高度な手法です。従来のテキスト検索と異なり、数値ベクトルを用いてクエリと類似するコンテンツを見つけます。これにより次のような検索が可能です。

    - **意味・概念の類似性:** 異なる単語でも意味が近いものをマッチ (例: "pastry" と "croissant")
    - **多言語コンテンツ:** 異なる言語間で同等の内容を検索 (例: 英語 "pastry" と ドイツ語 "gebäck")
    - **複数のコンテンツ形式:** テキストと画像など形式を横断して検索
    
    ベクター検索の流れは以下のとおりです。
    
    1. **テキストをベクトルに変換:** 単語や文を意味を表す数列 (ベクトル) に変換 (埋め込み)
    2. **ベクトルを保存:** ベクトルを効率的に扱える専用データベースに保存
    3. **ベクトルで検索:** クエリもベクトル化し、データベース内で意味が近いベクトルを検索

    例えば「 how to bake a cake 」で検索すると、同じ言葉がなくても「 cake recipes 」や「 baking tips 」を含む文書、あるいは他言語のレシピも見つかります。大規模データセットで文脈と意味に基づく高精度な検索が可能です。

    要約すると、ベクター検索は言葉の背後にある意味に着目して検索精度と関連性を向上させます。

## 演習 1: Azure リソースのセットアップ

この演習を始める前に、 [Azure サブスクリプションの前提条件](./00-prerequisites.md#exercise-3-get-an-azure-subscription){target=_blank} を完了してください。

### 手順 1: Azure AI Search サービス リソースを作成

??? check "Azure AI Search とは？"
    Azure AI Search (旧 Azure Cognitive Search) は、ユーザー所有コンテンツに対し、安全でスケーラブルな情報検索を提供します。検索サービスを作成すると、次の機能が利用できます。

    - ベクター検索、全文検索、ハイブリッド検索用エンジン
    - データのチャンク化とベクトル化を統合した高機能インデクサー
    - ベクター クエリ、テキスト検索、ハイブリッド クエリ向けの豊富なクエリ構文
    - Azure AI サービスおよび Azure OpenAI との統合

1. 任意のブラウザーで [Azure Portal](https://portal.azure.com){target=_blank} を開きます。  
1. **Create a resource** を選択し、`Azure AI Search` を検索します。 Azure AI Search サービスを選択して **Create** をクリックします。  
1. 次の情報を入力し **Review + Create** を選択します。  
    - **Subscription:** Azure AI Search 用のサブスクリプション  
    - **Resource group:** 以前に作成した Azure OpenAI 用のリソース グループ  
    - **Name:** `copilotcamp-ai-search` などのわかりやすい名前  
    - **Location:** インスタンスのリージョン  
    - **Pricing Tier:** Basic  

リソースが作成されたら、リソース ページの **Overview** で `Url` をコピーして保存します。続いて **Settings** 内の **Keys** タブで `Primary admin key` をコピーして保存します。これらは後の演習で使用します。

<cc-end-step lab="bta2" exercise="1" step="1" />

### 手順 2: ストレージ アカウント サービス リソースを作成

1. [Azure Portal](https://portal.azure.com){target=_blank} を開きます。  
1. **Create a resource** を選択し、`Storage Account` を検索します。 Storage Account サービスを選択して **Create** をクリックします。  
1. 次の情報を入力後、**Review**、**Create** の順にクリックします。  
    - **Subscription:** ストレージ アカウント用のサブスクリプション  
    - **Resource group:** 以前に作成した Azure OpenAI 用のリソース グループ  
    - **Name:** `copilotcampstorage` などのわかりやすい名前  
    - **Region:** インスタンスのリージョン  
    - **Performance:** Standard  
    - **Redundancy:** Geo-redundant storage ( GRS )  

<cc-end-step lab="bta2" exercise="1" step="2" />

### 手順 3: `text-embedding-ada-002` モデルを作成

??? info "`text-embedding-ada-002` の役割"
    Azure OpenAI の `text-embedding-ada-002` モデルは、テキストをその意味を表す数値ベクトルに変換します。これにより、完全一致ではなく意味の近さで検索できるベクター検索が可能になります。多言語や異なるコンテンツ形式にも対応し、 Azure AI Search と組み合わせることで、文脈的に最適な情報を検索できます。高度な検索ソリューションや自然言語理解が必要なアプリに最適です。

ブラウザーで [Azure AI Foundry](https://oai.azure.com/portal){target=_blank} を開き、 **Deployments** → **Create a new deployment** を選択します。以下を入力して **Create** をクリックします。

- **Select a model:** `text-embedding-ada-002`
- **Model version:** Default
- **Deployment type:** Standard
- **Deployment name:** `text-embeddings` など覚えやすい名前
- **Content Filter:** Default

!!! tip "No quota available メッセージへの対処"
    モデル選択時に **No quota available** が表示された場合は次のいずれかを試してください。  
    1. 別のバージョンまたは Deployment type を選択  
    2. [クォータの追加要求や既存クォータ調整](https://oai.azure.com/portal/96d4a6668daf4335bc1273c1bb46cb4f/quota){target=_blank} を行い、他のデプロイメントのリソースを解放  

<cc-end-step lab="bta2" exercise="1" step="3" />

## 演習 2: Azure AI Foundry Chat Playground を使って Azure AI Search にドキュメントをアップロード

[こちらの fictitious_resumes.zip](https://github.com/microsoft/copilot-camp/raw/main/src/custom-engine-agent/Lab02-RAG/CareerGenie/fictitious_resumes.zip) をダウンロードし、フォルダーを解凍してください。

### 手順 1: ドキュメントを Azure AI Search にアップロード

1. ブラウザーで [Azure AI Foundry](https://oai.azure.com/portal){target=_blank} を開き **Chat** playground を選択します。 **Setup** セクションで **Reset** をクリックし、 Shakespearean 例を削除して空の状態にします。すでに初期状態の場合はそのまま次へ進みます。

     ![The Setup section of the Chat Playground in Azure AI Foundry with the commands to reset the content of the system prompt and of the user prompt highlighted.](../../../assets/images/custom-engine-02/reset-chat-playground.png)

1. **Add your data** → **Add a data source** を選択します。

    ![The UI of Azure AI Foundry with the 'Add a data source' command highlighted in the Setup section, to upload custom data sources for the current model in the Chat Playground.](../../../assets/images/custom-engine-02/add-your-data-aoai.png)

1. **Upload files (preview)** を選択し、以下を入力して **Next** をクリックします。

    - **Subscription:** 作成した Azure リソースのサブスクリプション
    - **Select Azure Blob storage resource:** ストレージ リソース `copilotcampstorage` (アクセス許可の要求が表示されたら **Turn on CORS** を選択)
    - **Select Azure AI Search resource:** Azure AI Search リソース `copilotcamp-ai-search`
    - **Enter the index name:** `resumes` など (後で使用するためメモ)
    - **Add vector search to this search resource:** チェックを入れる
    - **Select an embedding model:** 埋め込みモデル `text-embeddings`

インデックス名は `INDEX_NAME` 環境変数で使用するので控えておいてください。

![The UI to add a custom data source with fields to select subscription, Azure Storage, Azure AI Search, index name, and embedding model.](../../../assets/images/custom-engine-02/add-data-source-aoai.png)

1. **Browse for a file** をクリックし `resumes` フォルダー内の PDF を選択します。 **Upload files** → **Next**。  
1. **Search type** を `Vector`、 **chunk size** を `1024 (Default)` に設定し **Next**。  
1. **Azure resource authentication type** として `API Key` を選択し **Next**。

データ取り込みには数分かかります。完了したらテストに進みます。

<cc-end-step lab="bta2" exercise="2" step="1" />

!!! note "注意"
    一度データをインデックス化すると、 Chat Playground を閉じたり更新してもインデックスは Azure AI Search に残ります。 Chat Playground がリセットされた場合は **Upload files** を再実行する必要はなく、 **Add Your Data** から Azure AI Search を選択し既存のインデックスを指定してテストできます。

### 手順 2: Azure AI Foundry でデータをテスト

データ取り込みが完了したら、 Chat playground で質問してみましょう。

例: 「 スペイン語が話せて .NET 経験 2 年以上の候補者を提案してください。」 など。

!!! tip "データを最大限活用するコツ"
    ベクター検索を試す前にデータセットを確認しましょう。 `resumes` フォルダーを閲覧し、言語・職種・経験年数・スキルなどを把握してください。スキル・言語・職種・経験年数などを組み合わせて質問し、検索体験を試してみてください。

![The Chat Playground in Azure AI Foundry once custom data has been processed. On the left side, in the Setup section, there is the configuration of the Azure AI Search service as a custom data source. On the right side, in the chat there is a sample prompt with a detailed answer based on the processed documents.](../../../assets/images/custom-engine-02/chat-with-your-data-aoai.png)

<cc-end-step lab="bta2" exercise="2" step="2" />

### 手順 3: Azure AI Search でインデックスをのぞき見

データセットをより理解するため、 Chat playground の **Add your data** セクションで **resumes** をクリックします。 Azure AI Search の **resumes** インデックス ページに移動します。

![The image highlights the link to the index in Azure AI Search configured in the Setup section of the Chat Playground in Azure AI Foundry](../../../assets/images/custom-engine-02/index-aoai.png)

まずベクター コンテンツを表示します。 **Fields** タブで **contentVector** にチェックを入れ **Save** をクリックします。

![The UI of Azure AI Search when adding the contentVector field to the search index with the fields tab, the contentVector field, and the save button highlighted.](../../../assets/images/custom-engine-02/add-contentvector.png)

**Search explorer** タブに戻り、 **Query options** を開いて **API version** を `2024-11-01-preview` に変更し **Close**。 **Search** を押してデータを表示します。

!!! tip "`contentVector` パラメーターを確認"
    各ドキュメントに `contentVector` パラメーターがあり、 PDF の数値ベクトルが格納されています。このベクトルが Vector Search で最適な結果を見つけるために使用されます。

![The Search Explorer for the current index in Azure AI Search, showing search data with the contentVector field highlighted with the numeric vectors values.](../../../assets/images/custom-engine-02/contentvector-in-your-data.png)

<cc-end-step lab="bta2" exercise="2" step="3" />

## 演習 3: アプリを Azure AI Search と統合

この演習では、 Azure OpenAI テキスト埋め込みデプロイ名、 Azure AI Search のキーとエンドポイントを取得しておいてください。

### 手順 1: 環境変数を設定

Career Genie プロジェクトで `env/.env.local.user` を開き、次の環境変数を貼り付けます。

```json
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME='<Your-Text-Embedding-Model-Name>'
SECRET_AZURE_SEARCH_KEY='<Your-Azure-AI-Search-Key>'
AZURE_SEARCH_ENDPOINT='<Your-Azure-AI-Search-Endpoint>'
INDEX_NAME='<Your-index-name>'
```

`teamsapp.local.yml` を開き、ファイル下部の `uses: file/createOrUpdateEnvironmentFile` の下に次を追加します。

```yml
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME: ${{AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME}}
AZURE_SEARCH_KEY: ${{SECRET_AZURE_SEARCH_KEY}}
AZURE_SEARCH_ENDPOINT: ${{AZURE_SEARCH_ENDPOINT}}
INDEX_NAME: ${{INDEX_NAME}}
```

`src/config.ts` を開き、 `config` 内に次のスニペットを追加します。

```typescript
azureOpenAIEmbeddingDeploymentName: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME,
azureSearchKey: process.env.AZURE_SEARCH_KEY,
azureSearchEndpoint: process.env.AZURE_SEARCH_ENDPOINT,
indexName: process.env.INDEX_NAME,
```

<cc-end-step lab="bta2" exercise="3" step="1" />

### 手順 2: Azure AI Search をデータ ソースとして設定

プロジェクトの `src/prompts/chat/config.json` を開き、 `completion` ブロック内に `data_sources` を追加します。

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

`src/prompts/chat/skprompt.txt` を開き、次のようにプロンプトを更新します。

```
You are a career specialist named "Career Genie" that helps Human Resources team for finding the right candidate for the jobs. 
You are friendly and professional.
You always greet users with excitement and introduce yourself first.
You like using emojis where appropriate.
Always mention all citations in your content.
```

Visual Studio Code のターミナルを開き、プロジェクト ルートで次のスクリプトを実行します。

```powershell
npm install fs
```

`src/app/app.ts` を開き、 `OpenAIModel` に次のパラメーターを追加します。

```typescript
azureApiVersion: '2024-02-15-preview'
```

`src/app/app.ts` の先頭に次をインポートします。

```typescript
import fs from 'fs';
```
    
`src/app/app.ts` で `ActionPlanner` 内の `defaultPrompt` を次のコード スニペットに置き換えます。

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

### 手順 3: アプリをデバッグしてデータと対話

!!! pied-piper "注意事項: Test Tool ではなくローカル デバッグ"
   追加した一部の高度な機能は App Test Tool では正しく表示されない場合があります。以降は Test Tool の代わりに Teams 上でローカル デバッグを行います。

今回は Teams で Career Genie をテストします。 Visual Studio Code の **Run and Debug** タブで **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択しデバッグを開始します。ブラウザーで Microsoft Teams が開いたら、アプリ詳細画面で **Add** を選択し、チャットを開始します。

!!! tip "ローカル テストのポイント"
    本演習は Teams のローカル デバッグでテストしてください。これまで実装した Teams AI ライブラリ機能の一部は Teams App Test Tool では動作しません。

質問はデータセットに関連する内容にしましょう。 `resumes` フォルダーの PDF を確認し、データを把握してください。要件を組み合わせて複雑な質問でカスタム エンジン エージェントを試してみてください。例:

- スペイン語対応で .NET 経験 2 年以上の候補者を提案してください。
- 他に適した候補者はいますか。
- 5 年以上の Python 開発経験が必要なポジションに適した人は？
- 日本語が話せて 7 年以上の経験を持つシニア開発者ポジションに適した候補者は？

![Animation of the interaction with the Career Genie custom engine agent. The user interacts with the bot providing subsequent prompts and looking for a specific candidate based on some requirements.](../../../assets/images/custom-engine-02/byod-teams.gif)

<cc-end-step lab="bta2" exercise="3" step="3" />

---8<--- "ja/b-congratulations.md"

Azure AI Search でデータをインデックス化し、カスタム エンジン エージェントにデータを取り込むラボ BTA2 を完了しました。さらに探求したい場合は、このラボのソース コードが [Copilot Developer Camp リポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab02-RAG/CareerGenie){target=_blank} にあります。

次は Lab BTA3 - Powered by AI キットでユーザー エクスペリエンスを強化しましょう！ **Next** を選択してください。

<cc-next url="../03-powered-by-ai" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/02-rag" />