// src/pages/LoginPage.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Paper, Typography, Box } from '@mui/material';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          A-S S Platform Login
        </Typography>
        <Box sx={{ mt: 3, width: '100%' }}>
          <Typography variant="body2" align="center" sx={{ mb: 2 }}>
            (This is a prototype simulation)
          </Typography>
          <Button fullWidth variant="contained" sx={{ mb: 2 }} onClick={() => handleLogin('citizen')}>
            Login as Citizen
          </Button>
          <Button fullWidth variant="outlined" onClick={() => handleLogin('admin')}>
            Login as Admin / Official
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;