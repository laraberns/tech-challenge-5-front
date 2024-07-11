import React, { useEffect, useState } from 'react';
import { Container, Button, Dialog, DialogTitle, DialogContent, Typography, Box } from '@mui/material';
import TaskBoard, { ITask } from '@/components/tasks/taskBoard';
import TaskForm from '@/components/tasks/taskForm';
import ConfirmationDialog from '@/components/confirmationDialog';
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '@/services/firebaseConfig';
import UserHoursSummary from '@/components/tasks/userHoursSummary';
import logoImg from '../../assets/logo.svg';
import Image from 'next/image';
import { IUser } from '@/components/users/userTable';
import Link from 'next/link';
import withAuth from '@/components/withAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskPage: React.FC = () => {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [selectedTask, setSelectedTask] = useState<ITask | undefined>(undefined);
    const [openForm, setOpenForm] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const [users, setUsers] = useState<IUser[]>([]);
    const [signOut] = useSignOut(auth);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`${process.env.BD_API}/tasks/alltasks`);

                if (response.status === 400 || response.status === 404) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }
                
                const fetchedTasks = await response.json();
                setTasks(fetchedTasks);
            } catch (error: any) {
                toast.error(`Erro ao buscar as tasks: ${error.message}`);
            }
        }

        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.BD_API}/users/allusers`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar os usuários');
                }
                const fetchedUsers = await response.json();
                setUsers(fetchedUsers);
            } catch (error: any) {
                toast.error(`Erro ao buscar os usuários: ${error.message}`);
            }
        };

        fetchUsers();
        fetchTasks();
    }, []);

    const handleAdd = () => {
        setSelectedTask(undefined);
        setOpenForm(true);
    };

    const handleEdit = (task: ITask) => {
        setSelectedTask(task);
        setOpenForm(true);
    };

    const handleDelete = async (taskId: string) => {
        try {
            const response = await fetch(`${process.env.BD_API}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar tarefa');
            }

            setTasks(tasks.filter(task => task.id !== taskId));
            toast.success('Tarefa deletada com sucesso!');
        } catch (error: any) {
            toast.error(`Erro ao deletar tarefa: ${error.message}`);
        }
    }

    const handleSave = async (task: Omit<ITask, 'id'>) => {
        try {
            if (selectedTask) {
                const url = `${process.env.BD_API}/tasks/changetask`;

                const requestOptions = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: selectedTask.id,
                        ...task
                    })
                };

                const response = await fetch(url, requestOptions);

                if (response.status === 400 || response.status === 404) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }

                setTasks(tasks.map(u => (u.id === selectedTask.id ? { ...selectedTask, ...task } : u)));
            } else {
                const url = `${process.env.BD_API}/tasks/addtask`;

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: task.name,
                        description: task.description,
                        priority: task.priority,
                        time: task.time,
                        user: task.user,
                        status: task.status,
                        finalDate: task.finalDate,
                        fcmtoken: task.fcmtoken,
                    })
                };

                const response = await fetch(url, requestOptions);

                if (response.status === 400 || response.status === 404) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }

                const responseData = await response.json();

                setTasks([...tasks, { id: responseData.id, ...task }]);
            }

            toast.success(selectedTask ? 'Tarefa editada com sucesso!' : 'Tarefa adicionada com sucesso!');
            setOpenForm(false); // Fechar o Dialog após salvar
        } catch (error: any) {
            toast.error(`Erro: ${error.message}`);
        }
    };

    const handleDeleteConfirmation = (taskId: string) => {
        setTaskToDelete(taskId);
        setOpenConfirm(true);
    };

    return (
        <Container>    
            <ToastContainer />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Image src={logoImg} alt="Workflow" width={250} height={100} />
            </Box>
            <Typography sx={{ display: 'flex', justifyContent: 'center', my: 2, fontSize: '30px' }}>
                Gestão de Tarefas
            </Typography>
            {tasks.length === 0 ? (
                <Typography variant="h6" align="center" mt={3}>
                    Não há tarefas cadastradas ainda. Adicione uma tarefa.
                </Typography>
            ) : (
                <TaskBoard tasks={tasks} onEdit={handleEdit} onDelete={handleDeleteConfirmation} />
            )}
            <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedTask ? 'Editar Tarefa' : 'Adicionar Tarefa'}</DialogTitle>
                <DialogContent>
                    <TaskForm task={selectedTask} onSave={handleSave} onCancel={() => setOpenForm(false)} users={users} />
                </DialogContent>
            </Dialog>
            <ConfirmationDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={() => {
                    handleDelete(taskToDelete!); 
                    setOpenConfirm(false);
                }}
                message="Tem certeza que deseja deletar esta tarefa?"
            />

            <Box mt={4}>
                {tasks.length > 0 && <UserHoursSummary tasks={tasks} />}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 4 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleAdd}>
                        Adicionar Tarefa
                    </Button>
                    <Link href="/usuarios">
                        <Button variant="contained" color="secondary">
                            Visualizar Usuários
                        </Button>
                    </Link>
                </Box>
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

export default withAuth(TaskPage);
