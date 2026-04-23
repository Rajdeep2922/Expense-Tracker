// src/api/index.js
import api from './axiosInstance';

// Auth
export const registerApi   = (data)  => api.post('/auth/register', data);
export const loginApi      = (data)  => api.post('/auth/login', data);
export const getMeApi      = ()      => api.get('/auth/me');

// Expenses
export const listExpensesApi   = (params) => api.get('/expenses', { params });
export const createExpenseApi  = (data)   => api.post('/expenses', data);
export const getExpenseApi     = (id)     => api.get(`/expenses/${id}`);
export const updateExpenseApi  = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpenseApi  = (id)     => api.delete(`/expenses/${id}`);
export const getSummaryApi     = (params) => api.get('/expenses/summary', { params });
export const getTrendsApi      = (params) => api.get('/expenses/trends', { params });

// Categories
export const listCategoriesApi   = ()          => api.get('/categories');
export const createCategoryApi   = (data)      => api.post('/categories', data);
export const updateCategoryApi   = (id, data)  => api.put(`/categories/${id}`, data);
export const deleteCategoryApi   = (id)        => api.delete(`/categories/${id}`);
