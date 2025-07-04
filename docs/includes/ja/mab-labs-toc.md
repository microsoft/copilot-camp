<div class="cc-lab-toc mab-path">
  <img src="/copilot-camp/assets/images/path-icons/MAB-path-heading.png"></img>
  <div>
    <p>Copilot Studio agent builder で宣言型エージェントを作成したい場合は、次の ラボ を実施してください</p>
    <ul>
      <li><a href="/copilot-camp/ja/pages/make/agent-builder/01-first-agent/">MAB1 - 最初のエージェントを構築する</a></li>
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