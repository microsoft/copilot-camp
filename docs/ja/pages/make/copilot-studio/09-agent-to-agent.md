---
search:
  exclude: true
---
# ラボ MCS9 - エージェント間通信 (プレビュー)

このラボでは、Microsoft Copilot Studio でエージェント同士が通信する方法を学習します。前のラボで作成した HR Candidate Management エージェントのデータを利用する、特化型の Interview Scheduler エージェントを構築します。Interview Scheduler エージェントは候補者データを自動で処理し、選定された候補者に対して面接ミーティングを送信します。これにより、モジュール化されたエージェント同士が連携して、包括的なビジネス ソリューションを実現できることを示します。

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/placeholder" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
   ---8<--- "ja/mcs-labs-prelude.md"
    </div>
</div>

!!! note
    本ラボは、特に [Lab MCS6 - Consuming an MCP server](../06-mcp){target=_blank} に基づいています。前のラボで作成した HR MCP サーバーと「HR Agent with MCP」エージェントが動作している必要があります。

このラボで学習する内容:

- Microsoft Copilot Studio で子エージェントを作成する方法
- エージェント間通信を構成する方法
- 複雑なワークフロー向けにモジュール型エージェント アーキテクチャを設計する方法
- 特化型エージェント間でハンドオフ メカニズムを実装する方法
- エンドツーエンドのビジネス プロセスを複数エージェントで調整する方法

## Exercise 1: エージェント間アーキテクチャの理解

この演習では、エージェント間通信の概念を理解し、面接スケジューリング ソリューションのアーキテクチャを設計します。

### Step 1: エージェント通信パターンの確認

Microsoft Copilot Studio では、エージェント連携のために主に次の 2 パターンをサポートしています。

1. **子エージェント**: 親エージェント内に存在する軽量エージェントで、親ソリューションの一部として管理されます  
2. **接続エージェント**: 独立した本格的エージェントで、個別に発行・管理できます  

本ラボでは次の子エージェント アーキテクチャを作成します。

- **メイン エージェント**: Interview Coordinator (全体プロセスをオーケストレーション)
- **子エージェント**: Interview Scheduler (ミーティング作成とカレンダー管理を担当)
- **接続エージェント**: HR Candidate Management (前のラボで作成した既存エージェント)

この設計により次のメリットが得られます。

- 役割の明確な分離
- HR Candidate Management 機能の再利用性
- 連携したワークフロー実行
- 保守性とスケーラビリティに優れたソリューション アーキテクチャ

<cc-end-step lab="mcs9" exercise="1" step="1" />

### Step 2: 面接プロセス ワークフローの設計

実装するエージェント間ワークフローは次のように進行します。

1. **ユーザー要求**: ユーザーが特定候補者の面接設定を依頼  
2. **メイン エージェント処理**: Interview Coordinator が要求を検証し、候補者を特定  
3. **エージェント ハンドオフ**: メイン エージェントが HR Candidate Management に候補者詳細取得を委任  
4. **データ処理**: 候補者情報を抽出し検証  
5. **子エージェント呼び出し**: Interview Scheduler 子エージェントに候補者データを渡して起動  
6. **ミーティング作成**: 子エージェントがカレンダー ミーティングを作成し招待を送信  
7. **確認**: ユーザーへ面接設定の確認を通知  

このワークフローは主要なエージェント間パターンを示します。

- **オーケストレーション**: メイン エージェントが複数サブプロセスを調整  
- **デリゲーション**: 特定タスクを特化エージェントに委任  
- **データ フロー**: 情報がエージェント間でシームレスに流れる  
- **イベント駆動処理**: エージェントが特定トリガーと条件に応答  

<cc-end-step lab="mcs9" exercise="1" step="2" />

### Step 3: 前提条件の確認

次の前提条件を満たしていることを確認してください。

- **Lab MCS6**: HR MCP サーバーが dev tunnel 経由でアクセス可能
- **Microsoft Graph アクセス**: カレンダー イベント作成およびメール送信の権限
- **サンプル候補者データ**: 前のラボで HR システムに 2～3 名以上の候補者が登録済み

