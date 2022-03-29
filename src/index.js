const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const jose = require('jose');


//Google Auth
const {OAuth2Client} = require('google-auth-library');
const { stringify } = require('querystring');
const CLIENT_ID = '836271056493-9jkcpgrhn8qur3f65vvchuksj2m4ub1t.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const hostname = '127.0.0.1';
const PORT = 3000;

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));          //Serving static files in express


app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'view/index.html'));
})

app.post('/', (req, res) => {

    token = req.body.token;
    //console.log(req.body.token);

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        console.log(payload);
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
      }
    verify()
        .then(()=>{
            res.cookie('session-token', token);
            res.send('success');
        })
        .catch(console.error);
})

app.get('/logou', (req, res)=>{
    res.clearCookie('session-token');
    res.redirect('/');
})


app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
})

//Something strange