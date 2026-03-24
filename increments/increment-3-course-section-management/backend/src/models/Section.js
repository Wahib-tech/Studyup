const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  section_name: { type: String, required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { type: Number, required: true },
  academic_year: { type: String, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);
