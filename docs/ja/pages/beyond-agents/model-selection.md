---
search:
  exclude: true
---
# 🎯 モデル選択アドベンチャー

**今回達成すること:**

- **課題の特定**: エージェントにおいてモデル選択がなぜ重要かを理解します  
- **モデルの全体像を把握**:  多様な AI モデルとその強みを知ります  
- **モデルをハンズオンでテスト**:  GitHub Models Playground で実際の出力を比較します  
- **選択に自信を持つ**:  自身のエージェントに最適なモデルを判断できるようになります  
- **継続的に改善**:  実験を通じてアプローチを洗練させます  

このブログでは、エージェントに適した AI モデルの選び方を解説します。いわば「適材適所」のツール選び。合うモデルを使えばエージェントは本領を発揮し、「まあまあ」ではなく「しっかり」働きます。  

---

## 📖 はじめに

Copilot エージェント開発はわくわくしますが、実は秘密があります。あなたが書く指示文だけでは半分に過ぎません。エージェントを動かす AI モデルが、その挙動・能力・パフォーマンスに大きく影響します。  

例えば、医用画像を解析するエージェント向けに完璧な指示を書いても、テキスト専用モデルを選んでしまえば機能しません。また、速度に最適化されたモデルにクリエイティブな物語を書くよう指示すると、ありきたりな結果や、最悪の場合は雑なラップ曲が返ってくるかもしれません。  

このブログ兼ハンズオンワークショップを通して、**GitHub Models Playground** を使いながら複数モデルを探索・テスト・比較し、モデル選択への自信を高めましょう。終了時には、各モデルが得意とするタスクを理解し、自分で選択できる実践力が身に付きます。  

---

## 🔍 Step 1: 課題の特定

**課題:** Copilot エージェントを構築しているが、どの AI モデルを選べばよいかわからない。高速だが凡庸なモデルもあれば、高性能だが高価なモデルもある。どう選択すべきか?  

**実際のシナリオ:** チームの長大な会議録を要約するエージェントを作成するとします。あるモデルでは役立たない長文が返り、別のモデルでは簡潔で実用的な要約が得られました。違いは何か? それがモデルです。  

**解決策:** ハンズオンでの実験を通して、タスクとモデルをマッチングする方法を学びましょう。  

**目標:** この旅の終わりには、次のような一般的タスクに最適なモデルを自信を持って選択できるようになります。  

- ドキュメントの要約 📄  
- 音声の文字起こし 🎙️  
- 画像解析 🖼️  
- クリエイティブコンテンツの生成 ✍️  

---

## 🗺️ Step 2: モデルの全体像を把握

AI エージェントに役割があるように、モデルにも個性と強みがあります。ではラインナップを見てみましょう。  

### 🎭 モデルツールキット

