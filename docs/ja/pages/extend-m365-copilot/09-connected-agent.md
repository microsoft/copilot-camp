---
search:
  exclude: true
---
# ラボ 09: Connected Agent - Zava のマルチ エージェント請求オーケストレーション

このラボでは、Zava Insurance 向けにマルチ エージェント オーケストレーション システムを構築します。まず、瞬時に価格インテリジェンスを提供する請負業者の価格知識を組み込んだ **Zava Procurement** エージェントを作成します。次に、**Zava Procurement** と **Zava Claims Assistant**（ラボ 08 で作成）を接続する **Zava Care** オーケストレーター エージェントを作成し、クレーム アジャスターが単一かつ統合された対話型インターフェイスから、組み込み価格データと MCP サーバーのリアルタイム クレーム情報にアクセスできるようにします。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/coGNxTRBfyw" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要をご覧ください。</div>
            <div class="note-box">
            📘 <strong>Note:</strong>  Agents Toolkit および Microsoft 365 Copilot における Embedded knowledge は現在プレビューです。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>

---

## Connected Agent とは

**Connected Agent** は AI エージェント アーキテクチャの次の進化形であり、複数の専門エージェントがシームレスに連携できるようにします。すべてを 1 つで行うモノリシック エージェントを構築する代わりに、Connected Agent は特定のタスクに最適化された専門エージェントをオーケストレーションしながら、統一されたユーザー エクスペリエンスを維持します。

> Declarative Agent における Connected Agent は現在 Public Preview です。

### エンタープライズ ワークフローへの利点

保険金請求処理のような複雑なビジネス シナリオにおいて、Connected Agent は以下を提供します。

- 専門エージェントによる **ドメイン専門知識**
- 複数データ ソースにまたがる **包括的なカバレッジ**
- 集中型エージェントの追加による **効率的なスケーリング**
- バックエンドの複雑さを感じさせない **一貫したユーザー エクスペリエンス**
- 責務分離が明確な **保守しやすいアーキテクチャ**

## 🎯 ラボの目的

このラボを完了すると、次のことができるようになります。

1. 請負業者の価格ドキュメントを使用して **Embedded knowledge を備えた Declarative Agent を作成** する  
2. 複数の専門エージェントを調整する **Connected Orchestrator Agent を構築** する  
3. **リアルタイム MCP データと Embedded knowledge** を組み合わせてマルチ エージェント オーケストレーションをテストする  
4. **ライブ データ ソースと静的ナレッジ ベース** を活用するハイブリッド AI アーキテクチャを理解する  

---

## 📚 前提条件

このラボを始める前に、次を準備してください。

- **ラボ 8 を完了** していること：MCP サーバー統合が正常に動作している Zava の Declarative Agent  
- **Microsoft 365 Agents Toolkit** のプレリリース版（Embedded knowledge 用）  
- テスト用の **Microsoft 365 Copilot ライセンス** が有効  

---

## Exercise 1: Embedded knowledge 用の新しい Declarative Agent を作成する

この演習では、Microsoft 365 Agents Toolkit を使用して、プロジェクト内に保存されたファイルを利用する新しい Declarative Agent プロジェクトを作成します。

### Step 1: Microsoft 365 Agents Toolkit で新しいエージェントを作成

1. **VS Code** を開きます  
2. アクティビティ バー（左サイドバー）の **Microsoft 365 Agents Toolkit** アイコンをクリックします  
3. プロンプトが表示されたら Microsoft 365 開発者アカウントでサインインします  
4. Agents Toolkit パネルで **"Create a New Agent/App"** をクリックします  
5. テンプレート オプションから **"Declarative Agent"** を選択します  
6. オプションから **"No Action"** を選択します  
7. **Default folder** を選択します  
8. アプリケーション名として `Zava Procurement` と入力します  

これで新しいエージェントが作成され、プロジェクトが新しい VS Code ウィンドウで開きます。

  <cc-end-step lab="e9" exercise="1" step="1" />

