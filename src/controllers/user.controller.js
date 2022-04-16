const UserModel = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

//Google Auth
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '823357101372-fcr2i1ngeimfjbtqf775sgp112tijhco.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

//===========================
class userController {

    // [GET] /user/register
    register(req, res, next) {
        res.render('register');
    }
    
    // [POST] /user/register
    submitRegister(req, res, next) {
        const saltRounds = 10;

        bcrypt.hash(req.body.password, saltRounds, (err, hashedPwd) => {
            if (err) {
                res.json({
                    error: err
                });
            }
            let userRecord = new UserModel({
                username: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPwd,
            });
            userRecord.save()
                .then(user => {
                    console.log(user);
                    res.send("Registered successfully");
                })
                .catch(error => res.json({
                    message: 'An error occurred!'
                }));
        })
    }

    // [GET] /user/login
    login(req, res, next) {
        res.render('login');
    }

    // [POST] /user/auth/login
    verifyLogin(req, res, next) {
        let account = req.body.account;
        let password = req.body.password;

        UserModel.findOne({ $or: [{email: account}, {phone: account}] })
            .then(user => {
                if (! user) {
                    res.json({
                        message: 'User not found!'
                    });
                } 
                else {
                    bcrypt.compare(password, user.password)
                        .then(result => {
                            if (! result) {
                                res.json({
                                    message: 'Password do not match',
                                });
                            } 
                            let token = jwt.sign({name: user.name}, 'secretValue', {expiresIn: '1h'});
                            res.json({
                                message: 'Login successful',
                                token,
                            })
                        })
                        .catch(err => res.json({ error: err }) );
                }
            })
            //.catch( (err) => res.json({ error: err}) );
    }

    // [POST] /user/auth/google-login
    verifyGoogleLogin(req, res, next) {
        let token = req.body.credential;
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,  
            });
            const payload = ticket.getPayload();
            console.log(payload);
            //console.log(payload);
            //const userid = payload['sub'];
        }
        verify()
            .then(()=>{
                res.cookie('session-token', token);
                res.redirect('/test/profile');
            })
            .catch(console.error);
    }

    // [GET] /user/forgot-password
    viewForgotPassword(req, res, next) {
        res.render('forgot-password');
    }

    // [POST] /user/forgot-password
    forgotPassword(req, res, next) {
        const JWT_SECRET = 'some super secret';

        UserModel.findOne({email: req.body.email})
            .then(user => {
                
                const secret = JWT_SECRET + user.password;
                const payload = {
                    email: user.email,
                    id: user.id,
                };
                let token = jwt.sign(payload, secret, {expiresIn: '15m'});
                const link = `http://localhost:3000/user/reset-password/${user.id}/${token}`;
                //console.log(link);

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    service: "gmail",   
                    auth: {
                        user: "group7.int2208@gmail.com", 
                        pass: "nhom7isthebest",
                    },
                });

                let info = {
                    from: "Tiro Accounts",                  
                    to: `${user.email}`,                         
                    subject: "Bạn Có Thư Tình???",          
                    text: link,                             // plain text body
                };

                transporter.sendMail(info, (err, data) => {
                    if (err) {
                        console.log('Error: ', err);
                    } else {
                        console.log('Email sent');
                    }
                });
                res.send('Password reset link has been sent to your email...');
            })
            .catch(err => {
                //console.log(err);
            });
    }

    // [GET] /user/reset-password/:id/:token
    viewResetPassword(req, res, next) {
        const JWT_SECRET = 'some super secret';

        var {token} = req.params;
        UserModel.findOne({id: req.params.id})
            .then(user => {
                const secret = JWT_SECRET + user.password;
                try {
                    const payload = jwt.verify(token, secret);
                    res.render('reset-password', {email: user.email});
                } catch (err) {
                    //console.log(err.message);
                    res.send(err.message);
                }
            })
    }
    
    // [POST] /user/reset-password/:id/:token
    resetPassword(req, res, next) {
        const JWT_SECRET = 'some super secret';
        UserModel.findOne({id: req.params.id})
            .then( user => {
                const { password, confirm_password } = req.body;
                if (password !== confirm_password) {
                    return;
                } else if (password.length <2) {
                    return;
                }

                const secret = JWT_SECRET + user.password;
                try {
                    const payload = jwt.verify(req.params.token, secret)
                    user.password = password;
                    res.send(user);
                } catch (error) {
                    console.log(error.message);
                    res.send(error.message);
                }
            })
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

    // [GET] /user/logout
    logout(req, res, next) {
        res.clearCookie('session-token');
        res.redirect('/');
    }
}

module.exports = new userController();
