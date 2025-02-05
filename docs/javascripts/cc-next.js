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

    //#region cc-next web component

    // This web component goes at the end of a step in a lab to track completion
    class NextButton extends HTMLElement {

        url;        // Next lab URL if not calculated from navigation
        label;      // Button text

        #containerElement; // Div container

        constructor() {
            super();

            this.url = this.getAttribute('url');
            this.label = this.getAttribute('label');

            ensureCss();

            this.#containerElement = document.createElement('div');
            // this.#containerElement.className = 'cc-end-step';

            const checkBoxElement = document.createElement('input');
            checkBoxElement.setAttribute('type', 'checkbox');
            checkBoxElement.checked =
                this.#getStepStatus(this.lab, this.exercise, this.step) === 'true';
            this.checked = checkBoxElement.checked;
            checkBoxElement.id = `ex-${this.exercise}-step-${this.step}`;
            this.#containerElement.appendChild(checkBoxElement);

            const labelElement = document.createElement('label');
            labelElement.innerText = ` End of Exercise ${this.exercise}, ${this.#getSectionLabelAndUpdateHeader()}`;
            this.#containerElement.appendChild(labelElement);

            const breakElement = document.createElement('br');
            this.#containerElement.appendChild(breakElement);

            this.#subLabelElement = document.createElement('label');
            this.#subLabelElement.className = 'subtext';
            this.#subLabelElement.innerText = this.#getSubtext();
            this.#containerElement.appendChild(this.#subLabelElement);

            this.replaceChildren(this.#containerElement);
        }

        // Checkbox click event handler
        #clickHandler(e) {
            this.checked = e.target.checked;
            this.#setStepStatus(this.lab, this.exercise, this.step, this.checked);
            this.#getSectionLabelAndUpdateHeader();
            this.#changeListeners.forEach(listener => listener());
            this.#subLabelElement.innerText = this.#getSubtext();
            this.#updateTelemetry(this.lab, this.exercise, this.step);
        }

        // Run when the element is added to the DOM
        async connectedCallback() {
            this.onclick = this.#clickHandler;
        }

        // onChange event handler
        #changeListeners = [];
        set onChange(value) {
            this.#changeListeners.push(value);
        }

        // Finds the section header text, adds a checkbox if needed, and returns
        // the section header text
        #getSectionLabelAndUpdateHeader() {
            let elt = this.previousSibling?.parentElement || this.parentElement;
            while (elt && elt.tagName !== 'H3') {
                elt = elt.previousElementSibling;
            }
            if (elt) {
                this.label = elt.innerText.replace('✔', '').trim();
                if (this.checked) {
                    elt.innerText = '✔ ' + this.label;
                } else {
                    elt.innerText = this.label;
                }
                return this.label;
            }
            return ''
        }

        // Subtext generator
        #getSubtext() {
            if (this.checked) {
                switch (this.step) {
                    case '1':
                        return 'Great start! Now move on to the next step.';
                    case '2':
                        return 'Good job, keep going!';
                    case '3':
                        return 'Nice one!';
                    case '4':
                        return 'Well done!';
                    case '5':
                        return 'Alright, you did it!';
                    case '6':
                        return 'Keep up the good work!';
                    case '7':
                        return 'Woo-hoo!!';
                    case '8':
                        return 'Can you believe this exercise has so many steps?';
                    case '9':
                        return 'Nine steps was a lot but you did it!';
                    default:
                        return `Congratulations!`;
                }
            } else {
                return 'Check the box when you have completed this step.';
            }
        }

        // Telemetry
        #telemetrySent = false; // True if telemetry has been sent
        #updateTelemetry(lab, exercise, step) {
            if (this.checked && !this.#telemetrySent) {
                const url = `https://pnptelemetry.azurewebsites.net/copilot-camp/completed-lab-${lab}-ex-${exercise}-step-${step}`;
                const img = new Image();
                img.src = url;
                this.#containerElement.appendChild(img);
                this.#telemetrySent = true;
            }
        }

        // Storage functions
        #getStepStatus(lab, exercise, step) {
            return localStorage.getItem(`step-${lab}-${exercise}-${step}`);
        }

        #setStepStatus(lab, exercise, step, status) {
            localStorage.setItem(`step-${lab}-${exercise}-${step}`, status);
        }
    }
    //#endregion

    //#region Base class for components that update when steps are checked

    class UpdatingComponent extends HTMLElement {

        constructor(updateUI) {
            super();

            const elts = document.querySelectorAll('cc-end-step');
            for (let elt of elts) {
                elt.onChange = updateUI.bind(this);
            }

            // this.attachShadow({mode: 'open'});
        }
    }

    //#endregion

    //#region cc-last-completed-step web component

    class LastCompletedStep extends UpdatingComponent {

        anchorElement; // HTML element to display the last completed step

        constructor() {
            super(() => {
                this.#updateText();
            });

            this.anchorElement = document.createElement('a');
            this.anchorElement.className = 'cc-last-completed-step';
            this.replaceChildren(this.anchorElement);
            this.#updateText();
        }

        #updateText() {
            if (this.anchorElement) {
                let lastCompletedExercise = 0;
                let lastCompletedStep = 0;
                let lastCompletedStepTitle = '';
                const elts = document.querySelectorAll('cc-end-step');
                for (let elt of elts) {
                    if (elt.checked) {
                        lastCompletedExercise = elt.exercise;
                        lastCompletedStep = elt.step;
                        lastCompletedStepTitle = elt.label;
                    }
                }
                if (lastCompletedExercise === 0) {
                    this.anchorElement.innerText = 'You have not completed any steps in this lab.\nUse the ☑ checkbox on each step to track your progress.';
                    this.anchorElement.href = '#';
                    this.anchorElement.style = 'pointer-events: none; color: black;';
                } else {
                    this.anchorElement.innerText = `✔ Exercise ${lastCompletedExercise}: ${lastCompletedStepTitle}`;
                    this.anchorElement.href = `#ex-${lastCompletedExercise}-step-${lastCompletedStep}`;
                    this.anchorElement.style = '';
                }
            }
        }
    }

    //#endregion

    //#region cc-table-of-contents web component

    class TableOfContents extends UpdatingComponent {

        containerElement; // HTML element to display the table of contents
        listElement;      // Unordered list element

        constructor() {
            super(() => {
                this.#updateToc();
            });

            this.containerElement = document.createElement('div');
            this.containerElement.className = 'cc-table-of-contents';
            this.replaceChildren(this.containerElement);

            this.listElement = document.createElement('ul');
            this.containerElement.appendChild(this.listElement);

            this.#updateToc();
        }

        #updateToc() {
            if (this.listElement) {

                this.listElement.innerHTML = '';

                const exerciseElements = document.querySelectorAll('h2');
                const endStepElements = document.querySelectorAll('cc-end-step');
                let exerciseNumber = 1;

                for (let elt of exerciseElements) {
                    if (elt.innerText.startsWith('Exercise')) {
                        const li = document.createElement('li');
                        const a = document.createElement('a');

                        a.href = this.#getFragment(elt.innerText);
                        a.innerText = elt.innerText;
                        li.appendChild(a);
                        li.appendChild(this.#getListForSteps(endStepElements, exerciseNumber++));
                        this.listElement.appendChild(li);
                    }
                }


            }
        }

        #getListForSteps(stepElements, exercise) {
            const result = document.createElement('ul');

            for (let elt of stepElements) {
                if (elt.exercise == exercise) {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = this.#getFragment(elt.label);
                    const checkmark = elt.checked ? '✔ ' : '\u00A0\u00A0\u00A0\u00A0';
                    a.innerText = `${checkmark} ${elt.label}`;
                    li.appendChild(a);
                    result.appendChild(li);
                }
            }

            return result;
        }

        #getFragment(innerText) {
            // mkdocs sets the id of each h2 or h3 element to the kabab case of the text
            return '#' +
                   innerText.toLowerCase()
                            .replace(/[.,\/#!$%\^&\*;:{}?=\-_`~()]/g,'')
                            .replace(/ /g, '-');
        }
    }

    //#endregion

    document.addEventListener('DOMContentLoaded', function () {
        window.customElements.define('cc-end-step', LabEndStep);
        window.customElements.define('cc-last-completed-step', LastCompletedStep);
        window.customElements.define('cc-table-of-contents', TableOfContents);
    });

})();