---
search:
  exclude: true
---
# マニフェストスキーマの更新

もし 2024年10月27日 以前に "Extend" パスのラボをご開始された場合、開発者プレビューのスキーマをご使用になっている可能性があります。新しくサポートされるスキーマ v1.19 が利用可能となり、すべてのプレビューアプリケーションを更新する必要があります。Copilot エージェントの名称も新しくなっています。

プロジェクトを更新するには、**appPackage/manifest.json** ファイルを開いてください。

最初に、最初の 2 行を次の内容に置き換えてください:

~~~json
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.19/MicrosoftTeams.schema.json",
  "manifestVersion": "1.19",
~~~

もし **manifest.json** ファイル内にこのような `packageName` プロパティが存在する場合、もはや必要なくサポートされていないため、削除してください。

~~~json
  "packageName": "com.microsoft.teams.extension",
~~~

次に、`copilotExtensions` プロパティを次の内容に置き換えてください:

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

最後に、ラボの指示に合わせるため、**trey-declarative-copilot.json** の名前を **trey-declarative-agent.json** に変更してください。