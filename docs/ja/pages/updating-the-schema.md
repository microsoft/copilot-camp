---
search:
  exclude: true
---
# Manifest スキーマの更新

 2024 年 10 月 27 日より前に「 Extend 」パスのラボを開始している場合、開発者プレビューのスキーマを使用している可能性があります。新しいサポート対象スキーマ  v1.19  が公開され、すべてのプレビュー アプリは更新が必要です。新しいスキーマは Copilot エージェントの新しい命名規則も反映しています。

プロジェクトを更新するには、 **appPackage/manifest.json** ファイルを開きます。

まず、最初の 2 行を次のように置き換えます:

~~~json
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.19/MicrosoftTeams.schema.json",
  "manifestVersion": "1.19",
~~~

 **manifest.json** ファイルに `packageName` プロパティがある場合は、不要かつサポートされていないため削除してください。

~~~json
  "packageName": "com.microsoft.teams.extension",
~~~

次に、 `copilotExtensions` プロパティを次の内容に置き換えます:

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

最後に、ラボの手順に合わせて **trey-declarative-copilot.json** を **trey-declarative-agent.json** にリネームします。