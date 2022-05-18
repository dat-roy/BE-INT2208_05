const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller.js');
const checkSession = require('../middlewares/check-session.js');  

//=================================
router.post('/search', postController.searchPosts);
router.get('/get/:id', postController.getPostById);
router.get('/get-all', postController.getAllPosts);
router.post('/new', checkSession, postController.createNewPost);
router.get('/my-posts', checkSession, postController.getMyPosts);
router.get('/edit/:id', checkSession, postController.editPost);
router.get('/soft-delete/:id', checkSession, postController.softDeletePost);
router.get('/hard-delete/:id', checkSession, postController.hardDeletePost);

module.exports = router;