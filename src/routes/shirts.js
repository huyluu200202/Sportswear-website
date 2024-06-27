const express = require('express');
const router = express.Router();
const shirtController = require('../app/controllers/ShirtController');

router.get('/create', shirtController.create);
router.post('/store', shirtController.store);
router.get('/:id/edit', shirtController.edit);
router.post('/handle-form-actions', shirtController.handleFormActions);
router.put('/:id', shirtController.update);
router.patch('/:id/restore', shirtController.restore);
router.delete('/:id', shirtController.delete);
router.delete('/:id/force', shirtController.forceDelete);
router.get('/:slug', shirtController.show);

module.exports = router;
