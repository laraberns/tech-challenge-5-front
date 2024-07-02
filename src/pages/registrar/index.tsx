import React from 'react';
import Image from 'next/image';
import { Container, Typography, TextField, Button, Link } from '@mui/material';
import { Box } from '@mui/system';
import logoImg from '../../assets/logo.svg';

export default function Register() {
  return (
    <Container maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
        <Image src={logoImg} alt="Workflow" width={250} height={100} />
        <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
          Crie sua conta
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
          Comece sua jornada conosco! Preencha os campos abaixo para criar sua conta.
        </Typography>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            placeholder="johndoe@gmail.com"
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="new-password"
            placeholder="********************"
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: '#4763E4', color: '#fff' }}
          >
            Registrar
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Typography variant="body1">
              Já tem uma conta?{' '}
              <Link href="/login" sx={{ mt: 2, fontSize: '16px' }} underline='none'>
                Faça login aqui.
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
