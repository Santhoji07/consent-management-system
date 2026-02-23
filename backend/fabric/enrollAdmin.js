'use strict';

const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {

    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const certPath = path.resolve(
        __dirname,
        '../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/cert.pem'
    );

    const keyDir = path.resolve(
        __dirname,
        '../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore'
    );

    const files = fs.readdirSync(keyDir);
    const keyPath = path.join(keyDir, files[0]);

    const identity = {
        credentials: {
            certificate: fs.readFileSync(certPath).toString(),
            privateKey: fs.readFileSync(keyPath).toString(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
    };

    await wallet.put('admin', identity);

    console.log('Admin identity imported successfully');
}

main();