// src/controllers/expense.controller.js
const expenseService = require('../services/expense.service');
const { success, created } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const result = await expenseService.listExpenses(req.user._id, req.query);
  success(res, result);
});

const create = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense(req.user._id, req.body);
  created(res, { expense }, 'Expense created');
});

const getOne = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpense(req.user._id, req.params.id);
  success(res, { expense });
});

const update = asyncHandler(async (req, res) => {
  const expense = await expenseService.updateExpense(req.user._id, req.params.id, req.body);
  success(res, { expense }, 'Expense updated');
});

const remove = asyncHandler(async (req, res) => {
  await expenseService.deleteExpense(req.user._id, req.params.id);
  success(res, {}, 'Expense deleted');
});

const summary = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month, 10) || now.getMonth() + 1;
  const year = parseInt(req.query.year, 10) || now.getFullYear();
  const data = await expenseService.getSummary(req.user._id, month, year);
  success(res, data);
});

const trends = asyncHandler(async (req, res) => {
  const { type = 'monthly', count = '6' } = req.query;
  const data = await expenseService.getTrends(req.user._id, type, parseInt(count, 10));
  success(res, data);
});

module.exports = { list, create, getOne, update, remove, summary, trends };
