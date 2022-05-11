const PostModel = require('../models/post.model.js');
const UserModel = require('../models/user.model.js');

class postController {
    // [GET] /dashboard/new-post
    renderCreateNewPost(req, res, next) {
        res.render('create-new-post');
    }

    // [POST] /dashboard/new-post
    createNewPost(req, res, next) {
        const postRecord = new PostModel({
            author: req.user._id,
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
                res.redirect(`/dashboard/my-posts`);
            }) 
            .catch(err => {
                console.log(err);
                res.send('Error when saving new post');
            })
    }

    // [GET] /dashboard/my-posts
    renderMyPosts(req, res, next) {
        PostModel.find({ author: req.user._id })
        .then(posts => {
            if (posts.length == 0) {
                res.send('There is no post');
                return;
            }
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
                    .catch( err => {
                        console.log(err);
                        res.send('Posts not found');
                    })
            }
        })
        .catch(err => {
            console.log(err);
            res.send('Author not found');
        })
    }
}

module.exports = new postController();