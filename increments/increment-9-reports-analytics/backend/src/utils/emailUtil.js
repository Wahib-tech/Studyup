const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS
    }
  });

  const mailOptions = {
    from: `"StudyUp Support" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'StudyUp - Email Verification OTP',
    text: `Your OTP for email verification is: ${otp}. It will expire in 10 minutes.`,
    html: `<h3>StudyUp Verification</h3><p>Your OTP is: <b>${otp}</b></p><p>Expires in 10 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);
};

const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS
    }
  });

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;

  const mailOptions = {
    from: `"StudyUp Support" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'StudyUp - Password Reset Request',
    text: `You requested a password reset. Please click on the following link or copy it into your browser to complete the process: ${resetUrl}. If you did not request this, please ignore this email.`,
    html: `<h3>StudyUp Password Reset</h3><p>You requested a password reset. Click the button below to proceed:</p><a href="${resetUrl}" style="background:#6366f1;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;">Reset Password</a><p>Link expires in 1 hour.</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP, sendResetEmail };
