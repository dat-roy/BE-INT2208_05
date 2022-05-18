const PostModel = require('../models/post.model.js');
const UserModel = require('../models/user.model.js');
const {RoleOptions, PostStatus} = require('../types/custom-types.js');

class adminController {
    
    // [GET] /admin/get/pending-posts
    getPendingPosts(req, res, next) {
        const {user} = req;
        if (user.role != RoleOptions.ADMIN) {
            return res.status(403).json({
                message: `Forbidden: user is not an admin.`,
                posts: null,
                error: null,
            })
        } 
        PostModel.find({ status: PostStatus.PENDING })
            .then(posts => {
                res.status(200).json({
                    message: `Get all pending posts successfully`,
                    posts: posts,
                    error: null,
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error when finding posts`,
                    posts: null,
                    error: err.message,
                })
            })
    }

    // [GET] /admin/get/approved-posts
    getApprovedPosts(req, res, next) {
        const {user} = req;
        if (user.role != RoleOptions.ADMIN) {
            return res.status(403).json({
                message: `Forbidden: user is not an admin.`,
                posts: null,
                error: null,
            })
        } 
        PostModel.find({ status: PostStatus.APPROVED })
            .then(posts => {
                res.status(200).json({
                    message: `Get all approved posts successfully`,
                    posts: posts,
                    error: null,
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error when finding posts`,
                    posts: null,
                    error: err.message,
                })
            })
    }

    // [GET] /admin/get/rejected-posts 
    getRejectedPosts(req, res, next) {
        const {user} = req;
        if (user.role != RoleOptions.ADMIN) {
            return res.status(403).json({
                message: `Forbidden: user is not an admin.`,
                posts: null,
                error: null,
            })
        } 
        PostModel.find({ status: PostStatus.REJECTED })
            .then(posts => {
                res.status(200).json({
                    message: `Get all rejected posts successfully`,
                    posts: posts,
                    error: null,
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error when finding posts`,
                    posts: null,
                    error: err.message,
                })
            })
    }

    // [GET] /admin/approve/:id
    setApproved(req, res, next) {
        const {user} = req;
        const post_id = req.params.id;
        if (user.role != RoleOptions.ADMIN) {
            return res.status(403).json({
                message: `Forbidden: user is not an admin.`,
                post: null,
                error: null,
            })
        } 
        PostModel.findByIdAndUpdate(post_id, { 
            status: PostStatus.APPROVED, 
        })
            .then(post => {
                res.status(200).json({
                    message: `Set approved successfully`,
                    post: post,
                    error: null,
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: `Invalid post id`,
                    posts: null,
                    error: err.message,
                })
            })
    }   

    // [GET] /admin/reject/:id
    setRejected(req, res, next) {
        const {user} = req;
        const post_id = req.params.id;
        if (user.role != RoleOptions.ADMIN) {
            return res.status(403).json({
                message: `Forbidden: user is not an admin.`,
                post: null,
                error: null,
            })
        } 
        PostModel.findByIdAndUpdate(post_id, { 
            status: PostStatus.REJECTED, 
        })
            .then(post => {
                res.status(200).json({
                    message: `Set rejected successfully`,
                    post: post,
                    error: null,
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: `Invalid post id`,
                    posts: null,
                    error: err.message,
                })
            })
    }
}

module.exports = new adminController();