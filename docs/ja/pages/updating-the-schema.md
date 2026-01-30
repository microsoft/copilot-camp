---
search:
  exclude: true
---
# マニフェスト スキーマの更新

2024 年 10 月 27 日以前に「Extend」パスのラボを開始していた場合、開発者プレビュー スキーマを使用している可能性があります。サポート対象となる新しいスキーマ v1.19 が利用可能になったため、すべてのプレビュー アプリケーションを更新する必要があります。新しいスキーマでは、新しい Copilot エージェントの命名規則も反映されています。

プロジェクトを更新するには、 **appPackage/manifest.json** ファイルを開きます。

まず、先頭 2 行を次の内容に置き換えます。

~~~json
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.19/MicrosoftTeams.schema.json",
  "manifestVersion": "1.19",
~~~

**manifest.json** ファイルに次のような `packageName` プロパティがある場合は、不要かつサポート対象外のため削除してください。

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

最後に、ラボの手順に合わせて **trey-declarative-copilot.json** を **trey-declarative-agent.json** にリネームします。