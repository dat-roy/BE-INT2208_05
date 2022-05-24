const UserModel = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const JWTPrivateKey = process.env.JWT_PRIVATE_KEY;

function checkSession(req, res, next) {
    //let token = req.cookies['session-token'];
    let {token} = req.body;
    console.log('In check-session middleware: ', token);
    try {
        //Default algorithm: HMAC SHA256
        const payload = jwt.verify(token, JWTPrivateKey);
        UserModel.findOne({ email: payload.email })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: `Your account does not exist.` });
                }
                if (!user.picture.image_url) {
                    user.picture.name = `/upload/avatar/${user.picture.name}`;
                }
                req.user = user;
                next();
            })
    } catch (err) {
        res.status(401).json({
            message: `Please login first!`,
            error: err.message
        });
    }
}

module.exports = checkSession;