const Shirts = require('../models/Shirt');
const { multipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
  // [GET] /
  index(req, res, next) {
    Shirts.find({})
      .lean()
      .then((shirts) => {
        res.render('home', {
          shirts: multipleMongooseToObject(shirts),
        });
      })
      .catch(next);
  }

  search(req, res, next) {
    const query = req.query.query || '';
    Shirts.find({ name: { $regex: query, $options: 'i' } }) // Using regex for case-insensitive search
      .lean()
      .then((shirts) => {
        res.render('search-product', {
          shirts: multipleMongooseToObject(shirts),
          query, // Passing the query back to the view
        });
      })
      .catch(next);
  }
}

module.exports = new SiteController();
