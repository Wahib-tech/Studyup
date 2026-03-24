import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, reset } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Grid, InputAdornment, Alert } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(reset());
    }, [dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword({ email }));
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#020617', overflow: 'hidden' }}>
            <Grid container sx={{ flex: 1 }}>
                {/* Left Side - Form */}
                <Grid item xs={12} md={5} lg={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, md: 8 }, bgcolor: '#020617', zIndex: 2, boxShadow: '20px 0 50px rgba(0,0,0,0.5)' }}>
                    <Box sx={{ maxWidth: 400, width: '100%', textAlign: 'left' }}>
                        <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <img src="/assets/logo.png" alt="StudyUp Logo" style={{ height: 50, borderRadius: '10px' }} />
                            <Typography variant="h6" sx={{ fontWeight: 900, color: 'white' }}>StudyUp</Typography>
                        </Box>

                        <Typography variant="h3" sx={{ mb: 2, fontWeight: 900, color: 'white', letterSpacing: -2, background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Forgot Password?</Typography>
                        <Typography variant="body1" sx={{ mb: 4, color: '#94a3b8', fontWeight: 500 }}>
                            No worries, we'll send you reset instructions.
                        </Typography>

                        {isSuccess && <Alert severity="success" sx={{ mb: 4, borderRadius: '12px', bgcolor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>{message}</Alert>}
                        {isError && <Alert severity="error" sx={{ mb: 4, borderRadius: '12px', bgcolor: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.2)' }}>{message}</Alert>}

                        <form onSubmit={onSubmit}>
                            <Box sx={{ mb: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    variant="outlined"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailOutlinedIcon sx={{ color: 'primary.main' }} />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: '16px', bgcolor: 'rgba(255, 255, 255, 0.03)', color: 'white' }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                                            '&:hover fieldset': { borderColor: 'primary.main' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                                        },
                                        '& .MuiInputLabel-root': { color: '#64748b' }
                                    }}
                                />
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                disabled={isLoading}
                                sx={{
                                    borderRadius: '16px',
                                    py: 2,
                                    fontWeight: 900,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                    boxShadow: '0 10px 30px -5px rgba(99, 102, 241, 0.5)',
                                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 35px -5px rgba(99, 102, 241, 0.6)' },
                                    mb: 4
                                }}
                            >
                                {isLoading ? 'Sending Link...' : 'Reset Password'}
                            </Button>

                            <Button
                                fullWidth
                                component={Link}
                                to="/login"
                                startIcon={<ArrowBackIcon />}
                                sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'none', '&:hover': { color: 'white' } }}
                            >
                                Back to Login
                            </Button>
                        </form>
                    </Box>
                </Grid>

                {/* Right Side - Visual */}
                <Grid item xs={false} md={7} lg={8} sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', bgcolor: '#020617' }}>
                    <Box sx={{ 
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(192, 132, 252, 0.1) 0%, transparent 50%)',
                        filter: 'blur(80px)'
                    }} />
                    <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', p: 8 }}>
                        <Typography variant="h1" sx={{ fontWeight: 900, mb: 4, letterSpacing: -4, background: 'linear-gradient(135deg, #f8fafc 0%, #64748b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { md: '5rem', lg: '7rem' } }}>Security</Typography>
                        <Typography variant="h4" sx={{ color: '#e2e8f0', maxWidth: 600, mx: 'auto', fontStyle: 'italic', opacity: 0.8 }}>"The only thing more expensive than education is ignorance."</Typography>
                        <Box sx={{ width: 100, height: 4, bgcolor: 'primary.main', mx: 'auto', mt: 6, borderRadius: 2 }} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ForgotPassword;