| タスク | 推奨モデル | 主要特長 | 推奨シナリオ |
|------|-------------------|--------------|-------------|
| **ドキュメント要約** | [Mistral Small](https://github.com/marketplace/models/azureml-mistral/mistral-small-2503) | 簡潔・文脈理解・高精度 | レポート・記事・会議メモの要約 |
| **音声文字起こし** | [Phi-4 Multimodal](https://github.com/marketplace/models/azureml/Phi-4-multimodal-instruct) | マルチモーダル・高精度音声認識 | ポッドキャスト・会議・インタビューのテキスト化 |
| **画像解析** | [OpenAI o3](https://github.com/marketplace/models/azure-openai/o3) | ビジョン機能・アノテーション・詳細抽出 | グラフ読取・写真解析・データ抽出 |
| **コンテンツ生成** | [GPT-5 mini](https://github.com/marketplace/models/azure-openai/gpt-5-mini) | 流暢・創造性・多用途 | メール・投稿・レポート・物語の作成 |

???+ info "なぜこれらのモデル？"
     Mistral、Phi-4、OpenAI o シリーズ、OpenAI gpt シリーズを選択したのは、出発点としてわかりやすい多様な強みとアプローチを示すためです。他のモデルを試す前に、まずは主要な選択肢を理解しましょう。

これらのモデルは、専門道具が並ぶキッチンのようなものです。バターナイフで野菜は切れませんし、肉切り包丁でジャムは塗りません。各モデルには“おいしい仕事”があります。  

---

## 🧪 Step 3: GitHub Models Playground でのハンズオン実験

いよいよテストの時間です! GitHub Models Playground は実験用のサンドボックス。ここで魔法が起こります。  

### セットアップ要件

**前提条件:**

1. **GitHub アカウント**: 必要であれば [無料で作成](https://github.com/signup)  
2. **アクセス確認**: [GitHub Models Marketplace](https://github.com/marketplace/models) にアクセス  
3. **カタログの把握**: [利用可能なモデル](https://github.com/marketplace?type=models) を閲覧  

**ナビゲーションのコツ:**

- **Publisher でフィルター**: 定評ある AI プロバイダーに絞る  
- **Capability でフィルター**: テキストタスクには `Chat/Completion` を選択  
- **Category でフィルター**: 目的に応じて選択  
  - **All**: 一般的な Q&A  
  - **Instruction**: 専門ドメイン  
  - **Multimodal**: 画像 & テキスト処理  
  - **Audio**: 音声処理  
  - **Reasoning**: 複雑な問題解決  
  - **Multilingual**: 多言語対応  

### はじめてみよう

**ステップバイステップ:**

1. **Playground にアクセス**  
   [GitHub Models Marketplace](https://github.com/marketplace/models) へ  
2. **最初のモデルを選ぶ**  
   ドキュメント要約用に馴染みのある GPT-4 から試してみましょう  
3. **テストプロンプトを作成**  
   要約したいドキュメントを貼り付けるか、解析したい画像をアップロード  
4. **実行してレビュー**  
   出力を確認。簡潔か? 正確か? 読みやすいか?  
5. **モデルを切り替えて比較**  
   同じプロンプトを Mistral や Phi-4 など他モデルでも試します  
6. **メモを取る**  
   明瞭さ・精度・文体・速度の違いを記録します  

### 💡 テストのプロ技

**Same-Prompt メソッド:**  
複数モデルへ同一プロンプトを入力しましょう。これがコントロール変数になります。出力が異なれば、それは指示ではなく“モデルの違い”です。  

**テスト例:**  
たとえば、気候変動に関する 2 000 語の論文を要約したいとします。  

- **GPT-4 でテスト**: 重要ポイントの整理方法を確認  
- **Mistral Small でテスト**: さらに簡潔か詳細かを比較  
- **Phi-4 でテスト**: 可読性と構成を比較  

GPT-4 は洞察に富む要約を返し、Mistral Small は高速で概要を提供する――そんな違いに気づくかもしれません。  

### 🎨 画像解析のテスト

同じ画像を複数のビジョン対応モデルにアップロードしてみましょう。  

- **OpenAI o3**: 詳細な説明に優れる可能性あり  
- **GPT-5 mini**: グラフからのデータ抽出が得意かもしれません  

Playground を使えば、推測ではなくリアルタイムで結果を確認できます。  

---

## 🔄 Step 4: 継続的最適化戦略

モデル選択は、一度決めたら終わりではなく、ニーズの変化や新モデルの登場に応じて常に見直しが必要です。  

### 最適化アプローチ

**初期導入:**  
テスト結果を基に最適なモデルを選び、実運用にデプロイします。  

**パフォーマンス監視:**  
実環境での成果を継続的に追跡し、期待を下回るパターンを特定します。  

**定期評価:**  
四半期ごとに、新モデルや更新版を既存のテストケースで評価します。  

**戦略的調整:**  
特定のユースケースで定量的に優れた性能が確認できたら、モデルを更新します。  

### 高度な検討事項

**費用対効果分析:**  
高価なモデルが、時短や品質向上などでコストに見合うか評価します。  

**エッジケース管理:**  
モデルの限界を露呈する難易度の高いリクエストを蓄積し、新モデルのテストに活用します。  

**パフォーマンスドキュメント:**  
シナリオごとに有効だったモデルを記録し、将来の意思決定に役立てます。  

---

## 🚀 実践的なポイント

### コスト & パフォーマンス分析

[Azure AI Model Leaderboard](https://ai.azure.com/explore/models/leaderboard) を活用して以下を比較しましょう。  

- **リクエスト当たりのコスト**: 予算計画と ROI の計算  
- **性能指標**: 客観的な品質評価  
- **速度ベンチマーク**: 応答時間要件  

### プロフェッショナルヒント

- **効率重視**: 多くのタスクは中位クラスのモデルで十分。品質が成果に直結する場合のみプレミアムモデルを使用しましょう。  
- **ドキュメント整備**: 成功したモデルとタスクの組み合わせを簡潔に記録しておくと便利です。  
- **最新情報の追跡**: 機能や選択肢は急速に進化します。定期的に新モデルをテストしましょう。  

## 📚 リソース

さらに深掘りしたい方はこちら:

| タスク | GitHub | Microsoft Foundry | 動画を見る | 詳細ラボ |
|------|-------------------|--------------|-------------|-------------|
| **ドキュメント要約** | [Mistral Small](https://github.com/marketplace/models/azureml-mistral/mistral-small-2503) | [Mistal Small](https://ai.azure.com/explore/models/Mistral-small/version/1/registry/azureml-mistral?tid=3724f11b-e7b2-41d9-92a6-05ff649e1c18) | [Watch now](https://www.youtube.com/watch?v=tqOecUt_wCc&list=PLmsFUfdnGr3wzz6a4E-Szksg92JPng-AL&index=5&pp=iAQB) | [Learn more](https://github.com/microsoft/Build25-LAB324) |
| **音声文字起こし** | [Phi-4 Multimodal](https://github.com/marketplace/models/azureml/Phi-4-multimodal-instruct) | [Phi-4-multimodal-instruct](https://ai.azure.com/explore/models/Phi-4-multimodal-instruct/version/2/registry/azureml?tid=3724f11b-e7b2-41d9-92a6-05ff649e1c18) | [Watch now](https://www.youtube.com/watch?v=VLQKZq8L9Uk&list=PLmsFUfdnGr3wzz6a4E-Szksg92JPng-AL&index=2) | [Learn more](https://github.com/microsoft/PhiCookBook/blob/main/md/02.Application/05.Audio/Phi4/Transciption/README.md) |
| **画像解析** | [OpenAI o3](https://github.com/marketplace/models/azure-openai/o3) | [OpenAI o3](https://ai.azure.com/explore/models/o3/version/2025-04-16/registry/azure-openai?tid=3724f11b-e7b2-41d9-92a6-05ff649e1c18) | [Watch now](https://www.youtube.com/watch?v=ffxUEenM4B8&list=PLmsFUfdnGr3wzz6a4E-Szksg92JPng-AL&index=12&pp=iAQB) | [Learn more](https://github.com/microsoft/BUILD25-LAB333) |
| **コンテンツ生成** | [GPT-5 mini](https://github.com/marketplace/models/azure-openai/gpt-5-mini) | [gpt-5-mini](https://ai.azure.com/explore/models/gpt-5-mini/version/2025-08-07/registry/azure-openai?tid=3724f11b-e7b2-41d9-92a6-05ff649e1c18) | [Explore](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-model-mondays-%E2%80%93-your-ai-model-power-up/4390773) | TBD |

---

## 🎬 まとめ

適切な AI モデルを選ぶことは、役者をキャスティングするのと同じです。アクションヒーローをラブコメに起用しないように、速度重視のモデルに詩的な文章を求めるのは適切ではありません。  

GitHub Models Playground は、リスクなくモデルを“オーディション”できる舞台です。実際に動かしてみて、その演技を確認し、エージェントに最適なキャスティングを行いましょう。  

実験を重ねるほど、勘は研ぎ澄まされます。やがて、タスクを見ただけで「このモデルが光る」と直感できるようになるはずです。