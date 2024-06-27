const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema(
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
  },
  {
    timestamps: true,
  },
);

// Custom query helpers for sorting
cartSchema.query.sortable = function (req) {
  if (req.query.hasOwnProperty('_sort')) {
    const isValidtype = ['asc', 'desc'].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidtype ? req.query.type : 'desc',
    });
  }
  return this;
};

module.exports = mongoose.model('Cart', cartSchema);
