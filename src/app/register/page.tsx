"use client";

import { Button, TextField, Container, Typography, Box, CircularProgress, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';
import Link from 'next/link';

type FormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
};

const roles = [
  { value: 'DOCTOR', label: 'Doktor' },
  { value: 'PHARMACIST', label: 'Eczacı' },
  { value: 'ADMIN', label: 'Yönetici' }
];

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BACKEND_URL: string;
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/v1/signup`, {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role
      });
      router.push('/login');
    } catch (error) {
      setError('Failed to register. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            {...register('firstName', { required: 'Name is required' })}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Surname"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            {...register('lastName', { required: 'Surname is required' })}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', {
              required: 'Email required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Unvalid email address'
              }
            })}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password', {
              required: 'Password required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
          />

          <TextField
            select
            fullWidth
            margin="normal"
            label="Rol"
            defaultValue=""
            error={!!errors.role}
            helperText={errors.role?.message}
            {...register('role', { required: 'Rol seçimi zorunludur' })}
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Typography variant="body2">Already have an account?</Typography>
            <Link href="/login" passHref>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'primary.main', 
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Login
              </Typography>
            </Link>
          </Box>
        </form>
      </Box>
    </Container>
  );
}