import { Box, Button, Typography } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, alignItems: 'center' }}>
      <Button
        variant="outlined"
        startIcon={<NavigateBeforeIcon />}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Anterior ({currentPage - 1})
      </Button>
      
      <Typography variant="body2" sx={{ minWidth: '100px', textAlign: 'center' }}>
        Página {currentPage} de {totalPages}
      </Typography>

      <Button
        variant="outlined"
        endIcon={<NavigateNextIcon />}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Siguiente ({currentPage + 1})
      </Button>
    </Box>
  );
};
