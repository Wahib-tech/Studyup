const express = require('express');
const router = express.Router();
const { 
  getCourses, createCourse, getSections, createSection,
  deleteCourse, deleteSection 
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCourses);
router.post('/', protect, createCourse);
router.delete('/:id', protect, deleteCourse);
router.get('/sections', protect, getSections);
router.post('/sections', protect, createSection);
router.delete('/sections/:id', protect, deleteSection);

module.exports = router;
