<div class="cc-lab-toc mcs-path">
  <img src="/copilot-camp/assets/images/path-icons/MCS-path-heading.png"></img>
  <div>
    <p>Microsoft Copilot Studio で エージェント を構築したい場合は、次の ラボ を実施してください</p>
    <ul>
      <li><a href="/copilot-camp/ja/pages/make/copilot-studio/00-prerequisites/">MCS0 - セットアップ</a></li>
      <li><a href="/copilot-camp/ja/pages/make/copilot-studio/01-first-agent/">MCS1 - はじめての エージェント</a></li>
      <li><a href="/copilot-camp/ja/pages/make/copilot-studio/02-topics/">MCS2 - トピック の定義</a></li>
      <li><a href="/copilot-camp/ja/pages/make/copilot-studio/03-actions/">MCS3 - ツール の定義</a></li>
      <li><a href="/copilot-camp/ja/pages/make/copilot-studio/04-extending-m365-copilot/">MCS4 - Microsoft 365 Copilot を拡張する</a></li>
      <li><a href="/copilot-camp/ja/pages/make/copilot-studio/05-connectors/">MCS5 - カスタム コネクター の利用</a></li>
      <li><a href="/copilot-camp/ja/pages/make/copilot-studio/06-mcp/">MCS6 - MCP サーバー の利用</a></li>
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