<div class="cc-lab-toc msa-path">
  <img src="/copilot-camp/assets/images/path-icons/MSA-path-heading.png"></img>
  <div>
    <p>SharePoint エージェントを作成したい場合は、以下の ラボ を実施してください</p>
    <ul>
      <li><a href="/copilot-camp/pages/make/sharepoint-agents/01-first-agent/">MSA1 - はじめての SharePoint エージェントを構築する</a></li>
      <li><a href="/copilot-camp/pages/make/sharepoint-agents/02-sharing-agents/">MSA2 - SharePoint エージェントを共有する</a></li>
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