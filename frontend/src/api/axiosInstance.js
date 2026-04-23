import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Create and dispatch a custom event to tell AuthContext to logout
      window.dispatchEvent(new Event('unauthorized'));
    }

    let message = error.response?.data?.message || 'Network error. Please try again.';
    const customError = new Error(message);
    
    // If it's a 422 Unprocessable Entity, attach exact field errors
    if (error.response?.status === 422 && error.response?.data?.details) {
      customError.fieldErrors = {};
      error.response.data.details.forEach(d => {
        customError.fieldErrors[d.field] = d.message;
      });
      // Do not toast field-level validation since we show it inline
      // We will still toast the generic message
      toast.error('Please check the highlighted fields.');
    } else {
      toast.error(message);
    }

    return Promise.reject(customError);
  }
);

export default api;
