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