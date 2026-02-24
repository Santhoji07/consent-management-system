/*'use strict';

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

router.post('/request-access', async (req, res) => {
    try {
        const result = await consentService.requestAccess(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// VERY IMPORTANT
module.exports = router;
*/

const express = require('express');
const router = express.Router();

const consentController = require('../controllers/consentController');
const { verifyToken, allowRoles } = require('../middleware/authMiddleware');

// Create Consent → USER only
router.post('/create',
    verifyToken,
    allowRoles('USER'),
    consentController.createConsent
);

// Query Consent → USER + ORG
router.get('/query/:id',
    verifyToken,
    allowRoles('USER', 'ORG', 'ADMIN'),
    consentController.queryConsent
);

// Revoke Consent → USER only
router.post('/revoke',
    verifyToken,
    allowRoles('USER'),
    consentController.revokeConsent
);

// Request Access → ORG only
router.post('/request-access',
    verifyToken,
    allowRoles('ORG'),
    consentController.requestAccess
);

module.exports = router;