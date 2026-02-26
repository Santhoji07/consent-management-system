'use strict';

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../middleware/authMiddleware');

const usersFile = path.join(__dirname, '../users.json');

function getUsers() {
    if (!fs.existsSync(usersFile)) return [];
    const data = fs.readFileSync(usersFile);
    return data.length ? JSON.parse(data) : [];
}

function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    const users = getUsers();
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    users.push({ username, password: hashed, role });
    saveUsers(users);

    res.json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) return res.status(400).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
        { username: user.username, role: user.role },
        SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });
};