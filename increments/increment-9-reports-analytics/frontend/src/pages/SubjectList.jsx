import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableHead, TableRow, IconButton, Button, TextField, 
  InputAdornment, Dialog, DialogTitle, DialogContent, 
  DialogActions, MenuItem, Snackbar, Alert, Menu, Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useSelector } from 'react-redux';
import socket from '../utils/socket';

const SubjectList = () => {
  const { user } = useSelector((state) => state.auth);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ subject_name: '', subject_code: '', course_id: '' });
  const [showSuccess, setShowSuccess] = useState('');
  
  // Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = user.token;
        const headers = { Authorization: `Bearer ${token}` };
        const subjectsRes = await axios.get('/api/subjects', { headers });
        const coursesRes = await axios.get('/api/courses', { headers });
        setSubjects(subjectsRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    
    if (user?.token) {
        fetchData();
        socket.on('courses_changed', fetchData);
    }
    
    return () => {
        socket.off('courses_changed', fetchData);
    };
  }, [user.token]);

  const handleOpenDialog = (subject = null) => {
    if (subject) {
        setEditingSubject(subject._id);
        setFormData({ 
            subject_name: subject.subject_name, 
            subject_code: subject.subject_code, 
            course_id: subject.course_id?._id || '' 
        });
    } else {
        setEditingSubject(null);
        setFormData({ subject_name: '', subject_code: '', course_id: '' });
    }
    setOpen(true);
    handleMenuClose();
  };

  const handleSaveSubject = async () => {
    if (!formData.subject_name || !formData.subject_code || !formData.course_id) {
        alert("Please fill all required fields!");
        return;
    }
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      if (editingSubject) {
        const { data } = await axios.put(`/api/subjects/${editingSubject}`, formData, { headers });
        setSubjects(subjects.map(s => s._id === editingSubject ? data : s));
        setShowSuccess('Subject updated successfully!');
      } else {
        const { data } = await axios.post('/api/subjects', formData, { headers });
        setSubjects([...subjects, data]);
        setShowSuccess('Subject added successfully!');
      }
      setOpen(false);
    } catch (err) {
      console.error('Failed to save subject', err);
      alert(err.response?.data?.message || "Error saving subject");
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject? This might affect related grades and quizzes.")) return;
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.delete(`/api/subjects/${id}`, { headers });
      setSubjects(subjects.filter(s => s._id !== id));
      setShowSuccess('Subject deleted successfully!');
      handleMenuClose();
    } catch (err) {
      console.error('Failed to delete subject', err);
      alert("Error deleting subject");
    }
  };

  const handleMenuOpen = (event, subject) => {
    setAnchorEl(event.currentTarget);
    setSelectedSubject(subject);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSubject(null);
  };

  const filteredSubjects = subjects.filter(s => 
    s.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subject_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#f8fafc', mb: 1, letterSpacing: -1.5 }}>
            Subject Catalog
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '1.05rem', fontWeight: 500 }}>
            Browse and manage all subjects and their course assignments.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', 
            color: '#fff', 
            fontWeight: 800, 
            px: 4,
            py: 1.8,
            textTransform: 'none',
            fontSize: '0.9rem',
            boxShadow: '0 10px 25px -5px rgba(56,189,248,0.4)',
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 30px -5px rgba(56,189,248,0.5)' }
          }}
        >
          Add New Subject
        </Button>
      </Box>

      <Paper sx={{ 
        borderRadius: '24px', 
        bgcolor: 'background.paper', 
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 50px -20px rgba(0,0,0,0.5)',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 2, background: 'rgba(255,255,255,0.01)' }}>
          <TextField 
            size="small"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
              sx: { borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.03)', color: 'white', '& fieldset': { border: '1px solid rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' } }
            }}
            sx={{ width: 300 }}
          />
        </Box>

        <Grid container spacing={3} sx={{ p: 3 }}>
          {filteredSubjects.length > 0 ? filteredSubjects.map((s) => (
            <Grid item xs={12} sm={6} md={4} key={s._id}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: '24px', 
                  bgcolor: 'rgba(255,255,255,0.02)', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    bgcolor: 'rgba(99, 102, 241, 0.05)',
                    borderColor: 'rgba(99,102,241,0.3)',
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: '12px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.05))', color: 'primary.main', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <AutoStoriesIcon />
                  </Box>
                  <IconButton 
                    size="small"
                    onClick={(e) => handleMenuOpen(e, s)}
                    sx={{ color: '#94a3b8', '&:hover': { color: '#38bdf8' } }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 800, mb: 0.5, lineHeight: 1.2 }}>
                  {s.subject_name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 800, letterSpacing: 1.5, display: 'block', mb: 2, textTransform: 'uppercase' }}>
                  {s.subject_code}
                </Typography>
                
                <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>COURSE:</Typography>
                  <Typography variant="caption" sx={{ color: '#e2e8f0', fontWeight: 700 }}>{s.course_id?.course_name || 'N/A'}</Typography>
                </Box>
              </Paper>
            </Grid>
          )) : (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, opacity: 0.5 }}>
                <AutoStoriesIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                <Typography sx={{ color: '#e2e8f0', fontWeight: 600 }}>No personal subjects found.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { bgcolor: '#0a0a0a', color: 'white', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', minWidth: 180, boxShadow: '0 20px 40px rgba(0,0,0,0.6)' } }}
      >
        <MenuItem onClick={() => handleOpenDialog(selectedSubject)} sx={{ gap: 2, py: 1.5, mx: 1, my: 0.5, borderRadius: 2, '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'primary.main' } }}>
            <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Edit Subject</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteSubject(selectedSubject?._id)} sx={{ gap: 2, py: 1.5, mx: 1, my: 0.5, borderRadius: 2, '&:hover': { bgcolor: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' } }}>
            <DeleteIcon fontSize="small" sx={{ color: '#f43f5e' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#f43f5e' }}>Delete Subject</Typography>
        </MenuItem>
      </Menu>

      {/* Add/Edit Subject Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', borderRadius: '24px', minWidth: 450, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 2 }}>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
        <DialogContent sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField 
            fullWidth label="Subject Name" variant="outlined" 
            value={formData.subject_name} onChange={(e) => setFormData({...formData, subject_name: e.target.value})}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#0f172a', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
          />
          <TextField 
            fullWidth label="Subject Code" variant="outlined" 
            value={formData.subject_code} onChange={(e) => setFormData({...formData, subject_code: e.target.value})}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#0f172a', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' } }}
          />
          <TextField 
            fullWidth select label="Course" variant="outlined" 
            value={formData.course_id} onChange={(e) => setFormData({...formData, course_id: e.target.value})}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#0f172a', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, '& .MuiInputLabel-root': { color: '#94a3b8' }, '& .MuiSelect-icon': { color: '#94a3b8' } }}
            SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: '#1e293b', color: 'white', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' } } } }}
          >
            {courses.map(c => <MenuItem key={c._id} value={c._id} sx={{ '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.1)' } }}>{c.course_name}</MenuItem>)}
            {courses.length === 0 && <MenuItem disabled>No courses found. Create one first.</MenuItem>}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSubject} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color: '#fff', fontWeight: 800, textTransform: 'none', px: 3, boxShadow: '0 4px 14px 0 rgba(56,189,248,0.39)' }}>{editingSubject ? 'Update Subject' : 'Save Subject'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(showSuccess)} autoHideDuration={3000} onClose={() => setShowSuccess('')}>
        <Alert severity="success" sx={{ width: '100%', borderRadius: 3, fontWeight: 700 }}>
          {showSuccess}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SubjectList;
