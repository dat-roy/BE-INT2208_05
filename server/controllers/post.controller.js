const PostModel = require('../models/post.model.js');
const UserModel = require('../models/user.model.js');

class postController {

    // [POST] /post/search
    searchPosts(req, res, next) {
        
        /*Request form data: 
        /// NOTE: undefined here means 'accepting all options'.
        {
            room_type: String {undefined by default, ... }
            gender: String, {'all' by default, 'male', 'female'}
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
        console.log(min_room_area && max_room_area);
        if (min_room_area && max_room_area) {
            filter_map.set('information.room_area', 
                { $gte: min_room_area, $lte: max_room_area }
            );
        }
        else if (min_room_area) {
            console.log("MIN", min_room_area);
            filter_map.set('information.room_area', 
            { $gte: min_room_area }
            )
        } else if (max_room_area) {
            filter_map.set('information.room_area', 
            { $lte: max_room_area }
            )
        }
        if (capacity) {
            filter_map.set('information.capacity', capacity);
        }
        if (min_price && max_price) {
            filter_map.set('information.expenses.rental_price', 
                { $gte: min_price, $lte: max_price }
            );
        } else if (min_price) {
            filter_map.set('information.expenses.rental_price', 
                { $gte: min_price }
            );
        } else if (max_price) {
            filter_map.set('information.expenses.rental_price', 
                { $lte: max_price }
            );
        }
        
        const filter = Object.fromEntries(filter_map);
        //console.log(filter);
        
        PostModel.find(filter)
            .then(posts => {
                if (! posts) {
                    res.status(404).json({
                        message: 'No result found',
                        count_posts: 0,
                        posts: null,
                        error: null,
                    })
                } else {
                    res.status(200).json({
                        message: 'Search results:',
                        count_posts: posts.length,
                        posts: posts,
                        error: null,
                    });
                }
            }) 
            .catch(err => {
                res.status(500).json({
                    message: 'Error when searching posts',
                    count_posts: 0,
                    posts: null,
                    error: err.message
                })
            })
    }

    // [GET] /post/get/:id
    getPostById(req, res, next) {
        const _id = req.params.id;
        PostModel.findById(_id) 
            .then(post => { 
                if (! post) {
                    res.status(404).json({
                        message: 'Can not find this post',
                        post: null,
                        error: null,
                    })
                } else {
                    res.status(200).json({
                        message: 'Fetch a post successfully',
                        post: post,
                        error: null,
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Error when getting a post by id',
                    post: null,
                    error: err.message
                })
            });
    }

    // [GET] /post/get-all
    getAllPosts(req, res, next) {
        PostModel.find({})
            .then(posts => {
                if (! posts) {
                    res.status(404).json({
                        message: 'There is no post',
                        posts: null,
                        error: null,
                    })
                } else {
                    res.status(200).json({
                        message: 'Fetch all posts successfully',
                        posts: posts,
                        error: null, 
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Error when getting all posts',
                    posts: null,
                    error: err.message,
                })
            })
    }

    //TODO: add uploading images
    // [POST] /post/new
    createNewPost(req, res, next) {
        const {                    
            room_type, 
            capacity, 
            gender, 
            room_area, 
            rental_price,
            deposit,
            electricity_cost,
            water_cost,
            internet_cost,
            has_parking_space,
            parking_cost,
            city,
            district,
            ward, 
            street,
            house_number,
            filename_list,
            utils_list,
            phone_number,
            title_of_post,
            room_description, 
        } = req.body;
        const postRecord = new PostModel({
            author: req.user._id,
            information: {
                room_type: room_type,
                capacity: capacity,
                gender: gender,
                room_area: room_area,
                expenses: {
                    rental_price: rental_price,
                    deposit: deposit,
                    electricity_cost: electricity_cost,
                    water_cost: water_cost,
                    internet_cost: internet_cost,
                },
                has_parking_space: has_parking_space, 
                parking_cost: parking_cost,
            },
            address: {
                city: city,
                district: district,
                ward: ward,
                street: street,
                house_number: house_number,
            },
            utilities: {
                //images: [filename_list],
                utils: [utils_list],
            },
            confirmation: {
                phone_number: phone_number,
                title_of_post: title_of_post,
                room_description: room_description,
            },
        });
        postRecord.save()
            .then((post) => {
                if (post) {
                    res.status(200).json({
                        message: 'Create new post successfully',
                        post_id: post._id,
                        error: null,
                    });
                } else {
                    res.status(500).json({
                        message: 'Error when saving new post',
                        post_id: null,
                        error: err.message,
                    });
                }
            })
    }

    // [GET] /post/my-posts
    getMyPosts(req, res, next) {
        PostModel.find({ author: req.user._id })
            .then(posts => {
                if (posts.length == 0) {
                    return res.status(200).json({
                        message: 'There is no post',
                        posts: null,
                        error: null, 
                    });
                }
                res.status(200).json({
                    message: 'Fetch all my posts successfully',
                    posts: posts,
                    error: null,
                })
            })
            .catch(err => {
                res.status(404).json({
                    message: 'Author not found',
                    posts: null,
                    error: err.message,
                });
            })
    }

    //TODO: add findByIdAndUpdate
    // [GET] /post/edit/:id
    async editPost(req, res, next) {
        const post_id = req.params.id;
        const post = await PostModel.findById(post_id);
        if (! post) {
            return res.status(404).json({
                message: "Invalid post id",
            })
        } 
        if (post.author != user._id) {
            return res.status(403).json({
                message: "Access is denied",
            })
        } 
        //PostModel.findByIdAndUpdate(post.author, {})
    }

    // [GET] /post/soft-delete/:id
    async softDeletePost(req, res, next) {
        const user_id = req.user._id;
        const post_id = req.params.id;
        const post = await PostModel.findById(post_id);
        if (! post) {
            return res.status(404).json({
                message: "Invalid post id",
                error: null,
            })
        } 
        console.log(user_id);
        if (! post.author.equals(user_id)) {
            return res.status(403).json({
                message: "Access is denied",
                error: null,
            })
        } 
        PostModel.findByIdAndUpdate(post_id, {soft_delete: true}, (err, docs) => {
            if (err) {
                res.status(500).json({
                    message: "Error when soft delete a post",
                    error: err.message,
                })
            } else {
                res.status(200).json({
                    message: "Soft delete a post successfully",
                    error: null,
                })
            }
        })
    }

    // [GET] /post/hard-delete/:id
    async hardDeletePost(req, res, next) {
        const user_id = req.user._id;
        const post_id = req.params.id;
        const post = await PostModel.findById(post_id);
        if (! post) {
            return res.status(404).json({
                message: "Invalid post id",
                error: null,
            })
        } 
        if (! post.author.equals(user_id)) {
            return res.status(403).json({
                message: "Access is denied",
                error: null,
            })
        } 
        PostModel.findByIdAndDelete(post_id, (err, docs) => {
            if (err) {
                res.status(500).json({
                    message: "Error when hard delete a post",
                    error: err.message,
                })
            } else {
                res.status(200).json({
                    message: "Hard delete a post successfully",
                    error: null,
                })
            }
        })
    }
}

module.exports = new postController();