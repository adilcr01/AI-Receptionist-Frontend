import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

axiosClient.interceptors.request.use((config) => {
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  const token = isAdminRoute ? useAuthStore.getState().adminToken : useAuthStore.getState().token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      if (isAdminRoute) {
        useAuthStore.getState().adminLogout();
        window.location.href = '/admin/login';
      } else {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
