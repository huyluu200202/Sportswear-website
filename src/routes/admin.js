const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');
const orderController = require('../app/controllers/OrderController');

const auth = require('../app/middlewares/auth');
const adminAuth = require('../app/middlewares/adminAuth');

router.get('/stored/shirts', adminController.storedShirts);
router.get('/trash/shirts', adminController.trashShirts);

router.get('/orders', auth, orderController.getOrders);
router.get('/orders/:orderId', auth, orderController.getOrder);
router.post('/orders/:orderId/update', auth, orderController.updateOrderStatus);
router.post('/orders/:orderId/delete', auth, orderController.deleteOrder);

module.exports = router;

