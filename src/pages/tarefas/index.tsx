import React, { useState } from 'react';
import { Container, Button, Dialog, DialogTitle, DialogContent, Typography, Box } from '@mui/material';
import TaskBoard, { ITask } from '@/components/tasks/taskBoard';
import TaskForm from '@/components/tasks/taskForm';
import ConfirmationDialog from '@/components/confirmationDialog';
import { useSignOut } from 'react-firebase-hooks/auth';
import LoadingPage from '@/components/loading';
import { auth } from '@/services/firebaseConfig';
import UserHoursSummary from '@/components/tasks/userHoursSummary';
import logoImg from '../../assets/logo.svg';
import Image from 'next/image';

const mockUsers = [
    { id: '1', name: 'User One' },
    { id: '2', name: 'User Two' },
];

const mockTasks: ITask[] = [
    { id: 1, name: 'Task One', description: 'Description One', priority: 'Alta', estimatedTime: 5, assignedUser: 'User One', status: 'Backlog' },
    { id: 2, name: 'Task Two', description: 'Description Two', priority: 'Média', estimatedTime: 3, assignedUser: 'User Two', status: 'Em Desenvolvimento' },
];

const TaskPage: React.FC = () => {
    const [tasks, setTasks] = useState<ITask[]>(mockTasks);
    const [selectedTask, setSelectedTask] = useState<ITask | undefined>(undefined);
    const [openForm, setOpenForm] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
    const [signOut, loading] = useSignOut(auth);

    if (loading) {
        return <LoadingPage />;
    }

    const handleAdd = () => {
        setSelectedTask(undefined);
        setOpenForm(true);
    };

    const handleEdit = (task: ITask) => {
        setSelectedTask(task);
        setOpenForm(true);
    };

    const handleDelete = (id: number) => {
        setTaskToDelete(id);
        setOpenConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (taskToDelete !== null) {
            setTasks(tasks.filter(task => task.id !== taskToDelete));
        }
        setOpenConfirm(false);
    };

    const handleSave = (task: Omit<ITask, 'id'>) => {
        if (selectedTask) {
            setTasks(tasks.map(t => (t.id === selectedTask.id ? { ...selectedTask, ...task } : t)));
        } else {
            setTasks([...tasks, { id: tasks.length + 1, ...task }]);
        }
        setOpenForm(false);
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Image src={logoImg} alt="Workflow" width={250} height={100} />
            </Box>
            <Typography sx={{ display: 'flex', justifyContent: 'center', my: 2, fontSize: '30px' }}>
                Gestão de Tarefas
            </Typography>
            <TaskBoard tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
            <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedTask ? 'Editar Tarefa' : 'Adicionar Tarefa'}</DialogTitle>
                <DialogContent>
                    <TaskForm task={selectedTask} onSave={handleSave} onCancel={() => setOpenForm(false)} users={mockUsers} />
                </DialogContent>
            </Dialog>
            <ConfirmationDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={handleConfirmDelete}
                message="Tem certeza que deseja deletar esta tarefa?"
            />
            <Box mt={4}>
                <UserHoursSummary tasks={tasks} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 4 }}>
                <Button variant="contained" color="primary" onClick={handleAdd}>
                    Adicionar Tarefa
                </Button>
                <Button variant="contained" color="error" onClick={async () => {
                    const success = await signOut();
                    if (success) {
                        alert('Logout com sucesso');
                    }
                }}>
                    Sair
                </Button>
            </Box>
        </Container>
    );
};

export default TaskPage;
