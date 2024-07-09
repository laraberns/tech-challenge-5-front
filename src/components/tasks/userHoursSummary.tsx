import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { ITask } from './taskBoard';

interface UserHoursSummaryProps {
  tasks: ITask[];
}

const UserHoursSummary: React.FC<UserHoursSummaryProps> = ({ tasks }) => {
  const [selectedUser, setSelectedUser] = useState<string | undefined>(undefined);

  const calculateTotalHours = (userId: string, status: 'Backlog' | 'Em Desenvolvimento' | 'Finalizada'): number => {
    const filteredTasks = tasks.filter(task => task.user === userId && task.status === status);
    return filteredTasks.reduce((total, task) => total + task.time, 0);
  };

  return (
    <Box sx={{ backgroundColor: '#bfbadb', p: 2, borderRadius: 2, boxShadow: 3, mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Horas Atribuídas</Typography>
      <Select
        value={selectedUser || ''}
        onChange={(e) => setSelectedUser(e.target.value as string)}
        fullWidth
        displayEmpty
        sx={{ mb: 1, backgroundColor: 'white', border: '1px solid black' }}
      >
        <MenuItem value="" disabled>
          Selecione um usuário
        </MenuItem>
        {tasks.map(task => task.user).filter((value, index, self) => self.indexOf(value) === index).map(user => (
          <MenuItem key={user} value={user}>{user}</MenuItem>
        ))}
      </Select>
      {selectedUser && (
        <>
          <Typography variant="body1">
            Total de horas no Backlog: <span style={{ fontWeight: 'bold' }}>{calculateTotalHours(selectedUser, 'Backlog')} </span>
          </Typography>
          <Typography variant="body1">
            Total de horas em Desenvolvimento:<span style={{ fontWeight: 'bold' }}> {calculateTotalHours(selectedUser, 'Em Desenvolvimento')}</span>
          </Typography>
          <Typography variant="body1">
            Total de horas Finalizadas: <span style={{ fontWeight: 'bold' }}>{calculateTotalHours(selectedUser, 'Finalizada')}</span>
        </Typography>
    </>
  )
}
    </Box >
  );
};

export default UserHoursSummary;
