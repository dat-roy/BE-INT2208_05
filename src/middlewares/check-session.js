const UserModel = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const JWTPrivateKey = process.env.JWT_PRIVATE_KEY;

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
                res.status(403).json({message: 'Your account has not been activated.'});
            }
        })
        .catch(() => {
            res.status(404).json({message: 'Your account does not exist.'});
        })
    } catch (err) {
        res.status(401).json({message: 'Please login first!'});
    }
}

module.exports = checkSession;