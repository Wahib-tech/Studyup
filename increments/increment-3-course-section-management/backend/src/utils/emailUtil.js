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

module.exports = { sendOTP };
