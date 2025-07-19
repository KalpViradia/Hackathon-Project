const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'],
    resource_type: 'auto',
    folder: 'social_media_posts',
    transformation: [
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const limits = {
  fileSize: 100 * 1024 * 1024, // 100MB max file size
  files: 1 // Max one file per request
};

const mediaUpload = multer({ 
  storage, 
  fileFilter,
  limits 
});

module.exports = mediaUpload;
