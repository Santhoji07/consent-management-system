'use strict';

const { evaluateTransaction, submitTransaction, getConnection } = require('../fabric/gateway');
const { evaluateConsent, createPolicyFromStructured } = require('../policyEngine/evaluatePolicy');

// ==========================
// CREATE CONSENT
// ==========================
async function createConsent(data) {
    try {
        const resultBytes = await submitTransaction(
            'CreateConsent',
            data.consentId,
            data.userId,
            data.orgId,
            data.purpose,
            data.dataType,
            data.expiry
        );
        const result = resultBytes.toString();
        const parsed = JSON.parse(result);
        if (parsed.error) {
            throw new Error(parsed.error);
        }
        return parsed;
    } catch (error) {
        console.error('[ERROR] createConsent:', error.message);
        throw error;
    }
}

// ==========================
// QUERY CONSENT
// ==========================
async function queryConsent(consentId) {
    try {
        const resultBytes = await evaluateTransaction(
            'QueryConsent',
            consentId
        );
        const result = resultBytes.toString();
        const parsed = JSON.parse(result);
        if (parsed.error) {
            throw new Error(parsed.error);
        }
        return parsed;
    } catch (error) {
        console.error('[ERROR] queryConsent:', error.message);
        throw error;
    }
}

// ==========================
// REVOKE CONSENT
// ==========================
async function revokeConsent(consentId) {
    try {
        const result = await submitTransaction('RevokeConsent', consentId);
        return JSON.parse(result.toString());
    } catch (error) {
        console.error('[ERROR] revokeConsent:', error.message);
        throw error;
    }
}

// ==========================
// UPDATE CONSENT
// ==========================
async function updateConsent(data) {
    try {
        const result = await submitTransaction(
            'UpdateConsent',
            data.consentId,
            data.purpose,
            data.dataType,
            data.expiry
        );

        return JSON.parse(result.toString());
    } catch (error) {
        console.error('[ERROR] updateConsent:', error.message);
        throw error;
    }
}

// ==========================
// REQUEST ACCESS
// ==========================
async function requestAccess(data) {
    try {
        // 1️⃣ Get consent from Fabric
        const consentBytes = await evaluateTransaction(
            'QueryConsent',
            data.consentId
        );

        const consent = JSON.parse(consentBytes.toString());

        // 2️⃣ Create policy from structured consent data
        const policy = createPolicyFromStructured(consent);

        // 3️⃣ Evaluate policy with detailed explanation
        const decisionResult = evaluateConsent(policy, {
            purpose: data.purpose,
            operation: 'access',
            dataType: consent.dataType,
            recipient: data.orgId
        });

        // 4️⃣ Record enforcement with full explanation
        await submitTransaction(
            'RecordEnforcement',
            data.logId,
            data.consentId,
            data.orgId,
            decisionResult.decision,
            decisionResult.reason
        );

        // Return decision with explanation for frontend display
        return {
            decision: decisionResult.decision,
            reason: decisionResult.reason,
            explanation: decisionResult.explanation,
            policyUsed: decisionResult.policyUsed,
            checkedConditions: decisionResult.checkedConditions
        };
    } catch (error) {
        console.error('[ERROR] requestAccess:', error.message);
        throw error;
    }
}

// ==========================
// GET CONSENT HISTORY
// ==========================
async function getConsentHistory(consentId) {
    try {
        const result = await evaluateTransaction(
            'GetConsentHistory',
            consentId
        );

        return JSON.parse(result.toString());
    } catch (error) {
        console.error('[ERROR] getConsentHistory:', error.message);
        throw error;
    }
}

// ==========================
// GET ALL ENFORCEMENTS
// ==========================
async function getAllEnforcements() {
    try {
        const result = await evaluateTransaction(
            'QueryAllEnforcements'
        );

        return JSON.parse(result.toString());
    } catch (error) {
        console.error('[ERROR] getAllEnforcements:', error.message);
        throw error;
    }
}

module.exports = {
    createConsent,
    queryConsent,
    updateConsent,
    revokeConsent,
    requestAccess,
    getConsentHistory,
    getAllEnforcements
};

