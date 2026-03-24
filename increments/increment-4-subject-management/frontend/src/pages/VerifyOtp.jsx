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
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#0f172a' }}>
      <Grid container sx={{ flex: 1 }}>
        {/* Left Side - Form */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, md: 10 } }}>
          <Box sx={{ maxWidth: 400, width: '100%', textAlign: 'left' }}>
            <Box sx={{ mb: 6, textAlign: 'left' }}>
              <img src="/assets/logo.png" alt="StudyUp Logo" style={{ height: 80, objectFit: 'contain', borderRadius: '8px' }} />
            </Box>
            
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 800, color: '#f8fafc', letterSpacing: -0.5 }}>Verify Email</Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#94a3b8' }}>
              We've sent a 6-digit verification code to <br/><b style={{ color: '#38bdf8' }}>{email}</b>.
            </Typography>

            {receivedOtp && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(56, 189, 248, 0.1)', border: '1px dashed #38bdf8', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: '#38bdf8', fontWeight: 600 }}>
                  Development Mode: Your OTP is: <span style={{ fontSize: '1.2rem', letterSpacing: 2, color: '#fff' }}>{receivedOtp}</span>
                </Typography>
              </Box>
            )}
            
            <form onSubmit={onSubmit}>
              <Box sx={{ mb: 4 }}>
                <TextField 
                  fullWidth 
                  label="Verification Code"
                  variant="outlined"
                  placeholder="000000"
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MarkEmailReadOutlinedIcon sx={{ color: '#38bdf8' }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, letterSpacing: 4, fontWeight: 900, color: '#f8fafc' }
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      bgcolor: '#1e293b',
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
                    bgcolor: '#38bdf8',
                    color: '#0f172a',
                    boxShadow: '0 4px 14px 0 rgba(56, 189, 248, 0.39)',
                    '&:hover': { bgcolor: '#7dd3fc', boxShadow: '0 6px 20px rgba(56, 189, 248, 0.5)' },
                    mb: 4
                }}
              >
                Verify & Continue
              </Button>
              
              <Typography variant="body2" align="center" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                Didn't receive the code? <Link onClick={handleResend} style={{ color: '#c084fc', textDecoration: 'none', fontWeight: 700, cursor: 'pointer' }}>Resend code</Link>
              </Typography>
              {(isError || message) && <Typography color={isError ? "error" : "primary"} align="center" sx={{ mt: 3, fontWeight: 600 }}>{message}</Typography>}
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
             <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, letterSpacing: -1.5 }}>Secure Access</Typography>
             
             <Box sx={{ maxWidth: 450, mt: 4 }}>
                <Typography variant="h5" sx={{ fontStyle: 'italic', fontWeight: 400, color: '#e2e8f0', lineHeight: 1.6, mb: 2 }}>
                  "Intelligence plus character—that is the goal of true education."
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#38bdf8', fontWeight: 700, letterSpacing: 1 }}>— Martin Luther King Jr.</Typography>
             </Box>
             
             <Box sx={{ width: 60, height: 4, bgcolor: '#c084fc', mx: 'auto', mt: 6, borderRadius: 2 }} />
           </Box>
           <Box sx={{ position: 'absolute', bottom: -50, right: -50, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%)' }} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default VerifyOtp;
