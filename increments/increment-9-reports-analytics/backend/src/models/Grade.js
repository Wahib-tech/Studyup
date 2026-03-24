const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  semester: { type: Number }, // Made optional
  academic_year: { type: String },
  marks_obtained: { type: Number, required: true },
  total_marks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  grade_letter: { type: String, required: true },
  grade_point: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);
