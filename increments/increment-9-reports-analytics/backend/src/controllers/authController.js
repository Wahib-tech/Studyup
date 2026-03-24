const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendOTP, sendResetEmail } = require('../utils/emailUtil');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  console.log('Register request received for:', req.body.email);
  const { username, email, password, role, first_name, last_name } = req.body;
  if (!username || !email || !password || !first_name || !last_name) {
    return res.status(400).json({ message: 'All fields are required (Username, Email, Password, First & Last Name)' });
  }

  try {
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists with this email' });
    if (await User.findOne({ username })) return res.status(400).json({ message: 'Username is already taken' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({ 
      username, 
      email, 
      password_hash: hashedPassword, 
      role: role || 'student',
      otp,
      otp_expiry
    });

    if (user && user.role === 'student') {
      let student = await Student.findOne({ email });
      if (!student) {
        student = await Student.create({ first_name, last_name, email });
      }
      user.linked_id = student._id;
      await user.save();
    }

    let emailSent = true;
    try {
      await sendOTP(email, otp);
    } catch (err) {
      console.error('Email sending failed. Reason:', err.message);
      emailSent = false;
    }

    const response = { 
      message: emailSent 
        ? 'Registration successful. Please check your email for OTP.' 
        : 'Registration successful. OTP could not be emailed.', 
      email 
    };
    if (!emailSent) response.otp = otp;
    res.status(201).json(response);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.is_verified) return res.status(400).json({ message: 'User already verified' });
    if (user.otp === otp && user.otp_expiry > Date.now()) {
      user.is_verified = true;
      user.otp = undefined;
      user.otp_expiry = undefined;
      await user.save();
      res.json({ message: 'Email verified successfully', token: generateToken(user._id) });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ username }, { email: username }] });
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      if (!user.is_verified) return res.status(401).json({ message: 'Please verify your email first', email: user.email });
      res.json({ 
        _id: user.id, 
        username: user.username, 
        role: user.role, 
        linked_id: user.linked_id,
        token: generateToken(user._id) 
      });
    } else res.status(400).json({ message: 'Invalid credentials' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.is_verified) return res.status(400).json({ message: 'User already verified' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otp_expiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    let emailSent = true;
    try {
      await sendOTP(email, otp);
    } catch (err) {
      console.error('Email sending failed. LOGGING OTP TO CONSOLE FOR DEVELOPMENT:');
      console.log('---------------------------------');
      console.log(`NEW OTP for ${email}: ${otp}`);
      console.log('---------------------------------');
      emailSent = false;
    }

    res.json({ 
      message: emailSent 
        ? 'A new OTP has been sent to your email.' 
        : 'New OTP generated. (Development Mode: OTP logged to server console)' 
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found with this email' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    let emailSent = true;
    try {
      await sendResetEmail(email, resetToken);
    } catch (err) {
      console.error('Reset email failed. LOGGING TOKEN FOR DEV:', resetToken);
      emailSent = false;
    }

    res.json({ message: emailSent ? 'Password reset link sent to email' : 'Reset link generated (Dev: Check console)' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now login.' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { registerUser, loginUser, verifyOTP, resendOTP, forgotPassword, resetPassword };

