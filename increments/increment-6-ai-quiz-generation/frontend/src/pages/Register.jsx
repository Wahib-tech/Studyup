import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Grid, InputAdornment, IconButton } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MenuItem from '@mui/material/MenuItem';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';


const Register = () => {
  const [f, setF] = useState({ username: '', email: '', password: '', first_name: '', last_name: '', role: 'student' });

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isRegisterSuccess, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  /* Manual navigation to pass OTP if email fails */
  const onSubmit = (e) => { 
    e.preventDefault(); 
    dispatch(register(f)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/verify-otp', { state: { email: f.email, otp: result.payload?.otp } });
      }
    }); 
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#0f172a' }}>
      <Grid container sx={{ flex: 1 }}>
        {/* Left Side - Visual */}
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
             <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, letterSpacing: -1.5, background: 'linear-gradient(90deg, #38bdf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Join StudyUp</Typography>
             
             <Box sx={{ maxWidth: 450, mt: 4 }}>
                <Typography variant="h5" sx={{ fontStyle: 'italic', fontWeight: 400, color: '#e2e8f0', lineHeight: 1.6, mb: 2 }}>
                  "The beautiful thing about learning is that nobody can take it away from you."
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#c084fc', fontWeight: 700, letterSpacing: 1 }}>— B.B. King</Typography>
             </Box>

             <Box sx={{ width: 60, height: 4, bgcolor: '#38bdf8', mx: 'auto', mt: 6, borderRadius: 2 }} />
           </Box>
           <Box sx={{ position: 'absolute', top: -50, left: -50, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)' }} />
        </Grid>

        {/* Right Side - Form */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, md: 10 } }}>
          <Box sx={{ maxWidth: 450, width: '100%', textAlign: 'left' }}>
            <Box sx={{ mb: 6, textAlign: 'left' }}>
              <img src="/assets/logo.png" alt="StudyUp Logo" style={{ height: 80, objectFit: 'contain', borderRadius: '8px' }} />
            </Box>
            
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 800, color: '#f8fafc', letterSpacing: -0.5 }}>Create Account</Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#94a3b8' }}>Get started with your personalized learning assistant.</Typography>
            
            <form onSubmit={onSubmit}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    label="First Name" 
                    variant="outlined"
                    value={f.first_name} 
                    onChange={(e) => setF({...f, first_name: e.target.value})} 
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 3,
                        bgcolor: '#1e293b',
                        color: '#f8fafc',
                        '& fieldset': { borderColor: '#334155' },
                        '&:hover fieldset': { borderColor: '#38bdf8' },
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    fullWidth 
                    label="Last Name" 
                    variant="outlined"
                    value={f.last_name} 
                    onChange={(e) => setF({...f, last_name: e.target.value})} 
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 3,
                        bgcolor: '#1e293b',
                        color: '#f8fafc',
                        '& fieldset': { borderColor: '#334155' },
                        '&:hover fieldset': { borderColor: '#38bdf8' },
                      },
                      '& .MuiInputLabel-root': { color: '#94a3b8' },
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mb: 2 }}>
                <TextField 
                  fullWidth 
                  label="Username" 
                  variant="outlined"
                  value={f.username} 
                  onChange={(e) => setF({...f, username: e.target.value})} 
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: '#38bdf8' }} /></InputAdornment>,
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      bgcolor: '#1e293b',
                      color: '#f8fafc',
                      '& fieldset': { borderColor: '#334155' },
                      '&:hover fieldset': { borderColor: '#38bdf8' },
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' },
                  }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField 
                  fullWidth 
                  label="Email" 
                  variant="outlined"
                  value={f.email} 
                  onChange={(e) => setF({...f, email: e.target.value})} 
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: '#38bdf8' }} /></InputAdornment>,
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      bgcolor: '#1e293b',
                      color: '#f8fafc',
                      '& fieldset': { borderColor: '#334155' },
                      '&:hover fieldset': { borderColor: '#38bdf8' },
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' },
                  }}
                />
              </Box>

              {/* Role selection removed, default is student */}

              <Box sx={{ mb: 4 }}>
                <TextField 
                  fullWidth 
                  label="Password" 
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'} 
                  value={f.password} 
                  onChange={(e) => setF({...f, password: e.target.value})} 
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#38bdf8' }} /></InputAdornment>,
                    endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
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
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' },
                  }}
                />
              </Box>

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
                    bgcolor: '#c084fc',
                    color: '#0f172a',
                    boxShadow: '0 4px 14px 0 rgba(192, 132, 252, 0.39)',
                    '&:hover': { bgcolor: '#d8b4fe', boxShadow: '0 6px 20px rgba(192, 132, 252, 0.5)' },
                    mb: 4
                }}
              >
                Create Account
              </Button>
              
              <Typography variant="body2" align="center" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                Already have an account? <Link to="/login" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 700 }}>Login</Link>
              </Typography>
              {isError && <Typography color="error" align="center" sx={{ mt: 2, fontWeight: 600 }}>{message}</Typography>}
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Register;
