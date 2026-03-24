import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { 
  Box, Typography, Paper, TextField, Button, 
  CircularProgress, Grid, Divider, IconButton, Chip,
  MenuItem, Select, FormControl, InputLabel, Snackbar, Alert
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import QuizIcon from '@mui/icons-material/Quiz';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up pdfjs worker using unpkg
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const QuizGenerator = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(5);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [step, setStep] = useState(1);
  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    let interval;
    const fetchSubjects = async () => {
      try {
        const { data } = await axios.get('/api/subjects', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setSubjects(data);
        // Only set default if not already selected
        setSubjects((prevSubjects) => {
            if (data.length > 0 && !selectedSubject) {
                setSelectedSubject(data[0]._id);
            }
            return data;
        });
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      }
    };
    
    if (user) {
        fetchSubjects();
        interval = setInterval(fetchSubjects, 5000);
    }
    
    return () => clearInterval(interval);
  }, [user, selectedSubject]);

  const handleGenerate = async () => {
    if (!text.trim() || !selectedSubject) return;
    setLoading(true);
    try {
      const { data } = await axios.post('/api/ai/generate', {
        text, 
        subject_id: selectedSubject,
        title: "AI Generated Quiz",
        difficulty_level: difficulty,
        question_count: count
      }, { headers: { Authorization: `Bearer ${user.token}` } });
      setQuiz(data);
    } catch (e) { 
      console.error(e);
      const msg = e.response?.data?.message || "Please check if your Gemini API key is active or the text is too short.";
      alert(`Failed to generate quiz: ${msg}`);
    }
    setLoading(false);
    setUserAnswers({});
    setQuizResult(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingFile(true);
    setText(''); // Reset text
    
    try {
        if (file.name.endsWith('.txt')) {
            const reader = new FileReader();
            reader.onload = (evt) => { setText(evt.target.result); setLoadingFile(false); };
            reader.readAsText(file);
        } else if (file.name.endsWith('.docx')) {
            const reader = new FileReader();
            reader.onload = async (evt) => {
                const arrayBuffer = evt.target.result;
                const result = await mammoth.extractRawText({ arrayBuffer });
                setText(result.value);
                setLoadingFile(false);
            };
            reader.readAsArrayBuffer(file);
        } else if (file.name.endsWith('.pdf')) {
            const reader = new FileReader();
            reader.onload = async (evt) => {
                const typedarray = new Uint8Array(evt.target.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + ' \n';
                }
                setText(fullText);
                setLoadingFile(false);
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('Unsupported format. Please upload PDF, DOCX, or TXT.');
            setLoadingFile(false);
        }
    } catch (err) {
        console.error(err);
        alert('Failed to extract text from file.');
        setLoadingFile(false);
    }
    // reset file input
    e.target.value = null;
  };

  const handleSubmitQuiz = async () => {
    let correct = 0;
    quiz.questions.forEach((q, i) => {
        if (userAnswers[i] === q.correct_answer) correct++;
    });
    
    const percentage = (correct / quiz.questions.length) * 100;
    setQuizResult({ score: correct, percentage });

    try {
        await axios.post('/api/quizzes/submit', {
            quiz_id: quiz._id,
            score: correct,
            total_questions: quiz.questions.length
        }, { headers: { Authorization: `Bearer ${user.token}` } });
    } catch (err) { console.error('Failed to save performance', err); }
  };

  const handleSaveConfirmed = () => {
    setShowSuccess(true);
    setTimeout(() => {
        setQuiz(null);
        setText('');
    }, 2000);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Mesh Gradient Background */}
      <Box sx={{ 
          position: 'absolute', top: -100, left: -100, right: -100, height: 400, 
          background: 'radial-gradient(circle at 70% 30%, rgba(192, 132, 252, 0.1) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(56, 189, 248, 0.1) 0%, transparent 50%)',
          filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none'
      }} />

      <Box sx={{ mb: 5, position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" sx={{ 
            fontWeight: 900, 
            mb: 1, 
            letterSpacing: -1.5,
            background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}>
          AI Quiz Wizard
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '1.05rem', fontWeight: 500 }}>
          Instantly transform your study notes into professional practice quizzes.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
        <Grid item xs={12} md={quiz ? 5 : 12}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: '24px', 
            bgcolor: 'rgba(255, 255, 255, 0.02)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 50px -20px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease'
          }}>
            <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ p: 1, borderRadius: 3, background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', display: 'flex', boxShadow: '0 5px 15px rgba(56, 189, 248, 0.3)' }}>
                <AutoAwesomeIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              Generation Options
            </Typography>

            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {[1, 2, 3].map((s) => (
                    <Box key={s} sx={{ 
                        flex: 1, height: 6, borderRadius: 3, 
                        background: step >= s ? 'linear-gradient(90deg, #38bdf8, #c084fc)' : 'rgba(255,255,255,0.05)',
                        boxShadow: step >= s ? '0 0 10px rgba(56, 189, 248, 0.4)' : 'none',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                ))}
            </Box>

            {step === 1 && (
                <Box>
                    <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 2, fontWeight: 800, letterSpacing: 1 }}>STEP 1: CHOOSE YOUR SUBJECT</Typography>
                    <TextField
                        fullWidth
                        select
                        label="Subject"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                                bgcolor: 'rgba(255, 255, 255, 0.03)',
                                color: 'white',
                                '& fieldset': { border: '1px solid rgba(255,255,255,0.08)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&.Mui-focused fieldset': { borderColor: '#38bdf8' }
                            },
                            '& .MuiInputLabel-root': { color: '#64748b' }
                        }}
                    >
                        {subjects.map(s => (
                            <MenuItem key={s._id} value={s._id} sx={{ fontWeight: 600 }}>{s.subject_name}</MenuItem>
                        ))}
                    </TextField>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        disabled={!selectedSubject}
                        onClick={() => setStep(2)}
                        sx={{ 
                            borderRadius: '16px', 
                            py: 2, 
                            textTransform: 'none', 
                            fontWeight: 900, 
                            fontSize: '1rem',
                            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                            boxShadow: '0 10px 20px -5px rgba(56,189,248,0.4)',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 25px -5px rgba(56,189,248,0.5)' }
                        }}
                    >
                        Continue to Step 2
                    </Button>
                </Box>
            )}

            {step === 2 && (
                <Box>
                    <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 2, fontWeight: 800, letterSpacing: 1 }}>STEP 2: DIFFICULTY & QUANTITY</Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                select
                                label="Difficulty Level"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '16px',
                                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                                        color: 'white',
                                        '& fieldset': { border: '1px solid rgba(255,255,255,0.08)' },
                                    },
                                    '& .MuiInputLabel-root': { color: '#64748b' }
                                }}
                            >
                                <MenuItem value="easy" sx={{ fontWeight: 600 }}>Easy</MenuItem>
                                <MenuItem value="medium" sx={{ fontWeight: 600 }}>Medium</MenuItem>
                                <MenuItem value="hard" sx={{ fontWeight: 600 }}>Hard</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Count"
                                value={count}
                                onChange={(e) => setCount(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '16px',
                                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                                        color: 'white',
                                        '& fieldset': { border: '1px solid rgba(255,255,255,0.08)' },
                                    },
                                    '& .MuiInputLabel-root': { color: '#64748b' }
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                            onClick={() => setStep(1)} 
                            sx={{ 
                                color: '#94a3b8', 
                                fontWeight: 800, 
                                borderRadius: '12px',
                                textTransform: 'none',
                                '&:hover': { color: 'white' }
                            }}
                        >
                            Back
                        </Button>
                        <Button 
                            fullWidth 
                            variant="contained" 
                            onClick={() => setStep(3)}
                            sx={{ 
                                borderRadius: '16px', 
                                py: 2, 
                                textTransform: 'none', 
                                fontWeight: 900, 
                                fontSize: '1rem',
                                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                                boxShadow: '0 10px 20px -5px rgba(56,189,248,0.4)',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 25px -5px rgba(56,189,248,0.5)' }
                            }}
                        >
                            Continue to Step 3
                        </Button>
                    </Box>
                </Box>
            )}
            
            {step === 3 && (
                <Box>
                     <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 2, fontWeight: 800, letterSpacing: 1 }}>STEP 3: UPLOAD OR PASTE CONTENT</Typography>
                     <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Button 
                            component="label" 
                            variant="outlined" 
                            disabled={loadingFile}
                            startIcon={loadingFile ? <CircularProgress size={20} color="inherit" /> : <FileUploadIcon />}
                            sx={{ 
                                borderRadius: '16px', 
                                color: '#c084fc', 
                                borderColor: 'rgba(192, 132, 252, 0.3)',
                                textTransform: 'none',
                                fontWeight: 800,
                                py: 1.5, px: 3,
                                flex: 1,
                                '&:hover': { borderColor: '#c084fc', background: 'rgba(192, 132, 252, 0.05)', transform: 'translateY(-2px)' },
                                transition: 'all 0.3s'
                            }}
                        >
                            {loadingFile ? 'Analyzing...' : 'Smart Upload (PDF/DOCX)'}
                            <input type="file" hidden accept=".pdf,.txt,.docx" onChange={handleFileUpload} />
                        </Button>
                    </Box>

                    <TextField 
                        fullWidth 
                        multiline 
                        rows={8} 
                        placeholder={loadingFile ? "Reading your files..." : "Paste your learning material here. The more detailed, the better the quiz!"} 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        sx={{ 
                            mb: 4,
                            '& .MuiOutlinedInput-root': { 
                                borderRadius: '24px', 
                                bgcolor: 'rgba(255, 255, 255, 0.03)', 
                                color: 'white',
                                '& fieldset': { border: '1px solid rgba(255,255,255,0.08)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                '&.Mui-focused fieldset': { borderColor: '#c084fc' }
                            },
                            '& .MuiInputLabel-root': { color: '#64748b' }
                        }} 
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                            onClick={() => setStep(2)} 
                            sx={{ 
                                color: '#94a3b8', 
                                fontWeight: 800,
                                borderRadius: '12px',
                                textTransform: 'none',
                                '&:hover': { color: 'white' }
                            }}
                        >
                            Back
                        </Button>
                        <Button  
                            fullWidth
                            variant="contained" 
                            onClick={handleGenerate} 
                            disabled={loading || !text.trim()}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
                            sx={{ 
                                borderRadius: '16px', 
                                background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)', 
                                color: '#fff', 
                                textTransform: 'none',
                                fontWeight: 900, 
                                fontSize: '1.05rem',
                                py: 2,
                                boxShadow: '0 10px 30px -5px rgba(192,132,252,0.5)',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 15px 35px -5px rgba(192,132,252,0.6)' },
                                '&.Mui-disabled': { background: '#1e293b', color: '#475569', boxShadow: 'none' }
                            }}
                        >
                        {loading ? 'AI IS THINKING...' : 'GENERATE MAGIC'}
                        </Button>
                    </Box>
                </Box>
            )}
          </Paper>
        </Grid>

        {quiz && (
          <Grid item xs={12} md={7}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: '24px', 
              bgcolor: 'rgba(255, 255, 255, 0.02)', 
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 50px -20px rgba(0,0,0,0.5)',
              maxHeight: '78vh',
              overflowY: 'auto',
              '&::-webkit-scrollbar': { width: '8px' },
              '&::-webkit-scrollbar-thumb': { background: 'linear-gradient(to bottom, #38bdf8, #c084fc)', borderRadius: 10 }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h5" sx={{ color: '#f8fafc', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: '12px', background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)', display: 'flex', boxShadow: '0 5px 15px rgba(192, 132, 252, 0.3)' }}>
                     <QuizIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  {quiz.title}
                </Typography>
                <Chip 
                    label={difficulty.toUpperCase()} 
                    sx={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        color: difficulty === 'hard' ? '#fb7185' : difficulty === 'medium' ? '#38bdf8' : '#4ade80', 
                        fontWeight: 900,
                        border: '1px solid rgba(255,255,255,0.1)',
                        px: 1,
                        fontSize: '0.75rem'
                    }} 
                />
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {quiz.questions.map((q, i) => (
                  <Box key={i} sx={{ 
                    p: 4, 
                    borderRadius: '24px', 
                    bgcolor: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255,255,255,0.1)' }
                  }}>
                    <Typography sx={{ color: '#312e81', fontWeight: 900, fontSize: '0.7rem', mb: 1, letterSpacing: 2, background: 'linear-gradient(90deg, #38bdf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>QUESTION {i+1}</Typography>
                    <Typography sx={{ color: '#f8fafc', fontWeight: 800, fontSize: '1.2rem', mb: 4, lineHeight: 1.6 }}>{q.question_text}</Typography>
                    
                    <Grid container spacing={2.5}>
                      {q.options.map((opt, j) => (
                        <Grid item xs={12} key={j}>
                          <Box 
                            onClick={() => !quizResult && setUserAnswers({...userAnswers, [i]: opt})}
                            sx={{ 
                              p: 2.5, 
                              borderRadius: '16px', 
                              background: userAnswers[i] === opt ? 'linear-gradient(90deg, rgba(56,189,248,0.2), rgba(192,132,252,0.2))' : 'rgba(255,255,255,0.02)', 
                              border: '1px solid',
                              borderColor: userAnswers[i] === opt ? '#38bdf8' : 'rgba(255,255,255,0.05)',
                              color: userAnswers[i] === opt ? 'white' : '#94a3b8',
                              fontSize: '1rem',
                              fontWeight: userAnswers[i] === opt ? 800 : 600,
                              cursor: quizResult ? 'default' : 'pointer',
                              '&:hover': { 
                                background: !quizResult && 'rgba(255, 255, 255, 0.05)', 
                                borderColor: !quizResult && 'rgba(255, 255, 255, 0.2)',
                                color: !quizResult && 'white',
                                transform: !quizResult && 'translateX(10px)'
                              },
                              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ 
                                    width: 28, height: 28, borderRadius: '50%', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    bgcolor: userAnswers[i] === opt ? '#38bdf8' : 'rgba(255,255,255,0.1)',
                                    color: userAnswers[i] === opt ? '#0f172a' : '#64748b',
                                    fontSize: '0.8rem', fontWeight: 900
                                }}>
                                    {String.fromCharCode(65 + j)}
                                </Box>
                                {opt}
                            </Box>
                            {quizResult && opt === q.correct_answer && (
                              <Chip label="CORRECT" size="small" sx={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#0f172a', fontWeight: 900, borderRadius: '8px', fontSize: '0.65rem' }} />
                            )}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Box>

              {!quizResult ? (
                <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(userAnswers).length < quiz.questions.length}
                    sx={{ 
                        mt: 6, 
                        borderRadius: '20px', 
                        py: 2.5,
                        background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', 
                        color: '#fff', 
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 15px 35px -5px rgba(56,189,248,0.5)',
                        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 20px 45px -5px rgba(56,189,248,0.6)' },
                        '&.Mui-disabled': { background: '#1e293b', color: '#475569', boxShadow: 'none' }
                    }}
                >
                    SUBMIT ANSWERS FOR GRADING
                </Button>
              ) : (
                <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Paper sx={{ p: 5, background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(56, 189, 248, 0.1) 100%)', borderRadius: '32px', textAlign: 'center', border: '1px solid rgba(74,222,128,0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                        <Typography sx={{ color: '#4ade80', fontWeight: 900, fontSize: '2.5rem', mb: 1 }}>
                            {quizResult.percentage.toFixed(0)}%
                        </Typography>
                        <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', mb: 2 }}>
                            Score: {quizResult.score} / {quiz.questions.length}
                        </Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 500 }}>Brilliant! Your progress has been synced to the database.</Typography>
                    </Paper>
                    <Button 
                        fullWidth 
                        variant="contained" 
                        onClick={handleSaveConfirmed}
                        sx={{ 
                            borderRadius: '20px', 
                            py: 2.5,
                            background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)', 
                            color: 'white', 
                            fontWeight: 900,
                            fontSize: '1.1rem',
                            textTransform: 'none',
                            boxShadow: '0 15px 35px -5px rgba(192,132,252,0.5)',
                            transition: 'all 0.3s',
                            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 20px 45px -5px rgba(192,132,252,0.6)' }
                        }}
                    >
                        COMPLETE & RETURN
                    </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>

      <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%', borderRadius: '16px', fontWeight: 800, bgcolor: '#064e3b', color: '#4ade80' }}>
          PERFORMANCE DATA SAVED SUCCESSFULLY!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QuizGenerator;

