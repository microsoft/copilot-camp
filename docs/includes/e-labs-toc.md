<div class="cc-lab-toc e-path">
    <img src="/copilot-camp/assets/images/path-icons/E-path-heading.png"></img>
    <div>
        <p>Do these labs if you want to build a Declarative agent where Microsoft 365 provides the AI model and
            orchestration</p>
        <ul id="lab-toc">
            <li><strong><a href="/copilot-camp/pages/extend-m365-copilot/index">🏁 Welcome</a></strong></li>
            <li><strong><a href="/copilot-camp/pages/extend-m365-copilot/bundles">🧩 Bundle overview</a></strong></li>
            <li><strong>🚦 Mandatory on-ramp</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/01-first-agent-new">Lab E1 - Choose Foundation Path</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/01-first-agent-builder">Lab E1A - Declarative Agent Foundation with Agent Builder</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/01-first-agent-toolkit">Lab E1B - Declarative Agent Foundation with Agents Toolkit</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/00-prerequisites">Lab E0 - Prerequisites for Pro-code bundles</a></li>
                </ul>
            </li>
            <li><strong>🔌 Bundle A - MCP Foundations</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/bundle-a">Start Bundle A</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/08-mcp-server">Lab E8 - Connect Declarative agent to MCP Server</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/10-mcp-auth">Lab E10 - Connect Declarative Agent to OAuth-Protected MCP Server</a></li>
                </ul>
            </li>
            <li><strong>🕸️ Bundle B - Multi-Agent Workflows in Copilot</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/bundle-b">Start Bundle B</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/09-connected-agent">Lab E9 - Connected Agents</a></li>
                </ul>
            </li>
            <li><strong>🖼️ Bundle C - MCP App</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/bundle-c">Start Bundle C</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/11-mcp-app">Lab E11 - Build an MCP App with Interactive Widgets</a></li>
                </ul>
            </li>
            <li><strong>🧭 Bundle D - API-Based Declarative Agent</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/bundle-d">Start Bundle D</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/02-build-the-api">Lab E2 - Build a Backend API</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/03-add-declarative-agent">Lab E3 - Add Declarative Agent and API Plugin</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/04-enhance-api-plugin">Lab E4 - Enhance API and Plugin</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/05-add-adaptive-card">Lab E5 - Add Adaptive Cards</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/06a-add-authentication-ttk">Lab E6a - Add Entra ID Authentication</a></li>
                </ul>
            </li>
            <li><strong>🔗 Bundle E - DA with Connectors</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/bundle-e">Start Bundle E</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/07-add-graphconnector">Lab E7 - Add Copilot Connector</a></li>
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