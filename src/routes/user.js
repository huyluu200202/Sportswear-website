const express = require('express');
const userController = require('../app/controllers/UserController');
const router = express.Router();
const auth = require('../app/middlewares/auth');

// Display registration page
router.get('/register', (req, res) => userController.register(req, res));

// Display login page
router.get('/login', (req, res) => userController.login(req, res));

// Register user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.loginUser);

// Logout user
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
