const mongoose = require('mongoose');

const academicHistorySchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  semester: { type: Number, required: true },
  academic_year: { type: String, required: true },
  sgpa: { type: Number, required: true },
  cgpa: { type: Number, required: true },
  status: { type: String, enum: ['Pass', 'Fail', 'Promoted'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('AcademicHistory', academicHistorySchema);
