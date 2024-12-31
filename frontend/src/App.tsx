import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import UserList from './components/UserList';
// import UserTasks from './components/UserTasks';
// import NavBar from './components/NavBar';

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      {/* <NavBar /> */}
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<UserList />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;