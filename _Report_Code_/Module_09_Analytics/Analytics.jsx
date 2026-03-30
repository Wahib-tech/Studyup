import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { 
  Box, Typography, Grid, Paper, Card, CardContent, 
  CircularProgress, LinearProgress, Divider, Avatar, 
  Table, TableBody, TableCell, TableHead, TableRow, Button
} from '@mui/material';
import { useSelector } from 'react-redux';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarsIcon from '@mui/icons-material/Stars';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    let interval;
    const fetchAnalytics = async () => {
      try {
        const endpoint = '/api/analytics/student';
        const res = await axios.get(endpoint, { 
          headers: { Authorization: `Bearer ${user.token}` } 
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      }
      setLoading(false);
    };

    if (user) {
      if (loading) fetchAnalytics(); 
      interval = setInterval(fetchAnalytics, 5000); // 5 sec realtime loop
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress sx={{ color: 'primary.main' }} />
    </Box>
  );

  if (!data) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography sx={{ color: '#94a3b8' }}>No performance data available yet.</Typography>
    </Box>
  );

  const stats = [
    { label: 'Total Quizzes', value: data.stats.total_quizzes, icon: <EmojiEventsIcon />, color: '#6366f1' },
    { label: 'Average Score', value: `${(data.stats.average_quiz_score || 0).toFixed(1)}%`, icon: <StarsIcon />, color: '#06b6d4' },
    { label: 'Subjects Enrolled', value: data.stats.courses_enrolled, icon: <MenuBookIcon />, color: '#10b981' },
  ];

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Mesh Gradient Background for Header Section */}
      <Box sx={{ 
          position: 'absolute', top: -100, left: -100, right: -100, height: 400, 
          background: 'radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
          filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none'
      }} />

      {/* PRINT ONLY VIEW: Elegant Grade Card */}
      <Box className="print-only" sx={{ 
        display: 'none', 
        '@media print': { 
            display: 'block', 
            p: 2, 
            bgcolor: 'white', 
            color: 'black',
            minHeight: '100vh',
            fontFamily: "Inter, sans-serif"
        } 
      }}>
        <Box sx={{ textAlign: 'center', mb: 2, borderBottom: '2px solid #000', pb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5, color: '#1e293b' }}>STUDYUP AI</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: 2 }}>OFFICIAL PERFORMANCE REPORT</Typography>
            <Typography variant="caption" sx={{ mt: 0.5, color: '#64748b', display: 'block' }}>Generated on: {new Date().toLocaleDateString()} • Student ID: {user?._id?.substring(0,8).toUpperCase()}</Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Student Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 900 }}>{user?.username?.toUpperCase() || 'STUDENT'}</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Academic Status</Typography>
                <Typography variant="body1" sx={{ fontWeight: 900, color: '#059669' }}>ACTIVE / EXCELLED</Typography>
            </Grid>
        </Grid>

        <Divider sx={{ mb: 2, borderColor: '#000' }} />

        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>SUMMARY OF PERFORMANCE</Typography>
        <Table size="small" sx={{ mb: 2, border: '1px solid #e2e8f0' }}>
            <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                <TableRow>
                    <TableCell sx={{ fontWeight: 900, py: 1 }}>METRIC</TableCell>
                    <TableCell sx={{ fontWeight: 900, py: 1 }} align="right">VALUE / SCORE</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell sx={{ py: 0.5 }}>Total Quizzes Attempted</TableCell>
                    <TableCell align="right" sx={{ py: 0.5 }}>{data.stats.total_quizzes}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ py: 0.5 }}>Cumulative Average Score</TableCell>
                    <TableCell align="right" sx={{ py: 0.5 }}>{(data.stats.average_quiz_score || 0).toFixed(2)}%</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ py: 0.5 }}>Active Courses / Subjects</TableCell>
                    <TableCell align="right" sx={{ py: 0.5 }}>{data.stats.courses_enrolled}</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>SKILL PROFICIENCY BREAKDOWN</Typography>
        <Grid container spacing={1.5} sx={{ mb: 4 }}>
            {(data.categories || [
                { name: 'Critical Thinking', value: 0 },
                { name: 'Problem Solving', value: 0 },
                { name: 'Subject Knowledge', value: 0 }
            ]).map(skill => (
                <Grid item xs={4} key={skill.name}>
                    <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderColor: '#e2e8f0', borderRadius: '10px' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', display: 'block', fontSize: '0.65rem' }}>{skill.name.toUpperCase()}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>{skill.value}%</Typography>
                    </Paper>
                </Grid>
            ))}
        </Grid>

        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Box sx={{ textAlign: 'center', width: 180 }}>
                <Box sx={{ borderBottom: '1.5px solid #000', mb: 1, height: 30 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.6rem' }}>Student Signature</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
                <VerifiedIcon sx={{ fontSize: 40, color: '#38bdf8', mb: 0.5 }} />
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 800, color: '#38bdf8', fontSize: '0.6rem' }}>VERIFIED BY STUDYUP</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', width: 180 }}>
                <Box sx={{ borderBottom: '1.5px solid #000', mb: 1, height: 30 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.6rem' }}>Academic Coordinator</Typography>
            </Box>
        </Box>
      </Box>

      {/* DASHBOARD VIEW: The original premium UI */}
      <Box className="print-hide" sx={{ '@media print': { display: 'none' }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: { xs: 4, md: 6 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
            <Box>
                <Typography variant="h4" sx={{ 
                    fontWeight: 900, 
                    mb: 1, 
                    letterSpacing: -1.5, 
                    fontSize: { xs: '1.75rem', md: '2.5rem' },
                    background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Mastery Analytics
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', md: '1.05rem' }, fontWeight: 500 }}>
                    Deep insights into your learning journey and subject proficiency.
                </Typography>
            </Box>
            <Button 
                variant="outlined" 
                onClick={() => window.print()}
                sx={{ 
                    borderRadius: '16px', 
                    color: 'secondary.main', 
                    borderColor: 'rgba(6, 182, 212, 0.3)', 
                    fontWeight: 800,
                    px: { xs: 2, md: 4 },
                    py: 1.5,
                    width: { xs: '100%', sm: 'auto' },
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    background: 'rgba(6, 182, 212, 0.03)',
                    '&:hover': { background: 'rgba(6, 182, 212, 0.08)', borderColor: 'secondary.main', transform: 'translateY(-2px)' },
                    transition: 'all 0.3s'
                }}
            >
                {window.innerWidth < 600 ? 'Export PDF' : 'Download Grade Card'}
            </Button>
        </Box>

        <Grid container spacing={4}>
            {stats.map((stat) => (
            <Grid item xs={12} md={4} key={stat.label}>
                <Paper sx={{ 
                    p: { xs: 3, md: 4 }, 
                    borderRadius: '24px', 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: `${stat.color}50`,
                        boxShadow: `0 20px 40px -15px ${stat.color}30`
                    }
                }}>
                <Box sx={{ 
                    p: 2, 
                    borderRadius: '16px', 
                    background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}80 100%)`, 
                    color: '#fff',
                    display: 'flex',
                    boxShadow: `0 10px 20px -5px ${stat.color}40`
                }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: 32 } })}
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: 'text.secondary', fontWeight: 800, fontSize: '0.75rem', letterSpacing: 1.5, mb: 0.5 }}>{stat.label.toUpperCase()}</Typography>
                    <Typography variant="h3" sx={{ color: '#f8fafc', fontWeight: 900, letterSpacing: -1.5 }}>{stat.value}</Typography>
                </Box>
                </Paper>
            </Grid>
            ))}

                <Grid item xs={12} md={8}>
                <Paper sx={{ 
                    p: { xs: 3, md: 4 }, 
                    borderRadius: '24px', 
                    bgcolor: 'rgba(255, 255, 255, 0.02)', 
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)', 
                    boxShadow: '0 20px 50px -20px rgba(0,0,0,0.5)' 
                }}>
                    <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 900, mb: 4, letterSpacing: -0.5 }}>Skill Proficiency</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {(data.categories || [
                        { name: 'Critical Thinking', value: 0, color: '#6366f1' },
                        { name: 'Problem Solving', value: 0, color: '#06b6d4' },
                        { name: 'Subject Knowledge', value: 0, color: '#10b981' }
                    ]).map((skill, idx) => (
                        <Box key={skill.name}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography sx={{ color: '#f8fafc', fontWeight: 700 }}>{skill.name}</Typography>
                            <Typography sx={{ color: skill.color || (idx === 0 ? '#38bdf8' : idx === 1 ? '#c084fc' : '#4ade80'), fontWeight: 900 }}>{skill.value}%</Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={skill.value} 
                            sx={{ 
                                height: 10, 
                                borderRadius: '5px', 
                                bgcolor: 'rgba(255,255,255,0.03)',
                                '& .MuiLinearProgress-bar': { 
                                background: `linear-gradient(90deg, ${skill.color || (idx === 0 ? '#6366f1' : idx === 1 ? '#06b6d4' : '#10b981')}80, ${skill.color || (idx === 0 ? '#6366f1' : idx === 1 ? '#06b6d4' : '#10b981')})`, 
                                borderRadius: '5px',
                                boxShadow: `0 0 15px ${(skill.color || (idx === 0 ? '#6366f1' : idx === 1 ? '#06b6d4' : '#10b981'))}40` 
                                }
                            }} 
                        />
                        </Box>
                    ))}
                    </Box>
                </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                <Paper sx={{ 
                    p: { xs: 3, md: 4 }, 
                    borderRadius: '24px', 
                    bgcolor: 'rgba(255, 255, 255, 0.02)', 
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)', 
                    boxShadow: '0 20px 50px -20px rgba(0,0,0,0.5)', 
                    height: '100%' 
                }}>
                    <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 900, mb: 3, letterSpacing: -0.5 }}>Badges</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                        { name: 'Quiz Starter', desc: 'Complete your first quiz', icon: <LocalFireDepartmentIcon />, color: '#f59e0b', earned: (data.stats.total_quizzes || 0) >= 1, progress: Math.min(100, (data.stats.total_quizzes || 0) / 1 * 100) },
                        { name: 'Quiz Master', desc: 'Complete 10 quizzes', icon: <EmojiEventsIcon />, color: '#fbbf24', earned: (data.stats.total_quizzes || 0) >= 10, progress: Math.min(100, (data.stats.total_quizzes || 0) / 10 * 100) },
                        { name: 'Task Rookie', desc: 'Finish 5 tasks', icon: <AssignmentTurnedInIcon />, color: '#10b981', earned: (data.stats.tasks_completed || 0) >= 5, progress: Math.min(100, (data.stats.tasks_completed || 0) / 5 * 100) },
                        { name: 'High Flyer', desc: 'Avg Score > 90%', icon: <WorkspacePremiumIcon />, color: '#06b6d4', earned: (data.stats.average_quiz_score || 0) >= 90, progress: Math.min(100, (data.stats.average_quiz_score || 0) / 90 * 100) },
                        { name: 'Master Mind', desc: 'Enrolled in 3+ subjects', icon: <VerifiedIcon />, color: '#6366f1', earned: (data.stats.courses_enrolled || 0) >= 3, progress: Math.min(100, (data.stats.courses_enrolled || 0) / 3 * 100) }
                    ].map(t => (
                        <Box key={t.name} sx={{ 
                            p: 2, 
                            background: t.earned ? 'rgba(255,255,255,0.03)' : 'transparent', 
                            borderRadius: '16px', 
                            border: '1px solid',
                            borderColor: t.earned ? `${t.color}40` : 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            opacity: t.earned ? 1 : 0.6,
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s',
                            '&:hover': t.earned ? { bgcolor: 'rgba(255,255,255,0.05)', transform: 'translateX(5px)' } : {}
                        }}>
                            <Box sx={{ 
                                p: 1, 
                                borderRadius: '10px', 
                                bgcolor: t.earned ? `${t.color}20` : 'rgba(255,255,255,0.05)',
                                color: t.earned ? t.color : '#64748b',
                                boxShadow: t.earned ? `0 0 15px ${t.color}20` : 'none'
                            }}>
                            {React.cloneElement(t.icon, { sx: { fontSize: 20 } })}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>{t.name}</Typography>
                                {!t.earned && (
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={t.progress} 
                                        sx={{ height: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: t.color } }} 
                                    />
                                )}
                            </Box>
                            {t.earned && <VerifiedIcon sx={{ color: t.color, fontSize: 14, position: 'absolute', top: 8, right: 8 }} />}
                        </Box>
                    ))}
                    </Box>
                </Paper>
                </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Analytics;
