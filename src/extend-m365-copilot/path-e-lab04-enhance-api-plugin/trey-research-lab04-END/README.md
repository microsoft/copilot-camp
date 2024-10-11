# Lab Solution Files

This folder contains a solution from the [Copilot Developer Camp labs](https://aka.ms/copilotdevcamp). Lab E2 provides the starting solution, which students build in over the course of the following several labs.

## Final application

When completed, the solution is a declarative agent called "Trey Genie" which provides assistant to the employees of Trey Research. Trey Research is a fictitious consulting company that supplies talent in the software and pharmaceuticals industries. The vision for this demo is to show the full potential of Copilot extensions in a relatable business environment.

### Prompts that work in the completed solution

  * what trey projects am i assigned to?
    (NOTE: When authentication is "none" or "API key", the logged in user is assumed to be consultant "Avery Howard". When OAuth is enabled, the logged in user is mapped to user ID 1 in the database, so you will have Avery's projects, etc.)
  * what trey projects is domi working on?
  * do we have any trey consultants with azure certifications?
  * what trey projects are we doing for relecloud?
  * which trey consultants are working with woodgrove bank?
  * in trey research, how many hours has avery delivered this month?
  * please find a trey consultant with python skills who is available immediately
  * are any trey research consultants available who are AWS certified? (multi-parameter!)
  * does trey research have any architects with javascript skills? (multi-parameter!)
  * what trey research designers are working at woodgrove bank? (multi-parameter!)
   * please charge 10 hours to woodgrove bank in trey research (POST request)
   * please add sanjay to the contoso project for trey research (POST request with easy to forget entities, hoping to prompt the user; for now they are defaulted)

If the sample files are installed and accessible to the logged-in user,

   * find my hours spreadsheet and get the hours for woodgrove, then bill the client
   * make a list of my projects, then write a summary of each based on the statement of work.

## API Plugin Features

The sample aims to showcase the following features of an API plugin used within a Copilot declarative agent:

  1. API plugin works with any platform that supports REST requests
  1. Construct queries for specific data using GET requests
  1. Multi-parameter queries
  1. Allow updating and adding data using POST requests
  1. Prompt users before POSTing data; capture missing parameters
  1. Invoke from Declarative Copilot, allowing general instructions and knowledge, and removing the need to name the plugin on every prompt
  1. Display rich adaptive cards
  1. Entra ID login with /me path support
