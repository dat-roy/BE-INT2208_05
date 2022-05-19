const express = require('express');
const router = express.Router();
const siteController = require('../controllers/site.controller.js');

router.get('/', siteController.home);
router.get('/share/qr', siteController.shareByQR);
router.get('/client.js', (req, res) => {
    res.sendFile(path.resolve('serve/client.js') );
})

module.exports = router;
