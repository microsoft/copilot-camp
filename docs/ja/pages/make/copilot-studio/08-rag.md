---
search:
  exclude: true
---
# ラボ MCS8 - Azure AI Search を使用した RAG 連携

このラボでは、Microsoft Copilot Studio のエージェントに Azure AI Search を活用した Retrieval-Augmented Generation ( RAG ) 機能を追加する方法を学習します。Vector 検索を用いて候補者のドキュメントを検索し、組織のデータに裏付けられたインテリジェントかつコンテキストに応じた回答を行う、専門的な HR Knowledge エージェントを作成します。このラボでは、Copilot Studio の会話能力と Azure AI Search の高度な検索機能を組み合わせた強力な AI エージェントの構築方法を示します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/ofd2pLMVvS0" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を素早く把握できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! important
    Microsoft Copilot Studio でのエージェント作成と、基本的な Azure リソース管理の経験があることを前提としています。

このラボで学習する内容:

- 知識のインデックス作成用に Azure AI Search サービスを作成して構成する方法
- Azure AI Search を使用して PDF ドキュメントをインポートし、ベクトル化する方法
- Azure AI Search を Microsoft Copilot Studio の知識ソースとして統合する方法
- RAG を活用してインテリジェントなドキュメント検索を行うエージェントを作成する方法

??? info "Retrieval-Augmented Generation ( RAG ) とは?"
    Retrieval-Augmented Generation ( RAG ) とは、言語モデルが生成する回答の品質を向上させる AI 技術です。簡単な例で説明します。

    あなたが質問に答えるスマートアシスタントを持っていると想像してください。アシスタントが必ずしも十分な知識を持っていない場合、RAG は膨大なドキュメント コレクションから関連情報を検索 ( retrieval ) し、その情報を基により正確な回答を生成 ( generation ) します。

    つまり RAG は次の 2 段階を組み合わせています。

    - **Retrieval:** 大量データから関連情報を検索
    - **Generation:** 取得した情報を使って詳細で正確な回答を生成
    
    これにより質問応答、記事執筆、調査支援などで、より有用な回答が得られるようになります。

    *Doodle to Code のビデオで RAG についてさらに学びましょう！*

    <iframe src="//www.youtube.com/embed/1k4XGgsqfTM?si=P6O9baroreDKizb" frameborder="0" allowfullscreen></iframe>

??? tip "Vector 検索を使用するメリット"
    Vector 検索は、単なるキーワード一致ではなく「意味」に基づいて情報を高速かつ高精度で見つける高度な手法です。テキストを数値ベクトルに変換し、クエリのベクトルと「近さ」を比較することで次のような検索を実現します。

    - **意味的・概念的な類似性:** 異なる言葉でも同じ概念をマッチ (例: "recruitment" と "hiring")
    - **多言語コンテンツ:** 複数言語間で同等の内容を検索 (例: 英語の "resume" と ラテン語の "curriculum vitae")
    - **複数のコンテンツ形式:** テキスト文書や PDF など異なる形式をまたいで検索
    
    Vector 検索の仕組み:

    1. **テキストをベクトル化:** 埋め込みモデルでテキストを数値ベクトルに変換
    2. **ベクトルを保存:** Azure AI Search などの専用インデックスに格納
    3. **ベクトル検索:** クエリもベクトル化し、意味的に近いベクトルを検索

    例えば「software engineering skills」で検索すると、「programming expertise」や「development capabilities」を持つ候補者も見つけられます。

## 演習 1: Azure AI Search サービスのセットアップ

この演習では、RAG 対応エージェントの知識基盤となる Azure AI Search サービスを作成・構成します。

### Step 1: Azure AI Search サービス リソースの作成

Microsoft Copilot Studio と統合する前に、ドキュメントを格納・インデックス化する Azure AI Search サービスをセットアップします。

