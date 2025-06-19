---
search:
  exclude: true
---
# ラボ BMA1 - Azure AI Foundry でエージェントを準備する

このラボでは、Azure AI Foundry を使ってカスタム エンジン エージェントの準備を開始します。Azure AI Foundry は、AI エージェントの作成、構成、スケーリングを行うための Microsoft のプラットフォームです。**Agents Playground** を探索し、エージェントの役割を定義し、指示をパーソナライズし、関連する内部ドキュメントに接続して Retrieval-Augmented Generation (RAG) をサポートします。

この演習は、**Microsoft 365 Agents SDK** と **Semantic Kernel** を使用する Build Path の基盤となります。Contoso Electronics の人事エージェントをシミュレートし、従業員ハンドブック、職務ライブラリ、福利厚生プランなどのアップロード済みドキュメントに基づいて質問に回答できるようにします。

???+ info "Azure AI Foundry とは?"
    Azure AI Foundry は、大規模言語モデルを活用したインテリジェント エージェントを構築、管理、テストできる開発プラットフォームです。エージェントの指示を定義し、ツールの使用を構成し、ナレッジ ソースをアップロードし、インタラクティブにエージェントの動作をテストできる集中型ワークスペースを提供します。Semantic Kernel のようなカスタム オーケストレーターや、Teams や Copilot Chat などの下流エンドポイントとの統合をサポートします。

## 演習 1: Azure AI Foundry でエージェントを準備する

この演習では、開発者が AI エージェントを簡単に構築、デプロイ、スケールできるプラットフォームである Azure AI Foundry を探索します。エージェントの構成方法を学び、Agents Playground で機能をテストします。このハンズオンで、Azure AI Agent Service の機能と、さまざまな AI モデルやツールとの統合方法を理解できます。

### 手順 1: Azure AI Foundry を開始する

Azure AI Foundry は、AI エージェントを構築するための出発点です。この手順では、Azure サブスクリプションが有効なアカウントで Azure AI Foundry にサインインします。

1. ブラウザーで [https://ai.azure.com](https://ai.azure.com) にアクセスし、Azure アカウントでサインインします。  
1. Azure AI Foundry のホームページで **+ Create new**、**Azure AI Foundry resource** の順に選択し、**Next** を選択します。  
1. プロジェクト名は既定のままにして **Create** を選択します。  
1. 数分 (通常 3 ～ 5 分) で新しいプロジェクトが作成されます。  
1. プロジェクトが作成されたら自動的にプロジェクト ページに移動します。左側のサイドバーを展開し **Agents** を選択して Agents Playground を開きます。  
1. Agents Playground では初回に **Deploy a model** ウィンドウが表示されます。**gpt-4o** を検索して **Confirm** を選択し、続いて **Deploy** を選択します。  
1. **Agents Playground** に入ると、リストにあらかじめ作成されたエージェントが表示されます。そのエージェントを選択し **Try in playground** をクリックします。  
    ![Azure AI Foundry の Agents 一覧にカスタム エージェントが表示され、"Try in playground" コマンドがハイライトされている。](https://github.com/user-attachments/assets/dd481101-c15d-4aed-af62-aeb7d3c8e5ed){width="1029"}

> エージェントをクリックしても **Try in playground** オプション付きのサイドバーが表示されない場合は、ブラウザーのウィンドウ サイズを広げて右側に表示されるまで調整してください。

<cc-end-step lab="bma1" exercise="1" step="1" />

### 手順 2: Agent Playground でエージェントをカスタマイズする

Agents Playground に入ったので、エージェントのアイデンティティと動作を実際のシナリオに合わせてカスタマイズします。ここでは Contoso 社の社内 HR エージェントを作成します。

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

2. **Knowledge** セクションで **+ Add** を選択し、**Files** を選択して **Select local files** をクリックします。次の **[リンク](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agents-sdk/docs/)** から zip ファイルをダウンロードして解凍し、ファイルを選択して **Upload and save** をクリックします。これにより、エージェント用のベクターストアが作成されます。

> ドキュメントをアップロードすると、Foundry は自動的にドキュメントをベクターに変換します。これにより、エージェントが関連情報を効率的に検索・取得できるようになります。

![Knowledge ベースにファイルを追加する Azure AI Foundry の UI。"Select local files" ボタンが表示されている。](https://github.com/user-attachments/assets/64bb7392-15f6-458c-9e74-d8ab100ca8fd)

指示をカスタマイズし、関連ドキュメントをアップロードすることで、エージェントに動作方法と依拠すべき知識を教えています。これは Retrieval-Augmented Generation (RAG) の簡易的な形態です。

<cc-end-step lab="bma1" exercise="1" step="2" />

### 手順 3: Playground でエージェントをテストする

エージェントをテストしてみましょう。アップロードしたドキュメントを基に、従業員からの現実的な質問をシミュレートし、エージェントの理解度と回答を確認します。

Agents Playground でプロンプトを入力してエージェントと対話し、回答を観察します。必要に応じて指示やツールを調整し、パフォーマンスを改善します。以下の例を使ってエージェントの応答をテストできます。

- Northwind Standard と Health Plus の緊急医療およびメンタルヘルス補償の違いは何ですか?
- PerksPlus を使ってロッククライミング教室とオンライン フィットネス プログラムの両方を支払えますか?
- Northwind Standard で自己負担上限に達した場合、処方薬の支払いはどうなりますか?
- Contoso のパフォーマンス レビューでは具体的に何が行われ、どのように準備すればよいですか?
- ウェルネス スパ ウィークエンドは PerksPlus の払い戻し対象になりますか?
- Contoso における COO と CFO の主な違いは何ですか?
- Northwind Health Plus の split copay は診療所受診時にどのように機能しますか?
- PerksPlus のヨガ教室の払い戻しと健康保険プランでカバーされるサービスを組み合わせられますか?
- Contoso Electronics ではどのような価値観が行動と意思決定を導いていますか?
- 非参加プロバイダーを受診する場合、現在のプランではどのような費用が発生しますか?

!!! tip "次の演習のために Agents id を保存してください"
    次の演習で必要となる **Agent id** を保存しておいてください。Agent id はエージェントの詳細パネルで確認できます。  
    ![Azure AI Foundry Agents Playground で Agent id フィールドがハイライトされている。](https://github.com/user-attachments/assets/13421287-d476-41c4-88df-bed1bff2f2f8)

<cc-end-step lab="bma1" exercise="1" step="3" />

---8<--- "ja/b-congratulations.md"

Lab BMA1 - Azure AI Foundry でエージェントを準備する を完了しました! さらに探索したい場合はどうぞ。

これで Lab BMA2 - M365 Agents SDK を使用して最初のエージェントを構築する準備ができました。[Next] を選択してください。

<cc-next url="../02-agent-with-agents-sdk" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/01-agent-in-foundry" />