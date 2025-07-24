---
search:
  exclude: true
---
# ラボ BMA1 - Azure AI Foundry でエージェントの準備

本ラボでは、まず Azure AI Foundry を使用してカスタムエンジン エージェントの準備を行います。Azure AI Foundry は、AI エージェントの作成、設定、スケールを可能にする Microsoft のプラットフォームです。**Agents Playground** を探索し、エージェントの役割を定義し、その instructions をパーソナライズし、RAG（ Retrieval-Augmented Generation ）をサポートするために関連する内部ドキュメントに接続します。

この演習は、**Microsoft 365 Agents SDK** および **Semantic Kernel** を使用する Build Path の基礎を築くものです。Contoso Electronics の実際の人事エージェントをシミュレートし、Employee Handbook、Role Library、Benefit Plans といったアップロードされたドキュメントに基づいて質問に回答できるようにします。

???+ info "Azure AI Foundry とは？"
    Azure AI Foundry は、大規模言語モデルを活用したインテリジェントなエージェントの構築、管理、およびテストを支援する開発プラットフォームです。エージェントの instructions の定義、ツールの使用設定、ナレッジソースのアップロード、エージェントの動作テストを対話的に行うための集中管理型ワークスペースを提供します。Semantic Kernel や Teams、Copilot Chat などの下流エンドポイントとの統合もサポートしています。

## 演習 1: Azure AI Foundry でエージェントの準備

本演習では、開発者が AI エージェントを簡単にビルド、展開、スケールできるプラットフォーム Azure AI Foundry を探索します。エージェントの設定方法や、Agents Playground を使用した機能のテスト方法を学びます。この実践的な体験を通して、Azure AI Agent Service の機能や、各種 AI モデルおよびツールとの統合方法について理解を深めていただきます。

### ステップ 1: Azure AI Foundry の開始

Azure AI Foundry は AI エージェント構築の出発点です。このステップでは、Azure サブスクリプションが有効なアカウントで Azure AI Foundry にログインします。

1. ブラウザーを開き、[ https://ai.azure.com](https://ai.azure.com) にアクセスして、Azure アカウントにサインインしてください。
1. Azure AI Foundry のホームページから、**+ Create new**、**Azure AI Foundry resource** を選択し、次に **Next** をクリックします。
1. プロジェクト名は推奨のままで、**Create** を選択してください。
1. これにより、Azure AI Foundry 上に新しいプロジェクトがスキャフォールドされます。通常、3 ～ 5 分かかります。
1. プロジェクトが作成されると、プロジェクトにリダイレクトされ、左側のサイドバーを拡張して **Agents** を選択します。すると、Agents Playground が開きます。
1. Agents Playground 内では、初回に **Deploy a model** ウィンドウが表示されます。**gpt-4o** を検索して **Confirm** を選択し、次のウィンドウで **Deploy** をクリックします。
1. **Agents Playground** に入ると、リスト内にあらかじめ登録されたエージェントが表示されます。エージェントを選択し、**Try in playground** をクリックしてください。
    ![Azure AI Foundry のエージェント一覧。カスタムエージェントと **Try in playground** コマンドがハイライトされています。](https://github.com/user-attachments/assets/dd481101-c15d-4aed-af62-aeb7d3c8e5ed){width="1029"}

> エージェントをクリックした際に **Try in playground** オプションが表示されない場合は、画面のブラウザーサイズを拡大して右側に表示されるまで調整してください。

<cc-end-step lab="bma1" exercise="1" step="1" />

### ステップ 2: Agents Playground でエージェントのカスタマイズ

Agents Playground 内に入ったら、Contoso の内部 HR エージェントという実シナリオに合わせてエージェントのアイデンティティおよび動作をカスタマイズします。

1. エージェントの **Setup** パネル内で、エージェント名を Contoso HR Agent に設定し、**Instructions** を以下の内容に更新してください:

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

2. 最後に、**Knowledge** セクションで **+ Add** を選択し、**Files** をクリック後、**Select local files** を選択してください。次の **[link](https://download-directory.github.io/?url=https://github.com/microsoft/copilot-camp/tree/main/src/agents-sdk/docs/)** からいくつかのファイルを含む zip ファイルをダウンロードし、ファイルを抽出、選択して **Upload and save** をクリックしてアップロードします。これにより、エージェント用のベクトルストアが作成されます。

> ドキュメントをアップロードすると、Foundry は自動的にそれらをエージェントが効率的に関連情報を検索・取得できるフォーマットである ベクトル に変換します。

![ナレッジベースとしてファイルを追加する際の Azure AI Foundry の UI。**Select local files** が表示されています。](https://github.com/user-attachments/assets/64bb7392-15f6-458c-9e74-d8ab100ca8fd)

instructions のカスタマイズと関連ドキュメントのアップロードにより、エージェントにどのように動作すべきか、どの知識に依拠するべきかを教え込むことになります。これは Retrieval-Augmented Generation (RAG) の簡略化した実装です。

<cc-end-step lab="bma1" exercise="1" step="2" />

### ステップ 3: Playground でエージェントのテスト

エージェントのテストの時間です。アップロードしたドキュメントに基づいて、エージェントがどれだけ理解し、適切に回答できるかリアルな従業員からの質問をシミュレートして確認します。

Agents Playground 内で、プロンプトを入力してエージェントと対話し、エージェントの回答を確認します。必要に応じて instructions やツールを調整してパフォーマンスを向上させてください。以下に例示する質問を使用してエージェントの回答をテストできます:

- Northwind Standard と Health Plus の、緊急時およびメンタルヘルスの補償に関する違いは何ですか？
- PerksPlus を使って、ロッククライミングのクラスとバーチャルフィットネスプログラムの両方の支払いは可能でしょうか？
- Northwind Standard で自己負担上限に達した場合でも、処方箋代は支払いが生じますか？
- Contoso のパフォーマンスレビューでは具体的に何が行われ、どのように準備すべきでしょうか？
- PerksPlus の払い戻しプログラムでは、ウェルネス スパの週末利用は対象となりますか？
- Contoso における COO と CFO の役割の主な違いは何ですか？
- Northwind Health Plus でのオフィス訪問時の分割コペイはどのように機能しますか？
- PerksPlus のヨガクラスの払い戻しと、健康プランでカバーされるサービスを併用できますか？
- Contoso Electronics の行動や意思決定を導く基本的な価値観は何ですか？
- 非参加のプロバイダーに遭遇した場合、現在のプラン下でどのような費用が発生するでしょうか？

!!! tip "次の演習のためにエージェント ID を保存してください"
    次の演習で必要となる **Agent id** を保存してください。Agent id はエージェントの詳細パネルで確認できます。
    ![エージェント ID フィールドがハイライトされた Azure AI Foundry の Agents Playground。](https://github.com/user-attachments/assets/13421287-d476-41c4-88df-bed1bff2f2f8)

<cc-end-step lab="bma1" exercise="1" step="3" />

---8<--- "ja/b-congratulations.md"

Lab BMA1 - Azure AI Foundry でエージェントの準備 が完了しました！さらに探求したい場合はどうぞ。

次は Lab BMA2 - M365 Agents SDK を使用して初めてのエージェントを構築 へ進んでください。Next を選択してください。

<cc-next url="../02-agent-with-agents-sdk" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/agents-sdk/01-agent-in-foundry" />