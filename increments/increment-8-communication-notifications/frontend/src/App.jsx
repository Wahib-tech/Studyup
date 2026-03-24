import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import StudentList from './pages/StudentList';
import CourseSectionList from './pages/CourseSectionList';
import SubjectList from './pages/SubjectList';
import GradesList from './pages/GradesList';
import QuizGenerator from './pages/QuizGenerator';
import TaskList from './pages/TaskList';
import NotificationList from './pages/NotificationList';
import AppLayout from './components/AppLayout';

const theme = createTheme({ palette: { mode: 'dark' } });

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/students" element={<AppLayout><StudentList /></AppLayout>} />
          <Route path="/courses" element={<AppLayout><CourseSectionList /></AppLayout>} />
          <Route path="/subjects" element={<AppLayout><SubjectList /></AppLayout>} />
          <Route path="/grades" element={<AppLayout><GradesList /></AppLayout>} />
          <Route path="/quiz-ai" element={<AppLayout><QuizGenerator /></AppLayout>} />
          <Route path="/tasks" element={<AppLayout><TaskList /></AppLayout>} />
          <Route path="/notifications" element={<AppLayout><NotificationList /></AppLayout>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
export default App;