HR MCP サーバーがまだ稼働していることを確認し、停止している場合は MCP サーバー プロジェクトのルート フォルダーで次のコマンドを実行します。

```console
dotnet run
```

また、dev tunnel がアクティブであることを確認します。

!!! important
    以下に示す `hr-mcp` という名前は、[Lab MCS6 - Consuming an MCP server](../06-mcp){target=_blank} で使用した一意の名前に置き換えてください。

```console
devtunnel host hr-mcp
```

さらに、HR MCP サーバーを直接テストして候補者データが存在することを確認してください。Interview Scheduler は既存の候補者を前提に動作します。

<cc-end-step lab="mcs9" exercise="1" step="3" />

## Exercise 2: メイン Interview Coordinator エージェントの作成

この演習では、面接スケジューリング プロセスをオーケストレーションし、他エージェントと連携するメイン エージェントを作成します。

### Step 1: Interview Coordinator エージェントの作成

ブラウザーで [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com){target=_blank} にアクセスし、職場アカウントでサインインします。

`Copilot Dev Camp` 環境を選択し、**Create** → **New Agent** を選択して新しいエージェントを作成します。

**Configure** を選択し、次の設定でメイン コーディネーター エージェントを定義します。

- **Name**: 

```text
Interview Coordinator
```

- **Description**: 

```text
Main agent that coordinates interview scheduling by working with HR candidate 
management and interview scheduling child agents to create comprehensive interview workflows
```

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

**Create** を選択してコーディネーター エージェントを作成します。

<cc-end-step lab="mcs9" exercise="2" step="1" />

### Step 2: 生成 AI オーケストレーションの有効化

エージェント作成後、複数エージェント間のインテリジェントな調整を行えるようオーケストレーション機能を構成します。

**Orchestration** セクションで **Use generative AI to determine how best to respond to users and events** が有効になっていることを確認します。これにより、エージェントが子エージェントや接続エージェント間で適切に調整できます。

![Interview Coordinator エージェント設定で、マルチエージェント調整用に生成 AI を有効化している様子。](../../../assets/images/make/copilot-studio-09/coordinator-agent-01.png)

**Knowledge** セクションでは、必要に応じて面接スケジューリング ガイドラインや社内 HR ポリシーを追加できます。本ラボでは組み込み機能と他エージェント連携に依存します。

変更した場合は **Save** を選択して設定を保存します。

右上の **Settings** を選択し、**Generative AI** セクションを次のように設定します。

- **Use general knowledge**: off  
- **Use information from the web**: off  

![「Generative AI」設定で、一般知識と Web 情報の使用をオフにしている様子。](../../../assets/images/make/copilot-studio-09/coordinator-agent-02.png)

**Save** を選択して新しい設定を確定します。

<cc-end-step lab="mcs9" exercise="2" step="2" />

### Step 3: HR Candidate Management エージェントとの接続

Interview Coordinator が候補者情報を取得できるよう、既存の HR エージェントと通信する必要があります。1️⃣ **Agents** セクションに移動し、2️⃣ **Add** を選択します。

![他エージェント接続用タブ。「Add」コマンドでエージェントを追加可能。](../../../assets/images/make/copilot-studio-09/connect-agent-01.png)

表示されるダイアログで次のオプションから選択します。

- **Create an agent**: 新しい子エージェントを作成  
- **Copilot Studio**: Copilot Studio で定義済みのエージェントを選択  
- **Microsoft Fabric**: Microsoft Fabric で構築したエージェントを選択  

**Copilot Studio** を選択します。

![接続するエージェント種別を選択するダイアログ。「Copilot Studio」が強調表示。](../../../assets/images/make/copilot-studio-09/connect-agent-02.png)

利用可能なエージェント一覧から、前のラボで作成した **HR Candidate Management** エージェント (または同等の名前) を選択します。表示されない場合は、発行済みで他エージェントからの接続を許可しているか確認してください。

