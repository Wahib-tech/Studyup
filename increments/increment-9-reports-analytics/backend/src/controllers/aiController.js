const { generateQuizFromText } = require('../services/aiService');
const Quiz = require('../models/Quiz');
const Subject = require('../models/Subject');

const generateQuiz = async (req, res) => {
  const { text, subject_id, difficulty_level, question_count } = req.body;
  try {
    // Fetch subject name for better context
    const subject = await Subject.findById(subject_id);
    const subjectName = subject ? subject.subject_name : "General Education";

    const questions = await generateQuizFromText(text, subjectName, difficulty_level, question_count);
    const quiz = await Quiz.create({
      subject_id, 
      title: `${subjectName} AI Quiz`, 
      difficulty_level, 
      question_count,
      created_by: req.user.id,
      questions
    });
    res.status(201).json(quiz);
  } catch (error) { 
    console.error("Quiz Generation Error:", error.message);
    res.status(500).json({ message: error.message }); 
  }
};

module.exports = { generateQuiz };