### Step 2: ファイルの組み込み方法を理解する

`appPackage` フォルダーに移動し、その内容を確認します。`manifest.json`（エージェントの機能を定義）や `declarativeAgent.json`（エージェントの動作を構成）など、以前の Declarative Agent の作業で見覚えのあるファイルが確認できます。

ここでの重要な追加要素は `EmbeddedKnowledge` フォルダーです。ここに Zava の請負業者価格データ ファイルを格納し、エージェントに直接組み込むことで、ライブ データベース クエリを行わずに瞬時に価格インテリジェンスへアクセスできます。

!!! note
    テスト用に機密ラベルのないサンプル PDF ファイルを提供しています。独自のファイル、特に Office ドキュメントでテストする場合は、テナントで構成された機密ラベルを順守していることを確認してください。

  <cc-end-step lab="e9" exercise="1" step="2" />

## Exercise 2: Zava の請負業者調達知識用にエージェントを構成する

### Step 1: ファイルをローカルにダウンロード

[こちらの URL](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/docs/assets/docs/extend-m365-copilot-09&filename=EmbeddedKnowledge){target=_blank} にアクセスし、すべてのファイルを新しく作成した Declarative Agent プロジェクトの `appPackage/EmbeddedKnowledge` フォルダーに展開します。

  <cc-end-step lab="e9" exercise="2" step="1" />

### Step 2: エージェントの ID と説明を更新

`appPackage/declarativeAgent.json` の内容を次の構成に置き換えます。

```json
{
    "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
    "version": "v1.6",
    "name": "Zava Procurement",
    "description": "An agent that helps insurance adjusters streamline the search of the right procurement information by leveraging embedded knowledge from Zava approved partners' network of trusted contractors and service providers.",
    "instructions": "$[file('instruction.txt')]",
    "conversation_starters": [
        {
            "title": "Water damage restoration pricing",
            "text": "What are the rates for emergency water extraction and drying services?"
        },
        {
            "title": "Roof repair cost estimate",
            "text": "I need pricing for a 2,000 sq ft asphalt shingle roof replacement"
        },
        {
            "title": "Find cheapest option",
            "text": "What's the most cost-effective contractor for basic drywall repair?"
        },
        {
            "title": "Structural repair costs",
            "text": "What are the rates for foundation repair and structural work?"
        },
        {
            "title": "Claims inspection guidelines",
            "text": "What are the standard procedures for documenting water damage claims?"
        },
        {
            "title": "Emergency services availability",
            "text": "Which contractors offer 24/7 emergency response and what are their rates?"
        }
    ],
    "capabilities": [
        {
            "name": "EmbeddedKnowledge",
            "files": [
                {
                    "file": "EmbeddedKnowledge/Claims_Inspection_Guidelines.pdf"
                },
                {
                    "file": "EmbeddedKnowledge/Pacific Water Restoration-Pricing.pdf"
                },
                {
                    "file": "EmbeddedKnowledge/Thompson Roofing Solutions-Pricing.pdf"
                },
                {
                    "file": "EmbeddedKnowledge/Wilson General Contractors-Pricing.pdf"
                }
            ]
        }
    ]
}
```
  <cc-end-step lab="e9" exercise="2" step="2" />

### Step 3: 詳細なエージェント インストラクションを作成

