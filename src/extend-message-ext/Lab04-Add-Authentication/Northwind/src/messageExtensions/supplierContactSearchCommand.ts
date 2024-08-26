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


async function handleTeamsMessagingExtensionQuery(context: TurnContext, query: any): Promise<any> {
    // eslint-disable-next-line no-secrets/no-secrets
    /**
     * User Code Here.
     * If query without token, no need to implement handleMessageExtensionQueryWithSSO;
     * Otherwise, just follow the sample code below to modify the user code.
     */
    return await handleMessageExtensionQueryWithSSO(
        context,
        oboAuthConfig,
        initialLoginEndpoint,
        "User.Read",
        async (token: MessageExtensionTokenResponse) => {
            // User Code

            // Init OnBehalfOfUserCredential instance with SSO token
            const credential = new OnBehalfOfUserCredential(token.ssoToken, oboAuthConfig);

            // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
            const authProvider = new TokenCredentialAuthenticationProvider(credential, {
                scopes: ["User.Read"],
            });

            // Initialize Graph client instance with authProvider
            const graphClient = Client.initWithMiddleware({
                authProvider: authProvider,
            });

            // Call graph api use `graph` instance to get user profile information.
            const profile = await graphClient.api("/me").get();

            // Organize thumbnailCard to display User's profile info.
            const thumbnailCard = CardFactory.thumbnailCard(profile.displayName, profile.mail);

            // Message Extension return the user profile info to user.
            return {
                composeExtension: {
                    type: "result",
                    attachmentLayout: "list",
                    attachments: [thumbnailCard],
                },
            };
        }
    );
}

async function handleTeamsMessagingExtensionSelectItem(
    context: TurnContext,
    obj: any
): Promise<any> {
    return {
        composeExtension: {
            type: "result",
            attachmentLayout: "list",
            attachments: [CardFactory.heroCard(obj.name, obj.description)],
        },
    };
}

export default { COMMAND_ID, handleTeamsMessagingExtensionQuery, handleTeamsMessagingExtensionSelectItem }
