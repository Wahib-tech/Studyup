const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  course_name: { type: String, required: true, trim: true },
  course_code: { type: String, uppercase: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  duration: { type: String }, 
  description: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
