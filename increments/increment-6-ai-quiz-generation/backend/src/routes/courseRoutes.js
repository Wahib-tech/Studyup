const express = require('express');
const router = express.Router();
const { getCourses, createCourse, getSections, createSection } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/courses', protect, getCourses);
router.post('/courses', protect, createCourse);
router.get('/sections', protect, getSections);
router.post('/sections', protect, createSection);

module.exports = router;
