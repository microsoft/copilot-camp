<div class="cc-lab-toc cwrk-path">
  <img src="/copilot-camp/assets/images/path-icons/CWRK-path-heading.png"></img>
  <div>
    <p>Do these labs if you want to extend Copilot Cowork</p>
    <ul>
      <li><a href="/copilot-camp/pages/copilot-cowork/00-cowork-setup/">CWRK0 - Setup and extensibility</a></li>
      <li><a href="/copilot-camp/pages/copilot-cowork/01-cowork-skills/">CWRK1 - Build your first Skill</a></li>
      <li><a href="/copilot-camp/pages/copilot-cowork/02-cowork-plugins/">CWRK2 - Build your first Plugin</a></li>
       <li><a href="/copilot-camp/pages/copilot-cowork/03-cowork-plugins-sso/">CWRK3 - Add Entra SSO Authentication to a Cowork Plugin</a></li>
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

