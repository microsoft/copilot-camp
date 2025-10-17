---
search:
  exclude: true
---
# ラボ MCS8 - RAG のための Azure AI Search 統合

このラボでは、Azure AI Search を使用して Retrieval-Augmented Generation (RAG) 機能を Microsoft Copilot Studio エージェントに強化する方法を学びます。ベクトル検索を活用して候補者ドキュメントを検索し、組織のデータを裏付けとしたインテリジェントかつコンテキストに沿った応答を返す、専門的な HR Knowledge エージェントを作成します。このラボでは、Copilot Studio の会話機能と Azure AI Search の高度な検索機能を組み合わせた、パワフルな AI エージェントの作成方法を説明します。

<div class="lab-intro-video">
    <!-- <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/placeholder" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>Get a quick overview of the lab in this video.</div>
    </div> -->
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! important
    Microsoft Copilot Studio でのエージェント作成と、基本的な Azure リソース管理の経験があることを前提としています。

このラボで学ぶ内容:

- Azure AI Search サービスを作成し、ナレッジ インデックスを構成する方法
- Azure AI Search を使って PDF ドキュメントをインポートし、ベクトル化する方法
- Azure AI Search を Microsoft Copilot Studio のナレッジ ソースとして統合する方法
- RAG を活用してインテリジェントなドキュメント検索を行うエージェントを作成する方法

??? info "Retrieval-Augmented Generation (RAG) とは?"
    Retrieval-Augmented Generation (RAG) は、言語モデルが生成する回答の品質を向上させる AI 技術です。簡単な例で説明します。

    スマート アシスタントが質問に答えるとき、そのアシスタントがすべての情報を知らない場合があります。そこで RAG は、インターネット検索のように大量のドキュメントから情報を検索 (Retrieval) し、その情報を利用してより良い回答を生成 (Generation) します。

    RAG は次の 2 ステップを組み合わせています。

    - **Retrieval:** 大量データから関連情報を検索  
    - **Generation:** 検索した情報を使って詳細かつ正確な回答を生成  

    これにより、質問応答、記事執筆、リサーチ支援などで、より有用で正確な回答を提供できます。

    *Doodle to Code の動画で RAG についてさらに学びましょう！*

    <iframe src="//www.youtube.com/embed/1k4XGgsqfTM?si=P6O9baroreDKizb" frameborder="0" allowfullscreen></iframe>

??? tip "Vector Search を使用する利点"
    Vector Search は、単なるキーワード一致ではなく「意味」に基づいて情報を高速かつ正確に検索する高度な手法です。従来のテキスト検索がキーワード一致に頼るのに対し、Vector Search は数値ベクトルを用いて、クエリと意味的に近いコンテンツを見つけます。これにより、次のような検索が可能になります。

    - **意味・概念の類似性:** 異なる単語でも意味が近いものをマッチ (例: "recruitment" と "hiring")  
    - **多言語コンテンツ:** 異なる言語でも同等の内容を検索 (例: "resume" と "curriculum vitae")  
    - **複数コンテンツ タイプ:** テキスト、PDF など異種フォーマットを横断検索  

    Vector Search のしくみ:

    1. **テキストをベクトル化:** テキストやドキュメントを、内容の本質を数値化したベクトルへ変換 (埋め込みモデルを使用)  
    2. **ベクトルを保存:** 生成されたベクトルを、効率的に扱えるデータベース (Azure AI Search インデックスなど) に保存  
    3. **ベクトル検索:** クエリもベクトル化し、意味的に最も近いベクトルをインデックスから検索  

    たとえば「software engineering skills」で検索すると、「programming expertise」や「development capabilities」を持つ候補者もヒットします。

## Exercise 1: Azure AI Search サービスのセットアップ

この演習では、RAG 対応エージェントのナレッジ基盤として機能する Azure AI Search サービスを作成・構成します。

### Step 1: Azure AI Search サービス リソースの作成

Microsoft Copilot Studio と統合する前に、ドキュメントを保存・インデックス化する Azure AI Search サービスを設定します。

