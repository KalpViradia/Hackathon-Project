const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reelController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/multer');

// Reel routes
router.post('/', auth, upload.single('file'), reelController.createReel);
router.get('/', auth, reelController.getReels);
router.get('/user/:userId', auth, reelController.getUserReels);
router.get('/:id', auth, reelController.getReel);
router.post('/:id/like', auth, reelController.likeReel);
router.post('/:id/comment', auth, reelController.commentOnReel);
router.post('/:id/share', auth, reelController.shareReel);
router.delete('/:id', auth, reelController.deleteReel);

module.exports = router;
