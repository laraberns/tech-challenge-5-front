import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Theme, styled } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export interface IUser {
  id: number;
  email: string;
  name: string;
  role: string;
  team: string;
}

interface UserTableProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
  onDelete: (id: number) => void;
}

const StyledTableCell = styled(TableCell)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.grey[600],
  color: theme.palette.common.white, 
  fontWeight: 'bold', 
  fontSize: theme.typography.subtitle1.fontSize, 
}));

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleOpen = (id: number) => {
    setSelectedUserId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUserId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId !== null) {
      onDelete(selectedUserId);
    }
    handleClose();
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>E-mail</StyledTableCell>
              <StyledTableCell>Nome</StyledTableCell>
              <StyledTableCell>Cargo</StyledTableCell>
              <StyledTableCell>Time</StyledTableCell>
              <StyledTableCell>Ações</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.team}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpen(user.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmar Deleção</DialogTitle>
        <DialogContent>
        <Typography variant="body1">
            Tem certeza que deseja deletar este usuário?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserTable;
