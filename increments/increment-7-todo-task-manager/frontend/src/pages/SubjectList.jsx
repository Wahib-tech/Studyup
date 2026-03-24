import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get('/api/subjects', {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
      });
      setSubjects(data);
    };
    fetch();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Subjects</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Semester</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.subject_name}</TableCell>
                <TableCell>{s.subject_code}</TableCell>
                <TableCell>{s.course_id?.course_name}</TableCell>
                <TableCell>{s.semester}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};
export default SubjectList;
