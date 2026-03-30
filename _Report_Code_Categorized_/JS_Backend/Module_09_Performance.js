const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  total_questions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  attempt_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);
