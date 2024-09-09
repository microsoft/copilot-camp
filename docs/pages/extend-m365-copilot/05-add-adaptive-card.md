# Lab E4 - Add adaptive cards

In this lab you will further enhance the reponse from Copilot for Microsoft 365 from text to rich cards using Adaptive Cards. 

???+ "Navigating the Extend Copilot labs (Extend Path)"
    - [Lab E0 - Prerequisites](./00-prerequisites.md)
    - [Lab E1 - Declarative Copilot](./01-declarative-copilot.md)
    - [Lab E2 - Build an API](./02-build-the-api.md)
    - [Lab E3 - Add a Declarative Copilot and API Plugin](./03-add-declarative-copilot.md) 
    - [Lab E4 - Enhance the API and Plugin](./04-enhance-api-plugin.md)
    - [Lab E5 - Add Adaptive Cards](./05-add-adaptive-card.md) (📍You are here)
    - [Lab E6 - Add authentication](./06-add-authentication.md)

---8<--- "e-path-prelude.md"

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


## Exercise 1: Create and test a simple Adaptive Card

Let's dive in and discover how fun it is to create adaptive cards.

### Step 1: Define Your Adaptive Card in JSON

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

<cc-lab-end-step lab="e5" exercise="1" step="1" />

### Step 2: Test Your Adaptive Card

To test your Adaptive Card, you can use the [Adaptive Cards Designer](https://adaptivecards.io/designer/).

1. Open the [Adaptive Cards Designer](https://adaptivecards.io/designer/).
2. Copy the JSON content from your `adaptiveCard.json` file.
3. Paste the JSON content into the "Card Payload Editor" section on the left side of the designer.
4. You will see a live preview of your Adaptive Card on the right side of the designer.

Congrats! You are now fully skilled to develop Adaptive cards for your plugin!

<cc-lab-end-step lab="e5" exercise="1" step="1" />

## Exercise 2: Update the plugin manifest 

We are going to update the plugin manifest file called **trey-plugin.json** in the **appPackage** folder with a response template using adaptive cards. We will find each function or API call and update the templates.

### Step 1: Add an adaptive card for GET /api/consultants requests

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

<cc-lab-end-step lab="e5" exercise="2" step="1" />

### Step 2: Add an adaptive card for GET /api/me requests:

- Locate the function **getUserInformation** and after the `properties` node add below `static_template` node.

```json

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

<cc-lab-end-step lab="e5" exercise="2" step="2" />

### Step 3: Add an adaptive card for GET /api/projects requests:

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

<cc-lab-end-step lab="e5" exercise="2" step="3" />

### Step 4: Add an adaptive card for POST /api/billHours requests:

- Locate the function **postBillhours** and after the `properties` node add below `static_template` node.

```JSON
"static_template": {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.5",
            "body": [
              {
                "type": "TextBlock",
                "text": "Project Status Summary",
                "weight": "Bolder",
                "size": "Large",
                "separator": true
              },              
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Client Name",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.clientName, results.clientName, 'N/A')}",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Project Name",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.projectName, results.projectName, 'N/A')}",
                    "wrap": true
                  }
                ]
              },  
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Remaining Forecast",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.remainingForecast, results.remainingForecast, 'N/A')}",
                    "wrap": true
                  }
                ]
              },           
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Message",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.message, results.message, 'N/A')}",
                    "wrap": true
                  }
                ]
              }
            ]
          }
```

<cc-lab-end-step lab="e5" exercise="2" step="4" />

### Step 5: Add an adaptive card for POST /api/assignConsultant requests:

- Locate the function **postAssignConsultant** and after the `properties` node add below `static_template` node.

```JSON
 "static_template": {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.5",
            "body": [
              {
                "type": "TextBlock",
                "text": "Project Overview",
                "weight": "Bolder",
                "size": "Large",
                "separator": true,
                "spacing": "Medium"
              },              
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Client Name",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.clientName, results.clientName, 'N/A')}",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Project Name",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.projectName, results.projectName, 'N/A')}",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Consultant Name",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.consultantName, results.consultantName, 'N/A')}",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Remaining Forecast",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.remainingForecast, results.remainingForecast, 'N/A')}",
                    "wrap": true
                  }
                ]
              },
              {
                "type": "Container",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Message",
                    "weight": "Bolder",
                    "spacing": "Small"
                  },
                  {
                    "type": "TextBlock",
                    "text": "${if(results.message, results.message, 'N/A')}",
                    "wrap": true
                  }
                ]
              }            
            ]          
          }

```

<cc-lab-end-step lab="e5" exercise="2" step="5" />

## Exercise 3: Test the plugin in Copilot

### Step 1: Install the plugin

Stop and restart your project to force it to re-deploy the application package.
You will be brought into Microsoft Teams. Once you're back in Copilot, open the right flyout 1️⃣ to show your previous chats and declarative copilots and select the Trey Genie Local copilot 2️⃣.

![Running the declarative copilot](../../assets/images/extend-m365-copilot-05/run-declarative-copilot-01.png)

<cc-lab-end-step lab="e5" exercise="3" step="1" />

### Step 2: Display an adaptive card

Now try a prompt such below

 *what projects are we doing for adatum?*

Instead of just the text response you will also get a rich card with information of the project.

![Adaptive card in response](../../assets/images/extend-m365-copilot-04/project-adaptive.png)

Now try a POST operation prompt such below

 *please charge 1 hour to woodgrove bank in trey research*

Instead of just the text response you will also get a rich card with information of the project.

![Adaptive card in response](../../assets/images/extend-m365-copilot-04/bill-hours.png)

You can now test other prompts as well to see the improved responses from Copilot for Microsoft 365.

<cc-lab-end-step lab="e5" exercise="3" step="2" />

## CONGRATULATIONS

You've completed adding adaptive card responses to your first API plugin. You are now ready to proceed to the next lab to add a declarative copilot to the same API plugin. 

<img src="https://pnptelemetry.azurewebsites.net/copilot-camp/extend-m365-copilot/04-add-adaptive-card" />