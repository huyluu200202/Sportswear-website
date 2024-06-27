const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const shirtScheme = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    price: { type: String },

    size: {
      type: [String],
      enum: ['S', 'M', 'L', 'XL', 'XXL'],
      default: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    slug: {
      type: String,
      slug: 'name',
      unique: true,
      slugOn: { updateOne: true },
    },
  },
  {
    timestamps: true,
  },
);

// Custom query helpers
shirtScheme.query.sortable = function (req) {
  if (req.query.hasOwnProperty('_sort')) {
    const isValidtype = ['asc', 'desc'].includes(req.query.type);
    return this.sort({
      [req.query.column]: isValidtype ? req.query.type : 'desc',
    });
  }
  return this;
};

// Add plugins
mongoose.plugin(slug);
shirtScheme.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('Shirt', shirtScheme);
