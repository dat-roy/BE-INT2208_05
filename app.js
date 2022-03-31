const express = require('express')
const jwt = require('jsonwebtoken')
const { nextTick } = require('process')
const { errorMonitor } = require('stream')
const nodemailer = require("nodemailer")
const port = 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.set('view engine', 'ejs')

let user = {
    id: "ahdfksjdldfa",
    email: "hungk19elqd@gmail.com",
    password: "123456"
}

const JWT_SECRET = 'some super secret';

app.get('/', (req, res) => {
    res.send();
});

app.get('/forgot-password', (req, res, next) => {
    res.render('forgot-password');
});

app.post('/forgot-password', async(req, res) => {
    const { email } = req.body;
    if (email !== user.email) {
        res.send("user not registered");
        return;
    }

    const secret = JWT_SECRET + user.password
    const payload = {
        email: user.email,
        id: user.id
    }

    const token = jwt.sign(payload, secret, {expiresIn: '15m'})
    const link = `http://localhost:3000/reset-password/${user.id}/${token}`
    console.log(link);
    res.send('password reset link has been sent to ur email...')

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: "gmail",   
    auth: {
      user: "group7.int2208@gmail.com", // generated ethereal user
      pass: "nhom7isthebest", // generated ethereal password
    },
  });

  let info = {
    from: "group7.int2208@gmail.com", // sender address
    to: `${email}`, // list of receivers
    subject: "Hello ✔", // Subject line
    text: link, // plain text body
  };

  transporter.sendMail(info, function(err, data) {
    if (err) {
        console.log('Error', err);
    } else {
        console.log('email sent');
    }
  });

});

app.get('/reset-password/:id/:token', (req, res, next) => {
    const { id, token } = req.params;
    
    if (id !== user.id) {
        res.send('Invalid id...')
        return;
    }

    const secret = JWT_SECRET + user.password;
    try {
        const payload = jwt.verify(token, secret)
        res.render('reset-password', {email: user.email})
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }

 });

 app.post('/reset-password/:id/:token', (req, res, next) => {
    const { id, token} = req.params;
    const {password, password2} = req.body;
    if (id !== user.id) {
        res.send('Invalid id...')
        return;
    }

    if (password !== password2) {
        return;
    } else if (password.length <2) {
        return;
    }

    const secret = JWT_SECRET + user.password;
    try {
        const payload = jwt.verify(token, secret)
        user.password = password;
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }

 });

app.listen(port, () => console.log(`http://localhost:${port}/forgot-password`));