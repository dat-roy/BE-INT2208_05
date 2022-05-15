const express = require('express');
const router = express.Router();
const siteController = require('../controllers/site.controller.js');
const path = require('path');

router.get('/home', siteController.home);
router.get('/', siteController.home);
router.get('/client.js', (req, res) => {
    res.sendFile(path.resolve('src/client.js') );
})

module.exports = router;
