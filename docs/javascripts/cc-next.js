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

            //ensureCss();

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
            // Recursive function to find all links in a navigation item
            const getAllLinks = (element) => {
                const links = [];
                const allLinks = element.querySelectorAll('a');
                allLinks.forEach(link => {
                    if (link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
                        links.push(link);
                    }
                });
                return links;
            };

            // Get the active navigation section
            const navInner = document.querySelector('.md-nav--primary');
            const links = getAllLinks(navInner);
            
            // Find current link in the flattened list
            const currentPath = window.location.pathname;
            const currentIndex = links.findIndex(link => {
                const linkPath = new URL(link.href).pathname;
                return linkPath === currentPath;
            });

            // Return the next URL if it exists
            if (currentIndex !== -1 && currentIndex < links.length - 1) {
                return links[currentIndex + 1].getAttribute('href');
            }
            
            return null;
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