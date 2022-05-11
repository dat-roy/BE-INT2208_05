const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
let checkSession = require('../middlewares/check-session.js');
let upload = require('../middlewares/upload-image');

//=========================//

//Views
//router.get('/register', userController.register);
router.get('/login', userController.login);
//router.get('/forgot-password', userController.viewForgotPassword);
//router.get('/profile', checkSession, userController.renderProfile);
//router.get('/settings', checkSession, userController.renderUserSettings);
//router.get('/protected-route', checkSession, userController.renderProtectedRoute);      
//router.get('/reset-password/:id/:token', userController.viewResetPassword);

//Server
router.post('/register', userController.submitRegister);
router.post('/register-with-google', userController.submitRegisterWithGoogle);
router.get('/activate-account/:token', userController.activateAccount);
router.post('/auth/login', userController.verifyLogin);
router.post('/auth/google-login', userController.verifyGoogleLogin);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:id/:token', userController.resetPassword);
router.post('/settings', checkSession, upload('avatar').single('avatar'), userController.saveUserSettings);
router.get('/logout', userController.logout);
router.get('/get', checkSession, userController.getUserData);

module.exports = router;
