# Lab M3 - Enhance plugin with new search command

In this lab, you will enhance the Northwind plugin by adding a new command. While the current message extension effectively provides information about products within the Northwind inventory database, it does not provide information related to Northwind’s customers. Your task is to introduce a new command associated with an API call that retrieves products ordered by a customer name specified by the user. 

???+ "Navigating the Extend Teams Message Extension labs (Extend Path)"
    - [Lab M0 - Prerequisites](/copilot-camp/pages/extend-message-ext/00-prerequisites) 
    - [Lab M1 - Get to know Northwind message extension](/copilot-camp/pages/extend-message-ext/01-nw-teams-app) 
    - [Lab M2 - Run app in Microsoft 365 Copilot](/copilot-camp/pages/extend-message-ext/02-nw-plugin) 
    - [Lab M3 - Enhance plugin with new search command](/copilot-camp/pages/extend-message-ext/03-enhance-nw-plugin)(📍You are here)
    - [Lab M4 - Add authentication](/copilot-camp/pages/extend-message-ext/04-add-authentication) 
    - [Lab M5 - Enhance plugin with an action command](/copilot-camp/pages/extend-message-ext/05-add-action) 

!!! tip "NOTE"
    The completed exercise with all of the code changes can be downloaded [from here](https://github.com/microsoft/copilot-camp/tree/main/src/extend-message-ext/Lab03-Enhance-NW-Teams/Northwind/). This can be useful for troubleshooting purposes.
    If you ever need to reset your edits, you can clone again the repository and start over.



## Exercise 1 - Code changes

### Step 1 -  Extend the Message Extension / plugin User Interface 

In your working directory called **Northwind** from previous lab , open **manifest.json** in the  **appPackage** folder.
Look for discountSearch in the commands array. After the closing braces of the discountSearch command, add a comma ,. Then, copy the companySearch command snippet and add it to the commands array.

```json
{
    "id": "companySearch",
    "context": [
        "compose",
        "commandBox"
    ],
    "description": "Given a company name, search for products ordered by that company",
    "title": "Customer",
    "type": "query",
    "parameters": [
        {
            "name": "companyName",
            "title": "Company name",
            "description": "The company name to find products ordered by that company",
            "inputType": "text"
        }
    ]
}
```
!!! tip "COMMAND_ID"
    The "id" is the connection between the UI and the code. This value is defined as COMMAND_ID in the discount/product/SearchCommand.ts files. See how each of these files has a unique COMMAND_ID that corresponds to the value of "id".

### Step 2 - Implement Product Search by Company
 You will implement a product search by Company name and return a list of the company's ordered products. Find this information using the tables below:

| Table         | Find        | Look Up By    |
| ------------- | ----------- | ------------- |
| Customer      | Customer Id | Customer Name |
| Orders        | Order Id    | Customer Id   |
| OrderDetail | Product       | Order Id      |

Here's how it works: 
Use the Customer table to find the Customer Id with the Customer Name. Query the Orders table with the Customer Id to retrieve the associated Order Ids. For each Order Id, find the associated products in the OrderDetail table. Finally, return a list of products ordered by the specified company name.

Open **.\src\northwindDB\products.ts**

Update the `import` statement on line 1 to include OrderDetail, Order and Customer. It should look as follows
```javascript
import {
    TABLE_NAME, Product, ProductEx, Supplier, Category, OrderDetail,
    Order, Customer
} from './model';
```
Add the new function `searchProductsByCustomer()` as in the below snippet, right after the `import { getInventoryStatus } from '../adaptiveCards/utils';`import statement.

```javascript
export async function searchProductsByCustomer(companyName: string): Promise<ProductEx[]> {

    let result = await getAllProductsEx();

    let customers = await loadReferenceData<Customer>(TABLE_NAME.CUSTOMER);
    let customerId="";
    for (const c in customers) {
        if (customers[c].CompanyName.toLowerCase().includes(companyName.toLowerCase())) {
            customerId = customers[c].CustomerID;
            break;
        }
    }
    
    if (customerId === "") 
        return [];

    let orders = await loadReferenceData<Order>(TABLE_NAME.ORDER);
    let orderdetails = await loadReferenceData<OrderDetail>(TABLE_NAME.ORDER_DETAIL);
    // build an array orders by customer id
    let customerOrders = [];
    for (const o in orders) {
        if (customerId === orders[o].CustomerID) {
            customerOrders.push(orders[o]);
        }
    }
    
    let customerOrdersDetails = [];
    // build an array order details customerOrders array
    for (const od in orderdetails) {
        for (const co in customerOrders) {
            if (customerOrders[co].OrderID === orderdetails[od].OrderID) {
                customerOrdersDetails.push(orderdetails[od]);
            }
        }
    }

    // Filter products by the ProductID in the customerOrdersDetails array
    result = result.filter(product => 
        customerOrdersDetails.some(order => order.ProductID === product.ProductID)
    );

    return result;
}
```



### Step 3: Create a handler for the new command

In VS Code, duplicate the **productSearchCommand.ts** file located in the **src/messageExtensions** folder. Then, rename the copied file to "customerSearchCommand.ts"

Change value of COMMAND_ID constant to:
```javascript
const COMMAND_ID = "companySearch";
```
Replace below import statement from: 

```JavaScript
import { searchProducts } from "../northwindDB/products";`
```
to 

```JavaScript
import { searchProductsByCustomer } from "../northwindDB/products";
```

Inside the existing brackets of **handleTeamsMessagingExtensionQuery** , replace exisiting code with below snippet:

```javascript
 
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

```


### Step 4 - Update the command routing
In this step you will route the `companySearch` command to the handler you implemented in the previous step.

Open **searchApp.ts** in the **src** folder and add the following import statement: 

```javascript
import customerSearchCommand from "./messageExtensions/customerSearchCommand";
```

In the switch statement of the handler function `handleTeamsMessagingExtensionQuery` add another case statement as below:

```javascript
      case customerSearchCommand.COMMAND_ID: {
        return customerSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      }
```

!!! tip "Note"
    in the UI-based operation of the Message Extension / plugin, this command is explicitly called. However, when invoked by Microsoft 365 Copilot, the command is triggered by the Copilot orchestrator.

## Exercise 2 - Run the App! Search for product by company name

Now you're ready to test the sample as a plugin for Microsoft 365 Copilot.

### Step 1: Run the updated app locally

Stop the local debugger if it is kept running. Since you have updated the manifest with a new command, you will want to re install the app with the new package. 
Update the manifest version in the **manifest.json** file inside the **appPackage** folder from "1.0.9" to "1.0.10". This ensurers the new changes of the app is refelected. 

Restart debugger by clicking F5, or click the start button 1️⃣. You will have an opportunity to select a debugging profile; select Debug in Teams (Edge) 2️⃣ or choose another profile.

![Run application locally](../../assets/images/extend-message-ext-01/02-02-Run-Project-01.png)

The debugging will open teams in a browser window. Make sure you login using the same credentials you signed into Agents Toolkit.
Once you're in, Microsoft Teams should open up and display a dialog offering to open your application. 

![Open](../../assets/images/extend-message-ext-01/nw-open.png)

Once opened it immediately ask you where you want to open the app in. By default it's personal chat. You could also select it in a channel or group chat as shown. Select "Open".

![Open surfaces](../../assets/images/extend-message-ext-01/nw-open-2.png)

Now you are in a personal chat with the app. But we are testing in Copilt so follow next instruction. 


In Teams click on **Chat** and then **Copilot**. Copilot should be the top-most option.
Click on the **Plugin icon** and select **Northwind Inventory** to enable the plugin.

### Step 2: Test with new command in Copilot

Enter the prompt: 

*What are the products ordered by 'Consolidated Holdings' in Northwind Inventory?*

The Terminal output shows Copilot understood the query and executed the `companySearch` command, passing company name extracted by Copilot.
![03-07-response-customer-search](../../assets/images/extend-message-ext-03/03-08-terminal-query-output.png)

Here's the output in Copilot:
![03-07-response-customer-search](../../assets/images/extend-message-ext-03/03-07-response-customer-search.png)

Here is another prompt to try:

*What are the products ordered by 'Consolidated Holdings' in Northwind Inventory? Please list the product name, price and supplier in a table.*

### Step 3: Test the command as Message extension (Optional)

Of course, you can test this new command also by using the sample as a Message Extension, like we did in previous lab.

1. In the Teams sidebar, move to the **Chats** section and pick any chat or start a new chat with a colleague.
2. Click on the + sign to access to the Apps section.
3. Pick the Northwind Inventory app.
4. Notice how now you can see a new tab called **Customer**.
5. Search for **Consolidated Holdings** and see the products ordered by this company. They will match the ones that Copilot returned you in the previous step.

![The new command used as a message extension](../../assets/images/extend-message-ext-03/03-08-customer-message-extension.png)

<cc-next />

## Congratulations
You are now a plugin champion. You are now ready to secure your plugin with authentication. Proceed to the next lab. Select "Next"

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/extend-message-ext/03-enhance-nw-plugin" />