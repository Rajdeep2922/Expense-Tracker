// src/models/Category.js
const mongoose = require('mongoose');

// Default categories seeded for every new user
const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining',   icon: '🍔', color: '#FF6B6B' },
  { name: 'Transport',       icon: '🚗', color: '#4ECDC4' },
  { name: 'Shopping',        icon: '🛍️', color: '#45B7D1' },
  { name: 'Entertainment',   icon: '🎬', color: '#96CEB4' },
  { name: 'Health',          icon: '💊', color: '#FFEAA7' },
  { name: 'Utilities',       icon: '💡', color: '#DDA0DD' },
  { name: 'Rent & Housing',  icon: '🏠', color: '#98D8C8' },
  { name: 'Education',       icon: '📚', color: '#F7DC6F' },
  { name: 'Travel',          icon: '✈️', color: '#82E0AA' },
  { name: 'Other',           icon: '📦', color: '#AED6F1' },
];

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [40, 'Category name must be 40 characters or less'],
    },
    icon: {
      type: String,
      default: '📦',
    },
    color: {
      type: String,
      default: '#AED6F1',
      match: [/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { versionKey: false },
  }
);

// Prevent duplicate category names per user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

// Static — seed defaults for a new user
categorySchema.statics.seedDefaults = async function (userId) {
  const docs = DEFAULT_CATEGORIES.map((c) => ({ ...c, userId, isDefault: true }));
  await this.insertMany(docs, { ordered: false }); // ignore dupe errors on re-seed
};

module.exports = mongoose.model('Category', categorySchema);
