import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Load environment variables (merge all files, .env.local.user takes precedence over .env.local, which takes precedence over .env)
const envLocalUserPath = path.join(__dirname, "../../../env/.env.local.user");
const envLocalPath = path.join(__dirname, "../../../env/.env.local");
const envPath = path.join(__dirname, "../../../env/.env");

// Load in reverse priority order (dotenv won't overwrite existing values)
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}
if (fs.existsSync(envLocalUserPath)) {
  dotenv.config({ path: envLocalUserPath, override: true });
}

interface ClaimAdjuster {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  area: string;
}

function getCountryFlag(country: string): string {
  const flags: { [key: string]: string } = {
    "Portugal": "🇵🇹",
    "Estonia": "🇪🇪",
    "Algeria": "🇩🇿",
    "Lithuania": "🇱🇹",
    "Turkey": "🇹🇷",
    "Thailand": "🇹🇭",
    "Ukraine": "🇺🇦",
    "United States": "🇺🇸",
    "Pakistan": "🇵🇰",
    "Luxembourg": "🇱🇺",
    "Kenya": "🇰🇪",
    "Nepal": "🇳🇵",
    "Hungary": "🇭🇺",
    "Ethiopia": "🇪🇹",
    "Belarus": "🇧🇾",
    "Poland": "🇵🇱",
    "Greece": "🇬🇷",
    "Netherlands": "🇳🇱",
    "Mongolia": "🇲🇳",
    "Sweden": "🇸🇪",
    "Israel": "🇮🇱",
    "Kyrgyzstan": "🇰🇬",
    "India": "🇮🇳"
  };
  return flags[country] || "🌐";
}

async function initializeData() {
  try {
    console.log("\n╔══════════════════════════════════════════════════════════════╗");
    console.log("║          Insurance MCP Server - Data Initialization         ║");
    console.log("╚══════════════════════════════════════════════════════════════╝\n");

    // Load configuration from environment variables
    const account = process.env.AZURE_STORAGE_ACCOUNT;
    const accountKey = process.env.SECRET_AZURE_STORAGE_KEY;
    const tableEndpoint = process.env.AZURE_TABLE_ENDPOINT;
    const tableName = process.env.TABLE_NAME;
    const allowInsecure = process.env.ALLOW_INSECURE_CONNECTION === "true";

    if (!account || !accountKey || !tableEndpoint || !tableName) {
      throw new Error("Missing required environment variables. Please check your env/.env file.");
    }

    console.log("⚙️  Configuration");
    console.log("─────────────────────────────────────────────────────────────");
    console.log(`   Storage Account: ${account}`);
    console.log(`   Table Endpoint: ${tableEndpoint}`);
    console.log(`   Table Name: ${tableName}`);
    console.log(`   Allow Insecure: ${allowInsecure}\n`);
    
    const credential = new AzureNamedKeyCredential(account, accountKey);
    const tableClient = new TableClient(
      tableEndpoint,
      tableName,
      credential,
      {
        allowInsecureConnection: allowInsecure
      }
    );

    // Delete table if it exists and recreate it
    console.log("📋 Table Setup");
    console.log("─────────────────────────────────────────────────────────────");
    console.log(`   Resetting table '${tableName}'...`);
    
    try {
      await tableClient.deleteTable();
      console.log(`   🗑️  Deleted existing table`);
      // Wait a moment for the delete operation to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      // Table doesn't exist, which is fine
      console.log(`   ℹ️  No existing table to delete`);
    }
    
    await tableClient.createTable();
    console.log(`   ✅ Table '${tableName}' created successfully.\n`);

    // Load data from JSON file
    console.log("📂 Data Loading");
    console.log("─────────────────────────────────────────────────────────────");
    const dataFilePath = path.join(__dirname, "../../../data/claim-adjusters.json");
    console.log(`   Source: ${path.basename(dataFilePath)}`);
    
    const jsonData = fs.readFileSync(dataFilePath, "utf-8");
    const claimAdjusters: ClaimAdjuster[] = JSON.parse(jsonData);
    
    console.log(`   ✅ Loaded ${claimAdjusters.length} claim adjusters\n`);

    // Insert each claim adjuster into the table
    console.log("💾 Inserting Records");
    console.log("─────────────────────────────────────────────────────────────");
    let successCount = 0;
    let errorCount = 0;

    for (const adjuster of claimAdjusters) {
      try {
        // In Azure Table Storage, we need PartitionKey and RowKey
        // Using "ClaimsAdjusters" as PartitionKey and id as RowKey
        const entity = {
          partitionKey: "ClaimsAdjusters",
          rowKey: adjuster.id,
          firstName: adjuster.firstName,
          lastName: adjuster.lastName,
          email: adjuster.email,
          phone: adjuster.phone,
          country: adjuster.country,
          area: adjuster.area,
        };

        await tableClient.upsertEntity(entity, "Replace");
        successCount++;
        const flag = getCountryFlag(adjuster.country);
        console.log(`   ${flag} ${adjuster.firstName} ${adjuster.lastName.padEnd(18)} │ ${adjuster.area.padEnd(12)} │ ${adjuster.country}`);
      } catch (error) {
        errorCount++;
        console.error(`   ❌ Failed: ${adjuster.id} - ${error.message}`);
      }
    }

    console.log("\n╔══════════════════════════════════════════════════════════════╗");
    console.log("║                    Initialization Summary                    ║");
    console.log("╠══════════════════════════════════════════════════════════════╣");
    console.log(`║  ✅ Successfully inserted: ${String(successCount).padStart(2)} records                    ║`);
    if (errorCount > 0) {
      console.log(`║  ❌ Errors: ${String(errorCount).padStart(2)} records                                   ║`);
    }
    console.log(`║  📊 Total records: ${String(claimAdjusters.length).padStart(2)}                                     ║`);
    console.log("╚══════════════════════════════════════════════════════════════╝");

  } catch (error) {
    console.error("Error during data initialization:", error);
    process.exit(1);
  }
}

// Run the initialization
initializeData()
  .then(() => {
    console.log("\n🎉 Initialization completed successfully!\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Initialization failed:", error);
    process.exit(1);
  });
