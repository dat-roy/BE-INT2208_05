const express = require('express');
const router = express.Router();
const siteController = require('../controllers/site.controller');

router.get('/home', siteController.home);
router.get('/', siteController.home);

module.exports = router;
