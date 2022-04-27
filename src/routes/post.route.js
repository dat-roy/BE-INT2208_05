const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller.js');
const checkSession = require('../middlewares/check-session.js');

router.get('/new-post', checkSession, postController.renderCreateNewPost);
router.post('/new-post', checkSession, postController.createNewPost);
router.get('/my-posts', checkSession, postController.renderMyPosts);

module.exports = router;