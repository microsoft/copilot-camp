---
search:
  exclude: true
---
# ラボ BTA2 - Azure AI Search でデータをインデックス

このラボでは、カスタム engine エージェントに Retrieval-Augmented Generation を有効化し、Azure AI Search と統合してデータとチャットできるようにします。

このラボで学習できること:

- Retrieval-Augmented Generation (RAG) とは何か
- Azure リソースのセットアップ
- ドキュメントを Azure AI Search にアップロード
- カスタム engine エージェントを Vector Search 用に準備
- アプリの実行とテスト方法

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/J7IZULJsagM" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## はじめに

前の演習では、カスタム engine エージェントを作成し、AI チャットボット「Career Genie」の動作を定義するプロンプトをカスタマイズしました。本演習では、求人要件に最適な候補者を見つけるために、レジュメのコレクションに対してベクトル検索を適用します。Career Genie でベクトル検索を有効化するため、「Microsoft Foundry on your data」機能を使用して次を行います。

- Azure AI Search でインデックスを作成
- レジュメ (PDF) のベクトル embedding を生成
- データをチャンクに分割して Azure AI Search にアップロード

最後に、カスタム engine エージェントを Azure AI Search と統合し、データとチャットして最良の結果を得ます。

???+ info "Retrieval-Augmented Generation (RAG) とは?"
    Retrieval-Augmented Generation (RAG) は、言語モデルが生成する応答の品質を向上させる AI 技術です。簡単な例で説明しましょう。

    スマートアシスタントが質問に答えるとします。しかし、このアシスタントはすべてを知っているわけではありません。RAG を使うと、アシスタントは大量のドキュメントや動画、画像などから情報を検索し、関連情報を取得したうえでより正確な回答を生成できます。

    RAG は次の 2 ステップを組み合わせています。

    - **Retrieval:** 大量のデータから関連情報を検索
    - **Generation:** 検索した情報を用いて詳細で正確な応答を生成
    
    これにより、RAG は質問応答、記事作成、リサーチ支援などで高品質な回答を提供できます。
    
    *RAG についてさらに知りたい方は、この Doodle to Code ビデオをご覧ください。*

    <iframe src="//www.youtube.com/embed/1k4XGgsqfTM?si=P6O9baroreDKizb" frameborder="0" allowfullscreen></iframe>

??? tip "Vector Search を使用するメリット"
    Vector search は、単なるキーワード一致ではなく意味に基づいて情報を高速かつ正確に検索する高度な手法です。数値ベクトルを用いることで、次のような検索が可能になります。

    - **意味・概念の類似性:** 異なる単語でも意味が近いコンテンツをマッチ (例: “pastry” と “croissant”)  
    - **多言語:** 言語が異なっても同義のコンテンツを検索 (例: “pastry” と ドイツ語の “gebäck”)  
    - **多様なコンテンツ形式:** テキストだけでなく画像なども横断的に検索  

    Vector search の仕組み:

    1. **テキストをベクトル化:** 単語や文を意味を表す数値ベクトルに変換  
    2. **ベクトルを保存:** ベクトルを効率的に処理できるデータベースに保存  
    3. **ベクトル検索:** クエリもベクトル化し、意味が近いベクトルを探索  

    例として「how to bake a cake」と検索すると、同じ表現がなくても「cake recipes」や「baking tips」を含む文書を見つけられます。大規模データセットで文脈と意味に基づく高精度検索を実現します。

    要するに、Vector search は言葉の背後にある意味に焦点を当て、より関連性の高い結果を提供します。

## 演習 1: Azure リソースのセットアップ

