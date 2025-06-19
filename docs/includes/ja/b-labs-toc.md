<div class="cc-lab-toc b-path">
  <img src="/copilot-camp/assets/images/path-icons/B-path-heading.png"></img>
  <div>
    <p>Azure OpenAI と Teams AI ライブラリを使用してカスタム AI モデルとオーケストレーションを備えたカスタム エンジン エージェントを構築したい場合は、これらのラボを実施してください。</p>
    <ul>
      <li><a href="/copilot-camp/ja/pages/custom-engine/teams-ai/00-prerequisites/">BTA0 - セットアップ</a></li>
      <li><a href="/copilot-camp/ja/pages/custom-engine/teams-ai/01-custom-engine-agent/">BTA1 - 最初のカスタム エンジン エージェント</a></li>
      <li><a href="/copilot-camp/ja/pages/custom-engine/teams-ai/02-rag/">BTA2 - Azure AI Search にデータをインデックス化</a></li>
      <li><a href="/copilot-camp/ja/pages/custom-engine/teams-ai/03-powered-by-ai/">BTA3 - ユーザー エクスペリエンスを強化</a></li>
      <li><a href="/copilot-camp/ja/pages/custom-engine/teams-ai/04-authentication/">BTA4 - シングル サインオン認証を追加</a></li>
      <li><a href="/copilot-camp/ja/pages/custom-engine/teams-ai/05-actions/">BTA5 - 複雑なタスクを処理する actions を追加</a></li>
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