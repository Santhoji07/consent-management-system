'use strict';

const { connect } = require('../fabric/gateway');
const { evaluateConsent } = require('../policyEngine/evaluatePolicy');

async function createConsent(data) {

    const { gateway, contract } = await connect();

    try {
        const result = await contract.submitTransaction(
            'CreateConsent',
            data.consentId,
            data.userId,
            data.orgId,
            data.purpose,
            data.dataType,
            data.expiry
        );

        return JSON.parse(result.toString());

    } finally {
        gateway.disconnect();
    }
}

async function queryConsent(consentId) {

    const { gateway, contract } = await connect();

    try {
        const result = await contract.evaluateTransaction(
            'QueryConsent',
            consentId
        );

        return JSON.parse(result.toString());

    } finally {
        gateway.disconnect();
    }
}

async function requestAccess(data) {

    const { gateway, contract } = await connect();

    try {

        const consentBytes = await contract.evaluateTransaction(
            'QueryConsent',
            data.consentId
        );

        const consent = JSON.parse(consentBytes.toString());

        const decisionResult = evaluateConsent(consent, data);

        await contract.submitTransaction(
            'RecordEnforcement',
            data.logId,
            data.consentId,
            data.orgId,
            decisionResult.decision,
            decisionResult.reason
        );

        return decisionResult;

    } finally {
        gateway.disconnect();
    }
}

module.exports = {
    createConsent,
    queryConsent,
    requestAccess
};