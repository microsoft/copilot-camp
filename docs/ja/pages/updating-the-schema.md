---
search:
  exclude: true
---
# Manifest スキーマの更新

2024 年 10 月 27 日以前に "Extend" パスのラボを開始している場合、開発者プレビュー スキーマを使用している可能性があります。サポート対象となる新しいスキーマ v 1.19 が公開されたため、すべてのプレビュー アプリケーションは更新が必要です。また、この新しいスキーマでは Copilot エージェントの新しい名前付けも反映されています。

プロジェクトを更新するには、 **appPackage/manifest.json** ファイルを開きます。

まず、先頭 2 行を次の内容に置き換えます。

~~~json
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.19/MicrosoftTeams.schema.json",
  "manifestVersion": "1.19",
~~~

manifest.json ファイルに次のような `packageName` プロパティがある場合は、不要になりサポートされなくなったため削除してください。

~~~json
  "packageName": "com.microsoft.teams.extension",
~~~

続いて、 `copilotExtensions` プロパティを次の内容に置き換えます:

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