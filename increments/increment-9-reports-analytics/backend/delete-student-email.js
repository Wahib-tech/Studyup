const mongoose = require('mongoose');
const Student = require('./src/models/Student');
const dotenv = require('dotenv');

dotenv.config();

const deleteStudent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = process.argv[2];
        if (!email) {
            console.error('Please provide an email');
            process.exit(1);
        }
        const result = await Student.deleteOne({ email });
        if (result.deletedCount > 0) {
            console.log(`Student with email ${email} deleted successfully`);
        } else {
            console.log(`Student with email ${email} not found`);
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

deleteStudent();
