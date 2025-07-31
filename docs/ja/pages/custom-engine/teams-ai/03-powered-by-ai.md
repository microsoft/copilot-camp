---
search:
  exclude: true
---
# Lab BTA3 - ユーザー エクスペリエンスの強化

このラボでは Teams AI ライブラリが提供する Powered by AI の一連の機能について学び、カスタム エンジン エージェントに取り入れてユーザー エクスペリエンスを向上させます。

このラボで行うこと:

- Powered by AI 機能とは何かを学ぶ  
- フィードバック ループを有効化してユーザー フィードバックを収集する  
- Adaptive Cards で引用をカスタマイズする  
- AI 生成ラベルを有効化する  
- 機密度ラベルを有効化する  

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/J7IZULJsagM" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>このビデオでラボの概要を確認できます。</div>
    </div>
    <div style="flex: 1; min-width: 0;">
        ---8<--- "ja/b-labs-prelude.md"
    </div>
</div>

## Introduction

???+ info "Powered by AI とは?"
    Powered by AI は、カスタム エンジン エージェントとの対話をより魅力的でユーザー フレンドリーにするために Teams AI ライブラリが提供する機能セットです。主な機能は次のとおりです。

    * **フィードバック ループ:** ユーザーは AI の応答に対してサムズアップまたはサムズダウンで評価できます。このフィードバックにより、AI の精度と有用性が時間とともに向上します。  

    * **引用 (Citations):** AI が情報源を参照して透明性と信頼性を確保します。  

    * **AI 生成ラベル:** AI システムが作成したメッセージに「AI generated」というラベルが付き、ユーザーは AI と人間の応答を区別できます。  

    * **機密情報:** 共有される情報が機密である場合、機密度ラベルが表示され、組織外への共有可否を示します。  

前の演習では RAG (Retrieval-Augmented Generation) をカスタム エンジン エージェントに統合しました。本演習では Powered by AI 機能を活用してユーザー エクスペリエンスを強化します。次の手順を実施します。

- フィードバック ループを実装する  
- 引用をカスタマイズする  
- AI 生成メッセージをラベリングする  
- 機密情報を表示する  

これらの Powered by AI 機能を組み込むことで、カスタム エンジン エージェントは透明性・信頼性が高まり、ユーザー エクスペリエンス全体が向上します。

## Exercise 1: フィードバック ループを有効化する

この演習では、前のラボで作成したソース コードをそのまま使用します。

### Step 1: アプリにフィードバック ループを統合する

プロジェクトの `src/app/app.ts` を開き、アプリケーション インスタンスを見つけて **ai** プロパティの中に `enable_feedback_loop: true` を追加します。更新後のアプリケーション インスタンスは次のようになります。

```javascript
const app = new Application({
  storage,
  ai: {
    planner,
    //feedback loop is enabled
    enable_feedback_loop: true
  },
});
```

フィードバック応答を処理するために、`src/app/app.ts` に次のコード スニペットを追加します。

```javascript
app.feedbackLoop(async (_context, _state, feedbackLoopData) => {
  if (feedbackLoopData.actionValue.reaction === 'like') {
      console.log('👍' + ' ' + feedbackLoopData.actionValue.feedback!);
  } else {
      console.log('👎' + ' ' + feedbackLoopData.actionValue.feedback!);
  }
});
```

<cc-end-step lab="bta3" exercise="1" step="1" />

### Step 2: フィードバック ループ機能をテストする

Career Genie をフィードバック ループ機能付きでテストしましょう。Visual Studio Code の **Run and Debug** タブから **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択してデバッグを開始します。ブラウザーで Microsoft Teams が開き、アプリの詳細画面が表示されたら **Add** を選択してチャットを開始します。

!!! tip "Tip: この演習をローカルでテストする"
    これまでに実装した Teams AI ライブラリの一部機能は Teams App Test Tool では正しく動作しない場合があります。必ずローカル環境の Teams でテストとデバッグを行ってください。

フィードバック ループを試す前に「Hi」や「Suggest me .NET developers who can speak Spanish.」のように入力します。カスタム エンジン エージェントの応答の左下にサムズアップとサムズダウンのボタンが表示されていることを確認してください。

