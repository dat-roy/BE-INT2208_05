const UserModel = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const JWTPrivateKey = "TiroAccounts";

function checkSession(req, res, next) {
    let token = req.cookies['session-token'];
    try {
        //Default algorithm: HMAC SHA256
        const payload = jwt.verify(token, JWTPrivateKey);
        UserModel.findOne({ email: payload.email})
        .then(user => {
            if (user.email_verified == true) {
                req.user = user;
                next();
            } else {
                res.send('Your account has not been activated.');
            }
        })
        .catch(() => {
            res.send('Your account does not exist.');
        })
    } catch (err) {
        res.send('Please login first!');
    }
}

module.exports = checkSession;