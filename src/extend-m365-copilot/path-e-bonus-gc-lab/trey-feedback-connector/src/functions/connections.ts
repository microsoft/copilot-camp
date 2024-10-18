import { app, InvocationContext, Timer } from '@azure/functions';
import { deleteConnection, ensureConnection, setSearchSettings } from '../connection';
import { ensureSchema } from '../schema';
import { ingestContent } from '../ingest';
import { initConfig } from '../config';

/**
 * The deployConnection function is responsible for ensuring the connection, schema, and search settings are in place.
 * It also starts the ingestion of the content.
 * @param {Timer} timer - The timer object
 * @param {InvocationContext} context - The context object of the current invocation
 * @returns {Promise<void>}
 */
export async function deployConnection(timer: Timer, context: InvocationContext): Promise<void> {
  // Initializes the configuration for the current invocation
  const config = initConfig(context);

  // Creates the connection
  let connectionResult = await ensureConnection(config);
  if (connectionResult) {
    // Creates the schema
    await ensureSchema(config);

    // Updates the search settings with the result template
    await setSearchSettings(config);

    // Starts the ingestion of the content
    await ingestContent(config);
  }
}

/**
 * The deleteConnection function is responsible for ensuring the connection, schema, and search settings are in place.
 * It also starts the ingestion of the content.
 * @param {Timer} timer - The timer object
 * @param {InvocationContext} context - The context object of the current invocation
 * @returns {Promise<void>}
 */
export async function retractConnection(timer: Timer, context: InvocationContext): Promise<void> {
  // Initializes the configuration for the current invocation
  const config = initConfig(context);

  // Deletes the connection
  await deleteConnection(config);
}

const currentDate = new Date();
const cronExpression = `0 0 0 ${currentDate.getUTCMonth()} ${currentDate.getUTCDay()} *`;
app.timer('deployConnection', {
  // Runs every year
  schedule: cronExpression,	
  runOnStartup: process.env.AZURE_FUNCTIONS_ENVIRONMENT === 'Development',
  handler: deployConnection
});

app.timer('retractConnection', {
  // Runs every year
  schedule: cronExpression,	
  runOnStartup: false,
  handler: retractConnection
});
