---
search:
  exclude: true
---
# ラボ MCS9 - Connected Agents (プレビュー)

このラボでは、Microsoft Copilot Studio でエージェント同士が通信できる方法を学習します。前のラボで作成した HR Candidate Management エージェントのデータを利用する、面接日程調整専用の Interview Scheduler エージェントを構築します。Interview Scheduler エージェントは候補者データを自動処理し、選択した候補者に基づいて面接の会議招待を送信します。これにより、モジュール化されたエージェントが連携して包括的なビジネス ソリューションを作成する方法を体験できます。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/JFzxTCIoihY" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を短時間で確認しましょう。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    このラボは前のラボ、特に [ラボ MCS6 - Consuming an MCP server](../06-mcp){target=_blank} を前提としています。前のラボで稼働中の HR MCP サーバーと、「HR Agent with MCP」エージェントが構成済みである必要があります。

このラボで学習する内容:

- Microsoft Copilot Studio での子エージェントの作成方法
- エージェント間通信の構成方法
- 複雑なワークフロー向けのモジュラー型エージェント アーキテクチャの設計方法
- 専門エージェント間のハンドオフ メカニズムの実装方法
- エンドツーエンドのビジネス プロセスで複数のエージェントを調整する方法

## Exercise 1: エージェント間アーキテクチャの理解

この演習では、エージェント間通信の概念を理解し、面接日程調整ソリューションのアーキテクチャを設計します。

### Step 1: エージェント通信パターンの確認

Microsoft Copilot Studio では、エージェント連携のために主に 2 つのパターンをサポートしています:

1. **子エージェント**: 親ソリューションの一部として管理される軽量エージェント  
2. **Connected Agents**: 別個に公開・管理できる独立したエージェント

!!! info
    Microsoft Copilot Studio の Connected Agents については、[Add other agents overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/authoring-add-other-agents){target=_blank} を参照してください。

本ラボでは、次のような子エージェント アーキテクチャを作成します:

- **メイン エージェント**: Interview Coordinator (全体のプロセスをオーケストレーション)
- **子エージェント**: Interview Scheduler (会議作成とカレンダー管理を担当)
- **Connected Agent**: HR Candidate Management (前回のラボで作成した既存エージェント)

この設計により、以下が実現できます:

- 役割の明確な分離
- HR Candidate Management 機能の再利用
- 調整されたワークフロー実行
- 保守性と拡張性の高いソリューション アーキテクチャ

<cc-end-step lab="mcs9" exercise="1" step="1" />

### Step 2: 面接プロセス ワークフローの設計

今回実装する Connected Agents ワークフローは次のシーケンスで進行します:

1. **ユーザー リクエスト**: ユーザーが特定の候補者との面接を依頼  
2. **メイン エージェント処理**: Interview Coordinator がリクエストを検証し、候補者を特定  
3. **エージェント ハンドオフ**: メイン エージェントが HR Candidate Management に委任して候補者情報を取得  
4. **データ処理**: 候補者情報を抽出して検証  
5. **子エージェント呼び出し**: Interview Scheduler 子エージェントを候補者データでトリガー  
6. **会議作成**: 子エージェントがカレンダー会議を作成し、招待を送信  
7. **確認**: ユーザーが面接予定の確認を受信  

このワークフローは次の Connected Agents パターンを示します:

- **オーケストレーション**: メイン エージェントが複数のサブプロセスを統括  
- **委任**: 特定タスクを専門エージェントへハンドオフ  
- **データ フロー**: エージェント間で情報がシームレスに流通  
- **イベント駆動処理**: エージェントが特定のトリガーと条件に反応  

<cc-end-step lab="mcs9" exercise="1" step="2" />

### Step 3: 前提条件の確認

次の前提条件が満たされていることを確認してください:

- **ラボ MCS6**: HR MCP サーバーが dev tunnel 経由で稼働中  
- **Microsoft Graph アクセス**: カレンダー イベント作成およびメール送信の権限  
- **サンプル候補者データ**: 前のラボで少なくとも 2〜3 名の候補者が HR システムに登録済み  

