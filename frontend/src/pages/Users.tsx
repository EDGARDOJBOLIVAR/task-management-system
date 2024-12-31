import { Box, Container, Typography } from '@mui/material';
import { UserList } from '../components/users/UserList';

export const UsersPage = () => (
  <Container maxWidth="lg">
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Usuarios
      </Typography>
      <UserList />
    </Box>
  </Container>
);
