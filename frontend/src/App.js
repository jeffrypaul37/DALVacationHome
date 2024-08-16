import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import NavPages from './pages/NavPages';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import RoomsPage from './pages/RoomsPage';
import AboutPage from './pages/AboutPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import { AuthProvider } from './context/AuthContext';
import DialogflowChatbot from './components/DialogflowChatbot';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<NavPages />}>
            <Route path="" element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="rooms/:title" element={<RoomDetailsPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </AuthProvider>
      <DialogflowChatbot />
    </ThemeProvider>
  );
};

export default App;
