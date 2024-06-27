const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Shirt',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        size: { type: String, require: true },
      },
    ],
    status: {
      type: String,
      enum: [
        'Chưa xử lý',
        'Đã xử lý',
        'Đã vận chuyển',
        'Đã giao hàng',
        'Đã hủy',
      ],
      default: 'Chưa xử lý',
    },
    image: {
      type: String,
    },
    totalAmount: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Middleware to validate and normalize enum values
orderSchema.pre('validate', function (next) {
  const statusValues = [
    'Chưa xử lý',
    'Đã xử lý',
    'Đã vận chuyển',
    'Đã giao hàng',
    'Đã hủy',
  ];
  const statusMap = {
    'chưa xử lý': 'Chưa xử lý',
    'đã xử lý': 'Đã xử lý',
    'đã vận chuyển': 'Đã vận chuyển',
    'đã giao hàng': 'Đã giao hàng',
    'đã hủy': 'Đã hủy',
  };

  if (this.status && statusMap[this.status.toLowerCase()]) {
    this.status = statusMap[this.status.toLowerCase()];
  } else if (!statusValues.includes(this.status)) {
    const err = new Error(`Trạng thái '${this.status}' không hợp lệ.`);
    return next(err);
  }
  next();
});

orderSchema.pre('save', async function (next) {
  let total = 0;

  // Assuming Shirt model is already imported and available
  for (const item of this.products) {
    const shirt = await mongoose.model('Shirt').findById(item.product);
    const price = parseFloat(shirt.price);
    total += price * item.quantity;
  }

  this.totalAmount = total;
  next();
});

orderSchema.pre('validate', function (next) {
  // Validate and normalize size
  if (!this.products.every((p) => p.size)) {
    const err = new Error('Size is required.');
    return next(err);
  }
  next();
});

// Custom query helpers for sorting
orderSchema.query.sortable = function (req) {
  if (req.query.hasOwnProperty('_sort')) {
    const isValidtype = ['asc', 'desc'].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidtype ? req.query.type : 'desc',
    });
  }
  return this;
};

module.exports = mongoose.model('Order', orderSchema);
