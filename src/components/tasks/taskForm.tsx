import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, DialogActions, Box } from '@mui/material';
import { ITask } from './taskBoard';

interface TaskFormProps {
  task?: ITask;
  onSave: (task: Omit<ITask, 'id'>) => void;
  onCancel: () => void;
  users: { id: string, name: string }[];
}

const priorities = ['Alta', 'Média', 'Baixa'];
const statuses = ['Backlog', 'Em Desenvolvimento', 'Finalizada'];

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel, users }) => {
  const [name, setName] = useState(task?.name || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<ITask['priority']>(task?.priority || 'Média');
  const [estimatedTime, setEstimatedTime] = useState(task?.estimatedTime || 0);
  const [assignedUser, setAssignedUser] = useState(task?.assignedUser || '');
  const [status, setStatus] = useState<ITask['status']>(task?.status || 'Backlog');

  const handleSave = () => {
    onSave({ name, description, priority, estimatedTime, assignedUser, status });
  };

  useEffect(() => {
    setName(task?.name || '');
    setDescription(task?.description || '');
    setPriority(task?.priority || 'Média');
    setEstimatedTime(task?.estimatedTime || 0);
    setAssignedUser(task?.assignedUser || '');
    setStatus(task?.status || 'Backlog');
  }, [task]);

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
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
