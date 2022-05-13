const UserModel = require('../models/user.model.js');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const { unlink } = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const AccountStatus = Object.freeze({
    NEW_ACCOUNT: "NEW_ACCOUNT",
    EXISTENT_ACCOUNT: "EXISTENT_ACCOUNT",
});


// Google Auth
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// [Nodemailer]
// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PWD,
    },
});

// [Bcrypt]
const saltRounds = process.env.BCRYPT_SALT_ROUNDS;

// [JWT sign]
// Default algorithm: HMAC SHA256
const JWTPrivateKey = process.env.JWT_PRIVATE_KEY;

//===========================
class userController {

    // [POST] /user/register
    /*
    async submitRegister(req, res, next) {
        const { username, email, phone, password } = req.body;

        //Check existing username & email & phone in DB:
        const user = await UserModel.findOne({ $or: [{ username: username }, { email: email }, { phone: phone }] });
        if (user) {
            return res.status(403).json({
                message: `Username /email /phone number is already used.`,
                username_existed: (username == user.username) ? true : false,
                email_existed: (email == user.email) ? true : false,
                phone_existed: (phone == user.phone) ? true : false,
            });
        }
        bcrypt.hash(password, saltRounds, (err, hashedPwd) => {
            if (err) {
                return res.status(500).json({
                    message: `Error when hash password with bcrypt`,
                    error: err.message
                });
            }
            //Email verification:`
            const payload = {
                email: email,
            };
            let token = jwt.sign(payload, JWTPrivateKey);
            const link = `http://${process.env.FRONTEND_HOST}:${process.env.FE_PORT}/user/activate-account/${token}`;

            let info = {
                from: {
                    name: "Tiro Accounts",
                    address: process.env.GOOGLE_EMAIL,
                },
                to: `${email}`,
                subject: "Tiro Account Activation.",
                text: link,
            };

            transporter.sendMail(info, (err, data) => {
                if (err) {
                    res.status(500).json({
                        message: `Error when sending an email`,
                        error: err.message
                    });
                } else {
                    let userRecord = new UserModel({
                        username: username,
                        email: email,
                        phone: phone,
                        password: hashedPwd,
                    });
                    userRecord.save()
                        .then(user => {
                            res.status(200).json({
                                message: `Saved a new user`,
                                user_data: user,
                            });
                        })
                        .catch(err => {
                            res.status(500).json({
                                message: `Error when saving user information to DB`,
                                error: err.message
                            });
                        });
                }
            });
        })
    }
    */

    // [POST] /user/register-with-google
    /*
    async submitRegisterWithGoogle(req, res, next) {
        const { username, email, phone, password } = req.body;

        //Check existing username & email & phone in DB:
        const user = await UserModel.findOne({ $or: [{ username: username }, { phone: phone }] });
        if (user) {
            return res.status(403).json({
                message: `Username/ phone number is already used`,
                username_existed: (username == user.username) ? true : false,
                phone_existed: (phone == user.phone) ? true : false,
            });
        }
        bcrypt.hash(password, saltRounds, (err, hashedPwd) => {
            if (err) {
                return res.status(500).json({
                    message: `Error when hash password with bcrypt`,
                    error: err.message
                });
            }
            UserModel.findOneAndUpdate({ email: email }, { username: username, phone: phone, password: hashedPwd })
                .then(user => {
                    let token = jwt.sign({ email: user.email }, JWTPrivateKey, { expiresIn: '3h' });
                    res.cookie('session-token', token);
                    //res.redirect('/user/profile');
                    res.status(200).json({
                        message: `Sign up with Google account successfully`,
                        user_data: user
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: `Error when saving user information to DB`,
                        error: err.message
                    });
                });
        });
    }
    */

    // [GET] /user/activate-account/:token
    /*
    activateAccount(req, res, next) {
        const { token } = req.params;
        jwt.verify(token, JWTPrivateKey, (err, payload) => {
            if (err) {
                return res.status(500).json({
                    message: `Invalid or expired token`,
                    error: err.message
                });
            }
            const email = payload.email;
            UserModel.findOneAndUpdate({ email: email }, { email_verified: true })
                .then(user => {
                    if (user) {
                        //res.render('activate', { email: user.email });
                        res.status(200).json({
                            message: `Successful when activating account`,
                            user_data: user
                        });
                    } else {
                        res.status(404).json({
                            message: `Account not found`,
                            user_data: null
                        });
                    }
                })
                .catch(err => {
                    res.status(500).json(err);
                })
        });
    }
    */

