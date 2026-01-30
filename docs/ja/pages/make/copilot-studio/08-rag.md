---
search:
  exclude: true
---
# ラボ MCS8 - RAG のための Azure AI Search 統合

このラボでは、Microsoft Copilot Studio のエージェントに Azure AI Search を活用した RAG (Retrieval-Augmented Generation) 機能を追加する方法を学習します。ベクトル検索によって候補者のドキュメントを検索し、組織のデータに裏付けられたインテリジェントかつコンテキストに応じた回答を提供する、人事向けの特化型 HR Knowledge エージェントを作成します。本ラボでは、Copilot Studio の会話能力と Azure AI Search の高度な検索機能を組み合わせた強力な AI エージェントの作成方法を紹介します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ofd2pLMVvS0" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご確認ください。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! important
    Microsoft Copilot Studio でのエージェント作成と、基本的な Azure リソース管理の経験が必要です。

このラボで学ぶこと:

- 知識インデックス用に Azure AI Search サービスを作成・構成する方法
- Azure AI Search を使用して PDF ドキュメントをインポートし、ベクトル化する方法
- Azure AI Search を Microsoft Copilot Studio の知識ソースとして統合する方法
- RAG を活用したインテリジェントなドキュメント検索エージェントを作成する方法

??? info "Retrieval-Augmented Generation (RAG) とは?"
    Retrieval-Augmented Generation (RAG) は、言語モデルが生成する回答の品質を向上させるための AI 技術です。簡単な例で説明します。

    スマートアシスタントが質問に答えるとき、必要な情報がすべて揃っていない場合があります。RAG は、アシスタントが大量のドキュメントを検索して関連情報を取得し、その情報を使ってより正確な回答を作成できるようにします。

    RAG は次の 2 つのステップを組み合わせます:

    - **Retrieval:** 大量のデータから関連情報を検索する
    - **Generation:** 検索結果を基に詳細で正確な回答を生成する
    
    これにより、質問応答、記事作成、調査支援などで、より有益で信頼性の高い回答が得られます。

    *RAG について詳しくは、こちらの Doodle to Code ビデオをご覧ください。*

    <iframe src="//www.youtube.com/embed/1k4XGgsqfTM?si=P6O9baroreDKizb" frameborder="0" allowfullscreen></iframe>

??? tip "Vector Search を使用する利点"
    ベクトル検索は、単なるキーワード一致ではなく “意味” に基づいて情報を高速かつ正確に見つける高度な技術です。従来のテキスト検索がキーワードの完全一致に依存するのに対し、ベクトル検索は数値ベクトルを用いてクエリと類似した内容を探します。これにより、以下が可能になります。

    - **意味・概念の類似性:** 異なる単語でも意味が近いコンセプトをマッチング (例: 「recruitment」と「hiring」)
    - **多言語コンテンツ:** 異なる言語間の同義内容を検索 (例: 「resume」と「curriculum vitae」)
    - **複数コンテンツ形式:** テキストドキュメントや PDF など、形式をまたいだ検索
    
    ベクトル検索の仕組み:

    1. **テキストをベクトルへ変換:** テキストやドキュメントを、その意味を表す数値 (ベクトル) に変換 (Embedding モデルを使用)
    2. **ベクトルを保存:** これらのベクトルを効率的に扱う専用データベース (例: Azure AI Search インデックス) に保存
    3. **ベクトルで検索:** クエリもベクトルに変換し、インデックス内で意味的に近いベクトルを検索

    例えば「software engineering skills」で検索すると、「programming expertise」や「development capabilities」を持つ候補者もヒットします。

## Exercise 1: Azure AI Search サービスのセットアップ

この演習では、RAG 対応エージェントの知識基盤となる Azure AI Search サービスを作成・構成します。

### Step 1: Azure AI Search サービス リソースの作成

Microsoft Copilot Studio と統合する前に、ドキュメントを格納・インデックス化する Azure AI Search サービスをセットアップします。

