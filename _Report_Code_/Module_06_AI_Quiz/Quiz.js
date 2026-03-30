const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question_text: { type: String, required: true },
  question_type: { type: String, enum: ['MCQ', 'True/False', 'Fill-in-the-Blank', 'Short-Answer'], required: true },
  options: [{ type: String }],
  correct_answer: { type: String, required: true },
  explanation: { type: String }
});

const quizSchema = new mongoose.Schema({
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  difficulty_level: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  question_count: { type: Number, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