HR MCP サーバーが稼働していることを確認し、停止している場合は MCP サーバー プロジェクトのルート フォルダーで次のコマンドを実行してください:

```console
dotnet run
```

次に dev tunnel が有効になっていることを確認します:

!!! important
    `hr-mcp` は例です。必ず [ラボ MCS6 - Consuming an MCP server](../06-mcp){target=_blank} で使用した一意の名前に置き換えてください。

```console
devtunnel host hr-mcp
```

また、Interview Scheduler が使用する候補者データが存在するか、HR MCP サーバーを直接テストして確認してください。

<cc-end-step lab="mcs9" exercise="1" step="3" />

## Exercise 2: メイン Interview Coordinator エージェントの作成

この演習では、面接日程調整プロセスをオーケストレーションし、他のエージェントと連携するメイン エージェントを作成します。

### Step 1: Interview Coordinator エージェントの作成

ブラウザーで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、職場アカウントでサインインします。

`Copilot Dev Camp` 環境を選択し、**Create** → **New Agent** を選択して新しいエージェントを作成します。

**Configure** を選択し、以下の設定でメイン コーディネーター エージェントを定義します:

- **Name**: 

```text
Interview Coordinator
```

- **Description**: 

```text
Main agent that coordinates interview scheduling by working with HR candidate 
management and interview scheduling child agents to create comprehensive interview workflows
```
- **Select your agent's model**: GPT-5 Chat

- **Instructions**: 

```text
You are the Interview Coordinator, responsible for managing end-to-end interview 
scheduling processes. Your role includes:

1. Understanding user requests for interview scheduling
2. Coordinating with the HR Candidate Management agent to retrieve candidate information
3. Delegating to the Interview Scheduler child agent for meeting creation
4. Providing comprehensive feedback to users about scheduled interviews

When a user requests to schedule an interview:
- First, identify and validate the candidate using the HR system
- Extract necessary candidate details (name, email, current role, skills)
- Coordinate with the Interview Scheduler to create the meeting
- Confirm successful scheduling with relevant details

Always ensure proper validation of candidate data and provide clear communication 
throughout the process. Handle errors gracefully and provide informative feedback 
when coordination between agents fails.
```

**Knowledge** セクションでは、面接日程調整ガイドラインや会社固有の HR ポリシー文書を任意で追加できます。本ラボでは、エージェントの組み込み機能と他エージェントとの統合に依存します。

![The Interview Coordinator agent configuration showing the "GPT-5 Chat" model.](../../../assets/images/make/copilot-studio-09/coordinator-agent-01.png)

編集した各セクションで **Save** を選択して、コーディネーター エージェントの設定を更新します。

<cc-end-step lab="mcs9" exercise="2" step="1" />

### Step 2: エージェント設定の構成

エージェントを作成したら、オーケストレーション機能とナレッジ設定を構成します。右上の **Settings** コマンドを選択し、エージェントを設定します。

**Orchestration** セクションで **Use generative AI orchestration for your agent's responses?** を `Yes - Responses will be dynamic, using available tools and knowledge as appropriate` に設定します。これにより、エージェントは子エージェントや Connected Agents の間でインテリジェントに調整できます。

**Knowledge** セクションは次の設定にします:

- **Use general knowledge**: off  
- **Use information from the web**: off

![The "Generative AI" settings for the agent, with general knowledge and information from the web turned off.](../../../assets/images/make/copilot-studio-09/coordinator-agent-02.png)

**Save** を選択し、設定を確定します。

<cc-end-step lab="mcs9" exercise="2" step="2" />

### Step 3: HR Candidate Management エージェントへの接続

Interview Coordinator が候補者情報を取得するために既存の HR エージェントと通信できるようにします。1️⃣ **Agents** セクションに移動し、2️⃣ **Add** を選択します。

![The tab to connect an agent to other agents. There is an "Add" command to add an agent to the current one.](../../../assets/images/make/copilot-studio-09/connect-agent-01.png)

ダイアログが表示され、次の選択肢が提示されます:

