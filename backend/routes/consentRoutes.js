const express = require('express');
const router = express.Router();

const consentController = require('../controllers/consentController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/create',
    verifyToken,
    authorizeRole('USER'),
    consentController.createConsent
);

router.get('/:id',
    verifyToken,
    consentController.queryConsent
);

router.post('/request-access',
    verifyToken,
    authorizeRole('ORG'),
    consentController.requestAccess
);

module.exports = router;