const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findUserByUsername, addUser } = require("../model/user");

const SECRET_KEY = "TEST";

async function registerUser(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    addUser({ username, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
}

async function loginUser(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await findUserByUsername(username);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "24h" });
    res.json({ token });
}

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        req.user = await verify(token);
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid token"})
    }
}

function verify (token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (error, user) => {
            if(error) {
                reject(error);
            }
            resolve(user);
        });
    })
}

module.exports = { registerUser, loginUser, authenticateToken, verify };
