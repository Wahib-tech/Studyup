import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp, reset } from '../features/auth/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Grid, InputAdornment } from '@mui/material';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const { user, isVerifySuccess, isError, message } = useSelector((state) => state.auth);
  const [receivedOtp, setReceivedOtp] = useState(location.state?.otp);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (isVerifySuccess || user) {
      navigate('/dashboard');
    } else if (!email) {
      navigate('/register');
    }
  }, [user, isVerifySuccess, navigate, email]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ email, otp: otp || receivedOtp }));
  };

  const handleResend = (e) => {
    e.preventDefault();
    if (email) dispatch(resendOtp({ email }));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default', overflow: 'hidden' }}>
      <Grid container sx={{ flex: 1 }}>
        {/* Left Side - Form */}
        <Grid item xs={12} md={5} lg={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, md: 8, lg: 10 }, bgcolor: '#020617', zIndex: 2, boxShadow: '20px 0 50px rgba(0,0,0,0.5)' }}>
          <Box sx={{ maxWidth: 400, width: '100%', textAlign: 'left' }}>
            <Box sx={{ mb: 6, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 2 }}>
              <img src="/assets/logo.png" alt="StudyUp Logo" style={{ height: 55, objectFit: 'contain', borderRadius: '10px', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }} />
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'white', letterSpacing: -1 }}>StudyUp</Typography>
            </Box>
            
            <Typography variant="h3" sx={{ mb: 1, fontWeight: 900, color: '#f8fafc', letterSpacing: -2, background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Verify Identity</Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontWeight: 500, fontSize: '1.1rem' }}>
              We've sent a 6-digit verification code to <br/><b style={{ color: '#6366f1' }}>{email}</b>.
            </Typography>

            {receivedOtp && (
              <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(99, 102, 241, 0.05)', border: '1px dashed rgba(99, 102, 241, 0.3)', borderRadius: '16px' }}>
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, textAlign: 'center' }}>
                  DEVELOPER ACCESS: <span style={{ fontSize: '1.4rem', letterSpacing: 4, color: '#fff', marginLeft: 10 }}>{receivedOtp}</span>
                </Typography>
              </Box>
            )}
            
            <form onSubmit={onSubmit}>
              <Box sx={{ mb: 4 }}>
                <TextField 
                  fullWidth 
                  label="6-Digit Verification Code"
                  variant="outlined"
                  placeholder="000000"
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MarkEmailReadOutlinedIcon sx={{ color: 'secondary.main' }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '16px', letterSpacing: 8, fontWeight: 900, fontSize: '1.2rem', color: '#f8fafc' }
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                      '&:hover fieldset': { borderColor: 'secondary.main' },
                      '&.Mui-focused fieldset': { borderColor: 'secondary.main' },
                    },
                    '& .MuiInputLabel-root': { color: 'text.secondary', letterSpacing: 0 },
                    '& .MuiInputLabel-root.Mui-focused': { color: 'secondary.main' },
                  }}
                />
              </Box>

              <Button 
                fullWidth 
                variant="contained" 
                type="submit"
                sx={{ 
                    borderRadius: '16px', 
                    py: 2, 
                    fontWeight: 900,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    boxShadow: '0 10px 30px -5px rgba(6, 182, 212, 0.5)',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 35px -5px rgba(6, 182, 212, 0.6)' },
                    mb: 5
                }}
              >
                Verify & Unlock Dashboard
              </Button>
              
              <Typography variant="body2" align="center" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Didn't receive the code? <Link onClick={handleResend} style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 900, cursor: 'pointer', letterSpacing: 0.5 }}>RESEND NEW CODE</Link>
              </Typography>
              {(isError || message) && <Typography color={isError ? "error" : "primary"} align="center" sx={{ mt: 3, fontWeight: 700, fontSize: '0.9rem' }}>{message}</Typography>}
            </form>
          </Box>
        </Grid>

        {/* Right Side - Visual */}
        <Grid item xs={false} md={7} lg={8} sx={{ 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            bgcolor: '#020617'
        }}>
            {/* Mesh Gradient Background */}
            <Box sx={{ 
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: `
                    radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 30% 70%, rgba(192, 132, 252, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 70%)
                `,
                filter: 'blur(80px)',
                zIndex: 0
            }} />

           <Box sx={{ position: 'relative', zIndex: 1, p: 8, textAlign: 'center' }}>
             <Typography variant="h1" sx={{ 
                 fontWeight: 900, mb: 4, letterSpacing: -4, 
                 background: 'linear-gradient(135deg, #f8fafc 0%, #64748b 100%)', 
                 WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                 fontSize: { md: '5rem', lg: '7rem' },
                 lineHeight: 1
             }}>Security</Typography>
             
             <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6 }}>
                <Typography variant="h4" sx={{ 
                    fontWeight: 400, color: '#e2e8f0', lineHeight: 1.5, mb: 4,
                    fontStyle: 'italic', opacity: 0.9, letterSpacing: -0.5
                }}>
                  "Intelligence plus character—that is the goal of true education."
                </Typography>
                <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.9rem', opacity: 0.8 }}>
                  — Martin Luther King Jr.
                </Typography>
             </Box>

             <Box sx={{ width: 100, height: 4, bgcolor: 'secondary.main', mx: 'auto', mt: 8, borderRadius: 2, background: 'linear-gradient(90deg, #06b6d4, #6366f1)' }} />
           </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VerifyOtp;
