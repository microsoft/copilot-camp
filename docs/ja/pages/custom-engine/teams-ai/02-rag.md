---
search:
  exclude: true
---
# Lab BTA2 - Azure AI Search でデータをインデックス化

このラボでは、カスタムエンジン エージェントで Retrieval-Augmented Generation を有効にし、Azure AI Search と統合してご自身のデータとチャットできるようにします。

このラボで行うこと:

- Retrieval-Augmented Generation (RAG) を学ぶ  
- Azure リソースをセットアップする  
- ドキュメントを Azure AI Search にアップロードする  
- カスタムエンジン エージェントを Vector Search に対応させる  
- アプリの実行方法とテスト方法を学ぶ  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/J7IZULJsagM" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要を手早く確認しましょう。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## Introduction

前の演習では、カスタムエンジン エージェントを作成し、AI チャットボット Career Genie の挙動を定義するプロンプトをカスタマイズしました。本演習では、ベクトル検索を履歴書のコレクションに適用し、募集要件に最適な候補者を探します。Career Genie でベクトル検索を有効化するため、「Azure AI Foundry on your data」機能を使用して次を行います。

- Azure AI Search にインデックスを作成する  
- 履歴書 (PDF) のベクトル埋め込みを生成する  
- データをチャンクに分割し Azure AI Search へアップロードする  

最後に、カスタムエンジン エージェントを Azure AI Search と統合し、データとチャットして最適な結果を得ます。

???+ info "Retrieval-Augmented Generation (RAG) とは?"
    Retrieval-Augmented Generation (RAG) は、言語モデルが生成する応答の品質を向上させる AI 技術です。簡単な例で説明しましょう。

    あなたが質問に答えてくれるスマートアシスタントを持っているとします。このアシスタントは、すべての知識を持っているわけではありません。RAG を使うと、アシスタントは大量のドキュメントや動画、画像などを検索し、関連情報を取得できます。その情報を基に、より正確な回答を生成します。

    RAG は 2 つのステップを組み合わせています。

    - **Retrieval:** 大量のデータから関連情報を検索  
    - **Generation:** 検索結果を用いて詳細で正確な応答を生成  

    こうして RAG は、質問応答、記事執筆、リサーチ支援などで有用な、より情報豊富で役立つ回答を提供します。
    
    *RAG についてさらに知りたい場合は、この Doodle to Code 動画をご覧ください。*

    <iframe src="//www.youtube.com/embed/1k4XGgsqfTM?si=P6O9baroreDKizb" frameborder="0" allowfullscreen></iframe>

??? tip "Vector Search の利点"
    Vector Search は、単なるキーワード一致ではなく「意味」に基づいて情報を高速・高精度で検索する高度な手法です。ベクトル検索は次のようなケースを扱えます。

    - **意味・概念的な類似性:** 異なる単語でも意味が近いものをマッチ (例: “pastry” と “croissant”)  
    - **多言語コンテンツ:** 異なる言語間で同等の内容を検索 (例: 英語 “pastry” と ドイツ語 “gebäck”)  
    - **複数のコンテンツ形式:** テキストと画像など異なる形式を横断検索  

    ベクトル検索の仕組み:

    1. **テキストをベクトルに変換:** 単語や文章を意味を捉えた数値 (ベクトル) に変換  
    2. **ベクトルを保存:** 専用のデータベースに効率的に保存  
    3. **ベクトルで検索:** クエリもベクトル化し、意味的に近いベクトルを検索  

    たとえば “how to bake a cake” で検索した場合、同じ表現がなくても “cake recipes” や “baking tips” を含むドキュメント、さらには他言語のレシピも見つけられます。

    要約すると、ベクトル検索は言葉の背後にある意味に着目し、より正確で関連性の高い結果を提供します。

## Exercise 1: Azure リソースをセットアップする

