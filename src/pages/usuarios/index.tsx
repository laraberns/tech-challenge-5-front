
import { auth } from '@/services/firebaseConfig';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserTable, { IUser } from '@/components/users/userTable';
import withAuth from '@/components/withAuth';
import UserForm from '@/components/users/userForm';
import Slide from '@mui/material/Slide';
import Image from 'next/image';
import logoImg from '../../assets/logo.svg';
import Link from 'next/link';

const Transition = Slide;

const Usuarios = () => {
    const [signOut] = useSignOut(auth);
    const [users, setUsers] = useState<IUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.BD_API}/users/allusers`);

                if (response.status === 400 || response.status === 404) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }
                
                const fetchedUsers = await response.json();
                setUsers(fetchedUsers);
            } catch (error: any) {
                toast.error(`Erro ao buscar os usuários: ${error.message}`);
            }
        };

        fetchUsers();
    }, []);

    const handleAdd = () => {
        setSelectedUser(null);
        setOpen(true);
    };

    const handleEdit = (user: IUser) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleDelete = async (userId: string) => {
        try {
            const response = await fetch(`${process.env.BD_API}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar usuário');
            }

            setUsers(users.filter(user => user.id !== userId));
            toast.success('Usuário deletado com sucesso!');
        } catch (error: any) {
            toast.error(`Erro ao deletar usuário: ${error.message}`);
        }
    }

    const handleSave = async (user: Omit<IUser, 'id'>) => {
        try {
            if (selectedUser) {
                const url =`${process.env.BD_API}/users/changeuser`;

                const requestOptions = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: selectedUser.id,
                        ...user
                    })
                };

                const response = await fetch(url, requestOptions);

                if (response.status == 400 || response.status == 404) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }

                setUsers(users.map(u => (u.id === selectedUser.id ? { ...selectedUser, ...user } : u)));
            } else {
                const url = `${process.env.BD_API}/users/adduser`;

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        team: user.team
                    })
                };

                const response = await fetch(url, requestOptions);
        
                if (response.status == 400 || response.status == 404) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }

                const responseData = await response.json();

                setUsers([...users, { id: responseData.id, ...user }]);
            }

            setOpen(false);
            toast.success(selectedUser ? 'Usuário editado com sucesso!' : 'Usuário adicionado com sucesso!');
        } catch (error: any) {
            toast.error(`Erro: ${error.message}`);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Image src={logoImg} alt="Workflow" width={250} height={100} />
            </Box>
            <Typography sx={{ display: 'flex', justifyContent: 'center', my: 2, fontSize: '30px' }}>
                Gestão de Usuários
            </Typography>
            <ToastContainer />
            {users.length === 0 ? (
                <Typography variant="h6" align="center" mt={3}>
                    Não há usuários cadastrados ainda. Adicione um usuário.
                </Typography>
            ) : (
                <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
            )}
            <Dialog open={open} onClose={handleCancel} fullScreen TransitionComponent={Transition}>
                <DialogTitle>{selectedUser ? 'Editar Usuário' : 'Adicionar Usuário'}</DialogTitle>
                <DialogContent>
                    <UserForm user={selectedUser || undefined} onSave={handleSave} onCancel={handleCancel} />
                </DialogContent>
            </Dialog>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleAdd}>
                        Adicionar Usuário
                    </Button>
                    <Link href="/tarefas">
                        <Button variant="contained" color="secondary">
                            Visualizar Tarefas
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

export default withAuth(Usuarios);
