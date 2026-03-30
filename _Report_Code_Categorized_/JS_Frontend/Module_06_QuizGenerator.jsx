import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

const QuizGenerator = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/ai/generate', {
        text, subject_id: "65f1a2b3c4d5e6f7a8b9c0d1", // Dummy subject
        title: "AI Generated Quiz",
        difficulty_level: "medium",
        question_count: 5
      }, { headers: { Authorization: `Bearer ${user.token}` } });
      setQuiz(data);
    } catch (e) { alert(e.message); }
    setLoading(false);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>AI Quiz Generator</Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField fullWidth multiline rows={6} placeholder="Paste text here to generate a quiz..." value={text} onChange={(e) => setText(e.target.value)} sx={{ mb: 2 }} />
        <Button variant="contained" onClick={handleGenerate} disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Generate Quiz'}</Button>
      </Paper>
      {quiz && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>{quiz.title}</Typography>
          {quiz.questions.map((q, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Typography fontWeight="bold">{i+1}. {q.question_text}</Typography>
              {q.options.map((opt, j) => <Typography key={j}>• {opt}</Typography>)}
            </Box>
          ))}
        </Paper>
      )}
    </Container>
  );
};
export default QuizGenerator;
