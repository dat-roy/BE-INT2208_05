const express = require('express');
const path = require('path')
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');
const checkSession = require('../middlewares/check-session.js');

router.post('/all', checkSession, conversationController.viewAllConversations);
router.post('/box/:id', checkSession, conversationController.chatBox);
router.post('/', checkSession, conversationController.viewChatMenu);

module.exports = router;