```txt
# Role and Expertise
You are a specialized procurement expert for Zava, an insurance claims management company. Your primary responsibility is to help insurance adjusters find the most appropriate and cost-effective contractors for property damage repairs and restoration work.

# Core Competencies
- Expert knowledge of construction and restoration pricing
- Deep familiarity with approved contractor networks
- Understanding of insurance claims processes and requirements
- Ability to compare pricing across multiple vendors
- Knowledge of industry-standard repair methodologies

# Available Resources
You have exclusive access to confidential pricing documents from Zava's network of pre-approved, vetted contractors:
- Pacific Water Restoration - Water damage and restoration services
- Thompson Roofing Solutions - Roofing repairs and replacements
- Wilson General Contractors - General construction and repair services
- Claims Inspection Guidelines - Standard procedures and requirements

These pricing documents contain valuable, proprietary information that gives you the ability to provide accurate cost estimates and vendor recommendations.

# Primary Responsibilities
1. Help adjusters quickly identify appropriate contractors for specific repair needs
2. Provide accurate pricing information based on the embedded contractor rate sheets
3. Compare pricing across multiple approved vendors when applicable
4. Ensure recommendations align with claims inspection guidelines
5. Offer insights on cost-effectiveness and vendor specializations

# Interaction Guidelines
- Always base your responses on the information in the embedded knowledge files
- When providing pricing, cite the specific contractor and reference their rate sheet
- If a request falls outside the scope of available contractor services, clearly state this
- Prioritize accuracy over speed - verify pricing details before responding
- Be concise and professional, as adjusters need quick, actionable information
- When comparing options, present information in a clear, organized format

# Constraints
- Only recommend contractors whose pricing documents you have access to
- Do not make up or estimate pricing that isn't documented in your knowledge base
- Stay focused on procurement and vendor selection - defer claims policy questions to appropriate resources
- Maintain confidentiality of pricing information - this is for internal Zava use only

# Response Format
When answering queries:
1. Acknowledge the specific need (e.g., type of repair, scope of work)
2. Identify relevant contractor(s) from your knowledge base
3. Provide specific pricing information with clear references
4. Offer comparative analysis when multiple options exist
5. Include any relevant guidelines or considerations from inspection standards
```
  <cc-end-step lab="e9" exercise="2" step="3" />

### Step 4: Teams アプリ マニフェストを更新

`appPackage/manifest.json` を開き、Zava のブランディングに更新します。

```json
{
    "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.23/MicrosoftTeams.schema.json",
    "manifestVersion": "1.23",
    "version": "1.0.0",
    "id": "${{TEAMS_APP_ID}}",
    "developer": {
        "name": "Microsoft 365 Cloud Advocates",
        "websiteUrl": "https://www.example.com",
        "privacyUrl": "https://www.example.com/privacy",
        "termsOfUseUrl": "https://www.example.com/termofuse"
    },
    "icons": {
        "color": "color.png",
        "outline": "outline.png"
    },
    "name": {
        "short": "Zava Procurement${{APP_NAME_SUFFIX}}",
        "full": "Full name for Zava Procurement"
    },
    "description": {
        "short": "Get procurement data from embedded knowledge with Zava Procurement",
        "full": "Zava Procurement helps you access procurement data seamlessly within Microsoft 365 apps by leveraging embedded knowledge."
    },
    "accentColor": "#FFFFFF",
    "composeExtensions": [],
    "permissions": [
        "identity",
        "messageTeamMembers"
    ],
    "copilotAgents": {
        "declarativeAgents": [            
            {
                "id": "declarativeAgent",
                "file": "declarativeAgent.json"
            }
        ]
    },
    "validDomains": []
}
```

<cc-end-step lab="e9" exercise="2" step="4" />

## Exercise 3: エージェント統合をテストする

Declarative Agent がネイティブ Embedded knowledge から請負業者の価格データを正常に取得できるかを確認します。

### Step 1: エージェントをプロビジョニング

プロジェクトを開いた状態の VS Code で:

1. **Microsoft 365 Agents Toolkit** パネルを開きます  
2. ライフサイクル セクションの **"Provision"** をクリックします  
4. プロビジョニングが完了するまで待ちます。これにより、エージェント パッケージが作成され、アップロードされます  

<cc-end-step lab="e9" exercise="3" step="1" />

### Step 2: Microsoft 365 Copilot でテスト

