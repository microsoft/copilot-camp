<div class="cc-lab-toc mcs-path">
  <img src="/copilot-camp/assets/images/path-icons/MCS-path-heading.png"></img>
  <div>
    <p>Microsoft Copilot Studio で エージェント を構築したい場合は、次の ラボ を実施してください</p>
    <ul>
      <li><a href="/copilot-camp/ja/pages/make/copilot-studio/00-prerequisites/">MCS0 - セットアップ</a></li>
      <li><a href="/copilot-camp/ja/pages/make/copilot-studio/01-first-agent/">MCS1 - 最初の エージェント</a></li>
      <li><a href="/copilot-camp/ja/pages/make/copilot-studio/02-topics/">MCS2 - トピックの定義</a></li>
      <li><a href="/copilot-camp/ja/pages/make/copilot-studio/03-actions/">MCS3 - ツールの定義</a></li>
      <li><a href="/copilot-camp/ja/pages/make/copilot-studio/04-extending-m365-copilot/">MCS4 - Microsoft 365 Copilot の拡張</a></li>
      <li><a href="/copilot-camp/ja/pages/make/copilot-studio/05-connectors/">MCS5 - カスタム コネクターの利用</a></li>
      <!-- <li><a href="/copilot-camp/pages/make/copilot-studio/06-mcp/">MCS6 - Consuming an MCP server</a></li> -->
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
            span.innerHTML = "現在&nbsp;表示中";
            li.appendChild(span);
        }
    }    
}
})();
</script>
