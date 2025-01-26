"use client";

import { CookiesProvider } from 'react-cookie';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CookiesProvider>
        <AuthProvider>{children}</AuthProvider>
      </CookiesProvider>
    </ThemeProvider>
  );
}