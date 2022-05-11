const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller.js');
const checkSession = require('../middlewares/check-session.js');

//Views (for testing & demo)
router.get('/new-post', checkSession, postController.renderCreateNewPost);      

//Server
router.post('/new-post', checkSession, postController.createNewPost);
router.get('/my-posts', checkSession, postController.getMyPosts);
router.post('/search', postController.searchPosts);

module.exports = router;