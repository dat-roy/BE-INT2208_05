const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller.js');
const checkSession = require('../middlewares/check-session.js');  

//===============
router.post('/get/pending-posts', checkSession, adminController.getPendingPosts);
router.post('/get/approved-posts', checkSession, adminController.getApprovedPosts);
router.post('/get/rejected-posts', checkSession, adminController.getRejectedPosts);
router.post('/approve/:id', checkSession, adminController.setApproved);
router.post('/reject/:id', checkSession, adminController.setRejected);

module.exports = router;
