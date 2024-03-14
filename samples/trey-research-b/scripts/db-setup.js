const { TableClient, TableServiceClient } = require("@azure/data-tables");
const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");
const { json } = require("stream/consumers");

(async () => {

    if (process.argv.length < 3) {
        console.log("Usage: node db-setup.js <connectionString> [--reset|-r]");
        console.log("  connectionString: The connection string to the Azure Storage account. If not provided, the Azure Storage Emulator will be used.");
        console.log("  --reset, -r: If provided, all tables will be deleted before creating new tables.");
        process.exit(1);
    }
    let connectionString = "UseDevelopmentStorage=true";
    let reset = false;
    if (process.argv[2] && [process.argv[2] === "--reset" || process.argv[2] === "-r"]) {
        reset = true;
        connectionString = process.argv[3] ? process.argv[3] : "UseDevelopmentStorage=true";
    } else if (process.argv[3] && [process.argv[3] === "--reset" || process.argv[3] === "-r"]) {
        reset = true;
        connectionString = process.argv[2] ? process.argv[2] : "UseDevelopmentStorage=true";
    }

    async function getTables(tableServiceClient) {
        let tables = [];
        for await (const table of tableServiceClient.listTables()) {
            tables.push(table.name)
        }
        return tables;
    }

    const tableServiceClient = TableServiceClient.fromConnectionString(connectionString);

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

    const tables = [ "Consultants", "Projects" ];
    const rowKeyColumnNames = ["id", "id"];

    tables.forEach(async (table, index) => {
        const tables = await getTables(tableServiceClient);
        if (tables.includes(table)) {
            console.log(`Table ${table} already exists, skipping...`);
            return;
        }

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

        const tableClient = TableClient.fromConnectionString(connectionString, table);
        const jsonString = fs.readFileSync(path.resolve(__dirname, "db", `${table}.json`), "utf8");
        const entities = JSON.parse(jsonString);

        for (const entity of entities[table]) {
            const rowKeyColumnName = rowKeyColumnNames[index];
            const rowKey = rowKeyColumnName ? entity[rowKeyColumnName].toString() : randomUUID();
            // Convert any nested objects to JSON strings
            for (const key in entity) {
                if (typeof(entity[key] === "object")) {
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