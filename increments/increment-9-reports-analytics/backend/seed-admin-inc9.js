const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const adminExists = await User.findOne({ username: 'admin' });
        
        if (adminExists) {
            console.log('Admin user already exists:', adminExists.username);
            // Update password just in case
            const salt = await bcrypt.genSalt(10);
            adminExists.password_hash = await bcrypt.hash('Admin@123', salt);
            adminExists.is_verified = true;
            adminExists.status = 'active';
            await adminExists.save();
            console.log('Admin user updated successfully');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Admin@123', salt);
            
            await User.create({
                username: 'admin',
                email: 'admin@studyup.com',
                password_hash: hashedPassword,
                role: 'admin',
                is_verified: true,
                status: 'active'
            });
            console.log('Admin user created successfully');
        }
        console.log('Username: admin');
        console.log('Password: Admin@123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
