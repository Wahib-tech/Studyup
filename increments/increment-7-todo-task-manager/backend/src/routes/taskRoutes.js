const express = require('express');
const router = express.Router();
const { getTasks, addTask, updateTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTasks);
router.post('/', protect, addTask);
router.put('/:id', protect, updateTask);

module.exports = router;
