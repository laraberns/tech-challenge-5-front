import React from 'react';
import { Box, Card, CardContent, Typography, IconButton, Grid } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export interface ITask {
  id: string;
  name: string;
  description: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  time: number;
  user: string;
  status: 'Backlog' | 'Em Desenvolvimento' | 'Finalizada';
  finalDate: string
  fcmtoken: string
}

interface TaskBoardProps {
  tasks: ITask[];
  onEdit: (task: ITask) => void;
  onDelete: (userId: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onEdit, onDelete }) => {

  const columns = {
    Backlog: tasks.filter((task) => task.status === 'Backlog'),
    'Em Desenvolvimento': tasks.filter((task) => task.status === 'Em Desenvolvimento'),
    Finalizada: tasks.filter((task) => task.status === 'Finalizada'),
  };

  return (
    <Box mt={3} sx={{ backgroundColor: '#bfbadb', p: 3, borderRadius: 2 }}>
      <Grid container>
        {Object.keys(columns).map((column) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={column}
            sx={{
              backgroundColor: 'white',
              p: 3,
              border: '1px solid black',
              height: '70vh',
              overflowY: 'auto',
            }}
          >
            <Typography variant="h6" align="center" sx={{ mb: 2, fontWeight: 'bold', textDecoration: 'underline' }}>
              {column}
            </Typography>
            {columns[column as keyof typeof columns].map((task) => (
              <Card key={task.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 4, backgroundColor: '#f3f3f3' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{task.name}</Typography>
                  <Typography><span style={{ fontWeight: 'bold', color: "GrayText" }}>Descrição:</span> {task.description}</Typography>
                  <Typography><span style={{ fontWeight: 'bold', color: "GrayText" }}>Prioridade: </span>{task.priority}</Typography>
                  <Typography><span style={{ fontWeight: 'bold', color: "GrayText" }}>Tempo Estimado: </span>{task.time}h</Typography>
                  <Typography><span style={{ fontWeight: 'bold', color: "GrayText" }}>Usuário Atribuído: </span> {task.user}</Typography>
                  <Typography><span style={{ fontWeight: 'bold', color: "GrayText" }}>Data final estimada: </span> {task.finalDate}</Typography>
                  <Box display="flex" justifyContent="flex-end">
                    <IconButton onClick={() => onEdit(task)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => onDelete(task.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TaskBoard;
