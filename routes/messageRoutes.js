const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const messageController= require('../controllers/messageController');



router.get('/messages', authMiddleware, messageController.getMessages);
router.post('/messages/:id/reply', authMiddleware, messageController.replyToMessage);
router.post('/savemessages', authMiddleware, messageController.createMessage);

module.exports = router;