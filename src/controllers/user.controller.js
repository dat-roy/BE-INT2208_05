const UserModel = require('../models/user.model.js');

//Google Auth
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '836271056493-9jkcpgrhn8qur3f65vvchuksj2m4ub1t.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

//===========================
class userController {

    // [GET] /user/login
    login(req, res, next) {
        res.render('login');
    }

    // [POST] /user/verify/login
    verifyLogin(req, res, next) {

    }
    // [POST] /user/verify/google-login
    verifyGoogleLogin(req, res, next) {
        let token = req.body.credential;
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,  
            });
            const payload = ticket.getPayload();
            console.log(payload);
            const userid = payload['sub'];
        }
        verify()
            .then(()=>{
                res.cookie('session-token', token);
                res.redirect('/user/profile');
            })
            .catch(console.error);
    }

    // [GET] /user/profile
    getProfile(req, res, next) {    
        let user = req.user;
        res.render('profile', {user});
    }
    
    // [GET]] /user/protected-route
    getProtectedRoute(req, res, next) {
        res.send('<br><br><br><center><h1>Có thể bạn thừa biết: Lý do bạn còn ế là do nhạt bormej!</h1></center>');
    }

    // [GET] /logout
    logout(req, res, next) {
        res.clearCookie('session-token');
        res.redirect('/');
    }

    // [POST] /forgot-password
    forgotPassword(req, res, next) {
        
    }
}

module.exports = new userController()
