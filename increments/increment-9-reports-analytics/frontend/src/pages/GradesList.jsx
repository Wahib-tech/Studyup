import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Fab, CircularProgress, Grid
} from '@mui/material';
import { useSelector } from 'react-redux';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddIcon from '@mui/icons-material/Add';
import PostAddIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const GradesList = () => {
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formData, setFormData] = useState({
    subject_id: '',
    marks_obtained: '',
    total_marks: '',
    semester: 1
  });

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const [gradesRes, subjectsRes] = await Promise.all([
            axios.get(`/api/grades`, { headers }),
            axios.get(`/api/subjects`, { headers })
        ]);
        setGrades(gradesRes.data);
        setSubjects(subjectsRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleSaveGrade = async () => {
    if (!formData.subject_id || !formData.marks_obtained || !formData.total_marks) return;
    setSaving(true);
    try {
        const headers = { Authorization: `Bearer ${user.token}` };
        if (editingGrade) {
            const res = await axios.put(`/api/grades/${editingGrade}`, formData, { headers });
            setGrades(grades.map(g => g._id === editingGrade ? res.data : g));
        } else {
            const res = await axios.post('/api/grades', formData, { headers });
            setGrades([res.data, ...grades]);
        }
        setOpen(false);
        setEditingGrade(null);
        setFormData({ subject_id: '', marks_obtained: '', total_marks: '', semester: 1 });
    } catch (err) {
        console.error('Failed to save grade', err);
        alert('Failed to save grade');
    } finally {
        setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingGrade(null);
    setFormData({ subject_id: '', marks_obtained: '', total_marks: '', semester: 1 });
    setOpen(true);
  };

  const openEditModal = (grade) => {
    setEditingGrade(grade._id);
    setFormData({ 
        subject_id: grade.subject_id._id, 
        marks_obtained: grade.marks_obtained, 
        total_marks: grade.total_marks, 
        semester: grade.semester || 1 
    });
    setOpen(true);
  };

  const calculateSGPA = () => {
      if (grades.length === 0) return 0.0;
      const totalPoints = grades.reduce((acc, g) => acc + (g.percentage / 10), 0);
      return (totalPoints / grades.length).toFixed(1);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Mesh Gradient Background */}
      <Box sx={{ 
          position: 'absolute', top: -100, left: -100, right: -100, height: 400, 
          background: 'radial-gradient(circle at 70% 20%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(192, 132, 252, 0.1) 0%, transparent 50%)',
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
                Academic Grades
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '1.05rem', fontWeight: 500 }}>
                Overview of your performance and grade results across all subjects.
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Paper sx={{ 
                px: 3, 
                py: 2, 
                borderRadius: '20px', 
                background: 'rgba(255, 255, 255, 0.02)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(74, 222, 128, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minWidth: 120,
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
                <Typography sx={{ color: '#4ade80', fontWeight: 900, fontSize: '0.75rem', letterSpacing: 1.5, mb: 0.5 }}>SGPA</Typography>
                <Typography sx={{ color: '#f8fafc', fontWeight: 900, fontSize: '2rem', lineHeight: 1, letterSpacing: -1.5 }}>{calculateSGPA()}</Typography>
            </Paper>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={openAddModal}
                sx={{ 
                    borderRadius: '16px', 
                    background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', 
                    color: '#fff', 
                    fontWeight: 900, 
                    py: 2,
                    px: 4,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 15px 35px -5px rgba(56,189,248,0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 20px 45px -5px rgba(56,189,248,0.6)' }
                }}
            >
                Log New Result
            </Button>
        </Box>
      </Box>

      <Paper sx={{ 
        borderRadius: '32px', 
        bgcolor: 'rgba(255, 255, 255, 0.01)', 
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 40px 80px -20px rgba(0,0,0,0.7)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
        <Grid container spacing={3} sx={{ p: 4 }}>
            {grades.length > 0 ? grades.map((g) => (
              <Grid item xs={12} sm={6} md={4} key={g._id}>
                <Paper 
                  sx={{ 
                    p: 4, 
                    borderRadius: '28px', 
                    bgcolor: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    '&:hover': { 
                        bgcolor: 'rgba(255, 255, 255, 0.06)',
                        borderColor: 'rgba(56, 189, 248, 0.4)',
                        transform: 'translateY(-10px)',
                        boxShadow: '0 30px 60px -15px rgba(0,0,0,0.6)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        <Box sx={{ p: 1.5, borderRadius: '12px', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(56, 189, 248, 0.05))', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)', display: 'flex', boxShadow: '0 5px 15px rgba(56, 189, 248, 0.2)' }}>
                            <AssessmentIcon sx={{ fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ color: '#f8fafc', fontWeight: 900, fontSize: '1.1rem', letterSpacing: -0.5 }}>{g.subject_id?.subject_name}</Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Semester {g.semester}</Typography>
                        </Box>
                    </Box>
                    <IconButton size="small" onClick={() => openEditModal(g)} sx={{ color: '#475569', '&:hover': { color: '#38bdf8', transform: 'rotate(90deg)' }, transition: 'all 0.3s' }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 4 }}>
                    <Box>
                        <Typography sx={{ color: '#475569', fontSize: '0.75rem', fontWeight: 900, letterSpacing: 1.5, mb: 0.5 }}>ACADEMIC SCORE</Typography>
                        <Typography sx={{ color: '#f8fafc', fontWeight: 900, fontSize: '1.5rem', letterSpacing: -1 }}>
                            {g.marks_obtained} <Typography component="span" sx={{ color: '#475569', fontSize: '1rem', fontWeight: 700 }}>/ {g.total_marks}</Typography>
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Chip 
                            label={g.grade_letter} 
                            sx={{ 
                                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                                color: 'white',
                                fontWeight: 900,
                                fontSize: '1.1rem',
                                height: 40,
                                minWidth: 50,
                                borderRadius: '12px',
                                boxShadow: '0 5px 15px rgba(56, 189, 248, 0.4)'
                            }} 
                        />
                        <Typography sx={{ color: '#4ade80', fontWeight: 900, fontSize: '0.95rem', mt: 1.5, letterSpacing: 0.5 }}>{g.percentage}%</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            )) : (
              <Grid item xs={12}>
                <Box sx={{ py: 15, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.2 }}>
                  <AssessmentIcon sx={{ fontSize: 100, color: 'white', mb: 2 }} />
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 900 }}>No results logged</Typography>
                  <Typography sx={{ color: '#64748b', mt: 1, fontWeight: 500 }}>Start tracking your academic journey today.</Typography>
                </Box>
              </Grid>
            )}
        </Grid>
      </Paper>

      {/* Modern Dialogs */}
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '32px', width: { xs: '92%', sm: 480 }, maxWidth: 'none', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8)' } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 900, fontSize: '1.5rem', pt: 4, px: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: '12px', background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color: 'white', display: 'flex', boxShadow: '0 10px 20px rgba(56,189,248,0.3)' }}>
                {editingGrade ? <EditIcon /> : <PostAddIcon />}
            </Box>
            {editingGrade ? 'Edit Result' : 'Log Result'}
        </DialogTitle>
        <DialogContent sx={{ px: 4, pb: 1 }}>
            <Typography sx={{ color: '#94a3b8', fontSize: '1rem', mb: 4, fontWeight: 500 }}>
                Enter your assessment details to recalculate your cumulative SGPA.
            </Typography>
            <TextField
                select
                fullWidth
                label="Subject"
                value={formData.subject_id}
                onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#64748b' } }}
            >
                {subjects.map(sub => (
                    <MenuItem key={sub._id} value={sub._id} sx={{ fontWeight: 600 }}>{sub.subject_name}</MenuItem>
                ))}
            </TextField>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    type="number"
                    fullWidth
                    label="Obtained"
                    value={formData.marks_obtained}
                    onChange={(e) => setFormData({ ...formData, marks_obtained: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#64748b' } }}
                />
                <TextField
                    type="number"
                    fullWidth
                    label="Total"
                    value={formData.total_marks}
                    onChange={(e) => setFormData({ ...formData, total_marks: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#64748b' } }}
                />
            </Box>
            <TextField
                type="number"
                fullWidth
                label="Semester"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#64748b' } }}
            />
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: '#94a3b8', fontWeight: 900 }}>CANCEL</Button>
            <Button 
                variant="contained" 
                onClick={handleSaveGrade} 
                disabled={saving || !formData.subject_id || !formData.marks_obtained}
                startIcon={saving && <CircularProgress size={20} />}
                sx={{ borderRadius: '16px', background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color: 'white', fontWeight: 900, px: 4, py: 1.5, boxShadow: '0 10px 20px rgba(56,189,248,0.3)' }}
            >
                {saving ? 'SAVING...' : 'CONFIRM RESULT'}
            </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GradesList;
