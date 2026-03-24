const express = require('express');
const router = express.Router();
const { getStudents, getStudentProfile, updateStudentProfile } = require('../controllers/studentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getStudents);
router.get('/:id', protect, getStudentProfile);
router.put('/:id', protect, updateStudentProfile);

module.exports = router;
