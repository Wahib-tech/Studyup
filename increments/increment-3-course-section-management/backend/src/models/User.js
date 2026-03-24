const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student', required: true },
  linked_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  is_verified: { type: Boolean, default: false },
  otp: { type: String },
  otp_expiry: { type: Date },
  last_login: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
