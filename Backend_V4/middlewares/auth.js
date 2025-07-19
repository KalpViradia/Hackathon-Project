// // const jwt = require('jsonwebtoken');
// // const User = require('../models/User');

// // module.exports = async (req, res, next) => {
// //   const authHeader = req.headers.authorization;
// //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //     return res.status(401).json({ message: 'No token, authorization denied' });
// //   }
// //   const token = authHeader.split(' ')[1];
// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = await User.findById(decoded.id).select('-password');
// //     if (!req.user) return res.status(401).json({ message: 'User not found' });
// //     next();
// //   } catch (err) {
// //     res.status(401).json({ message: 'Token is not valid' });
// //   }
// // }; 

// // const jwt = require('jsonwebtoken');
// // const User = require('../models/User');

// // module.exports = async (req, res, next) => {
// //   const authHeader = req.headers.authorization;
// //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //     return res.status(401).json({ message: 'No token, authorization denied' });
// //   }

// //   const token = authHeader.split(' ')[1];
// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //     // ✅ store just the id
// //     req.user = { id: decoded.id };
// //     next();
// //   } catch (err) {
// //     res.status(401).json({ message: 'Token is not valid' });
// //   }
// // };

// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// module.exports = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader?.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id).select('-password');
//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Check if token is blacklisted
    const blacklistedToken = await TokenBlacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token is no longer valid' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};