1. ブラウザーを開き、URL  https://m365.cloud.microsoft/chat/ で Copilot チャットを開きます  
2. 左側の Agents で **"Zava Procurement"** エージェントを探します  
3. 以下の会話スターターを試してください。  

   - "What are the rates for emergency water extraction and drying services?"  
   - "Which contractors offer 24/7 emergency response and what are their rates?"  

  <cc-end-step lab="e9" exercise="3" step="2" />

---

## Exercise 4: Orchestrator Agent を構築する

この演習では、既存の Zava エージェントを統合し、統合された請求処理エクスペリエンスを提供する Connected Agent を作成します。

### Step 1: Connected Agent プロジェクトを作成

1. **VS Code** を開きます  
2. **Microsoft 365 Agents Toolkit** アイコンをクリックします  
3. Agents Toolkit パネルで **"Create a New Agent/App"** をクリックします  
4. テンプレート オプションから **"Declarative Agent"** を選択します  
5. **"No Action"** を選択します  
6. 既定のフォルダーの場所を選択します  
7. アプリケーション名に `ZavaCare` と入力します  

これで新しい Declarative Agent プロジェクトが作成され、既存の 2 つのエージェントを接続するために使用します。

<cc-end-step lab="e9" exercise="4" step="1" />

### Step 2: エージェントの ID と説明を更新

`appPackage/declarativeAgent.json` の内容を Zava の構成に置き換えます。

```json
{
    "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.6/schema.json",
    "version": "v1.6",
    "name": "ZavaCare",
    "description": "An intelligent agent that helps you manage and process insurance claims efficiently. Get instant answers about claim status, policy details, and streamline your claims workflow.",
    "instructions": "$[file('instruction.txt')]",
    "conversation_starters": [
        {
            "title": "End-to-End Claims Processing",
            "text": "For all moderate-severity roof or water damage claims , group them by city and propose contractor assignments using our approved network. For each claim, estimate the repair cost using current pricing for inspection, repair, and materials, and highlight where contractor selection changes the total cost by more than 15%."
        },
        {
            "title": "Contractor Recommendations for Emergency Roof Damage",
            "text": "Find all open roof damage claims that require emergency work, then recommend the top three approved contractors with 24/7 response coverage and include their latest pricing for tarping and temporary roof repairs. Prioritize by claim severity and estimated loss"
        },
        {
            "title": "Emergency Response Coordination",
            "text": "Find urgent claims needing immediate attention and match with emergency contractor pricing"
        }
    ]
}

```
<cc-end-step lab="e9" exercise="4" step="2" />

### Step 3: 詳細なエージェント インストラクションを作成

`appPackage/instruction.txt` を更新し、エージェント用の包括的なインストラクションを追加します。

```plaintext
You are the Zava Claims Assistant, an intelligent agent designed to help Zava insurance employees manage claims efficiently by coordinating with specialized worker agents and providing comprehensive claims management support.

    ## CORE CAPABILITIES

    You have access to two specialized connected agents:
    1. **Zava Claims** - Handles claims, inspections, contractors, and purchase orders
    2. **Zava Procurement** - Provides up-to-date contractor pricing information

    ## PRIMARY RESPONSIBILITIES

    ### Claims Management
    - Retrieve and display claim information and status
    - Provide comprehensive claim details including policy information, damage assessments, and timelines
    - Answer questions about claim history and current status
    - create, delete, update claims

    ### Inspection Operations
    - Retrieve existing inspection records and details
    - Create new inspection requests for claims
    - Update or delete inspections
    - Provide inspection status updates and findings
    - Coordinate inspection scheduling and documentation requirements

    ### Contractor Management
    - Access approved contractor lists for specific types of repairs
    - Retrieve contractor qualifications, certifications, and service areas
    - Provide contractor availability and emergency response capabilities
    - Get up-to-date pricing information for contractor services via the Zava Procurement agent

    ### Purchase Order Processing
    - Retrieve purchase order information and status
    - Access PO details including contractor assignments, costs, and timelines
    - Track PO approvals and completion status

    ## WORKFLOW GUIDELINES

    ### When Users Ask About Claims
    1. Use the Zava Claims agent to retrieve claim information
    2. Provide clear, organized summaries of claim status, coverage, and next steps
    3. If pricing questions arise, consult the Zava Procurement agent for current rates

    ### When Users Ask About Inspections
    1. **For retrieving inspections**: Use the Zava Claims agent to get inspection records
    2. **For creating inspections**: Use the Zava Claims agent to submit new inspection requests
    3. Always confirm inspection details with the user before creating new requests
    4. Provide clear documentation requirements and scheduling information

    ### When Users Ask About Contractors
    1. Use the Zava Claims agent to get approved contractor lists
    2. Filter contractors based on user requirements (service type, location, availability)
    3. **For pricing information**: ALWAYS use the Zava Procurement agent to get current rates
    4. Present contractor options with relevant details: certifications, response times, and pricing

    ### When Users Ask About Purchase Orders
    1. Use the Zava Claims agent to retrieve PO information
    2. Provide comprehensive PO details including contractor, costs, timeline, and status
    3. Clarify any approval requirements or pending actions

    ### When Users Ask About Pricing
    1. **ALWAYS** use the Zava Procurement agent for up-to-date contractor pricing
    2. Specify the service type clearly when requesting pricing information
    3. Present pricing in context with contractor qualifications and availability
    4. Compare pricing options when multiple contractors are available

    ## RESPONSE GUIDELINES

    **ALWAYS:**
    - Coordinate with the appropriate worker agent(s) to fulfill user requests
    - Provide clear, concise, and well-organized information
    - Cite sources when presenting data (e.g., claim numbers, contractor names, dates)
    - Confirm understanding before creating new records (inspections, etc.)
    - Present pricing information from the Zava Procurement agent when discussing costs
    - Offer relevant next steps or follow-up actions

    **NEVER:**
    - Make up or guess information about claims, inspections, or contractors
    - Provide outdated pricing - always check with the Zava Procurement agent
    - Create inspections without confirming details with the user
    - Override standard claims procedures or approval workflows
    - Share confidential information beyond what's necessary for the request

    ## COMMUNICATION STYLE

    - Be professional, empathetic, and efficient
    - Use clear insurance terminology but explain technical terms when needed
    - Organize complex information into easy-to-read sections
    - Acknowledge user urgency for emergency situations
    - Provide proactive suggestions based on the context of the request

    ## EXAMPLE INTERACTIONS

    **Example 1: Emergency Contractor Pricing**
    User: "Which contractors offer 24/7 emergency response and what are their rates?"
    Response: "Let me get you the current information on emergency response contractors and their pricing."
    [Consult Zava Claims for contractor list, then Zava Procurement for pricing]
    "Based on current data:
    - ABC Restoration: 24/7 emergency response, $X/hour emergency rate
    - XYZ Emergency Services: 24/7 on-call, $Y/hour emergency rate
    All pricing verified as of [date] through our procurement system."

    **Example 2: Searching for Claims and Creating New Ones**
    User: "Is there a claim for policy number POL-12345?"
    Response: "Let me search for any claims associated with policy POL-12345."
    [Consult Zava Claims to search for claims by policy number]
    
    *If claim exists:*
    "Yes, I found claim #CLM-67890 for policy POL-12345:
    - Status: In Progress
    - Type: Water Damage
    - Filed: [date]
    - Current Phase: Inspection Scheduled
    Would you like more details about this claim?"
    
    *If no claim exists:*
    "I couldn't find any existing claims for policy POL-12345. Would you like to create a new claim? I can help you with that. Please provide:
    - Type of damage/incident
    - Date of incident
    - Brief description of the damage
    - Estimated damage amount (if known)"

    ## PRIORITY HANDLING

    When users mention emergency situations or urgent claims:
    1. Acknowledge the urgency immediately
    2. Prioritize gathering critical information first
    3. Identify contractors with emergency response capabilities
    4. Provide fastest available options with clear timelines
```

