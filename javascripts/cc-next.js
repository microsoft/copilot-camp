(() => {

    // Web controls for Copilot Developer Camp lab navigation

    //#region CSS
    function ensureCss() {

        const css = `
            .github-button {
                display: inline-block;
                padding: 6px 12px;
                margin: 10px 0;
                font-size: 14px;
                font-weight: 600;
                color: #fff;
                background-color: #28a745;
                border-radius: 5px;
                text-decoration: none;
                text-align: center;
                border: 1px solid rgba(27, 31, 35, .15);
                box-shadow: 0 1px 0 rgba(27, 31, 35, .04), inset 0 1px 0 hsla(0, 0%, 100%, .25);
                cursor: pointer;
                transition: background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            }

            .github-button:hover {
                background-color: #218838;
                border-color: rgba(27, 31, 35, .15);
            }

            .github-button:disabled {
                background-color: #94d3a2;
                border-color: rgba(27, 31, 35, .15);
                cursor: not-allowed;
            }
        `;
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        document.adoptedStyleSheets = [sheet];
    };
    //#endregion

    // This web component goes at the end of a step in a lab to track completion
    class Next extends HTMLElement {

        #url;        // Next lab URL if not calculated from navigation
        #label;      // Button text

        #containerElement; // Div container

        constructor() {
            super();

            this.#label = this.getAttribute('label') || 'Next';
            this.#url = this.getAttribute('url') || this.#getNextUrlByNavigation();

            ensureCss();

            if (this.#url) {
                this.#containerElement = document.createElement('div');

                const nextButton = document.createElement('button');
                nextButton.textContent = this.#label;
                nextButton.className = 'github-button';
                nextButton.onclick = this.#clickHandler;
                this.#containerElement.appendChild(nextButton);

                this.replaceChildren(this.#containerElement);
            }
        }

        // Button click event handler
        #clickHandler(e) {
            if (this.#url) {
                window.location.href = this.#url;
            }
        }

        #getNextUrlByNavigation() {
            // Get the active navigation item
            const navInner = document.querySelector('.md-nav--primary');
            const navUls = navInner.querySelector('ul.md-nav__list');
            const activelistItem = Array.from(navUls.children).filter(child => child.classList.contains('md-nav__item--active'))[0];

            if (!activelistItem) {
                return;
            }
            const activeNav = activelistItem.querySelector('ul.md-nav__list');

            // Get the next URL
            const items = activeNav.querySelectorAll('li');
            let currentIndex = -1
            for (let i = 0; i < items.length; i++) {
                if (items[i].classList.contains('md-nav__item--active')) {
                    currentIndex = i;
                    break;
                }
            }

            const navItems = Array.from(activeNav.children).map(child => child.querySelector('a'));
            if (currentIndex !== -1 && currentIndex < navItems.length - 1) {
                const nextUrl = navItems[currentIndex + 1].getAttribute('href');
                return nextUrl;
            } else {
                return null;
            }
        }

        // Run when the element is added to the DOM
        async connectedCallback() {
            this.onclick = this.#clickHandler;
        }
    }
    //#endregion

    document.addEventListener('DOMContentLoaded', function () {
        window.customElements.define('cc-next', Next);
    });

})();