import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { TaskStatus } from '../../models/task.model';

interface TaskStatusSelectProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
}

const statusColors = {
  [TaskStatus.PENDING]: '#ffa726',
  [TaskStatus.IN_PROGRESS]: '#29b6f6',
  [TaskStatus.COMPLETED]: '#66bb6a'
};

export const TaskStatusSelect = ({ value, onChange }: TaskStatusSelectProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as TaskStatus);
  };

  const getStatusLabel = (status: TaskStatus): string => {
    const labels = {
      [TaskStatus.PENDING]: 'Pendiente',
      [TaskStatus.IN_PROGRESS]: 'En Progreso',
      [TaskStatus.COMPLETED]: 'Completada'
    };
    return labels[status];
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      size="small"
      sx={{
        minWidth: 130,
        '& .MuiSelect-select': {
          color: statusColors[value],
          fontWeight: 'medium'
        }
      }}
    >
      {Object.values(TaskStatus).map((status) => (
        <MenuItem 
          key={status} 
          value={status}
          sx={{ color: statusColors[status] }}
        >
          {getStatusLabel(status)}
        </MenuItem>
      ))}
    </Select>
  );
};
