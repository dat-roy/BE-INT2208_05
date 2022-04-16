const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
var checkGoogleAuthenticated = require('../middleware/check-google-auth.js');

//=========================//
router.get('/protected-route', checkGoogleAuthenticated, userController.getProtectedRoute);
router.get('/login', userController.login);
router.get('/register', userController.register);
router.get('/profile', checkGoogleAuthenticated, userController.getProfile);
router.get('/forgot-password', userController.viewForgotPassword);

module.exports = router;
