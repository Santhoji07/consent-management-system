'use strict';

require('dotenv').config();

const path = require('path');

module.exports = {
    // Fabric network paths (Org1 only - standard test-network)
    fabricSamplesPath: process.env.FABRIC_SAMPLES_PATH || '../../fabric-samples',
    
    // Single organization configuration (Org1)
    org: {
        name: 'Org1',
        mspId: process.env.ORG1_MSP_ID || 'Org1MSP',
        peerEndpoint: process.env.ORG1_PEER_ENDPOINT || 'localhost:7051',
        connectionProfilePath: process.env.ORG1_CONNECTION_PROFILE || 
            '../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json',
        caEndpoint: process.env.ORG1_CA_ENDPOINT || 'localhost:7054'
    },
    
    // Channel and chaincode
    channelName: process.env.CHANNEL_NAME || 'consentchannel',
    chaincodeName: process.env.CHAINCODE_NAME || 'consentcc',
    
    // Wallet path (single wallet for Org1)
    walletPath: process.env.WALLET_PATH || path.join(__dirname, 'wallet'),
    
    // Admin identity
    adminIdentityName: 'admin',
    
    // Discovery
    discovery: {
        enabled: false
    }
};

