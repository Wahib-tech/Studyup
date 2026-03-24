const { generateQuizFromText } = require('../services/aiService');
const Quiz = require('../models/Quiz');

const generateQuiz = async (req, res) => {
  const { text, subject_id, title, difficulty_level, question_count } = req.body;
  try {
    const questions = await generateQuizFromText(text, title, difficulty_level, question_count);
    const quiz = await Quiz.create({
      subject_id, title, difficulty_level, question_count,
      created_by: req.user.id,
      questions
    });
    res.status(201).json(quiz);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { generateQuiz };
