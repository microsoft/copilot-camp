(() => {

    function ensureCss() {

        const css = `
            h2.lab-exercise {
                color: white;
                background-color: #404040;
                padding: 5pt 10pt;
            }
            .lab-step input[type=checkbox] {
                -ms-transform: scale(1.5);  /* IE */
                -moz-transform: scale(1.5); /* FF */
                -webkit-transform: scale(1.5); /* Safari and Chrome */
                -o-transform: scale(1.5);  /* Opera */
                transform: scale(1.5);
                margin: 10pt 8pt 8pt 8pt;
                float: left;
            }  
            .lab-step h3 {
                border-top: 5px solid gray;
                border-bottom: 5px solid gray;
            }      
        `;
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        document.adoptedStyleSheets = [sheet];
    };


    // cc-lab-step web component
    class LabStep extends HTMLElement {

        checked;        // True if the checkbox is checked
        lab;            // lab="..."
        exercise;       // exercise=""
        step;           // step="..."

        constructor() {
            super();

            this.lab = this.getAttribute('lab');
            this.exercise = this.getAttribute('exercise');
            this.step = this.getAttribute('step');

            ensureCss();

            // Build out child elements
            let containerElement = document.createElement('div');
            containerElement.className = 'lab-step';

            const checkBoxElement = document.createElement('input');
            checkBoxElement.setAttribute('type', 'checkbox');
            checkBoxElement.checked =
                this.#getStepStatus(this.lab, this.exercise, this.step) === 'true';
            this.checked = checkBoxElement.checked;
            containerElement.appendChild(checkBoxElement);

            const headingElement = document.createElement('h3');
            headingElement.id = `ex-${this.exercise}-step-${this.step}`;
            headingElement.innerText =
                `Step ${this.step} - ${this.innerText}`;
            containerElement.appendChild(headingElement);

            this.replaceChildren(containerElement);
        }

        // Checkbox click event handler
        #clickHandler(e) {
            this.#setStepStatus(this.lab, this.exercise, this.step, e.target.checked);
            this.checked = e.target.checked;
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

    // cc-lab-exercise web component
    class LabExercise extends HTMLElement {

        lab;
        exercise;

        constructor() {
            super();

            ensureCss();

            this.lab = this.getAttribute('lab');
            this.exercise = this.getAttribute('exercise');

            const headingElement = document.createElement('h2');
            headingElement.innerText = `Exercise ${this.exercise} - ${this.innerText}`;
            headingElement.className = 'lab-exercise';

            this.replaceChildren(headingElement);
        }
    }

    // cc-last-completed-step web component
    class LastCompletedStep extends HTMLElement {

        displayElement; // HTML element to display the last completed step

        constructor() {
            super();

            // Set up an event listener for all cc-lab-step elements on the page
            const elts = document.querySelectorAll('cc-lab-step');
            for (let elt of elts) {
                elt.onChange = this.#updateText.bind(this);
            }

            this.displayElement = document.createElement('a');
            this.replaceChildren(this.displayElement);

            this.#updateText();
        }

        #updateText() {
            if (this.displayElement) {
                let lastCompletedExercise = 0;
                let lastCompletedStep = 0;
                let lastCompletedStepTitle = '';
                const elts = document.querySelectorAll('cc-lab-step');
                for (let elt of elts) {
                    if (elt.checked) {
                        lastCompletedExercise = elt.exercise;
                        lastCompletedStep = elt.step;
                        lastCompletedStepTitle = elt.innerText;
                    }
                }
                if (lastCompletedExercise === 0) {
                    this.displayElement.innerText = 'You have not completed any steps in this lab. Use the ☑ checkbox on each step to track your progress.';
                } else {
                    this.displayElement.innerText = `✔ You last completed Exercise ${lastCompletedExercise}, ${lastCompletedStep}: ${lastCompletedStepTitle}`;
                    this.displayElement.href = `#ex-${lastCompletedExercise}-step-${lastCompletedStep}`;
                }
            }
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        window.customElements.define('cc-lab-step', LabStep);
        window.customElements.define('cc-lab-exercise', LabExercise);
        window.customElements.define('cc-last-completed-step', LastCompletedStep);
    });

})();