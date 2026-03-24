import React from 'react';
import { Box, Typography, Grid, Paper, IconButton, LinearProgress, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuizIcon from '@mui/icons-material/Quiz';
import TaskIcon from '@mui/icons-material/Task';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const allCategories = [
    { title: 'Subjects', icon: <MenuBookIcon />, color: '#38bdf8', count: 8 },
    { title: 'Quizzes', icon: <QuizIcon />, color: '#c084fc', count: 12 },
    { title: 'Tasks', icon: <TaskIcon />, color: '#fb7185', count: 5 },
    { title: 'Reports', icon: <TrendingUpIcon />, color: '#4ade80', count: 2, roles: ['admin'] },
  ];

  const categories = allCategories.filter(cat => !cat.roles || cat.roles.includes(user?.role));

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Welcome Banner */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: 6, 
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 240
          }}>
            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '60%' }}>
              <Typography variant="overline" sx={{ color: '#38bdf8', fontWeight: 800, letterSpacing: 1.5 }}>STUDENT DASHBOARD</Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, mt: 1, mb: 2, letterSpacing: -1 }}>
                Welcome back, {user?.username || 'Learner'}!
              </Typography>
              <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                You have completed 85% of your weekly goals. Keep up the great work and master your subjects with AI.
              </Typography>
              <Button 
                variant="contained" 
                sx={{ 
                  mt: 3, 
                  borderRadius: 3, 
                  bgcolor: '#38bdf8', 
                  color: '#0f172a', 
                  fontWeight: 800,
                  px: 4,
                  py: 1.2,
                  '&:hover': { bgcolor: '#7dd3fc' }
                }}
              >
                View Progress
              </Button>
            </Box>
            
            {/* Visual element placeholder - imagine a 3D character here */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
               <Box sx={{ 
                 width: 180, 
                 height: 180, 
                 borderRadius: '50%', 
                 bgcolor: 'rgba(56, 189, 248, 0.1)', 
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'center',
                 border: '2px dashed rgba(56, 189, 248, 0.3)'
               }}>
                 <MenuBookIcon sx={{ fontSize: 80, color: '#38bdf8' }} />
               </Box>
            </Box>

            {/* Decorative background circles */}
            <Box sx={{ position: 'absolute', top: -50, right: -50, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 70%)' }} />
          </Paper>
        </Grid>

        {/* Quote Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: 6, 
            bgcolor: '#1e293b', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 800, mb: 3 }}>Study Motivation</Typography>
            <Typography variant="h5" sx={{ fontStyle: 'italic', color: '#e2e8f0', lineHeight: 1.5, mb: 3 }}>
              "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#38bdf8', fontWeight: 700 }}>— Brian Herbert</Typography>
          </Paper>
        </Grid>

        {/* Category Grid */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {categories.map((cat) => (
              <Grid item xs={12} sm={6} md={3} key={cat.title}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 5, 
                  bgcolor: '#1e293b', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 3,
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.05)',
                  '&:hover': { transform: 'translateY(-5px)', bgcolor: '#334155' }
                }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 3, 
                    bgcolor: `${cat.color}15`, 
                    color: cat.color,
                    display: 'flex'
                  }}>
                    {cat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 800, lineHeight: 1 }}>{cat.count}</Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>{cat.title}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Statistics & Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 6, bgcolor: '#1e293b', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 800 }}>Weekly Activity</Typography>
              <IconButton sx={{ color: '#94a3b8' }}><MoreHorizIcon /></IconButton>
            </Box>
            
            {/* Simple CSS Chart placeholder */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 200, px: 2, gap: 2 }}>
               {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                 <Box key={i} sx={{ 
                   flex: 1, 
                   height: `${h}%`, 
                   bgcolor: i === 3 ? '#38bdf8' : 'rgba(56, 189, 248, 0.2)', 
                   borderRadius: '8px 8px 0 0',
                   position: 'relative',
                   '&:hover': { bgcolor: '#38bdf8' }
                 }}>
                   <Box sx={{ 
                     position: 'absolute', 
                     top: -30, 
                     left: '50%', 
                     transform: 'translateX(-50%)', 
                     color: '#f8fafc', 
                     fontSize: '0.7rem', 
                     fontWeight: 800,
                     opacity: 1
                   }}>{h}%</Box>
                 </Box>
               ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
              <Typography variant="caption">Mon</Typography>
              <Typography variant="caption">Tue</Typography>
              <Typography variant="caption">Wed</Typography>
              <Typography variant="caption">Thu</Typography>
              <Typography variant="caption">Fri</Typography>
              <Typography variant="caption">Sat</Typography>
              <Typography variant="caption">Sun</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Current Tasks Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 6, bgcolor: '#1e293b', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 800, mb: 3 }}>Active Tasks</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                { name: 'AI Quiz - Physics', progress: 80, color: '#38bdf8' },
                { name: 'Lab Report Submission', progress: 40, color: '#c084fc' },
                { name: 'Mathematics Revision', progress: 60, color: '#4ade80' }
              ].map((task) => (
                <Box key={task.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>{task.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>{task.progress}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={task.progress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4, 
                      bgcolor: 'rgba(255,255,255,0.05)',
                      '& .MuiLinearProgress-bar': { bgcolor: task.color, borderRadius: 4 }
                    }} 
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
