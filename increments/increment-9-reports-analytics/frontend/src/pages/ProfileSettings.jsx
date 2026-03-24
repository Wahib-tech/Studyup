import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Paper, Avatar, Button, Grid, TextField, 
  IconButton, Card, CardContent, Divider, CircularProgress, 
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, 
  DialogActions, Slider, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

const ProfileSettings = () => {
  const { user } = useSelector((state) => state.auth);
  const [profilePic, setProfilePic] = useState('/assets/profile.png');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [academicInfo, setAcademicInfo] = useState({ course: '', section: '' });
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    profile_image: '',
    course_id: '',
    section_id: ''
  });

  // Cropper State
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(1); // Default 1:1
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const courseRes = await axios.get('/api/courses', { headers: { Authorization: `Bearer ${user.token}` } });
            console.log('Courses Fetched:', courseRes.data);
            setCourses(courseRes.data);
            const sectionRes = await axios.get('/api/courses/sections', { headers: { Authorization: `Bearer ${user.token}` } });
            console.log('Sections Fetched:', sectionRes.data);
            setSections(sectionRes.data);
        } catch (err) { console.error('Data fetch failed', err); }
    };

    const fetchProfile = async () => {
      try {
        const studentId = user.linked_id || user.id;
        const { data } = await axios.get(`/api/students/${studentId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const student = data.student || {};
        
        // Format date for the date input
        let dob = '';
        if (student.date_of_birth) {
            dob = new Date(student.date_of_birth).toISOString().split('T')[0];
        }

        setFormData({
            first_name: student.first_name || '',
            last_name: student.last_name || '',
            email: student.email || user.email,
            bio: student.bio || '',
            phone: student.phone || '',
            gender: student.gender || '',
            date_of_birth: dob,
            profile_image: student.profile_image || '',
            course_id: student.course_id?._id || student.course_id || '',
            section_id: student.section_id?._id || student.section_id || ''
        });
        
        setAcademicInfo({
            course: student.course_id?.course_name || 'Not Enrolled',
            section: student.section_id?.section_name || 'Not Assigned'
        });

        if (student.profile_image) {
            setProfilePic(student.profile_image);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
        fetchInitialData();
        fetchProfile();
    }
  }, [user]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels, rotation);
      setProfilePic(croppedImage);
      setFormData(prev => ({ ...prev, profile_image: croppedImage }));
      setCropDialogOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to crop image");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const studentId = user.linked_id || user.id;
      await axios.put(`/api/students/${studentId}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setShowSuccess(true);
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#f8fafc', mb: 1, letterSpacing: -1 }}>
          Profile Settings
        </Typography>
        <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '1rem' }}>
          Manage your personal information and student preferences.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card sx={{ bgcolor: 'background.paper', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 50px -20px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                <Box sx={{ height: 100, background: 'linear-gradient(135deg, #020617 0%, #1e1b4b 100%)', position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
                </Box>
                <CardContent sx={{ textAlign: 'center', pb: 4, pt: 0, mt: -6 }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={profilePic}
                      sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '4px solid #0a0a0a', boxShadow: '0 0 30px rgba(99,102,241,0.3)', bgcolor: '#020617' }}
                    />
                    <IconButton
                      component="label"
                      sx={{ position: 'absolute', bottom: 15, right: 0, background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', '&:hover': { transform: 'scale(1.1)' }, boxShadow: '0 4px 15px rgba(99,102,241,0.5)', transition: 'all 0.2s', width: 36, height: 36 }}
                    >
                      <PhotoCameraIcon fontSize="small" />
                      <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </IconButton>
                  </Box>
                  <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 900, mb: 0.5 }}>{user?.username}</Typography>
                  <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 1, fontSize: '0.75rem', textTransform: 'uppercase' }}>{user?.role}</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Academic Info Card */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: 'background.paper', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}>
                <Typography variant="subtitle2" sx={{ color: 'primary.main', mb: 3, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.75rem' }}>Academic Info</Typography>
                
                <FormControl fullWidth sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.03)', color: '#f8fafc', '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' }, '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' } }, '& .MuiInputLabel-root': { color: 'text.secondary' } }}>
                    <InputLabel>Select Course</InputLabel>
                    <Select
                        label="Select Course"
                        value={formData.course_id}
                        onChange={(e) => setFormData({...formData, course_id: e.target.value, section_id: ''})}
                        sx={{ color: '#f8fafc', '& .MuiSelect-icon': { color: 'text.secondary' } }}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.course_name}</MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.03)', color: '#f8fafc', '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' }, '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' } }, '& .MuiInputLabel-root': { color: 'text.secondary' } }}>
                    <InputLabel>Select Section</InputLabel>
                    <Select
                        label="Select Section"
                        value={formData.section_id}
                        disabled={!formData.course_id}
                        onChange={(e) => setFormData({...formData, section_id: e.target.value})}
                        sx={{ color: '#f8fafc', '& .MuiSelect-icon': { color: 'text.secondary' } }}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {sections.filter(s => (s.course_id?._id === formData.course_id || s.course_id === formData.course_id)).map(s => (
                            <MenuItem key={s._id} value={s._id}>{s.section_name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, bgcolor: 'background.paper', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 50px -20px rgba(0,0,0,0.5)' }}>
            <Typography variant="h6" sx={{ color: '#f8fafc', mb: 3, fontWeight: 900, letterSpacing: -0.5 }}>Personal Details</Typography>
            <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.08)' }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.03)', color: '#f8fafc', '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' }, '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' } }, '& .MuiInputLabel-root': { color: 'text.secondary' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.03)', color: '#f8fafc', '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' }, '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' } }, '& .MuiInputLabel-root': { color: 'text.secondary' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.03)', color: '#f8fafc', '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' }, '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' } }, '& .MuiInputLabel-root': { color: 'text.secondary' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  placeholder="+91 99999 99999"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.03)', color: '#f8fafc', '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' }, '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' } }, '& .MuiInputLabel-root': { color: 'text.secondary' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', '& fieldset': { borderColor: 'rgba(255,255,255,0.05)' } } }}>
                    <InputLabel sx={{ color: '#94a3b8' }}>Gender</InputLabel>
                    <Select
                        label="Gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        sx={{ color: '#f8fafc', '& .MuiSelect-icon': { color: '#94a3b8' } }}
                    >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                        <MenuItem value="">Prefer not to say</MenuItem>
                    </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date of Birth"
                  InputLabelProps={{ shrink: true }}
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'rgba(255, 255, 255, 0.03)', color: '#f8fafc', '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' }, '&:hover fieldset': { borderColor: 'primary.main' }, '&.Mui-focused fieldset': { borderColor: 'primary.main' } }, '& .MuiInputLabel-root': { color: 'text.secondary' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: '#f8fafc', mt: 2, mb: 1, fontWeight: 700 }}>About Me / Bio</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell us about yourself and your learning goals..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', '& fieldset': { borderColor: 'rgba(255,255,255,0.05)' } } }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleSave}
                sx={{ 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                  color: '#fff', 
                  fontWeight: 800, 
                  px: 4, 
                  py: 1.5, 
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 10px 20px -5px rgba(99,102,241,0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 25px -5px rgba(99,102,241,0.5)' },
                  '&.Mui-disabled': { background: '#1e1b4b', color: '#64748b' }
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Cropper Dialog */}
      <Dialog open={cropDialogOpen} onClose={() => setCropDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#0a0a0a', color: 'white', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' } }}>
        <DialogTitle sx={{ fontWeight: 900, borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
          <span>Crop Image</span>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant={aspect === 1 ? "contained" : "outlined"} onClick={() => setAspect(1)} sx={{ minWidth: 42, borderRadius: 2, bgcolor: aspect === 1 ? 'primary.main' : 'transparent' }}>SQ</Button>
            <Button size="small" variant={aspect === 4/3 ? "contained" : "outlined"} onClick={() => setAspect(4/3)} sx={{ minWidth: 42, borderRadius: 2, bgcolor: aspect === 4/3 ? 'primary.main' : 'transparent' }}>4:3</Button>
            <Button size="small" variant={aspect === 16/9 ? "contained" : "outlined"} onClick={() => setAspect(16/9)} sx={{ minWidth: 42, borderRadius: 2, bgcolor: aspect === 16/9 ? 'primary.main' : 'transparent' }}>16:9</Button>
            <Button size="small" variant={!aspect ? "contained" : "outlined"} onClick={() => setAspect(null)} sx={{ minWidth: 42, borderRadius: 2, textTransform: 'none', bgcolor: !aspect ? 'primary.main' : 'transparent' }}>Free</Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2, minHeight: 450, position: 'relative' }}>
          <Box sx={{ position: 'relative', width: '100%', height: 320, bgcolor: '#020617', borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
            />
          </Box>
          <Grid container spacing={4} sx={{ mt: 3, px: 1 }}>
            <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Zoom Level</Typography>
                <Slider value={zoom} min={1} max={3} step={0.1} onChange={(e, zoom) => setZoom(zoom)} sx={{ color: 'primary.main' }} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Rotation</Typography>
                <Slider value={rotation} min={0} max={360} step={1} onChange={(e, rot) => setRotation(rot)} sx={{ color: 'secondary.main' }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Button onClick={() => setCropDialogOpen(false)} sx={{ color: 'text.secondary', fontWeight: 700 }}>Cancel</Button>
          <Button variant="contained" onClick={handleCropSave} sx={{ borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', px: 4, fontWeight: 800 }}>Apply Crop</Button>
        </DialogActions>
      </Dialog>


      <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%', borderRadius: 3, fontWeight: 700 }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileSettings;
