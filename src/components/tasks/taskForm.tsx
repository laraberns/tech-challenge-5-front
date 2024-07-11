import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, DialogActions, Box, Typography } from '@mui/material';
import { ITask } from './taskBoard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFcmToken from '@/hooks/useFcmToken';

interface TaskFormProps {
  task?: ITask;
  onSave: (task: any) => void;
  onCancel: () => void;
  users: { id: string, name: string }[];
}

const priorities = ['Alta', 'Média', 'Baixa'];
const statuses = ['Backlog', 'Em Desenvolvimento', 'Finalizada'];

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel, users }) => {
  const [name, setName] = useState(task?.name || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<ITask['priority']>(task?.priority || 'Média');
  const [estimatedTime, setEstimatedTime] = useState(task?.time || 0);
  const [assignedUser, setAssignedUser] = useState(task?.user || '');
  const [status, setStatus] = useState<ITask['status']>(task?.status || 'Backlog');
  const [finalDate, setFinalDate] = useState<ITask['finalDate']>(task?.finalDate || '');
  const [fcmtoken, setFcmtoken] = useState<ITask['fcmtoken']>(task?.fcmtoken || '');
  const { token } = useFcmToken();

  useEffect(() => {
    if (!task && token) {
      setFcmtoken(token);
    }
  }, [task, token]);

  const handleSave = () => {
    onSave({ name, description, priority, time: estimatedTime, user: assignedUser, status, finalDate, fcmtoken })
  };

  useEffect(() => {
    setName(task?.name || '');
    setDescription(task?.description || '');
    setPriority(task?.priority || 'Média');
    setEstimatedTime(task?.time || 0);
    setAssignedUser(task?.user || '');
    setStatus(task?.status || 'Backlog');
    setFinalDate(task?.finalDate || '');
    setFcmtoken(task?.fcmtoken || token || '');
  }, [task, token]);

  const handleFinalDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    selectedDate.setDate(selectedDate.getDate() + 1); 
    selectedDate.setHours(23, 59, 59, 999);
    const currentDate = new Date()

    if (selectedDate >= currentDate) {
      setFinalDate(e.target.value);
    } else {
      toast.error('Por favor, selecione uma data futura ou hoje.');
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
      <ToastContainer />
      <TextField
        label="Nome da Tarefa"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <TextField
        select
        label="Prioridade"
        value={priority}
        onChange={(e) => setPriority(e.target.value as ITask['priority'])}
        required
      >
        {priorities.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Tempo Estimado (horas)"
        type="number"
        value={estimatedTime}
        onChange={(e) => setEstimatedTime(Number(e.target.value))}
        required
      />
      <TextField
        select
        label="Usuário Atribuído"
        value={assignedUser}
        onChange={(e) => setAssignedUser(e.target.value)}
        required
      >
        {users.map((user) => (
          <MenuItem key={user.id} value={user.name}>
            {user.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value as ITask['status'])}
        required
      >
        {statuses.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <Box>
        <Typography>Data Final</Typography>
        <TextField
          type="date"
          value={finalDate}
          onChange={handleFinalDateChange}
          fullWidth
        />
      </Box>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Box>
  );
};

export default TaskForm;
