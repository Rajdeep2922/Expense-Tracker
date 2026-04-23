// src/routes/expense.routes.js
const express = require('express');
const router = express.Router();

const controller = require('../controllers/expense.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { expenseSchema, expenseUpdateSchema, expenseQuerySchema } = require('../validators/expense.validator');

// All expense routes require authentication
router.use(protect);

router.get('/summary', controller.summary);
router.get('/trends',  controller.trends);

router.get('/',    validate(expenseQuerySchema, 'query'), controller.list);
router.post('/',   validate(expenseSchema),               controller.create);

router.get('/:id',    controller.getOne);
router.put('/:id',    validate(expenseUpdateSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
