const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/me', auth, userController.getMe);
router.get('/:id', auth, userController.getUserById);
router.put('/me', auth, userController.updateMe);
router.post('/follow/:id', auth, userController.followUnfollowUser);
router.get('/followers', auth, userController.getFollowers);
router.get('/following', auth, userController.getFollowing);
router.post('/block/:id', auth, userController.blockUnblockUser);

module.exports = router; 