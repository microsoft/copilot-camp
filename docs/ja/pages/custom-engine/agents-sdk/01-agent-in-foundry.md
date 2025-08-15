---
search:
  exclude: true
---
# ラボ BMA1 - Azure AI Foundry でエージェントを準備する

このラボでは、Azure AI Foundry を使ってカスタムエンジンエージェントの準備を開始します。Azure AI Foundry は、AI エージェントの作成、構成、スケーリングのための Microsoft のプラットフォームです。 **Agents Playground** を探索し、エージェントの役割を定義し、指示をパーソナライズし、Retrieval-Augmented Generation (RAG) をサポートするために関連する内部ドキュメントに接続します。

この演習は、 **Microsoft 365 Agents SDK** と **Semantic Kernel** を使用した Build Path の基盤を築きます。ここでは、Employee Handbook、Role Library、Benefit Plans などのアップロード済みドキュメントに基づいて質問に回答できる、Contoso Electronics の人事エージェントをシミュレートします。

???+ info "Azure AI Foundry とは?"
    Azure AI Foundry は、大規模言語モデルを活用したインテリジェントエージェントを構築、管理、テストできる開発プラットフォームです。エージェントの指示定義、ツール使用の構成、ナレッジソースのアップロード、エージェント動作の対話的テストを 1 つのワークスペースで行えます。Semantic Kernel などのカスタムオーケストレーターや、Teams、Copilot Chat などの下流エンドポイントとの統合もサポートします。

## Exercise 1: Azure AI Foundry でエージェントを準備する

この演習では、開発者が AI エージェントを簡単に構築、デプロイ、スケーリングできるプラットフォームである Azure AI Foundry を体験します。エージェントを構成し、Agents Playground を使ってその機能をテストする方法を学びます。このハンズオンを通じて、Azure AI Agent Service の機能と、さまざまな AI モデルやツールとの統合方法を理解できます。

### Step 1: Azure AI Foundry を開始する

Azure AI Foundry は AI エージェント構築の出発点です。このステップでは、Azure サブスクリプションが有効なアカウントで Azure AI Foundry にサインインします。

1. ブラウザーで [https://ai.azure.com](https://ai.azure.com) にアクセスし、Azure アカウントでサインインします。  
1. Azure AI Foundry のホームページで **+ Create new**、**Azure AI Foundry resource** の順に選択し、**Next** をクリックします。  
1. プロジェクト名は推奨値のままにして **Create** を選択します。  
1. Azure AI Foundry で新しいプロジェクトがスキャフォールドされます。通常 3～5 分かかります。  
1. プロジェクトが作成されると自動的に移動します。左サイドバーを展開し **Agents** を選択します。Agents Playground が開きます。  
1. Agents Playground に入ると最初に **Deploy a model** ウィンドウが表示されます。 **gpt-4o** を検索して **Confirm** を選択し、続くウィンドウで **Deploy** をクリックします。  
1. **Agents Playground** で、リストに事前作成済みのエージェントが表示されているのがわかります。そのエージェントを選択し **Try in playground** をクリックします。  
    ![The Azure AI Foundry list of Agents with the custom agent and the "Try in playground" command highlighted.](https://github.com/user-attachments/assets/dd481101-c15d-4aed-af62-aeb7d3c8e5ed){width="1029"}

> エージェントをクリックしても **Try in playground** オプション付きのサイドバーが表示されない場合、ブラウザーの表示サイズを広げて右側に表示されるまで調整してください。

<cc-end-step lab="bma1" exercise="1" step="1" />

### Step 2: Agent Playground でエージェントをカスタマイズする

Agents Playground に入ったので、エージェントのアイデンティティと動作を、Contoso 社内の HR エージェントという実際のシナリオに合わせてカスタマイズします。

1. エージェントの **Setup** パネルで、**Name** を 「Contoso HR Agent」にし、**Instructions** を次の内容に更新します。  

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

2. **Knowledge** セクションで **+ Add** をクリックし **Files** を選択、続いて **Select local files** を選択します。以下の **[リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agents-sdk/docs/)** から zip ファイルをダウンロードして解凍し、ファイルを選択して **Upload and save** をクリックしてアップロードします。これにより、エージェント用のベクトルストアが作成されます。

> ドキュメントをアップロードすると、Foundry は自動的にそれらをベクトル化し、エージェントが効率的に検索・取得できるようにします。

![The UI of Azure AI Foundry when adding files as knowledge base, with the "Select local files".](https://github.com/user-attachments/assets/64bb7392-15f6-458c-9e74-d8ab100ca8fd)

指示をカスタマイズし、関連ドキュメントをアップロードすることで、エージェントに行動指針と参照すべき知識を教えています。これは RAG (Retrieval-Augmented Generation) の簡易的な形態です。

<cc-end-step lab="bma1" exercise="1" step="2" />

### Step 3: Playground でエージェントをテストする

準備が整ったら、エージェントをテストしましょう。アップロードしたドキュメントに基づき、従業員からのリアルな質問にどれだけ適切に対応できるかを確認します。

Agents Playground でプロンプトを入力し、エージェントの応答を観察しながら、必要に応じて指示やツールを調整して性能を向上させます。以下の例を使ってエージェントの応答をテストできます。

- Northwind Standard と Health Plus の緊急医療およびメンタルヘルス補償の違いは何ですか？
- PerksPlus を使ってロッククライミング教室とオンラインフィットネスプログラムの両方を支払えますか？
- Northwind Standard で自己負担上限額に達した場合、処方薬の費用はどうなりますか？
- Contoso のパフォーマンスレビューでは具体的に何が行われ、どのように準備すればよいですか？
- ウェルネススパ週末は PerksPlus の払い戻し対象になりますか？
- Contoso における COO と CFO の主な違いは何ですか？
- Northwind Health Plus のオフィスビジットでスプリットコペイはどのように機能しますか？
- PerksPlus のヨガクラス払い戻しと健康保険でカバーされるサービスを併用できますか？
- Contoso Electronics の行動と意思決定を導く価値観は何ですか？
- 非参加プロバイダーを受診する場合、現在のプランではどのような費用が想定されますか？

!!! tip "次の演習に備えて Agents id を保存する"
    次の演習で必要となる **Agent id** を保存してください。Agent id はエージェントの詳細パネルで確認できます。  
    ![The Agents Playground of Azure AI Foundry with the Agent id field highlighted.](https://github.com/user-attachments/assets/13421287-d476-41c4-88df-bed1bff2f2f8)

<cc-end-step lab="bma1" exercise="1" step="3" />

---8<--- "ja/b-congratulations.md"

ラボ BMA1 - Azure AI Foundry でエージェントを準備する を完了しました。さらに探索したい場合はご自由にお試しください。

次は Lab BMA2 - M365 Agents SDK を使用して最初のエージェントを構築する に進む準備ができました。Next を選択してください。

<cc-next url="../02-agent-with-agents-sdk" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/01-agent-in-foundry--ja" />