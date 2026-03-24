import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper } from '@mui/material';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get('/api/students', {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
      });
      setStudents(data);
    };
    fetch();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Students</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.first_name} {s.last_name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};
export default StudentList;
