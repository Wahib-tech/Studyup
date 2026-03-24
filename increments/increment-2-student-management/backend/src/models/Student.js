const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  section_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  profile_image: { type: String, default: '' },
  status: { type: String, enum: ['active', 'graduated', 'dropped'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
