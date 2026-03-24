const Student = require('../models/Student');
const AcademicHistory = require('../models/AcademicHistory');

const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getStudentProfile = async (req, res) => {
  try {
    const Performance = require('../models/Performance');
    const student = await Student.findById(req.params.id)
      .populate('course_id')
      .populate('section_id');
    const history = await AcademicHistory.find({ student_id: req.params.id });
    const performances = await Performance.find({ student_id: req.params.id }).populate('quiz_id');
    res.json({ student, history, performances });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateStudentProfile = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getStudents, getStudentProfile, updateStudentProfile };
