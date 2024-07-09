import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Theme, styled } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ConfirmationDialog from '../confirmationDialog';

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;
  team: string;
}


interface UserTableProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
  onDelete: (id: string) => void;
}

const StyledTableCell = styled(TableCell)(({ theme }: { theme: Theme }) => ({
  backgroundColor: '#a09abd',
  color: theme.palette.common.white,
  fontWeight: 'bold',
  fontSize: theme.typography.subtitle1.fontSize,
}));

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleOpenConfirmation = (id: string) => {
    setSelectedUserId(id);
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
    setSelectedUserId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId !== null) {
      onDelete(selectedUserId);
    }
    handleCloseConfirmation();
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Id (Código do Usuário)</StyledTableCell>
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
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.team}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenConfirmation(user.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmationDialog
        open={openConfirmation}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmDelete}
        message="Tem certeza que deseja deletar este usuário?"
      />
    </>
  );
};

export default UserTable;