    // [GET] /user/login
    
    login(req, res, next) {
        res.render('login', { client_id: GOOGLE_CLIENT_ID });
    }
    

    // [POST] /user/auth/login
    /*
    verifyLogin(req, res, next) {
        let account = req.body.account;
        let password = req.body.password;

        UserModel.findOne({ $or: [{ email: account }, { phone: account }] })
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        message: 'User not found',
                        user_data: null
                    });
                }
                //Check password in DB:
                bcrypt.compare(password, user.password)
                    .then(result => {
                        if (!result) {
                            res.status(403).json({
                                message: 'Wrong password'
                            });
                        } else {
                            //Default algorithm: HMAC SHA256
                            let token = jwt.sign({ email: user.email }, JWTPrivateKey, { expiresIn: '3h' });
                            res.cookie('session-token', token);
                            //res.redirect('/user/profile');
                            res.status(200).json({
                                message: 'Sign in successfully',
                                user_data: user
                            })
                        }
                    });
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error when authenticating`,
                    error: err.message
                })
            })
    }
    */

    // [POST] /user/auth/google-login
    async verifyGoogleLogin(req, res, next) {
        const client = new OAuth2Client(GOOGLE_CLIENT_ID);
        const google_token = req.body.credential;
        try {
            const ticket = await client.verifyIdToken({
                idToken: google_token,
                audience: GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const email = payload.email;
            const existingUser = await UserModel.findOne({ email: email });

            if (existingUser) {
                let token = jwt.sign({ email: email }, JWTPrivateKey, { expiresIn: '3h' });
                res.cookie('session-token', token);
                if (!existingUser.picture.image_url) {
                    existingUser.picture.name = `/upload/avatar/${existingUser.picture.name}`;
                }

                if (existingUser.username && existingUser.phone /*&& existingUser.password*/) {
                    res.status(200).json({
                        is_correct: true,
                        enough_data: true,
                        account_status: AccountStatus.EXISTENT_ACCOUNT,
                        message: 'Login successfully!',
                        user_data: existingUser,
                        token: token
                    });
                } else {
                    res.status(200).json({
                        is_correct: true,
                        enough_data: false,
                        account_status: AccountStatus.EXISTENT_ACCOUNT,
                        message: 'Have not yet completed user data',
                        user_data: existingUser,
                        token: token
                    });
                }
            } else {
                const { email, given_name, family_name, picture, email_verified } = payload;
                let userRecord = new UserModel({
                    email: email,
                    given_name: given_name,
                    family_name: family_name,
                    picture: {
                        name: picture,
                        image_url: true,
                    },
                    email_verified: email_verified,
                });
                userRecord.save()
                    .then((user) => {
                        let token = jwt.sign({ email: email }, JWTPrivateKey, { expiresIn: '3h' });
                        res.cookie('session-token', token);
                        if (!user.picture.image_url) {
                            user.picture.name = `/upload/avatar/${user.picture.name}`;
                        }
                        res.status(200).json({
                            is_correct: true,
                            enough_data: false,
                            account_status: AccountStatus.NEW_ACCOUNT,
                            message: 'Create new account successfully!',
                            user_data: user,
                            token: token
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            is_correct: false,
                            enough_data: false,
                            account_status: undefined,
                            message: 'Error when saving user information to DB: ' + err.message,
                            user_data: undefined,
                            token: undefined
                        });
                    });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                is_correct: false,
                account_status: undefined,
                message: 'Error when verifying Google account: ' + err.message,
                user_data: undefined
            });
        }
    }

    // [POST] /user/forgot-password
    /*
    forgotPassword(req, res, next) {

        UserModel.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: `User not found` });
                }
                const payload = { email: user.email };
                let token = jwt.sign(payload, JWTPrivateKey + user.password, { expiresIn: '15m' });
                const link = `http://${process.env.FRONTEND_HOST}:${process.env.FE_PORT}/user/reset-password/${user.id}/${token}`;

                let info = {
                    from: {
                        name: "Tiro Accounts",
                        address: process.env.GOOGLE_EMAIL,
                    },
                    to: `${user.email}`,
                    subject: "Reset your Tiro password.",
                    text: link,
                };

                transporter.sendMail(info, (err, data) => {
                    if (err) {
                        res.status(500).json({ message: `Error when sending an email`, error: err.message });
                    } else {
                        res.status(200).json({ message: `Password reset link has been sent to user email` });
                    }
                });
            })
            .catch(err => {
                res.status(500).json({ message: `Error when findOne in DB`, error: err.message });
            });
    }
    */

    // [GET] /user/reset-password/:id/:token
    /*viewResetPassword(req, res, next) {
        let { token } = req.params;
        UserModel.findOne({ _id: req.params.id })
            .then(user => {
                try {
                    const payload = jwt.verify(token, JWTPrivateKey + user.password);
                    res.render('reset-password', { email: user.email });
                } catch (err) {
                    console.log(err.message);
                    res.send('Invalid or expired token!');
                }
            })
            .catch(() => {
                res.send('Invalid user id!');
            })
    }*/

    // [POST] /user/reset-password/:id/:token
    /*
    resetPassword(req, res, next) {
        const { id } = req.params;
        UserModel.findOne({ _id: id })
            .then(user => {
                if (!user) return res.status(404).json({ message: 'Invalid user id' });
                const { password, confirm_password } = req.body;

                jwt.verify(req.params.token, JWTPrivateKey + user.password, (err) => {
                    if (err) return res.status(401).json({ message: 'Invalid or expired token' });

                    bcrypt.hash(password, saltRounds, (err, hashedPwd) => {
                        if (err) return res.json({ message: `Error when hash password with bcrypt: ${err}` });
                        UserModel.findOneAndUpdate({ _id: id }, { password: hashedPwd })
                            .then(user => {
                                res.status(200).json({
                                    message: `Update new password successfully`,
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    message: `Error when saving user information to DB`,
                                    error: err.message
                                });
                            });
                    })
                })
            })
            .catch((err) => {
                res.status(500).json({
                    message: `Error when findOne in DB`,
                    error: err.message
                });
            })
    }
    */

    // [GET] /user/profile
    /*renderProfile(req, res, next) {
        let user = req.user;
        res.render('profile', { user });
    }*/

    // [GET] /user/settings
    /*renderUserSettings(req, res, next) {
        let user = req.user;
        res.render('user-settings', { user });
    }*/

    // [POST] /user/update
    saveUserSettings(req, res, next) {
        const user = req.user;
        const { _id, picture } = user;
        const { username, password, given_name, gender, phone, role } = req.body;
        console.log(username, password,
            given_name, gender, phone, role);

        let filename = undefined;

        const oldFilePath = path.join(__dirname, '..', 'public', picture.name);
        if (req.file) {
            if (fs.existsSync(oldFilePath)) {
                unlink(oldFilePath, err => {
                    if (err) {
                        res.status(500).json({ message: `Error when deleting an existed image`, error: err.message });
                    }
                });
            }
            filename = req.file.filename;
        }

        console.log(username || user.username);

        UserModel.findByIdAndUpdate(_id, {
            username: username || user.username,
            password: password || user.password,
            picture: {
                name: filename || user.picture.name,
                image_url: !filename,
            },
            given_name: given_name || user.given_name,
            gender: gender || user.gender,
            phone: phone || user.phone,
            role: role || user.role
        })
            .then(user => {
                //res.redirect(`/user/profile`);
                res.status(200).json({ message: `Change user settings successfully` });
            })
            .catch(err => {
                res.status(500).json({ message: `Error when saving user settings to DB`, error: err.message });
            })
    }

    // [GET] /user/logout
    logout(req, res, next) {
        res.clearCookie('session-token');
        res.redirect('/');
    }

    // [GET] /user/get
    getUserData(req, res, next) {
        const user = req.user;
        if (user) {
            res.status(200).json({
                message: 'Get user data successfully',
                user_data: user
            });
        } else {
            res.status(404).json({
                message: 'Something wrong',
                user_data: null
            })
        }
    }
}

module.exports = new userController();