[Azure Portal](https://portal.azure.com){target=_blank} にアクセスし、Azure AI Search サービスを作成します。

1. **Create a resource** を選択し `Azure AI Search` を検索  
1. Azure AI Search サービスを選択し **Create**  
1. 次の項目を入力し **Review + Create** を選択  

    - **Subscription:** ご自身の Azure サブスクリプション  
    - **Resource group:** 他のラボで使用したもの、または新規作成 (例: `copilot-camp-rg`)  
    - **Service name:** `copilotcamp-ai-search` など一意の名前  
    - **Location:** 他の Azure リソースと同じリージョン  
    - **Pricing tier:** Basic (本ラボでは十分)  

![The Azure portal interface showing the creation of a new Azure AI Search service with the required fields filled in including subscription, resource group, service name, location, and pricing tier.](../../../assets/images/make/copilot-studio-08/azure-search-01.png)

サービス作成後、リソース画面で次を取得して保存します。

1. **Overview** で **URL** をコピー  
1. 左ナビの **Settings** → **Keys** で **Primary admin key** をコピー  

これらは後ほど Microsoft Copilot Studio から Azure AI Search に接続する際に使用します。

<cc-end-step lab="mcs8" exercise="1" step="1" />

### Step 2: Azure Storage Account の作成

インデックス化するドキュメントを保管するため、Azure Storage Account を作成します。

Azure Portal で Storage Account を作成:

1. **Create a resource** を選択し `Storage Account` を検索  
1. Storage Account を選択し **Create**  
1. 次の項目を入力し **Review + Create** を選択  

    - **Subscription:** ご自身の Azure サブスクリプション  
    - **Resource group:** Azure AI Search と同じリソース グループ  
    - **Storage account name:** `copilotcampstorage` など一意の名前  
    - **Region:** Azure AI Search と同じリージョン  
    - **Preferred storage type:** Azure Blob Storage または Azure Data Lake Storage Gen 2  
    - **Performance:** Standard  
    - **Redundancy:** Locally redundant storage (LRS)  

![The Azure portal interface showing the creation of a storage account with the basic configuration including subscription, resource group, storage account name, region, performance, and redundancy settings.](../../../assets/images/make/copilot-studio-08/azure-storage-01.png)

ストレージ アカウントが作成されたら、PDF ドキュメントを保存するために使用します。

<cc-end-step lab="mcs8" exercise="1" step="2" />

### Step 3: テキスト埋め込みモデルの作成

ベクトル検索を有効化するため、Azure OpenAI でテキストをベクトルに変換する埋め込みモデルを作成します。

まだ Azure OpenAI サービス インスタンスがない場合は、先に作成します。

1. Azure Portal で **Create a resource** → `Azure OpenAI` を検索  
1. **Azure OpenAI** → **Create**  
1. 次を入力  

    - **Subscription:** ご自身の Azure サブスクリプション  
    - **Resource group:** 他のリソースと同じ  
    - **Region:** East US、West Europe など Azure OpenAI 対応リージョン  
    - **Name:** `copilotcamp-openai` など  
    - **Pricing tier:** Standard S0  

1. **Next** でウィザードを進め **Create**  
1. デプロイ完了を待機 (数分)  
1. リソース作成後、エンドポイント URL を控える  

次に [Microsoft Foundry](https://oai.azure.com/portal){target=_blank} に移動します。初回アクセス時は先ほど作成した Azure OpenAI インスタンスを選択します。以下の手順で埋め込みモデルを作成します。

1. 左ナビで 1️⃣ **Deployments**  
1. 2️⃣ **+ Deploy model**  
1. 3️⃣ **Deploy base model** を選択  
1. ポップアップで 4️⃣ `text-embedding-ada-002` を検索  
1. 5️⃣ **Confirm**  
1. 設定ダイアログで次を入力  

    - **Deployment name:** `text-embeddings` (後で使用)  
    - **Deployment type:** Standard  
    - **Model version:** 2 (Default)  
    - **Content Filter:** DefaultV2  

1. 6️⃣ **Deploy** を選択し完了を待機  

![The Azure OpenAI deployment interface showing the creation of a text-embedding-ada-002 model with the specified configuration including model selection, version, deployment type, name, and content filter settings.](../../../assets/images/make/copilot-studio-08/openai-embedding-01.png)

??? info "`text-embedding-ada-002` は何をするのか?"
    Azure OpenAI の `text-embedding-ada-002` モデルは、テキストをその意味を表す数値ベクトルに変換します。これによりキーワード一致ではなく意味的類似性で検索が可能になります。多言語・多形式に対応しており、Azure AI Search と組み合わせることで最も関連性の高い情報を取得します。高度な検索ソリューションや自然言語理解が必要なアプリに最適です。

!!! tip "ヒント: クォータ制限への対処"
    「No quota available」と表示された場合は次のいずれかを試してください。

    1. 別のリージョンでデプロイ  
    1. Azure OpenAI のクォータ管理ページから追加クォータを申請  
    1. 使っていないデプロイメントを削除してリソースを解放  

<cc-end-step lab="mcs8" exercise="1" step="3" />

## Exercise 2: 検索インデックスの作成とデータ投入

この演習では、Azure AI Search に検索インデックスを作成し、ベクトル化機能を使って候補者の履歴書 (レジュメ) を登録します。

### Step 1: サンプルドキュメントの準備

まず、検索対象となるサンプルの履歴書をダウンロードします。[fictitious_resumes.zip](https://github.com/microsoft/copilot-camp/raw/main/src/custom-engine-agent/Lab02-RAG/CareerGenie/fictitious_resumes.zip) を取得し、解凍して PDF ファイルを取り出します。

これらのサンプル履歴書には、以下のような情報が含まれています。

- 候補者の氏名・連絡先
- 技術スキルや専門分野
- 職務経験と役割
- 学歴
- 語学力
- 資格・認定

ドキュメントの内容を確認して、RAG 対応エージェントが検索できる情報を把握しましょう。文書は複数言語で書かれていますが、`text-embedding-ada-002` モデルとベクトルインデックスでは問題ありません。

<cc-end-step lab="mcs8" exercise="2" step="1" />

### Step 2: サンプルドキュメントを Storage Account にアップロード

Azure AI Search でベクトルインデックスを作成するため、先ほどの履歴書をストレージにアップロードします。

[Azure Portal](https://portal.azure.com/){target=_blank} で Storage Account サービス インスタンスを開きます。

1. 左ナビ **Data storage** グループから 1️⃣ **Containers**  
1. コマンドバーで 2️⃣ **+ Add container**  
1. 3️⃣ コンテナー名を入力 (例: `resumes`)  
1. 4️⃣ **Create**  

![The Azure Storage Account service instance while showing the "Containers" page. There is a command to "+ Add container" highlighted.](../../../assets/images/make/copilot-studio-08/azure-storage-02.png)

コンテナー作成後、次の手順でファイルをアップロードします。

1. 1️⃣ **Upload** を選択  
1. ドラッグ & ドロップ、または 2️⃣ **Browse for files** で履歴書ファイルを選択  
1. 3️⃣ **Upload** をクリックし完了を待機  

![The Azure Storage Account service instance while uploading files in target container. The commands to upload files are highlighted.](../../../assets/images/make/copilot-studio-08/azure-storage-03.png)

<cc-end-step lab="mcs8" exercise="2" step="2" />

### Step 3: 統合ベクトル化によるインデックス作成

履歴書ファイルのアップロード後、[Azure Portal](https://portal.azure.com/){target=_blank} のホームに戻り、Azure AI Search サービス インスタンスを開きます。上部コマンドバーの **Import data (new)** を選択します。

![The Azure AI Search service instance overview page with basic information about the service instance. There is a command to "Import data (new)" highlighted.](../../../assets/images/make/copilot-studio-08/azure-search-02.png)

表示されたページでデータインポートを設定します。データソースとして **Azure Blob Storage** を選択。

![The Azure AI Search service instance page to start importing data. There is the "Azure Blob Storage" data source highlighted.](../../../assets/images/make/copilot-studio-08/azure-search-03.png)

続いてターゲット シナリオに **RAG** を選択。

![The Azure AI Search service instance page to choose the target scenario. There is the "RAG" scenario highlighted.](../../../assets/images/make/copilot-studio-08/azure-search-04.png)

RAG シナリオを次の設定で構成します。

1. **Configure your Azure Blob Storage**  
    - **Subscription:** ご自身のサブスクリプション  
    - **Storage account:** 先ほど作成した Storage Account  
    - **Blob container:** `resumes` などアップロード先コンテナー  
    - **Blob folder:** フォルダー構造を作成していない場合は空白  
    - **Parsing mode:** `Default`  
    - **Next** へ進む  

1. **Vectorize your text**  
    - **Kind:** Azure OpenAI  
    - **Subscription:** ご自身のサブスクリプション  
    - **Azure Open AI service:** 作成した Azure OpenAI インスタンス  
    - **Model deployment:** `text-embeddings`  
    - **Authentication type:** `API Key` (既定)  
    - コスト承認のチェックボックスをオン  
    - **Next**  

1. **Vectorize your images**  
    - 画像を処理しない場合はそのまま **Next**  

1. **Advanced ranking and relevancy**  
    - スケジュール更新やセマンティックランカーなど必要に応じて設定  
    - ここでは **Next**  

1. **Review and create**  
    - インデックス・インデクサーなどのプレフィックスに `resumes` などを入力  
    - 設定を確認し **Create** を選択  

![The Azure AI Search service instance page to recap the settings that will be applied when creating and feeding the vector index.](../../../assets/images/make/copilot-studio-08/azure-search-05.png)

インデックス作成完了後、ダイアログが表示されます。**Start searching** を選択してインデックスを確認できます。**Search** を実行すると結果が表示され、各ドキュメントには `text_vector` フィールドがあり、`text-embedding-ada-002` モデルでベクトル化されていることがわかります。

![The Azure AI Search vector index showing the results of a get all query with the "text_vector" field highlighted.](../../../assets/images/make/copilot-studio-08/azure-search-06.png)

<cc-end-step lab="mcs8" exercise="2" step="3" />

## Exercise 3: RAG 対応エージェントの作成

この演習では、Azure AI Search インデックスを利用して候補者情報を提供する Microsoft Copilot Studio エージェントを作成します。

### Step 1: HR Knowledge エージェントの作成

[Microsoft Copilot Studio](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、知識検索に最適化された新しいエージェントを作成します。

作業アカウントで `Copilot Dev Camp` 環境に入り、以下のようにエージェントを定義します。

- **Name**: 

```text
HR Knowledge Agent
```

- **Description**: 

```text
An intelligent HR assistant that searches through candidate documents using advanced 
vector search capabilities to provide contextual, document-backed responses
```

- **Instructions**: 

```text
You are an intelligent HR Knowledge Assistant specializing in candidate search. 
You have access to a comprehensive database of candidate resumes through advanced 
vector search capabilities.

When users ask questions, you should:

1. Search through the candidate database using semantic understanding
2. Provide detailed, accurate information based on the indexed documents
3. Always include proper citations and references to source documents
4. Explain your reasoning when matching candidates to requirements
5. Suggest alternative candidates when exact matches aren't available
6. Help users understand the skills and qualifications of different candidates

You excel at:
- Finding candidates with specific technical skills
- Matching language requirements with candidate profiles
- Identifying experience levels and career progression
- Understanding educational backgrounds and certifications
- Semantic search that goes beyond keyword matching

Always provide helpful, accurate information while respecting privacy and being professional.
```

![The Microsoft Copilot Studio user experience when creating the "HR Knowledge Agent". There are name, description, and instructions accordingly to the above suggeted settings.](../../../assets/images/make/copilot-studio-08/mcs-agent-01.png)

**Publish** を選択してエージェントを公開します。

公開後、エージェントの **Overview** タブで `GPT-4.1` モデルが選択されていることを確認してください。

<cc-end-step lab="mcs8" exercise="3" step="1" />

### Step 2: Azure AI Search を知識ソースとして追加

Azure AI Search インデックスをエージェントの知識ソースとして統合します。

**Knowledge** セクションで次を実行:

1. **+ Add knowledge** を選択  
1. **Add knowledge** ダイアログで **Featured**  
1. **Azure AI Search** を選択  

![The knowledge sources interface showing the option to add Azure AI Search as a featured knowledge source, with various other knowledge source options visible.](../../../assets/images/make/copilot-studio-08/mcs-add-knowledge-01.png)

Azure AI Search 接続を構成:

1. **Create new connection**  
1. 認証を設定  

    - **Authentication type:** Access Key  
    - **Azure AI Search Endpoint URL:** 先ほど保存した URL  
    - **Azure AI Search Admin Key:** コピーした Admin Key  

1. **Create** をクリック (成功すると緑のチェックマーク)

![The Azure AI Search connection configuration dialog showing the authentication type selection, endpoint URL field, and admin key field for establishing the connection.](../../../assets/images/make/copilot-studio-08/mcs-add-knowledge-02.png)

知識ソースの設定を完了:

1. インデックス `resumes` (作成時の名前) を選択  
1. **Add to agent** をクリック  

![The Azure AI Search connection configuration dialog allowing you to select the index to use as the new knowledge base in the agent.](../../../assets/images/make/copilot-studio-08/mcs-add-knowledge-03.png)

知識ソースはテーブルに「In progress」と表示されます。Copilot Studio がメタデータをインデックス化し、「Ready」になるまで待ちます。

<cc-end-step lab="mcs8" exercise="3" step="2" />

## Exercise 4: エージェントのテスト

この演習では、RAG 対応エージェントをテストし、さまざまなクエリでの活用方法を確認します。

### Step 1: 基本的な知識検索のテスト

まず、基本的な検索機能をテストして、インデックス化された知識にアクセスできることを確認します。

テストパネルで以下のクエリを実行:

```text
Hello! Can you help me find candidates with software engineering experience?
```

```text
I'm looking for candidates who speak multiple languages. Can you help?
```

```text
Show me candidates with machine learning or AI experience.
```

![The test panel showing a conversation with the HR Knowledge Agent where the user asks about software engineering candidates and receives detailed responses with proper citations from the indexed documents.](../../../assets/images/make/copilot-studio-08/mcs-agent-03.png)

エージェントが以下を行うことを確認してください。

- ベクトル検索でインデックス内を検索  
- 関連する候補者情報を提供  
- 出典を引用  
- キーワード一致ではなくセマンティックに理解  

<cc-end-step lab="mcs8" exercise="4" step="1" />

### Step 2: 複雑なクエリシナリオのテスト

RAG とベクトル検索の威力を示す高度なシナリオをテストします。

複数条件を組み合わせた次のクエリを試してください。

```text
Find candidates suitable for a senior role that requires 5+ years of Python 
experience and fluency in Spanish
```

```text
I need someone with both frontend and backend development skills. 
Who would be good for a full-stack position?
```

```text
Can you recommend candidates for a data science position that requires 
experience with machine learning frameworks?
```

```text
Who has project management experience combined with technical skills?
```

![The test panel showing complex multi-criteria queries with the agent providing detailed candidate recommendations, explanations of market insights, and suggestions for the best candidate to select.](../../../assets/images/make/copilot-studio-08/mcs-agent-04.png)

エージェントの挙動に注目してください。

- 複数の検索条件をインテリジェントに組み合わせる  
- 推薦理由を説明する  
- 完全一致がない場合に代替案を提案  
- 候補者の資格について文脈を提供  

<cc-end-step lab="mcs8" exercise="4" step="2" />

---8<--- "ja/mcs-congratulations.md"

ラボ MCS8 - RAG のための Azure AI Search 統合を完了しました!

このラボで学んだこと:

- 企業知識管理のための Azure AI Search サービスの作成と構成
- 埋め込みモデルを使った統合ベクトル化でのベクトル検索インデックス構築
- Azure AI Search を Microsoft Copilot Studio の知識ソースとして接続
- RAG を活用したドキュメント裏付け会話エージェントの設計
- さまざまなクエリでのベクトル検索のテスト

HR Knowledge エージェントは、会話型 AI と企業検索機能を組み合わせることで、自然言語を用いたやり取りと、実際のドキュメントに基づく正確で引用付きの回答を実現しました。

今回学んだ RAG パターンは、カスタマーサポートのナレッジベース、技術ドキュメント、ポリシー・手順ガイドなど、大量ドキュメントを会話型インターフェースで検索・理解するあらゆるシナリオに応用できます。

<!-- <a href="../09-agent-to-agent">Start here</a> with Lab MCS9, to learn how to create agent to agent solutions in Copilot Studio.
<cc-next />  -->

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/08-rag--ja" />