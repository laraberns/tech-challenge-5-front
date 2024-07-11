import React, { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { Container, Typography, TextField, Button, Link, Alert } from '@mui/material';
import { Box } from '@mui/system';
import logoImg from '../../assets/logo.svg';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/services/firebaseConfig';
import { useRouter } from 'next/router';
import useFcmToken from '@/hooks/useFcmToken';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  const { token } = useFcmToken();

  async function storeFCMToken(userId: string, token: string) {
    const url = `${process.env.BD_API}/fcm/store`;

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, token })
    };

    try {
      await fetch(url, requestOptions);
    } catch (error: any) {
      console.error('Erro ao enviar token FCM:', error.message);
    }
  }

  function handleSignIn(e: FormEvent) {
    e.preventDefault();
    signInWithEmailAndPassword(email, password)
      .then(() => {
        token && storeFCMToken(token, email);
      })
      .catch((error) => {
        console.error('Erro ao fazer login:', error);
      });
  }

  useEffect(() => {
    if (user) {
      router.push('/usuarios');
    }
  }, [user, router]);

  return (
    <Container maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
        <Image src={logoImg} alt="Workflow" width={250} height={100} />
        <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
          Bem-vindo de volta!
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
          Entre com suas credenciais abaixo para acessar sua conta.
        </Typography>
        <Box component="form" noValidate sx={{ mt: 2 }} onSubmit={handleSignIn}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            placeholder="********************"
            variant="outlined"
            onChange={e => setPassword(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Erro: Credenciais inválidas.
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: '#4763E4', color: '#fff' }}
            disabled={loading}
          >
            Entrar
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Typography variant="body1">
              Você não tem uma conta?{' '}
              <Link href="/registrar" sx={{ mt: 2, fontSize: '16px' }} underline='none'>
                Crie a sua conta aqui.
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
