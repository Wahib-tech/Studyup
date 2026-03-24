import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableHead, TableRow, Chip, Avatar, IconButton, 
  Button, TextField, InputAdornment, Dialog, DialogTitle, 
  DialogContent, DialogActions, Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSelector } from 'react-redux';

const StudentList = () => {
  const { user } = useSelector((state) => state.auth);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ username: '', email: '', first_name: '', last_name: '', password: 'Password123!', role: 'student' });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get('/api/students', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setStudents(data);
      } catch (err) {
        console.error('Failed to fetch students', err);
      }
    };
    fetchStudents();
  }, [user.token]);

  const handleRegister = async () => {
    try {
      await axios.post('/api/auth/register', newStudent);
      setOpen(false);
      // Refresh list
      const { data } = await axios.get('/api/students', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setStudents(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register student');
    }
  };

  const handleViewDetails = async (student) => {
    try {
      const { data } = await axios.get(`/api/students/${student._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSelectedStudent(data);
      setDetailsOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStudents = students.filter(s => 
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#f8fafc', mb: 1, letterSpacing: -1 }}>
            Student Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            {user?.role === 'admin' ? 'Admin Panel: View progress and manage students.' : 'Student Directory'}
          </Typography>
        </Box>
        {user?.role === 'admin' && (
          <Button 
            variant="contained" 
            startIcon={<PersonAddIcon />}
            onClick={() => setOpen(true)}
            sx={{ 
              borderRadius: 3, 
              bgcolor: '#38bdf8', 
              color: '#0f172a', 
              fontWeight: 800, 
              px: 3,
              '&:hover': { bgcolor: '#7dd3fc' }
            }}
          >
            Register Student
          </Button>
        )}
      </Box>

      <Paper sx={{ 
        borderRadius: '24px', 
        bgcolor: 'background.paper', 
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 50px -20px rgba(0,0,0,0.5)',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 2 }}>
          <TextField 
            size="small"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
              sx: { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.03)', color: 'white', '& fieldset': { border: '1px solid rgba(255,255,255,0.08)' } }
            }}
            sx={{ width: 300 }}
          />
        </Box>

        <Table>
          <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
            <TableRow>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>STUDENT</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>EMAIL</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>STATUS</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)' }} align="right">PROGRESS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((s) => (
              <TableRow key={s._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 800 }}>
                      {s.first_name[0]}{s.last_name[0]}
                    </Avatar>
                    <Typography sx={{ color: '#f8fafc', fontWeight: 600 }}>{s.first_name} {s.last_name}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{s.email}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Chip 
                    label={s.status.toUpperCase()} 
                    size="small"
                    sx={{ 
                      bgcolor: s.status === 'active' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 113, 133, 0.1)',
                      color: s.status === 'active' ? '#4ade80' : '#fb7185',
                      fontWeight: 800,
                      fontSize: '0.65rem'
                    }} 
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} align="right">
                  {user?.role === 'admin' ? (
                    <Button 
                      size="small" 
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDetails(s)}
                      sx={{ color: '#38bdf8', fontWeight: 700, textTransform: 'none' }}
                    >
                      View Progress
                    </Button>
                  ) : (
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Restricted</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Admin Register Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: 'background.paper', color: 'white', borderRadius: 6, minWidth: 450, border: '1px solid rgba(255,255,255,0.1)' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: 'white' }}>Register New Student</DialogTitle>
        <DialogContent sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField 
            fullWidth label="First Name" 
            value={newStudent.first_name} onChange={(e) => setNewStudent({...newStudent, first_name: e.target.value})}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#0f172a', color: 'white' } }}
          />
          <TextField 
            fullWidth label="Last Name" 
            value={newStudent.last_name} onChange={(e) => setNewStudent({...newStudent, last_name: e.target.value})}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#0f172a', color: 'white' } }}
          />
          <TextField 
            fullWidth label="Username" 
            value={newStudent.username} onChange={(e) => setNewStudent({...newStudent, username: e.target.value})}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#0f172a', color: 'white' } }}
          />
          <TextField 
            fullWidth label="Email" 
            value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#0f172a', color: 'white' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#94a3b8', fontWeight: 700 }}>Cancel</Button>
          <Button variant="contained" onClick={handleRegister} sx={{ borderRadius: 3, bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 800 }}>Create Student</Button>
        </DialogActions>
      </Dialog>

      {/* Student Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} PaperProps={{ sx: { bgcolor: 'background.paper', color: 'white', borderRadius: 6, minWidth: 500, border: '1px solid rgba(255,255,255,0.1)' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Student Performance Details</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: '#38bdf8', fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>
                  {selectedStudent.student.first_name[0]}{selectedStudent.student.last_name[0]}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{selectedStudent.student.first_name} {selectedStudent.student.last_name}</Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>{selectedStudent.student.email}</Typography>
                </Box>
              </Box>
              
              <Typography variant="h6" sx={{ color: '#38bdf8', fontWeight: 800, mb: 2, fontSize: '0.9rem' }}>ACADEMIC SUMMARY</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: '#0f172a', borderRadius: 3 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Quizzes Attempted</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedStudent.performances?.length || 0}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: '#0f172a', borderRadius: 3 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Average Score</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {selectedStudent.performances?.length > 0 
                            ? (selectedStudent.performances.reduce((acc, p) => acc + p.percentage, 0) / selectedStudent.performances.length).toFixed(1) + '%'
                            : '0%'
                        }
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ color: '#38bdf8', fontWeight: 800, mb: 2, fontSize: '0.9rem' }}>RECENT QUIZ ACTIVITY</Typography>
                {selectedStudent.performances?.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 250, overflowY: 'auto', pr: 1 }}>
                        {selectedStudent.performances.map((p, i) => (
                            <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.03)' }}>
                                <Box>
                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.quiz_id?.title || 'Quiz Session'}</Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>{new Date(p.attempt_date).toLocaleDateString()}</Typography>
                                </Box>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: p.percentage >= 70 ? '#4ade80' : '#fb7185' }}>{p.percentage}%</Typography>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>No quiz records found.</Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDetailsOpen(false)} sx={{ color: '#38bdf8', fontWeight: 700 }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentList;
