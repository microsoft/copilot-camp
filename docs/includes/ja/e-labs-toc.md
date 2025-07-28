<div class="cc-lab-toc e-path">
    <img src="/copilot-camp/assets/images/path-icons/E-path-heading.png"></img>
    <div>
        <p>Microsoft&nbsp;365 が AI モデルとオーケストレーションを提供する Declarative エージェントを構築したい場合は、これらの ラボ を実施してください</p>
        <ul id="lab-toc">
            <li><strong><a href="/copilot-camp/pages/extend-m365-copilot/index">🏁 ようこそ</a></strong></li>
            <li><strong>🔧 セットアップ</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/00-prerequisites">ラボ&nbsp;E0&nbsp;-&nbsp;セットアップ</a></li>
                </ul>
            </li>
            <li><strong>🧰 Declarative エージェントの基本</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/01-typespec-declarative-agent">ラボ&nbsp;E1&nbsp;-&nbsp;詳細な Declarative エージェントを構築する</a>
                    </li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/01a-geolocator">ラボ&nbsp;E1a&nbsp;-&nbsp;Geo ロケーターゲーム</a></li>
                </ul>
            </li>
            <li><strong>🛠️ API をゼロから構築して統合する</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/02-build-the-api">ラボ&nbsp;E2&nbsp;-&nbsp;API を構築する</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/03-add-declarative-agent">ラボ&nbsp;E3&nbsp;-&nbsp;Declarative エージェント + API を追加する</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/04-enhance-api-plugin">ラボ&nbsp;E4&nbsp;-&nbsp;API + プラグインを強化する</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/05-add-adaptive-card">ラボ&nbsp;E5&nbsp;-&nbsp;Adaptive Card を追加する</a></li>
                </ul>
            </li>
            <li><strong>🔐 認証</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/06a-add-authentication-ttk">ラボ&nbsp;E6a&nbsp;-&nbsp;Toolkit</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/06b-add-authentication">ラボ&nbsp;E6b&nbsp;-&nbsp;手動</a></li>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/06c-add-sso">ラボ&nbsp;E6c&nbsp;-&nbsp;SSO</a></li>
                </ul>
            </li>
            <li><strong>🔌 統合</strong>
                <ul>
                    <li><a href="/copilot-camp/pages/extend-m365-copilot/07-add-graphconnector">ラボ&nbsp;EB&nbsp;-&nbsp;Graph Connector を追加する</a></li>
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