---
search:
  exclude: true
---
# ラボ E5 - Adaptive Card の追加

このラボでは、Microsoft 365 Copilot のテキスト応答をリッチ カードに拡張するために Adaptive Card を使用します。 

このラボで学習する内容:

- Adaptive Card とは
- Adaptive Card を作成してテストする方法
- リッチ コンテンツとして Adaptive Card を使用するように Microsoft 365 Copilot の応答を更新する方法

<div class="lab-intro-video">
    <div style="flex: 1; min-width: 0;">
        <iframe  src="//www.youtube.com/embed/9kb9whCKey4" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9;">          
        </iframe>
          <div>この動画でラボの概要をご覧ください。</div>
            <div class="note-box">
            📘 <strong>Note:</strong> このラボは前回のラボ E4 を基にしています。E2〜E6 のラボは同じフォルダーで作業を続けられますが、参照用にソリューション フォルダーも提供されています。  
    このラボの完成版ソリューションは <a  src="https://github.com/microsoft/copilot-camp/tree/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END" target="_blank">/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END</a> にあります。
        </div>
    </div>
    <div style="flex: 1; min-width: 0;">
  ---8<--- "ja/e-labs-prelude.md"
    </div>
</div>


## はじめに
<details>
<summary>Adaptive Card とは？</summary>

Adaptive Card は、JSON で記述されたプラットフォーム非依存の UI スニペットです。アプリやサービス間でやり取りでき、アプリに配信されると環境に合わせて自動的にネイティブ UI に変換されます。これにより、主要なプラットフォームやフレームワーク全体で軽量な UI を設計・統合できます。
    <div class="video">
      <iframe src="//www.youtube.com/embed/pYe2NqKhJoM" frameborder="0" allowfullscreen></iframe>
      <div>Adaptive Card はあらゆる場所で利用されています</div>
    </div>
</details>

## 演習 1: シンプルな Adaptive Card を作成してテストする

では早速、Adaptive Card の作成の楽しさを体験してみましょう。

### ステップ 1: Adaptive Card を JSON で定義する

以下は JSON で記述された Adaptive Card です。まずはコピーしてください。

```json
{
  "type": "AdaptiveCard",
  "body": [
    {
      "type": "TextBlock",
      "text": "Hello, Adaptive Cards!",
      "size": "large",
      "weight": "bolder"
    }
  ],
  "actions": [
    {
      "type": "Action.OpenUrl",
      "title": "Click me",
      "url":"https://www.contoso.com"
    }
  ],
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "version": "1.3"
}
```

この JSON は、テキスト ブロックとボタンを持つシンプルな Adaptive Card を定義しています。

<cc-end-step lab="e5" exercise="1" step="1" />

### ステップ 2: Adaptive Card をテストする

