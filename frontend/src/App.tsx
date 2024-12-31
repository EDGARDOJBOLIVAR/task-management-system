// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { UsersPage } from './pages/Users';

const theme = createTheme({
  palette: {
    mode: 'light'
  }
});

export const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App
