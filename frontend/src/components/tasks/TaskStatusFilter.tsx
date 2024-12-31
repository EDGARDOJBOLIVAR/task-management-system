import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { TaskStatus } from '../../models/task.model';

interface TaskStatusFilterProps {
  value: TaskStatus | 'ALL';
  onChange: (status: TaskStatus | 'ALL') => void;
}

const statusLabels = {
  ALL: 'Todas',
  [TaskStatus.PENDING]: 'Pendiente',
  [TaskStatus.IN_PROGRESS]: 'En Progreso',
  [TaskStatus.COMPLETED]: 'Completada'
};

export const TaskStatusFilter = ({ value, onChange }: TaskStatusFilterProps) => {
  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Filtrar por estado</InputLabel>
      <Select
        value={value}
        label="Filtrar por estado"
        onChange={(e) => onChange(e.target.value as TaskStatus | 'ALL')}
      >
        <MenuItem value="ALL">{statusLabels.ALL}</MenuItem>
        {Object.values(TaskStatus).map((status) => (
          <MenuItem key={status} value={status}>
            {statusLabels[status]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
