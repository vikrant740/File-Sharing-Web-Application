const rateLimit = require('express-rate-limit');

// General API rate limiter
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Auth endpoints limiter (brute-force protection)
exports.authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 20,
  message: { success: false, message: 'Too many attempts, please slow down.' }
});