import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, Button, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logout } from '../features/auth/authSlice';
import socket from '../services/socketService';
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
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const Sidebar = ({ mobile, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [counts, setCounts] = useState({ pendingTasks: 0, unreadNotifications: 0 });

  useEffect(() => {
    let interval;
    const fetchCounts = async () => {
      try {
        const { data } = await axios.get('/api/analytics/dashboard-summary', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setCounts(data);
      } catch (err) {
        console.error('Failed to fetch sidebar counts', err);
      }
    };

    if (user) {
      fetchCounts();
      interval = setInterval(fetchCounts, 5000); // Poll every 5s for realtime synchronization
      
      socket.on('new_notification', (notification) => {
        setCounts(prev => ({
          ...prev,
          unreadNotifications: prev.unreadNotifications + 1
        }));
      });
    }

    return () => {
      if (interval) clearInterval(interval);
      socket.off('new_notification');
    };
  }, [user, location.pathname]); 

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'My Programs', icon: <ClassIcon />, path: '/programs' },
    { text: 'Subjects', icon: <MenuBookIcon />, path: '/subjects' },
    { text: 'Grades', icon: <AssessmentIcon />, path: '/grades' },
    { text: 'AI Quizzes', icon: <QuizIcon />, path: '/quizzes' },
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks', badge: counts.pendingTasks },
    { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications', badge: counts.unreadNotifications },
  ];

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
    <Box className="print-hide" sx={{ 
      width: 280, 
      height: '100vh', 
      bgcolor: 'background.default', 
      display: 'flex', 
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      position: mobile ? 'relative' : 'fixed',
      zIndex: 1201,
      '@media print': { display: 'none !important' }
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
              key={item.text} 
              disablePadding
            >
              <ListItemButton 
                onClick={() => handleNav(item.path)}
                sx={{ 
                  borderRadius: '12px',
                  mb: 1,
                  py: 1.5,
                  bgcolor: location.pathname === item.path ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  color: location.pathname === item.path ? 'primary.main' : '#94a3b8',
                  border: location.pathname === item.path ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(99, 102, 241, 0.05)',
                    color: '#f8fafc',
                    '& .MuiListItemIcon-root': { color: 'primary.main' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit', minWidth: 40 }}>
                  {React.cloneElement(item.icon, { fontSize: 'small' })}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 700 : 500, fontSize: '0.85rem' }} 
                />
                {item.badge && item.badge > 0 ? (
                  <Box sx={{ 
                    bgcolor: 'primary.main', 
                    color: '#fff', 
                    px: 1, 
                    py: 0.2, 
                    borderRadius: '8px', 
                    fontSize: '0.7rem', 
                    fontWeight: 900,
                    boxShadow: '0 4px 10px rgba(99,102,241,0.3)'
                  }}>
                    {item.badge}
                  </Box>
                ) : null}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Profile Section */}
      <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', mx: 2, mb: 3, borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }} onClick={() => handleNav('/profile')}>
          <Avatar 
            src={counts.profile_image || "/assets/profile.png"}
            sx={{ 
                width: 44, 
                height: 44, 
                bgcolor: 'primary.main', 
                color: '#fff', 
                fontSize: '1rem', 
                fontWeight: 800,
                border: '2px solid rgba(99, 102, 241, 0.3)',
                boxShadow: '0 0 20px rgba(99,102,241,0.2)'
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.username || 'Student'}</Typography>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, display: 'block', lineHeight: 1, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 0.5 }}>Student</Typography>
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
