(() => {

    // Web controls for Copilot Developer Camp lab navigation

    //#region CSS
    function ensureCss() {

        const css = `
            .award-button {
                display: inline-block;
                padding: 6px 12px;
                margin: 10px 0;
                font-size: 14px;
                font-weight: 600;
                color: #fff;
                background-color: #38a5e4;
                border-radius: 5px;
                text-decoration: none;
                text-align: center;
                border: 1px solid rgba(27, 31, 35, .15);
                box-shadow: 0 1px 0 rgba(27, 31, 35, .04), inset 0 1px 0 hsla(0, 0%, 100%, .25);
                cursor: pointer;
                transition: background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            }

            .award-button:hover {
                background-color: #62b8ea;
                border-color: rgba(27, 31, 35, .15);
            }

            .award-button:disabled {
                background-color: #10557d;
                border-color: rgba(27, 31, 35, .15);
                cursor: not-allowed;
            }

            .award-congrats {
                color: #1c8fd2;
                font-size: larger;
                font-weight: bold;
                text-transform: uppercase;
            }
        `;
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        document.adoptedStyleSheets = [sheet];
    };
    //#endregion

    // This web component goes at the end of a step in a lab to track completion
    class Award extends HTMLElement {

        #claimAwardUrl;     // URL to claim the badge
        #pathName;          // Name of the path
        #label;             // Button text

        #containerElement; // Div container

        // #labsAndStepsUrl = 'http://127.0.0.1:8000/copilot-camp/javascripts/labs-and-steps.json'; // Local testing
        #labsAndStepsUrl = 'https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/docs/javascripts/labs-and-steps.json'; // Production

        // #functionsBaseUrl = 'http://localhost:7071/api/'; // Local testing
        #functionsBaseUrl = 'https://cc-awards.azurewebsites.net/api/'; // Production

        #badgeClaimedTrackingUrl = 'https://m365-visitor-stats.azurewebsites.net/copilot-camp/badge-claimed/'; // Badge claimed tracking URL

        #debugMode = false;  // Debug mode

        constructor() {
            super();

            this.#label = this.getAttribute('label') || ' ⭐ Claim your badge! ⭐ ';
            this.#pathName = this.getAttribute('path');
            this.#claimAwardUrl = this.getAttribute('claimAwardUrl') || 'https://aka.ms/copilotdevcamp/awards/claim?r3a6998c8554d4dbebe2eab89c0a2cf58=';

            ensureCss();

            // Ensure the award unique ID is set
            this.#ensureAwardUniqueId();

            // Render the award button if the claim URL is set
            if (this.#claimAwardUrl) {
                this.#renderClaimAward();
            }

            // Refresh the award status after 1 second
            setTimeout(() => { this.refreshAwardStatus(); }, 1000);
        }

        // Renders the award button
        #renderClaimAward() {
            this.#containerElement = document.createElement('div');

            // Create the congratulations message
            const congratsMessage = document.createElement('p');
            congratsMessage.textContent = `Congratulations! You have completed all the labs in the ${this.#pathName} path!`;
            congratsMessage.className = 'award-congrats';
            this.#containerElement.appendChild(congratsMessage);

            // Create the award button
            const awardButton = document.createElement('button');
            awardButton.textContent = this.#label;
            awardButton.className = 'award-button';
            awardButton.onclick = this.#clickHandler;
            this.#containerElement.appendChild(awardButton);
            
            // Hide the container by default
            this.#containerElement.style.display = 'none';

            this.replaceChildren(this.#containerElement);
        }

        // Button click event handler
        #clickHandler(e) {

            try {
                // Track the award status on telemetry
                const awardTrackingUrl = `${this.#badgeClaimedTrackingUrl}${this.#pathName}`;
                fetch(awardTrackingUrl, {
                    method: 'GET'
                });
            } catch (error) {
                console.error('Failed to track award status:', error);
            }

            if (this.#claimAwardUrl) {
                // Retrieve the unique ID and navigate to the claim URL
                const uniqueId = this.#ensureAwardUniqueId();
                // providing the uniqueId as a query parameter
                window.open(`${this.#claimAwardUrl}${uniqueId}`, '_blank');
            }
        }

        // Retrieves all the labs and labs steps from the configuration file
        async #fetchLabsAndSteps(pathName) {
            try {
                // Try to retrieve the labs and steps data
                const response = await fetch(this.#labsAndStepsUrl);
                if (!response.ok) {
                    console.error('Failed to fetch labs and steps JSON file');
                    return null;
                }

                // Parse the JSON response
                const data = await response.json();
                const stepsArray = [];
    
                // Build the steps array
                data.paths.forEach(path => {
                    if (path.pathId !== pathName) return;
                    path.labs.forEach(lab => {
                        lab.exercises.forEach(exercise => {
                            exercise.steps.forEach(step => {
                                stepsArray.push(`step-${lab.labId}-${exercise.exerciseId}-${step.stepId}`);
                            });
                        });
                    });
                });
    
                return stepsArray;

            } catch (error) {
                console.error('Failed to fetch labs and steps:', error);
            }
        }

        // Checks if the user is eligible to claim the award for a specific path
        async #checkAwardElegibility(pathName) {
            // Check if the user is eligible to claim the award
            const stepsArray = await this.#fetchLabsAndSteps(pathName);
            if (!stepsArray) return false;

            // Check if all steps have been completed
            const steps = stepsArray.filter(step => localStorage.getItem(step) === 'true');

            // console.log('Completed steps:', steps.length, 'Total steps:', stepsArray.length);
            // console.log(stepsArray);
            // console.log(steps);

            // Return true if all steps have been completed
            const isEligible = steps.length === stepsArray.length || this.#debugMode;
            return isEligible;
        }

        // Generate a unique ID (GUID) and store it in localStorage if it does not exist
        #ensureAwardUniqueId() {
            const key = 'copilot-camp-award-unique-id';
            let uniqueId = localStorage.getItem(key);
            if (!uniqueId) {
                uniqueId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                localStorage.setItem(key, uniqueId);
            }
            return uniqueId;
        }

        async #updateAwardStatus(pathName, isEligible) {
            try {
                // Update the award status for the current user
                const uniqueId = this.#ensureAwardUniqueId();
                const awardStatusUrl = `${this.#functionsBaseUrl}assignAward/${uniqueId}/${pathName}`;
                const awardStatusResponse = await fetch(awardStatusUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: isEligible })
                });
                if (!awardStatusResponse.ok) {
                    console.error('Failed to update award status via API:', awardStatusResponse.status, awardStatusResponse.statusText);
                }
            } catch (error) {
                console.error('Failed to update award status:', error);
            }
        }

        // Public method to check award eligibility
        async refreshAwardStatus() {
            // Check if the user is eligible to claim the award
            const isEligible = await this.#checkAwardElegibility(this.#pathName);

            try {
                // Update the award status for the current user
                await this.#updateAwardStatus(this.#pathName, isEligible);
            } catch (error) {
                console.error('Failed to update award status:', error);
            }

            // Show the award button if the user is eligible
            if (this.#claimAwardUrl && isEligible) {
                this.#renderClaimAward();
                this.#containerElement.style.display = 'block';
            } else {
                if (this.#containerElement) {
                    this.#containerElement.style.display = 'none';
                }
            };
        }

        // Run when the element is added to the DOM
        async connectedCallback() {
            this.onclick = this.#clickHandler;
        }
    }
    //#endregion

    document.addEventListener('DOMContentLoaded', function () {
        window.customElements.define('cc-award', Award);
    });

})();