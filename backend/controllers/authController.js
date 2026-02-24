const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersFile = path.join(__dirname, '../data/users.json');
const SECRET = "supersecretkey"; // later move to .env

// Helper to read users
function getUsers() {
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
}

// Helper to save users
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// REGISTER
exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    const users = getUsers();

    const existing = users.find(u => u.username === username);
    if (existing) {
        return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        role
    };

    users.push(newUser);
    saveUsers(users);

    res.json({ message: "User registered successfully" });
};

// LOGIN
exports.login = async (req, res) => {
    const { username, password } = req.body;

    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        SECRET,
        { expiresIn: "2h" }
    );

    res.json({ token, role: user.role });
};