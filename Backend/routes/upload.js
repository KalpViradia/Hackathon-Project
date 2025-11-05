const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multerUpload = require('../middlewares/multer');
const uploadController = require('../controllers/uploadController');

// Handle single file uploads
router.post('/', auth, multerUpload.single('file'), uploadController.uploadFile);

module.exports = router;