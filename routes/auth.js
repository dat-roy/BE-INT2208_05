const express = require('express');
const router  = express.Router();

const AuthController = require('../controllers/AuthController')
const Authenticate = require('../middleware/authenticate')
router.post('/register',AuthController.register);
router.post('/login',AuthController.login);
module.exports = router;