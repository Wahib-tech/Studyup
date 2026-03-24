const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const username = process.argv[2] || 'admin';
        const user = await User.findOne({ username });
        if (user) {
            console.log(`User found: ${user.username}`);
            console.log(`Role: ${user.role}`);
            console.log(`Verified: ${user.is_verified}`);
        } else {
            console.log(`User ${username} not found`);
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUser();
