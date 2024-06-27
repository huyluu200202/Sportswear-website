const Cart = require('../models/Cart');
const Shirts = require('../models/Shirt');
const Order = require('../models/Order');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'products.product',
    );
    res.render('./user/cart', { cart });
  } catch (error) {
    // res.status(500).send(error.message);
    res.send('Bạn cần đăng nhập để thực hiện chức năng này');
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    if (!size) return res.status(400).send('Size is required');

    const product = await Shirts.findById(productId);
    if (!product)
      return res.status(404).send('Không tìm thấy sản phẩm trong giỏ hàng');

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, products: [] });
    }

    const existingProductIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId && p.size === size,
    );

    if (existingProductIndex >= 0) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity, size });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).send('Không tìm thấy giỏ hàng');

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId,
    );

    await cart.save();
    res.send(cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { productId, change } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).send('Không tìm thấy giỏ hàng');

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId,
    );
    if (productIndex < 0)
      return res.status(404).send('Không có sản phẩm trong giỏ hàng');

    cart.products[productIndex].quantity += change;

    if (cart.products[productIndex].quantity <= 0) {
      cart.products.splice(productIndex, 1);
    }

    await cart.save();
    // await cart.populate('products.product').execPopulate();

    res.json(cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.removeProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).send('Không tìm thấy giỏ hàng');

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId,
    );

    await cart.save();
    // await cart.populate('products.product').execPopulate();

    res.json(cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.orderProduct = async (req, res) => {
  try {
    const { productId, size } = req.body;
    if (!size) {
      return res.status(400).send('Size is required');
    }

    const product = await Shirts.findById(productId);
    if (!product) {
      return res.status(404).send('Không tìm thấy sản phẩm');
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).send('Không tìm thấy giỏ hàng');
    }

    const productInCart = cart.products.find(
      (p) => p.product.toString() === productId && p.size === size,
    );
    if (!productInCart) {
      return res.status(404).send('Sản phẩm không có trong giỏ hàng');
    }

    const order = new Order({
      user: req.user._id,
      products: [
        { product: productId, quantity: productInCart.quantity, size },
      ],
      image: product.image,
      totalAmount: product.price * productInCart.quantity,
      status: 'chưa xử lý',
    });

    await order.save();
    cart.products = cart.products.filter(
      (p) => !(p.product.toString() === productId && p.size === size),
    );
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
