const express = require('express');
const router = express.Router();
const { getSubjects, createSubject } = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSubjects);
router.post('/', protect, createSubject);

module.exports = router;
