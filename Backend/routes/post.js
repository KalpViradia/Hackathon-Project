const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

router.post('/', auth, postController.createPost);
router.get('/', auth, postController.getPosts);
router.get('/explore', auth, postController.getExplorePosts);
router.get('/:id', auth, postController.getPostById);
router.put('/:id', auth, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);
router.post('/:id/like', auth, postController.likeUnlikePost);
router.post('/:id/comment', auth, postController.addComment);
router.get('/:id/comments', auth, postController.getComments);
router.post('/:id/bookmark', auth, postController.bookmarkPost);

module.exports = router; 