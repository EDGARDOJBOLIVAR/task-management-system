import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { UserAPI } from '../../api/user.api';
import { User } from '../../models/user.model';
import { notify } from '../../utils/toast';

interface UserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: User | null;
  isEdit?: boolean;
}

export const UserForm = ({ onSuccess, onCancel, initialData, isEdit = false }: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && initialData) {
        await UserAPI.update(initialData.id, formData);
      } else {
        await UserAPI.create(formData);
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
        {isEdit ? 'Editar Usuario' : 'Crear Usuario'}
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Nombre"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
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
