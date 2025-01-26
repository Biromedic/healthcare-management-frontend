import { Typography, Button, Container } from '@mui/material';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <Container>
        <Typography variant="h4">Profile</Typography>
        {user && (
          <>
            <Typography>Email: {user.email}</Typography>
            <Typography>Roles: {user.roles.join(', ')}</Typography>
            <Button variant="contained" onClick={logout} sx={{ mt: 2 }}>
              Logout
            </Button>
          </>
        )}
      </Container>
    </ProtectedRoute>
  );
}