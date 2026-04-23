// src/services/category.service.js
const Category = require('../models/Category');
const Expense = require('../models/Expense');
const AppError = require('../utils/AppError');

const listCategories = async (userId) => {
  return Category.find({ userId }).sort({ isDefault: -1, name: 1 });
};

const createCategory = async (userId, data) => {
  const existing = await Category.findOne({ userId, name: data.name });
  if (existing) throw new AppError('A category with this name already exists.', 409);
  return Category.create({ ...data, userId });
};

const updateCategory = async (userId, categoryId, data) => {
  if (data.name) {
    const existing = await Category.findOne({ userId, name: data.name, _id: { $ne: categoryId } });
    if (existing) throw new AppError('A category with this name already exists.', 409);
  }

  const category = await Category.findOneAndUpdate(
    { _id: categoryId, userId },
    data,
    { new: true, runValidators: true }
  );
  if (!category) throw new AppError('Category not found.', 404);
  return category;
};

const deleteCategory = async (userId, categoryId) => {
  const category = await Category.findOne({ _id: categoryId, userId });
  if (!category) throw new AppError('Category not found.', 404);
  if (category.isDefault) throw new AppError('Default categories cannot be deleted.', 403);

  // Move any expenses in this category to "Other"
  const otherCategory = await Category.findOne({ userId, name: 'Other', isDefault: true });
  if (otherCategory) {
    await Expense.updateMany({ userId, categoryId }, { categoryId: otherCategory._id });
  }

  await category.deleteOne();
  return { reassigned: !!otherCategory };
};

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
