const express = require('express');
const router = express.Router();
const cartController = require('../app/controllers/CartController');
const auth = require('../app/middlewares/auth');

router.get('/', auth, cartController.getCart);

router.post('/add', auth, cartController.addToCart);
router.post('/remove', auth, cartController.removeFromCart);
router.post('/updateQuantity', auth, cartController.updateQuantity);
router.post('/removeProduct', auth, cartController.removeProduct);

router.post('/order', auth, cartController.orderProduct);

module.exports = router;