この演習を始める前に、[Azure サブスクリプションの前提条件](./00-prerequisites.md#exercise-3-get-an-azure-subscription){target=_blank} を完了しておいてください。

### 手順 1: Azure AI Search サービス リソースの作成

??? check "Azure AI Search とは?"
    Azure AI Search (旧称 Azure Cognitive Search) は、ユーザー所有コンテンツに対してセキュアな情報検索を大規模に提供し、従来型および生成 AI 検索アプリで利用できます。検索サービスを作成すると、次の機能を利用できます。

    - ベクトル検索、全文検索、ハイブリッド検索エンジン
    - データのチャンク化とベクトル化を統合したリッチなインデクシング
    - ベクトル、テキスト、ハイブリッドクエリ用の豊富なクエリ構文
    - Azure AI services や Azure OpenAI との統合

1. 任意のブラウザーで [Azure Portal](https://portal.azure.com){target=_blank} を開きます。  
1. **Create a resource** を選択し、`Azure AI Search` を検索して選択し、**Create** をクリック。  
1. 次の情報を入力し、**Review + Create** を選択します。  
    - **Subscription:** Azure AI Search 用のサブスクリプション  
    - **Resource group:** 以前 Azure OpenAI service 用に作成したリソースグループ  
    - **Name:** `copilotcamp-ai-search` など分かりやすい名前  
    - **Location:** インスタンスのリージョン  
    - **Pricing Tier:** Basic  

作成後、リソースの **Overview** で `Url` をコピーして保存します。次に **Settings** 内の **Keys** タブで `Primary admin key` をコピーして保存してください。後の演習で使用します。

<cc-end-step lab="bta2" exercise="1" step="1" />

### 手順 2: Storage Account サービス リソースの作成

1. ブラウザーで [Azure Portal](https://portal.azure.com){target=_blank} を開きます。  
1. **Create a resource** から `Storage Account` を検索し、**Create** を選択。  
1. 以下を入力し **Review** → **Create** を選択します。  
    - **Subscription:** Storage Account 用サブスクリプション  
    - **Resource group:** 以前作成したリソースグループ  
    - **Name:** `copilotcampstorage` など  
    - **Region:** リージョン  
    - **Performance:** Standard  
    - **Redundancy:** Geo-redundant storage (GRS)

<cc-end-step lab="bta2" exercise="1" step="2" />

### 手順 3: `text-embedding-ada-002` モデルの作成

??? info "`text-embedding-ada-002` の役割"
    Azure OpenAI の `text-embedding-ada-002` モデルは、テキストを意味を表す数値ベクトルに変換します。これによりベクトル検索が可能となり、複数言語や形式に対応した高度な検索ソリューションを実現できます。

[Microsoft Foundry](https://oai.azure.com/portal){target=_blank} を開き **Deployments** を選択し、**Create a new deployment** をクリックして次を入力後 **Create**:

- **Select a model:** `text-embedding-ada-002`
- **Model version:** Default
- **Deployment type:** Standard
- **Deployment name:** `text-embeddings` など
- **Content Filter:** Default

!!! tip "クォータ不足メッセージへの対処"
    モデル選択時に **No quota available** と表示された場合は以下を検討してください。  
    1. 別のバージョンまたはデプロイタイプを選択  
    2. [クォータを増やす/調整](https://oai.azure.com/portal/96d4a6668daf4335bc1273c1bb46cb4f/quota){target=_blank}

<cc-end-step lab="bta2" exercise="1" step="3" />

## 演習 2: Microsoft Foundry Chat Playground でドキュメントを Azure AI Search にアップロード

[fictitious_resumes.zip](https://github.com/microsoft/copilot-camp/raw/main/src/custom-engine-agent/Lab02-RAG/CareerGenie/fictitious_resumes.zip) をダウンロードし、解凍してください。

### 手順 1: ドキュメントを Azure AI Search にアップロード

1. [Microsoft Foundry](https://oai.azure.com/portal){target=_blank} を開き **Chat** playground を選択。**Setup** セクションで **Reset** を選び、シェイクスピア調ライティングの例を削除して空の状態にします。すでに初期状態の場合は次へ。  

     ![The Setup section of the Chat Playground in Microsoft Foundry with the commands to reset the content of the system prompt and of the user prompt highlighted.](../../../assets/images/custom-engine-02/reset-chat-playground.png)

1. **Add your data** → **Add a data source** を選択。  

    ![The UI of Microsoft Foundry with the 'Add a data source' command highlighted in the Setup section, to upload custom data sources for the current model in the Chat Playground.](../../../assets/images/custom-engine-02/add-your-data-aoai.png)

1. **Upload files (preview)** を選び、次を入力して **Next**:  
    - **Subscription:** Azure リソース作成時のサブスクリプション  
    - **Select Azure Blob storage resource:** `copilotcampstorage` を選択 (アクセス許可要求が出たら **Turn on CORS**)  
    - **Select Azure AI Search resource:** `copilotcamp-ai-search`  
    - **Enter the index name:** `resumes` など (後で使用)  
    - **Add vector search to this search resource** にチェック  
    - **Select an embedding model:** `text-embeddings`  

インデックス名は `INDEX_NAME` 環境変数で使用するのでメモしておいてください。

![The UI to add a custom data source with fields to select subscription, Azure Storage, Azure AI Search, index name, and embedding model.](../../../assets/images/custom-engine-02/add-data-source-aoai.png)

1. **Browse for a file** を選び `resumes` フォルダーの PDF を選択し **Upload files** → **Next**。  
1. **Search type** を `Vector`、**chunk size** を `1024(Default)` に設定し **Next**。  
1. **Azure resource authentication type** は `API Key` を選択し **Next**。  

データ取り込みには数分かかります。完了したらテストへ進みます。

<cc-end-step lab="bta2" exercise="2" step="1" />

!!! note "注意"
    一度データをインデックス化すると、そのインデックスは Chat Playground を閉じても Azure AI Search に残ります。Playground がリセットされ再度 Add Your Data が必要になった場合は、既存のインデックスを選択するだけで再アップロードは不要です。

### 手順 2: Microsoft Foundry でデータをテスト

データ取り込み完了後、Chat playground でデータに関する質問をします。

例: *「2 年以上の .NET 経験とスペイン語を必要とするポジションに適した候補者を提案してください」* など。

!!! tip "データを最大限活用するコツ"
    検索を試す前に `resumes` フォルダーを確認し、言語・職種・経験年数・スキルなどの多様性を把握しましょう。要件を組み合わせて検索体験を試してください。

![The Chat Playground in Microsoft Foundry once custom data has been processed. On the left side, in the Setup section, there is the configuration of the Azure AI Search service as a custom data source. On the right side, in the chat there is a sample prompt with a detailed answer based on the processed documents.](../../../assets/images/custom-engine-02/chat-with-your-data-aoai.png)

<cc-end-step lab="bta2" exercise="2" step="2" />

### 手順 3: Azure AI Search でインデックスを確認

データセットを詳しく理解するため、Chat playground の Add your data セクションで **resumes** を選択すると Azure AI Search のインデックスページへ移動します。

![The image highlights the link to the index in Azure AI Search configured in the Setup section of the Chat Playground in Microsoft Foundry](../../../assets/images/custom-engine-02/index-aoai.png)

まずベクトル内容を表示できるようにします。インデックスページで **Fields** タブを開き **contentVector** にチェックを入れて **Save**。

![The UI of Azure AI Search when adding the contentVector field to the search index with the fields tab, the contentVector field, and the save button highlighted.](../../../assets/images/custom-engine-02/add-contentvector.png)

**Search explorer** タブに戻り **Query options** を開いて **API version** を `2024-11-01-preview` に変更し **Close**。**Search** を押してデータを表示します。

!!! tip "`contentVector` パラメーターを確認"
    ドキュメントごとに `contentVector` パラメーターが含まれ、PDF の数値ベクトルが格納されています。これが Vector Search でマッチングに使用されます。

![The Search Explorer for the current index in Azure AI Search, showing search data with the contentVector field highlighted with the numeric vectors values.](../../../assets/images/custom-engine-02/contentvector-in-your-data.png)

<cc-end-step lab="bta2" exercise="2" step="3" />

## 演習 3: アプリを Azure AI Search と統合

この演習では、Azure OpenAI の text embedding デプロイ名と Azure AI Search のキー・エンドポイントを用意しておいてください。

### 手順 1: 環境変数を設定

Career Genie プロジェクトで `env/.env.local.user` を開き、次の環境変数を貼り付けます。

```json
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME='<Your-Text-Embedding-Model-Name>'
SECRET_AZURE_SEARCH_KEY='<Your-Azure-AI-Search-Key>'
AZURE_SEARCH_ENDPOINT='<Your-Azure-AI-Search-Endpoint>'
INDEX_NAME='<Your-index-name>'
```

`teamsapp.local.yml` を開き、ファイル末尾の `uses: file/createOrUpdateEnvironmentFile` の下に次を追加します。

```yml
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME: ${{AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME}}
AZURE_SEARCH_KEY: ${{SECRET_AZURE_SEARCH_KEY}}
AZURE_SEARCH_ENDPOINT: ${{AZURE_SEARCH_ENDPOINT}}
INDEX_NAME: ${{INDEX_NAME}}
```

`src/config.ts` を開き、`config` 内に次を追加します。

```typescript
azureOpenAIEmbeddingDeploymentName: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME,
azureSearchKey: process.env.AZURE_SEARCH_KEY,
azureSearchEndpoint: process.env.AZURE_SEARCH_ENDPOINT,
indexName: process.env.INDEX_NAME,
```

<cc-end-step lab="bta2" exercise="3" step="1" />

### 手順 2: Azure AI Search をデータソースとして構成

プロジェクトの `src/prompts/chat/config.json` を開き、`completion` 括弧内に `data_sources` を追加:

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

Visual Studio Code のターミナルを開き、プロジェクトルートで次のスクリプトを実行します。

```powershell
npm install fs
```

`src/app/app.ts` を開き、`OpenAIModel` に次のパラメーターを追加:

```typescript
azureApiVersion: '2024-02-15-preview'
```

`src/app/app.ts` の先頭に次をインポート:

```typescript
import fs from 'fs';
```
    
`src/app/app.ts` 内の `ActionPlanner` の `defaultPrompt` を次のコードに置き換えます。

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

### 手順 3: アプリをデバッグしてデータとチャット

!!! pied-piper "注意事項: Test Tool ではなくローカルデバッグ"
   追加した高度な機能の一部は App Test Tool 上で正しく表示されない場合があります。以降は Teams でローカルデバッグを行います。

Teams で Career Genie をテストしましょう。Visual Studio Code の **Run and Debug** タブで **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択します。ブラウザーで Microsoft Teams が起動したら、アプリ詳細画面の **Add** をクリックし、チャットを開始します。

!!! tip "ローカルでのテスト"
    Teams App Test Tool ではなく Teams でローカルデバッグしてください。これまで実装した Teams AI library 機能の一部が Test Tool でうまく動かない場合があります。

質問はデータセットに関連した内容にしましょう。`resumes` フォルダーの PDF を確認し、要件を組み合わせてカスタム engine エージェントに挑戦してください。例えば:

- Can you suggest a candidate who is suitable for spanish speaking role that requires at least 2 years of .NET experience?
- Who are the other good candidates?
- Who would be suitable for a position that requires 5+ python development experience?
- Can you suggest any candidates for a senior developer position with 7+ year experience that requires Japanese speaking?

![Animation of the interaction with the Career Genie custom engine agent. The user interacts with the bot providing subsequent prompts and looking for a specific candidate based on some requirements.](../../../assets/images/custom-engine-02/byod-teams.gif)

<cc-end-step lab="bta2" exercise="3" step="3" />

---8<--- "ja/b-congratulations.md"

Copilot
Copilot Developer Camp
Copilot Studio
Microsoft 365
M365
Azure
Microsoft Foundry
OpenAI
Visual Studio
Visual Studio Code
VS Code
Agents SDK
MCP
SharePoint

このラボ BTA2 - Azure AI Search でデータをインデックス を完了しました。さらに学習したい場合は、ラボのソースコードが [Copilot Developer Camp リポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab02-RAG/CareerGenie){target=_blank} にあります。

次はラボ BTA3 - Powered by AI kit でユーザーエクスペリエンスを向上させましょう。Next を選択してください。 

<cc-next url="../03-powered-by-ai" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/02-rag--ja" />