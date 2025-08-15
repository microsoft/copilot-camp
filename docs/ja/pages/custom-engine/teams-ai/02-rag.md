---
search:
  exclude: true
---
# ラボ BTA2 - Azure AI Search でデータをインデックス

このラボでは、カスタムエンジン エージェントに Retrieval-Augmented Generation を有効化し、Azure AI Search と統合してご自身のデータと対話できるようにします。

このラボで行うこと:

- Retrieval-Augmented Generation (RAG) とは何かを学習
- Azure リソースのセットアップ
- ドキュメントを Azure AI Search にアップロード
- カスタムエンジン エージェントを Vector Search 用に準備
- アプリの実行とテスト方法を学習

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/J7IZULJsagM" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご覧ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## はじめに

前の演習では、カスタムエンジン エージェントを作成し、AI チャットボット「Career Genie」の挙動を定義するプロンプトをカスタマイズしました。本演習では、求人要件に最適な候補者を見つけるために、履歴書コレクションに Vector Search を適用します。Career Genie で Vector Search を有効化するため、「Azure AI Foundry on your data」機能を使用して次を行います。

- Azure AI Search でインデックスを作成
- 履歴書 (PDF ドキュメント) のベクトル埋め込みを生成
- データをチャンクに分けて Azure AI Search にアップロード

最後に、カスタムエンジン エージェントと Azure AI Search を統合してデータと対話し、最適な結果を得ます。

???+ info "Retrieval-Augmented Generation (RAG) とは？"
    Retrieval-Augmented Generation (RAG) は、言語モデルが生成する回答の品質を向上させるための手法です。以下のシンプルな例で理解しましょう。

    あなたが質問に答えてくれるスマートアシスタントを持っているとします。アシスタントが素晴らしい回答をするための情報をすべて知らないことがあります。そこで RAG を使うと、アシスタントは大量のドキュメントや動画、画像などから情報を検索できます。インターネット検索と似たイメージです。関連情報を見つけた後、そのデータを使ってより良く正確な回答を生成します。

    RAG は次の 2 ステップを組み合わせています。

    - **Retrieval:** 大量のデータから関連情報を検索
    - **Generation:** その情報を用いて詳細で正確な回答を生成

    これにより、RAG は質問応答、記事作成、リサーチ支援などで、情報に基づいた有用な回答を提供できます。
    
    *Doodle to Code のビデオで RAG についてさらに学びましょう！*

    <iframe src="//www.youtube.com/embed/1k4XGgsqfTM?si=P6O9baroreDKizb" frameborder="0" allowfullscreen></iframe>

??? tip "Vector Search を使う利点"
    Vector Search は、単なるキーワード一致ではなく「意味」に基づいて情報を高速かつ高精度で検索する高度な手法です。従来のテキスト検索は正確なキーワード一致に依存しますが、Vector Search は数値ベクトルを使用し、クエリと意味的に類似するコンテンツを見つけます。これにより、Vector Search は次のようなケースに対応できます。

    - **意味・概念の類似性:** 異なる語でも意味が近い概念をマッチ (例: "pastry" と "croissant")
    - **多言語コンテンツ:** 異なる言語間で同等の内容を検索 (例: 英語 "pastry" と ドイツ語 "gebäck")
    - **複数のコンテンツ形式:** 異なるフォーマット横断で検索 (例: 文字列 "pastry" と パンの画像)

    Vector Search の流れ:
    
    1. **テキストをベクトルへ変換:** 語句や文を、その意味を捉えた数値列 (ベクトル) へ変換します。Word Embedding やディープラーニングモデルが用いられます。
    2. **ベクトルを保存:** これらのベクトルを効率的に扱える専用データベースに保存します。
    3. **ベクトル検索:** クエリもベクトル化し、意味的に近いベクトルをデータベースから検索します。

    例えば「how to bake a cake」を検索すると、テキストにそのまま書いていなくても「cake recipes」や「baking tips」のドキュメント、他言語のレシピなど、意味的に関連する情報を見つけられます。大規模データセットで文脈・意味に基づき関連情報を取得できるため、Vector Search は非常に強力です。

    要約すると、Vector Search は言葉の背後にある意味に焦点を当て、より的確で関連性の高い結果を提供します。

## Exercise 1: Azure リソースのセットアップ

