const Shirts = require('../models/Shirt');
const { mongooseToObject } = require('../../util/mongoose');

class ShirtController {
  // [GET] /shirts/:slug
  show(req, res, next) {
    Shirts.findOne({ slug: req.params.slug })
      .lean()
      .then((shirt) => {
        if (shirt) {
          res.render('shirts/show', { shirt: mongooseToObject(shirt) });
        } else {
          res.status(404).send('Không tìm thấy sản phẩm');
        }
      })
      .catch(next);
  }

  // [GET] /shirts/create
  create(req, res, next) {
    res.render('shirts/create');
  }

  // [POST] /shirts/store
  store(req, res, next) {
    const formData = req.body;

    if (!formData.name) {
      return res.status(400).send('Thông tin không được để trống');
    }

    const shirt = new Shirts(formData);
    shirt
      .save()
      .then(() => res.redirect('/admin/stored/shirts'))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(400).send(`Gặp phải lỗi: ${err.message}`);
        }

        next(err);
      });
  }

  // [GET] /shirts/:id/edit
  edit(req, res, next) {
    Shirts.findById(req.params.id)
      .lean()
      .then((shirt) => {
        if (shirt) {
          res.render('shirts/edit', { shirt: mongooseToObject(shirt) });
        } else {
          res.status(404).send('Không tìm thấy sản phẩm');
        }
      })
      .catch(next);
  }

  // [PUT] /shirts/:id/update
  update(req, res, next) {
    Shirts.updateOne({ _id: req.params.id }, req.body)
      .lean()
      .then(() => res.redirect('/admin/stored/shirts'))
      .catch(next);
    // res.json(req.body);
  }

  // [DELETE] /shirts/:id/delete
  delete(req, res, next) {
    Shirts.delete({ _id: req.params.id }, req.body)
      .lean()
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // [DELETE] /shirts/:id/force
  forceDelete(req, res, next) {
    Shirts.deleteOne({ _id: req.params.id }, req.body)
      .lean()
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // [PATCH] /shirts/:id/restore
  restore(req, res, next) {
    Shirts.restore({ _id: req.params.id }, req.body)
      .lean()
      .then(() => res.redirect('back'))
      .catch(next);
  }

  // [POST] /shirts/handle-form-actions
  handleFormActions(req, res, next) {
    switch (req.body.action) {
      case 'delete':
        Shirts.delete({ _id: { $in: req.body.shirtIds } }, req.body)
          .lean()
          .then(() => res.redirect('back'))
          .catch(next);
        break;

      default:
        res.json({ message: 'Invalid action' });
        break;
    }
  }
}

async function updateShirtSizes() {
  try {
    const result = await Shirts.updateMany(
      { size: { $exists: false } },
      { $set: { size: ['S', 'M', 'L', 'XL', 'XXL'] } },
    );
  } catch (err) {
    console.error('Error updating documents:', err);
  }
}

updateShirtSizes();

module.exports = new ShirtController();
