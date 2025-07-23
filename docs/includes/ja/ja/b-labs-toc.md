<div class="cc-lab-toc b-path">
  <img src="/copilot-camp/assets/images/path-icons/B-path-heading.png"></img>
  <div>
    <p>Azure OpenAI と Teams AI ライブラリを使用して、カスタム AI モデルとオーケストレーションを備えた Custom エンジン エージェントを構築したい場合は、次のラボを実施してください。</p>
    <ul>
      <li><a href="/copilot-camp/pages/custom-engine/teams-ai/00-prerequisites/">BTA0 - セットアップ</a></li>
      <li><a href="/copilot-camp/pages/custom-engine/teams-ai/01-custom-engine-agent/">BTA1 - 最初のカスタムエンジン エージェント</a></li>
      <li><a href="/copilot-camp/pages/custom-engine/teams-ai/02-rag/">BTA2 - Azure AI Search にデータをインデックスする</a></li>
      <li><a href="/copilot-camp/pages/custom-engine/teams-ai/03-powered-by-ai/">BTA3 - ユーザー エクスペリエンスを向上させる</a></li>
      <li><a href="/copilot-camp/pages/custom-engine/teams-ai/04-authentication/">BTA4 - シングルサインオン認証を追加する</a></li>
      <li><a href="/copilot-camp/pages/custom-engine/teams-ai/05-actions/">BTA5 - 複雑なタスクを処理するアクションを追加する</a></li>
    </ul>
  </div>
</div>

<script>
(() => {
// This script decorates the table of contents with a "you are here" indicator.
const toc = document.getElementsByClassName('cc-lab-toc');
for (const div of toc) {
    const lis = div.querySelectorAll('li');
    for (const li of lis) {
        const anchor = li.querySelector('a');
        if (location.href.includes(anchor.href)) {
            const span = document.createElement("span");
            span.innerHTML = "YOU&nbsp;ARE&nbsp;HERE";
            li.appendChild(span);
        }
    }    
}
})();
</script>