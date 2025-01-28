"use client";

import { useState } from 'react';
import { Container, Typography, Button, Box, Alert, CircularProgress } from '@mui/material';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../api/client';

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
      <Container>
        <Typography>Access Denied</Typography>
      </Container>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={loading}
            sx={{ px: 4, py: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload Medicines from Excel'}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCache}
            disabled={loading}
            sx={{ px: 4, py: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Cache'}
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Container>
    </ProtectedRoute>
  );
}