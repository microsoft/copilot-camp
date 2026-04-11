#!/usr/bin/env node
/**
 * Cross-platform wrapper script for creating service principal
 * Works on Windows, macOS, and Linux without requiring Git Bash
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Get arguments
const appId = process.argv[2];
const subscriptionId = process.argv[3];
const botServicePrincipalId = process.argv[4];

if (!appId || !subscriptionId || !botServicePrincipalId) {
    console.error('Usage: node create-service-principal-wrapper.js <APP_ID> <SUBSCRIPTION_ID> <BOT_SERVICE_PRINCIPAL_ID>');
    process.exit(1);
}

// Detect platform
const platform = os.platform();
let command, args;

if (platform === 'win32') {
    // Windows - use PowerShell script
    command = 'pwsh';
    args = [
        '-File',
        './infra/scripts/create-service-principal.ps1',
        '-AppId', appId,
        '-SubscriptionId', subscriptionId,
        '-BotServicePrincipalId', botServicePrincipalId
    ];
} else {
    // macOS/Linux - use bash script
    command = 'bash';
    args = [
        './infra/scripts/create-service-principal.sh',
        '--app-id', appId,
        '--subscription-id', subscriptionId,
        '--bot-service-principal-id', botServicePrincipalId
    ];
}

// Execute the appropriate script
const child = spawn(command, args, {
    stdio: 'inherit',
    shell: true
});

child.on('error', (error) => {
    console.error(`Error executing script: ${error.message}`);
    process.exit(1);
});

child.on('close', (code) => {
    process.exit(code);
});
