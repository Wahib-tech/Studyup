const Grade = require('../models/Grade');
const AcademicHistory = require('../models/AcademicHistory');

const getGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ student_id: req.query.student_id }).populate('subject_id');
    res.json(grades);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const addGrade = async (req, res) => {
  try {
    const grade = await Grade.create(req.body);
    res.status(201).json(grade);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getGrades, addGrade };
