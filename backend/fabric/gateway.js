'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = path.resolve(
    __dirname,
    '../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json'
);

async function connect() {

    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get('admin');

    if (!identity) {
        throw new Error('Admin identity not found in wallet');
    }

    const gateway = new Gateway();

    await gateway.connect(ccp, {
        wallet,
        identity: 'admin',
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('consentchannel');
    const contract = network.getContract('consentcc');

    return { gateway, contract };
}

module.exports = { connect };