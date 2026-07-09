# Lab SCA1 - Build your first SharePoint Copilot App

In this lab, you are going to build your first **SharePoint Copilot App**: an interactive UX component that renders directly inside the Microsoft 365 Copilot canvas. You will use the [SharePoint Framework](https://aka.ms/spfx){target=_blank} (SPFx) v1.24 public preview and the new **Copilot Component** project type, build the user experience with **React**, add custom parameters, test everything locally in the **Copilot Workbench**, and finally package and deploy the solution so you can use it from **Microsoft 365 Copilot**.

!!! warning
    SharePoint Copilot Apps and SharePoint Framework v1.24 are in **public preview**. The generator output, the Copilot Workbench, the app-catalog **Add to Teams** flow, and the admin-center surfaces may still change before General Availability.

!!! note
    This lab builds on general SPFx knowledge. You do not need previous SPFx experience, but familiarity with Node.js, TypeScript, and React will be helpful.

In this lab you will learn:

- How to set up a SharePoint Framework development environment and install the SPFx v1.24 public preview
- How to scaffold a SharePoint Copilot App using React
- How to explore and customize the scaffolded React component
- How to add custom parameters that Copilot passes to your component
- How to test a Copilot Component locally with the Copilot Workbench
- How to package and deploy the app, add it to Teams, and use it in Microsoft 365 Copilot

## Exercise 1 : Setting up the SharePoint Framework development environment

In this exercise you are going to prepare your machine to build SharePoint Copilot Apps and install the SPFx v1.24 public preview toolchain.

### Step 1: Installing the base prerequisites

SharePoint Copilot Apps are built with the SharePoint Framework, so you first need a standard SPFx development environment. Follow the official documentation to [set up your SharePoint Framework development environment](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment){target=_blank}.

At minimum, make sure you have:

- [Node.js v22 LTS](https://nodejs.org/en){target=_blank} (SPFx v1.24 requires Node.js `>=22.14.0 <23.0.0`)
- [Visual Studio Code](https://code.visualstudio.com/){target=_blank}
- A Microsoft 365 tenant with a **SharePoint App Catalog** site and Microsoft 365 Copilot enabled

!!! important
    In order to use the SharePoint Copilot Apps in Microsoft 365 Copilot, you don't need a Microsoft 365 Copilot license.

You can verify your Node.js version with the following command:

```console
node --version
```

The output should be a `v22.x.x` value.

!!! tip "Get a free development tenant"
    If you don't have a tenant, you can get a free Microsoft 365 development tenant by joining the [Microsoft 365 developer program](https://aka.ms/o365devprogram){target=_blank}.

<cc-end-step lab="sca1" exercise="1" step="1" />

### Step 2: Installing the SPFx v1.24 public preview toolchain

SPFx v1.24 uses the **Heft** build system and ships the new Copilot Component project type. Install Yeoman, the Heft CLI, and the SPFx generator from the `@next` tag, which points to the public preview build.

```console
npm install -g yo
npm install -g @rushstack/heft
npm install -g @microsoft/generator-sharepoint@next
```

Verify that the generator resolved to a `1.24.x` preview version:

```console
npm list -g @microsoft/generator-sharepoint
```

You should see a version similar to `@microsoft/generator-sharepoint@1.24.0-beta.2`.

!!! info "Why the `@next` tag"
    The **Copilot Component** project type only exists in the SPFx v1.24 preview. Installing the plain `@microsoft/generator-sharepoint` (latest) tag would give you an older generator that does not offer the Copilot Component option. Always use `@next` while the feature is in preview.

<cc-end-step lab="sca1" exercise="1" step="2" />

## Exercise 2 : Scaffolding your first SharePoint Copilot App

In this exercise you are going to scaffold a new SharePoint Copilot App using the SPFx generator, selecting React as the UI framework.

### Step 1: Running the generator

Create a new folder for your solution and run the SPFx generator from the `@next` tag:

```console
md hello-copilot-app
cd hello-copilot-app
yo @microsoft/sharepoint@next
```

Answer the interactive prompts as follows:

| Prompt | Answer |
| --- | --- |
| **What is your solution name?** | `hello-copilot-app` |
| **Which type of client-side component to create?** | **Copilot Component** |
| **What is your Copilot component name?** | `HelloWorld` |
| **Which template would you like to use?** | **React** |

When the generator finishes, it installs the npm dependencies for you. Open the newly created solution in Visual Studio Code:

```console
code .
```

!!! note
    Selecting **React** wires up React 17 and Fluent UI v9 as dependencies and scaffolds the component with a React entry point instead of the plain TypeScript template. This is the recommended choice for building rich UX components.

<cc-end-step lab="sca1" exercise="2" step="1" />

### Step 2: Reviewing the scaffolded solution

Take a moment to explore the generated project. The most relevant elements are:

- `config/`: SPFx build configuration.
    - `config.json`: the bundle map that points to your component entry point and manifest.
    - `package-solution.json`: the `.sppkg` package definition (solution id, feature, package version, etc.).
    - `copilot-agent.json`: the Copilot-specific file that declares the agent and lists the component GUIDs it exposes.
- `copilot/`: the declarative agent and Teams app seed that gets packaged into the deployable agent. If you have already built pro-code declarative agents with the Microsoft 365 Agents Toolkit, these files will look familiar, as they follow the same declarative agent authoring model.
    - `manifest.json`: the **Microsoft 365 app manifest**. It describes the app metadata (id, name, version, developer information, icons) and, through its `copilotAgents.declarativeAgents` section, points to the `declarativeAgent.json` file. This is the entry point that Microsoft 365 uses to register and surface the declarative agent that sits behind the scenes of your SharePoint Copilot App.
    - `declarativeAgent.json`: the **declarative agent manifest**. It defines the agent itself, including its display name, description, the instructions it follows, the conversation starters, and the capabilities and actions it exposes. Here it references the `instruction.txt` file for the system prompt and the `ai-plugin.json` file for the actions (tools) the agent can invoke.
    - `instruction.txt`: the **system prompt** (also known as the instructions) for the declarative agent. It steers the tone, behavior, and boundaries of the agent, telling the orchestrator how to respond and when to call the available tools. Keeping the instructions in a dedicated file makes them easier to iterate on.
    - `ai-plugin.json`: the **API plugin manifest** that declares the functions (tools) the agent can call, together with their parameters and descriptions. For a SharePoint Copilot App, this is where the UX component's tool, such as `HelloWorldTool`, is described so the orchestrator knows how and when to invoke it.
    - `color.png` and `outline.png`: the **app icons** referenced by `manifest.json`. `color.png` is the full-color icon shown in the agent store and the app bar, while `outline.png` is the monochrome outline icon used in places like the Teams rail.
- `src/copilotComponents/helloWorld/`: the component source. Because you chose the **React** template, the generator already scaffolds a working, React-based component for you.
    - `HelloWorldCopilotComponent.tsx`: the component class, which extends `BaseCopilotComponent`. Note that it is already a `.tsx` file, since it mounts a React tree.
    - `HelloWorldCopilotComponentProperties.ts`: the Zod schema that defines the tool's parameters. Out of the box it declares a single `message` parameter.
    - `HelloWorldCopilotComponent.manifest.json`: the client-side component manifest (id, `copilotType`, `tools`).
    - `components/HelloWorld.tsx`: the React function component that renders the UI with Fluent UI v9.
    - `components/IHelloWorldProps.ts`: the props contract passed from the component class to the React component.
    - `loc/en-us.js` and `loc/mystrings.d.ts`: the localized UI strings and their type definitions.

Open `src/copilotComponents/helloWorld/HelloWorldCopilotComponent.manifest.json` and note the `tools` array. The generator minted a tool named `HelloWorldTool`, together with a component `id` (a GUID) that is also referenced from `config/copilot-agent.json`. Keep these identifiers consistent whenever you hand-edit the project.

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx/client-side-component-manifest.schema.json",
  "id": "3bc284b8-d7c7-4321-a1fd-4abaae7950c3",
  "alias": "HelloWorldCopilotComponent",
  "componentType": "CopilotComponent",
  "copilotType": "Ux",
  "version": "*",
  "manifestVersion": 2,

  "capabilities": {
    "availableDisplayModes": ["inline", "fullscreen"]
  },

  "tools": [
    {
      "name": "HelloWorldTool",
      "description": {
        "default": "HelloWorld description"
      },
      "propertiesSchema": {
        "id": "$../../../lib/copilotComponents/helloWorld/HelloWorldCopilotComponentProperties.js:default;"
      }
    }
  ]
}
```

!!! tip
    The generated `id` is a unique GUID minted for your component, so the value you see in your own project will differ from the one shown above. The same GUID appears in `config/copilot-agent.json`, which is how the agent knows which component to expose.

<cc-end-step lab="sca1" exercise="2" step="2" />

## Exercise 3 : Exploring and customizing the React component

In this exercise you are going to explore the React component that the generator scaffolded for you, then customize it to render a friendlier, well-formatted hello world message.

### Step 1: Understanding the generated component

Open `src/copilotComponents/helloWorld/HelloWorldCopilotComponent.tsx`. This is the component class that the Copilot host loads, and it acts as a thin host adapter. In `onInit()` it fetches the signed-in user from Microsoft Graph (`/me`) and the site title from the SharePoint REST API (`/_api/web`), both through **brokered SSO** with no token code required. In `render()` it mounts the React tree, passing down the tool `message`, the fetched data, the `hostContext`, and the host `bridge`:

```tsx
  protected render(): void {
    const props: IHelloWorldProps = {
      message: this.properties.message,
      userDisplayName: this._userDisplayName,
      siteTitle: this._siteTitle,
      siteUrl: this._siteUrl,
      hostContext: this.hostContext,
      bridge: this.context.copilotBridge,
      targetDocument: this.context.domElement.ownerDocument,
      strings
    };

    ReactDOM.render(React.createElement(HelloWorld, props), this.context.domElement);
  }
```

The actual UI lives in `components/HelloWorld.tsx`. The generated component wraps its content in a Fluent UI `<FluentProvider>` whose theme is derived from `hostContext.theme` (`light` or `dark`), renders a greeting `Card` with the user name and message, shows badges for the site, theme, and display mode, and includes buttons that exercise the host **bridge**: switching to fullscreen, opening a link, sending a follow-up message into the conversation, and resizing the component.

Its props contract is defined in `components/IHelloWorldProps.ts`, and the UI labels come from `loc/en-us.js`.

!!! info "The host bridge"
    The `bridge` object (`ISPCopilotBridge`) is how a component talks back to the Copilot host: `requestDisplayModeAsync`, `openLinkAsync`, `sendFollowUpMessageAsync`, and `requestSizeChangeAsync`. Combined with `hostContext`, it lets the same component adapt to inline or fullscreen rendering and drive the surrounding conversation.

<cc-end-step lab="sca1" exercise="3" step="1" />

### Step 2: Customizing the greeting

Let's give the greeting a friendlier, more polished look. First, open `src/copilotComponents/helloWorld/loc/en-us.js` and update the `GreetingPrefix` string:

```javascript
    "GreetingPrefix": "👋 Hello",
```

Then open `components/HelloWorld.tsx` and locate the `<CardHeader ... />` element in the returned JSX. Update it so the message is emphasized and the greeting reads more naturally:

```tsx
            <CardHeader
              header={<Title3>{strings.GreetingPrefix} {userDisplayName}!</Title3>}
              description={<Body1><strong>{message}</strong></Body1>}
            />
```

Save your changes. You will see the customized greeting when you run the component in the Copilot Workbench in Exercise 5.

!!! tip
    Because the labels live in `loc/en-us.js`, changing UI text does not require touching the React component. Add a matching entry to `loc/mystrings.d.ts` whenever you introduce a brand-new string key.

<cc-end-step lab="sca1" exercise="3" step="2" />

## Exercise 4 : Adding custom parameters to the component

In this exercise you are going to add custom parameters to your component. These parameters become **tool arguments** that Copilot fills in from the user's prompt and passes to your component at runtime.

### Step 1: Defining the properties schema

Open `src/copilotComponents/helloWorld/HelloWorldCopilotComponentProperties.ts`. The properties are defined with [Zod](https://zod.dev){target=_blank} and exported as a JSON Schema via `zod-to-json-schema`. Every field you add, together with its `.describe()` text, is surfaced to Copilot as a tool parameter. The generated schema declares a single `message` parameter:

```typescript
const propertiesSchema = z.object({
  message: z.string().describe('A message to display.')
});
```

Extend it with an `accentColor` parameter, so Copilot can pass an accent color extracted from the user's prompt:

```typescript
const propertiesSchema = z.object({
  message: z.string().describe('A message to display.'),
  accentColor: z
    .string()
    .optional()
    .describe('An optional accent color for the greeting card, for example "#0f6cbd" or "green".')
});
```

!!! warning "Avoid unsupported JSON Schema keywords"
    The SPFx packaging step only forwards a subset of JSON Schema. Avoid constraint keywords such as `.min()`, `.max()`, `.regex()`, and `.default()` on your Zod schema, since they leak into the plugin manifest as `minItems`, `maxItems`, `pattern`, or `default` and are rejected during validation. Enforce those constraints at runtime inside your component instead.

!!! warning "Only properties of type `string` are supported"
    At the moment, only properties of type `string` are supported. If you need to support different data types like `boolean`, `date`, etc. handle them as strings in the properties file and in Zod implementation. Enforce the actual data type at runtime inside your component.

<cc-end-step lab="sca1" exercise="4" step="1" />

### Step 2: Using the parameter in the component

First, add the new parameter to the props contract in `components/IHelloWorldProps.ts`. Add the following field to the `IHelloWorldProps` interface:

```typescript
  /** Optional accent color for the greeting card. */
  accentColor?: string;
```

Then pass it down in the `render()` method of `HelloWorldCopilotComponent.tsx`, alongside the other properties:

```tsx
    const props: IHelloWorldLabProps = {
      message: this.properties.message,
      accentColor: this.properties.accentColor,
      userDisplayName: this._userDisplayName,
      siteTitle: this._siteTitle,
      siteUrl: this._siteUrl,
      hostContext: this.hostContext,
      bridge: this.context.copilotBridge,
      onRequestDisplayMode: async (mode: SPCopilotDisplayMode) => {
        await this.requestDisplayModeAsync(mode);
      },
      onRequestSizeChange: async (width: number, height: number) => {
        await this.requestSizeChangeAsync(width, height);
      },
      targetDocument: this.context.domElement.ownerDocument,
      strings
    };
```

Finally, use the parameter in `components/HelloWorld.tsx`. Add `accentColor` to the props destructured at the top of the component, compute a fallback color, and apply it as a left border on the greeting `Card`:

```tsx
  const {
    message, userDisplayName, siteTitle, siteUrl, hostContext,
    bridge, onRequestDisplayMode, onRequestSizeChange, strings, 
    accentColor
  } = props;
  const styles = useStyles();

  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  const theme = hostContext.theme === 'dark' ? webDarkTheme : webLightTheme;
  const accent: string = accentColor || tokens.colorBrandBackground;
```

Then apply the accent to the `Card` in the returned JSX:

```tsx
          <Card style={{ borderLeft: `6px solid ${accent}` }}>
```

Save your changes. Copilot will now be able to fill the `accentColor` argument from a user prompt, and your component will color the greeting card accordingly.

<cc-end-step lab="sca1" exercise="4" step="2" />

### Step 3: Updating the declarative agent instructions and conversation starter

The `copilot/` folder defines the declarative agent that fronts your component. Let's tailor its instructions and its conversation starter so the agent knows about your tool and offers a ready-made prompt.

First, open `copilot/declarativeAgent.json` and replace the default `conversation_starters` entry with a new one that invokes your tool:

```json
  "conversation_starters": [
    {
      "title": "HelloWorld Tool",
      "text": "Run the HelloWorldTool with the message \"Welcome to Copilot Apps\" using a green accent"
    }
  ],
```

Then open `copilot/instruction.txt` and replace its content with the following instructions, which describe the agent and tell it when to call your tool:

```text
You are the HelloWorld Agent — an SPFx CopilotComponent deployed as a Microsoft 365 Copilot declarative agent.
When the user asks you to perform an action, call the HelloWorldTool providing the input parameters defined by the user in the prompt.
```

!!! info
    The `instructions` property in `declarativeAgent.json` references this file through the `$[file('instruction.txt')]` macro, so keeping the system prompt in `instruction.txt` lets you iterate on the agent's behavior without touching the agent manifest.

<cc-end-step lab="sca1" exercise="4" step="3" />

## Exercise 5 : Testing the solution locally with the Copilot Workbench

In this exercise you are going to run your component locally and test it in the **Copilot Workbench**, which hosts the same host-to-component contract that Copilot uses in production.

### Step 1: Starting the local dev server

From the project root, start the Heft dev server:

```console
heft start --nobrowser --clean
```

| Flag | Why |
| --- | --- |
| `--nobrowser` | The scaffolded `serve.json` points at the **classic** workbench, which cannot host a Copilot Component. You will open the Copilot Workbench yourself. |
| `--clean` | Clears the `temp/` folder so a stale bundle from a previous run is not served. |

Leave this process running. It watches your source, rebuilds on save, and serves the output over HTTPS on port `4321`.

!!! tip
    If the browser blocks the local bundle, open `https://localhost:4321/temp/build/manifests.js` once and accept the developer certificate, then reload.

<cc-end-step lab="sca1" exercise="5" step="1" />

### Step 2: Loading the component in the Copilot Workbench

Open the Copilot Workbench on your SharePoint tenant by navigating to the `CopilotWorkbench.aspx` page available at the following URL:

```text
https://<your-tenant>.sharepoint.com/_layouts/15/CopilotWorkbench.aspx
```

Then:

1. In the left panel you see a section with title **ADD A TURN** and you should be able to see your component available right after the **Select a component** text.
2. Select your component and edit the component **properties** in the JSON editor to try your parameters, for example:
```json
{
  "message": "Great to see SharePoint Copilot Apps in action!",
  "accentColor": "#107c10"
}
```
3. Select the command **Fire turn** to start rendering the component in the Workbench.
4. When the component load for the first time, SharePoint shows the **Load debug scripts** prompt, select to load debug scripts to run your component.

!!! info "The Workbench is the host"
    While you debug, the Workbench plays the role of the host. In production, Copilot is the host. The same `↓`/`↑` messages you see here flow to and from Copilot once the app is deployed, so the Workbench lets you validate the contract before you ship.

<cc-end-step lab="sca1" exercise="5" step="2" />

## Exercise 6 : Packaging and deploying to Microsoft 365 Copilot

In this exercise you are going to package your solution, deploy it to the SharePoint app catalog, add it to Teams, and use it inside Microsoft 365 Copilot.

### Step 1: Packaging the solution

Stop the dev server (press `Ctrl+C`) and build the production package:

```console
npm run build
```

Internally the command relies on Heft to build and package a production version of the solution.

This produces two artifacts:

- `./sharepoint/solution/hello-copilot-app.sppkg`: the deployable SharePoint package, which contains both your component bundle and the declarative agent.
- `./teams/helloworld-agent.zip`: the declarative agent (Teams app) on its own.

Before deploying, **validate the declarative agent zip**. The Heft pipeline does not validate it, and a malformed zip only fails later, with a misleading error, during **Add to Teams**. Install the Microsoft 365 Agents Toolkit CLI and run the validator:

```console
npm install -g @microsoft/m365agentstoolkit-cli
atk validate --package-file ./teams/helloworld-agent.zip
```

Fix any reported errors before continuing. A clean run reports `0 errors`.

!!! info "False positive during validation"
    During the preview phase of the Copilot Apps in SharePoint Framework 1.24 you might see an error like: `Error: InvalidDeclarativeCopilotDocument: Invalid Declarative Agent Document: declarativeAgent.json. Problems discovered: url in RemoteMCPServerRuntimeSpec is not a valid absolute URL. at (ai-plugin.json: #/runtimes/0/spec/url)`.
    If that is the case, never mind that's a false positive and you can simply ignore it.

<cc-end-step lab="sca1" exercise="6" step="1" />

### Step 2: Deploying to the SharePoint app catalog and adding to Teams

Open your **tenant app catalog** app-management page, for example:

```text
https://<your-tenant>.sharepoint.com/sites/appcatalog/_layouts/15/tenantAppCatalog.aspx/manageApps
```

Then:

1. Upload or drag in `./sharepoint/solution/hello-copilot-app.sppkg`.
2. In the trust dialog, choose **Enable this app and add it to all sites**. This tenant-wide enablement is **required** for the next step.
3. After upload, confirm the app row shows **State = Enabled** and **Added to all sites = Yes**.
4. Select the app row and click **Add to Teams**. SharePoint extracts the bundled agent (the previously generated .ZIP file) and publishes it to the Teams Apps store as a declarative agent.

You can verify the agent appears in the admin centers:

- **Teams admin center → Manage apps**, filtered by the agent name (for example **HelloWorld Agent**).
- **Microsoft 365 admin center → Agents → All agents**.

!!! warning "If Add to Teams fails"
    Teams may return a generic *"Couldn't add app to Teams, check your network connection and try again"* message. This is almost never a network problem, it is the platform's catch-all for a **malformed agent zip**. Re-run `atk validate` again on the loose `teams/helloworld-agent.zip` to check the manifest and to get the real diagnostics. Iterate until the **Add to Teams** action will be successful.

<cc-end-step lab="sca1" exercise="6" step="2" />

### Step 3: Using the app in Microsoft 365 Copilot

Open the [Microsoft 365 Admin Center on the agents page](https://admin.cloud.microsoft/?#/agents/all?search=hello) and search for any agent with **hello** in their name. You should be able to see the new `HelloWorld` agent that you just deployed. Select the agent, a side panel with detailed information about the agent shows up. You can check the name, version, publisher, etc. Select the **Data & Tools** tab, scroll down and double check that you see the tool with name `HelloWorldTool`.

Now install the agent with the following procedure:
1. Select the command with name **Install** in the upper right corner of the agent's panel. 
2. Select to install the agent for yourself with the `Just me` option of the field with label `Select users or groups who will have the agent pre-installed`. 
3. Select **Next**, review the list of permissions (should be empty), select **Next** again, and now select **Finish installation** to complete the installation. 
4. Now wait few seconds for the new settings to be applied.
5. When the installation is complete, select **Close** and also close the agent's panel.

You are now ready to use your agent in Microsoft 365 Copilot. Open Microsoft 365 Copilot chat at [https://m365.cloud.microsoft/chat](https://m365.cloud.microsoft/chat){target=_blank} and sign in with an account in the same tenant where you deployed the agent.

1. From the left navigation, select **More Agents** and scroll to the **Built by your org** group.
2. Find your agent (for example **HelloWorld Agent**), open it, and select **Open**. If you cannot find the agent, you can search for it by name (for example **HelloWorld Agent**) in the search box at the top of the page.
3. Invoke the tool with an explicit prompt that names it, so Copilot reliably routes the request to your component:

```text
Run the HelloWorldTool with the message "Welcome to Copilot Apps" using a green accent
```

4. The first time you invoke the agent, Copilot asks for consent. Select **Allow**.
5. Copilot calls `HelloWorldTool` and mounts your React component inline in the response, showing the formatted greeting card. The greeting uses your signed-in name (fetched from Microsoft Graph), together with the message and accent color the model extracted from your prompt.

This is the **same component and the same MCP contract** you debugged in the Workbench, only the host changed from the Workbench to Microsoft 365 Copilot.

!!! tip "Developer options"
    Copilot has a hidden developer mode that surfaces extra diagnostics while testing a component. Send `-developer on` as a prompt to enable it, and `-developer off` to turn it off. Once you enabled the developer mode, refresh the browser and invoke the agent tool again with the same prompt as before. You will be able to inspect additional debug information right after the response from the agent.

<cc-end-step lab="sca1" exercise="6" step="3" />

---

<span style="font-size: large; font-weight: bold; color: #1c8fd2;">CONGRATULATIONS!</span>

You have completed Lab SCA1 - Build your first SharePoint Copilot App!

In this lab, you learned how to:

- Set up a SharePoint Framework development environment and install the SPFx v1.24 public preview
- Scaffold a SharePoint Copilot App using React
- Explore and customize the scaffolded React component
- Add custom parameters that Copilot passes to your component as tool arguments
- Test a Copilot Component locally with the Copilot Workbench
- Package the solution, deploy it, add it to Teams, and use it in Microsoft 365 Copilot

You now have the foundation to build rich, interactive experiences that live directly in the Copilot canvas, reusing the SPFx skills and components your organization already knows.

<cc-award badgeId="SPFxCopilot" badgeName="SharePoint Copilot App Learner" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/sharepoint/sharepoint-copilot-apps/01-first-copilot-app" />
