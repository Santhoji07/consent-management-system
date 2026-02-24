/*
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
*/
'use strict';

const express = require('express');
const cors = require('cors');

const consentRoutes = require('./routes/consentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// =============================
// Middleware
// =============================
app.use(cors());
app.use(express.json()); // built-in body parser (no need body-parser package)

// =============================
// Routes
// =============================

// Authentication Routes
app.use('/auth', authRoutes);

// Consent Routes (protected inside router)
app.use('/consent', consentRoutes);

// =============================
// Health Check
// =============================
app.get('/', (req, res) => {
    res.json({ message: "Consent Management Backend Running" });
});

// =============================
// Start Server
// =============================
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});