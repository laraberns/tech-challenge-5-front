import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import { IUser } from './userTable';

const teamOptions = [
  'Recursos Humanos (RH)',
  'Vendas',
  'Marketing',
  'Desenvolvimento de Produto',
  'Suporte ao Cliente',
  'TI (Tecnologia da Informação)',
  'Finanças',
  'Jurídico e Compliance'
];

interface UserFormProps {
  user?: IUser;
  onSave: (user: Omit<IUser, 'id'>) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [team, setTeam] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name);
      setRole(user.role);
      setTeam(user.team);
    } else {
      setEmail('');
      setName('');
      setRole('');
      setTeam('');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ email, name, role, team });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        label="E-mail"
        variant="outlined"
        value={email}
        sx={{ mt: 1 }}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Nome"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Cargo"
        variant="outlined"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      />
      <TextField
        select
        label="Time"
        variant="outlined"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        required
      >
        {teamOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" type="submit">
          Salvar
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default UserForm;
