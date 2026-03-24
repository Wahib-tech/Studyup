const Subject = require('../models/Subject');

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('course_id');
    res.json(subjects);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getSubjects, createSubject };
