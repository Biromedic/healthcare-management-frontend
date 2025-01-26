"use client";

import { Container, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api/client';
import { useState } from 'react';
import { Navbar } from '../components/Navbar';

export default function AdminPanel() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpload = async () => {
    try {
      setLoading(true);
      setError('');
      await apiClient.post('/medicines/v1/upload');
      setSuccess('Medicines successfully updated');
    } catch (err) {
      setError('Failed to update medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleCache = async () => {
    try {
      setLoading(true);
      setError('');
      await apiClient.post('/medicines/v1/cache');
      setSuccess('Cache successfully updated');
    } catch (err) {
      setError('Failed to update cache');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.roles.includes('ROLE_ADMIN')) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Alert severity="error">You are not authorized</Alert>
      </Container>
    );
  }

  return (
    <>
    <Navbar />
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Yönetici Paneli
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={loading}
          sx={{ px: 4, py: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Excelden İlaç Yükle'}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCache}
          disabled={loading}
          sx={{ px: 4, py: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Önbelleği Güncelle'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

      <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
        * Excel file updating weekly.
      </Typography>
    </Container>
    </>
  );
}