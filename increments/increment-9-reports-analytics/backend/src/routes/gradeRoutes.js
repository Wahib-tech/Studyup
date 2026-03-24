const express = require('express');
const router = express.Router();
const { getGrades, addGrade, updateGrade } = require('../controllers/gradeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getGrades);
router.post('/', protect, addGrade);
router.put('/:id', protect, updateGrade);

module.exports = router;
