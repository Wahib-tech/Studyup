const Quiz = require('../models/Quiz');
const Performance = require('../models/Performance');

const getQuizzes = async (req, res) => {
  try {
    const query = { created_by: req.user.id };
    if (req.query.subject_id) query.subject_id = req.query.subject_id;
    const quizzes = await Quiz.find(query);
    res.json(quizzes);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const submitQuiz = async (req, res) => {
  const { quiz_id, score, total_questions } = req.body;
  try {
    const performance = await Performance.create({
      student_id: req.user.linked_id || req.user.id, // Fallback if no student linked
      quiz_id, score, total_questions,
      percentage: (score / total_questions) * 100
    });
    res.status(201).json(performance);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getQuizzes, submitQuiz };
