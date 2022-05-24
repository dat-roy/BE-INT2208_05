const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
let checkSession = require('../middlewares/check-session.js');
let upload = require('../middlewares/upload-image');

const saved_image_folder = 'avatar';
const upload_image_field = 'file';

//=========================//

//Server
router.post('/auth/google-login', userController.verifyGoogleLogin);
router.get('/logout', userController.logout);
router.get('/get/:id', userController.getUserDataById);
router.post('/get-me', checkSession, userController.getLoggedInUserData);
router.post('/update', checkSession, upload(saved_image_folder).single(upload_image_field), userController.updateSettings);

module.exports = router;