開始前に [Azure subscription の前提条件](./00-prerequisites.md#exercise-3-get-an-azure-subscription){target=_blank} を完了しておいてください。

### Step 1: Azure AI Search サービス リソースを作成

??? check "Azure AI Search とは？"
    Azure AI Search (旧称 Azure Cognitive Search) は、ユーザー所有コンテンツに対し、従来型および生成 AI 検索アプリケーション向けにスケーラブルで安全な情報検索を提供します。検索サービスを作成すると、次の機能を利用できます。

    - Vector Search、全文検索、ハイブリッド検索を備えた検索エンジン
    - データのチャンク化とベクトル化を統合したリッチなインデクシング
    - Vector クエリ、テキスト検索、ハイブリッドクエリ向けの豊富なクエリ構文
    - Azure AI Services や Azure OpenAI との統合

1. 任意のブラウザーで [Azure Portal](https://portal.azure.com){target=_blank} を開きます。  
2. **Create a resource** を選択し、`Azure AI Search` を検索します。サービスを選択後、**Create** をクリックします。  
3. 以下を入力し、**Review + Create** を選択します。  
    - **Subscription:** Azure AI Search 用のサブスクリプション  
    - **Resource group:** 以前に作成した Azure OpenAI 用リソースグループ  
    - **Name:** `copilotcamp-ai-search` などのわかりやすい名前  
    - **Location:** インスタンスのリージョン  
    - **Pricing Tier:** Basic  

リソース作成後、**Overview** で `Url` をコピーして保存します。続いて **Settings** 配下の **Keys** タブで `Primary admin key` をコピーして保存してください。後続の演習で使用します。

<cc-end-step lab="bta2" exercise="1" step="1" />

### Step 2: ストレージ アカウント サービス リソースを作成

1. [Azure Portal](https://portal.azure.com){target=_blank} を開きます。  
2. **Create a resource** → `Storage Account` を検索し、サービスを選択後 **Create**。  
3. 次を入力して **Review**、**Create** の順に選択します。  
    - **Subscription:** Azure Storage Account 用サブスクリプション  
    - **Resource group:** 以前に作成した Azure OpenAI 用リソースグループ  
    - **Name:** `copilotcampstorage` などのわかりやすい名前  
    - **Region:** インスタンスのリージョン  
    - **Performance:** Standard  
    - **Redundancy:** Geo-redundant storage (GRS)  

<cc-end-step lab="bta2" exercise="1" step="2" />

### Step 3: `text-embedding-ada-002` モデルを作成

??? info "`text-embedding-ada-002` は何をする？"
    Azure OpenAI の `text-embedding-ada-002` モデルは、テキストをその意味を表す数値ベクトルに変換します。これにより、正確なワードマッチではなく意味的に近いテキストを検索する Vector Search が可能になります。多言語・多形式を扱え、Azure AI Search と組み合わせることで、最も関連性の高い情報を取得できます。高度な検索ソリューションや自然言語を理解するアプリの構築に最適です。

1. ブラウザーで [Azure AI Foundry](https://oai.azure.com/portal){target=_blank} を開き、**Deployments** を選択します。  
2. **Create a new deployment** → 以下を入力し **Create**。  
    - **Select a model:** `text-embedding-ada-002`  
    - **Model version:** Default  
    - **Deployment type:** Standard  
    - **Deployment name:** `text-embeddings` など  
    - **Content Filter:** Default  

!!! tip "クォータ不足メッセージへの対処"
    モデル選択時に **No quota available** が表示される場合、次のいずれかで対処できます。  
    1. 別バージョンまたはデプロイタイプを選択  
    2. [クォータを申請または調整](https://oai.azure.com/portal/96d4a6668daf4335bc1273c1bb46cb4f/quota){target=_blank}  

<cc-end-step lab="bta2" exercise="1" step="3" />

## Exercise 2: Azure AI Foundry Chat Playground でドキュメントを Azure AI Search にアップロード

[fictitious_resumes.zip](https://github.com/microsoft/copilot-camp/raw/main/src/custom-engine-agent/Lab02-RAG/CareerGenie/fictitious_resumes.zip) をダウンロードし、フォルダーを解凍してください。

### Step 1: ドキュメントを Azure AI Search にアップロード

1. ブラウザーで [Azure AI Foundry](https://oai.azure.com/portal){target=_blank} を開き、**Chat** playground を選択します。**Setup** セクションで **Reset** をクリックし、シェイクスピア風ライティング関連の例を削除して初期状態に戻します。すでに空のデフォルト設定であれば次へ進んでください。

     ![The Setup section of the Chat Playground in Azure AI Foundry with the commands to reset the content of the system prompt and of the user prompt highlighted.](../../../assets/images/custom-engine-02/reset-chat-playground.png)

2. **Add your data** → **Add a data source** を選択します。

    ![The UI of Azure AI Foundry with the 'Add a data source' command highlighted in the Setup section, to upload custom data sources for the current model in the Chat Playground.](../../../assets/images/custom-engine-02/add-your-data-aoai.png)

3. **Upload files (preview)** を選択し、次を入力して **Next**。  

    - **Subscription:** 作成した Azure サブスクリプション  
    - **Select Azure Blob storage resource:** `copilotcampstorage` を選択  
      (メッセージ *Azure OpenAI needs your permission to access this resource* が出たら **Turn on CORS** を選択)  
    - **Select Azure AI Search resource:** `copilotcamp-ai-search`  
    - **Enter the index name:** `resumes` など。メモしておく  
    - **Add vector search to this search resource** にチェック  
    - **Select an embedding model:** `text-embeddings`  

  インデックス名は `INDEX_NAME` 環境変数で使用するため控えてください。

![The UI to add a custom data source with fields to select subscription, Azure Storage, Azure AI Search, index name, and embedding model.](../../../assets/images/custom-engine-02/add-data-source-aoai.png)

4. **Browse for a file** をクリックし、`resumes` フォルダー内の pdf を選択。**Upload files** → **Next**。  
5. Search type を `Vector`、chunk size を `1024(Default)` に設定し **Next**。  
6. Azure resource authentication type を `API Key` にし **Next**。  

データ取り込みには数分かかります。完了したらテストへ進みます。

<cc-end-step lab="bta2" exercise="2" step="1" />

!!! note "注意"
    データをインデックスすると、Chat Playground を閉じたり更新してもインデックスは Azure AI Search に残ります。Chat Playground がリセットされ再度データ追加が必要になっても、**Upload files** で再インデックスする必要はなく、**Add Your Data** から Azure AI Search を選択し既存のインデックスを指定すればテストできます。

### Step 2: Azure AI Foundry でデータをテスト

データ取り込みが完了したら、Chat playground で質問してみましょう。

例: *"Can you suggest me a candidate who is suitable for Spanish speaking role that requires at least 2 years of .NET experience?"*

!!! tip "データを最大限活用するコツ"
    Vector Search をテストする前に `resumes` フォルダーを確認し、言語・職種・経験年数・スキルなど多様な履歴書を把握しておきましょう。スキル、言語、職種、経験年数など条件を組み合わせて質問し、検索体験を試してください。

![The Chat Playground in Azure AI Foundry once custom data has been processed. On the left side, in the Setup section, there is the configuration of the Azure AI Search service as a custom data source. On the right side, in the chat there is a sample prompt with a detailed answer based on the processed documents.](../../../assets/images/custom-engine-02/chat-with-your-data-aoai.png)

<cc-end-step lab="bta2" exercise="2" step="2" />

### Step 3: Azure AI Search でインデックスを確認

データセットをさらに理解するため、Chat playground の **Add your data** セクションで **resumes** を選択します。Azure AI Search の `resumes` インデックスページへリダイレクトされます。

![The image highlights the link to the index in Azure AI Search configured in the Setup section of the Chat Playground in Azure AI Foundry](../../../assets/images/custom-engine-02/index-aoai.png)

まずベクトルコンテンツを表示しましょう。`Resumes` インデックスページの **Fields** タブを開き、**contentVector** にチェックを入れて **Save**。

![The UI of Azure AI Search when adding the contentVector field to the search index with the fields tab, the contentVector field, and the save button highlighted.](../../../assets/images/custom-engine-02/add-contentvector.png)

**Search explorer** タブに戻り、**Query options** を選択して **API version** を `2024-11-01-preview` に変更し **Close**。**Search** を押してデータを表示します。

!!! tip "`contentVector` パラメーターについて"
    データをスクロールすると、各ドキュメントに `contentVector` パラメーターがあり、PDF ドキュメントの数値ベクトルが含まれています。Vector Search はこれらのベクトルを用いて最適な一致結果を特定します。

![The Search Explorer for the current index in Azure AI Search, showing search data with the contentVector field highlighted with the numeric vectors values.](../../../assets/images/custom-engine-02/contentvector-in-your-data.png)

<cc-end-step lab="bta2" exercise="2" step="3" />

## Exercise 3: アプリを Azure AI Search と統合

この演習では、Azure OpenAI のテキスト埋め込みデプロイ名、Azure AI Search のキーとエンドポイントを取得しておいてください。

### Step 1: 環境変数を設定

Career Genie プロジェクトで `env/.env.local.user` を開き、以下の環境変数を貼り付けます。

```json
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME='<Your-Text-Embedding-Model-Name>'
SECRET_AZURE_SEARCH_KEY='<Your-Azure-AI-Search-Key>'
AZURE_SEARCH_ENDPOINT='<Your-Azure-AI-Search-Endpoint>'
INDEX_NAME='<Your-index-name>'
```

`teamsapp.local.yml` を開き、ファイル末尾の `uses: file/createOrUpdateEnvironmentFile` の下に次のスニペットを追加します。

```yml
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME: ${{AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME}}
AZURE_SEARCH_KEY: ${{SECRET_AZURE_SEARCH_KEY}}
AZURE_SEARCH_ENDPOINT: ${{AZURE_SEARCH_ENDPOINT}}
INDEX_NAME: ${{INDEX_NAME}}
```

`src/config.ts` を開き、`config` 内に次のスニペットを追加します。

```typescript
azureOpenAIEmbeddingDeploymentName: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME,
azureSearchKey: process.env.AZURE_SEARCH_KEY,
azureSearchEndpoint: process.env.AZURE_SEARCH_ENDPOINT,
indexName: process.env.INDEX_NAME,
```

<cc-end-step lab="bta2" exercise="3" step="1" />

### Step 2: Azure AI Search をデータソースとして設定

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

`src/prompts/chat/skprompt.txt` を開き、以下のようにプロンプトを更新します。

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

`src/app/app.ts` を開き、`OpenAIModel` に次のパラメーターを追加します。

```typescript
azureApiVersion: '2024-02-15-preview'
```

`src/app/app.ts` の先頭に次のインポートを追加します。

```typescript
import fs from 'fs';
```
    
`src/app/app.ts` で `ActionPlanner` 内の `defaultPrompt` を次のコードスニペットに置き換えます。

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

### Step 3: アプリをデバッグしてデータと対話

!!! pied-piper "注意事項: Test Tool ではなくローカルデバッグを使用"
   ここまでで追加した高度な機能は App Test Tool では正しく表示されない場合があります。以降は Test Tool を使わず、Teams 上でローカルデバッグを行ってください。

Teams で Career Genie をテストします。Visual Studio Code の **Run and Debug** タブから **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択してデバッグを開始します。ブラウザーに Microsoft Teams が表示されたら、アプリ詳細画面で **Add** を選択し、チャットを開始します。

!!! tip "ローカルテストのコツ"
    Teams AI ライブラリの一部機能は App Test Tool でうまく動作しないため、必ず Teams 上でローカルデバッグしてください。

質問はデータセットに関連した内容にしましょう。`resumes` フォルダーの PDF ドキュメントを確認し、データを把握してください。条件を組み合わせて複雑な質問でカスタムエンジン エージェントに挑戦しましょう。例:

- Can you suggest a candidate who is suitable for spanish speaking role that requires at least 2 years of .NET experience?
- Who are the other good candidates?
- Who would be suitable for a position that requires 5+ python development experience?
- Can you suggest any candidates for a senior developer position with 7+ year experience that requires Japanese speaking?

![Animation of the interaction with the Career Genie custom engine agent. The user interacts with the bot providing subsequent prompts and looking for a specific candidate based on some requirements.](../../../assets/images/custom-engine-02/byod-teams.gif)

<cc-end-step lab="bta2" exercise="3" step="3" />

---8<--- "ja/b-congratulations.md"

Azure AI Search にデータを取り込み、カスタムエンジン エージェントで活用するラボ BTA2 を完了しました！さらに探求したい場合は、このラボのソースコードが [Copilot Developer Camp リポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab02-RAG/CareerGenie){target=_blank} にあります。

次は ラボ BTA3 - Powered by AI キットでユーザー エクスペリエンスを強化 に進みましょう。**Next** を選択してください。 

<cc-next url="../03-powered-by-ai" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/02-rag--ja" />