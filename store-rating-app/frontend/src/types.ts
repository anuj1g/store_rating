// Global shared types for the frontend

// Theme
export type ThemeMode = 'light' | 'dark' | 'system';

// User roles (values used throughout the UI)
export type UserRole = 'admin' | 'owner' | 'user';
// Optional: keys that correspond to config/app.ts USER_ROLES object keys
export type UserRoleKey = 'ADMIN' | 'OWNER' | 'USER';

// Auth user shape used across the app
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
}

// Generic API response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Pagination
export interface PageMeta {
  page: number;
  limit: number;
  total: number;
}

// Auth tokens stored in localStorage when using real API
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
