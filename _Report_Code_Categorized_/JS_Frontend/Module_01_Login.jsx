import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Grid, Checkbox, FormControlLabel, InputAdornment, IconButton } from '@mui/material';
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
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#0f172a' }}>
      <Grid container sx={{ flex: 1 }}>
        {/* Left Side - Form */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, md: 10 } }}>
          <Box sx={{ maxWidth: 400, width: '100%', textAlign: 'left' }}>
            <Box sx={{ mb: 6, textAlign: 'left' }}>
              <img src="/assets/logo.png" alt="StudyUp Logo" style={{ height: 90, objectFit: 'contain', borderRadius: '8px' }} />
            </Box>
            
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 800, color: '#f8fafc', letterSpacing: -0.5 }}>Login</Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#94a3b8' }}>Welcome back! Use your credentials to access the platform.</Typography>

            <form onSubmit={onSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField 
                  fullWidth 
                  label="Email or Username"
                  variant="outlined"
                  placeholder="name@example.com"
                  value={u} 
                  onChange={(e) => setU(e.target.value)} 
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon sx={{ color: '#38bdf8' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      bgcolor: '#1e293b',
                      color: '#f8fafc',
                      '& fieldset': { borderColor: '#334155' },
                      '&:hover fieldset': { borderColor: '#38bdf8' },
                      '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <TextField 
                  fullWidth 
                  label="Password"
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="**********"
                  value={p} 
                  onChange={(e) => setP(e.target.value)} 
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: '#38bdf8' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                          sx={{ color: '#94a3b8' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      bgcolor: '#1e293b',
                      color: '#f8fafc',
                      '& fieldset': { borderColor: '#334155' },
                      '&:hover fieldset': { borderColor: '#38bdf8' },
                      '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#38bdf8' },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <FormControlLabel
                  control={<Checkbox size="small" sx={{ color: '#334155', '&.Mui-checked': { color: '#38bdf8' } }} />}
                  label={<Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>Remember Me</Typography>}
                />
                <Link to="#" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700 }}>Forgot Password?</Link>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Button 
                    fullWidth 
                    variant="contained" 
                    type="submit"
                    sx={{ 
                        borderRadius: 3, 
                        py: 1.8, 
                        textTransform: 'none', 
                        fontWeight: 800, 
                        fontSize: '1rem',
                        bgcolor: '#38bdf8',
                        color: '#0f172a',
                        boxShadow: '0 4px 14px 0 rgba(56, 189, 248, 0.39)',
                        '&:hover': { bgcolor: '#7dd3fc', boxShadow: '0 6px 20px rgba(56, 189, 248, 0.5)' }
                    }}
                >
                    Login to Dashboard
                </Button>
                
                <Box sx={{ mt: 3, textAlign: 'center', position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', bgcolor: '#334155', zIndex: 0 }} />
                  <Typography variant="caption" sx={{ color: '#94a3b8', px: 2, bgcolor: '#0f172a', position: 'relative', zIndex: 1, fontWeight: 600 }}>OR</Typography>
                </Box>

                <Button 
                    fullWidth 
                    variant="outlined" 
                    component={Link}
                    to="/register"
                    sx={{ 
                        mt: 1,
                        borderRadius: 3, 
                        py: 1.6, 
                        textTransform: 'none', 
                        fontWeight: 800,
                        fontSize: '1rem',
                        borderColor: '#c084fc',
                        color: '#c084fc',
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2, borderColor: '#d8b4fe', color: '#d8b4fe', bgcolor: 'rgba(192, 132, 252, 0.05)' }
                    }}
                >
                    CREATE NEW ACCOUNT
                </Button>
              </Box>

              {isError && <Typography color="error" align="center" sx={{ mt: 3, fontWeight: 600 }}>{message}</Typography>}
            </form>
          </Box>
        </Grid>

        {/* Right Side - Visual */}
        <Grid item xs={false} md={6} sx={{ 
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            p: 8,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
           <Box sx={{ position: 'relative', zIndex: 1 }}>
             <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, letterSpacing: -1.5, background: 'linear-gradient(90deg, #38bdf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>StudyUp</Typography>
             
             <Box sx={{ maxWidth: 450, mt: 4 }}>
                <Typography variant="h5" sx={{ fontStyle: 'italic', fontWeight: 400, color: '#e2e8f0', lineHeight: 1.6, mb: 2 }}>
                  "Success is not final, failure is not fatal: it is the courage to continue that counts."
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#38bdf8', fontWeight: 700, letterSpacing: 1 }}>— Winston Churchill</Typography>
             </Box>

             <Box sx={{ width: 60, height: 4, bgcolor: '#c084fc', mx: 'auto', mt: 6, borderRadius: 2 }} />
             
             <Typography variant="body1" sx={{ mt: 4, opacity: 0.8, color: '#94a3b8', fontWeight: 500 }}>
                Master your future with AI-powered study tools.
             </Typography>
           </Box>
           
           {/* Decorative elements */}
           <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)' }} />
           <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%)' }} />
           <Box sx={{ position: 'absolute', top: '20%', left: '10%', width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default Login;
