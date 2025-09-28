// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'user';
  avatar?: string;
  address?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Store related types
export interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  ratingAverage: number;
  ratingCount: number;
  ownerId: string;
  owner?: User;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreFormData extends Omit<Store, 'id' | 'owner' | 'ratingAverage' | 'ratingCount' | 'createdAt' | 'updatedAt'> {
  logoFile?: File;
  coverImageFile?: File;
}

// Rating related types
export interface Rating {
  id: string;
  value: number;
  comment?: string;
  userId: string;
  user?: User;
  storeId: string;
  store?: Store;
  createdAt: string;
  updatedAt: string;
}

export interface RatingFormData {
  value: number;
  comment?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form related types
export interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
  validate: () => boolean;
  setValue: (value: T) => void;
  setTouched: (touched: boolean) => void;
  reset: () => void;
}

// Theme related types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => Promise<any>;
  logout: () => void;
  updateUser: (user: User) => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  refreshToken: () => Promise<AuthTokens>;
}

// Component props types
export interface LayoutProps {
  children: React.ReactNode;
}

export interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: string[];
  redirectPath?: string;
}

// Utility types
export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ValueOf<T> = T[keyof T];

// Enums
export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  USER = 'user',
}

export enum StoreStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export enum RatingValue {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

// API Response types
export type ApiResponseType<T> = Promise<ApiResponse<T>>;

export type PaginatedResponseType<T> = ApiResponse<PaginatedResponse<T>>;
