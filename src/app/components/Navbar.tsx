"use client";

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar sx={{ maxWidth: 'lg', width: '100%', mx: 'auto' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Medical System
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Yeni Navigasyon Linkleri */}
          {user?.roles.includes('ROLE_DOCTOR') && (
            <Link href="/medicine/search" passHref>
              <Button variant="text" color="inherit">
                Medicine Search
              </Button>
            </Link>
          )}
          
          {user?.roles.includes('ROLE_ADMIN') && (
            <Link href="/admin" passHref>
              <Button variant="text" color="inherit">
                Admin Panel
              </Button>
            </Link>
          )}

          {/* Mevcut Kullanıcı Bilgileri */}
          {user ? (
            <>
              <Typography sx={{ fontWeight: 500 }}>{user.email}</Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={logout}
                sx={{ borderRadius: 2 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login" passHref>
              <Button 
                variant="contained" 
                color="primary"
                sx={{ borderRadius: 2 }}
              >
                Login
              </Button>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};