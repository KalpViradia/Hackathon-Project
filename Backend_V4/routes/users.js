const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const mediaUpload = require('../middlewares/fileUpload');

// Get current user
router.get('/me', auth, userController.getMe);

// Update profile with avatar upload
router.put('/me', [
  auth,
  mediaUpload.single('avatar')
], userController.updateProfile);

// Get user by ID
router.get('/:id', auth, userController.getUserById);

// Follow/unfollow user
router.post('/follow/:id', auth, userController.followUser);

// Get followers
router.get('/followers/list', auth, userController.getFollowers);

// Get following
router.get('/following/list', auth, userController.getFollowing);

// Block/unblock user
router.post('/block/:id', auth, userController.blockUser);

module.exports = router;