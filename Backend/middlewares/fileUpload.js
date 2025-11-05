const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';
    return {
      folder: 'social_media_posts',
      resource_type: mediaType,
      allowed_formats: mediaType === 'video' ? ['mp4', 'mov'] : ['jpg', 'jpeg', 'png', 'gif'],
      transformation: mediaType === 'video' ? [
        { quality: 'auto' },
        { format: 'mp4' }
      ] : [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    };
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const mediaUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max file size
  }
});

module.exports = mediaUpload;
