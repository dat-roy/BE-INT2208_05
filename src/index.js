const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const jose = require('jose');

const AuthRoute = require('../routes/auth');

var bodyParser = require("body-parser");
const mongoose = require('mongoose');


//mongoose 
mongoose.connect('mongodb://localhost:27017/mydb');
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function (callback) {
    console.log("connection succeeded");
})


//Google Auth
const { OAuth2Client } = require('google-auth-library');
const { stringify } = require('querystring');
const CLIENT_ID = '836271056493-9jkcpgrhn8qur3f65vvchuksj2m4ub1t.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const hostname = '127.0.0.1';
const PORT = 3000;

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));          //Serving static files in express

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//tạo tuyến đường cho signin function
app.use('/api', AuthRoute);

app.post('/sign_up', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var pass = req.body.password;
    var phone = req.body.phone;

    var data = {
        "name": name,
        "email": email,
        "password": pass,
        "phone": phone

    }
    db.collection('details').insertOne(data, function (err, collection) {
        if (err) throw err;
        console.log("Record inserted Successfully");

    });

    return res.sendFile(path.join(__dirname, 'view/signup_success.html'));
})

app.get('/', function (req, res) {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.sendFile(path.join(__dirname, 'view/login.html'));
})


app.get('/trang-chu', (req, res) => {
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
        .then(() => {
            res.cookie('session-token', token);
            res.send('success');
        })
        .catch(console.error);
})

app.get('/logout', (req, res) => {
    res.clearCookie('session-token');
    res.redirect('/');
})


app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
})

//Something strange