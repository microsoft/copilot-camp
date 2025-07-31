---
search:
  exclude: true
---
# ラボ BMA1 - Azure AI Foundry でエージェントを準備する

このラボでは、カスタム エンジン エージェントの準備から旅を始めます。Azure AI Foundry は、エージェントの作成、設定、スケーリングを行うための Microsoft のプラットフォームです。 **Agents Playground** を探索し、エージェントの役割を定義し、指示をパーソナライズし、Retrieval-Augmented Generation (RAG) をサポートするために関連する社内ドキュメントへ接続します。

この演習は **Microsoft 365 Agents SDK** と **Semantic Kernel** を使用する Build Path の基盤を築きます。Employee Handbook、Role Library、Benefit Plans などのアップロードされたドキュメントに基づいて質問に回答できる、Contoso Electronics の人事 (Human Resources) エージェントを実際にシミュレートします。

???+ info "What is Azure AI Foundry?"
    Azure AI Foundry は、大規模言語モデルを活用したインテリジェント エージェントの構築、管理、テストを支援する開発プラットフォームです。エージェントの指示定義、ツール使用設定、知識ソースのアップロード、対話形式でのエージェント動作テストを行うための集中ワークスペースを提供します。Semantic Kernel などのカスタム オーケストレーターや、Teams や Copilot Chat などの下流エンドポイントとの統合をサポートします。

## Exercise 1: Azure AI Foundry でエージェントを準備する

この演習では、開発者がエージェントを簡単に構築、デプロイ、スケールできるプラットフォーム Azure AI Foundry を探索します。エージェントを設定し、Agents Playground で機能をテストする方法を学びます。このハンズオンを通じて、Azure AI Agent Service の機能と、さまざまな AI モデルやツールとの統合方法を理解します。

### Step 1: Azure AI Foundry を始める

Azure AI Foundry はエージェント構築の出発点です。このステップでは、Azure サブスクリプションが有効なアカウントで Azure AI Foundry にサインインします。

1. ブラウザーで [https://ai.azure.com](https://ai.azure.com) にアクセスし、Azure アカウントでサインインします。  
1. Azure AI Foundry ホームページで **+ Create new**、**Azure AI Foundry resource** の順に選択し、**Next** を選択します。  
1. プロジェクト名は推奨値のままにし、**Create** を選択します。  
1. 新しいプロジェクトが Azure AI Foundry にスキャフォールディングされます (通常 3〜5 分)。  
1. プロジェクト作成後、自動的にプロジェクト ページへリダイレクトされます。左サイドバーを展開し **Agents** を選択して Agents Playground を開きます。  
1. Agents Playground に入ると最初に **Deploy a model** ウィンドウが表示されます。 **gpt-4o** を検索して **Confirm**、続いて **Deploy** を選択します。  
1. **Agents Playground** で、リストに事前作成済みのエージェントが表示されます。エージェントを選択し、**Try in playground** を選択します。  
    ![The Azure AI Foundry list of Agents with the custom agent and the "Try in playground" command highlighted.](https://github.com/user-attachments/assets/dd481101-c15d-4aed-af62-aeb7d3c8e5ed){width="1029"}

> エージェントをクリックしても **Try in playground** オプションを含むサイドバーが表示されない場合、ブラウザーのウィンドウサイズを拡大すると右側に表示されます。

<cc-end-step lab="bma1" exercise="1" step="1" />

### Step 2: Agent Playground でエージェントをカスタマイズする

Agents Playground に入ったら、実際のシナリオ (Contoso の社内 HR エージェント) に合わせてエージェントのアイデンティティと動作をカスタマイズします。

1. エージェントの **Setup** パネルで、**Name** を「Contoso HR Agent」にし、**Instructions** を次の内容に更新します。  

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

2. 次に **Knowledge** セクションで **+ Add** を選択し **Files** → **Select local files** の順にクリックします。以下の **[リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agents-sdk/docs/)** から zip ファイルをダウンロードし、解凍後ファイルを選択して **Upload and save** をクリックします。これにより、エージェント用のベクトル ストアが作成されます。  

> ドキュメントをアップロードすると、Foundry が自動的にベクトルへ変換し、エージェントが効率的に検索・取得できるようにします。

![The UI of Azure AI Foundry when adding files as knowledge base, with the "Select local files".](https://github.com/user-attachments/assets/64bb7392-15f6-458c-9e74-d8ab100ca8fd)

指示をカスタマイズし、関連ドキュメントをアップロードすることで、エージェントにどのように振る舞い、どの知識に依存すべきかを教えています。これは簡易的な Retrieval-Augmented Generation (RAG) の形態です。

<cc-end-step lab="bma1" exercise="1" step="2" />

### Step 3: Playground でエージェントをテストする

エージェントのテストを行います。アップロードしたドキュメントに基づいてエージェントがどの程度理解し、回答できるかを確認するため、従業員からの現実的な質問をシミュレーションします。

Agents Playground でプロンプトを入力し、エージェントの応答を観察しながら、必要に応じて指示やツールを調整して性能を改善します。以下の例を使用してエージェントの応答をテストできます。

- Northwind Standard と Health Plus の緊急およびメンタル ヘルス カバレッジの違いは何ですか？
- PerksPlus を使ってロッククライミング クラスとバーチャル フィットネス プログラムの両方を支払えますか？
- Northwind Standard で自己負担上限額に達した場合、処方薬費用はまだ支払いますか？
- Contoso のパフォーマンス レビューでは具体的に何が行われ、どのように準備すればよいですか？
- PerksPlus の払い戻しプログラムでウェルネス スパ ウィークエンドは対象になりますか？
- Contoso における COO と CFO の役割の主な違いは何ですか？
- Northwind Health Plus のオフィス ビジットでの split copay はどのように機能しますか？
- PerksPlus のヨガ クラス払い戻しと健康保険でカバーされるサービスを組み合わせられますか？
- Contoso Electronics ではどの価値観が行動と意思決定を導きますか？
- 非参加プロバイダーを受診しています。現在の保険プランでどの程度の費用が発生しますか？

!!! tip "次の演習のためにエージェント ID を保存"
    次の演習で必要となる **Agent id** を保存してください。エージェントの詳細パネルで確認できます。  
    ![The Agents Playground of Azure AI Foundry with the Agent id field highlighted.](https://github.com/user-attachments/assets/13421287-d476-41c4-88df-bed1bff2f2f8)

<cc-end-step lab="bma1" exercise="1" step="3" />

---8<--- "ja/b-congratulations.md"

ラボ BMA1 - Azure AI Foundry でエージェントを準備する を完了しました！さらに探索したい場合は、次のラボへ進んでください。

次は Lab BMA2 - Build your first agent using M365 Agents SDK へ進む準備ができました。Next を選択してください。

<cc-next url="../02-agent-with-agents-sdk" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/01-agent-in-foundry--ja" />