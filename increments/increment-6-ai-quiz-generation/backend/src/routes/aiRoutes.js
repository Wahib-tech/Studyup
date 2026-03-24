const express = require('express');
const router = express.Router();
const { generateQuiz } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateQuiz);

module.exports = router;
