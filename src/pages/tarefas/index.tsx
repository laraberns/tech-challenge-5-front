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
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig'
import { IUser } from '@/components/users/userTable';

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
                const querySnapshot = await getDocs(collection(db, 'tasks'));
                const fetchedTasks: ITask[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedTasks.push({ id: doc.id, ...doc.data() } as ITask);
                });
                setTasks(fetchedTasks);
            } catch (error) {
                console.error('Erro:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const fetchedUsers: IUser[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedUsers.push({ id: doc.id, ...doc.data() } as IUser);
                });
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Erro:', error);
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
            await deleteDoc(doc(db, 'tasks', taskId));
            setTasks(tasks.filter(task => task.id !== taskId));
            setOpenConfirm(false);
        } catch (error) {
            console.error('Error ao deletar tarefa:', error);
        }
    };

    const handleSave = async (task: Omit<ITask, 'id'>) => {
        try {
            if (selectedTask) {
                await updateDoc(doc(db, 'tasks', selectedTask.id), task);
                setTasks(tasks.map(u => (u.id === selectedTask.id ? { ...selectedTask, ...task } : u)));
            } else {
                const newtaskRef = await addDoc(collection(db, 'tasks'), task);
                setTasks([...tasks, { id: newtaskRef.id, ...task }]);
            }
            setOpenForm(false);
        } catch (error) {
            console.error('Erro ao salvar tarefa:', error);
        }
    };

    const handleDeleteConfirmation = (taskId: string) => {
        setTaskToDelete(taskId);
        setOpenConfirm(true);
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Image src={logoImg} alt="Workflow" width={250} height={100} />
            </Box>
            <Typography sx={{ display: 'flex', justifyContent: 'center', my: 2, fontSize: '30px' }}>
                Gestão de Tarefas
            </Typography>
            <TaskBoard tasks={tasks} onEdit={handleEdit} onDelete={handleDeleteConfirmation} />
            <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedTask ? 'Editar Tarefa' : 'Adicionar Tarefa'}</DialogTitle>
                <DialogContent>
                    <TaskForm task={selectedTask} onSave={handleSave} onCancel={() => setOpenForm(false)} users={users} />
                </DialogContent>
            </Dialog>
            <ConfirmationDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onConfirm={() => taskToDelete && handleDelete(taskToDelete)}
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

