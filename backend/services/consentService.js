'use strict';

const { connect } = require('../fabric/gateway');

async function createConsent(data) {

    const { gateway, contract } = await connect();

    const result = await contract.submitTransaction(
        'CreateConsent',
        data.consentId,
        data.userId,
        data.orgId,
        data.purpose,
        data.dataType,
        data.expiry
    );

    await gateway.disconnect();

    return JSON.parse(result.toString());
}

async function queryConsent(consentId) {

    const { gateway, contract } = await connect();

    const result = await contract.evaluateTransaction(
        'QueryConsent',
        consentId
    );

    await gateway.disconnect();

    return JSON.parse(result.toString());
}

module.exports = {
    createConsent,
    queryConsent
};

const { evaluateConsent } = require('./policyEngine');

async function requestAccess(data) {

    const { gateway, contract } = await connect();

    // 1️⃣ Query Consent from Blockchain
    const consentBytes = await contract.evaluateTransaction(
        'QueryConsent',
        data.consentId
    );

    const consent = JSON.parse(consentBytes.toString());

    // 2️⃣ Evaluate Policy
    const decisionResult = evaluateConsent(consent, data);

    // 3️⃣ Record Enforcement on Blockchain
    await contract.submitTransaction(
        'RecordEnforcement',
        data.logId,
        data.consentId,
        data.orgId,
        decisionResult.decision,
        decisionResult.reason
    );

    await gateway.disconnect();

    // 4️⃣ Return Decision
    return decisionResult;
}

module.exports = {
    createConsent,
    queryConsent,
    requestAccess
};