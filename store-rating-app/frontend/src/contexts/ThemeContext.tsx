import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { STORAGE_KEYS, THEME_CONFIG } from '../config/app';
import { ThemeMode } from '../types';

type ThemeContextType = {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeModeProvider = ({ children }: ThemeProviderProps) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Try to get theme from localStorage, fallback to system preference
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode | null;
    if (savedTheme) return savedTheme;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEME_CONFIG.DARK;
    }
    
    return THEME_CONFIG.LIGHT;
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, themeMode);
    
    // Update data-theme attribute for CSS variables
    const root = window.document.documentElement;
    root.setAttribute('data-theme', themeMode);
    
    // If theme is set to 'system', listen for system preference changes
    if (themeMode === THEME_CONFIG.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        const systemTheme = mediaQuery.matches ? THEME_CONFIG.DARK : THEME_CONFIG.LIGHT;
        root.setAttribute('data-theme', systemTheme);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode(prevMode => 
      prevMode === THEME_CONFIG.LIGHT ? THEME_CONFIG.DARK : THEME_CONFIG.LIGHT
    );
  }, []);

  const value = {
    themeMode,
    isDarkMode: themeMode === THEME_CONFIG.DARK || 
                (themeMode === THEME_CONFIG.SYSTEM && 
                 window.matchMedia('(prefers-color-scheme: dark)').matches),
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={createTheme({
        palette: {
          mode: value.isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#2563eb',
          },
          secondary: {
            main: '#7c3aed',
          },
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 600,
          },
          h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
          },
          h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
          },
          h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
          },
          h6: {
            fontSize: '1rem',
            fontWeight: 600,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              variant: 'outlined',
              size: 'small',
              fullWidth: true,
            },
          },
        },
      })}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
};

export default ThemeContext;
