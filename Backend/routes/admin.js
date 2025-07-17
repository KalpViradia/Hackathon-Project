const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.get('/users', auth, adminController.getAllUsers);
router.get('/reports', auth, adminController.getReports);
router.post('/ban/:id', auth, adminController.banUser);
router.delete('/content/:id', auth, adminController.removeContent);

module.exports = router; 