![The UI of a chat with the custom engine agent when the Feedback Loop is enabled. There are thumbs up and down buttons just below the response, to allow users to provide feedback.](../../../assets/images/custom-engine-03/thumbs-up-down.png)

次にフィードバック ループを試します。サムズアップまたはサムズダウンのいずれかのボタンをクリックすると、フィードバック カードがポップアップ表示されます。テキスト フィールドにフィードバックを入力し **Submit** をクリックします。

![The UI of a chat with the custom engine agent when the Feedback Loop is enabled and the user selects any of the thumbs up or down buttons. There is a popup dialog to provide a detailed text-based feedback and a 'Submit' button to send it.](../../../assets/images/custom-engine-03/feedback-card.png)

フィードバックが記録されたか確認するには、Visual Studio Code に戻りターミナルを確認します。サムズアップ/サムズダウンの結果とコメントが出力されているはずです。

![The terminal window of Visual Studio Code showing the user's feedback with a thumb up and the feedback text 'Copilot Camp rocks!'](../../../assets/images/custom-engine-03/feedback-output.png)

!!! tip "デバッグでフィードバック ループを深掘りする"
    コードをデバッグすると動作を詳しく理解できます。`app.feedbackLoop` にブレークポイントを設定してアプリを実行し、サムズアップまたはサムズダウンをクリックすると、`feedbackLoopData.actionValue.reaction` にリアクションが、`feedbackLoopData.actionValue.feedback` にテキスト フィードバックが格納される様子を確認できます。

<cc-end-step lab="bta3" exercise="1" step="2" />

## Exercise 2: Adaptive Cards で引用をカスタマイズする

カスタム エンジン エージェントでデータ ソースを定義すると、Teams AI ライブラリが自動的に引用を有効化し関連ドキュメントを参照します。現在のエクスペリエンスを確認するために「Suggest me .NET developers who can speak Spanish.」のように質問してみてください。引用にカーソルを合わせるとドキュメントの冒頭が表示されます。

![The UI of a chat with the custom engine agent when citations are enabled. There is a citation mark beside a content in the response and a popup callout to show the initial part of the referenced document.](../../../assets/images/custom-engine-03/current-citation.png)

この演習では、引用エクスペリエンスをさらにカスタマイズし、Adaptive Cards を使用して引用の表示方法を変更します。

### Step 1: 引用用の Adaptive Card を作成する

`src/app/` フォルダーに **card.ts** という新しいファイルを作成し、次のコード スニペットを追加します。

```javascript
import { AdaptiveCard, Message, Utilities } from '@microsoft/teams-ai';
/**
 * Create an adaptive card from a prompt response.
 * @param {Message<string>} response The prompt response to create the card from.
 * @returns {AdaptiveCard} The response card.
 */

//Adaptive card to display the response and citations
export function createResponseCard(response: Message<string>): AdaptiveCard {
    const citationCards = response.context?.citations.map((citation, i) => ({
            type: 'Action.ShowCard',
            title: `${i+1}`,
            card: {
                type: 'AdaptiveCard',
                body: [
                    {
                        type: 'TextBlock',
                        text: citation.title,
                        fontType: 'Default',
                        weight: 'Bolder'
                    },
                    {
                        type: 'TextBlock',
                        text: citation.content,
                        wrap: true
                    }
                ]
            }
        }));
    
    const text = Utilities.formatCitationsResponse(response.content!);
    return {
        type: 'AdaptiveCard',
        body: [
            {
                type: 'TextBlock',
                text: text,
                wrap: true
            },
            {
                type: 'TextBlock',
                text: 'Citations',
                wrap: true,
                fontType: 'Default',
                weight: 'Bolder'
            },
            {
                type: 'ActionSet',
                actions: citationCards
            }
        ],
        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
        version: '1.5'
    };
}
```

この Adaptive Card では、引用を `Action.ShowCard` ボタンとして一覧表示し、クリックすると詳細を表示できます。また、引用ボタンと共に応答のメイン コンテンツも表示します。ユーザーが引用の詳細を読みたい場合、そのボタンをクリックして全文を確認できます。

<cc-end-step lab="bta3" exercise="2" step="1" />

### Step 2: PredictedSayCommand を使用して引用エクスペリエンスをカスタマイズする

??? info "`PredictedSayCommand` は何をするのですか?"
    **PredictedSayCommand** は AI システムが実行する応答ディレクティブです。PredictedSayCommand をカスタマイズすると、引用やフィードバック ループなどの Powered by AI 機能をエージェント アクティビティに細かく統合できます。これにより、アプリケーションのニーズに合わせて AI の応答を精密に調整できます。

`src/app/app.ts` を開き、ファイルの先頭に次のコードを追加して Adaptive Card をインポートします。

```javascript
import { createResponseCard } from './card';
```

`botbuilder` のインポートに `CardFactory` を追加します。更新後は次のようになります。

```javascript
import { CardFactory, MemoryStorage, MessageFactory, TurnContext } from "botbuilder";
```

`@microsoft/teams-ai` のインポートに `AI` と `PredictedSayCommand` を追加します。更新後は次のようになります。

```javascript
import { Application, ActionPlanner, OpenAIModel, PromptManager, AI, PredictedSayCommand} from "@microsoft/teams-ai";
```

引用をカスタマイズするために、`src/app/app.ts` に次の PredictedSayCommand アクションを追加します。

```javascript
app.ai.action<PredictedSayCommand>(AI.SayCommandActionName, async (context, state, data, action) => {
  let activity;
  if (data.response.context && data.response.context.citations.length > 0 ) {
      const attachment = CardFactory.adaptiveCard(createResponseCard(data.response));
      activity = MessageFactory.attachment(attachment);
  }
  else {
      activity = MessageFactory.text(data.response.content);
  }

  activity.entities = [
    {
        type: "https://schema.org/Message",
        "@type": "Message",
        "@context": "https://schema.org",
        "@id": ""
    }
  ];
  activity.channelData = {
    feedbackLoopEnabled: true
  };

  await context.sendActivity(activity);

  return "success";
 
});
```

<cc-end-step lab="bta3" exercise="2" step="2" />

### Step 3: カスタマイズした引用エクスペリエンスをテストする

Career Genie をカスタマイズした引用エクスペリエンスでテストしましょう。Visual Studio Code の **Run and Debug** タブから **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択してデバッグを開始します。ブラウザーで Microsoft Teams が開いたら **Add** を選択してチャットを開始します。

!!! tip "Tip: この演習をローカルでテストする"
    これまでに実装した Teams AI ライブラリの一部機能は Teams App Test Tool では正しく動作しない場合があります。必ずローカル環境の Teams でテストとデバッグを行ってください。

まず「Hi」や「Hello」と挨拶し、その後「Can you suggest any candidates for a senior developer position with 7+ year experience that requires Japanese speaking?」のように質問します。

![An animation showing the behavior of citations in a custom engine agent. There is a prompt and a response that provides three citations. Each citation shows the actual resume for each employee referenced in the answer.](../../../assets/images/custom-engine-03/customized-citation.gif)

Adaptive Cards でカスタマイズされた引用エクスペリエンスでは、各引用にボタンが表示されます。ボタンをクリックするとドキュメントの詳細が展開され、候補者の履歴書を確認できます。

<cc-end-step lab="bta3" exercise="2" step="3" />

## Exercise 3: AI 生成ラベルを有効化する

この演習では `PredictedSayCommand` を引き続き使用してユーザー エクスペリエンスをカスタマイズします。AI と人間の応答を区別しやすくするため、AI システムが作成したメッセージに「AI generated」ラベルを表示します。

### Step 1: PredictedSayCommand で AI 生成ラベルを有効化する

`src/app/app.ts` を開き、`PredictedSayCommand` アクションを見つけます。`activity.entities` 内に次のコード スニペットを追加します。

```javascript
// Generated by AI label
additionalType: ["AIGeneratedContent"]
```

更新後の `activity.entities` は次のようになります。

```javascript
activity.entities = [
    {
        type: "https://schema.org/Message",
        "@type": "Message",
        "@context": "https://schema.org",
        "@id": "",
        // Generated by AI label
        additionalType: ["AIGeneratedContent"],
    },
    
];
```

<cc-end-step lab="bta3" exercise="3" step="1" />

### Step 2: AI 生成ラベルをテストする

Career Genie を AI 生成ラベル付きでテストしましょう。Visual Studio Code の **Run and Debug** タブから **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択してデバッグを開始します。ブラウザーで Microsoft Teams が開いたら **Add** を選択してチャットを開始します。

!!! tip "Tip: この演習をローカルでテストする"
    これまでに実装した Teams AI ライブラリの一部機能は Teams App Test Tool では正しく動作しない場合があります。必ずローカル環境の Teams でテストとデバッグを行ってください。

Career Genie に挨拶するだけでテストできます。最初のメッセージの上部に小さく「AI generated」ラベルが表示されます。

![The UI of a chat with the custom engine agent when the Generated by AI label is enabled. At the top of the answer there is a label showing that the content is 'AI generated'.](../../../assets/images/custom-engine-03/ai-generated.png)

<cc-end-step lab="bta3" exercise="3" step="2" />

## Exercise 4: 機密度ラベルを有効化する

最後の演習では、`PredictedSayCommand` を活用して機密度ラベルを有効化します。Career Genie は人事タスクに特化しており、組織内でのみ共有すべき機密情報を扱うことが多いです。このようなシナリオでは、AI 生成メッセージの上部に機密度ラベルが表示され、組織外への共有可否が示されます。

### Step 1: PredictedSayCommand で機密度ラベルを有効化する

`src/app/app.ts` を開き、`PredictedSayCommand` アクションを見つけます。`activity.entities` 内に次のコード スニペットを追加します。

```javascript
// Sensitivity label
usageInfo: {
    "@type": "CreativeWork",
    name: "Confidential",
    description: "Sensitive information, do not share outside of your organization.",
}
```

更新後の `activity.entities` は次のようになります。

```javascript
activity.entities = [
    {
        type: "https://schema.org/Message",
        "@type": "Message",
        "@context": "https://schema.org",
        "@id": "",
        // Generated by AI label
        additionalType: ["AIGeneratedContent"],
        // Sensitivity label
        usageInfo: {
          "@type": "CreativeWork",
          name: "Confidential",
          description: "Sensitive information, do not share outside of your organization.",
        }
    },
    
  ];
```

<cc-end-step lab="bta3" exercise="4" step="1" />

### Step 2: 機密度ラベルをテストする

Career Genie を機密度ラベル付きでテストしましょう。Visual Studio Code の **Run and Debug** タブから **Debug in Teams (Edge)** または **Debug in Teams (Chrome)** を選択してデバッグを開始します。ブラウザーで Microsoft Teams が開いたら **Add** を選択してチャットを開始します。

!!! tip "Tip: この演習をローカルでテストする"
    これまでに実装した Teams AI ライブラリの一部機能は Teams App Test Tool では正しく動作しない場合があります。必ずローカル環境の Teams でテストとデバッグを行ってください。

機密度ラベルをテストするには、Career Genie に挨拶するか「Can you suggest a candidate who is suitable for spanish speaking role that requires at least 2 years of .NET experience?」のように質問します。

![The UI of a chat with the custom engine agent when the Sensitivity label is enabled. At the top of the answer, next to the 'AI generated' label, there is a sensitivity shield label highlighted. There is also a card with specific guidance that appears when hoovering over the sensitivity label.](../../../assets/images/custom-engine-03/sensitivity-label.png)

Career Genie のメッセージで「AI generated」ラベルの隣に機密度ラベルが表示されることを確認します。機密度ラベルにカーソルを合わせると、組織固有のガイダンスが表示されます。

<cc-end-step lab="bta3" exercise="4" step="2" />

---8<--- "ja/b-congratulations.md"

Lab BTA3 - Powered by AI キットでユーザー エクスペリエンスを強化するラボを完了しました! さらに学習したい場合は、このラボのソース コードが [Copilot Developer Camp リポジトリ](https://github.com/microsoft/copilot-camp/tree/main/src/custom-engine-agent/Lab03-Powered-by-AI/CareerGenie){target=_blank} にあります。

次は Lab BTA4 - 認証を使用してソリューションを保護する に進みましょう。Next を選択してください。

<cc-next url="../04-authentication" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/custom-engine/teams-ai/03-powered-by-ai--ja" />