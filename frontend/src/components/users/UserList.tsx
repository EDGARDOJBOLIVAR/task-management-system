import { useEffect, useState } from 'react';
import { User } from '../../models/user.model';
import { UserAPI } from '../../api/user.api';
import { 
 Table, 
 TableBody, 
 TableCell, 
 TableHead, 
 TableRow,
 IconButton,
 Box,
 Button,
 Modal
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { UserForm } from './UserForm';

export const UserList = () => {
 const [users, setUsers] = useState<User[]>([]);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [selectedUser, setSelectedUser] = useState<User | null>(null);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);

 useEffect(() => {
   loadUsers();
 }, []);

 const loadUsers = async () => {
   const { data } = await UserAPI.getAll();
   setUsers(data);
 };

 const handleDelete = async (id: number) => {
   await UserAPI.delete(id);
   loadUsers();
 };

 const handleCreateSuccess = () => {
   loadUsers();
   setIsModalOpen(false);
 };

 const handleEditSuccess = () => {
   loadUsers();
   setIsEditModalOpen(false);
   setSelectedUser(null);
 };

 const handleEdit = (user: User) => {
   setSelectedUser(user);
   setIsEditModalOpen(true);
 };

 return (
   <Box>
     <Box sx={{ mb: 2 }}>
       <Button
         variant="contained"
         startIcon={<AddIcon />}
         onClick={() => setIsModalOpen(true)}
       >
         Crear Usuario
       </Button>
     </Box>
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
               <IconButton onClick={() => handleEdit(user)}>
                 <EditIcon />
               </IconButton>
               <IconButton onClick={() => handleDelete(user.id)}>
                 <DeleteIcon />
               </IconButton>
             </TableCell>
           </TableRow>
         ))}
       </TableBody>
     </Table>
     
     <Modal
       open={isModalOpen}
       onClose={() => setIsModalOpen(false)}
       aria-labelledby="modal-create-user"
     >
       <Box>
         <UserForm onSuccess={handleCreateSuccess} onCancel={() => setIsModalOpen(false)} />
       </Box>
     </Modal>

     <Modal
       open={isEditModalOpen}
       onClose={() => setIsEditModalOpen(false)}
       aria-labelledby="modal-edit-user"
     >
       <Box>
         <UserForm 
           onSuccess={handleEditSuccess} 
           onCancel={() => setIsEditModalOpen(false)}
           initialData={selectedUser}
           isEdit
         />
       </Box>
     </Modal>
   </Box>
 );
};