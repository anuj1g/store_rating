import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeModeProvider, useThemeMode } from './contexts/ThemeContext';
import App from './App.tsx';
import './index.css';
import createCustomTheme from './theme';
import { Toaster } from 'react-hot-toast';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Theme wrapper component that reacts to ThemeContext mode
const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { themeMode } = useThemeMode();
  // Map 'system' to current OS preference
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const effectiveMode = themeMode === 'system' ? (prefersDark ? 'dark' : 'light') : themeMode;
  const theme = createCustomTheme(effectiveMode as 'light' | 'dark');
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeModeProvider>
          <ThemeWrapper>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <AuthProvider>
                <App />
                <Toaster position="top-right" gutter={8} toastOptions={{ duration: 5000 }} />
              </AuthProvider>
            </LocalizationProvider>
          </ThemeWrapper>
        </ThemeModeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
