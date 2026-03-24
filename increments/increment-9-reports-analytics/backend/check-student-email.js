const mongoose = require('mongoose');
const Student = require('./src/models/Student');
const dotenv = require('dotenv');

dotenv.config();

const checkStudent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = process.argv[2];
        if (!email) {
            console.error('Please provide an email');
            process.exit(1);
        }
        const student = await Student.findOne({ email });
        if (student) {
            console.log(`Student found: ${student.first_name} ${student.last_name}`);
            console.log(`Email: ${student.email}`);
            console.log(`ID: ${student._id}`);
        } else {
            console.log(`Student with email ${email} not found`);
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkStudent();
