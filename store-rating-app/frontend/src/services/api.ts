import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { STORAGE_KEYS, API_ENDPOINTS } from '../config/app';
import { AuthTokens } from '../types';

// Create axios instance with base URL
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const tokens = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (tokens) {
      const { accessToken } = JSON.parse(tokens) as AuthTokens;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get refresh token from localStorage
        const tokens = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        
        if (!tokens) {
          // No tokens available, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        const { refreshToken } = JSON.parse(tokens) as AuthTokens;
        
        if (!refreshToken) {
          // No refresh token available, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refreshToken },
          { withCredentials: true }
        );
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Update tokens in localStorage
        const updatedTokens = { accessToken, refreshToken: newRefreshToken };
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(updatedTokens));
        
        // Update the auth header
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Failed to refresh token, redirect to login
        console.error('Failed to refresh token:', refreshError);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);

// Helper function to set auth header
export const setAuthHeader = (token: string) => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

// Helper function to clear auth header
export const clearAuthHeader = () => {
  delete api.defaults.headers.common.Authorization;
};

// API methods
export default {
  // Auth API
  login: (credentials: { email: string; password: string }) =>
    api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  
  register: (userData: { name: string; email: string; password: string; role?: string }) =>
    api.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  
  logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),
  
  refreshToken: (refreshToken: string) =>
    api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken }),
  
  forgotPassword: (email: string) =>
    api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`, { password }),
  
  getCurrentUser: () => api.get(API_ENDPOINTS.AUTH.ME),
  
  // Users API
  updateProfile: (userData: FormData) =>
    api.put(API_ENDPOINTS.USERS.PROFILE, userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  updatePassword: (currentPassword: string, newPassword: string) =>
    api.put(API_ENDPOINTS.USERS.PASSWORD, { currentPassword, newPassword }),
  
  uploadAvatar: (avatar: File) => {
    const formData = new FormData();
    formData.append('avatar', avatar);
    return api.post(API_ENDPOINTS.USERS.AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Stores API
  getStores: (params?: Record<string, any>) =>
    api.get(API_ENDPOINTS.STORES.BASE, { params }),
  
  searchStores: (query: string, params?: Record<string, any>) =>
    api.get(API_ENDPOINTS.STORES.SEARCH, { params: { q: query, ...params } }),
  
  getFeaturedStores: () => api.get(API_ENDPOINTS.STORES.FEATURED),
  
  getStoresByOwner: (ownerId: string, params?: Record<string, any>) =>
    api.get(API_ENDPOINTS.STORES.BY_OWNER(ownerId), { params }),
  
  getStoreById: (id: string) => api.get(API_ENDPOINTS.STORES.DETAIL(id)),
  
  createStore: (storeData: FormData) =>
    api.post(API_ENDPOINTS.STORES.BASE, storeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  updateStore: (id: string, storeData: FormData) =>
    api.put(API_ENDPOINTS.STORES.DETAIL(id), storeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  deleteStore: (id: string) => api.delete(API_ENDPOINTS.STORES.DETAIL(id)),
  
  // Ratings API
  getStoreRatings: (storeId: string, params?: Record<string, any>) =>
    api.get(API_ENDPOINTS.STORES.RATINGS(storeId), { params }),
  
  getUserRatings: (userId: string, params?: Record<string, any>) =>
    api.get(API_ENDPOINTS.RATINGS.BY_USER(userId), { params }),
  
  getRatingById: (id: string) => api.get(API_ENDPOINTS.RATINGS.DETAIL(id)),
  
  createRating: (storeId: string, ratingData: { value: number; comment?: string }) =>
    api.post(API_ENDPOINTS.STORES.RATINGS(storeId), ratingData),
  
  updateRating: (id: string, ratingData: { value?: number; comment?: string }) =>
    api.put(API_ENDPOINTS.RATINGS.DETAIL(id), ratingData),
  
  deleteRating: (id: string) => api.delete(API_ENDPOINTS.RATINGS.DETAIL(id)),
  
  // Admin API
  getAdminStats: () => api.get(API_ENDPOINTS.ADMIN.STATS),
  
  getAdminUsers: (params?: Record<string, any>) =>
    api.get(API_ENDPOINTS.ADMIN.USERS, { params }),
  
  getAdminStores: (params?: Record<string, any>) =>
    api.get(API_ENDPOINTS.ADMIN.STORES, { params }),
  
  // Export API instance for custom requests
  instance: api,
  
  // Export interceptors for custom handling
  addRequestInterceptor: (onFulfilled?: any, onRejected?: any) =>
    api.interceptors.request.use(onFulfilled, onRejected),
    
  addResponseInterceptor: (onFulfilled?: any, onRejected?: any) =>
    api.interceptors.response.use(onFulfilled, onRejected),
};

// Export types
export type { AxiosResponse, AxiosError };
