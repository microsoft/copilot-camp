---
search:
  exclude: true
---
# 🎯 モデル選択アドベンチャー

**あなたが行うこと:**

- **問題を特定**: エージェントにおいてモデル選択が重要な理由を理解する  
- **モデルの全体像を探索**: さまざまな AI モデルとその強みを発見する  
- **モデルを実際にテスト**: GitHub Models Playground を使って出力を比較する  
- **選択に自信を持つ**: 自分のエージェントに最適なモデルを判断する  
- **反復して改善**: 実験を通じてアプローチを洗練する  

このブログでは、エージェントに適した AI モデルを選ぶ方法を順を追って説明します。適切なツールを選ぶことは作業の成功を左右します。正しく選べばエージェントは本当に役立ち、「まあまあ」では終わりません。

---

## 📖 はじめに

Copilot エージェントの構築はワクワクしますが、実は **指示文だけでは半分** なのです。エージェントを動かす AI モデルは、その挙動・できること・パフォーマンスに大きく影響します。

たとえば、医用画像を解析する完璧な指示を書いても、テキスト専用モデルを選んだら機能しません。また、速度に最適化されたモデルに創作ストーリーを書かせれば、味気ない文章やひどいラップが返ってくるかもしれません。

このブログ (ハンズオン ワークショップとしても利用可能) では、 **GitHub Models Playground** を使ってさまざまな AI モデルを探索・テスト・比較し、モデル選択に自信を持てるようにします。最後には、どのモデルがどのタスクに強いかを理解し、自分で選択できる実践力が身につきます。

---

## 🔍 Step 1: 課題の特定

**課題:** Copilot エージェントを構築したいが、どの AI モデルを使えばよいかわからない。高速だが汎用的なモデルもあれば、高性能だが高価なモデルもある。どう選ぶ？

**実際のシナリオ:** チームの長い会議録を要約するエージェントを作るとします。あるモデルでは役立たない長文が返り、別のモデルでは簡潔で行動可能な要約が返る。その違いは？ モデルです。

**解決策:** ハンズオン実験を通じてタスクに合ったモデルをマッチさせる方法を学ぶ。

**目標:** この旅の終わりまでに、以下の一般的なタスクに適したモデルを自信を持って選べるようになります。

- 📄 ドキュメント要約
- 🎙️ 音声の文字起こし
- 🖼️ 画像解析
- ✍️ クリエイティブコンテンツ生成

---

## 🗺️ Step 2: モデルランドスケープの探索

AI エージェントに明確な役割が必要なように、モデルにも個性と強みがあります。さっそくキャストを紹介しましょう。

### 🎭 モデルツールキット

