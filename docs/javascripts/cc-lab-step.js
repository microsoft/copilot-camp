(() => {

    function ensureCss() {

        const css = `
            .lab-end-step {
                background-color: gray;
                color: white;
                padding: 4pt;
            }
            .lab-end-step input[type=checkbox] {
                -ms-transform: scale(1.5);  /* IE */
                -moz-transform: scale(1.5); /* FF */
                -webkit-transform: scale(1.5); /* Safari and Chrome */
                -o-transform: scale(1.5);  /* Opera */
                transform: scale(1.5);
            }
            h3 {
                border-top: 4px solid gray;
                border-bottom: 4px solid gray;
            }      
        `;
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        document.adoptedStyleSheets = [sheet];
    };


    // cc-lab-end-step web component
    class LabEndStep extends HTMLElement {

        checked;
        lab;
        exercise;
        step;
        label;

        constructor() {
            super();

            this.lab = this.getAttribute('lab');
            this.exercise = this.getAttribute('exercise');
            this.step = this.getAttribute('step');

            ensureCss();

            // Build out child elements
            let containerElement = document.createElement('div');
            containerElement.className = 'lab-end-step';

            const checkBoxElement = document.createElement('input');
            checkBoxElement.setAttribute('type', 'checkbox');
            checkBoxElement.checked =
                this.#getStepStatus(this.lab, this.exercise, this.step) === 'true';
            this.checked = checkBoxElement.checked;
            checkBoxElement.id = `ex-${this.exercise}-step-${this.step}`;
            containerElement.appendChild(checkBoxElement);

            const labelElement = document.createElement('label');
            labelElement.innerText = ` Completed exercise ${this.exercise} ${this.#updateSectionHeader()}`;
            containerElement.appendChild(labelElement);

            this.replaceChildren(containerElement);
        }

        // Checkbox click event handler
        #clickHandler(e) {
            this.#setStepStatus(this.lab, this.exercise, this.step, e.target.checked);
            this.checked = e.target.checked;
            this.#updateSectionHeader();
            this.#changeListeners.forEach(listener => listener());
            if (this.checked) {
                this.#updateTelemetry(this.lab, this.exercise, this.step);
            }
        }
        async connectedCallback() {
            this.onclick = this.#clickHandler;
        }

        // onChange event handler
        #changeListeners = [];
        set onChange(value) {
            this.#changeListeners.push(value);
        }

        // Finds the section header text
        #updateSectionHeader() {
            let elt = this.previousSibling?.parentElement || this.parentElement;
            while (elt && elt.tagName !== 'H3') {
                elt = elt.previousElementSibling;
            }
            if (elt) {
                this.label = elt.innerText.replace('✔', '').trim();
                console.log(`found element with text: ${this.label}`);
                if (this.checked) {
                    elt.innerText = '✔ ' + this.label;
                } else {
                    elt.innerText = this.label;
                }
                return this.label;
            }
            return ''
        }
    
        // Telemetry
        #updateTelemetry(lab, exercise, step) {
            const url = `https://m365-visitor-stats.azurewebsites.net/copilot-camp/completed-lab-${lab}-ex-${exercise}-step-${step}`;
            fetch(url, {
                method: 'GET',
                mode: 'no-cors'
            });

        }

        // Storage functions
        #getStepStatus(lab, exercise, step) {
            return localStorage.getItem(`step-${lab}-${exercise}-${step}`);
        }

        #setStepStatus(lab, exercise, step, status) {
            localStorage.setItem(`step-${lab}-${exercise}-${step}`, status);
        }
    }

    // cc-last-completed-step web component
    class LastCompletedStep extends HTMLElement {

        anchorElement; // HTML element to display the last completed step

        constructor() {
            super();

            // Set up an event listener for all cc-lab-step elements on the page
            const elts = document.querySelectorAll('cc-lab-end-step');
            for (let elt of elts) {
                elt.onChange = this.#updateText.bind(this);
            }

            this.anchorElement = document.createElement('a');
            this.replaceChildren(this.anchorElement);

            this.#updateText();
        }

        #updateText() {
            if (this.anchorElement) {
                let lastCompletedExercise = 0;
                let lastCompletedStep = 0;
                let lastCompletedStepTitle = '';
                const elts = document.querySelectorAll('cc-lab-end-step');
                for (let elt of elts) {
                    if (elt.checked) {
                        lastCompletedExercise = elt.exercise;
                        lastCompletedStep = elt.step;
                        lastCompletedStepTitle = elt.label;
                    }
                }
                if (lastCompletedExercise === 0) {
                    this.anchorElement.innerText = 'You have not completed any steps in this lab. Use the ☑ checkbox on each step to track your progress.';
                    this.anchorElement.href = '#';
                    this.anchorElement.style = 'pointer-events: none; color: black;';
                } else {
                    this.anchorElement.innerText = `✔ You last completed Exercise ${lastCompletedExercise}: ${lastCompletedStepTitle}`;
                    this.anchorElement.href = `#ex-${lastCompletedExercise}-step-${lastCompletedStep}`;
                    this.anchorElement.style = '';
                }
            }
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        window.customElements.define('cc-lab-end-step', LabEndStep);
        window.customElements.define('cc-last-completed-step', LastCompletedStep);
    });

})();