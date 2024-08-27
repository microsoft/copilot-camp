import {
    CardFactory,
    TurnContext,
    MessagingExtensionQuery,
    MessagingExtensionResponse,
} from "botbuilder";

import cardHandler from "../adaptiveCards/cardHandler";
import {
    MessageExtensionTokenResponse,
    handleMessageExtensionQueryWithSSO,
    OnBehalfOfCredentialAuthConfig,
    OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import "isomorphic-fetch";
import config from "../config";

const COMMAND_ID = "supplierContactSearch";

const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
    authorityHost: config.authorityHost,
    clientId: config.clientId,
    tenantId: config.tenantId,
    clientSecret: config.clientSecret,
};

const initialLoginEndpoint = config.initiateLoginEndpoint;

let queryCount = 0;
async function handleTeamsMessagingExtensionQuery(context: TurnContext, query: any): Promise<any> {

    let name = '';
  

    if (query.parameters.length === 1 && query.parameters[0]?.name === "name") {
        [name] = (query.parameters[0]?.value.split(','));
    } else {
        name = cleanupParam(query.parameters.find((element) => element.name === "name")?.value);
    }
    console.log(`🍽️ Query #${++queryCount}:\name of contact=${name}`);    
    return await handleMessageExtensionQueryWithSSO(
        context,
        oboAuthConfig,
        initialLoginEndpoint,
        ["Contacts.Read"],
        async (token: MessageExtensionTokenResponse) => {
            // User Code

            // Init OnBehalfOfUserCredential instance with SSO token
            const credential = new OnBehalfOfUserCredential(token.ssoToken, oboAuthConfig);

            // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
            const authProvider = new TokenCredentialAuthenticationProvider(credential, {
                scopes:  ["Contacts.Read"],
            });

            // Initialize Graph client instance with authProvider
            const graphClient = Client.initWithMiddleware({
                authProvider: authProvider,
            });

            // Call graph api use `graph` instance to get contacts information.
            const profile = await graphClient.api("/me/contacts?$select=id,displayName,emailAddresses").get();

            //filter out contacts that match either display name or email address with query parameter
            const filteredProfile = profile.value.filter((contact) => {
                return contact.displayName.toLowerCase().includes(name.toLocaleLowerCase()) ||
                    contact.emailAddresses[0]?.address.toLowerCase().includes(name.toLowerCase());
            });

            const attachments = [];
            filteredProfile.forEach((prof) => {
                const preview = CardFactory.heroCard(prof.displayName,
                    `with email ${prof.emailAddresses[0]?.address}`);
                
                const resultCard = cardHandler.getEditCard(filteredProfile);
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
        });
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
