const Grade = require('../models/Grade');
const AcademicHistory = require('../models/AcademicHistory');

const getGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ student_id: req.user._id }).populate('subject_id');
    res.json(grades);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const addGrade = async (req, res) => {
  try {
    const { subject_id, marks_obtained, total_marks, semester } = req.body;
    let percentage = 0;
    if (total_marks > 0) {
        percentage = (marks_obtained / total_marks) * 100;
    }
    
    let grade_letter = 'F';
    if (percentage >= 90) grade_letter = 'A+';
    else if (percentage >= 80) grade_letter = 'A';
    else if (percentage >= 70) grade_letter = 'B';
    else if (percentage >= 60) grade_letter = 'C';
    else if (percentage >= 50) grade_letter = 'D';

    const grade = await Grade.create({
      student_id: req.user._id,
      subject_id,
      marks_obtained,
      total_marks,
      percentage: parseFloat(percentage.toFixed(2)),
      grade_letter,
      semester
    });
    // Populate subject_id for frontend to use immediately
    await grade.populate('subject_id');
    res.status(201).json(grade);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateGrade = async (req, res) => {
  try {
    const { marks_obtained, total_marks, semester, subject_id } = req.body;
    let percentage = 0;
    if (total_marks > 0) percentage = (marks_obtained / total_marks) * 100;

    let grade_letter = 'F';
    if (percentage >= 90) grade_letter = 'A+';
    else if (percentage >= 80) grade_letter = 'A';
    else if (percentage >= 70) grade_letter = 'B';
    else if (percentage >= 60) grade_letter = 'C';
    else if (percentage >= 50) grade_letter = 'D';

    const updated = await Grade.findOneAndUpdate(
        { _id: req.params.id, student_id: req.user._id },
        { 
            marks_obtained, 
            total_marks, 
            semester, 
            subject_id,
            percentage: parseFloat(percentage.toFixed(2)), 
            grade_letter 
        },
        { new: true }
    ).populate('subject_id');
    
    if (!updated) return res.status(404).json({ message: 'Grade not found' });
    res.json(updated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getGrades, addGrade, updateGrade };