![接続可能なエージェント一覧。「HR Candidate Management」エージェントが表示。](../../../assets/images/make/copilot-studio-09/connect-agent-03.png)

接続エージェントを構成します。

- **Description**: このコンテキストに合わせて説明を更新します。

```text
HR system integration for retrieving and managing candidate information during 
interview scheduling processes. Provides candidate lookup, data validation, and 
comprehensive candidate details.
```

説明はメイン エージェントが接続エージェントを呼び出すタイミングを判断するために使用されます。具体的かつ明確に記述してください。

- **Pass conversation history**: エージェント ハンドオフ時にコンテキストを維持するため有効のままにします

![Interview Coordinator に HR Candidate Management エージェントを接続する設定ダイアログ。](../../../assets/images/make/copilot-studio-09/connect-agent-04.png)

**Add agent** を選択してエージェント間接続を確立します。設定後、現在のエージェントの **Agents** 一覧に表示されます。

<cc-end-step lab="mcs9" exercise="2" step="3" />

## Exercise 3: Interview Scheduler 子エージェントの作成

この演習では、面接スケジューリングに必要なミーティング作成とカレンダー管理を担当する特化型子エージェントを作成します。

### Step 1: Interview Scheduler 子エージェントの作成

Interview Coordinator エージェントで、1️⃣ **Agents** セクションに移動し、2️⃣ **Add an agent** を選択します。

![メイン エージェントに接続されているエージェント一覧。「Add an agent」コマンドが強調。](../../../assets/images/make/copilot-studio-09/connect-agent-05.png)

**Create an agent** を選択して新しい子エージェントを作成します。

![エージェント種別の選択ダイアログ。「Create an agent」が強調表示。](../../../assets/images/make/copilot-studio-09/child-agent-01.png)

子エージェントを次の設定で構成します。

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

![Interview Scheduler 子エージェントの作成ページ。メッセージ ベース トリガー設定が表示。](../../../assets/images/make/copilot-studio-09/child-agent-02.png)

画面右上の **Save** コマンドを選択して子エージェントを保存します。子エージェント作成完了の緑色の確認メッセージが表示されます。

<cc-end-step lab="mcs9" exercise="3" step="1" />

### Step 2: カレンダー統合の構成

Interview Scheduler でカレンダー ミーティングを作成できるよう、Microsoft Graph 連携を追加します。

Interview Scheduler 子エージェントの **Tools** セクションで **Add** を選択します。

1. 1️⃣ **Connector** を選択して利用可能なコネクタをフィルター  
1. 2️⃣ **Calendar** と検索ボックスに入力し、3️⃣ 検索アイコンを選択  
1. 4️⃣ **Create event (V4)** ツールを選択  
1. Office 365 Outlook コネクタに接続  
1. 接続完了後、**Add and configure** を選択してツール設定を確定  

![「Create event (V4)」ツールを検索するダイアログ。検索フィルター「Calendar」が適用。](../../../assets/images/make/copilot-studio-09/child-agent-03.png)

新しいツールの設定パネルが表示されます。**Name** を次の値に更新します。

```text
Creates a calendar event
```

続いて **Inputs** セクションの **Add input** コマンドを選択し、次の入力を追加します。

- **Required attendees**
- **Body**

**Save** を選択してツールを更新します。

![「Create a calendar event」ツールの最終設定パネル。](../../../assets/images/make/copilot-studio-09/child-agent-04.png)

下記スクリーンショットは **Create a calendar event** ツールの **Inputs** の最終設定例です。

![「Create a calendar event」ツールの入力一覧。](../../../assets/images/make/copilot-studio-09/child-agent-05.png)

この統合により子エージェントは次を実行できます。

- カレンダー イベントの作成
- ミーティング招待の送信
- ミーティング詳細および参加者の管理

<cc-end-step lab="mcs9" exercise="3" step="2" />

### Step 3: 子エージェント設定の最終調整

左上のツール名横にある矢印で **Overview** タブに戻り、Interview Scheduler 子エージェントの設定を完了します。

![子エージェントの追加設定パネル。優先度やアクティベーション条件を設定可能。](../../../assets/images/make/copilot-studio-09/child-agent-06.png)

