const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
var checkSession = require('../middlewares/check-session.js');

//=========================//
router.post('/register', userController.submitRegister);
router.get('/activate-account/:id/:token', userController.viewActivateAccount);
router.post('/auth/login', userController.verifyLogin);
router.post('/auth/google-login', userController.verifyGoogleLogin);
router.post('/forgot-password', userController.forgotPassword);
router.get('/reset-password/:id/:token', userController.viewResetPassword);
router.post('/reset-password/:id/:token', userController.resetPassword);
router.get('/logout', userController.logout);

module.exports = router;
