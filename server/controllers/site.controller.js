const UserModel = require('../models/user.model.js');
const PostModel = require('../models/post.model.js');
const {PriceCategory} = require('../types/custom-types.js');
const QRcode = require('qrcode');
const dotenv = require('dotenv');
dotenv.config();

const {FRONTEND_HOST} = process.env;

class siteController {
    // [GET] /
    home(req, res) {
        res.render('index');
    }
    // [GET] /share/qr
    shareByQR(req, res) {
        //const url = `https://${FRONTEND_HOST}`;
        const {url} = req.body;
        if (! url) {
            return res.status(404).json({
                message: `URL is empty`,
                error: `empty`,
                qr_url: null,
            })
        }
        QRcode.toDataURL(url, function (err, qr_url) {    
            if (err) {
                res.status(500).json({
                    message: `Error when generate a QR code`,
                    error: err,
                    qr_url: null,
                })
            } else {
                //res.send('<img style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;" src=' + qr_url + '>');
                res.status(200).json({
                    message: `Generate a QR code successfully`,
                    error: null,
                    qr_url: qr_url,
                })
            }
        });
    }

    // [POST] /search-by-text
    searchByText(req, res) {
        const text = req.body.text;
        PostModel.find({
            $text: { $search: text },
        }) 
            .then(posts => {
                if (! posts) {
                    return res.status(404).json({
                        message: "No post found",
                        posts: null, 
                        error: null,
                    })
                } else {
                    return res.status(200).json({
                        message: "Find posts successfully",
                        posts: posts,
                        error: null,
                    })
                }
            })
            .catch(err => {
                return res.status(500).json({
                    message: "Error from server",
                    posts: posts,
                    error: err.message,
                })
            })
    }   

    // [POST] /search-in-user
    searchUser(req, res) {
        const text = req.body.content;       //Search content
        UserModel.find({
            $or: [
                {username: text},
                {email: text},
                {phone: text},
            ]
        })
            .then(users => {
                if (! users) {
                    return res.status(404).json({
                        message: "No user found",
                        users: users,
                        error: null,
                    })
                } else {
                    return res.status(200).json({
                        message: "Find users successfully",
                        users: users,
                        error: null,
                    })
                }
            })
            .catch(err => {
                return res.status(500).json({
                    message: "Error from server",
                    users: null,
                    error: err.message,
                })
            })
    }

    // [POST] /search-in-post       
    searchPost(req, res) {
        const address = req.body.address;                       
        const price_category = req.body.price_category;          //Data got from options
        
        let filter_map = new Map();
        if (address) {
            filter_map.set('address.address', address);
        }
        if (price_category) {
            switch (price_category) 
            {
                case PriceCategory.LOWER_2M: 
                    filter_map.set('information.expenses.rental_price', 
                        { $gte: 0, $lte: 2000000 }
                    );
                break;

                case PriceCategory.FROM_2M_TO_4M:
                    filter_map.set('information.expenses.rental_price', 
                        { $gte: 2000000, $lte: 4000000 }
                    );
                break;

                case PriceCategory.HIGHER_4M:
                    filter_map.set('information.expenses.rental_price', 
                        { $gte: 4000000, }
                    );
                break;
            }
        }

        const filter = Object.fromEntries(filter_map);

        PostModel.find(filter)
            .then(posts => {
                if (! posts) {
                    return res.status(404).json({
                        message: "No post found",
                        posts: null,
                        error: null
                    })
                } else {
                    return res.status(200).json({
                        message: "Search posts successfully",
                        posts: posts,
                        error: null,
                    })
                }
            })
            .catch(err => {
                return res.status(500).json({
                    message: "Error from server",
                    posts: null,
                    error: err.message,
                })
            })
    }
}

module.exports = new siteController();
