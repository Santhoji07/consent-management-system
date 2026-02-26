'use strict';

const { connect } = require('../fabric/gateway');
const { evaluateConsent } = require('../policyEngine/evaluatePolicy');

// ==========================
// CREATE CONSENT
// ==========================
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

// ==========================
// QUERY CONSENT
// ==========================
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

// ==========================
// REQUEST ACCESS
// ==========================
async function requestAccess(data) {

    const { gateway, contract } = await connect();

    try {

        // 1️⃣ Get consent
        const consentBytes = await contract.evaluateTransaction(
            'QueryConsent',
            data.consentId
        );

        const consent = JSON.parse(consentBytes.toString());

        // 2️⃣ Evaluate policy
        const decisionResult = evaluateConsent(consent, data);

        // 3️⃣ Record enforcement
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

// ==========================
// GET CONSENT HISTORY
// ==========================
async function getConsentHistory(consentId) {

    const { gateway, contract } = await connect();

    try {
        const result = await contract.evaluateTransaction(
            'GetConsentHistory',
            consentId
        );

        return JSON.parse(result.toString());

    } finally {
        gateway.disconnect();
    }
}

// ==========================
// GET ALL ENFORCEMENTS
// ==========================
async function getAllEnforcements() {

    const { gateway, contract } = await connect();

    try {
        const result = await contract.evaluateTransaction(
            'QueryAllEnforcements'
        );

        return JSON.parse(result.toString());

    } finally {
        gateway.disconnect();
    }
}

module.exports = {
    createConsent,
    queryConsent,
    requestAccess,
    getConsentHistory,
    getAllEnforcements
};