const express = require('express');
const { check, validationResult } = require('express-validator');
const userController = require('../app/controllers/UserController');
const router = express.Router();

// Register user
router.post(
  '/register',
  [
    check('username', 'Vui lòng nhập tên').not().isEmpty(),
    check('email', 'Vui lòng nhập email hợp lệ').isEmail(),
    check('password', 'Vui lòng nhập mật khẩu có 6 ký tự trở lên').isLength({
      min: 6,
    }),
    check('confirmPassword', 'Vui lòng nhập lại mật khẩu').exists(),
  ],
  (req, res, next) => userController.registerUser(req, res, next),
);

// Login user
router.post(
  '/login',
  [
    check('email', 'Vui lòng nhập email hợp lệ').isEmail(),
    check('password', 'Vui lòng nhập mật khẩu').exists(),
  ],
  (req, res, next) => userController.loginUser(req, res, next),
);

module.exports = router;
