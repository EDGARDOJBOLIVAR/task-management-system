import { useEffect, useState } from 'react';
import { User } from '../../services/types';
import { getUsers, deleteUser } from '../../services/userService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  IconButton
} from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    loadUsers();
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nombre</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <IconButton onClick={() => handleDelete(user.id)}>
                {/* <DeleteIcon /> */}
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
