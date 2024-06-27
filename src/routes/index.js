const siteRouter = require('./site');
const adminRouter = require('./admin');
const shirtsRouter = require('./shirts');
const userRouter = require('./user');
const cartRouter = require('./cart');
const authRouter = require('./auth');
const orderRouter = require('./order');

function route(app) {
  app.use('/user', userRouter);
  app.use('/cart', cartRouter);
  app.use('/api/auth', authRouter);
  app.use('/shirts', shirtsRouter);
  app.use('/admin', adminRouter);
  app.use('/orders', orderRouter);
  app.use('/', siteRouter);
}

module.exports = route;
