const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middlewares/auth');
const mediaUpload = require('../middlewares/fileUpload');
const { body } = require('express-validator');

// Create post with media upload
router.post('/', [
  auth,
  mediaUpload.single('file'), // Changed from 'media' to 'file' to match frontend
  body('content').optional().trim()
], postController.createPost);

// Get feed & explore
router.get('/', auth, postController.getFeed);
router.get('/explore', auth, postController.getExplorePosts);

// Single post operations
router.get('/:id', auth, postController.getSinglePost);
router.put('/:id', [
  auth,
  body('content').trim().notEmpty()
], postController.updatePost);
router.delete('/:id', auth, postController.deletePost);

// Post interactions
router.post('/:id/like', auth, postController.likePost);
router.post('/:id/comment', [
  auth,
  body('content').trim().notEmpty()
], postController.addComment);
router.get('/:id/comments', auth, postController.getComments);
router.post('/:id/bookmark', auth, postController.bookmarkPost);

module.exports = router;