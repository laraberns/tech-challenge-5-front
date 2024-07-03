import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { Container, Typography, TextField, Button, Link, Alert } from '@mui/material';
import { Box } from '@mui/system';
import logoImg from '../../assets/logo.svg';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/services/firebaseConfig';

export default function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [
    createUserWithEmFailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

  function handleRegister(e: FormEvent) {
    e.preventDefault()
    createUserWithEmFailAndPassword(email, password)
  }

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
            onChange={e => setEmail(e.target.value)}
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
            onChange={e => setPassword(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Erro: {error.message}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleRegister}
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
