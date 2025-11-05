const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/multer');
const storyController = require('../controllers/storyController');

router.post('/', auth, upload.single('file'), storyController.createStory);
router.get('/', auth, storyController.getStories);
router.get('/archive', auth, storyController.getArchivedStories);
router.get('/user/:userId', auth, storyController.getUserStories);
router.get('/:id', auth, storyController.getStory);
router.put('/:id/archive', auth, storyController.archiveStory);
router.post('/:id/view', auth, storyController.viewStory);
router.post('/:id/reply', auth, storyController.replyToStory);
router.delete('/:id', auth, storyController.deleteStory);

module.exports = router; 