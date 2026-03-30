import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Paper, TextField, Button, Avatar, Stack } from '@mui/material';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you soon.');
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <Box sx={{ pb: 8, pt: 2 }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ fontWeight: 900, mb: 2 }}>Get In <Box component="span" sx={{ color: 'primary.main' }}>Touch</Box></Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}>
                        Have questions about StudyUp? We're here to help you get the most out of your learning experience.
                    </Typography>
                </Box>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={7}>
                        <Paper sx={{ p: 6, borderRadius: '40px', bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>Send a Message</Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}><TextField fullWidth label="Your Name" name="name" value={form.name} onChange={handleChange} required /></Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth label="Your Email" name="email" type="email" value={form.email} onChange={handleChange} required /></Grid>
                                    <Grid item xs={12}><TextField fullWidth label="Subject" name="subject" value={form.subject} onChange={handleChange} required /></Grid>
                                    <Grid item xs={12}><TextField fullWidth label="Message" name="message" multiline rows={6} value={form.message} onChange={handleChange} required /></Grid>
                                    <Grid item xs={12}><Button type="submit" variant="contained" size="large" endIcon={<SendIcon />} sx={{ borderRadius: 3, px: 6, py: 1.8 }}>Send Message</Button></Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};
export default Contact;
