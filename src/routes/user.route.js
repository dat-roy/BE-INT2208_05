const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');

//Google Auth
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '836271056493-9jkcpgrhn8qur3f65vvchuksj2m4ub1t.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

//=========================
router.get('/login', userController.login);
router.post('/auth/login', userController.verifyLogin);
router.post('/auth/google-login', userController.verifyGoogleLogin);
router.get('/profile', checkGoogleAuthenticated, userController.getProfile);
router.get('/protected-route', checkGoogleAuthenticated, userController.getProtectedRoute);
router.get('/logout', userController.logout);
router.get('/forgot-password', userController.forgotPassword);

function checkGoogleAuthenticated(req, res, next){
    let token = req.cookies['session-token'];
    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    }
        verify()
        .then( () => {
            req.user = user;
            next();
        })
        .catch(err => {
            res.send('Chưa đăng nhập mà đòi xem???');
        })
}

module.exports = router;
