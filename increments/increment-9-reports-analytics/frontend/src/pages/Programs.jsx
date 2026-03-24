import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Paper, Grid, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, CircularProgress,
  List, ListItem, ListItemText, Divider, IconButton,
  Card, CardContent
} from '@mui/material';
import { useSelector } from 'react-redux';
import socket from '../utils/socket';
import ClassIcon from '@mui/icons-material/Class';
import SchoolIcon from '@mui/icons-material/School';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LayersIcon from '@mui/icons-material/Layers';

const Programs = () => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [openCourse, setOpenCourse] = useState(false);
  const [openSection, setOpenSection] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [courseData, setCourseData] = useState({ course_name: '', course_code: '', duration: '' });
  const [sectionData, setSectionData] = useState({ section_name: '', course_id: '', semester: '', academic_year: '' });

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.token) {
        fetchData();
        
        // Real-time socket listeners
        socket.on('courses_changed', fetchData);
        socket.on('sections_changed', fetchData);
    }
    return () => {
        socket.off('courses_changed', fetchData);
        socket.off('sections_changed', fetchData);
    };
  }, [user.token]);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const [resC, resS] = await Promise.all([
          axios.get('/api/courses', { headers }),
          axios.get('/api/courses/sections', { headers })
      ]);
      setCourses(resC.data);
      setSections(resS.data);
    } catch (err) {
      console.error('Failed to fetch programs', err);
    }
  };

  const handleAddCourse = async () => {
    if (!courseData.course_name) return;
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.post('/api/courses', courseData, { headers });
      setOpenCourse(false);
      setCourseData({ course_name: '', course_code: '', duration: '' });
      fetchData();
    } catch (err) {
      console.error('Failed', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSection = async () => {
    if (!sectionData.section_name || !sectionData.course_id) return;
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.post('/api/courses/sections', sectionData, { headers });
      setOpenSection(false);
      setSectionData({ section_name: '', course_id: '', semester: '', academic_year: '' });
      fetchData();
    } catch (err) {
      console.error('Failed', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure? This will also delete all semesters in this course.")) return;
    try {
      await axios.delete(`/api/courses/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteSection = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/courses/sections/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
      fetchData();
    } catch (err) { console.error(err); }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Mesh Gradient Background */}
      <Box sx={{ 
          position: 'absolute', top: -100, left: -100, right: -100, height: 400, 
          background: 'radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(56, 189, 248, 0.1) 0%, transparent 50%)',
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
                Academic Programs
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '1.05rem', fontWeight: 500 }}>
                Manage your Courses, Degrees, and Semesters.
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
                variant="outlined" 
                startIcon={<AddIcon />} 
                onClick={() => setOpenCourse(true)}
                sx={{ 
                    borderRadius: '16px', 
                    color: '#c084fc', 
                    borderColor: 'rgba(192, 132, 252, 0.3)', 
                    fontWeight: 900, 
                    px: 3, py: 1.5,
                    backdropFilter: 'blur(10px)',
                    '&:hover': { borderColor: '#c084fc', background: 'rgba(192, 132, 252, 0.05)', transform: 'translateY(-2px)' },
                    transition: 'all 0.3s'
                }}
            >
                ADD COURSE
            </Button>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => setOpenSection(true)}
                sx={{ 
                    borderRadius: '16px', 
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                    color: '#fff', 
                    fontWeight: 900, 
                    px: 4, py: 1.5,
                    boxShadow: '0 10px 25px -5px rgba(99,102,241,0.5)',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 35px -5px rgba(99,102,241,0.6)' },
                    transition: 'all 0.3s'
                }}
            >
                NEW SEMESTER
            </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
        <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: '32px', bgcolor: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.6)', minHeight: 550 }}>
                <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 900, mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
                   <Box sx={{ p: 1.5, borderRadius: '12px', background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)', color: 'white', display: 'flex', boxShadow: '0 5px 15px rgba(192,132,252,0.4)' }}>
                     <SchoolIcon sx={{ fontSize: 24 }} />
                   </Box>
                   Available Courses
                </Typography>
                <Grid container spacing={2.5}>
                    {courses.map((c) => (
                        <Grid item xs={12} key={c._id}>
                            <Card sx={{ 
                                bgcolor: 'rgba(255, 255, 255, 0.03)', 
                                borderRadius: '20px', 
                                border: '1px solid rgba(255,255,255,0.05)', 
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
                                '&:hover': { 
                                    transform: 'translateX(10px)', 
                                    borderColor: 'rgba(192, 132, 252, 0.4)', 
                                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                                } 
                            }}>
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '20px !important' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                        <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: 'rgba(192, 132, 252, 0.1)', color: '#c084fc', display: 'flex' }}>
                                            <LibraryBooksIcon />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.1rem' }}>{c.course_name}</Typography>
                                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>{c.course_code || 'No Code'}</Typography>
                                        </Box>
                                    </Box>
                                    <IconButton onClick={() => handleDeleteCourse(c._id)} sx={{ color: '#475569', '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.1)', transform: 'rotate(90deg)' }, transition: 'all 0.3s' }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {courses.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 12, opacity: 0.2 }}>
                        <SchoolIcon sx={{ fontSize: 80, mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>No catalogs yet</Typography>
                    </Box>
                )}
            </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: '32px', bgcolor: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.6)', minHeight: 550 }}>
                <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 900, mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
                   <Box sx={{ p: 1.5, borderRadius: '12px', background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color: 'white', display: 'flex', boxShadow: '0 5px 15px rgba(56,189,248,0.4)' }}>
                     <ClassIcon sx={{ fontSize: 24 }} />
                   </Box>
                   Active Semesters
                </Typography>
                <Grid container spacing={2.5}>
                    {sections.map(s => (
                        <Grid item xs={12} key={s._id}>
                             <Card sx={{ 
                                 bgcolor: 'rgba(255, 255, 255, 0.03)', 
                                 borderRadius: '20px', 
                                 border: '1px solid rgba(255,255,255,0.05)', 
                                 transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
                                 '&:hover': { 
                                     transform: 'translateX(10px)', 
                                     borderColor: 'rgba(56, 189, 248, 0.4)', 
                                     bgcolor: 'rgba(255, 255, 255, 0.05)',
                                     boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                                 } 
                             }}>
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '20px !important' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                        <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', display: 'flex' }}>
                                            <LayersIcon />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.1rem' }}>{s.section_name}</Typography>
                                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Semester {s.semester}</Typography>
                                        </Box>
                                    </Box>
                                    <IconButton onClick={() => handleDeleteSection(s._id)} sx={{ color: '#475569', '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.1)', transform: 'rotate(90deg)' }, transition: 'all 0.3s' }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {sections.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 12, opacity: 0.2 }}>
                        <ClassIcon sx={{ fontSize: 80, mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>No active sections</Typography>
                    </Box>
                )}
            </Paper>
        </Grid>
      </Grid>

      {/* Modals Updated with Premium Look */}
      <Dialog open={openCourse} onClose={() => setOpenCourse(false)} PaperProps={{ sx: { bgcolor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', borderRadius: '32px', width: { xs: '92%', sm: 480 }, maxWidth: 'none', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8)' } }}>
        <DialogTitle sx={{ color: 'white', fontWeight: 900, fontSize: '1.5rem', pt: 4, px: 4 }}>Add New Course</DialogTitle>
        <DialogContent sx={{ px: 4 }}>
            <TextField fullWidth label="Course Name" value={courseData.course_name} onChange={e => setCourseData({...courseData, course_name: e.target.value})} sx={{ mt: 3, mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: 'white', '& fieldset': { border: '1px solid rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#64748b' } }} />
            <TextField fullWidth label="Code" value={courseData.course_code} onChange={e => setCourseData({...courseData, course_code: e.target.value})} sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: 'white', '& fieldset': { border: '1px solid rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#64748b' } }} />
            <TextField fullWidth label="Duration" value={courseData.duration} onChange={e => setCourseData({...courseData, duration: e.target.value})} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(255,255,255,0.03)', color: 'white', '& fieldset': { border: '1px solid rgba(255,255,255,0.1)' } }, '& .MuiInputLabel-root': { color: '#64748b' } }} />
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 2 }}>
            <Button onClick={() => setOpenCourse(false)} sx={{ color: '#94a3b8', fontWeight: 800 }}>CANCEL</Button>
            <Button variant="contained" onClick={handleAddCourse} disabled={saving || !courseData.course_name} sx={{ borderRadius: '16px', background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)', color: '#fff', fontWeight: 900, px: 4, py: 1.5, boxShadow: '0 10px 20px rgba(192,132,252,0.3)' }}>CREATE CATALOG</Button>
        </DialogActions>
      </Dialog>

      {/* Add Section Modal */}
      <Dialog open={openSection} onClose={() => setOpenSection(false)} PaperProps={{ sx: { bgcolor: '#0a0a0a', borderRadius: '24px', width: { xs: '92%', sm: 450 }, maxWidth: 'none', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' } }}>
        <DialogTitle sx={{ color: '#f8fafc', fontWeight: 800 }}>Add Semester/Section</DialogTitle>
        <DialogContent>
            <TextField select fullWidth label="Select Course" value={sectionData.course_id} onChange={e => setSectionData({...sectionData, course_id: e.target.value})} SelectProps={{ native: true }} sx={{ mt: 2, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(15,23,42,0.5)', color: 'white' }, '& .MuiInputLabel-root': { color: '#64748b' } }}>
                <option value=""></option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.course_name}</option>)}
            </TextField>
            <TextField fullWidth label="Section/Group Name (e.g., Section A)" value={sectionData.section_name} onChange={e => setSectionData({...sectionData, section_name: e.target.value})} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(15,23,42,0.5)', color: 'white' }, '& .MuiInputLabel-root': { color: '#64748b' } }} />
            <TextField fullWidth type="number" label="Semester Number" value={sectionData.semester} onChange={e => setSectionData({...sectionData, semester: e.target.value})} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(15,23,42,0.5)', color: 'white' }, '& .MuiInputLabel-root': { color: '#64748b' } }} />
            <TextField fullWidth label="Academic Year (e.g., 2026-2027)" value={sectionData.academic_year} onChange={e => setSectionData({...sectionData, academic_year: e.target.value})} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(15,23,42,0.5)', color: 'white' }, '& .MuiInputLabel-root': { color: '#64748b' } }} />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenSection(false)} sx={{ color: '#94a3b8', fontWeight: 700 }}>Cancel</Button>
            <Button variant="contained" onClick={handleAddSection} disabled={saving || !sectionData.section_name || !sectionData.course_id} sx={{ borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: '#fff', fontWeight: 800, boxShadow: '0 10px 20px -5px rgba(6,182,212,0.4)' }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Programs;
