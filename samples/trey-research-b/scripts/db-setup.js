const { TableClient, TableServiceClient } = require("@azure/data-tables");
const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");

// Import these tables from JSON files
const TABLE_NAMES = ["Consultants", "Projects", "Assignments"];
// Use this JSON property for the rowkey. If not provided, a random UUID will be used.
const ROWKEY_PROPERTY = ["id", "id", "id"];

(async () => {

    // Handle command line arguments and get the table service client
    let connectionString = "UseDevelopmentStorage=true";
    let reset = false;
    if (process.argv[2] && [process.argv[2] === "--reset" || process.argv[2] === "-r"]) {
        reset = true;
        connectionString = process.argv[3] ? process.argv[3] : "UseDevelopmentStorage=true";
    } else if (process.argv[3] && [process.argv[3] === "--reset" || process.argv[3] === "-r"]) {
        reset = true;
        connectionString = process.argv[2] ? process.argv[2] : "UseDevelopmentStorage=true";
    }
    const tableServiceClient = TableServiceClient.fromConnectionString(connectionString);

    // Function returns an array of table names in the storage account
    async function getTables(tableServiceClient) {
        let tables = [];
        for await (const table of tableServiceClient.listTables()) {
            tables.push(table.name)
        }
        return tables;
    }

    // If reset is true, delete all tables
    if (reset) {
        const tables = await getTables(tableServiceClient);
        tables.forEach(async table => {
            const tableClient = TableClient.fromConnectionString(connectionString, table);
            console.log(`Deleting table: ${table}`);
            await tableClient.deleteTable();
        });
        let tablesExist = true;
        while (tablesExist) {
            console.log("Waiting for tables to be deleted...");
            const tables = await getTables(tableServiceClient);
            if (tables.length === 0) {
                tablesExist = false;
                console.log("All tables deleted.");
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Create and populate tables
    TABLE_NAMES.forEach(async (table, index) => {

        // Skip if table already exists
        const tables = await getTables(tableServiceClient);
        if (tables.includes(table)) {
            console.log(`Table ${table} already exists, skipping...`);
            return;
        }

        // Create table if needed
        console.log(`Creating table: ${table}`);
        let tableCreated = false;
        while (!tableCreated) {
            try {
                await tableServiceClient.createTable(table);
                tableCreated = true;
            } catch (err) {
                if (err.statusCode === 409) {
                    console.log('Table is marked for deletion, retrying in 5 seconds...');
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } else {
                    throw err;
                }
            }
        }

        // Add entities to table
        const tableClient = TableClient.fromConnectionString(connectionString, table);
        const jsonString = fs.readFileSync(path.resolve(__dirname, "db", `${table}.json`), "utf8");
        const entities = JSON.parse(jsonString);

        for (const entity of entities[table]) {
            const rowKeyColumnName = ROWKEY_PROPERTY[index];
            const rowKey = rowKeyColumnName ? entity[rowKeyColumnName].toString() : randomUUID();
            // Convert any nested objects to JSON strings
            for (const key in entity) {
                if (typeof (entity[key] === "object")) {
                    entity[key] = JSON.stringify(entity[key]);
                }
            }
            await tableClient.createEntity({
                partitionKey: table,
                rowKey,
                ...entity
            });

            console.log(`Added entity to ${table} with key ${rowKey}`);

        }
    });

})();