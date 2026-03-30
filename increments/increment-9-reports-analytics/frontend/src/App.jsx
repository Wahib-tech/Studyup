import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import SubjectList from './pages/SubjectList';
import GradesList from './pages/GradesList';
import QuizGenerator from './pages/QuizGenerator';
import TaskList from './pages/TaskList';
import NotificationList from './pages/NotificationList';
import Analytics from './pages/Analytics';
import ProfileSettings from './pages/ProfileSettings';
import Programs from './pages/Programs'; // New import
import StudentList from './pages/StudentList';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import Contact from './pages/Contact';
import AppLayout from './components/AppLayout';

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.auth);
  return user ? <AppLayout><Outlet /></AppLayout> : <Navigate to="/login" />;
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
    secondary: { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
    background: { default: '#020617', paper: '#0a0a0a' },
    divider: 'rgba(255, 255, 255, 0.08)',
    text: { primary: '#f8fafc', secondary: '#94a3b8' }
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    h1: { fontWeight: 900, letterSpacing: '-0.02em' },
    h2: { fontWeight: 900, letterSpacing: '-0.02em' },
    h3: { fontWeight: 900, letterSpacing: '-0.02em' },
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 800, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 }
  },
  shape: { borderRadius: 16 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0a0a0a',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: '10px 24px' },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.3)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            '&:hover fieldset': { borderColor: '#6366f1' },
            '&.Mui-focused fieldset': { borderColor: '#6366f1' }
          }
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subjects" element={<SubjectList />} />
            <Route path="/grades" element={<GradesList />} />
            <Route path="/quizzes" element={<QuizGenerator />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/notifications" element={<NotificationList />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/programs" element={<Programs />} /> {/* Added routing for Programs */}
            <Route path="/students" element={<StudentList />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
export default App;


