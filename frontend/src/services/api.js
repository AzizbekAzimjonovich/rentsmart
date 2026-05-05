import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL || '';
export const apiBase = rawBase.replace(/\/$/, '');

const api = axios.create({
  baseURL: apiBase ? `${apiBase}/api` : '/api',
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg =
      err.response?.data?.message ||
      err.message ||
      'Something went wrong';
    return Promise.reject({ ...err, message: msg });
  }
);

export default api;
