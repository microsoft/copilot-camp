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

            .award-badge {
                display: block;
                width: 200px;
                max-width: 200px;
                height: auto;
            }

            .award-congrats {
                color: #1c8fd2;
                font-size: larger;
                font-weight: bold;
            }

            .award-congrats-title {
                text-transform: uppercase;
            }

            .award-congrats-message {
                text-transform: none;
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
        #badgeId;           // ID of the badge
        #badgeName;         // Name of the badge
        #badgeUrl;          // URL of the badge image
        #label;             // Button text

        #containerElement;  // Div container

        // #labsAndStepsUrl = 'http://127.0.0.1:8000/copilot-camp/javascripts/labs-and-steps.json'; // Local testing
        #labsAndStepsUrl = 'https://raw.githubusercontent.com/microsoft/copilot-camp/refs/heads/main/docs/javascripts/labs-and-steps.json'; // Production

        // #functionsBaseUrl = 'http://localhost:7071/api/'; // Local testing
        #functionsBaseUrl = 'https://cc-awards.azurewebsites.net/api/'; // Production

        #badgeClaimedTrackingUrl = 'https://m365-visitor-stats.azurewebsites.net/copilot-camp/badge-claimed/'; // Badge claimed tracking URL

        #debugMode = false;  // Debug mode

        constructor() {
            super();

            this.#label = this.getAttribute('label') || ' ⭐ Claim your badge! ⭐ ';
            this.#badgeId = this.getAttribute('badgeId') || 'unknown-badge-id';
            this.#badgeName = this.getAttribute('badgeName') || 'unknown-badge-name';
            this.#badgeUrl = this.getAttribute('badgeUrl') || ''; // Will fall back to badgeImageUrl from config
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

            // Create the congratulations title
            const congratsTitle = document.createElement('div');
            congratsTitle.textContent = 'Congratulations!';
            congratsTitle.className = 'award-congrats award-congrats-title';
            this.#containerElement.appendChild(congratsTitle);

            // Create the congratulations message
            const congratsMessage = document.createElement('div');
            congratsMessage.textContent = `You have completed all the labs required to claim the "${this.#badgeName}" badge!`;
            congratsMessage.className = 'award-congrats award-congrats-message';
            this.#containerElement.appendChild(congratsMessage);

            // Create the badge image
            const badgeImage = document.createElement('img');
            badgeImage.src = this.#badgeUrl;
            badgeImage.alt = `${this.#badgeName} badge`;
            badgeImage.className = 'award-badge';
            this.#containerElement.appendChild(badgeImage);

            // Create the award button
            const awardButton = document.createElement('button');
            awardButton.textContent = this.#label;
            awardButton.className = 'award-button';
            awardButton.onclick = () => this.#clickHandler();
            this.#containerElement.appendChild(awardButton);
            
            // Hide the container by default
            this.#containerElement.style.display = 'none';

            this.replaceChildren(this.#containerElement);
        }

        // Button click event handler
        #clickHandler(e) {

            try {
                // Track the award status on telemetry
                const awardTrackingUrl = `${this.#badgeClaimedTrackingUrl}${this.#badgeName}`;
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

        // Helper method to extract steps from labs array
        // By default, excludes optional labs (for eligibility checking)
        // Set includeOptional=true to include all labs (for display purposes)
        #extractStepsFromLabs(labs, includeOptional = false) {
            const stepsArray = [];
            labs.forEach(lab => {
                // Skip optional labs unless explicitly included
                if (lab.optional && !includeOptional) {
                    return;
                }
                lab.exercises.forEach(exercise => {
                    exercise.steps.forEach(step => {
                        stepsArray.push(`step-${lab.labId}-${exercise.exerciseId}-${step.stepId}`);
                    });
                });
            });
            return stepsArray;
        }

        // Retrieves all the labs and labs steps from the configuration file
        // Returns an object with groups (array of step arrays) and badge configuration, or null on failure
        // Supports both old format (flat labs array) and new format (groups of labs)
        async #fetchLabsAndSteps(badgeId) {
            try {
                // Try to retrieve the labs and steps data
                const response = await fetch(this.#labsAndStepsUrl);
                if (!response.ok) {
                    console.error('Failed to fetch labs and steps JSON file');
                    return null;
                }

                // Parse the JSON response
                const data = await response.json();
                const groups = [];
                let badgeConfig = null;
    
                // Build the groups array and retrieve badge configuration
                data.badges.forEach(badge => {
                    if (badge.badgeId !== badgeId) return;
                    badgeConfig = {
                        enabled: badge.enabled !== undefined ? badge.enabled : true,
                        startDate: badge.startDate ? new Date(badge.startDate) : null,
                        endDate: badge.endDate ? new Date(badge.endDate) : null,
                        badgeImageUrl: badge.badgeImageUrl || ''
                    };
                    
                    // Check if badge uses new groups structure or old flat labs structure
                    if (badge.groups && Array.isArray(badge.groups)) {
                        // New structure: groups of labs (OR logic between groups)
                        badge.groups.forEach(group => {
                            const requiredSteps = this.#extractStepsFromLabs(group.labs, false);
                            const optionalSteps = this.#extractStepsFromLabs(group.labs, true)
                                .filter(step => !requiredSteps.includes(step));
                            groups.push({
                                groupId: group.groupId,
                                groupName: group.groupName,
                                steps: requiredSteps,
                                optionalSteps: optionalSteps
                            });
                        });
                    } else if (badge.labs && Array.isArray(badge.labs)) {
                        // Old structure: flat labs array (all labs required)
                        const requiredSteps = this.#extractStepsFromLabs(badge.labs, false);
                        const optionalSteps = this.#extractStepsFromLabs(badge.labs, true)
                            .filter(step => !requiredSteps.includes(step));
                        groups.push({
                            groupId: 'default',
                            groupName: 'Default',
                            steps: requiredSteps,
                            optionalSteps: optionalSteps
                        });
                    }
                });
    
                return { groups, badgeConfig };

            } catch (error) {
                console.error('Failed to fetch labs and steps:', error);
                return null;
            }
        }

        // Checks if the badge campaign is currently active (enabled and within date range)
        #isCampaignActive(badgeConfig) {
            if (!badgeConfig) return false;

            // In debug mode, always consider the campaign active
            if (this.#debugMode) return true;

            // Check if the badge is enabled
            if (!badgeConfig.enabled) return false;

            // Check if the current date/time is within the campaign range
            const now = new Date();
            if (badgeConfig.startDate && now < badgeConfig.startDate) return false;
            if (badgeConfig.endDate && now > badgeConfig.endDate) return false;

            return true;
        }

        // Checks if the user is eligible to claim the award for a specific badge 
        // by verifying if all the required steps have been completed in ANY group
        // and the badge campaign is active
        async #checkAwardElegibility(badgeId) {
            // Fetch labs, steps, and badge configuration
            const result = await this.#fetchLabsAndSteps(badgeId);
            if (!result || !result.groups || result.groups.length === 0) return { isEligible: false, badgeConfig: null };

            const { groups, badgeConfig } = result;

            // Check if the badge campaign is active
            if (!this.#isCampaignActive(badgeConfig)) {
                if (this.#debugMode) {
                    console.log('Badge campaign is not active for badge:', badgeId);
                }
                return { isEligible: false, badgeConfig };
            }

            // Check if ANY group has ALL its steps completed (OR logic between groups)
            let isEligible = false;
            for (const group of groups) {
                const completedSteps = group.steps.filter(step => localStorage.getItem(step) === 'true');
                const groupComplete = completedSteps.length === group.steps.length;

                if (this.#debugMode) {
                    console.log(`Group "${group.groupName}" (${group.groupId}): ${completedSteps.length}/${group.steps.length} required steps completed`);
                    console.log('Required steps:', group.steps);
                    console.log('Completed required steps:', completedSteps);
                    const missingSteps = group.steps.filter(step => localStorage.getItem(step) !== 'true');
                    console.log('Missing required steps:', missingSteps);
                    if (group.optionalSteps && group.optionalSteps.length > 0) {
                        const completedOptional = group.optionalSteps.filter(step => localStorage.getItem(step) === 'true');
                        console.log(`Optional steps: ${completedOptional.length}/${group.optionalSteps.length} completed`);
                        console.log('Optional steps:', group.optionalSteps);
                    }
                }

                if (groupComplete) {
                    isEligible = true;
                    if (this.#debugMode) {
                        console.log(`Group "${group.groupName}" is complete - badge eligible!`);
                    }
                    if (!this.#debugMode) {
                        break; // One complete group is enough (but continue loop in debug mode to show all groups)
                    }
                }
            }

            // In debug mode, always eligible but show summary
            if (this.#debugMode) {
                console.log('--- Debug Mode Summary ---');
                console.log(`Badge "${badgeId}" eligibility (before debug override): ${isEligible}`);
                console.log('Setting eligibility to true for debug mode');
                isEligible = true;
            }

            return { isEligible, badgeConfig };
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

        async #updateAwardStatus(badgeId, isEligible) {
            try {
                // Update the award status for the current user
                const uniqueId = this.#ensureAwardUniqueId();
                const awardStatusUrl = `${this.#functionsBaseUrl}assignAward/${uniqueId}/${badgeId}`;
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
            const { isEligible, badgeConfig } = await this.#checkAwardElegibility(this.#badgeId);

            // Use badgeImageUrl from config as fallback when badgeUrl attribute is not provided
            if (!this.#badgeUrl && badgeConfig && badgeConfig.badgeImageUrl) {
                this.#badgeUrl = badgeConfig.badgeImageUrl;
            }

            try {
                // Update the award status for the current user
                await this.#updateAwardStatus(this.#badgeId, isEligible);
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