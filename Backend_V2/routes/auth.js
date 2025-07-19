const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

router.post('/signup', [
  body('username').trim().isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], authController.signup);

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], authController.login);

// // Logout route
// router.post('/logout', (req, res) => {
//   try {
//     // Clear the token cookie
//     res.clearCookie('token');
//     return res.status(200).json({ message: 'Logged out successfully' });
//   } catch (error) {
//     return res.status(500).json({ error: 'Error during logout' });
//   }
// });

// // Auto login route
// router.get('/auto-login', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     return res.status(200).json(user);
//   } catch (error) {
//     return res.status(500).json({ error: 'Error during auto login' });
//   }
// });

module.exports = router;