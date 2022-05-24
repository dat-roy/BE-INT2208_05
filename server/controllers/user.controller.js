const UserModel = require('../models/user.model.js');
const { AccountStatus } = require('../types/custom-types.js');
const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const { unlink } = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// Google Auth
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// [JWT sign]
// Default algorithm: HMAC SHA256
const JWTPrivateKey = process.env.JWT_PRIVATE_KEY;

//===========================
class userController {

    // [GET] /user/login
    login(req, res, next) {
        res.render('login', { client_id: GOOGLE_CLIENT_ID });
    }

    // [POST] /user/auth/google-login
    async verifyGoogleLogin(req, res, next) {
        const client = new OAuth2Client(GOOGLE_CLIENT_ID);
        console.log(req.body.credential);
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
                //res.cookie('session-token', token);
                if (!existingUser.picture.image_url) {
                    existingUser.picture.name = `/upload/avatar/${existingUser.picture.name}`;
                }

                if (existingUser.username && existingUser.phone) {
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
                        //res.cookie('session-token', token);
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
                enough_data: undefined,
                account_status: undefined,
                message: 'Error when verifying Google account: ' + err.message,
                user_data: undefined,
                token: undefined,
            });
        }
    }

    // [GET] /user/logout
    logout(req, res, next) {
        res.clearCookie('session-token');
        res.status(200).json({
            message: 'Logout successfully',
        })
    }

    // [POST] /user/get-me
    getLoggedInUserData(req, res, next) {
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

    // [GET] /user/get/:id
    getUserDataById(req, res, next) {
        const user_id = req.params.id;
        UserModel.findById(user_id) 
            .then(user => {
                if (! user) {
                    return res.status(404).json({
                        message: "No user found",
                        user: null,
                        error: null,
                    })
                }
                else {
                    return res.status(200).json({
                        message: "Get user by id successfully",
                        user: user, 
                        error: null,
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "Error from server",
                    user: null,
                    error: err.message,
                })
            })
    }
    // [POST] /user/update
    updateSettings(req, res, next) {
        const user = req.user;
        const { _id, picture } = user;
        const { username, given_name, family_name, gender, phone, role } = req.body;

        let filename = undefined;

        const oldFilePath = path.join(__dirname, '..', 'public', picture.name);
        if (req.file) {
            if (fs.existsSync(oldFilePath)) {
                unlink(oldFilePath, err => {
                    if (err) {
                        res.status(500).json({ 
                            message: `Error when deleting an existed image`, 
                            error: err.message 
                        });
                    }
                });
            }
            filename = req.file.filename;
        }

        UserModel.findByIdAndUpdate(_id, {
            username: username || user.username,
            picture: {
                name: filename || user.picture.name,
                image_url: !filename,
            },
            given_name: given_name || user.given_name,
            family_name: family_name || user.family_name,
            gender: gender || user.gender,
            phone: phone || user.phone,
            role: role || user.role
        })
            .then(user => {
                res.status(200).json({ 
                    message: `Change user settings successfully`,
                    error: null,
                });
            })
            .catch(err => {
                res.status(500).json({ 
                    message: `Error when saving user settings to DB`, 
                    error: err.message 
                });
            })
    }
}

module.exports = new userController();
