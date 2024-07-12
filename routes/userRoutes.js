const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

router.post('/register', async (req, res) => {
    const { username, password, secretCode } = req.body;
    if (!username || !password || !secret_configured) {
        return res.status(400).json({ error: 'Missing username, password, or secret code' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        password: hashedPassword,
        secretCode
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
});

router.post('/change-password', async (req, res) => {
    const { username, oldPassword, newPassword, secretCode } = req.body;
    if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordMatch || user.secretCode !== secretCode) {
        return res.status(401).json({ error: 'Invalid old password or secret code' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
});

module.exports = router;