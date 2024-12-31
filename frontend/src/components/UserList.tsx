import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog } from '@mui/material';
import { api, User } from '../services/api';
// import UserForm from './UserForm';

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const loadUsers = async () => {
    const response = await api.getUsers();
    setUsers(response.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSave = async (user: User) => {
    if (editUser) {
      await api.updateUser(editUser.id!, user);
    } else {
      await api.createUser(user);
    }
    setOpen(false);
    loadUsers();
  };

  const handleDelete = async (id: number) => {
    await api.deleteUser(id);
    loadUsers();
  };

  return (
    <>
      <Button variant="contained" onClick={() => {setEditUser(null); setOpen(true)}} sx={{ mb: 2 }}>
        Add User
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/users/${user.id}/tasks`)}>Tasks</Button>
                  <Button onClick={() => {setEditUser(user); setOpen(true)}}>Edit</Button>
                  <Button onClick={() => handleDelete(user.id!)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        {/* <UserForm user={editUser} onSave={handleSave} onCancel={() => setOpen(false)} /> */}
      </Dialog>
    </>
  );
};

export default UserList;
