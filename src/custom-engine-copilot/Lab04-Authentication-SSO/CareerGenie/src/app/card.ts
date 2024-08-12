import { AdaptiveCard, Message, Utilities } from '@microsoft/teams-ai';
/**
 * Create an adaptive card from a prompt response.
 * @param {Message<string>} response The prompt response to create the card from.
 * @returns {AdaptiveCard} The response card.
 */

//Adaptive card to display the response and citations
export function createResponseCard(response: Message<string>): AdaptiveCard {
    const citationCards = response.context?.citations.map((citation, i) => ({
            type: 'Action.ShowCard',
            title: `${i+1}`,
            card: {
                type: 'AdaptiveCard',
                body: [
                    {
                        type: 'TextBlock',
                        text: citation.title,
                        fontType: 'Default',
                        weight: 'Bolder'
                    },
                    {
                        type: 'TextBlock',
                        text: citation.content,
                        wrap: true
                    }
                ]
            }
        }));
    
    const text = Utilities.formatCitationsResponse(response.content!);
    return {
        type: 'AdaptiveCard',
        body: [
            {
                type: 'TextBlock',
                text: text,
                wrap: true
            },
            {
                type: 'TextBlock',
                text: 'Citations',
                wrap: true,
                fontType: 'Default',
                weight: 'Bolder'
            },
            {
                type: 'ActionSet',
                actions: citationCards
            }
        ],
        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
        version: '1.5'
    };
}


