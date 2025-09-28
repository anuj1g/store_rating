// Application configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Store Rating App',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.VITE_APP_ENV || 'development',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  defaultItemsPerPage: parseInt(import.meta.env.VITE_ITEMS_PER_PAGE || '10', 10),
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableMaintenance: import.meta.env.VITE_ENABLE_MAINTENANCE === 'true',
  jwtSecret: import.meta.env.VITE_JWT_SECRET || 'your_jwt_secret_here',
  tokenRefreshInterval: parseInt(import.meta.env.VITE_TOKEN_REFRESH_INTERVAL || '300000', 10), // 5 minutes
};

// Routes configuration
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  STORES: {
    LIST: '/stores',
    CREATE: '/stores/create',
    DETAIL: (id: string | number = ':id') => `/stores/${id}`,
    EDIT: (id: string | number = ':id') => `/stores/${id}/edit`,
  },
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    STORES: '/admin/stores',
    SETTINGS: '/admin/settings',
  },
  OWNER: {
    DASHBOARD: '/owner',
    STORES: '/owner/stores',
    REVIEWS: '/owner/reviews',
    ANALYTICS: '/owner/analytics',
  },
  NOT_FOUND: '/404',
  ERROR: '/error',
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    PASSWORD: '/users/password',
    AVATAR: '/users/avatar',
  },
  STORES: {
    BASE: '/stores',
    SEARCH: '/stores/search',
    FEATURED: '/stores/featured',
    BY_OWNER: (ownerId: string) => `/stores/owner/${ownerId}`,
    DETAIL: (id: string) => `/stores/${id}`,
    RATINGS: (storeId: string) => `/stores/${storeId}/ratings`,
  },
  RATINGS: {
    BASE: '/ratings',
    BY_USER: (userId: string) => `/ratings/user/${userId}`,
    DETAIL: (id: string) => `/ratings/${id}`,
  },
  ADMIN: {
    USERS: '/admin/users',
    STORES: '/admin/stores',
    STATS: '/admin/stats',
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LAYOUT: 'layout',
  REDIRECT_AFTER_LOGIN: 'redirect_after_login',
};

// Default pagination settings
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  SORT_BY: 'createdAt',
  SORT_ORDER: 'DESC' as const,
};

// Available user roles
export const USER_ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner',
  USER: 'user',
} as const;

export type UserRole = keyof typeof USER_ROLES;

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_NUMBER: 'Please enter a valid number',
  MIN_VALUE: (min: number) => `Value must be at least ${min}`,
  MAX_VALUE: (max: number) => `Value must be at most ${max}`,
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be at most ${max} characters`,
};

// Application theme configuration
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
  DEFAULT_THEME: 'light',
} as const;

export type Theme = typeof THEME_CONFIG.LIGHT | typeof THEME_CONFIG.DARK | typeof THEME_CONFIG.SYSTEM;
