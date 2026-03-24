import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Avatar, Button, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuizIcon from '@mui/icons-material/Quiz';
import TaskIcon from '@mui/icons-material/Task';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Sidebar = ({ mobile, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const allMenuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Students', icon: <PeopleIcon />, path: '/students', roles: ['admin'] },
    { text: 'Courses', icon: <ClassIcon />, path: '/courses', roles: ['admin'] },
    { text: 'Subjects', icon: <MenuBookIcon />, path: '/subjects' },
    { text: 'Grades', icon: <AssessmentIcon />, path: '/grades' },
    { text: 'AI Quizzes', icon: <QuizIcon />, path: '/quizzes', badge: 3 },
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks', badge: 10 },
    { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  ];

  const menuItems = allMenuItems.filter(item => !item.roles || item.roles.includes(user?.role));

  const handleNav = (path) => {
    navigate(path);
    if (mobile && onClose) onClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    if (mobile && onClose) onClose();
  };

  return (
    <Box sx={{ 
      width: 280, 
      height: '100vh', 
      bgcolor: '#0f172a', 
      display: 'flex', 
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      position: mobile ? 'relative' : 'fixed'
    }}>
      {/* Brand Section */}
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src="/assets/logo.png" alt="Logo" style={{ height: 40, borderRadius: '4px' }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', letterSpacing: -0.5 }}>StudyUp</Typography>
      </Box>

      {/* Navigation section */}
      <Box sx={{ flex: 1, px: 2, mt: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 } }}>
        <List sx={{ px: 0 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => handleNav(item.path)}
              sx={{ 
                borderRadius: 3,
                mb: 0.5,
                py: 1.2,
                bgcolor: location.pathname === item.path ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                color: location.pathname === item.path ? '#38bdf8' : '#94a3b8',
                '&:hover': {
                  bgcolor: 'rgba(56, 189, 248, 0.05)',
                  color: '#f8fafc',
                  '& .MuiListItemIcon-root': { color: '#38bdf8' }
                }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#38bdf8' : 'inherit', minWidth: 40 }}>
                {React.cloneElement(item.icon, { fontSize: 'small' })}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 700 : 500, fontSize: '0.85rem' }} 
              />
              {item.badge && (
                <Box sx={{ 
                  bgcolor: '#38bdf8', 
                  color: '#0f172a', 
                  px: 0.8, 
                  py: 0.1, 
                  borderRadius: 1.5, 
                  fontSize: '0.65rem', 
                  fontWeight: 800 
                }}>
                  {item.badge}
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Profile Section */}
      <Box sx={{ p: 2, bgcolor: '#1e293b', mx: 2, mb: 3, borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#38bdf8', color: '#0f172a', fontSize: '0.9rem', fontWeight: 800 }}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.username || 'User'}</Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', lineHeight: 1 }}>{user?.role || 'Student'}</Typography>
          </Box>
        </Box>
        <Button 
          fullWidth
          variant="contained" 
          startIcon={<LogoutIcon sx={{ fontSize: '1rem' }} />}
          onClick={handleLogout}
          sx={{ 
            borderRadius: 2.5, 
            py: 0.8,
            fontSize: '0.8rem',
            bgcolor: 'rgba(251, 113, 133, 0.1)', 
            color: '#fb7185',
            textTransform: 'none',
            fontWeight: 700,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#fb7185', color: '#fff' }
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
