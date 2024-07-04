const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

class UserController {
  // Display login page
  login(req, res, next) {
    res.render('user/login');
  }

  // Display registration page
  register(req, res, next) {
    res.render('user/register');
  }

  // Handle user registration
  async registerUser(req, res, next) {
    const { username, email, password, confirmPassword } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Mật khẩu nhập lại không khớp' });
    }

    try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'Email người dùng đã tồn tại' });
      }

      // Check if any users exist to determine the role
      const userCount = await User.countDocuments();
      const role = userCount === 0 ? 'admin' : 'user';

      // Create a new user object
      user = new User({ username, email, password, role });

      // Hash the password before saving to the database
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save the user to the database
      await user.save();

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      // Sign JWT and set it as a cookie
      jwt.sign(
        payload,
        'your_jwt_secret',
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token, { httpOnly: true });
          res.redirect('/');
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  // Handle user login
  async loginUser(req, res, next) {
    const { email, password } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if the user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Thông tin không hợp lệ' });
      }

      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Thông tin không hợp lệ' });
      }

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      // Sign JWT and set it as a cookie
      jwt.sign(
        payload,
        'your_jwt_secret',
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token, { httpOnly: true });
          res.redirect('/');
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  // Display user info update page
  async userInfo(req, res, next) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.render('user/userinfo', { user });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

  // Handle user info update
  async updateUser(req, res, next) {
    const { username, currentPassword, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Mật khẩu nhập lại không khớp' });
    }

    try {
      // Check if the user exists
      let user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'Người dùng không tồn tại' });
      }

      // Verify the current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Mật khẩu hiện tại không chính xác' });
      }

      // Update user details
      user.username = username || user.username;

      // Hash the new password before saving to the database
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      await user.save();

      res.redirect('/user/userinfo');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }

}

module.exports = new UserController();
