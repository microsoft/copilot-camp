(() => {

    // Web component for reusable card blocks that users can click to navigate

    //#region cc-card web component

    // This web component creates a clickable card with title, description, and optional image
    class ClickableCard extends HTMLElement {

        title;          // Card title
        description;    // Card description
        href;           // Link destination
        image;          // Optional image URL
        target;         // Link target (_blank, _self, etc.)
        className;      // Additional CSS classes

        #cardElement;   // Main card container
        #linkElement;   // Anchor element for clickability

        constructor() {
            super();

            // Get attributes
            this.title = this.getAttribute('title') || 'Card Title';
            this.description = this.getAttribute('description') || 'Card description';
            this.href = this.getAttribute('href') || '#';
            this.image = this.getAttribute('image');
            this.target = this.getAttribute('target') || '_blank';
            this.className = this.getAttribute('class') || '';

            // Create the card structure
            this.#createCard();
        }

        #createCard() {
            // Create the main link element
            this.#linkElement = document.createElement('a');
            this.#linkElement.href = this.href;
            this.#linkElement.target = this.target;
            this.#linkElement.className = 'cc-card-link';

            // Create the card container
            this.#cardElement = document.createElement('div');
            this.#cardElement.className = `cc-card ${this.className}`;

            // Add image if provided
            if (this.image) {
                const imageElement = document.createElement('img');
                imageElement.src = this.image;
                imageElement.alt = this.title;
                imageElement.className = 'cc-card-image';
                this.#cardElement.appendChild(imageElement);
            }

            // Create content container
            const contentElement = document.createElement('div');
            contentElement.className = 'cc-card-content';

            // Add title
            const titleElement = document.createElement('h3');
            titleElement.className = 'cc-card-title';
            titleElement.textContent = this.title;
            contentElement.appendChild(titleElement);

            // Add description
            const descriptionElement = document.createElement('p');
            descriptionElement.className = 'cc-card-description';
            descriptionElement.textContent = this.description;
            contentElement.appendChild(descriptionElement);

            this.#cardElement.appendChild(contentElement);
            this.#linkElement.appendChild(this.#cardElement);

            // Add hover and click effects
            this.#addInteractions();

            // Replace the element's content with the card
            this.replaceChildren(this.#linkElement);
        }

        #addInteractions() {
            // Add keyboard navigation support
            this.#linkElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.#linkElement.click();
                }
            });

            // Add visual feedback on interaction
            this.#linkElement.addEventListener('mouseenter', () => {
                this.#cardElement.classList.add('cc-card-hover');
            });

            this.#linkElement.addEventListener('mouseleave', () => {
                this.#cardElement.classList.remove('cc-card-hover');
            });

            this.#linkElement.addEventListener('focus', () => {
                this.#cardElement.classList.add('cc-card-focus');
            });

            this.#linkElement.addEventListener('blur', () => {
                this.#cardElement.classList.remove('cc-card-focus');
            });
        }

        // Method to update card content dynamically
        updateCard(options = {}) {
            if (options.title) {
                this.title = options.title;
                this.querySelector('.cc-card-title').textContent = options.title;
            }
            if (options.description) {
                this.description = options.description;
                this.querySelector('.cc-card-description').textContent = options.description;
            }
            if (options.href) {
                this.href = options.href;
                this.#linkElement.href = options.href;
            }
            if (options.image) {
                this.image = options.image;
                const existingImage = this.querySelector('.cc-card-image');
                if (existingImage) {
                    existingImage.src = options.image;
                } else {
                    // Create new image element
                    const imageElement = document.createElement('img');
                    imageElement.src = options.image;
                    imageElement.alt = this.title;
                    imageElement.className = 'cc-card-image';
                    this.#cardElement.insertBefore(imageElement, this.#cardElement.firstChild);
                }
            }
        }
    }

    // Register the custom element
    customElements.define('cc-card', ClickableCard);

    //#endregion cc-card web component

    //#region cc-card-grid web component

    // This web component creates a grid container for multiple cards
    class CardGrid extends HTMLElement {

        columns;        // Number of columns (optional, defaults to auto-fit)
        gap;            // Grid gap (optional, defaults to 1rem)

        constructor() {
            super();

            this.columns = this.getAttribute('columns');
            this.gap = this.getAttribute('gap') || '1rem';

            // Create the grid container
            this.#createGrid();
        }

        #createGrid() {
            const gridElement = document.createElement('div');
            gridElement.className = 'cc-card-grid';

            // Apply grid styles
            if (this.columns) {
                gridElement.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
            } else {
                gridElement.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
            }
            gridElement.style.gap = this.gap;

            // Move all existing children to the grid
            while (this.firstChild) {
                gridElement.appendChild(this.firstChild);
            }

            this.appendChild(gridElement);
        }
    }

    // Register the custom element
    customElements.define('cc-card-grid', CardGrid);

    //#endregion cc-card-grid web component

})();
