"use client";

import { Container, Typography, Button, Box } from '@mui/material'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'
import { Navbar } from './components/Navbar'
import Link from 'next/link'


export default function Home() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Hoş Geldiniz, {user?.firstName} {user?.lastName}
          </Typography>
          
          <Typography variant="h5" sx={{ mb: 3 }}>
            Rolünüz: {user?.roles.join(', ')}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Link href="/medicine" passHref>
              <Button variant="contained" size="large">
                Search Medicines
              </Button>
            </Link>
            {user?.roles.includes('ROLE_ADMIN') && (
              <Link href="/admin" passHref>
                <Button variant="contained" size="large" color="secondary">
                  Admin Panel
                </Button>
              </Link>
            )}

            {user?.roles.includes('ROLE_DOCTOR') && (
              <Link href="/prescription/" passHref>
                <Button variant="contained" size="large" color="primary">
                  Create Prescription
                  </Button>
                  </Link>
                  )}
          </Box>
        </Box>
      </Container>
    </ProtectedRoute>
  )
}