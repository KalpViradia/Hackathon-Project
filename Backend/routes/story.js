const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const auth = require('../middleware/auth');

router.post('/', auth, storyController.createStory);
router.get('/', auth, storyController.getStories);
router.get('/archive', auth, storyController.getArchivedStories);
router.put('/:id', auth, storyController.archiveStory);
router.post('/:id/view', auth, storyController.viewStory);
router.post('/:id/reply', auth, storyController.replyToStory);

module.exports = router; 