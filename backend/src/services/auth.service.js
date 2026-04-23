// src/services/auth.service.js
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/env');
const User = require('../models/User');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');

const signToken = (userId) =>
  jwt.sign({ id: userId }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email already registered.', 409);

  const user = await User.create({ name, email, passwordHash: password });

  // Seed default categories for the new user
  await Category.seedDefaults(user._id);

  const token = signToken(user._id);
  return { user, token };
};

const login = async ({ email, password }) => {
  // Explicitly select passwordHash (excluded by default)
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw new AppError('Invalid email or password.', 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid email or password.', 401);

  const token = signToken(user._id);
  return { user, token };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found.', 404);
  return user;
};

module.exports = { register, login, getMe };
