const UserModel = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

function checkSession(req, res, next) {
    const JWTPrivateKey = "TiroAccounts";

    let token = req.cookies['session-token'];
    let user = {};
    async function verify() {
        //Default algorithm: HMAC SHA256
        const payload = jwt.verify(token, JWTPrivateKey);
        //UserModel.findOne({ email: payload.email})
        user.email = payload.email;
        //console.log(user);
    }
        verify()
        .then(() => {
            req.user = user;
            next();
        })
        .catch(() => {
            res.send('Chưa đăng nhập mà đòi xem???');
        })
}

module.exports = checkSession;