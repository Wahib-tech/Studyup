import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Paper, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSelector } from 'react-redux';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get('/api/notifications', { headers: { Authorization: `Bearer ${user.token}` } });
      setNotifications(data);
    };
    if (user) fetch();
  }, [user]);

  const markRead = async (id) => {
    await axios.put(`/api/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${user.token}` } });
    setNotifications(notifications.map(n => n._id === id ? { ...n, read_status: true } : n));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Notifications</Typography>
      <Paper>
        <List>
          {notifications.map((n) => (
            <ListItem key={n._id} button onClick={() => markRead(n._id)} sx={{ bgcolor: n.read_status ? 'transparent' : 'action.hover' }}>
              <Badge color="primary" variant="dot" invisible={n.read_status}>
                <NotificationsIcon sx={{ mr: 2, color: 'text.secondary' }} />
              </Badge>
              <ListItemText primary={n.title} secondary={n.message} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};
export default NotificationList;
