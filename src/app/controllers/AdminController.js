const Shirts = require('../models/Shirt');
const { multipleMongooseToObject } = require('../../util/mongoose');

class AdminController {
  // [GET] /admin/stored/shirts
  storedShirts(req, res, next) {
    Promise.all([
      Shirts.find({}).sortable(req),
      Shirts.countDocumentsWithDeleted({ deleted: true }),
    ])

      .then(([shirts, deletedCount]) =>
        res.render('admin/stored-shirts', {
          deletedCount,
          shirts: multipleMongooseToObject(shirts),
        }),
      )
      .catch(next);
  }

  // [GET] /admin/trash/shirts
  trashShirts(req, res, next) {
    // lean() read data from database
    Shirts.findWithDeleted({ deleted: true })
      .lean()
      .then((shirts) => {
        res.render('./admin/trash-shirts', {
          shirts: multipleMongooseToObject(shirts),
        });
      })
      .catch(next);
  }
}

module.exports = new AdminController();
