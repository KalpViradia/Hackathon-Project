const cloudinary = require('../config/cloudinary');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // File was already uploaded to Cloudinary by multer-storage-cloudinary
    res.status(200).json({ 
      url: req.file.path,
      publicId: req.file.filename
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ 
      message: 'Upload failed', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};