<div class="cc-lab-toc e-path">
    <img src="/copilot-camp/assets/images/path-icons/E-path-heading.png"></img>
    <div>
        <p>Do these labs if you want to build a Declarative agent where Microsoft 365 provides the AI model and
            orchestration</p>
        <ul id="lab-toc">
            <li><strong><a href="/copilot-camp/pages/extend-m365-copilot/index">🏁 Welcome</a></strong></li>
            <li><strong>🔧 Set up</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/00-prerequisites">Lab E0 - Setup</a></li>
                </ul>
            </li>
            <li><strong>🧰 Declarative agent fundamentals</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/01-typespec-declarative-agent"> Lab E1 - Build a  Declarative Agent using TypeSpec</a>
                    </li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/01a-geolocator"> Lab E1a - Geo locator game</a></li>
                </ul>
            </li>
            <li><strong>🛠️ Build and integrate API from scratch</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/02-build-the-api">Lab E2 - Build an API</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/03-add-declarative-agent"> Lab E3 - Add Declarative Agent + API</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/04-enhance-api-plugin"> Lab E4 - Enhance API + Plugin</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/05-add-adaptive-card">Lab E5 - Add Adaptive Cards</a></li>
                     <li><a href="/copilot-camp/pages/extend-m365-copilot/06a-add-authentication-ttk"> Lab E6a - Add Authentication</a></li>
                </ul>
            </li>       
            <li><strong>🔌 Integration</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/07-add-graphconnector"> Lab E7 - Add Copilot Connector</a></li>
                </ul>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/08-mcp-server"> Lab E8 - Connect Declarative agent to MCP Server</a></li>
                </ul>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/09-connected-agent"> Lab E9 - Connected Agents</a></li>
                </ul>
                 <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/10-mcp-auth"> Lab 10: Connect Declarative Agent to OAuth-Protected MCP Server</a></li>
                </ul>
            </li>
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
        if (anchor) {            // Get the last segment of the current URL path
            const currentPath = window.location.pathname.slice(0, -1).split('/').pop();

            // Get the last segment of the link path
            const linkPath = anchor.getAttribute('href').split('/').pop().replace('.md', '');

            // Compare the last segments
            if (currentPath === linkPath) {
                const existingSpan = document.querySelector('span.you-are-here');
                if (existingSpan) {
                    existingSpan.remove();
                }
                const span = document.createElement("span");
                span.innerHTML = "YOU&nbsp;ARE&nbsp;HERE";
                span.className = "you-are-here";
                li.appendChild(span);
            }
        }
    }
}
})();
</script>