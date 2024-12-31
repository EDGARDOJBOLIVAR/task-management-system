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
import AssignmentIcon from '@mui/icons-material/Assignment';
import { UserForm } from './UserForm';
import { TaskList } from '../tasks/TaskList';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { Pagination } from '../shared/Pagination';
import { notify } from '../../utils/toast';

export const UserList = () => {
 const [users, setUsers] = useState<User[]>([]);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [selectedUser, setSelectedUser] = useState<User | null>(null);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
 const [userToDelete, setUserToDelete] = useState<number | null>(null);
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);

 useEffect(() => {
   loadUsers();
 }, []);

 const loadUsers = async (page: number = currentPage) => {
   const { data } = await UserAPI.getAll(page);
   setUsers(data.items);
   setTotalPages(data.totalPages);
   setCurrentPage(data.page);
 };

 const handleDelete = async (id: number) => {
   try {
     await UserAPI.delete(id);
     notify.success('Usuario eliminado correctamente');
     loadUsers();
   } catch (error) {
     notify.error('Error al eliminar el usuario');
   }
 };

 const handleDeleteClick = (id: number) => {
   setUserToDelete(id);
 };

 const handleDeleteConfirm = async () => {
   if (userToDelete) {
     await handleDelete(userToDelete);
     setUserToDelete(null);
   }
 };

 const handleCreateSuccess = () => {
   notify.success('Usuario creado correctamente');
   loadUsers();
   setIsModalOpen(false);
 };

 const handleEditSuccess = () => {
   notify.success('Usuario actualizado correctamente');
   loadUsers();
   setIsEditModalOpen(false);
   setSelectedUser(null);
 };

 const handleEdit = (user: User) => {
   setSelectedUser(user);
   setIsEditModalOpen(true);
 };

 const handleManageTasks = (user: User) => {
   setSelectedUser(user);
   setIsTaskModalOpen(true);
 };

 const handlePageChange = (page: number) => {
   loadUsers(page);
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
           <TableCell>Id</TableCell>
           <TableCell>Nombre</TableCell>
           <TableCell>Email</TableCell>
           <TableCell>Acciones</TableCell>
         </TableRow>
       </TableHead>
       <TableBody>
         {users.map((user) => (
           <TableRow key={user.id}>
             <TableCell>{user.id}</TableCell>
             <TableCell>{user.name}</TableCell>
             <TableCell>{user.email}</TableCell>
             <TableCell>
               <IconButton 
                 onClick={() => handleEdit(user)}
                 color="info" 
                 sx={{
                   '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.2)' }
                 }}
               >
                 <EditIcon />
               </IconButton>
               <IconButton 
                 onClick={() => handleDeleteClick(user.id)}
                 color="error"
                 sx={{
                   '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.2)' }
                 }}
               >
                 <DeleteIcon />
               </IconButton>
               <IconButton 
                 onClick={() => handleManageTasks(user)}
                 color="success"
                 sx={{
                   '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.2)' }
                 }}
               >
                 <AssignmentIcon />
               </IconButton>
             </TableCell>
           </TableRow>
         ))}
       </TableBody>
     </Table>
     
     <Pagination
       currentPage={currentPage}
       totalPages={totalPages}
       onPageChange={handlePageChange}
     />

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

     <Modal
       open={isTaskModalOpen}
       onClose={() => setIsTaskModalOpen(false)}
       aria-labelledby="modal-tasks"
     >
       <Box>
         {selectedUser && (
           <TaskList 
             userId={selectedUser.id} 
             onClose={() => setIsTaskModalOpen(false)}
             user={selectedUser}
           />
         )}
       </Box>
     </Modal>

     <ConfirmDialog
       open={userToDelete !== null}
       title="Eliminar Usuario"
       message="¿Está seguro que desea eliminar este usuario? Esta acción también eliminará todas sus tareas asociadas."
       onConfirm={handleDeleteConfirm}
       onCancel={() => setUserToDelete(null)}
     />
   </Box>
 );
};