[Azure Portal](https://portal.azure.com){target=_blank} で Azure AI Search サービスを次の手順で作成します。

1. **Create a resource** を選択し `Azure AI Search` を検索  
1. Azure AI Search サービスを選択し **Create**  
1. 以下を入力し **Review + Create** をクリック  

    - **Subscription:** ご利用のサブスクリプション  
    - **Resource group:** 既存のラボと同じリソース グループ、または新規で `copilot-camp-rg`  
    - **Service name:** `copilotcamp-ai-search` など一意の名前  
    - **Location:** 他の Azure リソースと同じリージョン  
    - **Pricing tier:** Basic (本ラボでは十分)  

![Azure ポータルで Azure AI Search サービス作成画面。サブスクリプション、リソース グループ、サービス名、リージョン、価格帯などが入力済み。](../../../assets/images/make/copilot-studio-08/azure-search-01.png)

作成後、リソースを開きます。

1. **Overview** で **URL** をコピーして保存  
1. 左ナビの **Settings** → **Keys** で **Primary admin key** をコピー  

これらの URL と admin key は、Microsoft Copilot Studio から Azure AI Search に接続するときに使用します。

<cc-end-step lab="mcs8" exercise="1" step="1" />

### Step 2: Azure Storage Account の作成

インデックス対象ドキュメントを保存するために、Azure Storage Account が必要です。

Azure Portal で Storage Account を作成します。

1. **Create a resource** を選択し `Storage Account` を検索  
1. Storage Account を選択し **Create**  
1. 以下を入力し **Review + Create** をクリック  

    - **Subscription:** ご利用のサブスクリプション  
    - **Resource group:** Azure AI Search と同じリソース グループ  
    - **Storage account name:** `copilotcampstorage` など一意の名前  
    - **Region:** Azure AI Search と同じリージョン  
    - **Preferred storage type:** Azure Blob Storage または Azure Data Lake Storage Gen 2  
    - **Performance:** Standard  
    - **Redundancy:** Locally redundant storage (LRS)  

![Azure ポータルで Storage Account 作成画面。基本設定としてサブスクリプション、リソース グループ、アカウント名、リージョン、パフォーマンス、冗長性が設定されている。](../../../assets/images/make/copilot-studio-08/azure-storage-01.png)

作成後、このストレージ アカウントに PDF ドキュメントを保存し、Azure AI Search がインデックス化できるようにします。

<cc-end-step lab="mcs8" exercise="1" step="2" />

### Step 3: テキスト埋め込み (Embedding) モデルの作成

ベクトル検索を有効にするため、Azure OpenAI にテキスト埋め込みモデルを作成し、ドキュメントとクエリをベクトル化します。

Azure OpenAI サービス インスタンスがない場合は、まず作成します。

1. Azure Portal で **Create a resource** → `Azure OpenAI` を検索  
1. **Azure OpenAI** を選択し **Create**  
1. 次を入力  

    - **Subscription:** ご利用のサブスクリプション  
    - **Resource group:** 他リソースと同じリソース グループ  
    - **Region:** East US、West Europe、South Central US など Azure OpenAI 対応リージョン  
    - **Name:** `copilotcamp-openai` など  
    - **Pricing tier:** Standard S0  

1. **Next** を進め **Create**  
1. デプロイ完了を待機 (数分かかる場合あり)  
1. 作成後、Azure OpenAI リソースのエンドポイント URL を控える  

次に [Azure AI Foundry](https://oai.azure.com/portal){target=_blank} にアクセスします。初回アクセス時は先ほど作成した Azure OpenAI インスタンスを選択します。サービス インスタンスを選び、埋め込みモデルを以下の手順で作成します。

1. 左ナビで 1️⃣ **Deployments**  
1. 2️⃣ **+ Deploy model**  
1. 3️⃣ **Deploy base model**  
1. ポップアップで 4️⃣ `text-embedding-ada-002` を検索  
1. 5️⃣ **Confirm**  
1. 設定ダイアログで次を入力  

    - **Deployment name:** `text-embeddings`  
    - **Deployment type:** Standard  
    - **Model version:** 2 (Default)  
    - **Content Filter:** DefaultV2  

1. 6️⃣ **Deploy** を選択し、完了を待機  

![Azure OpenAI のデプロイ画面で text-embedding-ada-002 モデルを設定している様子。モデル選択、バージョン、デプロイタイプ、名前、コンテンツフィルターが設定されている。](../../../assets/images/make/copilot-studio-08/openai-embedding-01.png)


??? info "`text-embedding-ada-002` の機能"
    `text-embedding-ada-002` モデルはテキストを数値ベクトルへ変換し、意味的な類似度検索を可能にします。複数言語や多様なコンテンツ タイプを扱え、Azure AI Search と組み合わせることで、文脈に合った関連性の高い検索結果を返します。高度な検索ソリューションや自然言語を理解するアプリ開発に最適です。

埋め込みモデルは、インデックス化されたドキュメントとユーザー クエリをベクトル化し、意味的類似度を比較するために不可欠です。

!!! tip "ヒント: クォータ制限への対処"
    「No quota available」と表示された場合は次のいずれかを検討してください。  

    1. 別リージョンでデプロイ  
    1. Azure OpenAI クォータ管理ページで追加クォータを申請  
    1. 使用していないデプロイを削除してリソースを解放  

<cc-end-step lab="mcs8" exercise="1" step="3" />

## Exercise 2: 検索インデックスの作成とデータ投入

この演習では、Azure AI Search で検索インデックスを作成し、履歴書ドキュメントをベクトル化して投入します。

### Step 1: サンプル ドキュメントの準備

本ラボ用に、検索対象となるサンプル履歴書ドキュメントをダウンロードします。[fictitious_resumes.zip](https://github.com/microsoft/copilot-camp/raw/main/src/custom-engine-agent/Lab02-RAG/CareerGenie/fictitious_resumes.zip) をダウンロードし、解凍して PDF ファイルを取得してください。

サンプル履歴書には以下のような情報が含まれています。

- 候補者名と連絡先  
- 技術スキルと専門分野  
- 職務経験と役割履歴  
- 学歴  
- 言語スキル  
- 資格・認定  

これらのファイル内容を確認し、RAG 対応エージェントで検索可能となる情報タイプを把握してください。文書は複数言語で書かれていますが、`text-embedding-ada-002` とベクトル インデックスでは問題ありません。

<cc-end-step lab="mcs8" exercise="2" step="1" />

### Step 2: Storage Account へのサンプル ドキュメントのアップロード

Azure AI Search を使用して、履歴書ドキュメントをベクトル化機能付きでインデックス化します。

[Azure Portal](https://portal.azure.com/){target=_blank} で Storage Account を開きます。 

1. 左ナビ **Data storage** グループの 1️⃣ **Containers**  
1. コマンド バーの 2️⃣ **+ Add container**  
1. 任意の名前 3️⃣ (例: `resumes`)  
1. 4️⃣ **Create**  

![Azure Storage Account の「Containers」ページで「+ Add container」が強調表示されている。](../../../assets/images/make/copilot-studio-08/azure-storage-02.png)

コンテナー作成後、履歴書ファイルをアップロードします。

1. 1️⃣ **Upload**  
1. ドラッグ & ドロップ、または 2️⃣ **Browse for files** でファイル選択  
1. 3️⃣ **Upload** をクリックし完了を待つ  

![Azure Storage Account のコンテナーにファイルをアップロードする画面。アップロード手順が強調表示。](../../../assets/images/make/copilot-studio-08/azure-storage-03.png)

<cc-end-step lab="mcs8" exercise="2" step="2" />

### Step 3: 統合ベクトル化によるインデックス投入

ファイルをアップロードしたら [Azure Portal](https://portal.azure.com/){target=_blank} に戻り、Azure AI Search サービスを開きます。上部コマンド バーから **Import data (new)** を選択します。

![Azure AI Search サービス概要ページ。「Import data (new)」コマンドが強調表示されている。](../../../assets/images/make/copilot-studio-08/azure-search-02.png)

データ インポートを設定する新しいページで **Azure Blob Storage** を選択します。

![データインポートのデータ ソース選択ページ。「Azure Blob Storage」が強調表示。](../../../assets/images/make/copilot-studio-08/azure-search-03.png)

続いて **RAG** シナリオを選択します。

![ターゲット シナリオ選択ページ。「RAG」が強調表示。](../../../assets/images/make/copilot-studio-08/azure-search-04.png)

次の設定で RAG シナリオを構成します。

1. **Configure your Azure Blob Storage**  

    - **Subscription:** ご利用のサブスクリプション  
    - **Storage account:** 先ほど作成した Storage Account  
    - **Blob container:** `resumes` などアップロード先コンテナー  
    - **Blob folder:** フォルダー構成がなければ空欄  
    - **Parsing mode:** `Default`  
    - **Next** を選択  

1. **Vectorize your text**  

    - **Kind:** Azure OpenAI  
    - **Subscription:** ご利用のサブスクリプション  
    - **Azure Open AI service:** 作成した Azure OpenAI  
    - **Model deployment:** `text-embeddings`  
    - **Authentication type:** `API Key`  
    - `I acknowledge ...` チェック  
    - **Next**  

1. **Vectorize your images**  

    - 画像を処理する場合のみ設定  
    - ここでは **Next**  

1. **Advanced ranking and relevancy**  

    - スケジュール更新やセマンティック ランカー、フィールド設定が可能  
    - ここでは **Next**  

1. **Review and create**  

    - インデックス等のプレフィックス: 例 `resumes`  
    - 設定確認後 **Create**  

![インデックス作成設定の最終確認ページ。](../../../assets/images/make/copilot-studio-08/azure-search-05.png)

インデックス作成後、確認ダイアログが表示されます。**Start searching** をクリックすると検索を試せます。インデックス ページで **Search** を選択し結果を確認します。各レコードに `text_vector` フィールドがあり、`text-embedding-ada-002` でベクトル化されたことが分かります。

![Azure AI Search ベクトル インデックスで全件取得結果を表示し、"text_vector" フィールドが強調表示されている。](../../../assets/images/make/copilot-studio-08/azure-search-06.png)

<cc-end-step lab="mcs8" exercise="2" step="3" />

## Exercise 3: RAG 対応エージェントの作成

この演習では、Azure AI Search インデックスを利用して HR 候補者に関するドキュメント バックの応答を返す Microsoft Copilot Studio エージェントを作成します。

### Step 1: HR Knowledge エージェントの作成

[Microsoft Copilot Studio](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、ナレッジ検索向けの新しいエージェントを作成します。

作業アカウントで `Copilot Dev Camp` 環境に入り、新規エージェントを作成:

1. **Create** → **+ New agent**  
1. **Configure** を選択し手動設定  

エージェントの定義:

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

![Microsoft Copilot Studio で "HR Knowledge Agent" を作成する画面。名前、説明、指示が入力されている。](../../../assets/images/make/copilot-studio-08/mcs-agent-01.png)

**Create** を押してエージェントを作成します。

作成後、**Use generative AI to determine how best to respond to users and events** が有効になっていることを確認し、**Details** パネルで `GPT-4o` モデルが選択されていることを確認します。

![新しいエージェントの設定画面。Generative Orchestrator が有効で GPT-4o モデルが強調表示。](../../../assets/images/make/copilot-studio-08/mcs-agent-02.png)

<cc-end-step lab="mcs8" exercise="3" step="1" />

### Step 2: Azure AI Search をナレッジ ソースとして追加

Azure AI Search インデックスをエージェントのナレッジ ソースとして統合します。

**Knowledge** セクションでインデックスを追加:

1. **+ Add knowledge**  
1. **Add knowledge** ダイアログで **Featured**  
1. **Azure AI Search** を選択  

![ナレッジ ソース追加画面で Azure AI Search を選択している様子。](../../../assets/images/make/copilot-studio-08/mcs-add-knowledge-01.png)

Azure AI Search 接続を構成:

1. **Create new connection**  
1. 認証を設定  

    - **Authentication type:** Access Key  
    - **Azure AI Search Endpoint URL:** 保存しておいた URL  
    - **Azure AI Search Admin Key:** コピーしておいた admin key  

1. **Create** を選択 (成功すると緑のチェックマーク)  

![Azure AI Search 接続設定ダイアログ。認証タイプ、エンドポイント URL、admin key が入力されている。](../../../assets/images/make/copilot-studio-08/mcs-add-knowledge-02.png)

ナレッジ ソース設定を完了:

1. インデックス名 `resumes` (または作成時の名前) を選択  
1. **Add to agent**  

![エージェントに追加するインデックスを選択する画面。](../../../assets/images/make/copilot-studio-08/mcs-add-knowledge-03.png)

ナレッジ ソースがテーブルに「In progress」と表示されます。ステータスが「Ready」になるまで待ってから次へ進みます。

<cc-end-step lab="mcs8" exercise="3" step="2" />

## Exercise 4: エージェントのテスト

この演習では、RAG 対応エージェントをテストし、さまざまなクエリとユースケースを確認します。

### Step 1: 基本的なナレッジ取得のテスト

まずは基本的な検索機能をテストし、インデックス化されたナレッジを正しく利用できるか確認します。

テスト パネルで次のクエリを実行:

```text
Hello! Can you help me find candidates with software engineering experience?
```

```text
I'm looking for candidates who speak multiple languages. Can you help?
```

```text
Show me candidates with machine learning or AI experience.
```

![テスト パネルで HR Knowledge Agent と会話し、ソフトウェア エンジニア候補について質問し、引用付きで詳細回答を得ている様子。](../../../assets/images/make/copilot-studio-08/mcs-agent-03.png)

エージェントの動作:

- ベクトル検索でドキュメントを検索  
- 関連する候補者情報を提供  
- 出典ドキュメントへの引用を付与  
- キーワード一致ではなく意味理解に基づいて応答  

<cc-end-step lab="mcs8" exercise="4" step="1" />

### Step 2: 複雑なクエリ シナリオのテスト

RAG とベクトル検索の威力を示す高度なシナリオをテストします。

複数条件を組み合わせたクエリ例:

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

![複雑な複数条件クエリでエージェントが候補者を提案し、市場洞察や推奨理由を提供する様子。](../../../assets/images/make/copilot-studio-08/mcs-agent-04.png)

エージェントのポイント:

- 複数の検索条件を知的に組み合わせ  
- 推薦理由を説明  
- 完全一致がない場合は代替案を提示  
- 候補者資格に関するコンテキストを提供  

<cc-end-step lab="mcs8" exercise="4" step="2" />

---8<--- "ja/mcs-congratulations.md"

ラボ MCS8 - RAG のための Azure AI Search 統合を完了しました！

このラボで学んだこと:

- 企業ナレッジ管理向け Azure AI Search サービスの作成と構成  
- 埋め込みモデルを用いた統合ベクトル化でのベクトル検索インデックス構築  
- Azure AI Search を Microsoft Copilot Studio のナレッジ ソースとして接続  
- ドキュメント バックの会話を実現する RAG 対応エージェント設計  
- さまざまなクエリでベクトル検索をテスト  

HR Knowledge Agent により、会話型 AI と企業検索機能を組み合わせたパワーを体験できます。ユーザーは自然言語で組織ナレッジにアクセスし、実際のドキュメントに基づく正確で引用付きの回答を受け取れます。

今回学んだ RAG パターンは、カスタマー サポート ナレッジベース、技術文書、ポリシー & 手順ガイドなど、大規模ドキュメント コレクションを会話インターフェイスで検索・理解するあらゆるシナリオに応用できます。

<!-- <a href="../09-agent-to-agent">Start here</a> with Lab MCS9, to learn how to create agent to agent solutions in Copilot Studio.
<cc-next />  -->

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/08-rag--ja" />