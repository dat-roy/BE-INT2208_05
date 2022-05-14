const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
let checkSession = require('../middlewares/check-session.js');
let upload = require('../middlewares/upload-image');

const saved_image_folder = 'avatar';
const upload_image_field = "file";
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
//router.post('/register', userController.submitRegister);
//router.post('/register-with-google', userController.submitRegisterWithGoogle);
//router.get('/activate-account/:token', userController.activateAccount);
//router.post('/auth/login', userController.verifyLogin);
//router.post('/forgot-password', userController.forgotPassword);
//router.post('/reset-password/:id/:token', userController.resetPassword);
router.post('/auth/google-login', userController.verifyGoogleLogin);
router.get('/logout', userController.logout);
router.get('/get', checkSession, userController.getUserData);
router.post('/update', checkSession, upload(saved_image_folder).single(upload_image_field), userController.updateSettings);

module.exports = router;