この演習を始める前に、[Azure サブスクリプションの前提条件](./00-prerequisites.md#exercise-3-get-an-azure-subscription){target=_blank} を完了しておいてください。

### Step 1: Azure AI Search サービス リソースを作成する

??? check "Azure AI Search とは?"
    Azure AI Search (旧称 Azure Cognitive Search) は、ユーザー所有コンテンツに対し、安全かつスケーラブルな情報検索を提供します。サービスを作成すると、次の機能が利用できます。

    - ベクトル、全文、ハイブリッド検索用の検索エンジン  
    - データチャンク化とベクトル化を統合したリッチなインデックス作成  
    - ベクトルクエリ、テキスト検索、ハイブリッドクエリ向けの豊富なクエリ構文  
    - Azure AI サービスおよび Azure OpenAI との統合  

1. 任意のブラウザーで [Azure Portal](https://portal.azure.com){target=_blank} を開きます。  
1. **Create a resource** を選択し、`Azure AI Search` を検索します。サービスを選択し **Create** をクリックします。  
1. 以下を入力し **Review + Create** を選択します。  
    - **Subscription:** ご利用の Azure サブスクリプション  
    - **Resource group:** 以前に作成した Azure OpenAI 用のリソース グループ  
    - **Name:** 例 `copilotcamp-ai-search` など分かりやすい名前  
    - **Location:** インスタンスのリージョン  
    - **Pricing Tier:** Basic  

作成後、リソースの **Overview** で `Url` をコピーして保存します。続いて **Settings** 内の **Keys** タブを開き、`Primary admin key` をコピーして保存してください。これらは後の演習で使用します。

<cc-end-step lab="bta2" exercise="1" step="1" />

### Step 2: ストレージ アカウント サービス リソースを作成する

1. [Azure Portal](https://portal.azure.com){target=_blank} を開きます。  
1. **Create a resource** を選択し、`Storage Account` を検索して **Create**。  
1. 以下を入力し **Review**、次に **Create** を選択します。  
    - **Subscription:** ご利用の Azure サブスクリプション  
    - **Resource group:** 以前に作成した Azure OpenAI 用のリソース グループ  
    - **Name:** 例 `copilotcampstorage`  
    - **Region:** リージョン  
    - **Performance:** Standard  
    - **Redundancy:** Geo-redundant storage (GRS)  

<cc-end-step lab="bta2" exercise="1" step="2" />

### Step 3: `text-embedding-ada-002` モデルをデプロイする

??? info "`text-embedding-ada-002` は何をする?"
    `text-embedding-ada-002` はテキストを意味を表す数値ベクトルに変換します。これにより、キーワード一致ではなく意味に基づくベクトル検索が可能になります。多言語・多形式を扱え、Azure AI Search と組み合わせることで文脈に沿った高精度な結果が得られます。高度な検索ソリューションや自然言語を理解するアプリに最適です。

ブラウザーで [Azure AI Foundry](https://oai.azure.com/portal){target=_blank} を開き **Deployments** を選択。**Create a new deployment** を選び、次を入力して **Create**。

- **Select a model:** `text-embedding-ada-002`  
- **Model version:** Default  
- **Deployment type:** Standard  
- **Deployment name:** 例 `text-embeddings`  
- **Content Filter:** Default  

!!! tip "No quota available と表示された場合"
    モデル選択時に **No quota available** が表示されたら、以下を試してください。  
    1. 別バージョンまたは異なる Deployment type を選択  
    2. 他のデプロイのリソースを解放し、[クォータの増加または調整](https://oai.azure.com/portal/96d4a6668daf4335bc1273c1bb46cb4f/quota){target=_blank} を申請  

<cc-end-step lab="bta2" exercise="1" step="3" />

## Exercise 2: Azure AI Foundry Chat Playground でドキュメントを Azure AI Search にアップロードする

[fictitious_resumes.zip](https://github.com/microsoft/copilot-camp/raw/main/src/custom-engine-agent/Lab02-RAG/CareerGenie/fictitious_resumes.zip) をダウンロードし、解凍してください。

### Step 1: ドキュメントを Azure AI Search にアップロードする

1. [Azure AI Foundry](https://oai.azure.com/portal){target=_blank} を開き **Chat** playground を選択します。**Setup** セクションで **Reset** をクリックし、シェイクスピア関連の例を削除して初期状態にします。すでに空の状態であれば次へ進みます。  

     ![The Setup section of the Chat Playground in Azure AI Foundry with the commands to reset the content of the system prompt and of the user prompt highlighted.](../../../assets/images/custom-engine-02/reset-chat-playground.png)

1. **Add your data** → **Add a data source** を選択。  

    ![The UI of Azure AI Foundry with the 'Add a data source' command highlighted in the Setup section, to upload custom data sources for the current model in the Chat Playground.](../../../assets/images/custom-engine-02/add-your-data-aoai.png)

1. **Upload files (preview)** を選択し、以下を入力して **Next**。  

    - **Subscription:** 作成したサブスクリプション  
    - **Select Azure Blob storage resource:** `copilotcampstorage` (アクセス許可要求が出たら **Turn on CORS** を選択)  
    - **Select Azure AI Search resource:** `copilotcamp-ai-search`  
    - **Enter the index name:** 例 `resumes` (後で `INDEX_NAME` に使用)  
    - **Add vector search to this search resource** をチェック  
    - **Select an embedding model:** `text-embeddings`  

![The UI to add a custom data source with fields to select subscription, Azure Storage, Azure AI Search, index name, and embedding model.](../../../assets/images/custom-engine-02/add-data-source-aoai.png)

1. **Browse for a file** で `resumes` フォルダー内の PDF を選択し **Upload files** → **Next**。  
1. **Search type** は `Vector`、**chunk size** は `1024(Default)` を選択し **Next**。  
1. **Azure resource authentication type** は `API Key` を選択し **Next**。  

データ取り込みには数分かかります。完了したらテストへ進みます。

<cc-end-step lab="bta2" exercise="2" step="1" />

!!! note "注意"
    一度インデックス化すると、Chat Playground を閉じたり更新しても Azure AI Search 上のインデックスは残ります。もし Playground がリセットされても、**Add Your Data** で Azure AI Search を選び既存のインデックスを指定すれば再アップロードは不要です。

### Step 2: Azure AI Foundry でデータをテストする

データ取り込み後、Chat playground で質問してみましょう。

例: *"Can you suggest me a candidate who is suitable for Spanish speaking role that requires at least 2 years of .NET experience?"*

!!! tip "データを活用するコツ"
    質問する前に `resumes` フォルダーを確認し、言語・職種・経験年数・スキルなどを把握しましょう。要件を組み合わせて検索精度を試すと効果的です。

![The Chat Playground in Azure AI Foundry once custom data has been processed. On the left side, in the Setup section, there is the configuration of the Azure AI Search service as a custom data source. On the right side, in the chat there is a sample prompt with a detailed answer based on the processed documents.](../../../assets/images/custom-engine-02/chat-with-your-data-aoai.png)

<cc-end-step lab="bta2" exercise="2" step="2" />

### Step 3: Azure AI Search でインデックスを確認する

Chat playground の **Add your data** セクションで **resumes** をクリックすると、Azure AI Search のインデックス ページに移動します。

![The image highlights the link to the index in Azure AI Search configured in the Setup section of the Chat Playground in Azure AI Foundry](../../../assets/images/custom-engine-02/index-aoai.png)

まずベクトル内容を表示できるようにします。Resumes インデックス ページで **Fields** タブを開き **contentVector** をチェックして **Save**。

![The UI of Azure AI Search when adding the contentVector field to the search index with the fields tab, the contentVector field, and the save button highlighted.](../../../assets/images/custom-engine-02/add-contentvector.png)

次に **Search explorer** タブへ戻り **Query options** を開いて **API version** を `2024-11-01-preview` に変更し **Close**。**Search** を押してデータを表示します。

!!! tip "`contentVector` パラメーターを確認"
    各ドキュメントには `contentVector` が含まれ、PDF の数値ベクトルが格納されています。これが Vector Search でマッチングに使われます。

![The Search Explorer for the current index in Azure AI Search, showing search data with the contentVector field highlighted with the numeric vectors values.](../../../assets/images/custom-engine-02/contentvector-in-your-data.png)

<cc-end-step lab="bta2" exercise="2" step="3" />

## Exercise 3: アプリを Azure AI Search と統合する

この演習では、Azure OpenAI のテキスト埋め込みデプロイ名と Azure AI Search のキー・エンドポイントを取得しておいてください。

### Step 1: 環境変数を設定する

Career Genie プロジェクトで `env/.env.local.user` を開き、次の環境変数を貼り付けます。

```json
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME='<Your-Text-Embedding-Model-Name>'
SECRET_AZURE_SEARCH_KEY='<Your-Azure-AI-Search-Key>'
AZURE_SEARCH_ENDPOINT='<Your-Azure-AI-Search-Endpoint>'
INDEX_NAME='<Your-index-name>'
```

`teamsapp.local.yml` を開き、`uses: file/createOrUpdateEnvironmentFile` の下に次のスニペットを追加します。

```yml
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME: ${{AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME}}
AZURE_SEARCH_KEY: ${{SECRET_AZURE_SEARCH_KEY}}
AZURE_SEARCH_ENDPOINT: ${{AZURE_SEARCH_ENDPOINT}}
INDEX_NAME: ${{INDEX_NAME}}
```

`src/config.ts` を開き、`config` 内に以下を追加します。

```typescript
azureOpenAIEmbeddingDeploymentName: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME,
azureSearchKey: process.env.AZURE_SEARCH_KEY,
azureSearchEndpoint: process.env.AZURE_SEARCH_ENDPOINT,
indexName: process.env.INDEX_NAME,
```

<cc-end-step lab="bta2" exercise="3" step="1" />

### Step 2: Azure AI Search をデータ ソースとして設定する

プロジェクトの `src/prompts/chat/config.json` を開き、`completion` ブロック内に `data_sources` を追加します。

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

`src/prompts/chat/skprompt.txt` を開き、次のように更新します。

```
You are a career specialist named "Career Genie" that helps Human Resources team for finding the right candidate for the jobs. 
You are friendly and professional.
You always greet users with excitement and introduce yourself first.
You like using emojis where appropriate.
Always mention all citations in your content.
```

Visual Studio Code のターミナルでプロジェクト ルートから次のスクリプトを実行します。

```powershell
npm install fs
```

`src/app/app.ts` を開き、`OpenAIModel` に次のパラメーターを追加します。

```typescript
azureApiVersion: '2024-02-15-preview'
```

`src/app/app.ts` の先頭に次をインポートします。

```typescript
import fs from 'fs';
```
    
さらに `src/app/app.ts` で `ActionPlanner` の `defaultPrompt` を次のコードに置き換えます。

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

### Step 3: アプリをデバッグしデータとチャットする

!!! pied-piper "注意事項: Test Tool ではなくローカルでデバッグ"
    実装した高度な機能は App Test Tool では正しく表示されない場合があります。今後は Teams でローカル デバッグを行いましょう。

Teams で Career Genie をテストします。Visual Studio Code の **Run and Debug** タブで **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択します。ブラウザーで Microsoft Teams が開いたら、アプリ詳細画面で **Add** をクリックしチャットを開始します。

!!! tip "ローカルでのテスト推奨"
    Teams App Test Tool では一部機能が動作しないため、必ず Teams 上でローカル デバッグしてください。

質問はデータセットに関連するものにしましょう。`resumes` フォルダー内の PDF を確認し、要件を組み合わせてエージェントに挑戦してみてください。例:

- Can you suggest a candidate who is suitable for spanish speaking role that requires at least 2 years of .NET experience?  
- Who are the other good candidates?  
- Who would be suitable for a position that requires 5+ python development experience?  
- Can you suggest any candidates for a senior developer position with 7+ year experience that requires Japanese speaking?  

![Animation of the interaction with the Career Genie custom engine agent. The user interacts with the bot providing subsequent prompts and looking for a specific candidate based on some requirements.](../../../assets/images/custom-engine-02/byod-teams.gif)

<cc-end-step lab="bta2" exercise="3" step="3" />

---8<--- "ja/b-congratulations.md"

このラボ BTA2 ‑ Azure AI Search でデータをインデックス化し、カスタムエンジン エージェントに取り込む作業が完了しました。さらに深掘りしたい場合は、[Copilot Developer Camp リポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab02-RAG/CareerGenie){target=_blank} でソースコードを確認できます。

次は Lab BTA3 ‑ Powered by AI kit でユーザー エクスペリエンスを強化しましょう。**Next** を選択してください。 

<cc-next url="../03-powered-by-ai" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/02-rag--ja" />