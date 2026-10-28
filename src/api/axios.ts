import axios from 'axios';
import { clearStoredSession } from '../utils/authSession';

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const api = axios.create({
  baseURL,
});

let redirectingToLogin = false;

const isAuthAttempt = (url?: string): boolean => {
  if (!url) return false;
  return url.includes('/auth/login') || url.includes('/auth/register');
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hasStoredToken = Boolean(localStorage.getItem('token'));

    if (status === 401 && hasStoredToken && !isAuthAttempt(error.config?.url)) {
      clearStoredSession();

      if (!redirectingToLogin && window.location.pathname !== '/login') {
        redirectingToLogin = true;
        window.location.replace('/login?expired=1');
      }
    }

    return Promise.reject(error);
  },
);

export default api;
