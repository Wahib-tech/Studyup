import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, Card, CardContent, Paper, List, ListItem, ListItemText } from '@mui/material';

const CourseSectionList = () => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` };
      const resC = await axios.get('/api/courses/courses', { headers });
      const resS = await axios.get('/api/courses/sections', { headers });
      setCourses(resC.data);
      setSections(resS.data);
    };
    fetch();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Course & Section Management</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Courses</Typography>
          {courses.map(c => (
            <Card key={c._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{c.course_name} ({c.course_code})</Typography>
                <Typography variant="body2">{c.duration}</Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Sections</Typography>
          <Paper>
            <List>
              {sections.map(s => (
                <ListItem key={s._id}>
                  <ListItemText primary={s.section_name} secondary={`Course: ${s.course_id?.course_name}, Year: ${s.academic_year}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
export default CourseSectionList;
