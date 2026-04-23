// src/routes/category.routes.js
const express = require('express');
const router = express.Router();

const controller = require('../controllers/category.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { categorySchema, categoryUpdateSchema } = require('../validators/category.validator');

router.use(protect);

router.get('/',    controller.list);
router.post('/',   validate(categorySchema),       controller.create);
router.put('/:id', validate(categoryUpdateSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
