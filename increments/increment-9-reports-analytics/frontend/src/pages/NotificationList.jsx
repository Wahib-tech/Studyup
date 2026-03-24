import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, List, ListItem, ListItemText, Paper, 
  Avatar, IconButton, Menu, MenuItem, ListItemIcon, Button, Divider
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import socket from '../services/socketService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSelector } from 'react-redux'; // Added useSelector import
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'; // Added MarkEmailReadIcon import

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotif, setSelectedNotif] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get('/api/notifications', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    if (user) {
      fetchNotifications();
      socket.on('new_notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
      });
    }
    return () => socket.off('new_notification');
  }, [user]);

  const markRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`, {}, { 
        headers: { Authorization: `Bearer ${user.token}` } 
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, read_status: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put('/api/notifications/mark-all-read', {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, read_status: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) return;
    try {
      await axios.delete('/api/notifications/clear-all', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotif = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications(notifications.filter(n => n._id !== id));
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpen = (event, notif) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedNotif(notif);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedNotif(null);
  };

  return (
    <Box sx={{ position: 'relative' }}>
        {/* Mesh Gradient Background */}
        <Box sx={{ 
            position: 'absolute', top: -100, left: -100, right: -100, height: 400, 
            background: 'radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(192, 132, 252, 0.1) 0%, transparent 50%)',
            filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none'
        }} />

      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3, position: 'relative', zIndex: 1 }}>
        <Box>
            <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                mb: 1, 
                letterSpacing: -1.5,
                background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Notifications
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '1.05rem', fontWeight: 500 }}>
                Stay updated with your latest academic alerts and system messages.
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
                startIcon={<DoneAllIcon />}
                size="medium"
                onClick={markAllRead}
                sx={{ 
                    color: '#38bdf8', 
                    fontWeight: 900, 
                    textTransform: 'none', 
                    px: 3, py: 1.5, 
                    borderRadius: '16px', 
                    background: 'rgba(56,189,248,0.05)', 
                    border: '1px solid rgba(56,189,248,0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': { background: 'rgba(56,189,248,0.1)', transform: 'translateY(-2px)' },
                    transition: 'all 0.3s'
                }}
            >
                ALL READ
            </Button>
            <Button 
                startIcon={<DeleteOutlineIcon />}
                size="medium"
                onClick={clearAll}
                sx={{ 
                    color: '#fb7185', 
                    fontWeight: 900, 
                    textTransform: 'none', 
                    px: 3, py: 1.5, 
                    borderRadius: '16px', 
                    background: 'rgba(251,113,133,0.05)', 
                    border: '1px solid rgba(251,113,133,0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': { background: 'rgba(251,113,133,0.1)', transform: 'translateY(-2px)' },
                    transition: 'all 0.3s'
                }}
            >
                EMPTY CENTER
            </Button>
        </Box>
      </Box>

      <Paper sx={{ 
        borderRadius: '24px', 
        bgcolor: 'rgba(255, 255, 255, 0.02)', 
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 50px -20px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
        <List sx={{ p: 0 }}>
          {notifications.map((n, i) => (
            <ListItem 
              key={n._id} 
              onClick={() => !n.read_status && markRead(n._id)} 
              sx={{ 
                bgcolor: n.read_status ? 'transparent' : 'rgba(56, 189, 248, 0.03)',
                borderBottom: i !== notifications.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                py: 4,
                px: 4,
                cursor: n.read_status ? 'default' : 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                    bgcolor: n.read_status ? 'rgba(255,255,255,0.03)' : 'rgba(56, 189, 248, 0.06)',
                    transform: 'scale(1.002) translateX(5px)' 
                }
              }}
              secondaryAction={
                <IconButton 
                    edge="end" 
                    onClick={(e) => handleOpen(e, n)} 
                    sx={{ 
                        color: '#475569', 
                        transition: 'all 0.2s', 
                        '&:hover': { color: '#38bdf8', transform: 'rotate(90deg)' } 
                    }}
                >
                    <MoreVertIcon />
                </IconButton>
              }
            >
              <Box sx={{ mr: 4, position: 'relative' }}>
                <Avatar sx={{ 
                  bgcolor: n.read_status ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', 
                  color: n.read_status ? '#475569' : 'white',
                  width: 56,
                  height: 56,
                  boxShadow: !n.read_status ? '0 5px 15px rgba(56, 189, 248, 0.4)' : 'none'
                }}>
                  <NotificationsIcon sx={{ fontSize: 28 }} />
                </Avatar>
                {!n.read_status && (
                  <Box sx={{ 
                    position: 'absolute', top: 2, right: 2, 
                    width: 16, height: 16, borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #fb7185, #e11d48)', 
                    border: '3px solid #020617',
                    boxShadow: '0 0 10px rgba(251,113,133,0.8)'
                  }} />
                )}
              </Box>
              <ListItemText 
                primary={n.title} 
                secondary={n.message} 
                primaryTypographyProps={{ 
                  fontWeight: n.read_status ? 600 : 900, 
                  color: n.read_status ? '#64748b' : '#f8fafc',
                  fontSize: '1.1rem',
                  mb: 0.5,
                  letterSpacing: -0.5
                }}
                secondaryTypographyProps={{ 
                  color: n.read_status ? '#475569' : '#94a3b8',
                  fontSize: '0.95rem',
                  fontWeight: 500
                }}
              />
            </ListItem>
          ))}
          {notifications.length === 0 && (
            <Box sx={{ p: 15, textAlign: 'center' }}>
               <NotificationsIcon sx={{ fontSize: 100, color: 'rgba(255,255,255,0.02)', mb: 3 }} />
               <Typography variant="h5" sx={{ color: '#f8fafc', fontWeight: 900, mb: 1 }}>Pure Silence</Typography>
               <Typography sx={{ color: '#64748b', fontWeight: 500 }}>No alerts waiting for you. Get back to your focus zone!</Typography>
            </Box>
          )}
        </List>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { bgcolor: 'background.paper', color: 'white', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, minWidth: 180, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }
        }}
      >
        {!selectedNotif?.read_status && (
          <MenuItem onClick={() => { markRead(selectedNotif._id); handleClose(); }}>
            <ListItemIcon><MarkEmailReadIcon fontSize="small" sx={{ color: '#38bdf8' }} /></ListItemIcon>
            Mark as read
          </MenuItem>
        )}
        <MenuItem onClick={() => selectedNotif?._id && deleteNotif(selectedNotif._id)} sx={{ color: '#fb7185' }}>
          <ListItemIcon><DeleteOutlineIcon fontSize="small" sx={{ color: '#fb7185' }} /></ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default NotificationList;
