// routes/authRoutes.js
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('../services/googleAuthService');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, grade } = req.body;
        const user = new User({ name, email, password, grade });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Email already exists' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});
// OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.redirect(`http://localhost:3000/dashboard?token=${token}`);
    }
);
// Dashboard (Protected)
router.get('/dashboard', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).populate('quizzes');
    res.json(user);
});

module.exports = router;
