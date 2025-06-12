<div class="cc-lab-toc msa-path">
  <img src="/copilot-camp/assets/images/path-icons/MSA-path-heading.png"></img>
  <div>
    <p>Do these labs if you want to build a SharePoint agent</p>
    <ul>
      <li><a href="/copilot-camp/pages/make/sharepoint-agents/01-first-agent/">MSA1 - Build your first SharePoint agent</a></li>
      <li><a href="/copilot-camp/pages/make/sharepoint-agents/02-sharing-agents/">MSA2 - Sharing SharePoint agents in Microsoft Teams</a></li>
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

