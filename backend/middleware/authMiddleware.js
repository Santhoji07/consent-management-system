const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'supersecretkey';

function getSecret() {
    return process.env.JWT_SECRET || 'supersecretkey';
}

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, getSecret());
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

function authorizeRole(...roles) {
    return (req, res, next) => {

        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
}

module.exports = { verifyToken, authorizeRole, SECRET, getSecret };
