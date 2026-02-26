'use strict';

const { Contract } = require('fabric-contract-api');

class ConsentContract extends Contract {

    async InitLedger(ctx) {
        console.info('Ledger initialized');
    }

    // Helper: Deterministic Fabric Timestamp
    _getTxTimestamp(ctx) {
        const txTimestamp = ctx.stub.getTxTimestamp();
        const seconds = txTimestamp.seconds.low;
        return new Date(seconds * 1000).toISOString();
    }

    // ================================
    // CREATE CONSENT
    // ================================
    async CreateConsent(ctx, consentId, userId, orgId, purpose, dataType, expiry) {

        const consentKey = `CONSENT_${consentId}`;
        const existing = await ctx.stub.getState(consentKey);

        if (existing && existing.length > 0) {
            throw new Error(`Consent ${consentId} already exists`);
        }

        const timestamp = this._getTxTimestamp(ctx);

        const consent = {
            docType: "consent",
            consentId,
            userId,
            orgId,
            purpose,
            dataType,
            conditions: {
                expiry,
                allowedFrequency: "UNLIMITED"
            },
            status: "ACTIVE",
            version: 1,
            createdAt: timestamp,
            updatedAt: timestamp
        };

        await ctx.stub.putState(
            consentKey,
            Buffer.from(JSON.stringify(consent))
        );

        // Composite key for indexing
        const compositeKey = ctx.stub.createCompositeKey(
            'consent',
            [userId, orgId]
        );

        await ctx.stub.putState(compositeKey, Buffer.from('\u0000'));

        return JSON.stringify(consent);
    }

    // ================================
    // QUERY CONSENT
    // ================================
    async QueryConsent(ctx, consentId) {

        const consentKey = `CONSENT_${consentId}`;
        const consentBytes = await ctx.stub.getState(consentKey);

        if (!consentBytes || consentBytes.length === 0) {
            throw new Error(`Consent ${consentId} does not exist`);
        }

        return consentBytes.toString();
    }

    // ================================
    // UPDATE CONSENT
    // ================================
    async UpdateConsent(ctx, consentId, purpose, dataType, expiry) {

        const consentKey = `CONSENT_${consentId}`;
        const consentBytes = await ctx.stub.getState(consentKey);

        if (!consentBytes || consentBytes.length === 0) {
            throw new Error(`Consent ${consentId} does not exist`);
        }

        const consent = JSON.parse(consentBytes.toString());
        const timestamp = this._getTxTimestamp(ctx);

        consent.purpose = purpose;
        consent.dataType = dataType;
        consent.conditions.expiry = expiry;
        consent.version += 1;
        consent.updatedAt = timestamp;

        await ctx.stub.putState(
            consentKey,
            Buffer.from(JSON.stringify(consent))
        );

        return JSON.stringify(consent);
    }

    // ================================
    // REVOKE CONSENT
    // ================================
    async RevokeConsent(ctx, consentId) {

        const consentKey = `CONSENT_${consentId}`;
        const consentBytes = await ctx.stub.getState(consentKey);

        if (!consentBytes || consentBytes.length === 0) {
            throw new Error(`Consent ${consentId} does not exist`);
        }

        const consent = JSON.parse(consentBytes.toString());
        const timestamp = this._getTxTimestamp(ctx);

        consent.status = "REVOKED";
        consent.version += 1;
        consent.updatedAt = timestamp;

        await ctx.stub.putState(
            consentKey,
            Buffer.from(JSON.stringify(consent))
        );

        return JSON.stringify(consent);
    }

    // ================================
    // RECORD ENFORCEMENT
    // ================================
    async RecordEnforcement(ctx, logId, consentId, orgId, decision, reason) {

        const logKey = `ENFORCEMENT_${logId}`;
        const timestamp = this._getTxTimestamp(ctx);

        const log = {
            docType: "enforcement",
            logId,
            consentId,
            orgId,
            decision,
            reason,
            timestamp
        };

        await ctx.stub.putState(
            logKey,
            Buffer.from(JSON.stringify(log))
        );

        return JSON.stringify(log);
    }

    // ================================
    // GET CONSENT HISTORY (AUDIT)
    // ================================
    async GetConsentHistory(ctx, consentId) {

        const consentKey = `CONSENT_${consentId}`;
        const iterator = await ctx.stub.getHistoryForKey(consentKey);

        const results = [];

        while (true) {
            const res = await iterator.next();

            if (res.value) {
                results.push({
                    txId: res.value.txId,
                    timestamp: res.value.timestamp,
                    isDelete: res.value.isDelete,
                    value: res.value.value.toString('utf8')
                });
            }

            if (res.done) {
                await iterator.close();
                break;
            }
        }

        return JSON.stringify(results);
    }
}

module.exports = ConsentContract;

