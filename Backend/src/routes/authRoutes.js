const express = require('express');
const router = express.Router();
const path = require('path');

const { register, login, getMe } = require(path.join(__dirname, '../controllers/authController'));
const { protect } = require(path.join(__dirname, '../middleware/auth'));
const { authLimiter } = require(path.join(__dirname, '../middleware/rateLimiter'));

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);

module.exports = router;