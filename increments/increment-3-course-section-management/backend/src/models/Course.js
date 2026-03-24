const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  course_name: { type: String, required: true, trim: true },
  course_code: { type: String, required: true, unique: true, uppercase: true },
  duration: { type: String }, 
  description: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
