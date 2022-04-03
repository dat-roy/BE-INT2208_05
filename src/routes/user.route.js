const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
var checkGoogleAuthenticated = require('../middleware/check-google-auth.js');

//=========================//
router.get('/register', userController.register);
router.post('/register', userController.submitRegister);
router.get('/login', userController.login);
router.post('/auth/login', userController.verifyLogin);
router.post('/auth/google-login', userController.verifyGoogleLogin);
router.get('/forgot-password', userController.viewForgotPassword);
router.post('/forgot-password', userController.forgotPassword);
router.get('/reset-password/:id/:token', userController.viewResetPassword);
router.post('/reset-password/:id/:token', userController.resetPassword);
router.get('/profile', checkGoogleAuthenticated, userController.getProfile);
router.get('/protected-route', checkGoogleAuthenticated, userController.getProtectedRoute);
router.get('/logout', userController.logout);
router.get('/forgot-password', userController.forgotPassword);

module.exports = router;
