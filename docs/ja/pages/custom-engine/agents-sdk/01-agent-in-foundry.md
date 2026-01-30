---
search:
  exclude: true
---
# ラボ BMA1 - Microsoft Foundry でエージェントを準備する

このラボでは、Microsoft の AI エージェント作成・設定・スケーリング プラットフォームである Microsoft Foundry を使って、カスタム エンジン エージェントの準備を開始します。 **Agents Playground** を探索し、エージェントの役割を定義し、その指示をパーソナライズし、関連する社内ドキュメントに接続して Retrieval-Augmented Generation (RAG) をサポートします。

この演習は、 **Microsoft 365 Agents SDK** と **Semantic Kernel** を使用する Build Path の基盤となります。ここでは、Employee Handbook、Role Library、Benefit Plans などのアップロード済みドキュメントに基づいて質問に回答できる、Contoso Electronics の実際の Human Resources エージェントをシミュレートします。

???+ info "What is Microsoft Foundry?"
    Microsoft Foundry は、大規模言語モデルを活用したインテリジェント エージェントの構築、管理、テストを支援する開発プラットフォームです。エージェントの指示を定義し、ツールの使用を構成し、ナレッジ ソースをアップロードし、エージェントの動作を対話形式でテストできる集中型ワークスペースを提供します。Semantic Kernel のようなカスタム オーケストレーターや、Teams、Copilot Chat などの下流エンドポイントとの統合をサポートします。

## Exercise 1: Microsoft Foundry でエージェントを準備する

この演習では、開発者が AI エージェントを簡単に構築、展開、スケールできるプラットフォームである Microsoft Foundry を探索します。エージェントの構成方法と、Agents Playground を使用した機能テストを学びます。このハンズオン体験により、Azure AI Agent Service の機能と、さまざまな AI モデルやツールとの統合方法について理解が深まります。

### Step 1: Microsoft Foundry を始める

Microsoft Foundry は AI エージェントを構築するための発射台です。このステップでは、Azure サブスクリプションが有効になっているアカウントで Microsoft Foundry にサインインします。

1. ブラウザーで [https://ai.azure.com](https://ai.azure.com) にアクセスし、Azure アカウントでサインインします。  
1. Microsoft Foundry のホームページで **+ Create new**、**Microsoft Foundry resource** の順に選択し、**Next** を選択します。  
1. プロジェクト名は推奨値のままにして **Create** を選択します。  
1. 新しいプロジェクトのスキャフォールディングが開始され、通常 3～5 分で完了します。  
1. プロジェクトが作成されたら、自動的にそのプロジェクトにリダイレクトされます。左側のサイドバーを展開して **Agents** を選択し、Agents Playground を開きます。  
1. Agents Playground では最初に **Deploy a model** ウィンドウが表示されます。**gpt-4o** を検索して **Confirm** を選択し、次のウィンドウで **Deploy** を選択します。  
1. **Agents Playground** に入ると、一覧にあらかじめ作成されたエージェントが表示されているのが分かります。そのエージェントを選択し、**Try in playground** を選択します。  
    ![The Microsoft Foundry list of Agents with the custom agent and the "Try in playground" command highlighted.](https://github.com/user-attachments/assets/dd481101-c15d-4aed-af62-aeb7d3c8e5ed){width="1029"}

> エージェントをクリックしても **Try in playground** オプションを含むサイドバーが表示されない場合は、ブラウザーのウィンドウ サイズを広げ、右側に表示されるまで調整してください。

<cc-end-step lab="bma1" exercise="1" step="1" />

### Step 2: Agent Playground でエージェントをカスタマイズする

Agents Playground に入ったら、エージェントのアイデンティティと動作を実際のシナリオに合わせてカスタマイズします。今回は Contoso 社内の HR エージェントを想定します。

1. エージェントの **Setup** パネルで、**Name** を「Contoso HR Agent」に設定し、**Instructions** を次の内容に更新します。  

```
You are Contoso HR Agent, an internal assistant for Contoso Electronics. Your role is to help employees find accurate, policy-aligned answers to questions related to:
- Job role descriptions and responsibilities
- Performance review process
- Health and wellness benefits (PerksPlus, Northwind Standard, Northwind Plus)
- Employee rights and workplace safety
- Company values and conduct

Always base your responses on the content provided in the official documents such as the Employee Handbook, Role Library, and Benefit Plans. If you are unsure or the information is not covered, suggest the employee contact HR.

Respond in a professional but approachable tone. Keep answers factual and to the point.

Example scenarios you should support:
- What is the deductible for Northwind Standard?
- Can I use PerksPlus for spa treatments?
- What does the CTO at Contoso do?
- What happens during a performance review?
```

2. **Knowledge** セクションで **+ Add** を選択し、**Files** から **Select local files** を選択します。次の **[リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agents-sdk/docs/)** から ZIP ファイルをダウンロードして展開し、該当ファイルを選択して **Upload and save** をクリックします。これによりエージェント用のベクター ストアが作成されます。  

> ドキュメントをアップロードすると、Foundry が自動的にそれらをベクターに変換します。これにより、エージェントは関連情報を効率的に検索・取得できるようになります。

![The UI of Microsoft Foundry when adding files as knowledge base, with the "Select local files".](https://github.com/user-attachments/assets/64bb7392-15f6-458c-9e74-d8ab100ca8fd)

指示をカスタマイズし、関連ドキュメントをアップロードすることで、エージェントに行動指針と参照すべき知識を教えています。これは RAG の簡易的な形態です。

<cc-end-step lab="bma1" exercise="1" step="2" />

### Step 3: Playground でエージェントをテストする

エージェントをテストしましょう。アップロードしたドキュメントを基にエージェントがどれだけ理解し、回答できるかを確認するため、実際の従業員からの質問をシミュレートします。

Agents Playground でエージェントにプロンプトを入力し、レスポンスを観察しながら必要に応じて指示やツールを調整して性能を改善します。以下の例を使用してエージェントの応答をテストしてみてください。

- What’s the difference between Northwind Standard and Health Plus when it comes to emergency and mental health coverage?
- Can I use PerksPlus to pay for both a rock climbing class and a virtual fitness program?
- If I hit my out-of-pocket max on Northwind Standard, do I still pay for prescriptions?
- What exactly happens during a Contoso performance review, and how should I prepare?
- Is a wellness spa weekend eligible under the PerksPlus reimbursement program?
- What are the key differences between the roles of COO and CFO at Contoso?
- How does the split copay work under Northwind Health Plus for office visits?
- Can I combine yoga class reimbursements from PerksPlus with services covered under my health plan?
- What values guide behavior and decision-making at Contoso Electronics?
- I’m seeing a non-participating provider — what costs should I expect under my current plan?

!!! tip "次の演習用に Agent id を保存"
    次の演習で必要となる **Agent id** を保存しておきましょう。Agent id はエージェントの詳細パネルで確認できます。  
    ![The Agents Playground of Microsoft Foundry with the Agent id field highlighted.](https://github.com/user-attachments/assets/13421287-d476-41c4-88df-bed1bff2f2f8)

<cc-end-step lab="bma1" exercise="1" step="3" />

---8<--- "ja/b-congratulations.md"

Lab BMA1 - Microsoft Foundry でエージェントを準備する を完了しました。さらに探索したい場合は続けてください。

次は Lab BMA2 - M365 Agents SDK を使って最初のエージェントを構築する に進む準備ができました。Next を選択してください。

<cc-next url="../02-agent-with-agents-sdk" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/01-agent-in-foundry--ja" />