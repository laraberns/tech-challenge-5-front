import React from 'react';
import { CircularProgress, Container, Typography } from '@mui/material';

const LoadingPage: React.FC = () => {
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '20vh' }}>
      <CircularProgress size={80} thickness={4} />
      <Typography variant="h6" style={{ marginTop: '20px' }}>
        Carregando...
      </Typography>
    </Container>
  );
};

export default LoadingPage;
