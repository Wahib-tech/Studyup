import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Checkbox, IconButton, TextField, Button, Paper, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newT, setNewT] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get('/api/tasks', { headers: { Authorization: `Bearer ${user.token}` } });
      setTasks(data);
    };
    if (user) fetch();
  }, [user]);

  const handleAdd = async () => {
    const { data } = await axios.post('/api/tasks', { title: newT }, { headers: { Authorization: `Bearer ${user.token}` } });
    setTasks([...tasks, data]);
    setNewT('');
  };

  const toggleTask = async (t) => {
    const { data } = await axios.put(`/api/tasks/${t._id}`, { status: t.status === 'completed' ? 'pending' : 'completed' }, { headers: { Authorization: `Bearer ${user.token}` } });
    setTasks(tasks.map(x => x._id === t._id ? data : x));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Task Manager</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField fullWidth placeholder="New task..." value={newT} onChange={(e) => setNewT(e.target.value)} />
        <Button variant="contained" onClick={handleAdd}>Add</Button>
      </Box>
      <Paper>
        <List>
          {tasks.map((t) => (
            <ListItem key={t._id} secondaryAction={ <IconButton edge="end"><DeleteIcon /></IconButton> }>
              <Checkbox checked={t.status === 'completed'} onChange={() => toggleTask(t)} />
              <ListItemText primary={t.title} sx={{ textDecoration: t.status === 'completed' ? 'line-through' : 'none' }} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};
export default TaskList;
