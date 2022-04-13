const posting = require("../models/post.model");
const Users = require('../models/User');
const path = require('path');
const mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function (callback) {
    console.log("connection succeeded");
})
const UnverifiedPost = (req, res, next) => {
    posting.find({ is_verified: false })
        .then(posts => {
            res.json(posts)
        })

}

const VerifiedPost = (req, res, next) => {
    posting.find({ is_verified: true })
        .then(posts => {
            res.json(posts)
        })

}


const queryRejectedPost = (req, res, next) => {
    posting.find({ status: "Rejected" })
    .then(posts =>{
        res.json(posts)
    })
}


const postDetail = (req, res, next) => {

    posting.findOne({ slug: req.params.slug })
        .then((post) => {
            res.json(post);
        })
        .catch(next)
}

const acceptedAndRejected = (req, res, next) => {
    posting.findOne({ slug: req.params.slug })
        .then((post) => {
            if (req.query.action === 'Accepted') {


                db.collection('posts').updateOne({ slug: req.params.slug }, { "$set": { "is_verified": true } })
                    .then(res.render('pages\\accepted'))
                    .catch(err => res.status(422).json(err));
            }
            if (req.query.action === 'Rejected') {
                db.collection('posts').updateOne({ slug: req.params.slug }, { "$set": { "is_verified": true } })

                db.collection('posts').updateOne({ slug: req.params.slug }, { "$set": { "status": "Rejected" } })

                res.render('pages\\rejected')
            }

        })
        .catch(next)

}



module.exports = {
    UnverifiedPost, postDetail, acceptedAndRejected, queryRejectedPost, VerifiedPost
}


