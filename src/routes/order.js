const express = require('express');
const router = express.Router();
const orderController = require('../app/controllers/OrderController');
const auth = require('../app/middlewares/auth');

router.post('/', auth, orderController.createOrder);
router.get('/:orderId', auth, orderController.getOrder);
router.post('/:orderId/update', auth, orderController.updateOrderStatus);
router.post('/:orderId/delete', auth, orderController.deleteOrder);

module.exports = router;
