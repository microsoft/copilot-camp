# Build SharePoint Copilot Apps

Microsoft 365 Copilot excels at language, yet plenty of daily work goes beyond text. Approving an expense, reviewing your remaining leave, or reserving a desk are all tasks you would rather complete visually than explain through a chat exchange. **SharePoint Copilot Apps** make this possible by surfacing rich, interactive UX components inside the Copilot canvas, exactly when and where you need them.

SharePoint Copilot Apps are built with the [SharePoint Framework](https://aka.ms/spfx){target=_blank} (SPFx) as a new kind of client-side component, the **Copilot Component**, introduced with the public preview of SPFx v1.24. They implement the [MCP apps model](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-mcp-apps){target=_blank}, so you build on an open, interoperable foundation. The key difference from the typical MCP apps model is that **hosting and tool routing are automatic**: your UX component is hosted in your Microsoft 365 tenant and requests are routed to the right tool for you. You bring the component, the platform handles the rest.

For developers, the value is that you only have to focus on one thing: **building your UX component** with the JavaScript stack you already know. SPFx supports any library or framework you choose, such as React, Angular, Vue, Svelte, or plain TypeScript, with React being the most common choice. There is no proprietary platform to learn, no infrastructure to stand up on Azure, and the enterprise-grade security, compliance, and governance of the SharePoint platform come built in. Even better, the same component is not tied to a single surface: write it once and reuse it across Microsoft 365, in Copilot, in SharePoint, and in Microsoft Teams, and more.

The scenarios you can address are almost anything you have previously surfaced in a SharePoint portal or as a Microsoft Teams personal app:

- **Line of Business (LOB) agents**: bring LOB data into the canvas, from sales dashboards and charts to time off, help desk, expenses, and bookings.
- **Corporate Communications and Services agents**: turn intranet experiences into components, like tailored news, personal dashboards, and onboarding tasks.
- **Management and Governance agents**: streamline admin work such as site provisioning, policy enforcement, and governance dashboards.

In this path you will learn how to design, build, test, and deploy your SharePoint Copilot Apps, from scaffolding the SPFx Copilot Component to using it inside Microsoft 365 Copilot.

!!! note
    SharePoint Copilot Apps are available in **public preview**, alongside the public preview of SharePoint Framework (SPFx) v1.24. Some tooling, packaging, and admin surfaces may still change before General Availability.

<hr />

## <a href="./01-first-copilot-app">Start here</a> with Lab SCA1, where you'll create and deploy your first SharePoint Copilot App.
<cc-next url="./01-first-copilot-app" />

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/sharepoint/sharepoint-copilot-apps/index" />
