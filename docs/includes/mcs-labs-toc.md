<div class="cc-lab-toc mcs-path">
  <img src="/copilot-camp/assets/images/path-icons/MCS-path-heading.png"></img>
  <div>
    <p>Do these labs if you want to build agents with Microsoft Copilot Studio</p>
    <ul>
      <li><a href="/copilot-camp/pages/make/copilot-studio/00-prerequisites/">MCS0 - Setup</a></li>
      <li><a href="/copilot-camp/pages/make/copilot-studio/01-first-agent/">MCS1 - First agent</a></li>
      <li><a href="/copilot-camp/pages/make/copilot-studio/02-topics/">MCS2 - Defining Topics</a></li>
      <li><a href="/copilot-camp/pages/make/copilot-studio/03-actions/">MCS3 - Defining Tools</a></li>
      <li><a href="/copilot-camp/pages/make/copilot-studio/04-extending-m365-copilot/">MCS4 - Extending Microsoft 365 Copilot</a></li>
      <li><a href="/copilot-camp/pages/make/copilot-studio/05-connectors/">MCS5 - Consuming a custom connector</a></li>
      <li><a href="/copilot-camp/pages/make/copilot-studio/06-mcp/">MCS6 - Consuming an MCP server</a></li>
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

