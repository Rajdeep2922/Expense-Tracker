// src/context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../api';

const initialState = { user: null, token: null, loading: true, error: null, fieldErrors: {} };

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTH':     return { ...state, user: action.user, token: action.token, loading: false, error: null };
    case 'SET_LOADING':  return { ...state, loading: action.value };
    case 'SET_ERROR':    return { ...state, error: action.message, fieldErrors: action.fieldErrors || {}, loading: false };
    case 'CLEAR_ERROR':  return { ...state, error: null, fieldErrors: {} };
    case 'LOGOUT':       return { ...initialState, loading: false };
    default:             return state;
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return dispatch({ type: 'LOGOUT' });

        const { data } = await getMeApi();
        dispatch({ type: 'SET_AUTH', user: data.user, token });
      } catch {
        localStorage.removeItem('auth_token');
        dispatch({ type: 'LOGOUT' });
      }
    };
    bootstrap();

    const handleUnauthorized = () => {
      localStorage.removeItem('auth_token');
      dispatch({ type: 'LOGOUT' });
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', value: true });
    try {
      const { data } = await loginApi(credentials);
      localStorage.setItem('auth_token', data.token);
      dispatch({ type: 'SET_AUTH', user: data.user, token: data.token });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', message: err.message, fieldErrors: err.fieldErrors });
      throw err;
    }
  };

  const register = async (payload) => {
    dispatch({ type: 'SET_LOADING', value: true });
    try {
      const { data } = await registerApi(payload);
      localStorage.setItem('auth_token', data.token);
      dispatch({ type: 'SET_AUTH', user: data.user, token: data.token });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', message: err.message, fieldErrors: err.fieldErrors });
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
