const Order = require('../models/Order');
const Shirts = require('../models/Shirt');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('products.product');
    res.render('admin/orders', { orders });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user')
      .populate('products.product');
    if (!order) return res.status(404).send('Không tìm thấy đơn đặt hàng');
    res.json(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { products, totalAmount, image, size } = req.body;

    // Ensure 'products' includes 'size'
    const orderProducts = await Promise.all(
      products.map(async (item) => {
        const shirt = await Shirts.findById(item.product);
        if (!shirt) {
          throw new Error(`Không tìm thấy sản phẩm với ID: ${item.product}`);
        }
        return {
          product: item.product,
          quantity: item.quantity,
          size: item.size, // Ensure 'size' is included
        };
      }),
    );

    const order = new Order({
      user: req.user._id,
      products: orderProducts,
      image,
      size,
      totalAmount,
    });

    await order.save();
    // await order.populate('products.product').execPopulate();

    res.json(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).send('Không tìm thấy đơn đặt hàng');
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send('Không tìm thấy đơn đặt hàng');

    order.status = 'Đã hủy';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.orderId);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
