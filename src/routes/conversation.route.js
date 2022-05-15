const express = require('express');
const path = require('path')
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');
const checkSession = require('../middlewares/check-session.js');

router.get('/conversation', checkSession, conversationController.renderConversation);
router.get('/inside-chat-box', checkSession, conversationController.insideChatBox);
router.get('/', checkSession, conversationController.searchUser);
router.post('/', checkSession, conversationController.searchUserResult);


module.exports = router;