// src/models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    note: {
      type: String,
      trim: true,
      maxlength: [300, 'Note must be 300 characters or less'],
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { versionKey: false },
  }
);

// Compound index for efficient range + user queries
expenseSchema.index({ userId: 1, date: -1 });
// Index for category aggregations
expenseSchema.index({ userId: 1, categoryId: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
