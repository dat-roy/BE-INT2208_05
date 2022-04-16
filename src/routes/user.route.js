const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
var checkGoogleAuthenticated = require('../middleware/check-google-auth.js');

//=========================//
router.post('/register', userController.submitRegister);
router.post('/auth/login', userController.verifyLogin);
router.post('/auth/google-login', userController.verifyGoogleLogin);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:id/:token', userController.resetPassword);
router.get('/logout', userController.logout);
router.get('/reset-password/:id/:token', userController.viewResetPassword);

module.exports = router;
