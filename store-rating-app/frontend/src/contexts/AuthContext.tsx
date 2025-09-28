import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { STORAGE_KEYS } from '../config/app';
import type { AuthUser, UserRole } from '../types';

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: { name: string; email: string; password: string; role?: UserRole | string; [key: string]: any }) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    // Minimal fake login for bootstrapping UI: assigns role based on email prefix
    setIsLoading(true);
    setError(null);
    return new Promise<AuthUser>((resolve) => {
      setTimeout(() => {
        const role: UserRole = email.startsWith('admin')
          ? 'admin'
          : email.startsWith('owner')
          ? 'owner'
          : 'user';
        const logged: AuthUser = { id: 'local', name: email.split('@')[0], email, role };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(logged));
        setUser(logged);
        setIsLoading(false);
        resolve(logged);
      }, 300);
    });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register: async (data) => {
      // Minimal stub: create user and mark authenticated
      const role: UserRole = (data.role === 'admin' || data.role === 'owner' || data.role === 'user') ? (data.role as UserRole) : 'user';
      const created: AuthUser = { id: 'local', name: data.name || data.email.split('@')[0], email: data.email, role };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(created));
      setUser(created);
      return created;
    },
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthContext;
