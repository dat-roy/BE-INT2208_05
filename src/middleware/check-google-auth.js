function checkGoogleAuthenticated(req, res, next) {
    //Google Auth
    const { OAuth2Client } = require('google-auth-library');
    const CLIENT_ID = '823357101372-fcr2i1ngeimfjbtqf775sgp112tijhco.apps.googleusercontent.com';
    const client = new OAuth2Client(CLIENT_ID);

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
        .then(() => {
            req.user = user;
            next();
        })
        .catch(err => {
            res.send('Chưa đăng nhập mà đòi xem???');
        })
}

module.exports = checkGoogleAuthenticated;