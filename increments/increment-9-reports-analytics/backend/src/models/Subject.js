const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subject_name: { type: String, required: true },
  subject_code: { type: String, uppercase: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Optional for older subjects
  semester: { type: Number },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
