const TodoTask = require('../models/TodoTask');

const getTasks = async (req, res) => {
  try {
    const tasks = await TodoTask.find({ student_id: req.user.linked_id || req.user.id });
    res.json(tasks);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const addTask = async (req, res) => {
  try {
    const task = await TodoTask.create({ ...req.body, student_id: req.user.linked_id || req.user.id });
    res.status(201).json(task);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateTask = async (req, res) => {
  try {
    const task = await TodoTask.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getTasks, addTask, updateTask };