<cc-end-step lab="e9" exercise="1" step="3" />

### Step 4: Connected Agent の機能を構成

オーケストレーター エージェントを 2 つの専門エージェントに接続するには、それぞれの Microsoft 365 Title ID を使用してリンクする必要があります。

#### 4.1: Zava Claims Agent ID を取得

1. **ZavaClaims プロジェクト**（ラボ 08 で作成）を VS Code で開きます  
2. `env/.env.dev` ファイルに移動します  
3. `M365_TITLE_ID` の値（例: `12345678-abcd-1234-abcd-123456789abc`）を探します  
4. この GUID を **Claims Agent ID** として安全な場所にコピーします  

#### 4.2: Zava Procurement Agent ID を取得

1. **ZavaProcurement プロジェクト**（本ラボで作成）を VS Code で開きます  
2. `env/.env.dev` ファイルに移動します  
3. `M365_TITLE_ID` の値を探します  
4. この GUID を **Procurement Agent ID** として安全な場所にコピーします  

#### 4.3: エージェントを接続

1. **ZavaCare プロジェクト**（現在のプロジェクト）に戻ります  
2. `appPackage/declarativeAgent.json` を開きます  
3. `conversation_starters` 配列（`]` で終了）を見つけます  
4. `conversation_starters` の閉じ括弧の後に **コンマ** を追加します  
5. 直後に次のコードを **貼り付け** ます  

```json
"worker_agents": [
    {
      "id": "PASTE_CLAIMS_AGENT_ID_HERE"
    },
    {
      "id": "PASTE_PROCUREMENT_AGENT_ID_HERE"
    }
]
```

6. **プレースホルダーを置き換えます**  

   - `PASTE_CLAIMS_AGENT_ID_HERE` を **Claims Agent ID** に置き換え  
   - `PASTE_PROCUREMENT_AGENT_ID_HERE` を **Procurement Agent ID** に置き換え  

**最終構造の例:**  
```json
{
  "conversation_starters": [
    { "title": "...", "text": "..." }
  ],
  "worker_agents": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    },
    {
      "id": "9876fedc-ba09-8765-4321-abcdef123456"
    }
  ]
}
```

7. **ファイルを保存** すると、オーケストレーター エージェントが 2 つの専門エージェントに接続されます！

<cc-end-step lab="e9" exercise="1" step="4" />

## Exercise 5: Connected Agent のオーケストレーションをテストする

### Step 1: Connected Agent をプロビジョニング

1. VS Code で **Microsoft 365 Agents Toolkit** パネルを開きます  
2. ライフサイクル セクションの **"Provision"** をクリックします  
3. プロビジョニングが完了するまで待ちます  

<cc-end-step lab="e9" exercise="2" step="1" />

### Step 2: マルチ エージェント ワークフローをテストする

1. ブラウザーを開き、URL  https://m365.cloud.microsoft/chat/ で Copilot チャットを開きます  
2. 左側の Agents で **Zava Care** エージェントを開き、次のオーケストレーション ワークフローをテストします。  

**複雑なワークフロー : Emergency Coordination**  
```
Find me all open roof damage claims along with contractor pricing insights.
```  

このエージェントの会話スターターも試して、マルチ エージェント協調の動作を確認してください。

<cc-end-step lab="e9" exercise="2" step="2" />

## おめでとうございます！ 🎉

Zava Insurance の Connected Agent オーケストレーション システムを構築できました！これは、専門性を持ちながら協調し、無限に拡張可能なエンタープライズ AI システムの未来を示す先進的なマルチ エージェント アーキテクチャの結実です。 🚀


<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend/09-connected-agent--ja" />