import { useState } from 'react';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { TaskAPI } from '../../api/task.api';
import { Task } from '../../models/task.model';

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
    completed: initialData?.completed || false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'completed' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && initialData) {
      await TaskAPI.update(userId, initialData.id, formData);
    } else {
      await TaskAPI.create(userId, formData);
    }
    onSuccess();
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
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Descripción"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={4}
      />
      {isEdit && (
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.completed}
              onChange={handleChange}
              name="completed"
            />
          }
          label="Completada"
        />
      )}
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