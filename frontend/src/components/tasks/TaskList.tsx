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
  Modal,
  Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { TaskForm } from './TaskForm';
import { User } from '../../models/user.model';
import { ConfirmDialog } from '../shared/ConfirmDialog';

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

  useEffect(() => {
    loadTasks();
  }, [userId]);

  const loadTasks = async () => {
    const { data } = await TaskAPI.getAll(userId);
    setTasks(data);
  };

  const handleDelete = async (taskId: number) => {
    await TaskAPI.delete(userId, taskId);
    loadTasks();
  };

  const handleToggleComplete = async (task: Task) => {
    await TaskAPI.update(userId, task.id, {
        completed: !task.completed,
        title: task.title,
        description: task.description
    });
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
            <TableCell>Completada</TableCell>
            <TableCell>Título</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                />
              </TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(task)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(task.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