[Azure Portal](https://portal.azure.com){target=_blank} で Azure AI Search サービスを作成します。

1. **Create a resource** を選択し `Azure AI Search` を検索  
1. Azure AI Search サービスを選択し **Create**  
1. 次の情報を入力し **Review + Create** を選択  

    - **Subscription:** ご自身の Azure サブスクリプション  
    - **Resource group:** 既存ラボと同じ、または新規 `copilot-camp-rg`  
    - **Service name:** `copilotcamp-ai-search` など一意の名前  
    - **Location:** 他の Azure リソースと同じリージョン  
    - **Pricing tier:** Basic (本ラボには十分)  

![The Azure portal interface showing the creation of a new Azure AI Search service with the required fields filled in including subscription, resource group, service name, location, and pricing tier.](../assets/images/make/copilot-studio-08/azure-search-01.png)

Azure AI Search サービスが作成されたらリソースに移動し、次を控えておきます。

1. **Overview** で **URL** をコピー  
1. 左ナビ **Settings** の **Keys** で **Primary admin key** をコピー  

これらは後ほど Microsoft Copilot Studio から接続する際に使用します。

<cc-end-step lab="mcs8" exercise="1" step="1" />

### Step 2: Azure Storage Account の作成

インデックス化対象のドキュメントを保存するため、Azure Storage Account が必要です。

Azure Portal でストレージ アカウントを作成します。

1. **Create a resource** を選択し `Storage Account` を検索  
1. Storage Account を選択し **Create**  
1. 次の情報を入力し **Review + Create** を選択  

    - **Subscription:** ご自身の Azure サブスクリプション  
    - **Resource group:** Azure AI Search と同じ  
    - **Storage account name:** `copilotcampstorage` など一意の名前  
    - **Region:** Azure AI Search と同じリージョン  
    - **Preferred storage type:** Azure Blob Storage または Azure Data Lake Storage Gen 2  
    - **Performance:** Standard  
    - **Redundancy:** Locally redundant storage (LRS)  

![The Azure portal interface showing the creation of a storage account with the basic configuration including subscription, resource group, storage account name, region, performance, and redundancy settings.](../assets/images/make/copilot-studio-08/azure-storage-01.png)

ストレージ アカウントが作成できたら、後ほど PDF ドキュメントを保存します。

<cc-end-step lab="mcs8" exercise="1" step="2" />

### Step 3: Text Embedding モデルの作成

Vector 検索を有効化するため、Azure OpenAI にテキスト埋め込みモデルを作成し、ドキュメントとクエリをベクトル化します。

Azure OpenAI サービス インスタンスがない場合は作成します。

1. Azure Portal で **Create a resource** → `Azure OpenAI` を検索  
1. **Azure OpenAI** → **Create**  
1. 次の情報を入力  

    - **Subscription:** ご自身の Azure サブスクリプション  
    - **Resource group:** 既存リソースと同じ  
    - **Region:** East US、West Europe、South Central US など対応リージョン  
    - **Name:** `copilotcamp-openai` など  
    - **Pricing tier:** Standard S0  

1. **Next** で進み **Create**  
1. デプロイ完了を待機  
1. 作成後、エンドポイント URL を控えておく  

続いて [Microsoft Foundry](https://oai.azure.com/portal){target=_blank} にアクセスし、以下の手順で埋め込みモデルをデプロイします（初回アクセス時は作成した Azure OpenAI インスタンスを選択）。

1. 左ナビで 1️⃣ **Deployments** を選択  
1. 2️⃣ **+ Deploy model**  
1. 3️⃣ **Deploy base model** を選択  
1. ポップアップで 4️⃣ `text-embedding-ada-002` を検索  
1. 5️⃣ **Confirm**  
1. 設定ダイアログで以下を指定  

    - **Deployment name:** `text-embeddings`  
    - **Deployment type:** Standard  
    - **Model version:** 2 (Default)  
    - **Content Filter:** DefaultV2  

1. 6️⃣ **Deploy** を選択し完了を待機  

![The Azure OpenAI deployment interface showing the creation of a text-embedding-ada-002 model with the specified configuration including model selection, version, deployment type, name, and content filter settings.](../assets/images/make/copilot-studio-08/openai-embedding-01.png)


??? info "`text-embedding-ada-002` の役割"
    Azure OpenAI の `text-embedding-ada-002` モデルは、テキストをその意味を表す数値ベクトルに変換します。これにより、単語の一致ではなく意味の近さでテキストを検索できます。多言語や多様なコンテンツ形式にも対応し、Azure AI Search と組み合わせることで、文脈的に最適な検索結果を提供します。高度な検索ソリューションや自然言語理解が求められるアプリケーションに適しています。

埋め込みモデルは、インデックス化されたドキュメントとユーザー クエリをベクトル化し、意味的な類似度を比較するために不可欠です。

!!! tip "ヒント: クォータ制限への対処"
    「No quota available」というメッセージが表示された場合は、次のいずれかをお試しください。

    1. 別のリージョンでデプロイする  
    1. Azure OpenAI のクォータ管理ページから追加クォータを申請する  
    1. 使っていないデプロイを削除してリソースを解放する  

<cc-end-step lab="mcs8" exercise="1" step="3" />

## 演習 2: 検索インデックスの作成とデータ投入

この演習では、Azure AI Search で検索インデックスを作成し、Vector 化機能を用いて候補者の履歴書ドキュメントを投入します。

### Step 1: サンプル ドキュメントの準備

インデックス化に使用するサンプル履歴書をダウンロードします。[fictitious_resumes.zip](https://github.com/microsoft/copilot-camp/raw/main/src/custom-engine-agent/Lab02-RAG/CareerGenie/fictitious_resumes.zip) を取得し、解凍して PDF ファイルを確認してください。

これらの履歴書には、以下のような多様な候補者情報が含まれています。

- 氏名・連絡先
- 技術スキルと専門分野
- 職務経歴
- 学歴
- 語学力
- 資格

内容を確認し、RAG 対応エージェントで検索可能になる情報を理解しておきましょう。ドキュメントは複数言語で記載されていますが、`text-embedding-ada-002` モデルと Vector インデックスに問題はありません。

<cc-end-step lab="mcs8" exercise="2" step="1" />

### Step 2: サンプル ドキュメントを Storage Account にアップロード

Azure AI Search を使用して、履歴書ドキュメントの Vector インデックスを作成します。

[Azure Portal](https://portal.azure.com/){target=_blank} でストレージ アカウントを開きます。

1. 左ナビ **Data storage** の 1️⃣ **Containers** を選択  
1. コマンド バーの 2️⃣ **+ Add container** を選択  
1. 3️⃣ 名前に `resumes` などを入力  
1. 4️⃣ **Create** を選択  

![The Azure Storage Account service instance while showing the "Containers" page. There is a command to "+ Add container" highlighted.](../assets/images/make/copilot-studio-08/azure-storage-02.png)

作成したコンテナーにファイルをアップロードします。

1. 1️⃣ **Upload** を選択  
1. 履歴書ファイルをドラッグ & ドロップ、または 2️⃣ **Browse for files** で選択  
1. 3️⃣ **Upload** をクリックし完了を待機  

![The Azure Storage Account service instance while uploading files in target container. The commands to upload files are highlighted.](../assets/images/make/copilot-studio-08/azure-storage-03.png)

<cc-end-step lab="mcs8" exercise="2" step="2" />

### Step 3: 統合ベクトル化による Vector インデックスへの投入

ファイルをアップロードしたら、[Azure Portal](https://portal.azure.com/){target=_blank} のホームに戻り、Azure AI Search サービスを開きます。上部の **Import data (new)** を選択します。

![The Azure AI Search service instance overview page with basic information about the service instance. There is a command to "Import data (new)" highlighted.](../assets/images/make/copilot-studio-08/azure-search-02.png)

データ インポート設定ページが表示されるので、データ ソースとして **Azure Blob Storage** を選択します。

![The Azure AI Search service instance page to start importing data. There is the "Azure Blob Storage" data source highlighted.](../assets/images/make/copilot-studio-08/azure-search-03.png)

続いてターゲット シナリオに **RAG** を選択します。

![The Azure AI Search service instance page to choose the target scenario. There is the "RAG" scenario highlighted.](../assets/images/make/copilot-studio-08/azure-search-04.png)

RAG シナリオを次のように設定します。

1. **Configure your Azure Blob Storage**  
    - **Subscription:** ご自身の Azure サブスクリプション  
    - **Storage account:** 先ほど作成した Storage Account  
    - **Blob container:** `resumes` など先ほど作成したコンテナー  
    - **Blob folder:** フォルダー構造を作成していなければ空欄  
    - **Parsing mode:** `Default`  
    - **Next** をクリック  

1. **Vectorize your text**  
    - **Kind:** Azure OpenAI  
    - **Subscription:** ご自身の Azure サブスクリプション  
    - **Azure Open AI service:** 作成した Azure OpenAI インスタンス  
    - **Model deployment:** `text-embeddings`  
    - **Authentication type:** `API Key` (既定)  
    - `I acknowledge that ...` チェックボックスをオン  
    - **Next**  

1. **Vectorize your images**  
    - 画像を処理する場合のみ設定が必要です。ここでは **Next**  

1. **Advanced ranking and relevancy**  
    - スケジュール更新やセマンティック ランカーなどの設定が可能です。ここでは **Next**  

1. **Review and create**  
    - インデックス、インデクサー、データ ソース、スキルセットのプレフィックスを `resumes` などで指定  
    - 設定を確認し **Create** を選択  

![The Azure AI Search service instance page to recap the settings that will be applied when creating and feeding the vector index.](../assets/images/make/copilot-studio-08/azure-search-05.png)

Vector インデックスが作成されると、完了ダイアログが表示されます。**Start searching** を選択し、**Search** を実行して結果を確認します。各レコードに `text_vector` フィールドがあり、`text-embedding-ada-002` でベクトル化されたことが分かります。

![The Azure AI Search vector index showing the results of a get all query with the "text_vector" field highlighted.](../assets/images/make/copilot-studio-08/azure-search-06.png)

<cc-end-step lab="mcs8" exercise="2" step="3" />

## 演習 3: RAG 対応エージェントの作成

この演習では、Azure AI Search インデックスを活用して HR 候補者に関するドキュメント ベースの回答を行う Microsoft Copilot Studio エージェントを作成します。

### Step 1: HR Knowledge エージェントの作成

[Microsoft Copilot Studio](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、知識検索に最適化された新しいエージェントを作成します。

職場アカウントで `Copilot Dev Camp` 環境に入り、以下の設定で新規エージェントを作成します。

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

![The Microsoft Copilot Studio user experience when creating the "HR Knowledge Agent". There are name, description, and instructions accordingly to the above suggeted settings.](../assets/images/make/copilot-studio-08/mcs-agent-01.png)

**Publish** を選択してエージェントを公開します。

公開後、エージェントの **Overview** タブで `GPT-4.1` モデルが選択されていることを確認します。

<cc-end-step lab="mcs8" exercise="3" step="1" />

### Step 2: Azure AI Search を知識ソースとして追加

Azure AI Search インデックスをエージェントの知識ソースとして統合します。

**Knowledge** セクションで以下を実行します。

1. **+ Add knowledge** を選択  
1. **Add knowledge** ダイアログで **Featured** を選択  
1. **Azure AI Search** を選択  

![The knowledge sources interface showing the option to add Azure AI Search as a featured knowledge source, with various other knowledge source options visible.](../assets/images/make/copilot-studio-08/mcs-add-knowledge-01.png)

Azure AI Search 接続を構成します。

1. **Create new connection** を選択  
1. 認証を構成  

    - **Authentication type:** Access Key  
    - **Azure AI Search Endpoint URL:** 先ほど控えた URL  
    - **Azure AI Search Admin Key:** 先ほど控えた Admin キー  

1. **Create** を選択 (成功すると緑のチェックマークが表示)

![The Azure AI Search connection configuration dialog showing the authentication type selection, endpoint URL field, and admin key field for establishing the connection.](../assets/images/make/copilot-studio-08/mcs-add-knowledge-02.png)

知識ソースの設定を完了します。

1. インデックス `resumes`（または作成時の名称）を選択  
1. **Add to agent** をクリック  

![The Azure AI Search connection configuration dialog allowing you to select the index to use as the new knowledge base in the agent.](../assets/images/make/copilot-studio-08/mcs-add-knowledge-03.png)

知識ソースが「In progress」と表示され、メタデータのインデックス処理が行われます。「Ready」に変わるまで待ちます。

<cc-end-step lab="mcs8" exercise="3" step="2" />

## 演習 4: エージェントのテスト

この演習では、RAG 対応エージェントをテストし、さまざまなクエリとユースケースでの活用方法を学びます。

### Step 1: 基本的な知識検索のテスト

まずは基本的な検索機能をテストし、エージェントがインデックス化された知識を適切に利用できるか確認します。

テスト パネルで次のクエリを試してみてください。

```text
Hello! Can you help me find candidates with software engineering experience?
```

```text
I'm looking for candidates who speak multiple languages. Can you help?
```

```text
Show me candidates with machine learning or AI experience.
```

![The test panel showing a conversation with the HR Knowledge Agent where the user asks about software engineering candidates and receives detailed responses with proper citations from the indexed documents.](../assets/images/make/copilot-studio-08/mcs-agent-03.png)

エージェントが以下を行う様子を確認します。

- Vector 検索でインデックス内のドキュメントを検索  
- 適切な候補者情報を提示  
- 出典と参照を提示  
- 単純なキーワード一致ではなく意味理解を活用  

<cc-end-step lab="mcs8" exercise="4" step="1" />

### Step 2: 複雑なクエリ シナリオのテスト

RAG と Vector 検索の強力さを示す高度なシナリオをテストします。

次のような複合条件クエリを試してください。

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

![The test panel showing complex multi-criteria queries with the agent providing detailed candidate recommendations, explanations of market insights, and suggestions for the best candidate to select.](../assets/images/make/copilot-studio-08/mcs-agent-04.png)

エージェントが以下をどのように実行するか観察します。

- 複数の検索条件をインテリジェントに組み合わせる  
- 推薦理由を説明する  
- 完全一致がない場合に代替案を提案する  
- 候補者の適性に関するコンテキストを提供する  

<cc-end-step lab="mcs8" exercise="4" step="2" />

---8<--- "ja/mcs-congratulations.md"

ラボ MCS8 - Azure AI Search を使用した RAG 連携を完了しました！

このラボで学んだこと:

- 企業向け知識管理のための Azure AI Search サービスの作成と構成  
- 埋め込みモデルを用いた統合ベクトル化による Vector 検索インデックスの構築  
- Azure AI Search を Microsoft Copilot Studio の知識ソースとして接続  
- ドキュメント裏付け会話のために RAG を活用するインテリジェント エージェントの設計  
- さまざまなクエリで Vector 検索をテスト  

HR Knowledge エージェントは、会話型 AI とエンタープライズ検索を組み合わせることで、ユーザーが自然言語で組織の知識にアクセスし、実際のドキュメントに基づいた正確で引用付きの回答を得られるパワーを示しています。

今回習得した RAG のパターンは、カスタマー サポートのナレッジ ベース、技術ドキュメント、ポリシー & 手順ガイドなど、大規模ドキュメント コレクションを会話形式で検索・理解するあらゆるシナリオに応用できます。

<a href="../09-connected-agents">こちら</a>からラボ MCS9 に進み、Copilot Studio でコネクテッド エージェントの作成方法を学びましょう。
<cc-next /> 

<!-- <cc-award badgeId="Make" badgeName="Make" badgeUrl="#" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/08-rag--ja" />