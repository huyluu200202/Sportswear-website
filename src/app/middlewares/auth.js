const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.user = null;
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      req.user = null;
      res.locals.user = null;
    } else {
      req.user = user;
      res.locals.user = user;
    }
  } catch (err) {
    req.user = null;
    res.locals.user = null;
  }

  next();
};

module.exports = auth;
