const TodoTask = require('../models/TodoTask');
const { getIO } = require('../utils/socket');

const getTasks = async (req, res) => {
  try {
    const student_id = req.user.linked_id || req.user.id;
    const tasks = await TodoTask.find({ student_id }).populate('subject_id', 'subject_name');
    res.json(tasks);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const addTask = async (req, res) => {
  try {
    const { createNotification } = require('./notificationController');
    const Student = require('../models/Student');

    let studentId = req.user.linked_id;
    
    // Safely verify if a student record exists
    if (!studentId) {
      const student = await Student.findOne({ email: req.user.email });
      if (!student) {
        return res.status(404).json({ message: 'Student profile not found. Please contact support.' });
      }
      studentId = student._id;
    }

    const task = await TodoTask.create({ 
      title: req.body.title,
      description: req.body.description || '',
      subject_id: req.body.subject_id || null, // Added subject support
      student_id: studentId 
    });
    
    // Notify student of new goal
    try {
      await createNotification({
        student_id: studentId,
        title: 'New Goal Set',
        message: `Task added: ${task.title}`,
        type: 'task',
        read_status: false
      });
    } catch (e) { console.error('Notification failed but task saved'); }

    // Re-fetch to include population if needed
    const populatedTask = await TodoTask.findById(task._id).populate('subject_id', 'subject_name');
    getIO().emit('tasks_changed');
    res.status(201).json(populatedTask);
  } catch (error) { 
    console.error('SERVER TASK ERROR:', error);
    res.status(500).json({ message: 'Database error while saving task' }); 
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await TodoTask.findByIdAndUpdate(req.params.id, req.body, { new: true });
    getIO().emit('tasks_changed');
    res.json(task);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteTask = async (req, res) => {
  try {
    await TodoTask.findByIdAndDelete(req.params.id);
    getIO().emit('tasks_changed');
    res.json({ message: 'Task deleted successfully' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };
