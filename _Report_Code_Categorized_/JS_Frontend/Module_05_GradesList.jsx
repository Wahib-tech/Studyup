import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';

const GradesList = () => {
  const [grades, setGrades] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(`/api/grades?student_id=${user._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setGrades(data);
    };
    if (user) fetch();
  }, [user]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>My Grades</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Grade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((g) => (
              <TableRow key={g._id}>
                <TableCell>{g.subject_id?.subject_name}</TableCell>
                <TableCell>{g.marks_obtained} / {g.total_marks}</TableCell>
                <TableCell>{g.percentage}%</TableCell>
                <TableCell>{g.grade_letter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};
export default GradesList;
