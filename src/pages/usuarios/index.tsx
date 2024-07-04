import LoadingPage from '@/components/loading';
import UserTable, { IUser } from '@/components/users/userTable';
import withAuth from '@/components/withAuth';
import { auth } from '@/services/firebaseConfig';
import React, { forwardRef, useState } from 'react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import UserForm from '@/components/users/userForm';
import Slide, { SlideProps } from '@mui/material/Slide';
import Image from 'next/image';
import logoImg from '../../assets/logo.svg';

const Transition = forwardRef(function Transition(props: SlideProps & { children: React.ReactElement<any, any> }, ref: React.Ref<unknown>) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Usuarios = () => {
    const mockUsers: IUser[] = [
        { id: 1, email: 'user1@example.com', name: 'User One', role: 'Developer', team: 'Team A' },
        { id: 2, email: 'user2@example.com', name: 'User Two', role: 'Designer', team: 'Team B' },
    ]

    const [signOut, loading] = useSignOut(auth);
    const [users, setUsers] = useState<IUser[]>(mockUsers);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [open, setOpen] = useState(false);

    const handleAdd = () => {
        setSelectedUser(null);
        setOpen(true);
    };

    const handleEdit = (user: IUser) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleDelete = (userId: number) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    const handleSave = (user: Omit<IUser, 'id'>) => {
        if (selectedUser) {
            setUsers(users.map(u => (u.id === selectedUser.id ? { ...selectedUser, ...user } : u)));
        } else {
            setUsers([...users, { id: users.length + 1, ...user }]);
        }
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5}}>
            <Image src={logoImg} alt="Workflow" width={250} height={100} />
            </Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Gestão de Usuários
            </Typography>
            <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
            <Dialog open={open} onClose={handleCancel} fullScreen TransitionComponent={Transition}>
                <DialogTitle>{selectedUser ? 'Editar Usuário' : 'Adicionar Usuário'}</DialogTitle>
                <DialogContent >
                    <UserForm user={selectedUser || undefined} onSave={handleSave} onCancel={handleCancel} />
                </DialogContent>
            </Dialog>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mt: 4 }}>
                    Adicionar Usuário
                </Button>
                <Button variant="contained" color="error" onClick={async () => {
                    const success = await signOut();
                    if (success) {
                        alert('Logout com sucesso');
                    }
                }} sx={{ mt: 4 }}>
                    Sair
                </Button>
            </Box>
        </Container>
    )
};

export default withAuth(Usuarios);
