const PORT = 3000;
const hostname = '127.0.0.1';

const QRcode = require('qrcode');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { default: mongoose } = require('mongoose');
const path = require('path');
const app = express();

const MotelModel = require('./models/motel.model');
const { url } = require('inspector');
const { sendStatus } = require('express/lib/response');

mongoose.connect('mongodb://localhost:27017/mydb');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/data.json', function(req, res) {
    res.sendFile(path.join(__dirname, 'data.json'));
});

app.get('/search', (req, res)=> {
    return res.sendFile(path.join(__dirname, 'test.html'));
});

app.post('/search', (req, res)=> {
    //res.send(req.body);
    const city = req.body.city;
    const district = req.body.district;
    const ward = req.body.ward;
    MotelModel.find({
        address: {
            Tinh: city,
            Huyen: district,
            Xa: ward
        } 
   })
    .then(user =>{
       res.send(user)
    })
    
});


//QRCode
app.get('/share', (req, res) => {
    QRcode.toDataURL('http://localhost:3000/', function (err, url) {    
        res.send('<img style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;" src=' + url + '>');
    })

})

app.listen(PORT, hostname, () => {
    console.log(`http://localhost:${PORT}/search`);
})
