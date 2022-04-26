const UserModel = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWTPrivateKey = "TiroAccounts";
//Google Auth
const { OAuth2Client } = require('google-auth-library');
const userModel = require('../models/user.model.js');
const CLIENT_ID = '823357101372-fcr2i1ngeimfjbtqf775sgp112tijhco.apps.googleusercontent.com';

//Nodemailer
//Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: "gmail",   
    auth: {
        user: "group7.int2208@gmail.com", 
        pass: "nhom7isthebest",
    },
});
//===========================
class userController {

    // [GET] /test/register
    register(req, res, next) {
        res.render('register');
    }

    // [POST] /user/register
    submitRegister(req, res, next) {
        
        const {username, email, phone, password} = req.body;

        //Check existing username & email & phone in DB:
        UserModel.findOne( { $or: [ {username: username}, {email: email}, {phone: phone}] } )
        .then( user => {
            if (user) {
                res.send('Your username / email / phone number is already used');
                return;
            }
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, (err, hashedPwd) => {
                if (err) {
                    console.log('Bcrypt: ', err);
                    res.send('Error');
                    return;
                }
                let userRecord = new UserModel({
                    username: username,
                    email: email,
                    phone: phone,
                    password: hashedPwd,
                });
                userRecord.save()
                    .then(user => {
                        console.log("Saved a new user.");
                        //Email verification:
                        const payload = {
                            email: user.email,
                        };
                        let token = jwt.sign(payload, JWTPrivateKey + user.password);
                        const link = `http://localhost:3000/user/activate-account/${user.id}/${token}`;

                        let info = {
                            from: {
                                name: "Tiro Accounts",
                                address: "group7.int2208@gmail.com",
                            },
                            to: `${user.email}`,                         
                            subject: "Tiro Account Activation.",          
                            text: link,         
                        };

                        transporter.sendMail(info, (err, data) => {
                            if (err) {
                                console.log('Sending email error: ', err);
                                res.send('Error when sending an email');
                            } else {
                                console.log('Email sent');
                                res.render('confirm-register', {user});
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.send('Error when saving user infomation to DB');
                    });
            })
        
        })
    }

    // [GET] /user/activate-account/:id/:token
    viewActivateAccount(req, res, next) {
        let {token} = req.params;
        UserModel.findOne({_id: req.params.id})
            .then(user => {
                try {
                    const payload = jwt.verify(token, JWTPrivateKey + user.password);
                    //Update email_verified:
                    UserModel.findByIdAndUpdate(req.params.id, {email_verified: true})
                        .then(() => {
                            res.render('activate', {email: user.email});
                        })
                        .catch(() => {
                            res.render('Error when activating!');
                        })
                } catch (err) {
                    console.log(err.message);
                    res.send('Invalid or expired token!');
                }
            })
            .catch(() => {
                res.send('Invalid user id!');
            })
    }

    // [GET] /test/login
    login(req, res, next) {
        res.render('login');
    }

    // [POST] /user/auth/login
    verifyLogin(req, res, next) {
        let account = req.body.account;
        let password = req.body.password;

        UserModel.findOne({ $or: [{email: account}, {phone: account}] })
        .then(user => {
            //Check password in DB:
            bcrypt.compare(password, user.password)
            .then( result => {
                if (! result) {
                    res.send('Wrong password.');
                } else {
                    //Default algorithm: HMAC SHA256
                    let token = jwt.sign({ email: user.email }, JWTPrivateKey, {expiresIn: '3h'});
                    res.cookie('session-token', token);
                    res.redirect('/test/profile');
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.send('User not found.');
        });
    }

    // [POST] /user/auth/google-login
    verifyGoogleLogin(req, res, next) {
        const client = new OAuth2Client(CLIENT_ID);

        let google_token = req.body.credential;
        let token;
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: google_token,
                audience: CLIENT_ID,  
            });
            const payload = ticket.getPayload();

            //Default algorithm: HMAC SHA256
            token = jwt.sign({ email: payload.email }, JWTPrivateKey, {expiresIn: '3h'});
        }
        verify()
            .then(()=>{
                res.cookie('session-token', token);
                res.redirect('/test/profile');
            })
            .catch((err) => {
                console.log(err);
                res.send('Error when verifying Google account.');
            });
    }

    // [GET] /test/forgot-password
    viewForgotPassword(req, res, next) {
        res.render('forgot-password');
    }

    // [POST] /user/forgot-password
    forgotPassword(req, res, next) {

        UserModel.findOne({email: req.body.email})
            .then(user => {
                const payload = {
                    email: user.email,
                };
                let token = jwt.sign(payload, JWTPrivateKey + user.password, {expiresIn: '15m'});
                const link = `http://localhost:3000/user/reset-password/${user.id}/${token}`;

                let info = {
                    from: {
                        name: "Tiro Accounts",
                        address: "group7.int2208@gmail.com",
                    },
                    to: `${user.email}`,                         
                    subject: "Reset your Tiro password.",          
                    text: link,         
                };

                transporter.sendMail(info, (err, data) => {
                    if (err) {
                        console.log('Error while sending mail: ', err);
                        res.send(err);
                    } else {
                        console.log('Email sent');
                        res.send('Password reset link has been sent to your email...');
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.send('This email does not exist in DB.');
            });
    }

    // [GET] /user/reset-password/:id/:token
    viewResetPassword(req, res, next) {
        let {token} = req.params;
        UserModel.findOne({_id: req.params.id})
            .then(user => {
                try {
                    const payload = jwt.verify(token, JWTPrivateKey + user.password);
                    res.render('reset-password', {email: user.email});
                } catch (err) {
                    console.log(err.message);
                    res.send('Invalid or expired token!');
                }
            })
            .catch(() => {
                res.send('Invalid user id!');
            })
    }
    
    // [POST] /user/reset-password/:id/:token
    resetPassword(req, res, next) {
        UserModel.findOne({_id: req.params.id})
            .then( user => {
                const { password, confirm_password } = req.body;
                if (password !== confirm_password) {
                    return;
                } else if (password.length <2) {
                    return;
                }

                const secret = JWTPrivateKey + user.password;
                try {
                    const payload = jwt.verify(req.params.token, secret);
                    user.password = password;
                    //console.log(user);
                    res.send('Password updated');
                } catch (err) {
                    console.log(err);
                    res.send('Invalid or expired token!');
                }
            })
            .catch(() => {
                res.send('Invalid user id!');
            })
    }

    // [GET] /test/profile
    getProfile(req, res, next) {    
        let user = req.user;
        res.render('profile', {user});
    }
    
    // [GET]] /test/protected-route
    getProtectedRoute(req, res, next) {
        res.send('<br><br><br><center><h1>Có thể bạn thừa biết: Lý do bạn còn ế là do nhạt bormej!</h1></center>');
    }

    // [GET] /user/logout
    logout(req, res, next) {
        res.clearCookie('session-token');
        res.redirect('/');
    }
}

module.exports = new userController();
