// src/controllers/category.controller.js
const categoryService = require('../services/category.service');
const { success, created } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories(req.user._id);
  success(res, { categories });
});

const create = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.user._id, req.body);
  created(res, { category }, 'Category created');
});

const update = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.user._id, req.params.id, req.body);
  success(res, { category }, 'Category updated');
});

const remove = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteCategory(req.user._id, req.params.id);
  success(res, result, 'Category deleted');
});

module.exports = { list, create, update, remove };
