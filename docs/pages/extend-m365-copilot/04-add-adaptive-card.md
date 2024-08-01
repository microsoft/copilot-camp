# Lab A4 - Add adaptive cards

In this lab you will further enhance the reponse from Copilot for Microsoft 365 from text to rich cards using Adaptive Cards. 

???+ "Navigating the Extending Copilot labs (A Path)"
    - [Lab A0 - Prerequisites](/copilot-camp/pages/extend-m365-copilot/00-prerequisites) 
    - [Lab A1 - Declarative Copilot](/copilot-camp/pages/extend-m365-copilot/01-declarative-copilot)
    - [Lab A2 - First API Plugin](/copilot-camp/pages/extend-m365-copilot/02-api-plugin)
    - [Lab A3 - Enhance the API Plugin](/copilot-camp/pages/extend-m365-copilot/03-enhance-api-plugin) 
    - [Lab A4 - Add Adaptive Cards](/copilot-camp/pages/extend-m365-copilot/04-add-adaptive-card) (📍You are here)
    - [Lab A5 - Add a Declarative Copilot](/copilot-camp/pages/extend-m365-copilot/05-add-declarative-copilot)
    - [Lab A6 - Add authentication](/copilot-camp/pages/extend-m365-copilot/06-add-authentication)

In this lab you will learn:

- What are Adaptive Cards
- How to create and test an Adaptive Card
- How to update Microsoft 365 Copilot responses to use Adaptive Cards for rich content

## Introduction
<details open>
<summary>What are Adaptive Cards?</summary>

Adaptive Cards are platform-independent UI snippets authored in JSON that can be exchanged between apps and services. Once delivered to an app, the JSON transforms into native UI that automatically adapts to its environment. This enables the design and integration of lightweight UI across major platforms and frameworks.
    <div class="video">
      <iframe src="https://adaptivecardsblob.blob.core.windows.net/assets/AdaptiveCardsOverviewVideo.mp4" title="adptivecard video">
      </video>" frameborder="0" allowfullscreen></iframe>
      <div>Adaptive cards</div>
    </div>
</details>


### Exercise 1: Create and test a simple Adaptive Card

Let's dive in and discover how fun it is to create adaptive cards.

#### Step 1: Define Your Adaptive Card in JSON

Create a new file named `adaptiveCard.json` and add the following JSON content:

```json
{
  "type": "AdaptiveCard",
  "body": [
    {
      "type": "TextBlock",
      "text": "Hello, Adaptive Cards!",
      "size": "large",
      "weight": "bolder"
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "Click me"
    }
  ],
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "version": "1.3"
}
```

This JSON defines a simple Adaptive Card with a text block and a button.

#### Step 2: Test Your Adaptive Card

