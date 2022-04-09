//Define hostname & port
const hostname = '127.0.0.1';
const PORT = 3000;

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

//Initialize app
const app = express();
//Connect to MongoDB
const db = require('./config/db/index.db');
db.connect();

//------ Middleware -----//
//[express] Serving static files in express
app.use(express.static(path.join(__dirname, 'public')));  
//[cookie-parser] Parse cookie header
app.use(cookieParser());        
//[body-parser] Parse request object as a JSON object: application/json
app.use(bodyParser.json()); 
//[body-parser] Parse urlencoded bodies: application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//Set view engine
app.set('view engine', 'ejs');
//Set views folder path
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    res.render('index', {id: '624981697be8cc7c759a13f1'});
});

const UserModel = require('./models/user.model.js');

app.get('/user/settings/:id', (req, res) => {
    
    UserModel.findOne({id: req.params.id})
        .then( user => {
            res.render('user-settings', {user: user});
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

const upload = multer({ storage: storage});
const fs = require('fs');
const { unlink } = require('fs');

app.post('/user/settings/:id', upload.single('avatar'), (req, res) => {
    const { username, family_name, given_name, gender, phone } = req.body;

    UserModel.findById(req.params.id)
        .then (user => {
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
        .catch( err => {
            console.log(err);
        })
});

const PostModel = require('./models/post.model.js');
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
                            res.render('my-posts', {postList: postList});
                            //console.log(postList);
                    })
            }
        })
        .catch(err => {
            console.log(err);
        })
})

app.listen(PORT, hostname, () => {
    console.log(`Running on port ${PORT}`);
})
