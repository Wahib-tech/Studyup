const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  section_name: { type: String, required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  semester: { type: Number },
  academic_year: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);
