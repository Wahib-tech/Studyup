import React from 'react';
import { Box, Typography, Container, Grid, Paper, Avatar, useTheme } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';

const About = () => {
  const theme = useTheme();

  const features = [
    {
      title: 'AI-Powered Learning',
      desc: 'Leverage advanced AI to generate personalized quizzes and study materials tailored to your curriculum.',
      icon: <PsychologyOutlinedIcon sx={{ fontSize: 40, color: '#38bdf8' }} />,
      color: '#38bdf8'
    },
    {
      title: 'Actionable Analytics',
      desc: 'Track your progress with detailed performance reports and identify areas for improvement instantly.',
      icon: <AnalyticsOutlinedIcon sx={{ fontSize: 40, color: '#c084fc' }} />,
      color: '#c084fc'
    },
    {
      title: 'Goal Oriented',
      desc: 'Stay organized with our integrated task manager and smart notification system that keeps you on track.',
      icon: <RocketLaunchOutlinedIcon sx={{ fontSize: 40, color: '#4ade80' }} />,
      color: '#4ade80'
    }
  ];

  return (
    <Box sx={{ pb: 8, pt: 2 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Paper
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: '40px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            mb: 6,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <InfoOutlinedIcon />
              </Avatar>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
                About StudyUp
              </Typography>
            </Box>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, letterSpacing: -1 }}>
              Redefining the <Box component="span" sx={{ color: 'primary.main' }}>Future of Education</Box>
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.2rem', lineHeight: 1.8, maxWidth: 800 }}>
              StudyUp is an AI-integrated MERN stack platform designed to streamline student workflows, automate quiz generation, and provide deep insights into academic performance. Our mission is to empower learners with cutting-edge tools that make studying smarter, not harder.
            </Typography>
          </Box>
          <Box sx={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        </Paper>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>
          What Makes Us Different?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                sx={{
                  p: 4, height: '100%', borderRadius: '30px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-10px)', borderColor: `${feature.color}40`, background: 'rgba(255, 255, 255, 0.04)' }
                }}
              >
                <Box sx={{ mb: 3, width: 80, height: 80, borderRadius: '20px', bgcolor: `${feature.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{feature.icon}</Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{feature.title}</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>{feature.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ mt: 8, p: 6, borderRadius: '40px', bgcolor: 'rgba(255, 255, 255, 0.01)', border: '1px dotted rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Academic Project Submission</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto', fontStyle: 'italic' }}>
            StudyUp was developed as a comprehensive project for the IGNOU BCA program (BCSP-064). 
            It demonstrates advanced full-stack development skills using the MERN stack with a focus on AI integration and modern UI principles.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};
export default About;