| Task | 推奨モデル | 主な特徴 | 使用シーン |
|------|-----------|----------|-----------|
| **ドキュメント要約** | [ Mistral Small ](https://github.com/marketplace/models/azureml-mistral/mistral-small-2503) | 簡潔、文脈理解、正確 | レポート・記事・議事録の要約 |
| **音声文字起こし** | [ Phi-4 Multimodal ](https://github.com/marketplace/models/azureml/Phi-4-multimodal-instruct) | マルチモーダル、高精度音声認識 | ポッドキャスト・会議・インタビューのテキスト化 |
| **画像解析** | [ OpenAI o3 ](https://github.com/marketplace/models/azure-openai/o3) | ビジョン機能、注釈、詳細抽出 | グラフ読み取り、写真解析、データ抽出 |
| **コンテンツ生成** | [ GPT-5 mini ](https://github.com/marketplace/models/azure-openai/gpt-5-mini) | 流暢、創造的、多用途 | メール・投稿・レポート・ストーリーの下書き |

???+ info "why these models?"
     Mistral、Phi-4、OpenAI o シリーズ、OpenAI gpt シリーズを選んだのは、明確な出発点を提示するためです。これらのファミリーは多様な強みとアプローチを代表しており、他の選択肢を探る前に主要なオプションを理解できます。

これらのモデルは、専門ツールがそろったキッチンのようなものです。バターナイフで野菜は切らないし、肉用の出刃包丁でジャムは塗りません。モデルにも得意分野があるのです。

---

## 🧪 Step 3: GitHub Models Playground でのハンズオン実験

いよいよモデルを実際に試す楽しい時間です。GitHub Models Playground は実験用サンドボックス。ここで魔法が起こります。

> 続行するには [ GitHub アカウント ](https://github.com/signup) が必要です。 

### スタートガイド

**ステップバイステップ:**

1. **Playground にアクセス**  
   [ GitHub Models Marketplace ](https://github.com/marketplace/models) へ

2. **最初のモデルを選ぶ**  
   ドキュメント要約ならおなじみの GPT-4 から始めましょう

3. **テスト用プロンプトを作成**  
   要約したいドキュメントを貼り付けるか、解析したい画像をアップロード

4. **実行してレビュー**  
   出力を確認。簡潔か？ 正確か？ 読みやすいか？

5. **モデルを切り替えて比較**  
   同じプロンプトを Mistral や Phi-4 など別モデルでも試す

6. **メモを取る**  
   明確さ・正確さ・文体・速度の違いを記録

### 💡 テストのプロ向けヒント

**同一プロンプト法:**  
複数モデルでまったく同じプロンプトを使うのがコツです。これは対照変数となります。出力が異なれば、指示ではなくモデルの違いが原因だとわかります。

**テスト例:**  
気候変動に関する 2,000 文字の研究記事を要約するとしましょう。

- ** GPT-4 でテスト:** 重要ポイントの整理方法を確認  
- ** Mistral Small でテスト:** より簡潔か詳細かを比較  
- ** Phi-4 でテスト:** 読みやすさと構成を比較  

GPT-4 は洞察に富むまとめを、Mistral Small は高速で概要を返す、などの発見があるかもしれません。

### 🎨 画像解析のテスト

同じ画像をビジョン対応モデルにアップロードして比較:

- ** OpenAI o3:** 詳細な説明に秀でる可能性  
- ** GPT-5 mini:** グラフから特定データを抽出するのが得意かも  

Playground なら推測ではなく、リアルタイムに実際の結果が確認できます。

---

## 🔄 Step 4: レビュー、反復、改善

モデル選択は「一度決めて終わり」ではありません。継続的に洗練していくプロセスです。

---

## 🚀 追加ステップ: コストとその他の重要事項

このステップはオプションですが非常に有用です。  
[ リーダーボード ](https://ai.azure.com/explore/models/leaderboard) を使えば、モデルのコスト・品質などを比較できます。

---

## 📚 リソース

さらに深掘りしたい方はこちらをどうぞ:

| Task | GitHub | Microsoft Foundry | 動画を見る | ラボで学ぶ |
|------|--------|-----------------|------------|-----------|
| **ドキュメント要約** | [ Mistral Small ](https://github.com/marketplace/models/azureml-mistral/mistral-small-2503) | [ Mistal Small ](https://ai.azure.com/explore/models/Mistral-small/version/1/registry/azureml-mistral?tid=3724f11b-e7b2-41d9-92a6-05ff649e1c18) | [ Watch now ](https://www.youtube.com/watch?v=tqOecUt_wCc&list=PLmsFUfdnGr3wzz6a4E-Szksg92JPng-AL&index=5&pp=iAQB) | [ Learn more ](https://github.com/microsoft/Build25-LAB324) |
| **音声文字起こし** | [ Phi-4 Multimodal ](https://github.com/marketplace/models/azureml/Phi-4-multimodal-instruct) | [ Phi-4-multimodal-instruct ](https://ai.azure.com/explore/models/Phi-4-multimodal-instruct/version/2/registry/azureml?tid=3724f11b-e7b2-41d9-92a6-05ff649e1c18) | [ Watch now ](https://www.youtube.com/watch?v=VLQKZq8L9Uk&list=PLmsFUfdnGr3wzz6a4E-Szksg92JPng-AL&index=2) | [ Learn more ](https://github.com/microsoft/PhiCookBook/blob/main/md/02.Application/05.Audio/Phi4/Transciption/README.md) |
| **画像解析** | [ OpenAI o3 ](https://github.com/marketplace/models/azure-openai/o3) | [ OpenAI o3 ](https://ai.azure.com/explore/models/o3/version/2025-04-16/registry/azure-openai?tid=3724f11b-e7b2-41d9-92a6-05ff649e1c18) | [ Watch now ](https://www.youtube.com/watch?v=ffxUEenM4B8&list=PLmsFUfdnGr3wzz6a4E-Szksg92JPng-AL&index=12&pp=iAQB) | [ Learn more ](https://github.com/microsoft/BUILD25-LAB333) |
| **コンテンツ生成** | [ GPT-5 mini ](https://github.com/marketplace/models/azure-openai/gpt-5-mini) | [ gpt-5-mini ](https://ai.azure.com/explore/models/gpt-5-mini/version/2025-08-07/registry/azure-openai?tid=3724f11b-e7b2-41d9-92a6-05ff649e1c18) | [ Explore ](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-model-mondays-%E2%80%93-your-ai-model-power-up/4390773) | TBD |

---

## 🎬 まとめ

適切な AI モデルを選ぶことは、役にぴったりの俳優をキャスティングするのと同じです。アクション俳優をロマンチックコメディに配役しないように、速度特化モデルに詩を書かせるべきではありません。

GitHub Models Playground は、リスクのない舞台でモデルをオーディションし、そのパフォーマンスを確認し、エージェントのために適切なキャスティング決定を下せるようにします。

実験を重ねるほど直感は研ぎ澄まされます。すぐに、タスクを見ただけでどのモデルが輝くかがわかるようになるでしょう。