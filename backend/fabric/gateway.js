'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const config = require('./config');

// Single cached gateway connection
let gatewayConnection = null;

/**
 * Get wallet for Org1
 */
async function getWallet() {
    const walletPath = config.walletPath;
    return await Wallets.newFileSystemWallet(walletPath);
}

/**
 * Get or create gateway connection (single connection)
 */
async function getConnection() {
    if (gatewayConnection) {
        console.log('[INFO] Reusing existing gateway connection');
        return gatewayConnection;
    }

    // Load Org1 connection profile
    const ccpPath = path.resolve(__dirname, config.org.connectionProfilePath);
    
    if (!fs.existsSync(ccpPath)) {
        throw new Error(`Connection profile not found: ${ccpPath}. Start Fabric network first.`);
    }

    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const wallet = await getWallet();

    // Check admin identity
    const identity = await wallet.get(config.adminIdentityName);
    if (!identity) {
        throw new Error(`Admin identity not found in wallet. Run: node enrollAdmin.js`);
    }

    // Connect gateway
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: config.adminIdentityName,
        discovery: config.discovery
    });

    console.log('[INFO] Gateway connected to Org1');

    const network = await gateway.getNetwork(config.channelName);
    const contract = network.getContract(config.chaincodeName);

    gatewayConnection = { gateway, network, contract };

    return gatewayConnection;
}

/**
 * Evaluate transaction (query)
 */
async function evaluateTransaction(functionName, ...args) {
    const connection = await getConnection();
    console.log(`[INFO] Evaluating: ${functionName}`, args);
    return connection.contract.evaluateTransaction(functionName, ...args);
}

/**
 * Submit transaction (invoke)
 */
async function submitTransaction(functionName, ...args) {
    const connection = await getConnection();
    console.log(`[INFO] Submitting: ${functionName}`, args);
    return connection.contract.submitTransaction(functionName, ...args);
}

/**
 * Disconnect gateway
 */
async function disconnect() {
    if (gatewayConnection) {
        gatewayConnection.gateway.disconnect();
        console.log('[INFO] Gateway disconnected');
        gatewayConnection = null;
    }
}

module.exports = {
    getWallet,
    getConnection,
    evaluateTransaction,
    submitTransaction,
    disconnect
};