- **New child agent**: 新しい子エージェントを作成  
- **Select an agent in your environment**: 既存の Copilot Studio エージェントを選択  
- **Connect to an external agent**: 以下の外部エージェントへ接続 (プレビュー)  
    - **Microsoft Fabric**: Fabric Data Agent への接続  
    - **Microsoft Foundry**: Microsoft Foundry 内のエージェントへの接続  
    - **Microsoft 365 Agents SDK**: Microsoft 365 Agents SDK で構築したエージェントへの接続  
    - **Agent2Agent**: A2A プロトコルを使用するエージェントへの接続  

![The dialog to select the kind of agent to connect. The available options are "New child agent", already existing Copilot Studio agents, and "Connect to an external agent".](../../../assets/images/make/copilot-studio-09/connect-agent-02.png)

利用可能な Copilot Studio エージェントの一覧から、前のラボで作成した **HR Candidate Management** (または類似名称) エージェントを選択します。表示されない場合は、エージェントが発行済みで他エージェントからの接続を許可するよう構成されているか確認してください。確認するには **HR Candidate Management** エージェントを編集し、**Settings** で **Let other agents connect to and use this one** オプションが **Connected agents** セクションで有効になっていることを確認します。

![The setting to allow connections from other agents highlighted in the agent's settings.](../../../assets/images/make/copilot-studio-09/connect-agent-settings-01.png)

**HR Candidate Management** エージェントを選択したら接続を構成します:

- **Description**: 文脈に合わせてわかりやすく更新

```text
HR system integration for retrieving and managing candidate information during 
interview scheduling processes. Provides candidate lookup, data validation, and 
comprehensive candidate details.
```

説明は、メイン エージェントが接続エージェントを呼び出すタイミングを理解するために使用します。具体的かつ明確に記述してください。

- **Pass conversation history**: 有効のままにして、ハンドオフ時にコンテキストを維持

![The agent connection configuration showing the HR Candidate Management agent being connected to the Interview Coordinator. There is a textbox to specificy a "Description" for the connected agent to provide a more specific context.](../../../assets/images/make/copilot-studio-09/connect-agent-04.png)

**Add and configure** を選択して、エージェント間の接続を確立します。接続エージェントが定義・構成されると、現在のエージェントの **Agents** リストに表示され、接続エージェントの構成を管理するページが表示されます。

![The agent connection configuration showing the HR Candidate Management agent being connected to the Interview Coordinator. There are fields to configure "Name", "Description", whether to pass the conversation history to the connected agent or not, input fields, and completion settings.](../../../assets/images/make/copilot-studio-09/connect-agent-result-01.png)

<cc-end-step lab="mcs9" exercise="2" step="3" />

## Exercise 3: Interview Scheduler 子エージェントの作成

この演習では、会議作成とカレンダー管理を担当する専用子エージェントを作成します。

### Step 1: Interview Scheduler 子エージェントの作成

Interview Coordinator エージェントで 1️⃣ **Agents** セクションに移動し、2️⃣ **Add an agent** を選択します。

![The list of agents connected to the main agent. There is the "HR Candidate Management" one enabled, with relationship status of "Connected", and with trigger value "By agent". There is also the "Add an agent" command highlighted to add a new agent.](../../../assets/images/make/copilot-studio-09/connect-agent-05.png)

**New child agent** を選択して新しい子エージェントを作成します。

![The dialog to select the kind of agent to connect. The available options are "New child agent", already existing Copilot Studio agents, and "Connect to an external agent".](../../../assets/images/make/copilot-studio-09/child-agent-01.png)

以下の設定で子エージェントを構成します:

- **Name**: 

```text
Interview Scheduler
```

- **When will this be used?**: **The agent chooses** を選択し、メイン エージェントからの調整要求に応答できるようにします

- **Description**:

```text
Helps scheduling an interview with a candidate. Requires information like the email
of the candidate and the date and time of the meeting.
```

- **Instructions**: 

```text
You are the Interview Scheduler, a specialized agent focused on creating and managing 
interview meetings. When invoked by the Interview Coordinator, you:

1. Process candidate information received from the main agent
2. Create appropriate calendar meeting invitations
3. Include relevant candidate details in meeting descriptions
4. Send meeting invitations to appropriate stakeholders
5. Provide confirmation details back to the coordinator

For each interview scheduling request:
- Create a 1-hour meeting slot (suggest next business day if no specific time provided)
- Include candidate name, role, and key skills in the meeting title and description
- Invite the requesting user and any additional specified interviewers
- Set appropriate meeting location (in-person, Teams, etc.)
- Include candidate resume/profile information in meeting notes

Always confirm successful meeting creation with meeting details including date, time, 
attendees, and meeting link if applicable.
```

![The child agent creation page showing the Interview Scheduler configuration with message-based triggering.](../../../assets/images/make/copilot-studio-09/child-agent-02.png)

画面右上の **Save** コマンドを選択して新しい子エージェントを保存します。子エージェントが作成されたことを示す緑色の確認メッセージが表示されます。

<cc-end-step lab="mcs9" exercise="3" step="1" />

### Step 2: Meetings Management 連携の構成

Interview Scheduler がカレンダー会議を作成できるように、会議管理用 MCP サーバーとの統合を追加します。

![The dialog to search for the "Meeting Management MCP Server" in the list of available MCP servers. There is a search filter for "Calendar" applied in the dialog.](../../../assets/images/make/copilot-studio-09/child-agent-03.png)

**Interview Scheduler** 子エージェントの **Tools** セクションで **Add** を選択します。

1. 1️⃣ **Model Context Protocol** を選択して利用可能な MCP サーバーをフィルター  
1. 検索ボックスで 2️⃣ **Calendar** と入力し、3️⃣ 検索を実行  
1. 4️⃣ **Meeting Management MCP Server** を選択  
1. Meeting Management MCP Server に接続  
1. 接続が構成できたら **Add and configure** を選択してツールの設定を完了  

![The dialog to connect to the Meeting Management MCP Server. There is a command "Add and configure" to add the MCP server to the child agent and a command to "Cancel" the current operation.](../../../assets/images/make/copilot-studio-09/child-agent-04.png)

接続が確立され MCP サーバーが子エージェントに追加されたら、新しいツールの構成パネルが表示されます。**Name** を次の値に更新してください:

```text
Manage meetings
```

この連携により、子エージェントは次の操作を実行できます:

- カレンダー イベントの作成  
- 会議招待の送信  
- 会議詳細と出席者の管理  

<cc-end-step lab="mcs9" exercise="3" step="2" />

### Step 3: 子エージェント設定の最終調整

左上のツール名の横にある矢印を選択して子エージェント **Interview Scheduler** の **Overview** タブに戻り、設定を完了します。

![The child agent additional configuration showing priority settings and activation conditions.](../../../assets/images/make/copilot-studio-09/child-agent-06.png)

1. **Details** セクションを開き、**Advanced** パネルを展開して **Priority** を **1** に設定し、面接日程調整タスクで高い優先度を与えます  
1. **Condition**: 必要に応じて、面接関連のキーワードを含むメッセージのみに反応するなど、発動条件を追加  
1. **Enabled** トグルがオンになっていることを確認  
1. **Save** を選択して子エージェントを作成  

これで Interview Scheduler 子エージェントの設定が完了し、メインの Interview Coordinator エージェントから呼び出された際に会議作成タスクを処理できるようになりました。

<cc-end-step lab="mcs9" exercise="3" step="3" />

## Exercise 4: Connected Agents ワークフローの実装

この演習では、面接日程調整のための完全な Connected Agents ワークフローを実装し、テストします。

### Step 1: Instructions でのエージェント参照の構成

正しくエージェントを調整するため、メイン エージェントの instructions で子エージェントおよび Connected エージェントを参照する必要があります。

Interview Coordinator エージェントの **Overview** セクションに移動し、**Instructions** フィールドで **Edit** コマンドを選択して更新します:

1. エージェントを参照したい位置にカーソルを置きます  
1. `/` を入力して参照メニューを開きます  
1. **Interview Scheduler** 子エージェントをリストから選択  
1. **HR Candidate Management** Connected エージェントも参照  

![The Instructions field browsing for both connected and child agents when pressing "/" in the text of the instructions.](../../../assets/images/make/copilot-studio-09/coordinator-agent-03.png)

更新後の instructions は次のようになります:

```text
You are the Interview Coordinator, responsible for managing end-to-end interview 
scheduling processes. Your role includes:

1. Understanding user requests for interview scheduling
2. Coordinating with /HR Candidate Management agent to retrieve candidate information
3. Delegating to /Interview Scheduler child agent for meeting creation
4. Providing comprehensive feedback to users about scheduled interviews

When a user requests to schedule an interview:
- First, use /HR Candidate Management to identify and validate the candidate
- Extract necessary candidate details (name, email, current role, skills)
- Coordinate with /Interview Scheduler to create the meeting with candidate details using the ID of the calendar with name "main" of the current user
- Confirm successful scheduling with relevant details

Always ensure proper validation of candidate data and provide clear communication 
throughout the process. Handle errors gracefully and provide informative feedback 
when coordination between agents fails.
```

![The Instructions field showing agent references using the slash notation for both connected and child agents.](../../../assets/images/make/copilot-studio-09/coordinator-agent-04.png)

**Save** を選択してエージェント参照付きの instructions を更新します。

<cc-end-step lab="mcs9" exercise="4" step="1" />

## Exercise 5: エージェントのテスト

この演習では、実際に面接を予定に登録してエージェントをテストします。

### Step 1: エージェント間通信のテスト

すべてのコンポーネント間で正しく調整が行われるか、完全なエージェント間ワークフローをテストします。

#### Interview Coordinator のテスト

テスト パネルで次のように入力します:

```text
Retrieve information about candidate alice.johnson@example.com and schedule an interview with her for next Monday 10am.
```

#### エージェント調整の観察

テスト パネルでエージェントが次を行う様子を確認します:

- リクエストを処理  
- HR Candidate Management エージェントを呼び出し Alice Johnson を検索  
- 候補者詳細を取得  
- Interview Scheduler 子エージェントを呼び出し  
- 初回利用の場合は Meeting Management MCP サーバーへの接続を促しつつカレンダー会議を作成  
- 確認を返答  

![The test panel showing the agent coordination workflow with multiple agents working together to schedule an interview.](../../../assets/images/make/copilot-studio-09/coordinator-agent-05.png)

以下のスクリーンショットは、子エージェントと Connected エージェントを利用してエージェントがスケジュールした面接会議の例です。

![The interview meeting scheduled in the calendar of the current user. There are information about the interview in the body of the meeting. The meeting itselft has been sent to the current user and to the candidate's e-mail address.](../../../assets/images/make/copilot-studio-09/coordinator-agent-06.png)

<cc-end-step lab="mcs9" exercise="5" step="1" />

---8<--- "ja/mcs-congratulations.md"

ラボ MCS9 - Agent to Agent Communication を完了しました!

このラボでは、次のことを学習しました:

- Connected Agents アーキテクチャの設計と実装  
- メイン エージェント ソリューション内での専門タスク向け子エージェントの作成  
- 既存エージェントを接続してエージェント間のデータ共有と調整を実現  
- 複数の専門エージェントにまたがる複雑なワークフローの実装  

Interview Coordinator エージェントは、高度なエージェント オーケストレーション パターンを示し、HR Candidate Management システムと専門的な Interview Scheduler 機能を連携させて面接日程調整を自動化します。

本ラボで学んだ Connected Agents パターンは、複雑なワークフローがモジュラーで専門化されたエージェントの連携によってエンドツーエンド ソリューションを実現する、多くのビジネス シナリオに適用できます。

<a href="../10-mcp-oauth">こちら</a> からラボ MCS10 を開始し、Copilot Studio で OAuth で保護された MCP サーバーを利用する方法を学びましょう。  
<cc-next /> 

<!-- <cc-award badgeId="Make" badgeName="Make" badgeUrl="#" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/09-connected-agents--ja" />