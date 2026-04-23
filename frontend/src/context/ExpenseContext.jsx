// src/context/ExpenseContext.jsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  listExpensesApi, createExpenseApi, updateExpenseApi,
  deleteExpenseApi, getSummaryApi, getTrendsApi,
  listCategoriesApi, createCategoryApi
} from '../api';

const initialState = {
  expenses: [],
  pagination: null,
  categories: [],
  summary: null,
  trends: null,
  loading: false,
  error: null,
};

const expenseReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':    return { ...state, loading: action.value };
    case 'SET_ERROR':      return { ...state, error: action.message, loading: false };
    case 'CLEAR_ERROR':    return { ...state, error: null };

    case 'SET_EXPENSES':
      return { ...state, expenses: action.data, pagination: action.pagination, loading: false, error: null };
    case 'APPEND_EXPENSES':
      return { ...state, expenses: [...state.expenses, ...action.data], pagination: action.pagination, loading: false };

    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.expense, ...state.expenses], loading: false };
    case 'UPDATE_EXPENSE':
      return { ...state, expenses: state.expenses.map(e => e._id === action.expense._id ? action.expense : e), loading: false };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter(e => e._id !== action.id), loading: false };

    case 'SET_CATEGORIES':  return { ...state, categories: action.data, error: null };
    case 'ADD_CATEGORY':    return { ...state, categories: [...state.categories, action.category] };

    case 'SET_SUMMARY':  return { ...state, summary: action.data, error: null };
    case 'SET_TRENDS':   return { ...state, trends: action.data, error: null };

    default: return state;
  }
};

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const fetchExpenses = useCallback(async (params = {}, append = false) => {
    dispatch({ type: 'SET_LOADING', value: true });
    try {
      const { data } = await listExpensesApi(params);
      dispatch(append
        ? { type: 'APPEND_EXPENSES', data: data.expenses, pagination: data.pagination }
        : { type: 'SET_EXPENSES',    data: data.expenses, pagination: data.pagination });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', message: err.message });
    }
  }, []);

  const createExpense = useCallback(async (data) => {
    dispatch({ type: 'SET_LOADING', value: true });
    try {
      const { data: res } = await createExpenseApi(data);
      dispatch({ type: 'ADD_EXPENSE', expense: res.expense });
      return res.expense;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', message: err.message });
      throw err;
    }
  }, []);

  const updateExpense = useCallback(async (id, data) => {
    dispatch({ type: 'SET_LOADING', value: true });
    try {
      const { data: res } = await updateExpenseApi(id, data);
      dispatch({ type: 'UPDATE_EXPENSE', expense: res.expense });
      return res.expense;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', message: err.message });
      throw err;
    }
  }, []);

  const deleteExpense = useCallback(async (id) => {
    try {
      await deleteExpenseApi(id);
      dispatch({ type: 'DELETE_EXPENSE', id });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', message: err.message });
      throw err;
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await listCategoriesApi();
      dispatch({ type: 'SET_CATEGORIES', data: data.categories });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', message: err.message });
    }
  }, []);

  const createCategory = useCallback(async (data) => {
    try {
      const { data: res } = await createCategoryApi(data);
      dispatch({ type: 'ADD_CATEGORY', category: res.category });
      return res.category;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', message: err.message });
      throw err;
    }
  }, []);

  const fetchSummary = useCallback(async (month, year) => {
    try {
      const { data } = await getSummaryApi({ month, year });
      dispatch({ type: 'SET_SUMMARY', data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', message: err.message });
    }
  }, []);

  const fetchTrends = useCallback(async (type = 'monthly', count = 6) => {
    try {
      const { data } = await getTrendsApi({ type, count });
      dispatch({ type: 'SET_TRENDS', data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', message: err.message });
    }
  }, []);

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <ExpenseContext.Provider value={{
      ...state,
      fetchExpenses, createExpense, updateExpense, deleteExpense,
      fetchCategories, createCategory,
      fetchSummary, fetchTrends,
      clearError,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenses must be used within ExpenseProvider');
  return ctx;
};
