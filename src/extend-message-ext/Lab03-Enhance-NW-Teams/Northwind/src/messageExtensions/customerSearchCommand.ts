import {
    CardFactory,
    TurnContext,
    MessagingExtensionQuery,
    MessagingExtensionResponse,
} from "botbuilder";
import { searchProductsByCustomer } from "../northwindDB/products";
import cardHandler from "../adaptiveCards/cardHandler";

const COMMAND_ID = "companySearch";

let queryCount = 0;
async function handleTeamsMessagingExtensionQuery(
    context: TurnContext,
    query: MessagingExtensionQuery
): Promise<MessagingExtensionResponse> {

    {
        let companyName;
    
        // Validate the incoming query, making sure it's the 'companySearch' command
        // The value of the 'companyName' parameter is the company name to search for
        if (query.parameters.length === 1 && query.parameters[0]?.name === "companyName") {
            [companyName] = (query.parameters[0]?.value.split(','));
        } else { 
            companyName = cleanupParam(query.parameters.find((element) => element.name === "companyName")?.value);
        }
        console.log(`🍽️ Query #${++queryCount}:\ncompanyName=${companyName}`);    
    
        const products = await searchProductsByCustomer(companyName);
    
        console.log(`Found ${products.length} products in the Northwind database`)
        const attachments = [];
        products.forEach((product) => {
            const preview = CardFactory.heroCard(product.ProductName,
                `Customer: ${companyName}`, [product.ImageUrl]);
    
            const resultCard = cardHandler.getEditCard(product);
            const attachment = { ...resultCard, preview };
            attachments.push(attachment);
        });
        return {
            composeExtension: {
                type: "result",
                attachmentLayout: "list",
                attachments: attachments,
            },
        };
    }
}

function cleanupParam(value: string): string {

    if (!value) {
        return "";
    } else {
        let result = value.trim();
        result = result.split(',')[0];          // Remove extra data
        result = result.replace("*", "");       // Remove wildcard characters from Copilot
        return result;
    }
}

export default { COMMAND_ID, handleTeamsMessagingExtensionQuery }
