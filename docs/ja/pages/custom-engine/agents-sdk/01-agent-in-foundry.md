---
search:
  exclude: true
---
# ラボ BMA1 - Azure AI Foundry でエージェントを準備する

このラボでは、Azure AI Foundry を使用してカスタム エンジン エージェントを準備するところから旅を始めます。Azure AI Foundry は AI エージェントを作成、構成、スケールするための Microsoft のプラットフォームです。**Agents Playground** を探索し、エージェントの役割を定義し、指示をパーソナライズし、関連する社内ドキュメントに接続して Retrieval-Augmented Generation (RAG) をサポートします。

この演習は、 **Microsoft 365 Agents SDK** と **Semantic Kernel** を使用する Build Path の基礎を築きます。アップロードした Employee Handbook、Role Library、Benefit Plans などのドキュメントに基づいて質問に答えられる Contoso Electronics の Human Resources エージェントをシミュレートします。

???+ info "Azure AI Foundry とは?"
    Azure AI Foundry は、大規模言語モデルを活用したインテリジェント エージェントを構築、管理、テストできる開発プラットフォームです。集中化されたワークスペースで、エージェントの指示を定義し、ツール使用を構成し、ナレッジ ソースをアップロードし、対話形式でエージェントの動作をテストできます。Semantic Kernel などのカスタム オーケストレーターや、Teams や Copilot Chat といった下流エンドポイントとの統合をサポートしています。

## 演習 1: Azure AI Foundry でエージェントを準備する

この演習では、開発者が AI エージェントを簡単に構築、デプロイ、スケールできるプラットフォームである Azure AI Foundry を体験します。エージェントを構成し、Agents Playground を使用してその機能をテストする方法を学びます。このハンズオンを通じて、Azure AI Agent Service の機能と、さまざまな AI モデルやツールとの統合方法を理解できます。

### 手順 1: Azure AI Foundry の開始

Azure AI Foundry は AI エージェントを構築するための発射台です。この手順では、Azure サブスクリプションが有効になっているアカウントで Azure AI Foundry にサインインします。

1. ブラウザーで [https://ai.azure.com](https://ai.azure.com) にアクセスし、Azure アカウントにサインインします。  
1. Azure AI Foundry のホームページで **+ Create new**、**Azure AI Foundry resource**、続けて **Next** を選択します。  
1. プロジェクト名は推奨値のままにして **Create** を選択します。  
1. これにより Azure AI Foundry に新しいプロジェクトが作成されます。通常 3～5 分かかります。  
1. プロジェクトが作成されたら自動的にプロジェクト画面にリダイレクトされます。左サイドバーを展開して **Agents** を選択すると Agents Playground が開きます。  
1. Agents Playground に入ると最初に **Deploy a model** ウィンドウが表示されます。**gpt-4o** を検索して選択し、**Confirm** を選択してから次のウィンドウで **Deploy** をクリックします。  
1. **Agents Playground** では、リストに既に作成済みのエージェントが 1 つ表示されていることに気づくでしょう。そのエージェントを選択して **Try in playground** をクリックします。  
    ![The Azure AI Foundry list of Agents with the custom agent and the "Try in playground" command highlighted.](https://github.com/user-attachments/assets/dd481101-c15d-4aed-af62-aeb7d3c8e5ed){width="1029"}

> エージェントをクリックしても **Try in playground** オプションを含むサイドバーが表示されない場合は、ブラウザーのウィンドウ サイズを広げて右側に表示されるまで調整してください。

<cc-end-step lab="bma1" exercise="1" step="1" />

### 手順 2: Agent Playground でエージェントをカスタマイズする

Agents Playground 内に入ったので、エージェントのアイデンティティと動作をカスタマイズし、Contoso 社内の HR エージェントという実際のシナリオに合わせます。

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

2. 続いて **Knowledge** セクションで **+ Add** を選択し **Files** を選択、その後 **Select local files** をクリックします。次の **[リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agents-sdk/docs/)** から ZIP ファイルをダウンロードし、展開したファイルを選択して **Upload and save** を押すとアップロードされます。これによりエージェント用のベクター ストアが作成されます。

> ドキュメントをアップロードすると、Foundry は自動的にそれらをベクターに変換し、エージェントが効率的に検索・取得できるようにします。

![The UI of Azure AI Foundry when adding files as knowledge base, with the "Select local files".](https://github.com/user-attachments/assets/64bb7392-15f6-458c-9e74-d8ab100ca8fd)

指示をカスタマイズし、関連ドキュメントをアップロードすることで、エージェントにどのように行動し、どの知識に依拠するかを教えています。これは Retrieval-Augmented Generation (RAG) の簡易的な形態です。

<cc-end-step lab="bma1" exercise="1" step="2" />

### 手順 3: Playground でエージェントをテストする

エージェントをテストする時が来ました。アップロードしたドキュメントに基づいてエージェントがどれだけ理解し回答できるか、現実的な従業員からの質問をシミュレートします。

Agent Playground でプロンプトを入力してエージェントと対話し、その応答を観察します。必要に応じて指示やツールを調整してパフォーマンスを改善してください。以下の例を使用してエージェントの応答をテストできます。

- Northwind Standard と Health Plus の緊急治療およびメンタルヘルスの補償範囲の違いは何ですか?  
- PerksPlus を利用してロック クライミング教室とバーチャル フィットネス プログラムの両方を支払えますか?  
- Northwind Standard で自己負担上限額に達した場合、処方薬の支払いはどうなりますか?  
- Contoso のパフォーマンス レビューでは具体的に何が行われ、どのように準備すればよいですか?  
- ウェルネス スパ ウィークエンドは PerksPlus の払い戻しプログラムの対象になりますか?  
- Contoso の COO と CFO の役割の主な違いは何ですか?  
- Northwind Health Plus の診療所受診時には分割コペイがどのように適用されますか?  
- PerksPlus のヨガ クラス払い戻しと健康保険でカバーされるサービスを組み合わせられますか?  
- Contoso Electronics で行動と意思決定を導く価値観は何ですか?  
- 非参加プロバイダーを受診する場合、現在のプランではどの費用が発生しますか?  

!!! tip "次の演習に備えて Agent id を保存する"
    次の演習で必要になる **Agent id** を保存してください。Agent id はエージェントの詳細パネルで確認できます。  
    ![The Agents Playground of Azure AI Foundry with the Agent id field highlighted.](https://github.com/user-attachments/assets/13421287-d476-41c4-88df-bed1bff2f2f8)

<cc-end-step lab="bma1" exercise="1" step="3" />

---8<--- "ja/b-congratulations.md"

Azure AI Foundry でエージェントを準備するラボ BMA1 を完了しました! さらに探求したい場合はどうぞ。

次は Lab BMA2 - M365 Agents SDK を使用して最初のエージェントを構築する準備ができました。Next を選択してください。

<cc-next url="../02-agent-with-agents-sdk" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/01-agent-in-foundry--ja" />