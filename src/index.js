const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const jose = require('jose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthRoute = require('../routes/auth');
const AdminRoute = require('../routes/admin');

var bodyParser = require("body-parser");
const mongoose = require('mongoose');


//mongoose 
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true });


var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function (callback) {
    console.log("connection succeeded");
})
module.exports = db

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
app.use(express.static('public'));  //Serving static files in express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var data = {
    "postingPerson:": "Hoài Linh",
    "content": "nhà thờ tổ 100 tỉ",
    "image": "https://kenh14cdn.com/thumb_w/660/203336854389633024/2021/6/22/dji0954-1624324524054256485129.jpg",
    "price": 20000000000000
}


db.collection('postings').insertOne(data, function (err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");

});


//tạo tuyến đường cho signin function
app.use('/api', AuthRoute);
app.use('/admin', AdminRoute);
app.post('/sign_up', function (req, res) {
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if (err) {
            res.json({
                error: err
            })
        }
        var username = req.body.username;
        var email = req.body.email;
        var phone = req.body.phone;
        var given_name = req.body.given_name;
        var family_name = req.body.family_name;
        var picture = req.body.picture;
        var role = req.body.role;
        var gender = req.body.gender;


        var data = {
            "name": username,
            "email": email,
            "password": hashedPass,
            "phone": phone,
            "given_name": given_name,
            "family_name": family_name,
            "picture": picture,
            "role": role,
            "gender": gender
        }
        db.collection('users').insertOne(data, function (err, collection) {
            if (err) throw err;
            console.log("Record inserted Successfully");

        });

        return res.sendFile(path.join(__dirname, 'views/signup_success.html'));
    }
    )
}
)

//---------------------- Đạt's work ---------------------------------------------------------------------------
app.get('/', (req, res) => {
    res.render('index', { id: '6253e78ee20cb58f432cd4bd' });
});

const UserModel = require('../models/user.model.js');

app.get('/user/settings/:id', (req, res) => {

    UserModel.findOne({ id: req.params.id })
        .then(user => {
            res.render('user-settings', { user: user });
        })
});

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/upload/avatar/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });
const fs = require('fs');
const { unlink } = require('fs');

app.post('/user/settings/:id', upload.single('avatar'), (req, res) => {
    const { username, family_name, given_name, gender, phone } = req.body;

    UserModel.findById(req.params.id)
        .then(user => {
            const oldFilePath = path.join(__dirname, 'public', 'upload', 'avatar', user.picture);
            if (req.file) {
                if (fs.existsSync(oldFilePath)) {
                    unlink(oldFilePath, err => {
                        if (err) console.log(err);
                    });
                }
                var filename = req.file.filename;
            } else {
                var filename = user.picture;
            }

            UserModel.findByIdAndUpdate(req.params.id, {
                username: username,
                picture: filename,
                family_name: family_name,
                given_name: given_name,
                gender: gender,
                phone: phone,
            })
                .then(user => {
                    res.redirect(`/user/settings/${req.params.id}`);
                })
        })
        .catch(err => {
            console.log(err);
        })
});

const PostModel = require('../models/post.model.js');
const { render } = require('ejs');
app.get('/dashboard/:id/new-post', (req, res) => {
    res.render('create-new-post');
});

app.post('/dashboard/:id/new-post', (req, res) => {
    const postRecord = new PostModel({
        author: req.params.id,
        information: {
            room_type: req.body.room_type,
            capacity: req.body.capacity,
            gender: req.body.gender,
            room_area: req.body.room_area,
            expenses: {
                rental_price: req.body.rental_price,
                deposit: req.body.deposit,
                electricity_cost: req.body.electricity_cost,
                water_cost: req.body.water_cost,
                internet_cost: req.body.internet_cost,
            },
            has_parking_space: req.body.has_parking_space,
            parking_cost: req.body.parking_cost,
        },
        address: {
            city: req.body.city,
            district: req.body.district,
            ward: req.body.ward,
            street: req.body.street,
            house_number: req.body.house_number,
        },
        utilities: {
            //images: [req.file.filename],
            utils: [req.body.utils],
        },
        confirmation: {
            phone_number: req.body.phone_number,
            title_of_post: req.body.title_of_post,
            room_description: req.body.room_description,
            open_time: req.body.open_time,
            closing_time: req.body.closing_time,
        },
        is_verified: req.body.is_verified,
    });
    postRecord.save()
        .then(post => {
            res.redirect(`/dashboard/${req.params.id}/my-posts`);
        })
        .catch(err => {
            console.log(err);
        })
});

app.get('/dashboard/:id/my-posts', (req, res) => {
    PostModel.find({ author: req.params.id })
        .then(posts => {
            var postList = [];
            for (const post of posts) {
                UserModel.findById(post.author)
                    .then(author => {
                        postList.push({
                            _id: post.id,
                            author: {
                                username: author.username,
                                email: author.email,
                                picture: author.picture,
                            },
                            title: post.title,
                            address: post.address,
                            is_verified: post.is_verified,
                            createdAt: post.createdAt,
                            updatedAt: post.updatedAt,
                        });
                        if (posts.indexOf(post) == posts.length - 1)
                            res.render('my-posts', { postList: postList });
                        //console.log(postList);
                    })
            }
        })
        .catch(err => {
            console.log(err);
        })
})


//--------------------------------------end of Đạt's work------------------------------------------------------









app.get('/', function (req, res) {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.sendFile(path.join(__dirname, 'views/signup.html'));
})

app.get('/trang-chu', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
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