const express = require('express');
const router = express.Router();
const { getQuizzes, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getQuizzes);
router.post('/submit', protect, submitQuiz);

module.exports = router;
