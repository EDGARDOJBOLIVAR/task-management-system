import { useEffect, useState } from 'react';
import { Task } from '../../models/task.model';
import { TaskAPI } from '../../api/task.api';
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Modal} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { TaskForm } from './TaskForm';
import { User } from '../../models/user.model';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { Pagination } from '../shared/Pagination';
import { TaskStatusSelect } from './TaskStatusSelect';
import { TaskStatus } from '../../models/task.model';

interface TaskListProps {
  userId: number;
  onClose: () => void;
  user?: User;
}

export const TaskList = ({ userId, onClose, user }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadTasks();
  }, [userId]);

  const loadTasks = async (page: number = currentPage) => {
    const { data } = await TaskAPI.getAll(userId, page);
    setTasks(data.items);
    setTotalPages(data.totalPages);
    setCurrentPage(data.page);
  };

  const handleDelete = async (taskId: number) => {
    await TaskAPI.delete(userId, taskId);
    loadTasks();
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    loadTasks();
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteClick = (taskId: number) => {
    setTaskToDelete(taskId);
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      await handleDelete(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const handlePageChange = (page: number) => {
    loadTasks(page);
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    await TaskAPI.update(userId, task.id, {
        status: newStatus,
        title: task.title,
        description: task.description
    });
    loadTasks();
  };

  return (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: 800,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
      maxHeight: '90vh',
      overflow: 'auto'
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Gestión de Tareas</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {user && (
          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Usuario:</strong> {user.name}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {user.email}
            </Typography>
          </Box>
        )}
      </Box>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setIsModalOpen(true)}
        sx={{ mb: 2 }}
      >
        Nueva Tarea
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>
                <TaskStatusSelect
                  value={task.status}
                  onChange={(status) => handleStatusChange(task, status)}
                />
              </TableCell>
              <TableCell>
                <IconButton 
                  onClick={() => handleEdit(task)}
                  color="info"
                  sx={{
                    '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.2)' }
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => handleDeleteClick(task.id)}
                  color="error"
                  sx={{
                    '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.2)' }
                  }}
                >
                  <DeleteIcon />
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
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
      >
        <Box>
          <TaskForm
            userId={userId}
            onSuccess={handleSuccess}
            onCancel={() => {
              setIsModalOpen(false);
              setSelectedTask(null);
            }}
            initialData={selectedTask}
            isEdit={!!selectedTask}
          />
        </Box>
      </Modal>

      <ConfirmDialog
        open={taskToDelete !== null}
        title="Eliminar Tarea"
        message="¿Está seguro que desea eliminar esta tarea?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTaskToDelete(null)}
      />
    </Box>
  );
};
