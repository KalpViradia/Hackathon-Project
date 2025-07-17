const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/', auth, messageController.sendMessage);
router.get('/:userId', auth, messageController.getMessagesWithUser);
router.get('/', auth, messageController.getAllConversations);

module.exports = router; 