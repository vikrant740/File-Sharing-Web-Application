const express = require('express');
const router = express.Router();
const { logTransfer, getRoomAnalytics } = require('../controllers/roomController');
const { validateFileMetadata } = require('../middleware/fileValidator');
const { apiLimiter } = require('../middleware/rateLimiter');

router.post('/transfer-log', apiLimiter, validateFileMetadata, logTransfer);
router.get('/analytics/:roomCode', apiLimiter, getRoomAnalytics);

module.exports = router;