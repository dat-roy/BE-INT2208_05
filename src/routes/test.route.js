const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
var checkSession = require('../middlewares/check-session.js');

//=========================//
router.get('/protected-route', checkSession, userController.getProtectedRoute);
router.get('/login', userController.login);
router.get('/register', userController.register);
router.get('/profile', checkSession, userController.getProfile);
router.get('/forgot-password', userController.viewForgotPassword);

module.exports = router;