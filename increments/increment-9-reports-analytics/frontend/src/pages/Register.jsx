import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Grid, InputAdornment, IconButton, Paper, Container, Fade, Zoom } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const Register = () => {
  const [f, setF] = useState({ username: '', email: '', password: '', first_name: '', last_name: '', role: 'student' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isRegisterSuccess, isError, message } = useSelector((state) => state.auth);

  const onSubmit = (e) => { 
    e.preventDefault(); 
    dispatch(register(f)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/verify-otp', { state: { email: f.email, otp: result.payload?.otp } });
      }
    }); 
  };

  return (
    <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#020617',
        position: 'relative',
        overflow: 'hidden',
        py: 4
    }}>
      {/* Mesh Background */}
      <Box sx={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(6, 182, 212, 0.15) 0%, transparent 40%)',
        filter: 'blur(100px)',
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper sx={{ 
            borderRadius: '40px',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 80px -20px rgba(0,0,0,0.6)'
        }}>
          <Grid container>
            {/* Left Side: Registration Form */}
            <Grid item xs={12} md={6} sx={{ p: { xs: 4, md: 8 }, borderRight: { md: '1px solid rgba(255,255,255,0.05)' } }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5, color: '#f8fafc', letterSpacing: -1.5 }}>Create Account</Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8', fontWeight: 500 }}>Join StudyUp and start your journey.</Typography>
              </Box>

              <form onSubmit={onSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField 
                      fullWidth 
                      label="First Name" 
                      value={f.first_name} 
                      onChange={(e) => setF({...f, first_name: e.target.value})} 
                      sx={{ 
                        '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
                        '& .MuiInputLabel-root': { color: '#64748b' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField 
                      fullWidth 
                      label="Last Name" 
                      value={f.last_name} 
                      onChange={(e) => setF({...f, last_name: e.target.value})} 
                      sx={{ 
                        '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
                        '& .MuiInputLabel-root': { color: '#64748b' }
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <TextField 
                    fullWidth 
                    label="Username" 
                    value={f.username} 
                    onChange={(e) => setF({...f, username: e.target.value})} 
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: '#6366f1' }} /></InputAdornment>,
                    }}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
                      '& .MuiInputLabel-root': { color: '#64748b' }
                    }}
                  />

                  <TextField 
                    fullWidth 
                    label="Email Address" 
                    value={f.email} 
                    onChange={(e) => setF({...f, email: e.target.value})} 
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: '#06b6d4' }} /></InputAdornment>,
                    }}
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
                      '& .MuiInputLabel-root': { color: '#64748b' }
                    }}
                  />

                  <TextField 
                    fullWidth 
                    label="Password" 
                    type={showPassword ? 'text' : 'password'} 
                    value={f.password} 
                    onChange={(e) => setF({...f, password: e.target.value})} 
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#6366f1' }} /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#475569' }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{ 
                      mb: 4,
                      '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
                      '& .MuiInputLabel-root': { color: '#64748b' }
                    }}
                  />
                </Box>

                <Button 
                  fullWidth 
                  variant="contained" 
                  type="submit"
                  sx={{ 
                    py: 2, borderRadius: 3,
                    fontSize: '1.1rem', fontWeight: 900,
                    boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
                    '&:hover': { transform: 'translateY(-2px)', bgcolor: '#7dd3fc' }
                  }}
                >
                  Create My Account
                </Button>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 800 }}>
                      Login here
                    </Link>
                  </Typography>
                </Box>

                {isError && (
                  <Fade in>
                    <Typography color="error" align="center" sx={{ mt: 3, fontWeight: 600 }}>
                      {message}
                    </Typography>
                  </Fade>
                )}
              </form>
            </Grid>

            {/* Right Side: Features Grid */}
            <Grid item xs={false} md={6} sx={{ 
                bgcolor: 'rgba(0,0,0,0.2)',
                p: { xs: 4, md: 8 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Box sx={{ width: '100%', maxWidth: 420 }}>
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                            p: 1.5, borderRadius: '16px', 
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 0 20px rgba(99,102,241,0.2)'
                        }}>
                            <img src="/assets/logo.png" alt="StudyUp Logo" style={{ height: 32, width: 'auto' }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'white', letterSpacing: -1 }}>StudyUp<span style={{ color: '#6366f1' }}>.</span></Typography>
                    </Box>

                    <Typography variant="h3" sx={{ 
                        fontWeight: 900, mb: 1, letterSpacing: -2, 
                        background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', 
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>Join the Future<br/>of Learning.</Typography>

                    <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500, mb: 8, lineHeight: 1.6 }}>
                        Experience AI-driven personalized education that adapts to your unique learning style.
                    </Typography>

                    <Grid container spacing={3}>
                        {[
                            { title: 'AI Quizzes', desc: 'Generated just for you', icon: '⚡', color: '#6366f1' },
                            { title: 'Smart Tracking', desc: 'Monitor your progress', icon: '📊', color: '#06b6d4' },
                            { title: 'Goal Manager', desc: 'Stay on top of tasks', icon: '🎯', color: '#4ade80' }
                        ].map((f, i) => (
                            <Grid item xs={12} key={i}>
                                <Box sx={{ 
                                    p: 3, borderRadius: '24px', 
                                    bgcolor: 'rgba(255,255,255,0.02)', 
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex', alignItems: 'center', gap: 3,
                                    transition: 'all 0.3s',
                                    '&:hover': { transform: 'translateX(10px)', bgcolor: 'rgba(255,255,255,0.04)', borderColor: `${f.color}40` }
                                }}>
                                    <Box sx={{ 
                                        width: 48, height: 48, borderRadius: '12px', 
                                        bgcolor: `${f.color}10`, color: f.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem', boxShadow: `0 0 20px ${f.color}10`
                                    }}>{f.icon}</Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 900, color: '#f8fafc', fontSize: '1.1rem' }}>{f.title}</Typography>
                                        <Typography sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>{f.desc}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