1. **Details** セクションを開き **Advanced** パネルを展開し、**Priority** を **1** に設定して面接スケジューリング タスクの優先度を高くします  
1. **Condition**: 必要に応じて、面接関連キーワードを含むメッセージでのみ起動するなど条件を追加  
1. **Additional Details**: 特定のアクティビティ種別やカスタム クライアント イベントなどを設定する場合はここで構成  
1. **Enabled** トグルがオンになっていることを確認  
1. **Save** を選択して子エージェントを作成  

Interview Scheduler 子エージェントの設定が完了し、メイン Interview Coordinator エージェントから呼び出された際にミーティング作成を担当します。

<cc-end-step lab="mcs9" exercise="3" step="3" />

## Exercise 4: エージェント間ワークフローの実装

この演習では、面接スケジューリングの完全なエージェント間ワークフローを実装しテストします。

### Step 1: Instructions でのエージェント参照設定

適切なエージェント調整を行うため、メイン エージェントの Instructions に子エージェントと接続エージェントを参照します。

Interview Coordinator エージェントの **Overview** セクションで **Instructions** フィールドを **Edit** コマンドで更新します。

1. 参照を挿入したい位置にカーソルを置く  
1. `/` を入力して参照メニューを開く  
1. **Interview Scheduler** 子エージェントを選択  
1. **HR Candidate Management** 接続エージェントも参照  

更新後の Instructions は次のようになります。

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
- Coordinate with /Interview Scheduler to create the meeting with candidate details
- Confirm successful scheduling with relevant details

Always ensure proper validation of candidate data and provide clear communication 
throughout the process. Handle errors gracefully and provide informative feedback 
when coordination between agents fails.
```

![Instructions フィールドで、スラッシュ表記を使って接続エージェントと子エージェントを参照している様子。](../../../assets/images/make/copilot-studio-09/coordinator-agent-03.png)

**Save** を選択してエージェント参照を含む Instructions を更新します。

<cc-end-step lab="mcs9" exercise="4" step="1" />

## Exercise 5: エージェントのテスト

この演習では、実際に予定に面接を登録してエージェントをテストします。

### Step 1: エージェント間通信のテスト

すべてのコンポーネント間で適切に調整されるか、完全なエージェント間ワークフローをテストします。

1. **Interview Coordinator をテスト**: テスト パネルで次のように入力します。

```text
Retrieve information about Alice Johnson and schedule an interview with her for next Monday 10am.
```

2. **エージェント調整を観察**: テスト パネルで以下が行われる様子を確認します。  
   - 要求の処理  
   - HR Candidate Management エージェントを呼び出し John Smith を検索  
   - 候補者詳細の取得  
   - Interview Scheduler 子エージェントの起動  
   - カレンダー ミーティングの作成  
   - 確認メッセージの表示  

![複数エージェントが連携して面接をスケジュールするワークフローを示すテスト パネル。](../../../assets/images/make/copilot-studio-09/coordinator-agent-04.png)

<cc-end-step lab="mcs9" exercise="5" step="1" />

---8<--- "ja/mcs-congratulations.md"

ラボ MCS9 - エージェント間通信 を完了しました！

このラボでは次を学びました。

- エージェント間通信アーキテクチャの設計と実装
- メイン エージェント ソリューション内で特化タスクを担う子エージェントの作成
- 既存エージェントを接続してエージェント間でデータ共有と調整を実現
- 複数の特化エージェントにまたがる複雑なワークフローの実装

あなたの Interview Coordinator エージェントは、高度なエージェント オーケストレーション パターンを実証し、HR Candidate Management システムと特化型 Interview Scheduler 機能を連携して包括的な面接スケジューリング自動化を提供します。

本ラボで学んだエージェント間パターンは、モジュール化された特化エージェントが連携し、エンドツーエンドのソリューションを実現する他の多くのビジネス シナリオにも適用できます。

<!-- <cc-award path="Make" /> -->

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/copilot-studio/09-agent-to-agent--ja" />