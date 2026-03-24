import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { 
  Box, Typography, List, ListItem, ListItemText, Checkbox, 
  IconButton, TextField, Button, Paper, InputAdornment, Chip, 
  LinearProgress, Snackbar, Alert, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useSelector } from 'react-redux';
import socket from '../utils/socket';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSub, setSelectedSub] = useState('');
  const [newT, setNewT] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const [tasksRes, subjectsRes] = await Promise.all([
            axios.get('/api/tasks', { headers }),
            axios.get('/api/subjects', { headers })
        ]);
        setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
      } catch (err) {
        console.error('Failed to fetch data', err);
        setError('Failed to load tasks. Using offline state.');
      }
    };

    if (user) {
        fetchData();
        socket.on('tasks_changed', fetchData);
    }
    return () => {
        socket.off('tasks_changed', fetchData);
    };
  }, [user]);

  const handleAdd = async () => {
    if (!newT.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post('/api/tasks', { title: newT, subject_id: selectedSub }, { 
        headers: { Authorization: `Bearer ${user.token}` } 
      });
      setTasks(prev => [...prev, data]);
      setNewT('');
      setOpen(true);
    } catch (err) {
      console.error(err);
      setError('Failed to add task. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (t) => {
    try {
      const { data } = await axios.put(`/api/tasks/${t._id}`, { 
        status: t.status === 'completed' ? 'pending' : 'completed' 
      }, { headers: { Authorization: `Bearer ${user.token}` } });
      setTasks(prev => prev.map(x => x._id === t._id ? data : x));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, { 
        headers: { Authorization: `Bearer ${user.token}` } 
      });
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = Array.isArray(tasks) ? tasks.filter(t => t.status === 'completed').length : 0;
  const progress = (Array.isArray(tasks) && tasks.length > 0) ? (completedCount / tasks.length) * 100 : 0;

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Mesh Gradient Background */}
      <Box sx={{ 
          position: 'absolute', top: -100, left: -100, right: -100, height: 400, 
          background: 'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(192, 132, 252, 0.12) 0%, transparent 50%)',
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
                Task Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '1.05rem', fontWeight: 500 }}>
                Keep track of your study goals and daily assignments.
            </Typography>
        </Box>
        <Box sx={{ 
            textAlign: 'right', 
            bgcolor: 'rgba(255, 255, 255, 0.02)', 
            p: 3, 
            borderRadius: '24px', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            minWidth: 200
        }}>
           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ color: '#94a3b8', fontWeight: 800, fontSize: '0.75rem', letterSpacing: 1 }}>COMPLETION</Typography>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 900, lineHeight: 1 }}>{progress.toFixed(0)}%</Typography>
           </Box>
           <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                    height: 8, 
                    borderRadius: 4, 
                    bgcolor: 'rgba(255,255,255,0.05)', 
                    '& .MuiLinearProgress-bar': { 
                        background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)', 
                        borderRadius: 4, 
                        boxShadow: '0 0 15px rgba(99,102,241,0.4)' 
                    } 
                }} 
            />
        </Box>
      </Box>

      <Paper sx={{ 
        p: { xs: 3, md: 2.5 }, 
        mb: 5, 
        borderRadius: '24px', 
        bgcolor: 'rgba(255, 255, 255, 0.02)', 
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 50px -20px rgba(0,0,0,0.5)',
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2, 
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
          <TextField
            select
            label="Subject"
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
            sx={{
                width: { xs: '100%', md: 250 },
                '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    color: 'white',
                    '& fieldset': { border: '1px solid rgba(255,255,255,0.08)' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                },
                '& .MuiInputLabel-root': { color: '#64748b' }
            }}
          >
            <MenuItem value="" sx={{ fontWeight: 600 }}>General Task</MenuItem>
            {Array.isArray(subjects) && subjects.map(s => <MenuItem key={s._id} value={s._id} sx={{ fontWeight: 600 }}>{s.subject_name}</MenuItem>)}
          </TextField>
          <TextField 
            fullWidth 
            placeholder="What needs to be done?..." 
            value={newT} 
            disabled={loading}
            onChange={(e) => setNewT(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            InputProps={{
              sx: { 
                borderRadius: '16px', 
                bgcolor: 'rgba(255, 255, 255, 0.03)', 
                color: 'white',
                '& fieldset': { border: '1px solid rgba(255,255,255,0.08)' },
                '&:hover fieldset': { borderColor: 'primary.main' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' }
              }
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleAdd}
            disabled={loading || !newT.trim()}
            startIcon={loading ? null : <AddIcon />}
            sx={{ 
              borderRadius: '16px', 
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
              color: '#fff', 
              fontWeight: 900, 
              width: { xs: '100%', md: 'auto' },
              minWidth: { xs: '100%', md: 160 },
              height: 56,
              textTransform: 'none',
              boxShadow: '0 10px 20px -5px rgba(99,102,241,0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 15px 30px -5px rgba(99,102,241,0.5)' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              px: { xs: 2, md: 4 },
              fontSize: '1rem'
            }}
          >
            {loading ? 'Adding...' : 'Create Task'}
          </Button>
      </Paper>

      <Paper sx={{ 
        borderRadius: '24px', 
        bgcolor: 'rgba(255, 255, 255, 0.01)', 
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 50px -20px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
        <List sx={{ p: 0 }}>
          {Array.isArray(tasks) && tasks.map((t, i) => (
            <ListItem 
              key={t._id} 
              sx={{ 
                borderBottom: i !== tasks.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                py: 3.5,
                px: 4,
                transition: 'all 0.3s ease',
                '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.03)', transform: 'scale(1.005)' }
              }}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  onClick={() => deleteTask(t._id)}
                  sx={{ color: '#475569', transition: 'all 0.2s', '&:hover': { color: '#ef4444', transform: 'rotate(90deg)' } }}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <Checkbox 
                checked={t.status === 'completed'} 
                onChange={() => toggleTask(t)}
                sx={{ 
                  color: 'rgba(255,255,255,0.1)', 
                  '&.Mui-checked': { color: 'primary.main' },
                  mr: 2,
                  '& .MuiSvgIcon-root': { fontSize: 32 }
                }}
              />
              <ListItemText 
                primary={t.title} 
                secondary={t.subject_id?.subject_name || 'General Task'}
                primaryTypographyProps={{ 
                  fontWeight: t.status === 'completed' ? 600 : 800, 
                  fontSize: '1.15rem',
                  color: t.status === 'completed' ? '#475569' : '#f1f5f9',
                  sx: { textDecoration: t.status === 'completed' ? 'line-through' : 'none', transition: 'all 0.3s' }
                }} 
                secondaryTypographyProps={{
                   color: 'secondary.main',
                   fontWeight: 900,
                   fontSize: '0.75rem',
                   sx: { opacity: t.status === 'completed' ? 0.3 : 0.9, textTransform: 'uppercase', letterSpacing: 1.5, mt: 0.5 }
                }}
              />
              {t.status === 'completed' && (
                <Chip 
                    label="CLEARED" 
                    size="small" 
                    sx={{ 
                        mr: 2, 
                        background: 'rgba(74, 222, 128, 0.1)', 
                        border: '1px solid rgba(74,222,128,0.2)', 
                        color: '#4ade80', 
                        fontWeight: 900, 
                        height: 24, 
                        fontSize: '0.65rem' 
                    }} 
                />
              )}
            </ListItem>
          ))}
          {Array.isArray(tasks) && tasks.length === 0 && (
            <Box sx={{ p: 12, textAlign: 'center' }}>
               <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <TaskAltIcon sx={{ fontSize: 100, color: 'rgba(99, 102, 241, 0.05)', mb: 3 }} />
                    <Box sx={{ position: 'absolute', top: -10, right: -10, width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #4ade80, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(74, 222, 128, 0.4)' }}>
                        <AddIcon sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
               </Box>
               <Typography variant="h5" sx={{ color: '#f8fafc', fontWeight: 900, mb: 1 }}>All Clear!</Typography>
               <Typography sx={{ color: '#64748b', fontWeight: 500 }}>No tasks on your horizon. Enjoy the quiet or add a new goal!</Typography>
            </Box>
          )}
        </List>
      </Paper>

      <Snackbar 
        open={open} 
        autoHideDuration={4000} 
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%', borderRadius: '16px', fontWeight: 800, bgcolor: '#064e3b', color: '#4ade80', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          TASK DEPLOYED SUCCESSFULLY!
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%', borderRadius: '16px', fontWeight: 800, bgcolor: '#450a0a', color: '#f87171' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskList;
