// src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const { success, created } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  created(res, { user, token }, 'Registration successful');
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  success(res, { user, token }, 'Login successful');
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  success(res, { user });
});

module.exports = { register, login, me };
