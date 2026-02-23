'use strict';

const express = require('express');
const router = express.Router();
const consentService = require('../services/consentService');

router.post('/create', async (req, res) => {
    try {
        const result = await consentService.createConsent(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await consentService.queryConsent(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// VERY IMPORTANT
module.exports = router;