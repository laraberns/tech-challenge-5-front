import UserTable, { IUser } from '@/components/users/userTable';
import withAuth from '@/components/withAuth';
import { auth } from '@/services/firebaseConfig';
import React, { forwardRef, useState, useEffect } from 'react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import UserForm from '@/components/users/userForm';
import Slide, { SlideProps } from '@mui/material/Slide';
import Image from 'next/image';
import logoImg from '../../assets/logo.svg';
import { db } from '../../services/firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

const Transition = forwardRef(function Transition(props: SlideProps & { children: React.ReactElement<any, any> }, ref: React.Ref<unknown>) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Usuarios = () => {
    const [signOut] = useSignOut(auth);
    const [users, setUsers] = useState<IUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
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
    }, [])

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
            await deleteDoc(doc(db, 'users', userId));
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error ao deletar usuário:', error);
        }
    };
    
    const handleSave = async (user: Omit<IUser, 'id'>) => {
        try {
            if (selectedUser) {
                await updateDoc(doc(db, 'users', selectedUser.id), user);
                setUsers(users.map(u => (u.id === selectedUser.id ? { ...selectedUser, ...user } : u)));
            } else {
                const newUserRef = await addDoc(collection(db, 'users'), user);
                setUsers([...users, { id: newUserRef.id, ...user }]);
            }
            setOpen(false);
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
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
    );
};

export default withAuth(Usuarios);
