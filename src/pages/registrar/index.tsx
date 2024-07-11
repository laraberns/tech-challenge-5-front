import React, { FormEvent, useState } from 'react';
import Image from 'next/image';
import { Container, Typography, TextField, Button, Link, Alert } from '@mui/material';
import { Box } from '@mui/system';
import logoImg from '../../assets/logo.svg';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/services/firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

  function handleRegister(e: FormEvent) {
    e.preventDefault();
    if (isEmailValid && isPasswordValid) {
      createUserWithEmailAndPassword(email, password);
      toast.success("Registrado com sucesso!");
    } else {
      if (!email || !password) {
        setIsEmailValid(email !== '');
        setIsPasswordValid(password !== '');
      }
    }
  }

  function validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validatePassword(password: string) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(validateEmail(newEmail) || newEmail === '');
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordValid(validatePassword(newPassword) || newPassword === '');
  }

  return (
    <Container maxWidth="xs">
      <ToastContainer />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
        <Image src={logoImg} alt="Workflow" width={250} height={100} />
        <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
          Crie sua conta
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
          Comece sua jornada conosco! Preencha os campos abaixo para criar sua conta.
        </Typography>
        <Box component="form" noValidate sx={{ mt: 2 }} onSubmit={handleRegister}>
          <TextField
            error={!isEmailValid}
            helperText={!isEmailValid && "Por favor, insira um email válido."}
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            placeholder="johndoe@gmail.com"
            variant="outlined"
            onChange={handleEmailChange}
          />
          <TextField
            error={!isPasswordValid}
            helperText={!isPasswordValid && "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial."}
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
            onChange={handlePasswordChange}
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