Adaptive Card をテストするには、[Adaptive Cards Designer](https://adaptivecards.microsoft.com/designer){target="_blank"} を使用できます。

1. [Adaptive Cards Designer](https://adaptivecards.microsoft.com/designer){target="_blank"} を開きます。  
2. デザイナー下部の「Card Payload Editor」セクションに JSON を貼り付けます。  
3. デザイナー上部に Adaptive Card のライブ プレビューが表示されます。  

これで Adaptive Card の開発スキルを習得できました！

<cc-end-step lab="e5" exercise="1" step="2" />

## 演習 2: エージェントの応答をリッチ化する

### ステップ 1: Adaptive Card ファイルを追加する
`getConsultants`、`getUserInformation`、`postBillhours` の各関数に視覚的に魅力的なカードを追加します。

**appPackage/adaptiveCards** フォルダーに `getConsultants.json`、`postBillhours.json`、`getUserInformation.json` の 3 つのファイルを作成します。 

以下の生ファイルの内容をコピーし、適切なファイルに貼り付けてください。

- [getConsultants.json](https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END/appPackage/adaptiveCards/getConsultants.json){target=_blank}
- [getUserInformation.json](https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END/appPackage/adaptiveCards/getUserInformation.json){target=_blank}
- [postBillhours.json](https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/src/extend-m365-copilot/path-e-lab05-add-adaptive-cards/trey-research-lab05-END/appPackage/adaptiveCards/postBillhours.json){target=_blank}

これらの JSON ファイルを開くと、カードの構造と、API 応答と接続するデータ バインディングの方法が確認できます。カード内のテンプレート式は API からの実際のデータで自動的に埋め込まれ、プレーン テキストではなく洗練されたビジュアル形式で情報を提示できます。

<cc-end-step lab="e5" exercise="2" step="1" />

### ステップ 2: プラグイン マニフェストを更新して Adaptive Card を含める

1. **appPackage/trey-plugin.json** を開きます。  
2. `getConsultants` 関数を探します。  
3. `response_semantics` 内で `properties` フィールドの後に次を追加します（スニペットのカンマも含めてください）。

```json
,
  "static_template": {
            "file": "adaptiveCards/getConsultants.json"
          }
```

変更後の **getConsultants** 関数は次のようになります。

```json
    {
      "name": "getConsultants",
      "description": "Returns detailed information about consultants identified from filters like name of the consultant, name of project, certifications, skills, roles and hours available. Multiple filters can be used in combination to refine the list of consultants returned",
      "capabilities": {
        "response_semantics": {
          "data_path": "$.results",
          "properties": {
            "title": "$.name",
            "subtitle": "$.id",
            "url": "$.consultantPhotoUrl"
          },
           "static_template": {
            "file": "adaptiveCards/getConsultants.json"
          }
        }
      }
    }
```

同様に **getUserInformation** 関数を以下で更新します。

```json
  ,
  "static_template": {
            "file": "adaptiveCards/getUserInformation.json"
          }
```

最後に **postBillhours** 関数を以下で更新します。

```json
  ,
  "static_template": {
            "file": "adaptiveCards/postBillhours.json"
          }
```

<cc-end-step lab="e5" exercise="2" step="2" />

## 演習 3: Copilot でプラグインをテストする

アプリケーションをテストする前に、`appPackage\manifest.json` ファイルでアプリ パッケージのマニフェスト バージョンを更新します。手順は次のとおりです。

1. プロジェクトの `appPackage` フォルダーにある `manifest.json` ファイルを開きます。

2. JSON 内の `version` フィールドを探します。例:  
   ```json
   "version": "1.0.1"
   ```

3. バージョン番号を小さくインクリメントします。例:  
   ```json
   "version": "1.0.2"
   ```

4. 保存します。

### ステップ 1: プラグインをインストールする

プロジェクトを停止して再起動し、アプリケーション パッケージを再デプロイさせます。  
Copilot でエージェントとの直接チャット ウィンドウが表示されます。

![Microsoft 365 Copilot で Trey Genie エージェントが動作している様子。右側にカスタム宣言型エージェントが他のエージェントと並んで表示されている。ページ中央には会話スターターとエージェントへの入力ボックスがある。](../../assets/images/extend-m365-copilot-05/run.png)

<cc-end-step lab="e5" exercise="3" step="1" />

### ステップ 2: Adaptive Card を表示する

次のようなプロンプトを試してください。

 *Find consultants with TypeScript skills*

テキスト応答だけでなく、プロジェクト情報を含むリッチ カードも返されます。  
![Copilot が生成したコンサルタント情報のカード](../../assets/images/extend-m365-copilot-05/first-prompt.png)

次に、POST 操作のプロンプトを試します。

 *please charge 1 hour to woodgrove bank in trey research*

この要求では Copilot が API プラグインに POST でデータを送信する必要があるため、*Confirm* ボタンを選択して許可を確認します。

![API プラグインにデータ送信を確認する Copilot が生成したカード](../../assets/images/extend-m365-copilot-05/bill-hours-confirm.png)

確認後、テキスト応答だけでなくプロジェクト情報を含むリッチ カードが表示されます。

![Adaptive Card に基づくリッチ コンテンツでプロジェクト状況を示すエージェントの応答](../../assets/images/extend-m365-copilot-05/bill-hours.png)

ほかのプロンプトも試して、Microsoft 365 Copilot の向上した応答を確認してみてください。

<cc-end-step lab="e5" exercise="3" step="2" />

---8<--- "ja/e-congratulations.md"

Adaptive Card 応答を最初の API プラグインに追加できました。次のラボでは、API に認証を追加します。

<cc-next url="../06a-add-authentication-ttk" label="Next" />

  
<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-m365-copilot/04-add-adaptive-card--ja" />