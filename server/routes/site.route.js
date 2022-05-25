const express = require('express');
const router = express.Router();
const siteController = require('../controllers/site.controller.js');
const path = require('path');

router.get('/', siteController.home);
router.get('/share/qr', siteController.shareByQR);
router.post('/search-by-text', siteController.searchByText);
router.post('/search-in-user', siteController.searchUser);
router.post('/search-in-post', siteController.searchPost);

module.exports = router;
