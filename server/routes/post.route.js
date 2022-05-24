const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller.js');
const checkSession = require('../middlewares/check-session.js');  

const saved_image_folder = 'room-img';
const upload_image_field = 'file';

//=================================
router.post('/search', postController.searchPosts);
router.get('/get/:id', postController.getPostById);
router.get('/get-all', postController.getAllPosts);
router.post('/new', checkSession, upload(saved_image_folder).array(upload_image_field), postController.createNewPost);
router.post('/my-posts', checkSession, postController.getMyPosts);
//router.get('/edit/:id', checkSession, postController.editPost);
router.post('/soft-delete/:id', checkSession, postController.softDeletePost);
router.post('/hard-delete/:id', checkSession, postController.hardDeletePost);
router.post('/save/:id', checkSession, postController.savePost);
router.post('/unsave/:id', checkSession, postController.unsavePost);

module.exports = router;