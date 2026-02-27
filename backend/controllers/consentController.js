'use strict';

const consentService = require('../services/consentService');

exports.createConsent = async (req, res) => {
    try {
        // Ensure USER creates consent for themselves
        if (req.user.role === 'USER' && req.body.userId !== req.user.username.toUpperCase()) {
            return res.status(403).json({ error: "You can only create consent for yourself" });
        }

        const result = await consentService.createConsent(req.body);

        res.json({ message: "Consent created successfully", data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.queryConsent = async (req, res) => {
    try {
        const consent = await consentService.queryConsent(req.params.id);

        // USER can only view their own consent
        if (req.user.role === 'USER' && consent.userId !== req.user.username.toUpperCase()) {
            return res.status(403).json({ error: "Access denied to this consent" });
        }

        res.json(consent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.revokeConsent = async (req, res) => {
    try {
        const { consentId } = req.body;
        if (!consentId) {
            return res.status(400).json({ error: 'consentId is required' });
        }

        // USER may only revoke their own consent
        if (req.user.role === 'USER') {
            const consent = await consentService.queryConsent(consentId);
            if (consent.userId !== req.user.username.toUpperCase()) {
                return res.status(403).json({ error: 'You can only revoke your own consent' });
            }
        }

        const result = await consentService.revokeConsent(consentId);
        res.json({ message: 'Consent revoked', data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateConsent = async (req, res) => {
    try {
        const result = await consentService.updateConsent(req.body);
        res.json({ message: "Consent updated successfully", data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.requestAccess = async (req, res) => {
    try {
        const consent = await consentService.queryConsent(req.body.consentId);

        // ORG can only request access to consent assigned to them
        if (req.user.role === 'ORG' && consent.orgId !== req.user.username.toUpperCase()) {
            return res.status(403).json({ error: "You are not authorized for this consent" });
        }

        const result = await consentService.requestAccess({
            ...req.body,
            logId: `LOG_${Date.now()}`
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const result = await consentService.getConsentHistory(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllEnforcements = async (req, res) => {
    try {
        const result = await consentService.getAllEnforcements();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};