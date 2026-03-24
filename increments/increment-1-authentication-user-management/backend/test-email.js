const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: 'd:/IGNOU PROJECT/StudyUp/increments/increment-1-authentication-user-management/backend/.env' });

const testMail = async () => {
    console.log('Testing email with:');
    console.log('User:', process.env.GMAIL_USER);
    console.log('Pass length:', process.env.GMAIL_APP_PASS ? process.env.GMAIL_APP_PASS.length : 0);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASS
        }
    });

    try {
        await transporter.verify();
        console.log('Transporter verified successfully!');
        
        const info = await transporter.sendMail({
            from: `"StudyUp Test" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER, // Send to self
            subject: 'StudyUp Test Mail',
            text: 'If you receive this, your email configuration is correct.'
        });
        console.log('Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Test Failed!');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        console.error('Error Code:', error.code);
        if (error.response) console.error('Error Response:', error.response);
    }
};

testMail();
