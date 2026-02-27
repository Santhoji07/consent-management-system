const express = require('express');
const router = express.Router();

const consentController = require('../controllers/consentController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// =========================
// CREATE (USER only)
// =========================
router.post('/create',
    verifyToken,
    authorizeRole('USER'),
    consentController.createConsent
);
//UPDATE CONSENT (USER only)
router.put('/update',
    verifyToken,
    authorizeRole('USER'),
    consentController.updateConsent
);

// revoke consent (USER only – adjust role as needed)
router.post(
  '/revoke',
  verifyToken,
  authorizeRole('USER'),
  consentController.revokeConsent
);

// =========================
// REQUEST ACCESS (ORG only)
// =========================
router.post('/request-access',
    verifyToken,
    authorizeRole('ORG'),
    consentController.requestAccess
);

// =========================
// ADMIN ROUTES
// =========================
router.get('/history/:id',
    verifyToken,
    authorizeRole('ADMIN'),
    consentController.getHistory
);

router.get('/enforcements',
    verifyToken,
    authorizeRole('ADMIN'),
    consentController.getAllEnforcements
);

// =========================
// QUERY CONSENT
// (USER + ADMIN allowed)
// =========================
router.get('/:id',
    verifyToken,
    consentController.queryConsent
);

module.exports = router;