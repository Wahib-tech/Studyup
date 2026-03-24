import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Grid, Checkbox, FormControlLabel, InputAdornment, IconButton, Paper, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/dashboard');
    if (isError && message === 'Please verify your email first') {
        navigate('/verify-otp', { state: { email: u } });
    }
  }, [user, isError, message, navigate, u]);

  const onSubmit = (e) => { 
    e.preventDefault(); 
    dispatch(login({ username: u, password: p })); 
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
        background: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 50%), radial-gradient(circle at 10% 10%, rgba(192, 132, 252, 0.05) 0%, transparent 40%)',
        filter: 'blur(80px)',
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
            {/* Left Side - Login Form */}
            <Grid item xs={12} md={6} sx={{ p: { xs: 4, md: 8 }, borderRight: { md: '1px solid rgba(255,255,255,0.05)' } }}>
              <Box sx={{ mb: 6 }}>
                <img src="/assets/logo.png" alt="StudyUp Logo" style={{ height: 60, objectFit: 'contain' }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5, color: '#f8fafc', letterSpacing: -1.5 }}>Welcome Back</Typography>
              <Typography variant="body1" sx={{ mb: 6, color: '#94a3b8', fontWeight: 500 }}>Access your AI-powered learning workspace.</Typography>

              <form onSubmit={onSubmit}>
                <Box sx={{ mb: 3 }}>
                  <TextField 
                    fullWidth 
                    label="Email or Username"
                    variant="outlined"
                    value={u} 
                    onChange={(e) => setU(e.target.value)} 
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: '#38bdf8' }} /></InputAdornment>,
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#38bdf8' } },
                      '& .MuiInputLabel-root': { color: '#64748b' }
                    }}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <TextField 
                    fullWidth 
                    label="Password"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'} 
                    value={p} 
                    onChange={(e) => setP(e.target.value)} 
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#38bdf8' }} /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#475569' }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#38bdf8' } },
                      '& .MuiInputLabel-root': { color: '#64748b' }
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
                  <FormControlLabel
                    control={<Checkbox size="small" sx={{ color: '#334155', '&.Mui-checked': { color: '#38bdf8' } }} />}
                    label={<Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Remember Me</Typography>}
                  />
                  <Link to="/forgot-password" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 800 }}>Forgot Password?</Link>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                      fullWidth 
                      variant="contained" 
                      type="submit"
                      sx={{ 
                          borderRadius: 3, py: 2, 
                          textTransform: 'none', fontWeight: 900, 
                          fontSize: '1rem', bgcolor: '#38bdf8', color: '#0f172a',
                          boxShadow: '0 8px 25px rgba(56, 189, 248, 0.3)',
                          '&:hover': { bgcolor: '#7dd3fc', transform: 'translateY(-2px)' }
                      }}
                  >
                      Sign In
                  </Button>
                  
                  <Button 
                      fullWidth 
                      variant="outlined" 
                      component={Link}
                      to="/register"
                      sx={{ 
                          borderRadius: 3, py: 2, 
                          textTransform: 'none', fontWeight: 900,
                          fontSize: '1rem', borderColor: 'rgba(255,255,255,0.1)',
                          color: '#f8fafc',
                          '&:hover': { borderColor: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.05)', transform: 'translateY(-2px)' }
                      }}
                  >
                      Register
                  </Button>
                </Box>

                {isError && <Typography color="error" align="center" sx={{ mt: 3, fontWeight: 600 }}>{message}</Typography>}
              </form>
            </Grid>

            {/* Right Side - Value Proposition Feature Grid */}
            <Grid item xs={false} md={6} sx={{ 
                bgcolor: 'rgba(0,0,0,0.2)',
                p: { xs: 4, md: 8 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
               <Box sx={{ width: '100%', maxWidth: 420 }}>
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
                        { title: 'AI Quizzes', desc: 'Generated just for you', icon: '⚡', color: '#38bdf8' },
                        { title: 'Smart Tracking', desc: 'Monitor your progress', icon: '📊', color: '#c084fc' },
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
export default Login;
