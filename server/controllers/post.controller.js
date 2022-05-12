const PostModel = require('../models/post.model.js');
const UserModel = require('../models/user.model.js');

class postController {
    // [GET] /post/new-post
    renderCreateNewPost(req, res, next) {
        res.render('create-new-post');
    }

    // [POST] /post/new-post
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
                res.status(200).json({
                    message: 'Create new post successfully',
                });
            }) 
            .catch(err => {
                res.status(500).json({
                    message: 'Error when saving new post',
                    error: err.message,
                });
            })
    }

    // [GET] /post/my-posts
    getMyPosts(req, res, next) {
        PostModel.find({ author: req.user._id })
        .then(posts => {
            if (posts.length == 0) {
                return res.status(200).json({
                    message: 'There is no post',
                });
            }
            res.status(200).json({
                message: 'Fetch all posts successfully',
                posts_list: posts,
            })
        })
        .catch(err => {
            res.status(404).json({
                message: 'Author not found',
                error: err.message,
            });
        })
    }

    // [POST] /post/search
    searchPosts(req, res, next) {
        
        /*Request form data: 
        /// NOTE: undefined here means 'accepting all options'.
        {
            room_type: String {undefined by default, ... }
            gender: String, {undefined by default, 'male', 'female'}
            min_room_area: Number, {undefined by default, ...}
            max_room_area: Number, {undefined by default, ...}
            capacity: Number, {1 by default, 2, 3, ...}
            min_price: Number, {undefined by default}
            max_price: Number, {undefined by default}
        }
        */
        const { room_type, gender, min_room_area, max_room_area, capacity, min_price, max_price } = req.body;

        let filter_map = new Map();
        if (room_type) {
            filter_map.set('information.room_type', room_type);
        }
        if (gender) {
            filter_map.set('information.gender', gender);
        }
        if (min_room_area && max_room_area) {
            filter_map.set('information.room_area', 
                { $gte: min_room_area, $lte: max_room_area }
            );
        }
        if (capacity) {
            filter_map.set('information.capacity', capacity);
        }
        if (min_price && max_price) {
            filter_map.set('information.expenses.rental_price', 
                { $gte: min_price, $lte: max_price }
            );
        }
        
        const filter = Object.fromEntries(filter_map);
        //console.log(filter);
        
        PostModel.find(filter)
            .then(posts => {
                if (! posts) {
                    res.status(404).json({
                        message: 'No result found'
                    })
                } else {
                    res.status(200).json({
                        message: 'Search results:',
                        total_posts: posts.length,
                        posts: posts
                    });
                }
            }) 
            .catch(err => {
                res.status(500).json({
                    message: 'Error when searching posts',
                    error: err.message
                })
            })
    }
}

module.exports = new postController();