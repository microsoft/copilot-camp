---
search:
  exclude: true
---
# Lab BMA1 - Azure AI Foundry でエージェントを準備する

このラボでは、Microsoft の AI エージェント作成・構成・スケール基盤である  Azure AI Foundry  を使ってカスタムエンジン エージェントの準備を開始します。  **Agents Playground**  を探索し、エージェントの役割を定義し、指示をパーソナライズし、Retrieval-Augmented Generation (RAG) をサポートするために関連する社内ドキュメントへ接続します。

この演習は  **Microsoft 365 Agents SDK**  と  **Semantic Kernel**  を使用する Build Path の基礎となります。Contoso Electronics の人事 (Human Resources) エージェントを想定し、Employee Handbook、Role Library、Benefit Plans などのアップロード済みドキュメントに基づいて質問に回答できるようにシミュレートします。

???+ info "Azure AI Foundry とは"
    Azure AI Foundry は、大規模言語モデルで駆動するインテリジェント エージェントを構築・管理・テストするための開発プラットフォームです。エージェントの指示を定義し、ツールの使用を構成し、ナレッジ ソースをアップロードし、対話形式でエージェントの挙動をテストできる集中型ワークスペースを提供します。また、Semantic Kernel のようなカスタムオーケストレーターや Teams、Copilot Chat などの下流エンドポイントとの統合をサポートします。

## Exercise 1: Azure AI Foundry でエージェントを準備する

この演習では、開発者が AI エージェントを簡単に構築、デプロイ、スケールできるプラットフォームである  Azure AI Foundry  を探索します。エージェントの構成方法と  Agents Playground  を使用した機能テスト方法を学びます。これにより、Azure AI Agent Service の機能と、さまざまな AI モデルやツールとの統合方法を体験できます。

### Step 1: Azure AI Foundry の開始

Azure AI Foundry は AI エージェント構築のための出発点です。このステップでは、Azure サブスクリプションが有効なアカウントで  Azure AI Foundry  にサインインします。

1. ブラウザーで [https://ai.azure.com](https://ai.azure.com) にアクセスし、Azure アカウントでサインインします。  
1. Azure AI Foundry のホームページで **+ Create new**, **Azure AI Foundry resource** を選択し、**Next** をクリックします。  
1. プロジェクト名は推奨値のままにして **Create** を選択します。  
1. 新しいプロジェクトのスキャフォールディングが開始され、通常 3–5 分ほどで完了します。  
1. プロジェクト作成後、自動的にプロジェクトページに遷移します。左サイドバーを展開し **Agents** を選択すると  Agents Playground  が開きます。  
1. Agents Playground  に初めて入ると **Deploy a model** ウィンドウが表示されます。**gpt-4o** を検索して **Confirm** を選択し、続くウィンドウで **Deploy** をクリックします。  
1. **Agents Playground** に入ると、リストにあらかじめ 1 つエージェントが用意されています。エージェントを選択し **Try in playground** をクリックします。  
    ![The Azure AI Foundry list of Agents with the custom agent and the "Try in playground" command highlighted.](https://github.com/user-attachments/assets/dd481101-c15d-4aed-af62-aeb7d3c8e5ed){width="1029"}

> エージェントをクリックしても右側に **Try in playground** オプションが表示されない場合は、ブラウザーウィンドウを拡大してください。

<cc-end-step lab="bma1" exercise="1" step="1" />

### Step 2: Agent Playground でエージェントをカスタマイズする

Agents Playground に入ったら、エージェントのアイデンティティと動作を実際のシナリオに合わせてカスタマイズします。ここでは Contoso 社内の HR エージェントを想定します。

1. エージェントの **Setup** パネルで、**Name** を 「Contoso HR Agent」 に変更し、**Instructions** を次の内容に更新します。  

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

2. **Knowledge** セクションで **+ Add** を選択し **Files** → **Select local files** をクリックします。以下の **[リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agents-sdk/docs/)** から ZIP ファイルをダウンロードして展開し、ファイルを選択して **Upload and save** を押します。これによりエージェント用のベクターストアが作成されます。

> ドキュメントをアップロードすると、Foundry は自動的にそれらをベクターへ変換します。これによりエージェントは効率的に検索と情報取得を行えます。

![The UI of Azure AI Foundry when adding files as knowledge base, with the "Select local files".](https://github.com/user-attachments/assets/64bb7392-15f6-458c-9e74-d8ab100ca8fd)

指示をカスタマイズし、関連ドキュメントをアップロードすることで、エージェントに「どう振る舞うか」「どの知識に依拠するか」を教えています。これは簡易的な RAG (Retrieval-Augmented Generation) の形態です。

<cc-end-step lab="bma1" exercise="1" step="2" />

### Step 3: プレイグラウンドでエージェントをテストする

いよいよエージェントをテストします。アップロードしたドキュメントを基に、従業員からの現実的な質問をシミュレートし、理解度と回答精度を確認します。

Agents Playground でプロンプトを入力し、応答を観察します。必要に応じて指示やツールを調整し、パフォーマンスを改善してください。以下の例を使って応答を試すこともできます。

- Northwind Standard と Health Plus の緊急時およびメンタルヘルス補償の違いは何ですか。  
- PerksPlus を使ってロッククライミング教室とオンラインフィットネスプログラムの両方を支払えますか。  
- Northwind Standard で自己負担上限に達した場合、処方箋薬の支払いは発生しますか。  
- Contoso のパフォーマンスレビューは具体的に何が行われ、どのように準備すべきですか。  
- ウェルネス スパ ウィークエンドは PerksPlus の払い戻し対象になりますか。  
- Contoso における COO と CFO の主な役割の違いは何ですか。  
- Northwind Health Plus の診療所受診時におけるスプリットコペイの仕組みはどうなっていますか。  
- PerksPlus のヨガクラス払い戻しと健康保険でカバーされるサービスを組み合わせられますか。  
- Contoso Electronics の意思決定と行動を導く価値観は何ですか。  
- 非参加医療機関を受診する場合、現在のプランでどの程度の費用負担が発生しますか。  

!!! tip "次の演習用に Agents id を保存してください"
    次の演習で必要になるため、**Agent id** を控えておいてください。Agent id はエージェント詳細パネルに表示されています。  
    ![The Agents Playground of Azure AI Foundry with the Agent id field highlighted.](https://github.com/user-attachments/assets/13421287-d476-41c4-88df-bed1bff2f2f8)

<cc-end-step lab="bma1" exercise="1" step="3" />

---8<--- "ja/b-congratulations.md"

これで Lab BMA1 - Azure AI Foundry でエージェントを準備する が完了しました。さらに探求したい場合は、ぜひお試しください。

続いて  Lab BMA2 - M365 Agents SDK を使用して最初のエージェントを構築する へ進む準備が整いました。Next を選択してください。

<cc-next url="../02-agent-with-agents-sdk" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/01-agent-in-foundry" />