'use strict';

const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const config = require('./config');

async function main() {
    try {
        // Create wallet
        const walletPath = config.walletPath;
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log('Wallet created at:', walletPath);

        // Load Org1 connection profile for CA info
        const ccpPath = path.resolve(__dirname, config.org.connectionProfilePath);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Enrollment paths for Org1 Admin
        const fabricPath = path.resolve(__dirname, config.fabricSamplesPath);
        const certPath = path.join(
            fabricPath, 
            'test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/cert.pem'
        );
        const keyDirPath = path.join(
            fabricPath, 
            'test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore'
        );

        // Read certificate
        if (!fs.existsSync(certPath)) {
            throw new Error(`Certificate file does not exist: ${certPath}`);
        }
        const certificate = fs.readFileSync(certPath).toString();

        // Read private key
        if (!fs.existsSync(keyDirPath)) {
            throw new Error(`Private key directory does not exist: ${keyDirPath}`);
        }
        const keyFiles = fs.readdirSync(keyDirPath);
        if (keyFiles.length === 0) {
            throw new Error('No private key found');
        }
        const keyPath = path.join(keyDirPath, keyFiles[0]);
        const privateKey = fs.readFileSync(keyPath).toString();

        // Build identity
        const identity = {
            credentials: {
                certificate: certificate,
                privateKey: privateKey,
            },
            mspId: config.org.mspId,
            type: 'X.509',
        };

        // Store in wallet
        await wallet.put(config.adminIdentityName, identity);
        console.log('✅ Admin identity enrolled successfully');

    } catch (error) {
        console.error('❌ Failed to enroll admin:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { main };

