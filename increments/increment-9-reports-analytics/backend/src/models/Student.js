const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  section_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  profile_image: { type: String, default: '' },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
  date_of_birth: { type: Date },
  status: { type: String, enum: ['active', 'graduated', 'dropped'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
