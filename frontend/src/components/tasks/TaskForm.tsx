import { useState } from 'react';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { TaskAPI } from '../../api/task.api';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskStatusSelect } from './TaskStatusSelect';
import { notify } from '../../utils/toast';

interface TaskFormProps {
  userId: number;
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Task | null;
  isEdit?: boolean;
}

export const TaskForm = ({ userId, onSuccess, onCancel, initialData, isEdit = false }: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || TaskStatus.PENDING
  });
  const [errors, setErrors] = useState({
    title: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'completed' ? checked : value
    }));
  };

  const handleStatusChange = (status: TaskStatus) => {
    setFormData(prev => ({ ...prev, status }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      title: '',
      description: ''
    };

    if (formData.title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }
    if (formData.title.trim().length > 100) {
      newErrors.title = 'El título no debe exceder los 100 caracteres';
    }
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'La descripción no debe exceder los 500 caracteres';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      notify.error('Por favor, corrija los errores del formulario');
      return;
    }

    try {
      if (isEdit && initialData) {
        await TaskAPI.update(userId, initialData.id, formData);
      } else {
        await TaskAPI.create(userId, formData);
      }
      onSuccess();
    } catch (error: any) {
      notify.error(error.response?.data?.message || 'Error al procesar la solicitud');
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        {isEdit ? 'Editar Tarea' : 'Nueva Tarea'}
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Título"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={!!errors.title}
        helperText={errors.title}
        required
        inputProps={{ maxLength: 100 }}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Descripción"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={!!errors.description}
        helperText={errors.description || `${formData.description.length}/500`}
        multiline
        rows={4}
        inputProps={{ maxLength: 500 }}
      />
      <TaskStatusSelect
        value={formData.status}
        onChange={handleStatusChange}
      />
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          {isEdit ? 'Guardar' : 'Crear'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};
