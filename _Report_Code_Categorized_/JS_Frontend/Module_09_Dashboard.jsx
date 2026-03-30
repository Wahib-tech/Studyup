import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, IconButton, LinearProgress, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import socket from '../utils/socket';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuizIcon from '@mui/icons-material/Quiz';
import TaskIcon from '@mui/icons-material/Task';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    subjects: 0,
    quizzes: 0,
    tasks: 0,
    pendingTasks: 0,
    activeTasks: [],
    unreadNotifications: 0
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get('/api/analytics/dashboard-summary', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setSummary(data);
      } catch (err) {
        console.error('Failed to fetch dashboard summary', err);
      }
    };
    
    if (user) {
        fetchSummary();
        
        // Listen for all changes that affect dashboard
        socket.on('tasks_changed', fetchSummary);
        socket.on('courses_changed', fetchSummary);
        socket.on('sections_changed', fetchSummary);
    }
    
    return () => {
        socket.off('tasks_changed', fetchSummary);
        socket.off('courses_changed', fetchSummary);
        socket.off('sections_changed', fetchSummary);
    };
  }, [user]);

  const categories = [
    { title: 'Subjects', icon: <MenuBookIcon />, color: '#6366f1', count: summary.subjects, path: '/subjects' },
    { title: 'Quizzes', icon: <QuizIcon />, color: '#06b6d4', count: summary.quizzes, path: '/quizzes' },
    { title: 'Tasks', icon: <TaskIcon />, color: '#f43f5e', count: summary.tasks, path: '/tasks' },
    { title: 'Reports', icon: <TrendingUpIcon />, color: '#10b981', count: summary.reports || 0, path: '/analytics' },
  ];

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Background Mesh - Subtle */}
      <Box sx={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.03) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(6, 182, 212, 0.03) 0%, transparent 40%)',
          zIndex: 0, pointerEvents: 'none'
      }} />

      <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Welcome Banner */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: { xs: 4, md: 5 }, 
            borderRadius: '32px', 
            background: 'linear-gradient(135deg, #020617 0%, #0a0a0a 100%)',
            boxShadow: '0 30px 60px -20px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column-reverse', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: { xs: 'auto', md: '280px' },
            gap: { xs: 4, md: 0 }
          }}>
            {/* Mesh Gradient Overlay */}
            <Box sx={{ 
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: `
                    radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
                `,
                zIndex: 0
            }} />

            <Box sx={{ position: 'relative', zIndex: 2, maxWidth: { xs: '100%', md: '65%' }, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 900, letterSpacing: 3, display: 'inline-block', mb: 2, bgcolor: 'rgba(6,182,212,0.1)', px: 2, py: 0.5, borderRadius: '10px' }}>
                GENERATE YOUR FUTURE
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, letterSpacing: -3, color: '#f8fafc', lineHeight: 1.1, fontSize: { xs: '2rem', md: '3.5rem' } }}>
                Hi, <Box component="span" sx={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>{user?.username || 'Learner'}</Box>!
              </Typography>
              <Typography sx={{ color: '#94a3b8', lineHeight: 1.7, fontSize: { xs: '0.9rem', md: '1.2rem' }, mb: 4, fontWeight: 500, opacity: 0.9 }}>
                You've mastered <Box component="span" sx={{ fontWeight: 900, color: 'white' }}>{summary.tasks > 0 ? Math.round(((summary.tasks - summary.pendingTasks) / summary.tasks) * 100) : 0}%</Box> of your targets. Ready for the next AI challenge?
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/quizzes')}
                sx={{ 
                  borderRadius: '16px', 
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                  fontWeight: 900,
                  px: 5,
                  py: 1.8,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 15px 30px -10px rgba(99,102,241,0.5)',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 20px 40px -10px rgba(99,102,241,0.6)' }
                }}
              >
                Start AI Quiz
              </Button>
            </Box>
            
            <Box sx={{ position: 'relative', zIndex: 2 }}>
               <Box sx={{ 
                 width: { xs: 120, md: 180 }, 
                 height: { xs: 120, md: 180 }, 
                 borderRadius: '50%', 
                 background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))',
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'center',
                 border: '1px solid rgba(255,255,255,0.1)',
                 boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)',
                 backdropFilter: 'blur(20px)',
                 animation: 'float-dash 6s ease-in-out infinite'
               }}>
                 <QuizIcon sx={{ fontSize: { xs: 60, md: 90 }, color: '#f8fafc', opacity: 0.9 }} />
               </Box>
               <style>{`
                 @keyframes float-dash {
                   0%, 100% { transform: translateY(0); }
                   50% { transform: translateY(-20px); }
                 }
               `}</style>
            </Box>
          </Paper>
        </Grid>

        {/* Quote Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: '32px', 
            bgcolor: 'background.paper', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <Typography sx={{ position: 'absolute', top: -10, left: 10, fontSize: '10rem', color: 'rgba(99, 102, 241, 0.05)', fontWeight: 900, lineHeight: 1, fontFamily: 'serif' }}>"</Typography>
            <Typography sx={{ color: 'secondary.main', fontWeight: 900, mb: 3, letterSpacing: 2, textTransform: 'uppercase', fontSize: '0.8rem', opacity: 0.8 }}>Daily Vibe</Typography>
            <Typography sx={{ fontStyle: 'italic', color: '#f8fafc', lineHeight: 1.6, mb: 4, zIndex: 1, fontSize: { xs: '1.2rem', md: '1.7rem' }, fontWeight: 400, letterSpacing: -0.5 }}>
              "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, zIndex: 1 }}>
              <Box sx={{ width: 40, height: 3, borderRadius: 2, background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }} />
              <Typography sx={{ color: '#94a3b8', fontWeight: 800, fontSize: '0.9rem', letterSpacing: 1 }}>BRIAN HERBERT</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Category Grid */}
        <Grid item xs={12}>
          <Grid container spacing={4}>
            {categories.map((cat) => (
              <Grid item xs={6} sm={6} md={3} key={cat.title}>
                <Paper 
                  onClick={() => cat.path && navigate(cat.path)}
                  sx={{ 
                  p: { xs: 3, md: 4 }, 
                  borderRadius: '28px', 
                  bgcolor: 'rgba(255, 255, 255, 0.02)', 
                  backdropFilter: 'blur(10px)',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 2, md: 3 },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.3)',
                  '&:hover': { 
                    transform: 'translateY(-8px)', 
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: `${cat.color}60`,
                    boxShadow: `0 30px 60px -15px rgba(0,0,0,0.5), 0 0 30px ${cat.color}20`,
                    '& .cat-icon': { transform: 'scale(1.1) rotate(5deg)', color: 'white', bgcolor: cat.color }
                  }
                }}>
                  <Box className="cat-icon" sx={{ 
                    p: { xs: 1.5, md: 2 }, 
                    borderRadius: '16px', 
                    background: 'rgba(255,255,255,0.03)', 
                    color: cat.color,
                    display: 'flex',
                    border: `1px solid rgba(255,255,255,0.08)`,
                    transition: 'all 0.3s ease'
                  }}>
                    {React.cloneElement(cat.icon, { sx: { fontSize: { xs: 24, md: 32 } } })}
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ color: '#f8fafc', fontWeight: 900, lineHeight: 1, mb: 1, letterSpacing: -2, fontSize: { xs: '1.5rem', md: '2.5rem' } }}>{cat.count}</Typography>
                    <Typography sx={{ color: '#64748b', fontWeight: 900, fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase' }}>{cat.title}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Statistics & Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
              p: 5, 
              borderRadius: '32px', 
              bgcolor: 'background.paper', 
              border: '1px solid rgba(255,255,255,0.08)', 
              boxShadow: '0 30px 60px -20px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
              <Typography variant="h5" sx={{ color: '#f8fafc', fontWeight: 900, letterSpacing: -1 }}>Learning Velocity</Typography>
              <Box sx={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.2))', px: 2, py: 1, borderRadius: '12px', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 900, letterSpacing: 1 }}>THIS WEEK</Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 280, px: 2, gap: 4 }}>
               {(summary.weeklyActivity || [0, 0, 0, 0, 0, 0, 0]).map((h, i) => {
                 const currentDayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
                 const isToday = i === currentDayIndex;
                 return (
                 <Box key={i} sx={{ 
                   flex: 1, 
                   height: '100%',
                   display: 'flex',
                   flexDirection: 'column',
                   justifyContent: 'flex-end',
                   alignItems: 'center'
                 }}>
                   <Box sx={{ 
                     width: '100%', 
                     maxWidth: 50,
                     height: `${Math.max(8, h)}%`, 
                     background: isToday
                       ? 'linear-gradient(180deg, #6366f1 0%, #06b6d4 100%)' 
                       : 'rgba(255, 255, 255, 0.03)', 
                     borderRadius: '12px 12px 4px 4px',
                     position: 'relative',
                     transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                     boxShadow: isToday ? '0 15px 30px -10px rgba(99,102,241,0.6)' : 'none',
                     border: isToday ? 'none' : '1px solid rgba(255,255,255,0.05)',
                     '&:hover': { 
                         background: 'linear-gradient(180deg, #818cf8, #22d3ee)',
                         transform: 'scaleY(1.1)',
                         transformOrigin: 'bottom',
                         boxShadow: '0 20px 40px -10px rgba(99,102,241,0.4)',
                         cursor: 'help'
                     }
                   }}>
                     <Typography sx={{ 
                       position: 'absolute', 
                       top: -30, 
                       left: '50%', 
                       transform: 'translateX(-50%)', 
                       color: h > 0 ? '#fff' : 'rgba(255,255,255,0.2)', 
                       fontSize: '0.85rem', 
                       fontWeight: 900
                     }}>{h}%</Typography>
                   </Box>
                   <Typography sx={{ mt: 3, color: isToday ? 'primary.main' : '#64748b', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
                     {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                   </Typography>
                 </Box>
               )})}
            </Box>
          </Paper>
        </Grid>

        {/* Current Tasks Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
              p: 5, 
              borderRadius: '32px', 
              bgcolor: 'background.paper', 
              border: '1px solid rgba(255,255,255,0.08)', 
              boxShadow: '0 30px 60px -20px rgba(0,0,0,0.5)', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column' 
          }}>
            <Typography variant="h5" sx={{ color: '#f8fafc', fontWeight: 900, mb: 4, letterSpacing: -1 }}>Top Missions</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
              {summary.activeTasks.length > 0 ? summary.activeTasks.slice(0, 4).map((task, i) => (
                <Box key={task._id || i} sx={{ 
                    p: 2.5, 
                    borderRadius: '20px', 
                    bgcolor: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    transition: 'all 0.3s ease', 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.04)', 
                        borderColor: 'primary.main',
                        transform: 'translateX(8px)',
                        '& .task-dot': { boxShadow: '0 0 15px #f43f5e' }
                    } 
                }}>
                  <Box className="task-dot" sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f43f5e', transition: 'all 0.3s ease' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#f8fafc', fontWeight: 800, fontSize: '1rem', mb: 0.5 }}>{task.title}</Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{task.subject_id?.subject_name || 'General'}</Typography>
                  </Box>
                  <IconButton onClick={() => navigate('/tasks')} sx={{ opacity: 0.3, '&:hover': { opacity: 1, color: 'primary.main' } }}>
                      <MoreHorizIcon fontSize="small" />
                  </IconButton>
                </Box>
              )) : (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                  <Box sx={{ p: 3, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.02)', mb: 2 }}>
                    <TaskIcon sx={{ fontSize: 60, color: '#64748b' }} />
                  </Box>
                  <Typography sx={{ color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem' }}>Missions Clear</Typography>
                </Box>
              )}
            </Box>
            
            <Button 
                fullWidth 
                variant="outlined"
                onClick={() => navigate('/tasks')}
                sx={{ 
                  mt: 5, 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: '#94a3b8',
                  textTransform: 'none',
                  fontWeight: 900,
                  py: 1.8,
                  '&:hover': { border: '1px solid primary.main', color: 'primary.main', bgcolor: 'rgba(99,102,241,0.05)' }
                }}
            >
                Launch Task Manager
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>

  );
};

export default Dashboard;
