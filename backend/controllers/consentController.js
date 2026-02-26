'use strict';

const consentService = require('../services/consentService');

exports.createConsent = async (req, res) => {
    try {
        const result = await consentService.createConsent(req.body);
        res.json({ message: "Consent created successfully", data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.queryConsent = async (req, res) => {
    try {
        const result = await consentService.queryConsent(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.requestAccess = async (req, res) => {
    try {
        const result = await consentService.requestAccess({
            ...req.body,
            logId: `LOG_${Date.now()}`
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};