const express = require('express');
const router  = express.Router();

const AdminController = require('../controllers/AdminController')
router.get('/posting/accepted/:slug',AdminController.acceptedAndRejected);
router.get('/posting',AdminController.UnverifiedPost);
router.get('/detail/:slug',AdminController.postDetail);
router.get('/verifiedPost',AdminController.VerifiedPost);
router.get('/rejectedPost',AdminController.queryRejectedPost);

module.exports = router;
