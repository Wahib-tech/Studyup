const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subject_name: { type: String, required: true },
  subject_code: { type: String, required: true, unique: true, uppercase: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { type: Number, required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
