// src/services/expense.service.js
const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');

// ── List expenses with pagination + filtering ─────────────────────────────────
const listExpenses = async (userId, query) => {
  const { page, limit, categoryId, startDate, endDate, search, sortBy, sortOrder } = query;

  const filter = { userId };

  if (categoryId) filter.categoryId = categoryId;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = startDate;
    if (endDate) filter.date.$lte = endDate;
  }

  if (search) {
    filter.note = { $regex: search, $options: 'i' };
  }

  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const skip = (page - 1) * limit;

  const [expenses, total] = await Promise.all([
    Expense.find(filter).populate('categoryId', 'name icon color').sort(sort).skip(skip).limit(limit),
    Expense.countDocuments(filter),
  ]);

  return {
    expenses,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// ── Create ────────────────────────────────────────────────────────────────────
const createExpense = async (userId, data) => {
  // Ensure the category belongs to this user
  const category = await Category.findOne({ _id: data.categoryId, userId });
  if (!category) throw new AppError('Category not found.', 404);

  const expense = await Expense.create({ ...data, userId });
  return expense.populate('categoryId', 'name icon color');
};

// ── Get one ───────────────────────────────────────────────────────────────────
const getExpense = async (userId, expenseId) => {
  const expense = await Expense.findOne({ _id: expenseId, userId }).populate(
    'categoryId',
    'name icon color'
  );
  if (!expense) throw new AppError('Expense not found.', 404);
  return expense;
};

// ── Update ────────────────────────────────────────────────────────────────────
const updateExpense = async (userId, expenseId, data) => {
  if (data.categoryId) {
    const category = await Category.findOne({ _id: data.categoryId, userId });
    if (!category) throw new AppError('Category not found.', 404);
  }

  const expense = await Expense.findOneAndUpdate(
    { _id: expenseId, userId },
    data,
    { new: true, runValidators: true }
  ).populate('categoryId', 'name icon color');

  if (!expense) throw new AppError('Expense not found.', 404);
  return expense;
};

// ── Delete ────────────────────────────────────────────────────────────────────
const deleteExpense = async (userId, expenseId) => {
  const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });
  if (!expense) throw new AppError('Expense not found.', 404);
  return expense;
};

// ── Dashboard summary ────────────────────────────────────────────────────────
const getSummary = async (userId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const [categoryBreakdown, totalResult] = await Promise.all([
    Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: '$categoryId', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { _id: 0, categoryId: '$_id', name: '$category.name', icon: '$category.icon', color: '$category.color', total: 1, count: 1 } },
      { $sort: { total: -1 } },
    ]),
    Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
  ]);

  const monthlyTotal = totalResult[0]?.total || 0;
  const totalCount = totalResult[0]?.count || 0;

  return { month, year, monthlyTotal, totalCount, categoryBreakdown };
};

// ── Trends (last N months or last N weeks) ───────────────────────────────────
const getTrends = async (userId, type = 'monthly', count = 6) => {
  const now = new Date();
  let pipeline;

  if (type === 'weekly') {
    // Last `count` weeks
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - count * 7);

    pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startDate } } },
      {
        $group: {
          _id: { $week: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          year: { $first: { $year: '$date' } },
        },
      },
      { $sort: { '_id': 1 } },
      { $project: { _id: 0, week: '$_id', year: 1, total: 1, count: 1 } },
    ];
  } else {
    // Last `count` months
    const startDate = new Date(now.getFullYear(), now.getMonth() - count + 1, 1);

    pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: startDate } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $project: { _id: 0, year: '$_id.year', month: '$_id.month', total: 1, count: 1 } },
    ];
  }

  const trends = await Expense.aggregate(pipeline);
  return { type, trends };
};

module.exports = {
  listExpenses,
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  getSummary,
  getTrends,
};
