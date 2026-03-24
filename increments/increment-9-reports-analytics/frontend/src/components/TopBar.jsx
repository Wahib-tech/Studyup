import React, { useState, useEffect } from 'react';
import { 
  Box, TextField, InputAdornment, IconButton, Typography, 
  Badge, Button, Avatar, Snackbar, Alert, Tooltip 
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import socket from '../services/socketService';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';

const TopBar = ({ onMenuClick, isMobile }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileImage, setProfileImage] = useState('');
  const [newNotif, setNewNotif] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get('/api/analytics/dashboard-summary', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setUnreadCount(data.unreadNotifications);
        setProfileImage(data.profile_image);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };

    if (user) {
      fetchDashboardData();

      socket.on('new_notification', (notification) => {
        setUnreadCount(prev => prev + 1);
        setNewNotif(notification);
        setOpenAlert(true);
        
        // Optional: Play a subtle notification sound
        try {
          const audio = new Audio('/assets/notification.mp3');
          audio.play().catch(() => {}); // Browsers might block autoplay
        } catch (e) {}
      });
    }

    return () => socket.off('new_notification');
  }, [user]);

  return (
    <Box className="print-hide" sx={{ 
      height: 80, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      px: { xs: 2, md: 4 }, 
      bgcolor: 'rgba(2, 6, 23, 0.8)', 
      backdropFilter: 'blur(12px)',
      position: 'sticky', 
      top: 0, 
      zIndex: 1100,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      '@media print': { display: 'none !important' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {isMobile && (
          <IconButton onClick={onMenuClick} sx={{ color: '#f8fafc' }}>
            <MenuIcon />
          </IconButton>
        )}
        
        <Box sx={{ display: { xs: 'none', sm: 'block' }, width: { sm: 250, md: 400 } }}>
          <TextField 
            fullWidth
            size="small"
            placeholder="Search subjects, quizzes or tasks..."
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: '1.2rem' }} /></InputAdornment>,
              sx: { 
                borderRadius: '12px', 
                bgcolor: 'rgba(255,255,255,0.03)', 
                color: '#f8fafc',
                fontSize: '0.9rem',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'primary.main' },
                '&.Mui-focused': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'primary.main' },
                '& fieldset': { border: 'none' }
              }
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1, color: '#94a3b8', cursor: 'pointer', '&:hover': { color: '#f8fafc' } }}>
          <LanguageIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>English</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, alignItems: 'center' }}>
          <Tooltip title="Messages">
            <IconButton 
              onClick={() => navigate('/notifications')}
              sx={{ color: '#94a3b8', bgcolor: 'rgba(255,255,255,0.03)', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#f8fafc' }, border: '1px solid rgba(255,255,255,0.05)', p: { xs: 0.8, md: 1.2 } }}
            >
              <Badge badgeContent={0} color="error" variant="dot">
                <ChatBubbleOutlineIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Notifications">
            <IconButton 
              onClick={() => navigate('/notifications')}
              sx={{ color: 'secondary.main', bgcolor: 'rgba(6, 182, 212, 0.1)', '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.2)' }, border: '1px solid rgba(6, 182, 212, 0.2)', p: { xs: 0.8, md: 1.2 } }}
            >
              <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 900, fontSize: '0.65rem', border: '2px solid #020617' } }}>
                <NotificationsNoneIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>

        <Button 
          variant="contained" 
          onClick={() => navigate('/quizzes')}
          sx={{ 
            borderRadius: 3, 
            textTransform: 'none', 
            fontWeight: 800, 
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
            color: '#fff',
            minWidth: { xs: '60px', md: '140px' },
            px: { xs: 2, md: 3 },
            py: 1,
            fontSize: { xs: '0.8rem', md: '0.875rem' },
            boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 25px -5px rgba(99, 102, 241, 0.5)' }
          }}
        >
          {isMobile ? 'New' : 'Generate Quiz'}
        </Button>

        <Avatar 
          src={profileImage || "/assets/profile.png"}
          onClick={() => navigate('/profile')}
          sx={{ 
            width: 44, 
            height: 44, 
            bgcolor: 'primary.main', 
            cursor: 'pointer',
            border: '2px solid rgba(99, 102, 241, 0.4)',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)',
            '&:hover': { transform: 'scale(1.05)', borderColor: 'primary.light' },
            transition: 'all 0.3s ease'
          }}
        >
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
      </Box>

      {/* Real-time Notification Alert */}
      <Snackbar 
        open={openAlert} 
        autoHideDuration={5000} 
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 7 }}
      >
        <Alert 
          onClose={() => setOpenAlert(false)} 
          severity="info" 
          onClick={() => {
              navigate('/notifications');
              setOpenAlert(false);
          }}
          sx={{ 
            width: '100%', 
            borderRadius: '20px', 
            bgcolor: '#0a0a0a', 
            color: 'white',
            cursor: 'pointer',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderLeft: '4px solid #06b6d4',
            '& .MuiAlert-icon': { color: 'secondary.main' },
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            '&:hover': { bgcolor: '#111' }
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 800 }}>{newNotif?.title}</Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>{newNotif?.message}</Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TopBar;