To test your Adaptive Card, you can use the [Adaptive Cards Designer](https://adaptivecards.io/designer/).

1. Open the [Adaptive Cards Designer](https://adaptivecards.io/designer/).
2. Copy the JSON content from your `adaptiveCard.json` file.
3. Paste the JSON content into the "Card Payload Editor" section on the left side of the designer.
4. You will see a live preview of your Adaptive Card on the right side of the designer.

Congrats! You are now fully skilled to develop Adaptive cards for your plugin!

## Exercise 2: Update the plugin manifest 

We are going to update the plugin manifest file called `trey-plugin.json` with response template using adaptive cards. We will find each function or API call and update the templates.

### Step 1: Update the plugin manifest with adaptive card response templates

- Locate the function **getConsultants** and after the `properties` node add below `static_template` node.

```JSON
 "static_template": {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
              {
                "type": "Container",
                "$data": "${$root}",
                "items": [
                  {
                    "speak": "${name}",
                    "type": "ColumnSet",
                    "columns": [
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "TextBlock",
                            "text": "${name}",
                            "weight": "bolder",
                            "size": "extraLarge",
                            "spacing": "none",
                            "wrap": true,
                            "style": "heading"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${email}",
                            "wrap": true,
                            "spacing": "none"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${phone}",
                            "wrap": true,
                            "spacing": "none"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${location.city}, ${location.country}",
                            "wrap": true
                          }
                        ]
                      },
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "Image",
                            "url": "${consultantPhotoUrl}",
                            "altText": "${name}"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }   
             
            ]
 }
```

- Locate the function **getUserInformation** and after the `properties` node add below `static_template` node.

```JSON
  "static_template":{
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
              {
                "type": "Container",
                "$data": "${$root}",
                "items": [
                  {
                    "speak": "${name}",
                    "type": "ColumnSet",
                    "columns": [
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "TextBlock",
                            "text": "${name}",
                            "weight": "bolder",
                            "size": "extraLarge",
                            "spacing": "none",
                            "wrap": true,
                            "style": "heading"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${email}",
                            "wrap": true,
                            "spacing": "none"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${phone}",
                            "wrap": true,
                            "spacing": "none"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${location.city}, ${location.country}",
                            "wrap": true
                          }
                        ]
                      },
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "Image",
                            "url": "${consultantPhotoUrl}",
                            "altText": "${name}"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }   
             
            ]
  }
  ```
- Locate the function **getProjects** and after the `properties` node add below `static_template` node.

```JSON
  "static_template": {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
              {
                "type": "Container",
                "$data": "${$root}",
                "items": [
                  {
                    "speak": "${description}",
                    "type": "ColumnSet",
                    "columns": [
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "TextBlock",
                            "text": "${name}",
                            "weight": "bolder",
                            "size": "extraLarge",
                            "spacing": "none",
                            "wrap": true,
                            "style": "heading"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${description}",
                            "wrap": true,
                            "spacing": "none"
                          },
                          {
                            "type": "TextBlock",
                            "text": "${location.city}, ${location.country}",
                            "wrap": true
                          },
                          {
                            "type": "TextBlock",
                            "text": "${clientName}",
                            "weight": "Bolder",
                            "size": "Large",
                            "spacing": "Medium",
                            "wrap": true,
                            "maxLines": 3
                          },
                          {
                            "type": "TextBlock",
                            "text": "${clientContact}",
                            "size": "small",
                            "wrap": true
                          },
                          {
                            "type": "TextBlock",
                            "text": "${clientEmail}",
                            "size": "small",
                            "wrap": true
                          }
                        ]
                      },
                      {
                        "type": "Column",
                        "items": [
                          {
                            "type": "Image",
                            "url": "${location.mapUrl}",
                            "altText": "${location.street}"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "TextBlock",
                "text": "Project Metrics",
                "weight": "Bolder",
                "size": "Large",
                "spacing": "Medium",
                "horizontalAlignment": "Center",
                "separator": true
              },
              {
                "type": "ColumnSet",
                "columns": [
                  {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "Forecast This Month",
                        "weight": "Bolder",
                        "spacing": "Small",
                        "horizontalAlignment": "Center"
                      },
                      {
                        "type": "TextBlock",
                        "text": "${forecastThisMonth} ",
                        "size": "ExtraLarge",
                        "weight": "Bolder",
                        "horizontalAlignment": "Center"
                      }
                    ]
                  },
                  {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "Forecast Next Month",
                        "weight": "Bolder",
                        "spacing": "Small",
                        "horizontalAlignment": "Center"
                      },
                      {
                        "type": "TextBlock",
                        "text": "${forecastNextMonth} ",
                        "size": "ExtraLarge",
                        "weight": "Bolder",
                        "horizontalAlignment": "Center"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "ColumnSet",
                "columns": [
                  {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "Delivered Last Month",
                        "weight": "Bolder",
                        "spacing": "Small",
                        "horizontalAlignment": "Center"
                      },
                      {
                        "type": "TextBlock",
                        "text": "${deliveredLastMonth} ",
                        "size": "ExtraLarge",
                        "weight": "Bolder",
                        "horizontalAlignment": "Center"
                      }
                    ]
                  },
                  {
                    "type": "Column",
                    "width": "stretch",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "Delivered This Month",
                        "weight": "Bolder",
                        "spacing": "Small",
                        "horizontalAlignment": "Center"
                      },
                      {
                        "type": "TextBlock",
                        "text": "${deliveredThisMonth} ",
                        "size": "ExtraLarge",
                        "weight": "Bolder",
                        "horizontalAlignment": "Center"
                      }
                    ]
                  }
                ]
              }
            ],
            "actions": [
              {
                "type": "Action.OpenUrl",
                "title": "View map",
                "url": "${location.mapUrl}"
              }
            ]
  }
```

- Locate the function **postBillhours** and after the `properties` node add below `static_template` node.
```JSON
"static_template": {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.5",
            "body": [
              {
                "type": "TextBlock",
                "text": "results.status: ${if(results.status, results.status, 'N/A')}",
                "wrap": true
              },
              {
                "type": "TextBlock",
                "text": "results.clientName: ${if(results.clientName, results.clientName, 'N/A')}",
                "wrap": true
              },
              {
                "type": "TextBlock",
                "text": "results.projectName: ${if(results.projectName, results.projectName, 'N/A')}",
                "wrap": true
              },
              {
                "type": "TextBlock",
                "text": "results.remainingForecast: ${if(results.remainingForecast, results.remainingForecast, 'N/A')}",
                "wrap": true
              },
              {
                "type": "TextBlock",
                "text": "results.message: ${if(results.message, results.message, 'N/A')}",
                "wrap": true
              }
            ]
}
```


- Locate the function **postAssignConsultant** and after the `properties` node add below `static_template` node.

```JSON
 "static_template": {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.5",
            "body": [
              {
                "type": "TextBlock",
                "text": "results.status: ${if(results.status, results.status, 'N/A')}",
                "wrap": true
              },
              {
                "type": "TextBlock",
                "text": "results.clientName: ${if(results.clientName, results.clientName, 'N/A')}",
                "wrap": true
              },
              {
                "type": "TextBlock",
                "text": "results.projectName: ${if(results.projectName, results.projectName, 'N/A')}",
                "wrap": true
              },
              {
                "type": "TextBlock",
                "text": "results.consultantName: ${if(results.consultantName, results.consultantName, 'N/A')}",
                "wrap": true
              },
              {
                "type": "TextBlock",
                "text": "results.remainingForecast: ${if(results.remainingForecast, results.remainingForecast, 'N/A')}",
                "wrap": true
              },
              {
                "type": "TextBlock",
                "text": "results.message: ${if(results.message, results.message, 'N/A')}",
                "wrap": true
              },
              {
                "type": "TextBlock",
                "text": "status: ${if(status, status, 'N/A')}",
                "wrap": true
              }
            ]
 }
 ```

## Exercise 3: Test the plugin in Copilot

## Step 1: Install the plugin

Close the browser and restart the debugger and log in when the browser appears.

You will be brought into Microsoft Teams, where you will be prompted to install the app. Go ahead and do this; it should bring you to the Copilot screen. Open the plugin panel 1️⃣, which is the small icon of 4 boxes to the left of the send button in the message compose box. Turn off all the plugins except for the green "Trey" icon 2️⃣, which should be turned on. If you previously deployed the app to Azure, you may see a 2nd (red) Trey icon; turn that off to test the local instance.

![Run in Copilot](../../assets/images/extend-m365-copilot-02/run-in-copilot02.png)

Now try a prompt such as "what projects are we doing for adatum?"



You may see a confirmation card, even for the GET request. If you do, allow the request to view the project details.

## CONGRATULATIONS

You have completed Lab A4 - Add adaptive cards
You are now ready to proceed to [Lab A4 - Add a declarative copilot to your API plugin](/copilot-camp/pages/extend-m365-copilot/05-add-declarative-copilot).