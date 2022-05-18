const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller.js');
const checkSession = require('../middlewares/check-session.js');  

//===============
router.get('/get/pending-posts', checkSession, adminController.getPendingPosts);
router.get('/get/approved-posts', checkSession, adminController.getApprovedPosts);
router.get('/get/rejected-posts', checkSession, adminController.getRejectedPosts);
router.get('/approve/:id', checkSession, adminController.setApproved);
router.get('/reject/:id', checkSession, adminController.setRejected);

module.exports = router;
