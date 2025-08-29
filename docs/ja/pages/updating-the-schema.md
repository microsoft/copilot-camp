---
search:
  exclude: true
---
# マニフェスト スキーマの更新

2024 年 10 月 27 日より前に「Extend」パスのラボを開始している場合、開発者プレビュー スキーマを使用している可能性があります。現在、サポート対象のスキーマ  v1.19  が提供されており、すべてのプレビュー アプリケーションは更新が必要です。新しいスキーマには、Copilot エージェントの新しい命名規則も反映されています。

プロジェクトを更新するには、 **appPackage/manifest.json** ファイルを開きます。

まず、最初の 2 行を次の内容で置き換えます。

~~~json
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.19/MicrosoftTeams.schema.json",
  "manifestVersion": "1.19",
~~~

**manifest.json** ファイルに次のような `packageName` プロパティがある場合は、不要でサポートされていないため削除してください。

~~~json
  "packageName": "com.microsoft.teams.extension",
~~~

次に、`copilotExtensions` プロパティを次の内容に置き換えます。

~~~json
  "copilotAgents": {
    "declarativeAgents": [
      {
        "id": "treygenie",
        "file": "trey-declarative-agent.json"
      }
    ]   
  }, 
~~~

最後に、ラボの手順に合わせるため、 **trey-declarative-copilot.json** を **trey-declarative-agent.json** に名前変更します。