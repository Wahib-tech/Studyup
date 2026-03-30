const mongoose = require('mongoose');

const todoTaskSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  title: { type: String, required: true },
  description: { type: String },
  due_date: { type: Date },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('TodoTask', todoTaskSchema);
