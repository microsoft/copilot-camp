import {
    AdaptiveCardInvokeResponse,
    InvokeResponse,
    MessagingExtensionActionResponse,
  } from "botbuilder";
  
  export const CreateInvokeResponse = (
    status: number,
    body?: unknown
  ): InvokeResponse => {
    return { status, body };
  };
  
  export const CreateAdaptiveCardInvokeResponse = (
    statusCode: number,
    body?: Record<string, unknown>
  ): AdaptiveCardInvokeResponse => {
    return {
      statusCode: statusCode,
      type: "application/vnd.microsoft.card.adaptive",
      value: body,
    };
  };
  
  export const CreateActionErrorResponse = (
    statusCode: number,
    errorCode = -1,
    errorMessage = "Unknown error"
  ): AdaptiveCardInvokeResponse => {
    return {
      statusCode: statusCode,
      type: "application/vnd.microsoft.error",
      value: {
        error: {
          code: errorCode,
          message: errorMessage,
        },
      },
    };
  };
  
  export const CreateInvokeErrorResponse = (
    statusCode: number,
    errorCode = -1,
    errorMessage = "Unknown error"
  ): InvokeResponse => {
    return CreateInvokeResponse(statusCode, {
      error: {
        code: errorCode,
        message: errorMessage,
      },
    });
  };
  
  export const setTaskInfo = (taskInfo) => {
    taskInfo.height = 350;
    taskInfo.width = 800;
    taskInfo.title = "";
  };
  
  export const CreateErrorResponseActionResponse = (
    error: string
  ): MessagingExtensionActionResponse => {
    const cardAttachment = {
      contentType: `application/vnd.microsoft.card.adaptive`,
      card: JSON.parse(`{ 
      "type": "AdaptiveCard",
      "version": "1.6",
      "body": [
          {
              "type": "TextBlock",
              "text": "Error",
              "weight": "Bolder",
              "size": "Medium"
          },
          {
              "type": "TextBlock",
              "text": "An error has occurred. ${error}.",
              "wrap": true
          }
      ]
    }`),
    };
  
    const response: MessagingExtensionActionResponse = {
      task: {
        type: "continue",
        value: cardAttachment,
      },
    };
  
    return response;
  };
  
  export const cleanupParam = (value: string): string => {
    if (!value) {
      return "";
    } else {
      let result = value.trim();
      result = result.split(",")[0];
      result = result.replace("*", "");
      return result;
    }
  };
  
  export const getFileNameFromUrl = (url: string): string => {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
  };