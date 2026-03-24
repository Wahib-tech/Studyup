const express = require('express');
const router = express.Router();
const { getGrades, addGrade } = require('../controllers/gradeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getGrades);
router.post('/', protect, addGrade);

module.exports = router;
